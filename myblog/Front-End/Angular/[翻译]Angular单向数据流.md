大部分的架构的模式很难掌握，尤其资料缺乏的情况下。Angular的单向数据流便是其中之一。这个概念在官方文档中没有明确的解释，只零星存在于expression guidelines和template statements章节之中。作者在网上也没有找到详细描述单向数据流的文章，所以写下此篇文章。

### 双向绑定vs单向数据流
在论及Angularjs与Angular之间的性能差异时，通常会提及单向数据流这一概念。单向数据流是Angular性能高于Angularjs的“秘诀”。  

每个框架都存在利用绑定来实现组件之间通信的类似机制，例如在Anuglarjs中：
```js
app.component('aComponent', {
  controller: class ParentComponent() {
    this.value = {name: 'initial'};
  },
  template: `
    <b-component obj="$ctrl.value"></b-component>
  `
});
----------------
app.component('bComponent', {
    bindings: {
        obj: '='
    },
```
父组件A向子组件B传递值的方式是使用`obj`输入绑定： 
```js
<b-component obj="$ctrl.value"></b-component>
```

在Angular中也有着类似的方式：
```js
@Component({
    template: `
        <b-component [obj]="value"></b-component>`
    ...
export class AppComponent {
    value = {name: 'initial'};
}
----------------
export class BComponent {
    @Input() obj;
```
首先，最重要的事情是要理解Angular和Angularjs更新绑定是在变更检测(change detection)中进行的。在它们运行变更检测时，父组件A的值改变也会更新子组件B中的`obj`属性的值。
```js
bComponentInstance.obj = aComponentInstance.value;
```
这个过程演示了，双向绑定中的单向绑定或者单向数据流中的自顶向下。但是Angularjs不同之处是它更新了父组件中的值，也可以由子组件的值改变而改变。
```js
app.component('parentComponent', {
  controller: function ParentComponent($timeout) {    
    $timeout(()=>{
      console.log(this.value); // logs {name: 'updated'}
    }, 3000)
  }
----------------
  
app.component('childComponent', {
    controller: function ChildComponent($timeout) {      
      $timeout(()=>{
        this.obj = { name: 'updated' };  
      }, 2000)
```
在上面代码片段中存在两个带有回调函数的timeout函数，当子组件`obj`属性更新为`{name: ‘updated’}`。当Angularjs检测绑定在子组件属性的变更时，也会更新父组件的属性。这是Angularjs内置的双向绑定特性。而在Angular之中，子组件的值会变更，但是不会冒泡到父组件中。这是两者变更检测过程中的区别。

在Angular中，虽然没有双向绑定，但是仍然存在一种方式可以子组件操控父组件中值的更新，即组件中的`Output`绑定。
```js
@Component({
    template: `
        <h1>Hello {{value.name}}</h1>
        <a-comp (updateObj)="value = $event"></a-comp>`
    ...
export class AppComponent {
    value = {name: 'initial'};
    
    constructor() {
        setTimeout(() => {
            console.log(this.value); // logs {name: 'updated'}
        }, 3000);
----------------
@Component({...})
export class AComponent {
    @Output() updateObj = new EventEmitter();
    
    constructor() {
        setTimeout(() => {
            this.updateObj.emit({name: 'updated'});
        }, 2000);
```
首先，需要说明的是，这种方式与Angularjs那种直接从子组件值改变来更新父组件的双向绑定不同。但是奇怪的是，这种方式为什么不能称之为双向绑定？毕竟子/父组件的交互是双向的。

这篇文章[Two Phases of Angular Applications](https://vsavkin.com/two-phases-of-angular-2-applications-fda2517604be)给出了一个解释:  
> （Angular 2 separates updating the application model and reflecting the state of the model in the view into two distinct phases. The developer is responsible for updating the application model. Angular, by means of change detection, is responsible for reflecting the state of the model in the view.）  
Angular2 更新应用中model和解析model至view是位于两个不同的处理阶段。开发人员负责更新应用model，Angular通过变更检测，把model的变更映射到view层。

所以上述示例中，Angular父组件依赖于`output`绑定机制的更新，并不属于Angular的变更检测的一部分。

它是在变更检测开始之前，更新应用model的第一个阶段执行的。因此，单向数据流定义了变更检测期间的绑定更新体系结构。与Angularjs不同，Angular的变更检测机制下没有把子组件属性更新传播到父组件。`output`绑定处理位于变更检测之外，因此不会将单向数据流转变为双向绑定。

### view和service层中的单向数据流
大部分的web应用都使用了分层设计，视图(view)层和服务(service)层。  

![service and view layer](https://github.com/jkhhuse/imgRepo/blob/master/img%20lib/serviceview.png?raw=true)

在web环境下，view层中为使用DOM等技术来展示用户数据，在Angular中view层则由组件实现。service层则负责处理与存储业务相关的数据。像上图所示，service层包含了状态管理、REST调用、可重用的通用工具服务等。

之前解释的单向数据流是与应用的view层相关，Angular中的view由组件呈现，所以单向数据流其实就可以表现为组件之间的数据流动。  
![data flow](https://github.com/jkhhuse/imgRepo/blob/master/img%20lib/dataflow.png?raw=true)

然而，当引入ngrx（实现了类似Redux的状态管理模式）之后，又会陷入另外一种困惑。Redux的文档中关于状态的描述：
> Redux的架构围绕严格的单向数据流实现，这意味着应用程序中的所有数据都遵循着相同的生命周期，使你的应用程序逻辑更加可预测和可理解。

所以，这里的单向数据流是与service层相关，而不是view层。在引入类Redux模式时，要注意区别这两者的区别。Redux主要关注的是service层中的状态管理模块，引入Redux后，Web应用的架构则由
![state_management](https://github.com/jkhhuse/imgRepo/blob/master/img%20lib/state_management1.png?raw=true)
转变为：
![new state_management](https://github.com/jkhhuse/imgRepo/blob/master/img%20lib/state_management2.png?raw=true)

### 引用资料
> [Do you really know what unidirectional data flow means in Angular](https://blog.angularindepth.com/do-you-really-know-what-unidirectional-data-flow-means-in-angular-a6f55cefdc63)

### 阅读记录
这篇文章对Angualrjs与Angular的绑定机制做了对比，Angular的“双向绑定”通过指令`ngModel`实现（在表单中可以直接使用`ngModel`）或者由语法`[()]`来实现。
关于`[()]`其实是`[]`与`()`的集合，可以视作一种语法糖，参考一个示例：
```js
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-sizer',
  template: `
  <div>
    <button (click)="dec()" title="smaller">-</button>
    <button (click)="inc()" title="bigger">+</button>
    <label [style.font-size.px]="size">FontSize: {{size}}px</label>
  </div>`
})
export class SizerComponent {
  @Input()  size: number | string;
  @Output() sizeChange = new EventEmitter<number>();

  dec() { this.resize(-1); }
  inc() { this.resize(+1); }

  resize(delta: number) {
    this.size = Math.min(40, Math.max(8, +this.size + delta));
    this.sizeChange.emit(this.size);
  }
}
---------------app.component.html
<app-sizer [(size)]="fontSizePx"></app-sizer>
```
`[(size)]`其实是`[size]`与`(sizeChange)`的一个简写：
```js
<app-sizer [size]="fontSizePx" (sizeChange)="fontSizePx=$event"></app-sizer>
```
可以简写的原因就是这里其实目标是实现`fontSizePx`的双向绑定，即子组件`app-sizer`中的`size`的改动更新可以冒泡到父组件中。`sizeChange`则可以隐式`emit`出`size`值。

`ngModel`指令也是同样，它其实是可以分解为`[ngModel]`与`(ngModelChange)`两个部分。

最后，本篇文章着重讲了单向数据流的概念周边，为了进一步理解Angular的change detection机制及更多其他的知识点，我还将陆续写作/写作一些文章或者资料帮助加深自己对Angular的理解。
