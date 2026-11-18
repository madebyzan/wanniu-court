/* 容器 JS API 的测试替身。
   只用于在浏览器里验证「调用约定」是否被正确实现（key 序列化、errMsg 判定、
   版本门槛、迁移、失败必须上报而不是谎报成功）。
   这不是真机验证：创服平台模拟器、Android/iOS 扫码仍必须由用户完成。 */
export const mockInit = (opts = {}) => {
  const buildVersion = opts.buildVersion ?? 9533000;
  const store = new Map();
  const calls = [];
  const record = (name, args, result) => { calls.push({ name, args, result }); return result; };

  const kv = (key) => String(key);
  window.__mock = { calls, store, fail: opts.fail || {} };

  const rejectIf = (name) => {
    if (window.__mock.fail[name]) throw { errMsg: name + ':fail ' + window.__mock.fail[name], errCode: opts.failCode || 2001 };
  };

  window.xhs = {
    launchOptions: opts.noSyncLaunch ? undefined : { miniToolEnv: { buildVersion, userDataPath: '/mock/usr' } },
    miniTool: {
      getLaunchOptions() {
        if (opts.noGetLaunchOptions) return Promise.reject({ errMsg: 'getLaunchOptions:fail unavailable' });
        return Promise.resolve(record('getLaunchOptions', {}, { errMsg: 'getLaunchOptions:ok', miniToolEnv: { buildVersion, userDataPath: '/mock/usr' } }));
      },
      getWindowInfo() {
        return Promise.resolve(record('getWindowInfo', {}, {
          errMsg: 'getWindowInfo:ok', pixelRatio: 3, screenWidth: 390, screenHeight: 844,
          windowWidth: 390, windowHeight: 844, statusBarHeight: 44, screenTop: 0,
          safeArea: { top: 44, left: 0, right: 390, bottom: 810, width: 390, height: 766 },
          menuButtons: { back: null, close: { left: 8, top: 8, right: 40, bottom: 40, width: 32, height: 32 }, share: null, more: null }
        }));
      },
      setStorage({ key, data }) {
        rejectIf('setStorage');
        if (typeof data !== 'string') return Promise.reject({ errMsg: 'setStorage:fail data must be a string', errCode: 10001 });
        store.set(kv(key), data);
        return Promise.resolve(record('setStorage', { key, length: data.length }, { errMsg: 'setStorage:ok' }));
      },
      getStorage({ key }) {
        rejectIf('getStorage');
        const has = store.has(kv(key));
        return Promise.resolve(record('getStorage', { key, hit: has }, { errMsg: 'getStorage:ok', data: has ? store.get(kv(key)) : null }));
      },
      getStorageInfo() {
        return Promise.resolve({ errMsg: 'getStorageInfo:ok', keys: [...store.keys()], usedBytes: 0, limitBytes: 10485760 });
      },
      removeStorage({ key }) { store.delete(kv(key)); return Promise.resolve({ errMsg: 'removeStorage:ok' }); },
      writeTempFile({ data }) {
        rejectIf('writeTempFile');
        if (typeof data !== 'string' || !data.startsWith('data:')) return Promise.reject({ errMsg: 'writeTempFile:fail bad data', errCode: 10001 });
        return Promise.resolve(record('writeTempFile', { bytes: data.length }, { errMsg: 'writeTempFile:ok', filePath: '/mock/tmp/poster.png' }));
      },
      saveImageToPhotosAlbum({ filePath }) {
        rejectIf('saveImageToPhotosAlbum');
        if (!filePath) return Promise.reject({ errMsg: 'saveImageToPhotosAlbum:fail missing filePath', errCode: 10001 });
        return Promise.resolve(record('saveImageToPhotosAlbum', { filePath }, { errMsg: 'saveImageToPhotosAlbum:ok' }));
      },
      share(options) {
        rejectIf('share');
        return Promise.resolve(record('share', options, { errMsg: 'share:ok' }));
      },
      postNote(body) {
        rejectIf('postNote');
        const res = body && body.mediaInfo && body.mediaInfo.image_resources;
        if (!res || !res.length) return Promise.reject({ errMsg: 'postNote:fail mediaInfo required', errCode: 10001 });
        return Promise.resolve(record('postNote', { title: body.title, contentLength: (body.content || '').length, pageType: body.pageType }, { errMsg: 'postNote:ok' }));
      },
      interactionOpenApi(body) {
        return Promise.resolve(record('interactionOpenApi', body, { errMsg: 'interactionOpenApi:ok', routed: true, savedToAlbum: false }));
      }
    }
  };
};

export const names = (calls) => calls.map(c => c.name);
