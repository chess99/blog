---
title: 分析el-select
date: 2019-09-18 00:00:00
tags:
  - element-ui
categories:
  - element-ui
---

分析el-select

<!-- more -->

  "name": "element-ui",  
  "version": "2.10.1",  

组件文档: [文档](https://element.eleme.cn/#/en-US/component/select)  
源码在`packages/select/`下: [链接](https://github.com/ElemeFE/element/tree/dev/packages/select)  

```bash
|-- select
    |-- index.js
    |-- src
        |-- navigation-mixin.js
        |-- option-group.vue
        |-- option.vue
        |-- select-dropdown.vue
        |-- select.vue

```

## 主要文件

[**packages\select\src\select.vue**](https://github.com/ElemeFE/element/blob/dev/packages/select/src/select.vue)  
select主体  
  
[**packages\select\src\select-dropdown.vue**](https://github.com/ElemeFE/element/blob/dev/packages/select/src/select-dropdown.vue)  
select选项弹出框  
这个组件主要只处理placement(弹出框位置)/popperOptions/visibleArrow/appendToBody等配置  
  
[**src\utils\vue-popper.js**](https://github.com/ElemeFE/element/blob/dev/src/utils/vue-popper.js)  
封装了createPopper/updatePopper/destroyPopper等  
作为mixin在select-dropdown/picker-dropdown/cascader等多处被使用  
  
[**src\utils\popper.js**](https://github.com/ElemeFE/element/blob/dev/src/utils/popper.js)  
弹出框的各种基础方法  

## 代码片段

需要显示弹出框时, select.vue的visible()函数内broadcast 'updatePopper'事件, 逐层下传  
select.vue中把el-input标记为reference, popper.js中的_getOffsets根据reference计算popper位置.  

```JavaScript
// popper.js
    /**
     * Get offsets to the popper
     * @method
     * @memberof Popper
     * @access private
     * @param {Element} popper - the popper element
     * @param {Element} reference - the reference element (the popper will be relative to this)
     * @returns {Object} An object containing the offsets which will be applied to the popper
     */
    Popper.prototype._getOffsets = function(popper, reference, placement) {}


// vue-popper.js
    createPopper() {
      const options = this.popperOptions;
      const popper = this.popperElm = this.popperElm || this.popper || this.$refs.popper;
      let reference = this.referenceElm = this.referenceElm || this.reference || this.$refs.reference;  
      this.popperJS = new PopperJS(reference, popper, options);
    }

// select-dropdown.vue
    mounted() {
      this.referenceElm = this.$parent.$refs.reference.$el;
      this.$parent.popperElm = this.popperElm = this.$el;
      this.$on('updatePopper', () => {
        if (this.$parent.visible) this.updatePopper();
      });
      this.$on('destroyPopper', this.destroyPopper);
    }

// select.vue
    <el-input ref="reference" ></el-input>

    visible(val) {
      ...
      this.broadcast('ElSelectDropdown', 'updatePopper');
    },
```
