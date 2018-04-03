### 1.	什么是前端包管理器？
谈到包管理器，大家一定不陌生，例如大名鼎鼎的rpm、maven。前端也有包管理器，不过与服务端不同的是，前端的包管理器有点让人眼花缭乱：bower、npm、yarn、cnpm、jspm、component、spm等。在搭建新项目的seed时，这么多包管理器该怎么选择？其实，本文的标题已经告诉你答案了。  
下面简单介绍一下上述包管理都分别有哪些特性。  
- bower：
首先是包安装机制，由于从bower install的包，理想状态下都是已经构建过的资源，这些包之间不会有依赖关系，从而实现了扁平化的特点。其次，在bower中注册包，开发者首先要先在github中创建一个项目，随后使用bower register命令在bower注册这个github项目，由于github项目中通常都是存放源码，众多项目通常会把构建后的资源重新整理为一个仓库，用来为bower提供服务。此外，bower未提供构建功能，不过可以通过grunt、gulp类似工具提供构建支持。最后，bower是一个中立的包管理器，最初实现时没有对bower管理的包做模块化的限制。
bower最初的设计使得bower更像是一个包地址的存放中心，当然现在的bower在github作为下载的目标源外，也提供了自身的仓库。bower看似简单易用，但是由于未限制前端的模块化方式，导致使用bower的开发者仍要考虑bower install后的模块化的种种问题。bower在后续演进过程中增加了UMD、ES6、yui等模块化方案的支持，残酷的是bower已不再“流行”。  

- jspm：
设计之初就考虑到了前端的众多模块化的支持，包括ES6、AMD、commonjs和globals等模块化方案，jspm作为SystemJS的包管理器，依赖于SystemJS可以方便地加载各类模块化写的包。此外jspm还提供了npm与github等多种源来安装包。综合来看，jspm提供多模块化方案的加载、构建、集成了多种仓库，是一个完备的包管理工具。但是相比于commonjs模块化方案的npm生态圈，jspm的比较明显的优势是提供多种模块化方案的支持，随着commonjs方案下的Webpack广泛应用，并且CommonJS转换为ES5的早已不是难题。从这个角度来看，jspm代替npm的可能性非常低。  

- component、spm已然不在包管理器舞台活跃了，此处不再比较。  

- npm：
npm最初是用于服务端nodejs的包管理器，遵循node.js的commonjs标准，但是随着前端社区的发展，bowers端也开始使用npm作为包管理。  
前端开发者们可以自由地在npm上获取和上传包，应用可以在package.json中定义依赖包的元数据信息。npm中的包通常都设计用来解决单一的问题，这样设计的好处是开发者当需要某种功能时，只需要在npm中找到对应功能的包并安装它，这使得团队协助更加便捷。npm支持scripts、语义化版本、包管理仓库、丰富的命令，涵盖了包管理器必须具备的功能。  

- yarn与cnpm：  
yarn与cnpm都为npm的一个变种，或者可以说都是基于npm开发，解决npm使用过程中的某个“痛点”。例如，yarn解决了npm cache及版本锁定等问题；cnpm是淘宝同步了npm镜像源的一个npm替代工具，解决国内用户使用npm下载依赖中超时等问题，cnpm支持了npm中除了publish外的绝大部分命令。  

小结：  
目前npm已经超越maven等包管理器成为世界上注册最多包及下载量最多的软件仓库，npm也成为前端包管理解决方案中“事实上”的标准。npm功能齐全，且伴随着webpack等工具的发展，使用npm几乎没有各种后顾之忧。所以推荐在项目中切换为使用npm/yarn/cnpm作为唯一的包管理器。  

下文将对npm的使用、配置项、缓存、yarn、依赖等做一个概述。  

### 2.	npm的常用命令简介
```shell
npm install package [--save | --save-dev]
```
在本地安装包，--save表示把该包作为本项目用于开发/生产环境的依赖，执行命令后会把包信息放在package.json中的dependencies项下。--save-dev把该包作为本项目中的开发/测试环境下的依赖，执行命令后会把包信息放在package.json中的devDependencies项下。最新的v5中npm install package --save 不再为必须项了。  
```shell
npm install -g package
```
-g表示在全局安装包，类似于把当前包添加到系统环境变量中，例如npm install -g gulp，那么在使用gulp命令时，则简化为gulp xx。不过全局安装并非必须，用户仍然本地安装，并在本地项目下node_modules中找到指定工具路径来执行命令，例如node_modules/gulp xx。  
```shell
npm uninstall package 卸载包
npm update package 更新包
npm ls - depth=0 -g 查看全局安装的包
npm init 新建一个npm项目，会生成一个package.json
```  

### 3.	package.json  
package.json是包依赖的管理文件，它包含了当前项目的基本信息如name、version、description、author、license等；依赖包的语义化版本信息；脚本定义等。  
简化的package.json如下：  
![package.json](https://github.com/jkhhuse/imgRepo/blob/master/img%20lib/npm-package.json.png)  
其中scripts用于定义npm中的可执行脚本，用户可以自定义一些测试、构建、语法检查等命令。例如本例npm run prod可以执行webpack -p命令。  
####  各种依赖解释：
在查看项目中的package.json时，经常看到如下属性：dependencies、devDependencies、peerDependencies、bundledDependencies、optionalDependencies等各类dependencies，下面将介绍一下各类dependencies的用途：  
-	dependencies：用于指定项目开发与生产环境依赖的包，更具体一点可以指定包的语义化版本、git地址、tarball URL等。  
-	devDependencies：用于指定项目测试环境或者构建项目时所依赖的包，该部分的包不会被打包进在项目的生产环境。  
-	peerDependencies：用于指定当前包兼容的宿主版本，通常出现在插件中，例如jquery插件中通常不包含jquery，但是插件必须依赖于某个jquery（插件的宿主）特定版本运行，因而需要通过指定peerDependencies来提示用户安装兼容的宿主版本。  
-	bundledDependencies：可以把在bundledDependencies中指定的依赖打包到项目tgz包中，较少被使用。例如：从left-pad删除事件中，把依赖包与项目一起打包，则免收此次事件的影响。不过，left-pad事件后npm上传的包不再可以随意删除了。  
-	optionalDependencies：可选依赖指定的依赖包安装失败，项目仍然能够正常运行，不过为了项目的健壮性，仍建议在程序中增加包依赖是否缺失的判断及处理。  

### 4.	语义化版本  
在package.json中的dependencies项下，通常可以看到包名后带上了版本号，这个版本号的书写方式则称之为语义化版本。  
npm的语义化版本规定为：  
		
|名称|解释|示例|
|--------|:--------- |:--------|
|patch	|代表此次更新为修复bug	                   | 1.0、1.0.x、~1.0.4
|minor	|代表此次更新新增了新的特性                |1、1.x、^1.0.4
|major  |代表重大升级，此次更新可能会破坏向后兼容性 |*、x、2.0.0

语义化版本一方面引导npm包开发者的迭代发布流程不会颠覆现有用户的使用习惯，另一方便也给用户提供了灵活的升级习惯，保守的用户在package.json中可以定义包的语义化版本为patch，那么执行npm update不会再担心某个依赖包的升级导致整个项目运行异常；同时勇于尝试的用户则希望使用最新的功能，那么他们可以使用minor甚至major。  
语义化版本带来的“副作用”就是版本锁定问题，5.2节将描述版本锁定问题的由来及解决方法。  

### 5.	npm的另一面
npm作为使用次数最多的包管理器，管理着最庞大的包，但是npm发展之路却颇为曲折，甚至可以说npm很差劲。本节将分析npm的诸多弊端，以及社区做出的改进：  
#### 5.1 深层包依赖树问题  
上文提到package.json记录了当前npm包的依赖信息，一个npm包通常会有多个依赖包。而依赖的npm包也会存在package.json文件，因而npm install之后的node_modules是一个层次很深树状依赖结构，带来例如维护、更新等一系列的“并发症”，导致node_modules体积膨胀严重，更新性能底下，此外国内用户连接npm仓库不太稳定，都给npm造成一种“低端、难用、不可靠”的映象。针对此种情况，npm及开源社区做出了一系列的解决方法：  

最主要的是npm V3做出的扁平化依赖处理，主要思想可以从下图看出：  
图1为App项目的包依赖关系；图2为npm install一个E依赖包，并且E自身依赖于B v1.0；图3为install之后的包依赖关系图。从图3可以看出B v1.0已经存在于node_modules中，那么npm不会再在E包添加一个B依赖。  

图4为一个更新操作，用户把项目中A依赖包从v1.0升级到v2.0，A v2.0依赖了B v2.0；图5为更新后的依赖关系；图6把E升级到v2.0，E v2.0依赖于B v2.0；图7此时的B v1.0没有依赖会被移除，而B v2.0会被移入第一层。  
![dependency1.json](https://github.com/jkhhuse/imgRepo/blob/master/img%20lib/npm-d1.png)  
当执行npm dedupe后，最终的依赖关系如下图所示，此时的App项目的依赖已经变为扁平的结构了：  
![dependency2.json](https://github.com/jkhhuse/imgRepo/blob/master/img%20lib/npm-d2.png)  
#### 5.2	语义化带来的依赖不确定问题  
上文提到了语义化带来的好处，但是语义化也带来了另外版本差异问题，即存在“我电脑上运行是没问题的”这样的不确定性。例如员工A机器中的package.json依赖为semver: *，npm install后semver版本为0.1。两年后，员工B接手了项目，npm install后，semver版本变成了6.2.0，这样就会导致两个员工的项目运行环境不一致。当然这个例子比较极端，事实上很多人都不会选择使用*来定义语义化，然而实际项目中的npm包之间的依赖非常复杂，且npm v3后，依赖包安装顺序的不同，也会导致不同环境下依赖关系出现差异。好在社区早已有了解决方案：锁定版本，做法是记录当前环境中包的版本，以便于在其他环境中重新安装后可以完全复现原有环境下的包依赖环境。  

锁定版本有三种方式：最初npm提供了shrinkwrap方案，不过需要工程师手动执行npm shrinkwrap来锁定版本，一旦工程师在改动后忘记执行该命令和上传shrinkwrap文件，那么可能导致文件与代码不同步。后来yarn提供了自动的版本锁定功能yarn.lock，最新的npm v5也通过默认package-lock.json来提供版本锁定支持。  

#### 5.3	离线安装问题  
npm的cache功能一直先天不足，主要包括：  
离线安装问题，可以通过--cache-min设置从缓存中安装包，当指定包不存在缓存目录，npm会连接仓库。但是当指定包已经存在于缓存目录中，npm也会发出连接请求，并且当服务器返回304时，不会重新下载tarball。如果某个包已经存在于缓存，但是版本低于要求，npm不会选择去仓库下载符合要求的版本，而会直接报错。  

包命中问题，npm只会从已解压的缓存目录中查询包，如果一个包的tarball版本已经存在于下载目录，npm也仍然需要重新去远程仓库下载。  

yarn的开源最初就是为了解决npm cache的问题，因为fb内部CI环境为了安全考虑，是无法连接互联网的，而npm始终无法做到离线安装。  

npm v5重写了cache模块，提供了--offline安装模式，提升了性能，添加了tarball的校验机制。由于重写了cache模块，在升级到v5后，需要执行npm clean cache来解决cache之间的不兼容问题。  

#### 6.	yarn是否革了npm的命？ 
yarn并不是npm的替代者，yarn install的源为npm。yarn瞄准npm的痛点，主要为版本锁定、性能、缓存、重试机制等痛点而开源，一定程度上推动了npm的发展。npm v5也参考了yarn做出了许多改进，解决了以往的大部分问题，甚至可以直接替代yarn。不过目前yarn仍然有其使用市场，社区有人对npm v5与yarn做了性能测试（github：npm-vs-yarn），npm v5的性能比起yarn还有一些差距，如下图。此外现存大量项目已经是yarn的忠实用户，所以短期之内yarn还是会一直演进，给npm用户带来更多的惊喜。  
![yarn-npm](https://github.com/jkhhuse/imgRepo/blob/master/img%20lib/yarn-npm.png)  

### 7.	总结
通过以上npm的介绍，大家一定觉得npm非常不靠谱，使用npm开发者都有同样的抱怨。然而随着yarn的开源以及npm v5的发布，npm正在成为一个优秀的包管理器，甚至是未来一定时期内“最佳的”的前端包管理器。不过，由于npm的历史问题，用户在使用npm的时候，推荐使用npm v3+和yarn混用或者直接使用npm v5版本。
