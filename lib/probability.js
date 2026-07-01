// Simple probability & payout engine for slot outcomes
const symbols = ['🍒', '🔔', '⭐', '💎', '7️⃣'];

// weights aligned with symbols (rarer at end)
const weights = [40, 30, 18, 9, 3];

function weightedPick() {
  const total = weights.reduce((a,b)=>a+b,0);
  let r = Math.floor(Math.random()*total);
  for (let i=0;i<weights.length;i++){
    if (r < weights[i]) return symbols[i];
    r -= weights[i];
  }
  return symbols[0];
}

function spin() {
  const reel = [weightedPick(), weightedPick(), weightedPick()];
  const counts = {};
  for (const s of reel) counts[s] = (counts[s]||0)+1;
  // payout rules
  let multiplier = 0;
  // three of a kind
  for (const s of Object.keys(counts)){
    if (counts[s] === 3) {
      if (s === '7️⃣') multiplier = 50;
      else if (s === '💎') multiplier = 20;
      else multiplier = 5;
    }
  }
  // two of a kind
  if (multiplier === 0) {
    for (const s of Object.keys(counts)){
      if (counts[s] === 2) {
        multiplier = 2;
      }
    }
  }
  // no match -> lose
  return { reel, multiplier };
}

module.exports = { spin, symbols };
