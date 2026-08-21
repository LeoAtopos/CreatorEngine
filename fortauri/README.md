# CreatorEngine Tauri

CreatorEngine 的 Windows 桌面版本。前端直接复用上层 `app/` 中的组件、模型、参考数据与样式，桌面壳使用 Tauri v2。

## 开发

```powershell
npm install
npm run tauri:dev
```

## 构建

```powershell
npm run tauri:build
```

构建完成后：

- 便捷输出目录：`output/CreatorEngine.exe` 与 `output/CreatorEngine_0.1.0_x64-setup.exe`
- 主程序：`src-tauri/target/release/creator-engine-desktop.exe`
- NSIS 安装程序：`src-tauri/target/release/bundle/nsis/CreatorEngine_0.1.0_x64-setup.exe`
