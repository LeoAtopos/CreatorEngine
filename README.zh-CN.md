# CreatorEngine / 创作引擎

[English README](README.md)

CreatorEngine 是一个本地优先的游戏构思向导。它把模糊想法沿着一条短而明确的路径，整理成可以讨论、修改、验证并继续编辑的设计摘要。

界面会检测操作系统语言：系统语言以 `zh` 开头时自动使用中文，否则使用英文。顶部导航提供中英文切换按钮，并会在当前设备上保存语言偏好。

## 直接使用

- 在线网页版：[打开 CreatorEngine](https://leoatopos.github.io/CreatorEngine/)
- Windows 便携版：[下载 CreatorEngine.exe](https://github.com/LeoAtopos/CreatorEngine/releases/latest/download/CreatorEngine.exe)
- Windows x64 安装版：[下载 CreatorEngine_x64-setup.exe](https://github.com/LeoAtopos/CreatorEngine/releases/latest/download/CreatorEngine_x64-setup.exe)

## 创作流程

1. 最初想法：保留作者最初的火花。
2. 三句话：说明“什么游戏、什么体验、如何验证”，并实时查看完整句子。
3. 游戏设计四大支柱：分别检查叙事、机制、美学和技术，以及每根支柱对其他支柱的指导、支持或要求。
4. 游戏侧构思：检查第一眼、前十分钟、中后期与最终体验。
5. 设计摘要：在同一页面查看、编辑、复制或下载完整 Markdown 文档。

项目数据通过浏览器 `localStorage` 保存在当前设备，不需要登录，也不会发送到外部服务。下载的 Markdown 文件可以重新载入并继续编辑。

## 本地运行

```bash
npm install
npm run dev -- --port 3100
```

打开 `http://localhost:3100/`。

生产模式：

```bash
npm run build
npm run start -- --port 3100
```

## 检查

```bash
npm run lint
npm test
```
