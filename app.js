const judgePortrait = './assets/hero-court.jpg';
    const categories = [
      {id:'work',label:'打工人专区',mark:'职',desc:'所有让人想立刻下班的事'},
      {id:'life',label:'生活小事',mark:'日',desc:'小事不小，必须讲个道理'},
      {id:'social',label:'人际关系',mark:'人',desc:'人类社交行为观察现场'},
      {id:'digital',label:'数字世界',mark:'数',desc:'电子产品和算法也要守规矩'},
      {id:'self',label:'自我管理',mark:'己',desc:'和自己的小毛病谈谈'},
      {id:'campus',label:'校园日常',mark:'校',desc:'青春可以热血，但不要早八'}
    ];
    const defendants = [
      ['monday','周一','周末结束的第一责任人','work','周','非法侵占周末罪'],
      ['meeting','下班前临时会议','精准识别你的关机时间','work','会','非法占用个人时间罪'],
      ['simple','“简单改一下”','一句话扩建出一个新项目','work','改','扩大工作范围罪'],
      ['boss','老板画的饼','保质期长，兑现日期未知','work','饼','长期拖欠承诺罪'],
      ['alarm','闹钟','每天早上制造惊吓的惯犯','life','闹','侵犯睡眠权罪'],
      ['delivery','外卖凑单机制','为了免配送费多花了三十块','life','单','诱导非必要消费罪'],
      ['rain','下雨但没带伞','天气预报像一份参考意见','life','雨','故意扰乱心情秩序罪'],
      ['read','已读不回','已读状态稳定，回复状态失踪','social','已','无故制造情绪悬念罪'],
      ['next','“下次一定”','人类承诺体系里的常驻嘉宾','social','下','长期拖欠承诺罪'],
      ['autoplay','自动播放下一集','未经允许延长了睡前时间','digital','播','侵犯睡眠权罪'],
      ['renew','自动续费','记忆力测试和钱包测试二合一','digital','续','诱导非必要消费罪'],
      ['algorithm','算法推荐','说好只看五分钟，时间不见了','digital','算','非法占用个人时间罪'],
      ['procrastination','拖延症','计划写到明年，行动还在昨天','self','拖','屡次逃避截止日期罪'],
      ['overthink','脑内小剧场','一件小事，连夜拍完八十集','self','想','持续性精神损耗罪'],
      ['early','早八','人类文明尚未完全启动的时间','campus','早','侵犯睡眠权罪'],
      ['group','小组作业里的隐身队友','分工表上有名字，世界上没此人','campus','组','团队合作搭便车罪']
    ].map(function(x){return {id:x[0],title:x[1],subtitle:x[2],category:x[3],mark:x[4],suggested:x[5]};});
    const charges = ['非法侵占周末罪','非法占用个人时间罪','侵犯睡眠权罪','故意扰乱心情秩序罪','长期拖欠承诺罪','持续性精神损耗罪','诱导非必要消费罪','恶意制造悬念罪','扩大工作范围罪','团队合作搭便车罪'];
    const evidence = ['每周准时出现，具有反复性与持续性','已经造成明显的精神损耗','影响了正常休息与工作节奏','当事人多次提出异议，仍未改善','有大量网友提供相似证词','行为发生在最不合时宜的时间'];
    const sentencePool = ['有期徒刑 365 天','强制静音 30 天','罚没 1000 快乐币','责令公开道歉 3 次','暂停营业一个周末','强制整改至人类满意为止'];
    const judgeStyles = [{id:'strict',name:'铁面无私型',intro:'证据不足？那就再找一条。',seal:'公'},{id:'soft',name:'看似温柔型',intro:'语气温和，判罚不轻。',seal:'审'},{id:'chaos',name:'混沌随机型',intro:'判决结果连书记员都想不到。',seal:'判'}];
    const storeKey='wanniu-court-github-v1';
    let state={page:'home',step:1,category:'all',query:'',target:null,charge:'',evidence:[],judge:'strict',history:[],result:null,customOpen:false,custom:''};
    try{state.history=JSON.parse(localStorage.getItem(storeKey)||'[]')}catch(e){state.history=[]}
    const app=document.getElementById('app');
    const esc=function(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
    const catName=function(id){const c=categories.find(x=>x.id===id);return c?c.label:'自定义案件'};
    const showToast=function(msg){const el=document.getElementById('toast');el.textContent=msg;el.classList.remove('hidden');clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>el.classList.add('hidden'),2300)};
    const button=function(label,action,klass){return '<button class="button '+(klass||'primary')+'" data-action="'+action+'">'+label+'</button>'};
    const navActive=function(page){document.querySelectorAll('.nav button,.bottom-nav button').forEach(b=>b.classList.toggle('active',b.dataset.action===page))};
    const save=function(){try{localStorage.setItem(storeKey,JSON.stringify(state.history.slice(0,80)))}catch(e){}};
    function home(){return '<section class="hero"><div class="hero-copy"><div class="eyebrow">本庭今日开庭 · 第 001 号</div><h1>这点小事，<br><em>也值得开庭。</em></h1><p>周一、闹钟、已读不回……<br>那些说不清的小烦恼，来这里走个流程。<br>选一个被告，提交指控，等法官给你一个交代。</p><div class="hero-actions">'+button('随机开庭　✳','random','primary')+button('自己选个被告　＋','trial','secondary')+'</div><div class="hero-foot">无需注册 · 三步生成判决 · 纯属娱乐</div></div><div class="hero-art"><div class="judge-medallion"><img src="'+judgePortrait+'" alt="白鸽法官的版画肖像"></div><span class="hero-seal">审</span></div><div class="hero-index">NO. 001 / EST. FOR EVERY LITTLE THING</div></section>'+
      '<section class="section"><div class="section-head"><div><span class="kicker">CASE INDEX / 案件目录</span><h2>从哪个麻烦开始？</h2></div><span class="section-note">'+defendants.length+' 位常驻被告 · 也可自定义</span></div><div class="category-grid">'+categories.map(c=>'<button class="category" data-action="category" data-id="'+c.id+'"><span class="category-art"><img loading="lazy" src="./assets/categories/'+c.id+'.jpg" alt=""></span><span class="category-copy"><strong>'+c.label+'</strong><small>'+c.desc+'</small><i>'+defendants.filter(d=>d.category===c.id).length+' 件常驻案件</i></span><span class="category-arrow">↗</span></button>').join('')+'</div></section>'+
      '<section class="section"><div class="section-head"><div><span class="kicker">DAILY DOCKET / 本日卷首</span><h2>今日值班案件</h2></div><span class="section-note">每日随机抽取</span></div><div class="daily-card"><div class="daily-art"><img src="./assets/categories/life.jpg" alt="生活案件"></div><div class="daily-meta"><small>THE CASE OF TODAY</small><strong>周一</strong><span>周末结束的第一责任人</span></div><button class="text-link" data-action="daily">立即起诉　→</button></div></section>'+
      '<section class="section editorial-split"><div class="editorial-picture"><img src="'+judgePortrait+'" alt="白鸽阁下" style="object-fit:cover;object-position:center 32%"><span class="picture-caption">THE COURT OF EVERY LITTLE THING</span></div><div class="editorial-copy"><span class="kicker">NOTICE FROM THE BENCH</span><h2>本庭不大，<br><em>但很较真。</em></h2><ul class="steps"><li><b>01</b><div><strong>点名被告</strong><small>可以从常驻名单里选，也可以自己加一个。</small></div></li><li><b>02</b><div><strong>列出罪名</strong><small>把心里那点不爽，整理成正式指控。</small></div></li><li><b>03</b><div><strong>提交证据</strong><small>由本庭法官给出一份荒唐但完整的判决。</small></div></li></ul><button class="text-link" data-action="trial" style="margin-top:15px">现在去立案　→</button></div></section>'+
      '<section class="section exhibits"><div><span class="kicker" style="color:#d4b17d">EXHIBITS / 本庭常见物证</span><h2>从一杯没喝完的咖啡，<br><em>到一个永远不回的消息。</em></h2><p>有些证据不够严谨，但足够说明问题。生活里的小麻烦，都值得认真归档。</p></div><div class="exhibit-objects"><div class="exhibit-object">闹</div><div class="exhibit-object">咖</div><div class="exhibit-object">已</div></div></section>'+
      '<section class="section"><div class="section-head"><div><span class="kicker">THE COURT PEOPLE / 本庭人物</span><h2>审判席上的几位常客</h2></div><span class="section-note">他们都有自己的脾气</span></div><div class="staff-grid"><article class="staff"><img src="'+judgePortrait+'" alt="白鸽阁下"><div class="staff-caption"><small>首席审判官</small><strong>白鸽阁下</strong><span>凡事讲证据，但周一除外。</span></div></article><article class="staff"><div class="staff-caption"><small>原告代理律师</small><strong>猫律师</strong><span>先伸个懒腰，再替你讨公道。</span></div><img class="staff-portrait" src="./assets/judge-cat.jpg" alt="猫律师"></article><article class="staff"><div class="staff-caption"><small>法庭书记员</small><strong>青蛙小记</strong><span>所有离谱，都要记进卷宗。</span></div><img class="staff-portrait" src="./assets/judge-frog.jpg" alt="青蛙书记员"></article></div></section>'+
      '<section class="section"><div class="section-head"><div><span class="kicker">RECENT VERDICTS / 最近宣判</span><h2>刚刚发生的审判</h2></div><button class="text-link" data-action="archive">查看全部　→</button></div>'+(state.history.length?'<div class="archive-list">'+state.history.slice(0,3).map(item=>'<article class="archive-item"><span class="category-art" style="width:42px;height:45px;font-size:17px">'+esc(item.mark||'卷')+'</span><div><strong>'+esc(item.target)+'</strong><small>'+esc(item.charge)+' · '+esc(item.sentence)+'</small></div><button data-action="open-verdict" data-id="'+esc(item.id)+'">查看判决 →</button></article>').join('')+'</div>':'<div class="empty"><strong>卷宗室还很安静</strong><p>完成第一次审判后，判决书会收录在这里。</p></div>')+'</section>';
    }
    function progress(){return '<div class="progress">'+[1,2,3].map((n)=>'<div class="progress-step '+(state.step===n?'active':'')+'"><b>'+(state.step>n?'✓':n)+'</b>'+['选择被告','提交罪名','呈上证据'][n-1]+'</div>'+(n<3?'<span class="progress-line"></span>':'')).join('')+'</div>'}
    function trial(){let body='';if(state.step===1){const filtered=defendants.filter(d=>(state.category==='all'||d.category===state.category)&&(!state.query||(d.title+d.subtitle).includes(state.query)));body='<div class="step-illustration"><img src="./assets/categories/work.jpg" alt=""><span>本庭受理一切生活琐事</span></div><div class="step-title"><small>立案 · 01 / 选择被告</small><h2>今天，想告谁？</h2><p>不用客气，所有离谱行为都值得被认真记录。</p></div><label class="case-search"><span>⌕</span><input id="case-search" type="search" placeholder="搜索被告或生活麻烦" value="'+esc(state.query||'')+'"></label><div class="filter-row"><button class="chip '+(state.category==='all'?'active':'')+'" data-action="filter" data-id="all">全部</button>'+categories.map(c=>'<button class="chip '+(state.category===c.id?'active':'')+'" data-action="filter" data-id="'+c.id+'">'+c.label+'</button>').join('')+'</div><div class="case-grid">'+filtered.map(d=>'<button class="case-option '+(state.target&&state.target.id===d.id?'selected':'')+'" data-action="target" data-id="'+d.id+'"><span class="case-glyph">'+d.mark+'</span><span class="option-copy"><strong>'+d.title+'</strong><small>'+d.subtitle+'</small></span><span class="option-check">'+(state.target&&state.target.id===d.id?'✓':'＋')+'</span></button>').join('')+'</div><div class="custom-box"><button class="custom-toggle" data-action="custom-toggle"><strong>＋ 名单里没有？自定义被告</strong><small>比如：永远不回消息的外卖骑手、我的周末计划</small></button>'+(state.customOpen?'<div class="custom-input"><input id="custom-name" maxlength="18" placeholder="输入 2–18 个字的被告名称" value="'+esc(state.custom)+'"><button class="button primary" data-action="custom-use">确认被告</button></div>':'')+'</div><div class="step-actions"><button class="button secondary" data-action="home">暂时撤诉</button><button class="button primary" data-action="next" '+(!state.target?'disabled':'')+'>下一步：选择罪名　→</button></div>'}
      if(state.step===2){body='<div class="step-illustration"><img src="./assets/judge-cat.jpg" alt="猫律师"><span>指控应当具体，罪名可以抽象</span></div><div class="step-title"><small>指控 · 02 / 选择罪名</small><h2>给它定个罪名。</h2><p>请选一项最符合事实的指控。</p></div><div class="selected-case"><b>'+esc(state.target?state.target.title:state.custom)+'</b><span>当前被告 · '+(state.target?catName(state.target.category):'自定义案件')+'</span></div><div class="charge-grid">'+charges.map((c,i)=>'<button class="charge-option '+(state.charge===c?'selected':'')+'" data-action="charge" data-id="'+esc(c)+'"><span class="case-glyph" style="width:40px;height:40px;flex-basis:40px">§'+String(i+1).padStart(2,'0')+'</span><span class="option-copy"><strong>'+c+'</strong><small>本庭娱乐罪名 · '+(i%2?'持续性行为':'情绪与时间相关')+'</small></span><span class="option-check">'+(state.charge===c?'✓':'＋')+'</span></button>').join('')+'</div><div class="step-actions"><button class="button secondary" data-action="back">← 上一步</button><button class="button primary" data-action="next" '+(!state.charge?'disabled':'')+'>下一步：提交证据　→</button></div>'}
      if(state.step===3){body='<div class="step-illustration"><img src="./assets/evidence-objects.jpg" alt="生活物证"><span>证据不必充分，但态度必须坚决</span></div><div class="step-title"><small>举证 · 03 / 呈上证据</small><h2>证据呈上，准备开庭。</h2><p>选择 1–2 条最有说服力的证据。</p></div><div class="selected-case"><b>'+esc(state.target?state.target.title:state.custom)+'</b><span>指控：'+esc(state.charge)+'</span></div><div class="evidence-grid">'+evidence.map((e,i)=>'<button class="evidence-option '+(state.evidence.includes(e)?'selected':'')+'" data-action="evidence" data-id="'+esc(e)+'"><span class="option-check">'+(state.evidence.includes(e)?'✓':'＋')+'</span><span class="option-copy"><strong>'+e+'</strong><small>证据编号 · '+String(i+1).padStart(2,'0')+'</small></span></button>').join('')+'</div><div class="step-title" style="margin-bottom:8px"><small>JUDGE STYLE / 法官风格</small><h2 style="font-size:20px">今天由谁来判？</h2></div><div class="judge-options">'+judgeStyles.map(j=>'<button class="judge-option '+(state.judge===j.id?'selected':'')+'" data-action="judge" data-id="'+j.id+'"><strong>'+j.seal+'　'+j.name+'</strong><small>'+j.intro+'</small></button>').join('')+'</div><div class="step-actions"><button class="button secondary" data-action="back">← 上一步</button><button class="button primary" data-action="verdict" '+(!state.evidence.length?'disabled':'')+'>正式开庭　⚖</button></div>'}
      return '<section class="page"><div class="page-top"><button class="back" data-action="home">← 返回首页</button><span>立案大厅 / INTAKE DESK</span></div><div class="trial-shell">'+progress()+body+'</div></section>'}
    function makeVerdict(){const style=judgeStyles.find(x=>x.id===state.judge)||judgeStyles[0];const sentence=sentencePool[Math.floor(Math.random()*sentencePool.length)];const item={id:Date.now().toString(36)+Math.random().toString(36).slice(2,6),date:new Date().toLocaleDateString('zh-CN'),docket:'（2026）万审字第'+String(Math.floor(Math.random()*8999)+1000)+'号',target:state.target?state.target.title:state.custom,mark:state.target?state.target.mark:'诉',charge:state.charge,evidence:state.evidence.slice(),sentence,penalty:['缓刑期间不得于周日晚上 21:00 后发出叹息','责令每周补充三次快乐活动','公开向当事人的睡眠时间道歉'][Math.floor(Math.random()*3)],judge:style.name,judgeComment:['经审理，本庭认为其行为反复，影响明显，依法应予严肃处理。','本庭理解此事的复杂性，但理解不代表免罚。','书记员已经笑场，说明案件确有必要从重处理。'][Math.floor(Math.random()*3)]};state.result=item;state.history=[item].concat(state.history.filter(x=>x.id!==item.id)).slice(0,80);save();state.page='result';render()}
    function verdict(item){const v=item||state.result;if(!v)return '';return '<div class="result-heading"><span class="seal">宣</span><span class="kicker">THE VERDICT IS IN / 审判宣告</span><h1>审判结束。<em>判决如下。</em></h1><p>本庭已完成审理，卷宗已归档。现在轮到你来看看判得合不合理。</p></div><div class="result-layout"><article class="verdict"><div class="verdict-top"><span>COURT OF EVERY LITTLE THING</span><span>'+esc(v.docket)+'</span></div><div class="verdict-title"><strong>万物审判庭</strong><small>娱乐法庭 · 刑事判决书</small></div><div class="verdict-line"><label>被告</label><div><strong>'+esc(v.target)+'</strong></div></div><div class="verdict-line"><label>罪名</label><div><strong>'+esc(v.charge)+'</strong><p>经本庭审理，相关行为已造成持续性精神损耗。</p></div></div><div class="verdict-line"><label>证据</label><div>'+v.evidence.map((e,i)=>'<p>'+(i+1)+'. '+esc(e)+'</p>').join('')+'</div></div><div class="sentence-box"><small>本庭判决如下</small><strong>'+esc(v.sentence)+'</strong><p style="font-size:10px;margin:0;color:#7e7060">附加处罚：'+esc(v.penalty)+'</p></div><div class="judge-comment"><div><small>审判官 · '+esc(v.judge)+'</small><p>'+esc(v.judgeComment)+'</p></div><span class="stamp">审判<br>生效</span></div><div class="verdict-top" style="margin-top:20px"><span>'+esc(v.date)+'</span><span>纯属娱乐 · 不具法律效力</span></div></article><aside class="result-side"><div class="side-card"><span class="kicker">SHARE THE VERDICT</span><h3>把判决晒出去</h3><p>生成判决图片，或复制一段适合发小红书的文案。</p><button class="button primary" data-action="poster">↓　保存判决图片</button><button class="button secondary" style="width:100%;color:var(--ink);border-color:#cdbca5" data-action="copy">▣　复制判决文案</button></div><div class="side-card"><h3>不服？申请再审。</h3><p>同一案件重新抽取判决，看看法官会不会改主意。</p><button class="button primary" data-action="appeal">重新审判　↻</button><button class="button secondary" style="width:100%;color:var(--ink);border-color:#cdbca5" data-action="archive">查看我的卷宗　→</button></div></aside></div>'}
    function archive(){return '<section class="page"><div class="page-top"><button class="back" data-action="home">← 返回首页</button><span>卷宗室 / PERSONAL ARCHIVE</span></div><div class="archive-banner"><img src="./assets/archive-cat.jpg" alt="猫咪档案员正在整理卷宗" loading="lazy"><div><span class="kicker">YOUR COURT RECORDS / 档案室</span><h2>我的卷宗室。</h2><p>每一次不爽，都有一份正式记录。</p><small>'+state.history.length+' 份判决已经归档</small></div></div>'+(state.history.length?'<div class="archive-list">'+state.history.map(x=>'<article class="archive-item"><span class="category-art" style="width:47px;height:48px">'+esc(x.mark)+'</span><div><strong>'+esc(x.target)+'</strong><small>'+esc(x.docket)+' · '+esc(x.sentence)+'</small></div><button data-action="open-verdict" data-id="'+esc(x.id)+'">查看判决 →</button><button data-action="delete" data-id="'+esc(x.id)+'">删除</button></article>').join('')+'</div>':'<div class="empty"><strong>这里暂时没有卷宗</strong><p>第一份判决书还没诞生。去审判庭带一个案件回来吧。</p><button class="button primary" data-action="trial">开始第一次审判　→</button></div>')+'</section>'}
    function gallery(){const filtered=defendants.filter(d=>(state.category==='all'||d.category===state.category)&&(!state.query||(d.title+d.subtitle).includes(state.query)));return '<section class="page"><div class="page-top"><button class="back" data-action="home">← 返回首页</button><span>CASE ENCYCLOPEDIA / 案件图鉴</span></div><div class="gallery-intro"><div><span class="kicker">THE DEFENDANT INDEX</span><h2>本庭收录的<br>生活小麻烦。</h2><p>有些被告尚未到庭，但名字已经在卷宗里出现很多次。</p></div><img src="./assets/archive-cat.jpg" alt="档案员整理案件图鉴"></div><label class="case-search"><span>⌕</span><input id="gallery-search" type="search" placeholder="搜一搜被告名称" value="'+esc(state.query||'')+'"></label><div class="filter-row"><button class="chip '+(state.category==='all'?'active':'')+'" data-action="filter" data-id="all">全部</button>'+categories.map(c=>'<button class="chip '+(state.category===c.id?'active':'')+'" data-action="filter" data-id="'+c.id+'">'+c.label+'</button>').join('')+'</div><div class="gallery-list">'+filtered.map(d=>'<button class="gallery-case" data-action="select-case" data-id="'+d.id+'"><img src="./assets/categories/'+d.category+'.jpg" alt=""><span><strong>'+esc(d.title)+'</strong><small>'+esc(d.subtitle)+'</small><i>'+esc(catName(d.category))+'</i></span><b>＋</b></button>').join('')+'</div>'+(filtered.length?'':'<div class="empty"><strong>暂时没有找到这个被告</strong><p>换个关键词，或者自己把它写进诉状。</p></div>')+'</section>'}
    function processing(){return '<section class="page"><div class="deliberation"><div class="deliberation-art"><img src="./assets/hero-court.jpg" alt="法庭正在合议"><span>合议庭 · 正在评议</span></div><div class="deliberation-paper"><span class="kicker">THE COURT IS IN SESSION</span><h2>正在形成判决。</h2><p>书记员正在核对证据，法官正在讨论处罚方式。</p><div class="process-step"><b>✓</b><span>核查案件材料</span></div><div class="process-step"><b>✓</b><span>听取双方陈述</span></div><div class="process-step active"><b>…</b><span>合议庭裁决中</span></div><div class="process-bar"><i></i></div></div></div></section>'}
    function render(){const active=state.page==='archive'?'archive':state.page==='gallery'?'gallery':state.page==='trial'?'trial':'home';navActive(active);app.innerHTML=state.page==='trial'?trial():state.page==='result'?'<section class="page">'+verdict()+'</section>':state.page==='processing'?processing():state.page==='archive'?archive():state.page==='gallery'?gallery():home();window.scrollTo({top:0,behavior:'smooth'})}
    function openDeliberation(){state.page='processing';render();window.setTimeout(function(){makeVerdict()},1050)}
    function pickRandom(){const d=defendants[Math.floor(Math.random()*defendants.length)];state.target=d;state.charge=d.suggested;state.evidence=[evidence[Math.floor(Math.random()*evidence.length)]];state.judge=judgeStyles[Math.floor(Math.random()*judgeStyles.length)].id;openDeliberation()}
    async function poster(){
      if(!state.result)return;
      const v=state.result;
      const canvas=document.createElement('canvas');
      canvas.width=1080;canvas.height=1440;
      const g=canvas.getContext('2d');
      const paper=g.createLinearGradient(0,0,1080,1440);
      paper.addColorStop(0,'#fbf3e5');paper.addColorStop(1,'#eee0c8');
      g.fillStyle=paper;g.fillRect(0,0,1080,1440);
      g.strokeStyle='#9f7547';g.lineWidth=5;g.strokeRect(34,34,1012,1372);
      g.strokeStyle='#d3b98f';g.lineWidth=2;g.strokeRect(52,52,976,1364);
      g.fillStyle='#8f2f28';g.fillRect(52,52,976,12);
      g.fillStyle='#c29350';g.fillRect(52,64,976,4);
      const drawText=(text,x,y,font,color,align)=>{g.font=font;g.fillStyle=color;g.textAlign=align||'left';g.fillText(String(text),x,y)};
      const wrap=(text,x,y,maxWidth,lineHeight,font,color)=>{
        g.font=font;g.fillStyle=color;g.textAlign='left';
        const lines=[];let line='';
        for(const char of String(text)){
          const candidate=line+char;
          if(line&&g.measureText(candidate).width>maxWidth){lines.push(line);line=char}else{line=candidate}
        }
        if(line)lines.push(line);
        lines.forEach((item,index)=>g.fillText(item,x,y+index*lineHeight));
        return y+Math.max(1,lines.length)*lineHeight;
      };
      const fit=(text,maxWidth,start=42,min=24)=>{
        let size=start;
        while(size>min){g.font='bold '+size+'px serif';if(g.measureText(text).width<=maxWidth)break;size-=2}
        return 'bold '+size+'px serif';
      };
      try{
        const hero=await new Promise((resolve,reject)=>{
          const image=new Image();image.onload=()=>resolve(image);image.onerror=reject;image.src='./assets/hero-court.jpg';
        });
        g.save();
        g.beginPath();g.rect(84,90,912,300);g.clip();
        const scale=Math.max(912/hero.width,300/hero.height);
        const width=hero.width*scale,height=hero.height*scale;
        g.drawImage(hero,(1080-width)/2,(300-height)/2+90,width,height);
        g.restore();
        g.fillStyle='rgba(43,25,19,.22)';g.fillRect(84,90,912,300);
        g.strokeStyle='#c49a60';g.lineWidth=4;g.strokeRect(84,90,912,300);
      }catch(error){
        g.fillStyle='#382721';g.fillRect(84,90,912,300);
        drawText('万物审判庭',540,245,'bold 68px serif','#f5e5cb','center');
      }
      drawText('THE COURT OF EVERY LITTLE THING',540,440,'24px Georgia','#98764d','center');
      drawText('万物审判庭',540,510,'bold 58px serif','#34251e','center');
      drawText('娱乐法庭 · 刑事判决书',540,558,'30px serif','#8f3028','center');
      g.strokeStyle='#c4a77c';g.lineWidth=2;g.beginPath();g.moveTo(130,590);g.lineTo(950,590);g.stroke();
      const row=(label,value,y,font='30px serif')=>{
        drawText(label,145,y,'25px sans-serif','#98764f','left');
        wrap(value,300,y,630,38,font,'#3b2b21');
      };
      row('案　号',v.docket,650,'26px sans-serif');
      row('被　告',v.target,710,fit(v.target,630,40,28));
      row('罪　名',v.charge,775,fit(v.charge,630,34,25));
      drawText('主要证据',145,858,'25px sans-serif','#98764f','left');
      let evidenceY=858;
      v.evidence.forEach((item,index)=>{
        evidenceY=wrap((index+1)+'. '+item,300,evidenceY,630,35,'23px sans-serif','#514236');
      });
      const panelY=Math.max(970,Math.min(1080,evidenceY+22));
      g.fillStyle='#92342c';g.fillRect(115,panelY,850,190);
      g.strokeStyle='#d5af71';g.lineWidth=3;g.strokeRect(127,panelY+12,826,166);
      drawText('本 庭 判 决 如 下',540,panelY+54,'25px serif','#f8e9d2','center');
      drawText(v.sentence,540,panelY+124,fit(v.sentence,760,56,34),'#fff0d9','center');
      wrap('附加处罚：'+v.penalty,190,panelY+160,700,27,'20px sans-serif','#f1d7b2');
      const footY=panelY+238;
      drawText('审判官 · '+v.judge,145,footY,'23px serif','#76583a','left');
      wrap(v.judgeComment,145,footY+42,640,31,'21px serif','#4b3c2e');
      g.save();g.translate(864,footY+34);g.rotate(-.12);
      g.strokeStyle='#a6382f';g.lineWidth=5;g.strokeRect(-66,-66,132,132);
      g.strokeStyle='#a6382f';g.lineWidth=2;g.strokeRect(-57,-57,114,114);
      drawText('审',0,-3,'bold 58px serif','#a6382f','center');
      drawText('判 决 生 效',0,35,'15px serif','#a6382f','center');
      g.restore();
      g.strokeStyle='#c4a77c';g.beginPath();g.moveTo(130,1352);g.lineTo(950,1352);g.stroke();
      drawText(v.date+'  ·  纯属娱乐，不具法律效力',540,1380,'19px sans-serif','#907958','center');
      const anchor=document.createElement('a');
      anchor.href=canvas.toDataURL('image/png');
      anchor.download='万物审判庭-'+v.docket+'.png';
      anchor.click();
      showToast('判决书已生成，正在保存图片。');
    }
    app.addEventListener('input',e=>{if(e.target.id==='custom-name')state.custom=e.target.value});
    app.addEventListener('change',e=>{if(e.target.id==='case-search'||e.target.id==='gallery-search'){state.query=e.target.value.trim();render()} });
    app.addEventListener('click',async e=>{const b=e.target.closest('[data-action]');if(!b)return;const a=b.dataset.action,id=b.dataset.id;
      if(a==='home'){state.page='home';render()}else if(a==='archive'){state.page='archive';render()}else if(a==='trial'){state.page='trial';state.step=1;state.category='all';state.target=null;state.charge='';state.evidence=[];state.customOpen=false;render()}
      else if(a==='random'||a==='daily')pickRandom()
      else if(a==='gallery'){state.page='gallery';state.category='all';render()}
      else if(a==='category'){state.category=id;state.page='trial';state.step=1;render()}
      else if(a==='filter'){state.category=id;render()}
      else if(a==='select-case'){const d=defendants.find(x=>x.id===id);if(d){state.target=d;state.charge=d.suggested;state.evidence=[];state.step=2;state.page='trial';render()}}
      else if(a==='target'){state.target=defendants.find(d=>d.id===id);state.charge=state.target?state.target.suggested:'';render()}
      else if(a==='custom-toggle'){state.customOpen=!state.customOpen;render()}
      else if(a==='custom-use'){const value=state.custom.trim();if(value.length<2||value.length>18){showToast('请输入 2–18 个字的被告名称');return}state.target=null;state.custom=value;state.charge='故意扰乱心情秩序罪';state.step=2;render()}
      else if(a==='next'){if(state.step===1&&!state.target){showToast('请先选择一位被告');return}if(state.step===2&&!state.charge){showToast('请先选择一个罪名');return}state.step++;render()}
      else if(a==='back'){state.step=Math.max(1,state.step-1);render()}
      else if(a==='charge'){state.charge=id;render()}
      else if(a==='evidence'){state.evidence=state.evidence.includes(id)?state.evidence.filter(x=>x!==id):state.evidence.length<2?state.evidence.concat(id):state.evidence.slice(1).concat(id);render()}
      else if(a==='judge'){state.judge=id;render()}
      else if(a==='verdict'){if(!state.evidence.length){showToast('至少提交一条证据');return}openDeliberation()}
      else if(a==='appeal'){state.page='trial';state.step=3;state.evidence=[];state.result=null;render()}
      else if(a==='poster')await poster()
      else if(a==='copy'){if(!state.result)return;const v=state.result;const text='我把「'+v.target+'」告上了万物审判庭！\\n罪名：'+v.charge+'\\n判决：'+v.sentence+'\\n审判官：'+v.judge+'\\n你觉得判得合理吗？';try{await navigator.clipboard.writeText(text);showToast('判决文案已复制')}catch(err){showToast('当前环境不支持复制，请手动选择文案')}}
      else if(a==='open-verdict'){const item=state.history.find(x=>x.id===id);if(item){state.result=item;state.page='result';render()}}
      else if(a==='delete'){state.history=state.history.filter(x=>x.id!==id);save();render();showToast('卷宗已删除')}
    });
    render();
