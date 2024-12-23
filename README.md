<div align="center">

# 🖼️ **Adobe Color Swatch 转换工具**

[![Vue](https://img.shields.io/badge/Vue.js-3.0-4FC08D?style=flat-square&logo=vue.js)](https://vuejs.org/)
[![Element Plus](https://img.shields.io/badge/Element%20Plus-latest-409EFF?style=flat-square&logo=element)](https://element-plus.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

_✨ 一个基于 Vue 3 + Element Plus 的在线颜色转换工具，支持 ACO、TXT、Excel 等格式的相互转换 ✨_

</div>

---

## ✨ **功能特点**

### 🎨 支持多种文件格式

- **导入/导出支持**：
  - ACO (Adobe Color Swatch) 文件
  - TXT 文本文件
  - Excel 文件
- **导出支持**：
  - Markdown 文件（含颜色预览）

### 🛠 颜色编辑功能

- RGB 值编辑
- 十六进制值编辑
- 颜色选择器
- 实时颜色预览

### ✨ 其他特性

- 手动创建颜色列表
- 提供文件模板下载
- 支持中文颜色名称
- 响应式设计，适配多终端

---

## 🚀 **使用说明**

### TXT 文件格式

支持以下两种格式：



```
红色,(255,0,0)
蓝色,(0,0,255)
```

或

```
红色,#FF0000
蓝色,#0000FF
```

### Excel 文件格式

| 名称 | RGB值      | 十六进制  |
|------|------------|-----------|
| 红色 | (255,0,0)  | #FF0000   |
| 蓝色 | (0,0,255)  | #0000FF   |

---

## 🔨 **本地开发**

### 1️⃣ 安装依赖

```bash
npm install
```

### 2️⃣ 启动开发服务器

```bash
npm run dev
```

### 3️⃣ 构建生产版本

```bash
npm run build
```

---

## 🛠️ **技术栈**

- **框架**：Vue 3
- **UI 组件库**：Element Plus
- **文件处理**：xlsx
- **截图工具**：html2canvas

---

## 🌐 **浏览器支持**

- Google Chrome
- Mozilla Firefox
- Apple Safari
- Microsoft Edge

---

## ⚠️ **注意事项**

1. **ACO 文件限制**：目前仅支持 RGB 颜色空间。
2. **颜色值范围**：
   - RGB: `0-255`
   - 十六进制: `#000000` - `#FFFFFF`


---

## 📜 **许可证**

本项目基于 [MIT License](LICENSE) 开源。

---

## 👤 **作者**

- **姓名**：Xiao Hei  
- **Email**：[597875010@qq.com](mailto:597875010@qq.com)  
- **博客**：[dogni.work](https://dogni.work)  