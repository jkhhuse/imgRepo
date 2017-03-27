### 安装插件及配置
使用Ctrl + Shift + P install Package分别安装以下插件

- View In browser
修改Setting - User中browser在对应OS中的安装位置：
```json
{
    "posix": {
        "linux": {
            "firefox": "firefox -new-tab",
            "chrome": "google-chrome",
            "chrome64": "google-chrome",
            "chromium": "chromium"
        
        "linux2": {
            "firefox": "firefox -new-tab",
            "chrome": "google-chrome",
            "chrome64": "google-chrome",
            "chromium": "chromium"
        },
        "darwin": {
            "firefox": "open -a \"/Applications/Firefox.app\"",
            "safari": "open -a \"/Applications/Safari.app\"",
            "chrome": "open -a \"/Applications/Google Chrome.app\"",
            "chrome64": "open -a \"/Applications/Google Chrome.app\"",
            "yandex": "open -a \"/Applications/Yandex.app\""
        }
    },
    "nt": {
        "win32": {
            "firefox": "F:\\Program Files (x86)\\Mozilla Firefox\\firefox.exe -new-tab",
            "iexplore": "F:\\Program Files\\Internet Explorer\\iexplore.exe",
            "chrome": "F:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
            "chrome64": "F:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
            "yandex": "%Local AppData%\\Yandex\\YandexBrowser\\browser.exe"
        }
    },

    "browser": "chrome64"
}
```
- Markdown Editing
修改Markdown GFM Settings - User配置
warp_width为移除插件在编辑markdown文件时左侧出现空白区域的问题
color_scheme为设置背景色
```json
{
    "draw_centered": true,
    "word_wrap": true,
    "wrap_width": 210,
    "rulers": [],
    "color_scheme": "Packages/MarkdownEditing/MarkdownEditor-Dark.tmTheme",
}
```
- Markdown Preview
- Auto Save
设置自动保存时
```json
{
    "auto_save_delay_in_seconds": 1,
}
```

### 创建Markdown文件
使用Ctrl + N新建一个文件
在正文中输入文字
Ctrl + Shift + P 输入ssm(set syntax: markdown)
Ctrl + S 保存为mdown文件

### 实时编辑/查看Markdown文件
1. 设置快捷键
```json
[
    {"keys": ["alt+m"], "command": "markdown_preview", "args": { "target": "browser"}}
]
```
2. 编辑Markdown文件
在文件末尾添加：<meta http-equiv="refresh" content="1">来设置实时刷新的频率
3. 设置定时保存文件
Ctrl + Shift + P 输入auto，选择Save Current File Only
4. 打开html文件
使用快捷键Alt + M 打开
5. 在html页面选择Open In Brower

通过以上设置，可以实现定时保存markwodn文件，并同步刷新在浏览器端的效果。
<meta http-equiv="refresh" content="1">

