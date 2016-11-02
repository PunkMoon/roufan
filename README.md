# Ionic-Fanfou
基于angular及ionic的一款饭否第三方WebApp

## 介绍
1.需要与[node-xauth-fanfou](https://github.com/birdplane9527/node-xauth-fanfou)配合使用。<br/>
2.在```www/js/config.js```下配置请求$http请求地址。默认为：
```
config={'REQUEST_URL':
{
  token: 'http://localhost:3000/token',
  get: 'http://localhost:3000/get',
  post:'http://localhost:3000/post'
}};
```
<br/>
3.在安装ionic的前提下进入根目录，运行```npm install```,安装依赖模块。<br/>
4.在```ionic serve```启动项目前，先启动node-xauth-fanfou项目。<br/>
