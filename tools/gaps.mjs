import { chromium } from 'playwright';
const EXE='/Users/zand/Library/Caches/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-mac-x64/chrome-headless-shell';
const b=await chromium.launch({executablePath:EXE});
const p=await (await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true})).newPage();
const click=s=>p.click(s,{timeout:6000}).catch(()=>{});
await p.goto('http://127.0.0.1:4173',{waitUntil:'networkidle'});
await p.evaluate(()=>{
  const rows=[];
  for(let i=0;i<7;i++) rows.push({id:'x'+i,date:'2026/11/1'+i,docket:'（2026）万审字第100'+i+'号',target:'测试被告'+i,defendantId:'monday',category:'work',mark:'周',
    charge:'非法侵占周末罪',evidence:['a','b'],outcome:i<5?'guilty':'settle',finding:'争议焦点：测试。',sentence:'判处测试。',penalty:'p',judge:'铁面无私型',judgeComment:'c',source:'manual',appealRound:0,reaction:''});
  localStorage.setItem('wanniu-court-github-v1',JSON.stringify(rows));
});
const scan=async(label)=>{
  await p.waitForTimeout(500);
  await p.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=400){scrollTo(0,y);await new Promise(r=>setTimeout(r,25))}scrollTo(0,0)});
  await p.waitForTimeout(350);
  const out=await p.evaluate(()=>{
    const host=document.querySelector('#app > div');
    const kids=[...host.children].map(e=>{const r=e.getBoundingClientRect();
      return {sel:(e.className||e.tagName).toString().split(' ')[0],x:Math.round(r.x),y:Math.round(r.y),w:Math.round(r.width),h:Math.round(r.height),right:Math.round(r.right)}});
    kids.sort((a,b)=>a.y-b.y);
    const issues=[];
    // gutter rule applies only to full-bleed blocks; centred ornaments and
    // self-padded wrappers are exempt
    const floats=new Set(['crumb','screen','pickbar','step-foot','tray','fade-in','verdict-head','delib','hero','quick','daily','sec','notice','reaction','action-grid','colophon','ornament','g-hall','daily-ribbon','doc-crest','doc-seal','doc-body']);
    const centred=new Set(['ribbon','empty','stepper']);
    kids.forEach(k=>{
      if(floats.has(k.sel)||centred.has(k.sel)) return;
      if(Math.abs(k.x-16)>1) issues.push(`  INSET   ${k.sel.padEnd(14)} left=${k.x}  (gutter=16)`);
      if(Math.abs(k.right-374)>1) issues.push(`  WIDTH   ${k.sel.padEnd(14)} right=${k.right} (expect 374)`);
      if(k.h<0) issues.push('x');
    });
    for(let i=1;i<kids.length;i++){
      const a=kids[i-1],c=kids[i];
      const sticky=['pickbar','step-foot'];
      if(sticky.includes(a.sel)||sticky.includes(c.sel)) continue;
      const gap=c.y-(a.y+a.h);
      if(gap<0) issues.push(`  OVERLAP ${a.sel} / ${c.sel}  ${gap}px`);
      else if(gap<8) issues.push(`  TIGHT   ${a.sel} → ${c.sel}  ${gap}px`);
      else if(gap>30) issues.push(`  LOOSE   ${a.sel} → ${c.sel}  ${gap}px`);
    }
    // intra-card alignment
    const inner=[];
    // only compare children that share a column; a two-column card legitimately
    // has different left offsets
    const check=(sel,parts)=>{
      const host=document.querySelector(sel); if(!host) return;
      const r=host.getBoundingClientRect();
      const got=parts.map(s=>{const e=host.querySelector(s);if(!e)return null;const b=e.getBoundingClientRect();
        return [s,Math.round(b.left-r.left),Math.round(b.width)]}).filter(Boolean);
      const byCol={};
      got.forEach(g=>{ (byCol[g[1]]=byCol[g[1]]||[]).push(g) });
      Object.values(byCol).forEach(group=>{
        if(group.length<2) return;
        const xs=group.map(g=>g[1]);
        if(Math.max(...xs)-Math.min(...xs)>1) inner.push(`  ${sel}: `+group.map(g=>g[0]+'='+g[1]).join(' '));
      });
    };
    check('.rec',['.art','.rec-body','.rec-del']);
    check('.def-card',['.art','strong']);
    check('.g-card',['.art','.meta']);
    check('.hero-body',['.eyebrow','h1']);
    check('.doc-title',['.kicker','h2','small']);
    check('.doc',['.doc-crest','.doc-body','.doc-seal']);
    check('.hero',['.hero-art','.hero-body']);
    return {issues,inner,page:document.documentElement.scrollHeight,kids:kids.map(k=>k.sel+'@'+k.y+'+'+k.h).join(' ')};
  });
  console.log(`\n### ${label}  (${out.page}px)`);
  console.log(out.issues.length?out.issues.join('\n'):'  gaps: clean');
  if(out.inner.length) console.log('  misaligned:\n'+out.inner.join('\n'));
};
await click('.tab-bar [data-action="home"]'); await scan('首页');
await click('.tab-bar [data-action="trial"]'); await scan('立案 1');
await click('.def-grid .def-card:nth-child(1)'); await click('.pickbar [data-action="next"]'); await scan('立案 2');
await click('.charge-grid .charge:nth-child(1)'); await click('.pickbar [data-action="next"]'); await scan('立案 3');
await click('.tab-bar [data-action="archive"]'); await scan('卷宗');
await click('.tab-bar [data-action="gallery"]'); await scan('图鉴·被告');
await click('.tabs [data-id="characters"]'); await scan('图鉴·角色');
await click('.tabs [data-id="scenes"]'); await scan('图鉴·场景');
await click('.tab-bar [data-action="trial"]');
await click('.def-grid .def-card:nth-child(1)');
await click('.pickbar [data-action="next"]');
await click('.charge-grid .charge:nth-child(1)');
await click('.pickbar [data-action="next"]');
await click('.exhibit:nth-child(1)'); await click('.exhibit:nth-child(2)');
await click('.pickbar [data-action="verdict"]'); await p.waitForTimeout(5600); await scan('判决书');
await b.close();
