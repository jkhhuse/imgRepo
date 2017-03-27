#### 1.创建账户
安装完成后创建账户
```shell
$ git config --global user.name "Your Name"
$ git config --global user.email "email@example.com"
```
可以通过如下命令查看git的配置
```shell
$ git status
```

#### 2.创建版本库
```shell
$ cd dir
$ mkdir repo
$ git init
```
会在repo目录下生成一个.git文件，用于跟踪/管理版本库。

#### 3.添加文件
```shell
$ touch readme.txt
$ git add readme.txt

$ git status
On branch master

Initial commit

Changes to be committed:
  (use "git rm --cached <file>..." to unstage)

        new file:   readme.txt
        new file:   user git/status.jpg

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git checkout -- <file>..." to discard changes in working directory)

        modified:   readme.txt
```


#### 3.提交文件
```shell
$ git commit -m "append"
[master (root-commit) 1e57831] append
 2 files changed, 0 insertions(+), 0 deletions(-)
 create mode 100644 readme.txt
 create mode 100644 user git/status.jpg
```
使用git log命令可以看到提交的日志

#### 4.状态变化
新建一个文件，未添加前状态为“Untracked”，即未被Git版本追踪：
```shell
$ git status
On branch master
Untracked files:
  (use "git add <file>..." to include in what will be committed)

        readme.txt

nothing added to commit but untracked files present (use "git add" to track)
```
添加文件
```shell
$ git status
On branch master
Changes to be committed:
  (use "git reset HEAD <file>..." to unstage)

        new file:   readme.txt
```
commit一个文件：
```shell
jk@jk-pc /cygdrive/e/learn/git/img
$ git status
On branch master
nothing to commit, working tree clean
```

#### 5.版本回退
通过git log查看提交记录
```shell
$ git log
commit 1e5783173a17ea5fc2cd9849cfa74214ef2da4e8
Author: name <email@example.com>
Date:   Mon Mar 27 04:57:05 2017 +0100

    append
```
使用reset命令，回退版本
```shell
$ git reset --hard 1e5783173a17ea5fc2cd9849cfa74214ef2da4e8
```

#### 6.清空工作区文件的状态
```shell
$ git checkout -- readme.txt
```

#### 7.删除命令
```shell
$ git rm readme.txt
```

#### 8.远程仓库
##### 无密码配置
i) 生成ken-gen
$ ssh-keygen -t rsa -C "youremail@example.com"
window下把生成的私钥(id_rsa)与公钥(id_rsa.pub)y以及known_hosts拷贝到cygwin目录下：
cp /C/Users/user_name/.ssh/* /home/user_name/.ssh/

ii) 配置GitHub SSH Keys
拷贝公钥到->GitHub->Account->Settings->SSH Keys

##### 本地仓库与远程仓库关联
i) 本地创建仓库
```shell
$ mkdir repo
$ cd repo
$ git init
$ touch readme.txt
$ git add readme.txt
$ git commit -m "test"
```
ii) 创建远程仓库
在Github中创建一个同名仓库
iii) 把本地仓库内容推送到远程仓库
```shell
$ git remote add origin git@github.com:jkhhuse/repo.git
```
iv) 把本地仓库内容推送到远程仓库
```shell
$ git push -u origin master
```
加上了-u参数，Git不但会把本地的master分支内容推送的远程新的master分支，
还会把本地的master分支和远程的master分支关联起来，在以后的推送或者拉取时就可以简化命令。

##### 克隆远程仓库到本地
```shell
$ git clone git@github.com:jkhhuse/repo.git
```

#### 9.分支管理
##### 分支操作
i) 创建分支
```shell
$ git checkout -b dev
#相当于
$ git branch dev #创建分支
$ git checkout dev #切换到dev分支
```
ii) 查看分支
```shell
$ git branch
* dev
  master
```
*表示当前操作的branch
iii) 合并分支
切换到master后，合并dev分支
```shell
$ git checkout master
$ git merge dev
```
iv) 删除分支
除非需要将分支推送到远程仓库，否则分支就是个人所见的。
```shell
$ git branch -d dev
```
v) 查看分支
```shell
$ git branch
```

##### 更新本地仓库
```shell
$ git pull
```
如果出现冲突则，可以使用diff命令查看差异。
```shell
git diff <source_branch> <target_branch>
```

##### 冲突处理
在merge过程中，出现的冲突时：
```shell
$ git merge feature1
error: Merging is not possible because you have unmerged files.
hint: Fix them up in the work tree, and then use 'git add/rm <file>'
hint: as appropriate to mark resolution and make a commit.
fatal: Exiting because of an unresolved conflict.
```
Git用<<<<<<<，=======，>>>>>>>标记出不同分支的内容：
```shell
<<<<<<< HEAD
Creating a new branch is quick & simple.
=======
Creating a new branch is quick AND simple.
>>>>>>> feature1
```
修改出现冲突的文件，重新add并commit。
使用git log命令可以看到分支并不的情况：
```shell
$ git log --graph --pretty=oneline --abbrev-commit
*   59bc1cb conflict fixed
|\
| * 75a857c AND simple
* | 400b400 & simple
|/
* fec145a branch test
```
最后删除分支


#### 10.标签管理
i) 切换到需要打tag的分支：
```shell
$ git branch
$ git checkout master
```
ii) 使用tag命令打tag：
```shell
$ git tag v1.0
```
iii) 使用tag查看所有tag：
```shell
$ git tag
```
iv) 对历史commit打tag：
```shell
$ git log --pretty=oneline --abbrev-commit
$ git tag v0.9 id前10个字符
```
v) 设置tag的说明：
```shell
$ git tag -a v0.1 -m "version 0.1 released" 3628164
```
vi) 删除tag：
```shell
$ git tag -d v0.1
```
vii) 推送tag到远程：
例如需要把本地的tag推送到github中：
```shell
git push origin v1.0
```
那么在github项目的release中就会出现刚刚推送的tag。
也可以一次性推送全部的tag：
```shell
$ git push origin --tags
```
如果需要删除远程tag，那么需要先删除本地tag，然后push到远程来删除远程仓库中的bug：
```shell
$ git tag -d v1.0
$ git push origin :refs/tags/v1.0
```

#### 参考内容：
> Git tutorial: https://lvwzhen.gitbooks.io/git-tutorial
> git - 简明指南: http://rogerdudler.github.io/git-guide/index.zh.html
