## 使用Angular实现drag and drop
参考[Luy-dragger](https://github.com/Foveluy/Luy-dragger)的react实现，采用Angular来重新实现该示例。
源码：[Adragger](https://github.com/jkhhuse/Adrager)

## 拖拽事件控制

在拖拽事件的控制中涉及到click、

### 事件流注册  
Angular中可以使用rxjs来实现事件机制，例如fromEvent来创建一个事件：
```js
// 发布一个document元素中的mousemove事件
source = fromEvent(document, 'mousemove');
// 当鼠标移动时，触发move方法
this.mouseEvent = this.source.pipe(
  tap((event) => {
    this.move(event);
  })
);
```
其中tap方法的解释如下：
> Intercepts each emission on the source and runs a function, but returns an output which is identical to the source as long as errors don't occur.  

因为tap函数返回数据流的镜像，所以tap函数通常用于处理流中的'副作用'。  

### 元素拖拽位移控制  

在元素的click方法中实现元素拖拽的位移控制，其中使用`transform`的`translate`来控制2D位移：  

```js
this.bindMouseEvent = this.mouseEvent.subscribe(
  () => {
    this.style = Object.assign({
      'user-select': 'none',
      'transform': 'translate(' + this.state.x + 'px,' + this.state.y + 'px)'
    }, this.dragStyle);
  }
);
```
拖拽行为可以分解为：`mousedown(click) + mousemove`。当前鼠标放置在元素中点击时，订阅事件流，此后移动鼠标，会触发move方法，move方法中会修改当前元素的位置信息`state.x`与`state.y`值。由于订阅事件中做了2D位移的控制，所以可以模拟出完整的拖拽行为。

### 事件注销  
在拖拽事件结束后，即需要及时注销。  
使用HostListener事件绑定mouseup事件，unsubscribe事件流。
```js
@HostListener('document:mouseup', ['$event'])
mouseUp(event: any): void {
  event.stopPropagation();
  if (this.bindMouseEvent) {
    this.bindMouseEvent.unsubscribe();
  }
}
```

## 组件模板构造
从原有demo来看，元素框中的内容是变化的，要想复用组件，那么可以使用投影：`<ng-content></ng-content>`，把元素框中变化的内容投影到组件中。  
组件模板:  
```html
<div class="WrapDragger" [ngStyle]="style" (mousedown)="onDragStart($event)">
    <ng-content></ng-content>
</div>
```
元素框HTML代码:
```html
<app-dragger [dragStyle]="{left: '50px'}">
    <div>普通的拖拽组件</div>
</app-dragger>
```

## 元素框拖拽位移控制
实现功能：拖拽元素框时，可以支持指定沿着X轴位移或者Y轴位移。  
在move方法中实现如下逻辑，控制当前元素的位移`state.x`或者`state.y`值变化，从而在订阅事件流中的2D位移变换中做出相应控制：
```js
if (this.draggerProps && this.draggerProps.allowX) {
  deltaY = 0;
}
if (this.draggerProps && this.draggerProps.allowY) {
  deltaX = 0;
}
this.state.x = deltaX;
this.state.y = deltaY;
```

## 元素框拖拽位移计算
在`this.mouseEvent.subscribe`订阅中向外发送事件，从而在父组件中获得当前组件的状态信息。
发送事件：
```js
this.dragMove.emit(this.state);
```
父组件的事件处理，在onDrag方法中接收dragger组件的传值：  
```html
<app-dragger [dragStyle]="{left: '650px'}" (dragMove)="onDrag($event)">
    <div>
        位移
        <div>x:{{ state.x }} px</div>
        <div>y:{{ state.y }} px</div>
    </div>
</app-dragger>
```
```js
state = {
  x: 0,
  y: 0
};
onDrag(e) {
  this.state = {
    x: e.x,
    y: e.y
  };
}
```

## 拖拽把手设置
只需要判断当前元素框是否具有把手标识(class="className")：  
```js
if (this.draggerProps &&  this.draggerProps.hasDraggerHandle) {
  if (event.target.className !== 'handle') {
    return;
  }
}
```

## 拖拽范围设置
首先要确认当前元素离周围边框的距离，使用Position的left、right、top、bottom四个变量来表示，随后使用类似控制元素框的位移控制方式，来判断当前位移是否超出Position的规定范围。