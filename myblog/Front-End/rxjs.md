### Observable (可观察对象)  
#### 创建Observables  
```js
var observable = Rx.Observable.create(function subscribe(observer) {
  var id = setInterval(() => {
    observer.next('hi')
  }, 1000);
});
```
#### 订阅Observables  
```js
observable.subscribe(function(x) {
    console.log(x);
});
```
通常使用es箭头函数简写如下：    
```js
observable.subscribe(x => console.log(x));
```
#### 执行 Observables
Observables只有在订阅后才会执行，其本身是一个惰性运算。  
它可以执行传递三种类型的值：  
"Next" 通知： 发送一个值，比如数字、字符串、对象，等等。  
"Error" 通知：  发送一个 JavaScript 错误或异常。  
"Complete" 通知： 不再发送任何值。  
当出现complete与error后，next的操作就会被终止。
可以使用try/catch来处理Observables：
```js
var observable = Rx.Observable.create(function subscribe(observer) {
  try {
    observer.next(1);
    observer.next(2);
    observer.next(3);
    observer.complete();
  } catch (err) {
    observer.error(err); // 如果捕获到异常会发送一个错误
  }
});
```
#### 清理 Observable 执行  
```js
var observable = Rx.Observable.from([10, 20, 30]);
var subscription = observable.subscribe(x => console.log(x));
subscription.unsubscribe();
```

### Observer (观察者)
Observer是由Observable传递的一个消费者的值，通常是一个回调集合，由Observable传递的三种通知next，error，complete：
```js
var observer = {
  next: x => console.log('Observer got a next value: ' + x),
  error: err => console.error('Observer got an error: ' + err),
  complete: () => console.log('Observer got a complete notification'),
};
```
在订阅的时候可以调用observer：
```js
observable.subscribe(observer);
```

### Subscription (订阅)  
Subscription是一个可以做任何处理的对象。  
可以把多个Subscription合并到一起后针对合并后的Subscription做一些处理：  
```js
var observable1 = Rx.Observable.interval(400);
var observable2 = Rx.Observable.interval(300);

var subscription = observable1.subscribe(x => console.log('first: ' + x));
var childSubscription = observable2.subscribe(x => console.log('second: ' + x));

subscription.add(childSubscription);

setTimeout(() => {
  // subscription 和 childSubscription 都会取消订阅
  subscription.unsubscribe();
}, 1000);
```

### Subject (主题)  
Subject是一种特殊类型的Observable，它允许将值多播给多个Observers。  
Subject有两个特点：每个Subject都可以是Observable，可以使用subscribe方法来接收值：  
```js
var subject = new Rx.Subject();

subject.subscribe({
  next: (v) => console.log('observerA: ' + v)
});
subject.subscribe({
  next: (v) => console.log('observerB: ' + v)
});

subject.next(1);
subject.next(2);
```
每个Subject都可以是Observer，那么Subject就会包含next(x)、error(e)、complete()方法：  
```js
var subject = new Rx.Subject();

subject.subscribe({
  next: (v) => console.log('observerA: ' + v)
});
subject.subscribe({
  next: (v) => console.log('observerB: ' + v)
});

var observable = Rx.Observable.from([1, 2, 3]);

observable.subscribe(subject); // 你可以提供一个 Subject 进行订阅
```
####  多播的 Observables  
多播的Observable使用Subject来实现多个Observers可以看到同一个Observable的执行：
```js
var source = Rx.Observable.from([1, 2, 3]);
var subject = new Rx.Subject();
var multicasted = source.multicast(subject);

// 在底层使用了 `subject.subscribe({...})`:
multicasted.subscribe({
  next: (v) => console.log('observerA: ' + v)
});
multicasted.subscribe({
  next: (v) => console.log('observerB: ' + v)
});

// 在底层使用了 `source.subscribe(subject)`:
multicasted.connect();
```

#### 引用计数  
在上一个多播示例中，使用connect()来启用Observable执行。  
通常这样的方法不够灵活，使用refConut()方法可以实现当存在第一个subscribe时，多播 Observable会自动启动执行，
当最后一个subscribe离开时，多播 Observable会自动地停止。  
原先的方法需要把多个subscribe add到一个共享subscribe中，使用refCount()方法则不用，refCount()方法返回的是一个observe，
使多个subscribe更为独立。  

#### BehaviorSubject  
Subject的一个变体，它保存了发送给消费者的最新值，subscribe时从BehaviorSubject中取得最新值。  
当一个新的Observer被订阅，那么会立即从BehaviorSubject接收到当前值。  
```js
var subject = new Rx.BehaviorSubject(0); // 0 is the initial value

subject.subscribe({
  next: (v) => console.log('observerA: ' + v)
});

subject.next(1);
subject.next(2);

subject.subscribe({
  next: (v) => console.log('observerB: ' + v)
});

subject.next(3);
```

#### ReplaySubject  
可以发送旧的值给subscribe，也可以记录observable执行的一部分。  
与BehaviorSubject，当一个新的Observer被订阅，那么会立即从BehaviorSubject接收到当前值。  
```js
var subject = new Rx.ReplaySubject(3); // 为新的订阅者缓冲3个值

subject.subscribe({
  next: (v) => console.log('observerA: ' + v)
});

subject.next(1);
subject.next(2);
subject.next(3);
subject.next(4);

subject.subscribe({
  next: (v) => console.log('observerB: ' + v)
});

subject.next(5);

```
还可以设置时间窗口(ms)单位来确定多久之前的值可以记录：  
```js
var subject = new Rx.ReplaySubject(100, 500 /* windowTime */);

subject.subscribe({
  next: (v) => console.log('observerA: ' + v)
});

var i = 1;
setInterval(() => subject.next(i++), 200);

setTimeout(() => {
  subject.subscribe({
    next: (v) => console.log('observerB: ' + v)
  });
}, 1000);
```

#### AsyncSubject  
只有当 Observable 执行完成时(执行 complete())，它才会将执行的最后一个值发送给subscribe。  
```js
var subject = new Rx.AsyncSubject();

subject.subscribe({
  next: (v) => console.log('observerA: ' + v)
});

subject.next(1);
subject.next(2);

subject.subscribe({
  next: (v) => console.log('observerB: ' + v)
});

subject.next(3);
subject.complete();
```

### Operators (操作符)  
允许复杂的异步代码以声明式的方式进行轻松组合。  
操作符是函数，它基于当前的 Observable 创建一个新的 Observable。这是一个无副作用的操作：前面的 Observable 保持不变。  
包括：创建、转换、过滤、组合、错误处理、工具等。

### Scheduler (调度器)  
调度器可以让你规定 Observable 在什么样的执行上下文中发送通知给它的观察者。
- 调度器是一种数据结构。 它知道如何根据优先级或其他标准来存储任务和将任务进行排序。  
- 调度器是执行上下文。 它表示在何时何地执行任务(举例来说，立即的，或另一种回调函数机制(比如 setTimeout 或 process.nextTick)，或动画帧)。  
- 调度器有一个(虚拟的)时钟。 调度器功能通过它的 getter 方法 now() 提供了“时间”的概念。在具体调度器上安排的任务将严格遵循该时钟所表示的时间。  

#### 调度器类型
调度器 目的
null    不传递任何调度器的话，会以同步递归的方式发送通知。用于定时操作或尾递归操作。
Rx.Scheduler.queue  当前事件帧中的队列调度(蹦床调度器)。用于迭代操作。
Rx.Scheduler.asap   微任务的队列调度，它使用可用的最快速的传输机制，比如 Node.js 的 process.nextTick() 或 Web Worker 的 MessageChannel 或 setTimeout 或其他。用于异步转换。
Rx.Scheduler.async  使用 setInterval 的调度。用于基于时间的操作符。