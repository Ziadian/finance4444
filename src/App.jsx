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

// เริ่มต้นเชื่อมต่อ Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// รหัสผ่านเข้าใช้งาน
const AUTHORIZED_USERS = {
  "admin": "zxc12345",
  "friend": "welcome"
};

// ============================================================
// STYLES (อัปเกรด Premium Login + Glassmorphism)
// ============================================================
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500;600;700&family=Noto+Sans+Thai:wght@300;400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0a0c0f; --bg2: #111318; --bg3: #181c23; --border: #1e2430; --border2: #252d3a;
    --text: #e8eaf0; --text2: #8892a4; --text3: #4a5568;
    --green: #00d68f; --red: #ff4d6a; --blue: #3d8bff; --blue2: #1a6bdd; --gold: #f0b429;
    --card-radius: 16px;
    --font-mono: 'IBM Plex Mono', monospace; --font-thai: 'Noto Sans Thai', sans-serif;
  }

  body { background: var(--bg); color: var(--text); font-family: var(--font-thai); -webkit-font-smoothing: antialiased; }
  .app { min-height: 100vh; display: flex; flex-direction: column; }

  /* 💎 PREMIUM LOGIN PAGE 💎 */
  .login-container { 
    height: 100vh; display: flex; align-items: center; justify-content: center; 
    background: radial-gradient(circle at 50% 0%, #161f2e 0%, var(--bg) 70%);
    position: relative; overflow: hidden; padding: 20px;
  }
  .login-container::before {
    content: ''; position: absolute; width: 500px; height: 500px;
    background: var(--blue); filter: blur(150px); opacity: 0.15; border-radius: 50%;
    top: -150px; left: -100px; animation: float 10s infinite alternate;
  }
  .login-container::after {
    content: ''; position: absolute; width: 400px; height: 400px;
    background: var(--green); filter: blur(150px); opacity: 0.1; border-radius: 50%;
    bottom: -100px; right: -50px; animation: float 12s infinite alternate-reverse;
  }
  @keyframes float { 0% { transform: translateY(0px); } 100% { transform: translateY(30px); } }
  
  .login-card { 
    width: 100%; max-width: 380px; 
    background: rgba(17, 19, 24, 0.65); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
    border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 24px; 
    padding: 40px 32px; text-align: center; box-shadow: 0 30px 60px rgba(0,0,0,0.6);
    position: relative; z-index: 10;
  }
  .login-logo { 
    width: 64px; height: 64px; background: linear-gradient(135deg, var(--green), var(--blue)); 
    border-radius: 18px; display: flex; align-items: center; justify-content: center; 
    margin: 0 auto 24px; font-size: 28px; font-weight: 800; color: #000; font-family: var(--font-mono); 
    box-shadow: 0 10px 20px rgba(61,139,255,0.2);
  }
  .login-title { font-size: 24px; font-weight: 700; color: #fff; margin-bottom: 6px; letter-spacing: 0.5px; }
  .login-sub { font-size: 13px; color: var(--text2); margin-bottom: 32px; font-family: var(--font-mono); }
  
  .login-inp { 
    width: 100%; padding: 15px 16px; margin-bottom: 16px; 
    background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.08); 
    border-radius: 12px; color: #fff; font-size: 15px; font-family: var(--font-mono);
    transition: all 0.3s;
  }
  .login-inp:focus { border-color: var(--blue); background: rgba(0,0,0,0.4); outline: none; box-shadow: 0 0 0 4px rgba(61,139,255,0.15); }
  
  .login-btn { 
    width: 100%; padding: 15px; border-radius: 12px; border: none; 
    background: linear-gradient(135deg, var(--blue), var(--blue2)); 
    color: #fff; font-size: 15px; font-weight: 600; cursor: pointer; 
    transition: all 0.3s; box-shadow: 0 4px 15px rgba(61,139,255,0.3); font-family: var(--font-mono); letter-spacing: 1px; text-transform: uppercase;
  }
  .login-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(61,139,255,0.45); }

  /* MAIN UI */
  .topnav { display: flex; align-items: center; justify-content: space-between; padding: 16px 32px; background: rgba(17, 19, 24, 0.8); border-bottom: 1px solid var(--border); position: sticky; top: 0; z-index: 100; backdrop-filter: blur(16px); }
  .topnav-brand { display: flex; align-items: center; gap: 12px; }
  .topnav-logo { width: 36px; height: 36px; background: linear-gradient(135deg, var(--green), var(--blue)); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-family: var(--font-mono); font-weight: 700; font-size: 15px; color: #000; }
  .topnav-title { font-size: 16px; font-weight: 600; color: var(--text); }
  .topnav-sub { font-size: 11px; color: var(--text2); font-family: var(--font-mono); }
  .topnav-sync { display: flex; align-items: center; gap: 8px; font-size: 12px; color: var(--text2); font-family: var(--font-mono); }
  .sync-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--green); animation: pulse 2s infinite; }
  @keyframes pulse { 0%,100%{opacity:1; box-shadow: 0 0 10px var(--green);} 50%{opacity:.4; box-shadow: none;} }
  .logout-btn { background: transparent; color: var(--red); border: 1px solid var(--border); padding: 8px 16px; border-radius: 8px; cursor: pointer; font-size: 12px; font-weight: 600; transition: 0.2s; font-family: var(--font-mono); }
  .logout-btn:hover { background: rgba(255,77,106,0.1); border-color: rgba(255,77,106,0.3); }

  /* TABS */
  .tabs { display: flex; gap: 8px; padding: 16px 32px; background: var(--bg); border-bottom: 1px solid var(--border); overflow-x: auto; scrollbar-width: none; }
  .tabs::-webkit-scrollbar { display: none; }
  .tab { padding: 8px 18px; border-radius: 10px; border: 1px solid transparent; background: var(--bg2); color: var(--text2); font-size: 13px; font-family: var(--font-thai); cursor: pointer; white-space: nowrap; transition: all .2s; display: flex; align-items: center; gap: 8px; }
  .tab:hover { color: var(--text); background: var(--bg3); }
  .tab.active { background: var(--blue); color: #fff; font-weight: 600; box-shadow: 0 4px 12px rgba(61,139,255,0.2); }
  .tab-icon { font-size: 15px; }

  /* GRID & LAYOUT */
  .main { flex: 1; padding: 24px 32px; max-width: 1400px; margin: 0 auto; width: 100%; }
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; }
  .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }

  @media(max-width:900px) { .grid-4{grid-template-columns:1fr 1fr} .grid-3{grid-template-columns:1fr 1fr} }
  @media(max-width:600px) { 
    .grid-2,.grid-3,.grid-4{grid-template-columns:1fr} 
    .main{padding:16px} .tabs { padding: 12px 16px; }
    .topnav { flex-direction: column; align-items: flex-start; gap: 16px; padding: 20px; }
    .data-table { display: block; overflow-x: auto; white-space: nowrap; -webkit-overflow-scrolling: touch; }
    .metric-val { font-size: 24px !important; }
    .card { padding: 20px; }
  }

  /* CARDS */
  .card { background: var(--bg2); border: 1px solid var(--border); border-radius: var(--card-radius); padding: 24px; transition: border-color .2s, transform .2s; }
  .card:hover { border-color: var(--border2); }
  .card-title { font-size: 11px; font-weight: 700; color: var(--text3); letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 16px; font-family: var(--font-mono); }
  
  .metric-card { position: relative; overflow: hidden; }
  .metric-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: var(--accent, var(--blue)); }
  .metric-val { font-size: 28px; font-weight: 700; font-family: var(--font-mono); color: var(--text); }
  .metric-sub { font-size: 12px; color: var(--text2); margin-top: 6px; }
  .metric-badge { display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-family: var(--font-mono); margin-top: 8px; font-weight: 600; }
  
  .badge-green { background: rgba(0,214,143,.12); color: var(--green); }
  .badge-red { background: rgba(255,77,106,.12); color: var(--red); }
  .badge-blue { background: rgba(61,139,255,.12); color: var(--blue); }

  /* TABLES & LISTS */
  .section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
  .section-title { font-size: 16px; font-weight: 600; color: var(--text); }
  
  .data-table { width: 100%; border-collapse: collapse; }
  .data-table th { font-size: 10px; color: var(--text3); font-family: var(--font-mono); text-transform: uppercase; letter-spacing: 0.1em; padding: 12px 16px; text-align: left; border-bottom: 1px solid var(--border); }
  .data-table td { padding: 16px; border-bottom: 1px solid var(--border); font-size: 13px; }
  .data-table tr:hover td { background: rgba(255,255,255,.02); }
  
  .tx-item { display: flex; align-items: center; gap: 16px; padding: 16px 0; border-bottom: 1px solid var(--border); }
  .tx-item:last-child { border-bottom: none; }
  .tx-icon { width: 42px; height: 42px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }
  .tx-info { flex: 1; min-width: 0; }
  .tx-name { font-size: 14px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .tx-meta { font-size: 11px; color: var(--text2); margin-top: 4px; font-family: var(--font-mono); }
  .tx-amount { font-family: var(--font-mono); font-size: 15px; font-weight: 600; text-align: right; flex-shrink: 0; }

  /* FORMS & INPUTS */
  .input-row { display: flex; gap: 12px; margin-bottom: 16px; flex-wrap: wrap; }
  .inp { flex: 1; min-width: 140px; padding: 12px 16px; background: var(--bg3); border: 1px solid var(--border2); border-radius: 10px; color: var(--text); font-size: 14px; font-family: var(--font-thai); outline: none; transition: border-color .2s; }
  .inp:focus { border-color: var(--blue); }
  
  .btn { padding: 12px 20px; border-radius: 10px; border: none; font-size: 14px; font-family: var(--font-thai); cursor: pointer; font-weight: 600; transition: all .2s; }
  .btn:hover { transform: translateY(-1px); filter: brightness(1.1); }
  .btn-green { background: var(--green); color: #000; }
  .btn-blue { background: var(--blue); color: #fff; }
  .btn-ghost { background: var(--bg3); color: var(--text); border: 1px solid var(--border2); }

  /* UTILS */
  .progress-bar { height: 6px; background: var(--bg3); border-radius: 3px; overflow: hidden; margin-top: 8px; }
  .progress-fill { height: 100%; border-radius: 3px; transition: width .6s ease; }
  .tag { display: inline-block; padding: 4px 8px; border-radius: 6px; font-size: 10px; font-family: var(--font-mono); font-weight: 600; letter-spacing: 0.5px; }
  .tag-income { background: rgba(0,214,143,.15); color: var(--green); }
  .tag-expense { background: rgba(255,77,106,.15); color: var(--red); }
  .tag-invest { background: rgba(61,139,255,.15); color: var(--blue); }
  .tag-fix { background: rgba(159,122,234,.15); color: var(--purple); }
  .tag-var { background: rgba(240,180,41,.15); color: var(--gold); }
  .gap-20 { display: flex; flex-direction: column; gap: 20px; }
  .text-right { text-align: right; }
  .text-mono { font-family: var(--font-mono); }
  .alert { padding: 16px 20px; border-radius: 12px; margin-bottom: 20px; font-size: 14px; display: flex; align-items: flex-start; gap: 12px; }
  .alert-warning { background: rgba(240,180,41,.1); border: 1px solid rgba(240,180,41,.3); color: var(--gold); }
  .alert-info { background: rgba(61,139,255,.1); border: 1px solid rgba(61,139,255,.3); color: var(--blue); }
  select.inp { appearance: none; }
  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 4px; }
  ::-webkit-scrollbar-thumb:hover { background: var(--text3); }
`;

// ============================================================
// DATA & UTILS
// ============================================================
const MOCK_PRICES = {
  VOO: { price: 662.42, change: -0.18, pct: -0.03, name: "Vanguard S&P 500" },
  NVDA: { price: 890.00, change: 23.4, pct: 2.73, name: "NVIDIA" }, 
  GOOG: { price: 170.00, change: 0.90, pct: 0.55, name: "Alphabet Class C" }, 
  TSLA: { price: 177.9, change: -5.2, pct: -2.84, name: "Tesla" },
  GOOGL: { price: 168.42, change: 0.88, pct: 0.52, name: "Alphabet Class A" },
  AMZN: { price: 191.75, change: 3.12, pct: 1.65, name: "Amazon" },
};

const MOCK_CRYPTO = {
  BTC: { price: 64230, change: 1820, pct: 2.91, name: "Bitcoin" },
  ETH: { price: 3142, change: -45, pct: -1.41, name: "Ethereum" },
};

const CATEGORIES = {
  food: { label: "อาหาร", icon: "🍜", color: "#f0b429" },
  transport: { label: "เดินทาง", icon: "🚗", color: "#3d8bff" },
  shopping: { label: "ช้อปปิ้ง", icon: "🛍️", color: "#9f7aea" },
  bills: { label: "ค่าบิล", icon: "📄", color: "#ff4d6a" },
  health: { label: "สุขภาพ", icon: "💊", color: "#00d68f" },
  invest: { label: "ลงทุน", icon: "📈", color: "#3d8bff" },
  income: { label: "รายรับ", icon: "💰", color: "#00d68f" },
  other: { label: "อื่นๆ", icon: "💸", color: "#8892a4" },
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
  { cat: "health", limit: 1500 },
];

function fmt(n, dec = 0) { return (n||0).toLocaleString("th-TH", { minimumFractionDigits: dec, maximumFractionDigits: dec }); }

function parseMakeSMS(sms) {
  const text = sms.trim();
  const result = { valid: false };
  const investMatch = text.match(/ซื้อ|ซื้อหุ้น|buy|ลงทุน|invest/i);
  const incomeMatch = text.match(/รับโอน|รับชำระ|เงินเข้า|โอนเงินเข้า|โอนเข้า|deposit|received/i);
  const amtMatch = text.match(/(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)\s*(?:บาท|THB|฿)/i) || text.match(/(?:จำนวน|Amount)[:\s]*(\d[\d,\.]+)/i) || text.match(/(\d{1,3}(?:,\d{3})*\.\d{2})/);
  const dateMatch = text.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/);
  const refMatch = text.match(/(?:ที่|จาก|ไปยัง|to|from|Ref)[:\s]*([^\n]+)/i);

  if (amtMatch) {
    result.valid = true;
    result.amount = parseFloat(amtMatch[1].replace(/,/g, ""));
    if (investMatch) {
      result.type = "expense"; result.direction = "-"; result.cat = "invest";
      const symMatch = text.match(/\b([A-Z]{2,10})\b/);
      if (symMatch) result.symbol = symMatch[1];
      const shareMatch = text.match(/(\d+(?:\.\d+)?)\s*หุ้น/);
      if (shareMatch) result.shares = parseFloat(shareMatch[1]);
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
  return <svg width={size} height={size} style={{ flexShrink: 0 }}>{arcs.map((a, i) => <path key={i} d={slice(a.start, a.pct)} fill={a.color} opacity={0.9} />)}</svg>;
}

function MiniBarChart({ values, color = "#3d8bff", height = 50 }) {
  const max = Math.max(...values, 1);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height }}>
      {values.map((v, i) => <div key={i} style={{ flex: 1, height: `${(v / max) * 100}%`, background: color, borderRadius: "4px 4px 0 0", opacity: i === values.length - 1 ? 1 : 0.45, minHeight: 3 }} />)}
    </div>
  );
}

// ---------------- DASHBOARD TAB ----------------
function DashboardTab({ txs, portfolio, livePrices, isLoadingPrices }) {
  const thisMonth = txs.filter(t => t.date.startsWith(new Date().toISOString().slice(0, 7)));
  const income = thisMonth.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const expense = thisMonth.filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);
  const saving = income - expense;
  const savingRate = income > 0 ? (saving / income) * 100 : 0;

  const portValue = portfolio.reduce((s, p) => s + (livePrices[p.symbol]?.price || p.avgCost) * p.shares, 0);
  const portCost = portfolio.reduce((s, p) => s + p.avgCost * p.shares, 0);
  const portPnL = portValue - portCost;

  const bankBalance = txs.reduce((sum, t) => sum + t.amount, 0);
  const portValueTHB = portValue * 32.54;
  const netWorth = bankBalance + portValueTHB;

  const allocData = [
    { label: "เงินฝาก", value: Math.max(bankBalance, 0), color: "#3d8bff" },
    { label: "หุ้น US", value: portValueTHB, color: "#00d68f" }
  ].filter(d => d.value > 0);

  return (
    <div className="gap-20">
      {savingRate < 20 && income > 0 && <div className="alert alert-warning">⚠️ อัตราการออมเดือนนี้ {savingRate.toFixed(1)}% — ต่ำกว่าเป้าหมายที่ 20%</div>}
      <div className="grid-4">
        <div className="card metric-card" style={{ "--accent": "#00d68f" }}>
          <div className="card-title">Net Worth</div>
          <div className="metric-val" style={{fontSize: isLoadingPrices?'20px':'28px'}}>{isLoadingPrices?"กำลังคำนวณ...":`฿${fmt(netWorth)}`}</div>
          <div className="metric-sub">ทรัพย์สินสุทธิทั้งหมด</div>
          <div className="metric-badge badge-green">Live</div>
        </div>
        <div className="card metric-card" style={{ "--accent": "#3d8bff" }}>
          <div className="card-title">รายรับเดือนนี้</div>
          <div className="metric-val">฿{fmt(income)}</div>
          <div className="metric-badge badge-blue">Current Month</div>
        </div>
        <div className="card metric-card" style={{ "--accent": expense > 30000 ? "#ff4d6a" : "#00d68f" }}>
          <div className="card-title">รายจ่ายเดือนนี้</div>
          <div className="metric-val">฿{fmt(expense)}</div>
          <div className={`metric-badge ${expense > 30000 ? "badge-red" : "badge-green"}`}>{expense > 30000 ? "เกินงบแล้ว" : "อยู่ในงบประมาณ"}</div>
        </div>
        <div className="card metric-card" style={{ "--accent": "#9f7aea" }}>
          <div className="card-title">มูลค่าพอร์ต (THB)</div>
          <div className="metric-val" style={{fontSize: isLoadingPrices?'20px':'28px'}}>{isLoadingPrices?"กำลังคำนวณ...":`฿${fmt(portValueTHB)}`}</div>
          <div className="metric-sub">{isLoadingPrices?"":`P&L: ${portPnL>=0?"+":""}$${fmt(portPnL, 2)}`}</div>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-title">การจัดสรรสินทรัพย์ {isLoadingPrices && "..."}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '30px', marginTop: '10px' }}>
            <DonutChart data={allocData} size={160} />
            <div style={{ flex: 1 }}>
              {allocData.map((d, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '4px', background: d.color }} />
                  <span style={{ fontSize: '13px', color: 'var(--text2)', flex: 1 }}>{d.label}</span>
                  <span style={{ fontSize: '13px', fontFamily: 'var(--font-mono)', color: 'var(--text)', fontWeight: 600 }}>฿{fmt(d.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-title">ภาพรวมรายจ่าย 5 เดือน</div>
          <div style={{ marginTop: '20px' }}>
            <MiniBarChart values={[0, 0, 0, 0, expense]} color="#ff4d6a" height={100} />
            <div style={{ display: "flex", gap: 4, marginTop: 10 }}>
              {["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค."].map((m, i) => <div key={i} style={{ flex: 1, textAlign: "center", fontSize: 10, color: "var(--text3)" }}>{m}</div>)}
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="section-header"><span className="section-title">รายการเดินบัญชีล่าสุด</span></div>
        {txs.slice(0, 5).map(tx => {
          const cat = CATEGORIES[tx.cat] || CATEGORIES.other;
          return (
            <div key={tx.id} className="tx-item">
              <div className="tx-icon" style={{ background: cat.color + "22" }}>{cat.icon}</div>
              <div className="tx-info">
                <div className="tx-name">{tx.desc}</div>
                <div className="tx-meta">{tx.date} · <span className={tx.type==="fix"?"tag tag-fix":"tag tag-var"}>{tx.type==="fix"?"Fix":"Var"}</span></div>
              </div>
              <div className="tx-amount" style={{ color: tx.amount > 0 ? "var(--green)" : "var(--text)" }}>{tx.amount > 0 ? "+" : ""}฿{fmt(Math.abs(tx.amount))}</div>
            </div>
          );
        })}
        {txs.length === 0 && <div style={{ textAlign: "center", color: "var(--text3)", padding: "20px" }}>ยังไม่มีรายการทางการเงิน</div>}
      </div>
    </div>
  );
}

// ---------------- TRANSACTIONS TAB ----------------
function TransactionsTab({ txs, setTxs }) {
  const [desc, setDesc] = useState(""); const [amount, setAmount] = useState("");
  const [cat, setCat] = useState("food"); const [type, setType] = useState("var");
  const [filter, setFilter] = useState("all");

  function addTx() {
    if (!desc || !amount) return;
    setTxs(prev => [{ id: Date.now(), date: new Date().toISOString().slice(0, 10), desc, amount: parseFloat(amount), cat, type, src: "manual" }, ...prev]);
    setDesc(""); setAmount("");
  }

  const filtered = filter === "all" ? txs : filter === "income" ? txs.filter(t => t.amount > 0) : txs.filter(t => t.amount < 0);
  return (
    <div className="gap-20">
      <div className="card">
        <div className="card-title">เพิ่มรายการใหม่ด้วยตนเอง</div>
        <div className="input-row">
          <input className="inp" placeholder="คำอธิบายรายการ (เช่น เงินเดือน, ค่าข้าว)" value={desc} onChange={e => setDesc(e.target.value)} style={{ flex: 2 }} />
          <input className="inp" type="number" placeholder="จำนวนเงิน (ใส่ - ถ้าเป็นรายจ่าย)" value={amount} onChange={e => setAmount(e.target.value)} style={{ flex: 1 }} />
        </div>
        <div className="input-row">
          <select className="inp" value={cat} onChange={e => setCat(e.target.value)}>
            {Object.entries(CATEGORIES).map(([k, v]) => <option key={k} value={k}>{v.icon} {v.label}</option>)}
          </select>
          <select className="inp" value={type} onChange={e => setType(e.target.value)}>
            <option value="fix">🔒 Fix Cost (รายจ่ายคงที่)</option>
            <option value="var">📊 Variable Cost (รายจ่ายผันแปร)</option>
          </select>
          <button className="btn btn-green" onClick={addTx} style={{ minWidth: '120px' }}>+ เพิ่มรายการ</button>
        </div>
      </div>
      <div className="card">
        <div className="section-header">
          <span className="section-title">ประวัติรายการ ({filtered.length})</span>
          <div className="row" style={{ gap: 8 }}>
            {["all", "income", "expense"].map(f => (
              <button key={f} className={`btn btn-ghost ${filter === f ? "active" : ""}`} 
                style={{ padding: "6px 14px", fontSize: 12, background: filter === f ? "var(--border2)" : undefined }} 
                onClick={() => setFilter(f)}>
                {f === "all" ? "ทั้งหมด" : f === "income" ? "รายรับ" : "รายจ่าย"}
              </button>
            ))}
          </div>
        </div>
        <table className="data-table">
          <thead><tr><th>วันที่</th><th>รายการ</th><th>ประเภท</th><th className="text-right">จำนวน</th></tr></thead>
          <tbody>
            {filtered.map(tx => (
              <tr key={tx.id}>
                <td className="text-mono text-xs text-muted">{tx.date}</td>
                <td style={{ fontSize: 14 }}>{tx.desc}</td>
                <td><span className={tx.type === "fix" ? "tag tag-fix" : "tag tag-var"}>{tx.type === "fix" ? "Fix Cost" : "Variable"}</span></td>
                <td className="text-right text-mono" style={{ color: tx.amount > 0 ? "var(--green)" : "var(--text)", fontWeight: 600, fontSize: '15px' }}>
                  {tx.amount > 0 ? "+" : ""}฿{fmt(Math.abs(tx.amount))}
                </td>
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
    
    // โลจิกถัวเฉลี่ยหุ้นเวอร์ชันอัปเกรด
    if (result.cat === "invest" && result.symbol) {
      setPortfolio(prev => {
        const newSym = result.symbol.toUpperCase();
        const existingIndex = prev.findIndex(p => p.symbol === newSym);
        const sharesToAdd = result.shares || 1; 
        const costUSD = result.amount / 32.54;
        const avgCostPerShare = costUSD / sharesToAdd;

        if (existingIndex >= 0) {
          const existing = prev[existingIndex];
          const totalCostBefore = existing.shares * existing.avgCost;
          const updatedShares = existing.shares + sharesToAdd;
          const updatedAvgCost = (totalCostBefore + costUSD) / updatedShares;

          const updatedPortfolio = [...prev];
          updatedPortfolio[existingIndex] = { ...existing, shares: updatedShares, avgCost: updatedAvgCost };
          return updatedPortfolio;
        } else {
          return [...prev, { symbol: newSym, shares: sharesToAdd, avgCost: avgCostPerShare, exchange: "US" }];
        }
      });
    }
    setAdded(true);
  }

  return (
    <div className="gap-20">
      <div className="card">
        <div className="card-title">วาง SMS / Notification จากแอปธนาคารที่นี่</div>
        <textarea className="sms-box" placeholder="วางข้อความ SMS จาก MAKE by KBank หรือแอปเทรด..." value={sms} onChange={e => { setSms(e.target.value); setResult(null); }} />
        <div className="row mt-16"><button className="btn btn-blue" onClick={parse}>🔍 ดึงข้อมูลจากข้อความ</button></div>
        
        {result && (
          <div className="parse-result mt-16">
            {result.valid ? (
              <>
                <div style={{ fontSize: 14, fontWeight: 700, color: "var(--green)", marginBottom: 16 }}>✅ พบข้อมูลที่สามารถบันทึกได้</div>
                {Object.entries({ "ประเภท": result.type === "income" ? "💰 รายรับ" : "💸 รายจ่าย", "จำนวนเงิน": `฿${fmt(result.amount, 2)}`, "ร้านค้า / ผู้รับ": result.merchant }).map(([k, v]) => (
                  <div key={k} className="parse-row" style={{ padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <span className="parse-key">{k}</span><span className="parse-val">{v}</span>
                  </div>
                ))}
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
  
  // อัปเกรดระบบถัวเฉลี่ยเวลาเพิ่มหุ้นจากหน้า UI
  function addHolding() {
    if (!symbol || !shares || !cost) return;
    const newSym = symbol.toUpperCase();
    const newShares = parseFloat(shares);
    const newCost = parseFloat(cost);

    setPortfolio(prev => {
      const existingIndex = prev.findIndex(p => p.symbol === newSym);
      if (existingIndex >= 0) {
        // ถัวเฉลี่ยกับของเดิม
        const existing = prev[existingIndex];
        const totalCostBefore = existing.shares * existing.avgCost;
        const costAdded = newShares * newCost;
        const updatedShares = existing.shares + newShares;
        const updatedAvgCost = (totalCostBefore + costAdded) / updatedShares;

        const updatedPortfolio = [...prev];
        updatedPortfolio[existingIndex] = { ...existing, shares: updatedShares, avgCost: updatedAvgCost };
        return updatedPortfolio;
      } else {
        // เพิ่มหุ้นตัวใหม่
        return [...prev, { symbol: newSym, shares: newShares, avgCost: newCost, exchange: "US" }];
      }
    });
    setSymbol(""); setShares(""); setCost("");
  }

  const rows = portfolio.map(p => {
    const px = livePrices[p.symbol]; const currentPrice = px?.price || p.avgCost;
    const mktVal = currentPrice * p.shares * 32.54; const costVal = p.avgCost * p.shares * 32.54;
    return { ...p, currentPrice, mktVal, costVal, pnl: mktVal - costVal, pnlPct: ((mktVal - costVal) / (costVal || 1)) * 100, change: px?.change || 0, changePct: px?.pct || 0 };
  });

  const totalVal = rows.reduce((s, r) => s + r.mktVal, 0); 
  const totalPnL = totalVal - rows.reduce((s, r) => s + r.costVal, 0);

  return (
    <div className="gap-20">
      <div className="grid-3">
        <div className="card metric-card" style={{ "--accent": "#9f7aea" }}>
          <div className="card-title">มูลค่าพอร์ตรวม (THB)</div>
          <div className="metric-val" style={{fontSize:isLoadingPrices?'20px':'28px'}}>{isLoadingPrices?"กำลังดึงราคา...":`฿${fmt(totalVal)}`}</div>
        </div>
        <div className="card metric-card" style={{ "--accent": totalPnL >= 0 ? "#00d68f" : "#ff4d6a" }}>
          <div className="card-title">กำไร/ขาดทุน (UNREALIZED)</div>
          <div className="metric-val" style={{ color: totalPnL >= 0 && !isLoadingPrices ? "var(--green)" : "var(--red)", fontSize:isLoadingPrices?'20px':'28px' }}>
            {isLoadingPrices?"กำลังดึงราคา...":`${totalPnL>=0?"+":""}฿${fmt(totalPnL)}`}
          </div>
        </div>
        <div className="card metric-card" style={{ "--accent": "#f0b429" }}>
          <div className="card-title">USD/THB Rate</div>
          <div className="metric-val">฿32.54</div>
          <div className="metric-sub">อัตราแลกเปลี่ยนปัจจุบัน</div>
        </div>
      </div>

      <div className="card">
        <div className="card-title">ราคาตลาด (REAL-TIME VIA FINNHUB) {isLoadingPrices && "⏳"}</div>
        <div className="grid-3">
          {["VOO", "NVDA", "GOOG"].map((sym) => { 
            const d = livePrices[sym]; if(!d) return null;
            return (
              <div key={sym} style={{ padding: "16px", background: "var(--bg3)", borderRadius: "12px", border: "1px solid var(--border2)" }}>
                <div className="ticker-card">
                  <div><span className="ticker-sym">{sym}</span></div>
                  <div className="ticker-price">{isLoadingPrices?"...":`$${fmt(d.price, 2)}`}</div>
                  {!isLoadingPrices && (
                    <div className={`ticker-change ${d.change >= 0 ? "up" : "dn"}`} style={{ marginTop: '4px', fontWeight: 600 }}>
                      {d.change >= 0 ? "▲" : "▼"} {Math.abs(d.change).toFixed(2)} ({d.pct >= 0 ? "+" : ""}{d.pct.toFixed(2)}%)
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="card">
        <div className="section-header"><span className="section-title">หุ้น Dime! ที่ถืออยู่</span></div>
        <table className="data-table">
          <thead>
            <tr>
              <th>ชื่อหุ้น</th><th className="text-right">จำนวน</th><th className="text-right">ต้นทุนเฉลี่ย</th>
              <th className="text-right">ราคาปัจจุบัน</th><th className="text-right">มูลค่า (฿)</th><th className="text-right">P&L</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 700, fontSize: '15px' }}>{r.symbol}</td>
                <td className="text-right text-mono">{r.shares}</td>
                <td className="text-right text-mono">${fmt(r.avgCost, 2)}</td>
                <td className="text-right text-mono">{isLoadingPrices?"...":`$${fmt(r.currentPrice, 2)}`}</td>
                <td className="text-right text-mono">{isLoadingPrices?"...":`฿${fmt(r.mktVal)}`}</td>
                <td className="text-right text-mono" style={{ color: r.pnl >= 0 && !isLoadingPrices ? "var(--green)" : "var(--red)", fontWeight: 600 }}>
                  {isLoadingPrices?"...":<>{r.pnl >= 0 ? "+" : ""}฿{fmt(r.pnl)}<br /><span style={{ fontSize: 11 }}>({r.pnl >= 0 ? "+" : ""}{r.pnlPct.toFixed(1)}%)</span></>}
                </td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan="6" style={{textAlign:'center', padding:'20px', color:'var(--text3)'}}>ไม่มีหุ้นในพอร์ต</td></tr>}
          </tbody>
        </table>
      </div>

      <div className="card">
        <div className="card-title">เพิ่มหุ้น หรือ ซื้อถัวเฉลี่ย (AVERAGE UP/DOWN)</div>
        <div style={{ color: 'var(--text2)', fontSize: '12px', marginBottom: '16px' }}>*หากใส่ชื่อหุ้นที่มีอยู่แล้ว ระบบจะคำนวณต้นทุนเฉลี่ยใหม่ให้อัตโนมัติ</div>
        <div className="input-row">
          <input className="inp" placeholder="Symbol (เช่น VOO, NVDA)" value={symbol} onChange={e => setSymbol(e.target.value)} />
          <input className="inp" type="number" placeholder="จำนวนหุ้นที่ซื้อเพิ่ม" value={shares} onChange={e => setShares(e.target.value)} />
          <input className="inp" type="number" placeholder="ราคาต้นทุนต่อหน่วย ($)" value={cost} onChange={e => setCost(e.target.value)} />
          <button className="btn btn-blue" onClick={addHolding} style={{ minWidth: '120px' }}>+ บันทึก</button>
        </div>
      </div>
    </div>
  );
}

function BudgetTab({ txs }) {
  const spent = {};
  txs.filter(t => t.amount < 0 && t.date.startsWith(new Date().toISOString().slice(0, 7))).forEach(t => { spent[t.cat] = (spent[t.cat] || 0) + Math.abs(t.amount); });
  return (
    <div className="gap-20">
      <div className="card">
        <div className="section-title" style={{ marginBottom: 20 }}>ติดตามงบประมาณแต่ละหมวด (เดือนปัจจุบัน)</div>
        {BUDGETS.map(b => {
          const cat = CATEGORIES[b.cat]; const s = spent[b.cat] || 0; const pct = Math.min((s / b.limit) * 100, 100); const over = s > b.limit;
          return (
            <div key={b.cat} className="budget-item">
              <div className="budget-header">
                <span className="budget-name" style={{ fontSize: '14px' }}>{cat.icon} {cat.label}</span>
                <span className="budget-amounts text-mono" style={{ fontSize: '13px' }}>฿{fmt(s)} / ฿{fmt(b.limit)}</span>
              </div>
              <div className="progress-bar" style={{ height: '8px' }}>
                <div className="progress-fill" style={{ width: `${pct}%`, background: over ? "var(--red)" : pct > 80 ? "var(--gold)" : "var(--green)" }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================
// MAIN APP COMPONENT
// ============================================================
const TABS = [
  { id: "dashboard", icon: "⬛", label: "Dashboard" },
  { id: "transactions", icon: "💳", label: "รายการเดินบัญชี" },
  { id: "sms", icon: "📲", label: "ตัวอ่าน SMS" },
  { id: "portfolio", icon: "📈", label: "พอร์ตลงทุน" },
  { id: "budget", icon: "🎯", label: "งบประมาณ" },
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

  const [livePrices, setLivePrices] = useState({ ...MOCK_PRICES, ...MOCK_CRYPTO });
  const [isLoadingPrices, setIsLoadingPrices] = useState(true);

  // ดึงข้อมูล Firebase Real-time
  useEffect(() => {
    if (!user) return;
    setLoading(true);
    const unsub = onSnapshot(doc(db, "users", user), (res) => {
      if (res.exists()) {
        const data = res.data();
        setTxs(data.txs || []);
        setPortfolio(data.portfolio || []);
      } else {
        const initial = { txs: INITIAL_TXS, portfolio: INITIAL_PORTFOLIO };
        setDoc(doc(db, "users", user), initial);
      }
      setLoading(false);
    });
    return () => unsub();
  }, [user]);

  // ดึงราคาหุ้น Finnhub
  useEffect(() => {
    if (!user) return;
    const API_KEY = "d7sandpr01qorsvi1jagd7sandpr01qorsvi1jb0"; 
    const symbolsToFetch = ["VOO", "NVDA", "GOOG"]; 

    const fetchPromises = symbolsToFetch.map(sym => 
      fetch(`https://finnhub.io/api/v1/quote?symbol=${sym}&token=${API_KEY}`)
        .then(res => res.json())
        .then(data => ({ symbol: sym, price: data.c, change: data.d, pct: data.dp }))
        .catch(err => null)
    );

    Promise.all(fetchPromises).then(results => {
      setLivePrices(prevPrices => {
        const newPrices = { ...prevPrices };
        results.forEach(item => {
          if (item && item.price) {
             newPrices[item.symbol] = { ...newPrices[item.symbol], price: item.price, change: item.change, pct: item.pct };
          }
        });
        return newPrices;
      });
      setIsLoadingPrices(false);
    });
  }, [user]);

  const handleSetTxs = (action) => {
    setTxs(prev => {
      const next = typeof action === "function" ? action(prev) : action;
      if (user) setDoc(doc(db, "users", user), { txs: next }, { merge: true });
      return next;
    });
  };

  const handleSetPortfolio = (action) => {
    setPortfolio(prev => {
      const next = typeof action === "function" ? action(prev) : action;
      if (user) setDoc(doc(db, "users", user), { portfolio: next }, { merge: true });
      return next;
    });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (AUTHORIZED_USERS[usernameInput] === passwordInput) {
      setUser(usernameInput);
      localStorage.setItem("tw_user", usernameInput);
      setLoginError(false);
    } else {
      setLoginError(true);
    }
  };

  if (!user) {
    return (
      <div className="login-container">
        <style>{styles}</style>
        <div className="login-card">
          <div className="login-logo">Th</div>
          <h2 className="login-title">Threewit OS</h2>
          <p className="login-sub">Personal Finance Engine</p>
          <form onSubmit={handleLogin}>
            <input className="login-inp" placeholder="Username" onChange={e => setUsernameInput(e.target.value)} />
            <input className="login-inp" type="password" placeholder="Password" onChange={e => setPasswordInput(e.target.value)} />
            {loginError && <p style={{color:'var(--red)', fontSize:'12px', marginBottom:'16px', fontWeight:600}}>รหัสผ่านไม่ถูกต้อง กรุณาลองใหม่</p>}
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
            <div>
              <div className="topnav-title">Threewit OS</div>
              <div className="topnav-sub">Connected as <span style={{color:'var(--blue)', fontWeight:600}}>{user}</span></div>
            </div>
          </div>
          <div style={{display:'flex', gap:'16px', alignItems:'center'}}>
            <div className="topnav-sync"><div className="sync-dot" /> Cloud Sync Active</div>
            <button className="logout-btn" onClick={() => { localStorage.removeItem("tw_user"); setUser(null); }}>Disconnect</button>
          </div>
        </nav>

        <div className="tabs">
          {TABS.map(t => (
            <button key={t.id} className={`tab ${activeTab === t.id ? "active" : ""}`} onClick={() => setActiveTab(t.id)}>
              <span className="tab-icon">{t.icon}</span> {t.label}
            </button>
          ))}
        </div>

        <div className="main">
          {loading ? (
            <div style={{textAlign:'center', padding:'80px', color:'var(--text2)', fontFamily:'var(--font-mono)', fontSize:'15px'}}>
              <div style={{width:'30px', height:'30px', border:'3px solid var(--border2)', borderTopColor:'var(--blue)', borderRadius:'50%', animation:'spin 1s linear infinite', margin:'0 auto 16px'}} />
              <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
              กำลังซิงค์ข้อมูลจาก Cloud Database...
            </div>
          ) : (
            <>
              {activeTab === "dashboard" && <DashboardTab txs={txs} portfolio={portfolio} livePrices={livePrices} isLoadingPrices={isLoadingPrices} />}
              {activeTab === "transactions" && <TransactionsTab txs={txs} setTxs={handleSetTxs} />}
              {activeTab === "sms" && <SmsParserTab setTxs={handleSetTxs} portfolio={portfolio} setPortfolio={handleSetPortfolio} />}
              {activeTab === "portfolio" && <PortfolioTab portfolio={portfolio} setPortfolio={handleSetPortfolio} livePrices={livePrices} isLoadingPrices={isLoadingPrices} />}
              {activeTab === "budget" && <BudgetTab txs={txs} />}
            </>
          )}
        </div>
      </div>
    </>
  );
}

