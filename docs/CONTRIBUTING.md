# 开发与提交规范

## 环境

- Node.js 20+
- 不需要第三方运行时依赖
- 不使用远程图片、字体、脚本或 API

## 本地运行

```bash
npm run dev
```

默认地址为 `http://127.0.0.1:4173`。

## 质量检查

```bash
npm run check    # 52 张素材存在且接入界面
npm test         # 22 项产品与视觉契约
```

提交前必须保证两条命令通过。契约测试覆盖内联脚本语法、移动端 viewport、远程资源约束、关键交互入口、本地历史边界，并且会**主动拦截**两类历史翻车：把场景/物件图 `background-size: 100% 100%` 铺成 UI 表面，以及把 `page-corners.webp` 整张拉伸。

端到端与视觉复核（需要 Playwright，见 [tools/README.md](../tools/README.md)）：

```bash
node tools/verify.mjs   # 54 项端到端断言（含「判决书 ≤ 1.8 屏」「顶栏之外不得再有深色横条」「聚焦控件不被浮动层压住」），失败即非零退出
node tools/gaps.mjs     # 逐屏间距审计：OVERLAP / TIGHT / LOOSE / INSET / WIDTH
node tools/detail.mjs   # 逐组件截图，人工复核底衬、压暗层与圆角
node tools/tour.mjs     # 全界面整页截图
node tools/poster.mjs   # 导出 1080x1440 海报原图
```

## 代码约束

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
