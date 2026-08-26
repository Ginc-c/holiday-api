const fs = require('fs');
const path = require('path');

const IMG_DIR = path.join(__dirname, 'images');
const OUTPUT = path.join(__dirname, 'current.jpg');
const EXTS = ['jpg','png','webp','gif'];

const PY = {'元旦':'yuandan','情人节':'qingrenjie','妇女节':'funvjie','植树节':'zhishujie','愚人节':'yurenjie','劳动节':'laodongjie','青年节':'qingnianjie','儿童节':'ertongjie','建党节':'jiandangjie','建军节':'jianjunjie','教师节':'jiaoshijie','国庆节':'guoqingjie','万圣节':'wanshengjie','感恩节':'ganenjie','圣诞节':'shengdanjie','母亲节':'muqinjie','父亲节':'fuqinjie','春节':'chunjie','元宵节':'yuanxiaojie','龙抬头':'longtaitou','端午节':'duanwujie','七夕':'qixi','中元节':'zhongyuanjie','中秋节':'zhongqiujie','重阳节':'chongyangjie','腊八节':'labajie','小年':'xiaonian','除夕':'chuxi','小寒':'xiaohan','大寒':'dahan','立春':'lichun','雨水':'yushui','惊蛰':'jingzhe','春分':'chunfen','清明':'qingming','谷雨':'guyu','立夏':'lixia','小满':'xiaoman','芒种':'mangzhong','夏至':'xiazhi','小暑':'xiaoshu','大暑':'dashu','立秋':'liqiu','处暑':'chushu','白露':'bailu','秋分':'qiufen','寒露':'hanlu','霜降':'shuangjiang','立冬':'lidong','小雪':'xiaoxue','大雪':'daxue','冬至':'dongzhi'};

const LI=[0x04bd8,0x04ae0,0x0a570,0x054d5,0x0d260,0x0d950,0x16554,0x056a0,0x09ad0,0x055d2,0x04ae0,0x0a5b6,0x0a4d0,0x0d250,0x1d255,0x0b540,0x0d6a0,0x0ada2,0x095b0,0x14977,0x04970,0x0a4b0,0x0b4b5,0x06a50,0x06d40,0x1ab54,0x02b60,0x09570,0x052f2,0x04970,0x06566,0x0d4a0,0x0ea50,0x16a95,0x05ad0,0x02b60,0x186e3,0x092e0,0x1c8d7,0x0c950,0x0d4a0,0x1d8a6,0x0b550,0x056a0,0x1a5b4,0x025d0,0x092d0,0x0d2b2,0x0a950,0x0b557,0x06ca0,0x0b550,0x15355,0x04da0,0x0a5b0,0x14573,0x052b0,0x0a9a8,0x0e950,0x06aa0,0x0aea6,0x0ab50,0x04b60,0x0aae4,0x0a570,0x05260,0x0f263,0x0d950,0x05b57,0x056a0,0x096d0,0x04dd5,0x04ad0,0x0a4d0,0x0d4d4,0x0d250,0x0d558,0x0b540,0x0b6a0,0x195a6,0x095b0,0x049b0,0x0a974,0x0a4b0,0x0b27a,0x06a50,0x06d40,0x0af46,0x0ab60,0x09570,0x04af5,0x04970,0x064b0,0x074a3,0x0ea50,0x06b58,0x05ac0,0x0ab60,0x096d5,0x092e0,0x0c960,0x0d954,0x0d4a0,0x0da50,0x07552,0x056a0,0x0abb7,0x025d0,0x092d0,0x0cab5,0x0a950,0x0b4a0,0x0baa4,0x0ad50,0x055d9,0x04ba0,0x0a5b0,0x15176,0x052b0,0x0a930,0x07954,0x06aa0,0x0ad50,0x05b52,0x04b60,0x0a6e6,0x0a4e0,0x0d260,0x0ea65,0x0d530,0x05aa0,0x076a3,0x096d0,0x04afb,0x04ad0,0x0a4d0,0x1d0b6,0x0d250,0x0d520,0x0dd45,0x0b5a0,0x056d0,0x055b2,0x049b0,0x0a577,0x0a4b0,0x0aa50,0x1b255,0x06d20,0x0ada0];

function leapM(y){return LI[y-1900]&0xf}
function leapD(y){return leapM(y)?(LI[y-1900]&0x10000?30:29):0}
function mDays(y,m){return(LI[y-1900]&(0x10000>>m))?30:29}
function yDays(y){let s=348;for(let i=0x8000;i>0x8;i>>=1)s+=(LI[y-1900]&i)?1:0;return s+leapD(y)}
function toSolar(ly,lm,ld){
  if(ly<1900||ly>2049)return null;let off=0;const l=leapM(ly);
  for(let y=1900;y<ly;y++)off+=yDays(y);
  for(let m=1;m<lm;m++){off+=mDays(ly,m);if(m===l)off+=leapD(ly)}
  off+=ld-1;const d=new Date(Date.UTC(1900,0,31)+off*864e5);
  return{year:d.getUTCFullYear(),month:d.getUTCMonth()+1,day:d.getUTCDate()}
}
const TC=[5.4055,20.12,3.87,18.73,5.63,20.646,4.81,20.1,5.52,21.04,5.678,21.37,7.108,22.83,7.5,22.43,7.52,22.44,8.318,23.13,7.438,22.36,7.18,21.94];
const TM=[1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12];
function termDate(year,idx){return{month:TM[idx],day:Math.floor((year%100)*0.2422+TC[idx])-Math.floor(((year%100)-1)/4)}}
function nthWeek(y,m,w,n){const f=new Date(y,m-1,1),a=(w-f.getDay()+7)%7+(n-1)*7;return new Date(y,m-1,1+a)}
function fmt(d){return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')}

function collect(year){
  const list=[],Y=[year-1,year,year+1];
  const fix={'元旦':{m:1,d:1},'情人节':{m:2,d:14},'妇女节':{m:3,d:8},'植树节':{m:3,d:12},'愚人节':{m:4,d:1},'劳动节':{m:5,d:1},'青年节':{m:5,d:4},'儿童节':{m:6,d:1},'建党节':{m:7,d:1},'建军节':{m:8,d:1},'教师节':{m:9,d:10},'国庆节':{m:10,d:1},'万圣节':{m:10,d:31},'圣诞节':{m:12,d:25}};
  for(const n in fix)for(const y of Y){const t=new Date(y,fix[n].m-1,fix[n].d);list.push({name:n,ts:+t})}
  for(const y of Y){
    list.push({name:'母亲节',ts:+nthWeek(y,5,0,2)});
    list.push({name:'父亲节',ts:+nthWeek(y,6,0,3)});
    list.push({name:'感恩节',ts:+nthWeek(y,11,4,4)});
  }
  const lun={'春节':{m:1,d:1},'元宵节':{m:1,d:15},'龙抬头':{m:2,d:2},'端午节':{m:5,d:5},'七夕':{m:7,d:7},'中元节':{m:7,d:15},'中秋节':{m:8,d:15},'重阳节':{m:9,d:9},'腊八节':{m:12,d:8},'小年':{m:12,d:23}};
  for(const ly of Y){
    for(const n in lun){const s=toSolar(ly,lun[n].m,lun[n].d);if(s&&s.year>0)list.push({name:n,ts:+new Date(s.year,s.month-1,s.day)})}
    const s=toSolar(ly+1,1,1);if(s&&s.year>0)list.push({name:'除夕',ts:+new Date(s.year,s.month-1,s.day-1)});
  }
  const terms=['小寒','大寒','立春','雨水','惊蛰','春分','清明','谷雨','立夏','小满','芒种','夏至','小暑','大暑','立秋','处暑','白露','秋分','寒露','霜降','立冬','小雪','大雪','冬至'];
  for(let i=0;i<24;i++)for(const y of Y){const td=termDate(y,i);if(td.day>0)list.push({name:terms[i],ts:+new Date(y,td.month-1,td.day)})}
  return list;
}

function findImage(name){
  const py=PY[name];if(!py)return null;
  for(const ext of EXTS){const f=path.join(IMG_DIR,py+'.'+ext);if(fs.existsSync(f))return f}
  return null;
}

// ── Main ──
const now=new Date();
const today=new Date(now.getFullYear(),now.getMonth(),now.getDate());
const todayTs=+today;
let holidays=collect(now.getFullYear());
const seen=new Set();
holidays=holidays.filter(h=>{const k=h.name+'|'+new Date(h.ts).toISOString().slice(0,10);if(seen.has(k))return false;seen.add(k);return true});
holidays.sort((a,b)=>{const da=Math.abs(a.ts-todayTs),db=Math.abs(b.ts-todayTs);return da!==db?da-db:(b.ts>=todayTs?1:0)-(a.ts>=todayTs?1:0)});

let copied=false;
for(const h of holidays){
  const img=findImage(h.name);
  if(img){
    fs.copyFileSync(img,OUTPUT);
    const ext=img.split('.').pop();
    if(ext!=='jpg'&&fs.existsSync(OUTPUT)){
      // If not jpg, still copy (GitHub Pages serves correct MIME)
    }
    console.log('✅ Copied: '+h.name+' ('+img+') → current.jpg');
    copied=true;break;
  }
}
if(!copied){
  const def=path.join(IMG_DIR,'default.jpg');
  if(fs.existsSync(def)){fs.copyFileSync(def,OUTPUT);console.log('✅ Copied: default.jpg → current.jpg')}
  else console.log('⚠️ No images found in images/ folder')
}
