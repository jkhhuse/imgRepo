### 配置chrome  
添加一个launch.json文件:  
```json
{
    "version": "0.2.0",
    "configurations": [{
        "name": "Launch",
        "type": "chrome",
        "request": "launch",
        "url": "http://localhost:4200",
        "runtimeExecutable": "F:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
        "runtimeArgs": [
            "--remote-debugging-port=9222"
        ],
        "cwd": ".\\wwwroot\\"
    }]
}
```

### 开启调试  
1. 把chrome进程关闭  
2. vs code使用ng serve启动angular项目  
3. 启动调试：![vs debug](https://github.com/jkhhuse/imgRepo/blob/master/img%20lib/vsdebug.png)  


### 参考
> [Visual Studio Code, Debugger For Chrome and ASP.NET 5](http://mobilemancer.com/2015/11/23/vs-code-debugger-for-chrome-and-asp-net-5/)
> [connect ECONNREFUSED 127.0.0.1:9222](https://github.com/Microsoft/vscode-chrome-debug#cannot-connect-to-the-target-connect-econnrefused-1270019222)
