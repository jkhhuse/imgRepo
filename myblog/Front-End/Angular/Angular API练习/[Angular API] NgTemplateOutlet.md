### 用途
用于向`TemplateRef`嵌入视图

它是一个指令：
```js
@Directive({ selector: '[ngTemplateOutlet]' })
class NgTemplateOutlet implements OnChanges {
  constructor(_viewContainerRef: ViewContainerRef)
  ngTemplateOutletContext: Object
  ngTemplateOutlet: TemplateRef<any>
  ngOnChanges(changes: SimpleChanges)
}
```

`ngTemplateOutletContext` 接收一个对象，通常为: `templateRefExp; context: contextExp` , `context` 变量用于接收组件中定义的对象，用于向 `templateRefExp` 模板中传值: 
```html
<ng-container *ngTemplateOutlet="templateRefExp; context: contextExp"></ng-container>

```

`ngTemplateOutlet` 接收一个 `<ng-template></ng-template>` 模板，与 `ngTemplateOutletContext` 中的 `templateRefExp` 作用相同.



### DEMO
参考官方示例：
```js
import {
  Component,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  ViewChild
} from '@angular/core';
@Component({
  selector: 'ng-template-outlet-example',
  template: `
    <ng-container *ngTemplateOutlet="greet"></ng-container>
    <hr>
    <ng-container *ngTemplateOutlet="eng; context: myContext"></ng-container>
    <hr>
    <ng-container *ngTemplateOutlet="svk; context: myContext"></ng-container>
    <hr>
    <ng-template #greet><span>Hello</span></ng-template>
    <ng-template #eng let-name><span>Hello {{name}}!</span></ng-template>
    <ng-template #svk let-person="localSk"><span>Ahoj {{person}}!</span></ng-template>
  `
})
export class NgTemplateOutletExample {
  myContext = {$implicit: 'World', localSk: 'Svet'};
}
```
运行结果如下：
```text
Hello
----------------
Hello World!
----------------
Ahoj Svet!
----------------
```
> [源码](https://angular-templateoutlet.stackblitz.io)


### 谈一下在Ant Design Zorro下的用法

`Pagination` 组件中大量应用了 `ngTemplateOutlet` 与 `ngTemplateOutletContext`, 主要使用在prev、page、next按钮的生成之中。
Zorro提取了他们的公共特征：都为一个个可点击的单元，不同之处是这个单元可以是页码或者是图标, 而页码或者图标的不同可以使用 `ngTemplateOutletContext` 来配置以及使用样式来提前设置好。

所以Zorro定义了他们的公共结构为：
```html
<ng-template #renderItemTemplate let-type let-page="page">
  <a class="ant-pagination-item-link" *ngIf="type!='page'"></a>
  <a *ngIf="type=='page'">{{page}}</a>
</ng-template>
```

其中type和page变量来决定该单元结构中显示的是页码还是图标。

prev按钮的生成是通过定义`[ngTemplateOutletContext]="{ $implicit: 'prev'}"`, `$implicit` 代表默认，那么 `type` 的值为prev, 'prev'!='page', 再应用预先定义好的样式, 那么最终渲染出来上一页按钮。

若 `ngTemplateOutletContext` 的值为 `{ $implicit: 'page',page: page.index }`, `type` 变量对应的值为 `page`, 渲染出page按钮。并且把 `page` 变量值通过 `{{page}}` 渲染到页面中。  

对应代码如下:  

```html
<li
  title="{{ 'Pagination.prev_page' | nzI18n }}"
  class="ant-pagination-prev"
  (click)="jumpPreOne()"
  [class.ant-pagination-disabled]="isFirstIndex">
  <ng-template [ngTemplateOutlet]="nzItemRender" [ngTemplateOutletContext]="{ $implicit: 'prev'}"></ng-template>
</li>
<li
  *ngFor="let page of pages"
  [attr.title]="page.index"
  class="ant-pagination-item"
  (click)="jumpPage(page.index)"
  [class.ant-pagination-item-active]="nzPageIndex==page.index">
  <ng-template [ngTemplateOutlet]="nzItemRender" [ngTemplateOutletContext]="{ $implicit: 'page',page: page.index }"></ng-template>
</li>
```


```less
  &-prev {
    .@{pagination-prefix-cls}-item-link:after {
      content: "\e620";
      display: block;
    }
  }

  &-next {
    .@{pagination-prefix-cls}-item-link:after {
      content: "\e61f";
      display: block;
    }
  }
```

### Angular源码解读

首先放出源码中的实现代码：
```js
private _viewRef: EmbeddedViewRef<any>;

@Input() public ngTemplateOutletContext: Object;

@Input() public ngTemplateOutlet: TemplateRef<any>;

constructor(private _viewContainerRef: ViewContainerRef) {}

ngOnChanges(changes: SimpleChanges) {
  const recreateView = this._shouldRecreateView(changes);

  if (recreateView) {
    if (this._viewRef) {
      this._viewContainerRef.remove(this._viewContainerRef.indexOf(this._viewRef));
    }

    if (this.ngTemplateOutlet) {
      this._viewRef = this._viewContainerRef.createEmbeddedView(
          this.ngTemplateOutlet, this.ngTemplateOutletContext);
    }
  } else {
    if (this._viewRef && this.ngTemplateOutletContext) {
      this._updateExistingContext(this.ngTemplateOutletContext);
    }
  }
}
```

在onchange中获得当前绑定的两个属性的状态检测情况，即changes中包含两个属性：`ngTemplateOutletContext`、`ngTemplateOutlet`。

首先需要判断是否需要重新进行view attach操作，通过`this._shouldRecreateView(changes)`方法判断。

```js
private _shouldRecreateView(changes: SimpleChanges): boolean {
  const ctxChange = changes['ngTemplateOutletContext'];
  return !!changes['ngTemplateOutlet'] || (ctxChange && this._hasContextShapeChanged(ctxChange));
}

private _hasContextShapeChanged(ctxChange: SimpleChange): boolean {
  const prevCtxKeys = Object.keys(ctxChange.previousValue || {});
  const currCtxKeys = Object.keys(ctxChange.currentValue || {});

  if (prevCtxKeys.length === currCtxKeys.length) {
    for (let propName of currCtxKeys) {
      if (prevCtxKeys.indexOf(propName) === -1) {
        return true;
      }
    }
    return false;
  } else {
    return true;
  }
}
```
在这个过程中存在集中情况：context对象的变化（值变化与Shape变化）、templateRef变化。

`!!changes['ngTemplateOutlet']` 用于判断`<ng-template></ng-template>` 是否变化。

`this._hasContextShapeChanged(ctxChange)` 用于判断 `context`上下文对象是否发生变化，这个变化包括两种情况，值变化与Shape变化，如下所示：

```html
<ng-template let-ctx #tpl>{{ctx.foo}}</ng-template>
<ng-container *ngTemplateOutlet="tpl; context: context"></ng-container>
```
```js
this.context = {$implicit: {foo: 'bar'}};
// 值变化为
this.context = {$implicit: {foo: 'bar1'}};
// Shape变化
this.context = {$implicit: {foo: 'bar1'}, $ctx: {foo: 'bar2'}};
```

针对值变化，只需要更新`ngTemplateOutletContext` 对象中的属性值。

针对Shape变化，需要根据情况来从container中remove emberView，再重新create emberView。

最后，如果templateRef变化，也会与Shape的处理一样。
