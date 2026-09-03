---
title: Hexo permalink 机制深度解析：为什么 slug 字段不生效

date: 2026-03-26 00:00:00
tags:
  - Hexo
  - 源码分析
categories: 技术
---

## 背景

想给博客配置语义化 URL，比如 `posts/hexo-permalink-deep-dive/`，于是在 `_config.yml` 里配置：

```yaml
permalink: /posts/hexo-permalink-deep-dive/
```

然后在文章 front matter 里加上：

```yaml
slug: hexo-permalink-deep-dive
```

结果预览时 URL 变成了 `posts/20260326-hexo%E6%B7%B1%E5%BA%A6%E8%A7%A3%E6%9E%90/`——中文文件名被 URL encode 了，`slug` 字段完全没生效。

<!-- more -->

## 深入源码

通过阅读 Hexo 7.x / 8.x 源码（两个版本逻辑完全一致），找到了根本原因。

### 关键文件

| 功能 | 文件路径 |
|------|---------|
| 文章处理器 | `node_modules/hexo/dist/plugins/processor/post.js` |
| Permalink 过滤器 | `node_modules/hexo/dist/plugins/filter/post_permalink.js` |
| Permalink 类 | `node_modules/hexo/node_modules/hexo-util/dist/permalink.js` |

### 流程一：post processor 强制覆盖 slug

`post.js` 第101行：

```javascript
data.slug = info.title;  // 从文件名解析，直接赋值
```

`info.title` 是通过 `parseFilename()` 从**文件名**解析出来的，和 front matter 里的 `slug` 字段无关。

这行代码在读取 front matter 之后执行，所以 front matter 里的 `slug` 被覆盖了。

### 流程二：permalink filter 构建 meta 对象

`post_permalink.js` 中构建 permalink 变量时：

```javascript
const meta = {
    id: id || _id,
    title: slug,        // :title 变量 = 文件名解析出的 slug
    name: basename(slug),
    post_title: slugize(title, {transform: 1}),
    year: date.format('YYYY'),
    // ...
};
```

注意：`meta.title` 被赋值为 `slug`（文件名来的），而不是文章的 `title` 字段。`:title` 变量实际上是文件名。

### 流程三：front matter 字段注入时被跳过

```javascript
const keys = Object.keys(data);
for (const key of keys) {
    if (Object.prototype.hasOwnProperty.call(meta, key)) continue;  // 已存在则跳过
    Object.defineProperty(meta, key, Object.getOwnPropertyDescriptor(data, key));
}
```

`slug` 已经在 `meta` 里了（第一步被赋值为文件名），所以 front matter 里的 `slug` 字段在这里直接被跳过。

### 结论

文档说"可以使用 front matter 里的任意字段作为 permalink 变量"，这是对的——但有个隐藏前提：**该字段不能与 Hexo 内置字段同名**。

`slug` 恰好是 Hexo 内部使用的字段，被 post processor 强制赋值为文件名，front matter 里的 `slug` 永远不会生效。

## 正确的做法

Hexo 的 `post.js` 第174-177行有这样一段逻辑：

```javascript
if (data.permalink) {
    data.__permalink = data.permalink;
    data.permalink = undefined;
}
```

front matter 里的 `permalink` 字段会被转存为 `__permalink`，在 permalink filter 里直接使用，**完全跳过自动生成逻辑**：

```javascript
if (__permalink) {
    if (!__permalink.startsWith('/')) return `/${__permalink}`;
    return __permalink;
}
```

所以正确的用法是在 front matter 里直接写 `permalink`：

```yaml
---
title: Hexo permalink 机制深度解析

date: 2026-03-26 00:00:00
---
```

这样 URL 就是 `/posts/hexo-permalink-deep-dive/`，完全可控，无需依赖文件名。

## 全局配置的作用

`_config.yml` 里的 `permalink` 配置只对**没有 `permalink` 字段**的文章生效。如果每篇文章都在 front matter 里指定了 `permalink`，全局配置就只是一个 fallback。

## 变量优先级总结

| 变量 | 来源 | 说明 |
|------|------|------|
| `:title` | 文件名（经 slugize 处理） | 不是文章标题 |
| `:post_title` | front matter `title` 字段 | 文章标题，经 slugize 转小写 |
| `:slug` | 文件名（同 `:title`） | front matter 的 `slug` 字段被覆盖 |
| `:pid` | front matter `pid` 字段 | 自定义字段，可正常使用 |
| 其他自定义字段 | front matter | 只要不与内置字段同名即可 |

内置字段（会被 Hexo 覆盖，front matter 同名字段无效）：`slug`、`title`、`name`、`post_title`、`year`、`month`、`day`、`i_month`、`i_day`、`hour`、`minute`、`second`、`hash`、`category`、`id`。
