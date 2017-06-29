#### flume简介
source、sink、channel等

#### flume使用
```shell
# 解压
> gzip -d apache-flume-1.5.2-bin.tar.gz
> tar xvf apache-flume-1.5.2-bin.tar
# conf中配置logs输出地址
# 修改配置文件
# 设置flume-ng的执行权限
> chmod +x flume-ng
# 设置flume-ng的字符集
> vim flume-ng 
> :set ff=unix
# 启动命令
> bin/flume-ng agent --conf conf --conf-file test.conf --name a1 -Dflume.root.logger=INFO,console
```

#### 测试使用
##### syslog发送，flume接收syslog
rsyslog配置
```shell
> vim /etc/rsyslog.conf
# 添加udp或者tcp配置
> *.* @192.168.174.132:514
> *.* @@192.168.174.132:10514
```
flume配置：
```shell
# 创建一个配置文件，启动flume
> touch test.conf
# 编辑文件
> vim test.conf
a1.sources = r1
a1.sinks = k1
a1.channels = c1

#a1.sources.r1.type = syslogudp
#a1.sources.r1.port = 514
#a1.sources.r1.host = localhost

a1.sources.r1.type = syslogtcp
a1.sources.r1.port = 10514
a1.sources.r1.host = 192.168.174.132

a1.sinks.k1.type = logger

a1.channels.c1.type = memory
a1.channels.c1.capacity = 1000
a1.channels.c1.transactionCapacity = 100

# Bind the source and sink to the channel
a1.sources.r1.channels = c1
a1.sinks.k1.channel = c1

# 启动flume
```
测试；
```shell
# 查看端口是否连通
> telnet ip port

# 端口侦听(-l表示长时间监听)
> nc -l ip port 

# 抓包工具，查看指定IP与端口的网络内容，并输出到cap文件
> tcpdump tcp port xx and host xx -w xx.cap

# 查看网络连接状态
> netstat -apn
# 例子
[root@promote bcstream]# netstat -natpl | grep 131
tcp        0      0 192.168.174.131:22          192.168.174.1:60794         ESTABLISHED 2661/sshd           
tcp        0     52 192.168.174.131:22          192.168.174.1:61562         ESTABLISHED 2741/sshd           
tcp        0      0 192.168.174.131:36401       192.168.174.132:514         ESTABLISHED 1874/rsyslogd   

#监控
命令行添加-Dflume.monitoring.type=http -Dflume.monitoring.port=34545

#往本地端口发送UDP数据
> echo "test1" > /dev/udp/192.168.174.132/10514

#往远程UDP端口发送数据
> echo "test" | socat - udp4-datagram:192.168.1.80:5060
```

### 引用
> tcpdump的使用：http://www.cnblogs.com/ggjucheng/archive/2012/01/14/2322659.html