/* 万物审判庭 · 容器能力适配层
   经典脚本，按依赖顺序先于 app.js 执行。语法上限 ES2017，目标 Chrome 61。
   只封装在线文档明确对外的能力；能力缺失时返回可判别的失败原因，不静默假装成功。 */
(function () {
  'use strict';

  /* ---------- 客户端版本 ---------- */
  /* buildVersion 末三位是编译序号，比较时忽略。例如 9462004 => 9.46.2 => 9462 */
  function clientVersion(buildVersion) {
    return Math.floor((Number(buildVersion) || 0) / 1000);
  }
  function readBuildVersion(launchOptions) {
    var env = launchOptions && launchOptions.miniToolEnv;
    return Number(env && env.buildVersion) || 0;
  }
  function miniTool() {
    return (window.xhs && window.xhs.miniTool) || null;
  }
  function has(name) {
    var api = miniTool();
    return !!(api && typeof api[name] === 'function');
  }

  var versionCache = null;
  function buildVersion() {
    if (versionCache) return Promise.resolve(versionCache);
    var sync = readBuildVersion(window.xhs && window.xhs.launchOptions);
    if (sync) {
      versionCache = sync;
      return Promise.resolve(sync);
    }
    if (!has('getLaunchOptions')) return Promise.resolve(0);
    return miniTool().getLaunchOptions().then(function (result) {
      versionCache = readBuildVersion(result);
      return versionCache;
    }).catch(function () { return 0; });
  }
  function atLeast(minimum) {
    return buildVersion().then(function (v) {
      return clientVersion(v) >= minimum;
    }).catch(function () { return false; });
  }

  /* ---------- 最低版本门槛（来自在线文档 §3） ---------- */
  var MIN = { storage: 9460, file: 9490, window: 9490, comment: 9490, vibrate: 9500, share: 9530, reward: 9533 };

  /* ---------- 兼容性检测 ---------- */
  /* gap 在 Chrome 61 的 flex 上不生效，而 CSS.supports('gap') 只能证明语法，
     所以真的建一个 flex 容器量一次。 */
  function supportsFlexGap() {
    var box = document.createElement('div');
    box.style.position = 'absolute';
    box.style.top = '-9999px';
    box.style.left = '-9999px';
    box.style.visibility = 'hidden';
    box.style.display = 'flex';
    box.style.flexDirection = 'column';
    box.style.rowGap = '1px';
    var a = document.createElement('div');
    var b = document.createElement('div');
    a.style.height = '1px';
    b.style.height = '1px';
    box.appendChild(a);
    box.appendChild(b);
    document.body.appendChild(box);
    var supported = box.scrollHeight === 3;
    document.body.removeChild(box);
    return supported;
  }

  /* 软键盘会压缩可视高度：用 visualViewport 维护 --app-height，
     拿不到就退回 100vh（CSS 里已有静态兜底）。 */
  function trackViewport() {
    var root = document.documentElement;
    function set(px) {
      if (px > 0) root.style.setProperty('--app-height', px + 'px');
    }
    set(window.innerHeight || 0);
    if (window.visualViewport && typeof window.visualViewport.addEventListener === 'function') {
      window.visualViewport.addEventListener('resize', function () {
        set(Math.round(window.visualViewport.height));
      });
    }
    window.addEventListener('resize', function () { set(window.innerHeight || 0); });
  }

  /* 顶部避让：容器会在页面之上绘制状态栏与原生按钮胶囊（••• / ◎）。
     在线文档 §3.11 的用途就是「页面布局与原生按钮避让」，并明确要求：
       - safeArea 与 menuButtons 都用容器坐标系，原点是容器左上角
       - menuButtons 始终存在，back / me / share 各为矩形，不可见时为 null
       - 按钮隐藏时无需为其避让
     所以这里同时算出「顶部安全区」和「被按钮占掉的右上角」，交给 CSS 变量，
     拿不到就什么都不做，CSS 保留自己的静态兜底值。 */
  function applyInsets() {
    atLeast(MIN.window).then(function (ok) {
      if (!ok || !has('getWindowInfo')) return null;
      return miniTool().getWindowInfo().then(function (info) {
        if (!info) return null;
        var root = document.documentElement;
        var area = info.safeArea;
        var winW = Number(info.windowWidth) || window.innerWidth || 0;
        if (area) {
          var top = Number(area.top) || 0;
          var bottom = Math.max(0, (Number(info.windowHeight) || winW) - (Number(area.bottom) || 0));
          if (top > 0) root.style.setProperty('--safe-area-inset-top', top + 'px');
          if (bottom > 0) root.style.setProperty('--safe-area-inset-bottom', bottom + 'px');
          if ((Number(area.left) || 0) > 0) root.style.setProperty('--safe-area-inset-left', area.left + 'px');
          if (winW && (Number(area.right) || winW) < winW) root.style.setProperty('--safe-area-inset-right', (winW - area.right) + 'px');
        }
        /* 只避让真正压在顶部条带里的按钮；整条都不可见时完全不介入 */
        var buttons = info.menuButtons || {};
        var band = Math.max(Number(info.statusBarHeight) || 0, Number(area && area.top) || 0) + 64;
        var leftMost = winW;
        var lowest = 0;
        var seen = 0;
        ['back', 'me', 'share', 'more', 'close'].forEach(function (key) {
          var rect = buttons[key];
          if (!rect) return;                       /* null = 该按钮未显示 */
          var r = Number(rect.right);
          if (!(r > 0)) return;
          if (Number(rect.top) >= band) return;    /* 不在顶部条带内，无需避让 */
          seen++;
          leftMost = Math.min(leftMost, Number(rect.left) || 0);
          lowest = Math.max(lowest, r ? Number(rect.bottom) || 0 : 0);
        });
        if (!seen || !winW) return null;
        var reserve = Math.max(0, Math.round(winW - leftMost) + 10);
        root.style.setProperty('--menu-right', reserve + 'px');
        root.style.setProperty('--menu-bottom', Math.max(0, Math.round(lowest)) + 'px');
        /* 顶栏内容宽度不够时，让装饰性文案自己让位，而不是挤压标题 */
        root.className = root.className.replace(/\s*has-menu\b/, '') + ' has-menu';
        return reserve;
      }).catch(function () { return null });
    });
  }

  /* ---------- 本地缓存：只用 Storage，不回退浏览器存储 ---------- */
  var LEGACY_KEY = 'wanniu-court-github-v1';
  var STORAGE_KEY = 'archive';
  var migrated = false;

  function readLegacy() {
    /* 在线文档允许一次性读取旧浏览器存储并写入 Storage，迁移后不再读写 */
    try {
      if (!window.localStorage) return null;
      var raw = window.localStorage.getItem(LEGACY_KEY);
      return raw === null ? null : raw;
    } catch (error) { return null; }
  }
  function clearLegacy() {
    try { if (window.localStorage) window.localStorage.removeItem(LEGACY_KEY); } catch (error) {}
  }

  function storageGet() {
    return atLeast(MIN.storage).then(function (ok) {
      if (!ok || !has('getStorage')) return { ok: false, reason: 'unsupported' };
      return miniTool().getStorage({ key: STORAGE_KEY }).then(function (result) {
        if (!result || result.errMsg !== 'getStorage:ok') return { ok: false, reason: 'read' };
        /* 不存在时端上返回 data === null */
        var raw = result.data;
        if (raw === null || raw === undefined || raw === '') {
          var legacy = readLegacy();
          if (legacy) return { ok: true, data: legacy, from: 'empty' };
          return { ok: true, data: '[]', from: 'empty' };
        }
        return { ok: true, data: String(raw), from: 'storage' };
      }).catch(function (error) {
        return { ok: false, reason: (error && error.errMsg) || 'fail' };
      });
    });
  }

  function storageSet(serialized) {
    return atLeast(MIN.storage).then(function (ok) {
      if (!ok || !has('setStorage')) return false;
      return miniTool().setStorage({ key: STORAGE_KEY, data: serialized }).then(function (result) {
        var saved = !!result && result.errMsg === 'setStorage:ok';
        if (saved && !migrated) { migrated = true; clearLegacy(); }
        return saved;
      }).catch(function () { return false });
    });
  }

  /* ---------- 图片落地：writeTempFile -> 相册 / 分享 ---------- */
  function tempFile(dataUrl) {
    if (!has('writeTempFile')) return Promise.resolve(null);
    return miniTool().writeTempFile({ data: dataUrl }).then(function (result) {
      return (result && result.filePath) || null;
    }).catch(function () { return null });
  }

  function saveImage(dataUrl) {
    return atLeast(MIN.storage).then(function (ok) {
      if (!ok || !has('saveImageToPhotosAlbum')) return { ok: false, reason: 'unsupported' };
      return tempFile(dataUrl).then(function (filePath) {
        return miniTool().saveImageToPhotosAlbum({ filePath: filePath || dataUrl }).then(function (result) {
          return (result && result.errMsg === 'saveImageToPhotosAlbum:ok')
            ? { ok: true }
            : { ok: false, reason: 'denied' };
        });
      });
    }).catch(function (error) {
      return { ok: false, reason: (error && error.errMsg) || 'fail' };
    });
  }

  function shareImage(dataUrl) {
    return atLeast(MIN.share).then(function (ok) {
      if (!ok || !has('share')) return { ok: false, reason: 'unsupported' };
      return tempFile(dataUrl).then(function (filePath) {
        return miniTool().share({ type: 'image', image_resource: filePath || dataUrl }).then(function (result) {
          return (result && result.errMsg && result.errMsg.indexOf('ok') >= 0)
            ? { ok: true } : { ok: false, reason: 'cancelled' };
        });
      });
    }).catch(function () { return { ok: false, reason: 'fail' } });
  }

  function publishNote(payload) {
    if (!has('postNote')) return Promise.resolve({ ok: false, reason: 'unsupported' });
    var body = { title: payload.title, content: payload.content, pageType: 'photo_publish' };
    return tempFile(payload.dataUrl).then(function (filePath) {
      body.mediaInfo = { image_resources: [{ url: filePath || payload.dataUrl }] };
      return miniTool().postNote(body).then(function (result) {
        return (result && result.errMsg && result.errMsg.indexOf('ok') >= 0)
          ? { ok: true } : { ok: false, reason: 'cancelled' };
      });
    }).catch(function () { return { ok: false, reason: 'fail' } });
  }

  /* 发评论：在线文档说明调用后容器会统一关闭小工具，所以只在用户明确点击时使用 */
  function commentWith(payload) {
    return atLeast(MIN.comment).then(function (ok) {
      if (!ok || !has('interactionOpenApi')) return { ok: false, reason: 'unsupported' };
      return tempFile(payload.dataUrl).then(function (filePath) {
        return miniTool().interactionOpenApi({
          payload: {
            action: 'post_comment',
            content: payload.content,
            media_bean: filePath ? [{ media_type: 'image', cover_image_url: filePath }] : undefined,
            miniToolSnapshotInfo: JSON.stringify({ page: 'result', docket: payload.docket || '' })
          },
          saveToAlbum: false
        }).then(function (result) {
          return (result && result.errMsg && result.errMsg.indexOf('ok') >= 0)
            ? { ok: true } : { ok: false, reason: 'cancelled' };
        });
      });
    }).catch(function () { return { ok: false, reason: 'fail' } });
  }

  window.CourtPlatform = {
    MIN: MIN,
    has: has,
    atLeast: atLeast,
    clientVersion: clientVersion,
    buildVersion: buildVersion,
    supportsFlexGap: supportsFlexGap,
    trackViewport: trackViewport,
    applyInsets: applyInsets,
    storageGet: storageGet,
    storageSet: storageSet,
    readLegacy: readLegacy,
    saveImage: saveImage,
    shareImage: shareImage,
    publishNote: publishNote,
    commentWith: commentWith
  };

  /* 尽早打上能力 class，避免首屏间距在检测完成前后跳动 */
  try {
    if (!supportsFlexGap()) document.documentElement.className += ' no-flexgap';
  } catch (error) { /* 检测失败时保留 margin 兜底：宁可间距偏大也不要贴死 */ }
  trackViewport();
  applyInsets();
})();
