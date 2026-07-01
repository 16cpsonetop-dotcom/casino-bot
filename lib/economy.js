const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'data', 'csino.json');
let STORE = { users: {}, jackpot: { amount: 0 } };

function load() {
  try {
    const raw = fs.readFileSync(DB_PATH, 'utf8');
    STORE = JSON.parse(raw);
  } catch (e) {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    save();
  }
}

function save() {
  fs.writeFileSync(DB_PATH, JSON.stringify(STORE, null, 2), 'utf8');
}

function initDb() { load(); }

function ensureUser(id) {
  if (!STORE.users[id]) STORE.users[id] = { id, balance: 1000, streak: 0, vip: 0, last_daily: 0 };
  return STORE.users[id];
}

function getBalance(id) { ensureUser(id); return STORE.users[id].balance; }

function addBalance(id, amount) { ensureUser(id); STORE.users[id].balance += amount; save(); return STORE.users[id].balance; }

function setStreak(id, val) { ensureUser(id); STORE.users[id].streak = val; save(); }

function addStreak(id, delta) { const u = ensureUser(id); u.streak = (u.streak || 0) + delta; save(); return u.streak; }

function getTop(limit = 10) {
  return Object.values(STORE.users).sort((a,b)=>b.balance-a.balance).slice(0,limit).map(u=>({ id: u.id, balance: u.balance }));
}

function getUser(id) { return ensureUser(id); }

function getLastDaily(id) { return ensureUser(id).last_daily || 0; }

function setLastDaily(id, ts) { ensureUser(id); STORE.users[id].last_daily = ts; save(); }

function getJackpot() { return STORE.jackpot.amount || 0; }

function addToJackpot(amount) { STORE.jackpot.amount = (STORE.jackpot.amount||0) + amount; save(); return STORE.jackpot.amount; }

function resetJackpot() { STORE.jackpot.amount = 0; save(); }

function getRandomUser() { const ids = Object.keys(STORE.users); if (ids.length===0) return null; return ids[Math.floor(Math.random()*ids.length)]; }

function getVipTier(id) { const u = ensureUser(id); const b = u.balance||0; if (b>=100000) return 2; if (b>=10000) return 1; return 0; }

module.exports = { initDb, ensureUser, getBalance, addBalance, setStreak, addStreak, getTop, getUser, getLastDaily, setLastDaily, getJackpot, addToJackpot, resetJackpot, getRandomUser, getVipTier };
  function getBalance(id) { ensureUser(id); return STORE.users[id].balance; }

  function addBalance(id, amount) { ensureUser(id); STORE.users[id].balance += amount; save(); return STORE.users[id].balance; }

  function setStreak(id, val) { ensureUser(id); STORE.users[id].streak = val; save(); }

  function addStreak(id, delta) { const u = ensureUser(id); u.streak = (u.streak || 0) + delta; save(); return u.streak; }

  function getTop(limit = 10) {
    return Object.values(STORE.users).sort((a,b)=>b.balance-a.balance).slice(0,limit).map(u=>({ id: u.id, balance: u.balance }));
  }

  function getUser(id) { return ensureUser(id); }

  function getLastDaily(id) { return ensureUser(id).last_daily || 0; }

  function setLastDaily(id, ts) { ensureUser(id); STORE.users[id].last_daily = ts; save(); }

  function getJackpot() { return STORE.jackpot.amount || 0; }

  function addToJackpot(amount) { STORE.jackpot.amount = (STORE.jackpot.amount||0) + amount; save(); return STORE.jackpot.amount; }

  function resetJackpot() { STORE.jackpot.amount = 0; save(); }

  function getRandomUser() { const ids = Object.keys(STORE.users); if (ids.length===0) return null; return ids[Math.floor(Math.random()*ids.length)]; }

  function getVipTier(id) { const u = ensureUser(id); const b = u.balance||0; if (b>=100000) return 2; if (b>=10000) return 1; return 0; }

  module.exports = { initDb, ensureUser, getBalance, addBalance, setStreak, addStreak, getTop, getUser, getLastDaily, setLastDaily, getJackpot, addToJackpot, resetJackpot, getRandomUser, getVipTier };
