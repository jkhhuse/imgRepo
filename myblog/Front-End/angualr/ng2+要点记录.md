### Angular CLI
#### 安装
```bash
npm install -g @angular/cli
```
#### 生成项目
```bash
ng new PROJECT-NAME
```
#### 生成组件、指令、管道、服务
```bash
ng generate component my-new-component
ng g component my-new-component # 使用简写
Component ng g component my-new-component
Directive ng g directive my-new-directive
Pipe      ng g pipe my-new-pipe
Service   ng g service my-new-service
Class     ng g class my-new-class
Guard     ng g guard my-new-guard
Interface ng g interface my-new-interface
Enum      ng g enum my-new-enum
Module    ng g module my-module
```
#### 命令使用
```bash
ng serve (--prod/tree-shaking --aot 启用aot编译)
ng test 
ng e2e 
ng build (--prod/tree-shaking --aot 启用aot编译)
ng lint
```
#### angular@cli配置
1. 使用[angular@cli](https://github.com/angular/angular-cli/wiki/stories-css-preprocessors)创建一个支持scss的项目
```bash
ng new sassy-project --style=sass/scss
#或者
ng set defaults.styleExt scss
```
2. 添加Font Awesome
```js
在styles.scss中import包
@import '../node_modules/font-awesome/scss/font-awesome';
```
3. 添加bootstrap
```js
//安装bootstrap3.x
npm install bootstrap-sass --save
//在styles.scss中添加：
@import '../node_modules/bootstrap-sass/assets/stylesheets/_bootstrap';
```
4. 在angular2中使用bootstrap4 scss  
参考StackOverflow中的一个回答：https://stackoverflow.com/questions/38534276/how-to-use-bootstrap-4-in-angular-2  


### 模板

#### 绑定
视图->数据源: `(target)="statement"/on-target="statement"`  
数据源->视图: `[target]="expression"/bind-target="expression"`  
双向: `[(target)]="expression" bindon-target="expression"`  

#### attribute与property
使用下面代码可以获得所有的property：  
```js
document.body.custom = 5;
var list = [];
for(var key in document.body){
    list.push([key, document.body[key]]);
}
console.log(list);
```
模板只针对property做出绑定处理，若需要修改attribute中的值，例如colspan，可以使用`attr.colspan`。

#### 指令
结构型指令与属性型指令

#####  安全操作符
`The null hero's name is {{nullHero?.name}}`在nullHero为空时，不会报错。

#### 非空断言操作符
这个操作符是高速TS类型检查器不做严格的值检测。

#### 生命周期钩子
ngOnInit()方法：组件中实现初始化的逻辑；  
ngOnChanges()方法：组件中的输入属性发生变化时调用；  
ngDoCheck()方法：主动监控组件中的值，例如angular无法主动获取捕捉的对象的变更， 类似于watch()；  
AfterView：提供AfterViewInit()和AfterViewChecked()方法，在组件的子视图（@ViewChild）创建后触发；  
AfterContent: 提供AfterContentInit()和AfterContetnChecked()方法，当外部内容被嵌入([transclusion技术](http://www.cnblogs.com/leosx/p/4065440.html))到组件后被调用。  
transclusion在ng2+中，父组件使用`<ng-content></ng-content>`作为占位符，嵌入相应内容。使用AfterContent无需担心单向数据流规则。  

####  组件交互  
1. 父组件数据传送到子组件：  
```js
//子组件
@Input() hero: Hero;
//父组件
`<hero-child [hero]="hero"></hero-child>`
```
2. setter拦截父组件中值：
```js
//对父组件传递的值进行操作
@Input()
set name(name: string) {
    this._name = (name && name.trim()) || '<no name set>';
}
```
3. 使用ngOnChanges代替setter来处理多个掺入的输入属性。
4. 父组件与子组件互动
通过本地变量:
父组件可以用使用#time来获得子组件的引用,但是只能在模板中使用它。
```html
template:`
<button (click)="timer.start()">Start</button>
<time-component #time></time-component>`
```
使用viewChild()互动:
可以在组件中获得子组件的引用
```js
@ViewChild(CountdownTimerComponent)
private timerComponent: CountdownTimerComponent;
```
5. 通过服务进行组件之间的交互

#### 属性型指令
定义在属性上，会改变某个元素、组件或其它指令的外观或行为。
```html
<p [myHighlight]="color" defaultColor="violet">Highlight me!</p>
```
@HostListener添加一个事件处理器mouseenter。
```js
@Directive({
  selector: '[myHighlight]'
})
export class HighlightDirective {
    @Input('myHighlight') highlightColor: string;
    @HostListener('mouseenter') onMouseEnter() {
        this.highlight(this.highlightColor || this.defaultColor|| 'red');
    }
}
```
使用[myHightlight]进行传值,@input接收传值。

#### 结构型指令
HTML布局，添加、移除、操作DOM元素。
`<ng-container>`用法:
如果需要ngIf与ngFor并存时，则需要使用这个标签来分组。angular不支持两个结构元素并存在一个元素上。
使用`<ng-container>`是可以防止结构型指令的宿主元素不会被污染:
```html
<p>
  I turned the corner
  <span *ngIf="hero">
    and saw {{hero.name}}. I waved
  </span>
  and continued on my way.
</p>
```
如果使用span作为宿主元素,则`span p{}`这样的css样式就会污染这段HTML模板的渲染，可以换种写法:
```html
<p>
  I turned the corner
  <ng-container *ngIf="hero">
    and saw {{hero.name}}. I waved
  </ng-container>
  and continued on my way.
</p>
```
HTML中会有一些级联型的元素,例如select下包含option:
```html
<select [(ngModel)]="hero">
  <span *ngFor="let h of heroes">
    <span *ngIf="showSad || h.emotion !== 'sad'">
      <option [ngValue]="h">{{h.name}} ({{h.emotion}})</option>
    </span>
  </span>
</select>
```
上面的渲染会出现问题,下拉列表中不会渲染出option，利用`<ng-container>`来代替`<span>`:
```html
<select [(ngModel)]="hero">
  <ng-container *ngFor="let h of heroes">
    <ng-container *ngIf="showSad || h.emotion !== 'sad'">
      <option [ngValue]="h">{{h.name}} ({{h.emotion}})</option>
    </ng-container>
  </ng-container>
</select>
```
自定义结构指令:


### 依赖注入
#### non-class的依赖注入
1. 通过value provider来提供支持
```js
let silentLogger = {
  logs: ['Silent logger says "Shhhhh!". Provided via "useValue"'],
  log: () => {}
};
[{ provide: Logger, useValue: silentLogger }]
```
2. 使用InjectionToken
定义：  
```js
export interface AppConfig {
  apiEndpoint: string;
  title: string;
}
import { InjectionToken } from '@angular/core';
export let APP_CONFIG = new InjectionToken<AppConfig>('app.config');
```
注册： 
```js
providers: [{ provide: APP_CONFIG, useValue: HERO_DI_CONFIG }]
```
使用：   
```js
constructor(@Inject(APP_CONFIG) config: AppConfig) {
  this.title = config.title;
}

```

### 表单
#### 输入事件
1. $event
```html
<input (keyup)="onKey($event)">
```
```js
onKey(event: any) { // without type info
    this.values += event.target.value + ' | ';
}
```
2. $event类型
```js
onKey(event: KeyboardEvent) { // with type info
    this.values += (<HTMLInputElement>event.target).value + ' | ';
}
```
3. 模板引用`#`
直接使用$event不是一个好的方式，不应在组件中了解太多HTML模板的细节内容。  
```html
<input #box (keyup)="onKey(box.value)">
```
```js
onKey(value: string) {
    this.values += value + ' | ';
}
```
#### 自定义验证器(动态验证)  
```js
this.heroForm = new FormGroup({
  'name': new FormControl(this.hero.name, [
    forbiddenNameValidator(/bob/i) 
  ])
});
```
```js
/** A hero's name can't match the given regular expression */
export function forbiddenNameValidator(nameRe: RegExp): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} => {
    const forbidden = nameRe.test(control.value);
    return forbidden ? {'forbiddenName': {value: control.value}} : null;
  };
}
```
模板中定义：  
```html
<input id="name" class="form-control"
       formControlName="name" required >
<div *ngIf="name.invalid && (name.dirty || name.touched)"
     class="alert alert-danger">
  <div *ngIf="name.errors.forbiddenName">
    Name cannot be Bob.
  </div>
</div>
```
#### 自定义验证器(模板验证)  
注入时的multi，是因为表示同样的服务可以注入多次。例如NG_VALIDATORS可以被注入多次。  
```js
import { Directive, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator, ValidatorFn, Validators } from '@angular/forms';

/** A hero's name can't match the given regular expression */
export function forbiddenNameValidator(nameRe: RegExp): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} => {
    const forbidden = nameRe.test(control.value);
    return forbidden ? {'forbiddenName': {value: control.value}} : null;
  };
}

@Directive({
  selector: '[forbiddenName]',
  providers: [{provide: NG_VALIDATORS, useExisting: ForbiddenValidatorDirective, multi: true}]
})
export class ForbiddenValidatorDirective implements Validator {
  @Input() forbiddenName: string;

  validate(control: AbstractControl): {[key: string]: any} {
    return this.forbiddenName ? forbiddenNameValidator(new RegExp(this.forbiddenName, 'i'))(control)
                              : null;
  }
}
```


### 路由  
#### 路由基础知识  
使用`RouterModule.forRoot`方法配置路由，路由匹配使用先匹配者优先:  
```js
imports: [
    RouterModule.forRoot(
      appRoutes
      { enableTracing: true } // 把路由生命周期的事件输出到控制上
    )
  ],
```
路由出口:  
```html
<router-outlet></router-outlet>
```
路由器链接:  
RouterLinkActive可以帮助用户区分路由是否活动。  
```html
<a routerLink="/crisis-center" routerLinkActive="active">Crisis Center</a>
```
路由状态： 
可以通过Router服务的RouterState值来获得当前的路由状态值。  
路由事件:
NavigationStart  
RoutesRecognized  
RouteConfigLoadStart  
RouteConfigLoadEnd  
NavigationEnd  
NavigationCancel  
NavigationError  
#### Activated Route  
```js
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import 'rxjs/add/operator/switchMap';
ngOnInit() {
  this.route.paramMap
    .switchMap((params: ParamMap) =>
      this.service.getHero(params.get('id')))
    .subscribe((hero: Hero) => this.hero = hero);
}
```
#### 第二路由  
定义  
```js
{
  path: 'compose',
  component: ComposeMessageComponent,
  outlet: 'popup'
},
```
在二级路由的父组件中渲染  
```html
<router-outlet name="popup"></router-outlet>
```
在上层中调用   
```html
<a [routerLink]="[{ outlets: { popup: ['compose'] } }]">Contact</a>
```
开启第二路由后,导航栏中会出现:`(popup:compose)`,清除第二路由:  
```js
this.router.navigate([{ outlets: { popup: null }}]);
```
#### 路由守卫  
待补充


### code style/tip  
推荐使用VS Code编辑器，可以安装如下插件:  
TSLint: TS 语法检查;  
Angular v4 TypeScript Snippets: 语法补全;  
Angular 2+ Snippets - TypeScript, Html, ngRx, Angular Flex Layout, Material & Testing: 代码补全;   
Path Intellisense: 补全文件路径;  

简单的几个风格说明：  
HTML中推荐使用双引号，ts文件中使用单引号；  
指令拼写形式使用大驼峰UpperCamelCase和小驼峰lowerCamelCase；  
写组件时，如果HTML模板很长，可以把HTML独立成一个文件引入或者考虑拆分组件，独立的HTML文件命名最好与组件名称相同；  


常用快捷键:
格式化: `Shift`+`Alt`+`F`，按照TSLint设置的规则进行Format。也可以利用VS Code中的强大的代码提示功能来修改;  
导航历史切换: `Alt`+`Left`，`Alt`+`Right`，来查看前一次/后一次光标的位置;  
寻找文件: `Ctrl`+`P`  
语法提示: `Ctrl+Space`  

### 附录：
1. 一个setTimeout()用法  
在angular官方文档中看到如下用法，有所不解:
```js
  // schedules a view refresh to ensure display catches up
  tick() {  this.tick_then(() => { }); }
  tick_then(fn: () => any) { setTimeout(fn, 0); }
```
使用babel进行转换再看看：
```js
  _createClass(s, [{
    key: "tick",
    value: function tick() {
      tick_then(function () {});
    }
  }, {
    key: "tick_then",
    value: function tick_then(fn) {
      setTimeout(fn, 0);
    }
  }]);
```
其实核心就是：
```js
function f(fn) {setTimeout(fn,0);}
setTimeout在队列中添加一个消息，待队列中其他消息处理完毕后，开启调用。
```
附一个setTimeout()的链接：https://zhuanlan.zhihu.com/p/26962590  
2. 

