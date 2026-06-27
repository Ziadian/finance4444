import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, onSnapshot, setDoc } from "firebase/firestore";
import useSWR from "swr";

// ============================================================
// 🔥 FIREBASE CONFIG
// ============================================================
const firebaseConfig = {
  apiKey: "AIzaSyDTeZ7tn9ewhRctgJY-Dyk_qs6Js0wPk6w",
  authDomain: "financial-cd762.firebaseapp.com",
  projectId: "financial-cd762",
  storageBucket: "financial-cd762.firebasestorage.app",
  messagingSenderId: "373396537545",
  appId: "1:373396537545:web:2019a70625fa69dbeb8d18",
  measurementId: "G-W1KHVD3KPE",
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const AUTHORIZED_USERS = { Threewit: "zxc", hi: "hi" };

// ============================================================
// 💾 LOCALSTORAGE
// ============================================================
const LS = {
  USER: "tw_user", TAB: "tw_tab", TXS: "tw_cache_txs",
  PORTFOLIO: "tw_cache_portfolio", RATE: "tw_cache_rate",
  LAST_SAVE: "tw_last_saved", HIDE_BALANCE: "tw_hide_balance",
};
const lsGet = (k, fb) => { try { const r = localStorage.getItem(k); return r === null ? fb : JSON.parse(r); } catch { return fb; } };
const lsSet = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

// ============================================================
// 📊 CONSTANTS
// ============================================================
const CATEGORIES = {
  food:      { label: "อาหาร",    icon: "🍜", color: "#f5a623" },
  transport: { label: "เดินทาง",  icon: "🚗", color: "#4b8fff" },
  shopping:  { label: "ช้อปปิ้ง", icon: "🛍️", color: "#a78bfa" },
  bills:     { label: "ค่าบิล",   icon: "📄", color: "#f44060" },
  health:    { label: "สุขภาพ",   icon: "💊", color: "#00d4a0" },
  invest:    { label: "ลงทุน",    icon: "📈", color: "#4b8fff" },
  income:    { label: "รายรับ",   icon: "💰", color: "#00d4a0" },
  other:     { label: "อื่นๆ",    icon: "💸", color: "#6b7280" },
};
const BUDGETS = [
  { cat: "food", limit: 5000 }, { cat: "transport", limit: 3000 },
  { cat: "shopping", limit: 4000 }, { cat: "bills", limit: 10000 }, { cat: "health", limit: 2000 },
];
const LOGO_COLORS = [
  ["#1a3a2e","#00d4a0"],["#2a1a3e","#a78bfa"],["#1a2a3e","#4b8fff"],["#3e1a1a","#f44060"],
  ["#3e2e1a","#f5a623"],["#1a3e2a","#00c48c"],["#2e1a3e","#c084fc"],["#3e1a2e","#f472b6"],
];

// ============================================================
// 🛠 UTILITY FUNCTIONS
// ============================================================
const getLogoStyle = (sym) => { const i = (sym||"X").charCodeAt(0) % LOGO_COLORS.length; return { bg: LOGO_COLORS[i][0], color: LOGO_COLORS[i][1] }; };
const fmt = (n, d = 2) => { const v = parseFloat(n); return isNaN(v) ? "0.00" : v.toLocaleString("th-TH", { minimumFractionDigits: d, maximumFractionDigits: d }); };
const fmtUSD = (n, d = 2) => { const v = parseFloat(n); return isNaN(v) ? "0.00" : v.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d }); };
const fmtShares = (n) => { const v = parseFloat(n); return isNaN(v) ? "0.0000000" : v.toFixed(7); };
const fmtTime = (d) => d ? d.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit", second: "2-digit" }) : "";
const fmtDate = (s) => s ? new Date(s).toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "2-digit" }) : "";
const guessCategory = (t) => {
  const s = t.toLowerCase();
  if (/grab|taxi|bts|mrt|uber/.test(s)) return "transport";
  if (/netflix|spotify|true|ais|dtac|ค่าน้ำ|ค่าไฟ|internet/.test(s)) return "bills";
  if (/โรง|hospital|clinic|ยา|pharma/.test(s)) return "health";
  if (/lazada|shopee|central|สยาม/.test(s)) return "shopping";
  if (/ร้าน|food|กาแฟ|coffee|ข้าว/.test(s)) return "food";
  if (/หุ้น|stock|กองทุน|invest/.test(s)) return "invest";
  return "other";
};

function parseMakeSMS(sms) {
  const text = sms.trim(); const result = { valid: false };
  const investMatch = text.match(/ซื้อ|buy|invest/i);
  const incomeMatch = text.match(/รับโอน|รับชำระ|เงินเข้า|deposit|received/i);
  const amtMatch = text.match(/(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)[\s]*(?:บาท|THB|฿)/i) || text.match(/(\d{1,3}(?:,\d{3})*\.\d{2})/);
  const dateMatch = text.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/);
  const refMatch = text.match(/(?:ที่|จาก|ไปยัง|to|from|Ref)[\:\s]*([^\n]+)/i);
  if (amtMatch) {
    result.valid = true;
    result.amount = parseFloat(amtMatch[1].replace(/,/g, ""));
    if (investMatch) {
      result.type = "expense"; result.cat = "invest";
      const sym = text.match(/\b([A-Z]{2,10})\b/); if (sym) result.symbol = sym[1];
      const sh = text.match(/(\d+(?:\.\d+)?)\s*หุ้น/); if (sh) result.shares = parseFloat(sh[1]);
    } else if (incomeMatch) { result.type = "income"; result.cat = "income"; }
    else { result.type = "expense"; result.cat = guessCategory(refMatch ? refMatch[1] : text); }
    result.date = dateMatch
      ? `${dateMatch[3].length===2?"20"+dateMatch[3]:dateMatch[3]}-${String(dateMatch[2]).padStart(2,"0")}-${String(dateMatch[1]).padStart(2,"0")}`
      : new Date().toISOString().slice(0,10);
    result.merchant = refMatch ? refMatch[1].trim().slice(0,40) : (investMatch ? "Invest Transaction" : "MAKE Transaction");
  }
  return result;
}

// ============================================================
// 🔌 CUSTOM HOOKS — REAL-TIME
// ============================================================
const FINNHUB_KEY = "d7sandpr01qorsvi1jagd7sandpr01qorsvi1jb0";

function useMarketData(symbols) {
  const syms = (symbols||[]).filter(Boolean);
  const key = syms.length > 0 ? `market:${syms.sort().join(",")}` : null;
  const { data, isLoading, mutate } = useSWR(key, async () => {
    const results = await Promise.all(syms.map(sym =>
      fetch(`https://finnhub.io/api/v1/quote?symbol=${sym}&token=${FINNHUB_KEY}`)
        .then(r => r.json())
        .then(d => ({ symbol: sym, price: parseFloat(d.c)||0, change: parseFloat(d.d)||0, pct: parseFloat(d.dp)||0, prevClose: parseFloat(d.pc)||0 }))
        .catch(() => ({ symbol: sym, price: 0, change: 0, pct: 0, prevClose: 0 }))
    ));
    const map = {}; results.forEach(r => { if (r.price > 0) map[r.symbol] = r; }); return map;
  }, { refreshInterval: 30000, revalidateOnFocus: true, revalidateOnReconnect: true, dedupingInterval: 15000, fallbackData: {} });
  return { prices: data||{}, isLoading, refresh: mutate };
}

function useFXRate(fallback = 33.27) {
  const { data, isLoading } = useSWR("fxrate:usd-thb",
    () => fetch("https://open.er-api.com/v6/latest/USD").then(r=>r.json())
      .then(d => d?.result==="success" && typeof d.rates?.THB==="number" ? parseFloat(d.rates.THB) : fallback)
      .catch(() => fallback),
    { refreshInterval: 5*60*1000, revalidateOnFocus: false, dedupingInterval: 60000, fallbackData: fallback }
  );
  return { rate: data??fallback, isLoading };
}

function usePortfolioCalc(holdings, prices, fxRate) {
  return useMemo(() => {
    const safeRate = parseFloat(fxRate)||33.27;
    const rows = holdings.map(h => {
      const px = prices[h.symbol];
      const livePrice = px?.price > 0 ? px.price : 0;
      const hasLive = livePrice > 0;
      const displayPrice = hasLive ? livePrice : parseFloat(h.avgCost)||0;
      const sh = parseFloat(h.shares)||0, avgC = parseFloat(h.avgCost)||0;
      const mktValUSD = displayPrice*sh, costValUSD = avgC*sh;
      const mktValTHB = mktValUSD*safeRate, costValTHB = costValUSD*safeRate;
      const pnlTHB = hasLive ? mktValTHB-costValTHB : 0;
      const pnlPct = hasLive && costValTHB!==0 ? (pnlTHB/costValTHB)*100 : 0;
      return { ...h, livePrice, hasLive, mktValUSD, costValUSD, mktValTHB, costValTHB, pnlTHB, pnlPct, dayChangePct: px?.pct||0, dayChangeAbs: px?.change||0 };
    });
    const totalValTHB = rows.reduce((s,r)=>s+r.mktValTHB,0);
    const totalCostTHB = rows.reduce((s,r)=>s+r.costValTHB,0);
    const totalPnLTHB = totalValTHB-totalCostTHB;
    const totalPnLPct = totalCostTHB>0 ? (totalPnLTHB/totalCostTHB)*100 : 0;
    const dayChangeTHB = rows.reduce((s,r)=>s+(r.dayChangePct/100)*r.mktValTHB,0);
    const dayChangePct = totalValTHB>0 ? (dayChangeTHB/(totalValTHB-dayChangeTHB))*100 : 0;
    const rowsSorted = [...rows].sort((a,b)=>b.mktValTHB-a.mktValTHB);
    const rowsWithAlloc = rowsSorted.map(r=>({ ...r, allocPct: totalValTHB>0 ? (r.mktValTHB/totalValTHB)*100 : 0 }));
    return { rows: rowsWithAlloc, totalValTHB, totalCostTHB, totalPnLTHB, totalPnLPct, dayChangePct, dayChangeTHB };
  }, [holdings, prices, fxRate]);
}

// ============================================================
// 🎨 SVG ICONS
// ============================================================
const Icon = {
  Eye: ({open=true,sz=20,c="currentColor"}) => open
    ? <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
    : <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>,
  ChevronDown: ({sz=16,c="currentColor",r=0}) => <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{transform:`rotate(${r}deg)`,transition:"transform 0.25s"}}><polyline points="6 9 12 15 18 9"/></svg>,
  Home: ({sz=22}) => <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  TrendUp: ({sz=22}) => <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  Dollar: ({sz=22}) => <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  Target: ({sz=22}) => <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
  User: ({sz=22}) => <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Plus: ({sz=18}) => <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Trash: ({sz=16}) => <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>,
  Edit: ({sz=16}) => <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  SMS: ({sz=22}) => <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  Refresh: ({sz=14}) => <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>,
  LogOut: ({sz=18}) => <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  Download: ({sz=16}) => <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  Upload: ({sz=16}) => <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
  Pie: ({sz=22}) => <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>,
};

// ============================================================
// 🧩 SHARED COMPONENTS
// ============================================================
function StockLogo({ symbol, size=42 }) {
  const { bg, color } = getLogoStyle(symbol||"?");
  return (
    <div className="flex-shrink-0 rounded-full flex items-center justify-center font-bold border"
      style={{ width:size, height:size, background:bg, color, fontSize:size*0.28, borderColor:"rgba(255,255,255,0.08)", fontFamily:"'Space Grotesk',sans-serif" }}>
      {(symbol||"??").slice(0,2).toUpperCase()}
    </div>
  );
}

function Pill({ children, color="#00d4a0" }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold"
      style={{ background:`${color}18`, color, border:`1px solid ${color}30`, fontFamily:"'Space Mono',monospace" }}>
      {children}
    </span>
  );
}

function StatCard({ label, value, sub, pill, pillColor="#00d4a0", accent="#00d4a0", loading=false }) {
  return (
    <div className="dime-card p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background:accent }}/>
      <div className="absolute top-0 right-0 w-20 h-20 rounded-full pointer-events-none"
        style={{ background:`radial-gradient(circle,${accent}10 0%,transparent 70%)`, transform:"translate(30%,-30%)" }}/>
      <div className="text-xs font-mono uppercase tracking-widest mb-2" style={{ color:"var(--dime-muted)", fontSize:10 }}>{label}</div>
      {loading
        ? <div className="skeleton h-7 w-32 rounded mb-2"/>
        : <div className="text-2xl font-bold font-head tracking-tight" style={{ color:"var(--dime-text)", letterSpacing:"-0.02em" }}>{value}</div>
      }
      {sub && <div className="text-xs mt-1 font-mono" style={{ color:"var(--dime-muted)" }}>{sub}</div>}
      {pill && <div className="mt-2"><Pill color={pillColor}>{pill}</Pill></div>}
    </div>
  );
}

function SectionTitle({ children, action }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-sm font-semibold font-head" style={{ color:"var(--dime-text)" }}>{children}</h2>
      {action}
    </div>
  );
}

function EmptyState({ icon, title, sub }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 gap-3 text-center">
      <div className="text-4xl">{icon}</div>
      <div className="text-sm font-semibold font-thai" style={{ color:"var(--dime-text)" }}>{title}</div>
      <div className="text-xs font-thai max-w-xs" style={{ color:"var(--dime-muted)" }}>{sub}</div>
    </div>
  );
}

function DonutChart({ data, size=120 }) {
  const total = data.reduce((s,d)=>s+d.value,0);
  if (!total) return <svg width={size} height={size}/>;
  let acc = 0;
  const arcs = data.map(d=>{ const pct=d.value/total; const start=acc; acc+=pct; return {...d,pct,start}; });
  const cx=size/2,cy=size/2,r=size*0.38,inner=size*0.25;
  const slice=(s,p)=>{
    if(p===1) return `M ${cx} ${cy-r} A ${r} ${r} 0 1 1 ${cx} ${cy+r} A ${r} ${r} 0 1 1 ${cx} ${cy-r} Z`;
    const a1=s*2*Math.PI-Math.PI/2, a2=(s+p)*2*Math.PI-Math.PI/2;
    const x1=cx+r*Math.cos(a1),y1=cy+r*Math.sin(a1),x2=cx+r*Math.cos(a2),y2=cy+r*Math.sin(a2);
    const ix1=cx+inner*Math.cos(a1),iy1=cy+inner*Math.sin(a1),ix2=cx+inner*Math.cos(a2),iy2=cy+inner*Math.sin(a2);
    const lg=p>0.5?1:0;
    return `M ${ix1} ${iy1} L ${x1} ${y1} A ${r} ${r} 0 ${lg} 1 ${x2} ${y2} L ${ix2} ${iy2} A ${inner} ${inner} 0 ${lg} 0 ${ix1} ${iy1} Z`;
  };
  return (
    <svg width={size} height={size} className="flex-shrink-0">
      {arcs.map((a,i)=><path key={i} d={slice(a.start,a.pct)} fill={a.color} opacity={0.9}/>)}
      <circle cx={cx} cy={cy} r={inner-3} fill="var(--dime-card)"/>
    </svg>
  );
}

// ============================================================
// 🏠 PAGE: DASHBOARD
// ============================================================
function DashboardPage({ txs, portfolio, livePrices, pricesLoading, fxRate, hideBalance }) {
  const safeRate = parseFloat(fxRate)||33.27;
  const { totalValTHB, totalPnLTHB, totalPnLPct } = usePortfolioCalc(portfolio, livePrices, fxRate);
  const income = txs.filter(t=>(parseFloat(t.amount)||0)>0).reduce((s,t)=>s+(parseFloat(t.amount)||0),0);
  const expense = txs.filter(t=>(parseFloat(t.amount)||0)<0).reduce((s,t)=>s+Math.abs(parseFloat(t.amount)||0),0);
  const bankBal = txs.reduce((s,t)=>s+(parseFloat(t.amount)||0),0);
  const netWorth = bankBal + totalValTHB;
  const allocData = [
    { label:"เงินสด", value:Math.max(bankBal,0), color:"#4b8fff" },
    { label:"หุ้น US", value:totalValTHB, color:"#00d4a0" },
  ].filter(d=>d.value>0);

  const stats = [
    { label:"NET WORTH รวม", value:pricesLoading?"...":  `฿${fmt(netWorth)}`, sub:"ทรัพย์สินสุทธิทั้งหมด", pill: pricesLoading?"Live":"Live", pillColor:"#00d4a0", accent:"#00d4a0" },
    { label:"เงินฝาก (Cash)", value:`฿${fmt(bankBal)}`, sub:"ยอดสะสมจากรายการ", pill:"สภาพคล่อง", pillColor:"#4b8fff", accent:"#4b8fff" },
    { label:"มูลค่าพอร์ต", value:pricesLoading?"...": `฿${fmt(totalValTHB)}`, sub:`P&L: ${totalPnLPct>=0?"+":""}${totalPnLPct.toFixed(1)}%`, pill:`${totalPnLPct>=0?"+":""}${totalPnLPct.toFixed(1)}%`, pillColor:totalPnLPct>=0?"#00d4a0":"#f44060", accent:"#a78bfa" },
    { label:"รายจ่ายเดือนนี้", value:`฿${fmt(expense)}`, sub:`รายรับ: ฿${fmt(income)}`, pill:expense>30000?"เกินงบ":"ในงบ", pillColor:expense>30000?"#f44060":"#00d4a0", accent:expense>30000?"#f44060":"#f5a623" },
  ];

  return (
    <div className="space-y-5">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((s,i)=>( <StatCard key={i} {...s} loading={pricesLoading && (i===0||i===2)}/> ))}
      </div>

      {/* Allocation + Recent Txs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Allocation */}
        <div className="dime-card p-4">
          <SectionTitle>การจัดสรรสินทรัพย์</SectionTitle>
          {allocData.length===0
            ? <EmptyState icon="📊" title="ยังไม่มีข้อมูล" sub="เพิ่มรายการและหุ้นเพื่อดูการจัดสรร"/>
            : <div className="flex items-center gap-4">
                <DonutChart data={allocData} size={120}/>
                <div className="flex-1 space-y-2.5">
                  {allocData.map((d,i)=>(
                    <div key={i} className="flex items-center gap-2.5">
                      <div className="w-2 h-2 rounded-sm flex-shrink-0" style={{ background:d.color }}/>
                      <span className="text-xs font-thai flex-1" style={{ color:"var(--dime-muted)" }}>{d.label}</span>
                      <span className={`text-xs font-mono font-semibold ${hideBalance?"blurred":""}`} style={{ color:"var(--dime-text)" }}>฿{fmt(d.value)}</span>
                    </div>
                  ))}
                  <div className="h-px mt-1" style={{ background:"var(--dime-border)" }}/>
                  <div className="flex items-center gap-2.5">
                    <div className="w-2 h-2 rounded-sm flex-shrink-0 opacity-0"/>
                    <span className="text-xs font-thai flex-1 font-semibold" style={{ color:"var(--dime-text)" }}>รวม</span>
                    <span className={`text-xs font-mono font-bold ${hideBalance?"blurred":""}`} style={{ color:"var(--dime-green)" }}>฿{fmt(netWorth)}</span>
                  </div>
                </div>
              </div>
          }
        </div>

        {/* Recent Transactions */}
        <div className="dime-card p-4">
          <SectionTitle>รายการล่าสุด</SectionTitle>
          {txs.length===0
            ? <EmptyState icon="📭" title="ยังไม่มีรายการ" sub="เพิ่มรายรับ-รายจ่ายที่แท็บเงินสด"/>
            : <div className="space-y-1">
                {txs.slice(0,5).map(tx=>{
                  const cat = CATEGORIES[tx.cat]||CATEGORIES.other;
                  const isPos = parseFloat(tx.amount)>0;
                  return (
                    <div key={tx.id} className="flex items-center gap-3 py-2 border-b last:border-0" style={{ borderColor:"var(--dime-border)" }}>
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center text-base flex-shrink-0" style={{ background:`${cat.color}18` }}>{cat.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold font-head truncate" style={{ color:"var(--dime-text)" }}>{tx.desc}</div>
                        <div className="text-xs font-mono" style={{ color:"var(--dime-muted)", fontSize:10 }}>{fmtDate(tx.date)} · {cat.label}</div>
                      </div>
                      <div className={`text-xs font-bold font-head ${hideBalance?"blurred":""}`} style={{ color:isPos?"var(--dime-green)":"var(--dime-text)", flexShrink:0 }}>
                        {isPos?"+":""}฿{fmt(Math.abs(parseFloat(tx.amount)))}
                      </div>
                    </div>
                  );
                })}
              </div>
          }
        </div>
      </div>

      {/* Summary table */}
      <div className="dime-card p-4 overflow-x-auto">
        <SectionTitle>ภาพรวมสินทรัพย์</SectionTitle>
        <table className="w-full text-xs">
          <thead>
            <tr>
              {["บัญชี","ประเภท","มูลค่า (฿)","% รวม"].map(h=>(
                <th key={h} className="pb-2 text-left font-mono uppercase tracking-wider" style={{ color:"var(--dime-dim)", fontSize:9, borderBottom:"1px solid var(--dime-border)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              { name:"เงินฝาก (Cash)", tag:"เงินสด", tagColor:"#4b8fff", val:bankBal },
              { name:"พอร์ตหุ้น US", tag:"หุ้น", tagColor:"#00d4a0", val:totalValTHB },
            ].map((row,i)=>(
              <tr key={i}>
                <td className="py-2 font-thai font-medium" style={{ color:"var(--dime-text)" }}>{row.name}</td>
                <td className="py-2"><Pill color={row.tagColor}>{row.tag}</Pill></td>
                <td className={`py-2 font-mono font-semibold text-right ${hideBalance?"blurred":""}`} style={{ color:"var(--dime-text)" }}>฿{fmt(row.val)}</td>
                <td className="py-2 font-mono text-right" style={{ color:"var(--dime-muted)" }}>{netWorth>0?((row.val/netWorth)*100).toFixed(1):0}%</td>
              </tr>
            ))}
            <tr style={{ borderTop:"1px solid var(--dime-border2)" }}>
              <td className="pt-2 font-thai font-bold" style={{ color:"var(--dime-text)" }}>Net Worth รวม</td>
              <td/>
              <td className={`pt-2 font-mono font-bold text-right ${hideBalance?"blurred":""}`} style={{ color:"var(--dime-green)" }}>฿{fmt(netWorth)}</td>
              <td className="pt-2 font-mono font-bold text-right" style={{ color:"var(--dime-green)" }}>100%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============================================================
// 📈 PAGE: PORTFOLIO (Dime Style)
// ============================================================
function AssetRow({ row, hideBalance, onBuySell }) {
  const [expanded, setExpanded] = useState(false);
  const isPnLPos = row.pnlTHB >= 0, isDayPos = row.dayChangePct >= 0;
  return (
    <div style={{ borderBottom:"1px solid var(--dime-border)" }} className="last:border-0">
      <div className="flex items-center gap-3 px-4 py-3.5 cursor-pointer hover:bg-white/[0.02] transition-colors" onClick={()=>setExpanded(e=>!e)}>
        <StockLogo symbol={row.symbol} size={42}/>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-bold font-head" style={{ color:"var(--dime-text)" }}>{row.symbol}</div>
          <div className="text-xs mt-0.5" style={{ color:"var(--dime-muted)", fontSize:11 }}>
            ☆ {hideBalance?"**.**%":`${row.allocPct.toFixed(2)}%`}
          </div>
        </div>
        <div className="flex flex-col items-end gap-0.5">
          <span className={`text-sm font-semibold font-head ${hideBalance?"blurred":""}`} style={{ color:"var(--dime-text)" }}>฿{fmt(row.mktValTHB)}</span>
          <span className="text-xs" style={{ color:"var(--dime-muted)", fontSize:11 }}>≈ {hideBalance?"*** USD":`${fmtUSD(row.mktValUSD)} USD`}</span>
          <span className="text-xs font-mono font-semibold" style={{ color:isPnLPos?"var(--dime-green)":"var(--dime-red)", fontSize:11 }}>
            {isPnLPos?"▲":"▼"} {hideBalance?"**.**%":`${Math.abs(row.pnlPct).toFixed(2)}%`}
          </span>
          {!hideBalance && <span className="text-xs font-mono" style={{ color:isPnLPos?"var(--dime-green)":"var(--dime-red)", fontSize:10, opacity:0.8 }}>
            ({isPnLPos?"+":"-"}฿{fmt(Math.abs(row.pnlTHB))})
          </span>}
        </div>
        <Icon.ChevronDown sz={13} c="var(--dime-dim)" r={expanded?180:0}/>
      </div>

      {expanded && (
        <div className="px-4 pb-4 animate-fade-in">
          <div className="detail-grid">
            <div className="detail-cell">
              <div className="text-xs mb-1 font-thai" style={{ color:"var(--dime-muted)", fontSize:10 }}>จำนวนหุ้นคงเหลือ</div>
              <div className={`text-sm font-mono font-semibold ${hideBalance?"blurred":""}`} style={{ color:"var(--dime-text)" }}>{fmtShares(row.shares)}</div>
            </div>
            <div className="detail-cell">
              <div className="text-xs mb-1 font-thai" style={{ color:"var(--dime-muted)", fontSize:10 }}>ราคา (USD) + % 1 วัน</div>
              <div className="text-sm font-mono font-semibold" style={{ color:"var(--dime-text)" }}>${fmtUSD(row.livePrice)}</div>
              <div className="text-xs font-mono mt-0.5" style={{ color:isDayPos?"var(--dime-green)":"var(--dime-red)", fontSize:11 }}>
                {isDayPos?"▲":"▼"} {Math.abs(row.dayChangePct).toFixed(2)}%
              </div>
            </div>
            <div className="detail-cell">
              <div className="text-xs mb-1 font-thai" style={{ color:"var(--dime-muted)", fontSize:10 }}>ต้นทุนต่อหุ้น (USD)</div>
              <div className="text-sm font-mono font-semibold" style={{ color:"var(--dime-text)" }}>${fmtUSD(row.avgCost)}</div>
            </div>
            <div className="detail-cell" style={{ position:"relative" }}>
              <div className="text-xs mb-1 font-thai" style={{ color:"var(--dime-muted)", fontSize:10 }}>ต้นทุนรวม (USD)</div>
              <div className={`text-sm font-mono font-semibold ${hideBalance?"blurred":""}`} style={{ color:"var(--dime-text)" }}>${fmtUSD(row.costValUSD)}</div>
              <button onClick={e=>{e.stopPropagation();onBuySell(row);}}
                className="absolute bottom-2 right-2 px-2.5 py-1 rounded-lg text-xs font-thai font-semibold"
                style={{ background:"rgba(0,212,160,0.1)", color:"var(--dime-green)", border:"1px solid rgba(0,212,160,0.25)", fontSize:11 }}>
                ซื้อ-ขาย
              </button>
            </div>
          </div>
          <div className="mt-3">
            <div className="flex justify-between mb-1">
              <span className="text-xs font-thai" style={{ color:"var(--dime-muted)", fontSize:10 }}>สัดส่วนพอร์ต</span>
              <span className="text-xs font-mono" style={{ color:"var(--dime-text)", fontSize:10 }}>{row.allocPct.toFixed(2)}%</span>
            </div>
            <div className="pct-bar"><div className="pct-bar-fill" style={{ width:`${Math.min(row.allocPct,100)}%` }}/></div>
          </div>
        </div>
      )}
    </div>
  );
}

function PortfolioPage({ portfolio, setPortfolio, livePrices, pricesLoading, fxRate, fxLoading, hideBalance }) {
  const [buySellTarget, setBuySellTarget] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [sortBy, setSortBy] = useState("value");

  const { rows, totalValTHB, totalCostTHB, totalPnLTHB, totalPnLPct, dayChangePct } = usePortfolioCalc(portfolio, livePrices, fxRate);
  const sortedRows = useMemo(()=>{
    switch(sortBy){
      case "pnl": return [...rows].sort((a,b)=>b.pnlTHB-a.pnlTHB);
      case "pnlpct": return [...rows].sort((a,b)=>b.pnlPct-a.pnlPct);
      case "day": return [...rows].sort((a,b)=>b.dayChangePct-a.dayChangePct);
      default: return [...rows].sort((a,b)=>b.mktValTHB-a.mktValTHB);
    }
  },[rows,sortBy]);

  const isPnLPos = totalPnLTHB >= 0, isDayPos = dayChangePct >= 0;

  function handleBuySell({ symbol, mode, shares, priceUSD }) {
    setPortfolio(prev => {
      const ex = prev.find(p=>p.symbol===symbol);
      if(mode==="buy"){
        if(ex){ const ns=parseFloat(ex.shares)+shares; return prev.map(p=>p.symbol===symbol?{...p,shares:ns,avgCost:(parseFloat(ex.avgCost)*parseFloat(ex.shares)+priceUSD*shares)/ns}:p); }
        return [...prev,{symbol,shares,avgCost:priceUSD,exchange:"US"}];
      } else {
        if(!ex) return prev;
        const ns = parseFloat(ex.shares)-shares;
        if(ns<=0) return prev.filter(p=>p.symbol!==symbol);
        return prev.map(p=>p.symbol===symbol?{...p,shares:ns}:p);
      }
    });
  }

  function handleAdd({ symbol, shares, avgCost }) {
    setPortfolio(prev => {
      const ex = prev.find(p=>p.symbol===symbol);
      if(ex){ const ns=parseFloat(ex.shares)+shares; return prev.map(p=>p.symbol===symbol?{...p,shares:ns,avgCost:(parseFloat(ex.avgCost)*parseFloat(ex.shares)+avgCost*shares)/ns}:p); }
      return [...prev,{symbol,shares,avgCost,exchange:"US"}];
    });
  }

  function handleDelete(sym) {
    if(window.confirm(`⚠️ ลบ ${sym} ออกจากพอร์ต?`)) setPortfolio(prev=>prev.filter(p=>p.symbol!==sym));
  }

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="summary-card">
        <div className="px-5 pt-5 pb-3">
          <div className="text-xs font-mono mb-2" style={{ color:"var(--dime-muted)" }}>มูลค่าพอร์ตรวม</div>
          <div className={`text-4xl font-bold font-head tracking-tight ${hideBalance?"blurred":""}`} style={{ color:"var(--dime-text)",letterSpacing:"-0.02em" }}>
            {pricesLoading?"...":fmt(totalValTHB,2)}{" "}
            <span className="text-lg font-normal" style={{ color:"var(--dime-muted)" }}>THB</span>
          </div>
          <div className="flex flex-wrap gap-3 mt-2.5">
            <span className="text-xs font-mono" style={{ color:isDayPos?"var(--dime-green)":"var(--dime-red)" }}>
              {isDayPos?"▲":"▼"} {hideBalance?"**.**%":`${Math.abs(dayChangePct).toFixed(2)}%`} วันนี้
            </span>
            <span className="text-xs font-mono" style={{ color:isPnLPos?"var(--dime-green)":"var(--dime-red)" }}>
              P&L {isPnLPos?"+":""}{hideBalance?"**.**%":`${totalPnLPct.toFixed(2)}%`} {hideBalance?"":` (${isPnLPos?"+":"-"}฿${fmt(Math.abs(totalPnLTHB))})`}
            </span>
          </div>
        </div>
        <div className="fx-bar">
          <div className="flex items-center gap-2">
            <span className="text-lg">🇺🇸</span>
            <span className="text-xs font-thai" style={{ color:"var(--dime-muted)" }}>
              1 USD = <span className="font-semibold" style={{ color:"var(--dime-text)" }}>{fxLoading?"...":fxRate?.toFixed(2)} THB</span>
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            {pricesLoading
              ? <span className="text-xs font-mono" style={{ color:"var(--dime-gold)", fontSize:10 }}>● อัปเดต...</span>
              : <span className="text-xs font-mono" style={{ color:"var(--dime-green)", fontSize:10 }}>● Live</span>
            }
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label:"จำนวนหุ้น",value:`${portfolio.length} รายการ`,accent:"#4b8fff" },
          { label:"ต้นทุนรวม",value:`฿${fmt(totalCostTHB)}`,accent:"#a78bfa" },
          { label:"กำไร/ขาดทุน",value:`${isPnLPos?"+":""}฿${fmt(totalPnLTHB)}`,accent:isPnLPos?"#00d4a0":"#f44060" },
          { label:"% กำไร/ขาดทุน",value:`${isPnLPos?"+":""}${totalPnLPct.toFixed(2)}%`,accent:isPnLPos?"#00d4a0":"#f44060" },
        ].map((s,i)=>(
          <div key={i} className="dime-card p-3" style={{ borderTop:`2px solid ${s.accent}` }}>
            <div className="text-xs font-mono mb-1" style={{ color:"var(--dime-muted)", fontSize:10, textTransform:"uppercase", letterSpacing:"0.08em" }}>{s.label}</div>
            <div className={`text-sm font-bold font-head ${hideBalance&&i>0?"blurred":""}`} style={{ color:"var(--dime-text)" }}>{pricesLoading&&i>0?"...":s.value}</div>
          </div>
        ))}
      </div>

      {/* Asset List */}
      <div className="dime-card overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom:"1px solid var(--dime-border)" }}>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-thai" style={{ color:"var(--dime-muted)", fontSize:11 }}>เรียงตาม:</span>
            <select className="dime-select text-xs font-semibold font-thai" style={{ color:"var(--dime-text)", fontSize:12 }} value={sortBy} onChange={e=>setSortBy(e.target.value)}>
              <option value="value">มูลค่าสินทรัพย์</option>
              <option value="pnl">กำไร/ขาดทุน (฿)</option>
              <option value="pnlpct">กำไร/ขาดทุน (%)</option>
              <option value="day">เปลี่ยนแปลงวันนี้</option>
            </select>
          </div>
          <button onClick={()=>setShowAdd(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold font-thai"
            style={{ background:"rgba(0,212,160,0.1)", color:"var(--dime-green)", border:"1px solid rgba(0,212,160,0.25)" }}>
            <Icon.Plus sz={13}/> เพิ่มหุ้น
          </button>
        </div>

        {sortedRows.length===0
          ? <EmptyState icon="📈" title="ยังไม่มีหุ้นในพอร์ต" sub="กดปุ่ม 'เพิ่มหุ้น' เพื่อเริ่มต้น"/>
          : sortedRows.map(row=>(
              <AssetRow key={row.symbol} row={row} hideBalance={hideBalance}
                onBuySell={r=>setBuySellTarget(r)}/>
            ))
        }
      </div>

      {/* Delete buttons for desktop */}
      {sortedRows.length > 0 && (
        <div className="dime-card p-4 hidden md:block">
          <SectionTitle>จัดการพอร์ต</SectionTitle>
          <div className="space-y-2">
            {sortedRows.map(row=>(
              <div key={row.symbol} className="flex items-center justify-between py-1.5">
                <div className="flex items-center gap-2">
                  <StockLogo symbol={row.symbol} size={28}/>
                  <span className="text-sm font-bold font-head" style={{ color:"var(--dime-text)" }}>{row.symbol}</span>
                  <span className="text-xs font-mono" style={{ color:"var(--dime-muted)" }}>{fmtShares(row.shares)} หุ้น</span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={()=>setBuySellTarget(row)}
                    className="px-3 py-1 rounded-lg text-xs font-thai"
                    style={{ background:"rgba(0,212,160,0.1)", color:"var(--dime-green)", border:"1px solid rgba(0,212,160,0.25)" }}>
                    ซื้อ-ขาย
                  </button>
                  <button onClick={()=>handleDelete(row.symbol)}
                    className="p-1.5 rounded-lg"
                    style={{ background:"rgba(244,64,96,0.1)", color:"var(--dime-red)" }}>
                    <Icon.Trash sz={14}/>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      {buySellTarget && <BuySellModal holding={buySellTarget} onClose={()=>setBuySellTarget(null)} onConfirm={handleBuySell} fxRate={fxRate}/>}
      {showAdd && <AddHoldingModal onClose={()=>setShowAdd(false)} onAdd={handleAdd} fxRate={fxRate}/>}
    </div>
  );
}

// ============================================================
// 💳 PAGE: TRANSACTIONS + SMS
// ============================================================
function TransactionsPage({ txs, setTxs, portfolio, setPortfolio, fxRate }) {
  const [subTab, setSubTab] = useState("list"); // "list" | "add" | "sms"
  const [desc, setDesc] = useState(""), [amount, setAmount] = useState(""), [cat, setCat] = useState("food");
  const [type, setType] = useState("var"), [txSign, setTxSign] = useState("-"), [editId, setEditId] = useState(null);
  const [filter, setFilter] = useState("all");
  const [sms, setSms] = useState(""), [smsResult, setSmsResult] = useState(null), [smsAdded, setSmsAdded] = useState(false);

  const totalIn = txs.filter(t=>(parseFloat(t.amount)||0)>0).reduce((s,t)=>s+(parseFloat(t.amount)||0),0);
  const totalOut = txs.filter(t=>(parseFloat(t.amount)||0)<0).reduce((s,t)=>s+Math.abs(parseFloat(t.amount)||0),0);
  const filtered = filter==="all"?txs:filter==="income"?txs.filter(t=>t.amount>0):txs.filter(t=>t.amount<0);

  function saveTx() {
    if(!desc||!amount) return;
    const amt = parseFloat(amount.toString().replace(/[^0-9.]/g,""))||0;
    const final = amt*(txSign==="-"?-1:1);
    if(editId){ setTxs(prev=>prev.map(t=>t.id===editId?{...t,desc,amount:final,cat,type}:t)); setEditId(null); }
    else { setTxs(prev=>[{id:Date.now(),date:new Date().toISOString().slice(0,10),desc,amount:final,cat,type,src:"manual"},...prev]); }
    setDesc(""); setAmount(""); setTxSign("-");
    setSubTab("list");
  }

  function editTx(tx) { setDesc(tx.desc); setAmount(Math.abs(tx.amount).toString()); setTxSign(tx.amount>=0?"+":"-"); setCat(tx.cat); setType(tx.type); setEditId(tx.id); setSubTab("add"); }
  function deleteTx(id) { if(window.confirm("ต้องการลบรายการนี้?")) setTxs(prev=>prev.filter(t=>t.id!==id)); }

  function parseSMS() { setSmsResult(parseMakeSMS(sms)); setSmsAdded(false); }
  function addSMSToLedger() {
    if(!smsResult?.valid) return;
    const newTx = { id:Date.now(), date:smsResult.date, desc:smsResult.cat==="invest"&&smsResult.symbol?`ซื้อหุ้น ${smsResult.symbol}`:smsResult.merchant, amount:smsResult.type==="income"?smsResult.amount:-smsResult.amount, cat:smsResult.cat, type:"var", src:"make-sms" };
    setTxs(prev=>[newTx,...prev]);
    if(smsResult.cat==="invest"&&smsResult.symbol) {
      setPortfolio(prev => {
        const ex = prev.find(p=>p.symbol===smsResult.symbol);
        const sh = parseFloat(smsResult.shares)||1;
        const cUSD = (smsResult.amount||0)/(parseFloat(fxRate)||33.27);
        if(ex){ const ns=parseFloat(ex.shares)+sh; return prev.map(p=>p.symbol===smsResult.symbol?{...p,shares:ns,avgCost:(parseFloat(ex.avgCost)*parseFloat(ex.shares)+cUSD)/ns}:p); }
        return [...prev,{symbol:smsResult.symbol,shares:sh,avgCost:cUSD/sh,exchange:"US"}];
      });
    }
    setSmsAdded(true);
  }

  return (
    <div className="space-y-4">
      {/* Sub-tabs */}
      <div className="flex gap-1 p-1 rounded-2xl" style={{ background:"var(--dime-bg3)", border:"1px solid var(--dime-border)" }}>
        {[{id:"list",label:"รายการ"},{id:"add",label:editId?"แก้ไขรายการ":"เพิ่มรายการ"},{id:"sms",label:"MAKE Parser"}].map(t=>(
          <button key={t.id} onClick={()=>setSubTab(t.id)}
            className="flex-1 py-2 rounded-xl text-xs font-semibold font-thai transition-all"
            style={{ background:subTab===t.id?"var(--dime-card)":"transparent", color:subTab===t.id?"var(--dime-text)":"var(--dime-muted)", boxShadow:subTab===t.id?"0 1px 4px rgba(0,0,0,0.3)":"none" }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          {label:"รายรับรวม",value:`฿${fmt(totalIn)}`,color:"var(--dime-green)",accent:"#00d4a0"},
          {label:"รายจ่ายรวม",value:`฿${fmt(totalOut)}`,color:"var(--dime-red)",accent:"#f44060"},
          {label:"คงเหลือสุทธิ",value:`฿${fmt(totalIn-totalOut)}`,color:totalIn-totalOut>=0?"var(--dime-green)":"var(--dime-red)",accent:"#4b8fff"},
        ].map((s,i)=>(
          <div key={i} className="dime-card p-3" style={{ borderTop:`2px solid ${s.accent}` }}>
            <div className="text-xs font-mono mb-1" style={{ color:"var(--dime-muted)", fontSize:10, textTransform:"uppercase", letterSpacing:"0.08em" }}>{s.label}</div>
            <div className="text-sm font-bold font-head" style={{ color:s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Add Transaction Form */}
      {subTab==="add" && (
        <div className="dime-card p-4 space-y-3 animate-fade-in">
          <div className="text-sm font-semibold font-head" style={{ color:editId?"var(--dime-blue)":"var(--dime-text)" }}>
            {editId?"✏️ แก้ไขรายการ":"+ เพิ่มรายการ"}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input className="dime-input" placeholder="คำอธิบาย (เช่น ค่าอาหาร)" value={desc} onChange={e=>setDesc(e.target.value)}/>
            <div className="flex gap-2">
              <select className="dime-input flex-none w-24" value={txSign} onChange={e=>setTxSign(e.target.value)}>
                <option value="-">📉 จ่าย</option>
                <option value="+">📈 รับ</option>
              </select>
              <input className="dime-input flex-1" type="number" placeholder="จำนวนเงิน" value={amount} onChange={e=>setAmount(e.target.value)}/>
            </div>
            <select className="dime-input" value={cat} onChange={e=>setCat(e.target.value)}>
              {Object.entries(CATEGORIES).map(([k,v])=><option key={k} value={k}>{v.icon} {v.label}</option>)}
            </select>
            <select className="dime-input" value={type} onChange={e=>setType(e.target.value)}>
              <option value="fix">🔒 Fixed Cost</option>
              <option value="var">📊 Variable Cost</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button className="btn-dime-outline" onClick={()=>{setEditId(null);setSubTab("list");setDesc("");setAmount("");setTxSign("-");}}>ยกเลิก</button>
            <button className="btn-dime-green flex-1" onClick={saveTx}>{editId?"💾 บันทึกแก้ไข":"+ เพิ่มรายการ"}</button>
          </div>
        </div>
      )}

      {/* SMS Parser */}
      {subTab==="sms" && (
        <div className="space-y-3 animate-fade-in">
          <div className="dime-card p-4">
            <div className="text-sm font-semibold font-head mb-3" style={{ color:"var(--dime-text)" }}>💡 วาง SMS จาก MAKE by KBank ที่นี่</div>
            {[`MAKE: เงินเข้า 10,000 บาท`,`MAKE: ซื้อหุ้น NVDA 5 หุ้น 20,000 บาท`,`MAKE: จ่าย Netflix 419.00 บาท 02/05/67`].map((e,i)=>(
              <div key={i} onClick={()=>{setSms(e);setSmsResult(null);}}
                className="p-2.5 rounded-xl mb-2 cursor-pointer text-xs font-mono transition-colors"
                style={{ background:"rgba(255,255,255,0.03)", border:"1px solid var(--dime-border)", color:"var(--dime-muted)" }}>
                {e}
              </div>
            ))}
          </div>
          <div className="dime-card p-4 space-y-3">
            <textarea className="dime-input w-full h-28 resize-none" placeholder="วาง SMS ที่นี่..." value={sms} onChange={e=>{setSms(e.target.value);setSmsResult(null);}} style={{ fontFamily:"'Space Mono',monospace", fontSize:12, lineHeight:1.7 }}/>
            <div className="flex gap-2">
              <button className="btn-dime-green" onClick={parseSMS}>🔍 Parse SMS</button>
              <button className="btn-dime-outline" onClick={()=>{setSms("");setSmsResult(null);}}>ล้าง</button>
            </div>
            {smsResult && (
              <div className="rounded-xl p-4 animate-fade-in" style={{ background:smsResult.valid?"rgba(0,212,160,0.06)":"rgba(244,64,96,0.06)", border:`1px solid ${smsResult.valid?"rgba(0,212,160,0.2)":"rgba(244,64,96,0.2)"}` }}>
                {smsResult.valid ? (
                  <>
                    <div className="text-xs font-mono font-bold mb-3" style={{ color:"var(--dime-green)" }}>✅ PARSE SUCCESS</div>
                    {[["TYPE",smsResult.type==="income"?"💰 รายรับ":"💸 รายจ่าย"],["AMOUNT",`${smsResult.type==="income"?"+":"-"}฿${fmt(smsResult.amount)}`],["DATE",smsResult.date],["MERCHANT",smsResult.merchant],
                      ...(smsResult.cat==="invest"&&smsResult.symbol?[["SYMBOL",smsResult.symbol],["SHARES",`${smsResult.shares||1} หุ้น`]]:[])
                    ].map(([k,v])=>(
                      <div key={k} className="flex justify-between py-1.5 border-b last:border-0" style={{ borderColor:"rgba(255,255,255,0.06)" }}>
                        <span className="text-xs font-mono" style={{ color:"var(--dime-muted)", textTransform:"uppercase", letterSpacing:"0.08em", fontSize:10 }}>{k}</span>
                        <span className="text-xs font-semibold font-head" style={{ color:"var(--dime-text)" }}>{v}</span>
                      </div>
                    ))}
                    <button className="btn-dime-green mt-3 w-full" onClick={addSMSToLedger} disabled={smsAdded}>{smsAdded?"✅ บันทึกแล้ว":"+ บันทึกลงบัญชี"}</button>
                  </>
                ) : <div className="text-xs font-mono" style={{ color:"var(--dime-red)" }}>❌ ไม่พบข้อมูล — ตรวจสอบรูปแบบ SMS</div>}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Transaction List */}
      {subTab==="list" && (
        <div className="dime-card overflow-hidden animate-fade-in">
          <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom:"1px solid var(--dime-border)" }}>
            <div className="flex gap-1">
              {["all","income","expense"].map(f=>(
                <button key={f} onClick={()=>setFilter(f)}
                  className="px-3 py-1 rounded-lg text-xs font-thai transition-colors"
                  style={{ background:filter===f?"var(--dime-bg3)":"transparent", color:filter===f?"var(--dime-text)":"var(--dime-muted)", border:filter===f?"1px solid var(--dime-border)":"1px solid transparent" }}>
                  {f==="all"?"ทั้งหมด":f==="income"?"รายรับ":"รายจ่าย"}
                </button>
              ))}
            </div>
            <button onClick={()=>setSubTab("add")}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-thai font-semibold"
              style={{ background:"rgba(0,212,160,0.1)", color:"var(--dime-green)", border:"1px solid rgba(0,212,160,0.25)" }}>
              <Icon.Plus sz={12}/> เพิ่ม
            </button>
          </div>
          {filtered.length===0
            ? <EmptyState icon="📋" title="ไม่มีรายการ" sub="เพิ่มรายการจากแท็บ 'เพิ่มรายการ'"/>
            : (
              <div>
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr>
                        {["วันที่","รายการ","หมวด","ประเภท","จำนวน",""].map(h=>(
                          <th key={h} className="px-4 py-2.5 text-left font-mono uppercase tracking-wider" style={{ color:"var(--dime-dim)", fontSize:9, borderBottom:"1px solid var(--dime-border)" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map(tx=>{
                        const c = CATEGORIES[tx.cat]||CATEGORIES.other;
                        return (
                          <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors">
                            <td className="px-4 py-2.5 font-mono" style={{ color:"var(--dime-muted)", fontSize:10 }}>{tx.date}</td>
                            <td className="px-4 py-2.5 font-head font-medium max-w-xs truncate" style={{ color:"var(--dime-text)" }}>{tx.desc}</td>
                            <td className="px-4 py-2.5"><span className="text-sm">{c.icon}</span> <span className="font-thai" style={{ color:"var(--dime-muted)" }}>{c.label}</span></td>
                            <td className="px-4 py-2.5"><Pill color={tx.type==="fix"?"#a78bfa":"#f5a623"}>{tx.type==="fix"?"Fixed":"Variable"}</Pill></td>
                            <td className="px-4 py-2.5 text-right font-bold font-head" style={{ color:tx.amount>0?"var(--dime-green)":"var(--dime-text)" }}>
                              {tx.amount>0?"+":""}฿{fmt(Math.abs(tx.amount))}
                            </td>
                            <td className="px-4 py-2.5 text-right">
                              <button onClick={()=>editTx(tx)} className="p-1 rounded opacity-50 hover:opacity-100 transition-opacity mr-1" style={{ color:"var(--dime-blue)" }}><Icon.Edit sz={14}/></button>
                              <button onClick={()=>deleteTx(tx.id)} className="p-1 rounded opacity-50 hover:opacity-100 transition-opacity" style={{ color:"var(--dime-red)" }}><Icon.Trash sz={14}/></button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden divide-y" style={{ borderColor:"var(--dime-border)" }}>
                  {filtered.map(tx=>{
                    const c = CATEGORIES[tx.cat]||CATEGORIES.other;
                    const isPos = tx.amount > 0;
                    return (
                      <div key={tx.id} className="flex items-center gap-3 px-4 py-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0" style={{ background:`${c.color}18` }}>{c.icon}</div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium font-head truncate" style={{ color:"var(--dime-text)" }}>{tx.desc}</div>
                          <div className="text-xs font-mono" style={{ color:"var(--dime-muted)", fontSize:10 }}>{tx.date} · {c.label}</div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <div className="text-sm font-bold font-head text-right" style={{ color:isPos?"var(--dime-green)":"var(--dime-text)" }}>
                            {isPos?"+":""}฿{fmt(Math.abs(tx.amount))}
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <button onClick={()=>editTx(tx)} className="p-1" style={{ color:"var(--dime-blue)", opacity:0.6 }}><Icon.Edit sz={13}/></button>
                            <button onClick={()=>deleteTx(tx.id)} className="p-1" style={{ color:"var(--dime-red)", opacity:0.6 }}><Icon.Trash sz={13}/></button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )
          }
        </div>
      )}
    </div>
  );
}

// ============================================================
// 🎯 PAGE: BUDGET
// ============================================================
function BudgetPage({ txs }) {
  const thisMonth = new Date().toISOString().slice(0,7);
  const spent = {};
  txs.filter(t=>(parseFloat(t.amount)||0)<0&&t.date?.startsWith(thisMonth)).forEach(t=>{
    spent[t.cat] = (spent[t.cat]||0)+Math.abs(parseFloat(t.amount)||0);
  });
  const fixCost = txs.filter(t=>t.type==="fix"&&(parseFloat(t.amount)||0)<0).reduce((s,t)=>s+Math.abs(parseFloat(t.amount)||0),0);
  const varCost = txs.filter(t=>t.type==="var"&&(parseFloat(t.amount)||0)<0).reduce((s,t)=>s+Math.abs(parseFloat(t.amount)||0),0);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {[
          {label:"Fixed Cost (คงที่)",value:`฿${fmt(fixCost)}`,sub:"ค่าเช่า, Netflix, อินเทอร์เน็ต",accent:"#a78bfa"},
          {label:"Variable Cost (ผันแปร)",value:`฿${fmt(varCost)}`,sub:"อาหาร, เดินทาง, ช้อปปิ้ง",accent:"#f5a623"},
        ].map((s,i)=>(
          <div key={i} className="dime-card p-4" style={{ borderTop:`2px solid ${s.accent}` }}>
            <div className="text-xs font-mono mb-2 uppercase tracking-wider" style={{ color:"var(--dime-muted)", fontSize:10 }}>{s.label}</div>
            <div className="text-2xl font-bold font-head" style={{ color:"var(--dime-text)" }}>{s.value}</div>
            <div className="text-xs mt-1 font-thai" style={{ color:"var(--dime-muted)" }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="dime-card p-4">
        <SectionTitle>งบประมาณแต่ละหมวด (เดือนนี้)</SectionTitle>
        <div className="space-y-4">
          {BUDGETS.map(b=>{
            const cat = CATEGORIES[b.cat];
            const s = parseFloat(spent[b.cat])||0;
            const pct = Math.min((s/b.limit)*100,100);
            const over = s > b.limit;
            const barColor = over ? "linear-gradient(90deg,#cc2244,#f44060)" : pct>80 ? "linear-gradient(90deg,#cc9200,#f5a623)" : "linear-gradient(90deg,#00b87a,#00d4a0)";
            return (
              <div key={b.cat}>
                <div className="flex justify-between mb-1.5">
                  <span className="text-sm font-thai" style={{ color:"var(--dime-text)" }}>{cat.icon} {cat.label}</span>
                  <div className="text-right">
                    <span className="text-xs font-mono" style={{ color:over?"var(--dime-red)":"var(--dime-text)" }}>฿{fmt(s)}</span>
                    <span className="text-xs font-mono" style={{ color:"var(--dime-muted)" }}> / ฿{fmt(b.limit)}</span>
                  </div>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background:"rgba(255,255,255,0.05)" }}>
                  <div className="h-full rounded-full transition-all duration-700" style={{ width:`${pct}%`, background:barColor }}/>
                </div>
                {over && <div className="text-xs font-mono mt-1" style={{ color:"var(--dime-red)" }}>⚠️ เกินงบ ฿{fmt(s-b.limit)}</div>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Category breakdown */}
      <div className="dime-card p-4">
        <SectionTitle>รายจ่ายแยกหมวดเดือนนี้</SectionTitle>
        <div className="space-y-2">
          {Object.entries(spent).sort((a,b)=>b[1]-a[1]).map(([key,val])=>{
            const cat = CATEGORIES[key]||CATEGORIES.other;
            return (
              <div key={key} className="flex items-center gap-3 py-1.5">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm flex-shrink-0" style={{ background:`${cat.color}18` }}>{cat.icon}</div>
                <span className="flex-1 text-sm font-thai" style={{ color:"var(--dime-text)" }}>{cat.label}</span>
                <span className="text-sm font-mono font-semibold" style={{ color:"var(--dime-text)" }}>฿{fmt(val)}</span>
              </div>
            );
          })}
          {Object.keys(spent).length===0 && <EmptyState icon="🎯" title="ยังไม่มีรายจ่ายเดือนนี้" sub="เพิ่มรายรับ-รายจ่ายที่แท็บเงินสด"/>}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// 👤 PAGE: PROFILE
// ============================================================
function ProfilePage({ user, syncState, lastSaved, fxRate, fxLoading, onLogout, onExport, onImport, portfolio, txs }) {
  const fileRef = useRef(null);
  return (
    <div className="space-y-4">
      {/* User card */}
      <div className="dime-card p-5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xl font-head"
            style={{ background:"linear-gradient(135deg,var(--dime-green),var(--dime-blue))", color:"#000" }}>
            {user?.slice(0,2).toUpperCase()}
          </div>
          <div>
            <div className="text-lg font-bold font-head" style={{ color:"var(--dime-text)" }}>{user}</div>
            <div className="text-xs font-mono mt-0.5" style={{ color:"var(--dime-muted)" }}>Damn · Personal Use</div>
            <div className="flex items-center gap-1.5 mt-1.5">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background:syncState==="live"?"var(--dime-green)":"var(--dime-red)", animation:syncState==="live"?"pulse-dot 2s infinite":"none" }}/>
              <span className="text-xs font-mono" style={{ color:syncState==="live"?"var(--dime-green)":"var(--dime-red)", fontSize:10 }}>
                {syncState==="live"?"Firebase Live":syncState==="offline"?"Offline — Using Cache":"Cache"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          {label:"หุ้นในพอร์ต",value:`${portfolio.length} รายการ`},
          {label:"รายการทั้งหมด",value:`${txs.length} รายการ`},
          {label:"บันทึกล่าสุด",value:lastSaved?fmtTime(lastSaved):"—"},
        ].map((s,i)=>(
          <div key={i} className="dime-card p-3 text-center">
            <div className="text-lg font-bold font-head" style={{ color:"var(--dime-text)" }}>{s.value}</div>
            <div className="text-xs font-thai mt-0.5" style={{ color:"var(--dime-muted)" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* FX Rate */}
      <div className="dime-card p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold font-head" style={{ color:"var(--dime-text)" }}>🇺🇸 อัตราแลกเปลี่ยน USD/THB</span>
          {fxLoading && <span className="text-xs font-mono" style={{ color:"var(--dime-muted)" }}>กำลังอัปเดต...</span>}
        </div>
        <div className="text-3xl font-bold font-head" style={{ color:"var(--dime-gold)", letterSpacing:"-0.02em" }}>
          {fxLoading?"...":fxRate?.toFixed(4)} <span className="text-sm font-normal" style={{ color:"var(--dime-muted)" }}>THB/USD</span>
        </div>
        <div className="text-xs font-mono mt-1" style={{ color:"var(--dime-muted)" }}>อัปเดตจาก open.er-api.com ทุก 5 นาที</div>
      </div>

      {/* Data management */}
      <div className="dime-card p-4 space-y-3">
        <div className="text-sm font-semibold font-head" style={{ color:"var(--dime-text)" }}>📦 จัดการข้อมูล</div>
        <input ref={fileRef} type="file" accept=".json" style={{ display:"none" }} onChange={onImport}/>
        <div className="grid grid-cols-2 gap-2">
          <button onClick={onExport} className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold font-thai btn-dime-outline">
            <Icon.Download sz={16}/> Export JSON
          </button>
          <button onClick={()=>fileRef.current?.click()} className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold font-thai btn-dime-outline">
            <Icon.Upload sz={16}/> Import JSON
          </button>
        </div>
      </div>

      {/* Logout */}
      <button onClick={onLogout}
        className="w-full py-3.5 rounded-2xl flex items-center justify-center gap-2 text-sm font-semibold font-thai"
        style={{ background:"rgba(244,64,96,0.08)", color:"var(--dime-red)", border:"1px solid rgba(244,64,96,0.2)" }}>
        <Icon.LogOut sz={18}/> ออกจากระบบ
      </button>
    </div>
  );
}

// ============================================================
// 💹 MODALS
// ============================================================
function BuySellModal({ holding, onClose, onConfirm, fxRate }) {
  const [mode, setMode] = useState("buy");
  const [shares, setShares] = useState("");
  const [price, setPrice] = useState(holding?.livePrice?.toFixed(2)||"");
  const sh = parseFloat(shares)||0, pr = parseFloat(price)||0;
  const totalUSD = sh*pr, totalTHB = totalUSD*(parseFloat(fxRate)||33.27);
  return (
    <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal-sheet">
        <div className="flex justify-center mb-5"><div className="w-10 h-1 rounded-full" style={{ background:"var(--dime-border)" }}/></div>
        <div className="flex items-center gap-3 mb-5">
          <StockLogo symbol={holding?.symbol} size={46}/>
          <div>
            <div className="text-lg font-bold font-head" style={{ color:"var(--dime-text)" }}>{holding?.symbol}</div>
            <div className="text-xs font-mono" style={{ color:"var(--dime-muted)" }}>ถือ {fmtShares(holding?.shares)} หุ้น · ${fmtUSD(holding?.livePrice)} ปัจจุบัน</div>
          </div>
        </div>
        <div className="flex rounded-xl p-1 mb-5" style={{ background:"var(--dime-bg3)" }}>
          {["buy","sell"].map(m=>(
            <button key={m} onClick={()=>setMode(m)} className="flex-1 py-2.5 rounded-lg text-sm font-semibold font-thai transition-all"
              style={{ background:mode===m?(m==="buy"?"var(--dime-green)":"var(--dime-red)"):"transparent", color:mode===m?"#000":"var(--dime-muted)" }}>
              {m==="buy"?"ซื้อ":"ขาย"}
            </button>
          ))}
        </div>
        <div className="space-y-3 mb-5">
          <div><label className="text-xs font-thai block mb-1.5" style={{ color:"var(--dime-muted)" }}>จำนวนหุ้น</label><input className="dime-input" type="number" placeholder="0.0000000" value={shares} onChange={e=>setShares(e.target.value)}/></div>
          <div><label className="text-xs font-thai block mb-1.5" style={{ color:"var(--dime-muted)" }}>ราคาต่อหุ้น (USD)</label><input className="dime-input" type="number" placeholder="0.00" value={price} onChange={e=>setPrice(e.target.value)}/></div>
        </div>
        {sh>0&&pr>0&&(
          <div className="rounded-xl p-4 mb-5" style={{ background:"var(--dime-bg3)", border:"1px solid var(--dime-border)" }}>
            <div className="flex justify-between text-sm mb-2"><span className="font-thai" style={{ color:"var(--dime-muted)" }}>รวม (USD)</span><span className="font-mono font-semibold" style={{ color:"var(--dime-text)" }}>${fmtUSD(totalUSD)}</span></div>
            <div className="flex justify-between text-sm"><span className="font-thai" style={{ color:"var(--dime-muted)" }}>รวม (THB)</span><span className="font-mono font-semibold" style={{ color:"var(--dime-green)" }}>฿{fmt(totalTHB)}</span></div>
          </div>
        )}
        <div className="flex gap-3">
          <button className="btn-dime-outline flex-1" onClick={onClose}>ยกเลิก</button>
          <button className={`flex-1 ${mode==="buy"?"btn-dime-green":"btn-dime-red"}`} onClick={()=>{onConfirm({symbol:holding.symbol,mode,shares:sh,priceUSD:pr});onClose();}} disabled={!sh||!pr} style={{ opacity:!sh||!pr?0.5:1 }}>
            {mode==="buy"?"ยืนยันซื้อ":"ยืนยันขาย"}
          </button>
        </div>
      </div>
    </div>
  );
}

function AddHoldingModal({ onClose, onAdd }) {
  const [sym, setSym] = useState(""), [shares, setShares] = useState(""), [cost, setCost] = useState(""), [err, setErr] = useState("");
  function handle() {
    if(!sym.trim()){setErr("กรุณากรอก Symbol");return;}
    if(!shares||parseFloat(shares)<=0){setErr("กรุณากรอกจำนวนหุ้น");return;}
    if(!cost||parseFloat(cost)<=0){setErr("กรุณากรอกต้นทุน");return;}
    onAdd({symbol:sym.trim().toUpperCase(),shares:parseFloat(shares),avgCost:parseFloat(cost)});
    onClose();
  }
  return (
    <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal-sheet">
        <div className="flex justify-center mb-5"><div className="w-10 h-1 rounded-full" style={{ background:"var(--dime-border)" }}/></div>
        <div className="text-lg font-bold font-head mb-5" style={{ color:"var(--dime-text)" }}>+ เพิ่มหุ้นในพอร์ต</div>
        <div className="space-y-3 mb-4">
          <div><label className="text-xs font-thai block mb-1.5" style={{ color:"var(--dime-muted)" }}>Symbol (เช่น AAPL, NVDA)</label><input className="dime-input uppercase" placeholder="SYMBOL" value={sym} onChange={e=>setSym(e.target.value.toUpperCase())}/></div>
          <div><label className="text-xs font-thai block mb-1.5" style={{ color:"var(--dime-muted)" }}>จำนวนหุ้น</label><input className="dime-input" type="number" placeholder="0.0000000" value={shares} onChange={e=>setShares(e.target.value)}/></div>
          <div><label className="text-xs font-thai block mb-1.5" style={{ color:"var(--dime-muted)" }}>ต้นทุนเฉลี่ย/หุ้น (USD)</label><input className="dime-input" type="number" placeholder="0.00" value={cost} onChange={e=>setCost(e.target.value)}/></div>
        </div>
        {err&&<div className="text-xs font-thai mb-3" style={{ color:"var(--dime-red)" }}>⚠️ {err}</div>}
        <div className="flex gap-3">
          <button className="btn-dime-outline flex-1" onClick={onClose}>ยกเลิก</button>
          <button className="btn-dime-green flex-1" onClick={handle}>+ เพิ่มหุ้น</button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// 🧭 NAV CONFIG
// ============================================================
const PAGES = [
  { id:"dashboard",  label:"หน้าหลัก", IconEl:({sz})=><Icon.Home sz={sz}/> },
  { id:"portfolio",  label:"พอร์ตหุ้น", IconEl:({sz})=><Icon.TrendUp sz={sz}/> },
  { id:"cash",       label:"เงินสด",   IconEl:({sz})=><Icon.Dollar sz={sz}/> },
  { id:"budget",     label:"งบประมาณ", IconEl:({sz})=><Icon.Target sz={sz}/> },
  { id:"profile",    label:"ฉัน",      IconEl:({sz})=><Icon.User sz={sz}/> },
];

// Bottom Nav (Mobile / Tablet < md)
function BottomNav({ active, onChange }) {
  return (
    <nav className="bottom-nav lg:hidden">
      {PAGES.map(({ id, label, IconEl }) => {
        const isActive = active===id;
        return (
          <button key={id} className="nav-item" onClick={()=>onChange(id)}>
            <div style={{ color:isActive?"var(--dime-green)":"var(--dime-muted)" }}><IconEl sz={20}/></div>
            <span className="nav-label" style={{ color:isActive?"var(--dime-green)":"var(--dime-muted)" }}>{label}</span>
          </button>
        );
      })}
    </nav>
  );
}

// Sidebar (Desktop lg+)
function Sidebar({ active, onChange, user, syncState }) {
  return (
    <aside className="hidden lg:flex flex-col flex-shrink-0" style={{ width:220, background:"var(--dime-bg2)", borderRight:"1px solid var(--dime-border)", minHeight:"100vh" }}>
      {/* Brand */}
      <div className="px-5 pt-6 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold font-head text-sm flex-shrink-0"
            style={{ background:"linear-gradient(135deg,var(--dime-green),var(--dime-blue))", color:"#000" }}>
            {user?.slice(0,1).toUpperCase()}
          </div>
          <div>
            <div className="text-sm font-bold font-head" style={{ color:"var(--dime-text)" }}>{user}</div>
            <div className="flex items-center gap-1 mt-0.5">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background:syncState==="live"?"var(--dime-green)":"var(--dime-red)" }}/>
              <span className="text-xs font-mono" style={{ color:"var(--dime-muted)", fontSize:9 }}>{syncState==="live"?"Live":"Offline"}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="h-px mx-5 mb-3" style={{ background:"var(--dime-border)" }}/>

      {/* Nav Items */}
      <nav className="flex-1 px-3 space-y-1">
        {PAGES.map(({ id, label, IconEl }) => {
          const isActive = active===id;
          return (
            <button key={id} onClick={()=>onChange(id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-thai font-medium transition-all text-left"
              style={{ background:isActive?"rgba(0,212,160,0.1)":"transparent", color:isActive?"var(--dime-green)":"var(--dime-muted)", borderLeft:isActive?"2px solid var(--dime-green)":"2px solid transparent" }}>
              <IconEl sz={18}/>
              {label}
            </button>
          );
        })}
      </nav>

      {/* Bottom of sidebar */}
      <div className="p-3 mt-auto">
        <div className="text-xs font-mono text-center" style={{ color:"var(--dime-dim)", fontSize:9 }}>Damn · v3</div>
      </div>
    </aside>
  );
}

// ============================================================
// 🔑 LOGIN SCREEN
// ============================================================
function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState(""), [password, setPassword] = useState(""), [error, setError] = useState(false), [loading, setLoading] = useState(false);
  function handleSubmit(e) {
    e.preventDefault(); setLoading(true);
    setTimeout(()=>{ if(AUTHORIZED_USERS[username]===password){ onLogin(username); } else { setError(true); setLoading(false); } }, 500);
  }
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ background:"var(--dime-bg)" }}>
      <div className="login-glow-1"/><div className="login-glow-2"/>
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage:"linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px)", backgroundSize:"50px 50px", maskImage:"radial-gradient(ellipse 80% 80% at 50% 50%,black 40%,transparent 100%)" }}/>
      <div className="relative z-10 w-full max-w-sm mx-5 p-8 rounded-3xl" style={{ background:"rgba(26,29,36,0.9)", backdropFilter:"blur(24px)", border:"1px solid var(--dime-border)", boxShadow:"0 30px 80px rgba(0,0,0,0.5)" }}>
        <div className="flex items-center gap-3 justify-center mb-6">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-xl font-head" style={{ background:"linear-gradient(135deg,var(--dime-green),var(--dime-blue))", color:"#000", boxShadow:"0 6px 20px rgba(0,212,160,0.3)" }}>D</div>
          <div>
            <div className="font-head font-bold text-base" style={{ color:"var(--dime-text)" }}>Damn</div>
            <div className="text-xs font-mono" style={{ color:"var(--dime-muted)" }}>PERSONAL FINANCE ENGINE</div>
          </div>
        </div>
        <div className="h-px mb-6" style={{ background:"var(--dime-border)" }}/>
        <div className="font-head font-bold text-2xl mb-1" style={{ color:"var(--dime-text)" }}>ยินดีต้อนรับ</div>
        <p className="text-sm font-thai mb-6" style={{ color:"var(--dime-muted)" }}>เข้าสู่ระบบเพื่อดูพอร์ตและการเงิน</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input className="dime-input" placeholder="Username" autoComplete="username" value={username} onChange={e=>{setUsername(e.target.value);setError(false);}}/>
          <input className="dime-input" type="password" placeholder="Password" autoComplete="current-password" value={password} onChange={e=>{setPassword(e.target.value);setError(false);}}/>
          {error&&<div className="text-xs font-thai" style={{ color:"var(--dime-red)" }}>⚠️ Username หรือ Password ไม่ถูกต้อง</div>}
          <button type="submit" className="btn-dime-green mt-2" disabled={loading}>{loading?"กำลังเข้าสู่ระบบ...":"เข้าสู่ระบบ →"}</button>
        </form>
      </div>
    </div>
  );
}

// ============================================================
// 🏠 MAIN APP
// ============================================================
export default function App() {
  const [user, setUser] = useState(()=>localStorage.getItem(LS.USER)||null);
  const [hideBalance, setHideBalance] = useState(()=>lsGet(LS.HIDE_BALANCE,false));
  const [activePage, setActivePage] = useState(()=>lsGet(LS.TAB,"dashboard"));
  const [portfolio, setPortfolioState] = useState(()=>lsGet(LS.PORTFOLIO,[]));
  const [txs, setTxsState] = useState(()=>lsGet(LS.TXS,[]));
  const [loading, setLoading] = useState(true);
  const [syncState, setSyncState] = useState("live");
  const [lastSaved, setLastSaved] = useState(()=>{ const ts=localStorage.getItem(LS.LAST_SAVE); return ts?new Date(ts):null; });
  const initialLoadDone = useRef(false);

  // Persist active page
  useEffect(()=>{ lsSet(LS.TAB, activePage); },[activePage]);

  // SWR: Prices & FX
  const symbols = useMemo(()=>portfolio.map(p=>p.symbol).filter(Boolean),[portfolio]);
  const { prices: livePrices, isLoading: pricesLoading } = useMarketData(user?symbols:[]);
  const savedRate = lsGet(LS.RATE, 33.27);
  const { rate: fxRate, isLoading: fxLoading } = useFXRate(savedRate);

  // Persist FX rate
  useEffect(()=>{
    if(!fxRate||fxLoading) return;
    lsSet(LS.RATE,fxRate);
    if(user) setDoc(doc(db,"users",user),{exchangeRate:fxRate,exchangeUpdatedAt:new Date().toISOString()},{merge:true}).catch(()=>{});
  },[fxRate,fxLoading,user]);

  // Firebase snapshot
  useEffect(()=>{
    if(!user){setLoading(false);return;}
    setLoading(true); initialLoadDone.current=false;
    const tid=setTimeout(()=>{ if(!initialLoadDone.current){setLoading(false);setSyncState("offline");initialLoadDone.current=true;} },5000);
    const unsub=onSnapshot(doc(db,"users",user),(snap)=>{
      clearTimeout(tid);
      if(snap.exists()){
        const data=snap.data();
        const fsP=Array.isArray(data.portfolio)?data.portfolio:null;
        const fsT=Array.isArray(data.txs)?data.txs:null;
        if(!initialLoadDone.current){
          const cP=lsGet(LS.PORTFOLIO,[]), cT=lsGet(LS.TXS,[]);
          let rP=cP, rT=cT, resync=false;
          if(fsP!==null&&fsP.length>=cP.length){rP=fsP;}
          else if(fsP!==null&&fsP.length<cP.length){const m=[...fsP];cP.forEach(c=>{if(!m.find(f=>f.symbol===c.symbol))m.push(c);});rP=m;resync=true;}
          else if(fsP===null&&cP.length>0){rP=cP;resync=true;}
          if(fsT!==null&&fsT.length>=cT.length){rT=fsT;}
          else if(fsT!==null&&fsT.length<cT.length){const m=[...fsT];cT.forEach(c=>{if(!m.find(f=>f.id===c.id))m.push(c);});rT=m;resync=true;}
          else if(fsT===null&&cT.length>0){rT=cT;resync=true;}
          setPortfolioState(rP);setTxsState(rT);lsSet(LS.PORTFOLIO,rP);lsSet(LS.TXS,rT);
          if(resync) setDoc(doc(db,"users",user),{portfolio:rP,txs:rT},{merge:true}).catch(()=>{});
          initialLoadDone.current=true;setLoading(false);setSyncState("live");
        } else {
          if(fsP!==null){setPortfolioState(fsP);lsSet(LS.PORTFOLIO,fsP);}
          if(fsT!==null){setTxsState(fsT);lsSet(LS.TXS,fsT);}
          setSyncState("live");
        }
      } else {initialLoadDone.current=true;setLoading(false);setSyncState("live");}
    },(err)=>{clearTimeout(tid);console.error(err);setLoading(false);setSyncState("offline");initialLoadDone.current=true;});
    return ()=>{unsub();clearTimeout(tid);};
  },[user]);

  // Wrapped setters
  const setPortfolio = useCallback((action)=>{
    setPortfolioState(prev=>{
      const next=typeof action==="function"?action(prev):action;
      lsSet(LS.PORTFOLIO,next);
      if(user){ const now=new Date(); setDoc(doc(db,"users",user),{portfolio:next},{merge:true}).then(()=>{localStorage.setItem(LS.LAST_SAVE,now.toISOString());setLastSaved(now);}).catch(()=>{}); }
      return next;
    });
  },[user]);

  const setTxs = useCallback((action)=>{
    setTxsState(prev=>{
      const next=typeof action==="function"?action(prev):action;
      lsSet(LS.TXS,next);
      if(user){ const now=new Date(); setDoc(doc(db,"users",user),{txs:next},{merge:true}).then(()=>{localStorage.setItem(LS.LAST_SAVE,now.toISOString());setLastSaved(now);}).catch(()=>{}); }
      return next;
    });
  },[user]);

  const toggleHide = useCallback(()=>setHideBalance(p=>{const n=!p;lsSet(LS.HIDE_BALANCE,n);return n;}),[]);

  function handleLogout() {
    localStorage.removeItem(LS.USER);
    setUser(null);
    initialLoadDone.current = false;
    setSyncState("live");
  }

  function handleExport() {
    const blob=new Blob([JSON.stringify({exportedAt:new Date().toISOString(),user,txs,portfolio,exchangeRate:fxRate},null,2)],{type:"application/json"});
    const url=URL.createObjectURL(blob),a=document.createElement("a");
    a.href=url;a.download=`finance-backup-${new Date().toISOString().slice(0,10)}.json`;a.click();URL.revokeObjectURL(url);
  }

  function handleImport(e) {
    const file=e.target.files?.[0]; if(!file) return;
    const reader=new FileReader();
    reader.onload=(ev)=>{
      try {
        const data=JSON.parse(ev.target.result);
        const iP=Array.isArray(data.portfolio)?data.portfolio:[];
        const iT=Array.isArray(data.txs)?data.txs:[];
        if(!window.confirm(`นำเข้าข้อมูล?\n• Portfolio: ${iP.length} รายการ\n• Transactions: ${iT.length} รายการ`)) return;
        setPortfolio(prev=>{const m=[...prev];iP.forEach(ip=>{if(!m.find(p=>p.symbol===ip.symbol))m.push(ip);});return m;});
        setTxs(prev=>{const m=[...prev];iT.forEach(it=>{if(!m.find(t=>t.id===it.id))m.push(it);});return m.sort((a,b)=>b.id-a.id);});
        alert("✅ นำเข้าสำเร็จ!");
      } catch(err){alert("❌ ไฟล์ JSON ไม่ถูกต้อง: "+err.message);}
    };
    reader.readAsText(file); e.target.value="";
  }

  // Page title
  const pageTitle = PAGES.find(p=>p.id===activePage)?.label||"";

  if(!user) return <LoginScreen onLogin={(u)=>{setUser(u);localStorage.setItem(LS.USER,u);}}/>;

  if(loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background:"var(--dime-bg)" }}>
      <div className="spinner"/>
      <div className="text-sm font-thai" style={{ color:"var(--dime-muted)" }}>กำลังโหลดข้อมูล...</div>
    </div>
  );

  const sharedProps = { txs, portfolio, livePrices, pricesLoading, fxRate, fxLoading, hideBalance };

  return (
    <div className="flex min-h-screen" style={{ background:"var(--dime-bg)" }}>
      {/* Sidebar for Desktop */}
      <Sidebar active={activePage} onChange={setActivePage} user={user} syncState={syncState}/>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        {/* Top App Bar */}
        <header className="flex items-center justify-between px-4 py-3 sticky top-0 z-50"
          style={{ background:"rgba(17,19,24,0.85)", backdropFilter:"blur(16px)", borderBottom:"1px solid var(--dime-border)" }}>
          {/* Left: Page title */}
          <div className="flex items-center gap-2">
            {/* Mobile brand */}
            <div className="lg:hidden flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm font-head flex-shrink-0"
                style={{ background:"linear-gradient(135deg,var(--dime-green),var(--dime-blue))", color:"#000" }}>
                {user?.slice(0,1).toUpperCase()}
              </div>
            </div>
            <h1 className="text-base font-bold font-head" style={{ color:"var(--dime-text)" }}>{pageTitle}</h1>
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-2">
            {/* Sync indicator */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full"
              style={{ background:syncState==="live"?"rgba(0,212,160,0.08)":"rgba(244,64,96,0.08)", border:`1px solid ${syncState==="live"?"rgba(0,212,160,0.2)":"rgba(244,64,96,0.2)"}` }}>
              <div className="w-1.5 h-1.5 rounded-full" style={{ background:syncState==="live"?"var(--dime-green)":"var(--dime-red)" }}/>
              <span className="text-xs font-mono" style={{ color:syncState==="live"?"var(--dime-green)":"var(--dime-red)", fontSize:10 }}>
                {syncState==="live"?"Live":"Offline"}
              </span>
            </div>
            {/* Hide balance toggle */}
            <button onClick={toggleHide} className="flex items-center justify-center w-8 h-8 rounded-full transition-colors"
              style={{ background:"rgba(255,255,255,0.06)", color:"var(--dime-muted)" }}>
              <Icon.Eye open={!hideBalance} sz={16}/>
            </button>
            {/* Desktop logout */}
            <button onClick={handleLogout} className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-thai font-semibold"
              style={{ background:"rgba(244,64,96,0.08)", color:"var(--dime-red)", border:"1px solid rgba(244,64,96,0.2)" }}>
              <Icon.LogOut sz={14}/> ออก
            </button>
          </div>
        </header>

        {/* Offline banner */}
        {syncState!=="live" && (
          <div className="flex items-center gap-2 px-4 py-2 text-xs font-thai" style={{ background:"rgba(245,166,35,0.08)", borderBottom:"1px solid rgba(245,166,35,0.2)", color:"var(--dime-gold)" }}>
            ⚠️ {syncState==="offline"?"ไม่สามารถเชื่อมต่อ Firebase — กำลังใช้ข้อมูลจาก localStorage":"กำลังใช้ข้อมูล Cache"}
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto pb-20 lg:pb-6">
          <div className="max-w-4xl mx-auto px-4 py-5">
            {activePage==="dashboard" && <DashboardPage {...sharedProps}/>}
            {activePage==="portfolio" && <PortfolioPage portfolio={portfolio} setPortfolio={setPortfolio} livePrices={livePrices} pricesLoading={pricesLoading} fxRate={fxRate} fxLoading={fxLoading} hideBalance={hideBalance}/>}
            {activePage==="cash"      && <TransactionsPage txs={txs} setTxs={setTxs} portfolio={portfolio} setPortfolio={setPortfolio} fxRate={fxRate}/>}
            {activePage==="budget"    && <BudgetPage txs={txs}/>}
            {activePage==="profile"   && <ProfilePage user={user} syncState={syncState} lastSaved={lastSaved} fxRate={fxRate} fxLoading={fxLoading} onLogout={handleLogout} onExport={handleExport} onImport={handleImport} portfolio={portfolio} txs={txs}/>}
          </div>
        </main>
      </div>

      {/* Bottom Nav (Mobile) */}
      <BottomNav active={activePage} onChange={setActivePage}/>
    </div>
  );
}
