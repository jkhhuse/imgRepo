### 1. 升级提示
- 版本号同步
-  

### 2. 升级指南
> 可以参考升级指南https://update.angular.io/  

在升级至angular5.x时已经解决了一部分升级指南中的提示问题，例如HttpClient、animations等

注意事项：  
- node升级到8.x或者以上
- angular-cli.json文件不再存在，变更为angular.json文件，可以使用update命令升级文件
```shell
ng update @angular/cli
```
- 升级angular/cli版本
```shell
npm install -g @angular/cli
npm install @angular/cli
```
- angular cli命令的变化，所有的命令调整为了`--`两个横杠，需要在package.json中同步修改
- 升级相关依赖，使用命令：`ng update`
```text
angular/cli团队提供了ng update相关接口，第三方库可以实现此功能，从而可以用户可以使用类似命令：ng update @angular/meterial，保证升级库版本的同时，也会修改项目中的实现代码。
``` 
- RxJS6的升级
```shell
npm i -g rxjs-tslint
rxjs-5-to-6-migrate -p src/tsconfig.app.json
```
RxJS在升级过程中会产生一个兼容的`rxjs-compat`包，升级成功后，可以删除它。

#### 2. 升级



#### 5. 升级过程中遇到的问题


### 写在最后
angular6的这次升级，给angular带来了重大变革，优化了性能/发布包，工具链更加成熟，生态圈更加紧密，版本发布更为顺畅，简而言之就是用户会用的更爽：

- ivy，编译方式的变革，更快的编译、更小的包，不过还未成熟，angular6.x默认没有开启，将在angular7时代大放异彩。
- ng add，方便用户快速添加功能到项目中
- 版本号统一
- ng update，这个功能能够很方便地让用户升级自己的项目，也顺应了angular的语义化版本的更新思路：新的angular版本也会对应新的第三方依赖包。



参考地址： 
> https://github.com/ReactiveX/rxjs-tslint
> https://blog.angular.io/version-6-of-angular-now-available-cc56b0efa7a4 
> https://update.angular.io/