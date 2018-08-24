## 前言
Angular项目组提供了一个脚手架工具：`@angular/cli`用于帮助用户在web-app场景下快速组织Angular的项目结构。`@angular/cli`工具集成了测试、`tsc`编译、`css`预处理、`AOT`、`npm`等开发、测试、构建环境，并且提供了一系列快速可用的命令来运行这一套脚手架提供的功能。然而对于通用组件库开发而言，只使用`@angular/cli`来构建组件库开发的脚手架是不够的。

针对Angular组件的开发与发布，Angular项目组发布了一系列文档:
> [v5版文档](https://docs.google.com/document/d/1CZC2rcpxffTDfRDs6p1cfbmKNLA6x5O-NtkJglDaBVs/edit#heading=h.k0mh3o8u5hx) 

讲解了`@angular/meterial`所使用的代码组织结构，并给出了Angular组件库构建的一套“规范”，这套“规范”给出了组件库打包依赖的环境：

![angular组件规范](https://github.com/jkhhuse/imgRepo/blob/master/img%20lib/angular_com_func.png?raw=true)

此外社区也有一些针对Angular组件打包的方案，例如：
`generator-angular-library`，该方法使用`Yeoman`作为基础的构建环境，对于`Yeoman`可能存在几个问题，如被墙、脚手架维护不方便、在各个框架的`CLI`流行下，使用`Yeoman`生成项目框架的行为在逐渐变少；
`angular-library-starter`，该方法也未使用Angular的`CLI`工具，使用`systemJs`作为构建环境，该环境虽然集成了组件库的单元测试，但是未提供组件的doc或demo支持；

`angular-quickstart-lib`，这个工具所未由Angular官方发布，但是由`@angular/cli`工具组的成员开源，它使用`systemJs`来作为构建平台，提供了完整的打包、测试、发布命令，也提供了demo支持，是一个比较理想的seed目标。

由于`@angular/cli`提供了完整的web-app开发环境，而组件库的doc/demo非常适合使用`@angular/cli`来构建。组件库部分的代码完全则可以与doc/demo代码隔离开，单独集成一套构建环境来为组件库独立打包，此外还可以在`package.json`中为组件库设置一些打包、构建、测试命令。

##  Angular组件库构建涉及名词解释
从上文中可以了解到搭建一个Angular组件库的主要构成部分：`UMD bundle`、代码压缩、`Typescript`编译、`rollup`、`npm scripts`支持，此外为了满足组件库的开发、测试，通常还需考虑`scss`解析、doc/demo生成等。下面将对构建过程中涉及到的术语名词作出解释：

`Typescript`编译：`Typescript`为`es2015`的超集，本身并不能被浏览器直接解析执行，因而需要对`Typescirpt`进行解析、转换为浏览器可识别的代码。 

Rollup： Angular使用`Typescript`来组织代码之间的联系，即使用es2015规范中的import与`export`语句构成的js模块化。而使用`npm`的angular工程，在执行`npm install`后形成的项目依赖包`node_modules`往往规模很大，此时的项目规模不太适用于线上部署。`Rollup`支持一种`tree-shaking`的技术，可以分析静态代码中的`import`引用，并排除任何未实际使用的代码，从而可以优化`npm`工程的大小。

Module Bundle：虽然Angular的代码以ESM的方式进行模块化，但是很多浏览器并不支持，因而需要对模块进行`module bundler`或者`module loader`处理，即代码的执行方式为`AOT`或者`JIT`执行。通常情况下`JIT`可以帮助用户快速查看到代码的执行效果，但是`AOT`相比`JIT`而言，工程包体积更大，执行性能更优，因而目前生产环境中仍以`AOT`方式更佳。Angular使用`rollup.js`来对工程执行`bundles`操作，把各个Angular文件合并为一个或者多个文件，并且转译为`UMD`格式。

AOT：`AOT`不仅包含了`bundles`操作，还包含`inline resources`操作，通过把`HTML`模板和`CSS`样式内联到js文件中，可以降低源文件的数量，达到优化网络请求的目的。在`AOT`过程中，能够在编译阶段及发现错误，防止在生产环境使用时才发现问题。

支持模块化的形式：`ESM`、`UMD`。

Metadata.json：描述了Angular的组织形式，告诉Angular如何构建应用及在运行时各个类之间的交互关系，`metadata.json`结构如下图：

![angular metadata.json](https://github.com/jkhhuse/imgRepo/blob/master/img%20lib/angular_com_json.png?raw=true)

##  组件库编译过程
使用Promise.then形式同步执行如下操作：
Setp1：css预处理
Setp2：资源内联
Setp3：编译typescript、生成metadata.json
Setp4：rollup
Setp5：构建生成UMD、uglify、ES、ES2015形式的源码
Setp6：拷贝metadata.json及package.json到dist目录

具体形式如下：

![angular 组件代码1](https://github.com/jkhhuse/imgRepo/blob/master/img%20lib/angular_com_code1.png?raw=true)

![angular 组件代码2](https://github.com/jkhhuse/imgRepo/blob/master/img%20lib/angular_com_code2.png?raw=true)

## 组件库代码组成结构

![angular 组件库工程目录1](https://github.com/jkhhuse/imgRepo/blob/master/img%20lib/angular_com_c1.png?raw=true)

![angular 组件库工程目录2](https://github.com/jkhhuse/imgRepo/blob/master/img%20lib/angular_com_c2.png?raw=true)

上面两张图为组件库的代码组成部分，其中左图为`@angular/cli`生成的代码结构，右图为对src目录结构的改造。

其中src下分三个部分：asserts、demo和lib: 
- demo为组件库的文档示例，工程编写风格与`@angular/cli`指导一致；
- lib为组件库的代码，上文中的构建即针对lib目录进行，随后的`npm publish`也是针对lib build之后的dist目录进行；
- assets为公用资源，方便于组件开发及demo测试与展示。

assets作为公用资源的目的是，lib组件在发布的时候不希望带有额外的css与icon资源，以此可以减小发布包的大小以及符合单一职责设计目标。因而在使用组件库时可以从`npm`中分别获取css样式库、icon资源库和lib组件库的方式来构建一个工程。

## 组件库的编写与发布
相比传统开发web-app的方式，编写组件的方式需要作出一些改变：在组件的根目录需要添加`index.ts`文件，在文件中添加`service`及`module`的`export`代码：

![angular 组件库工程目录2](https://github.com/jkhhuse/imgRepo/blob/master/img%20lib/angular_com_pub1.png?raw=true)

发布还需要注意以下几点：
1)	每次发布时需要控制`package.json`中`version`的变化，否则`npm`不会接收发布的包
2)	需要拥有`npm`账号，在发布前先`npm login`
3)	若该包为私有，则在`package.json`中设置`private:true`

##  总结
根据业务需要及参考开源项目，总结和改进了angular组件库的脚手架，并结合了`@angular/cli`对`lib`包独立构建、打包、发布，能够较为方便的测试`lib`库和形成一个完整的doc页面。
