#### 1. 升级提示
https://angular-update-guide.firebaseapp.com/
主要涉及：
- animation库的迁移
- http -> httpclient
- template -> ng-template  

#### 2. 升级步骤
主要涉及以下部分：
- typescript 2.4.2+ 才可以匹配 Angular5
npm install typescript@2.4.2 --save-exact
- angular版本升级
npm install @angular/animations@'^5.2.0' @angular/common@'^5.2.0' @angular/compiler@'^5.2.0' @angular/compiler-cli@'^5.2.0' @angular/core@'^5.2.0' @angular/forms@'^5.2.0' @angular/http@'^5.2.0' @angular/platform-browser@'^5.2.0' @angular/platform-browser-dynamic@'^5.2.0' @angular/platform-server@'^5.2.0' @angular/router@'^5.2.0' typescript@2.4.2 rxjs@'^5.5.2'
- 依赖组件库的升级
"@ng-bootstrap/ng-bootstrap": "^1.0.0"
- angular/cli升级
angular/cli 1.6.8 对应 angular 5.2.x  

#### 3. 问题解决
> ng serve后出现错误： No module factory available for dependency type: ContextElementDependency
解决方法：  
- 从package.json中删除webpack与webpack-dev-server
- rm -R node_modules (remove node_modules folder)
- npm i -g webpack
- npm i -g webpack-dev-server
- remove package-lock.json (if it's there)
- npm i
- npm run start

#### 4. 其他


#### 5. Angular5 release note
breaking changes：
- compiler：需要typescript 2.4.x版本
- 分类compiler与core，@angular/platform-server依赖于@angular/platform-browser-dynamic作为一个peer dependency
- 118n pipe
- Data pipe
https://medium.com/@tigercosmos/what-is-angular5-63b9a8f0c39b
