# tools/ — 本地校验脚本

只在开发时使用，不属于产品运行时，也不进 zip。依赖 Playwright（用全局 `@playwright/cli`
自带的版本即可，不需要写进 package.json）：

```bash
ln -sfn "$(dirname "$(find ~/.fnm -type d -name playwright -path '*@playwright/cli*' | head -1)")/playwright" node_modules/playwright
ln -sfn "$(dirname "$(find ~/.fnm -type d -name playwright-core -path '*@playwright/cli*' | head -1)")/playwright-core" node_modules/playwright-core
```

先 `npm run dev`，再执行：

| 命令 | 作用 |
| --- | --- |
| `npm run verify` | 端到端断言。**带容器 mock**：用 `tools/mock-container.mjs` 假装 `window.xhs.miniTool`，真的走一遍 Storage / writeTempFile / saveImageToPhotosAlbum / share / postNote / getWindowInfo 的调用约定 |
| `npm run smoke` | 对 `dist/index.html` 冒烟：静态首屏（含禁用 JS）、判决书比例带、包外网络请求计数、blob 预览 |
| `node tools/gaps.mjs` | 逐屏量顶层区块边距与块间距，报 OVERLAP / TIGHT / LOOSE / INSET |
| `node tools/tour.mjs` | 全界面整页截图 |
| `node tools/poster.mjs [custom]` | 导出 1080×1440 海报原图 |
| `node tools/custom.mjs` | 抽查自定义被告的归类与判决 |
| `node tools/detail.mjs` | 逐组件出图 |
| `node tools/focus.mjs` | 聚焦输入框是否被浮动层压住 |
| `node tools/len.mjs` | 多宽度下判决书装饰带尺寸与整页屏数 |

## 关于容器 mock

`mock-container.mjs` 按在线文档的调用约定实现（`errMsg: "<api>:ok"`、`data` 只收 JSON
字符串、`writeTempFile` 返回 `filePath`、`share` 收 `type` + `image_resource`、
`postNote` 必须有 `mediaInfo.image_resources`）。它能证明**我们的调用方式符合文档**，
但**不能**证明真机行为，所以：

> 浏览器直运行结果不可作为小工具功能、兼容性或交付验收的依据。
> 创服平台模拟器、Android 真机扫码、iOS 真机扫码验证必须由人完成。
