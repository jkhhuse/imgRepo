#### rsyslog简介
rsyslog中主要存在：modules、templates、Actions、Filter等概念
modules通常包括Input、OutPut模块，有些是内置的，有些则需要另行安装；
rsyslog版本分为v5、v7、v8，v5比较陈旧，文档不是很完善，一般推荐使用v7或者v8；
rsyslog支持多种插件与协议：
![rsyslog图片](https://github.com/jkhhuse/imgRepo/tree/master/img lib/rsyslog-features-imagemap.png)

#### rsyslog安装
许多发行版linux都默认使用rsyslog，本次使用centos6.8来测试rsyslog的使用。
centos6.8默认安装了5.8x版本的rsyslog，rsyslog版本之间差异较大，可以选择安装比较新的版本。
```shell
#下载rsyslog.repo
> cd /etc/yum.repos.d/
> wget  http://rpms.adiscon.com/v8-stable/rsyslog.repo
#安装rsyslog
> yum clean all
> yum makecache
> yum install rsyslog
#查看rsyslog版本号
> rsyslogd -v
#重启rsyslog
service rsyslog restart
```


#### rsyslog配置文件
> cat /etc/rsyslog.config

默认配置文件如下：
```shell
#### MODULES ####
#默认支持logger命令和内核日志
module(load="imuxsock") # provides support for local system logging (e.g. via logger command)
module(load="imklog")   # provides kernel logging support (previously done by rklogd)
#module(load"immark")  # provides --MARK-- message capability

# 支持UDP日志转发，更多信息查看http://www.rsyslog.com/doc/imudp.html
#module(load="imudp") # needs to be done just once
#input(type="imudp" port="514")

# 支持TCP日志转发，更多信息查看http://www.rsyslog.com/doc/imtcp.html
#module(load="imtcp") # needs to be done just once
#input(type="imtcp" port="514")

#### GLOBAL DIRECTIVES ####

# 使用默认时间戳格式
$ActionFileDefaultTemplate RSYSLOG_TraditionalFileFormat

# File syncing capability is disabled by default. This feature is usually not required,
# not useful and an extreme performance hit
#$ActionFileEnableSync on

# Include all config files in /etc/rsyslog.d/
$IncludeConfig /etc/rsyslog.d/*.conf


#### RULES ####

# Log all kernel messages to the console.
# Logging much else clutters up the screen.
#kern.*                                                 /dev/console

# Log anything (except mail) of level info or higher.
# Don't log private authentication messages!
*.info;mail.none;authpriv.none;cron.none                /var/log/messages

# The authpriv file has restricted access.
authpriv.*                                              /var/log/secure

# Log all the mail messages in one place.
mail.*                                                  /var/log/maillog
# Log cron stuff
cron.*                                                  /var/log/cron

# Everybody gets emergency messages
*.emerg                                                 :omusrmsg:*

# Save news errors of level crit and higher in a special file.
uucp,news.crit                                          /var/log/spooler

# Save boot messages also to boot.log
local7.*                                                /var/log/boot.log


# ### begin forwarding rule ###
# The statement between the begin ... end define a SINGLE forwarding
# rule. They belong together, do NOT split them. If you create multiple
# forwarding rules, duplicate the whole block!
# Remote Logging (we use TCP for reliable delivery)
#
# An on-disk queue is created for this action. If the remote host is
# down, messages are spooled to disk and sent when it is up again.
#$WorkDirectory /var/lib/rsyslog # where to place spool files
#$ActionQueueFileName fwdRule1 # unique name prefix for spool files
#$ActionQueueMaxDiskSpace 1g   # 1gb space limit (use as much as possible)
#$ActionQueueSaveOnShutdown on # save messages to disk on shutdown
#$ActionQueueType LinkedList   # run asynchronously
#$ActionResumeRetryCount -1    # infinite retries if host is down
# remote host is: name/ip:port, e.g. 192.168.0.1:514, port optional
#*.* @@remote-host:514
# ### end of the forwarding rule ###
```



#### 示例1(B接收远程机器A发送的UDP请求信息)
##### A机器，配置转发
远程地址中，UDP使用@,TCP使用@@
```shell
*.* @192.168.174.132:514
module(load="imuxsock") 
module(load="imklog")  
$ActionFileDefaultTemplate RSYSLOG_TraditionalFileFormat
$IncludeConfig /etc/rsyslog.d/*.conf
*.info;mail.none;authpriv.none;cron.none                /var/log/messages
authpriv.*                                              /var/log/secure
mail.*                                                  /var/log/maillog
cron.*                                                  /var/log/cron
*.emerg                                                 :omusrmsg:*
uucp,news.crit                                          /var/log/spooler
local7.*                                                /var/log/boot.log
```

##### B机器，配置接收
配置两个input module，imudp、imtcp
```shell
module(load="imuxsock") 
module(load="imklog")  
module(load="imudp") 
input(type="imudp" port="514")
module(load="imtcp") 
input(type="imtcp" port="514")
$ActionFileDefaultTemplate RSYSLOG_TraditionalFileFormat
$IncludeConfig /etc/rsyslog.d/*.conf
*.info;mail.none;authpriv.none;cron.none                /var/log/messages
authpriv.*                                              /var/log/secure
mail.*                                                  /var/log/maillog
cron.*                                                  /var/log/cron
*.emerg                                                 :omusrmsg:*
uucp,news.crit                                          /var/log/spooler
local7.*                                                /var/log/boot.log
```

##### 测试
```shell
# A机器 使用tail -f查看日志输入
> tail -f /var/log/messages
> logger xxx
# B机器查看接收到的日志
> tail -f /var/log/messages
```

#### 示例2(更改日志输出格式)
```shell
$template myFormat,"%rawmsg%\n"
$ActionFileDefaultTemplate myFormat
```

#### 示例3(输入日志到文件)
```shell
action(type="omfile" dirCreateMode="0700" FileCreateMode="0644"
       File="/var/log/test123")
```

#### 示例4(大批量数据的高性能)接收方式)
建议使用较新版本的linux内核，因为其支持recvmmsg()调用，能够提升UDP接收的速度并减低CPU的利用率；
imptcp模式依赖于Linux支持TLS，否则使用imtcp代替；
使用buffered模式，保证缓冲区满后才写入，或者当写文件关闭后写入；
在使用过程中，调整threads在2-4之间与batchSize大小，来查看处理性能。
```shell
# load required modules
module(load="imudp" threads="2"
       timeRequery="8" batchSize="128")
module(load="imptcp" threads="3")

# listeners
# repeat blocks if more listeners are needed
# alternatively, use array syntax:
# port=["514","515",...]
input(type="imudp" port="514"
      ruleset="writeRemoteData")
input(type="imptcp" port="10514"
      ruleset="writeRemoteData")

# now define our ruleset, which also includes
# threading and queue parameters.
ruleset(name="writeRemoteData"
        queue.type="fixedArray"
        queue.size="250000"
        queue.dequeueBatchSize="4096"
        queue.workerThreads="4"
        queue.workerThreadMinimumMessages="60000"
       ) {
    action(type="omfile" file="/var/log/remote.log"
           ioBufferSize="64k" flushOnTXEnd="off"
           asyncWriting="on")
}
```

#### 附录
##### 更换yum源
```shell
#备份
> cd /etc/yum.repos.d
> mv ...repo ...repo.backup
#下载新的源，常见的如ali、sina、163
> wget ...
#更新yum
> yum makecache
> yum -y update
```

