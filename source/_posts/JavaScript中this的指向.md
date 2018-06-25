---
title: JavaScript中this的指向
date: 2018-06-25 12:34:59
tags:
  - JavaScript
categories:
  - JavaScript
---

整理一下`this`用法, 基本是抄了一遍MDN..

普通函数: 执行上下文, 严格模式下默认不指向全局对象
箭头函数: 词法上下文

<!-- more -->

# 全局上下文

在全局执行上下文中（在任何函数体外部）
`this`总是指代全局对象 (包括严格模式)

```JavaScript
console.log(this === window); // true
```

在浏览器中，全局对象是`window`
在Node中, 是`global`

# 普通函数

## 简单调用

```JavaScript
function f1() {
  return this
}
function f2() {
  'use strict'
  return this
}

f1()  // window 或 global
f2()  // undefined
window.f2() // window
global.f2() // TypeError: global.f2 is not a function
```

`this`保持他进入执行上下文时的值,

如果 `this` 没有被执行上下文（execution context）定义，那它将保持为 :
严格模式  : `undefined`
非严格模式: 全局对象

## 对象的方法 / 原型链 / getter / setter

都是指向的是调用这个方法的对象

## 构造函数

当一个函数用作构造函数时（使用`new`关键字），它的`this`被绑定到正在构造的新对象。

*构造器返回的默认值是`this`所指的那个对象，*
*可以手动返回其他的对象（如果返回值不是一个对象，则返回this对象）*

## DOM事件处理函数

指向触发事件的元素
（一些浏览器在使用非addEventListener的函数动态添加监听函数时不遵守这个约定）

## 内联事件处理函数

当代码被内联on-event 处理函数调用时，它的this指向监听器所在的DOM元素

```HTML
<button onclick="alert(this.tagName.toLowerCase());">
  Show this
</button>
```

上面的 alert 会显示button。注意只有外层代码中的this是这样设置的：

```HTML
<button onclick="alert((function(){return this})());">
  Show inner this
</button>
```

在这种情况下，没有设置内部函数的this，所以它指向 global/window 对象（即非严格模式下调用的函数未设置this时指向的默认对象）。

## bind / call / apply

将一个对象作为[call](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/call)和[apply](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/apply)的第一个参数，`this`会被绑定到这个对象。

[f.bind(someObject)](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)会创建一个与f具有相同函数体和作用域的函数，但是在这个新函数中，`this`将永久地被绑定到了bind的第一个参数，无论这个函数是如何被调用的。

# 箭头函数

在箭头函数中，`this`与封闭词法上下文的`this`保持一致。
( 函数体内的`this`对象，就是定义时所在的对象，而不是使用时所在的对象 )

在全局上下文中的箭头函数，`this`被设置为全局对象

```JavaScript
var foo = (() => this);
foo() // 全局对象
```

*注意: 如果将this传递给call、bind、或者apply，它将被忽略*

# 其他注意事项

## setInterval / setTimeout

```JavaScript
var num = 0;
function Obj() {
  this.num = 1,
    this.getNum1 = function () {
      setTimeout(function () {
        console.log('getNum1', this, this.num)
      }, 1000)
    },
    this.getNum2 = function () {
      setTimeout(() => {
        console.log('getNum2', this.num);
      }, 1000)
    }
}
var obj = new Obj;
obj.getNum1(); // 浏览器中0(this为window), Node中undefined(this为Timeout)
obj.getNum2(); // 1
```

`setInterval`和`setTimeout`调用的代码运行在与所在函数完全分离的执行环境上

## 单独调用对象方法

```JavaScript
var obj = {
  bar: function () {
    return this
  }
};
var fn = obj.bar(); // obj
var fn2 = obj.bar
fn2() // 全局对象(fn2定义的上下文)
```

# 参考链接

[this - MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/this)
[关于setInterval和setTImeout中的this指向问题](https://www.cnblogs.com/zsqos/p/6188835.html)