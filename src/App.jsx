import { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, onSnapshot, setDoc } from "firebase/firestore";

// ============================================================
// ⚠️⚠️ วาง Firebase Config ของคุณตรงนี้ ⚠️⚠️
// ============================================================
const firebaseConfig = {
  apiKey: "AIzaSyDTeZ7tn9ewhRctgJY-Dyk_qs6Js0wPk6w",
  authDomain: "financial-cd762.firebaseapp.com",
  projectId: "financial-cd762",
  storageBucket: "financial-cd762.firebasestorage.app",
  messagingSenderId: "373396537545",
  appId: "1:373396537545:web:2019a70625fa69dbeb8d18",
  measurementId: "G-W1KHVD3KPE"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const AUTHORIZED_USERS = {
  "admin": "zxc12345",
  "friend": "welcome"
};

// ============================================================
// STYLES (🔥 PREMIUM UI OVERHAUL 🔥)
// ============================================================
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&family=Noto+Sans+Thai:wght@300;400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #050505; --bg2: #0e1116; --bg3: #161a22; 
    --border: #222834; --border2: #303846;
    --text: #ffffff; --text2: #94a3b8; --text3: #64748b;
    --green: #10b981; --red: #f43f5e; --blue: #3b82f6; --blue-glow: rgba(59, 130, 246, 0.5);
    --gold: #f59e0b; --purple: #8b5cf6;
    --card-radius: 20px;
    --font-mono: 'IBM Plex Mono', monospace; --font-thai: 'Noto Sans Thai', sans-serif;
  }

  body { background: var(--bg); color: var(--text); font-family: var(--font-thai); -webkit-font-smoothing: antialiased; }
  .app { min-height: 100vh; display: flex; flex-direction: column; overflow-x: hidden; }

  /* ==================================================
     💎 PREMIUM LOGIN PAGE (Vercel/Stripe Style) 💎
     ================================================== */
  .login-container { 
    height: 100vh; display: flex; align-items: center; justify-content: center; 
    background: #000; position: relative; overflow: hidden; padding: 20px;
  }
  
  /* Animated Glowing Orbs */
  .glow-orb-1 {
    position: absolute; width: 60vw; height: 60vw; max-width: 600px; max-height: 600px;
    background: radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(0,0,0,0) 70%);
    top: -10%; left: -10%; border-radius: 50%; filter: blur(60px);
    animation: drift 15s ease-in-out infinite alternate;
  }
  .glow-orb-2 {
    position: absolute; width: 50vw; height: 50vw; max-width: 500px; max-height: 500px;
    background: radial-gradient(circle, rgba(16,185,129,0.1) 0%, rgba(0,0,0,0) 70%);
    bottom: -10%; right: -10%; border-radius: 50%; filter: blur(60px);
    animation: drift 20s ease-in-out infinite alternate-reverse;
  }
  @keyframes drift { 0% { transform: translate(0, 0); } 100% { transform: translate(50px, 50px); } }

  .login-card { 
    width: 100%; max-width: 420px; 
    background: rgba(14, 17, 22, 0.7); 
    backdrop-filter: blur(30px); -webkit-backdrop-filter: blur(30px);
    border: 1px solid rgba(255, 255, 255, 0.05); 
    border-radius: 28px; padding: 48px 36px; text-align: center; 
    box-shadow: 0 25px 50px -12px rgba(0,0,0,1), inset 0 1px 0 rgba(255,255,255,0.05);
    position: relative; z-index: 10;
  }
  
  .login-logo { 
    width: 72px; height: 72px; 
    background: linear-gradient(135deg, #10b981, #3b82f6); 
    border-radius: 20px; display: flex; align-items: center; justify-content: center; 
    margin: 0 auto 28px; font-size: 32px; font-weight: 800; color: #fff; 
    font-family: var(--font-mono); 
    box-shadow: 0 10px 25px -5px rgba(59,130,246,0.5);
  }
  
  .login-title { font-size: 28px; font-weight: 700; color: #fff; margin-bottom: 8px; letter-spacing: -0.5px; }
  .login-sub { font-size: 14px; color: var(--text2); margin-bottom: 36px; font-family: var(--font-mono); }
  
  .login-inp { 
    width: 100%; padding: 16px 20px; margin-bottom: 16px; 
    background: rgba(0,0,0,0.3); border: 1px solid var(--border); 
    border-radius: 14px; color: #fff; font-size: 15px; font-family: var(--font-mono);
    transition: all 0.2s ease; -webkit-appearance: none;
  }
  .login-inp:focus { 
    border-color: var(--blue); background: rgba(0,0,0,0.5); outline: none; 
    box-shadow: 0 0 0 4px rgba(59,130,246,0.15); 
  }
  .login-inp::placeholder { color: var(--text3); }
  
  .login-btn { 
    width: 100%; padding: 16px; border-radius: 14px; border: none; margin-top: 8px;
    background: var(--text); color: #000; 
    font-size: 16px; font-weight: 700; cursor: pointer; 
    transition: all 0.2s ease; font-family: var(--font-thai); 
  }
  .login-btn:hover { background: #e2e8f0; transform: translateY(-2px); box-shadow: 0 10px 20px -10px rgba(255,255,255,0.5); }
  .login-btn:active { transform: translateY(0); }

  /* ==================================================
     MAIN UI COMPONENTS
     ================================================== */
  .topnav { display: flex; align-items: center; justify-content: space-between; padding: 16px 32px; background: rgba(10, 12, 15, 0.85); border-bottom: 1px solid var(--border); position: sticky; top: 0; z-index: 100; backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); }
  .topnav-brand { display: flex; align-items: center; gap: 14px; }
  .topnav-logo { width: 40px; height: 40px; background: linear-gradient(135deg, var(--green), var(--blue)); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-family: var(--font-mono); font-weight: 700; font-size: 16px; color: #fff; box-shadow: 0 4px 12px rgba(59,130,246,0.3); }
  .topnav-title { font-size: 17px; font-weight: 600; color: var(--text); letter-spacing: -0.3px; }
  .topnav-sub { font-size: 12px; color: var(--text2); font-family: var(--font-mono); }
  
  .sync-badge { display: inline-flex; align-items: center; gap: 8px; background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.2); padding: 6px 12px; border-radius: 20px; font-size: 12px; color: var(--green); font-family: var(--font-mono); font-weight: 500; }
  .sync-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--green); box-shadow: 0 0 8px var(--green); animation: pulse 2s infinite; }
  @keyframes pulse { 0%,100%{opacity:1;} 50%{opacity:.4;} }
  
  .logout-btn { background: transparent; color: var(--text2); border: none; padding: 8px 12px; border-radius: 8px; cursor: pointer; font-size: 13px; font-weight: 500; transition: 0.2s; font-family: var(--font-thai); }
  .logout-btn:hover { color: var(--text); background: var(--bg3); }

  /* TABS */
  .tabs { display: flex; gap: 8px; padding: 16px 32px; background: var(--bg); border-bottom: 1px solid var(--border); overflow-x: auto; scrollbar-width: none; }
  .tabs::-webkit-scrollbar { display: none; }
  .tab { padding: 10px 20px; border-radius: 12px; border: 1px solid transparent; background: transparent; color: var(--text2); font-size: 14px; font-family: var(--font-thai); font-weight: 500; cursor: pointer; white-space: nowrap; transition: all .2s ease; display: flex; align-items: center; gap: 8px; }
  .tab:hover { color: var(--text); background: var(--bg2); }
  .tab.active { background: var(--bg3); border: 1px solid var(--border2); color: var(--text); font-weight: 600; box-shadow: 0 4px 12px rgba(0,0,0,0.2); }

  /* LAYOUT */
  .main { flex: 1; padding: 32px; max-width: 1440px; margin: 0 auto; width: 100%; }
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
  .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 24px; }
  .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }

  @media(max-width:1024px) { .grid-4{grid-template-columns:1fr 1fr} .grid-3{grid-template-columns:1fr 1fr} }
  @media(max-width:600px) { 
    .grid-2,.grid-3,.grid-4{grid-template-columns:1fr; gap: 16px;} 
    .main{padding: 16px;} .tabs { padding: 12px 16px; }
    .topnav { flex-direction: column; align-items: flex-start; gap: 16px; padding: 20px; }
    .data-table { display: block; overflow-x: auto; white-space: nowrap; -webkit-overflow-scrolling: touch; }
    .card { padding: 20px; border-radius: 16px; }
    .metric-val { font-size: 24px !important; }
  }

  /* CARDS */
  .card { background: var(--bg2); border: 1px solid var(--border); border-radius: var(--card-radius); padding: 28px; box-shadow: 0 4px 20px rgba(0,0,0,0.2); }
  .card-title { font-size: 12px; font-weight: 700; color: var(--text3); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 20px; font-family: var(--font-mono); }
  
  .metric-card { position: relative; overflow: hidden; }
  .metric-card::after { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 4px; background: var(--accent, var(--blue)); opacity: 0.8; }
  .metric-val { font-size: 32px; font-weight: 700; font-family: var(--font-mono); color: var(--text); letter-spacing: -1px; }
  .metric-sub { font-size: 13px; color: var(--text2); margin-top: 8px; }
  .metric-badge { display: inline-flex; align-items: center; padding: 4px 10px; border-radius: 8px; font-size: 12px; font-family: var(--font-mono); margin-top: 12px; font-weight: 600; }
  
  .badge-green { background: rgba(16,185,129,0.15); color: var(--green); }
  .badge-red { background: rgba(244,63,94,0.15); color: var(--red); }
  .badge-blue { background: rgba(59,130,246,0.15); color: var(--blue); }

  /* FORMS & SMS BOX FIX (แก้บัคมือถือ) */
  .input-row { display: flex; gap: 12px; margin-bottom: 16px; flex-wrap: wrap; }
  .inp, select.inp { 
    flex: 1; min-width: 140px; padding: 14px 16px; 
    background: var(--bg3); border: 1px solid var(--border2); 
    border-radius: 12px; color: var(--text); font-size: 14px; font-family: var(--font-thai); 
    outline: none; transition: border-color .2s; -webkit-appearance: none;
  }
  .inp:focus, select.inp:focus { border-color: var(--blue); box-shadow: 0 0 0 3px rgba(59,130,246,0.1); }
  
  .btn { padding: 14px 24px; border-radius: 12px; border: none; font-size: 14px; font-family: var(--font-thai); cursor: pointer; font-weight: 600; transition: all .2s; display: inline-flex; align-items: center; justify-content: center; gap: 8px;}
  .btn:hover { filter: brightness(1.1); transform: translateY(-1px); }
  .btn-green { background: var(--green); color: #000; }
  .btn-blue { background: var(--blue); color: #fff; }

  /* 🛠️ แก้บัค SMS กล่องขาวบนมือถือ 🛠️ */
  .sms-box { 
    width: 100%; min-height: 120px; padding: 16px; 
    background: var(--bg3) !important; /* บังคับทับสีขาวจากเบราว์เซอร์ */
    border: 1px solid var(--border2); border-radius: 12px; 
    color: var(--text) !important; font-size: 14px; font-family: var(--font-mono); 
    resize: vertical; outline: none; -webkit-appearance: none; /* ล้างค่า Default มือถือ */
    box-shadow: inset 0 2px 4px rgba(0,0,0,0.2);
  }
  .sms-box:focus { border-color: var(--blue); box-shadow: 0 0 0 3px rgba(59,130,246,0.1); }
  .sms-box::placeholder { color: var(--text3); }

  /* TABLES & LISTS */
  .data-table { width: 100%; border-collapse: collapse; }
  .data-table th { font-size: 11px; color: var(--text3); font-family: var(--font-mono); text-transform: uppercase; letter-spacing: 0.1em; padding: 16px; text-align: left; border-bottom: 1px solid var(--border2); }
  .data-table td { padding: 16px; border-bottom: 1px solid var(--border); font-size: 14px; }
  .data-table tr:hover td { background: rgba(255,255,255,0.02); }
  
  .tx-item { display: flex; align-items: center; gap: 16px; padding: 16px 0; border-bottom: 1px solid var(--border); }
  .tx-item:last-child { border-bottom: none; }
  .tx-icon { width: 44px; height: 44px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0; background: var(--bg3); }
  .tx-info { flex: 1; min-width: 0; }
  .tx-name { font-size: 15px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .tx-meta { font-size: 12px; color: var(--text2); margin-top: 6px; font-family: var(--font-mono); }
  .tx-amount { font-family: var(--font-mono); font-size: 16px; font-weight: 600; text-align: right; flex-shrink: 0; }

  /* UTILS */
  .tag { display: inline-block; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-family: var(--font-mono); font-weight: 600; text-transform: uppercase; }
  .tag-income { background: rgba(16,185,129,0.15); color: var(--green); }
  .tag-expense { background: rgba(244,63,94,0.15); color: var(--red); }
  .tag-invest { background: rgba(59,130,246,0.15); color: var(--blue); }
  .gap-24 { display: flex; flex-direction: column; gap: 24px; }
  .text-right { text-align: right; } .text-mono { font-family: var(--font-mono); }
  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 4px; }
`;

// ============================================================
// DATA & UTILS
// ============================================================
const MOCK_PRICES = {
  VOO: { price: 662.42, change: -0.18, pct: -0.03, name: "Vanguard S&P 500" },
  NVDA: { price: 890.00, change: 23.4, pct: 2.73, name: "NVIDIA" }, 
  GOOG: { price: 170.00, change: 0.90, pct: 0.55, name: "Alphabet Class C" }
};

const CATEGORIES = {
  food: { label: "อาหาร", icon: "🍜", color: "#f59e0b" },
  transport: { label: "เดินทาง", icon: "🚗", color: "#3b82f6" },
  shopping: { label: "ช้อปปิ้ง", icon: "🛍️", color: "#8b5cf6" },
  bills: { label: "ค่าบิล", icon: "📄", color: "#f43f5e" },
  health: { label: "สุขภาพ", icon: "💊", color: "#10b981" },
  invest: { label: "ลงทุน", icon: "📈", color: "#3b82f6" },
  income: { label: "รายรับ", icon: "💰", color: "#10b981" },
  other: { label: "อื่นๆ", icon: "💸", color: "#94a3b8" },
};

const INITIAL_TXS = [];
const INITIAL_PORTFOLIO = [
  { symbol: "VOO", shares: 0.0276222, avgCost: 651.65, exchange: "US" },
  { symbol: "NVDA", shares: 0.0620563, avgCost: 200.4630, exchange: "US" },
  { symbol: "GOOG", shares: 0.0300009, avgCost: 341.6560, exchange: "US" }
];
const BUDGETS = [
  { cat: "food", limit: 5000 }, { cat: "transport", limit: 2000 },
  { cat: "shopping", limit: 3000 }, { cat: "bills", limit: 12000 },
];

function fmt(n, dec = 0) { return (n||0).toLocaleString("th-TH", { minimumFractionDigits: dec, maximumFractionDigits: dec }); }

function parseMakeSMS(sms) {
  const text = sms.trim(); const result = { valid: false };
  const investMatch = text.match(/ซื้อ|ซื้อหุ้น|buy|ลงทุน|invest/i);
  const incomeMatch = text.match(/รับโอน|รับชำระ|เงินเข้า|โอนเงินเข้า|โอนเข้า|deposit|received/i);
  const amtMatch = text.match(/(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)\s*(?:บาท|THB|฿)/i) || text.match(/(?:จำนวน|Amount)[:\s]*(\d[\d,\.]+)/i) || text.match(/(\d{1,3}(?:,\d{3})*\.\d{2})/);
  const dateMatch = text.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/);
  const refMatch = text.match(/(?:ที่|จาก|ไปยัง|to|from|Ref)[:\s]*([^\n]+)/i);

  if (amtMatch) {
    result.valid = true; result.amount = parseFloat(amtMatch[1].replace(/,/g, ""));
    if (investMatch) {
      result.type = "expense"; result.direction = "-"; result.cat = "invest";
      const symMatch = text.match(/\b([A-Z]{2,10})\b/); if (symMatch) result.symbol = symMatch[1];
      const shareMatch = text.match(/(\d+(?:\.\d+)?)\s*หุ้น/); if (shareMatch) result.shares = parseFloat(shareMatch[1]);
    } else if (incomeMatch) {
      result.type = "income"; result.direction = "+"; result.cat = "income";
    } else {
      result.type = "expense"; result.direction = "-";
      const tLower = (refMatch ? refMatch[1] : text).toLowerCase();
      result.cat = /grab|taxi|bts|mrt|uber/.test(tLower) ? "transport" : /netflix|spotify|true|ais|dtac|ค่าน้ำ|ค่าไฟ/.test(tLower) ? "bills" : /โรง|pharma|ยา|clinic/.test(tLower) ? "health" : /lazada|shopee|amazon/.test(tLower) ? "shopping" : /ร้าน|food|กาแฟ|ข้าว/.test(tLower) ? "food" : "other";
    }
    result.date = dateMatch ? `${dateMatch[3].length === 2 ? "20" + dateMatch[3] : dateMatch[3]}-${String(dateMatch[2]).padStart(2, "0")}-${String(dateMatch[1]).padStart(2, "0")}` : new Date().toISOString().slice(0, 10);
    result.merchant = refMatch ? refMatch[1].trim().slice(0, 40) : (investMatch ? "Invest" : "MAKE by KBank");
  }
  return result;
}

// ============================================================
// COMPONENTS
// ============================================================
function DonutChart({ data, size = 150 }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  if (total === 0) return <svg width={size} height={size} style={{ flexShrink: 0 }}></svg>;
  let acc = 0;
  const arcs = data.map(d => { const pct = d.value / total; const start = acc; acc += pct; return { ...d, pct, start }; });
  const cx = size / 2, cy = size / 2, r = size * 0.38, inner = size * 0.25;
  function slice(s, p) {
    if (p === 1) return `M ${cx} ${cy - r} A ${r} ${r} 0 1 1 ${cx} ${cy + r} A ${r} ${r} 0 1 1 ${cx} ${cy - r} Z`;
    const a1 = s * 2 * Math.PI - Math.PI / 2, a2 = (s + p) * 2 * Math.PI - Math.PI / 2;
    const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1), x2 = cx + r * Math.cos(a2), y2 = cy + r * Math.sin(a2);
    const ix1 = cx + inner * Math.cos(a1), iy1 = cy + inner * Math.sin(a1), ix2 = cx + inner * Math.cos(a2), iy2 = cy + inner * Math.sin(a2);
    return `M ${ix1} ${iy1} L ${x1} ${y1} A ${r} ${r} 0 ${p > 0.5 ? 1 : 0} 1 ${x2} ${y2} L ${ix2} ${iy2} A ${inner} ${inner} 0 ${p > 0.5 ? 1 : 0} 0 ${ix1} ${iy1} Z`;
  }
  return <svg width={size} height={size} style={{ flexShrink: 0 }}>{arcs.map((a, i) => <path key={i} d={slice(a.start, a.pct)} fill={a.color} opacity={1} />)}</svg>;
}

// ---------------- DASHBOARD TAB ----------------
function DashboardTab({ txs, portfolio, livePrices, isLoadingPrices }) {
  const thisMonth = txs.filter(t => t.date.startsWith(new Date().toISOString().slice(0, 7)));
  const income = thisMonth.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const expense = thisMonth.filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);
  const bankBalance = txs.reduce((sum, t) => sum + t.amount, 0);
  
  const portValue = portfolio.reduce((s, p) => s + (livePrices[p.symbol]?.price || p.avgCost) * p.shares, 0);
  const portCost = portfolio.reduce((s, p) => s + p.avgCost * p.shares, 0);
  const portPnL = portValue - portCost;
  const portValueTHB = portValue * 32.54;
  const netWorth = bankBalance + portValueTHB;

  const allocData = [{ label: "เงินฝาก", value: Math.max(bankBalance, 0), color: "#3b82f6" }, { label: "หุ้น US", value: portValueTHB, color: "#10b981" }].filter(d => d.value > 0);

  return (
    <div className="gap-24">
      <div className="grid-4">
        <div className="card metric-card" style={{ "--accent": "#10b981" }}><div className="card-title">Net Worth</div><div className="metric-val" style={{fontSize: isLoadingPrices?'20px':'32px'}}>{isLoadingPrices?"คำนวณ...":`฿${fmt(netWorth)}`}</div><div className="metric-badge badge-green">LIVE UPDATED</div></div>
        <div className="card metric-card" style={{ "--accent": "#3b82f6" }}><div className="card-title">รายรับเดือนนี้</div><div className="metric-val">฿{fmt(income)}</div><div className="metric-badge badge-blue">INCOME</div></div>
        <div className="card metric-card" style={{ "--accent": expense > 30000 ? "#f43f5e" : "#10b981" }}><div className="card-title">รายจ่ายเดือนนี้</div><div className="metric-val">฿{fmt(expense)}</div><div className={`metric-badge ${expense > 30000 ? "badge-red" : "badge-green"}`}>{expense > 30000 ? "เกินงบแล้ว" : "อยู่ในงบประมาณ"}</div></div>
        <div className="card metric-card" style={{ "--accent": "#8b5cf6" }}><div className="card-title">มูลค่าพอร์ต (THB)</div><div className="metric-val" style={{fontSize: isLoadingPrices?'20px':'32px'}}>{isLoadingPrices?"คำนวณ...":`฿${fmt(portValueTHB)}`}</div><div className="metric-sub">{isLoadingPrices?"":`P&L: ${portPnL>=0?"+":""}$${fmt(portPnL, 2)}`}</div></div>
      </div>
      <div className="grid-2">
        <div className="card">
          <div className="card-title">Asset Allocation</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '30px', marginTop: '10px' }}>
            <DonutChart data={allocData} size={160} />
            <div style={{ flex: 1 }}>{allocData.map((d, i) => (<div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}><div style={{ width: '12px', height: '12px', borderRadius: '4px', background: d.color }} /><span style={{ fontSize: '13px', color: 'var(--text2)', flex: 1 }}>{d.label}</span><span style={{ fontSize: '14px', fontFamily: 'var(--font-mono)', color: 'var(--text)', fontWeight: 600 }}>฿{fmt(d.value)}</span></div>))}</div>
          </div>
        </div>
        <div className="card">
          <div className="section-header"><span className="section-title">รายการล่าสุด</span></div>
          {txs.slice(0, 4).map(tx => {
            const cat = CATEGORIES[tx.cat] || CATEGORIES.other;
            return (
              <div key={tx.id} className="tx-item">
                <div className="tx-icon" style={{ background: cat.color + "15", color: cat.color }}>{cat.icon}</div>
                <div className="tx-info"><div className="tx-name">{tx.desc}</div><div className="tx-meta">{tx.date}</div></div>
                <div className="tx-amount" style={{ color: tx.amount > 0 ? "var(--green)" : "var(--text)" }}>{tx.amount > 0 ? "+" : ""}฿{fmt(Math.abs(tx.amount))}</div>
              </div>
            );
          })}
          {txs.length === 0 && <div style={{ textAlign: "center", color: "var(--text3)", padding: "20px" }}>ยังไม่มีข้อมูล</div>}
        </div>
      </div>
    </div>
  );
}

// ---------------- TRANSACTIONS TAB ----------------
function TransactionsTab({ txs, setTxs }) {
  const [desc, setDesc] = useState(""); const [amount, setAmount] = useState("");
  const [cat, setCat] = useState("food"); const [type, setType] = useState("var");

  function addTx() {
    if (!desc || !amount) return;
    setTxs(prev => [{ id: Date.now(), date: new Date().toISOString().slice(0, 10), desc, amount: parseFloat(amount), cat, type, src: "manual" }, ...prev]);
    setDesc(""); setAmount("");
  }

  return (
    <div className="gap-24">
      <div className="card">
        <div className="card-title">บันทึกรายการด่วน</div>
        <div className="input-row">
          <input className="inp" placeholder="คำอธิบายรายการ" value={desc} onChange={e => setDesc(e.target.value)} style={{ flex: 2 }} />
          <input className="inp" type="number" placeholder="จำนวนเงิน (+/-)" value={amount} onChange={e => setAmount(e.target.value)} style={{ flex: 1 }} />
        </div>
        <div className="input-row">
          <select className="inp" value={cat} onChange={e => setCat(e.target.value)}>{Object.entries(CATEGORIES).map(([k, v]) => <option key={k} value={k}>{v.icon} {v.label}</option>)}</select>
          <select className="inp" value={type} onChange={e => setType(e.target.value)}><option value="fix">🔒 Fix Cost (คงที่)</option><option value="var">📊 Variable Cost (ผันแปร)</option></select>
          <button className="btn btn-blue" onClick={addTx} style={{ minWidth: '140px' }}>+ บันทึก</button>
        </div>
      </div>
      <div className="card">
        <div className="section-header"><span className="section-title">ประวัติรายการ ({txs.length})</span></div>
        <table className="data-table">
          <thead><tr><th>วันที่</th><th>รายการ</th><th>ประเภท</th><th className="text-right">จำนวน</th></tr></thead>
          <tbody>
            {txs.map(tx => (
              <tr key={tx.id}>
                <td className="text-mono text-muted">{tx.date}</td><td style={{ fontSize: 14, fontWeight: 500 }}>{tx.desc}</td>
                <td><span className={tx.type === "fix" ? "tag tag-fix" : "tag tag-var"}>{tx.type === "fix" ? "Fix Cost" : "Variable"}</span></td>
                <td className="text-right text-mono" style={{ color: tx.amount > 0 ? "var(--green)" : "var(--text)", fontWeight: 600 }}>{tx.amount > 0 ? "+" : ""}฿{fmt(Math.abs(tx.amount))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---------------- SMS PARSER TAB ----------------
function SmsParserTab({ setTxs, portfolio, setPortfolio }) {
  const [sms, setSms] = useState(""); const [result, setResult] = useState(null); const [added, setAdded] = useState(false);
  function parse() { setResult(parseMakeSMS(sms)); setAdded(false); }
  
  function addToLedger() {
    if (!result?.valid) return;
    setTxs(prev => [{ id: Date.now(), date: result.date, desc: result.cat === "invest" && result.symbol ? `ซื้อหุ้น ${result.symbol}` : result.merchant, amount: result.type === "income" ? result.amount : -result.amount, cat: result.cat, type: "var", src: "make-sms" }, ...prev]);
    if (result.cat === "invest" && result.symbol) {
      setPortfolio(prev => {
        const newSym = result.symbol.toUpperCase(); const existingIndex = prev.findIndex(p => p.symbol === newSym);
        const sharesToAdd = result.shares || 1; const costUSD = result.amount / 32.54; const avgCostPerShare = costUSD / sharesToAdd;
        if (existingIndex >= 0) {
          const existing = prev[existingIndex]; const updatedShares = existing.shares + sharesToAdd;
          const updatedAvgCost = ((existing.shares * existing.avgCost) + costUSD) / updatedShares;
          const updatedPortfolio = [...prev]; updatedPortfolio[existingIndex] = { ...existing, shares: updatedShares, avgCost: updatedAvgCost };
          return updatedPortfolio;
        } else return [...prev, { symbol: newSym, shares: sharesToAdd, avgCost: avgCostPerShare, exchange: "US" }];
      });
    }
    setAdded(true);
  }

  return (
    <div className="gap-24">
      <div className="card">
        <div className="card-title">วาง SMS / Notification จากแอปธนาคารที่นี่</div>
        <textarea className="sms-box" placeholder="วางข้อความ SMS จาก MAKE by KBank หรือแอปเทรด..." value={sms} onChange={e => { setSms(e.target.value); setResult(null); }} />
        <div className="row mt-16"><button className="btn btn-blue" onClick={parse}>🔍 ดึงข้อมูลจากข้อความ</button></div>
        {result && (
          <div className="parse-result mt-16" style={{ background: result.valid ? 'rgba(16,185,129,0.1)' : 'rgba(244,63,94,0.1)', borderColor: result.valid ? 'rgba(16,185,129,0.2)' : 'rgba(244,63,94,0.2)' }}>
            {result.valid ? (
              <><div style={{ fontSize: 14, fontWeight: 700, color: "var(--green)", marginBottom: 16 }}>✅ พบข้อมูลที่สามารถบันทึกได้</div>
                {Object.entries({ "ประเภท": result.type === "income" ? "💰 รายรับ" : "💸 รายจ่าย", "จำนวนเงิน": `฿${fmt(result.amount, 2)}`, "ร้านค้า": result.merchant }).map(([k, v]) => <div key={k} className="parse-row" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}><span className="parse-key">{k}</span><span className="parse-val">{v}</span></div>)}
                <div className="row mt-16"><button className="btn btn-green" onClick={addToLedger} disabled={added}>{added ? "✅ บันทึกลงบัญชีเรียบร้อย" : "+ ยืนยันการบันทึก"}</button></div>
              </>
            ) : <div style={{ color: "var(--red)", fontSize: 14 }}>❌ ไม่พบรูปแบบข้อมูลที่รองรับ กรุณาตรวจสอบข้อความอีกครั้ง</div>}
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------- PORTFOLIO TAB ----------------
function PortfolioTab({ portfolio, setPortfolio, livePrices, isLoadingPrices }) {
  const [symbol, setSymbol] = useState(""); const [shares, setShares] = useState(""); const [cost, setCost] = useState("");
  
  function addHolding() {
    if (!symbol || !shares || !cost) return;
    const newSym = symbol.toUpperCase(); const newShares = parseFloat(shares); const newCost = parseFloat(cost);
    setPortfolio(prev => {
      const existingIndex = prev.findIndex(p => p.symbol === newSym);
      if (existingIndex >= 0) {
        const existing = prev[existingIndex]; const updatedShares = existing.shares + newShares;
        const updatedAvgCost = ((existing.shares * existing.avgCost) + (newShares * newCost)) / updatedShares;
        const updatedPortfolio = [...prev]; updatedPortfolio[existingIndex] = { ...existing, shares: updatedShares, avgCost: updatedAvgCost };
        return updatedPortfolio;
      } else return [...prev, { symbol: newSym, shares: newShares, avgCost: newCost, exchange: "US" }];
    });
    setSymbol(""); setShares(""); setCost("");
  }

  const rows = portfolio.map(p => {
    const px = livePrices[p.symbol]; const currentPrice = px?.price || p.avgCost;
    const mktVal = currentPrice * p.shares * 32.54; const costVal = p.avgCost * p.shares * 32.54;
    return { ...p, currentPrice, mktVal, costVal, pnl: mktVal - costVal, pnlPct: ((mktVal - costVal) / (costVal || 1)) * 100, change: px?.change || 0, changePct: px?.pct || 0 };
  });

  return (
    <div className="gap-24">
      <div className="card"><div className="section-header"><span className="section-title">หุ้น Dime! ที่ถืออยู่</span></div>
        <table className="data-table">
          <thead><tr><th>ชื่อหุ้น</th><th className="text-right">จำนวน</th><th className="text-right">ต้นทุนเฉลี่ย</th><th className="text-right">ราคาปัจจุบัน</th><th className="text-right">มูลค่า (฿)</th><th className="text-right">P&L</th></tr></thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 700, fontSize: '15px' }}>{r.symbol}</td><td className="text-right text-mono">{r.shares}</td><td className="text-right text-mono">${fmt(r.avgCost, 2)}</td><td className="text-right text-mono">{isLoadingPrices?"...":`$${fmt(r.currentPrice, 2)}`}</td><td className="text-right text-mono">{isLoadingPrices?"...":`฿${fmt(r.mktVal)}`}</td>
                <td className="text-right text-mono" style={{ color: r.pnl >= 0 && !isLoadingPrices ? "var(--green)" : "var(--red)", fontWeight: 600 }}>{isLoadingPrices?"...":<>{r.pnl >= 0 ? "+" : ""}฿{fmt(r.pnl)}<br /><span style={{ fontSize: 11 }}>({r.pnl >= 0 ? "+" : ""}{r.pnlPct.toFixed(1)}%)</span></>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="card"><div className="card-title">ซื้อหุ้นเพิ่ม (ถัวเฉลี่ยต้นทุนอัตโนมัติ)</div>
        <div style={{ color: 'var(--text2)', fontSize: '12px', marginBottom: '16px' }}>*หากใส่ชื่อหุ้นที่มีอยู่แล้ว ระบบจะรวมจำนวนและคำนวณต้นทุนเฉลี่ยให้ใหม่</div>
        <div className="input-row"><input className="inp" placeholder="Symbol (เช่น VOO)" value={symbol} onChange={e => setSymbol(e.target.value)} /><input className="inp" type="number" placeholder="จำนวนหุ้น" value={shares} onChange={e => setShares(e.target.value)} /><input className="inp" type="number" placeholder="ราคาต้นทุน ($)" value={cost} onChange={e => setCost(e.target.value)} /><button className="btn btn-blue" onClick={addHolding} style={{ minWidth: '120px' }}>+ บันทึก</button></div>
      </div>
    </div>
  );
}

// ---------------- MAIN APP COMPONENT ----------------
const TABS = [
  { id: "dashboard", icon: "⬛", label: "Dashboard" },
  { id: "transactions", icon: "💳", label: "รายการเดินบัญชี" },
  { id: "sms", icon: "📲", label: "ตัวอ่าน SMS" },
  { id: "portfolio", icon: "📈", label: "พอร์ตลงทุน" }
];

export default function App() {
  const [user, setUser] = useState(() => localStorage.getItem("tw_user") || null);
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState(false);

  const [activeTab, setActiveTab] = useState("dashboard");
  const [txs, setTxs] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(true);

  const [livePrices, setLivePrices] = useState({ ...MOCK_PRICES });
  const [isLoadingPrices, setIsLoadingPrices] = useState(true);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    const unsub = onSnapshot(doc(db, "users", user), (res) => {
      if (res.exists()) {
        const data = res.data();
        setTxs(data.txs || []); setPortfolio(data.portfolio || []);
      } else {
        const initial = { txs: INITIAL_TXS, portfolio: INITIAL_PORTFOLIO };
        setDoc(doc(db, "users", user), initial);
      }
      setLoading(false);
    });
    return () => unsub();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const API_KEY = "d7sandpr01qorsvi1jagd7sandpr01qorsvi1jb0"; 
    const symbolsToFetch = ["VOO", "NVDA", "GOOG"]; 
    Promise.all(symbolsToFetch.map(sym => fetch(`https://finnhub.io/api/v1/quote?symbol=${sym}&token=${API_KEY}`).then(res => res.json()).then(data => ({ symbol: sym, price: data.c, change: data.d, pct: data.dp })).catch(() => null)))
    .then(results => {
      setLivePrices(prev => {
        const next = { ...prev };
        results.forEach(item => { if (item && item.price) next[item.symbol] = { ...next[item.symbol], price: item.price, change: item.change, pct: item.pct }; });
        return next;
      });
      setIsLoadingPrices(false);
    });
  }, [user]);

  const handleSetTxs = (action) => { setTxs(prev => { const next = typeof action === "function" ? action(prev) : action; if (user) setDoc(doc(db, "users", user), { txs: next }, { merge: true }); return next; }); };
  const handleSetPortfolio = (action) => { setPortfolio(prev => { const next = typeof action === "function" ? action(prev) : action; if (user) setDoc(doc(db, "users", user), { portfolio: next }, { merge: true }); return next; }); };

  const handleLogin = (e) => {
    e.preventDefault();
    if (AUTHORIZED_USERS[usernameInput] === passwordInput) {
      setUser(usernameInput); localStorage.setItem("tw_user", usernameInput); setLoginError(false);
    } else setLoginError(true);
  };

  if (!user) {
    return (
      <div className="login-container">
        <style>{styles}</style>
        <div className="glow-orb-1" />
        <div className="glow-orb-2" />
        <div className="login-card">
          <div className="login-logo">Th</div>
          <h2 className="login-title">Threewit OS</h2>
          <p className="login-sub">Personal Finance Engine</p>
          <form onSubmit={handleLogin}>
            <input className="login-inp" placeholder="Username" onChange={e => setUsernameInput(e.target.value)} />
            <input className="login-inp" type="password" placeholder="Password" onChange={e => setPasswordInput(e.target.value)} />
            {loginError && <p style={{color:'var(--red)', fontSize:'13px', marginBottom:'16px', fontWeight:600}}>รหัสผ่านไม่ถูกต้อง กรุณาลองใหม่</p>}
            <button className="login-btn" type="submit">Access System</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        <nav className="topnav">
          <div className="topnav-brand">
            <div className="topnav-logo">Th</div>
            <div><div className="topnav-title">Threewit OS</div><div className="topnav-sub">Connected as <span style={{color:'var(--blue)', fontWeight:600}}>{user}</span></div></div>
          </div>
          <div style={{display:'flex', gap:'16px', alignItems:'center'}}>
            <div className="sync-badge"><div className="sync-dot" /> Cloud Sync</div>
            <button className="logout-btn" onClick={() => { localStorage.removeItem("tw_user"); setUser(null); }}>Disconnect</button>
          </div>
        </nav>
        <div className="tabs">
          {TABS.map(t => <button key={t.id} className={`tab ${activeTab === t.id ? "active" : ""}`} onClick={() => setActiveTab(t.id)}><span className="tab-icon">{t.icon}</span> {t.label}</button>)}
        </div>
        <div className="main">
          {loading ? (
            <div style={{textAlign:'center', padding:'80px', color:'var(--text2)', fontFamily:'var(--font-mono)', fontSize:'15px'}}>
              <div style={{width:'30px', height:'30px', border:'3px solid var(--border2)', borderTopColor:'var(--blue)', borderRadius:'50%', animation:'spin 1s linear infinite', margin:'0 auto 16px'}} />
              <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
              กำลังซิงค์ข้อมูล...
            </div>
          ) : (
            <>
              {activeTab === "dashboard" && <DashboardTab txs={txs} portfolio={portfolio} livePrices={livePrices} isLoadingPrices={isLoadingPrices} />}
              {activeTab === "transactions" && <TransactionsTab txs={txs} setTxs={handleSetTxs} />}
              {activeTab === "sms" && <SmsParserTab setTxs={handleSetTxs} portfolio={portfolio} setPortfolio={handleSetPortfolio} />}
              {activeTab === "portfolio" && <PortfolioTab portfolio={portfolio} setPortfolio={handleSetPortfolio} livePrices={livePrices} isLoadingPrices={isLoadingPrices} />}
            </>
          )}
        </div>
      </div>
    </>
  );
}

