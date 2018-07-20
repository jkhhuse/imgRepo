#### 安装webpack  
- 本地安装  
```shell
> npm install webpack --save-dev
```
官方不推荐使用全局安装的方式，可能会导致使用的webpack与项目中的版本不一致。  

#### 创建第一个打包示例  
- 创建webpack文件夹，并本地安装webpack  
```shell
> mkdir webpack-demo && cd webpack-demo
> npm init -y
> npm install webpack --save-dev
```
查看是否成功安装  
```shell
> ./node_modules/.bin/webpack --help
```

- 创建app/index.js  
```javascript
import _ from 'lodash';

function component () {
    var element = document.createElement('div');

    /* lodash is required for the next line to work */
    element.innerHTML = _.join(['Hello','webpack'], ' ');

    return element;
}

document.body.appendChild(component());
```

- 创建index.html  
```html
<!DOCTYPE html>
<html>
<head>
    <title>webpack 2 demo</title>
</head>
<body>
<script src="dist/bundle.js"></script>
</body>
</html>
```

- 创建webpack.config.js  
```javascript
var path = require('path');

module.exports = {
    entry: './app/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    }
};
```

- 在package.json中添加script  
```javascript
"scripts": {
    "build": "webpack"
},
```

- 运行打包程序  
```shell
> npm run build
```
如果不在package.json中添加script，可以使用命令：  
```shell
> ./node_modules/.bin/webpack --config webpack.config.js
```
使用上述命令，最终会在根目录生成dist/bundle.js文件。  
webpack会把index.js中的import、export语法转换为ES5兼容语法，但是其他的ES6语法则需要通过Babel去支持。  


#### Loaders使用
webpack中的Loaders用于转换模块的源码，允许预处理`require`或者`load`文件，类似与gulp/grunt中的任务流程。  
Loaders可以把其他语言转换为js，例如TypeScript转换为js，可以可以把`require(css)`嵌入到js中。  
通常的使用方法是：
```shell
> npm install --save-dev xx-loader
```
在webpack.config.js中添加配置  
```js
module.exports = {
    module: {
        rules: [
            { 
                test: /\.css$/, 
                use: ['x-loader'],
                options: {}
            }
        ]
    }
}
```
处了上述通过webpack.config.js这种Loaders配置，还可以通过require与CLI方式：  
```js
require('style-loader!css-loader?modules!./styles.css');
```
```shell
> webpack --module-bind jade-loader --module-bind 'css=style-loader!css-loader'
```

- Loader特性
可以链式，

- css-loader


- style-loader

- sass-loader

####　插件
##### ExtractTextWebpackPlugin
从打包生成的js文件中抽取出文本（CSS文件），形成一个独立的文件。  
插件将会移除所有`require("style.css")`文件，样式文件不会内嵌在bundle.js文件中，将会以一个独立的style.css文件存在。  
如果样式文件的体积庞大，那么加载会更快，因为css打包文件与js打包文件会并行加载。  


安装
```shell
> npm install --save-dev extract-text-webpack-plugin
```
使用  
```js
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: "css-loader"
        })
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin("styles.css"),
  ]
}
```


#### 使用webpack开发  
##### watch模式  
webpack监控文件变化，如果文件发生变化并保存文件时，它将会运行再次运行编译：  
```shell
> webpack --progress --watch
```
可以安装serve来使用watch：  
```shell
> npm install --save-dev serve
#运行serve
> `npm bin`/serve 
#或者pacakge.json scripts运行serve
'scripts': {
    'start': 'serve'
}
> npm start
```
##### webpack-dev-server
webpack-dev-server可以保持用于开发的server能够快速地重新加载，  
- 安装最新版本  
```shell
> npm view webpack-dev-server versions
> npm install --save-dev webpack-dev-server@version
```
- 修改package.json中的scripts/dev
```json
"scripts": {
    "dev": "webpack-dev-server",
    "prod": "webpack -p"
}
> npm run dev
```
webpack-dev-server与watch模式的区别是：  
前者不会生成dist文件，其操作的环境是位于内存中；  
watch则会生成dist文件。  
- 配置项
```shell
devServer: {
  contentBase: path.join(__dirname, "dist"),
  compress: true,
  port: 9000,
  stats: "errors-only",
  open: true
}
```
contentBase:指定dev-server需要处理的打包文件地址  
compress:开启gzip压缩  
port:指定监听的端口号  
stats:设置控制台输出的打包信息["errors-only","minimal","none","normal","verbose"]  
open:自动在浏览器中打开  

#### 热加载
热加载可以改变、添加、移除模块，并且不会重新加载页面。

#### Lazy Loading 
第一步：配置webpack.config.js中的output
```js
output: {
    path: resolve(__dirname, 'dist'),
    /*在webpack配置文件中的output路径配置chunkFilename属性*/
    filename: options.dev ? '[name].js' : '[name].js?[chunkhash]',
    chunkFilename: './src/chunk/chunk[id].js?[chunkhash]'
    /*chunkFilename路径将会作为组件懒加载的路径*/
}
```
第二步：异步加载方式
`() => import(URL)`，需要配合babel的syntax-dynamic-import插件。  
```js
{
    "presets": [
        ["es2015", { "modules": false }]
    ],
    "plugins": ["syntax-dynamic-import"]
}
```
第三步：在路由中进行配置
```js
const Body = () => import(/* webpackChunkName: "body"*/ './components/Body/Body.vue');
const Index = () => import(/* webpackChunkName: "body"*/ './components/Index/Index.vue');
const routes = [
  { path: '/Index', component: Index}
]
const router = new VueRouter({
  routes
})

new Vue({
  el: '#body',
  router:router,
  render: h => h(Body)
});
```

## 参考：  
> Webpack中文指南 http://zhaoda.net/webpack-handbook/index.html  
> Webpack2.x文档 https://webpack.js.org/guides
> Webpack懒加载 https://www.jianshu.com/p/ecea5f54db07