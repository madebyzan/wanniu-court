const judgePortrait = './assets/characters/judge-pigeon.png';
    const sceneAssets = {hero:'./assets/scenes/hero-court.png',hall:'./assets/scenes/case-hall.png',filing:'./assets/scenes/filing-hall.png',deliberation:'./assets/scenes/deliberation-room.png',archive:'./assets/scenes/archive-room.png',verdict:'./assets/scenes/verdict-paper.png'};
    const characterAssets = {judge:'./assets/characters/judge-pigeon.png',cat:'./assets/characters/cat-lawyer.png',frog:'./assets/characters/frog-clerk.png',hamster:'./assets/characters/hamster-archivist.png',hedgehog:'./assets/characters/hedgehog-bailiff.png',rabbit:'./assets/characters/rabbit-witness.png'};
    const propAssets = {folder:'./assets/props/case-folder.png',column:'./assets/props/court-column.png',crown:'./assets/props/crown.png',envelope:'./assets/props/evidence-envelope.png',gavel:'./assets/props/gavel.png',hourglass:'./assets/props/hourglass.png',laurel:'./assets/props/laurel-wreath.png',magnifier:'./assets/props/magnifier.png',watch:'./assets/props/pocket-watch.png',quill:'./assets/props/quill.png',candlestick:'./assets/props/royal-candlestick.png',key:'./assets/props/royal-key.png',scroll:'./assets/props/royal-scroll.png',seal:'./assets/props/royal-seal.png',shield:'./assets/props/royal-shield.png',scales:'./assets/props/scales.png'};
    const categoryAssets = {work:'./assets/defendants/meeting.png',life:'./assets/defendants/alarm.png',social:'./assets/characters/cat-lawyer.png',digital:'./assets/defendants/algorithm.png',self:'./assets/defendants/procrastination.png',campus:'./assets/defendants/early.png'};
    const defendantAssets = {monday:'./assets/defendants/monday.png',meeting:'./assets/defendants/meeting.png',simple:'./assets/defendants/simple-change.png',boss:'./assets/defendants/boss.png',alarm:'./assets/defendants/alarm.png',delivery:'./assets/defendants/delivery.png',rain:'./assets/defendants/rain.png',read:'./assets/defendants/read.png',next:'./assets/defendants/next.png',autoplay:'./assets/defendants/autoplay.png',renew:'./assets/defendants/renew.png',algorithm:'./assets/defendants/algorithm.png',procrastination:'./assets/defendants/procrastination.png',overthink:'./assets/defendants/overthink.png',early:'./assets/defendants/early.png',group:'./assets/defendants/group.png'};
    const courtProps = [{name:'案件卷宗',desc:'收录指控与判决的正式卷册',image:propAssets.folder},{name:'正义科林斯柱',desc:'审判庭的庄严立柱',image:propAssets.column},{name:'王室冠冕',desc:'法庭荣誉与身份象征',image:propAssets.crown},{name:'证据档案信封',desc:'封存来往证词与材料',image:propAssets.envelope},{name:'法槌与底座',desc:'开庭与宣判的信号',image:propAssets.gavel},{name:'王冠沙漏',desc:'合议庭的计时器',image:propAssets.hourglass},{name:'月桂正义徽章',desc:'胜诉与荣誉的装饰徽记',image:propAssets.laurel},{name:'正义放大镜',desc:'检查细枝末节的证据',image:propAssets.magnifier},{name:'珐琅怀表',desc:'记录案件发生的时间',image:propAssets.watch},{name:'羽毛笔与墨水',desc:'书写正式诉状与判词',image:propAssets.quill},{name:'巴洛克双烛台',desc:'档案室与审判厅照明',image:propAssets.candlestick},{name:'王室钥匙徽章',desc:'通往卷宗室的象征',image:propAssets.key},{name:'法徽卷轴',desc:'公示法庭公告与规章',image:propAssets.scroll},{name:'红蜡正义印章',desc:'封缄档案与判决副本',image:propAssets.seal},{name:'正义盾牌',desc:'法庭徽记与装饰盾牌',image:propAssets.shield},{name:'天平徽章',desc:'衡量事实与指控',image:propAssets.scales}];
    const courtCharacters = [{name:'白鸽阁下',role:'首席审判官',image:characterAssets.judge},{name:'猫律师',role:'原告代理律师',image:characterAssets.cat},{name:'青蛙小记',role:'法庭书记员',image:characterAssets.frog},{name:'仓鼠档案员',role:'卷宗管理员',image:characterAssets.hamster},{name:'刺猬执法官',role:'法庭秩序官',image:characterAssets.hedgehog},{name:'兔子证人',role:'案件证人',image:characterAssets.rabbit}];
    const courtScenes = [{name:'主审判庭',desc:'开庭与首席法官审理',image:sceneAssets.hero},{name:'案件大厅',desc:'浏览案件并进入立案',image:sceneAssets.hall},{name:'立案受理处',desc:'接收用户提交的起诉',image:sceneAssets.filing},{name:'秘密合议室',desc:'法官与书记员讨论裁决',image:sceneAssets.deliberation},{name:'档案室',desc:'整理和保存历次卷宗',image:sceneAssets.archive},{name:'判决书纸张',desc:'独立判决书的纸面底图',image:sceneAssets.verdict}];
    
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
    defendants.forEach(function(defendant){defendant.image=defendantAssets[defendant.id]});
    const caseCharges={
      monday:['非法占用休息时间罪','强制周末加班罪','扰乱星期秩序罪'],
      meeting:['非法占用个人时间罪','临时会议突袭罪','侵犯下班安宁罪'],
      simple:['扩大工作范围罪','需求边界模糊罪','版本无限追加罪'],
      boss:['长期拖欠承诺罪','空头承诺罪','虚构未来收益罪'],
      alarm:['侵犯睡眠权罪','清晨惊吓罪','重复制造噪音罪'],
      delivery:['诱导非必要消费罪','凑单金额误导罪','钱包轻度侵害罪'],
      rain:['故意扰乱出行秩序罪','天气预报失信罪','未尽提醒义务罪'],
      read:['无故制造情绪悬念罪','已读不回持续行为罪','沟通义务怠慢罪'],
      next:['长期拖欠承诺罪','口头计划不履行罪','未来日期滥用罪'],
      autoplay:['未经许可延长观看时间罪','侵犯睡眠权罪','自动播放越权罪'],
      renew:['诱导非必要消费罪','续费提醒不充分罪','钱包静默扣款罪'],
      algorithm:['非法占用个人时间罪','信息流过度投喂罪','注意力诱导罪'],
      procrastination:['屡次逃避截止日期罪','计划书空转罪','明日复明日罪'],
      overthink:['持续性精神损耗罪','虚构情节扰乱心神罪','过度推演罪'],
      early:['侵犯睡眠权罪','清晨强制出勤罪','人类启动时间压缩罪'],
      group:['团队合作搭便车罪','分工履行缺席罪','署名与贡献不符罪']
    };
    const caseEvidence={
      monday:['周日 21:47，日历突然提醒“明天周一”，当事人情绪明显下降。','每周固定出现一次，具有周期性与重复性。','周五下班时尚有希望，周日晚间希望值归零。'],
      meeting:['会议邀请在下班前不足十分钟发出，标题却写着“简单同步”。','会议结束时间多次晚于约定下班时间。','当事人已经合上电脑，仍被要求“再看一眼”。'],
      simple:['最初需求只有一句话，数轮沟通后已扩展成完整项目。','“只改一点点”没有提供明确验收边界。','修改记录显示：小改动持续发生，结束日期始终未定。'],
      boss:['承诺内容清晰，兑现日期却持续向未来移动。','饼已多次画出，尚未发现任何可食用实物。','当事人曾询问进度，得到的答复仍是“快了”。'],
      alarm:['闹铃在睡眠最深的时段准时响起，从未迟到。','当事人多次按下稍后提醒，仍遭连续追击。','休息日也未获得安静豁免。'],
      delivery:['为了满足免配送门槛，当事人额外购买了并不需要的商品。','凑单前后总价增加，心理上却误以为自己省了钱。','优惠提示醒目，真实支出变化不够醒目。'],
      rain:['降雨发生时，当事人未携带雨具且无处躲避。','天气变化恰好发生在出门之后。','天气提醒未能在关键时刻发挥应有作用。'],
      read:['消息显示已读，回复却迟迟没有出现。','当事人反复查看对话框，沟通进度没有变化。','沉默持续时间明显超过正常等待耐心。'],
      next:['“下次一定”已重复出现多次，仍未落实具体日期。','计划表上存在承诺记录，却没有执行痕迹。','当事人曾认真等待，最终只等到新的“下次”。'],
      autoplay:['视频结束后未经确认便自动播放下一集。','当事人原计划只看一集，实际观看时长持续增加。','睡前时间被连续占用，且缺少明显停止提醒。'],
      renew:['扣费发生时，当事人未主动发起本次购买。','续费提醒不够醒目，账单提醒却非常准时。','服务仍在持续扣费，使用频率已明显下降。'],
      algorithm:['打开应用时只打算看五分钟，关闭时已过去很久。','推荐内容高度连续，停止观看的提示不够明显。','当事人多次表示“最后一个”，仍继续下滑。'],
      procrastination:['待办事项多次延期，截止日期反复向后移动。','已经制定计划，却迟迟没有开始第一步。','当事人频繁整理计划工具，实际进度没有同步增长。'],
      overthink:['一个普通细节在脑内被反复回放，并衍生出多种假设。','相关剧情尚无证据支持，却已经完成多轮推演。','当事人因此消耗大量注意力，现实事件并未发生变化。'],
      early:['闹钟响起时，身体与灵魂均未完成启动。','课程时间早于正常清醒时间，且每周重复发生。','当事人曾提出延后申请，未获采纳。'],
      group:['任务分工表有明确署名，交付物中却没有对应成果。','其他成员多次催促，回应仍停留在“马上”。','最终汇报时贡献记录与实际工作量不一致。']
    };
    const caseFindings={
      monday:'争议焦点：周末是否属于可以被随意征用的公共资源。',
      meeting:'争议焦点：下班前发出的会议邀请，是否天然具有强制执行力。',
      simple:'争议焦点：一句“简单改一下”，能否无限扩大项目边界。',
      boss:'争议焦点：长期存在但从未兑现的承诺，是否仍可称为福利。',
      alarm:'争议焦点：闹钟是否应当尊重人类尚未启动的清晨。',
      delivery:'争议焦点：为了免配送费而多花的钱，究竟算节省还是反向消费。',
      rain:'争议焦点：没有带伞的责任，应由谁来承担。',
      read:'争议焦点：已读状态是否意味着回复义务已经自动完成。',
      next:'争议焦点：“下次一定”是否可以无限延期而不承担责任。',
      autoplay:'争议焦点：自动播放是否取得了继续占用睡前时间的许可。',
      renew:'争议焦点：用户忘记取消，是否等于主动同意续费。',
      algorithm:'争议焦点：推荐内容是否对被消失的时间负有解释义务。',
      procrastination:'争议焦点：计划是否可以长期代替行动。',
      overthink:'争议焦点：尚未发生的事情，是否有资格提前消耗当事人的精力。',
      early:'争议焦点：早八是否超过了普通人类的合理启动范围。',
      group:'争议焦点：分工表上的名字，是否可以代替实际贡献。'
    };
    const verdictSentences={
      work:['责令被告归还当事人一个完整的下班夜晚。','判处被告强制静音 12 小时，并暂停临时需求权。','责令被告提交清晰需求边界，未经确认不得追加。'],
      life:['判处被告赔偿一个不被打扰的周末下午。','责令被告连续三日保持低存在感。','罚没被告 500 快乐币，并向当事人的耐心公开道歉。'],
      social:['责令被告在合理期限内明确表达，不得长期制造悬念。','判处被告暂停模糊承诺权，直至提交可执行日期。','赔偿当事人一份清晰、直接、不用猜的沟通。'],
      digital:['判处被告暂停自动播放权七日。','责令被告公开显示真实使用时长，不得隐匿下一集。','罚没被告 30 分钟注意力使用额度，返还给当事人。'],
      self:['责令被告将宏大计划拆解为一个今天就能完成的小动作。','判处被告先行动五分钟，之后才可继续整理计划。','准予被告缓刑，但须提交连续三日的实际进度。'],
      campus:['判处被告公开说明实际贡献，并补齐缺失任务。','责令被告为早八提供一份合理的精神补偿。','判处被告暂停隐身权，直至完成本次小组任务。'],
      custom:['责令被告立即停止该项离谱行为，并提交书面整改说明。','判处被告赔偿当事人一份安宁，并接受持续监督。','罚没被告 300 快乐币，直至当事人表示满意。']
    };
    const penaltiesByJudge={
      strict:['限期 24 小时内完成整改，逾期追加一份书面检讨。','公开道歉一次，并连续七日提交整改记录。','暂停相关行为权限七日，接受书记员复查。'],
      soft:['允许被告说明情况，但须补偿当事人一份完整休息时间。','给予一次改过机会，并约定下一次不得再犯。','准予缓期执行，前提是立即开始第一项改正。'],
      chaos:['罚没一整袋快乐币，并接受青蛙书记员现场监督。','判处被告听完《我错了》循环三遍，不得快进。','追加一项神秘任务：给当事人买一杯喜欢的饮料。']
    };
    const judgeComments={
      strict:['证据链条完整，行为具有重复性，本庭不接受“我以为没关系”。','事实已经查明，理由可以很多，整改必须马上开始。','本庭只看证据，不看借口；本案依法从严处理。'],
      soft:['本庭理解生活有时不容易，但理解不代表可以继续添乱。','考虑到被告仍有改正空间，本庭决定温和地重判一次。','希望被告记住：体谅是情分，不是无限次豁免。'],
      chaos:['书记员在记录时笑出了声，但判决依然具有仪式感。','本案超出常规理解范围，故交由快乐法典临时处理。','法官沉思三秒后决定：先罚再说，细节由命运补充。']
    };
    const pickOne=function(list){return list[Math.floor(Math.random()*list.length)]};
    const evidenceFor=function(target){const specific=target&&caseEvidence[target.id]?caseEvidence[target.id]:[];return specific.concat(evidence).slice(0,6)};
    const chargesFor=function(target){const specific=target&&caseCharges[target.id]?caseCharges[target.id]:[];return Array.from(new Set([target&&target.suggested,state.charge].filter(Boolean).concat(specific,charges))).slice(0,8)};
    const getDailyDocket=function(){
      const now=new Date(),year=now.getFullYear(),month=String(now.getMonth()+1).padStart(2,'0'),day=String(now.getDate()).padStart(2,'0');
      const dateKey=year+'-'+month+'-'+day,dayNumber=Math.floor(Date.UTC(year,now.getMonth(),now.getDate())/86400000);
      return {dateKey:dateKey,dateLabel:month+'月'+day+'日',edition:String(dayNumber%365+1).padStart(3,'0'),defendant:defendants[dayNumber%defendants.length]};
    };

    const charges = ['非法侵占周末罪','非法占用个人时间罪','侵犯睡眠权罪','故意扰乱心情秩序罪','长期拖欠承诺罪','持续性精神损耗罪','诱导非必要消费罪','恶意制造悬念罪','扩大工作范围罪','团队合作搭便车罪'];
    const evidence = ['每周准时出现，具有反复性与持续性','已经造成明显的精神损耗','影响了正常休息与工作节奏','当事人多次提出异议，仍未改善','有大量网友提供相似证词','行为发生在最不合时宜的时间'];
    const sentencePool = ['有期徒刑 365 天','强制静音 30 天','罚没 1000 快乐币','责令公开道歉 3 次','暂停营业一个周末','强制整改至人类满意为止'];
    const judgeStyles = [{id:'strict',name:'铁面无私型',intro:'证据不足？那就再找一条。',seal:'公'},{id:'soft',name:'看似温柔型',intro:'语气温和，判罚不轻。',seal:'审'},{id:'chaos',name:'混沌随机型',intro:'判决结果连书记员都想不到。',seal:'判'}];
    const storeKey='wanniu-court-github-v1';
    let state={page:'home',step:1,category:'all',query:'',target:null,charge:'',evidence:[],judge:'strict',history:[],result:null,customOpen:false,custom:'',galleryTab:'cases',caseMode:'manual',appealOf:null,appealRound:0,posterBlob:null,posterUrl:null,posterFilename:''};
    try{const stored=JSON.parse(localStorage.getItem(storeKey)||'[]');state.history=Array.isArray(stored)?stored.slice(0,80):[]}catch(e){state.history=[]}
    const app=document.getElementById('app');
    const esc=function(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
    const catName=function(id){const c=categories.find(x=>x.id===id);return c?c.label:'自定义案件'};
    const showToast=function(msg){const el=document.getElementById('toast');el.textContent=msg;el.classList.remove('hidden');clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>el.classList.add('hidden'),2300)};
    const button=function(label,action,klass){return '<button class="button '+(klass||'primary')+'" data-action="'+action+'">'+label+'</button>'};
    const navActive=function(page){document.querySelectorAll('.nav button,.bottom-nav button').forEach(b=>b.classList.toggle('active',b.dataset.action===page))};
    const save=function(){try{localStorage.setItem(storeKey,JSON.stringify(state.history.slice(0,80)))}catch(e){}};
    function home(){const daily=getDailyDocket();const dailyDone=state.history.some(function(item){return item.source==='daily'&&item.dailyDate===daily.dateKey});return '<section class="hero"><div class="hero-stage"><img class="hero-background" src="'+sceneAssets.hero+'" alt="复古木刻风格的万物审判庭大厅"><div class="hero-copy"><div class="eyebrow">本庭今日开庭 · 第 001 号</div><h1>这点小事，<br><em>也值得开庭。</em></h1><p>周一、闹钟、已读不回……<br>那些说不清的小烦恼，来这里走个流程。<br>选一个被告，提交指控，等法官给你一个交代。</p><div class="hero-actions">'+button('随机开庭','random','primary')+button('自己选个被告　＋','trial','secondary')+'</div><div class="hero-foot">无需注册 · 三步生成判决 · 纯属娱乐</div></div><span class="hero-index">NO. 001 / EST. FOR EVERY LITTLE THING</span></div><div class="hero-caption"><span>THE COURT OF EVERY LITTLE THING</span><b>万物皆可审，认真但不必当真。</b></div></section>'+
      '<section class="section"><div class="section-head"><div><span class="kicker">CASE INDEX / 案件目录</span><h2>从哪个麻烦开始？</h2></div><span class="section-note">'+defendants.length+' 位常驻被告 · 也可自定义</span></div><div class="category-grid">'+categories.map(c=>'<button class="category" data-action="category" data-id="'+c.id+'"><span class="category-art"><img loading="lazy" src="'+categoryAssets[c.id]+'" alt=""></span><span class="category-copy"><strong>'+c.label+'</strong><small>'+c.desc+'</small><i>'+defendants.filter(d=>d.category===c.id).length+' 件常驻案件</i></span><span class="category-arrow">↗</span></button>').join('')+'</div></section>'+
      '<section class="section"><div class="section-head"><div><span class="kicker">DAILY DOCKET / 每日专属案件</span><h2>今日值班案件</h2></div><span class="section-note">每日 00:00 更新 · '+daily.dateLabel+'</span></div><button class="daily-card" data-action="daily"><div class="daily-art"><img src="'+daily.defendant.image+'" alt="'+daily.defendant.title+'案件插画"></div><div class="daily-meta"><small>NO. '+daily.edition+' / TODAY\'S CASE</small><strong>'+daily.defendant.title+'</strong><span>'+daily.defendant.subtitle+'</span><i class="daily-status">'+(dailyDone?'今日已结案 · 可再次审理':'今日案件待审 · 完成后收入卷宗')+'</i></div><span class="text-link">'+(dailyDone?'再次审理　↻':'立即开庭　→')+'</span></button></section>'+
      '<section class="section editorial-split"><div class="editorial-picture"><img src="'+sceneAssets.filing+'" alt="复古立案大厅"><span class="picture-caption">THE COURT IS OPEN</span></div><div class="editorial-copy"><span class="kicker">NOTICE FROM THE BENCH</span><h2>本庭不大，<br><em>但很较真。</em></h2><ul class="steps"><li><b>01</b><div><strong>点名被告</strong><small>可以从常驻名单里选，也可以自己加一个。</small></div></li><li><b>02</b><div><strong>列出罪名</strong><small>把心里那点不爽，整理成正式指控。</small></div></li><li><b>03</b><div><strong>提交证据</strong><small>由本庭法官给出一份荒唐但完整的判决。</small></div></li></ul><button class="text-link" data-action="trial" style="margin-top:15px">现在去立案　→</button></div></section>'+
      '<section class="section exhibits"><div><span class="kicker">EXHIBITS / 本庭常见物证</span><h2>法槌、天平、一本法典，<br><em>生活小事也要认真开庭。</em></h2><p>每一份离谱指控，都需要一点仪式感。把小烦恼递上来，本庭会郑重其事地处理。</p></div><div class="exhibit-objects"><div class="exhibit-object"><img src="'+propAssets.gavel+'" alt="法槌"></div><div class="exhibit-object"><img src="'+propAssets.scales+'" alt="天平"></div><div class="exhibit-object"><img src="'+propAssets.folder+'" alt="案件卷宗"></div></div></section>'+
      '<section class="section"><div class="section-head"><div><span class="kicker">THE COURT PEOPLE / 本庭人物</span><h2>审判席上的几位常客</h2></div><span class="section-note">他们都有自己的脾气</span></div><div class="staff-grid">'+courtCharacters.map(person=>'<article class="staff"><img src="'+person.image+'" alt="'+person.name+'"><div class="staff-caption"><small>'+person.role+'</small><strong>'+person.name+'</strong></div></article>').join('')+'</div></section>'+
      '<section class="section"><div class="section-head"><div><span class="kicker">RECENT VERDICTS / 最近宣判</span><h2>刚刚发生的审判</h2></div><button class="text-link" data-action="archive">查看全部　→</button></div>'+(state.history.length?'<div class="archive-list">'+state.history.slice(0,3).map(item=>'<article class="archive-item"><span class="category-art" style="width:42px;height:45px;font-size:17px">'+esc(item.mark||'卷')+'</span><div><strong>'+esc(item.target)+'</strong><small>'+esc(item.charge)+' · '+esc(item.sentence)+'</small></div><button data-action="open-verdict" data-id="'+esc(item.id)+'">查看判决 →</button></article>').join('')+'</div>':'<div class="empty"><strong>卷宗室还很安静</strong><p>完成第一次审判后，判决书会收录在这里。</p></div>')+'</section>';}
    function progress(){return '<div class="progress">'+[1,2,3].map((n)=>'<div class="progress-step '+(state.step===n?'active':'')+'"><b>'+(state.step>n?'✓':n)+'</b>'+['选择被告','提交罪名','呈上证据'][n-1]+'</div>'+(n<3?'<span class="progress-line"></span>':'')).join('')+'</div>'}
    function trial(){let body='';if(state.step===1){const filtered=defendants.filter(d=>(state.category==='all'||d.category===state.category)&&(!state.query||(d.title+d.subtitle).includes(state.query)));body='<div class="step-illustration"><img src="'+sceneAssets.hall+'" alt=""><span>本庭受理一切生活琐事</span></div><div class="step-title"><small>立案 · 01 / 选择被告</small><h2>今天，想告谁？</h2><p>不用客气，所有离谱行为都值得被认真记录。</p></div><label class="case-search"><span>⌕</span><input id="case-search" type="search" placeholder="搜索被告或生活麻烦" value="'+esc(state.query||'')+'"></label><div class="filter-row"><button class="chip '+(state.category==='all'?'active':'')+'" data-action="filter" data-id="all">全部</button>'+categories.map(c=>'<button class="chip '+(state.category===c.id?'active':'')+'" data-action="filter" data-id="'+c.id+'">'+c.label+'</button>').join('')+'</div><div class="case-grid">'+filtered.map(d=>'<button class="case-option '+(state.target&&state.target.id===d.id?'selected':'')+'" data-action="target" data-id="'+d.id+'"><span class="case-glyph"><img loading="lazy" src="'+d.image+'" alt=""></span><span class="option-copy"><strong>'+d.title+'</strong><small>'+d.subtitle+'</small></span><span class="option-check">'+(state.target&&state.target.id===d.id?'✓':'＋')+'</span></button>').join('')+'</div><div class="custom-box"><button class="custom-toggle" data-action="custom-toggle"><strong>＋ 名单里没有？自定义被告</strong><small>比如：永远不回消息的外卖骑手、我的周末计划</small></button>'+(state.customOpen?'<div class="custom-input"><input id="custom-name" maxlength="18" placeholder="输入 2–18 个字的被告名称" value="'+esc(state.custom)+'"><button class="button primary" data-action="custom-use">确认被告</button></div>':'')+'</div><div class="step-actions"><button class="button secondary" data-action="home">暂时撤诉</button><button class="button primary" data-action="next" '+(!state.target?'disabled':'')+'>下一步：选择罪名　→</button></div>'}
      if(state.step===2){body='<div class="step-illustration"><img src="'+characterAssets.cat+'" alt="猫律师"><span>指控应当具体，罪名可以抽象</span></div><div class="step-title"><small>指控 · 02 / 选择罪名</small><h2>给它定个罪名。</h2><p>请选一项最符合事实的指控。</p></div><div class="selected-case"><b>'+esc(state.target?state.target.title:state.custom)+'</b><span>当前被告 · '+(state.target?catName(state.target.category):'自定义案件')+'</span></div><div class="charge-grid">'+chargesFor(state.target).map((c,i)=>'<button class="charge-option '+(state.charge===c?'selected':'')+'" data-action="charge" data-id="'+esc(c)+'"><span class="case-glyph" style="width:40px;height:40px;flex-basis:40px">§'+String(i+1).padStart(2,'0')+'</span><span class="option-copy"><strong>'+c+'</strong><small>本庭娱乐罪名 · '+(i%2?'持续性行为':'情绪与时间相关')+'</small></span><span class="option-check">'+(state.charge===c?'✓':'＋')+'</span></button>').join('')+'</div><div class="step-actions"><button class="button secondary" data-action="back">← 上一步</button><button class="button primary" data-action="next" '+(!state.charge?'disabled':'')+'>下一步：提交证据　→</button></div>'}
      if(state.step===3){body='<div class="step-illustration"><img src="'+characterAssets.rabbit+'" alt="生活物证"><span>证据不必充分，但态度必须坚决</span></div><div class="step-title"><small>举证 · 03 / 呈上证据</small><h2>证据呈上，准备开庭。</h2><p>选择 1–2 条最有说服力的证据；每位被告都有自己的案件线索。</p></div><div class="selected-case"><b>'+esc(state.target?state.target.title:state.custom)+'</b><span>指控：'+esc(state.charge)+'</span></div><div class="evidence-grid">'+evidenceFor(state.target).map((e,i)=>'<button class="evidence-option '+(state.evidence.includes(e)?'selected':'')+'" data-action="evidence" data-id="'+esc(e)+'" '+(!state.evidence.includes(e)&&state.evidence.length>=2?'disabled':'')+'><span class="option-check">'+(state.evidence.includes(e)?'✓':'＋')+'</span><span class="option-copy"><strong>'+e+'</strong><small>证据编号 · '+String(i+1).padStart(2,'0')+'</small></span></button>').join('')+'</div><div class="step-title" style="margin-bottom:8px"><small>JUDGE STYLE / 法官风格</small><h2 style="font-size:20px">今天由谁来判？</h2></div><div class="judge-options">'+judgeStyles.map(j=>'<button class="judge-option '+(state.judge===j.id?'selected':'')+'" data-action="judge" data-id="'+j.id+'"><strong>'+j.seal+'　'+j.name+'</strong><small>'+j.intro+'</small></button>').join('')+'</div><div class="step-actions"><button class="button secondary" data-action="back">← 上一步</button><button class="button primary" data-action="verdict" '+(!state.evidence.length?'disabled':'')+'>正式开庭　⚖</button></div>'}
      return '<section class="page"><div class="page-top"><button class="back" data-action="home">← 返回首页</button><span>立案大厅 / INTAKE DESK</span></div><div class="trial-shell">'+progress()+body+'</div></section>'}
        function makeVerdict(){
      if(state.page!=='processing')return;
      const style=judgeStyles.find(function(x){return x.id===state.judge})||judgeStyles[0];
      const target=state.target,category=target?target.category:'custom';
      const sentence=pickOne(verdictSentences[category]||verdictSentences.custom);
      const daily=state.caseMode==='daily'?getDailyDocket():null;
      const item={
        id:Date.now().toString(36)+Math.random().toString(36).slice(2,7),
        date:new Date().toLocaleDateString('zh-CN'),
        docket:'（'+new Date().getFullYear()+'）万审字第'+String(Math.floor(Math.random()*8999)+1000)+'号',
        target:target?target.title:state.custom,defendantId:target?target.id:null,category:category,
        mark:target?target.mark:'诉',charge:state.charge,evidence:state.evidence.slice(0,2),
        finding:target&&caseFindings[target.id]?caseFindings[target.id]:'争议焦点：这件事是否已经超出当事人的合理忍耐范围。',
        sentence:sentence,penalty:pickOne(penaltiesByJudge[style.id]||penaltiesByJudge.strict),
        judge:style.name,judgeComment:pickOne(judgeComments[style.id]||judgeComments.strict)+(state.evidence.length>1?' 本案提交两项证据，依法从重考虑。':' 本庭已记录当事人的第一项证据。'),
        source:state.caseMode||'manual',dailyDate:daily?daily.dateKey:null,appealOf:state.appealOf||null,
        appealRound:state.appealOf?(state.appealRound||1):0,reaction:''
      };
      state.result=item;state.history=[item].concat(state.history.filter(function(x){return x.id!==item.id})).slice(0,80);
      save();state.appealOf=null;state.appealRound=0;state.caseMode='manual';state.page='result';render();
    }
function verdict(item){
      const v=item||state.result;if(!v)return '';
      const appealLabel=v.appealRound?'第 '+(v.appealRound+1)+' 次审理':'初审判决';
      const caseType=v.source==='daily'?'每日专属案件':v.source==='quick'?'随机速审':v.source==='appeal'?'再审案件':'正式立案';
      const reactions=[{id:'fair',label:'判得刚好',mark:'✓'},{id:'light',label:'判得太轻',mark:'＋'},{id:'heavy',label:'判得太重',mark:'－'}];
      return '<div class="result-heading"><span class="seal">宣</span><span class="kicker">THE VERDICT IS IN / '+caseType.toUpperCase()+' · '+appealLabel+'</span><h1>'+(v.appealRound?'再审结束。':'审判结束。')+'<em>判决如下。</em></h1><p>'+(v.appealRound?'本庭已重新听取证据，作出新的裁定。':'本庭已完成审理，卷宗已归档。现在轮到你来看看判得合不合理。')+'</p></div><div class="result-layout"><article class="verdict"><div class="verdict-top"><span>COURT OF EVERY LITTLE THING</span><span>'+esc(v.docket)+'</span></div><div class="verdict-title"><strong>万物审判庭</strong><small>娱乐法庭 · 刑事判决书</small></div><div class="verdict-line"><label>被告</label><div><strong>'+esc(v.target)+'</strong><p>'+esc(v.category?catName(v.category):'自定义案件')+' · '+caseType+'</p></div></div><div class="verdict-line"><label>罪名</label><div><strong>'+esc(v.charge)+'</strong><p>经本庭审理，相关行为已造成持续性精神损耗。</p></div></div><div class="verdict-finding"><small>本案争议焦点</small><p>'+esc(v.finding||'本庭已完成对相关行为的审理。')+'</p></div><div class="verdict-line"><label>证据</label><div>'+((v.evidence||[]).map(function(e,i){return '<p>'+(i+1)+'. '+esc(e)+'</p>'}).join('')||'<p>当事人陈述已记录在案。</p>')+'</div></div><div class="sentence-box"><small>本庭判决如下</small><strong>'+esc(v.sentence)+'</strong><p style="font-size:10px;margin:0;color:#7e7060">附加处罚：'+esc(v.penalty)+'</p></div><div class="judge-comment"><div><small>审判官 · '+esc(v.judge)+'</small><p>'+esc(v.judgeComment)+'</p></div><span class="stamp">审判<br>生效</span></div><div class="verdict-top" style="margin-top:20px"><span>'+esc(v.date)+'</span><span>纯属娱乐 · 不具法律效力</span></div></article><aside class="result-side"><div class="side-card"><span class="kicker">SHARE THE VERDICT</span><h3>把判决晒出去</h3><p>先预览海报。手机内置浏览器可长按图片保存；支持系统分享时，也可以直接分享原图。</p><button class="button primary" data-action="poster">生成判决海报　↗</button><button class="button secondary" style="width:100%;color:var(--ink);border-color:#cdbca5" data-action="copy">▣　复制小红书文案</button></div><div class="side-card"><h3>你觉得这份判决合理吗？</h3><p>选一个态度，留在这份本地卷宗里。</p><div class="reaction-grid">'+reactions.map(function(r){return '<button class="reaction-option '+(v.reaction===r.id?'selected':'')+'" data-action="reaction" data-id="'+r.id+'" aria-pressed="'+(v.reaction===r.id?'true':'false')+'"><b>'+r.mark+'</b><span>'+r.label+'</span></button>'}).join('')+'</div><small class="local-note">仅保存在当前设备，不会上传。</small></div><div class="side-card"><h3>不服？申请再审。</h3><p>保留原指控和已提交证据，再听一次合议庭意见。</p><button class="button primary" data-action="appeal">申请再审　↻</button><button class="button secondary" style="width:100%;color:var(--ink);border-color:#cdbca5" data-action="archive">查看我的卷宗　→</button></div></aside></div>';
    }
function archive(){
      return '<section class="page"><div class="page-top"><button class="back" data-action="home">← 返回首页</button><span>卷宗室 / PERSONAL ARCHIVE</span></div><div class="archive-banner"><img class="archive-room-art" src="'+sceneAssets.archive+'" alt="复古木刻风格档案室"><div class="archive-banner-copy"><span class="kicker">YOUR COURT RECORDS / 档案室</span><h2>我的卷宗室。</h2><p>每一次不爽，都有一份正式记录。</p><small>'+state.history.length+' 份判决已经归档</small></div><img class="archive-mascot" src="'+characterAssets.hamster+'" alt="仓鼠档案管理员"></div>'+(state.history.length?'<div class="archive-list">'+state.history.map(function(x){const portrait=x.defendantId&&defendantAssets[x.defendantId]?defendantAssets[x.defendantId]:characterAssets.rabbit;return '<article class="archive-item"><img class="archive-case-image" src="'+portrait+'" alt=""><div class="archive-item-copy"><strong>'+esc(x.target||'未命名案件')+'</strong><small>'+esc(x.docket||'卷宗编号待补')+' · '+esc(x.sentence||'待宣判')+'</small><span>'+(x.appealRound?'再审 · 第 '+(x.appealRound+1)+' 次':'初审')+' · '+esc(x.date||'')+'</span></div><button data-action="open-verdict" data-id="'+esc(x.id)+'">查看判决 →</button><button data-action="delete" data-id="'+esc(x.id)+'" aria-label="删除 '+esc(x.target||'案件')+'">删除</button></article>'}).join('')+'</div>':'<div class="empty"><strong>这里暂时没有卷宗</strong><p>第一份判决书还没诞生。去审判庭带一个案件回来吧。</p><button class="button primary" data-action="trial">开始第一次审判　→</button></div>')+'</section>';
    }
function gallery(){const tabs='<div class="gallery-tabs"><button class="chip '+(state.galleryTab==='cases'?'active':'')+'" data-action="gallery-tab" data-id="cases">案件被告</button><button class="chip '+(state.galleryTab==='characters'?'active':'')+'" data-action="gallery-tab" data-id="characters">法庭角色</button><button class="chip '+(state.galleryTab==='props'?'active':'')+'" data-action="gallery-tab" data-id="props">法庭物件</button><button class="chip '+(state.galleryTab==='scenes'?'active':'')+'" data-action="gallery-tab" data-id="scenes">场景陈列</button></div>';const intro='<div class="gallery-intro"><div><span class="kicker">THE COURT COLLECTION</span><h2>本庭图鉴。</h2><p>人物、物证与案件都已收录在册。</p></div><img src="'+characterAssets.hamster+'" alt="仓鼠档案管理员"></div>';if(state.galleryTab==='props'){return '<section class="page"><div class="page-top"><button class="back" data-action="home">← 返回首页</button><span>COURT OBJECTS / 法庭物件</span></div>'+intro+tabs+'<div class="prop-grid">'+courtProps.map((p,i)=>'<article class="prop-card"><div class="prop-illustration"><img loading="lazy" src="'+p.image+'" alt="'+p.name+'"></div><div class="prop-copy"><small>EXHIBIT · '+String(i+1).padStart(2,'0')+'</small><strong>'+p.name+'</strong><span>'+p.desc+'</span></div></article>').join('')+'</div></section>'}if(state.galleryTab==='characters'){return '<section class="page"><div class="page-top"><button class="back" data-action="home">← 返回首页</button><span>COURT PEOPLE / 法庭角色</span></div>'+intro+tabs+'<div class="character-grid">'+courtCharacters.map((p,i)=>'<article class="character-card"><div class="character-illustration"><img loading="lazy" src="'+p.image+'" alt="'+p.name+'"></div><div class="character-copy"><small>PERSONNEL · '+String(i+1).padStart(2,'0')+'</small><strong>'+p.name+'</strong><span>'+p.role+'</span></div></article>').join('')+'</div></section>'}if(state.galleryTab==='scenes'){return '<section class="page"><div class="page-top"><button class="back" data-action="home">← 返回首页</button><span>COURT LOCATIONS / 场景陈列</span></div>'+intro+tabs+'<div class="scene-grid">'+courtScenes.map((s,i)=>'<article class="scene-card"><img loading="lazy" src="'+s.image+'" alt="'+s.name+'"><div><small>LOCATION · '+String(i+1).padStart(2,'0')+'</small><strong>'+s.name+'</strong><span>'+s.desc+'</span></div></article>').join('')+'</div></section>'}const filtered=defendants.filter(d=>(state.category==='all'||d.category===state.category)&&(!state.query||(d.title+d.subtitle).includes(state.query)));return '<section class="page"><div class="page-top"><button class="back" data-action="home">← 返回首页</button><span>CASE ENCYCLOPEDIA / 案件图鉴</span></div>'+intro+tabs+'<label class="case-search"><span>⌕</span><input id="gallery-search" type="search" placeholder="搜一搜被告名称" value="'+esc(state.query||'')+'"></label><div class="filter-row"><button class="chip '+(state.category==='all'?'active':'')+'" data-action="filter" data-id="all">全部</button>'+categories.map(c=>'<button class="chip '+(state.category===c.id?'active':'')+'" data-action="filter" data-id="'+c.id+'">'+c.label+'</button>').join('')+'</div><div class="gallery-list">'+filtered.map(d=>'<button class="gallery-case" data-action="select-case" data-id="'+d.id+'"><img src="'+d.image+'" alt=""><span><strong>'+esc(d.title)+'</strong><small>'+esc(d.subtitle)+'</small><i>'+esc(catName(d.category))+'</i></span><b>＋</b></button>').join('')+'</div>'+(filtered.length?'':'<div class="empty"><strong>暂时没有找到这个被告</strong><p>换个关键词，或者自己把它写进诉状。</p></div>')+'</section>'}
    function processing(){return '<section class="page"><div class="deliberation"><div class="deliberation-art"><img src="'+sceneAssets.deliberation+'" alt="法庭正在合议"><span>合议庭 · 正在评议</span></div><div class="deliberation-paper"><div class="deliberation-staff"><img src="'+characterAssets.hedgehog+'" alt="刺猬执法官"><img src="'+characterAssets.frog+'" alt="青蛙书记员"><span>执法官与书记员正在核对卷宗</span></div><span class="kicker">THE COURT IS IN SESSION</span><h2>正在形成判决。</h2><p>书记员正在核对证据，法官正在讨论处罚方式。</p><div class="process-step"><b>✓</b><span>核查案件材料</span></div><div class="process-step"><b>✓</b><span>听取双方陈述</span></div><div class="process-step active"><b>…</b><span>合议庭裁决中</span></div><div class="process-footer"><img src="'+propAssets.hourglass+'" alt="沙漏" loading="lazy"><div class="process-bar"><i></i></div></div></div></div></section>'}
    function render(options){
      options=options||{};
      const active=state.page==='archive'?'archive':state.page==='gallery'?'gallery':state.page==='trial'?'trial':'home';
      navActive(active);
      app.innerHTML=state.page==='trial'?trial():state.page==='result'?'<section class="page">'+verdict()+'</section>':state.page==='processing'?processing():state.page==='archive'?archive():state.page==='gallery'?gallery():home();
      if(options.focusId){
        const focused=document.getElementById(options.focusId);
        if(focused){focused.focus();if(typeof options.selectionStart==='number'&&typeof focused.setSelectionRange==='function'){try{focused.setSelectionRange(options.selectionStart,options.selectionEnd)}catch(error){}}}
      }
      if(options.scroll!==false&&!options.focusId)window.scrollTo({top:0,behavior:'smooth'});
    }
    let deliberationToken=0;
    function openDeliberation(){
      const token=++deliberationToken;state.page='processing';render();
      window.setTimeout(function(){if(token===deliberationToken&&state.page==='processing')makeVerdict()},1100);
    }
    function pickRandom(mode){
      const kind=mode||'quick',daily=kind==='daily'?getDailyDocket():null;
      const defendant=daily?daily.defendant:defendants[Math.floor(Math.random()*defendants.length)];
      const options=evidenceFor(defendant).slice();
      for(let i=options.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[options[i],options[j]]=[options[j],options[i]]}
      state.target=defendant;state.custom='';state.charge=defendant.suggested;
      state.evidence=options.slice(0,2);state.judge=judgeStyles[Math.floor(Math.random()*judgeStyles.length)].id;
      state.caseMode=kind;state.appealOf=null;state.appealRound=0;openDeliberation();
    }
    function startAppeal(){
      const previous=state.result;if(!previous)return;
      state.target=previous.defendantId?defendants.find(function(d){return d.id===previous.defendantId})||null:null;
      state.custom=state.target?'':previous.target;state.charge=previous.charge;
      state.evidence=Array.isArray(previous.evidence)?previous.evidence.slice(0,2):[];
      state.judge=state.judge||'strict';state.appealOf=previous.id;state.appealRound=(previous.appealRound||0)+1;state.caseMode='appeal';
      state.result=null;state.page='trial';state.step=3;render();
    }
    function recordReaction(reaction){
      if(!state.result||!['fair','light','heavy'].includes(reaction))return;
      state.result.reaction=reaction;
      state.history=state.history.map(function(item){return item.id===state.result.id?state.result:item});
      save();render({scroll:false});
      showToast(reaction==='fair'?'已记录：判得刚好':reaction==='light'?'已记录：判得太轻':'已记录：判得太重');
    }

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
          const image=new Image();image.onload=()=>resolve(image);image.onerror=reject;image.src=''+sceneAssets.hero+'';
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
      const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));
      if(!blob){showToast('图片生成失败，请重试');return}
      if(state.posterUrl)URL.revokeObjectURL(state.posterUrl);
      state.posterBlob=blob;state.posterUrl=URL.createObjectURL(blob);
      state.posterFilename='万物审判庭-'+String(v.docket||'判决书').replace(/[（）()\s]/g,'')+'.png';
      const modal=document.createElement('section');
      modal.className='poster-preview';modal.setAttribute('role','dialog');modal.setAttribute('aria-modal','true');modal.setAttribute('aria-label','判决海报预览');
      modal.innerHTML='<div class="poster-dialog"><div class="poster-dialog-head"><div><small>SHAREABLE COURT RECORD</small><strong>判决海报已就绪</strong></div><button class="poster-close" data-action="poster-close" aria-label="关闭预览">×</button></div><div class="poster-image-wrap"><img src="'+state.posterUrl+'" alt="万物审判庭判决海报，可长按保存"></div><p class="poster-hint">在手机里长按图片，选择“保存到相册”。支持系统分享时，也可以直接分享原图。</p><div class="poster-actions"><button class="button primary" data-action="poster-download">下载原图</button><button class="button secondary" data-action="poster-share">系统分享</button></div></div>';
      app.appendChild(modal);modal.querySelector('.poster-close').focus();
    }
    async function sharePoster(){
      if(!state.posterBlob){showToast('请先生成判决海报');return}
      if(typeof File==='undefined'||!navigator.share){showToast('当前环境不支持系统分享，请长按预览图保存');return}
      const file=new File([state.posterBlob],state.posterFilename,{type:'image/png'});
      if(navigator.canShare&&!navigator.canShare({files:[file]})){showToast('当前环境不支持分享图片，请长按预览图保存');return}
      try{await navigator.share({files:[file],title:'我的万物审判庭判决',text:'我把这件生活小事告上了万物审判庭。你觉得判得合理吗？'})}
      catch(error){if(error&&error.name!=='AbortError')showToast('系统分享暂不可用，请长按预览图保存')}
    }
    function closePosterPreview(){
      const modal=app.querySelector('.poster-preview');if(modal)modal.remove();
      if(state.posterUrl){URL.revokeObjectURL(state.posterUrl);state.posterUrl=null}
    }
    async function copyVerdictText(){
      if(!state.result)return;
      const v=state.result;
      const content=['我把「'+v.target+'」告上了万物审判庭！','罪名：'+v.charge,'判决：'+v.sentence,'附加处罚：'+v.penalty,'审判官：'+v.judge,'你觉得判得合理吗？','', '#万物审判庭 #生活吐槽 #今日判决'].join('\n');
      try{await navigator.clipboard.writeText(content);showToast('小红书分享文案已复制')}
      catch(error){
        const textarea=document.createElement('textarea');textarea.value=content;textarea.setAttribute('readonly','');textarea.style.position='fixed';textarea.style.opacity='0';document.body.appendChild(textarea);textarea.select();
        const copied=document.execCommand&&document.execCommand('copy');textarea.remove();showToast(copied?'小红书分享文案已复制':'复制失败，请长按选择文案');
      }
    }
    app.addEventListener('input',function(e){
      if(e.target.id==='custom-name'){state.custom=e.target.value;return}
      if(e.target.id==='case-search'||e.target.id==='gallery-search'){
        const id=e.target.id,start=e.target.selectionStart,end=e.target.selectionEnd;
        state.query=e.target.value;render({scroll:false,focusId:id,selectionStart:start,selectionEnd:end});
      }
    });
    app.addEventListener('keydown',function(e){
      if(e.key==='Enter'&&e.target.id==='custom-name'){e.preventDefault();const confirm=app.querySelector('[data-action="custom-use"]');if(confirm)confirm.click()}
      if(e.key==='Escape')closePosterPreview();
    });
    app.addEventListener('click',async function(e){
      const button=e.target.closest('[data-action]');if(!button)return;
      const action=button.dataset.action,id=button.dataset.id;
      if(action==='home'){state.page='home';render()}
      else if(action==='archive'){state.page='archive';render()}
      else if(action==='trial'){
        state.page='trial';state.step=1;state.category='all';state.query='';state.target=null;state.charge='';state.evidence=[];state.custom='';state.customOpen=false;state.caseMode='manual';state.appealOf=null;state.appealRound=0;render();
      }
      else if(action==='random')pickRandom('quick')
      else if(action==='daily')pickRandom('daily')
      else if(action==='gallery'){state.page='gallery';state.category='all';state.query='';state.galleryTab='cases';render()}
      else if(action==='gallery-tab'){state.galleryTab=id;state.query='';render()}
      else if(action==='category'){
        state.category=id;state.page='trial';state.step=1;state.query='';state.target=null;state.charge='';state.evidence=[];state.custom='';state.caseMode='manual';state.appealOf=null;render();
      }
      else if(action==='filter'){state.category=id;render({scroll:false})}
      else if(action==='select-case'){
        const defendant=defendants.find(function(d){return d.id===id});
        if(defendant){state.target=defendant;state.custom='';state.charge=defendant.suggested;state.evidence=[];state.caseMode='manual';state.appealOf=null;state.appealRound=0;state.step=2;state.page='trial';render()}
      }
      else if(action==='target'){
        state.target=defendants.find(function(d){return d.id===id})||null;
        state.custom='';state.charge=state.target?state.target.suggested:'';state.evidence=[];state.caseMode='manual';state.appealOf=null;state.appealRound=0;render({scroll:false});
      }
      else if(action==='custom-toggle'){state.customOpen=!state.customOpen;render({scroll:false})}
      else if(action==='custom-use'){
        const value=state.custom.trim();
        if(value.length<2||value.length>18){showToast('请输入 2–18 个字的被告名称');return}
        state.target=null;state.custom=value;state.charge='故意扰乱心情秩序罪';state.evidence=[];state.caseMode='manual';state.appealOf=null;state.appealRound=0;state.step=2;render();
      }
      else if(action==='next'){
        if(state.step===1&&!state.target){showToast('请先选择一位被告');return}
        if(state.step===2&&!state.charge){showToast('请先选择一个罪名');return}
        state.step++;render();
      }
      else if(action==='back'){state.step=Math.max(1,state.step-1);render()}
      else if(action==='charge'){state.charge=id;render({scroll:false})}
      else if(action==='evidence'){
        if(state.evidence.includes(id))state.evidence=state.evidence.filter(function(value){return value!==id});
        else if(state.evidence.length<2)state.evidence=state.evidence.concat(id);
        else{showToast('最多提交两条证据；取消一条后再选择');return}
        render({scroll:false});
      }
      else if(action==='judge'){state.judge=id;render({scroll:false})}
      else if(action==='verdict'){if(!state.evidence.length){showToast('至少提交一条证据');return}openDeliberation()}
      else if(action==='appeal')startAppeal()
      else if(action==='reaction')recordReaction(id)
      else if(action==='poster')await poster()
      else if(action==='poster-download'){
        if(!state.posterUrl)return;
        const anchor=document.createElement('a');anchor.href=state.posterUrl;anchor.download=state.posterFilename;document.body.appendChild(anchor);anchor.click();anchor.remove();
        showToast('图片下载已发起；手机浏览器也可以长按预览图保存');
      }
      else if(action==='poster-share')await sharePoster()
      else if(action==='poster-close')closePosterPreview()
      else if(action==='copy')await copyVerdictText()
      else if(action==='open-verdict'){
        const item=state.history.find(function(record){return record.id===id});
        if(item){state.result=item;state.page='result';render()}
      }
      else if(action==='delete'){
        state.history=state.history.filter(function(record){return record.id!==id});
        if(state.result&&state.result.id===id)state.result=null;
        save();render();showToast('卷宗已删除');
      }
    });
    render();
