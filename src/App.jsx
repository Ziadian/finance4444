import { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, onSnapshot, setDoc } from "firebase/firestore";
// ============================================================
// 🔥 FIREBASE CONFIG (เอาของคุณมาใส่ตรงนี้)
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
// 💎 PREMIUM UI/UX STYLES - COMPLETE REDESIGN
// ============================================================
const styles = `
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500;600;700&family=Noto+Sans+Thai:wght@300;400;500;600;700&display=swap');
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
:root {
  --bg-primary: #09090b;
  --bg-secondary: #18181b;
  --bg-tertiary: #27272a;
  --bg-card: rgba(24, 24, 27, 0.7);
  --border-subtle: rgba(255, 255, 255, 0.08);
  --border-focus: rgba(255, 255, 255, 0.15);
  --text-primary: #fafafa;
  --text-secondary: #a1a1aa;
  --text-tertiary: #71717a;
  --accent-primary: #22d3ee;
  --accent-secondary: #818cf8;
  --accent-success: #34d399;
  --accent-warning: #fbbf24;
  --accent-danger: #f87171;
  --accent-purple: #a78bfa;
  --gradient-primary: linear-gradient(135deg, #22d3ee 0%, #818cf8 50%, #a78bfa 100%);
  --gradient-success: linear-gradient(135deg, #34d399 0%, #22d3ee 50%);
  --gradient-danger: linear-gradient(135deg, #f87171 0%, #fbbf24 50%);
  --gradient-glow: radial-gradient(ellipse at center, rgba(34, 211, 238, 0.15) 0%, transparent 70%);
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.5);
  --shadow-glow: 0 0 40px rgba(34, 211, 238, 0.1);
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 20px;
  --radius-full: 9999px;
  --font-mono: 'IBM Plex Mono', monospace;
  --font-thai: 'Noto Sans Thai', sans-serif;
  --transition-fast: 150ms ease;
  --transition-normal: 250ms ease;
  --transition-slow: 400ms ease;
}
body {
  background: var(--bg-primary);
  color: var(--text-primary);
  font-family: var(--font-thai);
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: 
    radial-gradient(ellipse at top, rgba(34, 211, 238, 0.03) 0%, transparent 50%),
    radial-gradient(ellipse at bottom right, rgba(139, 92, 246, 0.03) 0%, transparent 50%);
}
/* =========================================
💎 PREMIUM LOGIN PAGE UI
========================================= */
.login-wrapper {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-primary);
  position: relative;
  overflow: hidden;
}
.login-glow-1,
.login-glow-2 {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.5;
  animation: float 15s ease-in-out infinite alternate;
  pointer-events: none;
}
.login-glow-1 {
  width: 800px;
  height: 800px;
  background: radial-gradient(circle, rgba(34, 211, 238, 0.2) 0%, transparent 70%);
  top: -300px;
  left: -200px;
  animation-delay: 0s;
}
.login-glow-2 {
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, transparent 70%);
  bottom: -200px;
  right: -100px;
  animation-delay: -5s;
}
@keyframes float {
  0% { transform: translateY(0) scale(1); opacity: 0.5; }
  50% { transform: translateY(-20px) scale(1.05); opacity: 0.7; }
  100% { transform: translateY(0) scale(1); opacity: 0.5; }
}
.login-glass-card {
  width: 100%;
  max-width: 420px;
  padding: 48px 40px;
  margin: 20px;
  background: var(--bg-card);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg), var(--shadow-glow);
  z-index: 10;
  text-align: center;
  position: relative;
  overflow: hidden;
}
.login-glass-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
}
.login-logo {
  width: 80px;
  height: 80px;
  margin: 0 auto 28px;
  background: var(--gradient-primary);
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-mono);
  font-size: 28px;
  font-weight: 700;
  color: #0f172a;
  box-shadow: 0 12px 40px rgba(34, 211, 238, 0.4);
  position: relative;
  animation: pulse-glow 3s ease-in-out infinite;
}
@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 12px 40px rgba(34, 211, 238, 0.4); }
  50% { box-shadow: 0 12px 60px rgba(139, 92, 246, 0.6); }
}
.login-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 8px;
  letter-spacing: -0.02em;
}
.login-subtitle {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 36px;
  font-family: var(--font-mono);
}
.login-inp-styled {
  width: 100%;
  padding: 14px 18px;
  margin-bottom: 14px;
  border-radius: var(--radius-md);
  background: rgba(39, 39, 42, 0.6);
  border: 1px solid var(--border-subtle);
  color: var(--text-primary);
  font-family: var(--font-mono);
  font-size: 14px;
  outline: none;
  transition: all var(--transition-fast);
}
.login-inp-styled::placeholder { color: var(--text-tertiary); }
.login-inp-styled:focus {
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px rgba(34, 211, 238, 0.15);
  background: rgba(39, 39, 42, 0.8);
}
.login-btn-styled {
  width: 100%;
  padding: 16px 24px;
  margin-top: 12px;
  border-radius: var(--radius-md);
  border: none;
  background: var(--gradient-primary);
  color: #0f172a;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-normal);
  font-family: var(--font-thai);
  box-shadow: 0 8px 25px rgba(34, 211, 238, 0.3);
  position: relative;
  overflow: hidden;
}
.login-btn-styled::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
  transition: left 0.5s ease;
}
.login-btn-styled:hover::before { left: 100%; }
.login-btn-styled:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 35px rgba(34, 211, 238, 0.45);
}
.login-btn-styled:active { transform: translateY(0); }
.login-error {
  color: var(--accent-danger);
  font-size: 13px;
  margin-top: -6px;
  margin-bottom: 16px;
  font-family: var(--font-mono);
  animation: shake 0.4s ease;
}
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  75% { transform: translateX(4px); }
}
/* =========================================
🧭 TOP NAVIGATION - PREMIUM
========================================= */
.topnav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 28px;
  background: rgba(24, 24, 27, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border-subtle);
  position: sticky;
  top: 0;
  z-index: 100;
  transition: all var(--transition-normal);
}
.topnav-brand {
  display: flex;
  align-items: center;
  gap: 14px;
}
.topnav-logo {
  width: 40px;
  height: 40px;
  background: var(--gradient-primary);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-mono);
  font-weight: 700;
  font-size: 16px;
  color: #0f172a;
  box-shadow: 0 6px 20px rgba(34, 211, 238, 0.3);
  flex-shrink: 0;
}
.topnav-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.01em;
}
.topnav-sub {
  font-size: 11px;
  color: var(--text-tertiary);
  font-family: var(--font-mono);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.topnav-sync {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--text-secondary);
  font-family: var(--font-mono);
  padding: 6px 12px;
  background: rgba(52, 211, 153, 0.1);
  border: 1px solid rgba(52, 211, 153, 0.2);
  border-radius: var(--radius-full);
}
.sync-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent-success);
  animation: pulse 2s infinite;
  box-shadow: 0 0 10px var(--accent-success);
}
@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(0.9); }
}
.logout-btn {
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--border-subtle);
  padding: 8px 16px;
  border-radius: var(--radius-md);
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  font-family: var(--font-mono);
  transition: all var(--transition-fast);
}
.logout-btn:hover {
  background: rgba(248, 113, 113, 0.1);
  border-color: var(--accent-danger);
  color: var(--accent-danger);
}
/* =========================================
📱 TABS - MOBILE-FIRST NAVIGATION
========================================= */
.tabs {
  display: flex;
  gap: 6px;
  padding: 12px 20px;
  background: rgba(24, 24, 27, 0.9);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--border-subtle);
  overflow-x: auto;
  scrollbar-width: none;
  position: sticky;
  top: 65px;
  z-index: 99;
}
.tabs::-webkit-scrollbar { display: none; }
.tab {
  padding: 10px 18px;
  border-radius: var(--radius-full);
  border: 1px solid transparent;
  background: transparent;
  color: var(--text-secondary);
  font-size: 13px;
  font-family: var(--font-thai);
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  transition: all var(--transition-fast);
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
}
.tab::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: var(--radius-full);
  background: var(--gradient-primary);
  opacity: 0;
  transition: opacity var(--transition-fast);
  z-index: -1;
}
.tab:hover {
  color: var(--text-primary);
  background: var(--bg-tertiary);
}
.tab:hover::before { opacity: 0.1; }
.tab.active {
  background: var(--gradient-primary);
  color: #0f172a;
  font-weight: 600;
  box-shadow: 0 4px 15px rgba(34, 211, 238, 0.3);
}
.tab.active::before { opacity: 0.2; }
.tab-icon { font-size: 16px; }
/* =========================================
📐 MAIN LAYOUT & GRID SYSTEM
========================================= */
.main {
  flex: 1;
  padding: 24px 28px;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}
.grid-2 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}
.grid-3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
.grid-4 {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}
/* =========================================
🃏 PREMIUM CARD COMPONENT
========================================= */
.card {
  background: var(--bg-card);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  padding: 24px;
  transition: all var(--transition-normal);
  position: relative;
  overflow: hidden;
}
.card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
}
.card:hover {
  border-color: var(--border-focus);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}
.card-title {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-tertiary);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin-bottom: 16px;
  font-family: var(--font-mono);
  display: flex;
  align-items: center;
  gap: 8px;
}
.card-title::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--border-subtle);
  margin-left: 12px;
}
/* =========================================
📊 METRIC CARDS - PREMIUM
========================================= */
.metric-card {
  position: relative;
  overflow: hidden;
}
.metric-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--accent, var(--gradient-primary));
  opacity: 0.8;
}
.metric-card::after {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--gradient-glow);
  opacity: 0;
  transition: opacity var(--transition-normal);
  pointer-events: none;
}
.metric-card:hover::after { opacity: 1; }
.metric-val {
  font-size: 28px;
  font-weight: 700;
  font-family: var(--font-mono);
  color: var(--text-primary);
  letter-spacing: -0.02em;
  margin: 4px 0;
}
.metric-sub {
  font-size: 12px;
  color: var(--text-secondary);
  margin-top: 6px;
}
.metric-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 12px;
  border-radius: var(--radius-full);
  font-size: 11px;
  font-family: var(--font-mono);
  font-weight: 500;
  margin-top: 10px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-subtle);
}
.badge-green { background: rgba(52, 211, 153, 0.12); color: var(--accent-success); border-color: rgba(52, 211, 153, 0.3); }
.badge-red { background: rgba(248, 113, 113, 0.12); color: var(--accent-danger); border-color: rgba(248, 113, 113, 0.3); }
.badge-gold { background: rgba(251, 191, 36, 0.12); color: var(--accent-warning); border-color: rgba(251, 191, 36, 0.3); }
.badge-blue { background: rgba(34, 211, 238, 0.12); color: var(--accent-primary); border-color: rgba(34, 211, 238, 0.3); }
/* =========================================
📋 DATA TABLES - MOBILE OPTIMIZED
========================================= */
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;
}
.section-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}
.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}
.data-table-wrapper {
  overflow-x: auto;
  margin: 0 -24px;
  padding: 0 24px;
  -webkit-overflow-scrolling: touch;
}
.data-table-wrapper::-webkit-scrollbar {
  height: 4px;
}
.data-table-wrapper::-webkit-scrollbar-track {
  background: var(--bg-tertiary);
  border-radius: 2px;
}
.data-table-wrapper::-webkit-scrollbar-thumb {
  background: var(--border-focus);
  border-radius: 2px;
}
.data-table th {
  font-size: 10px;
  color: var(--text-tertiary);
  font-family: var(--font-mono);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 14px 16px;
  text-align: left;
  border-bottom: 1px solid var(--border-subtle);
  font-weight: 600;
  white-space: nowrap;
}
.data-table td {
  padding: 14px 16px;
  border-bottom: 1px solid var(--border-subtle);
  font-size: 13px;
  vertical-align: middle;
}
.data-table tr:last-child td { border-bottom: none; }
.data-table tr {
  transition: background var(--transition-fast);
}
.data-table tr:hover td {
  background: rgba(255, 255, 255, 0.03);
}
/* =========================================
💳 TRANSACTION ITEMS
========================================= */
.tx-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 0;
  border-bottom: 1px solid var(--border-subtle);
  transition: all var(--transition-fast);
}
.tx-item:last-child { border-bottom: none; }
.tx-item:hover {
  padding-left: 4px;
  padding-right: 4px;
  margin: 0 -4px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: var(--radius-md);
}
.tx-icon {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-subtle);
  transition: transform var(--transition-fast);
}
.tx-item:hover .tx-icon {
  transform: scale(1.05);
}
.tx-info {
  flex: 1;
  min-width: 0;
}
.tx-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.tx-meta {
  font-size: 11px;
  color: var(--text-tertiary);
  margin-top: 3px;
  font-family: var(--font-mono);
  display: flex;
  align-items: center;
  gap: 6px;
}
.tx-amount {
  font-family: var(--font-mono);
  font-size: 15px;
  font-weight: 600;
  text-align: right;
  flex-shrink: 0;
  min-width: 90px;
}
/* =========================================
📈 BUDGET & PROGRESS
========================================= */
.progress-bar {
  height: 8px;
  background: var(--bg-tertiary);
  border-radius: var(--radius-full);
  overflow: hidden;
  margin-top: 10px;
  position: relative;
}
.progress-fill {
  height: 100%;
  border-radius: var(--radius-full);
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}
.progress-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  animation: shimmer 2s infinite;
}
@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
.budget-item { margin-bottom: 22px; }
.budget-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
.budget-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
}
.budget-amounts {
  font-size: 12px;
  font-family: var(--font-mono);
  color: var(--text-secondary);
}
/* =========================================
🥧 DONUT CHART & LEGEND
========================================= */
.donut-wrap {
  display: flex;
  align-items: center;
  gap: 28px;
  flex-wrap: wrap;
}
.donut-legend {
  flex: 1;
  min-width: 180px;
}
.legend-item {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
  padding: 6px 0;
  transition: transform var(--transition-fast);
}
.legend-item:hover { transform: translateX(4px); }
.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 3px;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}
.legend-label {
  font-size: 13px;
  color: var(--text-secondary);
  flex: 1;
}
.legend-val {
  font-size: 13px;
  font-family: var(--font-mono);
  color: var(--text-primary);
  font-weight: 500;
}
/* =========================================
📝 FORMS & INPUTS - PREMIUM
========================================= */
.input-row {
  display: flex;
  gap: 12px;
  margin-bottom: 14px;
  flex-wrap: wrap;
}
.inp {
  flex: 1;
  min-width: 140px;
  padding: 12px 16px;
  background: rgba(39, 39, 42, 0.6);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-size: 14px;
  font-family: var(--font-thai);
  outline: none;
  transition: all var(--transition-fast);
}
.inp::placeholder { color: var(--text-tertiary); }
.inp:focus {
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px rgba(34, 211, 238, 0.15);
  background: rgba(39, 39, 42, 0.8);
}
.inp[type="number"]::-webkit-inner-spin-button,
.inp[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
select.inp {
  appearance: none;
  background-image: url("image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23a1a1aa' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px;
  padding-right: 36px;
}
.btn {
  padding: 12px 24px;
  border-radius: var(--radius-md);
  border: none;
  font-size: 14px;
  font-family: var(--font-thai);
  cursor: pointer;
  font-weight: 600;
  transition: all var(--transition-fast);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  position: relative;
  overflow: hidden;
}
.btn::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
  opacity: 0;
  transition: opacity var(--transition-fast);
}
.btn:hover::after { opacity: 1; }
.btn:active { transform: translateY(1px); }
.btn-green {
  background: var(--gradient-success);
  color: #0f172a;
  box-shadow: 0 4px 15px rgba(52, 211, 153, 0.3);
}
.btn-green:hover {
  box-shadow: 0 8px 25px rgba(52, 211, 153, 0.45);
  transform: translateY(-2px);
}
.btn-blue {
  background: var(--gradient-primary);
  color: #0f172a;
  box-shadow: 0 4px 15px rgba(34, 211, 238, 0.3);
}
.btn-blue:hover {
  box-shadow: 0 8px 25px rgba(34, 211, 238, 0.45);
  transform: translateY(-2px);
}
.btn-ghost {
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--border-subtle);
}
.btn-ghost:hover {
  background: var(--bg-tertiary);
  color: var(--text-primary);
  border-color: var(--border-focus);
}
.btn-red {
  background: var(--gradient-danger);
  color: #0f172a;
}
.btn-action {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 6px 8px;
  font-size: 15px;
  opacity: 0.6;
  transition: all var(--transition-fast);
  border-radius: var(--radius-sm);
}
.btn-action:hover {
  opacity: 1;
  background: var(--bg-tertiary);
  transform: scale(1.1);
}
/* =========================================
📱 SMS PARSER STYLES
========================================= */
.sms-box {
  width: 100%;
  min-height: 120px;
  padding: 16px;
  background: rgba(39, 39, 42, 0.6);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  color: var(--text-primary) !important;
  font-size: 13px;
  font-family: var(--font-mono);
  resize: vertical;
  outline: none;
  transition: all var(--transition-fast);
  line-height: 1.6;
}
.sms-box::placeholder { color: var(--text-tertiary); }
.sms-box:focus {
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px rgba(34, 211, 238, 0.15);
  background: rgba(39, 39, 42, 0.8);
}
.parse-result {
  margin-top: 16px;
  padding: 18px;
  background: rgba(52, 211, 153, 0.06);
  border: 1px solid rgba(52, 211, 153, 0.25);
  border-radius: var(--radius-md);
  animation: slideIn 0.3s ease;
}
@keyframes slideIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.parse-row {
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
  font-size: 13px;
  border-bottom: 1px dashed var(--border-subtle);
}
.parse-row:last-child { border-bottom: none; }
.parse-key {
  color: var(--text-tertiary);
  font-family: var(--font-mono);
}
.parse-val {
  color: var(--text-primary);
  font-weight: 600;
  font-family: var(--font-mono);
}
/* =========================================
📊 TICKER & PORTFOLIO CARDS
========================================= */
.ticker-card {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 14px;
  background: rgba(39, 39, 42, 0.4);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-subtle);
  transition: all var(--transition-fast);
}
.ticker-card:hover {
  border-color: var(--border-focus);
  transform: translateY(-2px);
}
.ticker-sym {
  font-size: 17px;
  font-weight: 700;
  font-family: var(--font-mono);
  color: var(--text-primary);
}
.ticker-name {
  font-size: 11px;
  color: var(--text-tertiary);
}
.ticker-price {
  font-size: 24px;
  font-weight: 700;
  font-family: var(--font-mono);
  margin-top: 4px;
  letter-spacing: -0.02em;
}
.ticker-change {
  font-size: 12px;
  font-family: var(--font-mono);
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
}
.up { color: var(--accent-success); }
.dn { color: var(--accent-danger); }
/* =========================================
📈 FORECAST BARS
========================================= */
.forecast-bar-wrap {
  display: flex;
  gap: 10px;
  align-items: flex-end;
  height: 100px;
  padding: 10px 0;
}
.forecast-bar {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}
.forecast-bar-fill {
  width: 100%;
  border-radius: 6px 6px 0 0;
  transition: height 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  min-height: 4px;
}
.forecast-bar-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: rgba(255,255,255,0.3);
  border-radius: 2px 2px 0 0;
}
.forecast-label {
  font-size: 10px;
  color: var(--text-tertiary);
  font-family: var(--font-mono);
}
/* =========================================
🏷️ TAGS & BADGES
========================================= */
.tag {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  border-radius: var(--radius-full);
  font-size: 10px;
  font-family: var(--font-mono);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  border: 1px solid transparent;
}
.tag-income {
  background: rgba(52, 211, 153, 0.12);
  color: var(--accent-success);
  border-color: rgba(52, 211, 153, 0.3);
}
.tag-expense {
  background: rgba(248, 113, 113, 0.12);
  color: var(--accent-danger);
  border-color: rgba(248, 113, 113, 0.3);
}
.tag-invest {
  background: rgba(34, 211, 238, 0.12);
  color: var(--accent-primary);
  border-color: rgba(34, 211, 238, 0.3);
}
.tag-fix {
  background: rgba(167, 139, 250, 0.12);
  color: var(--accent-purple);
  border-color: rgba(167, 139, 250, 0.3);
}
.tag-var {
  background: rgba(251, 191, 36, 0.12);
  color: var(--accent-warning);
  border-color: rgba(251, 191, 36, 0.3);
}
.tag-blue {
  background: rgba(34, 211, 238, 0.12);
  color: var(--accent-primary);
  border-color: rgba(34, 211, 238, 0.3);
}
.tag-gold {
  background: rgba(251, 191, 36, 0.12);
  color: var(--accent-warning);
  border-color: rgba(251, 191, 36, 0.3);
}
/* =========================================
🔧 UTILITY CLASSES
========================================= */
.gap-16 { display: flex; flex-direction: column; gap: 20px; }
.gap-20 { display: flex; flex-direction: column; gap: 24px; }
.mt-16 { margin-top: 16px; }
.mt-12 { margin-top: 12px; }
.mt-8 { margin-top: 8px; }
.row { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.text-right { text-align: right; }
.text-mono { font-family: var(--font-mono); }
.text-xs { font-size: 11px; }
.text-muted { color: var(--text-tertiary); }
.divider {
  height: 1px;
  background: var(--border-subtle);
  margin: 20px 0;
  position: relative;
}
.divider::after {
  content: '';
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 1px;
  background: var(--gradient-primary);
  opacity: 0.5;
}
/* =========================================
🚨 ALERTS
========================================= */
.alert {
  padding: 14px 18px;
  border-radius: var(--radius-md);
  margin-bottom: 16px;
  font-size: 13px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  border: 1px solid;
  animation: slideIn 0.3s ease;
}
.alert-warning {
  background: rgba(251, 191, 36, 0.08);
  border-color: rgba(251, 191, 36, 0.3);
  color: var(--accent-warning);
}
.alert-info {
  background: rgba(34, 211, 238, 0.08);
  border-color: rgba(34, 211, 238, 0.3);
  color: var(--accent-primary);
}
/* =========================================
💱 EXCHANGE INPUT
========================================= */
.exchange-input {
  background: transparent;
  border: none;
  border-bottom: 2px dashed var(--border-subtle);
  color: var(--text-primary);
  font-size: 28px;
  font-weight: 700;
  font-family: var(--font-mono);
  width: 110px;
  outline: none;
  text-align: left;
  transition: all var(--transition-fast);
  padding: 4px 0;
}
.exchange-input::placeholder { color: var(--text-tertiary); }
.exchange-input:focus {
  border-bottom-color: var(--accent-primary);
  color: var(--accent-primary);
  box-shadow: none;
}
.exchange-input::-webkit-outer-spin-button,
.exchange-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
/* =========================================
🎨 SCROLLBAR STYLING
========================================= */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: var(--bg-secondary);
  border-radius: 3px;
}
::-webkit-scrollbar-thumb {
  background: var(--border-focus);
  border-radius: 3px;
  transition: background var(--transition-fast);
}
::-webkit-scrollbar-thumb:hover {
  background: var(--accent-primary);
}
/* =========================================
📱 RESPONSIVE BREAKPOINTS
========================================= */
@media (max-width: 1024px) {
  .grid-4 { grid-template-columns: repeat(2, 1fr); }
  .grid-3 { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 768px) {
  .topnav {
    padding: 12px 16px;
    flex-wrap: wrap;
    gap: 12px;
  }
  .topnav-brand { gap: 10px; }
  .topnav-logo { width: 36px; height: 36px; font-size: 14px; }
  .topnav-title { font-size: 15px; }
  .tabs {
    top: 60px;
    padding: 8px 12px;
    gap: 4px;
  }
  .tab {
    padding: 8px 14px;
    font-size: 12px;
  }
  .tab-icon { font-size: 14px; }
  .main {
    padding: 16px 20px;
  }
  .card {
    padding: 20px;
    border-radius: var(--radius-md);
  }
  .grid-2, .grid-3, .grid-4 {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  .metric-val { font-size: 24px; }
  .donut-wrap {
    justify-content: center;
    text-align: center;
  }
  .donut-legend {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px 16px;
  }
  .input-row {
    flex-direction: column;
  }
  .input-row .inp {
    min-width: 100%;
  }
  .data-table-wrapper {
    margin: 0 -20px;
    padding: 0 20px;
  }
  .data-table th,
  .data-table td {
    padding: 12px 10px;
    font-size: 12px;
  }
  .tx-item {
    padding: 12px 0;
  }
  .tx-icon {
    width: 40px;
    height: 40px;
    font-size: 16px;
  }
  .tx-name { font-size: 13px; }
  .tx-amount {
    font-size: 14px;
    min-width: 75px;
  }
  .ticker-price { font-size: 20px; }
  .btn {
    padding: 11px 20px;
    font-size: 13px;
    width: 100%;
  }
  .btn-action {
    padding: 8px;
    font-size: 14px;
  }
}
@media (max-width: 480px) {
  .login-glass-card {
    padding: 36px 24px;
    margin: 16px;
  }
  .login-logo {
    width: 70px;
    height: 70px;
    font-size: 24px;
  }
  .login-title { font-size: 22px; }
  .tabs {
    position: fixed;
    bottom: 0;
    top: auto;
    left: 0;
    right: 0;
    background: rgba(24, 24, 27, 0.95);
    border-top: 1px solid var(--border-subtle);
    border-bottom: none;
    padding: 8px 12px 12px;
    justify-content: space-around;
  }
  .tab {
    flex: 1;
    justify-content: center;
    padding: 10px 8px;
    font-size: 11px;
    border-radius: var(--radius-md);
  }
  .tab-icon { font-size: 18px; margin-bottom: 2px; }
  .main {
    padding: 16px;
    padding-bottom: 80px;
  }
  .card {
    padding: 18px;
  }
  .metric-val { font-size: 22px; }
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  .section-title { font-size: 15px; }
  .donut-legend {
    grid-template-columns: 1fr;
  }
  .forecast-bar-wrap {
    height: 80px;
    gap: 6px;
  }
  .forecast-label { font-size: 9px; }
  .parse-row {
    flex-direction: column;
    gap: 4px;
    align-items: flex-start;
  }
}
/* =========================================
✨ MICRO-ANIMATIONS & HOVER EFFECTS
========================================= */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
.card { animation: fadeIn 0.4s ease forwards; }
.card:nth-child(1) { animation-delay: 0.05s; }
.card:nth-child(2) { animation-delay: 0.1s; }
.card:nth-child(3) { animation-delay: 0.15s; }
.card:nth-child(4) { animation-delay: 0.2s; }
.metric-card:hover .metric-val {
  transition: transform var(--transition-fast);
}
.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}
.loading-skeleton {
  background: linear-gradient(90deg, var(--bg-tertiary) 25%, var(--bg-secondary) 50%, var(--bg-tertiary) 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: var(--radius-sm);
}
@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
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
food: { label: "อาหาร", icon: "🍜", color: "#f0b429" },
transport: { label: "เดินทาง", icon: "🚗", color: "#3d8bff" },
shopping: { label: "ช้อปปิ้ง", icon: "🛍️", color: "#9f7aea" },
bills: { label: "ค่าบิล", icon: "📄", color: "#ff4d6a" },
health: { label: "สุขภาพ", icon: "💊", color: "#00d68f" },
invest: { label: "ลงทุน", icon: "📈", color: "#3d8bff" },
income: { label: "รายรับ", icon: "💰", color: "#00d68f" },
other: { label: "อื่นๆ", icon: "💸", color: "#8892a4" },
};
// ⚠️ เคลียร์พอร์ตให้ว่างเปล่า 100% สำหรับการเริ่มต้นใหม่
const INITIAL_TXS = [];
const INITIAL_PORTFOLIO = [];
const BUDGETS = [
{ cat: "food", limit: 5000 },
{ cat: "transport", limit: 2000 },
{ cat: "shopping", limit: 3000 },
{ cat: "bills", limit: 12000 },
{ cat: "health", limit: 1500 },
];
function parseMakeSMS(sms) {
const text = sms.trim();
const result = { valid: false };
const investMatch = text.match(/ซื้อ|ซื้อหุ้น|buy|ลงทุน|invest/i);
const incomeMatch = text.match(/รับโอน|รับชำระ|เงินเข้า|โอนเงินเข้า|โอนเข้า|deposit|received/i);
const amtMatch = text.match(/(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)\s*(?:บาท|THB|฿)/i) || text.match(/(?:จำนวน|Amount)[:\s]*(\d[\d,\.]+)/i) || text.match(/(\d{1,3}(?:,\d{3})*\.\d{2})/);
const dateMatch = text.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/);
const refMatch = text.match(/(?:ที่|จาก|ไปยัง|to|from|Ref)[:\s]*([^
]+)/i);
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
function fmt(n, dec = 0) { return (n||0).toLocaleString("th-TH", { minimumFractionDigits: dec, maximumFractionDigits: dec }); }
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
return <svg width={size} height={size} style={{ flexShrink: 0 }}>{arcs.map((a, i) => <path key={i} d={slice(a.start, a.pct)} fill={a.color} opacity={0.9} />)}</svg>;
}
function MiniBarChart({ values, color = "#3d8bff", height = 50 }) {
const max = Math.max(...values, 1);
return (
<div style={{ display: "flex", alignItems: "flex-end", gap: 4, height }}>
{values.map((v, i) => <div key={i} style={{ flex: 1, height: `${(v / max) * 100}%`, background: color, borderRadius: "4px 4px 0 0", opacity: i === values.length - 1 ? 1 : 0.5, minHeight: 3, transition: "all 0.3s ease" }} />)}
</div>
);
}
// ============================================================
// TABS CONTENT
// ============================================================
function DashboardTab({ txs, portfolio, livePrices, isLoadingPrices, exchangeRate }) {
const thisMonth = txs.filter(t => t.date.startsWith(new Date().toISOString().slice(0, 7)));
const income = thisMonth.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);
const expense = thisMonth.filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);
const saving = income - expense;
const savingRate = income > 0 ? (saving / income) * 100 : 0;
const portValue = portfolio.reduce((s, p) => { const px = livePrices[p.symbol]?.price || p.avgCost; return s + px * p.shares; }, 0);
const portCost = portfolio.reduce((s, p) => s + p.avgCost * p.shares, 0);
const portPnL = portValue - portCost;
const bankBalance = txs.reduce((sum, t) => sum + t.amount, 0);
const debt = 0;
// ใช้ค่าเงินบาทแบบ Dynamic จาก Firebase
const portValueTHB = portValue * exchangeRate;
const netWorth = bankBalance + portValueTHB - debt;
const allocData = [ { label: "เงินฝาก", value: Math.max(bankBalance, 0), color: "#3d8bff" }, { label: "หุ้น US", value: portValueTHB, color: "#00d68f" }, { label: "หนี้สิน", value: debt, color: "#ff4d6a" } ].filter(d => d.value > 0);
const monthlyExpenses = [0, 0, 0, 0, expense];
return (
<div className="gap-16">
{savingRate < 20 && income > 0 && <div className="alert alert-warning">⚠️ อัตราการออมเดือนนี้ {savingRate.toFixed(1)}% — ต่ำกว่าเป้าหมาย 20%</div>}
<div className="grid-4">
{[
{ label: "Net Worth", val: isLoadingPrices ? "กำลังโหลด..." : `฿${fmt(netWorth)}`, sub: "ทรัพย์สินสุทธิ", badge: "Live", btype: "badge-green", accent: "var(--gradient-success)" },
{ label: "รายรับเดือนนี้", val: `฿${fmt(income)}`, sub: "Current Month", badge: "=", btype: "badge-blue", accent: "var(--gradient-primary)" },
{ label: "รายจ่ายเดือนนี้", val: `฿${fmt(expense)}`, sub: `${((expense / (income || 1)) * 100).toFixed(0)}% ของรายรับ`, badge: expense > 30000 ? "เกินงบ" : "ในงบ", btype: expense > 30000 ? "badge-red" : "badge-green", accent: expense > 30000 ? "var(--gradient-danger)" : "var(--gradient-success)" },
{ label: "มูลค่าพอร์ต (THB)", val: isLoadingPrices ? "กำลังโหลด..." : `฿${fmt(portValueTHB)}`, sub: isLoadingPrices ? "" : `P&L: ${portPnL >= 0 ? "+" : ""}$${fmt(portPnL, 2)}`, badge: isLoadingPrices ? "..." : `${portPnL >= 0 ? "+" : ""}${((portPnL / (portCost || 1)) * 100).toFixed(1)}%`, btype: portPnL >= 0 ? "badge-green" : "badge-red", accent: "var(--gradient-primary)" },
].map((m, i) => (
<div key={i} className="card metric-card" style={{ "--accent": m.accent }}>
<div className="card-title">{m.label}</div>
<div className="metric-val" style={{ fontSize: isLoadingPrices && (i===0 || i===3) ? "18px" : "28px", transition: "all 0.2s ease" }}>{m.val}</div>
<div className="metric-sub">{m.sub}</div>
<div className={`metric-badge ${m.btype}`}>{m.badge}</div>
</div>
))}
</div>
<div className="grid-2">
<div className="card">
<div className="card-title">การจัดสรรสินทรัพย์ {isLoadingPrices && "..."}</div>
<div className="donut-wrap"><DonutChart data={allocData} size={150} />
<div className="donut-legend">{allocData.map((d, i) => (<div key={i} className="legend-item"><div className="legend-dot" style={{ background: d.color }} /><span className="legend-label">{d.label}</span><span className="legend-val">฿{fmt(d.value)}</span></div>))}</div>
</div>
</div>
<div className="card">
<div className="card-title">รายจ่าย 5 เดือน (ล้างประวัติใหม่)</div>
<MiniBarChart values={monthlyExpenses} color="var(--accent-danger)" height={90} />
<div style={{ display: "flex", gap: 4, marginTop: 8 }}>{["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค."].map((m, i) => <div key={i} style={{ flex: 1, textAlign: "center", fontSize: 10, color: "var(--text-tertiary)", fontFamily: "var(--font-mono)" }}>{m}</div>)}</div>
<div className="divider" />
<div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}><span style={{ color: "var(--text-secondary)" }}>ออมเดือนนี้</span><span style={{ color: "var(--accent-success)", fontFamily: "var(--font-mono)", fontWeight: 600 }}>฿{fmt(saving)}</span></div>
</div>
</div>
<div className="card">
<div className="card-title">ภาพรวมการเงินทั้งหมด</div>
<div className="data-table-wrapper">
<table className="data-table">
<thead><tr><th>บัญชี / สินทรัพย์</th><th>ประเภท</th><th className="text-right">มูลค่า (บาท)</th><th className="text-right">% ของ Net Worth</th></tr></thead>
<tbody>
<tr><td>MAKE by KBank ออมทรัพย์</td><td><span className="tag tag-income">เงินฝาก</span></td><td className="text-right text-mono">฿{fmt(bankBalance)}</td><td className="text-right text-mono">{netWorth > 0 ? ((bankBalance / netWorth) * 100).toFixed(1) : 0}%</td></tr>
<tr><td>พอร์ต US Stocks (DIME)</td><td><span className="tag tag-invest">หุ้น US</span></td><td className="text-right text-mono">{isLoadingPrices ? "กำลังโหลด..." : `฿${fmt(portValueTHB)}`}</td><td className="text-right text-mono">{netWorth > 0 ? ((portValueTHB / netWorth) * 100).toFixed(1) : 0}%</td></tr>
<tr style={{ borderTop: "2px solid var(--border-focus)" }}><td style={{ fontWeight: 700 }}>Net Worth รวม</td><td></td><td className="text-right text-mono" style={{ color: "var(--accent-success)", fontWeight: 700 }}>{isLoadingPrices ? "กำลังโหลด..." : `฿${fmt(netWorth)}`}</td><td className="text-right text-mono" style={{ color: "var(--accent-success)", fontWeight: 700 }}>100%</td></tr>
</tbody>
</table>
</div>
</div>
<div className="card">
<div className="section-header"><span className="section-title">รายการล่าสุด</span></div>
{txs.length === 0 && <div style={{ fontSize: 14, color: "var(--text-secondary)", textAlign: "center", padding: "28px 0" }}>ยังไม่มีรายการทางการเงินในระบบ</div>}
{txs.slice(0, 5).map(tx => {
const cat = CATEGORIES[tx.cat] || CATEGORIES.other;
return (
<div key={tx.id} className="tx-item">
<div className="tx-icon" style={{ background: cat.color + "22", color: cat.color }}>{cat.icon}</div>
<div className="tx-info"><div className="tx-name">{tx.desc}</div><div className="tx-meta">{tx.date} · {cat.label} · <span className={tx.type === "fix" ? "tag tag-fix" : "tag tag-var"}>{tx.type === "fix" ? "Fix" : "Var"}</span></div></div>
<div className="tx-amount" style={{ color: tx.amount > 0 ? "var(--accent-success)" : "var(--text-primary)" }}>{tx.amount > 0 ? "+" : ""}฿{fmt(Math.abs(tx.amount))}</div>
</div>
);
})}
</div>
</div>
);
}
function TransactionsTab({ txs, setTxs }) {
const [desc, setDesc] = useState(""); const [amount, setAmount] = useState("");
const [cat, setCat] = useState("food"); const [type, setType] = useState("var"); const [filter, setFilter] = useState("all");
// 🟢 เพิ่ม State สำหรับเลือกว่าเป็น รับ หรือ จ่าย และ ID ของรายการที่กำลังแก้
const [txSign, setTxSign] = useState("-");
const [editId, setEditId] = useState(null);
function saveTx() {
if (!desc || !amount) return;
// 🟢 แปลงตัวเลขให้ติดลบอัตโนมัติถ้าเลือก "จ่าย (-)"
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
setAmount(Math.abs(tx.amount).toString()); // 🟢 ดึงเฉพาะตัวเลขมาโชว์ ไม่มีติดลบ
setTxSign(tx.amount >= 0 ? "+" : "-");     // 🟢 เลือก Dropdown ตามของเดิม
setCat(tx.cat);
setType(tx.type);
setEditId(tx.id);
window.scrollTo({ top: 0, behavior: 'smooth' }); // เลื่อนจอขึ้นไปให้เห็นฟอร์มแก้
}
function deleteTx(id) {
if(window.confirm("ต้องการลบรายการนี้ใช่หรือไม่?")) {
setTxs(prev => prev.filter(t => t.id !== id));
}
}
const filtered = filter === "all" ? txs : filter === "income" ? txs.filter(t => t.amount > 0) : txs.filter(t => t.amount < 0);
const totalIn = txs.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0); const totalOut = txs.filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);
return (
<div className="gap-16">
<div className="grid-3">
<div className="card metric-card" style={{ "--accent": "var(--gradient-success)" }}><div className="card-title">รายรับรวม</div><div className="metric-val">฿{fmt(totalIn)}</div><div className="metric-badge badge-green">+รายรับ</div></div>
<div className="card metric-card" style={{ "--accent": "var(--gradient-danger)" }}><div className="card-title">รายจ่ายรวม</div><div className="metric-val">฿{fmt(totalOut)}</div><div className="metric-badge badge-red">-รายจ่าย</div></div>
<div className="card metric-card" style={{ "--accent": "var(--gradient-primary)" }}><div className="card-title">คงเหลือสุทธิ</div><div className="metric-val" style={{ color: totalIn - totalOut > 0 ? "var(--accent-success)" : "var(--accent-danger)" }}>฿{fmt(totalIn - totalOut)}</div><div className={`metric-badge ${totalIn - totalOut > 0 ? "badge-green" : "badge-red"}`}>Net Flow</div></div>
</div>
<div className="card"><div className="card-title" style={{ color: editId ? 'var(--accent-primary)' : 'var(--text-tertiary)' }}>{editId ? '✏️ กำลังแก้ไขรายการ' : 'เพิ่มรายการด้วยตนเอง'}</div>
<div className="input-row">
<input className="inp" placeholder="คำอธิบาย (เช่น ค่าอาหาร)" value={desc} onChange={e => setDesc(e.target.value)} style={{ flex: 2 }} />
{/* 🟢 Dropdown เลือก รับ/จ่าย แก้บัคแป้นพิมพ์มือถือ */}
<select className="inp" value={txSign} onChange={e => setTxSign(e.target.value)} style={{ flex: '0 0 110px', minWidth: '110px' }}>
<option value="-">📉 จ่าย (-)</option>
<option value="+">📈 รับ (+)</option>
</select>
<input className="inp" type="number" placeholder="จำนวนเงิน" value={amount} onChange={e => setAmount(e.target.value)} style={{ flex: 1, minWidth: '100px' }} />
</div>
<div className="input-row">
<select className="inp" value={cat} onChange={e => setCat(e.target.value)}>{Object.entries(CATEGORIES).map(([k, v]) => <option key={k} value={k}>{v.icon} {v.label}</option>)}</select>
<select className="inp" value={type} onChange={e => setType(e.target.value)}><option value="fix">🔒 Fix Cost (คงที่)</option><option value="var">📊 Variable Cost (ผันแปร)</option></select>
<button className={editId ? "btn btn-blue" : "btn btn-green"} onClick={saveTx}>{editId ? "💾 บันทึกแก้ไข" : "+ เพิ่ม"}</button>
{editId && <button className="btn btn-ghost" onClick={() => { setEditId(null); setDesc(""); setAmount(""); setTxSign("-"); }}>❌ ยกเลิก</button>}
</div>
</div>
<div className="card">
<div className="section-header"><span className="section-title">ประวัติรายการ ({filtered.length})</span>
<div className="row" style={{ gap: 8 }}>{["all", "income", "expense"].map(f => <button key={f} className={`btn btn-ghost ${filter === f ? "active" : ""}`} style={{ padding: "6px 14px", fontSize: 12, background: filter === f ? "var(--bg-tertiary)" : undefined, border: filter === f ? "1px solid var(--border-focus)" : undefined }} onClick={() => setFilter(f)}>{f === "all" ? "ทั้งหมด" : f === "income" ? "รายรับ" : "รายจ่าย"}</button>)}</div>
</div>
<div className="data-table-wrapper">
<table className="data-table">
<thead><tr><th>วันที่</th><th>รายการ</th><th>หมวด</th><th>ประเภท</th><th className="text-right">จำนวน</th><th className="text-right">จัดการ</th></tr></thead>
<tbody>
{filtered.length === 0 && <tr><td colSpan="6" style={{ textAlign: "center", color: "var(--text-secondary)", padding: "28px" }}>ไม่มีรายการ</td></tr>}
{filtered.map(tx => {
const cat = CATEGORIES[tx.cat] || CATEGORIES.other;
return (
<tr key={tx.id}>
<td className="text-mono text-xs text-muted">{tx.date}</td><td style={{ fontSize: 14 }}>{tx.desc}</td><td><span style={{ fontSize: 12 }}>{cat.icon} {cat.label}</span></td><td><span className={tx.type === "fix" ? "tag tag-fix" : "tag tag-var"}>{tx.type === "fix" ? "Fix" : "Var"}</span></td><td className="text-right text-mono" style={{ color: tx.amount > 0 ? "var(--accent-success)" : "var(--text-primary)", fontWeight: 600 }}>{tx.amount > 0 ? "+" : ""}฿{fmt(Math.abs(tx.amount))}</td>
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
const [sms, setSms] = useState(""); const [result, setResult] = useState(null); const [added, setAdded] = useState(false);
const examples = [`MAKE: เงินเข้า 10,000 บาท`, `MAKE: ซื้อหุ้น NVDA 5 หุ้น 20,000 บาท`, `MAKE: จ่าย Netflix 419.00 บาท วันที่ 02/05/67`];
function parse() { const r = parseMakeSMS(sms); setResult(r); setAdded(false); }
function addToLedger() {
if (!result?.valid) return;
const newTx = { id: Date.now(), date: result.date, desc: result.cat === "invest" && result.symbol ? `ซื้อหุ้น ${result.symbol}` : result.merchant, amount: result.type === "income" ? result.amount : -result.amount, cat: result.cat, type: "var", src: "make-sms" };
setTxs(prev => [newTx, ...prev]);
if (result.cat === "invest" && result.symbol) {
setPortfolio(prev => {
const existing = prev.find(p => p.symbol === result.symbol); const sharesToAdd = result.shares || 1;
const costUSD = result.amount / exchangeRate;
if (existing) {
const totalCost = (existing.avgCost * existing.shares) + costUSD; const newShares = existing.shares + sharesToAdd; const newAvgCost = totalCost / newShares;
return prev.map(p => p.symbol === result.symbol ? { ...p, shares: newShares, avgCost: newAvgCost } : p);
} else { return [...prev, { symbol: result.symbol, shares: sharesToAdd, avgCost: costUSD / sharesToAdd, exchange: "US" }]; }
});
}
setAdded(true);
}
return (
<div className="gap-16">
<div className="alert alert-info">💡 คัดลอก SMS / Notification จาก MAKE หรือแอปเทรดมาวาง แล้วกด Parse ระบบจะดึงข้อมูลอัตโนมัติ</div>
<div className="card"><div className="card-title">ตัวอย่าง SMS Format ที่รองรับ</div>
{examples.map((e, i) => <div key={i} onClick={() => setSms(e)} style={{ padding: "12px 16px", background: "var(--bg-tertiary)", borderRadius: var(--radius-md), marginBottom: 10, cursor: "pointer", fontSize: 12, fontFamily: "var(--font-mono)", color: "var(--text-secondary)", border: "1px solid var(--border-subtle)", lineHeight: 1.6, transition: "all 0.2s ease" }} onMouseEnter={el => el.target.style.borderColor = 'var(--accent-primary)'} onMouseLeave={el => el.target.style.borderColor = 'var(--border-subtle)'}>{e}</div>)}
<div className="text-xs text-muted mt-8">คลิกที่ตัวอย่างเพื่อโหลดข้อความ</div>
</div>
<div className="card"><div className="card-title">วาง SMS / Notification ที่นี่</div>
<textarea className="sms-box" placeholder="วาง SMS จาก MAKE by KBank ที่นี่..." value={sms} onChange={e => { setSms(e.target.value); setResult(null); }} />
<div className="row mt-12"><button className="btn btn-blue" onClick={parse}>🔍 Parse SMS</button><button className="btn btn-ghost" onClick={() => { setSms(""); setResult(null); }}>ล้าง</button></div>
{result && (
<div className="parse-result mt-16">
{result.valid ? (
<><div style={{ fontSize: 14, fontWeight: 700, color: "var(--accent-success)", marginBottom: 14 }}>✅ Parse สำเร็จ</div>
{[ ["ประเภท", result.type === "income" ? "💰 รายรับ" : "💸 รายจ่าย"], ["จำนวนเงิน", `${result.direction}฿${fmt(result.amount, 2)}`], ...(result.cat === "invest" && result.symbol ? [["สินทรัพย์", result.symbol], ["จำนวนหุ้น", `${result.shares || 1} หุ้น`]] : []), ["วันที่", result.date], ["ร้านค้า / ผู้โอน", result.merchant], ["หมวด (Auto)", `${CATEGORIES[result.cat]?.icon} ${CATEGORIES[result.cat]?.label}`] ].map(([k, v]) => <div key={k} className="parse-row"><span className="parse-key">{k}</span><span className="parse-val">{v}</span></div>)}
<div className="row mt-12"><button className="btn btn-green" onClick={addToLedger} disabled={added}>{added ? "✅ เพิ่มแล้ว" : "+ บันทึกลงบัญชี"}</button></div>
</>
) : <div style={{ color: "var(--accent-danger)", fontSize: 14 }}>❌ ไม่พบข้อมูลที่ Parse ได้ — ลองตรวจสอบรูปแบบ SMS</div>}
</div>
)}
</div>
</div>
);
}
function PortfolioTab({ portfolio, setPortfolio, livePrices, isLoadingPrices, exchangeRate, setExchangeRate }) {
const [symbol, setSymbol] = useState(""); const [shares, setShares] = useState(""); const [cost, setCost] = useState(""); const [exch, setExch] = useState("US");
function addHolding() {
if (!symbol || !shares || !cost) return;
const symUpper = symbol.toUpperCase();
setPortfolio(prev => {
const existing = prev.find(p => p.symbol === symUpper);
if (existing) {
const totalCostBefore = existing.shares * existing.avgCost;
const totalCostAdded = parseFloat(shares) * parseFloat(cost);
const newShares = existing.shares + parseFloat(shares);
const newAvgCost = (totalCostBefore + totalCostAdded) / newShares;
return prev.map(p => p.symbol === symUpper ? { ...p, shares: newShares, avgCost: newAvgCost } : p);
} else {
return [...prev, { symbol: symUpper, shares: parseFloat(shares), avgCost: parseFloat(cost), exchange: exch }];
}
});
setSymbol(""); setShares(""); setCost("");
}
function deleteHolding(sym) {
if(window.confirm(`ต้องการลบหุ้น ${sym} ออกจากพอร์ตใช่หรือไม่?`)) {
setPortfolio(prev => prev.filter(p => p.symbol !== sym));
}
}
const rows = portfolio.map(p => {
const px = livePrices[p.symbol]; const currentPrice = px?.price || p.avgCost; const isCrypto = p.exchange === "CRYPTO";
const mktVal = currentPrice * p.shares * (isCrypto ? 1 : exchangeRate); const costVal = p.avgCost * p.shares * (isCrypto ? 1 : exchangeRate);
const pnl = mktVal - costVal; const pnlPct = (pnl / (costVal || 1)) * 100; const change = px?.change || 0; const changePct = px?.pct || 0;
return { ...p, currentPrice, mktVal, costVal, pnl, pnlPct, change, changePct };
});
const totalVal = rows.reduce((s, r) => s + r.mktVal, 0); const totalCost = rows.reduce((s, r) => s + r.costVal, 0); const totalPnL = totalVal - totalCost;
return (
<div className="gap-16">
<div className="grid-3">
<div className="card metric-card" style={{ "--accent": "var(--gradient-primary)" }}><div className="card-title">มูลค่าพอร์ตรวม (THB)</div><div className="metric-val" style={{ fontSize: isLoadingPrices ? "18px" : "28px" }}>{isLoadingPrices ? "กำลังโหลด..." : `฿${fmt(totalVal)}`}</div><div className="metric-sub">{isLoadingPrices ? "รอข้อมูล API..." : "ราคาตลาดปัจจุบัน"}</div></div>
<div className="card metric-card" style={{ "--accent": totalPnL >= 0 ? "var(--gradient-success)" : "var(--gradient-danger)" }}><div className="card-title">กำไร/ขาดทุน (UNREALIZED)</div><div className="metric-val" style={{ color: totalPnL >= 0 && !isLoadingPrices ? "var(--accent-success)" : "var(--accent-danger)", fontSize: isLoadingPrices ? "18px" : "28px" }}>{isLoadingPrices ? "กำลังโหลด..." : `${totalPnL >= 0 ? "+" : ""}฿${fmt(totalPnL)}`}</div><div className={`metric-badge ${totalPnL >= 0 ? "badge-green" : "badge-red"}`}>{isLoadingPrices ? "..." : `${totalPnL >= 0 ? "+" : ""}${((totalPnL / (totalCost || 1)) * 100).toFixed(2)}%`}</div></div>
<div className="card metric-card" style={{ "--accent": "var(--gradient-primary)" }}>
<div className="card-title">USD/THB RATE (DIME!)</div>
<div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
<span style={{ fontSize: '28px', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>฿</span>
<input
type="number"
step="0.01"
value={exchangeRate}
onChange={(e) => setExchangeRate(parseFloat(e.target.value) || 0)}
className="exchange-input"
/>
</div>
<div className="metric-sub">แก้ค่าเงินปัจจุบัน (Auto-Sync)</div>
</div>
</div>
<div className="card"><div className="card-title">ราคาตลาด (REAL-TIME VIA FINNHUB) {isLoadingPrices && "⏳ กำลังอัปเดต..."}</div>
<div className="grid-3">
{["VOO", "NVDA", "GOOG"].map((sym) => {
const d = livePrices[sym]; if(!d) return null;
return (
<div key={sym} style={{ padding: "16px", background: "var(--bg-tertiary)", borderRadius: var(--radius-md), border: "1px solid var(--border-subtle)" }}>
<div className="ticker-card"><div><span className="ticker-sym">{sym}</span></div><div className="ticker-name">{d.name}</div><div className="ticker-price">{isLoadingPrices ? "..." : `$${fmt(d.price, 2)}`}</div>
{!isLoadingPrices && (<div className={`ticker-change ${d.change >= 0 ? "up" : "dn"}`}>{d.change >= 0 ? "▲" : "▼"} {Math.abs(d.change).toFixed(2)} ({d.pct >= 0 ? "+" : ""}{d.pct.toFixed(2)}%)</div>)}
</div>
</div>
)
})}
</div>
</div>
<div className="card"><div className="section-header"><span className="section-title">หุ้น dime ที่ถือ</span></div>
<div className="data-table-wrapper">
<table className="data-table">
<thead><tr><th>ชื่อ</th><th>EXCHANGE</th><th className="text-right">จำนวน</th><th className="text-right">ต้นทุน/หน่วย</th><th className="text-right">ราคาปัจจุบัน</th><th className="text-right">มูลค่า (฿)</th><th className="text-right">P&L</th><th className="text-right">จัดการ</th></tr></thead>
<tbody>
{rows.map((r, i) => (
<tr key={i}>
<td style={{ fontFamily: "var(--font-mono)", fontWeight: 700 }}>{r.symbol}</td><td><span className={`tag ${r.exchange === "CRYPTO" ? "tag-gold" : "tag-blue"}`}>{r.exchange}</span></td><td className="text-right text-mono">{r.shares}</td><td className="text-right text-mono">${fmt(r.avgCost, 2)}</td><td className="text-right text-mono">{isLoadingPrices ? "..." : `$${fmt(r.currentPrice, 2)}`}</td><td className="text-right text-mono">{isLoadingPrices ? "..." : `฿${fmt(r.mktVal)}`}</td><td className="text-right text-mono" style={{ color: r.pnl >= 0 && !isLoadingPrices ? "var(--accent-success)" : "var(--accent-danger)", fontWeight: 600 }}>{isLoadingPrices ? "..." : <>{r.pnl >= 0 ? "+" : ""}฿{fmt(r.pnl)}<br /><span style={{ fontSize: 10 }}>({r.pnl >= 0 ? "+" : ""}{r.pnlPct.toFixed(1)}%)</span></>}</td>
<td className="text-right">
<button className="btn-action" onClick={() => deleteHolding(r.symbol)} title="ลบ">🗑️</button>
</td>
</tr>
))}
</tbody>
</table>
</div>
</div>
<div className="card"><div className="card-title">เพิ่ม / แก้ไข PORTFOLIO (ใส่หุ้นเดิมเพื่อถัวเฉลี่ย)</div>
<div className="input-row"><input className="inp" placeholder="Symbol (เช่น AAPL, BTC)" value={symbol} onChange={e => setSymbol(e.target.value)} /><input className="inp" type="number" placeholder="จำนวนหุ้น / เหรียญ" value={shares} onChange={e => setShares(e.target.value)} /><input className="inp" type="number" placeholder="ต้นทุนต่อหน่วย (USD)" value={cost} onChange={e => setCost(e.target.value)} /><select className="inp" value={exch} onChange={e => setExch(e.target.value)}><option value="US">🇺🇸 US</option><option value="CRYPTO">₿ Crypto</option></select><button className="btn btn-blue" onClick={addHolding}>+ เพิ่ม</button></div>
</div>
</div>
);
}
function BudgetTab({ txs }) {
const months = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย."];
const actuals = [0, 0, 0, 0, 0]; const forecast = [0, 0, 0, 0, 0, 0];
const spent = {};
txs.filter(t => t.amount < 0 && t.date.startsWith(new Date().toISOString().slice(0, 7))).forEach(t => { spent[t.cat] = (spent[t.cat] || 0) + Math.abs(t.amount); });
const fixCost = txs.filter(t => t.type === "fix" && t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);
const varCost = txs.filter(t => t.type === "var" && t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);
return (
<div className="gap-16">
<div className="grid-2">
<div className="card metric-card" style={{ "--accent": "var(--gradient-primary)" }}><div className="card-title">Fix Cost (คงที่)</div><div className="metric-val">฿{fmt(fixCost)}</div><div className="metric-sub">ค่าเช่า, Netflix, อินเทอร์เน็ต</div><div className="metric-badge badge-blue">จ่ายทุกเดือน</div></div>
<div className="card metric-card" style={{ "--accent": "var(--gradient-primary)" }}><div className="card-title">Variable Cost (ผันแปร)</div><div className="metric-val">฿{fmt(varCost)}</div><div className="metric-sub">อาหาร, เดินทาง, ช้อปปิ้ง</div><div className="metric-badge badge-gold">ขึ้นกับพฤติกรรม</div></div>
</div>
<div className="card"><div className="section-title" style={{ marginBottom: 20 }}>งบประมาณแต่ละหมวด</div>
{BUDGETS.map(b => {
const cat = CATEGORIES[b.cat]; const s = spent[b.cat] || 0; const pct = Math.min((s / b.limit) * 100, 100); const over = s > b.limit;
return (
<div key={b.cat} className="budget-item">
<div className="budget-header"><span className="budget-name">{cat.icon} {cat.label}</span><span className="budget-amounts text-mono">฿{fmt(s)} / ฿{fmt(b.limit)}</span></div>
<div className="progress-bar"><div className="progress-fill" style={{ width: `${pct}%`, background: over ? "var(--accent-danger)" : pct > 80 ? "var(--accent-warning)" : "var(--accent-success)" }} /></div>
{over && <div style={{ fontSize: 12, color: "var(--accent-danger)", marginTop: 6 }}>⚠️ เกินงบ ฿{fmt(s - b.limit)}</div>}
</div>
);
})}
</div>
<div className="card"><div className="card-title">คาดการณ์รายจ่าย 6 เดือน (รอเก็บข้อมูล)</div>
<div style={{ display: "flex", gap: 10, alignItems: "flex-end", height: 110 }}>
{actuals.concat([forecast[forecast.length - 1]]).map((v, i) => {
const max = Math.max(...actuals, forecast[forecast.length - 1], 1); const isForcast = i === actuals.length;
return (
<div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
<div style={{ fontSize: 10, color: "var(--text-tertiary)", fontFamily: "var(--font-mono)" }}>{isForcast ? "~" : ""}{fmt(v / 1000, 0)}k</div>
<div style={{ width: "100%", height: `${(v / max) * 85}px`, background: isForcast ? "rgba(34,211,238,0.3)" : "var(--accent-danger)", borderRadius: "6px 6px 0 0", border: isForcast ? "2px dashed var(--accent-primary)" : "none", transition: "height 0.4s ease" }} />
<div style={{ fontSize: 10, color: "var(--text-tertiary)", fontFamily: "var(--font-mono)" }}>{months[i]}</div>
</div>
);
})}
</div>
<div className="divider" /><div className="row"><div style={{ width: 14, height: 14, background: "var(--accent-danger)", borderRadius: 4 }} /><span className="text-xs text-muted">รายจ่ายจริง</span><div style={{ width: 14, height: 14, background: "rgba(34,211,238,0.3)", borderRadius: 4, border: "2px dashed var(--accent-primary)" }} /><span className="text-xs text-muted">คาดการณ์ (ค่าเฉลี่ย)</span></div>
</div>
</div>
);
}
// ============================================================
// MAIN APP
// ============================================================
const TABS = [
{ id: "dashboard", icon: "⬛", label: "Dashboard" },
{ id: "transactions", icon: "💳", label: "รายรับ-รายจ่าย" },
{ id: "sms", icon: "📲", label: "MAKE / Dime Parser" },
{ id: "portfolio", icon: "📈", label: "พอร์ตลงทุน" },
{ id: "budget", icon: "🎯", label: "งบ & คาดการณ์" },
];
export default function App() {
const [user, setUser] = useState(() => localStorage.getItem("tw_user") || null);
const [usernameInput, setUsernameInput] = useState("");
const [passwordInput, setPasswordInput] = useState("");
const [loginError, setLoginError] = useState(false);
// 🔥 ใช้ localStorage จำ Tab ปัจจุบันไว้ ไม่ต้องกลับไปเริ่มใหม่ตอนรีเฟรช
const [activeTab, setActiveTab] = useState(() => localStorage.getItem("tw_tab") || "dashboard");
const [txs, setTxs] = useState([]);
const [portfolio, setPortfolio] = useState([]);
const [exchangeRate, setExchangeRate] = useState(32.54);
const [loading, setLoading] = useState(true);
const [livePrices, setLivePrices] = useState({ ...MOCK_PRICES, ...MOCK_CRYPTO });
const [isLoadingPrices, setIsLoadingPrices] = useState(true);
// เมื่อเปลี่ยนหน้า Tab ให้จำลง localStorage ทันที
useEffect(() => {
localStorage.setItem("tw_tab", activeTab);
}, [activeTab]);
// 1. เชื่อม Firebase
useEffect(() => {
if (!user) return;
setLoading(true);
const unsub = onSnapshot(doc(db, "users", user), (res) => {
if (res.exists()) {
const data = res.data();
setTxs(data.txs || []);
setPortfolio(data.portfolio || []);
setExchangeRate(data.exchangeRate || 32.54);
} else {
const initial = { txs: INITIAL_TXS, portfolio: INITIAL_PORTFOLIO, exchangeRate: 32.54 };
setDoc(doc(db, "users", user), initial);
}
setLoading(false);
});
return () => unsub();
}, [user]);
// 2. ดึงราคาหุ้น
useEffect(() => {
if (!user) return;
const API_KEY = "d7sandpr01qorsvi1jagd7sandpr01qorsvi1jb0";
const symbolsToFetch = ["VOO", "NVDA", "GOOG"];
Promise.all(symbolsToFetch.map(sym =>
fetch(`https://finnhub.io/api/v1/quote?symbol=${sym}&token=${API_KEY}`)
.then(res => res.json())
.then(data => ({ symbol: sym, price: data.c, change: data.d, pct: data.dp }))
.catch(err => null)
)).then(results => {
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
// Wrapper สำหรับบันทึกข้อมูลขึ้น Cloud
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
if (!user) {
return (
<div className="login-wrapper">
<style>{styles}</style>
<div className="login-glow-1" />
<div className="login-glow-2" />
<div className="login-glass-card">
<div className="login-logo">Th</div>
<h2 className="login-title">Threewit X Financial</h2>
<p className="login-subtitle">Welcome to Finance Engine!!!</p>
<form onSubmit={handleLogin}>
<input className="login-inp-styled" placeholder="Username" onChange={e => setUsernameInput(e.target.value)} />
<input className="login-inp-styled" type="password" placeholder="Password" onChange={e => setPasswordInput(e.target.value)} />
{loginError && <p className="login-error">รหัสผ่านไม่ถูกต้อง</p>}
<button className="login-btn-styled" type="submit">Access System</button>
</form>
</div>
</div>
);
}
return (
<>
<style>{styles}</style>
<div className="app">
{/* NAV */}
<nav className="topnav">
<div className="topnav-brand">
<div className="topnav-logo">Th</div>
<div>
<div className="topnav-title">Threewit Kub💸💹</div>
<div className="topnav-sub">Finance Engine</div>
</div>
</div>
<div style={{display:'flex', gap:'14px', alignItems:'center'}}>
<div className="topnav-sync"><div className="sync-dot" />  Active</div>
<button className="logout-btn" onClick={() => { localStorage.removeItem("tw_user"); setUser(null); }}>Log Out</button>
</div>
</nav>
{/* TABS */}
<div className="tabs">
{TABS.map(t => (
<button key={t.id} className={`tab ${activeTab === t.id ? "active" : ""}`} onClick={() => setActiveTab(t.id)}>
<span className="tab-icon">{t.icon}</span>
{t.label}
</button>
))}
</div>
{/* CONTENT */}
<div className="main">
{loading ? (
<div style={{textAlign:'center', padding:'60px 20px', color:'var(--text-secondary)', fontFamily:'var(--font-mono)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px'}}>
<div style={{width: '40px', height: '40px', border: '3px solid var(--border-subtle)', borderTop: '3px solid var(--accent-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite'}}></div>
<span>กำลังซิงค์ข้อมูลจาก Firebase... ⏳</span>
<style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
</div>
) : (
<>
{activeTab === "dashboard" && <DashboardTab txs={txs} portfolio={portfolio} livePrices={livePrices} isLoadingPrices={isLoadingPrices} exchangeRate={exchangeRate} />}
{activeTab === "transactions" && <TransactionsTab txs={txs} setTxs={handleSetTxs} />}
{activeTab === "sms" && <SmsParserTab setTxs={handleSetTxs} portfolio={portfolio} setPortfolio={handleSetPortfolio} exchangeRate={exchangeRate} />}
{activeTab === "portfolio" && <PortfolioTab portfolio={portfolio} setPortfolio={handleSetPortfolio} livePrices={livePrices} isLoadingPrices={isLoadingPrices} exchangeRate={exchangeRate} setExchangeRate={handleSetExchangeRate} />}
{activeTab === "budget" && <BudgetTab txs={txs} />}
</>
)}
</div>
</div>
</>
);
}
