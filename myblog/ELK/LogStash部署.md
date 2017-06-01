### Logstash安装部署记录

##### 1. 版本支持
Logstash版本需要与ES保持一致，至少是第二位版本上的一致，否则在生产环境下无法使用。
Logstash分为三个模块：Input、Filter、Output。

##### 2. 安装
```shell
$ gzip -d logstash-5.2.2.tar.gz
$ tar xvf logstash-5.2.2.tar
```

##### 3. 例子
```shell
cd logstash-5.2.2
bin/logstash -e 'input { stdin { } } output { stdout {} }'
```
-e 可以通过命令行指定配置
输入：hello world
输出：2017-03-09T09:47:45.813Z promote.cache-dns.local hello world
Logstash在结果中添加了timestamp和ip地址