---
title: 使用相对路径发布vue-cli项目
pid: 3
date: 2018-06-06 19:28:19
tags:
  - Vue
  - vue-cli
categories:
  - 大前端
---

项目根目录添加`vue.config.js`, 编辑`baseUrl`

<!-- more -->

# > v3.0.0

项目根目录添加`vue.config.js`, 编辑`baseUrl`

```javascript
module.exports = {
  // Project deployment base
  // By default we assume your app will be deployed at the root of a domain,
  // e.g. https://www.my-app.com/
  // If your app is deployed at a sub-path, you will need to specify that
  // sub-path here. For example, if your app is deployed at
  // https://www.foobar.com/my-app/
  // then change this to '/my-app/'
  baseUrl: '/',

  // baseUrl, but for the dev server.
  // you'll only need this if you need to serve your dev server under
  // a specific sub-path in order to work with your dev setup.
  devBaseUrl: '/',

  ...
}
```

详见 : [文档](https://github.com/vuejs/vue-cli/blob/v3.0.0-beta.13/docs/config.md)  

# < v3.0.0

1. 在`config/index.js`中，将`assetsPublicPath`修改为`./`  
1. 在`build/utils.js`中，找到`ExtractTextPlugin.extract`，添加配置项`publicPath: '../../'`  

参考:  
[使用相对路径发布vue-cli项目的坑](http://mirari.cc/2017/09/08/%E4%BD%BF%E7%94%A8%E7%9B%B8%E5%AF%B9%E8%B7%AF%E5%BE%84%E5%8F%91%E5%B8%83vue-cli%E9%A1%B9%E7%9B%AE%E7%9A%84%E5%9D%91/)