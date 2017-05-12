### FileBeat5.2.2安装部署记录

##### 1.简介
Beats包含众多的套件，如FileBeat、HeatBeat等。
FileBeat设计以可靠性与低延迟出发，是一个资源友好型的agent服务，非常适合抓取服务端的日志文件。

##### 2.安装
可以通过rpm进行安装
```shell
curl -L -O https://artifacts.elastic.co/downloads/beats/filebeat/filebeat-5.2.2-x86_64.rpm
sudo rpm -vi filebeat-5.2.2-x86_64.rpm
```

##### 3.配置
```shell
vim /etc/filebeat/filebeat.yml
```
- 定义日志文件路径
```shell
filebeat.prospectors:
- input_type: log
  paths:
    - /var/log/*.log
```
*.log说明filebeat会抓取所有/var/log下的.log日志文件
- 定义beat的output为ES
```shell
hosts: ["192.168.1.42:9200"]
```

##### 3. 配置
```shell
# 指定服务端的端口号
#server.port: 5601

# 指定host地址，默认为"localhost"，当需要外部访问时，设置一个非回显地址.
#server.host: "localhost"

# 用于当配置代理时指定一个路径，会影响kibana访问的URL地址，不能以/结尾.
#server.basePath: ""

# 来自服务端请求的最大负载(字节).
#server.maxPayloadBytes: 1048576

# Kibana服务的名称.
#server.name: "your-hostname"

# Kibana默认的主页地址.
#server.defaultRoute: "/app/kibana"

# ES服务地址.
#elasticsearch.url: "http://localhost:9200"

# 设置为true时，kibana使用server.host中的配置；设置为false时，kibana使用hostname访问。
#elasticsearch.preserveHost: true

# Kibana在ES中保存搜索条件、可视化设置、仪表盘等信息.
#kibana.index: ".kibana"

# 默认加载的应用.
#kibana.defaultAppId: "discover"

# 如果ES端设置有基础的权限访问控制,kibana端则使用这个用户名/密码去访问ES。kibana的用户需要由ES的访问权限。
#elasticsearch.username: "user"
#elasticsearch.password: "pass"
# Paths to the PEM-format SSL certificate and SSL key files, respectively. These
# files enable SSL for outgoing requests from the Kibana server to the browser.
#server.ssl.cert: /path/to/your/server.crt
#server.ssl.key: /path/to/your/server.key

# Optional settings that provide the paths to the PEM-format SSL certificate and key files.
# These files validate that your Elasticsearch backend uses the same key files.
#elasticsearch.ssl.cert: /path/to/your/client.crt
#elasticsearch.ssl.key: /path/to/your/client.key

# Optional setting that enables you to specify a path to the PEM file for the certificate
# authority for your Elasticsearch instance.
#elasticsearch.ssl.ca: /path/to/your/CA.pem

# To disregard the validity of SSL certificates, change this setting's value to false.
#elasticsearch.ssl.verify: true

# Time in milliseconds to wait for Elasticsearch to respond to pings. Defaults to the value of
# the elasticsearch.requestTimeout setting.
#elasticsearch.pingTimeout: 1500

# Time in milliseconds to wait for responses from the back end or Elasticsearch. This value
# must be a positive integer.
#elasticsearch.requestTimeout: 30000

# List of Kibana client-side headers to send to Elasticsearch. To send *no* client-side
# headers, set this value to [] (an empty list).
#elasticsearch.requestHeadersWhitelist: [ authorization ]

# Header names and values that are sent to Elasticsearch. Any custom headers cannot be overwritten
# by client-side headers, regardless of the elasticsearch.requestHeadersWhitelist configuration.
#elasticsearch.customHeaders: {}

# Time in milliseconds for Elasticsearch to wait for responses from shards. Set to 0 to disable.
#elasticsearch.shardTimeout: 0

# Time in milliseconds to wait for Elasticsearch at Kibana startup before retrying.
#elasticsearch.startupTimeout: 5000

# 指定kibana pid路径.
#pid.file: /var/run/kibana.pid

# kibana log路径.
#logging.dest: stdout

# 设置true阻止kibana打印日志.
#logging.silent: false

# 设置为true,kibana只打印error日志.
#logging.quiet: false

# 设置为true,kibana记录所有事件，包括系统使用信息与所有请求信息.
#logging.verbose: false

# 设置系统的性能监控周期，最小100ms，默认5000ms.
#ops.interval: 5000

```

##### 4. 启动ES



##### 5. 生产环境下的使用
- SSH
- 通过ES节点进行访问负载均衡
可以利用es的负载均衡特性来部署kibana，把es节点设置为协调节点：
```shell
1. 把kibana与es部署在同一个节点
2. 设置es节点为
node.master: false
node.data: false
node.ingest: false
3. 设置es节点加入es集群
cluster.name: "current_cluster"
4. 设置network.host与transport.host
network.host设置为kibana可以访问的地址，默认为localhost
transport.host设置为节点可以连接es集群的地址
5. 设置kibana可以访问到当前es
elasticsearch.url: "http://localhost:9200"
```

```shell
##切换到root账户
$ su root
$ rpm -e jdk (之前安装的jdk)
$ rpm -ivh jdk-8u121-linux-x64.rpm (安装)

##可以选择更新安装包
$ rpm -Uvh jdk-8u121-linux-x64.rpm (更新)

##设置环境变量
$ vim /etc/profile

##添加如下内容
export JAVA_HOME=/usr/java/jdk1.8.0_121
export CLASSPATH=.:$JAVA_HOME/lib/dt.jar:$JAVA_HOME/lib/tools.jar
export PATH=$PATH:$JAVA_HOME/bin

##立即生效
source /etc/profile
```
注意: ES的默认是运行在64位的JVM之上的，如果当前环境是32的JVM，那么需要把jvm.options中的-server移除掉，并且把线程堆栈大小-Xss1m调整为-Xss320k。

##### 2. ES安装
解压tar.gz包
```shell
$ tar -zxvf elasticsearch-5.2.2.tar.gz
```

##### 3. ES配置
ES5.2.2中配置文件包括：elasticsearch.yaml、log4j2.properties、jvm.options、scripts四个配置文件。

###### elasticsearch.yaml为ES的配置
```shell
# ---------------------------------- Cluster -----------------------------------
# 集群名称，用于同一网段不同集群的区分:
# cluster.name: my-application
#
# ------------------------------------ Node ------------------------------------
#
# 节点名称，节点名称使用后便无法修改:
# node.name: node-1
#
# 节点的属性:
#
# node.attr.rack: r1
#
#  ----------------------------------- Paths ------------------------------------
#
# 指定索引数据的存储路径(多个目录使用","号隔开):
#
# path.data: /path/to/data
#
# 指定日志文件的存储路径:
#
# path.logs: /path/to/logs
#
# 索引内存地址空间，防止es的内存发生置换，linux/Unix中使用mlockall方式、windows使用VirtualLock方式，
# mlocakall方式下，如果jvm或者shell会话请求分配超出所需的内存时，会被终止。在es启动后可以使用GET _nodes?filter_path=**.mlockall
# 来检查是否应用成功:
#
# bootstrap.memory_lock: true
#
# Elasticsearch performs poorly when the system is swapping the memory.
#
# ---------------------------------- Network -----------------------------------

# 设置绑定一个指定的IP (IPv4 or IPv6)、hostname、指定的特殊值等
# 默认被设置为127.0.0.1 和 [::1]，如果配置该项，es则认为当前es处在生产环境之下。
# （生产环境与开发环境的区别是：开发环境如果es配置错误则在日志中写入warning，但是es可以启动，但是生产环境下warning变为exception，且不可以启动）:
# network.host: xxx
#
# HTTP端口号，默认9200:
#
# http.port: 9200
#
# For more information, consult the network module documentation.
#
# --------------------------------- Discovery ----------------------------------

# 集群状态下，用于发现集群中的其他节点，可以填写hostname或者ip地址：
# The default list of hosts is ["127.0.0.1", "[::1]"]
#
# discovery.zen.ping.unicast.hosts: ["host1", "host2"]
#
# 阻止脑裂现象的发生，可以设置 (可以被选为master节点的数量/ 2 + 1):
#
# discovery.zen.minimum_master_nodes: 3
#
# For more information, consult the zen discovery module documentation.
#
# ---------------------------------- Gateway -----------------------------------
#
# Block initial recovery after a full cluster restart until N nodes are started:
#
# gateway.recover_after_nodes: 3
#
# For more information, consult the gateway module documentation.
#
# ---------------------------------- Various -----------------------------------
#
# Require explicit names when deleting indices:
#
# action.destructive_requires_name: true

```

###### 系统配置
- jvm环境配置
```text
##官方推荐配置：
Xms与Xms设置为相同
越大的堆内存被分配给ES，ES可以使用越多内存来缓存，但是太多的内存会导致长时间的垃圾回收暂停
Xms最好别超过物理内存的一半
Xms最好别超过32GB
分配26GB在大部分系统中是一个保守的范围，可以以XX:+UnlockDiagnosticVMOptions -XX:+PrintCompressedOopsMode来启动ES，
查看最优的内存分配空间：
heap address: 0x000000011be00000, size: 27648 MB, zero based Compressed
heap address: 0x0000000118400000, size: 28672 MB, Compressed Oops with base: 0x00000001183ff000
```
- file Descriptors
只有在Mac和Linux中需要注意此项，ES会使用大量文件句柄，超出限制会导致文件丢失。
需要设置打开的文件限制大于65536或者更高：
```shell
$ su root
$ vim /etc/security/limits.conf
### 添加
currentuser  -  nofile  65536
```

- 虚拟内存
默认操作系统的mmap设置较低，会导致内存溢出：
```shell
$ vim /etc/sysctl.conf
##添加
vm.max_map_count=262144
$ sysctl vm.max_map_count
```

- 线程数量
保证ES能够创建不低于2048个线程：
```shell
$ su root
$ vim /etc/security/limits.conf
### 添加
currentuser  -  nproc  2048
```

##### 4. ES访问
network.host:9200

##### 遇到的问题
1. centOS6不支持SecComp
在elasticsearch.yml中配置bootstrap.system_call_filter为false:
bootstrap.system_call_filter: false


参考：
https://www.elastic.co/guide/en/elasticsearch/reference/current/setup.html
http://yemengying.com/2016/03/18/Elasticsearch%E9%85%8D%E7%BD%AE%E9%A1%B9-Local-gateway-HTTP-Indices-Network-Settings%E6%A8%A1%E5%9D%97%E9%85%8D%E7%BD%AE/
https://github.com/elastic/elasticsearch/issues/22899

<meta http-equiv="refresh" content="5">
