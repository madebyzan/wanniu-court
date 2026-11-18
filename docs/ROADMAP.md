# 产品打磨路线

## v1.5.0 · 完整产品版（已完成）

界面层重做。上一版把 AI 生成的“完整构图图”当成按钮、卡片和页面背景直接铺，导致文字压在纹样上、木刻角花被拉伸成整屏木纹、判决书画片糊成一片——那是玩具，不是产品。

- [x] 应用骨架改为真实移动端壳层：sticky 顶栏 + fixed 底部四标签 + 安全区 + `#/` 路由与 `popstate`
- [x] 修复底部导航与顶栏点击无响应（事件只绑在 `#app` 内，壳层按钮全部失效）
- [x] 装饰素材用法纠正：`page-corners` 切成四角平铺；`verdict-paper` 按像素验证的空白带切成九宫格边框；`case-card-frame` 只用于等比空卷宗；按钮/丝带保持原始宽高比
- [x] 场景图统一进 `object-fit: cover` 窗口并加压暗渐变，正文不再压在图上
- [x] 修掉 3 张烘焙白底素材：`btn-primary`、`laurel-wreath`、`royal-key`（新增 `scripts/fix-asset-alpha.py`，幂等）
- [x] 图标从 emoji 换成内联 SVG symbol，任意 DPI 清晰
- [x] 判决书重排：抬头纹章 → 标题 → 案号 → 被告/罪名 → 争议焦点 → 证据 → 判决牌 → 法官点评+印章 → 蜡封落款
- [x] 新增判决结果分层：两条证据或铁面审判官 = 有罪；单一证据 + 温和/混沌 = 责令和解，配套独立判罚与点评句库
- [x] 卷宗室加入 全部 / 有罪 / 和解 筛选与计数，行内展示结果徽章、审级与态度
- [x] 删除卷宗改为应用内确认弹层（`role="alertdialog"`），移除 `window.confirm`
- [x] 海报重排为 1080×1440 版式：纹章牌 + 场景窗 + 被告窗 + 对齐信息行 + 判决牌 + 蜡封，长文案截断不重叠
- [x] 修复 CSP 拦截海报 `blob:` 预览
- [x] 搜索焦点与光标保持、清空按钮、选择不跳顶、证据上限显式禁用并解释
- [x] 对比度、`aria-pressed`、`aria-current`、`:focus-visible`、`prefers-reduced-motion` 全量补齐
- [x] 内联 SVG favicon，避免 404
- [x] 契约测试从 12 项扩到 21 项，端到端断言扩到 50 项（`tools/verify.mjs`）
- [x] 判决书瘦身：四边证书边框（339px 装饰 + 2.15 屏）改为上下两条等比装饰带（231px 装饰 + 1.56 屏），标题拉进纹章带空白纸面，接缝用实测纸色 + 羽化消除
- [x] 结论条 / 态度反馈 / 操作区各压成一行，并把「判决书 ≤ 1.8 屏」写成回归断言
- [x] 自定义被告不再套通用句：6 类关键词规则 + 按命中词决定首条罪名 + 归类过程在界面上可见 + 零命中时诚实降级
- [x] 删掉判决书上方那条与顶栏重复的深色结论条，结论/审级/案号回归文书本身（1.56 → 1.49 屏）
- [x] 海报补中文禁則処理，孤零零的「。」不再单独成行；判决牌位置按点评两行的最坏情况重新钳位，不再压到页脚分隔线
- [x] 发布前间距总扫：统一 4/8/12/16/22/28 刻度，修掉 12 处（每日值班图压字 13px、图鉴丝带越出版心、自定义面板 + 号飘空、操作条压 tab bar 1px、chips 与网格 0 间距、tabs 左边距 12≠16、crumb 无下间距等）
- [x] 透明立绘底衬由中性灰改为暖纸色，压暗层改为按需启用，未选中勾选圈不再在图上留灰斑
- [x] 修复浮动操作条压住「被告名称」输入框（669px 视口下实测重叠 51px）：面板展开时操作条让位 + 显式滚动到视口中央
- [x] 展开指示符由「右箭头旋转 90°」（看着像下载）改为「+ 旋转成 ×」；判决操作区由三种按钮权重简化为一主三辅

## v1.6.0 · 小工具离线包（已完成）

按 `.codex/minitool-zip-builder`（v1.11.1，在线文档 2026-11-13 已核验）改写并打包：

- [x] 52 张图按显示尺寸 ×2 DPR 重导出为交付件（13 MiB 源图 → 包内 1.92 MiB），仓库原图不动
- [x] `index.html` 改为容器规范入口：经典 `defer` 脚本、无内联脚本/行内事件、无 `<base>`、无外链
- [x] 静态首屏：禁用 JS 时标题、主文案、两个入口 CTA、抬头图仍然可读，整页正好一屏不跳动
- [x] 新增 `platform.js` 端能力适配层：版本判断（不猜 UA）、Storage、writeTempFile、saveImageToPhotosAlbum、share、postNote、getWindowInfo 安全区
- [x] 移除全部禁用能力：`localStorage` 写、`navigator.clipboard`、`execCommand`、`a[download]`、`navigator.share`
- [x] 复制文案改为可选中文本面板（容器无网页剪贴板），并保留长按选中所需的可选择状态
- [x] JS 收到 ES2017：无 `?.` / `??` / 对象 spread / `flatMap` / `Object.fromEntries` / `structuredClone`；日期不再依赖 `toLocaleDateString` 输出
- [x] CSS 建 Chrome 61 基线层：`aspect-ratio`→padding-top 比例盒、`inset`→物理属性、`overflow:clip`→hidden、`dvh`→`vh + --app-height`、逻辑属性→物理、`grid-gap` 双写、flex `gap` 用实测检测后加 `html.no-flexgap` margin 兜底、`:focus-visible` / `backdrop-filter` 收进 `@supports`、安全区 `var(--x, env(x, 0))` 且前面保留普通值
- [x] 修复比例盒图片仍在流内导致的撑破（判决书装饰带实测 1.78 → 0.4512，与源图 1086/490 精确一致）
- [x] 契约测试 22 项；端到端 57 项，其中含容器调用约定断言（`getLaunchOptions` / `setStorage` 序列化 / `writeTempFile`→`saveImageToPhotosAlbum(filePath)` / `share({type:'image'})` / `postNote` 的 `mediaInfo.image_resources`）
- [x] 两个审计脚本（Node + Python）对 `dist/` 与最终 zip 均 PASS、0 warning；产物 `wanniu-court-minitool.zip` 1.97 MiB

## 下一轮验收

- [ ] **创服平台模拟器**：上传 `wanniu-court-minitool.zip`，完成完整功能验证
- [ ] **Android 真机扫码**：重点验 Chrome 61 基线层的间距/比例盒、Storage 读写、相册保存与分享面板
- [ ] **iOS 真机扫码**：同一产物，验安全区与增强层
- [ ] 低版本客户端（<9.46）下的降级文案：本机缓存不可用时界面是否说得清楚
- [ ] 客户端 9.53 以下：分享入口是否正确隐藏；9.49 以下：相册保存与安全区降级
- [ ] 52 张素材在不同屏幕比例下的裁切焦点与透明边缘人工复核
- [ ] 每日案件、证据与判决句库根据真实试玩反馈迭代（当前 16 被告 × 3 罪名 × 3 证据）
- [ ] 键盘-only 全流程走查（当前已验证焦点可见与 Esc 关闭，未做完整 Tab 序审计）
- [ ] 评估 PWA 离线缓存与桌面安装能力
- [ ] 评估被告立绘的视觉一致性：现有 16 张是“海报式”构图，含烘焙对话气泡，缩小后信息密度偏高

## 质量原则

先保证流程完整，再打磨反馈和视觉。CI 通过不等于真机验收通过。任何没做过的验证都明确标为待验收，不写成已完成。
