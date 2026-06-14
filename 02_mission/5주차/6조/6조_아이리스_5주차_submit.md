---
team: 6조
member: 아이리스
role: 조원
week: 5
submitted: true
---

# 5주차 과제 — 아이리스

## 🤖 AI 초안 (개인 참고용)

> [!ai]+ `/draft MMDD-MMDD`로 채우거나, 이 블록을 지우고 직접 작성
> (이 콜아웃은 본인 참고용입니다. 아래 미션 섹션을 다 채우고 나면 통째로 지우거나 접어두세요.)

---

## 미션1: <제목>team: 6조

member: 아이리스

role: 조원

week: 5

submitted: true

5주차 과제 — 아이리스

🤖 AI 초안 (개인 참고용)


![[KakaoTalk_20260612_122659805.mp4]]

![[KakaoTalk_20260612_122543229 1.jpg]]

![[KakaoTalk_20260612_122543229_01.jpg]]

![[KakaoTalk_20260612_122543229_02.jpg]]

![[KakaoTalk_20260612_122655951.mp4]]





/draft MMDD-MMDD로 채우거나, 이 블록을 지우고 직접 작성

(이 콜아웃은 본인 참고용입니다. 아래 미션 섹션을 다 채우고 나면 통째로 지우거나 접어두세요.)

![(null)](file:///C:\Users\user\AppData\Local\Temp\DRW000092e86b41.gif)

미션1: 고1 딸아이를 위한 기말고사 준비하는 “숨 쉬는 학습 OS” 만들기

Summary

이번 미션은 기말고사를 준비 중인 고1 딸아이를 위한 학습 OS를 만드는 것이었다.  
334  
337

import { useState, useEffect, useRef } from "react";

/* ══════════════════════════════════════════════════════

금정여고 1-7반 · 기말고사 D-25 최종 플래너 v2

① 메가 쪽집게 강의 추가

② 오답노트: 사진촬영 + 손그림(Canvas) + 텍스트

③ 안드로이드 모바일 최적화

══════════════════════════════════════════════════════ */

const G = `

@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;900family=JetBrains+Mono:wght@400;700display=swap');

*{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent}

html,body{font-family:'Noto Sans KR',sans-serif;background:#0b0f1a;color:#e8ecf4;-webkit-font-smoothing:antialiased;max-width:480px;margin:0 auto;min-height:100vh}

button{font-family:'Noto Sans KR',sans-serif;cursor:pointer;border:none;background:none}

textarea,input{font-family:'Noto Sans KR',sans-serif;outline:none;border:none}

.nav{position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:480px;background:rgba(8,12,24,.98);border-top:1px solid rgba(255,255,255,.08);display:flex;z-index:200;padding:5px 0 10px}

.nav-btn{flex:1;padding:6px 3px 2px;display:flex;flex-direction:column;align-items:center;gap:2px;color:#374151;font-size:9px;font-weight:700;letter-spacing:.1px;transition:.15s}

.nav-btn .ic{font-size:20px;line-height:1.3}

.nav-btn.on{color:#6366f1}

.page{padding:14px 13px 92px;min-height:100vh}

.ptitle{font-size:18px;font-weight:900;color:#e2e8f0;margin-bottom:3px}

.psub{font-size:11px;color:#374151;margin-bottom:14px}

.card{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);border-radius:16px;padding:15px;margin-bottom:11px}

.ct{font-size:13px;font-weight:700;color:#c7d2fe;margin-bottom:11px;display:flex;align-items:center;gap:7px}

.hero{background:linear-gradient(135deg,rgba(239,68,68,.18),rgba(220,38,38,.06));border:1px solid rgba(239,68,68,.35);border-radius:18px;padding:18px;margin-bottom:12px;display:flex;align-items:center;justify-content:space-between;gap:10px}

.dday-n{font-family:'JetBrains Mono',monospace;font-size:54px;font-weight:700;line-height:1;text-shadow:0 0 28px rgba(239,68,68,.5)}

.dday-l{font-size:9px;color:#6b7280;letter-spacing:2px}

.prog-wrap{background:rgba(255,255,255,.06);border-radius:5px;height:7px;overflow:hidden;margin:6px 0}

.prog-bar{height:100%;border-radius:5px;transition:width .5s cubic-bezier(.4,0,.2,1)}

.bdg{display:inline-flex;align-items:center;padding:2px 8px;border-radius:20px;font-size:10px;font-weight:700}

.bdg-r{background:rgba(239,68,68,.15);color:#fca5a5;border:1px solid rgba(239,68,68,.25)}

.bdg-a{background:rgba(245,158,11,.12);color:#fcd34d;border:1px solid rgba(245,158,11,.2)}

.bdg-g{background:rgba(16,185,129,.12);color:#6ee7b7;border:1px solid rgba(16,185,129,.2)}

.bdg-i{background:rgba(99,102,241,.15);color:#a5b4fc;border:1px solid rgba(99,102,241,.25)}

.bdg-p{background:rgba(236,72,153,.12);color:#f9a8d4;border:1px solid rgba(236,72,153,.2)}

.bdg-y{background:rgba(234,179,8,.12);color:#fde047;border:1px solid rgba(234,179,8,.2)}

.ci{display:flex;align-items:flex-start;gap:11px;padding:10px 0;border-bottom:1px solid rgba(255,255,255,.04);cursor:pointer}

.ci:last-child{border-bottom:none}

.chk{width:22px;height:22px;border-radius:6px;flex-shrink:0;margin-top:1px;display:flex;align-items:center;justify-content:center;font-size:12px;border:2px solid rgba(99,102,241,.35);transition:.2s;color:#6366f1}

.chk.done{background:#6366f1;border-color:#6366f1;color:#fff}

.ci-lbl{font-size:12px;color:#d1d5db;line-height:1.55;flex:1}

.ci-lbl.done{color:#374151;text-decoration:line-through}

/* MEGA CARD */

.mega-card{border-radius:14px;padding:13px;margin-bottom:9px;border:1px solid rgba(255,255,255,.06);cursor:pointer;transition:.15s}

.mega-card:active{opacity:.85}

.mega-head{display:flex;align-items:center;gap:9px}

.mega-body{margin-top:12px;padding-top:11px;border-top:1px solid rgba(255,255,255,.05)}

/* LECTURE BUTTONS */

.lec-section{margin-bottom:12px}

.lec-section-title{font-size:10px;font-weight:700;letter-spacing:1px;color:#4b5563;margin-bottom:7px;display:flex;align-items:center;gap:6px}

.lec-btn{display:flex;align-items:center;gap:9px;padding:11px 13px;border-radius:11px;margin-bottom:7px;width:100%;cursor:pointer;transition:.15s;text-decoration:none}

.lec-btn:active{transform:scale(.98)}

.lec-icon{width:34px;height:34px;border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:15px;flex-shrink:0}

.lec-info{flex:1;text-align:left}

.lec-title{font-size:12px;font-weight:700;margin-bottom:2px;line-height:1.3}

.lec-desc{font-size:10px;color:#6b7280;line-height:1.4}

.lec-arr{font-size:13px;color:#374151;flex-shrink:0}

/* INPUT */

.add-row{display:flex;gap:7px;margin-top:9px}

.add-input{flex:1;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08)!important;border-radius:10px;padding:10px 11px;font-size:12px;color:#e2e8f0}

.add-input::placeholder{color:#2d3748}

.add-btn{background:rgba(99,102,241,.2);border:1px solid rgba(99,102,241,.3)!important;border-radius:10px;padding:10px 15px;font-size:15px;color:#a5b4fc;font-weight:700}

/* DATE */

.date-row{display:flex;gap:5px;overflow-x:auto;padding-bottom:3px;margin-bottom:12px;scrollbar-width:none}

.date-row::-webkit-scrollbar{display:none}

.date-pill{flex-shrink:0;padding:7px 9px;border-radius:11px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.03);font-size:10px;font-weight:600;color:#6b7280;cursor:pointer;text-align:center;min-width:46px;transition:.15s}

.date-pill.on{background:rgba(99,102,241,.18);border-color:rgba(99,102,241,.38);color:#a5b4fc}

.date-pill .dn{font-size:16px;font-weight:700;display:block;line-height:1.3}

/* WRONG NOTE — 핵심 개선 */

.wrong-mode-bar{display:flex;gap:6px;margin-bottom:12px}

.mode-btn{flex:1;padding:10px 6px;border-radius:11px;border:1px solid rgba(255,255,255,.08)!important;background:rgba(255,255,255,.03);font-size:12px;font-weight:700;color:#6b7280;display:flex;flex-direction:column;align-items:center;gap:3px;transition:.15s}

.mode-btn .mic{font-size:20px}

.mode-btn.on{background:rgba(99,102,241,.18);border-color:rgba(99,102,241,.35)!important;color:#a5b4fc}

.photo-area{width:100%;border:2px dashed rgba(99,102,241,.3);border-radius:12px;padding:20px;text-align:center;cursor:pointer;background:rgba(99,102,241,.04);margin-bottom:10px;position:relative}

.photo-area img{width:100%;border-radius:8px;display:block}

.photo-overlay{position:absolute;inset:0;background:rgba(0,0,0,.5);border-radius:12px;display:flex;align-items:center;justify-content:center;opacity:0;transition:.2s}

.photo-area:active .photo-overlay{opacity:1}

.canvas-wrap{position:relative;margin-bottom:10px}

canvas{border-radius:12px;border:1px solid rgba(99,102,241,.25);display:block;touch-action:none;background:#111827;cursor:crosshair}

.canvas-tools{display:flex;gap:6px;margin-bottom:8px;align-items:center}

.tool-btn{width:32px;height:32px;border-radius:8px;border:1px solid rgba(255,255,255,.08)!important;display:flex;align-items:center;justify-content:center;font-size:15px;background:rgba(255,255,255,.04);color:#9ca3af;transition:.15s}

.tool-btn.on{background:rgba(99,102,241,.2);border-color:rgba(99,102,241,.35)!important;color:#a5b4fc}

.color-dot{width:22px;height:22px;border-radius:50%;cursor:pointer;border:2px solid transparent;transition:.15s;flex-shrink:0}

.color-dot.on{border-color:#fff;transform:scale(1.15)}

.size-slider{flex:1;height:4px;accent-color:#6366f1}

.memo{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07)!important;border-radius:10px;padding:11px;font-size:12px;color:#9ca3af;line-height:1.7;width:100%;min-height:70px}

.memo:focus{border-color:rgba(99,102,241,.35)!important;color:#e2e8f0}

.memo::placeholder{color:#2d3748}

/* WRONG CARD */

.wrong-card{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);border-radius:12px;overflow:hidden;margin-bottom:9px}

.wrong-card-header{padding:10px 13px;display:flex;align-items:center;gap:8px;border-bottom:1px solid rgba(255,255,255,.04)}

.wrong-card-body{padding:10px 13px}

.del-btn{background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.18)!important;border-radius:7px;padding:4px 10px;font-size:11px;color:#fca5a5}

/* MODAL */

.modal-bg{position:fixed;inset:0;background:rgba(0,0,0,.8);display:flex;align-items:center;justify-content:center;z-index:300;padding:20px}

.modal{background:#0f172a;border:1px solid rgba(99,102,241,.3);border-radius:20px;padding:26px;text-align:center;max-width:290px;width:100%}

.modal-btn{background:rgba(99,102,241,.2);border:1px solid rgba(99,102,241,.28)!important;border-radius:12px;padding:12px;font-size:14px;color:#a5b4fc;font-weight:700;margin-top:14px;width:100%}

/* TIMELINE */

.tl-item{display:flex;gap:10px;padding:9px 0;border-bottom:1px solid rgba(255,255,255,.04)}

.tl-item:last-child{border-bottom:none}

.tl-dot{width:10px;height:10px;border-radius:50%;flex-shrink:0;margin-top:4px}

`;

/* ══ 메가스터디 강의 데이터 ══ */

const MEGA = {

math: {

pinpoint: [

{emoji:"🎯",title:"[공수1 쪽집게] 현우진 기말 내신집중 패키지",desc:"행렬·경우의수 단원 직접 대비 · 기말고사 전용",url:"https://www.megastudy.net/teacher_v2/chr/lecture_detailview.asp?CHR_CD=52477MAKE_FLG=1tec_cd=woojinmath",hot:true},

{emoji:"🎯",title:"[공수1 쪽집게] 이지훈 RPM 함께 풀어보기",desc:"22개정 유형별 문제풀이 · 기말 범위 단원 선택",url:"https://www.megastudy.net/lecmain/mainh/mainh.asp",hot:false},

],

concept:[

{emoji:"📺",title:"메가 고1 수학 강좌 전체 검색",desc:"공통수학1 검색 → 기말 단원 선택 수강",url:"https://m.megastudy.net/mobile/smart/lecmain/mainh/unitSearch/kebooks/main.asp"},

]

},

soc: {

pinpoint:[

{emoji:"🎯",title:"[통합사회 쪽집게] 벼락치기 특강 〈1학기 기말〉",desc:"기말고사 직전 핵심만 뽑은 특강 · 지금 바로!",url:"http://m.megastudy.net/mobile/smart/lecture/detail/view.asp?CHR_CD=54094",hot:true},

{emoji:"🎯",title:"[통합사회 쪽집게] 이다지 6월 학평 분석",desc:"6월 학평 분석 → 기말 연계 포인트",url:"https://m.megastudy.net/mobile/smart/main.asp?TabNo=7",hot:false},

],

concept:[

{emoji:"📺",title:"이다지도 확실한 개념완성 12",desc:"22개정 전 단원 개념 완성 강의",url:"https://www.megastudy.net/teacher_v2/chr/lecture_detailview.asp?CHR_CD=56489MAKE_FLG=tec_cd=hellohw2"},

]

},

sci: {

pinpoint:[

{emoji:"🎯",title:"[통합과학 쪽집게] 장풍 개념통과 기말 대비",desc:"기말·중간 문제 각 3회분 수록 · 실전 직결",url:"https://www.megastudy.net/teacher_v2/chr/lecture_detailview.asp?CHR_CD=55512tec_cd=wkdtjdrb",hot:true},

{emoji:"🎯",title:"[통합과학 쪽집게] 우마리아 시험 직전 특강",desc:"서술형 답안 만들기 · 기말 핵심 포인트",url:"https://m.megastudy.net/teacher_v2/main.asp?tec_cd=woomaria",hot:false},

{emoji:"🎯",title:"[통합과학] 고1 6월 학평 핵심 포인트 분석",desc:"장풍쌤 6월 학평 총평 → 기말 연계 분석",url:"https://m.megastudy.net/mobile/smart/main.asp?TabNo=7",hot:false},

],

concept:[

{emoji:"📺",title:"베테랑의 통합과학1 개념완성+완자",desc:"개념→완자→문제풀이 3단계",url:"https://www.megastudy.net/teacher_v2/chr/lecture_detailview.asp?CHR_CD=55974MAKE_FLG=tec_cd=kodori15th"},

]

},

kor: {

pinpoint:[

{emoji:"🎯",title:"[국어 쪽집게] 박리나 6월 학평변형 독서/문학",desc:"학평변형으로 기말 독해·문학 직접 대비",url:"https://www.megastudy.net/lecmain/mainh/mainh.asp",hot:true},

{emoji:"🎯",title:"[국어 쪽집게] 교과서 통합 핵심 개념 정리",desc:"22개정 9종 교과서 통합 · 문법·문학·독서",url:"https://www.megastudy.net/lecmain/mainh/mainh.asp",hot:false},

],

concept:[

{emoji:"📺",title:"메가 고1 국어 강좌 전체 보기",desc:"국어 탭 → 공통국어 → 교과서 출판사 선택",url:"https://m.megastudy.net/mobile/smart/teacher/main.asp?domCd=1"},

]

},

eng: {

pinpoint:[

{emoji:"🎯",title:"[영어 쪽집게] 3개년 고1 기출 유형별 풀이",desc:"기출 중심 · 어법·독해 실전 대비",url:"https://www.megastudy.net/lecmain/mainh/mainh.asp",hot:true},

{emoji:"🎯",title:"[영어 쪽집게] 1등급 START 문법+독해",desc:"22개정 문법·독해 통합 1등급 특강",url:"https://www.megastudy.net/lecmain/mainh/mainh.asp",hot:false},

],

concept:[

{emoji:"📺",title:"메가 고1 영어 강좌 전체 보기",desc:"영어 탭 → 공통영어 → 교과서 출판사 선택",url:"https://m.megastudy.net/mobile/smart/teacher/main.asp?domCd=5"},

]

},

hist: {

pinpoint:[

{emoji:"🎯",title:"[한국사 쪽집게] 고1 한국사 기말 대비",desc:"메가 한국사 탭 → 기말 직전 강의",url:"https://m.megastudy.net/mobile/smart/teacher/main.asp?domCd=9",hot:false},

],

concept:[]

},

};

const SUBJECTS=[

{key:"math",name:"수학",emoji:"📐",color:"#f9a8d4",bg:"rgba(236,72,153,.09)",border:"rgba(236,72,153,.3)",prio:"최우선",pc:"bdg-p",range:"공통수학1: 여러가지방정식·부등식 + 행렬 + 경우의수"},

{key:"soc",name:"통합사회",emoji:"🌏",color:"#a5b4fc",bg:"rgba(99,102,241,.08)",border:"rgba(99,102,241,.28)",prio:"수능직결",pc:"bdg-i",range:"2028수능직결! 이현제·강유정·구지은T 수업 단원"},

{key:"sci",name:"통합과학",emoji:"🔬",color:"#7dd3fc",bg:"rgba(14,165,233,.08)",border:"rgba(14,165,233,.28)",prio:"수능직결",pc:"bdg-i",range:"2028수능직결! 윤경임·주형주·박지은T + 과탐실"},

{key:"kor",name:"국어",emoji:"📖",color:"#fcd34d",bg:"rgba(245,158,11,.07)",border:"rgba(245,158,11,.25)",prio:"높음",pc:"bdg-a",range:"문학(시·소설·고전) + 독서 + 문법"},

{key:"eng",name:"영어",emoji:"🌍",color:"#6ee7b7",bg:"rgba(16,185,129,.07)",border:"rgba(16,185,129,.25)",prio:"높음",pc:"bdg-g",range:"교과서 본문 + 문법(관계사·가정법) + 서술형"},

{key:"hist",name:"한국사",emoji:"📜",color:"#fb923c",bg:"rgba(251,146,60,.07)",border:"rgba(251,146,60,.22)",prio:"보통",pc:"bdg-a",range:"김수영T·안현주T / 근현대사 중심"},

];

const DRAW_COLORS=["#ffffff","#f9a8d4","#6ee7b7","#fcd34d","#7dd3fc","#a5b4fc","#ef4444"];

const DAYS_KO=["일","월","화","수","목","금","토"];

const EXAM_DATE=new Date(2026,6,2);

const getDday=()=>{const n=new Date();n.setHours(0,0,0,0);const e=new Date(EXAM_DATE);e.setHours(0,0,0,0);return Math.ceil((e-n)/(1000*60*60*24));};

const getWeekDates=()=>{const d=[];const b=new Date();for(let i=0;i14;i++){const x=new Date(b);x.setDate(b.getDate()+i);d.push(x);}return d;};

const TABS=[{id:"home",ic:"🏠",l:"홈"},{id:"mega",ic:"🎬",l:"메가인강"},{id:"planner",ic:"📅",l:"플래너"},{id:"wrong",ic:"📝",l:"오답노트"},{id:"calendar",ic:"🗓",l:"일정"}];

export default function App(){

const[tab,setTab]=useState("home");

const[openSubj,setOpenSubj]=useState(null);

const[openPhase,setOpenPhase]=useState(null);

const[modal,setModal]=useState(null);

const[selDate,setSelDate]=useState(0);

const weekDates=getWeekDates();

// 오답노트 상태

const[wMode,setWMode]=useState("photo"); // photo | draw | text

const[wSubj,setWSubj]=useState("수학");

const[wText,setWText]=useState("");

const[wMemo,setWMemo]=useState("");

const[wrongs,setWrongs]=useState([]);

const[photoPreview,setPhotoPreview]=useState(null);

const[drawColor,setDrawColor]=useState("#ffffff");

const[brushSize,setBrushSize]=useState(3);

const[isEraser,setIsEraser]=useState(false);

// 캔버스

const canvasRef=useRef(null);

const isDrawing=useRef(false);

const lastPos=useRef(null);

// 플래너

const[tasks,setTasks]=useState({});

const[newTask,setNewTask]=useState("");

const[pChecks,setPChecks]=useState({});

// 저장

useEffect(()=>{

(async()=>{

try{

const wg=await window.storage.get("wg5");if(wg)setWrongs(JSON.parse(wg.value));

const pt=await window.storage.get("pt5");if(pt)setTasks(JSON.parse(pt.value));

const pc=await window.storage.get("pc5");if(pc)setPChecks(JSON.parse(pc.value));

}catch(e){}

})();

},[]);

const sv=async(k,v)=>{try{await window.storage.set(k,JSON.stringify(v));}catch(e){}};

// 캔버스 초기화

useEffect(()=>{

if(tab==="wrong"wMode==="draw"){

setTimeout(()=>{

const canvas=canvasRef.current;

if(!canvas)return;

const ctx=canvas.getContext("2d");

canvas.width=canvas.offsetWidth;

canvas.height=260;

ctx.fillStyle="#111827";

ctx.fillRect(0,0,canvas.width,canvas.height);

// 모눈 그리기

ctx.strokeStyle="rgba(99,102,241,.1)";

ctx.lineWidth=1;

for(let x=0;xcanvas.width;x+=20){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,canvas.height);ctx.stroke();}

for(let y=0;ycanvas.height;y+=20){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(canvas.width,y);ctx.stroke();}

},100);

}

},[tab,wMode]);

const getPos=(e,canvas)=>{

const rect=canvas.getBoundingClientRect();

const touch=e.touches?e.touches[0]:e;

return{x:(touch.clientX-rect.left)*(canvas.width/rect.width),y:(touch.clientY-rect.top)*(canvas.height/rect.height)};

};

const startDraw=(e)=>{

e.preventDefault();

const canvas=canvasRef.current;if(!canvas)return;

isDrawing.current=true;

lastPos.current=getPos(e,canvas);

};

const draw=(e)=>{

e.preventDefault();

if(!isDrawing.current)return;

const canvas=canvasRef.current;if(!canvas)return;

const ctx=canvas.getContext("2d");

const pos=getPos(e,canvas);

ctx.beginPath();

ctx.strokeStyle=isEraser?"#111827":drawColor;

ctx.lineWidth=isEraser?brushSize*4:brushSize;

ctx.lineCap="round";ctx.lineJoin="round";

ctx.moveTo(lastPos.current.x,lastPos.current.y);

ctx.lineTo(pos.x,pos.y);

ctx.stroke();

lastPos.current=pos;

};

const endDraw=(e)=>{e.preventDefault();isDrawing.current=false;};

const clearCanvas=()=>{

const canvas=canvasRef.current;if(!canvas)return;

const ctx=canvas.getContext("2d");

ctx.fillStyle="#111827";ctx.fillRect(0,0,canvas.width,canvas.height);

ctx.strokeStyle="rgba(99,102,241,.1)";ctx.lineWidth=1;

for(let x=0;xcanvas.width;x+=20){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,canvas.height);ctx.stroke();}

for(let y=0;ycanvas.height;y+=20){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(canvas.width,y);ctx.stroke();}

};

const handlePhoto=(e)=>{

const file=e.target.files[0];if(!file)return;

const reader=new FileReader();

reader.onload=(ev)=>setPhotoPreview(ev.target.result);

reader.readAsDataURL(file);

};

const saveWrong=()=>{

let content=null;

if(wMode==="photo"){

if(!photoPreview!wMemo.trim())return;

content={type:"photo",image:photoPreview,memo:wMemo};

}else if(wMode==="draw"){

const canvas=canvasRef.current;

const imgData=canvas?canvas.toDataURL("image/png"):null;

if(!imgData!wMemo.trim())return;

content={type:"draw",image:imgData,memo:wMemo};

}else{

if(!wText.trim())return;

content={type:"text",text:wText,memo:wMemo};

}

const entry={subj:wSubj,content,date:new Date().toLocaleDateString("ko-KR"),id:Date.now()};

const u=[...wrongs,entry];setWrongs(u);sv("wg5",u);

setPhotoPreview(null);setWText("");setWMemo("");clearCanvas();

setModal({emoji:"✅",title:"오답 저장 완료!",sub:"나중에 다시 보며 복습해요"});

};

const delWrong=(id)=>{const u=wrongs.filter(w=>w.id!==id);setWrongs(u);sv("wg5",u);};

const dkey=weekDates[selDate].toDateString();

const dayTasks=tasks[dkey]||[];

const doneToday=dayTasks.filter(t=>t.done).length;

const dday=getDday();

const ddayColor=dday=7?"#ef4444":dday=14?"#f59e0b":"#6366f1";

const addTask=()=>{if(!newTask.trim())return;const u={...tasks,[dkey]:[...dayTasks,{text:newTask.trim(),done:false}]};setTasks(u);sv("pt5",u);setNewTask("");};

const toggleTask=(idx)=>{const u={...tasks,[dkey]:dayTasks.map((t,i)=>i===idx?{...t,done:!t.done}:t)};setTasks(u);sv("pt5",u);if(u[dkey].every(t=>t.done)u[dkey].length>0)setModal({emoji:"🏆",title:"오늘 목표 완료!",sub:`${u[dkey].length}개 달성! 잘했어요 👍`});};

const delTask=(idx)=>{const u={...tasks,[dkey]:dayTasks.filter((_,i)=>i!==idx)};setTasks(u);sv("pt5",u);};

const togglePC=(pi,ti)=>{const k=`${pi}-${ti}`;const u={...pChecks,[k]:!pChecks[k]};setPChecks(u);sv("pc5",u);};

const openLink=(url)=>window.open(url,"_blank");

const PHASES=[

{l:"D-25~D-21",t:"범위 확정",c:"#ef4444",bg:"rgba(239,68,68,.12)",tasks:["시험범위 선생님께 확인","모든 과목 필기 모으기","중간고사 오답 분석","메가 쪽집게 강의 저장"]},

{l:"D-21~D-14",t:"개념 1회독",c:"#f59e0b",bg:"rgba(245,158,11,.1)",tasks:["수학 교과서 예제 전부 풀기","국어 본문 작품 정리","영어 단어 노트 완성","통합사·과 개념 지도 제작"]},

{l:"D-14~D-7",t:"문제풀이",c:"#6366f1",bg:"rgba(99,102,241,.1)",tasks:["수학 유형별 문제집 1회","국어 기출 3~5회 풀기","영어 서술형 패턴 10개","탐구 2025 기출 오답"]},

{l:"D-7~D-3",t:"오답 파이널",c:"#10b981",bg:"rgba(16,185,129,.09)",tasks:["틀린 문제만 재풀이","본문 암기 최종 점검","수식 계산 실수 없애기","서술형 손으로 쓰기"]},

{l:"D-3~D-1",t:"컨디션 관리",c:"#ec4899",bg:"rgba(236,72,153,.09)",tasks:["새 공부 NO·정리만","수면 22시 취침 목표","아침 식사 꼭 먹기","공식 최종 암기"]},

];

const subjColor=(s)=>({수학:"#f9a8d4",국어:"#fcd34d",영어:"#6ee7b7",통합사회:"#a5b4fc",통합과학:"#7dd3fc",한국사:"#fb923c"}[s]||"#9ca3af");

return(

>

style>{G}/style>

{modal(

div className="modal-bg" onClick={()=>setModal(null)}>

div className="modal" onClick={e=>e.stopPropagation()}>

div style={{fontSize:"44px",marginBottom:"10px"}}>{modal.emoji}/div>

div style={{fontSize:"17px",fontWeight:"700",color:"#c7d2fe",marginBottom:"6px"}}>{modal.title}/div>

div style={{fontSize:"12px",color:"#6b7280",lineHeight:"1.6",whiteSpace:"pre-line"}}>{modal.sub}/div>

button className="modal-btn" onClick={()=>setModal(null)}>확인 ✓/button>

/div>

/div>

)}

{/* ═══ HOME ═══ */}

{tab==="home"(

div className="page">

div className="hero">

div>

div style={{fontSize:"9px",fontWeight:"700",color:"#f87171",letterSpacing:"2px",marginBottom:"4px"}}>🔥 지금 준비할 시험/div>

div style={{fontSize:"17px",fontWeight:"900",color:"#fca5a5",lineHeight:"1.3"}}>1학기 기말고사/div>

div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"11px",color:"#6b7280",marginTop:"3px"}}>7월 2일(목) ~ 7일(화)/div>

div style={{marginTop:"8px",display:"flex",gap:"4px",flexWrap:"wrap"}}>

{["수학","국어","영어","통합사회","통합과학","한국사"].map(s=>(

span key={s} style={{padding:"2px 6px",background:"rgba(239,68,68,.15)",border:"1px solid rgba(239,68,68,.2)",borderRadius:"6px",fontSize:"9px",color:"#fca5a5"}}>{s}/span>

))}

/div>

/div>

div style={{textAlign:"center",flexShrink:0}}>

div className="dday-n" style={{color:ddayColor,textShadow:`0 0 25px ${ddayColor}60`}}>D-{dday}/div>

div className="dday-l">DAYS LEFT/div>

/div>

/div>

div className="card">

div className="ct">⚡ 야자 시간 활용법/div>

{[

{d:"월",c:"#a5b4fc",t:"~21:00",a:"수업복습 50분 + 수학예제 40분 + 통합사회 30분"},

{d:"화",c:"#6ee7b7",t:"~19:40",a:"영어 단어 완료 → 영어학원 직행"},

{d:"수",c:"#fcd34d",t:"~19:30",a:"⭐ 통합과학 60분 + 통합사회 60분 황금자습"},

{d:"목",c:"#6ee7b7",t:"~19:40",a:"한국사 30분 + 수학오답 30분 + 영어준비"},

{d:"금",c:"#f9a8d4",t:"~18:20",a:"주간 약점 총정리 → 국어학원 직행"},

].map((r,i)=>(

div key={i} style={{display:"flex",gap:"9px",padding:"8px 0",borderBottom:i4?"1px solid rgba(255,255,255,.04)":"none",alignItems:"flex-start"}}>

div style={{width:"26px",height:"26px",borderRadius:"7px",flexShrink:0,background:"rgba(99,102,241,.14)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"11px",fontWeight:"700",color:r.c}}>{r.d}/div>

div>

div style={{fontSize:"9px",color:"#4b5563",fontFamily:"'JetBrains Mono',monospace",marginBottom:"2px"}}>야자 {r.t}/div>

div style={{fontSize:"12px",color:"#d1d5db",lineHeight:"1.5"}}>{r.a}/div>

/div>

/div>

))}

/div>

div className="card">

div className="ct">🏫 학원 스케줄/div>

{[

{d:"수·토",n:"수학학원",t:"13:00~16:00",c:"#f9a8d4",tip:"끝나고 오답 즉시 정리"},

{d:"화·목",n:"영어학원",t:"21:30~23:00",c:"#6ee7b7",tip:"야자 중 단어 미리 암기"},

{d:"금",n:"국어학원",t:"19:00~22:00",c:"#fcd34d",tip:"야자 18:20 후 직행"},

{d:"일",n:"국어학원",t:"12:00~15:00",c:"#fcd34d",tip:"오전 자습 후 학원"},

].map((r,i)=>(

div key={i} style={{display:"flex",gap:"9px",padding:"8px 0",borderBottom:i3?"1px solid rgba(255,255,255,.04)":"none",alignItems:"center"}}>

div style={{width:"28px",fontSize:"11px",fontWeight:"700",color:"#6b7280",flexShrink:0,textAlign:"center"}}>{r.d}/div>

div style={{flex:1}}>

span style={{fontSize:"13px",fontWeight:"700",color:r.c}}>{r.n} /span>

span style={{fontSize:"10px",color:"#4b5563",fontFamily:"'JetBrains Mono',monospace"}}>{r.t}/span>

div style={{fontSize:"10px",color:"#6b7280",marginTop:"1px"}}>{r.tip}/div>

/div>

/div>

))}

/div>

/div>

)}

{/* ═══ 메가인강 ═══ */}

{tab==="mega"(

div className="page">

div className="ptitle">🎬 메가스터디 강의/div>

div className="psub">🎯 쪽집게 = 기말 직접 대비 · 📺 개념 = 전체 개념 강의/div>

div style={{background:"rgba(234,179,8,.08)",border:"1px solid rgba(234,179,8,.22)",borderRadius:"12px",padding:"12px 14px",marginBottom:"14px",fontSize:"12px",color:"#fde047",lineHeight:"1.7"}}>

⚡ strong>D-{dday} 남았어요!/strong>br/>

🎯 쪽집게 강의부터 먼저 — 기말 범위 딱 집어서 빠르게!br/>

버튼 터치 → 메가 앱 or 브라우저로 이동 → 로그인 후 수강

/div>

{SUBJECTS.map((s,i)=>{

const lecs=MEGA[s.key];

return(

div key={i} className="mega-card"

style={{background:s.bg,borderColor:openSubj===i?s.border:"rgba(255,255,255,.06)"}}

onClick={()=>setOpenSubj(openSubj===i?null:i)}>

div className="mega-head">

div style={{fontSize:"22px",width:"34px",textAlign:"center"}}>{s.emoji}/div>

div style={{flex:1}}>

div style={{fontSize:"14px",fontWeight:"700",color:s.color}}>{s.name}/div>

div style={{fontSize:"10px",color:"#6b7280",marginTop:"1px"}}>{s.range.substring(0,40)}.../div>

/div>

span className={`bdg ${s.pc}`} style={{flexShrink:0}}>{s.prio}/span>

span style={{color:"#374151",fontSize:"13px",marginLeft:"6px"}}>{openSubj===i?"▲":"▼"}/span>

/div>

{openSubj===i(

div className="mega-body">

{lecs.pinpoint.length>0(

div className="lec-section">

div className="lec-section-title">

span className="bdg bdg-y">🎯 쪽집게/span>

span>기말고사 직접 대비 강의/span>

/div>

{lecs.pinpoint.map((l,j)=>(

button key={j} className="lec-btn"

style={{background:l.hot?"rgba(239,68,68,.1)":"rgba(255,255,255,.03)",border:`1px solid ${l.hot?"rgba(239,68,68,.3)":"rgba(255,255,255,.06)"}!important`}}

onClick={e=>{e.stopPropagation();openLink(l.url);}}>

div className="lec-icon" style={{background:l.hot?"rgba(239,68,68,.15)":s.bg}}>{l.emoji}/div>

div className="lec-info">

div className="lec-title" style={{color:l.hot?"#fca5a5":s.color}}>{l.title}/div>

div className="lec-desc">{l.desc}/div>

/div>

div className="lec-arr">→/div>

/button>

))}

/div>

)}

{lecs.concept.length>0(

div className="lec-section">

div className="lec-section-title">

span className="bdg bdg-i">📺 개념/span>

span>전체 개념 강의/span>

/div>

{lecs.concept.map((l,j)=>(

button key={j} className="lec-btn"

style={{background:"rgba(255,255,255,.025)",border:"1px solid rgba(255,255,255,.06)!important"}}

onClick={e=>{e.stopPropagation();openLink(l.url);}}>

div className="lec-icon" style={{background:s.bg}}>{l.emoji}/div>

div className="lec-info">

div className="lec-title" style={{color:s.color}}>{l.title}/div>

div className="lec-desc">{l.desc}/div>

/div>

div className="lec-arr">→/div>

/button>

))}

/div>

)}

/div>

)}

/div>

);

})}

div style={{background:"rgba(99,102,241,.07)",border:"1px solid rgba(99,102,241,.18)",borderRadius:"12px",padding:"13px",marginTop:"4px"}}>

div style={{fontSize:"11px",fontWeight:"700",color:"#a5b4fc",marginBottom:"7px"}}>💡 인강 황금 규칙/div>

{["강의 1편 보면 → 바로 문제 5문항 풀기 (보기만 하면 소용없음)","주말 집중 수강 → 평일 인강 가능한 자제","쪽집게 강의 먼저 → 개념 강의는 모를 때만","통합사·과 쪽집게가 지금 가장 급함"].map((t,i)=>(

div key={i} style={{fontSize:"11px",color:"#6b7280",padding:"4px 0",borderBottom:i3?"1px solid rgba(255,255,255,.03)":"none"}}>{`▸ ${t}`}/div>

))}

/div>

/div>

)}

{/* ═══ 플래너 ═══ */}

{tab==="planner"(

div className="page">

div className="ptitle">📅 하루 플래너/div>

div className="psub">날짜 선택 → 목표 입력 → 완료 체크/div>

div className="date-row">

{weekDates.map((d,i)=>{

const dk=d.toDateString();const dt=tasks[dk]||[];const dn=dt.filter(t=>t.done).length;

const isE=d>=EXAM_DATEd=new Date(2026,6,7);

return(

div key={i} className={`date-pill${selDate===i?" on":""}`} style={isE?{background:"rgba(239,68,68,.14)",borderColor:"rgba(239,68,68,.28)"}:{}} onClick={()=>setSelDate(i)}>

span className="dn" style={isE?{color:"#fca5a5"}:{}}>{d.getDate()}/span>

span style={{fontSize:"9px"}}>{DAYS_KO[d.getDay()]}/span>

{dt.length>0span style={{fontSize:"8px",color:dn===dt.length?"#6ee7b7":"#6366f1",display:"block"}}>{dn}/{dt.length}/span>}

{isEspan style={{fontSize:"8px",color:"#fca5a5",display:"block"}}>시험/span>}

/div>

);

})}

/div>

div className="card">

div className="ct">

{weekDates[selDate].getMonth()+1}월 {weekDates[selDate].getDate()}일 ({DAYS_KO[weekDates[selDate].getDay()]}) 목표

{dayTasks.length>0span className={`bdg ${doneToday===dayTasks.length?"bdg-g":"bdg-i"}`} style={{marginLeft:"auto"}}>{doneToday}/{dayTasks.length}/span>}

/div>

{dayTasks.length===0?(

div style={{textAlign:"center",padding:"18px 0",color:"#374151",fontSize:"13px"}}>목표를 추가해봐요 👇/div>

):(

>

div className="prog-wrap">div className="prog-bar" style={{width:`${(doneToday/dayTasks.length)*100}%`,background:"linear-gradient(90deg,#6366f1,#a5b4fc)"}}/>/div>

{dayTasks.map((t,i)=>(

div key={i} className="ci" onClick={()=>toggleTask(i)}>

div className={`chk${t.done?" done":""}`}>{t.done?"✓":""}/div>

div style={{flex:1}}>div className={`ci-lbl${t.done?" done":""}`}>{t.text}/div>/div>

button style={{color:"#374151",fontSize:"19px",padding:"4px",flexShrink:0}} onClick={e=>{e.stopPropagation();delTask(i);}}>×/button>

/div>

))}

/>

)}

div className="add-row">

input className="add-input" placeholder="목표 입력 (예: 수학 행렬 예제 풀기)" value={newTask} onChange={e=>setNewTask(e.target.value)} onKeyDown={e=>e.key==="Enter"addTask()}/>

button className="add-btn" onClick={addTask}>+/button>

/div>

/div>

div className="card">

div className="ct">📋 기말 D-{dday} 단계 체크/div>

{PHASES.map((p,pi)=>(

div key={pi} style={{marginBottom:"6px"}}>

div style={{display:"flex",alignItems:"center",gap:"7px",padding:"8px 0",cursor:"pointer",borderBottom:"1px solid rgba(255,255,255,.04)"}} onClick={()=>setOpenPhase(openPhase===pi?null:pi)}>

span style={{padding:"2px 7px",borderRadius:"7px",fontSize:"9px",fontWeight:"700",background:p.bg,color:p.c}}>{p.l}/span>

span style={{fontSize:"12px",fontWeight:"700",color:"#e2e8f0",flex:1}}>{p.t}/span>

span style={{fontSize:"10px",color:"#4b5563"}}>{p.tasks.filter((_,ti)=>pChecks[`${pi}-${ti}`]).length}/{p.tasks.length}/span>

span style={{color:"#374151",fontSize:"12px"}}>{openPhase===pi?"▲":"▼"}/span>

/div>

{openPhase===pip.tasks.map((t,ti)=>{

const k=`${pi}-${ti}`;

return(

div key={ti} className="ci" onClick={()=>togglePC(pi,ti)}>

div className={`chk${pChecks[k]?" done":""}`}>{pChecks[k]?"✓":""}/div>

div className={`ci-lbl${pChecks[k]?" done":""}`}>{t}/div>

/div>

);

})}

/div>

))}

/div>

/div>

)}

{/* ═══ 오답노트 ═══ */}

{tab==="wrong"(

div className="page">

div className="ptitle">📝 오답 노트/div>

div className="psub">사진 찍기 · 손으로 그리기 · 글로 쓰기 — {wrongs.length}개 저장됨/div>

{/* 과목 선택 */}

div style={{display:"flex",gap:"5px",marginBottom:"12px",flexWrap:"wrap"}}>

{["수학","국어","영어","통합사회","통합과학","한국사"].map(s=>(

button key={s} onClick={()=>setWSubj(s)}

style={{padding:"7px 12px",borderRadius:"20px",border:"1px solid",fontSize:"12px",fontWeight:"700",transition:".15s",

background:wSubj===s?`${subjColor(s)}22`:"rgba(255,255,255,.03)",

borderColor:wSubj===s?subjColor(s):"rgba(255,255,255,.08)",

color:wSubj===s?subjColor(s):"#6b7280"}}>

{s}

/button>

))}

/div>

{/* 입력 방식 선택 */}

div className="wrong-mode-bar">

{[

{id:"photo",ic:"📷",l:"사진 찍기"},

{id:"draw",ic:"✏️",l:"손으로 그리기"},

{id:"text",ic:"⌨️",l:"글로 쓰기"},

].map(m=>(

button key={m.id} className={`mode-btn${wMode===m.id?" on":""}`} onClick={()=>setWMode(m.id)}>

span className="mic">{m.ic}/span>

span>{m.l}/span>

/button>

))}

/div>

{/* 📷 사진 모드 */}

{wMode==="photo"(

div className="card">

div className="ct">📷 사진으로 오답 기록/div>

div style={{fontSize:"11px",color:"#4b5563",marginBottom:"10px",lineHeight:"1.6"}}>

수학 풀이과정, 오답 문제, 선생님 판서, 교과서 등br/>

어떤 사진이든 찍어서 저장하면 돼요

/div>

label style={{display:"block",cursor:"pointer"}}>

div className="photo-area">

{photoPreview?(

>

img src={photoPreview} alt="오답사진"/>

div className="photo-overlay">span style={{color:"#fff",fontSize:"13px",fontWeight:"700"}}>사진 변경/span>/div>

/>

):(

div style={{padding:"20px 0"}}>

div style={{fontSize:"36px",marginBottom:"8px"}}>📷/div>

div style={{fontSize:"13px",fontWeight:"700",color:"#a5b4fc",marginBottom:"4px"}}>터치해서 사진 찍기/div>

div style={{fontSize:"11px",color:"#374151"}}>카메라로 찍거나 갤러리에서 선택/div>

/div>

)}

/div>

input type="file" accept="image/*" capture="environment" onChange={handlePhoto} style={{display:"none"}}/>

/label>

div style={{fontSize:"11px",fontWeight:"700",color:"#4b5563",margin:"10px 0 6px"}}>✏️ 메모 추가 (선택)/div>

textarea className="memo" rows={2} placeholder="틀린 이유, 핵심 포인트 한 줄 메모..." value={wMemo} onChange={e=>setWMemo(e.target.value)}/>

button onClick={saveWrong} style={{width:"100%",marginTop:"10px",padding:"13px",borderRadius:"12px",background:"rgba(99,102,241,.2)",border:"1px solid rgba(99,102,241,.3)",color:"#a5b4fc",fontSize:"14px",fontWeight:"700"}}>저장/button>

/div>

)}

{/* ✏️ 손글씨 드로잉 모드 */}

{wMode==="draw"(

div className="card">

div className="ct">✏️ 손으로 직접 쓰기/div>

div style={{fontSize:"11px",color:"#4b5563",marginBottom:"10px",lineHeight:"1.6"}}>

수학 수식, 그래프, 화학식, 영어 문장 구조 등br/>

손가락으로 자유롭게 그려요

/div>

div className="canvas-tools">

div style={{display:"flex",gap:"4px"}}>

{DRAW_COLORS.map(c=>(

div key={c} className={`color-dot${drawColor===c!isEraser?" on":""}`}

style={{background:c,width:"22px",height:"22px"}}

onClick={()=>{setDrawColor(c);setIsEraser(false);}}/>

))}

/div>

button className={`tool-btn${isEraser?" on":""}`} onClick={()=>setIsEraser(!isEraser)} title="지우개">🧹/button>

button className="tool-btn" onClick={clearCanvas} title="전체 지우기">🗑/button>

/div>

div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"8px"}}>

span style={{fontSize:"10px",color:"#4b5563",flexShrink:0}}>굵기/span>

input type="range" min="1" max="12" value={brushSize} onChange={e=>setBrushSize(Number(e.target.value))} className="size-slider" style={{flex:1}}/>

span style={{fontSize:"10px",color:"#6366f1",width:"16px"}}>{brushSize}/span>

/div>

div className="canvas-wrap">

canvas ref={canvasRef} style={{width:"100%",touchAction:"none"}}

onMouseDown={startDraw} onMouseMove={draw} onMouseUp={endDraw} onMouseLeave={endDraw}

onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={endDraw}/>

/div>

div style={{fontSize:"11px",fontWeight:"700",color:"#4b5563",margin:"8px 0 5px"}}>✏️ 메모 추가 (선택)/div>

textarea className="memo" rows={2} placeholder="틀린 이유, 핵심 포인트..." value={wMemo} onChange={e=>setWMemo(e.target.value)}/>

button onClick={saveWrong} style={{width:"100%",marginTop:"10px",padding:"13px",borderRadius:"12px",background:"rgba(99,102,241,.2)",border:"1px solid rgba(99,102,241,.3)",color:"#a5b4fc",fontSize:"14px",fontWeight:"700"}}>저장/button>

/div>

)}

{/* ⌨️ 텍스트 모드 */}

{wMode==="text"(

div className="card">

div className="ct">⌨️ 글로 기록하기/div>

div style={{fontSize:"11px",color:"#4b5563",marginBottom:"10px",lineHeight:"1.6"}}>

국어 본문 틀린 선지, 영어 어법 포인트,br/>

개념 헷갈린 것 등 간단히 텍스트로 기록

/div>

textarea className="memo" rows={5} placeholder={`${wSubj} 틀린 내용 기록\n\n예) 수학: 행렬 곱셈에서 AB≠BA 인 걸 몰랐음\n예) 영어: 관계대명사 that/which 차이 헷갈림\n예) 통합사회: 사회계약론 로크·루소·홉스 구분 안 됨`}

value={wText} onChange={e=>setWText(e.target.value)} style={{minHeight:"120px"}}/>

button onClick={saveWrong} style={{width:"100%",marginTop:"10px",padding:"13px",borderRadius:"12px",background:"rgba(99,102,241,.2)",border:"1px solid rgba(99,102,241,.3)",color:"#a5b4fc",fontSize:"14px",fontWeight:"700"}}>저장/button>

/div>

)}

{/* 저장된 오답 목록 */}

{wrongs.length>0(

>

div style={{fontSize:"13px",fontWeight:"700",color:"#c7d2fe",margin:"16px 0 10px",display:"flex",alignItems:"center",gap:"6px"}}>

📚 저장된 오답

span className="bdg bdg-i">{wrongs.length}개/span>

/div>

{[...wrongs].reverse().map((w,i)=>(

div key={w.id||i} className="wrong-card">

div className="wrong-card-header">

span style={{fontSize:"10px",fontWeight:"700",color:subjColor(w.subj)}}>{w.subj}/span>

span style={{fontSize:"9px",color:"#4b5563",marginLeft:"auto"}}>{w.date}/span>

span style={{fontSize:"12px",marginLeft:"6px"}}>{w.content.type==="photo"?"📷":w.content.type==="draw"?"✏️":"⌨️"}/span>

button className="del-btn" style={{marginLeft:"8px",marginTop:"0"}} onClick={()=>delWrong(w.id)}>삭제/button>

/div>

div className="wrong-card-body">

{(w.content.type==="photo"||w.content.type==="draw")w.content.image(

img src={w.content.image} alt="오답" style={{width:"100%",borderRadius:"8px",marginBottom:"6px"}}/>

)}

{w.content.type==="text"(

div style={{fontSize:"12px",color:"#d1d5db",lineHeight:"1.6",whiteSpace:"pre-wrap"}}>{w.content.text}/div>

)}

{w.content.memo(

div style={{fontSize:"11px",color:"#6b7280",marginTop:"6px",padding:"7px 10px",background:"rgba(99,102,241,.07)",borderRadius:"8px"}}>

💬 {w.content.memo}

/div>

)}

/div>

/div>

))}

/>

)}

/div>

)}

{/* ═══ 일정 ═══ */}

{tab==="calendar"(

div className="page">

div className="ptitle">🗓 연간 시험 일정/div>

div className="psub">금정여고 2026학년도 공식 일정/div>

div style={{background:"rgba(239,68,68,.12)",border:"1px solid rgba(239,68,68,.3)",borderRadius:"16px",padding:"16px",marginBottom:"12px"}}>

div style={{fontSize:"10px",color:"#f87171",fontWeight:"700",marginBottom:"3px",letterSpacing:"1px"}}>🔥 지금 준비할 시험/div>

div style={{fontSize:"20px",fontWeight:"900",color:"#fca5a5"}}>1학기 기말고사/div>

div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"12px",color:"#6b7280",marginTop:"3px"}}>

7월 2일(목) ~ 7월 7일(화) · span style={{color:ddayColor}}>D-{dday}/span>

/div>

/div>

div className="card">

div className="ct">📅 2026 전체 일정/div>

{[

{date:"3.24(화)",title:"3월 전국학력평가",dot:"#374151",done:true,note:"전학년 · ✓ 완료"},

{date:"4.28~5.1",title:"1학기 중간고사",dot:"#374151",done:true,note:"전학년 · ✓ 완료"},

{date:"6.4(목)",title:"6월 학력평가",dot:"#374151",done:true,note:"1·2학년 · ✓ 완료"},

{date:"7.2~7.7",title:"1학기 기말고사",dot:"#ef4444",hot:true,note:`전학년 · D-${dday}`},

{date:"7.24~8.17",title:"여름방학",dot:"#10b981",note:"수학 집중 선행"},

{date:"9.2(수)",title:"9월 학력평가",dot:"#f59e0b",note:"1·2학년"},

{date:"10.13~16",title:"2학기 중간고사",dot:"#ec4899",note:"전학년"},

{date:"10.20(화)",title:"10월 학력평가",dot:"#f59e0b",note:"전학년"},

{date:"12.15~18",title:"2학기 기말고사",dot:"#ec4899",note:"1·2학년"},

{date:"12.31~1.31",title:"겨울방학",dot:"#10b981",note:"고2 준비"},

].map((item,i)=>(

div key={i} className="tl-item">

div className="tl-dot" style={{background:item.dot,boxShadow:item.hot?`0 0 8px ${item.dot}`:""}}/>

div>

div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"9px",color:"#4b5563",marginBottom:"2px"}}>{item.date}/div>

div style={{fontSize:"13px",fontWeight:"700",color:item.done?"#374151":item.hot?"#fca5a5":"#e2e8f0",textDecoration:item.done?"line-through":""}}>

{item.title}{item.hotspan style={{marginLeft:"6px",fontSize:"10px",color:"#ef4444"}}>← 지금!/span>}

/div>

div style={{fontSize:"10px",color:"#6b7280",marginTop:"1px"}}>{item.note}/div>

/div>

/div>

))}

/div>

/div>

)}

nav className="nav">

{TABS.map(n=>(

button key={n.id} className={`nav-btn${tab===n.id?" on":""}`} onClick={()=>setTab(n.id)}>

span className="ic">{n.ic}/span>{n.l}

/button>

))}

/nav>

/>

);

}

처음 문제의식은 단순했다.  
학교 시간표, 야간자율학습, 국어·영어·수학 학원, 인강, 족보닷컴, 메가스터디, EBSi, 시험범위, 오답노트가 모두 흩어져 있었다.

엄마 입장에서는 “이걸 한곳에 모으면 아이가 공부하기 편하지 않을까?”라는 생각으로 시작했다.  
하지만 구현을 하면서 가장 크게 느낀 것은, 공부 OS는 자료를 많이 모으는 시스템이 아니라 아이가 숨 쉴 수 있게 공부의 우선순위를 덜어주는 시스템이어야 한다는 점이었다.

import { useState, useEffect, useRef } from "react";

/══════════════════════════════════════════════════════  
금정여고 1-7반 · 기말고사 D-25 최종 플래너 v2  
① 메가 쪽집게 강의 추가  
② 오답노트: 사진촬영 + 손그림(Canvas) + 텍스트  
③ 안드로이드 모바일 최적화  
══════════════════════════════════════════════════════ /

const G = `  
@import url('[https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;900family=JetBrains+Mono:wght@400;700display=swap')](https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;900family=JetBrains+Mono:wght@400;700display=swap\));  
*{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent}  
html,body{font-family:'Noto Sans KR',sans-serif;background:#0b0f1a;color:#e8ecf4;-webkit-font-smoothing:antialiased;max-width:480px;margin:0 auto;min-height:100vh}  
button{font-family:'Noto Sans KR',sans-serif;cursor:pointer;border:none;background:none}  
textarea,input{font-family:'Noto Sans KR',sans-serif;outline:none;border:none}

.nav{position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:480px;background:rgba(8,12,24,.98);border-top:1px solid rgba(255,255,255,.08);display:flex;z-index:200;padding:5px 0 10px}  
.nav-btn{flex:1;padding:6px 3px 2px;display:flex;flex-direction:column;align-items:center;gap:2px;color:#374151;font-size:9px;font-weight:700;letter-spacing:.1px;transition:.15s}  
.nav-btn .ic{font-size:20px;line-height:1.3}  
.nav-btn.on{color:#6366f1}

.page{padding:14px 13px 92px;min-height:100vh}  
.ptitle{font-size:18px;font-weight:900;color:#e2e8f0;margin-bottom:3px}  
.psub{font-size:11px;color:#374151;margin-bottom:14px}

.card{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);border-radius:16px;padding:15px;margin-bottom:11px}  
.ct{font-size:13px;font-weight:700;color:#c7d2fe;margin-bottom:11px;display:flex;align-items:center;gap:7px}

.hero{background:linear-gradient(135deg,rgba(239,68,68,.18),rgba(220,38,38,.06));border:1px solid rgba(239,68,68,.35);border-radius:18px;padding:18px;margin-bottom:12px;display:flex;align-items:center;justify-content:space-between;gap:10px}  
.dday-n{font-family:'JetBrains Mono',monospace;font-size:54px;font-weight:700;line-height:1;text-shadow:0 0 28px rgba(239,68,68,.5)}  
.dday-l{font-size:9px;color:#6b7280;letter-spacing:2px}

.prog-wrap{background:rgba(255,255,255,.06);border-radius:5px;height:7px;overflow:hidden;margin:6px 0}  
.prog-bar{height:100%;border-radius:5px;transition:width .5s cubic-bezier(.4,0,.2,1)}

.bdg{display:inline-flex;align-items:center;padding:2px 8px;border-radius:20px;font-size:10px;font-weight:700}  
.bdg-r{background:rgba(239,68,68,.15);color:#fca5a5;border:1px solid rgba(239,68,68,.25)}  
.bdg-a{background:rgba(245,158,11,.12);color:#fcd34d;border:1px solid rgba(245,158,11,.2)}  
.bdg-g{background:rgba(16,185,129,.12);color:#6ee7b7;border:1px solid rgba(16,185,129,.2)}  
.bdg-i{background:rgba(99,102,241,.15);color:#a5b4fc;border:1px solid rgba(99,102,241,.25)}  
.bdg-p{background:rgba(236,72,153,.12);color:#f9a8d4;border:1px solid rgba(236,72,153,.2)}  
.bdg-y{background:rgba(234,179,8,.12);color:#fde047;border:1px solid rgba(234,179,8,.2)}

.ci{display:flex;align-items:flex-start;gap:11px;padding:10px 0;border-bottom:1px solid rgba(255,255,255,.04);cursor:pointer}  
.ci:last-child{border-bottom:none}  
.chk{width:22px;height:22px;border-radius:6px;flex-shrink:0;margin-top:1px;display:flex;align-items:center;justify-content:center;font-size:12px;border:2px solid rgba(99,102,241,.35);transition:.2s;color:#6366f1}  
.chk.done{background:#6366f1;border-color:#6366f1;color:#fff}  
.ci-lbl{font-size:12px;color:#d1d5db;line-height:1.55;flex:1}  
.ci-lbl.done{color:#374151;text-decoration:line-through}

/MEGA CARD /  
.mega-card{border-radius:14px;padding:13px;margin-bottom:9px;border:1px solid rgba(255,255,255,.06);cursor:pointer;transition:.15s}  
.mega-card:active{opacity:.85}  
.mega-head{display:flex;align-items:center;gap:9px}  
.mega-body{margin-top:12px;padding-top:11px;border-top:1px solid rgba(255,255,255,.05)}

/LECTURE BUTTONS /  
.lec-section{margin-bottom:12px}  
.lec-section-title{font-size:10px;font-weight:700;letter-spacing:1px;color:#4b5563;margin-bottom:7px;display:flex;align-items:center;gap:6px}  
.lec-btn{display:flex;align-items:center;gap:9px;padding:11px 13px;border-radius:11px;margin-bottom:7px;width:100%;cursor:pointer;transition:.15s;text-decoration:none}  
.lec-btn:active{transform:scale(.98)}  
.lec-icon{width:34px;height:34px;border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:15px;flex-shrink:0}  
.lec-info{flex:1;text-align:left}  
.lec-title{font-size:12px;font-weight:700;margin-bottom:2px;line-height:1.3}  
.lec-desc{font-size:10px;color:#6b7280;line-height:1.4}  
.lec-arr{font-size:13px;color:#374151;flex-shrink:0}

/INPUT /  
.add-row{display:flex;gap:7px;margin-top:9px}  
.add-input{flex:1;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08)!important;border-radius:10px;padding:10px 11px;font-size:12px;color:#e2e8f0}  
.add-input::placeholder{color:#2d3748}  
.add-btn{background:rgba(99,102,241,.2);border:1px solid rgba(99,102,241,.3)!important;border-radius:10px;padding:10px 15px;font-size:15px;color:#a5b4fc;font-weight:700}

/DATE /  
.date-row{display:flex;gap:5px;overflow-x:auto;padding-bottom:3px;margin-bottom:12px;scrollbar-width:none}  
.date-row::-webkit-scrollbar{display:none}  
.date-pill{flex-shrink:0;padding:7px 9px;border-radius:11px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.03);font-size:10px;font-weight:600;color:#6b7280;cursor:pointer;text-align:center;min-width:46px;transition:.15s}  
.date-pill.on{background:rgba(99,102,241,.18);border-color:rgba(99,102,241,.38);color:#a5b4fc}  
.date-pill .dn{font-size:16px;font-weight:700;display:block;line-height:1.3}

/WRONG NOTE — 핵심 개선 /  
.wrong-mode-bar{display:flex;gap:6px;margin-bottom:12px}  
.mode-btn{flex:1;padding:10px 6px;border-radius:11px;border:1px solid rgba(255,255,255,.08)!important;background:rgba(255,255,255,.03);font-size:12px;font-weight:700;color:#6b7280;display:flex;flex-direction:column;align-items:center;gap:3px;transition:.15s}  
.mode-btn .mic{font-size:20px}  
.mode-btn.on{background:rgba(99,102,241,.18);border-color:rgba(99,102,241,.35)!important;color:#a5b4fc}

.photo-area{width:100%;border:2px dashed rgba(99,102,241,.3);border-radius:12px;padding:20px;text-align:center;cursor:pointer;background:rgba(99,102,241,.04);margin-bottom:10px;position:relative}  
.photo-area img{width:100%;border-radius:8px;display:block}  
.photo-overlay{position:absolute;inset:0;background:rgba(0,0,0,.5);border-radius:12px;display:flex;align-items:center;justify-content:center;opacity:0;transition:.2s}  
.photo-area:active .photo-overlay{opacity:1}

.canvas-wrap{position:relative;margin-bottom:10px}  
canvas{border-radius:12px;border:1px solid rgba(99,102,241,.25);display:block;touch-action:none;background:#111827;cursor:crosshair}  
.canvas-tools{display:flex;gap:6px;margin-bottom:8px;align-items:center}  
.tool-btn{width:32px;height:32px;border-radius:8px;border:1px solid rgba(255,255,255,.08)!important;display:flex;align-items:center;justify-content:center;font-size:15px;background:rgba(255,255,255,.04);color:#9ca3af;transition:.15s}  
.tool-btn.on{background:rgba(99,102,241,.2);border-color:rgba(99,102,241,.35)!important;color:#a5b4fc}  
.color-dot{width:22px;height:22px;border-radius:50%;cursor:pointer;border:2px solid transparent;transition:.15s;flex-shrink:0}  
.color-dot.on{border-color:#fff;transform:scale(1.15)}  
.size-slider{flex:1;height:4px;accent-color:#6366f1}

.memo{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07)!important;border-radius:10px;padding:11px;font-size:12px;color:#9ca3af;line-height:1.7;width:100%;min-height:70px}  
.memo:focus{border-color:rgba(99,102,241,.35)!important;color:#e2e8f0}  
.memo::placeholder{color:#2d3748}

/WRONG CARD /  
.wrong-card{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);border-radius:12px;overflow:hidden;margin-bottom:9px}  
.wrong-card-header{padding:10px 13px;display:flex;align-items:center;gap:8px;border-bottom:1px solid rgba(255,255,255,.04)}  
.wrong-card-body{padding:10px 13px}  
.del-btn{background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.18)!important;border-radius:7px;padding:4px 10px;font-size:11px;color:#fca5a5}

/MODAL /  
.modal-bg{position:fixed;inset:0;background:rgba(0,0,0,.8);display:flex;align-items:center;justify-content:center;z-index:300;padding:20px}  
.modal{background:#0f172a;border:1px solid rgba(99,102,241,.3);border-radius:20px;padding:26px;text-align:center;max-width:290px;width:100%}  
.modal-btn{background:rgba(99,102,241,.2);border:1px solid rgba(99,102,241,.28)!important;border-radius:12px;padding:12px;font-size:14px;color:#a5b4fc;font-weight:700;margin-top:14px;width:100%}

/TIMELINE /  
.tl-item{display:flex;gap:10px;padding:9px 0;border-bottom:1px solid rgba(255,255,255,.04)}  
.tl-item:last-child{border-bottom:none}  
.tl-dot{width:10px;height:10px;border-radius:50%;flex-shrink:0;margin-top:4px}  
`;

/══ 메가스터디 강의 데이터 ══ /  
const MEGA = {  
math: {  
pinpoint: [  
{emoji:"🎯",title:"[공수1 쪽집게] 현우진 기말 내신집중 패키지",desc:"행렬·경우의수 단원 직접 대비 · 기말고사 전용",url:"[https://www.megastudy.net/teacher_v2/chr/lecture_detailview.asp?CHR_CD=52477MAKE_FLG=1tec_cd=woojinmath",hot:true}](https://www.megastudy.net/teacher_v2/chr/lecture_detailview.asp?CHR_CD=52477MAKE_FLG=1tec_cd=woojinmath%22,hot:true%7D),  
{emoji:"🎯",title:"[공수1 쪽집게] 이지훈 RPM 함께 풀어보기",desc:"22개정 유형별 문제풀이 · 기말 범위 단원 선택",url:"[https://www.megastudy.net/lecmain/mainh/mainh.asp",hot:false}](https://www.megastudy.net/lecmain/mainh/mainh.asp%22,hot:false%7D),  
],  
concept:[  
{emoji:"📺",title:"메가 고1 수학 강좌 전체 검색",desc:"공통수학1 검색 → 기말 단원 선택 수강",url:"https://m.megastudy.net/mobile/smart/lecmain/mainh/unitSearch/kebooks/main.asp"},  
]  
},  
soc: {  
pinpoint:[  
{emoji:"🎯",title:"[통합사회 쪽집게] 벼락치기 특강 〈1학기 기말〉",desc:"기말고사 직전 핵심만 뽑은 특강 · 지금 바로!",url:"[http://m.megastudy.net/mobile/smart/lecture/detail/view.asp?CHR_CD=54094",hot:true}](http://m.megastudy.net/mobile/smart/lecture/detail/view.asp?CHR_CD=54094%22,hot:true%7D),  
{emoji:"🎯",title:"[통합사회 쪽집게] 이다지 6월 학평 분석",desc:"6월 학평 분석 → 기말 연계 포인트",url:"[https://m.megastudy.net/mobile/smart/main.asp?TabNo=7",hot:false}](https://m.megastudy.net/mobile/smart/main.asp?TabNo=7%22,hot:false%7D),  
],  
concept:[  
{emoji:"📺",title:"이다지도 확실한 개념완성 12",desc:"22개정 전 단원 개념 완성 강의",url:"https://www.megastudy.net/teacher_v2/chr/lecture_detailview.asp?CHR_CD=56489MAKE_FLG=tec_cd=hellohw2"},  
]  
},  
sci: {  
pinpoint:[  
{emoji:"🎯",title:"[통합과학 쪽집게] 장풍 개념통과 기말 대비",desc:"기말·중간 문제 각 3회분 수록 · 실전 직결",url:"[https://www.megastudy.net/teacher_v2/chr/lecture_detailview.asp?CHR_CD=55512tec_cd=wkdtjdrb",hot:true}](https://www.megastudy.net/teacher_v2/chr/lecture_detailview.asp?CHR_CD=55512tec_cd=wkdtjdrb%22,hot:true%7D),  
{emoji:"🎯",title:"[통합과학 쪽집게] 우마리아 시험 직전 특강",desc:"서술형 답안 만들기 · 기말 핵심 포인트",url:"[https://m.megastudy.net/teacher_v2/main.asp?tec_cd=woomaria",hot:false}](https://m.megastudy.net/teacher_v2/main.asp?tec_cd=woomaria%22,hot:false%7D),  
{emoji:"🎯",title:"[통합과학] 고1 6월 학평 핵심 포인트 분석",desc:"장풍쌤 6월 학평 총평 → 기말 연계 분석",url:"[https://m.megastudy.net/mobile/smart/main.asp?TabNo=7",hot:false}](https://m.megastudy.net/mobile/smart/main.asp?TabNo=7%22,hot:false%7D),  
],  
concept:[  
{emoji:"📺",title:"베테랑의 통합과학1 개념완성+완자",desc:"개념→완자→문제풀이 3단계",url:"https://www.megastudy.net/teacher_v2/chr/lecture_detailview.asp?CHR_CD=55974MAKE_FLG=tec_cd=kodori15th"},  
]  
},  
kor: {  
pinpoint:[  
{emoji:"🎯",title:"[국어 쪽집게] 박리나 6월 학평변형 독서/문학",desc:"학평변형으로 기말 독해·문학 직접 대비",url:"[https://www.megastudy.net/lecmain/mainh/mainh.asp",hot:true}](https://www.megastudy.net/lecmain/mainh/mainh.asp%22,hot:true%7D),  
{emoji:"🎯",title:"[국어 쪽집게] 교과서 통합 핵심 개념 정리",desc:"22개정 9종 교과서 통합 · 문법·문학·독서",url:"[https://www.megastudy.net/lecmain/mainh/mainh.asp",hot:false}](https://www.megastudy.net/lecmain/mainh/mainh.asp%22,hot:false%7D),  
],  
concept:[  
{emoji:"📺",title:"메가 고1 국어 강좌 전체 보기",desc:"국어 탭 → 공통국어 → 교과서 출판사 선택",url:"https://m.megastudy.net/mobile/smart/teacher/main.asp?domCd=1"},  
]  
},  
eng: {  
pinpoint:[  
{emoji:"🎯",title:"[영어 쪽집게] 3개년 고1 기출 유형별 풀이",desc:"기출 중심 · 어법·독해 실전 대비",url:"[https://www.megastudy.net/lecmain/mainh/mainh.asp",hot:true}](https://www.megastudy.net/lecmain/mainh/mainh.asp%22,hot:true%7D),  
{emoji:"🎯",title:"[영어 쪽집게] 1등급 START 문법+독해",desc:"22개정 문법·독해 통합 1등급 특강",url:"[https://www.megastudy.net/lecmain/mainh/mainh.asp",hot:false}](https://www.megastudy.net/lecmain/mainh/mainh.asp%22,hot:false%7D),  
],  
concept:[  
{emoji:"📺",title:"메가 고1 영어 강좌 전체 보기",desc:"영어 탭 → 공통영어 → 교과서 출판사 선택",url:"https://m.megastudy.net/mobile/smart/teacher/main.asp?domCd=5"},  
]  
},  
hist: {  
pinpoint:[  
{emoji:"🎯",title:"[한국사 쪽집게] 고1 한국사 기말 대비",desc:"메가 한국사 탭 → 기말 직전 강의",url:"[https://m.megastudy.net/mobile/smart/teacher/main.asp?domCd=9",hot:false}](https://m.megastudy.net/mobile/smart/teacher/main.asp?domCd=9%22,hot:false%7D),  
],  
concept:[]  
},  
};

const SUBJECTS=[  
{key:"math",name:"수학",emoji:"📐",color:"#f9a8d4",bg:"rgba(236,72,153,.09)",border:"rgba(236,72,153,.3)",prio:"최우선",pc:"bdg-p",range:"공통수학1: 여러가지방정식·부등식 + 행렬 + 경우의수"},  
{key:"soc",name:"통합사회",emoji:"🌏",color:"#a5b4fc",bg:"rgba(99,102,241,.08)",border:"rgba(99,102,241,.28)",prio:"수능직결",pc:"bdg-i",range:"2028수능직결! 이현제·강유정·구지은T 수업 단원"},  
{key:"sci",name:"통합과학",emoji:"🔬",color:"#7dd3fc",bg:"rgba(14,165,233,.08)",border:"rgba(14,165,233,.28)",prio:"수능직결",pc:"bdg-i",range:"2028수능직결! 윤경임·주형주·박지은T + 과탐실"},  
{key:"kor",name:"국어",emoji:"📖",color:"#fcd34d",bg:"rgba(245,158,11,.07)",border:"rgba(245,158,11,.25)",prio:"높음",pc:"bdg-a",range:"문학(시·소설·고전) + 독서 + 문법"},  
{key:"eng",name:"영어",emoji:"🌍",color:"#6ee7b7",bg:"rgba(16,185,129,.07)",border:"rgba(16,185,129,.25)",prio:"높음",pc:"bdg-g",range:"교과서 본문 + 문법(관계사·가정법) + 서술형"},  
{key:"hist",name:"한국사",emoji:"📜",color:"#fb923c",bg:"rgba(251,146,60,.07)",border:"rgba(251,146,60,.22)",prio:"보통",pc:"bdg-a",range:"김수영T·안현주T / 근현대사 중심"},  
];

const DRAW_COLORS=["#ffffff","#f9a8d4","#6ee7b7","#fcd34d","#7dd3fc","#a5b4fc","#ef4444"];  
const DAYS_KO=["일","월","화","수","목","금","토"];  
const EXAM_DATE=new Date(2026,6,2);  
const getDday=()=>{const n=new Date();n.setHours(0,0,0,0);const e=new Date(EXAM_DATE);e.setHours(0,0,0,0);return Math.ceil((e-n)/(10006060*24));};  
const getWeekDates=()=>{const d=[];const b=new Date();for(let i=0;i14;i++){const x=new Date(b);x.setDate(b.getDate()+i);d.push(x);}return d;};

const TABS=[{id:"home",ic:"🏠",l:"홈"},{id:"mega",ic:"🎬",l:"메가인강"},{id:"planner",ic:"📅",l:"플래너"},{id:"wrong",ic:"📝",l:"오답노트"},{id:"calendar",ic:"🗓",l:"일정"}];

export default function App(){  
const[tab,setTab]=useState("home");  
const[openSubj,setOpenSubj]=useState(null);  
const[openPhase,setOpenPhase]=useState(null);  
const[modal,setModal]=useState(null);  
const[selDate,setSelDate]=useState(0);  
const weekDates=getWeekDates();

// 오답노트 상태  
const[wMode,setWMode]=useState("photo"); // photo | draw | text  
const[wSubj,setWSubj]=useState("수학");  
const[wText,setWText]=useState("");  
const[wMemo,setWMemo]=useState("");  
const[wrongs,setWrongs]=useState([]);  
const[photoPreview,setPhotoPreview]=useState(null);  
const[drawColor,setDrawColor]=useState("#ffffff");  
const[brushSize,setBrushSize]=useState(3);  
const[isEraser,setIsEraser]=useState(false);

// 캔버스  
const canvasRef=useRef(null);  
const isDrawing=useRef(false);  
const lastPos=useRef(null);

// 플래너  
const[tasks,setTasks]=useState({});  
const[newTask,setNewTask]=useState("");  
const[pChecks,setPChecks]=useState({});

// 저장  
useEffect(()=>{  
(async()=>{  
try{  
const wg=await window.storage.get("wg5");if(wg)setWrongs(JSON.parse(wg.value));  
const pt=await window.storage.get("pt5");if(pt)setTasks(JSON.parse(pt.value));  
const pc=await window.storage.get("pc5");if(pc)setPChecks(JSON.parse(pc.value));  
}catch(e){}  
})();  
},[]);

const sv=async(k,v)=>{try{await window.storage.set(k,JSON.stringify(v));}catch(e){}};

// 캔버스 초기화  
useEffect(()=>{  
if(tab="wrong"wMode="draw"){  
setTimeout(()=>{  
const canvas=canvasRef.current;  
if(!canvas)return;  
const ctx=canvas.getContext("2d");  
canvas.width=canvas.offsetWidth;  
canvas.height=260;  
ctx.fillStyle="#111827";  
ctx.fillRect(0,0,canvas.width,canvas.height);  
// 모눈 그리기  
ctx.strokeStyle="rgba(99,102,241,.1)";  
ctx.lineWidth=1;  
for(let x=0;xcanvas.width;x+=20){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,canvas.height);ctx.stroke();}  
for(let y=0;ycanvas.height;y+=20){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(canvas.width,y);ctx.stroke();}  
},100);  
}  
},[tab,wMode]);

const getPos=(e,canvas)=>{  
const rect=canvas.getBoundingClientRect();  
const touch=e.touches?e.touches[0]:e;  
return{x:(touch.clientX-rect.left)(canvas.width/rect.width),y:(touch.clientY-rect.top)(canvas.height/rect.height)};  
};

const startDraw=(e)=>{  
e.preventDefault();  
const canvas=canvasRef.current;if(!canvas)return;  
isDrawing.current=true;  
lastPos.current=getPos(e,canvas);  
};  
const draw=(e)=>{  
e.preventDefault();  
if(!isDrawing.current)return;  
const canvas=canvasRef.current;if(!canvas)return;  
const ctx=canvas.getContext("2d");  
const pos=getPos(e,canvas);  
ctx.beginPath();  
ctx.strokeStyle=isEraser?"#111827":drawColor;  
ctx.lineWidth=isEraser?brushSize*4:brushSize;  
ctx.lineCap="round";ctx.lineJoin="round";  
ctx.moveTo(lastPos.current.x,lastPos.current.y);  
ctx.lineTo(pos.x,pos.y);  
ctx.stroke();  
lastPos.current=pos;  
};  
const endDraw=(e)=>{e.preventDefault();isDrawing.current=false;};

const clearCanvas=()=>{  
const canvas=canvasRef.current;if(!canvas)return;  
const ctx=canvas.getContext("2d");  
ctx.fillStyle="#111827";ctx.fillRect(0,0,canvas.width,canvas.height);  
ctx.strokeStyle="rgba(99,102,241,.1)";ctx.lineWidth=1;  
for(let x=0;xcanvas.width;x+=20){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,canvas.height);ctx.stroke();}  
for(let y=0;ycanvas.height;y+=20){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(canvas.width,y);ctx.stroke();}  
};

const handlePhoto=(e)=>{  
const file=e.target.files[0];if(!file)return;  
const reader=new FileReader();  
reader.onload=(ev)=>setPhotoPreview(ev.target.result);  
reader.readAsDataURL(file);  
};

const saveWrong=()=>{  
let content=null;  
if(wMode="photo"){  
if(!photoPreview!wMemo.trim())return;  
content={type:"photo",image:photoPreview,memo:wMemo};  
}else if(wMode="draw"){  
const canvas=canvasRef.current;  
const imgData=canvas?canvas.toDataURL("image/png"):null;  
if(!imgData!wMemo.trim())return;  
content={type:"draw",image:imgData,memo:wMemo};  
}else{  
if(!wText.trim())return;  
content={type:"text",text:wText,memo:wMemo};  
}  
const entry={subj:wSubj,content,date:new Date().toLocaleDateString("ko-KR"),id:Date.now()};  
const u=[...wrongs,entry];setWrongs(u);sv("wg5",u);  
setPhotoPreview(null);setWText("");setWMemo("");clearCanvas();  
setModal({emoji:"✅",title:"오답 저장 완료!",sub:"나중에 다시 보며 복습해요"});  
};

const delWrong=(id)=>{const u=wrongs.filter(w=>w.id!==id);setWrongs(u);sv("wg5",u);};

const dkey=weekDates[selDate].toDateString();  
const dayTasks=tasks[dkey]||[];  
const doneToday=dayTasks.filter(t=>t.done).length;  
const dday=getDday();  
const ddayColor=dday=7?"#ef4444":dday=14?"#f59e0b":"#6366f1";

const addTask=()=>{if(!newTask.trim())return;const u={...tasks,[dkey]:[...dayTasks,{text:newTask.trim(),done:false}]};setTasks(u);sv("pt5",u);setNewTask("");};  
const toggleTask=(idx)=>{const u={...tasks,[dkey]:dayTasks.map((t,i)=>i=idx?{...t,done:!t.done}:t)};setTasks(u);sv("pt5",u);if(u[dkey].every(t=>t.done)u[dkey].length>0)setModal({emoji:"🏆",title:"오늘 목표 완료!",sub:${u[dkey].length}개 달성! 잘했어요 👍});};  
const delTask=(idx)=>{const u={...tasks,[dkey]:dayTasks.filter((_,i)=>i!idx)};setTasks(u);sv("pt5",u);};  
const togglePC=(pi,ti)=>{const k=${pi}-${ti};const u={...pChecks,[k]:!pChecks[k]};setPChecks(u);sv("pc5",u);};

const openLink=(url)=>window.open(url,"_blank");

const PHASES=[  
{l:"D-25~D-21",t:"범위 확정",c:"#ef4444",bg:"rgba(239,68,68,.12)",tasks:["시험범위 선생님께 확인","모든 과목 필기 모으기","중간고사 오답 분석","메가 쪽집게 강의 저장"]},  
{l:"D-21~D-14",t:"개념 1회독",c:"#f59e0b",bg:"rgba(245,158,11,.1)",tasks:["수학 교과서 예제 전부 풀기","국어 본문 작품 정리","영어 단어 노트 완성","통합사·과 개념 지도 제작"]},  
{l:"D-14~D-7",t:"문제풀이",c:"#6366f1",bg:"rgba(99,102,241,.1)",tasks:["수학 유형별 문제집 1회","국어 기출 3~5회 풀기","영어 서술형 패턴 10개","탐구 2025 기출 오답"]},  
{l:"D-7~D-3",t:"오답 파이널",c:"#10b981",bg:"rgba(16,185,129,.09)",tasks:["틀린 문제만 재풀이","본문 암기 최종 점검","수식 계산 실수 없애기","서술형 손으로 쓰기"]},  
{l:"D-3~D-1",t:"컨디션 관리",c:"#ec4899",bg:"rgba(236,72,153,.09)",tasks:["새 공부 NO·정리만","수면 22시 취침 목표","아침 식사 꼭 먹기","공식 최종 암기"]},  
];

const subjColor=(s)=>({수학:"#f9a8d4",국어:"#fcd34d",영어:"#6ee7b7",통합사회:"#a5b4fc",통합과학:"#7dd3fc",한국사:"#fb923c"}[s]||"#9ca3af");

return(  
>

{modal(

div className="modal-bg" onClick={()=>setModal(null)}>

div className="modal" onClick={e=>e.stopPropagation()}>

div style={{fontSize:"44px",marginBottom:"10px"}}>{modal.emoji}/div>

div style={{fontSize:"17px",fontWeight:"700",color:"#c7d2fe",marginBottom:"6px"}}>{modal.title}/div>

div style={{fontSize:"12px",color:"#6b7280",lineHeight:"1.6",whiteSpace:"pre-line"}}>{modal.sub}/div>

button className="modal-btn" onClick={()=>setModal(null)}>확인 ✓/button>

/div>

/div>

)}

{/* ═══ HOME ═══ */}

{tab==="home"(

div className="page">

div className="hero">

div>

div style={{fontSize:"9px",fontWeight:"700",color:"#f87171",letterSpacing:"2px",marginBottom:"4px"}}>🔥 지금 준비할 시험/div>

div style={{fontSize:"17px",fontWeight:"900",color:"#fca5a5",lineHeight:"1.3"}}>1학기 기말고사/div>

div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"11px",color:"#6b7280",marginTop:"3px"}}>7월 2일(목) ~ 7일(화)/div>

div style={{marginTop:"8px",display:"flex",gap:"4px",flexWrap:"wrap"}}>

{["수학","국어","영어","통합사회","통합과학","한국사"].map(s=>(

span key={s} style={{padding:"2px 6px",background:"rgba(239,68,68,.15)",border:"1px solid rgba(239,68,68,.2)",borderRadius:"6px",fontSize:"9px",color:"#fca5a5"}}>{s}/span>

))}

/div>

/div>

div style={{textAlign:"center",flexShrink:0}}>

div className="dday-n" style={{color:ddayColor,textShadow:`0 0 25px ${ddayColor}60`}}>D-{dday}/div>

div className="dday-l">DAYS LEFT/div>

/div>

/div>

div className="card">

div className="ct">⚡ 야자 시간 활용법/div>

{[

{d:"월",c:"#a5b4fc",t:"~21:00",a:"수업복습 50분 + 수학예제 40분 + 통합사회 30분"},

{d:"화",c:"#6ee7b7",t:"~19:40",a:"영어 단어 완료 → 영어학원 직행"},

{d:"수",c:"#fcd34d",t:"~19:30",a:"⭐ 통합과학 60분 + 통합사회 60분 황금자습"},

{d:"목",c:"#6ee7b7",t:"~19:40",a:"한국사 30분 + 수학오답 30분 + 영어준비"},

{d:"금",c:"#f9a8d4",t:"~18:20",a:"주간 약점 총정리 → 국어학원 직행"},

].map((r,i)=>(

div key={i} style={{display:"flex",gap:"9px",padding:"8px 0",borderBottom:i4?"1px solid rgba(255,255,255,.04)":"none",alignItems:"flex-start"}}>

div style={{width:"26px",height:"26px",borderRadius:"7px",flexShrink:0,background:"rgba(99,102,241,.14)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"11px",fontWeight:"700",color:r.c}}>{r.d}/div>

div>

div style={{fontSize:"9px",color:"#4b5563",fontFamily:"'JetBrains Mono',monospace",marginBottom:"2px"}}>야자 {r.t}/div>

div style={{fontSize:"12px",color:"#d1d5db",lineHeight:"1.5"}}>{r.a}/div>

/div>

/div>

))}

/div>

div className="card">

div className="ct">🏫 학원 스케줄/div>

{[

{d:"수·토",n:"수학학원",t:"13:00~16:00",c:"#f9a8d4",tip:"끝나고 오답 즉시 정리"},

{d:"화·목",n:"영어학원",t:"21:30~23:00",c:"#6ee7b7",tip:"야자 중 단어 미리 암기"},

{d:"금",n:"국어학원",t:"19:00~22:00",c:"#fcd34d",tip:"야자 18:20 후 직행"},

{d:"일",n:"국어학원",t:"12:00~15:00",c:"#fcd34d",tip:"오전 자습 후 학원"},

].map((r,i)=>(

div key={i} style={{display:"flex",gap:"9px",padding:"8px 0",borderBottom:i3?"1px solid rgba(255,255,255,.04)":"none",alignItems:"center"}}>

div style={{width:"28px",fontSize:"11px",fontWeight:"700",color:"#6b7280",flexShrink:0,textAlign:"center"}}>{r.d}/div>

div style={{flex:1}}>

span style={{fontSize:"13px",fontWeight:"700",color:r.c}}>{r.n} /span>

span style={{fontSize:"10px",color:"#4b5563",fontFamily:"'JetBrains Mono',monospace"}}>{r.t}/span>

div style={{fontSize:"10px",color:"#6b7280",marginTop:"1px"}}>{r.tip}/div>

/div>

/div>

))}

/div>

/div>

)}

{/* ═══ 메가인강 ═══ */}

{tab==="mega"(

div className="page">

div className="ptitle">🎬 메가스터디 강의/div>

div className="psub">🎯 쪽집게 = 기말 직접 대비 · 📺 개념 = 전체 개념 강의/div>

div style={{background:"rgba(234,179,8,.08)",border:"1px solid rgba(234,179,8,.22)",borderRadius:"12px",padding:"12px 14px",marginBottom:"14px",fontSize:"12px",color:"#fde047",lineHeight:"1.7"}}>

⚡ strong>D-{dday} 남았어요!/strong>br/>

🎯 쪽집게 강의부터 먼저 — 기말 범위 딱 집어서 빠르게!br/>

버튼 터치 → 메가 앱 or 브라우저로 이동 → 로그인 후 수강

/div>

{SUBJECTS.map((s,i)=>{

const lecs=MEGA[s.key];

return(

div key={i} className="mega-card"

style={{background:s.bg,borderColor:openSubj===i?s.border:"rgba(255,255,255,.06)"}}

onClick={()=>setOpenSubj(openSubj===i?null:i)}>

div className="mega-head">

div style={{fontSize:"22px",width:"34px",textAlign:"center"}}>{s.emoji}/div>

div style={{flex:1}}>

div style={{fontSize:"14px",fontWeight:"700",color:s.color}}>{s.name}/div>

div style={{fontSize:"10px",color:"#6b7280",marginTop:"1px"}}>{s.range.substring(0,40)}.../div>

/div>

span className={`bdg ${s.pc}`} style={{flexShrink:0}}>{s.prio}/span>

span style={{color:"#374151",fontSize:"13px",marginLeft:"6px"}}>{openSubj===i?"▲":"▼"}/span>

/div>

{openSubj===i(

div className="mega-body">

{lecs.pinpoint.length>0(

div className="lec-section">

div className="lec-section-title">

span className="bdg bdg-y">🎯 쪽집게/span>

span>기말고사 직접 대비 강의/span>

/div>

{lecs.pinpoint.map((l,j)=>(

button key={j} className="lec-btn"

style={{background:l.hot?"rgba(239,68,68,.1)":"rgba(255,255,255,.03)",border:`1px solid ${l.hot?"rgba(239,68,68,.3)":"rgba(255,255,255,.06)"}!important`}}

onClick={e=>{e.stopPropagation();openLink(l.url);}}>

div className="lec-icon" style={{background:l.hot?"rgba(239,68,68,.15)":s.bg}}>{l.emoji}/div>

div className="lec-info">

div className="lec-title" style={{color:l.hot?"#fca5a5":s.color}}>{l.title}/div>

div className="lec-desc">{l.desc}/div>

/div>

div className="lec-arr">→/div>

/button>

))}

/div>

)}

{lecs.concept.length>0(

div className="lec-section">

div className="lec-section-title">

span className="bdg bdg-i">📺 개념/span>

span>전체 개념 강의/span>

/div>

{lecs.concept.map((l,j)=>(

button key={j} className="lec-btn"

style={{background:"rgba(255,255,255,.025)",border:"1px solid rgba(255,255,255,.06)!important"}}

onClick={e=>{e.stopPropagation();openLink(l.url);}}>

div className="lec-icon" style={{background:s.bg}}>{l.emoji}/div>

div className="lec-info">

div className="lec-title" style={{color:s.color}}>{l.title}/div>

div className="lec-desc">{l.desc}/div>

/div>

div className="lec-arr">→/div>

/button>

))}

/div>

)}

/div>

)}

/div>

);

})}

div style={{background:"rgba(99,102,241,.07)",border:"1px solid rgba(99,102,241,.18)",borderRadius:"12px",padding:"13px",marginTop:"4px"}}>

div style={{fontSize:"11px",fontWeight:"700",color:"#a5b4fc",marginBottom:"7px"}}>💡 인강 황금 규칙/div>

{["강의 1편 보면 → 바로 문제 5문항 풀기 (보기만 하면 소용없음)","주말 집중 수강 → 평일 인강 가능한 자제","쪽집게 강의 먼저 → 개념 강의는 모를 때만","통합사·과 쪽집게가 지금 가장 급함"].map((t,i)=>(

div key={i} style={{fontSize:"11px",color:"#6b7280",padding:"4px 0",borderBottom:i3?"1px solid rgba(255,255,255,.03)":"none"}}>{`▸ ${t}`}/div>

))}

/div>

/div>

)}

{/* ═══ 플래너 ═══ */}

{tab==="planner"(

div className="page">

div className="ptitle">📅 하루 플래너/div>

div className="psub">날짜 선택 → 목표 입력 → 완료 체크/div>

div className="date-row">

{weekDates.map((d,i)=>{

const dk=d.toDateString();const dt=tasks[dk]||[];const dn=dt.filter(t=>t.done).length;

const isE=d>=EXAM_DATEd=new Date(2026,6,7);

return(

div key={i} className={`date-pill${selDate===i?" on":""}`} style={isE?{background:"rgba(239,68,68,.14)",borderColor:"rgba(239,68,68,.28)"}:{}} onClick={()=>setSelDate(i)}>

span className="dn" style={isE?{color:"#fca5a5"}:{}}>{d.getDate()}/span>

span style={{fontSize:"9px"}}>{DAYS_KO[d.getDay()]}/span>

{dt.length>0span style={{fontSize:"8px",color:dn===dt.length?"#6ee7b7":"#6366f1",display:"block"}}>{dn}/{dt.length}/span>}

{isEspan style={{fontSize:"8px",color:"#fca5a5",display:"block"}}>시험/span>}

/div>

);

})}

/div>

div className="card">

div className="ct">

{weekDates[selDate].getMonth()+1}월 {weekDates[selDate].getDate()}일 ({DAYS_KO[weekDates[selDate].getDay()]}) 목표

{dayTasks.length>0span className={`bdg ${doneToday===dayTasks.length?"bdg-g":"bdg-i"}`} style={{marginLeft:"auto"}}>{doneToday}/{dayTasks.length}/span>}

/div>

{dayTasks.length===0?(

div style={{textAlign:"center",padding:"18px 0",color:"#374151",fontSize:"13px"}}>목표를 추가해봐요 👇/div>

):(

>

div className="prog-wrap">div className="prog-bar" style={{width:`${(doneToday/dayTasks.length)*100}%`,background:"linear-gradient(90deg,#6366f1,#a5b4fc)"}}/>/div>

{dayTasks.map((t,i)=>(

div key={i} className="ci" onClick={()=>toggleTask(i)}>

div className={`chk${t.done?" done":""}`}>{t.done?"✓":""}/div>

div style={{flex:1}}>div className={`ci-lbl${t.done?" done":""}`}>{t.text}/div>/div>

button style={{color:"#374151",fontSize:"19px",padding:"4px",flexShrink:0}} onClick={e=>{e.stopPropagation();delTask(i);}}>×/button>

/div>

))}

/>

)}

div className="add-row">

input className="add-input" placeholder="목표 입력 (예: 수학 행렬 예제 풀기)" value={newTask} onChange={e=>setNewTask(e.target.value)} onKeyDown={e=>e.key==="Enter"addTask()}/>

button className="add-btn" onClick={addTask}>+/button>

/div>

/div>

div className="card">

div className="ct">📋 기말 D-{dday} 단계 체크/div>

{PHASES.map((p,pi)=>(

div key={pi} style={{marginBottom:"6px"}}>

div style={{display:"flex",alignItems:"center",gap:"7px",padding:"8px 0",cursor:"pointer",borderBottom:"1px solid rgba(255,255,255,.04)"}} onClick={()=>setOpenPhase(openPhase===pi?null:pi)}>

span style={{padding:"2px 7px",borderRadius:"7px",fontSize:"9px",fontWeight:"700",background:p.bg,color:p.c}}>{p.l}/span>

span style={{fontSize:"12px",fontWeight:"700",color:"#e2e8f0",flex:1}}>{p.t}/span>

span style={{fontSize:"10px",color:"#4b5563"}}>{p.tasks.filter((_,ti)=>pChecks[`${pi}-${ti}`]).length}/{p.tasks.length}/span>

span style={{color:"#374151",fontSize:"12px"}}>{openPhase===pi?"▲":"▼"}/span>

/div>

{openPhase===pip.tasks.map((t,ti)=>{

const k=`${pi}-${ti}`;

return(

div key={ti} className="ci" onClick={()=>togglePC(pi,ti)}>

div className={`chk${pChecks[k]?" done":""}`}>{pChecks[k]?"✓":""}/div>

div className={`ci-lbl${pChecks[k]?" done":""}`}>{t}/div>

/div>

);

})}

/div>

))}

/div>

/div>

)}

{/* ═══ 오답노트 ═══ */}

{tab==="wrong"(

div className="page">

div className="ptitle">📝 오답 노트/div>

div className="psub">사진 찍기 · 손으로 그리기 · 글로 쓰기 — {wrongs.length}개 저장됨/div>

{/* 과목 선택 */}

div style={{display:"flex",gap:"5px",marginBottom:"12px",flexWrap:"wrap"}}>

{["수학","국어","영어","통합사회","통합과학","한국사"].map(s=>(

button key={s} onClick={()=>setWSubj(s)}

style={{padding:"7px 12px",borderRadius:"20px",border:"1px solid",fontSize:"12px",fontWeight:"700",transition:".15s",

background:wSubj===s?`${subjColor(s)}22`:"rgba(255,255,255,.03)",

borderColor:wSubj===s?subjColor(s):"rgba(255,255,255,.08)",

color:wSubj===s?subjColor(s):"#6b7280"}}>

{s}

/button>

))}

/div>

{/* 입력 방식 선택 */}

div className="wrong-mode-bar">

{[

{id:"photo",ic:"📷",l:"사진 찍기"},

{id:"draw",ic:"✏️",l:"손으로 그리기"},

{id:"text",ic:"⌨️",l:"글로 쓰기"},

].map(m=>(

button key={m.id} className={`mode-btn${wMode===m.id?" on":""}`} onClick={()=>setWMode(m.id)}>

span className="mic">{m.ic}/span>

span>{m.l}/span>

/button>

))}

/div>

{/* 📷 사진 모드 */}

{wMode==="photo"(

div className="card">

div className="ct">📷 사진으로 오답 기록/div>

div style={{fontSize:"11px",color:"#4b5563",marginBottom:"10px",lineHeight:"1.6"}}>

수학 풀이과정, 오답 문제, 선생님 판서, 교과서 등br/>

어떤 사진이든 찍어서 저장하면 돼요

/div>

label style={{display:"block",cursor:"pointer"}}>

div className="photo-area">

{photoPreview?(

>

img src={photoPreview} alt="오답사진"/>

div className="photo-overlay">span style={{color:"#fff",fontSize:"13px",fontWeight:"700"}}>사진 변경/span>/div>

/>

):(

div style={{padding:"20px 0"}}>

div style={{fontSize:"36px",marginBottom:"8px"}}>📷/div>

div style={{fontSize:"13px",fontWeight:"700",color:"#a5b4fc",marginBottom:"4px"}}>터치해서 사진 찍기/div>

div style={{fontSize:"11px",color:"#374151"}}>카메라로 찍거나 갤러리에서 선택/div>

/div>

)}

/div>

input type="file" accept="image/*" capture="environment" onChange={handlePhoto} style={{display:"none"}}/>

/label>

div style={{fontSize:"11px",fontWeight:"700",color:"#4b5563",margin:"10px 0 6px"}}>✏️ 메모 추가 (선택)/div>

textarea className="memo" rows={2} placeholder="틀린 이유, 핵심 포인트 한 줄 메모..." value={wMemo} onChange={e=>setWMemo(e.target.value)}/>

button onClick={saveWrong} style={{width:"100%",marginTop:"10px",padding:"13px",borderRadius:"12px",background:"rgba(99,102,241,.2)",border:"1px solid rgba(99,102,241,.3)",color:"#a5b4fc",fontSize:"14px",fontWeight:"700"}}>저장/button>

/div>

)}

{/* ✏️ 손글씨 드로잉 모드 */}

{wMode==="draw"(

div className="card">

div className="ct">✏️ 손으로 직접 쓰기/div>

div style={{fontSize:"11px",color:"#4b5563",marginBottom:"10px",lineHeight:"1.6"}}>

수학 수식, 그래프, 화학식, 영어 문장 구조 등br/>

손가락으로 자유롭게 그려요

/div>

div className="canvas-tools">

div style={{display:"flex",gap:"4px"}}>

{DRAW_COLORS.map(c=>(

div key={c} className={`color-dot${drawColor===c!isEraser?" on":""}`}

style={{background:c,width:"22px",height:"22px"}}

onClick={()=>{setDrawColor(c);setIsEraser(false);}}/>

))}

/div>

button className={`tool-btn${isEraser?" on":""}`} onClick={()=>setIsEraser(!isEraser)} title="지우개">🧹/button>

button className="tool-btn" onClick={clearCanvas} title="전체 지우기">🗑/button>

/div>

div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"8px"}}>

span style={{fontSize:"10px",color:"#4b5563",flexShrink:0}}>굵기/span>

input type="range" min="1" max="12" value={brushSize} onChange={e=>setBrushSize(Number(e.target.value))} className="size-slider" style={{flex:1}}/>

span style={{fontSize:"10px",color:"#6366f1",width:"16px"}}>{brushSize}/span>

/div>

div className="canvas-wrap">

canvas ref={canvasRef} style={{width:"100%",touchAction:"none"}}

onMouseDown={startDraw} onMouseMove={draw} onMouseUp={endDraw} onMouseLeave={endDraw}

onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={endDraw}/>

/div>

div style={{fontSize:"11px",fontWeight:"700",color:"#4b5563",margin:"8px 0 5px"}}>✏️ 메모 추가 (선택)/div>

textarea className="memo" rows={2} placeholder="틀린 이유, 핵심 포인트..." value={wMemo} onChange={e=>setWMemo(e.target.value)}/>

button onClick={saveWrong} style={{width:"100%",marginTop:"10px",padding:"13px",borderRadius:"12px",background:"rgba(99,102,241,.2)",border:"1px solid rgba(99,102,241,.3)",color:"#a5b4fc",fontSize:"14px",fontWeight:"700"}}>저장/button>

/div>

)}

{/* ⌨️ 텍스트 모드 */}

{wMode==="text"(

div className="card">

div className="ct">⌨️ 글로 기록하기/div>

div style={{fontSize:"11px",color:"#4b5563",marginBottom:"10px",lineHeight:"1.6"}}>

국어 본문 틀린 선지, 영어 어법 포인트,br/>

개념 헷갈린 것 등 간단히 텍스트로 기록

/div>

textarea className="memo" rows={5} placeholder={`${wSubj} 틀린 내용 기록\n\n예) 수학: 행렬 곱셈에서 AB≠BA 인 걸 몰랐음\n예) 영어: 관계대명사 that/which 차이 헷갈림\n예) 통합사회: 사회계약론 로크·루소·홉스 구분 안 됨`}

value={wText} onChange={e=>setWText(e.target.value)} style={{minHeight:"120px"}}/>

button onClick={saveWrong} style={{width:"100%",marginTop:"10px",padding:"13px",borderRadius:"12px",background:"rgba(99,102,241,.2)",border:"1px solid rgba(99,102,241,.3)",color:"#a5b4fc",fontSize:"14px",fontWeight:"700"}}>저장/button>

/div>

)}

{/* 저장된 오답 목록 */}

{wrongs.length>0(

>

div style={{fontSize:"13px",fontWeight:"700",color:"#c7d2fe",margin:"16px 0 10px",display:"flex",alignItems:"center",gap:"6px"}}>

📚 저장된 오답

span className="bdg bdg-i">{wrongs.length}개/span>

/div>

{[...wrongs].reverse().map((w,i)=>(

div key={w.id||i} className="wrong-card">

div className="wrong-card-header">

span style={{fontSize:"10px",fontWeight:"700",color:subjColor(w.subj)}}>{w.subj}/span>

span style={{fontSize:"9px",color:"#4b5563",marginLeft:"auto"}}>{w.date}/span>

span style={{fontSize:"12px",marginLeft:"6px"}}>{w.content.type==="photo"?"📷":w.content.type==="draw"?"✏️":"⌨️"}/span>

button className="del-btn" style={{marginLeft:"8px",marginTop:"0"}} onClick={()=>delWrong(w.id)}>삭제/button>

/div>

div className="wrong-card-body">

{(w.content.type==="photo"||w.content.type==="draw")w.content.image(

img src={w.content.image} alt="오답" style={{width:"100%",borderRadius:"8px",marginBottom:"6px"}}/>

)}

{w.content.type==="text"(

div style={{fontSize:"12px",color:"#d1d5db",lineHeight:"1.6",whiteSpace:"pre-wrap"}}>{w.content.text}/div>

)}

{w.content.memo(

div style={{fontSize:"11px",color:"#6b7280",marginTop:"6px",padding:"7px 10px",background:"rgba(99,102,241,.07)",borderRadius:"8px"}}>

💬 {w.content.memo}

/div>

)}

/div>

/div>

))}

/>

)}

/div>

)}

{/* ═══ 일정 ═══ */}

{tab==="calendar"(

div className="page">

div className="ptitle">🗓 연간 시험 일정/div>

div className="psub">금정여고 2026학년도 공식 일정/div>

div style={{background:"rgba(239,68,68,.12)",border:"1px solid rgba(239,68,68,.3)",borderRadius:"16px",padding:"16px",marginBottom:"12px"}}>

div style={{fontSize:"10px",color:"#f87171",fontWeight:"700",marginBottom:"3px",letterSpacing:"1px"}}>🔥 지금 준비할 시험/div>

div style={{fontSize:"20px",fontWeight:"900",color:"#fca5a5"}}>1학기 기말고사/div>

div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"12px",color:"#6b7280",marginTop:"3px"}}>

7월 2일(목) ~ 7월 7일(화) · span style={{color:ddayColor}}>D-{dday}/span>

/div>

/div>

div className="card">

div className="ct">📅 2026 전체 일정/div>

{[

{date:"3.24(화)",title:"3월 전국학력평가",dot:"#374151",done:true,note:"전학년 · ✓ 완료"},

{date:"4.28~5.1",title:"1학기 중간고사",dot:"#374151",done:true,note:"전학년 · ✓ 완료"},

{date:"6.4(목)",title:"6월 학력평가",dot:"#374151",done:true,note:"1·2학년 · ✓ 완료"},

{date:"7.2~7.7",title:"1학기 기말고사",dot:"#ef4444",hot:true,note:`전학년 · D-${dday}`},

{date:"7.24~8.17",title:"여름방학",dot:"#10b981",note:"수학 집중 선행"},

{date:"9.2(수)",title:"9월 학력평가",dot:"#f59e0b",note:"1·2학년"},

{date:"10.13~16",title:"2학기 중간고사",dot:"#ec4899",note:"전학년"},

{date:"10.20(화)",title:"10월 학력평가",dot:"#f59e0b",note:"전학년"},

{date:"12.15~18",title:"2학기 기말고사",dot:"#ec4899",note:"1·2학년"},

{date:"12.31~1.31",title:"겨울방학",dot:"#10b981",note:"고2 준비"},

].map((item,i)=>(

div key={i} className="tl-item">

div className="tl-dot" style={{background:item.dot,boxShadow:item.hot?`0 0 8px ${item.dot}`:""}}/>

div>

div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"9px",color:"#4b5563",marginBottom:"2px"}}>{item.date}/div>

div style={{fontSize:"13px",fontWeight:"700",color:item.done?"#374151":item.hot?"#fca5a5":"#e2e8f0",textDecoration:item.done?"line-through":""}}>

{item.title}{item.hotspan style={{marginLeft:"6px",fontSize:"10px",color:"#ef4444"}}>← 지금!/span>}

/div>

div style={{fontSize:"10px",color:"#6b7280",marginTop:"1px"}}>{item.note}/div>

/div>

/div>

))}

/div>

/div>

)}

nav className="nav">

{TABS.map(n=>(

button key={n.id} className={`nav-btn${tab===n.id?" on":""}`} onClick={()=>setTab(n.id)}>

span className="ic">{n.ic}/span>{n.l}

/button>

))}

/nav>

/>

);  
}

처음에는 더 완벽하게 만들고 싶어서 기능을 계속 붙였다.  
그러나 마지막에 딸아이에게 확인을 받는 과정에서 아이가 말했다.

“엄마, 숨을 못 쉬겠어.”

그 말을 듣고 이 OS의 방향이 바뀌었다.  
공부를 더 시키는 OS가 아니라, 오늘 진짜 해야 할 것 3개만 남겨주는 OS가 되어야 했다.

최종 구현 결과물

최종 구현한 결과물은 여고 1학년 학생을 위한 학습 루틴 OS이다.

핵심 기능은 다음과 같다.

오늘 할 일 3가지

모든 공부를 한꺼번에 보여주는 것이 아니라, 오늘 꼭 해야 할 것 3개만 보여준다.

학교 숙제와 시험범위를 최우선으로 배치한다.

D-day 기반 시험 관리

기말고사, 여름방학, 9월 학력평가, 2학기 중간·기말고사 등 주요 일정을 타임라인으로 관리한다.

시험이 가까워질수록 내신 중심으로 전환되도록 설계했다.

학원·야자·이동시간 반영

학원 시간만 넣는 것이 아니라, 야자 끝나는 시간과 학원 이동 시간을 함께 고려했다.

실제로 공부 가능한 시간을 계산해야 무리한 계획이 줄어든다.

강의 자료 통합

메가스터디, EBSi, 기말 대비 강의, 과목별 자료 링크를 한곳에 모았다.

국어, 수학, 영어, 통합사회, 통합과학, 한국사 과목별로 볼 수 있게 구성했다.

오답노트

처음에는 타이핑 입력 중심으로 생각했다.

하지만 실제 학생 입장에서는 매번 타이핑하는 것이 부담이 될 수 있다고 판단했다.

그래서 사진, 손그림, 텍스트 방식으로 오답을 남길 수 있게 바꿨다.

틀린 문제지, 선생님 판서, 교과서, 수학 풀이를 바로 찍어 저장하는 방식이다.

습관 트래커

학교 수업, 학원 복습, 인강 수강, 자습 등을 나누어 체크할 수 있게 했다.

공부를 많이 했는지가 아니라, 공부 루틴이 이어지고 있는지를 확인한다.

자기주도 학습 흐름

공부 전에는 “내가 모르는 것 1줄”을 적는다.

공부 후에는 “30초 셀프 설명”을 한다.

설명이 되면 아는 것이고, 설명이 안 되면 오답노트로 보내는 구조다.

하루 1줄 회고와 수면 체크

하루가 끝나면 오늘 한 것, 막힌 것, 내일 할 것을 짧게 남긴다.

공부량보다 수면과 컨디션이 먼저 무너지지 않도록 수면 체크를 함께 넣었다.

과정 (타임라인별 + 삽질)

1단계: 문제 정의

처음에는 “딸아이 공부 자료를 한곳에 모아야겠다”에서 출발했다.

고1이 되면서 공부량이 갑자기 많아졌다.  
학교 수업, 수행평가, 시험범위, 학원 숙제, 인강, 야자, 모의고사까지 모두 따로 움직이고 있었다.

엄마 입장에서는 아이가 열심히 하고 싶은 마음은 있는데, 어디서부터 해야 할지 모르는 것처럼 보였다.  
그래서 공부의 흐름을 한눈에 볼 수 있는 OS가 필요하다고 생각했다.

![(null)](file:///C:\Users\user\AppData\Local\Temp\DRW000092e86b43.gif)

2단계: 자료 수집

학교 시간표, 학원 시간표, 야자 끝나는 시간, 시험 일정, 인강 사이트, 과목별 시험범위 자료를 모았다.

이 단계에서 알게 된 것은 단순했다.

“공부할 게 너무 많다.”

국어, 영어, 수학만 있는 것이 아니었다.  
통합사회, 통합과학, 한국사, 수행평가까지 관리해야 했다.

그래서 처음 OS는 최대한 많은 자료를 담는 방향으로 갔다.

![(null)](file:///C:\Users\user\AppData\Local\Temp\DRW000092e86b45.gif)

3단계: 1차 구현 — 완전판 학습 OS

처음 만든 버전은 기능이 많았다.

D-day

하루 플래너

과목별 강의 링크

메가스터디 자료

EBSi 자료

습관 트래커

오답노트

과목별 시험 키워드

공부 체크리스트

구현하면서는 뿌듯했다.  
흩어져 있던 자료가 한 화면에 모였기 때문이다.

하지만 여기서 첫 번째 삽질이 있었다.

자료를 많이 모으면 아이가 편할 거라고 생각했다.  
그런데 자료가 많아질수록 아이 입장에서는 해야 할 일이 더 많아 보였다.

4단계: 오답노트 삽질

처음에는 오답노트를 텍스트로 입력하는 방식으로 생각했다.

하지만 실제로 생각해보니, 시험기간에 아이가 틀린 문제를 하나하나 타이핑하는 것은 너무 번거로운 일이었다.  
공부 습관을 만들기 전에 입력 습관에서 막힐 수 있었다.

그래서 오답노트 방향을 바꿨다.

“타이핑하지 말고, 찍자.”

사진으로 찍고, 필요하면 한 줄만 메모하게 했다.  
수학 풀이, 문제지, 판서, 교과서를 바로 저장할 수 있게 했다.

여기서 느낀 점은 분명했다.

좋은 OS는 기록을 많이 요구하는 시스템이 아니라, 기록을 쉽게 시작하게 만드는 시스템이다.

![(null)](file:///C:\Users\user\AppData\Local\Temp\DRW000092e86b47.gif)

5단계: 계속 기능을 붙이는 삽질

구현을 하다 보니 욕심이 생겼다.

“이것도 넣으면 좋겠다.”  
“이 사이트도 연결하면 좋겠다.”  
“과목별 자료도 있어야겠다.”  
“습관도 체크하면 좋겠다.”  
“선생님 팁도 넣으면 좋겠다.”  
“이동시간도 넣어야겠다.”

기능은 점점 좋아졌지만, 동시에 화면은 점점 복잡해졌다.

엄마 입장에서는 완성도가 올라간 것처럼 보였지만, 정작 사용할 아이 입장에서는 부담이 될 수 있었다.

이 단계에서 가장 큰 삽질은 이것이었다.

내가 필요하다고 생각한 기능과, 아이가 지금 당장 받아들일 수 있는 기능은 다르다.

6단계: 사용자 피드백 — “엄마, 숨을 못 쉬겠어”

마지막 컨펌을 딸아이에게 받았다.

그런데 아이의 반응은 예상과 달랐다.

“엄마, 숨을 못 쉬겠어.”

이 말이 이번 프로젝트의 가장 중요한 피드백이었다.

그때 깨달았다.

나는 아이를 돕고 싶어서 OS를 만들었지만, 아이 입장에서는 또 하나의 해야 할 일이 생긴 것처럼 느껴질 수 있었다.

학원 숙제도 있고, 학교 숙제도 있고, 이동시간도 있고, 어제는 쉬어야 할 수도 있다.  
그런데 OS가 모든 것을 다 보여주면, 아이는 정리되는 것이 아니라 압도될 수 있다.

![(null)](file:///C:\Users\user\AppData\Local\Temp\DRW000092e86b49.gif)

7단계: 최종 리디자인 — 숨 쉬는 OS

그래서 최종 방향을 바꿨다.

완벽한 OS가 아니라 숨 쉬는 OS로 바꿨다.

핵심은 줄이는 것이었다.

오늘 할 것 3개만 보여주기

학교 숙제를 최우선으로 두기

학원 이동시간을 반영하기

인강은 보조로만 두기

오답노트는 사진으로 쉽게 남기기

완료한 항목은 흐려지게 하기

카드는 접어두고 필요할 때만 펼치기

하루 끝에는 1줄만 회고하기

수면 체크를 공부 루틴 안에 넣기

이제 OS의 목적은 “공부를 더 시키는 것”이 아니라  
공부할 수 있는 상태를 만들어주는 것이 되었다.

공유할만한 인사이트

1. 진짜 사용자는 엄마가 아니라 아이였다

처음에는 엄마의 불안을 정리하기 위해 OS를 만들었다.  
하지만 실제로 사용하는 사람은 딸아이였다.

그래서 엄마가 보기 좋은 시스템과 아이가 매일 쓰고 싶은 시스템은 달라야 했다.

![(null)](file:///C:\Users\user\AppData\Local\Temp\DRW000092e86b4b.gif)

2. 자동화는 많이 보여주는 것이 아니라 덜 보여주는 것이다

처음에는 모든 자료를 모으는 것이 자동화라고 생각했다.  
하지만 이번에 느낀 자동화의 핵심은 다르게 정리되었다.

자동화란,  
해야 할 것을 전부 보여주는 것이 아니라  
지금 안 해도 되는 것을 숨겨주는 것이다.

![(null)](file:///C:\Users\user\AppData\Local\Temp\DRW000092e86b4d.gif)

3. 공부 OS에는 이동시간과 감정이 들어가야 한다

시간표에는 학원 시간만 적혀 있지만, 실제 아이의 하루에는 이동시간, 저녁 먹는 시간, 쉬는 시간, 피곤함이 있다.

이걸 고려하지 않은 계획표는 현실에서 무너진다.

그래서 공부 OS에는 공부시간뿐 아니라  
이동시간, 수면, 컨디션, 부담감도 들어가야 한다.

![(null)](file:///C:\Users\user\AppData\Local\Temp\DRW000092e86b4f.gif)

4. 오답노트는 예쁘게 쓰는 것보다 쉽게 남기는 것이 먼저다

오답노트를 타이핑으로 입력하게 하면 시작하기 어렵다.  
하지만 사진으로 찍게 하면 훨씬 쉽게 시작할 수 있다.

기록 습관은 완벽함보다 진입장벽이 낮아야 한다.

![(null)](file:///C:\Users\user\AppData\Local\Temp\DRW000092e86b51.gif)

5. “오늘 3개만”이 아이를 살릴 수 있다

아이에게 필요한 것은 수십 개의 체크리스트가 아니었다.  
오늘 정말 해야 할 것 3개였다.

학교 숙제 하나, 시험범위 하나, 오답 하나.  
이 정도가 아이가 숨 쉬면서 지속할 수 있는 단위였다.

![(null)](file:///C:\Users\user\AppData\Local\Temp\DRW000092e86b53.gif)

6. OS는 완성물이 아니라 대화의 시작점이다

이번 미션을 하면서 가장 크게 배운 것은, OS는 한 번에 완성되는 것이 아니라는 점이다.

아이의 행동패턴을 보고, 실제로 써보고, 불편한 점을 듣고, 다시 덜어내야 한다.

결국 이 프로젝트는 공부 앱을 만든 것이 아니라,  
엄마와 딸이 “어떻게 공부하면 덜 힘들고 더 오래 갈 수 있을까”를 대화하게 만든 과정이었다.

![(null)](file:///C:\Users\user\AppData\Local\Temp\DRW000092e86b55.gif)

마무리

이번 미션의 최종 결론은 이것이다.

공부 OS는 아이를 더 몰아붙이는 시스템이 아니라, 아이가 숨 쉴 수 있도록 공부를 정리해주는 시스템이어야 한다.

처음에는 더 많이 넣으려고 했다.  
하지만 마지막에는 더 많이 덜어내야 한다는 것을 배웠다.

앞으로 이 OS는 완성된 결과물이 아니라, 딸아이와 함께 조정해가는 성장형 시스템으로 가져가려고 한다.

오늘 할 것 3개.  
오답은 사진 한 장.  
하루 끝에는 1줄 회고.  
그리고 잠은 꼭 자는 것.

이것이 이번 5주차 미션에서 얻은 가장 현실적인 학습 OS의 핵심이다.

import { useState, useEffect, useRef } from "react";

/══════════════════════════════════════════════════════  
금정여고 1-7반 · 완전판 학습 OS v3  
① 메가스터디 쪽집게 + 자료파일 정리  
② EBSi 고1 기말 + 교과서 링크 완비  
③ 습관 트래커 (학교·학원·인강·자습 분리)  
④ 오답노트 (사진·손그림·텍스트)  
⑤ 하루 플래너 + D-day  
══════════════════════════════════════════════════════ /

const G = `  
@import url('[https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;900family=JetBrains+Mono:wght@400;700display=swap')](https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;900family=JetBrains+Mono:wght@400;700display=swap\));  
*{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent}  
html,body{font-family:'Noto Sans KR',sans-serif;background:#080c18;color:#e8ecf4;-webkit-font-smoothing:antialiased;max-width:480px;margin:0 auto;min-height:100vh}  
button{font-family:'Noto Sans KR',sans-serif;cursor:pointer;border:none;background:none}  
textarea,input{font-family:'Noto Sans KR',sans-serif;outline:none;border:none}

/NAV /  
.nav{position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:480px;background:rgba(6,10,20,.98);border-top:1px solid rgba(255,255,255,.07);display:flex;z-index:200;padding:5px 0 10px}  
.nb{flex:1;padding:6px 2px 2px;display:flex;flex-direction:column;align-items:center;gap:2px;color:#374151;font-size:8.5px;font-weight:700;letter-spacing:.1px;transition:.15s}  
.nb .ic{font-size:19px;line-height:1.3}  
.nb.on{color:#6366f1}

.page{padding:13px 13px 90px;min-height:100vh}  
.ptitle{font-size:18px;font-weight:900;color:#e2e8f0;margin-bottom:2px}  
.psub{font-size:11px;color:#374151;margin-bottom:13px;line-height:1.5}

/CARD /  
.card{background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.065);border-radius:15px;padding:14px;margin-bottom:10px}  
.ct{font-size:13px;font-weight:700;color:#c7d2fe;margin-bottom:10px;display:flex;align-items:center;gap:7px}

/HERO /  
.hero{background:linear-gradient(135deg,rgba(239,68,68,.17),rgba(220,38,38,.05));border:1px solid rgba(239,68,68,.33);border-radius:17px;padding:17px;margin-bottom:12px;display:flex;align-items:center;justify-content:space-between;gap:8px}  
.dday-n{font-family:'JetBrains Mono',monospace;font-size:52px;font-weight:700;line-height:1;text-shadow:0 0 26px rgba(239,68,68,.5)}  
.dday-l{font-size:9px;color:#6b7280;letter-spacing:2px}

/PROGRESS /  
.pw{background:rgba(255,255,255,.06);border-radius:5px;height:7px;overflow:hidden;margin:6px 0}  
.pb{height:100%;border-radius:5px;transition:width .5s cubic-bezier(.4,0,.2,1)}

/BADGE /  
.b{display:inline-flex;align-items:center;padding:2px 8px;border-radius:20px;font-size:10px;font-weight:700}  
.br{background:rgba(239,68,68,.15);color:#fca5a5;border:1px solid rgba(239,68,68,.25)}  
.ba{background:rgba(245,158,11,.12);color:#fcd34d;border:1px solid rgba(245,158,11,.2)}  
.bg{background:rgba(16,185,129,.12);color:#6ee7b7;border:1px solid rgba(16,185,129,.2)}  
.bi{background:rgba(99,102,241,.15);color:#a5b4fc;border:1px solid rgba(99,102,241,.25)}  
.bp{background:rgba(236,72,153,.12);color:#f9a8d4;border:1px solid rgba(236,72,153,.22)}  
.by{background:rgba(234,179,8,.12);color:#fde047;border:1px solid rgba(234,179,8,.2)}  
.bs{background:rgba(14,165,233,.12);color:#7dd3fc;border:1px solid rgba(14,165,233,.2)}

/CHECK ITEM /  
.ci{display:flex;align-items:flex-start;gap:10px;padding:9px 0;border-bottom:1px solid rgba(255,255,255,.04);cursor:pointer}  
.ci:last-child{border-bottom:none}  
.chk{width:22px;height:22px;border-radius:6px;flex-shrink:0;margin-top:1px;display:flex;align-items:center;justify-content:center;font-size:12px;border:2px solid rgba(99,102,241,.35);transition:.2s;color:#6366f1}  
.chk.done{background:#6366f1;border-color:#6366f1;color:#fff}  
.cl{font-size:12px;color:#d1d5db;line-height:1.5;flex:1}  
.cl.done{color:#374151;text-decoration:line-through}

/RESOURCE LINK BTN /  
.rl{display:flex;align-items:center;gap:9px;padding:11px 12px;border-radius:11px;margin-bottom:7px;width:100%;cursor:pointer;transition:.15s;text-decoration:none}  
.rl:active{transform:scale(.98)}  
.rl-icon{width:34px;height:34px;border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:15px;flex-shrink:0}  
.rl-info{flex:1;text-align:left}  
.rl-t{font-size:12px;font-weight:700;margin-bottom:2px;line-height:1.3}  
.rl-d{font-size:10px;color:#6b7280;line-height:1.4}  
.rl-src{font-size:9px;font-weight:700;padding:2px 6px;border-radius:5px;margin-left:auto;flex-shrink:0}

/SECTION TITLE /  
.stt{font-size:10px;font-weight:700;letter-spacing:1px;color:#4b5563;margin:10px 0 7px;display:flex;align-items:center;gap:6px}

/HABIT TRACKER /  
.habit-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:3px;margin-bottom:6px}  
.hday{text-align:center;font-size:9px;color:#4b5563;padding:2px 0}  
.hcell{aspect-ratio:1;border-radius:5px;display:flex;align-items:center;justify-content:center;font-size:10px;cursor:pointer;transition:.15s;border:1px solid rgba(255,255,255,.04)}  
.hcell:active{transform:scale(.9)}  
.hc-empty{background:rgba(255,255,255,.04)}  
.hc-done{background:rgba(16,185,129,.3);border-color:rgba(16,185,129,.4)}  
.hc-skip{background:rgba(239,68,68,.18);border-color:rgba(239,68,68,.25)}

/HABIT BLOCK /  
.habit-block{background:rgba(255,255,255,.025);border:1px solid rgba(255,255,255,.06);border-radius:13px;padding:13px;margin-bottom:9px}  
.hb-head{display:flex;align-items:center;gap:9px;margin-bottom:10px;cursor:pointer}  
.hb-emoji{font-size:20px;width:32px;text-align:center;flex-shrink:0}  
.hb-title{font-size:13px;font-weight:700;color:#e2e8f0;flex:1}  
.hb-streak{font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:700}  
.hb-today{width:100%;padding:12px;border-radius:11px;font-size:13px;font-weight:700;transition:.15s;margin-bottom:8px}

/DATE /  
.date-row{display:flex;gap:5px;overflow-x:auto;padding-bottom:3px;margin-bottom:11px;scrollbar-width:none}  
.date-row::-webkit-scrollbar{display:none}  
.dp{flex-shrink:0;padding:6px 8px;border-radius:10px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.03);font-size:10px;font-weight:600;color:#6b7280;cursor:pointer;text-align:center;min-width:44px;transition:.15s}  
.dp.on{background:rgba(99,102,241,.18);border-color:rgba(99,102,241,.38);color:#a5b4fc}  
.dp .dn{font-size:15px;font-weight:700;display:block;line-height:1.3}

/WRONG NOTE /  
.mode-bar{display:flex;gap:5px;margin-bottom:11px}  
.mb{flex:1;padding:9px 4px;border-radius:10px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.03);font-size:11px;font-weight:700;color:#6b7280;display:flex;flex-direction:column;align-items:center;gap:2px;transition:.15s}  
.mb .mic{font-size:18px}  
.mb.on{background:rgba(99,102,241,.18);border-color:rgba(99,102,241,.35);color:#a5b4fc}

.photo-area{width:100%;border:2px dashed rgba(99,102,241,.3);border-radius:12px;padding:18px;text-align:center;cursor:pointer;background:rgba(99,102,241,.04);margin-bottom:9px;position:relative}  
.photo-area img{width:100%;border-radius:8px;display:block}  
canvas{border-radius:11px;border:1px solid rgba(99,102,241,.22);display:block;touch-action:none;background:#111827}  
.color-dot{width:20px;height:20px;border-radius:50%;cursor:pointer;border:2px solid transparent;transition:.15s}  
.color-dot.on{border-color:#fff;transform:scale(1.15)}

.memo{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);border-radius:10px;padding:10px;font-size:12px;color:#9ca3af;line-height:1.7;width:100%;min-height:68px}  
.memo:focus{border-color:rgba(99,102,241,.35);color:#e2e8f0}  
.memo::placeholder{color:#2d3748}  
.add-row{display:flex;gap:6px;margin-top:8px}  
.ai{flex:1;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:10px;padding:9px 11px;font-size:12px;color:#e2e8f0}  
.ai::placeholder{color:#2d3748}  
.ab{background:rgba(99,102,241,.2);border:1px solid rgba(99,102,241,.3);border-radius:10px;padding:9px 14px;font-size:15px;color:#a5b4fc;font-weight:700}

.wc{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);border-radius:11px;overflow:hidden;margin-bottom:8px}  
.wch{padding:9px 12px;display:flex;align-items:center;gap:7px;border-bottom:1px solid rgba(255,255,255,.04)}  
.wcb{padding:9px 12px}

/TL /  
.tli{display:flex;gap:10px;padding:8px 0;border-bottom:1px solid rgba(255,255,255,.04)}  
.tli:last-child{border-bottom:none}  
.tld{width:9px;height:9px;border-radius:50%;flex-shrink:0;margin-top:4px}

/MODAL /  
.mbg{position:fixed;inset:0;background:rgba(0,0,0,.8);display:flex;align-items:center;justify-content:center;z-index:300;padding:20px}  
.mm{background:#0f172a;border:1px solid rgba(99,102,241,.3);border-radius:19px;padding:25px;text-align:center;max-width:280px;width:100%}  
.mmb{background:rgba(99,102,241,.2);border:1px solid rgba(99,102,241,.28);border-radius:12px;padding:12px;font-size:14px;color:#a5b4fc;font-weight:700;margin-top:13px;width:100%}  
`;

/══════════════════════════════════════════════  
데이터: 메가스터디 쪽집게 + 자료파일  
══════════════════════════════════════════════ /  
const MEGA_DATA = {  
math:[  
{type:"pinpoint",hot:true,emoji:"🎯",color:"#fca5a5",bg:"rgba(239,68,68,.1)",border:"rgba(239,68,68,.28)",  
title:"[수학 쪽집게] 현우진 기말 내신집중 패키지",desc:"공수1 기말 전 단원 · 행렬·경우의수 완전 대비",  
url:"[https://www.megastudy.net/teacher_v2/chr/lecture_detailview.asp?CHR_CD=52477MAKE_FLG=1tec_cd=woojinmath"}](https://www.megastudy.net/teacher_v2/chr/lecture_detailview.asp?CHR_CD=52477MAKE_FLG=1tec_cd=woojinmath%22%7D),  
{type:"pinpoint",hot:false,emoji:"🎯",color:"#f9a8d4",bg:"rgba(236,72,153,.09)",border:"rgba(236,72,153,.2)",  
title:"[수학 쪽집게] 이지훈 RPM 기말 유형별 풀이",desc:"22개정 공통수학1 · 유형 집중 풀이",  
url:"[https://www.megastudy.net/lecmain/mainh/mainh.asp"}](https://www.megastudy.net/lecmain/mainh/mainh.asp%22%7D),  
{type:"file",emoji:"📄",color:"#a5b4fc",bg:"rgba(99,102,241,.08)",border:"rgba(99,102,241,.18)",  
title:"[자료파일] 메가 수학 학습자료실",desc:"강의 부교재·프린트·해설 PDF 다운로드",  
url:"[https://www.megastudy.net/teacher_v2/teacher_main.asp"}](https://www.megastudy.net/teacher_v2/teacher_main.asp%22%7D),  
{type:"concept",emoji:"📺",color:"#6b7280",bg:"rgba(255,255,255,.03)",border:"rgba(255,255,255,.07)",  
title:"메가 고1 수학 강좌 전체 검색",desc:"공통수학1 검색 → 기말 단원 선택",  
url:"[https://m.megastudy.net/mobile/smart/lecmain/mainh/unitSearch/kebooks/main.asp"}](https://m.megastudy.net/mobile/smart/lecmain/mainh/unitSearch/kebooks/main.asp%22%7D),  
],  
soc:[  
{type:"pinpoint",hot:true,emoji:"🎯",color:"#fca5a5",bg:"rgba(239,68,68,.1)",border:"rgba(239,68,68,.28)",  
title:"[통합사회 쪽집게] 벼락치기 특강 〈1학기 기말〉",desc:"기말 직전 핵심만 압축 · 지금 바로 수강",  
url:"[http://m.megastudy.net/mobile/smart/lecture/detail/view.asp?CHR_CD=54094"}](http://m.megastudy.net/mobile/smart/lecture/detail/view.asp?CHR_CD=54094%22%7D),  
{type:"pinpoint",hot:false,emoji:"🎯",color:"#a5b4fc",bg:"rgba(99,102,241,.09)",border:"rgba(99,102,241,.2)",  
title:"[통합사회 쪽집게] 이다지 6월 학평 분석 및 기말 연계",desc:"6월 학평 → 기말 출제 포인트 연결",  
url:"[https://m.megastudy.net/mobile/smart/main.asp?TabNo=7"}](https://m.megastudy.net/mobile/smart/main.asp?TabNo=7%22%7D),  
{type:"file",emoji:"📄",color:"#a5b4fc",bg:"rgba(99,102,241,.08)",border:"rgba(99,102,241,.18)",  
title:"[자료파일] 이다지 통합사회 학습자료",desc:"개념 요약 PDF · 단원별 키워드 정리 파일",  
url:"[https://www.megastudy.net/teacher_v2/chr/lecture_detailview.asp?CHR_CD=56489MAKE_FLG=tec_cd=hellohw2"}](https://www.megastudy.net/teacher_v2/chr/lecture_detailview.asp?CHR_CD=56489MAKE_FLG=tec_cd=hellohw2%22%7D),  
{type:"concept",emoji:"📺",color:"#6b7280",bg:"rgba(255,255,255,.03)",border:"rgba(255,255,255,.07)",  
title:"이다지도 확실한 통합사회 개념완성",desc:"22개정 전 단원 개념 완성",  
url:"[https://www.megastudy.net/teacher_v2/chr/lecture_detailview.asp?CHR_CD=56489MAKE_FLG=tec_cd=hellohw2"}](https://www.megastudy.net/teacher_v2/chr/lecture_detailview.asp?CHR_CD=56489MAKE_FLG=tec_cd=hellohw2%22%7D),  
],  
sci:[  
{type:"pinpoint",hot:true,emoji:"🎯",color:"#fca5a5",bg:"rgba(239,68,68,.1)",border:"rgba(239,68,68,.28)",  
title:"[통합과학 쪽집게] 장풍 기말고사 직전 대비",desc:"기말 문제 3회분 수록 · 실전 직결",  
url:"[https://www.megastudy.net/teacher_v2/chr/lecture_detailview.asp?CHR_CD=55512tec_cd=wkdtjdrb"}](https://www.megastudy.net/teacher_v2/chr/lecture_detailview.asp?CHR_CD=55512tec_cd=wkdtjdrb%22%7D),  
{type:"pinpoint",hot:false,emoji:"🎯",color:"#7dd3fc",bg:"rgba(14,165,233,.09)",border:"rgba(14,165,233,.2)",  
title:"[통합과학 쪽집게] 우마리아 시험 직전 특강",desc:"서술형 답안 만들기 · 기말 핵심 포인트",  
url:"[https://m.megastudy.net/teacher_v2/main.asp?tec_cd=woomaria"}](https://m.megastudy.net/teacher_v2/main.asp?tec_cd=woomaria%22%7D),  
{type:"pinpoint",hot:false,emoji:"🎯",color:"#7dd3fc",bg:"rgba(14,165,233,.07)",border:"rgba(14,165,233,.15)",  
title:"[통합과학] 고1 6월 학평 핵심 포인트",desc:"장풍쌤 6월 학평 총평 → 기말 연계 분석",  
url:"[https://m.megastudy.net/mobile/smart/main.asp?TabNo=7"}](https://m.megastudy.net/mobile/smart/main.asp?TabNo=7%22%7D),  
{type:"file",emoji:"📄",color:"#7dd3fc",bg:"rgba(14,165,233,.07)",border:"rgba(14,165,233,.15)",  
title:"[자료파일] 장풍 통합과학 학습자료",desc:"개념노트 PDF · 기말 요약 정리 파일",  
url:"[https://www.megastudy.net/teacher_v2/chr/lecture_detailview.asp?CHR_CD=55512tec_cd=wkdtjdrb"}](https://www.megastudy.net/teacher_v2/chr/lecture_detailview.asp?CHR_CD=55512tec_cd=wkdtjdrb%22%7D),  
{type:"concept",emoji:"📺",color:"#6b7280",bg:"rgba(255,255,255,.03)",border:"rgba(255,255,255,.07)",  
title:"베테랑의 통합과학1 개념완성+완자",desc:"개념→완자→문제풀이 3단계",  
url:"[https://www.megastudy.net/teacher_v2/chr/lecture_detailview.asp?CHR_CD=55974MAKE_FLG=tec_cd=kodori15th"}](https://www.megastudy.net/teacher_v2/chr/lecture_detailview.asp?CHR_CD=55974MAKE_FLG=tec_cd=kodori15th%22%7D),  
],  
kor:[  
{type:"pinpoint",hot:true,emoji:"🎯",color:"#fca5a5",bg:"rgba(239,68,68,.1)",border:"rgba(239,68,68,.28)",  
title:"[국어 쪽집게] 박리나 6월 학평변형 독서/문학",desc:"학평변형 → 기말 독해·문학 직접 대비",  
url:"[https://www.megastudy.net/lecmain/mainh/mainh.asp"}](https://www.megastudy.net/lecmain/mainh/mainh.asp%22%7D),  
{type:"pinpoint",hot:false,emoji:"🎯",color:"#fcd34d",bg:"rgba(245,158,11,.08)",border:"rgba(245,158,11,.2)",  
title:"[국어 쪽집게] 22개정 교과서 통합 핵심 개념",desc:"9종 통합 · 문법·문학·독서 기말 핵심",  
url:"[https://www.megastudy.net/lecmain/mainh/mainh.asp"}](https://www.megastudy.net/lecmain/mainh/mainh.asp%22%7D),  
{type:"file",emoji:"📄",color:"#fcd34d",bg:"rgba(245,158,11,.07)",border:"rgba(245,158,11,.15)",  
title:"[자료파일] 메가 국어 학습자료실",desc:"문학 작품 정리·문법 요약 PDF",  
url:"[https://m.megastudy.net/mobile/smart/teacher/main.asp?domCd=1"}](https://m.megastudy.net/mobile/smart/teacher/main.asp?domCd=1%22%7D),  
{type:"concept",emoji:"📺",color:"#6b7280",bg:"rgba(255,255,255,.03)",border:"rgba(255,255,255,.07)",  
title:"메가 고1 국어 강좌 전체 보기",desc:"공통국어 → 교과서 출판사 선택",  
url:"[https://m.megastudy.net/mobile/smart/teacher/main.asp?domCd=1"}](https://m.megastudy.net/mobile/smart/teacher/main.asp?domCd=1%22%7D),  
],  
eng:[  
{type:"pinpoint",hot:true,emoji:"🎯",color:"#fca5a5",bg:"rgba(239,68,68,.1)",border:"rgba(239,68,68,.28)",  
title:"[영어 쪽집게] 3개년 고1 기출 유형별 풀이",desc:"기출 중심 · 어법+독해 실전 대비",  
url:"[https://www.megastudy.net/lecmain/mainh/mainh.asp"}](https://www.megastudy.net/lecmain/mainh/mainh.asp%22%7D),  
{type:"pinpoint",hot:false,emoji:"🎯",color:"#6ee7b7",bg:"rgba(16,185,129,.08)",border:"rgba(16,185,129,.2)",  
title:"[영어 쪽집게] 1등급 START 문법+독해",desc:"22개정 문법·독해 통합 특강",  
url:"[https://www.megastudy.net/lecmain/mainh/mainh.asp"}](https://www.megastudy.net/lecmain/mainh/mainh.asp%22%7D),  
{type:"file",emoji:"📄",color:"#6ee7b7",bg:"rgba(16,185,129,.06)",border:"rgba(16,185,129,.14)",  
title:"[자료파일] 메가 영어 학습자료실",desc:"어법 정리 PDF · 어휘 리스트 다운로드",  
url:"[https://m.megastudy.net/mobile/smart/teacher/main.asp?domCd=5"}](https://m.megastudy.net/mobile/smart/teacher/main.asp?domCd=5%22%7D),  
{type:"concept",emoji:"📺",color:"#6b7280",bg:"rgba(255,255,255,.03)",border:"rgba(255,255,255,.07)",  
title:"메가 고1 영어 강좌 전체 보기",desc:"공통영어 → 교과서 출판사 선택 수강",  
url:"[https://m.megastudy.net/mobile/smart/teacher/main.asp?domCd=5"}](https://m.megastudy.net/mobile/smart/teacher/main.asp?domCd=5%22%7D),  
],  
hist:[  
{type:"pinpoint",hot:false,emoji:"🎯",color:"#fb923c",bg:"rgba(251,146,60,.08)",border:"rgba(251,146,60,.2)",  
title:"[한국사 쪽집게] 즐거웅 완자 내신완성 1학기",desc:"기말 직전 내신 집중 완성",  
url:"[https://www.megastudy.net/teacher_v2/chr/lecture_detailview.asp?CHR_CD=53206MAKE_FLG=1tec_cd=mp1204"}](https://www.megastudy.net/teacher_v2/chr/lecture_detailview.asp?CHR_CD=53206MAKE_FLG=1tec_cd=mp1204%22%7D),  
{type:"concept",emoji:"📺",color:"#6b7280",bg:"rgba(255,255,255,.03)",border:"rgba(255,255,255,.07)",  
title:"메가 고1 한국사 강좌 보기",desc:"한국사 탭 → 기말 내신 강의 선택",  
url:"[https://m.megastudy.net/mobile/smart/teacher/main.asp?domCd=9"}](https://m.megastudy.net/mobile/smart/teacher/main.asp?domCd=9%22%7D),  
],  
};

/══ EBSi 고1 기말 + 교과서 링크 ══ /  
const EBS_DATA = {  
math:[  
{hot:true,emoji:"🆓",color:"#6ee7b7",bg:"rgba(16,185,129,.1)",border:"rgba(16,185,129,.25)",  
title:"[EBS 무료] 매쓰디렉터 공통수학1 개념 끝장내기",desc:"45강 완강 · 22개정 공통수학1 전 단원 · 완전 무료",  
url:"[https://www.ebsi.co.kr/ebs/pot/potn/retrieveTchrSubMain.ebs?tabIdx=1"}](https://www.ebsi.co.kr/ebs/pot/potn/retrieveTchrSubMain.ebs?tabIdx=1%22%7D),  
{hot:true,emoji:"🆓",color:"#6ee7b7",bg:"rgba(16,185,129,.08)",border:"rgba(16,185,129,.2)",  
title:"[EBS 무료] 정승제 50일 수학 상·하",desc:"기초부터 기말 범위까지 · 전국 1위 수학 강의 무료",  
url:"[https://www.ebsi.co.kr/ebs/lms/subMain/subMain.ebs?cookieGradeVal=high1"}](https://www.ebsi.co.kr/ebs/lms/subMain/subMain.ebs?cookieGradeVal=high1%22%7D),  
{hot:false,emoji:"📋",color:"#a5b4fc",bg:"rgba(99,102,241,.07)",border:"rgba(99,102,241,.18)",  
title:"EBSi 고1 수학 기출문제 다운로드",desc:"학력평가 기출 · 해설 포함 무료 PDF",  
url:"[https://www.ebsi.co.kr/ebs/xip/xipc/previousPaperList.ebs?targetCd=D100"}](https://www.ebsi.co.kr/ebs/xip/xipc/previousPaperList.ebs?targetCd=D100%22%7D),  
{hot:false,emoji:"📱",color:"#6b7280",bg:"rgba(255,255,255,.03)",border:"rgba(255,255,255,.07)",  
title:"EBSi 고1 수학 강좌 전체 검색",desc:"고1 탭 → 수학 → 기말고사 검색",  
url:"[https://www.ebsi.co.kr/ebs/lms/subMain/subMain.ebs?cookieGradeVal=high1"}](https://www.ebsi.co.kr/ebs/lms/subMain/subMain.ebs?cookieGradeVal=high1%22%7D),  
],  
soc:[  
{hot:true,emoji:"🆓",color:"#6ee7b7",bg:"rgba(16,185,129,.1)",border:"rgba(16,185,129,.25)",  
title:"[EBS 무료] 개념완성 통합사회1 (22개정)",desc:"전 단원 개념 완성 · 수능 직결 범위 완전 무료",  
url:"[https://www.ebsi.co.kr/ebs/lms/subMain/subMain.ebs?cookieGradeVal=high1"}](https://www.ebsi.co.kr/ebs/lms/subMain/subMain.ebs?cookieGradeVal=high1%22%7D),  
{hot:false,emoji:"📋",color:"#a5b4fc",bg:"rgba(99,102,241,.07)",border:"rgba(99,102,241,.18)",  
title:"EBSi 통합사회 기출문제",desc:"학력평가 통합사회 기출 · 해설 포함",  
url:"[https://www.ebsi.co.kr/ebs/xip/xipc/previousPaperList.ebs?targetCd=D100"}](https://www.ebsi.co.kr/ebs/xip/xipc/previousPaperList.ebs?targetCd=D100%22%7D),  
],  
sci:[  
{hot:true,emoji:"🆓",color:"#6ee7b7",bg:"rgba(16,185,129,.1)",border:"rgba(16,185,129,.25)",  
title:"[EBS 무료] 개념완성 통합과학1 (22개정)",desc:"전 단원 개념 완성 · 이주의 강좌 Top4 · 완전 무료",  
url:"[https://www.ebsi.co.kr/ebs/lms/subMain/subMain.ebs?cookieGradeVal=high1"}](https://www.ebsi.co.kr/ebs/lms/subMain/subMain.ebs?cookieGradeVal=high1%22%7D),  
{hot:false,emoji:"📋",color:"#7dd3fc",bg:"rgba(14,165,233,.07)",border:"rgba(14,165,233,.18)",  
title:"EBSi 통합과학 기출문제",desc:"학력평가 통합과학 기출 · 해설 포함",  
url:"[https://www.ebsi.co.kr/ebs/xip/xipc/previousPaperList.ebs?targetCd=D100"}](https://www.ebsi.co.kr/ebs/xip/xipc/previousPaperList.ebs?targetCd=D100%22%7D),  
],  
kor:[  
{hot:true,emoji:"🆓",color:"#6ee7b7",bg:"rgba(16,185,129,.1)",border:"rgba(16,185,129,.25)",  
title:"[EBS 무료] 윤혜정 개념의 나비효과 입문편",desc:"국어 기초 개념 완성 · 무료 명강의",  
url:"[https://www.ebsi.co.kr/ebs/lms/subMain/subMain.ebs?cookieGradeVal=high1"}](https://www.ebsi.co.kr/ebs/lms/subMain/subMain.ebs?cookieGradeVal=high1%22%7D),  
{hot:false,emoji:"📚",color:"#fcd34d",bg:"rgba(245,158,11,.07)",border:"rgba(245,158,11,.18)",  
title:"EBSi 교과서 내신 국어 강좌",desc:"고1 탭 → 국어 → 교과서별 내신 강의",  
url:"[https://www.ebsi.co.kr/ebs/pot/potn/retrieveTchrSubMain.ebs"}](https://www.ebsi.co.kr/ebs/pot/potn/retrieveTchrSubMain.ebs%22%7D),  
{hot:false,emoji:"📋",color:"#a5b4fc",bg:"rgba(99,102,241,.07)",border:"rgba(99,102,241,.18)",  
title:"EBSi 고1 국어 기출문제",desc:"학력평가 국어 기출 · 해설 포함 무료",  
url:"[https://www.ebsi.co.kr/ebs/xip/xipc/previousPaperList.ebs?targetCd=D100"}](https://www.ebsi.co.kr/ebs/xip/xipc/previousPaperList.ebs?targetCd=D100%22%7D),  
],  
eng:[  
{hot:true,emoji:"🆓",color:"#6ee7b7",bg:"rgba(16,185,129,.1)",border:"rgba(16,185,129,.25)",  
title:"[EBS 무료] 고1 영어 교과서 내신 강의",desc:"공통영어 출판사별 교과서 분석 강의 무료",  
url:"[https://www.ebsi.co.kr/ebs/pot/potn/retrieveTchrSubMain.ebs"}](https://www.ebsi.co.kr/ebs/pot/potn/retrieveTchrSubMain.ebs%22%7D),  
{hot:false,emoji:"🎧",color:"#6ee7b7",bg:"rgba(16,185,129,.07)",border:"rgba(16,185,129,.15)",  
title:"EBSi 영어 듣기 MP3 무료 다운로드",desc:"교과서 듣기 파일 · 등교 중 반복 청취",  
url:"[https://www.ebsi.co.kr/ebs/pot/potg/retrieveMp3DownList.ebs"}](https://www.ebsi.co.kr/ebs/pot/potg/retrieveMp3DownList.ebs%22%7D),  
{hot:false,emoji:"📋",color:"#a5b4fc",bg:"rgba(99,102,241,.07)",border:"rgba(99,102,241,.18)",  
title:"EBSi 고1 영어 기출문제",desc:"학력평가 영어 기출 · 해설 포함 무료",  
url:"[https://www.ebsi.co.kr/ebs/xip/xipc/previousPaperList.ebs?targetCd=D100"}](https://www.ebsi.co.kr/ebs/xip/xipc/previousPaperList.ebs?targetCd=D100%22%7D),  
],  
hist:[  
{hot:false,emoji:"🆓",color:"#6ee7b7",bg:"rgba(16,185,129,.08)",border:"rgba(16,185,129,.2)",  
title:"[EBS 무료] 고1 한국사 내신 강의",desc:"고1 탭 → 한국사 → 기말 내신 대비",  
url:"[https://www.ebsi.co.kr/ebs/lms/subMain/subMain.ebs?cookieGradeVal=high1"}](https://www.ebsi.co.kr/ebs/lms/subMain/subMain.ebs?cookieGradeVal=high1%22%7D),  
],  
};

const SUBJECTS = [  
{key:"math",name:"수학",emoji:"📐",color:"#f9a8d4",bg:"rgba(236,72,153,.08)",border:"rgba(236,72,153,.28)",prio:"최우선",pc:"bp"},  
{key:"soc",name:"통합사회",emoji:"🌏",color:"#a5b4fc",bg:"rgba(99,102,241,.07)",border:"rgba(99,102,241,.26)",prio:"수능직결",pc:"bi"},  
{key:"sci",name:"통합과학",emoji:"🔬",color:"#7dd3fc",bg:"rgba(14,165,233,.07)",border:"rgba(14,165,233,.26)",prio:"수능직결",pc:"bi"},  
{key:"kor",name:"국어",emoji:"📖",color:"#fcd34d",bg:"rgba(245,158,11,.07)",border:"rgba(245,158,11,.24)",prio:"높음",pc:"ba"},  
{key:"eng",name:"영어",emoji:"🌍",color:"#6ee7b7",bg:"rgba(16,185,129,.06)",border:"rgba(16,185,129,.22)",prio:"높음",pc:"bg"},  
{key:"hist",name:"한국사",emoji:"📜",color:"#fb923c",bg:"rgba(251,146,60,.06)",border:"rgba(251,146,60,.2)",prio:"보통",pc:"ba"},  
];

/══ 습관 트래커 항목 ══ /  
const HABITS = [  
{id:"school",emoji:"🏫",name:"학교 수업",sub:"수업 집중·필기 100%",color:"#a5b4fc",streak_color:"#6366f1",  
tip:"수업 중 선생님이 강조한 것 = 기말 출제 포인트. 별표 필수!"},  
{id:"academy",emoji:"🏢",name:"학원 복습",sub:"학원 직후 오답 정리",color:"#f9a8d4",streak_color:"#ec4899",  
tip:"학원 끝나고 30분 안에 오답 체크. 기억이 가장 선명할 때!"},  
{id:"lecture",emoji:"🎬",name:"인강 수강",sub:"메가·EBS 1강 + 문제풀이",color:"#fcd34d",streak_color:"#f59e0b",  
tip:"인강 보고 나서 5문제 안 풀면 소용없음. 문제풀이 세트로!"},  
{id:"self",emoji:"✏️",name:"자기주도 학습",sub:"야자·귀가 후 자습",color:"#6ee7b7",streak_color:"#10b981",  
tip:"오늘 학교에서 배운 것 30분 복습이 핵심. 예습은 그 다음!"},  
{id:"sleep",emoji:"😴",name:"수면 7시간",sub:"취침 23시 이전 목표",color:"#7dd3fc",streak_color:"#0ea5e9",  
tip:"수면 부족 = 공부한 것이 기억에 안 남음. 오늘 잘 자야 내일 성적!"},  
];

const DAYS_KO=["일","월","화","수","목","금","토"];  
const DRAW_COLORS=["#ffffff","#f9a8d4","#6ee7b7","#fcd34d","#7dd3fc","#a5b4fc","#ef4444"];  
const EXAM_DATE=new Date(2026,6,2);  
const getDday=()=>{const n=new Date();n.setHours(0,0,0,0);const e=new Date(EXAM_DATE);e.setHours(0,0,0,0);return Math.ceil((e-n)/(10006060*24));};  
const getWeekDates=()=>{const d=[];const b=new Date();for(let i=0;i14;i++){const x=new Date(b);x.setDate(b.getDate()+i);d.push(x);}return d;};  
const dateKey=(d)=>d.toISOString().slice(0,10);  
const todayKey=()=>dateKey(new Date());

const TABS=[  
{id:"home",ic:"🏠",l:"홈"},  
{id:"resource",ic:"📚",l:"강의자료"},  
{id:"habit",ic:"🔥",l:"습관"},  
{id:"planner",ic:"📅",l:"플래너"},  
{id:"wrong",ic:"📝",l:"오답"},  
];

export default function App(){  
const[tab,setTab]=useState("home");  
const[openSubj,setOpenSubj]=useState(null);  
const[openSrc,setOpenSrc]=useState("mega");  
const[modal,setModal]=useState(null);  
const[selDate,setSelDate]=useState(0);  
const weekDates=getWeekDates();  
const canvasRef=useRef(null);  
const isDrawing=useRef(false);  
const lastPos=useRef(null);

const[tasks,setTasks]=useState({});  
const[newTask,setNewTask]=useState("");  
const[wrongs,setWrongs]=useState([]);  
const[memos,setMemos]=useState({});  
const[habitLog,setHabitLog]=useState({});  
const[wMode,setWMode]=useState("photo");  
const[wSubj,setWSubj]=useState("수학");  
const[wMemo,setWMemo]=useState("");  
const[wText,setWText]=useState("");  
const[photo,setPhoto]=useState(null);  
const[drawColor,setDrawColor]=useState("#ffffff");  
const[brushSize,setBrushSize]=useState(3);  
const[isEraser,setIsEraser]=useState(false);

useEffect(()=>{  
(async()=>{  
try{  
const t=await window.storage.get("t6");if(t)setTasks(JSON.parse(t.value));  
const w=await window.storage.get("w6");if(w)setWrongs(JSON.parse(w.value));  
const m=await window.storage.get("m6");if(m)setMemos(JSON.parse(m.value));  
const h=await window.storage.get("h6");if(h)setHabitLog(JSON.parse(h.value));  
}catch(e){}  
})();  
},[]);  
const sv=async(k,v)=>{try{await window.storage.set(k,JSON.stringify(v));}catch(e){}};

useEffect(()=>{  
if(tab="wrong"wMode="draw"){  
setTimeout(()=>{  
const c=canvasRef.current;if(!c)return;  
const ctx=c.getContext("2d");  
c.width=c.offsetWidth||340;c.height=240;  
ctx.fillStyle="#111827";ctx.fillRect(0,0,c.width,c.height);  
ctx.strokeStyle="rgba(99,102,241,.1)";ctx.lineWidth=1;  
for(let x=0;xc.width;x+=20){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,c.height);ctx.stroke();}  
for(let y=0;yc.height;y+=20){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(c.width,y);ctx.stroke();}  
},150);  
}  
},[tab,wMode]);

const getPos=(e,c)=>{const r=c.getBoundingClientRect();const t=e.touches?e.touches[0]:e;return{x:(t.clientX-r.left)(c.width/r.width),y:(t.clientY-r.top)(c.height/r.height)};};  
const startDraw=(e)=>{e.preventDefault();const c=canvasRef.current;if(!c)return;isDrawing.current=true;lastPos.current=getPos(e,c);};  
const draw=(e)=>{e.preventDefault();if(!isDrawing.current)return;const c=canvasRef.current;if(!c)return;const ctx=c.getContext("2d");const p=getPos(e,c);ctx.beginPath();ctx.strokeStyle=isEraser?"#111827":drawColor;ctx.lineWidth=isEraser?brushSize*4:brushSize;ctx.lineCap="round";ctx.lineJoin="round";ctx.moveTo(lastPos.current.x,lastPos.current.y);ctx.lineTo(p.x,p.y);ctx.stroke();lastPos.current=p;};  
const endDraw=(e)=>{e.preventDefault();isDrawing.current=false;};  
const clearCanvas=()=>{const c=canvasRef.current;if(!c)return;const ctx=c.getContext("2d");ctx.fillStyle="#111827";ctx.fillRect(0,0,c.width,c.height);ctx.strokeStyle="rgba(99,102,241,.1)";ctx.lineWidth=1;for(let x=0;xc.width;x+=20){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,c.height);ctx.stroke();}for(let y=0;yc.height;y+=20){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(c.width,y);ctx.stroke();}};

const toggleHabit=(id)=>{  
const k=todayKey();  
const day=habitLog[k]||{};  
const u={...habitLog,[k]:{...day,[id]:!day[id]}};  
setHabitLog(u);sv("h6",u);  
if(!day[id]){  
const h=HABITS.find(x=>x.id=id);  
const streak=getStreak(id,u);  
if(streak>0streak%7=0)setModal({emoji:"🔥",title:${h.name} ${streak}일 연속!,sub:"대단해요! 습관이 굳어지고 있어요 💪"});  
}  
};

const getStreak=(id,log)=>{let s=0;const d=new Date();for(let i=0;i30;i++){const k=dateKey(new Date(d-i86400000));if(log[k]?.[id])s++;else break;}return s;};  
const getMonthDone=(id)=>{let c=0;for(let i=0;i30;i++){const k=dateKey(new Date(Date.now()-i86400000));if(habitLog[k]?.[id])c++;}return c;};

const dkey=weekDates[selDate].toDateString();  
const dayTasks=tasks[dkey]||[];  
const doneToday=dayTasks.filter(t=>t.done).length;  
const dday=getDday();  
const ddayColor=dday=7?"#ef4444":dday=14?"#f59e0b":"#6366f1";  
const todayHabits=habitLog[todayKey()]||{};  
const habitDoneCount=HABITS.filter(h=>todayHabits[h.id]).length;

const addTask=()=>{if(!newTask.trim())return;const u={...tasks,[dkey]:[...dayTasks,{text:newTask.trim(),done:false}]};setTasks(u);sv("t6",u);setNewTask("");};  
const toggleTask=(idx)=>{const u={...tasks,[dkey]:dayTasks.map((t,i)=>i=idx?{...t,done:!t.done}:t)};setTasks(u);sv("t6",u);if(u[dkey].every(t=>t.done)u[dkey].length>0)setModal({emoji:"🏆",title:"오늘 목표 완료!",sub:${u[dkey].length}개 달성! 진짜 잘했어요 👍});};  
const delTask=(idx)=>{const u={...tasks,[dkey]:dayTasks.filter((_,i)=>i!idx)};setTasks(u);sv("t6",u);};  
const saveWrong=()=>{  
let content=null;  
if(wMode="photo"){if(!photo!wMemo.trim())return;content={type:"photo",image:photo,memo:wMemo};}  
else if(wMode="draw"){const c=canvasRef.current;const img=c?c.toDataURL("image/png"):null;if(!img!wMemo.trim())return;content={type:"draw",image:img,memo:wMemo};}  
else{if(!wText.trim())return;content={type:"text",text:wText,memo:wMemo};}  
const u=[...wrongs,{subj:wSubj,content,date:new Date().toLocaleDateString("ko-KR"),id:Date.now()}];  
setWrongs(u);sv("w6",u);setPhoto(null);setWText("");setWMemo("");clearCanvas();  
setModal({emoji:"✅",title:"오답 저장!",sub:"복습할 때 다시 봐요"});  
};  
const delWrong=(id)=>{const u=wrongs.filter(w=>w.id!==id);setWrongs(u);sv("w6",u);};  
const sColor=(s)=>({수학:"#f9a8d4",국어:"#fcd34d",영어:"#6ee7b7",통합사회:"#a5b4fc",통합과학:"#7dd3fc",한국사:"#fb923c"}[s]||"#9ca3af");  
const handlePhoto=(e)=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=(ev)=>setPhoto(ev.target.result);r.readAsDataURL(f);};

const openLink=(url)=>window.open(url,"_blank");

return(  
>  
  
{modal(  
div className="mbg" onClick={()=>setModal(null)}>  
div className="mm" onClick={e=>e.stopPropagation()}>  
div style={{fontSize:"42px",marginBottom:"9px"}}>{modal.emoji}

  
div style={{fontSize:"16px",fontWeight:"700",color:"#c7d2fe",marginBottom:"6px"}}>{modal.title}

  
div style={{fontSize:"12px",color:"#6b7280",lineHeight:"1.6",whiteSpace:"pre-line"}}>{modal.sub}

  
button className="mmb" onClick={()=>setModal(null)}>확인 ✓

  
)}

{/* ═══ HOME ═══ */}

{tab==="home"(

div className="page">

div className="hero">

div>

div style={{fontSize:"9px",fontWeight:"700",color:"#f87171",letterSpacing:"2px",marginBottom:"3px"}}>🔥 지금 준비할 시험/div>

div style={{fontSize:"16px",fontWeight:"900",color:"#fca5a5",lineHeight:"1.3"}}>1학기 기말고사/div>

div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"11px",color:"#6b7280",marginTop:"3px"}}>7월 2일(목) ~ 7일(화)/div>

div style={{display:"flex",gap:"4px",flexWrap:"wrap",marginTop:"7px"}}>

{["수학","국어","영어","통합사회","통합과학","한국사"].map(s=>(

span key={s} style={{padding:"2px 6px",background:"rgba(239,68,68,.14)",border:"1px solid rgba(239,68,68,.2)",borderRadius:"6px",fontSize:"9px",color:"#fca5a5"}}>{s}/span>

))}

/div>

/div>

div style={{textAlign:"center",flexShrink:0}}>

div className="dday-n" style={{color:ddayColor,textShadow:`0 0 24px ${ddayColor}55`}}>D-{dday}/div>

div className="dday-l">DAYS LEFT/div>

/div>

/div>

{/* 오늘 습관 요약 */}

div className="card">

div className="ct">🔥 오늘 습관 달성 — {habitDoneCount}/{HABITS.length}

span className={`b ${habitDoneCount===HABITS.length?"bg":habitDoneCount>=3?"bi":"br"}`} style={{marginLeft:"auto"}}>

{habitDoneCount===HABITS.length?"완벽!":habitDoneCount>=3?"순항중":"더 할 수 있어"}

/span>

/div>

div style={{display:"flex",gap:"6px"}}>

{HABITS.map(h=>(

div key={h.id} onClick={()=>toggleHabit(h.id)}

style={{flex:1,padding:"9px 4px",borderRadius:"10px",textAlign:"center",cursor:"pointer",

background:todayHabits[h.id]?`${h.streak_color}22`:"rgba(255,255,255,.03)",

border:`1px solid ${todayHabits[h.id]?h.streak_color:"rgba(255,255,255,.07)"}`,transition:".15s"}}>

div style={{fontSize:"18px",marginBottom:"2px"}}>{h.emoji}/div>

div style={{fontSize:"8px",fontWeight:"700",color:todayHabits[h.id]?h.color:"#374151"}}>{h.name.replace(" ","")}/div>

{todayHabits[h.id]div style={{fontSize:"8px",color:h.color}}>✓/div>}

/div>

))}

/div>

div style={{fontSize:"10px",color:"#374151",marginTop:"8px",textAlign:"center"}}>터치해서 오늘 실천한 것 체크 → 🔥 탭에서 자세히 보기/div>

/div>

{/* 야자 활용 */}

div className="card">

div className="ct">⚡ 야자 시간 활용법/div>

{[

{d:"월",c:"#a5b4fc",t:"~21:00",a:"수업복습 50분 + 수학예제 40분 + 통합사회 30분"},

{d:"화",c:"#6ee7b7",t:"~19:40",a:"영어 단어 완료 → 영어학원 직행"},

{d:"수",c:"#fcd34d",t:"~19:30",a:"⭐ 통합과학 60분 + 통합사회 60분"},

{d:"목",c:"#6ee7b7",t:"~19:40",a:"한국사 30분 + 수학오답 30분 + 영어준비"},

{d:"금",c:"#f9a8d4",t:"~18:20",a:"주간 약점 총정리 → 국어학원 직행"},

].map((r,i)=>(

div key={i} style={{display:"flex",gap:"9px",padding:"8px 0",borderBottom:i4?"1px solid rgba(255,255,255,.04)":"none",alignItems:"flex-start"}}>

div style={{width:"25px",height:"25px",borderRadius:"7px",flexShrink:0,background:"rgba(99,102,241,.13)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"10px",fontWeight:"700",color:r.c}}>{r.d}/div>

div>

div style={{fontSize:"9px",color:"#4b5563",fontFamily:"'JetBrains Mono',monospace",marginBottom:"1px"}}>야자 {r.t}/div>

div style={{fontSize:"11px",color:"#d1d5db",lineHeight:"1.5"}}>{r.a}/div>

/div>

/div>

))}

/div>

{/* 학원 스케줄 */}

div className="card">

div className="ct">🏫 학원 스케줄 (확정)/div>

{[

{d:"수·토",n:"수학학원",t:"13:00~16:00",c:"#f9a8d4"},

{d:"화·목",n:"영어학원",t:"21:30~23:00",c:"#6ee7b7"},

{d:"금",n:"국어학원",t:"19:00~22:00",c:"#fcd34d"},

{d:"일",n:"국어학원",t:"12:00~15:00",c:"#fcd34d"},

].map((r,i)=>(

div key={i} style={{display:"flex",gap:"9px",padding:"7px 0",borderBottom:i3?"1px solid rgba(255,255,255,.04)":"none",alignItems:"center"}}>

div style={{width:"28px",fontSize:"10px",fontWeight:"700",color:"#6b7280",flexShrink:0,textAlign:"center"}}>{r.d}/div>

span style={{fontSize:"13px",fontWeight:"700",color:r.c,flex:1}}>{r.n}/span>

span style={{fontSize:"10px",color:"#4b5563",fontFamily:"'JetBrains Mono',monospace"}}>{r.t}/span>

/div>

))}

/div>

/div>

)}

{/* ═══ RESOURCE 강의자료 ═══ */}

{tab==="resource"(

div className="page">

div className="ptitle">📚 강의 자료/div>

div className="psub">메가스터디 쪽집게+자료파일 / EBSi 무료강의 과목별 링크/div>

{/* 소스 탭 */}

div style={{display:"flex",gap:"6px",marginBottom:"13px"}}>

{[{id:"mega",emoji:"🎬",l:"메가스터디"},{id:"ebs",emoji:"📺",l:"EBSi 무료"}].map(s=>(

button key={s.id} onClick={()=>setOpenSrc(s.id)}

style={{flex:1,padding:"10px",borderRadius:"11px",fontSize:"12px",fontWeight:"700",transition:".15s",

background:openSrc===s.id?"rgba(99,102,241,.2)":"rgba(255,255,255,.03)",

border:`1px solid ${openSrc===s.id?"rgba(99,102,241,.38)":"rgba(255,255,255,.08)"}`,

color:openSrc===s.id?"#a5b4fc":"#6b7280"}}>

{s.emoji} {s.l}

/button>

))}

/div>

{openSrc==="mega"(

>

div style={{background:"rgba(234,179,8,.07)",border:"1px solid rgba(234,179,8,.2)",borderRadius:"11px",padding:"11px 13px",marginBottom:"12px",fontSize:"11px",color:"#fde047",lineHeight:"1.6"}}>

⚡ D-{dday} — 🎯 쪽집게 먼저 / 📄 자료파일 다운 / 📺 개념 강의br/>

🔥 빨간 강의가 지금 당장 들어야 할 것!

/div>

{SUBJECTS.map((s,i)=>(

div key={i} style={{background:s.bg,border:`1px solid ${openSubj===`m${i}`?s.border:"rgba(255,255,255,.06)"}`,borderRadius:"13px",padding:"13px",marginBottom:"9px",cursor:"pointer",transition:".15s"}}

onClick={()=>setOpenSubj(openSubj===`m${i}`?null:`m${i}`)}>

div style={{display:"flex",alignItems:"center",gap:"9px"}}>

div style={{fontSize:"20px",width:"30px",textAlign:"center"}}>{s.emoji}/div>

div style={{flex:1}}>

div style={{fontSize:"13px",fontWeight:"700",color:s.color}}>{s.name}/div>

/div>

span className={`b ${s.pc}`}>{s.prio}/span>

span style={{color:"#374151",fontSize:"12px",marginLeft:"4px"}}>{openSubj===`m${i}`?"▲":"▼"}/span>

/div>

{openSubj===`m${i}`(

div style={{marginTop:"11px",paddingTop:"11px",borderTop:"1px solid rgba(255,255,255,.05)"}}>

{["pinpoint","file","concept"].map(type=>{

const items=MEGA_DATA[s.key].filter(x=>x.type===type);

if(!items.length)return null;

const labels={pinpoint:{emoji:"🎯",text:"쪽집게 강의",cls:"by"},file:{emoji:"📄",text:"자료파일",cls:"bi"},concept:{emoji:"📺",text:"개념 강의",cls:"b" }};

const lb=labels[type];

return(

div key={type} style={{marginBottom:"10px"}}>

div className="stt">span className={`b ${lb.cls}`}>{lb.emoji} {lb.text}/span>/div>

{items.map((lk,j)=>(

button key={j} className="rl"

style={{background:lk.hot?"rgba(239,68,68,.09)":lk.bg,border:`1px solid ${lk.hot?"rgba(239,68,68,.28)":lk.border}`}}

onClick={e=>{e.stopPropagation();openLink(lk.url);}}>

div className="rl-icon" style={{background:lk.hot?"rgba(239,68,68,.15)":lk.bg}}>{lk.emoji}/div>

div className="rl-info">

div className="rl-t" style={{color:lk.hot?"#fca5a5":lk.color}}>{lk.title}/div>

div className="rl-d">{lk.desc}/div>

/div>

span style={{fontSize:"12px",color:"#374151",flexShrink:0}}>→/span>

/button>

))}

/div>

);

})}

/div>

)}

/div>

))}

/>

)}

{openSrc==="ebs"(

>

div style={{background:"rgba(16,185,129,.08)",border:"1px solid rgba(16,185,129,.22)",borderRadius:"11px",padding:"11px 13px",marginBottom:"12px",fontSize:"11px",color:"#6ee7b7",lineHeight:"1.6"}}>

🆓 EBSi는 strong>전부 무료/strong>! 로그인만 하면 모든 강의 수강 가능.br/>

🆓 표시 = 무료 강의 / 📋 = 기출문제 다운로드 / 🎧 = MP3

/div>

{SUBJECTS.map((s,i)=>(

div key={i} style={{background:s.bg,border:`1px solid ${openSubj===`e${i}`?s.border:"rgba(255,255,255,.06)"}`,borderRadius:"13px",padding:"13px",marginBottom:"9px",cursor:"pointer",transition:".15s"}}

onClick={()=>setOpenSubj(openSubj===`e${i}`?null:`e${i}`)}>

div style={{display:"flex",alignItems:"center",gap:"9px"}}>

div style={{fontSize:"20px",width:"30px",textAlign:"center"}}>{s.emoji}/div>

div style={{flex:1}}>

div style={{fontSize:"13px",fontWeight:"700",color:s.color}}>{s.name}/div>

/div>

span className="b bg" style={{fontSize:"9px"}}>🆓 무료/span>

span style={{color:"#374151",fontSize:"12px",marginLeft:"4px"}}>{openSubj===`e${i}`?"▲":"▼"}/span>

/div>

{openSubj===`e${i}`(

div style={{marginTop:"11px",paddingTop:"11px",borderTop:"1px solid rgba(255,255,255,.05)"}}>

{EBS_DATA[s.key].map((lk,j)=>(

button key={j} className="rl"

style={{background:lk.hot?"rgba(16,185,129,.1)":lk.bg,border:`1px solid ${lk.hot?"rgba(16,185,129,.28)":lk.border}`}}

onClick={e=>{e.stopPropagation();openLink(lk.url);}}>

div className="rl-icon" style={{background:lk.hot?"rgba(16,185,129,.15)":lk.bg}}>{lk.emoji}/div>

div className="rl-info">

div className="rl-t" style={{color:lk.hot?"#6ee7b7":lk.color}}>{lk.title}/div>

div className="rl-d">{lk.desc}/div>

/div>

span style={{fontSize:"12px",color:"#374151",flexShrink:0}}>→/span>

/button>

))}

button className="rl" style={{background:"rgba(99,102,241,.07)",border:"1px solid rgba(99,102,241,.18)"}}

onClick={e=>{e.stopPropagation();openLink("https://www.ebsi.co.kr/ebs/lms/subMain/subMain.ebs?cookieGradeVal=high1");}}>

div className="rl-icon" style={{background:"rgba(99,102,241,.12)"}}>🔍/div>

div className="rl-info">

div className="rl-t" style={{color:"#a5b4fc"}}>EBSi 고1 {s.name} 강좌 전체 검색/div>

div className="rl-d">고1 탭 → {s.name} → 기말고사 검색/div>

/div>

span style={{fontSize:"12px",color:"#374151",flexShrink:0}}>→/span>

/button>

/div>

)}

/div>

))}

{/* EBSi 앱 */}

div className="card" style={{marginTop:"4px"}}>

div className="ct">📱 EBSi 앱 설치 (안드로이드)/div>

button className="rl" style={{background:"rgba(16,185,129,.08)",border:"1px solid rgba(16,185,129,.2)"}}

onClick={()=>openLink("https://play.google.com/store/apps/details?id=kr.go.ebs.ebsi")}>

div className="rl-icon" style={{background:"rgba(16,185,129,.15)"}}>📲/div>

div className="rl-info">

div className="rl-t" style={{color:"#6ee7b7"}}>EBSi 고교강의 앱 (플레이스토어)/div>

div className="rl-d">Wi-Fi 없어도 강의 다운로드 수강 · 완전 무료/div>

/div>

span style={{fontSize:"12px",color:"#374151",flexShrink:0}}>→/span>

/button>

/div>

/>

)}

/div>

)}

{/* ═══ HABIT 습관 트래커 ═══ */}

{tab==="habit"(

div className="page">

div className="ptitle">🔥 습관 트래커/div>

div className="psub">매일 체크 → 연속 달성 → 성적 자동 상승 구조/div>

div className="card" style={{marginBottom:"12px"}}>

div className="ct">오늘 달성 현황 — {habitDoneCount}/{HABITS.length}/div>

div className="pw">div className="pb" style={{width:`${(habitDoneCount/HABITS.length)*100}%`,background:"linear-gradient(90deg,#f59e0b,#ef4444)"}}/>/div>

div style={{fontSize:"11px",color:"#4b5563",marginTop:"4px",textAlign:"center"}}>

{habitDoneCount===HABITS.length?"🏆 오늘 완벽 달성! 최고야!":habitDoneCount>=4?"💪 거의 다 왔어! 한 개 더!":habitDoneCount>=2?"👍 잘하고 있어! 계속해봐":habitDoneCount===1?"✊ 시작이 반이야!":"🌅 오늘 아직 시작 전 - 할 수 있어!"}

/div>

/div>

{HABITS.map(h=>{

const done=todayHabits[h.id]||false;

const streak=getStreak(h.id,habitLog);

const monthDone=getMonthDone(h.id);

return(

div key={h.id} className="habit-block">

div className="hb-head" onClick={()=>toggleHabit(h.id)}>

div className="hb-emoji">{h.emoji}/div>

div style={{flex:1}}>

div className="hb-title">{h.name}/div>

div style={{fontSize:"10px",color:"#6b7280",marginTop:"1px"}}>{h.sub}/div>

/div>

div className="hb-streak" style={{color:h.streak_color}}>🔥{streak}일/div>

/div>

button className="hb-today"

style={{background:done?`${h.streak_color}22`:"rgba(255,255,255,.03)",

border:`1px solid ${done?h.streak_color:"rgba(255,255,255,.08)"}`,

color:done?h.color:"#6b7280"}}

onClick={()=>toggleHabit(h.id)}>

{done?`✓ 오늘 완료! 연속 ${streak}일`:"터치해서 오늘 완료 체크"}

/button>

{/* 최근 14일 기록 */}

div style={{fontSize:"10px",color:"#374151",marginBottom:"5px"}}>최근 14일/div>

div className="habit-grid">

{["일","월","화","수","목","금","토"].map(d=>div key={d} className="hday">{d}/div>)}

{(() => {

const cells = [];

const today = new Date();

const startDay = today.getDay();

for(let pad=0;padstartDay;pad++) cells.push(div key={`p${pad}`} className="hcell" style={{opacity:0}}/>);

for(let i=13;i>=0;i--){

const d=new Date(today);d.setDate(today.getDate()-i);

const k=dateKey(d);const isDone=habitLog[k]?.[h.id];

const isToday=i===0;

cells.push(

div key={k} className={`hcell ${isDone?"hc-done":isToday?"hcell":"hc-empty"}`}

style={{border:isToday?`1px solid ${h.streak_color}`:""}}>

{isDone?"✓":""}

/div>

);

}

return cells;

})()}

/div>

div style={{fontSize:"10px",color:"#374151",marginTop:"5px"}}>

이번 달 {monthDone}일 달성 / 연속 {streak}일 🔥

/div>

div style={{fontSize:"11px",color:"#4b5563",marginTop:"6px",padding:"8px 10px",background:"rgba(255,255,255,.025)",borderRadius:"8px",lineHeight:"1.55"}}>

💡 {h.tip}

/div>

/div>

);

})}

/div>

)}

{/* ═══ PLANNER ═══ */}

{tab==="planner"(

div className="page">

div className="ptitle">📅 하루 플래너/div>

div className="psub">날짜 선택 → 목표 입력 → 완료 체크/div>

div className="date-row">

{weekDates.map((d,i)=>{

const dk=d.toDateString();const dt=tasks[dk]||[];const dn=dt.filter(t=>t.done).length;

const isE=d>=EXAM_DATEd=new Date(2026,6,7);

return(

div key={i} className={`dp${selDate===i?" on":""}`} style={isE?{background:"rgba(239,68,68,.14)",borderColor:"rgba(239,68,68,.28)"}:{}} onClick={()=>setSelDate(i)}>

span className="dn" style={isE?{color:"#fca5a5"}:{}}>{d.getDate()}/span>

span style={{fontSize:"9px"}}>{DAYS_KO[d.getDay()]}/span>

{dt.length>0span style={{fontSize:"8px",color:dn===dt.length?"#6ee7b7":"#6366f1",display:"block"}}>{dn}/{dt.length}/span>}

{isEspan style={{fontSize:"8px",color:"#fca5a5",display:"block"}}>시험/span>}

/div>

);

})}

/div>

div className="card">

div className="ct">

{weekDates[selDate].getMonth()+1}월 {weekDates[selDate].getDate()}일({DAYS_KO[weekDates[selDate].getDay()]}) 목표

{dayTasks.length>0span className={`b ${doneToday===dayTasks.length?"bg":"bi"}`} style={{marginLeft:"auto"}}>{doneToday}/{dayTasks.length}/span>}

/div>

{dayTasks.length===0?(

div style={{textAlign:"center",padding:"16px 0",color:"#374151",fontSize:"12px"}}>목표를 추가해봐요 👇/div>

):(

>

div className="pw">div className="pb" style={{width:`${(doneToday/dayTasks.length)*100}%`,background:"linear-gradient(90deg,#6366f1,#a5b4fc)"}}/>/div>

{dayTasks.map((t,i)=>(

div key={i} className="ci" onClick={()=>toggleTask(i)}>

div className={`chk${t.done?" done":""}`}>{t.done?"✓":""}/div>

div style={{flex:1}}>div className={`cl${t.done?" done":""}`}>{t.text}/div>/div>

button style={{color:"#374151",fontSize:"18px",padding:"3px",flexShrink:0}} onClick={e=>{e.stopPropagation();delTask(i);}}>×/button>

/div>

))}

/>

)}

div className="add-row">

input className="ai" placeholder="목표 입력 (예: 수학 행렬 예제 풀기)" value={newTask} onChange={e=>setNewTask(e.target.value)} onKeyDown={e=>e.key==="Enter"addTask()}/>

button className="ab" onClick={addTask}>+/button>

/div>

/div>

{/* D-day 시험 일정 간략 */}

div className="card">

div className="ct">🗓 주요 일정/div>

{[

{date:"7.2~7.7",t:"1학기 기말고사",hot:true,c:"#fca5a5"},

{date:"7.24~8.17",t:"여름방학",c:"#6ee7b7"},

{date:"9.2",t:"9월 학력평가",c:"#fcd34d"},

{date:"10.13~16",t:"2학기 중간고사",c:"#f9a8d4"},

{date:"10.20",t:"10월 학력평가",c:"#fcd34d"},

{date:"12.15~18",t:"2학기 기말고사",c:"#f9a8d4"},

].map((item,i)=>(

div key={i} className="tli">

div className="tld" style={{background:item.hot?"#ef4444":item.c,boxShadow:item.hot?"0 0 7px #ef4444":""}}/>

div>

div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"9px",color:"#4b5563"}}>{item.date}/div>

div style={{fontSize:"12px",fontWeight:"700",color:item.hot?"#fca5a5":"#e2e8f0"}}>

{item.t}{item.hotspan style={{marginLeft:"6px",fontSize:"10px",color:"#ef4444"}}>D-{dday}/span>}

/div>

/div>

/div>

))}

/div>

/div>

)}

{/* ═══ WRONG NOTE ═══ */}

{tab==="wrong"(

div className="page">

div className="ptitle">📝 오답 노트/div>

div className="psub">📷사진 · ✏️손그림 · ⌨️글 — {wrongs.length}개 저장/div>

div style={{display:"flex",gap:"5px",marginBottom:"11px",flexWrap:"wrap"}}>

{["수학","국어","영어","통합사회","통합과학","한국사"].map(s=>(

button key={s} onClick={()=>setWSubj(s)}

style={{padding:"6px 10px",borderRadius:"18px",border:"1px solid",fontSize:"11px",fontWeight:"700",

background:wSubj===s?`${sColor(s)}20`:"rgba(255,255,255,.03)",

borderColor:wSubj===s?sColor(s):"rgba(255,255,255,.08)",color:wSubj===s?sColor(s):"#6b7280"}}>

{s}

/button>

))}

/div>

div className="mode-bar">

{[{id:"photo",ic:"📷",l:"사진"},{id:"draw",ic:"✏️",l:"손그림"},{id:"text",ic:"⌨️",l:"텍스트"}].map(m=>(

button key={m.id} className={`mb${wMode===m.id?" on":""}`} onClick={()=>setWMode(m.id)}>

span className="mic">{m.ic}/span>{m.l}

/button>

))}

/div>

{wMode==="photo"(

div className="card">

div className="ct">📷 사진 오답/div>

div style={{fontSize:"11px",color:"#4b5563",marginBottom:"9px",lineHeight:"1.55"}}>수학 풀이, 틀린 문제지, 선생님 판서, 교과서 — 찍어서 저장!/div>

label style={{display:"block",cursor:"pointer"}}>

div className="photo-area">

{photo?img src={photo} alt="오답"/>:(

div style={{padding:"18px 0"}}>

div style={{fontSize:"34px",marginBottom:"7px"}}>📷/div>

div style={{fontSize:"12px",fontWeight:"700",color:"#a5b4fc",marginBottom:"3px"}}>터치해서 사진 찍기/div>

div style={{fontSize:"10px",color:"#374151"}}>카메라 촬영 또는 갤러리 선택/div>

/div>

)}

/div>

input type="file" accept="image/*" capture="environment" onChange={handlePhoto} style={{display:"none"}}/>

/label>

textarea className="memo" rows={2} placeholder="틀린 이유 한 줄 메모..." value={wMemo} onChange={e=>setWMemo(e.target.value)}/>

button onClick={saveWrong} style={{width:"100%",marginTop:"9px",padding:"12px",borderRadius:"11px",background:"rgba(99,102,241,.2)",border:"1px solid rgba(99,102,241,.3)",color:"#a5b4fc",fontSize:"13px",fontWeight:"700"}}>저장/button>

/div>

)}

{wMode==="draw"(

div className="card">

div className="ct">✏️ 손으로 그리기/div>

div style={{fontSize:"11px",color:"#4b5563",marginBottom:"9px",lineHeight:"1.55"}}>수학 수식, 그래프, 화학식 — 손가락으로 직접 그려요/div>

div style={{display:"flex",gap:"4px",alignItems:"center",marginBottom:"7px",flexWrap:"wrap"}}>

{DRAW_COLORS.map(c=>(

div key={c} className={`color-dot${drawColor===c!isEraser?" on":""}`} style={{background:c,width:"20px",height:"20px"}} onClick={()=>{setDrawColor(c);setIsEraser(false);}}/>

))}

button style={{width:"28px",height:"28px",borderRadius:"7px",background:isEraser?"rgba(99,102,241,.2)":"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.08)",fontSize:"13px"}} onClick={()=>setIsEraser(!isEraser)}>🧹/button>

button style={{width:"28px",height:"28px",borderRadius:"7px",background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.08)",fontSize:"13px"}} onClick={clearCanvas}>🗑/button>

input type="range" min="1" max="12" value={brushSize} onChange={e=>setBrushSize(Number(e.target.value))} style={{flex:1,height:"4px",accentColor:"#6366f1",minWidth:"60px"}}/>

span style={{fontSize:"10px",color:"#6366f1",width:"14px"}}>{brushSize}/span>

/div>

canvas ref={canvasRef} style={{width:"100%",touchAction:"none"}}

onMouseDown={startDraw} onMouseMove={draw} onMouseUp={endDraw} onMouseLeave={endDraw}

onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={endDraw}/>

textarea className="memo" rows={2} placeholder="메모 추가..." value={wMemo} onChange={e=>setWMemo(e.target.value)} style={{marginTop:"8px"}}/>

button onClick={saveWrong} style={{width:"100%",marginTop:"9px",padding:"12px",borderRadius:"11px",background:"rgba(99,102,241,.2)",border:"1px solid rgba(99,102,241,.3)",color:"#a5b4fc",fontSize:"13px",fontWeight:"700"}}>저장/button>

/div>

)}

{wMode==="text"(

div className="card">

div className="ct">⌨️ 텍스트 기록/div>

textarea className="memo" rows={5} placeholder={`${wSubj} 틀린 내용\n\n예) 수학: 행렬 AB≠BA 몰랐음\n예) 영어: 관계대명사 that/which 헷갈림`} value={wText} onChange={e=>setWText(e.target.value)} style={{minHeight:"110px"}}/>

button onClick={saveWrong} style={{width:"100%",marginTop:"9px",padding:"12px",borderRadius:"11px",background:"rgba(99,102,241,.2)",border:"1px solid rgba(99,102,241,.3)",color:"#a5b4fc",fontSize:"13px",fontWeight:"700"}}>저장/button>

/div>

)}

{wrongs.length>0(

>

div style={{fontSize:"13px",fontWeight:"700",color:"#c7d2fe",margin:"15px 0 9px",display:"flex",alignItems:"center",gap:"6px"}}>

📚 저장된 오답 span className="b bi">{wrongs.length}개/span>

/div>

{[...wrongs].reverse().map((w,i)=>(

div key={w.id||i} className="wc">

div className="wch">

span style={{fontSize:"10px",fontWeight:"700",color:sColor(w.subj)}}>{w.subj}/span>

span style={{fontSize:"9px",color:"#4b5563",marginLeft:"auto"}}>{w.date}/span>

span style={{fontSize:"11px",marginLeft:"6px"}}>{w.content.type==="photo"?"📷":w.content.type==="draw"?"✏️":"⌨️"}/span>

button style={{marginLeft:"8px",background:"rgba(239,68,68,.1)",border:"1px solid rgba(239,68,68,.18)",borderRadius:"6px",padding:"3px 9px",fontSize:"10px",color:"#fca5a5"}} onClick={()=>delWrong(w.id)}>삭제/button>

/div>

div className="wcb">

{(w.content.type==="photo"||w.content.type==="draw")w.content.image(

img src={w.content.image} alt="오답" style={{width:"100%",borderRadius:"8px",marginBottom:"6px"}}/>

)}

{w.content.type==="text"div style={{fontSize:"12px",color:"#d1d5db",lineHeight:"1.6",whiteSpace:"pre-wrap"}}>{w.content.text}/div>}

{w.content.memodiv style={{fontSize:"11px",color:"#6b7280",marginTop:"5px",padding:"6px 9px",background:"rgba(99,102,241,.06)",borderRadius:"7px"}}>💬 {w.content.memo}/div>}

/div>

/div>

))}

/>

)}

/div>

)}

nav className="nav">

{TABS.map(n=>(

button key={n.id} className={`nb${tab===n.id?" on":""}`} onClick={()=>setTab(n.id)}>

span className="ic">{n.ic}/span>{n.l}

/button>

))}

/nav>

/>

);  
}

[https://www.instagram.com/p/DZCEqk4GtUu/?igsh=MXc2cG93OTJnMGFuaQ==](https://www.instagram.com/p/DZCEqk4GtUu/?igsh=MXc2cG93OTJnMGFuaQ==) [https://www.threads.com/@coffeemoms/post/DZCFAx0k6_4?xmt=AQG0z5bq8rfsmxvjcqlZO-jt5mOZJ-PpC5eazl1jPSALzTx0958jyIp-ePDPdPIvzLBDAnDOslof=1](https://www.threads.com/@coffeemoms/post/DZCFAx0k6_4?xmt=AQG0z5bq8rfsmxvjcqlZO-jt5mOZJ-PpC5eazl1jPSALzTx0958jyIp-ePDPdPIvzLBDAnDOslof=1)

Threads

[이선애 COFFEEMOMS 커피맘스 (@coffeemoms) on Threads](https://www.threads.com/@coffeemoms/post/DZCFAx0k6_4?xmt=AQG0z5bq8rfsmxvjcqlZO-jt5mOZJ-PpC5eazl1jPSALzTx0958jyIp-ePDPdPIvzLBDAnDOslof=1)

미션2: 제목>

Summary

최종 구현 결과물

과정 (타임라인별 + 삽질)

공유할만한 인사이트

![(null)](file:///C:\Users\user\AppData\Local\Temp\DRW000092e86b57.gif)

미션3: 제목>

Summary

최종 구현 결과물

과정 (타임라인별 + 삽질)

공유할만한 인사이트

### Summary

### 최종 구현 결과물

### 과정 (타임라인별 + 삽질)

### 공유할만한 인사이트

---

## 미션2: <제목>

### Summary

### 최종 구현 결과물

### 과정 (타임라인별 + 삽질)

### 공유할만한 인사이트

---

## 미션3: <제목>

### Summary

### 최종 구현 결과물

### 과정 (타임라인별 + 삽질)

### 공유할만한 인사이트
