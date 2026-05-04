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

// รหัสผ่านเข้าใช้งาน (แก้ได้ตามใจชอบ)
const AUTHORIZED_USERS = {
  "admin": "4444",
  "friend": "welcome"
};

// ============================================================
// STYLES (รวม UI ตัวเต็ม + Mobile Responsive + หน้า Login)
// ============================================================
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500;600&family=Noto+Sans+Thai:wght@300;400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0a0c0f; --bg2: #111318; --bg3: #181c23; --border: #1e2430; --border2: #252d3a;
    --text: #e8eaf0; --text2: #8892a4; --text3: #4a5568;
    --green: #00d68f; --green2: #00a86b; --red: #ff4d6a; --red2: #cc3355;
    --blue: #3d8bff; --blue2: #1a6bdd; --gold: #f0b429; --gold2: #cc8800; --purple: #9f7aea;
    --card-radius: 14px;
    --font-mono: 'IBM Plex Mono', monospace; --font-thai: 'Noto Sans Thai', sans-serif;
  }

  body { background: var(--bg); color: var(--text); font-family: var(--font-thai); }
  .app { min-height: 100vh; display: flex; flex-direction: column; }

  /* LOGIN PAGE */
  .login-container { height: 100vh; display: flex; align-items: center; justify-content: center; background: var(--bg); padding: 20px; }
  .login-card { width: 100%; max-width: 360px; background: var(--bg2); border: 1px solid var(--border); border-radius: 20px; padding: 32px; text-align: center; box-shadow: 0 20px 40px rgba(0,0,0,0.4); }
  .login-logo { width: 60px; height: 60px; background: linear-gradient(135deg, var(--green), var(--blue)); border-radius: 15px; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; font-size: 24px; font-weight: 800; color: #000; font-family: var(--font-mono); }

  /* TOP NAV */
  .topnav { display: flex; align-items: center; justify-content: space-between; padding: 14px 24px; background: var(--bg2); border-bottom: 1px solid var(--border); position: sticky; top: 0; z-index: 100; backdrop-filter: blur(12px); }
  .topnav-brand { display: flex; align-items: center; gap: 10px; }
  .topnav-logo { width: 34px; height: 34px; background: linear-gradient(135deg, var(--green), var(--blue)); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-family: var(--font-mono); font-weight: 700; font-size: 14px; color: #000; }
  .topnav-title { font-size: 15px; font-weight: 600; color: var(--text); }
  .topnav-sub { font-size: 11px; color: var(--text2); font-family: var(--font-mono); }
  .topnav-sync { display: flex; align-items: center; gap: 8px; font-size: 12px; color: var(--text2); font-family: var(--font-mono); }
  .sync-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--green); animation: pulse 2s infinite; }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
  .logout-btn { background: var(--bg3); color: var(--red); border: 1px solid var(--border); padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: 600; transition: 0.2s; font-family: var(--font-mono); }
  .logout-btn:hover { background: var(--border); }

  /* TABS */
  .tabs { display: flex; gap: 4px; padding: 12px 24px; background: var(--bg2); border-bottom: 1px solid var(--border); overflow-x: auto; scrollbar-width: none; }
  .tabs::-webkit-scrollbar { display: none; }
  .tab { padding: 7px 16px; border-radius: 8px; border: 1px solid transparent; background: none; color: var(--text2); font-size: 13px; font-family: var(--font-thai); cursor: pointer; white-space: nowrap; transition: all .15s; display: flex; align-items: center; gap: 6px; }
  .tab:hover { color: var(--text); background: var(--bg3); }
  .tab.active { background: var(--bg3); border-color: var(--border2); color: var(--text); font-weight: 600; }
  .tab-icon { font-size: 15px; }

  /* MAIN */
  .main { flex: 1; padding: 20px 24px; max-width: 1280px; margin: 0 auto; width: 100%; }
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }
  .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }

  @media(max-width:900px) { .grid-4{grid-template-columns:1fr 1fr} .grid-3{grid-template-columns:1fr 1fr} }
  @media(max-width:600px) { 
    .grid-2,.grid-3,.grid-4{grid-template-columns:1fr} 
    .main{padding:12px} 
    .topnav { flex-direction: column; align-items: flex-start; gap: 12px; padding: 16px; }
    .data-table { display: block; overflow-x: auto; white-space: nowrap; -webkit-overflow-scrolling: touch; }
    .metric-val { font-size: 22px !important; }
    .card { padding: 16px; }
  }

  /* CARD & METRICS */
  .card { background: var(--bg2); border: 1px solid var(--border); border-radius: var(--card-radius); padding: 20px; transition: border-color .2s; }
  .card:hover { border-color: var(--border2); }
  .card-title { font-size: 11px; font-weight: 600; color: var(--text3); letter-spacing: .1em; text-transform: uppercase; margin-bottom: 12px; font-family: var(--font-mono); }
  .metric-card { position: relative; overflow: hidden; }
  .metric-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: var(--accent, var(--blue)); }
  .metric-val { font-size: 26px; font-weight: 700; font-family: var(--font-mono); color: var(--text); }
  .metric-sub { font-size: 12px; color: var(--text2); margin-top: 4px; }
  .metric-badge { display: inline-flex; align-items: center; gap: 3px; padding: 3px 8px; border-radius: 20px; font-size: 11px; font-family: var(--font-mono); margin-top: 6px; }
  .badge-green { background: rgba(0,214,143,.12); color: var(--green); }
  .badge-red { background: rgba(255,77,106,.12); color: var(--red); }
  .badge-gold { background: rgba(240,180,41,.12); color: var(--gold); }
  .badge-blue { background: rgba(61,139,255,.12); color: var(--blue); }

  /* COMPONENTS */
  .section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
  .section-title { font-size: 15px; font-weight: 600; color: var(--text); }
  .data-table { width: 100%; border-collapse: collapse; }
  .data-table th { font-size: 10px; color: var(--text3); font-family: var(--font-mono); text-transform: uppercase; letter-spacing: .08em; padding: 8px 12px; text-align: left; border-bottom: 1px solid var(--border); }
  .data-table td { padding: 11px 12px; border-bottom: 1px solid var(--border); font-size: 13px; }
  .data-table tr:hover td { background: rgba(255,255,255,.02); }
  .tx-item { display: flex; align-items: center; gap: 12px; padding: 12px 0; border-bottom: 1px solid var(--border); }
  .tx-item:last-child { border-bottom: none; }
  .tx-icon { width: 38px; height: 38px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 17px; flex-shrink: 0; }
  .tx-info { flex: 1; min-width: 0; }
  .tx-name { font-size: 13px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .tx-meta { font-size: 11px; color: var(--text2); margin-top: 2px; font-family: var(--font-mono); }
  .tx-amount { font-family: var(--font-mono); font-size: 14px; font-weight: 600; text-align: right; flex-shrink: 0; }
  .progress-bar { height: 6px; background: var(--bg3); border-radius: 3px; overflow: hidden; margin-top: 8px; }
  .progress-fill { height: 100%; border-radius: 3px; transition: width .6s ease; }
  .budget-item { margin-bottom: 18px; }
  .budget-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
  .budget-name { font-size: 13px; font-weight: 500; }
  .budget-amounts { font-size: 12px; font-family: var(--font-mono); color: var(--text2); }
  .donut-wrap { display: flex; align-items: center; gap: 20px; }
  .donut-legend { flex: 1; }
  .legend-item { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
  .legend-dot { width: 10px; height: 10px; border-radius: 2px; flex-shrink: 0; }
  .legend-label { font-size: 12px; color: var(--text2); flex: 1; }
  .legend-val { font-size: 12px; font-family: var(--font-mono); color: var(--text); }
  .input-row { display: flex; gap: 10px; margin-bottom: 12px; flex-wrap: wrap; }
  .inp { flex: 1; min-width: 140px; padding: 9px 13px; background: var(--bg3); border: 1px solid var(--border2); border-radius: 8px; color: var(--text); font-size: 13px; font-family: var(--font-thai); outline: none; transition: border-color .15s; }
  .inp:focus { border-color: var(--blue); }
  .btn { padding: 9px 18px; border-radius: 8px; border: none; font-size: 13px; font-family: var(--font-thai); cursor: pointer; font-weight: 600; transition: opacity .15s; }
  .btn:hover { opacity: .85; }
  .btn-green { background: var(--green); color: #000; }
  .btn-blue { background: var(--blue); color: #fff; }
  .btn-ghost { background: var(--bg3); color: var(--text); border: 1px solid var(--border2); }
  .btn-red { background: var(--red); color: #fff; }
  .sms-box { width: 100%; min-height: 100px; padding: 12px; background: var(--bg3); border: 1px solid var(--border2); border-radius: 8px; color: var(--text); font-size: 12px; font-family: var(--font-mono); resize: vertical; outline: none; }
  .sms-box:focus { border-color: var(--blue); }
  .parse-result { margin-top: 12px; padding: 14px; background: rgba(0,214,143,.06); border: 1px solid rgba(0,214,143,.2); border-radius: 10px; }
  .parse-row { display: flex; justify-content: space-between; padding: 4px 0; font-size: 13px; }
  .parse-key { color: var(--text2); font-family: var(--font-mono); }
  .parse-val { color: var(--text); font-weight: 600; }
  .ticker-card { display: flex; flex-direction: column; gap: 4px; }
  .ticker-sym { font-size: 16px; font-weight: 700; font-family: var(--font-mono); }
  .ticker-name { font-size: 11px; color: var(--text2); }
  .ticker-price { font-size: 22px; font-weight: 700; font-family: var(--font-mono); margin-top: 6px; }
  .ticker-change { font-size: 12px; font-family: var(--font-mono); }
  .up { color: var(--green); } .dn { color: var(--red); }
  .tag { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 10px; font-family: var(--font-mono); font-weight: 600; }
  .tag-income { background: rgba(0,214,143,.15); color: var(--green); }
  .tag-expense { background: rgba(255,77,106,.15); color: var(--red); }
  .tag-invest { background: rgba(61,139,255,.15); color: var(--blue); }
  .tag-fix { background: rgba(159,122,234,.15); color: var(--purple); }
  .tag-var { background: rgba(240,180,41,.15); color: var(--gold); }
  .gap-16 { display: flex; flex-direction: column; gap: 16px; }
  .mt-16 { margin-top: 16px; } .mt-12 { margin-top: 12px; } .mt-8 { margin-top: 8px; }
  .row { display: flex; align-items: center; gap: 10px; }
  .text-right { text-align: right; }
  .text-mono { font-family: var(--font-mono); }
  .text-xs { font-size: 11px; }
  .text-muted { color: var(--text2); }
  .divider { height: 1px; background: var(--border); margin: 16px 0; }
  .alert { padding: 12px 16px; border-radius: 10px; margin-bottom: 12px; font-size: 13px; display: flex; align-items: flex-start; gap: 10px; }
  .alert-warning { background: rgba(240,180,41,.08); border: 1px solid rgba(240,180,41,.25); color: var(--gold); }
  .alert-info { background: rgba(61,139,255,.08); border: 1px solid rgba(61,139,255,.25); color: var(--blue); }
  select.inp { appearance: none; }
  ::-webkit-scrollbar { width: 5px; height: 5px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 3px; }
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

function fmt(n, dec = 0) { return n.toLocaleString("th-TH", { minimumFractionDigits: dec, maximumFractionDigits: dec }); }

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
function DonutChart({ data, size = 140 }) {
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
    <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height }}>
      {values.map((v, i) => <div key={i} style={{ flex: 1, height: `${(v / max) * 100}%`, background: color, borderRadius: "3px 3px 0 0", opacity: i === values.length - 1 ? 1 : 0.45, minHeight: 2 }} />)}
    </div>
  );
}

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
    <div className="gap-16">
      {savingRate < 20 && income > 0 && <div className="alert alert-warning">⚠️ อัตราการออมเดือนนี้ {savingRate.toFixed(1)}% — ต่ำกว่าเป้าหมาย 20%</div>}
      <div className="grid-4">
        <div className="card metric-card" style={{ "--accent": "#00d68f" }}><div className="card-title">Net Worth</div><div className="metric-val" style={{fontSize: isLoadingPrices?'18px':'26px'}}>{isLoadingPrices?"...":`฿${fmt(netWorth)}`}</div><div className="metric-sub">ทรัพย์สินสุทธิ</div><div className="metric-badge badge-green">Live</div></div>
        <div className="card metric-card" style={{ "--accent": "#3d8bff" }}><div className="card-title">รายรับเดือนนี้</div><div className="metric-val">฿{fmt(income)}</div><div className="metric-badge badge-blue">Current Month</div></div>
        <div className="card metric-card" style={{ "--accent": expense > 30000 ? "#ff4d6a" : "#00d68f" }}><div className="card-title">รายจ่ายเดือนนี้</div><div className="metric-val">฿{fmt(expense)}</div><div className={`metric-badge ${expense > 30000 ? "badge-red" : "badge-green"}`}>{expense > 30000 ? "เกินงบ" : "ในงบ"}</div></div>
        <div className="card metric-card" style={{ "--accent": "#9f7aea" }}><div className="card-title">มูลค่าพอร์ต (THB)</div><div className="metric-val" style={{fontSize: isLoadingPrices?'18px':'26px'}}>{isLoadingPrices?"...":`฿${fmt(portValueTHB)}`}</div><div className="metric-sub">{isLoadingPrices?"":`P&L: ${portPnL>=0?"+":""}$${fmt(portPnL, 2)}`}</div></div>
      </div>
      <div className="grid-2">
        <div className="card">
          <div className="card-title">การจัดสรรสินทรัพย์ {isLoadingPrices && "..."}</div>
          <div className="donut-wrap"><DonutChart data={allocData} size={150} />
            <div className="donut-legend">{allocData.map((d, i) => <div key={i} className="legend-item"><div className="legend-dot" style={{ background: d.color }} /><span className="legend-label">{d.label}</span><span className="legend-val">฿{fmt(d.value)}</span></div>)}</div>
          </div>
        </div>
        <div className="card">
          <div className="card-title">รายจ่าย 5 เดือน</div>
          <MiniBarChart values={[0, 0, 0, 0, expense]} color="#ff4d6a" height={90} />
          <div style={{ display: "flex", gap: 3, marginTop: 6 }}>{["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค."].map((m, i) => <div key={i} style={{ flex: 1, textAlign: "center", fontSize: 9, color: "var(--text3)" }}>{m}</div>)}</div>
        </div>
      </div>
      <div className="card">
        <div className="section-header"><span className="section-title">รายการล่าสุด</span></div>
        {txs.slice(0, 5).map(tx => {
          const cat = CATEGORIES[tx.cat] || CATEGORIES.other;
          return (
            <div key={tx.id} className="tx-item">
              <div className="tx-icon" style={{ background: cat.color + "22" }}>{cat.icon}</div>
              <div className="tx-info"><div className="tx-name">{tx.desc}</div><div className="tx-meta">{tx.date} · <span className={tx.type==="fix"?"tag tag-fix":"tag tag-var"}>{tx.type==="fix"?"Fix":"Var"}</span></div></div>
              <div className="tx-amount" style={{ color: tx.amount > 0 ? "var(--green)" : "var(--text)" }}>{tx.amount > 0 ? "+" : ""}฿{fmt(Math.abs(tx.amount))}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

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
    <div className="gap-16">
      <div className="card"><div className="card-title">เพิ่มรายการด้วยตนเอง</div>
        <div className="input-row">
          <input className="inp" placeholder="คำอธิบาย" value={desc} onChange={e => setDesc(e.target.value)} style={{ flex: 2 }} />
          <input className="inp" type="number" placeholder="จำนวนเงิน (+/-)" value={amount} onChange={e => setAmount(e.target.value)} style={{ flex: 1 }} />
        </div>
        <div className="input-row">
          <select className="inp" value={cat} onChange={e => setCat(e.target.value)}>{Object.entries(CATEGORIES).map(([k, v]) => <option key={k} value={k}>{v.icon} {v.label}</option>)}</select>
          <select className="inp" value={type} onChange={e => setType(e.target.value)}><option value="fix">🔒 Fix Cost (คงที่)</option><option value="var">📊 Variable Cost (ผันแปร)</option></select>
          <button className="btn btn-green" onClick={addTx}>+ เพิ่ม</button>
        </div>
      </div>
      <div className="card">
        <div className="section-header"><span className="section-title">ประวัติรายการ</span>
          <div className="row" style={{ gap: 6 }}>{["all", "income", "expense"].map(f => <button key={f} className={`btn btn-ghost ${filter === f ? "active" : ""}`} style={{ padding: "5px 12px", fontSize: 12, background: filter === f ? "var(--border2)" : undefined }} onClick={() => setFilter(f)}>{f}</button>)}</div>
        </div>
        <table className="data-table">
          <thead><tr><th>วันที่</th><th>รายการ</th><th>ประเภท</th><th className="text-right">จำนวน</th></tr></thead>
          <tbody>
            {filtered.map(tx => (
              <tr key={tx.id}>
                <td className="text-mono text-xs text-muted">{tx.date}</td><td style={{ fontSize: 13 }}>{tx.desc}</td>
                <td><span className={tx.type === "fix" ? "tag tag-fix" : "tag tag-var"}>{tx.type === "fix" ? "Fix" : "Var"}</span></td>
                <td className="text-right text-mono" style={{ color: tx.amount > 0 ? "var(--green)" : "var(--text)", fontWeight: 600 }}>{tx.amount > 0 ? "+" : ""}฿{fmt(Math.abs(tx.amount))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SmsParserTab({ setTxs, portfolio, setPortfolio }) {
  const [sms, setSms] = useState(""); const [result, setResult] = useState(null); const [added, setAdded] = useState(false);
  function parse() { setResult(parseMakeSMS(sms)); setAdded(false); }
  function addToLedger() {
    if (!result?.valid) return;
    setTxs(prev => [{ id: Date.now(), date: result.date, desc: result.cat === "invest" && result.symbol ? `ซื้อหุ้น ${result.symbol}` : result.merchant, amount: result.type === "income" ? result.amount : -result.amount, cat: result.cat, type: "var", src: "make-sms" }, ...prev]);
    if (result.cat === "invest" && result.symbol) {
      setPortfolio(prev => {
        const existing = prev.find(p => p.symbol === result.symbol);
        const sharesToAdd = result.shares || 1; const costUSD = result.amount / 32.54;
        if (existing) {
          const newShares = existing.shares + sharesToAdd;
          return prev.map(p => p.symbol === result.symbol ? { ...p, shares: newShares, avgCost: ((existing.avgCost * existing.shares) + costUSD) / newShares } : p);
        } else return [...prev, { symbol: result.symbol, shares: sharesToAdd, avgCost: costUSD / sharesToAdd, exchange: "US" }];
      });
    }
    setAdded(true);
  }
  return (
    <div className="gap-16">
      <div className="card"><div className="card-title">วาง SMS / Notification ที่นี่</div>
        <textarea className="sms-box" placeholder="วาง SMS..." value={sms} onChange={e => { setSms(e.target.value); setResult(null); }} />
        <div className="row mt-12"><button className="btn btn-blue" onClick={parse}>🔍 Parse SMS</button></div>
        {result && (
          <div className="parse-result mt-16">
            {result.valid ? (
              <><div style={{ fontSize: 13, fontWeight: 700, color: "var(--green)", marginBottom: 12 }}>✅ Parse สำเร็จ</div>
                {Object.entries({ "ประเภท": result.type === "income" ? "💰 รายรับ" : "💸 รายจ่าย", "จำนวนเงิน": `฿${fmt(result.amount, 2)}`, "ร้านค้า": result.merchant }).map(([k, v]) => <div key={k} className="parse-row"><span className="parse-key">{k}</span><span className="parse-val">{v}</span></div>)}
                <div className="row mt-12"><button className="btn btn-green" onClick={addToLedger} disabled={added}>{added ? "✅ เพิ่มแล้ว" : "+ บันทึกลงบัญชี"}</button></div>
              </>
            ) : <div style={{ color: "var(--red)", fontSize: 13 }}>❌ ไม่พบข้อมูลที่ Parse ได้</div>}
          </div>
        )}
      </div>
    </div>
  );
}

function PortfolioTab({ portfolio, setPortfolio, livePrices, isLoadingPrices }) {
  const [symbol, setSymbol] = useState(""); const [shares, setShares] = useState(""); const [cost, setCost] = useState("");
  function addHolding() {
    if (!symbol || !shares || !cost) return;
    setPortfolio(prev => [...prev, { symbol: symbol.toUpperCase(), shares: parseFloat(shares), avgCost: parseFloat(cost), exchange: "US" }]);
    setSymbol(""); setShares(""); setCost("");
  }
  const rows = portfolio.map(p => {
    const px = livePrices[p.symbol]; const currentPrice = px?.price || p.avgCost;
    const mktVal = currentPrice * p.shares * 32.54; const costVal = p.avgCost * p.shares * 32.54;
    return { ...p, currentPrice, mktVal, costVal, pnl: mktVal - costVal, pnlPct: ((mktVal - costVal) / (costVal || 1)) * 100, change: px?.change || 0, changePct: px?.pct || 0 };
  });
  const totalVal = rows.reduce((s, r) => s + r.mktVal, 0); const totalPnL = totalVal - rows.reduce((s, r) => s + r.costVal, 0);

  return (
    <div className="gap-16">
      <div className="grid-3">
        <div className="card metric-card" style={{ "--accent": "#9f7aea" }}><div className="card-title">มูลค่าพอร์ตรวม (THB)</div><div className="metric-val" style={{fontSize:isLoadingPrices?'18px':'26px'}}>{isLoadingPrices?"...":`฿${fmt(totalVal)}`}</div></div>
        <div className="card metric-card" style={{ "--accent": totalPnL >= 0 ? "#00d68f" : "#ff4d6a" }}><div className="card-title">กำไร/ขาดทุน (UNREALIZED)</div><div className="metric-val" style={{ color: totalPnL >= 0 && !isLoadingPrices ? "var(--green)" : "var(--red)", fontSize:isLoadingPrices?'18px':'26px' }}>{isLoadingPrices?"...":`${totalPnL>=0?"+":""}฿${fmt(totalPnL)}`}</div></div>
        <div className="card metric-card" style={{ "--accent": "#f0b429" }}><div className="card-title">USD/THB Rate</div><div className="metric-val">฿32.54</div></div>
      </div>
      <div className="card"><div className="card-title">ราคาตลาด (REAL-TIME VIA FINNHUB) {isLoadingPrices && "⏳"}</div>
        <div className="grid-3">
          {["VOO", "NVDA", "GOOG"].map((sym) => { 
            const d = livePrices[sym]; if(!d) return null;
            return (
              <div key={sym} style={{ padding: "12px", background: "var(--bg3)", borderRadius: 10 }}>
                <div className="ticker-card"><div><span className="ticker-sym">{sym}</span></div><div className="ticker-price">{isLoadingPrices?"...":`$${fmt(d.price, 2)}`}</div>
                  {!isLoadingPrices && <div className={`ticker-change ${d.change >= 0 ? "up" : "dn"}`}>{d.change >= 0 ? "▲" : "▼"} {Math.abs(d.change).toFixed(2)} ({d.pct >= 0 ? "+" : ""}{d.pct.toFixed(2)}%)</div>}
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <div className="card"><div className="section-header"><span className="section-title">หุ้น dime ที่ถือ</span></div>
        <table className="data-table">
          <thead><tr><th>ชื่อ</th><th className="text-right">จำนวน</th><th className="text-right">ต้นทุน/หน่วย</th><th className="text-right">ราคาปัจจุบัน</th><th className="text-right">มูลค่า (฿)</th><th className="text-right">P&L</th></tr></thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}><td style={{ fontWeight: 700 }}>{r.symbol}</td><td className="text-right text-mono">{r.shares}</td><td className="text-right text-mono">${fmt(r.avgCost, 2)}</td><td className="text-right text-mono">{isLoadingPrices?"...":`$${fmt(r.currentPrice, 2)}`}</td><td className="text-right text-mono">{isLoadingPrices?"...":`฿${fmt(r.mktVal)}`}</td><td className="text-right text-mono" style={{ color: r.pnl >= 0 && !isLoadingPrices ? "var(--green)" : "var(--red)", fontWeight: 600 }}>{isLoadingPrices?"...":<>{r.pnl >= 0 ? "+" : ""}฿{fmt(r.pnl)}<br /><span style={{ fontSize: 10 }}>({r.pnl >= 0 ? "+" : ""}{r.pnlPct.toFixed(1)}%)</span></>}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="card"><div className="card-title">เพิ่ม PORTFOLIO</div>
        <div className="input-row"><input className="inp" placeholder="Symbol" value={symbol} onChange={e => setSymbol(e.target.value)} /><input className="inp" type="number" placeholder="จำนวนหุ้น" value={shares} onChange={e => setShares(e.target.value)} /><input className="inp" type="number" placeholder="ต้นทุนต่อหน่วย ($)" value={cost} onChange={e => setCost(e.target.value)} /><button className="btn btn-blue" onClick={addHolding}>+ เพิ่ม</button></div>
      </div>
    </div>
  );
}

function BudgetTab({ txs }) {
  const spent = {};
  txs.filter(t => t.amount < 0 && t.date.startsWith(new Date().toISOString().slice(0, 7))).forEach(t => { spent[t.cat] = (spent[t.cat] || 0) + Math.abs(t.amount); });
  return (
    <div className="gap-16">
      <div className="card"><div className="section-title" style={{ marginBottom: 16 }}>งบประมาณแต่ละหมวด</div>
        {BUDGETS.map(b => {
          const cat = CATEGORIES[b.cat]; const s = spent[b.cat] || 0; const pct = Math.min((s / b.limit) * 100, 100); const over = s > b.limit;
          return (
            <div key={b.cat} className="budget-item">
              <div className="budget-header"><span className="budget-name">{cat.icon} {cat.label}</span><span className="budget-amounts text-mono">฿{fmt(s)} / ฿{fmt(b.limit)}</span></div>
              <div className="progress-bar"><div className="progress-fill" style={{ width: `${pct}%`, background: over ? "var(--red)" : pct > 80 ? "var(--gold)" : "var(--green)" }} /></div>
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
  { id: "transactions", icon: "💳", label: "รายรับ-รายจ่าย" },
  { id: "sms", icon: "📲", label: "MAKE Parser" },
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

  // ฟังการเปลี่ยนแปลงจาก Firebase แบบ Real-time
  useEffect(() => {
    if (!user) return;
    setLoading(true);
    const unsub = onSnapshot(doc(db, "users", user), (res) => {
      if (res.exists()) {
        const data = res.data();
        setTxs(data.txs || []);
        setPortfolio(data.portfolio || []);
      } else {
        // ถ้าเป็น User ใหม่ ให้ตั้งค่าเริ่มต้น
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

  // ฟังก์ชันเขียนข้อมูลลง Firebase
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

  // ระบบ Login
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
          <h2 style={{marginBottom:'10px'}}>Threewit OS</h2>
          <p style={{fontSize:'12px', color:'var(--text2)', marginBottom:'20px'}}>ระบบจัดการเงิน Cloud Database</p>
          <form onSubmit={handleLogin}>
            <input className="inp" placeholder="Username" onChange={e => setUsernameInput(e.target.value)} />
            <input className="inp" type="password" placeholder="Password" onChange={e => setPasswordInput(e.target.value)} />
            {loginError && <p style={{color:'var(--red)', fontSize:'12px', marginBottom:'10px'}}>รหัสผ่านไม่ถูกต้อง</p>}
            <button className="btn btn-blue" style={{width:'100%'}} type="submit">Log In</button>
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
            <div><div className="topnav-title">Threewit OS</div><div className="topnav-sub">Cloud Sync Active • User: {user}</div></div>
          </div>
          <div style={{display:'flex', gap:'12px', alignItems:'center'}}>
            <div className="topnav-sync"><div className="sync-dot" /> Live</div>
            <button className="logout-btn" onClick={() => { localStorage.removeItem("tw_user"); setUser(null); }}>Log Out</button>
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
            <div style={{textAlign:'center', padding:'50px', color:'var(--text2)', fontFamily:'var(--font-mono)'}}>
              กำลังซิงค์ข้อมูลจาก Firebase... ⏳
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

