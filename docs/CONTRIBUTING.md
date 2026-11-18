# 开发与提交规范

## 环境

- Node.js 20+
- 不需要第三方运行时依赖
- 不使用远程图片、字体、脚本或 API

## 本地运行

```bash
npm run dev      # http://127.0.0.1:4173  源码版（全尺寸图，方便调）
npm run build    # dist/ + wanniu-court-minitool.zip（交付尺寸图）
npm run audit    # skill 自带审计脚本扫 dist/
```

`http://127.0.0.1:4173/dist/index.html` 是打包后的产物，冒烟脚本默认打这个地址。

## 质量检查

```bash
npm run check    # 52 张 WEBP 素材存在且接入界面 + 容器合规静态扫描
npm test         # 20 项交付契约（入口结构 / 端能力 / ES2017 / Chrome 61 CSS / 业务规则）
npm run build    # dist/ + wanniu-court-minitool.zip
npm run audit    # skill 自带审计脚本扫 dist/，必须 0 error 0 warning
```

四条都要过。契约测试会**主动拦截**这几类翻车：内联脚本或 `type="module"`、外链资源、
被禁端能力（剪贴板、`a[download]`、`navigator.share`、`localStorage` 写、Worker、
`requestFullscreen`…）、ES2018+ 语法、把 `aspect-ratio` / `inset` / `dvh` / flex `gap`
当作 Chrome 61 唯一实现、场景/物件图被 `100% 100%` 拉伸、透明素材在转码中丢掉 alpha。

端到端与视觉复核（需要 Playwright，见 [tools/README.md](../tools/README.md)）：

```bash
node tools/verify.mjs   # 54 项端到端断言（含「判决书 ≤ 1.8 屏」「顶栏之外不得再有深色横条」「聚焦控件不被浮动层压住」），失败即非零退出
node tools/gaps.mjs     # 逐屏间距审计：OVERLAP / TIGHT / LOOSE / INSET / WIDTH
node tools/detail.mjs   # 逐组件截图，人工复核底衬、压暗层与圆角
node tools/tour.mjs     # 全界面整页截图
node tools/poster.mjs   # 导出 1080x1440 海报原图
```

## 代码约束

- 交付物是**离线 zip**：不得出现任何外链资源、`fetch` / XHR / WebSocket / SSE
- 脚本只能是经典脚本（无 `type="module"`、无 `import`/`export`、无顶层 await），且不得有内联脚本或行内事件
- JS 上限 ES2017；CSS 必须保证 Chrome 61 基线可用，新特性只作为 `@supports` / 实测检测后的增强
- 持久化只走容器 Storage，禁止写 `localStorage` / `IndexedDB` / Cookie / Cache API；能力缺失要如实反馈，不得谎报已保存
- 领域逻辑必须保持纯函数，随机源和当前时间要能注入
- DOM 事件统一使用委托，避免重复绑定
- 所有用户输入进入 HTML 前必须转义
- 历史数据必须做结构校验、去重并设置上限
- 平台能力必须 feature-detect，浏览器预览要有降级路径
- 分享海报只使用 Canvas 本地渲染
- 不引入不必要的依赖，不复制已有业务规则

## 视觉约束

参见 [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)。要点：

- 新插画要服务具体场景，不用 AI 生成图里的文字冒充真实 UI
- 界面文字、按钮、卡片、印章、分隔线一律由 HTML/CSS/SVG 渲染，保证任意 DPI 清晰
- 素材按类型只能用对应的一种用法：场景 `cover`、立绘 `contain`、证书纸九宫格 `border-image`、角花四角平铺、丝带标签等比
- 需要新的切片数值时，先逐行扫描源图确认空白带，再按 `切片 × (盒宽 / 源宽)` 推边框宽度，不要凭感觉填像素
- 破坏性操作用应用内确认弹层，不用 `window.confirm`
- 垂直间距只用 4/8/12/16/22/28，且一个区块的间距只由一处负责（要么自己的 margin，要么容器的 padding）
- 透明立绘底下是暖纸不是灰；压暗层只给真的压了白字的窗口
