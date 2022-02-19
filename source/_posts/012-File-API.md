---
title: File API
pid: 12
date: 2019-09-18 00:00:02
tags:
  - webapi
categories:
  - 大前端
---

File Api

<!-- more -->

## `<input type="file">`  

<https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file>  

| **Attribute**                                                | **Description**                                              |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| [accept](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#accept) | One or more [unique   file type specifiers](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#Unique_file_type_specifiers) describing file   types to allow |
| [capture](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#capture) | What source to use for capturing image   or video data       |
| [files](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#files) | A [`FileList`](https://developer.mozilla.org/en-US/docs/Web/API/FileList) listing   the chosen files |
| [multiple](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#multiple) | A Boolean which, if present, indicates   that the user may choose more than one file |

## 文件类型

Each unique file type specifier may take one of the following forms:  

· A valid case-insensitive filename extension, starting with a period (".") character. For example: `.jpg`, `.pdf`, or `.doc`.

· A valid MIME type string, with no extensions.

· The string `audio/*` meaning "any audio file".

· The string `video/*` meaning "any video file".

· The string `image/*` meaning "any image file".

<https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file>  

**栗子**  

· `accept="image/png"` or `accept=".png"` — Accepts PNG files.

· `accept="image/png, image/jpeg"` or `accept=".png, .jpg, .jpeg"` — Accept PNG or JPEG files.

· `accept="image/*"` — Accept any file with an `image/*` MIME type. (Many mobile devices also let the user take a picture with the camera when this is used.)

· `accept=".doc,.docx,.xml,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"` — accept anything that smells like an MS Word document.  

<https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#Limiting_accepted_file_types>  

## 文件对象

**FileList**  <https://developer.mozilla.org/en-US/docs/Web/API/FileList>  

**File**     <https://developer.mozilla.org/en-US/docs/Web/API/File>  

The FileList behaves like an array, so you can check its length property to get the number of selected files.  

Each `File` object contains the following information:

**name**  
The file's name.  

**lastModified**  
A number specifying the date and time at which the file was last modified, in milliseconds since the UNIX epoch (January 1, 1970 at midnight).  

**lastModifiedDate**  
A [`Date`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) object representing the date and time at which the file was last modified. *This is deprecated and should not be used. Use* `*lastModified*` *instead.*

**size**  
The size of the file in bytes.  

**type**  
The file's [MIME type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types).  

**webkitRelativePath**  
A string specifying the file's path relative to the base directory selected in a directory picker (that is, a `file` picker in which the [webkitdirectory](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#attr-webkitdirectory) attribute is set). *This is non-standard and should be used with caution.*  

## 文件拖放

<https://developer.mozilla.org/en-US/docs/Web/API/File/Using_files_from_web_applications#Selecting_files_using_drag_and_drop>  

**DataTransfer对象**  
<https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer>  
This object is available from the [`dataTransfer`](https://developer.mozilla.org/en-US/docs/Web/API/DragEvent/dataTransfer) property of all [`drag events`](https://developer.mozilla.org/en-US/docs/Web/API/DragEvent).

[`DataTransfer.files`](https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer/files)  
Contains a list of all the local files available on the data transfer. If the drag operation doesn't involve dragging files, this property is an empty list.  

**拖拽API**  
<https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API>  

## 各种栗子

Using files from web applications  
<https://developer.mozilla.org/en-US/docs/Web/API/File/Using_files_from_web_applications>  
图片预览, 文件上传等

## URL.createObjectURL()

<https://developer.mozilla.org/zh-CN/docs/Web/API/URL/createObjectURL>  

<https://developer.mozilla.org/en-US/docs/Web/API/File/Using_files_from_web_applications#Using_object_URLs>

## FileReader

<https://developer.mozilla.org/zh-CN/docs/Web/API/FileReader>  
