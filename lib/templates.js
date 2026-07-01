const TOP_BAR = '╔════════════════════════════════╗';
const BOTTOM_BAR = '╚════════════════════════════════╝';

function header(title) {
  return `${TOP_BAR}\n\n🎰 **CSINO ELITE** — 💎 L'expérience casino virtuelle ultime. 💎\n\n**${title}**\n\n${BOTTOM_BAR}`;
}

function welcome() {
  return `🎉 Bienvenue chez **CSINO ELITE** !\n\n💰 Tente ta chance aux jeux premium.\n\n🏆 Grimpe dans le classement.\n\n🎁 Réclame tes récompenses quotidiennes (bonus VIP disponibles).\n\n💎 Profite d'une expérience luxueuse et respectueuse.`;
}

function win(amount, streak, rank) {
  return `🎉 INCROYABLE !\n\n💰 Gain : **+${amount}** crédits\n\n🔥 Série actuelle : **${streak}**\n\n🏆 Classement : **#${rank}**\n\nLe casino salue votre chance !`;
}

function lose() {
  return `🎲 Cette manche n'est pas pour vous.\n\nLa chance peut tourner à tout moment.\n\nRevenez tenter votre chance — le plaisir continue !`;
}

function eventNotice(text, timeLeft) {
  return `🚨 **ÉVÉNEMENT SPÉCIAL — CSINO ELITE**\n\n${text}\n\n⏳ Temps restant : ${timeLeft}\n\n🎰 Bonne chance à tous !`;
}

function blackjackResult(playerCards, playerValue, dealerCards, dealerValue, outcome, payout) {
  return `🎲 **BLACKJACK PREMIUM**\n\nLe croupier distribue les cartes...\n\n🂡 Votre main :\n\n**${playerCards.join(' | ')}**\n\nValeur : **${playerValue}**\n\n🪙 Main du croupier : **${dealerCards.join(' | ')}** (Valeur : **${dealerValue}**)\n\n${outcome}\n\n${payout ? `💰 Gain : **+${payout}** crédits` : ''}`;
}

function minesResult(gridSize, diamonds, avoided, multiplier, outcome, payout) {
  return `💎 **MINES ROYALES**\n\nTerrain : ${gridSize}×${gridSize}\n\n💎 Diamants trouvés : ${diamonds}\n\n💣 Mines évitées : ${avoided}\n\nMultiplicateur actuel :\n\n🔥 x${multiplier}\n\n${outcome}\n\n${payout ? `💰 Gain : **+${payout}** crédits` : ''}`;
}

function rouletteResult(outcomeText, payout) {
  return `🎡 **ROULETTE PRESTIGE**\n\nLa bille tourne à toute vitesse...\n\nLa roue ralentit...\n\n🎯 Résultat :\n\n${outcomeText}\n\n${payout ? `💰 Gain : **+${payout}** crédits` : ''}`;
}

function slotsResult(reel, message, payout) {
  return `🎰 **SLOTS ULTIMATE**\n\nLes rouleaux tournent...\n\n${reel.join(' | ')}\n\n${message}\n\n${payout ? `💰 Gain : **+${payout}** crédits` : ''}`;
}

function vipStatus(tier, perks) {
  return `💎 **STATUT VIP — ${tier}**\n\n${perks.join('\n')}`;
}

function bigWin(amount, streak, rank) {
  return `🎉 INCROYABLE !\n\n💰 Gain : **+${amount}** crédits\n\n🔥 Série de victoires : **${streak}**\n\n🏆 Classement : **#${rank}**\n\nLe casino est en effervescence !`;
}

function generalError() { return `⚠️ Une erreur est survenue. Merci de réessayer plus tard.`; }

module.exports = { header, welcome, win, lose, eventNotice, generalError, blackjackResult, minesResult, rouletteResult, slotsResult, vipStatus, bigWin };
