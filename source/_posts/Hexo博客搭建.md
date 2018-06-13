---
title: Hexo博客搭建
date: 2018-05-31 20:16:13
tags:
  - Hexo
  - NexT
  - github pages
categories:
  - 搭建
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

使用 [Travis CI](https://travis-ci.org/)  
好处是在没有安装hexo的地方也可以写博客, 直接写markdown, 写完提交到github就行了  

**步骤:**

- 在项目根目录添加`.travis.yml`文件

`.travis.yml`文件可参考[我的配置](https://github.com/chess99/blog/blob/master/.travis.yml)  
*说明 : 这里源码放在`master`分支, 有修改时自动生成并部署到`gh-pages`分支*  
*若要放在其他分支可自行相应修改*  

*参考官方文档:*  
[GitHub Pages Deployment](https://docs.travis-ci.com/user/deployment/pages/)  
[Conditional Releases with 'on:'](https://docs.travis-ci.com/user/deployment#Conditional-Releases-with-on:)  

- 注册Travis CI并配置

[https://travis-ci.org/](https://travis-ci.org/) 中打开对应github仓库的自动集成开关, 在设置中填入`GITHUB_TOKEN`  

*附生成`GITHUB_TOKEN`的的链接:*  
[https://github.com/settings/tokens](https://github.com/settings/tokens)  
