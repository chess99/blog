---
title: Hexo博客站内链接
date: 2018-06-11 00:36:43
tags:
  - Hexo
  - NexT
  - github pages
categories:
  - 搭建
---

    {% post_link 文章标题 链接名称 %}

<!-- more -->

# 站内文章链接

    {% post_link 文章标题 链接名称 %}

- 如果文章不存在，这段代码将会被直接忽略。
- *链接名称*如果置空，则自动提取文章的标题。

## 栗子

站内相关文章链接:

{% post_link Hexo博客搭建 %}

```bash
{% post_link Hexo博客搭建 %}
```

# 锚点跳转

在文章A中制作锚点  

```html
<a name="Anchor"/>
```

在文章B中插入跳转

```bash
[文章A](2018/06/11/articleA#Anchor)
```

缺点: 硬编码了YYYY/MM/DD
一种解决方法: 修改`permalink: :year/:month/:day/:title/`为`permalink: :title/`

# 参考链接

[hexo #1709](https://github.com/hexojs/hexo/issues/1709)  
[hexo-theme-next #978](https://github.com/iissnan/hexo-theme-next/issues/978)  
[hexo标签插件](https://hexo.io/zh-cn/docs/tag-plugins.html#引用文章)  
