#### yeoman使用及生成项目学习
##### 安装命令
```shell
# 查看node与npm环境，需要node v6+，npm v3+
> node --version && npm --version
# 查看Git环境
> git --version
# 全局安装yo
> npm install --global yo
# 安装一个generator
> npm install --global generator-fountain-webapp
# 安装一个基本环境(按照指引，分别选择ng、webpack、gulp、npm、es、syntax、sass)
```
##### babel设置
提供es的转换语法，例如把es6的语法转换为es5运行。
配置文件为.babelrc，配置如下:
```shell
{
	"presets": [],
	"plugins": []
}
```
presets设置字段转码规则，例如:es2015、react等
plugins istanbul是代码覆盖率测试工具
babel-core用于在代码中进行转码
参考资料：
> http://www.ruanyifeng.com/blog/2016/01/babel.html

##### ES6语法

##### ESLint
###### 配置方式：
.eslintrc.*、package.json的eslintConfig字段或者命令行中指定配置文件
###### yeoman生成项目中的配置解释
```json
  "eslintConfig": {
    "globals": {
      "expect": true //expect全局变量可以被覆盖，如果设置为false则不可以被覆盖
    },
    "root": true, //限定eslint相关配置在根目录一级可以找到
    "env": { //指定环境，全局变量将会被预定义
      "browser": true,
      "jasmine": true
    },
    "parser": "babel-eslint", //使用指令的语法解析器（eslint只兼容三种）
    "extends": [ 
      "xo-space/esnext" //控制代码格式，为两个空格缩进
    ]
  }
```

##### Gulp4使用
###### gulp-hub
获取多个文件中的gulp任务
```js
const HubRegistry = require('gulp-hub');
const hub = new HubRegistry([conf.path.tasks('*.js')]);
```
###### gulp语法
```js
//把文件中潜在的任务注册到gulp中，添加任务
gulp.registry(hub);
```


参考资料:
> Gulp4文档 https://github.com/gulpjs/gulp/blob/4.0/docs/API.md

#### 附录
##### 错误1：
安装saas插件时出现如下错误：
```shell
Error: Can't find Python executable "F:\Users\jk\AppData\Local\Programs\Python\Python36\python.EXE", you can set the PYTHON env variable.
```

解决办法：
```text
If you haven't got python installed along with all the node-gyp dependecies, simply execute:

npm install --global --production windows-build-tools
and then to install the package

npm install --global node-gyp
once installed, you will all the node-gyp dependencies downloaded, but you still need the environment variable. Validate Python is indeed found in the correct folder:

C:\Users\ben\.windows-build-tools\python27\python.exe 
Note - it uses python 2.7 not 3.x as it is not supported

If it doesn't moan, go ahead and create your (user) environment variable:

setx PYTHON "%USERPROFILE%\.windows-build-tools\python27\python.exe"
restart cmd, and verify the variable exists via set PYTHON which should return the variable

Lastly re-apply npm install <module>

最后重新编译一下node-sass
npm rebuild node-sass --force
```

参考资料：
http://stackoverflow.com/questions/15126050/running-python-on-windows-for-node-js-dependencies


##### 错误2：
plantomjs-prebuilt在windows下面的安装错误
```shell
E:\Learn\ng\todo1>npm install plantomjs-prebuilt
npm ERR! Windows_NT 10.0.14393
npm ERR! argv "F:\\Program Files\\nodejs\\node.exe" "F:\\Program Files\\nodejs\\node_modules\\npm\\bin\\npm-cli.js" "install" "plantomjs-prebuilt"
npm ERR! node v6.10.3
npm ERR! npm  v3.10.10
npm ERR! code E404

npm ERR! 404 Registry returned 404 for GET on http://registry.npmjs.org/plantomjs-prebuilt
npm ERR! 404
npm ERR! 404  'plantomjs-prebuilt' is not in the npm registry.
npm ERR! 404 You should bug the author to publish it (or use the name yourself!)
npm ERR! 404
npm ERR! 404 Note that you can also install from a
npm ERR! 404 tarball, folder, http url, or git url.

npm ERR! Please include the following file with any support request:
npm ERR!     E:\Learn\ng\todo1\npm-debug.log
```
解决方法：
```shell
> 1. 下载windows版的plantomjs
> 2. 解压在F:\Users\jk\AppData\Local\Temp\phantomjs目录下
> 3. 配置环境变量PATH:...\phantomjs-2.1.1-windows\bin
```

