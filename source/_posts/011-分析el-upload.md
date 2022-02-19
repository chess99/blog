---
title: 分析el-upload
pid: 11
date: 2019-09-18 00:00:01
tags:
  - element-ui
categories:
  - 大前端
---

分析el-upload

<!-- more -->

  "name": "element-ui",  
  "version": "2.10.1",  

组件文档: [文档](https://element.eleme.cn/#/en-US/component/upload)  
源码在`packages/upload/`下: [链接](https://github.com/ElemeFE/element/tree/dev/packages/upload)  

```bash
|-- upload
    |-- index.js
    |-- src
        |-- ajax.js
        |-- index.vue
        |-- upload-dragger.vue
        |-- upload-list.vue
        |-- upload.vue
```

样式在`packages/theme-chalk/src/index.scss`  

## index.vue

整体集成了各组件:  
[`Upload组件`](#Upload组件)  
[`UploadList组件`](#UploadList组件)  

```javascript
// index.vue

import UploadList from './upload-list';
import Upload from './upload';
// import ElProgress from 'element-ui/packages/progress'; // 这里没有用到ElProgress, 实际在UploadList内才有用到

  render(h) {
    // ...  

    const trigger = this.$slots.trigger || this.$slots.default;  
    const uploadComponent = <upload {...uploadData}>{trigger}</upload>;  

    return (
      <div>
        { this.listType === 'picture-card' ? uploadList : ''}
        {
          this.$slots.trigger
            ? [uploadComponent, this.$slots.default]
            : uploadComponent
        }
        {this.$slots.tip}
        { this.listType !== 'picture-card' ? uploadList : ''}
      </div>
    );
  }
```

## Upload组件

`upload.vue` 藏了一个获取文件所需的`<input>`,  
若需响应拖放, 则在内容外层包一个注册了drag事件的`upload-dragger`  

```JavaScript
      <div {...data} tabindex="0" >
        {
          drag
            ? <upload-dragger disabled={disabled} on-file={uploadFiles}>{this.$slots.default}</upload-dragger>
            : this.$slots.default
        }
        <input class="el-upload__input" type="file" ref="input" name={name} on-change={handleChange} multiple={multiple} accept={accept}></input>
      </div>
```

`$slots.default`是上层`index.vue`传下来的"trigger"  

```JavaScript
    const data = {
      class: {
        'el-upload': true
      },
      on: {
        click: handleClick,
        keydown: handleKeydown
      }
    };
```

`...data`里注册了点击事件和键盘事件(space键和enter键), 转而触发`<input>`的click事件 `this.$refs.input.click()`  
所以trigger slot里的并不是真正的trigger, 它爹才是, 只不过它爹捕获了冒泡上来的click事件  
jsx相关用法见vue[官方文档](https://cn.vuejs.org/v2/guide/render-function.html#%E6%B7%B1%E5%85%A5%E6%95%B0%E6%8D%AE%E5%AF%B9%E8%B1%A1)  

`upload-dragger.vue`注册了drag相关事件  

```vue
<template>
  <div
    class="el-upload-dragger"
    :class="{
      'is-dragover': dragover
    }"
    @drop.prevent="onDrop"
    @dragover.prevent="onDragover"
    @dragleave.prevent="dragover = false"
  >
    <slot></slot>
  </div>
</template>
```

`onDrop`内`this.$emit('file', e.dataTransfer.files)`给上级的upload.vue处理  
参考 [`DataTransfer.files`](https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer)  

## 文件上传

挨个文件调用`this.post()`  

```JavaScript
    // upload.vue

    post(rawFile) {
      const { uid } = rawFile;
      const options = {
        headers: this.headers,
        withCredentials: this.withCredentials,
        file: rawFile,
        data: this.data,
        filename: this.name,
        action: this.action,
        onProgress: e => {
          this.onProgress(e, rawFile);
        },
        onSuccess: res => {
          this.onSuccess(res, rawFile);
          delete this.reqs[uid];
        },
        onError: err => {
          this.onError(err, rawFile);
          delete this.reqs[uid];
        }
      };
      const req = this.httpRequest(options);
      this.reqs[uid] = req;
      if (req && req.then) {
        req.then(options.onSuccess, options.onError);
      }
    },
```

`httpRequest`方法的默认实现在同文件夹的`ajax.js`里, 也可由`<el-upload>`的`http-request`属性传入  
(element-ui官方文档没写清楚`http-request`的参数)  
![http-request](http-request.png)  

```JavaScript
// ajax.js
// httpRequest的默认实现是以下函数

export default function upload(option) {
  // ...
  const formData = new FormData();
  formData.append(option.filename, option.file, option.file.name);

  const xhr = new XMLHttpRequest();
  if (xhr.upload) {
    xhr.upload.onprogress = function progress(e) {
      if (e.total > 0) {
        e.percent = e.loaded / e.total * 100;
      }
      option.onProgress(e);
    };
  }
  xhr.onerror = function error(e) { /* ... */ };
  xhr.onload = function onload() { /* ... */ };
  xhr.open('post', option.action /* 就是el-upload里传下来的action */, true);
  xhr.withCredentials = true;
  xhr.setRequestHeader( /* ... */ );
  xhr.send(formData);
  return xhr;
}
```

XMLHttpRequest.upload用法见[文档](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/upload)  

## UploadList组件

封装了三种不同显示方式

list-type: "text"
![list-type: "text"](list-type-text.png)

list-type: "picture"
![list-type: "picture"](list-type-picture.png)

list-type: "picture-card"
![list-type: "picture-card"](list-type-picture-card.png)
