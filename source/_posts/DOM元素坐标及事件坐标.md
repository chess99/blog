---
title: DOM元素坐标及事件坐标
date: 2018-06-11 19:56:00
tags:
  - JavaScript
  - HTML
categories:
  - 前端
---

DOM元素坐标; 事件坐标; 获取网页元素的绝对位置的方法

<!-- more -->

# DOM元素坐标

1. `clientHeight` 和 `clientWidth` 用于描述元素内尺寸，是指 元素内容+内边距 大小，不包括边框（IE下实际包括）、外边距、滚动条部分
2. `offsetHeight` 和 `offsetWidth` 用于描述元素外尺寸，是指 元素内容+内边距+边框，不包括外边距和滚动条部分
3. `clientTop` 和 `clientLeft` 返回内边距的边缘和边框的外边缘之间的水平和垂直距离，也就是左，上边框宽度
4. `offsetTop` 和 `offsetLeft` 表示该元素的左上角（边框外边缘）与已定位的父容器（offsetParent对象）左上角的距离
5. `offsetParent` 对象是指元素最近的定位（relative,absolute）祖先元素，递归上溯，如果没有祖先元素是定位的话，会返回null

# 事件坐标

- pageX/Y：从`<html>`原点到事件触发点的CSS的 pixels
- clientX/Y：从viewport原点（浏览器窗口）到事件触发点的CSS的 pixels
- screenX/Y：从用户显示器窗口原点到事件触发点的设备 的 pixels。

# 获取网页元素的绝对位置

- 方法1

```javascript
function getOffset(element) {
  let offset = {
    top: element.offsetTop,
    left: element.offsetLeft
  };

  let parentElement = element.offsetParent;
  while (parentElement) {
    offset.top += element.offsetParent.offsetTop;
    offset.left += element.offsetParent.offsetLeft;
    parentElement = parentElement.offsetParent;
  }

  return offset;
}
```

- 方法2

使用[getBoundingClientRect()](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/getBoundingClientRect)
详见 [用Javascript获取页面元素的位置 -> 六、获取元素位置的快速方法](http://www.ruanyifeng.com/blog/2009/09/find_element_s_position_using_javascript.html) 

# 参考链接

[viewports剖析](https://www.w3cplus.com/css/viewports.html)
