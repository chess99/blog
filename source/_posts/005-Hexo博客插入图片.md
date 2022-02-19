---
title: Hexo博客插入图片
pid: 5
date: 2018-06-11 00:36:44
tags:
  - Hexo
  - NexT
  - github pages
categories:
  - 小折腾
---

{% asset_img 四月は君の嘘.png This is an example image %}

<!-- more -->

# 官方方法

## 1.`source/images` 文件夹

若图片少, 放在 `source/images` 文件夹中。然后通过类似于 `![](/images/image.jpg)` 的方法访问它们。  

通过常规的 markdown 语法和相对路径来引用图片和其它资源可能会导致它们在存档页或者主页上显示不正确。

## 2.文章资源文件夹

打开资源文件管理功能

```bash
# 站点_config.yml中
post_asset_folder: true
```

Hexo将会在你每一次通过 `hexo new [layout] <title>` 命令创建新文章时自动创建一个与`title`同名的文件夹。
引用图片时, 使用下列的标签插件而不是 markdown 语法

```bash
{% asset_path slug %}
{% asset_img slug [title] %}
{% asset_link slug [title] %}
```

参考 [官方文档](https://hexo.io/zh-cn/docs/asset-folders.html)

# 使用图床

使用`MWeb`, 一次编辑, 多平台发布  

详见文章:  
[一个码字工作者的正确书写发文姿势](https://zhuanlan.zhihu.com/p/24426967)