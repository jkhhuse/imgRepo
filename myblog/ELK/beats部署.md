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
