#### Angular CLI
##### 1. 安装
```bash
npm install -g @angular/cli
```
##### 2. 生成项目
```bash
ng new PROJECT-NAME
```
##### 3. 生成组件、指令、管道、服务
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
##### 4. 命令
```bash
ng serve (--prod/tree-shaking --aot 启用aot编译)
ng test 
ng e2e
ng build (--prod/tree-shaking --aot 启用aot编译)
ng lint
```


#### 模板
##### 绑定
视图->数据源: `(target)="statement"/on-target="statement"`
数据源->视图: `[target]="expression"/bind-target="expression"`
双向: `[(target)]="expression" bindon-target="expression"`

##### attribute与property
1. 使用下面代码可以获得所有的property：
```js
document.body.custom = 5;
var list = [];
for(var key in document.body){
    list.push([key, document.body[key]]);
}
console.log(list);
```
模板只针对property做出绑定处理，若需要修改attribute中的值，例如colspan，可以使用`attr.colspan`。
2. 指令
结构型指令与属性型指令
3. 安全操作符
`The null hero's name is {{nullHero?.name}}`在nullHero为空时，不会报错
4. 非空断言操作符
这个操作符是高速TS类型检查器不做严格的值检测
5. 生命周期钩子
ngOnInit()方法：组件中实现初始化的逻辑；
ngOnChanges()方法：组件中的输入属性发生变化时调用；
ngDoCheck()方法：

#### code style/tip
推荐使用VS Code编辑器，可以安装如下插件：
TSLint: TS 语法检查；
Angular v4 TypeScript Snippets: 语法补全；
Path Intellisense: 补全文件路径;

简单的几个风格说明：
HTML中推荐使用双引号，ts文件中使用单引号；
指令拼写形式使用大驼峰UpperCamelCase和小驼峰lowerCamelCase；


常用快捷键：
格式化: `Shift`+`Alt`+`F`，按照TSLint设置的规则进行Format。也可以利用VS Code中的强大的代码提示功能来修改；
导航历史: `Alt`+`Left`，`Alt`+`Right`，来查看前一次/后一次光标的位置；
寻找文件: `Ctrl`+`P`

#### 附录：
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
附一个说明链接：https://zhuanlan.zhihu.com/p/26962590

