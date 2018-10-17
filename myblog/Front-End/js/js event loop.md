## 繁复复杂的Event loop
在学习javascript的Event loop时，通常会遇到`task`、`asynchronous`、`microtasks`、`runtime`、`message queue`等等一系列概念，本文将针对浏览器端的Event loop做出整理，一一拨开这些概念的“谜团”。

## javascript 运行时概念
首先是javascript运行时的状态表述，现代javascript引擎实现了类似于下图的模型，包含栈(`Stack`)、堆(`Heap`)、队列(`callback Queue/下文也会称之为task队列`)、`WebAPI`等机制：  

参考（[Philip Reberts](https://www.youtube.com/watch?time_continue=1610&v=8aGhZQkoFbQ)）演讲演示文档中的一张图：  

![js_engine_model](https://github.com/jkhhuse/imgRepo/blob/master/img%20lib/event_loop.png?raw=true)

#### 栈(Stack)
首先是栈结构，函数调用会形成一个栈帧，以“后进先出”的顺序执行，例如一段函数：
```js
function foo(b) {
  var a = 10;
  return a + b + 11;
}

function bar(x) {
  var y = 3;
  return foo(x * y);
}

console.log(bar(7));
```
调用`bar`时，创建了第一个帧，帧中包含了bar的参数和局部变量，压入栈的底部。当`bar`调用`foo`时，第二个帧会被创建，并压入栈中第一个帧之上。执行完后则会弹出栈，直至栈为空。这样一系列函数调用形成的栈的形式大致如下：  

![js_engine_model](https://github.com/jkhhuse/imgRepo/blob/master/img%20lib/js_stack.png?raw=true)

#### 堆(Stack)
对象被分配在一个堆中，用以表示一个大部分非结构化的内存区域。

#### `task`任务队列(Queue)
这个队列包含了javascript运行过程中待处理的任务，也可以称之为“`task`任务队列”，在Event loop的某个时刻，任务队列中的函数会以先进先出的方式被移出队列，创建栈帧，并当**栈为空**时压入栈底部。

#### Web APIs
通常指浏览器提供的能力，也可以把它理解为异步事件，例如`SetTimeout`、`DOM option`，如`click`事件、`XHR`等。当js程序处理异步调用时，会执行异步调用，异步调用结束后，则把回调函数添加到`task`任务队列中。

javascript是一个单线程语言，在处理类似上一个代码片段时，函数顺序压入栈中执行。那么遇到异步任务时，函数执行不可能陷入停顿，等待异步任务执行完毕后再继续执行。处理这种情况的技术正是Event loop机制。

所以，Event loop是一个持续处理的过程，用于判断栈中是否为空，如果栈为空，那么从`task`任务队列中获取一个任务放入栈中执行。

## 事件循环示例

首先，先想一下下面程序的运行过程：
```js
console.log("Hi!");

setTimeout(function timeout() {
    console.log("Click the button!");
}, 5000);

console.log("Welcome to loupe.");
```

依据之前的解释，函数被调用执行，以栈帧的方式压入栈中执行。异步调用进入`Web APIs`中执行，执行结束后回调函数进行任务队列。当栈为空时，从`task`任务队列中取出第一个函数，压入栈中执行，周而复始，直至队列为空。

得出的结果即为：
```js
Hi
Welcome to loupe.
Click the button!
```

那么，为了验证这个过程，可以使用[Philip Reberts](https://github.com/latentflip/loupe)写的工具来验证，它可视化模拟javascript事件循环的工具。

![js_engine_model](https://github.com/jkhhuse/imgRepo/blob/master/img%20lib/event_loop_demo1.gif?raw=true)


#### 思考一下setTimeout(fn,0)？

在日常编程中，经常会遇到`setTimeout(fn, ms)`这样的黑魔法，使用的时候只是简单的理解为提前到某个时间去执行，如果`ms`为`0`呢？是否是立即执行呢？在理解事件循环机制之前，确实有这样的困扰。

其实，`setTimeout(fn, 0)`与其他`setTimeout`执行过程相同，它在执行时，会在`0ms`（不过通常情况下，不会是0ms，会有一定的延迟，例如chrome下是4ms等）后将`fn`加入到任务队列之中，当栈为空时，执行`fn`。那么`setTimeout(fn, 0)`的作用是：**在下一个执行周期开始时，且栈为空时，执行该函数**。

#### setTimeout(fn, 0)的用途

`setTimeout(fn, 0)`的存在并不是扰乱大家的视线，它在某些场景下确实有其用武之地，但是不建议滥用它，否则你的程序的维护性会大大降低。

- 调整事件的发生顺序

在浏览器端开发网页应用时，事件会由最具体的元素逐级向上冒泡，参考如下示例，`input click`事件会冒泡到body节点，从而也会触发`body.onclick`事件，如果没有`setTimeout`，那么执行结果为：
```js
button中的value变化
buton -> input -> body
```

```js
<input type="button" value="buton"/>

------------------

var input = document.getElementsByTagName('input')[0];

input.onclick = function inputClick() {
  //setTimeout(function defer() {
    input.value = 'input';
  //}, 0)
};

document.body.onclick = function C() {
  input.value = 'body'
};
```

如果用户想要先执行`body click`，那么则在`input click`事件中添加`setTimeout`，把它放到任务队列中，在下一次执行周期中再去执行它。

- 响应优化

当用户在页面渲染的过程中，存在一个耗时的渲染流程，那么页面渲染会在这个阶段停留很久，从而阻碍页面继续渲染，通过`setTimeout`把这个耗时流程延后执行，则一定程度上可以改善页面渲染的速度。

## 微任务(microtasks)概念

考虑一下以下代码的执行顺序：
```js
console.log('script start');

setTimeout(function timer() {
  console.log('setTimeout');
}, 0);

new Promise(function(resolve, reject) {
  console.log('promise');
  resolve();
}).then(function() {
   console.log('then');
});

console.log('script end');
```

这段代码的执行结果为：
```js
script start
promise
script end
then
setTimeout
```

这样的执行结果可能与预想的有些出入，产生疑问的地方主要是`Promise`执行顺序。

其实，隐藏在背后的的原因就是，事件循环中的`microtask`，的确，js运行时环境中除了`task`队列外，还存在着一个`microtask`队列。

`task`和`MicroTask`分别对应的行为是：
- `task`：XHR、setTimeout/setinterval/setImmediate、requestAnimationFrame、UI交互事件等
- `microtask`: Promise、process.nextTick、Object.observe（已废弃）、MutationObserver等

因而带有`microtask`队列的Event loop的运行机制如下图所示：

![microtask](https://github.com/jkhhuse/imgRepo/blob/master/img%20lib/microtask.png?raw=true)

微任务的执行流程为：
- 首先把当前执行周期的函数推入栈中，在周期内，把当前周期不同任务分别推入`task`队列和`microtask`队列中
- 判断栈为空时，执行当前周期内的`task`任务
- 判断当前`task`任务执行完毕，执行`microtask`任务
- 进入下一个执行周期，依此循环直至执行流程结束

执行流程用伪代码表示如下:
```js
while (eventLoop.waitForTask()) {
  const taskQueue = eventLoop.selectTaskQueue();
  while (taskQueue.hasNextTask()) {
    taskQueue.processNextTask();
  }
  const microtaskQueue = eventLoop.microTaskQueue;
  while (microtaskQueue.hasNextMicrotask()) {
    microtaskQueue.processNextMicrotask();
  }
}
```

回到本节开头的示例，套用微任务执行流程：

1. 整体`script`作为第一个`task`任务执行，执行输出`script start`
2. `setTimeout`，进入`task`队列
3. `Promise`直接执行，输出`promise`，`then()`进入`microtask`任务队列
4. 执行输出`script end`
5. 本轮`task`任务执行完毕
6. 执行`microtask`任务，输出`then`
7. 结束本轮执行周期
8. 判断栈为空，从`task`队列中，移入`timer()`函数至栈中执行，输出`setTimeout`
9. 执行结束

## 说明
本篇文章参考和总结了一些互联网中的优秀的介绍事件循环的资料，在文末中列举了这些引用，读者若有不明白的地方可以直接参考这些一手资料得到更确切的表述。此外本篇文章也是本人学习`Event loop`概念的一个总结，因个人理解以及水平限制，文中难免会存在表述错误的地方，望给予指正。

最后，文中介绍的事件循环机制只是`brower`端的情况，`javascript`世界涉及的事件循环不止于此，例如服务端的`nodejs`执行环境的事件循环机制，以及`html5`提出的`web worker`标准之后，`javascript`就不再仅仅是单线程运行了，事件机制也与本文介绍的情况不尽相同，后续将继续学习、探究这些内容。

## 参考/引用
> [js并发模型及事件循环](https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop)  
> [Philip Roberts早期分享的Event loop内容](https://vimeo.com/96425312)  
> [针对Philip Roberts分享内容的总结](https://medium.com/@gaurav.pandvia/understanding-javascript-function-executions-tasks-event-loop-call-stack-more-part-1-5683dea1f5ec)  
> [microtask介绍](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/)  
> [轻快愉悦的Event loop介绍](https://juejin.im/post/59e85eebf265da430d571f89/)  
> [你所不知道的setTimeout](https://jeffjade.com/2016/01/10/2016-01-10-javacript-setTimeout/)  
