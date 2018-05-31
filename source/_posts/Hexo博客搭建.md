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

使用Hexo搭建博客  
并部署到github pages  

<!-- more -->

# 基本配置

参照Hexo官网[(https://hexo.io/zh-cn/)](https://hexo.io/zh-cn/), 安装各种依赖, 跟着文档配置一遍...  
主题选用的是`NexT`[(https://theme-next.iissnan.com/)](https://theme-next.iissnan.com/), 跟着文档再配置一遍...  
也可以选择其他喜欢主题  

具体可参考 [我的配置](https://github.com/chess99/blog)  

# 自动部署

使用 [Travis CI](https://travis-ci.org/)

**步骤:**

- 在项目根目录添加`.travis.yml`文件

`.travis.yml`文件可参考[我的配置](https://github.com/chess99/blog/blob/master/_config.yml)
*说明 : 这里源码放在`master`分支, 有修改时自动生成并部署到`gh-pages`分支*  
*若要放在其他分支可自行相应修改*  

*参考官方文档:*  
[GitHub Pages Deployment](https://docs.travis-ci.com/user/deployment/pages/)  
[Conditional Releases with 'on:'](https://docs.travis-ci.com/user/deployment#Conditional-Releases-with-on:)  

- 注册Travis CI并配置

[https://travis-ci.org/](https://travis-ci.org/) 中打开对应github仓库的自动集成开关, 在设置中填入`GITHUB_TOKEN`  

*附生成`GITHUB_TOKEN`的的链接:*  
[https://github.com/settings/tokens](https://github.com/settings/tokens)  

# TODO

-[ ]图床  
-[ ]界面美化  