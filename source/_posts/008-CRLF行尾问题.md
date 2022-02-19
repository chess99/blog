---
title: CRLF行尾问题
pid: 8
date: 2018-06-27 10:58:51
tags:
  - Shell
  - Vim
  - CRLF
  - Git
categories:
  - 大前端
---

混用行尾的话, 在Linux中, CRLF行尾会导致脚本执行异常
整理了一些解决及预防办法

<!-- more -->

# 知识回顾

CR, 回车, Carriage-Return, ASCII 13, \r
LF, 换行, Line-Feed ,      ASCII 10, \n

Windows下默认`CRLF`, 
Linux下默认`LF`, 多余的`\r`会显示为`^M`

# Vim中

## 关于^M的显示

```bash
# 刷新显示, 不显示^M
:e ++ff=dos
```

或者在`.vimrc`中:

```bash
# 让vim可以自动识别DOS和UNIX文本文件格式, 使用vim打开DOS文本文件就不会显示^M字符了
setfileformats=dos,unix
```

参考: [File format](http://vim.wikia.com/wiki/File_format)

## 格式转换

几种方法:

```bash
# 替换掉\r
:%s/\r//g
```

```bash
# 将文件保存为`LF`行尾格式
:w ++ff=unix
```

```bash
# `fileformat`可以写成`ff`
:set fileformat=unix
:set fileformat=dos
```

另附, [Vim 中读写特殊字符](https://blog.csdn.net/chenster/article/details/53307707)
通过 `:help digraph-table` 可看到所有Vim中可输入的特殊字符

# 批量转换

```bash
find your/path/ -type f -exec dos2unix {} \;
```

路径自行修改..

参考: [dos2unix整个目录](https://www.cnblogs.com/Jerryshome/archive/2012/04/24/2467612.html)

# Git自动转换

推荐配置:

```bash
git config --global core.autocrlf input
```

把`core.autocrlf`设置成`input`来告诉 Git 在提交时把CRLF转换成LF，签出时不转换
其他选项参见 [文档](https://git-scm.com/book/zh/v1/%E8%87%AA%E5%AE%9A%E4%B9%89-Git-%E9%85%8D%E7%BD%AE-Git#格式化与空白)

# VSCode默认行尾配置

`Ctrl + Shift + P`, 搜索'首选项'或者'preferences'
在`USER SETTINGS`里增加:

```json
"files.eol": "\n",
```

说明:
> The default end of line character. Use \n for LF and \r\n for CRLF.

# 其他

## 使用sed

DOS转UNIX：`sed 's/.$//"dosfile.txt > unixfile.txt`
UNIX转DOS：`sed "s/$/\r/"unixfile.txt > dosfile.txt`

## 使用Perl

DOS转UNIX：`perl -p -e 's/\r$//"< dosfile.txt > unixfile.txt`
UNIX转DOS：`perl -p -e 's/$/\r/"< unixfile.txt > dosfile.txt`

## 使用awk

DOS转UNIX：`awk '{sub("\r$","", $0);print $0}" dosfile.txt > unixfile.txt`
UNIX转DOS：`awk '{sub("$","\r", $0);print $0}" dosfile.txt > unixfile.txt`

参考 [DOS和UNIX文本文件之间相互转换的方法](https://blog.csdn.net/fan_hai_ping/article/details/8352087)