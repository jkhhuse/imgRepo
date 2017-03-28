#### globally/locally安装的区别
如果包用于自己的模块，例入node的require，那么可以选用locally安装。
如果包用于命令行工具，例入grunt，那么需要选择globally安装。
- 全局安装使用命令：
```shell
> npm install -g <package_name>
```
- 更新全局包
```shell
> npm update -g <package_name> 
```
- 卸载全局包
```shell
> npm uninstall -g <package_name> 
```

#### package.json解释
- 必须要包含字段：
```json
{
    "name" :　［必须小写、包含一个单词且无空格，允许－／＿符号］，
    "version" : [x.x.x形式]
}
```

- package.json可以自己手动建立，也可以使用npm init命令生成。
```shell
npm init --yes 
npm init --y
#使用-y/--yes，可以默认选择CLI中的Q&A提示 
```

- npm init生成的package.json
```json
{
    "name":"my_package",
    "description":"",
    "version":"1.0.0",
    "main":"index.js",
    "scripts":{
        "test":"echo "Error: no test specified" && exit 1"
    },
    "repository":{
        "type":"git",
        "url":"https://github.com/ashleygwilliams/my_package.git"
    },
    "keywords":[

    ],
    "author":"",
    "license":"ISC",
    "bugs":{
        "url":"https://github.com/ashleygwilliams/my_package/issues"
    },
    "homepage":"https://github.com/ashleygwilliams/my_package"
}
```
**解释：**
*name: 当前目录的名称
version: 版本号
description: 可以是空字符串
main: 通常是index.js
scripts: 默认生成一个空的测试脚本
keywords: 空
author: 空
license: ISC
bugs: bugs列表
homepage: 项目主页*

- 可以通过CLI控制package.json中的初始化配置，例如：
```shell
> npm set init.author.email "wombat@npmjs.com"
> npm set init.author.name "ag_dubs"
> npm set init.license "MIT"
```
以后使用npm init命令生成的package.json，以上字段将使用默认的初始化设置.

- 配置package.json的包依赖
"dependences" : 在生产环境下用到的包
"devDependencies" : 只在测试/开发环境下用到的包
也可以在安装的时候设置安装的包用于哪种环境：
```shell
> npm install <package_name> --save      生产环境下使用
> npm install <package_name> --save-dev  只在测试/开发环境下使用
```

#### 更新本地包
官方建议定期更新包的版本.
可以使用npm outdated查看是否需要更新包，使用npm update来更新最新的包.

#### 卸载本地包
卸载本地目录下的包：
```shell
> npm uninstall <package_name>
```
从package.json中删除依赖配置：
```shell
> npm uninstall --save/--save-dev <package_name>
```
使用npm ls查看所有安装的包以及包之间的依赖关系。
示例1，使用npm ls查看package.json中存在的包，而node_modules中不存的包：
```shell
> npm ls
test@1.0.0 E:\learn\vue\testnpm
└── lodash@4.17.4

> npm uninstall lodash

> npm ls
test@1.0.0 E:\learn\vue\testnpm
└── UNMET DEPENDENCY lodash@^4.17.4
npm ERR! missing: lodash@^4.17.4, required by test@1.0.0
```
使用npm prune来移除package.json的dependencies中不存在，而node_modules中存在的包。
示例2，使用npm prune移除node_modules中的包：
```shell
#移除dependencies中的依赖
> vim package.json 

> npm ls
test@1.0.0 E:\learn\vue\testnpm
└── lodash@4.17.4 extraneous
npm ERR! extraneous: lodash@4.17.4 E:\learn\vue\testnpm\node_modules\lodash

> npm prune
npm WARN package.json test@1.0.0 No description
npm WARN package.json test@1.0.0 No repository field.
npm WARN package.json test@1.0.0 No README data
unbuild lodash@4.17.4

> npm ls
test@1.0.0 E:\learn\vue\testnpm
└── (empty)
```

#### 在npm中发布一个包
- 在本地初始化一个包
```shell
> npm init
> vim index.js
exports.printMsg = function() {
  console.log("This is a message from the demo package");
}
```

- 新建npm用户
```shell
#添加一个npm用户,填写用户名、密码、邮箱
> npm adduser

#在npm客户端中登录该用户
> npm login

#查看验证信息是否保存在客户端中
> npm config ls
```

- 发布包
需要在login后，才能发布包，注意发布的包名不能重复
```shell
> npm publish
publish:npm-demo-frist-jk ▄ ╢░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 
publish:npm-demo-frist-jk ▀ ╢░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 
publish:npm-demo-frist-jk ▐ ╢░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 
+ npm-demo-frist-jk@1.0.0
```

- 测试发布的包
重新建立一个npm目录，引入npm-demo-frist-jk包，并测试是否可以输出：
```shell
> mkdir npm_test
> cd npm_test
> npm init
> npm install npm-demo-frist-jk --save
> vim index.js
var test = require('npm-demo-frist-jk');
test.printMsg();
> node index.js
```

- 重新发布包
如果已经发布的包存在一些改动，那么需要重新发布包。
注意：重新发布npm包时，需要对package.json中的version进行修改。
```shell
> npm version <update_type>
```
update_type可以使用一些语义化的词表示：patch、minor、major
major、minor、patch分别对应vpackage.json中version的x.x.x
运行完命令后会响应地修改package.json中version号。
在更新完version号后，重新发布一下npm包即可：
```shell
> npm publish
```

#### npm的语义化版本号(semver)的设定
- 版本发布的定义
