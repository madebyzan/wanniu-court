# tools/ — 本地视觉与功能校验脚本

这些脚本只在开发时使用，不属于产品运行时，也不进入包体。
它们依赖 Playwright（用全局 `@playwright/cli` 里自带的版本即可，不需要写进 package.json）：

```bash
ln -sfn "$(dirname "$(find ~/.fnm -type d -name playwright -path '*@playwright/cli*' | head -1)")/playwright" node_modules/playwright
ln -sfn "$(dirname "$(find ~/.fnm -type d -name playwright-core -path '*@playwright/cli*' | head -1)")/playwright-core" node_modules/playwright-core
```

先启动 `npm run dev`，再执行：

| 命令 | 作用 |
| --- | --- |
| `node tools/verify.mjs` | 端到端功能校验：导航、三步立案、证据上限、判决、海报尺寸、再审、删除确认、搜索焦点、每日案件、图鉴分页、无障碍属性 |
| `node tools/tour.mjs [目录]` | 走一遍全部界面并输出整页截图，用于视觉复核 |
| `node tools/poster.mjs` | 单独导出 1080×1440 判决海报原图 |

截图默认写到 `shots/`（已在 .gitignore 中忽略）。
