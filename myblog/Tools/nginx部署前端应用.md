#### 常用于Node的静态文件服务器
```shell
browser-sync
http-server
anywhere
webpack-dev-server
nginx
```
#### nginx启停
```shell
start nginx
nginx -s stop
nginx -s reload
```

#### 配置http server
```conf
server {
	listen       80;
	server_name  localhost;

	#charset koi8-r;

	#access_log  logs/host.access.log  main;

	location / {
	    root   html/dist;
	    index  index.html index.htm;
	}

	#error_page  404              /404.html;

	# redirect server error pages to the static page /50x.html
	#
	error_page   500 502 503 504  /50x.html;
	location = /50x.html {
	    root   html;
	}
}
```
