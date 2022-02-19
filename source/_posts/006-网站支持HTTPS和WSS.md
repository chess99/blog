---
title: 支持WSS
pid: 6
date: 2018-06-14 09:58:14
tags:
  - SSL
  - HTTPS
  - WSS
categories:
  - 大前端
---

使用`Let’s Encrypt`提供的免费证书,
基于`node.js`的`ws`模块

<!-- more -->

# 步骤

## 购买证书

见 [使用购买的 SSL 证书](https://docs.iredmail.org/use.a.bought.ssl.certificate-zh_CN.html)
或者使用免费的证书: [Let’s Encrypt](https://letsencrypt.org/) 的 [SSL For Free](https://www.sslforfree.com/) . (只有三个月有效期, 需要定期更新)

## 合并ca_bundle.crt

ca_bundle.crt的作用见 [链接](http://nginx.org/en/docs/http/configuring_https_servers.html#chains)

这里直接合并进`certificate.crt`了
其他服务使用见相应的配置文档..

- 推荐的存放路径

在 RHEL/CentOS 系统上：`server.crt` 和 `server.ca-bundle` 上传至 `/etc/pki/tls/certs/` ，`server.key` 上传至 `/etc/pki/tls/private/`。
在 Debian/Ubuntu， FreeBSD 系统上： `server.crt` 和 `server.ca-bundle` 上传至 `/etc/ssl/certs/`， `server.key` 上传至`/etc/ssl/private/`。
在 OpenBSD 系统上：上传至 `/etc/ssl/`。

## 创建wss服务

  这里使用`node.js`的`ws`模块

```JavaScript
var options = {
  key: fs.readFileSync(keypath),
  cert: fs.readFileSync(certpath),
  passphrase:'1234'//如果秘钥文件有密码的话，用这个属性设置密码
};

var server = https.createServer(options, function (req, res) {
  console.log((new Date()) + ' Received HTTP(S) request for ' + req.url);

  //要是单纯的https连接的话返回403
  res.writeHead(403);
  res.end("This is a  WebSockets server!\n");
}).listen(44301);


//把创建好的https服务器丢进websocket的创建函数里，ws会用这个服务器来创建wss服务
//同样，如果丢进去的是个http服务的话那么创建出来的还是无加密的ws服务
var wss = new ws.Server({ server: server });

wss.on('connection', function (wsConnect) {
  console.log('connection')
  wsConnect.on('message', function (message) {
    console.log('message', message);
  });
});
```

# 参考链接

[30分钟让网站支持HTTPS](http://www.codeceo.com/article/add-https-to-website.html)
[nginx - Configuring HTTPS servers](http://nginx.org/en/docs/http/configuring_https_servers.html)
[用WS模块创建加密的WSS服务](https://blog.csdn.net/xiuzhentianting/article/details/56012922)
[ws - External HTTP/S server](https://github.com/websockets/ws#external-https-server)