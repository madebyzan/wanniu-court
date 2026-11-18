/* 万物审判庭 · 应用层
   经典脚本（容器 CSP 不允许 type="module"），依赖 platform.js 先执行。
   语法上限 ES2017，目标 Chrome 61。 */
(function () {
  'use strict';

  var judgePortrait = './assets/characters/judge-pigeon.webp';
    const sceneAssets = {hero:'./assets/scenes/hero-court.webp',hall:'./assets/scenes/case-hall.webp',filing:'./assets/scenes/filing-hall.webp',deliberation:'./assets/scenes/deliberation-room.webp',archive:'./assets/scenes/archive-room.webp',verdict:'./assets/scenes/verdict-paper.webp'};
    const characterAssets = {judge:'./assets/characters/judge-pigeon.webp',cat:'./assets/characters/cat-lawyer.webp',frog:'./assets/characters/frog-clerk.webp',hamster:'./assets/characters/hamster-archivist.webp',hedgehog:'./assets/characters/hedgehog-bailiff.webp',rabbit:'./assets/characters/rabbit-witness.webp'};
    const propAssets = {folder:'./assets/props/case-folder.webp',column:'./assets/props/court-column.webp',crown:'./assets/props/crown.webp',envelope:'./assets/props/evidence-envelope.webp',gavel:'./assets/props/gavel.webp',hourglass:'./assets/props/hourglass.webp',laurel:'./assets/props/laurel-wreath.webp',magnifier:'./assets/props/magnifier.webp',watch:'./assets/props/pocket-watch.webp',quill:'./assets/props/quill.webp',candlestick:'./assets/props/royal-candlestick.webp',key:'./assets/props/royal-key.webp',scroll:'./assets/props/royal-scroll.webp',seal:'./assets/props/royal-seal.webp',shield:'./assets/props/royal-shield.webp',scales:'./assets/props/scales.webp'};
    const categoryAssets = {work:'./assets/defendants/meeting.webp',life:'./assets/defendants/alarm.webp',social:'./assets/characters/cat-lawyer.webp',digital:'./assets/defendants/algorithm.webp',self:'./assets/defendants/procrastination.webp',campus:'./assets/defendants/early.webp'};
    const defendantAssets = {monday:'./assets/defendants/monday.webp',meeting:'./assets/defendants/meeting.webp',simple:'./assets/defendants/simple-change.webp',boss:'./assets/defendants/boss.webp',alarm:'./assets/defendants/alarm.webp',delivery:'./assets/defendants/delivery.webp',rain:'./assets/defendants/rain.webp',read:'./assets/defendants/read.webp',next:'./assets/defendants/next.webp',autoplay:'./assets/defendants/autoplay.webp',renew:'./assets/defendants/renew.webp',algorithm:'./assets/defendants/algorithm.webp',procrastination:'./assets/defendants/procrastination.webp',overthink:'./assets/defendants/overthink.webp',early:'./assets/defendants/early.webp',group:'./assets/defendants/group.webp'};
    const decor={primary:'./assets/decor/btn-primary.webp',secondary:'./assets/decor/btn-secondary.webp',cardFrame:'./assets/decor/case-card-frame.webp',categoryLabel:'./assets/decor/category-label.webp',deliberation:'./assets/decor/deliberation-banner.webp',divider:'./assets/decor/divider-ornament.webp',corners:'./assets/decor/page-corners.webp',section:'./assets/decor/section-banner.webp'};
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

    const settleSentences={
      strict:['双方当庭和解，被告须提交一份书面改进计划。','本庭不予实刑，责令被告书面致歉并限期整改。','证据不足以定罪，本庭责令双方约定一个不再犯的时间表。'],
      soft:['双方握手言和，被告承诺下次手下留情。','本庭责令被告请当事人喝一杯喜欢的饮料，就此了结。','不予处罚，但被告须在当事人下次抱怨时立刻认错。'],
      chaos:['本庭判决双方一起睡个好觉，谁也不许再闹。','责令被告陪当事人过一个不被打扰的下午。','罚被告旁听三分钟静音，不得反驳。']
    };
    const settlePenalties={
      strict:['和解后三个月内不得再犯，书记员保留复查权。','被告须提交可执行日期，逾期转为实刑。','双方各退一步，但被告须书面确认。'],
      soft:['和解生效，前提是被告真的记得。','本庭给予一次改过机会，下次不再温和。','由青蛙书记员监督执行，直至当事人满意。'],
      chaos:['和解条款由命运抽签决定，本庭保留解释权。','附加一杯饮料，冰块由对方挑。','双方合影一张，作为和解凭证归档。']
    };
    const settleComments={
      strict:['单一证据不足以支撑实刑，但本庭已经记下这一笔。','事实基本成立，量罚从宽，整改从严。','本庭不接受含糊，但也不接受没有证据的重判。'],
      soft:['生活已经够难了，本庭这次选择各打五十大板。','证据只有一条，本庭决定温柔地放过它，也放过你。','和解不是免罚，是给你省一点力气。'],
      chaos:['书记员建议和解，法官看了看时间，同意了。','本案荒诞程度不足以判刑，但足以让人共情。','本庭宣布：罚双方一起去休息。']
    };

    /* A custom defendant is the one thing the court actually knows nothing
       about, so instead of a generic filler it classifies the name the user
       typed and writes the paperwork from that. Deterministic: the same name
       always produces the same charges, focus and evidence. */
    const customRules=[
      {id:'work',focus:'本庭需要确认：这件事是否属于当事人分内义务之外的额外消耗。',
       evidence:['该情形发生在当事人已经尽到本分之后，属于额外消耗。','当事人曾多次明确表达边界，情况仍未改变。','相关影响集中在精力与时间上，且反复出现。'],
       charges:[
         {c:'非法占用个人时间罪',k:['会议','开会','临时','加班','通勤','上班','打卡','值班']},
         {c:'侵犯下班安宁罪',k:['下班','晚上','夜里','周末','群消息','艾特']},
         {c:'扩大工作范围罪',k:['需求','项目','改一下','方案','范围','甲方','版本']},
         {c:'长期拖欠承诺罪',k:['老板','领导','画饼','涨薪','承诺','绩效']},
         {c:'团队合作搭便车罪',k:['同事','团队','分工','协作','交接']}]},
      {id:'life',focus:'本庭需要确认：这件日常小事是否已经稳定地干扰了当事人的生活节奏。',
       evidence:['该情形在当事人的日常生活中反复出现，并非偶发。','当事人因此产生了可被记录的疲惫、烦躁或额外支出。','同类情形在休息时段发生频率明显更高。'],
       charges:[
         {c:'侵犯睡眠权罪',k:['睡','床','闹钟','半夜','凌晨','熬夜','早起','吵','噪音']},
         {c:'诱导非必要消费罪',k:['外卖','奶茶','凑单','下单','买','快递','优惠','免配送']},
         {c:'故意扰乱心情秩序罪',k:['天气','雨','排队','地铁','堵车','晚点','丢']},
         {c:'扰乱生活节奏罪',k:['室友','家务','宠物','猫','狗','快递柜','物业','房东']}]},
      {id:'social',focus:'本庭需要确认：沉默与拖延是否已经构成对当事人注意力的持续占用。',
       evidence:['当事人多次主动沟通，得到的回应始终不明确。','等待过程本身造成了消耗，与事情大小无关。','对方清楚当事人的期待，却未作出任何安排。'],
       charges:[
         {c:'无故制造情绪悬念罪',k:['已读','不回','不回复','沉默','消息','聊天','玩消失']},
         {c:'长期拖欠承诺罪',k:['下次','改天','再说','拖延','承诺','约']},
         {c:'沟通义务怠慢罪',k:['打电话','语音','通知','告知','商量']},
         {c:'情感冷暴力罪',k:['对象','男朋友','女朋友','恋','相亲','冷淡','敷衍']}]},
      {id:'digital',focus:'本庭需要确认：被消耗的时间与金钱，是否出自当事人真实、清醒的意愿。',
       evidence:['当事人在开始前设定的使用边界，实际未能生效。','停止入口不够明显，继续使用的默认状态被优先设计。','扣费或时长发生在当事人未主动发起的情况下。'],
       charges:[
         {c:'自动续费静默扣款罪',k:['续费','订阅','会员','扣款','自动扣','试用']},
         {c:'非法占用个人时间罪',k:['短视频','剧','游戏','直播','刷','下滑','下一集','抖音']},
         {c:'信息流过度投喂罪',k:['推荐','算法','推送','热搜','信息流']},
         {c:'诱导非必要消费罪',k:['弹窗','广告','优惠券','秒杀','拼单']}]},
      {id:'self',focus:'本庭需要确认：当事人受到的消耗，是否主要来自与被告的反复拉扯。',
       evidence:['相关计划已多次启动并多次中断。','当事人已产生自责情绪，但实际进度没有同步变化。','每次中断都发生在接近执行的时间点。'],
       charges:[
         {c:'屡次逃避截止日期罪',k:['拖延','拖','截止','ddl','明天开始','改天']},
         {c:'计划书空转罪',k:['计划','目标','清单','安排','规划']},
         {c:'持续性精神损耗罪',k:['想太多','内耗','纠结','焦虑','脑补']},
         {c:'自我承诺违约罪',k:['减肥','健身','跑步','学习','背书','单词','自律','早起']}]},
      {id:'campus',focus:'本庭需要确认：该情形是否超出了当事人可以自行消化的合理范围。',
       evidence:['该情形按固定周期重复发生，当事人无法回避。','分工与署名一致，实际交付却不一致。','当事人曾提出调整，未获得回应。'],
       charges:[
         {c:'团队合作搭便车罪',k:['小组','同学','队友','分工','作业','某位']},
         {c:'署名与贡献不符罪',k:['署名','汇报','答辩','名字']},
         {c:'侵犯睡眠权罪',k:['早八','第一节课','点名','查寝']},
         {c:'清晨强制出勤罪',k:['课','老师','考试','论文','导师','学分']}]},
    ];
    const classifyCustom=function(name){
      const text=String(name||'');
      const hitCount=function(list){return list.reduce(function(n,k){return n+(text.indexOf(k)>=0?1:0)},0)};
      let best=null,bestScore=0;
      customRules.forEach(function(rule){
        const score=rule.charges.reduce(function(n,item){return n+hitCount(item.k)},0);
        if(score>bestScore){bestScore=score;best=rule}
      });
      if(!best){
        return {id:'custom',matched:0,
          charges:['故意扰乱心情秩序罪','持续性精神损耗罪','屡次失信罪','不合理占用当事人精力罪'],
          focus:'争议焦点：这件事是否已经超出当事人的合理忍耐范围。',
          evidence:['该情形已对当事人的情绪造成可记录的干扰。','当事人在合理期限内未能自行消化该影响。','相关行为具有重复性，而非一次性事件。']};
      }
      /* the headline charge follows whichever word the user actually wrote,
         not a fixed list order */
      const ranked=best.charges.map(function(item,i){return {c:item.c,s:hitCount(item.k),i:i}})
        .sort(function(a,b){return b.s-a.s||a.i-b.i});
      return {id:best.id,matched:bestScore,focus:best.focus,evidence:best.evidence,
        charges:[ranked[0].c].concat(best.charges.filter(function(x){return x.c!==ranked[0].c}).map(function(x){return x.c}))};
    };
    const customProfile=function(name){
      const p=classifyCustom(name);
      return {category:p.id,matched:p.matched,charges:p.charges.slice(0,5),finding:p.focus,evidence:p.evidence.slice(0,3)};
    };
    const pickOne=function(list){return list[Math.floor(Math.random()*list.length)]};
    const evidenceFor=function(target){const specific=target&&caseEvidence[target.id]?caseEvidence[target.id]:(target&&target.profile?target.profile.evidence:[]);return specific.concat(evidence).slice(0,6)};
    const chargesFor=function(target){const specific=target&&caseCharges[target.id]?caseCharges[target.id]:[];
      if(target&&target.profile)specific.push.apply(specific,target.profile.charges);return Array.from(new Set([target&&target.suggested,state.charge].filter(Boolean).concat(specific,charges))).slice(0,8)};
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
    function formatDate(d){
      /* 不依赖 toLocaleDateString：各内核对 zh-CN 的拼接结果不一致 */
      return d.getFullYear()+'/'+String(d.getMonth()+1).padStart(2,'0')+'/'+String(d.getDate()).padStart(2,'0');
    }
    let state={page:'home',step:1,category:'all',query:'',target:null,charge:'',evidence:[],judge:'strict',history:[],result:null,customOpen:false,custom:'',galleryTab:'cases',archiveTab:'all',caseMode:'manual',appealOf:null,appealRound:0,posterBlob:null,posterUrl:null,posterDataUrl:null};
    /* 持久化只用容器 Storage（9.46+）。版本不足或接口缺失时返回 false，
       不回退 localStorage / IndexedDB / Cookie；调用方必须处理失败并如实告知用户。
       旧版本留在浏览器存储里的卷宗做一次性迁移，迁移后不再读写。 */
    var persistence='checking';
    function adoptHistory(raw){
      let parsed;
      try{parsed=JSON.parse(raw||'[]')}catch(e){parsed=[]}
      state.history=Array.isArray(parsed)?parsed.slice(0,80):[];
      if(state.result){
        const again=state.history.find(function(x){return x.id===state.result.id});
        if(again)state.result=again;
      }
    }
    function loadHistory(){
      if(!window.CourtPlatform){persistence='unsupported';render({scroll:false});return}
      window.CourtPlatform.storageGet().then(function(result){
        if(!result.ok){
          persistence='unsupported';
          const legacy=window.CourtPlatform.readLegacy();
          if(legacy)adoptHistory(legacy);
          render({scroll:false});
          showToast(legacy?'已读取旧卷宗，但本机缓存不可用，本次记录不会保存':'本机缓存不可用，判决只保留在本次打开');
          return;
        }
        persistence='ok';
        adoptHistory(result.data);
        /* 一次性迁移：把旧浏览器存储写入 Storage，之后不再读写它 */
        if(result.from==='empty'){
          const legacy=window.CourtPlatform.readLegacy();
          if(legacy&&legacy!=='[]')window.CourtPlatform.storageSet(legacy);
        }
        render({scroll:false});
      });
    }
    const app=document.getElementById('app');
    const esc=function(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
    const catName=function(id){const c=categories.find(x=>x.id===id);return c?c.label:'自定义案件'};
    const showToast=function(msg){const el=document.getElementById('toast');el.textContent=msg;el.classList.add('is-on');clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>el.classList.remove('is-on'),2400)};
    const save=function(){
      const payload=JSON.stringify(state.history.slice(0,80));
      if(!window.CourtPlatform||persistence==='unsupported')return;
      window.CourtPlatform.storageSet(payload).then(function(ok){
        if(!ok){persistence='unsupported';showToast('本机存储不可用，本次判决只保留在当前页面')}
      });
    };

/* ==========================================================================
   Presentation layer
   ========================================================================== */
    const sheetEl=document.getElementById('sheet');
    const icon=function(name,cls){return '<svg class="ic'+(cls?' '+cls:'')+'" aria-hidden="true"><use href="#i-'+name+'"/></svg>'};
    function customWho(){
      const name=(state.custom||'').trim()||'未具名被告';
      const profile=customProfile(name);
      return {id:null,title:name,category:profile.category,profile:profile,suggested:profile.charges[0]};
    }
    const monogram=function(name,lg){
      const ch=(String(name||'诉').trim()[0]||'诉').replace(/[<>"'&]/g,'');
      return '<span class="mono'+(lg?' mono--lg':'')+'">'+esc(ch)+'</span>';
    };
    const art=function(src,cls,alt,lazy){return '<span class="art'+(cls?' '+cls:'')+'"><img loading="'+(lazy===false?'eager':'lazy')+'" decoding="async" src="'+src+'" alt="'+esc(alt||'')+'"></span>'};
    const outcomeOf=function(v){return v&&v.outcome?v.outcome:'guilty'};
    const outcomeLabel=function(v){return outcomeOf(v)==='guilty'?'有罪':'责令和解'};
    const outcomeBadge=function(v){return '<span class="badge '+(outcomeOf(v)==='guilty'?'badge--guilty':'badge--settle')+'">'+outcomeLabel(v)+'</span>'};

    /* ---------- routes ---------- */
    const routeOf={home:'#/',trial:'#/trial',processing:'#/trial',result:'#/verdict',archive:'#/archive',gallery:'#/gallery'};
    let routing=false;
    function syncHash(){
      const want=routeOf[state.page]||'#/';
      if(window.location.hash===want)return;
      routing=true;
      try{
        if(history&&typeof history.replaceState==='function')history.replaceState(null,'',want);
        else window.location.hash=want;
      }catch(error){/* 离线包引擎可能限制 history：路由退化为纯内存状态，不影响使用 */}
      routing=false;
    }
    function pageFromHash(hash){
      if(hash==='#/trial')return 'trial';
      if(hash==='#/archive')return 'archive';
      if(hash==='#/gallery')return 'gallery';
      if(hash==='#/verdict')return state.result?'result':'home';
      return 'home';
    }
    window.addEventListener('popstate',function(){
      if(routing)return;
      const page=pageFromHash(window.location.hash||'#/');
      if(page==='trial'){openTrial()}
      else if(page!==state.page){state.page=page;render()}
    });

    function openTrial(){
      state.page='trial';state.step=1;state.category='all';state.query='';state.target=null;
      state.charge='';state.evidence=[];state.custom='';state.customOpen=false;
      state.caseMode='manual';state.appealOf=null;state.appealRound=0;render();
    }

    /* ---------- shared fragments ---------- */
    function crumb(back,backAction,trail){
      return '<div class="crumb"><button class="back" data-action="'+(backAction||'home')+'">'+icon('back')+'<span>'+esc(back)+'</span></button><span class="trail">'+esc(trail)+'</span></div>';
    }
    function stepper(){
      const names=['选择被告','确定指控','呈上证据'];
      let out='';
      for(let n=1;n<=3;n++){
        const cls=state.step===n?'is-on':(state.step>n?'is-done':'');
        out+='<div class="st '+cls+'"><b>'+(state.step>n?'✓':n)+'</b><span>'+names[n-1]+'</span></div>';
        if(n<3)out+='<div class="ln"></div>';
      }
      return '<div class="stepper">'+out+'</div>';
    }
    function ornament(){return '<div class="ornament"><img src="'+decor.divider+'" alt="" loading="lazy"></div>'}
    function actionbar(inner){return '<div class="pickbar">'+inner+'</div>'}

    /* ---------- home ---------- */
    function home(){
      const daily=getDailyDocket();
      const dailyDone=state.history.some(function(x){return x.source==='daily'&&x.dailyDate===daily.dateKey});
      const counts=categories.map(function(c){return c.id+':'+defendants.filter(function(d){return d.category===c.id}).length});
      return '<div class="fade-in">'+
      '<section class="hero panel">'+
        '<div class="art art--scrim hero-art">'+
          '<span class="hero-flag"><i class="dot"></i>本庭今日开庭 · 第 '+daily.edition+' 号</span>'+
          '<img fetchpriority="high" src="'+sceneAssets.hero+'" alt="复古木刻风格的万物审判庭大厅">'+
        '</div>'+
        '<div class="hero-body">'+
          '<span class="eyebrow">Court of Every Little Thing</span>'+
          '<h1 class="display">这点小事，<br><em>也值得开庭。</em></h1>'+
          '<p class="lede">周一、闹钟、已读不回……那些说不清的小烦恼，来这里走个流程。选一个被告，提交指控，等法官给你一个交代。</p>'+
          '<div class="hero-cta">'+
            '<button class="btn btn--plaque" data-action="random">随机开庭</button>'+
            '<button class="btn btn--ticket" data-action="trial">自己选被告</button>'+
          '</div>'+
          '<div class="hero-foot"><span>无需注册</span><i class="sep"></i><span>三步生成判决</span><i class="sep"></i><span>纯属娱乐</span></div>'+
        '</div>'+
      '</section>'+

      '<div class="quick">'+
        quickItem('quill','正式立案','三步起诉')+
        quickItem('dice','随机速审','交给命运')+
        quickItem('archive','我的卷宗',state.history.length+' 份')+
        quickItem('book','法庭图鉴','52 件')+
      '</div>'+

      '<section class="daily">'+
        '<span class="daily-ribbon"><img src="'+decor.section+'" alt=""><span>今日值班案件</span><span class="ed">'+esc(daily.dateLabel)+'</span></span>'+
        '<div class="daily-inner">'+
          art(daily.defendant.image,'','被告 '+daily.defendant.title)+
          '<div>'+
            '<span class="daily-tag">'+icon('flame')+'第 '+daily.edition+' 号 · 每日 00:00 轮换</span>'+
            '<h3>'+esc(daily.defendant.title)+'</h3>'+
            '<p>'+esc(daily.defendant.subtitle)+'</p>'+
            '<div class="daily-meta">'+
              '<span>本庭已排期</span>'+
              '<span class="daily-cta">'+(dailyDone?'<button class="btn btn--ghost" data-action="daily">再审一次</button>':'<button class="btn btn--solid" data-action="daily">立即开庭</button>')+'</span>'+
            '</div>'+
          '</div>'+
        '</div>'+
      '</section>'+

      ornament()+

      '<section class="sec">'+
        '<div class="sec-hd"><h2 class="display">从哪个麻烦开始？</h2><span class="sub">16 位常驻被告</span></div>'+
        '<div class="cat-grid">'+categories.map(function(c,i){
          const n=defendants.filter(function(d){return d.category===c.id}).length;
          return '<button class="cat-card" data-action="category" data-id="'+c.id+'">'+
            '<span class="cnt">'+n+' 件</span>'+
            art(categoryAssets[c.id],'','')+
            '<strong>'+esc(c.label)+'</strong>'+
            '<span>'+esc(c.desc)+'</span>'+
          '</button>';
        }).join('')+'</div>'+
      '</section>'+

      '<section class="notice">'+
        '<h3>本庭须知</h3>'+
        '<dl>'+
          '<div><dt>一</dt><dd>本庭为娱乐性质，所有判决均不构成法律意见，也不代表任何真实机构。</dd></div>'+
          '<div><dt>二</dt><dd>卷宗仅保存在本机浏览器中，不上传、不联网、不读取任何社交账号。</dd></div>'+
          '<div><dt>三</dt><dd>证据满两条即视为充分；单一证据遇上温和型审判官，本庭可能责令和解。</dd></div>'+
        '</dl>'+
      '</section>'+
      '<div class="colophon"><span>No. 001</span><span>Est. for every little thing</span><span>万物皆可审</span><span>认真但不必当真</span></div>'+
      '</div>';
    }
    function quickItem(ic,label,sub){
      const map={quill:'trial',dice:'random',archive:'archive',book:'gallery'};
      return '<button class="quick-item" data-action="'+map[ic]+'"><svg class="ic" aria-hidden="true"><use href="#i-'+ic+'"/></svg><span>'+esc(label)+'</span><small>'+esc(sub)+'</small></button>';
    }

    /* ---------- intake ---------- */
    function trial(){
      let body='';
      if(state.step===1)body=stepTarget();
      else if(state.step===2)body=stepCharge();
      else body=stepEvidence();
      return '<div class="fade-in">'+crumb('返回审判庭','home','Intake Desk · 立案大厅')+stepper()+body+'</div>';
    }

    function stepTarget(){
      const q=(state.query||'').trim().toLowerCase();
      const list=defendants.filter(function(d){
        if(state.category!=='all'&&d.category!==state.category)return false;
        if(!q)return true;
        return (d.title+' '+d.subtitle+' '+catName(d.category)).toLowerCase().includes(q);
      });
      return '<div class="screen" style="padding-bottom:4px">'+
          '<span class="band"><img src="'+sceneAssets.filing+'" alt="立案受理处"><span class="band-tag">本庭受理一切生活琐事</span></span>'+
          '<span class="eyebrow">立案 · 01 / 选择被告</span>'+
          '<h2 class="display">今天，想告谁？</h2>'+
          '<p class="lede">不用客气，所有离谱行为都值得被认真记录。</p>'+
        '</div>'+
        '<label class="searchbar">'+icon('loupe')+
          '<input id="case-search" type="search" inputmode="search" autocomplete="off" placeholder="搜索被告或生活麻烦" value="'+esc(state.query||'')+'">'+
          (state.query?'<button class="clear" data-action="clear-query" aria-label="清空搜索">'+icon('close')+'</button>':'<span aria-hidden="true"></span>')+
        '</label>'+
        '<div class="chips" style="margin:12px var(--gutter) 0">'+
          '<button class="chip'+(state.category==='all'?' is-on':'')+'" data-action="filter" data-id="all">全部</button>'+
          categories.map(function(c){return '<button class="chip'+(state.category===c.id?' is-on':'')+'" data-action="filter" data-id="'+c.id+'">'+esc(c.label)+'</button>'}).join('')+
        '</div>'+
        (list.length?'<div class="def-grid">'+list.map(function(d){
          const on=state.target&&state.target.id===d.id;
          return '<button class="def-card'+(on?' is-on':'')+'" data-action="target" data-id="'+d.id+'" aria-pressed="'+(on?'true':'false')+'">'+
            '<span class="tick">'+icon('check')+'</span>'+
            art(d.image,'',d.title)+
            '<strong>'+esc(d.title)+'</strong>'+
            '<span>'+esc(d.subtitle)+'</span>'+
          '</button>';
        }).join('')+'</div>':
        '<div class="empty"><strong>名单里暂时没有这位被告</strong><p>换个关键词，或者把它写进诉状里。</p></div>')+
        '<div class="custom'+(state.customOpen?' is-open':'')+'">'+
          '<button class="custom-toggle" data-action="custom-toggle" aria-expanded="'+(state.customOpen?'true':'false')+'">'+
            icon('quill','lead')+
            '<span class="txt"><b>名单里没有？自定义一位被告</b><small>例如：永远不回消息的房东、我的周末计划</small></span>'+
            icon('plus','exp')+
          '</button>'+
          (state.customOpen?'<div class="custom-body">'+
            '<div class="field"><label for="custom-name">被告名称</label>'+
            '<input id="custom-name" maxlength="18" placeholder="2–18 个字，写清是谁" value="'+esc(state.custom)+'">'+
            '<span class="counter">'+(state.custom||'').length+' / 18</span></div>'+
            '<button class="btn btn--solid btn--block" data-action="custom-use">确认被告并进入指控'+icon('arrow')+'</button>'+
          '</div>':'')+
        '</div>'+
        (state.customOpen?'':actionbar(state.target||state.custom?
          '<span class="art art--mono">'+(state.target?'<img src="'+state.target.image+'" alt="">':monogram(state.custom))+'</span>'+
          '<span class="who"><strong>'+esc(state.target?state.target.title:state.custom)+'</strong><small>'+(state.target?catName(state.target.category):'自定义被告')+'</small></span>'+
          '<button class="btn btn--solid" data-action="next">下一步'+icon('arrow')+'</button>'
          :'<span class="art">'+('<img src="'+propAssets.magnifier+'" alt="">')+'</span><span class="who"><strong>还没有选定被告</strong><small>点一张卡片，或自定义一位</small></span>'));
    }

    function stepCharge(){
      const who=state.target||customWho();
      const list=chargesFor(who);
      const suggested=state.target?state.target.suggested:'';
      return '<div class="screen" style="padding-bottom:4px">'+
          '<span class="eyebrow">立案 · 02 / 确定指控</span>'+
          '<h2 class="display">给它定个罪名。</h2>'+
          '<p class="lede">'+(state.target
            ?'本庭已调取「'+esc(who.title)+'」的过往行为记录，拟定以下指控，选一条最贴切的。'
            :'书记员按你的描述把「'+esc(who.title)+'」归入<b>'+esc(catName(who.category))+'</b>'+((who.profile&&who.profile.matched)?'（命中 '+who.profile.matched+' 个特征词）':'（描述较少，按一般扰乱秩序处理）')+'，并据此拟定以下指控。')+'</p>'+
        '</div>'+
        '<div class="charge-grid">'+list.map(function(c){
          const on=state.charge===c;
          const note=!state.target&&c===suggested?'依描述命中「'+esc(who.title)+'」，本庭优先适用'
            :(c===suggested?'本庭建议指控 · 与该被告高度相关':'经书记员检索，符合本案情节');
          return '<button class="charge'+(on?' is-on':'')+'" data-action="charge" data-id="'+esc(c)+'" aria-pressed="'+(on?'true':'false')+'">'+
            '<span class="box">'+icon('check')+'</span>'+
            '<span><strong>'+esc(c)+'</strong><small>'+esc(note)+'</small></span>'+
          '</button>';
        }).join('')+'</div>'+
        '<div class="sec" style="margin-bottom:0"><div class="sec-hd"><h3 class="display" style="font-size:16px">选择审判官</h3><span class="sub">影响判罚与点评</span></div></div>'+
        '<div class="judge-row" style="margin-top:0">'+judgeStyles.map(function(j){
          return '<button class="judge'+(state.judge===j.id?' is-on':'')+'" data-action="judge" data-id="'+j.id+'" aria-pressed="'+(state.judge===j.id?'true':'false')+'">'+
            '<span class="seal">'+j.seal+'</span><strong>'+esc(j.name)+'</strong><small>'+esc(j.intro)+'</small></button>';
        }).join('')+'</div>'+
        actionbar('<span class="art art--mono">'+(state.target?'<img src="'+state.target.image+'" alt="">':monogram(state.custom))+'</span>'+
          '<span class="who"><strong>'+esc(state.charge||'尚未选择罪名')+'</strong><small>'+esc(who.title)+' · '+esc((judgeStyles.find(function(j){return j.id===state.judge})||judgeStyles[0]).name)+'</small></span>'+
          '<button class="btn btn--solid" data-action="next">下一步'+icon('arrow')+'</button>');
    }

    function stepEvidence(){
      const who=state.target||customWho();
      const list=evidenceFor(who);
      const full=state.evidence.length>=2;
      return '<div class="screen" style="padding-bottom:4px">'+
          '<span class="eyebrow">立案 · 03 / 呈上证据</span>'+
          '<h2 class="display">拿出你的证据。</h2>'+
          '<p class="lede">最多呈上两条。证据越具体，判决越有说服力——只交一条，温和的审判官可能判你和解。</p>'+
        '</div>'+
        '<div class="tray" style="margin:12px var(--gutter)">'+icon('envelope')+
          '<span>书记员已接收 '+state.evidence.length+' 项证据</span><b>'+state.evidence.length+' / 2</b></div>'+
        '<div style="margin:0 var(--gutter)">'+list.map(function(e,i){
          const on=state.evidence.includes(e);
          return '<button class="exhibit'+(on?' is-on':(full?' is-locked':''))+'" data-action="evidence" data-id="'+esc(e)+'" aria-pressed="'+(on?'true':'false')+'"'+(full&&!on?' aria-disabled="true"':'')+'>'+
            '<span class="no">'+(on?state.evidence.indexOf(e)+1:i+1)+'</span>'+
            '<span class="txt">'+esc(e)+'</span>'+
            '<span class="mark">'+icon('check')+'</span>'+
          '</button>';
        }).join('')+'</div>'+
        actionbar('<span class="art"><img src="'+propAssets.envelope+'" alt=""></span>'+
          '<span class="who"><strong>'+esc(who.title)+'</strong><small>'+esc(state.charge)+' · 证据 '+state.evidence.length+' 项</small></span>'+
          '<button class="btn btn--solid" data-action="verdict"'+(state.evidence.length?'':' disabled')+'>提交审理'+icon('gavel')+'</button>');
    }

    /* ---------- deliberation ---------- */
    const delibSteps=['核查案件材料','听取当事人陈述','合议庭评议量刑','书记员誊写判决书'];
    let delibTimer=null,delibStage=0;
    function processing(){
      const style=(judgeStyles.find(function(j){return j.id===state.judge})||judgeStyles[0]);
      const who=state.target?state.target.title:state.custom;
      return '<div class="fade-in">'+crumb('退回旁听','home','Deliberation · 合议庭')+
      '<section class="delib panel">'+
        '<div class="art art--scrim delib-art"><span class="caption"><img src="'+decor.deliberation+'" alt=""><span>合议庭 · 正在评议</span></span><img src="'+sceneAssets.deliberation+'" alt="复古木刻风格的合议室"></div>'+
        '<div class="delib-body">'+
          '<div class="delib-staff"><img src="'+characterAssets.hedgehog+'" alt="刺猬执法官"><img src="'+characterAssets.frog+'" alt="青蛙书记员"><span>执法官与书记员<br>正在核对卷宗</span></div>'+
          '<span class="eyebrow">The Court Is In Session</span>'+
          '<h2 class="display">正在审理「'+esc(who)+'」。</h2>'+
          '<p class="lede">'+icon('gavel')+' '+esc(style.name)+'审判官已入席，书记员正在核对 '+state.evidence.length+' 项证据。</p>'+
          '<div class="delib-steps" id="delib-steps">'+delibSteps.map(function(s,i){
            const st=delibStage>i?'is-done':(delibStage===i?'is-run':'');
            return '<div class="delib-step '+st+'"><span class="mk">'+(delibStage>i?icon('check'):(delibStage===i?icon('gavel'):'<i class="ring"></i>'))+'</span><span>'+esc(s)+'</span><span class="t">'+(delibStage>i?'done':'…')+'</span></div>';
          }).join('')+'</div>'+
          '<div class="delib-foot"><div class="meter"><i id="delib-meter" style="width:'+Math.round(delibStage/delibSteps.length*100)+'%"></i></div><img src="'+propAssets.hourglass+'" alt=""></div>'+
        '</div>'+
      '</section></div>';
    }
    function advanceDelib(){
      const box=document.getElementById('delib-steps');
      if(!box)return;
      delibStage++;
      const bars=document.getElementById('delib-meter');
      if(bars)bars.style.width=Math.min(100,Math.round(delibStage/delibSteps.length*100))+'%';
      Array.prototype.forEach.call(box.children,function(row,i){
        row.className='delib-step '+(delibStage>i?'is-done':(delibStage===i?'is-run':''));
        row.querySelector('.mk').innerHTML=delibStage>i?icon('check'):(delibStage===i?icon('gavel'):'<i class="ring"></i>');
        row.querySelector('.t').textContent=delibStage>i?'done':'…';
      });
      if(delibStage>=delibSteps.length){clearInterval(delibTimer);delibTimer=null;window.setTimeout(makeVerdict,520)}
    }

    /* ---------- verdict ---------- */
    function verdict(v){
      v=v||state.result;if(!v)return '';
      const outcome=outcomeOf(v);
      const appealLabel=v.appealRound?'第 '+(v.appealRound+1)+' 次审理':'初审判决';
      const caseType=v.source==='daily'?'每日专属案件':v.source==='quick'?'随机速审':v.source==='appeal'?'再审案件':'正式立案';
      const reactions=[{id:'fair',label:'刚好',ic:'check'},{id:'light',label:'太轻',ic:'plus'},{id:'heavy',label:'太重',ic:'close'}];
      const ev=(v.evidence||[]).length
        ?'<ol>'+v.evidence.map(function(e){return '<li>'+esc(e)+'</li>'}).join('')+'</ol>'
        :'<span class="sub">当事人陈述已记录在案。</span>';
      return '<div class="fade-in">'+
      '<article class="doc">'+
        '<div class="doc-crest"><img src="'+sceneAssets.verdict+'" alt="万物审判庭判决书抬头"></div>'+
        '<div class="doc-body">'+
          '<div class="doc-title">'+
            '<span class="kicker">'+(v.appealRound?'再审结束':'审判结束')+' · 卷宗已归档</span>'+
            '<h2>'+(outcome==='guilty'?'刑事判决书':'和解书')+'</h2>'+
            '<small>娱乐法庭 · '+esc(caseType)+' · '+esc(appealLabel)+'</small>'+
            '<span class="docket">案号 '+esc(v.docket)+'</span>'+
            '<span class="rule"></span></div>'+
          '<div class="doc-row"><b>被告</b><div class="v"><strong>'+esc(v.target)+'</strong>'+
            '<span class="sub">'+esc(v.category?catName(v.category):'自定义案件')+' · '+esc(caseType)+'</span></div></div>'+
          '<div class="doc-row"><b>罪名</b><div class="v"><strong>'+esc(v.charge)+'</strong></div></div>'+
          '<div class="doc-focus"><small>本案争议焦点</small><p>'+esc(v.finding||'本庭已完成对相关行为的审理。')+'</p></div>'+
          '<div class="doc-row"><b>证据</b><div class="v">'+ev+'</div></div>'+
          '<div class="doc-verdict'+(outcome==='guilty'?'':' is-settle')+'">'+
            '<span class="label">'+(outcome==='guilty'?'判决如下':'责令和解')+'</span>'+
            '<div class="sentence"><strong>'+esc(v.sentence)+'</strong><small>'+esc(outcome==='guilty'?'附加处罚：'+v.penalty:'和解条件：'+v.penalty)+'</small></div>'+
          '</div>'+
          '<div class="doc-comment"><div><div class="who">审判官 · '+esc(v.judge)+'</div><p>'+esc(v.judgeComment)+'</p></div>'+
            '<div class="stamp"><b>审</b>判决生效</div></div>'+
          '<div class="doc-foot"><span>'+esc(v.date)+'</span><span class="r">纯属娱乐 · 不具法律效力</span></div>'+
        '</div>'+
        '<div class="doc-seal"><img src="'+sceneAssets.verdict+'" alt=""></div>'+
      '</article>'+
      '<section class="reaction panel">'+
        '<div class="react-line"><span>判得合理吗？</span>'+
          '<div class="reaction-grid">'+reactions.map(function(r){
            return '<button class="'+(v.reaction===r.id?'is-on':'')+'" data-action="reaction" data-id="'+r.id+'" aria-pressed="'+(v.reaction===r.id?'true':'false')+'">'+icon(r.ic)+'<span>'+r.label+'</span></button>';
          }).join('')+'</div></div>'+
        '<p class="hint">'+(v.reaction
          ?(v.reaction==='fair'?'已记录：判得刚好':v.reaction==='light'?'已记录：判得太轻，下次可以多交一条证据':'已记录：判得太重')
          :'态度会写进这份本地卷宗。')+'</p>'+
      '</section>'+
      '<div class="action-grid">'+
        '<button class="btn btn--solid" data-action="poster">'+icon('share')+'<span>判决海报</span></button>'+
        '<button class="btn btn--ink" data-action="note-publish">'+icon('quill')+'<span>发布笔记</span></button>'+
        '<button class="btn btn--ghost" data-action="verdict-text">'+icon('copy')+'<span>判决文案</span></button>'+
        '<button class="btn btn--ghost" data-action="appeal">'+icon('retry')+'<span>申请再审</span></button>'+
      '</div>'+
      '</div>';
    }

    /* ---------- archive ---------- */
    function archive(){
      const all=state.history;
      const guilty=all.filter(function(x){return outcomeOf(x)==='guilty'}).length;
      const settle=all.length-guilty;
      const list=state.archiveTab==='guilty'?all.filter(function(x){return outcomeOf(x)==='guilty'}):state.archiveTab==='settle'?all.filter(function(x){return outcomeOf(x)!=='guilty'}):all;
      const tabs=[{id:'all',label:'全部',n:all.length},{id:'guilty',label:'有罪',n:guilty},{id:'settle',label:'和解',n:settle}];
      return '<div class="fade-in">'+crumb('返回审判庭','home','Personal Archive · 卷宗室')+
        '<div class="screen" style="padding-bottom:0"><span class="band"><img src="'+sceneAssets.archive+'" alt="复古木刻风格的档案室"><span class="band-tag">档案只存在这台设备的浏览器里</span></span>'+
        '<span class="eyebrow">Your Records</span>'+
        '<h2 class="display">我的卷宗。</h2>'+
        '<p class="lede">每一次不爽，都有一份正式记录。'+(persistence==='unsupported'
          ?'当前环境拿不到本地缓存，这份卷宗只保留在本次打开里。'
          :'卷宗存在本机的小工具缓存里，不联网、不上传。')+'</p></div>'+
        (all.length?'<div class="tabs">'+tabs.map(function(t){
          return '<button class="'+(state.archiveTab===t.id?'is-on':'')+'" data-action="archive-tab" data-id="'+t.id+'">'+t.label+'<span class="n">'+t.n+'</span></button>';
        }).join('')+'</div>':'')+
        (list.length?'<div class="rec-list">'+list.map(function(x){
          const portrait=x.defendantId&&defendantAssets[x.defendantId]?defendantAssets[x.defendantId]:null;
          return '<article class="rec">'+
            (portrait?art(portrait,'',x.target):'<span class="art art--mono">'+monogram(x.target)+'</span>')+
            '<button class="rec-body" data-action="open-verdict" data-id="'+esc(x.id)+'">'+
              '<span class="rec-top"><strong>'+esc(x.target||'未命名案件')+'</strong><time>'+esc(shortDate(x.date))+'</time></span>'+
              '<span class="rec-charge">'+esc(x.charge||'')+'</span>'+
              '<span class="sentence">'+esc(x.sentence||'待宣判')+'</span>'+
              '<span class="rec-foot">'+outcomeBadge(x)+
                (x.appealRound?'<span class="badge badge--plain">再审 '+x.appealRound+'</span>':'')+
                (x.reaction?'<span class="badge badge--gold">'+(x.reaction==='fair'?'判得刚好':x.reaction==='light'?'判得太轻':'判得太重')+'</span>':'')+
                '<span class="open">查看判决'+icon('arrow')+'</span></span>'+
            '</button>'+
            '<button class="rec-del" data-action="delete" data-id="'+esc(x.id)+'" aria-label="删除 '+esc(x.target||'案件')+' 的卷宗">'+icon('trash')+'</button>'+
          '</article>';
        }).join('')+'</div>':
        '<div class="empty"><div class="empty-inner">'+
          '<span class="art art--cut art--paper"><img src="'+characterAssets.hamster+'" alt="仓鼠档案管理员"></span>'+
          '<strong>'+(all.length?'这个分类下还没有卷宗':'档案室还是空的')+'</strong>'+
          '<p>'+(all.length?'换一个筛选条件看看，或者去开一庭新的。':'第一份判决书还没诞生。带一件生活小事来，本庭给你一份正式记录。')+'</p>'+
          '<button class="btn btn--solid" data-action="trial">开始第一次审判'+icon('arrow')+'</button></div></div>')+
        '</div>';
    }
    function shortDate(d){
      if(!d)return '';
      const parts=String(d).split('/');
      if(parts.length===3)return parts[1].padStart(2,'0')+'-'+parts[2].padStart(2,'0');
      return d;
    }

    /* ---------- gallery ---------- */
    function gallery(){
      const tabs=[{id:'cases',label:'案件被告'},{id:'characters',label:'法庭角色'},{id:'props',label:'法庭物件'},{id:'scenes',label:'场景陈列'}];
      const nav='<div class="tabs">'+tabs.map(function(t){return '<button class="'+(state.galleryTab===t.id?'is-on':'')+'" data-action="gallery-tab" data-id="'+t.id+'">'+t.label+'</button>'}).join('')+'</div>';
      const head='<div class="fade-in">'+crumb('返回审判庭','home','Court Collection · 图鉴')+
        '<div class="ribbon"><img src="'+decor.section+'" alt=""><span>法庭图鉴</span></div>'+
        '<div class="g-intro"><div><span class="eyebrow">The Court Collection</span><h2 class="display">本庭图鉴。</h2>'+
        '<p class="lede">人物、物证与案件都已收录在册，共 52 件手绘素材。</p></div>'+
        '<img src="'+characterAssets.hamster+'" alt="仓鼠档案管理员"></div>'+nav+'</div>';
      if(state.galleryTab==='characters'){
        return head+'<div class="g-grid" style="margin-top:12px">'+courtCharacters.map(function(p,i){
          return '<article class="g-card"><span class="art art--cut art--tall"><img loading="lazy" src="'+p.image+'" alt="'+esc(p.name)+'"></span>'+
            '<div class="meta"><small>Personnel · '+String(i+1).padStart(2,'0')+'</small><strong>'+esc(p.name)+'</strong><span>'+esc(p.role)+'</span></div></article>';
        }).join('')+'</div>'+tail();
      }
      if(state.galleryTab==='props'){
        return head+'<div class="g-grid" style="margin-top:12px">'+courtProps.map(function(p,i){
          return '<article class="g-card"><span class="art art--cut"><img loading="lazy" src="'+p.image+'" alt="'+esc(p.name)+'"></span>'+
            '<div class="meta"><small>Exhibit · '+String(i+1).padStart(2,'0')+'</small><strong>'+esc(p.name)+'</strong><span>'+esc(p.desc)+'</span></div></article>';
        }).join('')+'</div>'+tail();
      }
      if(state.galleryTab==='scenes'){
        return head+'<div class="g-grid g-grid--wide" style="margin-top:12px">'+courtScenes.map(function(s,i){
          return '<article class="g-card g-card--wide"><span class="art"><img loading="lazy" src="'+s.image+'" alt="'+esc(s.name)+'"></span>'+
            '<div class="meta"><small>Location · '+String(i+1).padStart(2,'0')+'</small><strong>'+esc(s.name)+'</strong><span>'+esc(s.desc)+'</span></div></article>';
        }).join('')+'</div>'+tail();
      }
      const q=(state.query||'').trim().toLowerCase();
      const list=defendants.filter(function(d){
        if(state.category!=='all'&&d.category!==state.category)return false;
        if(!q)return true;
        return (d.title+' '+d.subtitle).toLowerCase().includes(q);
      });
      return head+
        '<label class="searchbar" style="margin-top:12px">'+icon('loupe')+
          '<input id="gallery-search" type="search" autocomplete="off" placeholder="搜一搜被告名称" value="'+esc(state.query||'')+'">'+
          (state.query?'<button class="clear" data-action="clear-query" aria-label="清空搜索">'+icon('close')+'</button>':'<span aria-hidden="true"></span>')+
        '</label>'+
        '<div class="chips" style="margin:12px var(--gutter) 0"><button class="chip'+(state.category==='all'?' is-on':'')+'" data-action="filter" data-id="all">全部</button>'+
          categories.map(function(c){return '<button class="chip'+(state.category===c.id?' is-on':'')+'" data-action="filter" data-id="'+c.id+'">'+esc(c.label)+'</button>'}).join('')+'</div>'+
        (list.length?'<div class="g-grid" style="margin-bottom:8px">'+list.map(function(d){
          return '<article class="g-card"><button class="g-open" data-action="select-case" data-id="'+d.id+'" aria-label="起诉 '+esc(d.title)+'">'+art(d.image,'',d.title)+'</button>'+
            '<div class="meta"><small>'+esc(catName(d.category))+'</small><strong>'+esc(d.title)+'</strong><span>'+esc(d.subtitle)+'</span></div>'+
            '<button class="chip" data-action="select-case" data-id="'+d.id+'">起诉'+icon('plus')+'</button></article>';
        }).join('')+'</div>':
        '<div class="empty"><div class="empty-inner"><strong>图鉴里没有这位</strong><p>换个关键词，或者去立案时把它写成自定义被告。</p></div></div>')+tail();
    }
    function tail(){
      return '<div class="colophon"><span>Hand-drawn woodcut set</span><span>52 assets</span><span>Local only</span></div>';
    }

    /* ---------- render ---------- */
    function render(options){
      options=options||{};
      const active=state.page==='archive'?'archive':state.page==='gallery'?'gallery':(state.page==='trial'||state.page==='processing')?'trial':'home';
      document.querySelectorAll('.tab-bar .tab').forEach(function(b){
        const on=b.dataset.tab===active;
        b.classList.toggle('is-on',on);
        if(on)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');
      });
      app.innerHTML=state.page==='trial'?trial():state.page==='result'?verdict():state.page==='processing'?processing():state.page==='archive'?archive():state.page==='gallery'?gallery():home();
      syncHash();
      if(options.focusId){
        const focused=document.getElementById(options.focusId);
        if(focused){
          if(focused.scrollIntoView)focused.scrollIntoView({block:'center',behavior:'auto'});
          focused.focus();
          if(typeof options.selectionStart==='number'&&typeof focused.setSelectionRange==='function'){try{focused.setSelectionRange(options.selectionStart,options.selectionEnd)}catch(error){}}
        }
      }
      if(options.scroll!==false&&!options.focusId)window.scrollTo({top:0,behavior:'auto'});
    }

    let deliberationToken=0;
    function openDeliberation(){
      const token=++deliberationToken;
      state.page='processing';delibStage=0;render();
      if(delibTimer)clearInterval(delibTimer);
      delibTimer=setInterval(advanceDelib,620);
      window.setTimeout(function(){if(token===deliberationToken&&state.page==='processing')makeVerdict()},620*delibSteps.length+900);
    }

    function makeVerdict(){
      if(state.page!=='processing')return;
      if(delibTimer){clearInterval(delibTimer);delibTimer=null}
      const style=judgeStyles.find(function(x){return x.id===state.judge})||judgeStyles[0];
      const target=state.target;
      const who=target||customWho();
      const category=who.category;
      const evidenceCount=state.evidence.length;
      const outcome=(evidenceCount>=2||style.id==='strict')?'guilty':'settle';
      const sentence=outcome==='guilty'?pickOne(verdictSentences[category]||verdictSentences.custom):pickOne(settleSentences[style.id]||settleSentences.strict);
      const penalty=outcome==='guilty'?pickOne(penaltiesByJudge[style.id]||penaltiesByJudge.strict):pickOne(settlePenalties[style.id]||settlePenalties.strict);
      const daily=state.caseMode==='daily'?getDailyDocket():null;
      const comment=outcome==='guilty'?pickOne(judgeComments[style.id]||judgeComments.strict):pickOne(settleComments[style.id]||settleComments.strict);
      const item={
        id:Date.now().toString(36)+Math.random().toString(36).slice(2,7),
        date:formatDate(new Date()),
        docket:'（'+new Date().getFullYear()+'）万审字第'+String(Math.floor(Math.random()*8999)+1000)+'号',
        target:target?target.title:state.custom,defendantId:target?target.id:null,category:category,
        mark:target?target.mark:'诉',charge:state.charge,evidence:state.evidence.slice(0,2),
        outcome:outcome,
        finding:target&&caseFindings[target.id]?caseFindings[target.id]:(who.profile?who.profile.finding:'争议焦点：这件事是否已经超出当事人的合理忍耐范围。'),
        customClassified:target?null:(who.profile?who.profile.matched:0),
        sentence:sentence,penalty:penalty,
        judge:style.name,
        judgeComment:comment+(evidenceCount>1?' 本案提交两项证据，依法从重考虑。':' 本庭已记录当事人的第一项证据。'),
        source:state.caseMode||'manual',dailyDate:daily?daily.dateKey:null,appealOf:state.appealOf||null,
        appealRound:state.appealOf?(state.appealRound||1):0,reaction:''
      };
      state.result=item;state.history=[item].concat(state.history.filter(function(x){return x.id!==item.id})).slice(0,80);
      save();state.appealOf=null;state.appealRound=0;state.caseMode='manual';state.page='result';render();
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
      showToast('再审已受理：原被告、罪名与证据均已保留');
    }
    function recordReaction(reaction){
      if(!state.result||!['fair','light','heavy'].includes(reaction))return;
      state.result.reaction=reaction;
      state.history=state.history.map(function(item){return item.id===state.result.id?state.result:item});
      save();render({scroll:false});
      showToast(reaction==='fair'?'已记录：判得刚好':reaction==='light'?'已记录：判得太轻':'已记录：判得太重');
    }

    /* ---------- poster ---------- */
    function loadImage(src){
      return new Promise(function(resolve,reject){
        const image=new Image();
        image.onload=function(){resolve(image)};
        image.onerror=function(){reject(new Error('asset failed: '+src))};
        image.src=src;
      });
    }
    async function poster(){
      if(!state.result)return;
      const v=state.result;
      const W=1080,H=1440,L=84,R=996,CW=R-L;
      const canvas=document.createElement('canvas');canvas.width=W;canvas.height=H;
      const g=canvas.getContext('2d');
      const SERIF='"Songti SC","STSong","Source Han Serif SC","Noto Serif CJK SC",serif';
      const SANS='"PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif';

      const paper=g.createLinearGradient(0,0,W,H);
      paper.addColorStop(0,'#fbf3e3');paper.addColorStop(.55,'#f5e8ce');paper.addColorStop(1,'#eddfbe');
      g.fillStyle=paper;g.fillRect(0,0,W,H);
      g.save();g.globalAlpha=.045;g.fillStyle='#5b4433';
      for(let i=0;i<3000;i++){g.fillRect(Math.random()*W,Math.random()*H,1.6,1.6)}
      g.restore();
      g.strokeStyle='#9a6f3c';g.lineWidth=6;g.strokeRect(30,30,W-60,H-60);
      g.strokeStyle='#cfa96a';g.lineWidth=2;g.strokeRect(46,46,W-92,H-92);
      g.strokeStyle='rgba(154,111,60,.45)';g.lineWidth=1;g.strokeRect(58,58,W-116,H-116);

      const text=function(str,x,y,font,color,align){g.font=font;g.fillStyle=color;g.textAlign=align||'left';g.textBaseline='alphabetic';g.fillText(String(str),x,y)};
      const wrap=function(str,x,y,maxWidth,lineHeight,font,color){
        g.font=font;g.fillStyle=color;g.textAlign='left';g.textBaseline='alphabetic';
        const lines=[];let line='';
        for(const ch of String(str)){
          const cand=line+ch;
          if(line&&g.measureText(cand).width>maxWidth){lines.push(line);line=ch}else{line=cand}
        }
        if(line)lines.push(line);
        lines.forEach(function(item,i){g.fillText(item,x,y+i*lineHeight)});
        return y+Math.max(1,lines.length)*lineHeight;
      };
      /* Chinese line-break rules (禁則処理). Canvas wraps blindly by default and
         will happily strand a lone 。 on its own line - exactly the 压线 the user
         flagged. Closing marks stay glued to the previous line; opening marks
         never trail off the end of one. */
      const NO_LINE_START='。，、；：？！）〕〉》」』】”’…—～·';
      const NO_LINE_END='（〔〈《「『【“(';
      const kinsoku=function(src,maxWidth){
        const lines=[];let line='';
        for(const ch of String(src)){
          const cand=line+ch;
          if(line&&g.measureText(cand).width>maxWidth){
            if(NO_LINE_START.indexOf(ch)>=0){line=cand;continue}
            if(NO_LINE_END.indexOf(line[line.length-1])>=0){lines.push(line.slice(0,-1));line=line.slice(-1)+ch;continue}
            lines.push(line);line=ch;
          }else{line=cand}
        }
        if(line)lines.push(line);
        return lines.length?lines:[''];
      };
      const wrapMax=function(str,x,y,maxWidth,lineHeight,maxLines,font,color){
        g.font=font;g.fillStyle=color;g.textAlign='left';g.textBaseline='alphabetic';
        let lines=kinsoku(str,maxWidth);
        if(lines.length>maxLines){
          lines=lines.slice(0,maxLines);
          let tail=lines[maxLines-1];
          while(tail&&g.measureText(tail+'…').width>maxWidth)tail=tail.slice(0,-1);
          lines[maxLines-1]=tail+'…';
        }
        return emit(lines,x,y,lineHeight);
      };
      const emit=function(lines,x,y,lineHeight){
        lines.forEach(function(item,i){g.fillText(item,x,y+i*lineHeight)});
        return y+Math.max(1,lines.length)*lineHeight;
      };
      const fit=function(str,maxWidth,start,min,weight,face){
        let size=start;
        while(size>min){g.font=(weight||'bold')+' '+size+'px '+(face||SERIF);if(g.measureText(str).width<=maxWidth)break;size-=2}
        return (weight||'bold')+' '+size+'px '+(face||SERIF);
      };
      const round=function(x,y,w,h,r){
        g.beginPath();
        g.moveTo(x+r,y);g.lineTo(x+w-r,y);g.quadraticCurveTo(x+w,y,x+w,y+r);
        g.lineTo(x+w,y+h-r);g.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
        g.lineTo(x+r,y+h);g.quadraticCurveTo(x,y+h,x,y+h-r);
        g.lineTo(x,y+r);g.quadraticCurveTo(x,y,x+r,y);g.closePath();
      };
      const window2=function(x,y,w,h,src,label){
        g.save();g.beginPath();g.rect(x,y,w,h);g.clip();
        return new Promise(function(resolve){
          if(!src){g.fillStyle='#e2cfa9';g.fillRect(x,y,w,h);g.restore();resolve();return}
          const img=new Image();
          img.onload=function(){
            const s=Math.max(w/img.width,h/img.height);
            g.drawImage(img,x+(w-img.width*s)/2,y+(h-img.height*s)/2,img.width*s,img.height*s);
            g.restore();frameWindow(x,y,w,h);resolve();
          };
          img.onerror=function(){g.fillStyle='#e2cfa9';g.fillRect(x,y,w,h);g.restore();frameWindow(x,y,w,h);resolve()};
          img.src=src;
        });
      };
      const frameWindow=function(x,y,w,h){
        const veil=g.createLinearGradient(0,y,0,y+h);
        veil.addColorStop(0,'rgba(36,24,17,.12)');veil.addColorStop(1,'rgba(36,24,17,.42)');
        g.fillStyle=veil;g.fillRect(x,y,w,h);
        g.strokeStyle='#c49a60';g.lineWidth=3;g.strokeRect(x,y,w,h);
        g.strokeStyle='rgba(246,224,184,.35)';g.lineWidth=1;g.strokeRect(x+6,y+6,w-12,h-12);

      };

      /* 1. crest plate */
      const plateY=78,plateH=196;
      const plateGrad=g.createLinearGradient(0,plateY,0,plateY+plateH);
      plateGrad.addColorStop(0,'#a8392c');plateGrad.addColorStop(1,'#6f1d18');
      round(L,plateY,CW,plateH,10);g.fillStyle=plateGrad;g.fill();
      g.strokeStyle='#d3ac61';g.lineWidth=2;round(L+9,plateY+9,CW-18,plateH-18,7);g.stroke();
      g.strokeStyle='rgba(246,224,184,.28)';g.lineWidth=1;round(L+16,plateY+16,CW-32,plateH-32,5);g.stroke();
      const cx=W/2;
      text('万物审判庭',cx,plateY+88,'bold 50px '+SERIF,'#f8e9cd','center');
      text('THE COURT OF EVERY LITTLE THING',cx,plateY+120,'15px '+SANS,'#d9bd8d','center');
      g.strokeStyle='rgba(211,172,97,.5)';g.lineWidth=1;
      g.beginPath();g.moveTo(cx-150,plateY+140);g.lineTo(cx+150,plateY+140);g.stroke();
      text(outcomeOf(v)==='guilty'?'娱乐法庭 · 刑事判决书':'娱乐法庭 · 和解书',cx,plateY+172,'25px '+SERIF,'#f0dcb2','center');

      /* 2. scene + defendant windows. A custom defendant has no portrait, and
         filling that window with a blank scroll reads as a broken image, so we
         draw a typographic nameplate instead. */
      const bandY=plateY+plateH+24,bandH=240,artW=Math.round(CW*0.655),gap=18;
      await window2(L,bandY,artW,bandH,sceneAssets.hero);
      const pX=L+artW+gap,pW=CW-artW-gap;
      if(v.defendantId&&defendantAssets[v.defendantId]){
        await window2(pX,bandY,pW,bandH,defendantAssets[v.defendantId]);
      }else{
        const plate=g.createLinearGradient(0,bandY,0,bandY+bandH);
        plate.addColorStop(0,'#f8ecd2');plate.addColorStop(1,'#eedbb0');
        g.fillStyle=plate;g.fillRect(pX,bandY,pW,bandH);
        g.strokeStyle='#b3873c';g.lineWidth=2;g.strokeRect(pX+1,bandY+1,pW-2,bandH-2);
        g.strokeStyle='rgba(179,135,60,.4)';g.lineWidth=1;g.strokeRect(pX+9,bandY+9,pW-18,bandH-18);
        const pcx=pX+pW/2;
        text('被 告',pcx,bandY+62,'22px '+SERIF,'#99302a','center');
        g.strokeStyle='rgba(153,48,42,.35)';g.lineWidth=1;
        g.beginPath();g.moveTo(pcx-42,bandY+76);g.lineTo(pcx+42,bandY+76);g.stroke();
        g.font=fit(v.target,pW-56,54,22);g.fillStyle='#2b1d16';g.textAlign='center';
        g.fillText(v.target,pcx,bandY+140);
        text('自定义被告 · 本庭照单受理',pcx,bandY+190,'17px '+SANS,'#8a6f4e','center');
        g.fillStyle='rgba(179,135,60,.55)';
        [[pX+16,bandY+16],[pX+pW-16,bandY+16],[pX+16,bandY+bandH-16],[pX+pW-16,bandY+bandH-16]].forEach(function(c){g.fillRect(c[0]-3,c[1]-3,6,6)});
      }

      /* 3. docket */
      let y=bandY+bandH+48;
      text('案号  '+v.docket+'      日期  '+v.date,cx,y,'22px '+SANS,'#8a6f4e','center');
      y+=26;
      g.strokeStyle='#c4a77c';g.lineWidth=1.5;g.beginPath();g.moveTo(L,y);g.lineTo(R,y);g.stroke();

      /* 4. case rows */
      y+=62;
      const labelX=L+26,valueX=L+136,valueW=R-valueX-26;
      const row=function(label,value,font){
        text(label,labelX,y,'22px '+SANS,'#98764f');
        y=wrapMax(value,valueX,y,valueW,36,1,font,'#33241b')+30;
      };
      row('被 告',v.target,fit(v.target,valueW,38,26,'600'));
      row('罪 名',v.charge,fit(v.charge,valueW,32,23,'600'));
      row('焦 点',(v.finding||'').replace(/^争议焦点[：:]/,''),'24px '+SERIF);
      text('证 据',labelX,y,'22px '+SANS,'#98764f');
      const ev=(v.evidence&&v.evidence.length)?v.evidence:['当事人陈述已记录在案。'];
      const evText=ev.length===1?ev[0]:ev.map(function(e,i){return (i+1)+'. '+e}).join('   ');
      y=wrapMax(evText,valueX,y,valueW,32,3,'21px '+SANS,'#514236')+30;

      /* 5. verdict plaque */
      const settle=outcomeOf(v)!=='guilty';
      const plaqueY=Math.min(y,950),plaqueH=198;
      const pg=g.createLinearGradient(0,plaqueY,0,plaqueY+plaqueH);
      pg.addColorStop(0,settle?'#5d7355':'#a8392c');pg.addColorStop(1,settle?'#3b4f36':'#6f1d18');
      round(L,plaqueY,CW,plaqueH,10);g.fillStyle=pg;g.fill();
      g.strokeStyle='rgba(246,224,184,.5)';g.lineWidth=2;round(L+9,plaqueY+9,CW-18,plaqueH-18,7);g.stroke();
      text(settle?'和 解 条 件':'本 庭 判 决 如 下',cx,plaqueY+44,'22px '+SERIF,'#f8e9d2','center');
      g.font=fit(v.sentence,CW-90,44,26);g.fillStyle='#fff0d9';g.textAlign='center';
      g.fillText(v.sentence,cx,plaqueY+104);
      wrapMax((settle?'和解条件：':'附加处罚：')+v.penalty,L+44,plaqueY+152,CW-88,26,2,'20px '+SANS,'#f1d7b2');

      /* 6. judge comment + wax seal */
      const footY=plaqueY+plaqueH+54;
      text('审判官 · '+v.judge,L+26,footY,'23px '+SERIF,'#76583a');
      wrapMax(v.judgeComment,L+26,footY+40,CW-270,30,3,'21px '+SERIF,'#463627');
      try{
        const seal=await new Promise(function(res,rej){const i=new Image();i.onload=function(){res(i)};i.onerror=rej;i.src=propAssets.seal});
        g.save();g.translate(R-92,footY+66);g.rotate(-.16);
        const ss=140/seal.width;g.drawImage(seal,-75,-75,seal.width*ss,seal.height*ss);g.restore();
      }catch(error){
        g.save();g.translate(R-96,footY+72);g.rotate(-.16);
        g.strokeStyle='#a6382f';g.lineWidth=4;g.beginPath();g.arc(0,0,62,0,Math.PI*2);g.stroke();
        text('审',0,18,'bold 52px '+SERIF,'#a6382f','center');g.restore();
      }

      /* 7. footer */
      g.strokeStyle='#c4a77c';g.lineWidth=1;g.beginPath();g.moveTo(L,H-96);g.lineTo(R,H-96);g.stroke();
      text('纯属娱乐，不具法律效力  ·  Court of Every Little Thing',cx,H-60,'19px '+SANS,'#907958','center');

      /* 容器禁 a[download] / blob 下载，保存图片只能用 saveImageToPhotosAlbum。
         预览允许 blob:（容器 CSP 明确放行内存图片），但平台接口需要 data URI，
         所以两种编码都留：预览用 blob 省内存，交付用 dataURL 走端能力。 */
      state.posterDataUrl=null;
      try{state.posterDataUrl=canvas.toDataURL('image/png')}catch(error){state.posterDataUrl=null}
      if(!state.posterDataUrl){showToast('海报生成失败，请重试');return}
      if(state.posterUrl){URL.revokeObjectURL(state.posterUrl);state.posterUrl=null}
      if(typeof canvas.toBlob==='function'&&typeof URL!=='undefined'&&URL.createObjectURL){
        try{
          state.posterBlob=await new Promise(function(resolve){canvas.toBlob(resolve,'image/png')});
          if(state.posterBlob)state.posterUrl=URL.createObjectURL(state.posterBlob);
        }catch(error){state.posterBlob=null}
      }
      openPosterSheet();
    }

    function posterPreviewSrc(){return state.posterUrl||state.posterDataUrl||''}

    function openPosterSheet(){
      const src=posterPreviewSrc();
      if(!src)return;
      sheetEl.innerHTML='<div class="sheet-panel" role="dialog" aria-modal="true" aria-label="判决海报预览">'+
        '<div class="sheet-hd"><h3>判决海报已就绪</h3><button class="x" data-action="sheet-close" aria-label="关闭预览">'+icon('close')+'</button></div>'+
        '<div class="sheet-figure"><img src="'+src+'" alt="3:4 判决海报预览"></div>'+
        '<p class="sheet-tip">海报由 Canvas 现绘，文字未烘焙进底图。可保存到相册，或直接发成笔记。</p>'+
        '<div class="sheet-actions">'+
          '<button class="btn btn--solid" data-action="poster-save">'+icon('download')+'<span>保存到相册</span></button>'+
          '<button class="btn btn--ink" data-action="poster-share">'+icon('share')+'<span>分享图片</span></button>'+
        '</div>'+
        '<button class="btn btn--ghost btn--block" data-action="sheet-close">返回判决</button>'+
      '</div>';
      sheetEl.hidden=false;
      document.body.style.overflow='hidden';
      const first=sheetEl.querySelector('.x');if(first)first.focus();
    }

    function openTextSheet(){
      if(!state.result)return;
      const content=verdictCopy(state.result);
      sheetEl.innerHTML='<div class="sheet-panel" role="dialog" aria-modal="true" aria-label="判决文案">'+
        '<div class="sheet-hd"><h3>判决文案</h3><button class="x" data-action="sheet-close" aria-label="关闭">'+icon('close')+'</button></div>'+
        '<div class="field"><label for="copy-field">容器内不提供网页剪贴板，请长按选中下方文字后手动复制</label>'+
        '<textarea id="copy-field" rows="8" readonly spellcheck="false">'+esc(content)+'</textarea></div>'+
        '<div class="sheet-actions">'+
          '<button class="btn btn--solid" data-action="note-publish">'+icon('share')+'<span>直接发笔记</span></button>'+
          '<button class="btn btn--ghost" data-action="sheet-close">关闭</button>'+
        '</div>'+
      '</div>';
      sheetEl.hidden=false;
      document.body.style.overflow='hidden';
      const field=sheetEl.querySelector('#copy-field');if(field)field.focus();
    }

    function askConfirm(title,body,onOk){
      confirmAction=onOk;
      sheetEl.innerHTML='<div class="sheet-panel" role="alertdialog" aria-modal="true" aria-labelledby="confirm-title">'+
        '<div class="sheet-hd"><h3 id="confirm-title">'+esc(title)+'</h3><button class="x" data-action="confirm-cancel" aria-label="取消">'+icon('close')+'</button></div>'+
        '<p class="confirm-body">'+body+'</p>'+
        '<div class="sheet-actions">'+
          '<button class="btn btn--ghost" data-action="confirm-cancel">取消</button>'+
          '<button class="btn btn--danger-solid" data-action="confirm-ok">确认删除</button>'+
        '</div></div>';
      sheetEl.hidden=false;
      document.body.style.overflow='hidden';
      const ok=sheetEl.querySelector('[data-action="confirm-ok"]');if(ok)ok.focus();
    }
    let confirmAction=null;
    function closeSheet(){
      sheetEl.hidden=true;sheetEl.innerHTML='';
      document.body.style.overflow='';
      if(state.posterUrl){URL.revokeObjectURL(state.posterUrl);state.posterUrl=null}
      state.posterBlob=null;
      confirmAction=null;
    }

    function verdictCopy(v){
      return [
        '我把「'+v.target+'」告上了万物审判庭！',
        '罪名：'+v.charge,
        (outcomeOf(v)==='guilty'?'判决：':'和解：')+v.sentence,
        '审判官：'+v.judge,
        '你觉得判得合理吗？','',
        '#万物审判庭 #生活吐槽 #今日判决'
      ].join('\n');
    }

    /* 端能力调用统一走 CourtPlatform；不可用时给出明确原因，不静默降级成
       浏览器 API，也不谎报成功。 */
    function platformOnly(){return !!(window.xhs&&window.xhs.miniTool)}

    async function savePoster(){
      if(!state.result)return;
      if(!state.posterDataUrl){await poster();}
      if(!state.posterDataUrl){showToast('海报还没生成，请重试');return}
      if(!platformOnly()){showToast('当前环境不支持保存到相册');return}
      showToast('正在保存到相册…');
      const result=await window.CourtPlatform.saveImage(state.posterDataUrl);
      showToast(result.ok?'已保存到相册':result.reason==='unsupported'?'当前客户端版本不支持保存相册':'保存未完成，可能未授权访问相册');
    }
    async function sharePoster(){
      if(!state.result)return;
      if(!state.posterDataUrl)await poster();
      if(!state.posterDataUrl){showToast('海报还没生成，请重试');return}
      if(!platformOnly()){showToast('当前环境不支持分享');return}
      const result=await window.CourtPlatform.shareImage(state.posterDataUrl);
      if(!result.ok&&result.reason!=='cancelled')showToast(result.reason==='unsupported'?'分享需要客户端 9.53 及以上':'未能发起分享');
    }
    async function publishNote(){
      if(!state.result)return;
      if(!platformOnly()){showToast('发布笔记需要在小红书 App 内打开');return}
      if(!window.CourtPlatform.has('postNote')){showToast('当前客户端不支持发布笔记');return}
      if(!state.posterDataUrl)await poster();
      const v=state.result;
      showToast('正在打开发布页…');
      const result=await window.CourtPlatform.publishNote({
        title:'我把'+v.target+'告上了审判庭',
        content:verdictCopy(v),
        dataUrl:state.posterDataUrl
      });
      if(!result.ok)showToast(result.reason==='unsupported'?'当前客户端不支持发布笔记':'已取消发布');
    }

    /* ---------- events ---------- */
    app.addEventListener('input',function(e){
      if(e.target.id==='custom-name'){state.custom=e.target.value;const c=e.target.parentElement.querySelector('.counter');if(c)c.textContent=e.target.value.length+' / 18';return}
      if(e.target.id==='case-search'||e.target.id==='gallery-search'){
        const id=e.target.id,start=e.target.selectionStart,end=e.target.selectionEnd;
        state.query=e.target.value;render({scroll:false,focusId:id,selectionStart:start,selectionEnd:end});
      }
    });
    app.addEventListener('keydown',function(e){
      if(e.key==='Enter'&&e.target.id==='custom-name'){e.preventDefault();const confirm=app.querySelector('[data-action="custom-use"]');if(confirm)confirm.click()}
    });
    document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!sheetEl.hidden)closeSheet()});

    function handle(action,id,button){
      if(action==='home'){state.page='home';render()}
      else if(action==='archive'){state.page='archive';render()}
      else if(action==='archive-tab'){state.archiveTab=id;render({scroll:false})}
      else if(action==='trial'){openTrial()}
      else if(action==='random')pickRandom('quick');
      else if(action==='daily')pickRandom('daily');
      else if(action==='gallery'){state.page='gallery';state.category='all';state.query='';state.galleryTab='cases';render()}
      else if(action==='gallery-tab'){state.galleryTab=id;state.query='';render()}
      else if(action==='category'){
        state.category=id;state.page='trial';state.step=1;state.query='';state.target=null;state.charge='';state.evidence=[];state.custom='';state.caseMode='manual';state.appealOf=null;render();
      }
      else if(action==='filter'){state.category=id;render({scroll:false})}
      else if(action==='clear-query'){state.query='';render({scroll:false,focusId:state.page==='gallery'?'gallery-search':'case-search',selectionStart:0,selectionEnd:0})}
      else if(action==='select-case'){
        const defendant=defendants.find(function(d){return d.id===id});
        if(defendant){state.target=defendant;state.custom='';state.charge=defendant.suggested;state.evidence=[];state.caseMode='manual';state.appealOf=null;state.appealRound=0;state.step=2;state.page='trial';render()}
      }
      else if(action==='target'){
        state.target=defendants.find(function(d){return d.id===id})||null;
        state.custom='';state.charge=state.target?state.target.suggested:'';state.evidence=[];state.caseMode='manual';state.appealOf=null;state.appealRound=0;render({scroll:false});
      }
      else if(action==='custom-toggle'){state.customOpen=!state.customOpen;render({scroll:false,focusId:state.customOpen?'custom-name':null})}
      else if(action==='custom-use'){
        const value=state.custom.trim();
        if(value.length<2||value.length>18){showToast('请输入 2–18 个字的被告名称');return}
        state.target=null;state.custom=value;state.charge=customWho().suggested;state.evidence=[];state.caseMode='manual';state.appealOf=null;state.appealRound=0;state.step=2;state.page='trial';render();
      }
      else if(action==='next'){
        if(state.step===1&&!state.target&&!state.custom){showToast('请先选择一位被告');return}
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
      else if(action==='appeal')startAppeal();
      else if(action==='reaction')recordReaction(id);
      else if(action==='poster')poster();
      else if(action==='poster-save')savePoster();
      else if(action==='note-publish')publishNote();
      else if(action==='verdict-text')openTextSheet();
      else if(action==='poster-share')sharePoster();
      else if(action==='sheet-close')closeSheet();
      else if(action==='open-verdict'){
        const item=state.history.find(function(record){return record.id===id});
        if(item){state.result=item;state.page='result';render()}
      }
      else if(action==='delete'){
        const item=state.history.find(function(r){return r.id===id});
        if(!item)return;
        askConfirm('删除卷宗','确定删除「<strong>'+esc(item.target||'该案件')+'</strong>」的卷宗吗？<br>这份判决只保存在本机，删除后无法恢复。',function(){
          state.history=state.history.filter(function(record){return record.id!==id});
          if(state.result&&state.result.id===id)state.result=null;
          save();render({scroll:false});showToast('卷宗已删除');
        });
      }
    }

    function onClick(e){
      const button=e.target.closest('[data-action]');
      if(!button)return;
      const action=button.dataset.action;
      if(button.closest('.sheet')){
        if(action==='confirm-ok'){const fn=confirmAction;closeSheet();if(fn)fn();return}
        if(action==='confirm-cancel'){closeSheet();return}
        if(['sheet-close','poster-save','poster-share','note-publish'].includes(action)){e.preventDefault();handle(action,button.dataset.id,button)}
        return;
      }
      e.preventDefault();
      handle(action,button.dataset.id,button);
    }
    document.body.addEventListener('click',onClick);

    render();
    loadHistory();
})();
