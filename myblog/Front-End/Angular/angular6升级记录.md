### 1. 升级之前注意：
- 不能跨版本升级，4.x->6.x，必须要先升级到5.x，再升级到6.x
- 检查一些包是否还在使用，例如HttpModule用HttpClentModule，animations从@angular/core移到@angular/animations等

### 2. 升级Node
需要v8.9+

### 3. 升级CLI
原先的angular-cli.json现已变更为angular.json
使用命令来升级CLI:
```
npm install -g @angular/cli@latest
npm install @angular/cli@latest
ng update @angular/cli
```
![ng update cli](https://github.com/jkhhuse/imgRepo/blob/master/img%20lib/update-cli.png)
从截图中看，update命令自动地做了一些事情，例如更新了一些文件，创建angular.json文件，删除angular-cli.json文件等。

### 4. 变更package.json中的 Angular CLI命令
命令的使用方式统一使用'--'来指定，例如ng build --prod --source-map，需要把不符合的部分做变更

### 5. 更新包
使用命令`ng update @angular/core` 可以更新Angular框架内置的包至V6，包括rxjs及typescript。  
此外，如果其他第三方包也支持ng update，那么也会一并更新。

这里遇到了一个小问题:
```shell
Package "codelyzer" has an incompatible peer dependency to "@angular/core" (requires "^2.3.1 || >=4.0.0-beta <5.0.0" (extended), would install "6.1.1").
Package "codelyzer" has an incompatible peer dependency to "@angular/compiler" (requires "^2.3.1 || >=4.0.0-beta <5.0.0" (extended), would install "6.1.1").
```
这是npm中的peer dependency问题，即@angular/core与@angular/compiler中期望其运行在codelyzer的x版本之上，但是codelyzer会被install为y版本。
其实，在npm3中peer dependency并不会报错，只是控制台中给予提示。
peer dependency提示大部分情况下不会存在问题，例如codelyzer也有对应版本被安装，codelyzer也会向下兼容，那么引用它的模块也不会存在问题。
所以官方建议在使用peer dependency时尽量把语义版本区间设置更为宽泛。

所以这个问题，可以使用force命令来解决：`ng update @angular/core --latest --force`。

### 6. rxjs迁移  
v6版本下的rxjs不再像以前那样难用，常常会需要google去寻找rxjs各类方法的引入方式。
现在的方式更为友好：  
例如操作符的引用：
```js
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
```
在rxjs6中引入方式变更为：
```js
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
```
例如`Subject、Observable`等方法引入：
```js
import { Subject } from 'rxjs/Subject'
import { Observable } from 'rxjs/Observable'
```
在rxjs6中引入方式变为：
```js
import { Subject, Observable } from 'rxjs'

```
升级之后，再也不用担心import rxjs的各种烦恼了。  

此外Angular官方也贴心地准备了一个rxjs migrate工具，解决了绝大部分rxjs的升级问题，它能够直接重构项目中引用rxjs的代码，省时省力。
例如，原有项目中存在如下写法：
```js
return next.handle(req).do(event => {...});
```
rxjs migrate工具会帮你自动修改为：
```js
return next.handle(req).pipe(tap(event => {...}));
```
这个升级至rxjs6的命令如下：
```shell
npm install -g rxjs-tslint
rxjs-5-to-6-migrate -p src/tsconfig.app.json
```
此外在升级过程中会产生一个兼容的`rxjs-compat`包，当所有第三方包依赖的rxjs升级至v6版本之后，可以删除它。  

### 7. Dependency Injection
在Angular6中，Service可以自己进行注册，不用再显示地把Service加入到providers列表中：
```js
@Injectable({
  providedIn: 'root' // 注册到app bootstrap中
})
@Injectable({
  providedIn: MainModule // 注册到MainModule模块中
})
```
这样的改变，使得Service更加独立，方便于单元测试，不过原有的写法在Angular6中依然可用。

### 8. 遇到的一些问题：
#### scss报错
解决方法：升级postcss-loader版本，https://github.com/postcss/postcss-loader/issues/319
```shell
ERROR in ./src/app/app.component.scss
Module build failed: TypeError: loader._compilation.applyPluginsWaterfall is not a function
    at D:\HSmart-0.3\0.3\HSmart\hsmart-web\node_modules\postcss-loader\index.js:122:43
    at <anonymous>
    at process._tickCallback (internal/process/next_tick.js:188:7)
```
#### TypeError：undefined is not a function
![ng update cli](https://github.com/jkhhuse/imgRepo/blob/master/img%20lib/cli-error.png)
原因：CLI工具处理lazyloading模块引发的错误
解决方法：一直在各个CLI版本中断断续续出现，目前可以在ng serve命令后添加--aot来解决，更推荐的方式是在angular.json中增加aot:true选项。

#### 行内元素间隙问题
在v5中，行内元素如果写法如下，两个span元素之间会存在一个间隙，如果并排写则无间隙：
```html
<span>1</span>
<span>2</span>
```
在升级到了v6后，即使换行写，间隙也不会存在。

#### 路由问题
v5的时候，带有lazyloading的RouteModule的顺序不会有影响，不过在v6需要注意在AppModule中带有lazyloading Module的顺序。  
如果只存在AppRoutingModule，那么需要在imports中把AppRoutingModule置于列表最后。
如果存在其他LazyLoading Module，则需要把它们置于AppRoutingModule之后。
```typescript
@NgModule({
  declarations: [ ... ],
  imports: [
    BrowserModule,
    CoreModule,
    ...,
    AppRoutingModule,
    MainModule(该模块中配置有LazyLoading Module)
  ]...
```

### 9. 写在最后
Angular6的这次升级，给Angular带来了重大变革，优化了性能/发布包，工具链更加成熟，生态圈更加紧密，版本发布更为顺畅，简而言之就是用户会用的更爽：
- ivy，编译方式的变革，更快的编译、更小的包，不过还未成熟，Angular6.x默认没有开启，将在Angular7时代大放异彩。
- ng add，方便用户快速添加功能到项目中，例如`ng add @angular/pwa`
- 版本号统一
- ng update，这个功能能够很方便地让用户升级自己的项目，也顺应了Angular的语义化版本的更新思路：新的Angular版本也会对应新的第三方依赖包。
- Angular CLI 官方支持组件库的生成，使用命令`ng generate library [name]`

### 引用
> peer-dependencies https://nodejs.org/en/blog/npm/peer-dependencies/
> https://update.angular.io/
> https://blog.angular.io/version-6-of-angular-now-available-cc56b0efa7a4 
