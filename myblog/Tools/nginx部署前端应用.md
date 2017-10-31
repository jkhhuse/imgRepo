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

编译 
安装相应的依赖：
 yum install pcre*
 yum install openssl*
 yum install zlib 
 yum install zlib-devel

./configure --sbin-path=/root/hsmart/ngnix/nginx --conf-path=/root/hsmart/ngnix/nginx.conf --pid-path=/root/hsmart/ngnix/nginx/nginx.pid --with-http_ssl_module --with-pcre=../pcre-8.41 --with-zlib=../zlib-1.2.11 --with-openssl=/usr/bin/openssl
./configure --prefix=/root/hsmart/ngnix/nginx-1.13.5 --with-http_ssl_module --with-http_spdy_module --with-http_stub_status_module --with-pcre



./configure --prefix=/root/hsmart/ngnix/nginx-1.13.5 -conf-path=/root/hsmart/ngnix/nginx-1.13.5/nginx.conf --pid-path=/root/hsmart/ngnix/nginx/nginx.pid --with-http_ssl_module --with-pcre=../pcre-8.41 --with-zlib=../zlib-1.2.11 --with-openssl=/usr/bin/openssl

http://www.jianshu.com/p/90951ac50432

http://www.nginx.cn/511.html

https://www.digitalocean.com/community/questions/nginx-404-error-with-existing-urls-angular-2-one-page-application-with-routing