import { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, onSnapshot, setDoc } from "firebase/firestore";

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
  measurementId: "G-W1KHVD3KPE"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const AUTHORIZED_USERS = {
  "Threewit": "zxc",
  "hi": "hi"
};

// ============================================================
// STYLES — PREMIUM DARK FINTECH REDESIGN
// ============================================================
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Syne+Mono&family=Noto+Sans+Thai:wght@300;400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:      #060810;
    --bg2:     #0c0f1a;
    --bg3:     #111524;
    --bg4:     #161b2e;
    --border:  rgba(255,255,255,0.06);
    --border2: rgba(255,255,255,0.12);
    --border3: rgba(255,255,255,0.20);
    --text:    #f0f2f8;
    --text2:   #7b85a0;
    --text3:   #3d4560;
    --green:   #05e29c;
    --green2:  #00b87a;
    --red:     #ff3d6b;
    --red2:    #cc2255;
    --blue:    #4b8fff;
    --blue2:   #2060dd;
    --gold:    #ffbe3d;
    --gold2:   #cc9200;
    --purple:  #a78bfa;
    --cyan:    #22d3ee;
    --card-radius: 18px;
    --font-head:  'Space Grotesk', 'Noto Sans Thai', sans-serif;
    --font-mono:  'Syne Mono', monospace;
    --font-thai:  'Noto Sans Thai', sans-serif;
    --glow-green: 0 0 40px rgba(5,226,156,0.15);
    --glow-blue:  0 0 40px rgba(75,143,255,0.15);
    --glow-card:  0 8px 32px rgba(0,0,0,0.4);
  }

  html { scroll-behavior: smooth; }
  body {
    background: var(--bg);
    color: var(--text);
    font-family: var(--font-thai);
    -webkit-font-smoothing: antialiased;
    min-height: 100vh;
  }
  body::before {
    content: '';
    position: fixed; inset: 0; z-index: 0; pointer-events: none;
    background:
      radial-gradient(ellipse 80% 50% at 10% 0%, rgba(75,143,255,0.07) 0%, transparent 70%),
      radial-gradient(ellipse 60% 40% at 90% 100%, rgba(5,226,156,0.05) 0%, transparent 70%);
  }
  .app { min-height: 100vh; display: flex; flex-direction: column; position: relative; z-index: 1; }

  /* =============================================
     ✨ LOGIN PAGE
     ============================================= */
  .login-wrapper {
    height: 100vh; display: flex; align-items: center; justify-content: center;
    background: var(--bg); position: relative; overflow: hidden;
  }
  .login-glow-1 {
    position: absolute; width: 700px; height: 700px;
    background: radial-gradient(circle, rgba(5,226,156,0.12) 0%, transparent 70%);
    border-radius: 50%; top: -250px; left: -200px;
    animation: floatOrb 12s ease-in-out infinite alternate;
    pointer-events: none;
  }
  .login-glow-2 {
    position: absolute; width: 600px; height: 600px;
    background: radial-gradient(circle, rgba(75,143,255,0.10) 0%, transparent 70%);
    border-radius: 50%; bottom: -200px; right: -150px;
    animation: floatOrb 15s ease-in-out infinite alternate-reverse;
    pointer-events: none;
  }
  .login-grid-overlay {
    position: absolute; inset: 0; pointer-events: none;
    background-image:
      linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
    background-size: 60px 60px;
    mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%);
  }
  @keyframes floatOrb {
    0%   { transform: translate(0,0) scale(1); }
    100% { transform: translate(40px, 60px) scale(1.15); }
  }
  .login-glass-card {
    width: 100%; max-width: 420px; padding: 52px 40px; margin: 20px;
    background: rgba(12,15,26,0.75);
    backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 28px;
    box-shadow: 0 30px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04) inset;
    z-index: 10; position: relative;
  }
  .login-logo-wrap { display: flex; align-items: center; gap: 14px; justify-content: center; margin-bottom: 28px; }
  .login-logo {
    width: 56px; height: 56px;
    background: linear-gradient(135deg, var(--green), var(--blue));
    border-radius: 16px; display: flex; align-items: center; justify-content: center;
    font-family: var(--font-head); font-size: 22px; font-weight: 700; color: #000;
    box-shadow: 0 8px 24px rgba(5,226,156,0.3);
    flex-shrink: 0;
  }
  .login-brand-text { text-align: left; }
  .login-brand-name { font-family: var(--font-head); font-size: 20px; font-weight: 700; color: var(--text); letter-spacing: -0.02em; }
  .login-brand-sub { font-family: var(--font-mono); font-size: 11px; color: var(--text2); letter-spacing: 0.08em; margin-top: 2px; }
  .login-divider { height: 1px; background: var(--border); margin: 24px 0 28px; }
  .login-welcome { font-family: var(--font-head); font-size: 26px; font-weight: 700; color: var(--text); letter-spacing: -0.03em; margin-bottom: 6px; }
  .login-sub { font-size: 13px; color: var(--text2); margin-bottom: 32px; font-family: var(--font-mono); }
  .login-label { display: block; font-size: 11px; font-weight: 600; color: var(--text2); font-family: var(--font-mono); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8px; }
  .login-inp-styled {
    width: 100%; padding: 14px 16px; margin-bottom: 16px; border-radius: 12px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    color: var(--text); font-family: var(--font-head); font-size: 14px; outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .login-inp-styled:focus {
    border-color: rgba(75,143,255,0.5);
    box-shadow: 0 0 0 3px rgba(75,143,255,0.1);
  }
  .login-inp-styled::placeholder { color: var(--text3); }
  .login-btn-styled {
    width: 100%; padding: 15px; margin-top: 8px; border-radius: 12px; border: none;
    background: linear-gradient(135deg, var(--green2), var(--blue2));
    color: #fff; font-size: 14px; font-weight: 700; cursor: pointer;
    font-family: var(--font-head); letter-spacing: 0.03em;
    box-shadow: 0 4px 20px rgba(5,226,156,0.25);
    transition: transform 0.15s, box-shadow 0.15s;
    position: relative; overflow: hidden;
  }
  .login-btn-styled::before {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 60%);
  }
  .login-btn-styled:hover { transform: translateY(-1px); box-shadow: 0 8px 28px rgba(5,226,156,0.35); }
  .login-btn-styled:active { transform: translateY(0); }
  .login-error { color: var(--red); font-size: 12px; margin-top: -8px; margin-bottom: 16px; font-family: var(--font-mono); display: flex; align-items: center; gap: 6px; }

  /* =============================================
     🧭 TOP NAVIGATION
     ============================================= */
  .topnav {
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 28px; height: 64px;
    background: rgba(12,15,26,0.85);
    backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--border);
    position: sticky; top: 0; z-index: 100;
  }
  .topnav-brand { display: flex; align-items: center; gap: 12px; }
  .topnav-logo {
    width: 36px; height: 36px;
    background: linear-gradient(135deg, var(--green), var(--blue));
    border-radius: 10px; display: flex; align-items: center; justify-content: center;
    font-family: var(--font-head); font-weight: 700; font-size: 13px; color: #000;
    box-shadow: 0 4px 12px rgba(5,226,156,0.25);
    flex-shrink: 0;
  }
  .topnav-title { font-family: var(--font-head); font-size: 16px; font-weight: 700; color: var(--text); letter-spacing: -0.02em; }
  .topnav-sub { font-size: 10px; color: var(--text3); font-family: var(--font-mono); letter-spacing: 0.08em; margin-top: 1px; }
  .topnav-right { display: flex; align-items: center; gap: 14px; }
  .topnav-sync {
    display: flex; align-items: center; gap: 7px;
    font-size: 11px; color: var(--text2); font-family: var(--font-mono);
    background: rgba(5,226,156,0.06); border: 1px solid rgba(5,226,156,0.15);
    padding: 5px 12px; border-radius: 20px;
  }
  .sync-dot {
    width: 6px; height: 6px; border-radius: 50%; background: var(--green);
    box-shadow: 0 0 8px var(--green);
    animation: pulse 2.5s ease-in-out infinite;
  }
  @keyframes pulse { 0%,100%{opacity:1; transform:scale(1)} 50%{opacity:0.5; transform:scale(0.85)} }
  .logout-btn {
    background: rgba(255,61,107,0.08); color: var(--red);
    border: 1px solid rgba(255,61,107,0.2);
    padding: 7px 16px; border-radius: 10px; cursor: pointer;
    font-size: 12px; font-weight: 600; font-family: var(--font-head);
    transition: background 0.15s, border-color 0.15s;
  }
  .logout-btn:hover { background: rgba(255,61,107,0.15); border-color: rgba(255,61,107,0.35); }

  /* =============================================
     🗂 TABS
     ============================================= */
  .tabs {
    display: flex; gap: 2px; padding: 10px 20px;
    background: rgba(12,15,26,0.6);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid var(--border);
    overflow-x: auto; scrollbar-width: none;
  }
  .tabs::-webkit-scrollbar { display: none; }
  .tab {
    padding: 9px 18px; border-radius: 10px;
    border: 1px solid transparent;
    background: transparent; color: var(--text2);
    font-size: 13px; font-family: var(--font-head); font-weight: 500;
    cursor: pointer; white-space: nowrap;
    transition: color 0.15s, background 0.15s, border-color 0.15s;
    display: flex; align-items: center; gap: 7px;
    letter-spacing: -0.01em;
  }
  .tab:hover { color: var(--text); background: rgba(255,255,255,0.04); }
  .tab.active {
    background: rgba(255,255,255,0.07);
    border-color: rgba(255,255,255,0.1);
    color: var(--text);
    font-weight: 600;
  }
  .tab-icon { font-size: 14px; line-height: 1; }

  /* =============================================
     📐 LAYOUT
     ============================================= */
  .main {
    flex: 1; padding: 24px 28px;
    max-width: 1320px; margin: 0 auto; width: 100%;
  }
  .gap-16 { display: flex; flex-direction: column; gap: 16px; }
  .gap-20 { display: flex; flex-direction: column; gap: 20px; }
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
  .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }

  @media(max-width: 1024px) {
    .grid-4 { grid-template-columns: repeat(2, 1fr); }
    .grid-3 { grid-template-columns: repeat(2, 1fr); }
  }
  @media(max-width: 640px) {
    .grid-2, .grid-3, .grid-4 { grid-template-columns: 1fr; }
    .main { padding: 14px 16px; }
    .topnav { padding: 0 16px; }
    .tabs { padding: 8px 12px; gap: 4px; }
    .tab { padding: 8px 12px; font-size: 12px; }
    .metric-val { font-size: 22px !important; }
    .card { padding: 16px; }
    .data-table { display: block; overflow-x: auto; -webkit-overflow-scrolling: touch; white-space: nowrap; }
    .input-row { flex-direction: column; }
    .input-row .inp { min-width: 0; width: 100%; }
  }

  /* =============================================
     🃏 CARDS — GLASSMORPHISM
     ============================================= */
  .card {
    background: rgba(12,15,26,0.7);
    backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
    border: 1px solid var(--border);
    border-radius: var(--card-radius);
    padding: 22px;
    box-shadow: var(--glow-card);
    transition: border-color 0.2s, box-shadow 0.2s;
    position: relative; overflow: hidden;
  }
  .card::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent);
  }
  .card:hover {
    border-color: var(--border2);
    box-shadow: var(--glow-card), 0 0 0 1px rgba(255,255,255,0.04) inset;
  }
  .card-title {
    font-size: 10px; font-weight: 700; color: var(--text3);
    letter-spacing: 0.12em; text-transform: uppercase;
    margin-bottom: 14px; font-family: var(--font-mono);
  }

  /* =============================================
     📊 METRIC CARDS
     ============================================= */
  .metric-card { position: relative; overflow: hidden; }
  .metric-card::after {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: var(--accent, var(--blue));
    box-shadow: 0 0 12px var(--accent, var(--blue));
  }
  .metric-card .card-glow {
    position: absolute; top: -40px; right: -40px;
    width: 120px; height: 120px; border-radius: 50%;
    background: radial-gradient(circle, var(--accent, var(--blue)) 0%, transparent 70%);
    opacity: 0.06; pointer-events: none;
  }
  .metric-val {
    font-size: 28px; font-weight: 700;
    font-family: var(--font-head); color: var(--text);
    letter-spacing: -0.03em; line-height: 1.1;
    margin-top: 2px;
  }
  .metric-sub { font-size: 12px; color: var(--text2); margin-top: 5px; font-family: var(--font-mono); }
  .metric-badge {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 4px 10px; border-radius: 20px;
    font-size: 11px; font-family: var(--font-mono); font-weight: 600;
    margin-top: 8px; letter-spacing: 0.02em;
  }
  .badge-green { background: rgba(5,226,156,0.1); color: var(--green); border: 1px solid rgba(5,226,156,0.2); }
  .badge-red   { background: rgba(255,61,107,0.1); color: var(--red);   border: 1px solid rgba(255,61,107,0.2); }
  .badge-gold  { background: rgba(255,190,61,0.1); color: var(--gold);  border: 1px solid rgba(255,190,61,0.2); }
  .badge-blue  { background: rgba(75,143,255,0.1); color: var(--blue);  border: 1px solid rgba(75,143,255,0.2); }

  /* =============================================
     📋 SECTION HEADERS
     ============================================= */
  .section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; }
  .section-title { font-family: var(--font-head); font-size: 15px; font-weight: 600; color: var(--text); letter-spacing: -0.01em; }

  /* =============================================
     📋 TABLES
     ============================================= */
  .data-table { width: 100%; border-collapse: collapse; }
  .data-table th {
    font-size: 10px; color: var(--text3); font-family: var(--font-mono);
    text-transform: uppercase; letter-spacing: 0.1em;
    padding: 10px 14px; text-align: left;
    border-bottom: 1px solid var(--border);
    font-weight: 700;
  }
  .data-table td {
    padding: 13px 14px; border-bottom: 1px solid var(--border);
    font-size: 13px; vertical-align: middle;
    transition: background 0.1s;
  }
  .data-table tr:last-child td { border-bottom: none; }
  .data-table tr:hover td { background: rgba(255,255,255,0.025); }

  /* =============================================
     💳 TRANSACTION ITEMS
     ============================================= */
  .tx-item {
    display: flex; align-items: center; gap: 14px;
    padding: 13px 0; border-bottom: 1px solid var(--border);
    transition: background 0.1s; border-radius: 4px;
  }
  .tx-item:last-child { border-bottom: none; }
  .tx-item:hover { background: rgba(255,255,255,0.02); margin: 0 -8px; padding: 13px 8px; }
  .tx-icon {
    width: 40px; height: 40px; border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    font-size: 18px; flex-shrink: 0;
    border: 1px solid rgba(255,255,255,0.06);
  }
  .tx-info { flex: 1; min-width: 0; }
  .tx-name { font-size: 13px; font-weight: 500; font-family: var(--font-head); color: var(--text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .tx-meta { font-size: 11px; color: var(--text2); margin-top: 3px; font-family: var(--font-mono); display: flex; align-items: center; gap: 6px; }
  .tx-amount { font-family: var(--font-head); font-size: 14px; font-weight: 700; text-align: right; flex-shrink: 0; letter-spacing: -0.02em; }

  /* =============================================
     📊 PROGRESS BARS
     ============================================= */
  .progress-bar {
    height: 5px; background: rgba(255,255,255,0.05);
    border-radius: 99px; overflow: hidden; margin-top: 10px;
  }
  .progress-fill {
    height: 100%; border-radius: 99px;
    transition: width 0.7s cubic-bezier(0.34, 1.56, 0.64, 1);
    position: relative; overflow: hidden;
  }
  .progress-fill::after {
    content: '';
    position: absolute; top: 0; left: -100%; width: 100%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
    animation: shimmer 2s ease-in-out infinite;
  }
  @keyframes shimmer { to { left: 100%; } }
  .budget-item { margin-bottom: 20px; }
  .budget-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; }
  .budget-name { font-size: 13px; font-weight: 500; font-family: var(--font-head); color: var(--text); }
  .budget-amounts { font-size: 11px; font-family: var(--font-mono); color: var(--text2); }

  /* =============================================
     🍩 DONUT CHART
     ============================================= */
  .donut-wrap { display: flex; align-items: center; gap: 24px; }
  .donut-legend { flex: 1; }
  .legend-item { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
  .legend-dot { width: 8px; height: 8px; border-radius: 3px; flex-shrink: 0; }
  .legend-label { font-size: 12px; color: var(--text2); flex: 1; font-family: var(--font-head); }
  .legend-val { font-size: 12px; font-family: var(--font-mono); color: var(--text); font-weight: 600; }

  /* =============================================
     🎛 FORMS & INPUTS
     ============================================= */
  .input-row { display: flex; gap: 10px; margin-bottom: 12px; flex-wrap: wrap; align-items: flex-end; }
  .inp {
    flex: 1; min-width: 140px; padding: 11px 15px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 11px; color: var(--text);
    font-size: 13px; font-family: var(--font-thai);
    outline: none; transition: border-color 0.2s, box-shadow 0.2s;
    -webkit-appearance: none;
  }
  .inp:focus {
    border-color: rgba(75,143,255,0.45);
    box-shadow: 0 0 0 3px rgba(75,143,255,0.08);
    background: rgba(75,143,255,0.04);
  }
  .inp::placeholder { color: var(--text3); }
  select.inp { appearance: none; cursor: pointer; }

  .btn {
    padding: 11px 20px; border-radius: 11px; border: none;
    font-size: 13px; font-family: var(--font-head); cursor: pointer;
    font-weight: 600; transition: all 0.15s; white-space: nowrap;
    letter-spacing: -0.01em;
  }
  .btn:hover { transform: translateY(-1px); }
  .btn:active { transform: translateY(0); }
  .btn-green {
    background: linear-gradient(135deg, var(--green2), #009966);
    color: #000;
    box-shadow: 0 4px 14px rgba(5,226,156,0.2);
  }
  .btn-green:hover { box-shadow: 0 6px 20px rgba(5,226,156,0.35); }
  .btn-blue {
    background: linear-gradient(135deg, var(--blue), var(--blue2));
    color: #fff;
    box-shadow: 0 4px 14px rgba(75,143,255,0.2);
  }
  .btn-blue:hover { box-shadow: 0 6px 20px rgba(75,143,255,0.35); }
  .btn-ghost {
    background: rgba(255,255,255,0.05);
    color: var(--text);
    border: 1px solid var(--border2);
  }
  .btn-ghost:hover { background: rgba(255,255,255,0.08); border-color: var(--border3); }
  .btn-ghost.active { background: rgba(255,255,255,0.09); border-color: var(--border3); }
  .btn-red {
    background: linear-gradient(135deg, var(--red), var(--red2));
    color: #fff;
    box-shadow: 0 4px 14px rgba(255,61,107,0.2);
  }
  .btn-action {
    background: none; border: none; cursor: pointer;
    padding: 5px 7px; font-size: 15px; opacity: 0.5;
    transition: opacity 0.15s, transform 0.15s; border-radius: 6px;
  }
  .btn-action:hover { opacity: 1; transform: scale(1.2); background: rgba(255,255,255,0.06); }

  /* =============================================
     📲 SMS PARSER
     ============================================= */
  .sms-box {
    width: 100%; min-height: 110px; padding: 14px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 12px; color: var(--text) !important;
    font-size: 12px; font-family: var(--font-mono);
    resize: vertical; outline: none; -webkit-appearance: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    line-height: 1.7;
  }
  .sms-box:focus {
    border-color: rgba(75,143,255,0.4);
    box-shadow: 0 0 0 3px rgba(75,143,255,0.08);
  }
  .sms-example {
    padding: 12px 16px; background: rgba(255,255,255,0.03);
    border-radius: 10px; margin-bottom: 8px;
    cursor: pointer; font-size: 11px; font-family: var(--font-mono); color: var(--text2);
    border: 1px solid var(--border); line-height: 1.7;
    transition: background 0.15s, border-color 0.15s;
  }
  .sms-example:hover { background: rgba(75,143,255,0.05); border-color: rgba(75,143,255,0.2); color: var(--text); }
  .parse-result {
    margin-top: 16px; padding: 18px;
    background: rgba(5,226,156,0.04);
    border: 1px solid rgba(5,226,156,0.2);
    border-radius: 14px;
  }
  .parse-row { display: flex; justify-content: space-between; padding: 5px 0; font-size: 13px; }
  .parse-key { color: var(--text2); font-family: var(--font-mono); font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; }
  .parse-val { color: var(--text); font-weight: 600; font-family: var(--font-head); }

  /* =============================================
     📈 TICKER CARDS
     ============================================= */
  .ticker-card { display: flex; flex-direction: column; gap: 3px; }
  .ticker-sym { font-size: 15px; font-weight: 700; font-family: var(--font-head); color: var(--text); letter-spacing: -0.02em; }
  .ticker-name { font-size: 10px; color: var(--text2); font-family: var(--font-mono); }
  .ticker-price { font-size: 20px; font-weight: 700; font-family: var(--font-head); margin-top: 8px; color: var(--text); letter-spacing: -0.03em; }
  .ticker-change { font-size: 12px; font-family: var(--font-mono); margin-top: 2px; }
  .up { color: var(--green); } .dn { color: var(--red); }

  /* =============================================
     🏷 TAGS / BADGES
     ============================================= */
  .tag {
    display: inline-block; padding: 3px 9px; border-radius: 6px;
    font-size: 10px; font-family: var(--font-mono); font-weight: 700;
    letter-spacing: 0.03em;
  }
  .tag-income  { background: rgba(5,226,156,0.12);  color: var(--green);  border: 1px solid rgba(5,226,156,0.2); }
  .tag-expense { background: rgba(255,61,107,0.12); color: var(--red);    border: 1px solid rgba(255,61,107,0.2); }
  .tag-invest  { background: rgba(75,143,255,0.12); color: var(--blue);   border: 1px solid rgba(75,143,255,0.2); }
  .tag-fix     { background: rgba(167,139,250,0.12); color: var(--purple); border: 1px solid rgba(167,139,250,0.2); }
  .tag-var     { background: rgba(255,190,61,0.12);  color: var(--gold);   border: 1px solid rgba(255,190,61,0.2); }
  .tag-blue    { background: rgba(75,143,255,0.12);  color: var(--blue);   border: 1px solid rgba(75,143,255,0.2); }
  .tag-gold    { background: rgba(255,190,61,0.12);  color: var(--gold);   border: 1px solid rgba(255,190,61,0.2); }

  /* =============================================
     ⚡ ALERTS
     ============================================= */
  .alert {
    padding: 13px 18px; border-radius: 12px; margin-bottom: 14px;
    font-size: 13px; display: flex; align-items: flex-start; gap: 10px;
    font-family: var(--font-head);
  }
  .alert-warning {
    background: rgba(255,190,61,0.06);
    border: 1px solid rgba(255,190,61,0.2); color: var(--gold);
  }
  .alert-info {
    background: rgba(75,143,255,0.06);
    border: 1px solid rgba(75,143,255,0.2); color: var(--blue);
  }

  /* =============================================
     🔢 EXCHANGE RATE INPUT
     ============================================= */
  .exchange-input {
    background: transparent; border: none;
    border-bottom: 1px dashed rgba(255,255,255,0.2);
    color: var(--text); font-size: 26px; font-weight: 700;
    font-family: var(--font-head); letter-spacing: -0.03em;
    width: 110px; outline: none; text-align: left;
    transition: border-color 0.15s;
  }
  .exchange-input:focus { border-bottom-color: var(--blue); color: var(--blue); }

  /* =============================================
     🛠 UTILITIES
     ============================================= */
  .mt-16 { margin-top: 16px; } .mt-12 { margin-top: 12px; } .mt-8 { margin-top: 8px; }
  .row { display: flex; align-items: center; gap: 10px; }
  .text-right { text-align: right; } .text-mono { font-family: var(--font-mono); }
  .text-xs { font-size: 11px; } .text-muted { color: var(--text2); }
  .divider { height: 1px; background: var(--border); margin: 16px 0; }

  /* =============================================
     🌀 LOADING STATE
     ============================================= */
  .loading-wrap {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    padding: 80px 20px; gap: 16px;
  }
  .loading-spinner {
    width: 36px; height: 36px; border-radius: 50%;
    border: 2px solid var(--border2);
    border-top-color: var(--green);
    animation: spin 0.8s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  .loading-text { font-family: var(--font-mono); font-size: 12px; color: var(--text2); }

  /* =============================================
     📱 SCROLLBAR
     ============================================= */
  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 99px; }
  ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
`;

// ============================================================
// MOCK DATA (ต้นฉบับ 100%)
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
  food:      { label: "อาหาร",     icon: "🍜", color: "#f0b429" },
  transport: { label: "เดินทาง",   icon: "🚗", color: "#4b8fff" },
  shopping:  { label: "ช้อปปิ้ง",  icon: "🛍️", color: "#a78bfa" },
  bills:     { label: "ค่าบิล",    icon: "📄", color: "#ff3d6b" },
  health:    { label: "สุขภาพ",    icon: "💊", color: "#05e29c" },
  invest:    { label: "ลงทุน",     icon: "📈", color: "#4b8fff" },
  income:    { label: "รายรับ",    icon: "💰", color: "#05e29c" },
  other:     { label: "อื่นๆ",     icon: "💸", color: "#7b85a0" },
};

const INITIAL_TXS = [];
const INITIAL_PORTFOLIO = [];

const BUDGETS = [
  { cat: "food",      limit: 5000 },
  { cat: "transport", limit: 2000 },
  { cat: "shopping",  limit: 3000 },
  { cat: "bills",     limit: 12000 },
  { cat: "health",    limit: 1500 },
];

function parseMakeSMS(sms) {
  const text = sms.trim();
  const result = { valid: false };
  const investMatch = text.match(/ซื้อ|ซื้อหุ้น|buy|ลงทุน|invest/i);
  const incomeMatch = text.match(/รับโอน|รับชำระ|เงินเข้า|โอนเงินเข้า|โอนเข้า|deposit|received/i);
  const amtMatch = text.match(/(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)\s*(?:บาท|THB|฿)/i) || text.match(/(?:จำนวน|Amount)[:\s]*(\d[\d,\.]+)/i) || text.match(/(\d{1,3}(?:,\d{3})*\.\d{2})/);
  const dateMatch = text.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/);
  const refMatch = text.match(/(?:ที่|จาก|ไปยัง|to|from|Ref)[:\s]*([^\n]+)/i);
  const balMatch = text.match(/(?:คงเหลือ|Balance|ยอด)[:\s:]*(\d[\d,\.]+)/i);
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
      result.type = "expense"; result.direction = "-"; result.cat = guessCategory(refMatch ? refMatch[1] : text);
    }
    result.date = dateMatch ? `${dateMatch[3].length === 2 ? "20" + dateMatch[3] : dateMatch[3]}-${String(dateMatch[2]).padStart(2, "0")}-${String(dateMatch[1]).padStart(2, "0")}` : new Date().toISOString().slice(0, 10);
    result.merchant = refMatch ? refMatch[1].trim().slice(0, 40) : (investMatch ? "Invest Transaction" : "MAKE by KBank Transaction");
    result.balance = balMatch ? parseFloat(balMatch[1].replace(/,/g, "")) : null;
    result.source = "MAKE SMS";
  }
  return result;
}

function guessCategory(text) {
  const t = text.toLowerCase();
  if (/grab|taxi|bts|mrt|uber|เดิน/.test(t)) return "transport";
  if (/netflix|spotify|true|ais|dtac|ค่าน้ำ|ค่าไฟ|internet/.test(t)) return "bills";
  if (/โรง|pharma|เวชภัณฑ์|hospital|clinic|ยา/.test(t)) return "health";
  if (/lazada|shopee|amazon|central|สยาม/.test(t)) return "shopping";
  if (/ร้าน|food|กาแฟ|coffee|ข้าว|ก๋วยเตี๋ยว|pizza|mcdonald/.test(t)) return "food";
  if (/หุ้น|stock|กองทุน|crypto|invest/.test(t)) return "invest";
  return "other";
}

function fmt(n, dec = 0) { return (n || 0).toLocaleString("th-TH", { minimumFractionDigits: dec, maximumFractionDigits: dec }); }

// ============================================================
// MINI COMPONENTS
// ============================================================
function DonutChart({ data, size = 140 }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  if (total === 0) return <svg width={size} height={size} style={{ flexShrink: 0 }}></svg>;
  let acc = 0;
  const arcs = data.map(d => { const pct = d.value / total; const start = acc; acc += pct; return { ...d, pct, start }; });
  const cx = size / 2, cy = size / 2, r = size * 0.38, inner = size * 0.25;
  function slice(s, p) {
    if (p === 1) return `M ${cx} ${cy - r} A ${r} ${r} 0 1 1 ${cx} ${cy + r} A ${r} ${r} 0 1 1 ${cx} ${cy - r} Z`;
    const a1 = s * 2 * Math.PI - Math.PI / 2; const a2 = (s + p) * 2 * Math.PI - Math.PI / 2;
    const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1); const x2 = cx + r * Math.cos(a2), y2 = cy + r * Math.sin(a2);
    const ix1 = cx + inner * Math.cos(a1), iy1 = cy + inner * Math.sin(a1); const ix2 = cx + inner * Math.cos(a2), iy2 = cy + inner * Math.sin(a2);
    const lg = p > 0.5 ? 1 : 0;
    return `M ${ix1} ${iy1} L ${x1} ${y1} A ${r} ${r} 0 ${lg} 1 ${x2} ${y2} L ${ix2} ${iy2} A ${inner} ${inner} 0 ${lg} 0 ${ix1} ${iy1} Z`;
  }
  return (
    <svg width={size} height={size} style={{ flexShrink: 0 }}>
      {arcs.map((a, i) => (
        <path key={i} d={slice(a.start, a.pct)} fill={a.color} opacity={0.9}>
          <title>{a.label}: ฿{fmt(a.value)}</title>
        </path>
      ))}
      <circle cx={cx} cy={cy} r={inner - 4} fill="rgba(12,15,26,0.8)" />
    </svg>
  );
}

function MiniBarChart({ values, color = "#4b8fff", height = 50 }) {
  const max = Math.max(...values, 1);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height }}>
      {values.map((v, i) => (
        <div key={i} style={{
          flex: 1,
          height: `${(v / max) * 100}%`,
          background: i === values.length - 1
            ? `linear-gradient(to top, ${color}, ${color}cc)`
            : `${color}40`,
          borderRadius: "4px 4px 0 0",
          minHeight: 3,
          transition: "height 0.4s ease",
        }} />
      ))}
    </div>
  );
}

// ============================================================
// TABS CONTENT
// ============================================================
function DashboardTab({ txs, portfolio, livePrices, isLoadingPrices, exchangeRate }) {
  const thisMonth = txs.filter(t => t.date.startsWith(new Date().toISOString().slice(0, 7)));
  const income = txs.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const expense = txs.filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);
  const saving = income - expense;
  const savingRate = income > 0 ? (saving / income) * 100 : 0;
  const portValue = portfolio.reduce((s, p) => { const px = livePrices[p.symbol]?.price || p.avgCost; return s + px * p.shares; }, 0);
  const portCost = portfolio.reduce((s, p) => s + p.avgCost * p.shares, 0);
  const portPnL = portValue - portCost;
  const bankBalance = txs.reduce((sum, t) => sum + t.amount, 0);
  const debt = 0;
  const portValueTHB = portValue * exchangeRate;
  const netWorth = bankBalance + portValueTHB - debt;
  const allocData = [
    { label: "เงินฝาก", value: Math.max(bankBalance, 0), color: "#4b8fff" },
    { label: "หุ้น US",  value: portValueTHB,             color: "#05e29c" },
    { label: "หนี้สิน", value: debt,                      color: "#ff3d6b" },
  ].filter(d => d.value > 0);
  const monthlyExpenses = [0, 0, 0, 0, expense];

  return (
    <div className="gap-16">
      {savingRate < 20 && income > 0 && (
        <div className="alert alert-warning">
          ⚠️ อัตราการออมเดือนนี้ {savingRate.toFixed(1)}% — ต่ำกว่าเป้าหมาย 20%
        </div>
      )}

      {/* TOP METRICS */}
      <div className="grid-4">
        {[
          { label: "NET WORTH",        val: isLoadingPrices ? "Loading..." : `฿${fmt(netWorth)}`,        sub: "ทรัพย์สินสุทธิ",                                                    badge: "Live",                                                          btype: "badge-green", accent: "#05e29c" },
          { label: "รายรับเดือนนี้",    val: `฿${fmt(income)}`,                                           sub: "Current Month",                                                    badge: "=",                                                             btype: "badge-blue",  accent: "#4b8fff" },
          { label: "รายจ่ายเดือนนี้",   val: `฿${fmt(expense)}`,                                          sub: `${((expense / (income || 1)) * 100).toFixed(0)}% ของรายรับ`,      badge: expense > 30000 ? "เกินงบ" : "ในงบ",                             btype: expense > 30000 ? "badge-red" : "badge-green", accent: expense > 30000 ? "#ff3d6b" : "#05e29c" },
          { label: "มูลค่าพอร์ต (THB)", val: isLoadingPrices ? "Loading..." : `฿${fmt(portValueTHB)}`,  sub: isLoadingPrices ? "" : `P&L: ${portPnL >= 0 ? "+" : ""}$${fmt(portPnL, 2)}`, badge: isLoadingPrices ? "..." : `${portPnL >= 0 ? "+" : ""}${((portPnL / (portCost || 1)) * 100).toFixed(1)}%`, btype: portPnL >= 0 ? "badge-green" : "badge-red", accent: "#a78bfa" },
        ].map((m, i) => (
          <div key={i} className="card metric-card" style={{ "--accent": m.accent }}>
            <div className="card-glow" style={{ "--accent": m.accent, background: `radial-gradient(circle, ${m.accent} 0%, transparent 70%)` }} />
            <div className="card-title">{m.label}</div>
            <div className="metric-val" style={{ fontSize: isLoadingPrices && (i === 0 || i === 3) ? "18px" : undefined }}>{m.val}</div>
            <div className="metric-sub">{m.sub}</div>
            <div className={`metric-badge ${m.btype}`}>{m.badge}</div>
          </div>
        ))}
      </div>

      {/* CHARTS */}
      <div className="grid-2">
        <div className="card">
          <div className="card-title">การจัดสรรสินทรัพย์ {isLoadingPrices && "⏳"}</div>
          <div className="donut-wrap">
            <DonutChart data={allocData} size={160} />
            <div className="donut-legend">
              {allocData.map((d, i) => (
                <div key={i} className="legend-item">
                  <div className="legend-dot" style={{ background: d.color }} />
                  <span className="legend-label">{d.label}</span>
                  <span className="legend-val">฿{fmt(d.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-title">รายจ่าย 5 เดือน</div>
          <MiniBarChart values={monthlyExpenses} color="#ff3d6b" height={90} />
          <div style={{ display: "flex", gap: 3, marginTop: 8 }}>
            {["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค."].map((m, i) => (
              <div key={i} style={{ flex: 1, textAlign: "center", fontSize: 9, color: "var(--text3)", fontFamily: "var(--font-mono)" }}>{m}</div>
            ))}
          </div>
          <div className="divider" />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
            <span style={{ color: "var(--text2)", fontFamily: "var(--font-mono)", fontSize: 11 }}>ออมเดือนนี้</span>
            <span style={{ color: "var(--green)", fontFamily: "var(--font-head)", fontWeight: 700 }}>฿{fmt(saving)}</span>
          </div>
        </div>
      </div>

      {/* NET WORTH TABLE */}
      <div className="card">
        <div className="card-title">ภาพรวมการเงินทั้งหมด</div>
        <div style={{ overflowX: "auto" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>บัญชี / สินทรัพย์</th>
                <th>ประเภท</th>
                <th className="text-right">มูลค่า (บาท)</th>
                <th className="text-right">% ของ Net Worth</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ fontFamily: "var(--font-head)", fontWeight: 500 }}>MAKE by KBank ออมทรัพย์</td>
                <td><span className="tag tag-income">เงินฝาก</span></td>
                <td className="text-right text-mono">฿{fmt(bankBalance)}</td>
                <td className="text-right text-mono">{netWorth > 0 ? ((bankBalance / netWorth) * 100).toFixed(1) : 0}%</td>
              </tr>
              <tr>
                <td style={{ fontFamily: "var(--font-head)", fontWeight: 500 }}>พอร์ต US Stocks (DIME)</td>
                <td><span className="tag tag-invest">หุ้น US</span></td>
                <td className="text-right text-mono">{isLoadingPrices ? "Loading..." : `฿${fmt(portValueTHB)}`}</td>
                <td className="text-right text-mono">{netWorth > 0 ? ((portValueTHB / netWorth) * 100).toFixed(1) : 0}%</td>
              </tr>
              <tr style={{ borderTop: "1px solid var(--border2)" }}>
                <td style={{ fontWeight: 700, fontFamily: "var(--font-head)" }}>Net Worth รวม</td>
                <td></td>
                <td className="text-right" style={{ color: "var(--green)", fontWeight: 700, fontFamily: "var(--font-head)" }}>
                  {isLoadingPrices ? "Loading..." : `฿${fmt(netWorth)}`}
                </td>
                <td className="text-right text-mono" style={{ color: "var(--green)", fontWeight: 700 }}>100%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* RECENT TRANSACTIONS */}
      <div className="card">
        <div className="section-header">
          <span className="section-title">รายการล่าสุด</span>
          <span style={{ fontSize: 11, color: "var(--text3)", fontFamily: "var(--font-mono)" }}>MAKE by KBank</span>
        </div>
        {txs.length === 0 && (
          <div style={{ textAlign: "center", padding: "32px 0", color: "var(--text2)", fontFamily: "var(--font-mono)", fontSize: 12 }}>
            ยังไม่มีรายการทางการเงินในระบบ
          </div>
        )}
        {txs.slice(0, 5).map(tx => {
          const cat = CATEGORIES[tx.cat] || CATEGORIES.other;
          return (
            <div key={tx.id} className="tx-item">
              <div className="tx-icon" style={{ background: cat.color + "15", border: `1px solid ${cat.color}25` }}>{cat.icon}</div>
              <div className="tx-info">
                <div className="tx-name">{tx.desc}</div>
                <div className="tx-meta">
                  <span>{tx.date}</span>
                  <span style={{ color: "var(--border3)" }}>·</span>
                  <span>{cat.label}</span>
                  <span style={{ color: "var(--border3)" }}>·</span>
                  <span className={tx.type === "fix" ? "tag tag-fix" : "tag tag-var"}>{tx.type === "fix" ? "Fix" : "Var"}</span>
                </div>
              </div>
              <div className="tx-amount" style={{ color: tx.amount > 0 ? "var(--green)" : "var(--text)" }}>
                {tx.amount > 0 ? "+" : ""}฿{fmt(Math.abs(tx.amount))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TransactionsTab({ txs, setTxs }) {
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");
  const [cat, setCat] = useState("food");
  const [type, setType] = useState("var");
  const [filter, setFilter] = useState("all");
  const [txSign, setTxSign] = useState("-");
  const [editId, setEditId] = useState(null);

  function saveTx() {
    if (!desc || !amount) return;
    const finalAmt = parseFloat(amount) * (txSign === "-" ? -1 : 1);
    if (editId) {
      setTxs(prev => prev.map(t => t.id === editId ? { ...t, desc, amount: finalAmt, cat, type } : t));
      setEditId(null);
    } else {
      const newTx = { id: Date.now(), date: new Date().toISOString().slice(0, 10), desc, amount: finalAmt, cat, type, src: "manual" };
      setTxs(prev => [newTx, ...prev]);
    }
    setDesc(""); setAmount(""); setTxSign("-");
  }

  function editTx(tx) {
    setDesc(tx.desc);
    setAmount(Math.abs(tx.amount).toString());
    setTxSign(tx.amount >= 0 ? "+" : "-");
    setCat(tx.cat);
    setType(tx.type);
    setEditId(tx.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function deleteTx(id) {
    if (window.confirm("ต้องการลบรายการนี้ใช่หรือไม่?")) {
      setTxs(prev => prev.filter(t => t.id !== id));
    }
  }

  const filtered = filter === "all" ? txs : filter === "income" ? txs.filter(t => t.amount > 0) : txs.filter(t => t.amount < 0);
  const totalIn  = txs.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const totalOut = txs.filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);

  return (
    <div className="gap-16">
      {/* SUMMARY */}
      <div className="grid-3">
        <div className="card metric-card" style={{ "--accent": "#05e29c" }}>
          <div className="card-glow" />
          <div className="card-title">รายรับรวม</div>
          <div className="metric-val">฿{fmt(totalIn)}</div>
          <div className="metric-badge badge-green">+ รายรับ</div>
        </div>
        <div className="card metric-card" style={{ "--accent": "#ff3d6b" }}>
          <div className="card-glow" />
          <div className="card-title">รายจ่ายรวม</div>
          <div className="metric-val">฿{fmt(totalOut)}</div>
          <div className="metric-badge badge-red">- รายจ่าย</div>
        </div>
        <div className="card metric-card" style={{ "--accent": "#4b8fff" }}>
          <div className="card-glow" />
          <div className="card-title">คงเหลือสุทธิ</div>
          <div className="metric-val" style={{ color: totalIn - totalOut >= 0 ? "var(--green)" : "var(--red)" }}>
            ฿{fmt(totalIn - totalOut)}
          </div>
          <div className={`metric-badge ${totalIn - totalOut >= 0 ? "badge-green" : "badge-red"}`}>Net Flow</div>
        </div>
      </div>

      {/* FORM */}
      <div className="card">
        <div className="card-title" style={{ color: editId ? "var(--blue)" : undefined }}>
          {editId ? "✏️ กำลังแก้ไขรายการ" : "เพิ่มรายการด้วยตนเอง"}
        </div>
        <div className="input-row">
          <input className="inp" placeholder="คำอธิบาย (เช่น ค่าอาหาร)" value={desc} onChange={e => setDesc(e.target.value)} style={{ flex: 2 }} />
          <select className="inp" value={txSign} onChange={e => setTxSign(e.target.value)} style={{ flex: "0 0 120px", minWidth: "120px" }}>
            <option value="-">📉 จ่าย (-)</option>
            <option value="+">📈 รับ (+)</option>
          </select>
          <input className="inp" type="number" placeholder="จำนวนเงิน" value={amount} onChange={e => setAmount(e.target.value)} style={{ flex: 1, minWidth: "100px" }} />
        </div>
        <div className="input-row">
          <select className="inp" value={cat} onChange={e => setCat(e.target.value)}>
            {Object.entries(CATEGORIES).map(([k, v]) => <option key={k} value={k}>{v.icon} {v.label}</option>)}
          </select>
          <select className="inp" value={type} onChange={e => setType(e.target.value)}>
            <option value="fix">🔒 Fix Cost (คงที่)</option>
            <option value="var">📊 Variable Cost (ผันแปร)</option>
          </select>
          <button className={editId ? "btn btn-blue" : "btn btn-green"} onClick={saveTx}>
            {editId ? "💾 บันทึกแก้ไข" : "+ เพิ่ม"}
          </button>
          {editId && (
            <button className="btn btn-ghost" onClick={() => { setEditId(null); setDesc(""); setAmount(""); setTxSign("-"); }}>
              ❌ ยกเลิก
            </button>
          )}
        </div>
      </div>

      {/* TABLE */}
      <div className="card">
        <div className="section-header">
          <span className="section-title">ประวัติรายการ ({filtered.length})</span>
          <div className="row" style={{ gap: 6 }}>
            {["all", "income", "expense"].map(f => (
              <button key={f}
                className={`btn btn-ghost ${filter === f ? "active" : ""}`}
                style={{ padding: "6px 14px", fontSize: 12, background: filter === f ? "rgba(255,255,255,0.09)" : undefined }}
                onClick={() => setFilter(f)}>
                {f === "all" ? "ทั้งหมด" : f === "income" ? "รายรับ" : "รายจ่าย"}
              </button>
            ))}
          </div>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>วันที่</th>
                <th>รายการ</th>
                <th>หมวด</th>
                <th>ประเภท</th>
                <th className="text-right">จำนวน</th>
                <th className="text-right">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan="6" style={{ textAlign: "center", color: "var(--text2)", padding: "28px", fontFamily: "var(--font-mono)", fontSize: 12 }}>ไม่มีรายการ</td></tr>
              )}
              {filtered.map(tx => {
                const cat = CATEGORIES[tx.cat] || CATEGORIES.other;
                return (
                  <tr key={tx.id}>
                    <td style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text2)" }}>{tx.date}</td>
                    <td style={{ fontFamily: "var(--font-head)", fontWeight: 500 }}>{tx.desc}</td>
                    <td><span style={{ fontSize: 12 }}>{cat.icon} {cat.label}</span></td>
                    <td><span className={tx.type === "fix" ? "tag tag-fix" : "tag tag-var"}>{tx.type === "fix" ? "Fix" : "Var"}</span></td>
                    <td className="text-right" style={{ fontFamily: "var(--font-head)", fontWeight: 700, color: tx.amount > 0 ? "var(--green)" : "var(--text)" }}>
                      {tx.amount > 0 ? "+" : ""}฿{fmt(Math.abs(tx.amount))}
                    </td>
                    <td className="text-right">
                      <button className="btn-action" onClick={() => editTx(tx)} title="แก้ไข">✏️</button>
                      <button className="btn-action" onClick={() => deleteTx(tx.id)} title="ลบ">🗑️</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function SmsParserTab({ setTxs, portfolio, setPortfolio, exchangeRate }) {
  const [sms, setSms] = useState("");
  const [result, setResult] = useState(null);
  const [added, setAdded] = useState(false);

  const examples = [
    `MAKE: เงินเข้า 10,000 บาท`,
    `MAKE: ซื้อหุ้น NVDA 5 หุ้น 20,000 บาท`,
    `MAKE: จ่าย Netflix 419.00 บาท วันที่ 02/05/67`,
  ];

  function parse() { const r = parseMakeSMS(sms); setResult(r); setAdded(false); }

  function addToLedger() {
    if (!result?.valid) return;
    const newTx = {
      id: Date.now(), date: result.date,
      desc: result.cat === "invest" && result.symbol ? `ซื้อหุ้น ${result.symbol}` : result.merchant,
      amount: result.type === "income" ? result.amount : -result.amount,
      cat: result.cat, type: "var", src: "make-sms"
    };
    setTxs(prev => [newTx, ...prev]);
    if (result.cat === "invest" && result.symbol) {
      setPortfolio(prev => {
        const existing = prev.find(p => p.symbol === result.symbol);
        const sharesToAdd = result.shares || 1;
        const costUSD = result.amount / exchangeRate;
        if (existing) {
          const totalCost = (existing.avgCost * existing.shares) + costUSD;
          const newShares = existing.shares + sharesToAdd;
          const newAvgCost = totalCost / newShares;
          return prev.map(p => p.symbol === result.symbol ? { ...p, shares: newShares, avgCost: newAvgCost } : p);
        } else {
          return [...prev, { symbol: result.symbol, shares: sharesToAdd, avgCost: costUSD / sharesToAdd, exchange: "US" }];
        }
      });
    }
    setAdded(true);
  }

  return (
    <div className="gap-16">
      <div className="alert alert-info">
        💡 คัดลอก SMS / Notification จาก MAKE หรือแอปเทรดมาวาง แล้วกด Parse ระบบจะดึงข้อมูลอัตโนมัติ
      </div>

      <div className="card">
        <div className="card-title">ตัวอย่าง SMS Format ที่รองรับ</div>
        {examples.map((e, i) => (
          <div key={i} className="sms-example" onClick={() => { setSms(e); setResult(null); }}>{e}</div>
        ))}
        <div style={{ fontSize: 11, color: "var(--text3)", fontFamily: "var(--font-mono)", marginTop: 8 }}>คลิกที่ตัวอย่างเพื่อโหลดข้อความ</div>
      </div>

      <div className="card">
        <div className="card-title">วาง SMS / Notification ที่นี่</div>
        <textarea
          className="sms-box"
          placeholder="วาง SMS จาก MAKE by KBank ที่นี่..."
          value={sms}
          onChange={e => { setSms(e.target.value); setResult(null); }}
        />
        <div className="row mt-12">
          <button className="btn btn-blue" onClick={parse}>🔍 Parse SMS</button>
          <button className="btn btn-ghost" onClick={() => { setSms(""); setResult(null); }}>ล้าง</button>
        </div>

        {result && (
          <div className="parse-result mt-16">
            {result.valid ? (
              <>
                <div style={{ fontSize: 12, fontWeight: 700, color: "var(--green)", marginBottom: 14, fontFamily: "var(--font-mono)", letterSpacing: "0.05em" }}>✅ PARSE SUCCESS</div>
                {[
                  ["TYPE",    result.type === "income" ? "💰 รายรับ" : "💸 รายจ่าย"],
                  ["AMOUNT",  `${result.direction}฿${fmt(result.amount, 2)}`],
                  ...(result.cat === "invest" && result.symbol ? [["SYMBOL", result.symbol], ["SHARES", `${result.shares || 1} หุ้น`]] : []),
                  ["DATE",    result.date],
                  ["MERCHANT", result.merchant],
                  ["CATEGORY", `${CATEGORIES[result.cat]?.icon} ${CATEGORIES[result.cat]?.label}`],
                ].map(([k, v]) => (
                  <div key={k} className="parse-row">
                    <span className="parse-key">{k}</span>
                    <span className="parse-val">{v}</span>
                  </div>
                ))}
                <div className="row mt-12">
                  <button className="btn btn-green" onClick={addToLedger} disabled={added}>
                    {added ? "✅ เพิ่มแล้ว" : "+ บันทึกลงบัญชี"}
                  </button>
                </div>
              </>
            ) : (
              <div style={{ color: "var(--red)", fontSize: 13, fontFamily: "var(--font-mono)" }}>
                ❌ ไม่พบข้อมูลที่ Parse ได้ — ลองตรวจสอบรูปแบบ SMS
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function PortfolioTab({ portfolio, setPortfolio, livePrices, isLoadingPrices, exchangeRate, setExchangeRate }) {
  const [symbol, setSymbol] = useState("");
  const [shares, setShares] = useState("");
  const [cost, setCost] = useState("");
  const [exch, setExch] = useState("US");

  function addHolding() {
    if (!symbol || !shares || !cost) return;
    const symUpper = symbol.toUpperCase();
    setPortfolio(prev => {
      const existing = prev.find(p => p.symbol === symUpper);
      if (existing) {
        const totalCostBefore = existing.shares * existing.avgCost;
        const totalCostAdded  = parseFloat(shares) * parseFloat(cost);
        const newShares       = existing.shares + parseFloat(shares);
        const newAvgCost      = (totalCostBefore + totalCostAdded) / newShares;
        return prev.map(p => p.symbol === symUpper ? { ...p, shares: newShares, avgCost: newAvgCost } : p);
      } else {
        return [...prev, { symbol: symUpper, shares: parseFloat(shares), avgCost: parseFloat(cost), exchange: exch }];
      }
    });
    setSymbol(""); setShares(""); setCost("");
  }

  function deleteHolding(sym) {
    if (window.confirm(`ต้องการลบหุ้น ${sym} ออกจากพอร์ตใช่หรือไม่?`)) {
      setPortfolio(prev => prev.filter(p => p.symbol !== sym));
    }
  }

  const rows = portfolio.map(p => {
    const px = livePrices[p.symbol];
    const currentPrice = px?.price || p.avgCost;
    const isCrypto = p.exchange === "CRYPTO";
    const mktVal  = currentPrice * p.shares * (isCrypto ? 1 : exchangeRate);
    const costVal = p.avgCost   * p.shares * (isCrypto ? 1 : exchangeRate);
    const pnl     = mktVal - costVal;
    const pnlPct  = (pnl / (costVal || 1)) * 100;
    return { ...p, currentPrice, mktVal, costVal, pnl, pnlPct };
  });
  const totalVal  = rows.reduce((s, r) => s + r.mktVal, 0);
  const totalCost = rows.reduce((s, r) => s + r.costVal, 0);
  const totalPnL  = totalVal - totalCost;

  return (
    <div className="gap-16">
      {/* SUMMARY */}
      <div className="grid-3">
        <div className="card metric-card" style={{ "--accent": "#a78bfa" }}>
          <div className="card-glow" />
          <div className="card-title">มูลค่าพอร์ตรวม (THB)</div>
          <div className="metric-val" style={{ fontSize: isLoadingPrices ? "18px" : undefined }}>
            {isLoadingPrices ? "กำลังโหลด..." : `฿${fmt(totalVal)}`}
          </div>
          <div className="metric-sub">{isLoadingPrices ? "รอข้อมูล API..." : "ราคาตลาดปัจจุบัน"}</div>
        </div>
        <div className="card metric-card" style={{ "--accent": totalPnL >= 0 ? "#05e29c" : "#ff3d6b" }}>
          <div className="card-glow" />
          <div className="card-title">กำไร / ขาดทุน (UNREALIZED)</div>
          <div className="metric-val" style={{ color: totalPnL >= 0 && !isLoadingPrices ? "var(--green)" : "var(--red)", fontSize: isLoadingPrices ? "18px" : undefined }}>
            {isLoadingPrices ? "กำลังโหลด..." : `${totalPnL >= 0 ? "+" : ""}฿${fmt(totalPnL)}`}
          </div>
          <div className={`metric-badge ${totalPnL >= 0 ? "badge-green" : "badge-red"}`}>
            {isLoadingPrices ? "..." : `${totalPnL >= 0 ? "+" : ""}${((totalPnL / (totalCost || 1)) * 100).toFixed(2)}%`}
          </div>
        </div>
        <div className="card metric-card" style={{ "--accent": "#ffbe3d" }}>
          <div className="card-glow" />
          <div className="card-title">USD / THB RATE (DIME!)</div>
          <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "4px" }}>
            <span style={{ fontSize: "26px", fontWeight: 700, fontFamily: "var(--font-head)", color: "var(--gold)" }}>฿</span>
            <input
              type="number" step="0.01"
              value={exchangeRate}
              onChange={e => setExchangeRate(parseFloat(e.target.value) || 0)}
              className="exchange-input"
            />
          </div>
          <div className="metric-sub">แก้ค่าเงินปัจจุบัน (Auto-Sync)</div>
        </div>
      </div>

      {/* LIVE PRICES */}
      <div className="card">
        <div className="card-title">ราคาตลาด REAL-TIME · FINNHUB {isLoadingPrices && "⏳ กำลังอัปเดต..."}</div>
        <div className="grid-3">
          {["VOO", "NVDA", "GOOG"].map(sym => {
            const d = livePrices[sym];
            if (!d) return null;
            return (
              <div key={sym} style={{
                padding: "16px", borderRadius: "12px",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid var(--border)",
              }}>
                <div className="ticker-card">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div className="ticker-sym">{sym}</div>
                      <div className="ticker-name">{d.name}</div>
                    </div>
                    {!isLoadingPrices && (
                      <div className={`metric-badge ${d.change >= 0 ? "badge-green" : "badge-red"}`} style={{ marginTop: 0 }}>
                        {d.pct >= 0 ? "+" : ""}{d.pct?.toFixed(2)}%
                      </div>
                    )}
                  </div>
                  <div className="ticker-price">{isLoadingPrices ? "..." : `$${fmt(d.price, 2)}`}</div>
                  {!isLoadingPrices && (
                    <div className={`ticker-change ${d.change >= 0 ? "up" : "dn"}`}>
                      {d.change >= 0 ? "▲" : "▼"} {Math.abs(d.change).toFixed(2)}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* HOLDINGS TABLE */}
      <div className="card">
        <div className="section-header">
          <span className="section-title">หุ้น Dime ที่ถือ</span>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>ชื่อ</th>
                <th>Exchange</th>
                <th className="text-right">จำนวน</th>
                <th className="text-right">ต้นทุน/หน่วย</th>
                <th className="text-right">ราคาปัจจุบัน</th>
                <th className="text-right">มูลค่า (฿)</th>
                <th className="text-right">P&L</th>
                <th className="text-right">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr><td colSpan="8" style={{ textAlign: "center", color: "var(--text2)", padding: "28px", fontFamily: "var(--font-mono)", fontSize: 12 }}>ยังไม่มีหุ้นในพอร์ต</td></tr>
              )}
              {rows.map((r, i) => (
                <tr key={i}>
                  <td style={{ fontFamily: "var(--font-head)", fontWeight: 700, letterSpacing: "-0.01em" }}>{r.symbol}</td>
                  <td><span className={`tag ${r.exchange === "CRYPTO" ? "tag-gold" : "tag-blue"}`}>{r.exchange}</span></td>
                  <td className="text-right text-mono">{r.shares}</td>
                  <td className="text-right text-mono">${fmt(r.avgCost, 2)}</td>
                  <td className="text-right text-mono">{isLoadingPrices ? "..." : `$${fmt(r.currentPrice, 2)}`}</td>
                  <td className="text-right" style={{ fontFamily: "var(--font-head)", fontWeight: 600 }}>
                    {isLoadingPrices ? "..." : `฿${fmt(r.mktVal)}`}
                  </td>
                  <td className="text-right" style={{ fontFamily: "var(--font-head)", fontWeight: 700, color: r.pnl >= 0 && !isLoadingPrices ? "var(--green)" : "var(--red)" }}>
                    {isLoadingPrices ? "..." : (
                      <>
                        {r.pnl >= 0 ? "+" : ""}฿{fmt(r.pnl)}<br />
                        <span style={{ fontSize: 10, fontFamily: "var(--font-mono)", fontWeight: 400 }}>({r.pnl >= 0 ? "+" : ""}{r.pnlPct.toFixed(1)}%)</span>
                      </>
                    )}
                  </td>
                  <td className="text-right">
                    <button className="btn-action" onClick={() => deleteHolding(r.symbol)} title="ลบ">🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD HOLDING */}
      <div className="card">
        <div className="card-title">เพิ่ม / แก้ไข Portfolio (ใส่หุ้นเดิมเพื่อถัวเฉลี่ย)</div>
        <div className="input-row">
          <input className="inp" placeholder="Symbol (เช่น AAPL, BTC)" value={symbol} onChange={e => setSymbol(e.target.value)} />
          <input className="inp" type="number" placeholder="จำนวนหุ้น / เหรียญ" value={shares} onChange={e => setShares(e.target.value)} />
          <input className="inp" type="number" placeholder="ต้นทุนต่อหน่วย (USD)" value={cost} onChange={e => setCost(e.target.value)} />
          <select className="inp" value={exch} onChange={e => setExch(e.target.value)}>
            <option value="US">🇺🇸 US</option>
            <option value="CRYPTO">₿ Crypto</option>
          </select>
          <button className="btn btn-blue" onClick={addHolding}>+ เพิ่ม</button>
        </div>
      </div>
    </div>
  );
}

function BudgetTab({ txs }) {
  const months = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย."];
  const actuals = [0, 0, 0, 0, 0];
  const forecast = [0, 0, 0, 0, 0, 0];
  const spent = {};
  txs.filter(t => t.amount < 0 && t.date.startsWith(new Date().toISOString().slice(0, 7))).forEach(t => {
    spent[t.cat] = (spent[t.cat] || 0) + Math.abs(t.amount);
  });
  const fixCost = txs.filter(t => t.type === "fix" && t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);
  const varCost = txs.filter(t => t.type === "var" && t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);

  return (
    <div className="gap-16">
      <div className="grid-2">
        <div className="card metric-card" style={{ "--accent": "#a78bfa" }}>
          <div className="card-glow" />
          <div className="card-title">Fix Cost (คงที่)</div>
          <div className="metric-val">฿{fmt(fixCost)}</div>
          <div className="metric-sub">ค่าเช่า, Netflix, อินเทอร์เน็ต</div>
          <div className="metric-badge badge-blue">จ่ายทุกเดือน</div>
        </div>
        <div className="card metric-card" style={{ "--accent": "#ffbe3d" }}>
          <div className="card-glow" />
          <div className="card-title">Variable Cost (ผันแปร)</div>
          <div className="metric-val">฿{fmt(varCost)}</div>
          <div className="metric-sub">อาหาร, เดินทาง, ช้อปปิ้ง</div>
          <div className="metric-badge badge-gold">ขึ้นกับพฤติกรรม</div>
        </div>
      </div>

      {/* BUDGET PROGRESS */}
      <div className="card">
        <div className="section-title" style={{ marginBottom: 20 }}>งบประมาณแต่ละหมวด</div>
        {BUDGETS.map(b => {
          const cat = CATEGORIES[b.cat];
          const s   = spent[b.cat] || 0;
          const pct = Math.min((s / b.limit) * 100, 100);
          const over = s > b.limit;
          return (
            <div key={b.cat} className="budget-item">
              <div className="budget-header">
                <span className="budget-name">{cat.icon} {cat.label}</span>
                <span className="budget-amounts">฿{fmt(s)} / ฿{fmt(b.limit)}</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{
                  width: `${pct}%`,
                  background: over
                    ? "linear-gradient(90deg, var(--red2), var(--red))"
                    : pct > 80
                    ? "linear-gradient(90deg, var(--gold2), var(--gold))"
                    : "linear-gradient(90deg, var(--green2), var(--green))"
                }} />
              </div>
              {over && <div style={{ fontSize: 11, color: "var(--red)", marginTop: 5, fontFamily: "var(--font-mono)" }}>⚠️ เกินงบ ฿{fmt(s - b.limit)}</div>}
            </div>
          );
        })}
      </div>

      {/* FORECAST */}
      <div className="card">
        <div className="card-title">คาดการณ์รายจ่าย 6 เดือน (รอเก็บข้อมูล)</div>
        <div style={{ display: "flex", gap: 8, alignItems: "flex-end", height: 100 }}>
          {actuals.concat([forecast[forecast.length - 1]]).map((v, i) => {
            const max       = Math.max(...actuals, forecast[forecast.length - 1], 1);
            const isForecast = i === actuals.length;
            return (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <div style={{ fontSize: 9, color: "var(--text2)", fontFamily: "var(--font-mono)" }}>
                  {isForecast ? "~" : ""}{fmt(v / 1000, 0)}k
                </div>
                <div style={{
                  width: "100%", height: `${(v / max) * 80}px`, minHeight: 3,
                  background: isForecast ? "rgba(75,143,255,0.35)" : "linear-gradient(to top, var(--red2), var(--red))",
                  borderRadius: "5px 5px 0 0",
                  border: isForecast ? "1px dashed rgba(75,143,255,0.5)" : "none",
                }} />
                <div style={{ fontSize: 9, color: "var(--text3)", fontFamily: "var(--font-mono)" }}>{months[i]}</div>
              </div>
            );
          })}
        </div>
        <div className="divider" />
        <div className="row">
          <div style={{ width: 10, height: 10, borderRadius: 3, background: "var(--red)" }} />
          <span style={{ fontSize: 11, color: "var(--text2)", fontFamily: "var(--font-mono)" }}>รายจ่ายจริง</span>
          <div style={{ width: 10, height: 10, borderRadius: 3, background: "rgba(75,143,255,0.4)", border: "1px dashed rgba(75,143,255,0.6)" }} />
          <span style={{ fontSize: 11, color: "var(--text2)", fontFamily: "var(--font-mono)" }}>คาดการณ์ (ค่าเฉลี่ย)</span>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MAIN APP
// ============================================================
const TABS = [
  { id: "dashboard",    icon: "◼",  label: "Dashboard" },
  { id: "transactions", icon: "💳", label: "รายรับ-รายจ่าย" },
  { id: "sms",          icon: "📲", label: "MAKE / Dime Parser" },
  { id: "portfolio",    icon: "📈", label: "พอร์ตลงทุน" },
  { id: "budget",       icon: "🎯", label: "งบ & คาดการณ์" },
];

export default function App() {
  const [user, setUser] = useState(() => localStorage.getItem("tw_user") || null);
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState(false);

  const [activeTab, setActiveTab] = useState(() => localStorage.getItem("tw_tab") || "dashboard");
  const [txs, setTxs] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [exchangeRate, setExchangeRate] = useState(32.54);
  const [loading, setLoading] = useState(true);
  const [livePrices, setLivePrices] = useState({ ...MOCK_PRICES, ...MOCK_CRYPTO });
  const [isLoadingPrices, setIsLoadingPrices] = useState(true);

    useEffect(() => { localStorage.setItem("tw_tab", activeTab); }, [activeTab]);

  // 🔥 โค้ดที่หายไป: ระบบดึงข้อมูลจาก Firebase (รายรับรายจ่าย, พอร์ตหุ้น)
  useEffect(() => {
    if (!user) return;
    setLoading(true);
    const unsub = onSnapshot(doc(db, "users", user), (res) => {
      if (res.exists()) {
        const data = res.data();
        setTxs(data.txs || []);
        setPortfolio(data.portfolio || []);
        setExchangeRate(data.exchangeRate || 32.54);
      }
      setLoading(false); // <--- อันนี้แหละที่หายไป มันเลยโหลดไม่หยุด!
    });
    return () => unsub();
  }, [user]);

  // 🌐 โค้ดใหม่: ระบบดึงเรทเงิน USD -> THB อัตโนมัติแบบเรียลไทม์
  useEffect(() => {
    async function fetchLiveExchangeRate() {
      if (!user) return;
      try {
        const res = await fetch("https://open.er-api.com/v6/latest/USD");
        const data = await res.json();
        if (data && data.rates && data.rates.THB) {
          const liveRate = data.rates.THB;
          setExchangeRate(liveRate);
          setDoc(doc(db, "users", user), { exchangeRate: liveRate }, { merge: true });
        }
      } catch (err) {
        console.error("ดึงค่าเงินอัตโนมัติไม่สำเร็จ:", err);
      }
    }
    fetchLiveExchangeRate();
    const interval = setInterval(fetchLiveExchangeRate, 3600000);
    return () => clearInterval(interval);
  }, [user]);

  // 📈 โค้ดเดิม: ระบบดึงราคาหุ้นจาก Finnhub
  useEffect(() => {
    if (!user) return;
    const API_KEY = "d7sandpr01qorsvi1jagd7sandpr01qorsvi1jb0";
    const symbolsToFetch = ["VOO", "NVDA", "GOOG", "META", "TSLA", "MSFT"];
    Promise.all(symbolsToFetch.map(sym =>
      fetch(`https://finnhub.io/api/v1/quote?symbol=${sym}&token=${API_KEY}`)
        .then(r => r.json())
        .then(d => ({ symbol: sym, price: d.c || 0 }))
        .catch(() => ({ symbol: sym, price: 0 }))
    )).then(results => {
      const newLive = {};
      results.forEach(r => { if (r.price > 0) newLive[r.symbol] = r; });
      setLivePrices(prev => ({ ...prev, ...newLive }));
      setIsLoadingPrices(false);
    });
  }, [user, portfolio]);

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

  const handleSetExchangeRate = (val) => {
    setExchangeRate(val);
    if (user) setDoc(doc(db, "users", user), { exchangeRate: val }, { merge: true });
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

  // ─── LOGIN SCREEN ───────────────────────────────────────────
  if (!user) {
    return (
      <div className="login-wrapper">
        <style>{styles}</style>
        <div className="login-glow-1" />
        <div className="login-glow-2" />
        <div className="login-grid-overlay" />
        <div className="login-glass-card">
          <div className="login-logo-wrap">
            <div className="login-logo">Th</div>
            <div className="login-brand-text">
              <div className="login-brand-name">Threewit X Financial</div>
              <div className="login-brand-sub">FINANCE ENGINE v2</div>
            </div>
          </div>
          <div className="login-divider" />
          <div className="login-welcome">Welcome back</div>
          <p className="login-sub">Sign in to access your dashboard</p>
          <form onSubmit={handleLogin}>
            <input
              className="login-inp-styled"
              placeholder="Username"
              autoComplete="username"
              onChange={e => setUsernameInput(e.target.value)}
            />
            <input
              className="login-inp-styled"
              type="password"
              placeholder="Password"
              autoComplete="current-password"
              onChange={e => setPasswordInput(e.target.value)}
            />
            {loginError && (
              <p className="login-error">⚠ รหัสผ่านไม่ถูกต้อง</p>
            )}
            <button className="login-btn-styled" type="submit">Access System →</button>
          </form>
        </div>
      </div>
    );
  }

  // ─── MAIN APP ────────────────────────────────────────────────
  return (
    <>
      <style>{styles}</style>
      <div className="app">

        {/* TOP NAV */}
        <nav className="topnav">
          <div className="topnav-brand">
            <div className="topnav-logo">Th</div>
            <div>
              <div className="topnav-title">Threewit Kub 💸</div>
              <div className="topnav-sub">FINANCE ENGINE</div>
            </div>
          </div>
          <div className="topnav-right">
            <div className="topnav-sync">
              <div className="sync-dot" />
              Active
            </div>
            <button
              className="logout-btn"
              onClick={() => { localStorage.removeItem("tw_user"); setUser(null); }}
            >
              Log Out
            </button>
          </div>
        </nav>

        {/* TABS */}
        <div className="tabs">
          {TABS.map(t => (
            <button
              key={t.id}
              className={`tab ${activeTab === t.id ? "active" : ""}`}
              onClick={() => setActiveTab(t.id)}
            >
              <span className="tab-icon">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>

        {/* CONTENT */}
        <div className="main">
          {loading ? (
            <div className="loading-wrap">
              <div className="loading-spinner" />
              <div className="loading-text">Syncing with Firebase...</div>
            </div>
          ) : (
            <>
              {activeTab === "dashboard"    && <DashboardTab    txs={txs} portfolio={portfolio} livePrices={livePrices} isLoadingPrices={isLoadingPrices} exchangeRate={exchangeRate} />}
              {activeTab === "transactions" && <TransactionsTab txs={txs} setTxs={handleSetTxs} />}
              {activeTab === "sms"          && <SmsParserTab    setTxs={handleSetTxs} portfolio={portfolio} setPortfolio={handleSetPortfolio} exchangeRate={exchangeRate} />}
              {activeTab === "portfolio"    && <PortfolioTab    portfolio={portfolio} setPortfolio={handleSetPortfolio} livePrices={livePrices} isLoadingPrices={isLoadingPrices} exchangeRate={exchangeRate} setExchangeRate={handleSetExchangeRate} />}
              {activeTab === "budget"       && <BudgetTab       txs={txs} />}
            </>
          )}
        </div>

      </div>
    </>
  );
}


