先看一段代码：

> const pipeLine = (...fns) => arg => fns.reduce((p, f) => f(p), arg)
>
> pipeLine(x => x+1, x => x+2)(0)

当我初次接触此代码时，很难准确理解其含义，主要是因为对一些函数式编程及es6中的一些用法没能真正理解。本文是对相关概念的一次梳理，逐步解释此行代码的涵义及用途，在最终解释这段代码之前，先要理解箭头函数、柯里化和reduce的用法。

#### 箭头函数

pipeLine代码中出现了很多的箭头函数，箭头函数是es6中定义函数的一种方式，例如：

```js
var f = fucntion(v){
    return v;
}
```

可以使用es6语法简化为：

```js
var f = v => v;
```

箭头函数是常见的用法，不过在本例中，需要注意的是隐式`return`的用法，即：

```js
var f = v => v;
// 等价于
var f = fucntion(v){
    return v;
}
var f = v => {v;}
// 等价于
var f = fucntion(v){
    v;
}
```

#### 柯里化(Currying)

首先看一下柯里化的定义：

> 柯里化是一种处理函数中附有多个参数的方法，并在只允许单一参数的框架中使用这些函数。

换种说法就是，柯里化只指把多个参数的方法转换为单次处理一个参数的手段，感觉这么说还是有些难理解，那么就以示例展开：

```latex
f(x, y) = x * y;
// 计算f(2,3)，首先带入x=2,那么函数变为：
g(y) = f(2, y) = 2 * y;
// 再代入 y=3
g(3) = f(2, 3) = 2 * 3;
// 在柯里化过程中，每个参数与此类似，逐步代入
```

再以js代码来描述：

```js
const multiply = x => y => x * y;
const result = multiply(2)(3);
// 上面的multiply为简化写法，也可以写成下面形式，
const multiply = (x) => {
    return (y) => {
        return x * y;
    }
}
```

上面的代码，单次接收一个参数，并且可以把执行过程分开执行，分为(2)、(3)两段执行，这就是柯里化。

此外从代码中还可以看出，柯里化具备延迟执行（分两段执行）的好处，当然这个示例比较简单，实现的multiply只能接收两个函数，对于`2*3*4*5`这样的连续乘积操作则无法适配。要想做到这样一点，那么就需要下一个出场的Reduce函数了。

#### Reduce函数

Reduce函数接收一个累加器函数和一个数组，对数组中的元素从左至右应用累加器函数，并最终返回一个值。

Reduce函数的定义如下（以Typescript方式描述）：

```typescript
Array<any>.reduce(callbackfn: (previousValue: any, currentValue: any, currentIndex: number, array: any[]) => any, initialValue: any): any
callbackfn为累加器函数，包含四个参数
- previousValue 上一次调用函数时的返回值
- currentValue 数组中正在处理的元素
- currentIndex 数组中正在处理的元素对应的下标
- array 调用reduce的数组
initialValue，第一次调用callbackfn函数时的第一个参数值，如果没有提供该值，则以数组中的第一个元素替代
```

再看一下Reduce函数的实际应用：

```js
[2,3,4,5].reduce((p, c) => p * c);
// 等同于
[2,3,4,5].reduce((p, c) => p * c, 1);
```

理解了reduce用法后，就可以考虑利用Reduce来实现上一节中的连续乘积操作：

```js
const multiply = (array) => {
    return (initialValue) => {
        return array.reduce((p, c) => p * c, initialValue);
    }
}
multiply([2,3,4,5])(1);
```

#### Pipeline代码片段解释

看完上面三个概念的解释再去理解文章开头的代码片段相信会很简单了，也可以把该段代码转换一下：

```js
const pipeLine = (...fns) => {
    return (arg) => {
        return fns.reduce((p, f) => f(p), arg)
    }
}

pipeLine(x => x+1, x => x+2)(0)
```

这样看来，与上一节介绍reduce用法的代码相比，唯一不同之处就是reduce的累加器函数的实现，此处`(p,f)=>f(p)`，p参数对应的是`previousValue`，f参数对应的是`currentValue`，而`currentValue`的值分别为两个函数`x => x+1, x => x+2`。

所以这个累积加器函数的执行过程是：

| callback   | previousValue | currentValue | currentIndex | array | 返回值 |
| ---------- | ------------- | -------------- | -------------- | -------------- | -------------- |
| 第一次调用 | 0 | x => x + 1 | 0 | [x => x+1, x => x+2] | 1 |
| 第二次调用 | 1 | x => x + 2 | 1 | [x => x+1, x => x+2] | 3 |

`pipeline`代码在前端中颇为常见，例如rxjs中存在的pipe操作符，用于流式处理多个操作：

```js
Observable.from([1,2,3]).pipe(
	scan((acc, item) => acc += item, 1),
    skip(1)
)
```

虽然`pipeline`的实现过程已经掌握，但是在使用过程中累积器中的函数操作不可能一直是同步操作，那么为了让`pipeline`能够处理异步操作，那么则需要对上面的代码做出小小的改变：

```js
const pipeLine = (...fns) => arg => fns.reduce((p, f) => p.then(f), 	Promise.resolve(arg))

pipeLine(
  x => x+1,
  x => new Promise(resolve => resolve(x+2)),
  async x => await(x+3)
)(0).then(result => console.log(result));
```

上述代码增加了对异步事件的处理，首先是`initialValue`使用`Promise.resolve()`方法封装为一个Promise对象，其次对累加器中的函数依此做`then()`链式调用，最后返回的也是一个`Promise`对象，并通过`then`拿到最终的值。