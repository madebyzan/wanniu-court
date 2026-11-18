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

  /* 安全区优先级：容器注入的 --safe-area-inset-* > getWindowInfo 换算 > env() > 0。
     CSS 已经写了后两级兜底，这里只补 getWindowInfo 这一条路径。 */
  function applySafeArea() {
    atLeast(MIN.window).then(function (ok) {
      if (!ok || !has('getWindowInfo')) return null;
      return miniTool().getWindowInfo().then(function (info) {
        var area = info && info.safeArea;
        if (!area) return;
        var root = document.documentElement;
        var top = Number(area.top) || 0;
        var bottom = Math.max(0, (Number(info.windowHeight) || Number(info.screenHeight) || 0) - (Number(area.bottom) || 0));
        var left = Number(area.left) || 0;
        var right = Math.max(0, (Number(info.windowWidth) || Number(info.screenWidth) || 0) - (Number(area.right) || 0));
        if (top > 0) root.style.setProperty('--safe-area-inset-top', top + 'px');
        if (bottom > 0) root.style.setProperty('--safe-area-inset-bottom', bottom + 'px');
        if (left > 0) root.style.setProperty('--safe-area-inset-left', left + 'px');
        if (right > 0) root.style.setProperty('--safe-area-inset-right', right + 'px');
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
    applySafeArea: applySafeArea,
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
  applySafeArea();
})();
