---
title: Hexo博客搭建
pid: 2
date: 2018-05-31 20:16:14
tags:
  - Hexo
  - NexT
  - github pages
categories:
  - 小折腾
---

使用Hexo搭建博客, 并部署到github pages  

<!-- more -->

# 基本配置

- 安装各种依赖(git, nodejs, hexo...)  

## Hexo

- 参照Hexo官网[(https://hexo.io/zh-cn/)](https://hexo.io/zh-cn/), 跟着文档配置一遍...  

配置文件为项目根目录的`_config.yml`  

可参考 [我的配置](https://github.com/chess99/blog/blob/master/_config.yml)  
记得删除其中的各种key或者换成你自己的  

## 主题

- 选择一个主题, 跟着文档再配置一遍...  

配置文件为`themes/your_theme/_config.yml`  

我用的是`NexT`[(https://theme-next.iissnan.com/)](https://theme-next.iissnan.com/)  
可参考 [我的配置](https://github.com/chess99/blog/blob/master/themes/next/_config.yml)  

也可以选择其他喜欢主题  

*ps : 若搜索服务选用的是`algolia`, 照[官方文档](https://theme-next.iissnan.com/third-party-services.html#algolia-search)配置的不行, apiKey也要加上:*  

```bash
algolia:
  applicationID: your appID
  apiKey: your Search-Only API Key    # 注意不是Admin API Key
  indexName: your index name
  chunkSize: 5000
```

## 偷懒

clone一个自己喜欢的博客, 修改一下...

# 写作

```bash
# 如果本地已安装hexo
# 参考 https://hexo.io/zh-cn/docs/writing.html

hexo n <title>   # new, 创建名为title新文章
hexo s           # server, 写作时的本地预览
```

或者, 手动创建`md`文件, 写好后提交到对应目录就行..

# 部署

## 手动部署

需要本地已安装hexo等环境

```bash
# 参考 https://hexo.io/zh-cn/docs/generating.html

hexo g -d          # 生成静态文件并部署
```

部署配置参考 [文档](https://hexo.io/zh-cn/docs/deployment.html)

## 自动部署

[Travis CI](https://travis-ci.org/) 收费了, 改用 Github Actions.  
脚本见本仓库 `.github\workflows\main.yml`  
