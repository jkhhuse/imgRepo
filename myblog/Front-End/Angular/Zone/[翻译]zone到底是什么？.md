> 本文翻译自：I reverse-engineered Zones (zone.js) and here is what I’ve found

Zones是一个新的机制，它能够帮助开发者处理多个逻辑连接的异步操作。Zones把每个区域中的异步操作连接起来，开发者可以用它来做以下事情：
- 把一些数据关联到zone中，类似于某些语言中的本地线程存储(`Thread-local storage`)，这样可以实现访问发生在当前zone中的任何异步操作。
- 在给定的`zone`中自动地追踪未完成的异步操作，以方便地做出清理、渲染、测试等工作
- 分析运行在当前zone中的运行时间
- 采集发生在zone中的所有未捕获的异常或者promise的reject，让它们冒泡到最上层

大部分网上讲Zone的文章中，提及的API都已过时，而且都讲的比较浅显，因此本文作者使用最新的API来讲解Zone，并且更加贴近zone的实现。本文首先将描述API的使用，随后展示其异步任务的处理机制，例如其拦截钩子机制。文章最后解释Zones在钩子机制下的工作原理。

Zones当前处在es标准的 stage 0 提案阶段，不过在Node.js中的实现中被阻塞而一直停留在该阶段。不过目前提到Zone，通常都是指`zone.js`，它在github中的地址为：[zone.js](https://github.com/angular/zone.js)。本文中，仍以规范中的`Zones`名称来指代`zone.js`。


## Zone API

首先看下`Zones`运行相关的方法：
```ts
class Zone {
  constructor(parent: Zone, zoneSpec: ZoneSpec);
  static get current();
  get name();
  get parent();

  fork(zoneSpec: ZoneSpec);
  run(callback, applyThis, applyArgs, source);
  runGuarded(callback, applyThis, applyArgs, source);
  wrap(callback, source);
}
```

`Zones`中有一个关键的概念：`current zone`，`current zone`是所有异步操作传播的上下文环境。它代表与正在执行的栈帧(`stack frame`)或异步任务相关联的区域。`current zone`可以通过`Zone.current`静态方法获取。

每个`Zone`都有一个名称，它被用在工具链或者调试中，在`Zone`中还定义了一些方法：
- `z.run`，在给定的`zone`中同步地调用一个函数，在执行`callback`函数时，它设置`current zone`为`z`。此外，当回调函数执行完毕时，它会重新设置回原来的值。在zone中执行一个回调函数，类似于进入到一个`zone`中。
- `z.runGuarded`，与`run`方法类似，但是它能够捕捉运行时的错误，并且提供了一个拦截他们的方式。如果错误没有在父`Zone`中被处理，那么它会重新抛出错误。
- `z.wrap` 生成一个新函数，保存`z`在闭包中，在执行`wrap`时执行`z.runGuarded`函数。如果回调函数后续传递给`other.run(callback)`，它仍然在`z zone`中执行，而非`other`。这个机制类似于js中`Function.prototype.bind`的用法。

`fork`方法将在下一节的末尾讲，`Zone`除了上述方法之外还有一系列方法来控制运行、编排(scheduling)和取消任务：
```ts
class Zone {
  runTask(...);
  scheduleTask(...);
  scheduleMicroTask(...);
  scheduleMacroTask(...);
  scheduleEventTask(...);
  cancelTask(...);
```

这些方法都是低级别的方法，它们很少被开发者直接使用，本文将不作过多介绍。编排一个任务是`Zone`的一个内部操作，对开发者来说，它通常意味着一些异步的操作，例如`setTimeout`。


## 在调用堆栈中保存`zone`

javascript VM 在它自身的栈帧中来执行函数，如果你有下面一段代码：
```js
function c() {
    // capturing stack trace
    try {
        new Function('throw new Error()')();
    } catch (e) {
        console.log(e.stack);
    }
}

function b() { c() }
function a() { b() }

a();
```

在`c`函数中，它有下面调用栈：
```js
at c (index.js:3)
at b (index.js:10)
at a (index.js:14)
at index.js:17
```

调用栈使用图例表示如下：
![zone1-callstack](https://github.com/jkhhuse/imgRepo/blob/master/img%20lib/zone1-callstack.png?raw=true)

在函数调用过程中，我们有3个栈帧，还有一个global上下文。

在常规的js环境中，`c`函数栈帧不会与`a`栈帧中的函数有任何关联。`Zone`运行我们使用一个特殊的`zone`来关联每个栈帧。例如，我们可以关联`a`和`c`栈帧到一个相同的`zone`中。如下图所示：

![zone1-assosiate1](https://github.com/jkhhuse/imgRepo/blob/master/img%20lib/zone1-assosiate1.png?raw=true)


## 使用`zone.fork`来创建一个子`zone`

`Zones`中使用最多的特性是使用`fork`方法来创建一个新的`zone`，`forking zone`可以创建一个新的`child zone`，并且这个`child zone`的`parent`被设置为当前`zone`：
```js
const c = z.fork({name: 'c'});
console.log(c.parent === z); // true
```

`fork`方法背后的细节是简单地创建了一个新的`zone`：
```js
new Zone(targetZone, zoneSpec);
```

为了完成上文提到的关联`a`与`c`函数到相同的`zone`中，我们首先需要创建这个`zone`，即使用`fork`方法：
```js
const zoneAC = Zone.current.fork({name: 'AC'});
```

传递给`fork`方法的对象，我们称之为`zoneSpec`(`Zone`规范)，它具有下述属性：
```ts
interface ZoneSpec {
    name: string;
    properties?: { [key: string]: any };
    onFork?: ( ... );
    onIntercept?: ( ... );
    onInvoke?: ( ... );
    onHandleError?: ( ... );
    onScheduleTask?: ( ... );
    onInvokeTask?: ( ... );
    onCancelTask?: ( ... );
    onHasTask?: ( ... );
```

`name`定义了`zone`的名称，`properties`用于把数据关联到`zone`中，其他属性都是拦截钩子，允许`parent zone`拦截`child zone`中的指定操作。理解`forking`创建的`zones`层次关系非常重要，所有`Zone`类中操作`zones`的方法都能够被`parent zone`使用钩子拦截。文章的下文将会举例使用`properties`来共享异步操作和钩子之间数据，从而实现任务追踪。

下面我们再创建一个`child zone`：
```js
const zoneB = Zone.current.fork({name: 'B'});
```

现在我们拥有两个`zone`，我们能够使用`zone.run()`方法，让它们在一个特殊的`zone`中执行函数。

## 使用`zone.run()`实现切换`zones`

为了使特定的栈帧与`zone`关联，我们需要使用`run`方法在`zone`中运行这个函数。就像上文介绍的那样，它在指定的`zone`中运行了回调函数，在完成后，它恢复了`zone`。

让我们应用这些知识，并且稍微改变一下我们的样例：
```js
function c() {
    console.log(Zone.current.name);  // AC
}
function b() {
    console.log(Zone.current.name);  // B
    zoneAC.run(c);
}
function a() {
    console.log(Zone.current.name);  // AC
    zoneB.run(b);
}
zoneAC.run(a);
```

现在每个调用栈都关联了一个`zone`：

![zone-assosiate2.png](https://github.com/jkhhuse/imgRepo/blob/master/img%20lib/zone-assosiate2.png?raw=true)

上面代码中，我们使用`run`方法执行了每个函数，并且直接为函数指定了`zone`。你可能会思考，如果我们不适用`run`方法会发生什么，仅仅是在`zone`中执行函数吗？

你需要理解：*所有的函数调用和函数中的异步任务，将会和这个函数一样在相同的`zone`中执行*。

我们知道`zones`环境通常拥有一个`root Zone`，如果我们没有使用`zone.run`来切换`zone`，那么所有函数都将在`root zone`中执行。例如：

```js
function c() {
    console.log(Zone.current.name);  // <root>
}
function b() {
    console.log(Zone.current.name);  // <root>
    c();
}
function a() {
    console.log(Zone.current.name);  // <root>
    b();
}
a();
```

它的执行环境如下：

![zone-assosiate3.png](https://github.com/jkhhuse/imgRepo/blob/master/img%20lib/zone-assosiate3.png?raw=true)

如果我们只在`a`函数中使用`zoneAB.run`，那么`b`和`c`函数将在`AB`的`zone`中执行：

```js
const zoneAB = Zone.current.fork({name: 'AB'});

function c() {
    console.log(Zone.current.name);  // AB
}

function b() {
    console.log(Zone.current.name);  // AB
    c();
}

function a() {
    console.log(Zone.current.name);  // <root>
    zoneAB.run(b);
}

a();
```

![zone-assosiate4.png](https://github.com/jkhhuse/imgRepo/blob/master/img%20lib/zone-assosiate4.png?raw=true)

你可以看到我们在`AB zone`中调用`b`函数，`c`函数也在这个`zone`中执行了。


## 在异步任务中保存`zone`

javascript语言的一个显著特征就是它的异步编程，大部分javascript开发者都会熟悉`setTimeout`方法，它允许一个函数延后执行。在`Zone`中`setTimeout`异步操作表示为一个任务，称之为宏任务（`macrotask`）。

下面将展示一下`Zone`中是如何`setTimeout`这样的异步任务，为了演示，我们把上面的示例代码稍做修改，在函数调用中加入`setTimeout`函数，模拟出异步调用：

```js
const zoneBC = Zone.current.fork({name: 'BC'});

function c() {
    console.log(Zone.current.name);  // BC
}

function b() {
    console.log(Zone.current.name);  // BC
    setTimeout(c, 2000);
}

function a() {
    console.log(Zone.current.name);  // <root>
    zoneBC.run(b);
}

a();
```

我们已经知道，如果我们在`zone`中调用一个函数，那么这个函数也会在相同的`zone`中执行。这个行为对包含有异步操作的函数具有同样的效果。如果我们定义一个异步任务，并且指定一个回调函数，那么这个函数也将会在相同的`zone`下执行。

函数调用过程可以表示为：

![zone-assosiate5.png](https://github.com/jkhhuse/imgRepo/blob/master/img%20lib/zone-assosiate5.png?raw=true)

这很棒，但是这个图隐藏了一个重要的实现细节：`zone`需要为每个要执行的任务恢复到正确的`zone`。因此，需要记住将要执行的任务运行的`zone`，并且保存与这个任务有关联的引用。然后这个`zone`用于去调用一个在`root zone`中处理的任务。

这意味着每个异步任务通常在`root zone`中开始，并且使用保存的信息来恢复这个任务到正确的`zone`，随后执行任务。所以更正确的表示应该是这样：

![zone-assosiate6.png](https://github.com/jkhhuse/imgRepo/blob/master/img%20lib/zone-assosiate6.png?raw=true)


## 在异步任务中传播上下文

`Zone`中有几个有趣的功能，开发人员可以利用它们。其中一个是`context propagation(上下文传播)`，它可以理解为：我们可以把数据放入一个`zone`中，并且可以在`zone`中运行的函数中访问到这个数据。

下面将演示我们如何在`setTimeout`异步任务中访问到我们保存的数据，之前我们了解过`zoneSpec`对象，这个对象有一个`properties`属性，我们可以它来做到在`zone`中交互数据：

```js
const zoneBC = Zone.current.fork({
    name: 'BC',
    properties: {
        data: 'initial'
    }
});
```

首先创建一个`zoneBC zone`，设置了它的`properties.data`，它能够被`zone.get`方法访问到：

```js
function a() {
    console.log(Zone.current.get('data')); // 'initial'
}

function b() {
    console.log(Zone.current.get('data')); // 'initial'
    setTimeout(a, 2000);
}

zoneBC.run(b);
```

对象中的`properties`属性为浅不可变性`shallow-immutable`，即不可以添加或删除对象中的属性。这很大可能是因为`Zone`没有提供这样的方法。所以对于上面的代码样例，我们是无法重新赋值`properties.data`的。

不过我们可以传递一个对象到`properties.data`来代替原始的对象，通过这种方式来变更`properties.data`数据：
```js
const zoneBC = Zone.current.fork({
    name: 'BC',
    properties: {
        data: {
            value: 'initial'
        }
    }
});

function a() {
    console.log(Zone.current.get('data').value); // 'updated'
}

function b() {
    console.log(Zone.current.get('data').value); // 'initial'
    Zone.current.get('data').value = 'updated';
    setTimeout(a, 2000);
}

zoneBC.run(b);
```

另外一个有趣的地方是：使用`fork`方法创建的`child zone`，其属性从`parent zones`中继承：

```js
const parent = Zone.current.fork({
    name: 'parent',
    properties: { data: 'data from parent' }
});

const child = parent.fork({name: 'child'});

child.run(() => {
    console.log(Zone.current.name); // 'child'
    console.log(Zone.current.get('data')); // 'data from parent'
});
```


## 跟踪未完成的任务

`zone`的一个有趣的能力经常被用来追踪未完成的异步宏任务和微任务，`zone`把所有未完成的任务放到队列中，使用`onHasTask`钩子观察队列状态是否改变。下面是对应的信号量（`signature`）：

```ts
onHasTask(delegate, currentZone, targetZone, hasTaskState);
```

因为`parent zones`能够拦截`child zones`的事件，`Zone`提供了`currentZone`和`targetZone`参数来辨别

