1. 移除Tomcat路径中的应用名称
在conf/server.xml中修改如下
```xml
<Host name="localhost"  appBase="webapps/application"
            unpackWARs="true" autoDeploy="true">
<Context path="" docBase="/home/bcstream/lm2/apache-tomcat-7.0.64/webapps/application" debug="0" reloadable="true"/>
```
修改完后重启服务

2. 