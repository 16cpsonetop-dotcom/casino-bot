const { SlashCommandBuilder } = require('discord.js');
const econ = require('../lib/economy');
const templates = require('../lib/templates');

function drawCard() {
  const ranks = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
  const suits = ['♠','♥','♦','♣'];
  const r = ranks[Math.floor(Math.random()*ranks.length)];
  const s = suits[Math.floor(Math.random()*suits.length)];
  return `${r} ${s}`;
}

function valueOf(card) {
  const r = card.split(' ')[0];
  if (r === 'A') return 11;
  if (['J','Q','K'].includes(r)) return 10;
  return parseInt(r,10);
}

function handValue(cards) {
  let total = 0; let aces = 0;
  for (const c of cards) {
    const v = valueOf(c);
    total += v;
    if (c.startsWith('A')) aces++;
  }
  while (total > 21 && aces > 0) { total -= 10; aces--; }
  return total;
}

module.exports.data = new SlashCommandBuilder()
  .setName('blackjack')
  .setDescription('Joue une main de Blackjack')
  .addIntegerOption(opt => opt.setName('mise').setDescription('Montant à miser').setRequired(true));

module.exports.execute = async (interaction) => {
  const userId = interaction.user.id;
  const bet = interaction.options.getInteger('mise');
  const balance = econ.getBalance(userId);
  if (bet <= 0) return interaction.reply({ content: 'La mise doit être supérieure à 0.', ephemeral: true });
  if (bet > balance) return interaction.reply({ content: 'Fonds insuffisants.', ephemeral: true });

  // deduct bet
  econ.addBalance(userId, -bet);

  const player = [drawCard(), drawCard()];
  const dealer = [drawCard(), drawCard()];
  const pVal = handValue(player);
  const dVal = handValue([dealer[0]]);

  // Simplified dealer play
  while (handValue(dealer) < 17) dealer.push(drawCard());
  const finalDealer = handValue(dealer);
  let outcome = '';
  let payout = 0;
  if (pVal === 21 && player.length === 2) {
    outcome = '✨ BLACKJACK ! Le croupier s\'incline avec respect.';
    payout = Math.floor(bet * 2.5);
  } else if (pVal > 21) {
    outcome = '💥 Vous avez dépassé 21 — vous perdez.';
  } else if (finalDealer > 21 || pVal > finalDealer) {
    outcome = '🎉 Vous gagnez contre le croupier !';
    payout = bet * 2;
  } else if (pVal === finalDealer) {
    outcome = '🤝 Égalité — la mise vous est rendue.';
    payout = bet;
  } else {
    outcome = '😞 Le croupier l\'emporte cette fois.';
  }

  if (payout > 0) econ.addBalance(userId, payout);

  const rank = '—';
  await interaction.reply({ content: templates.blackjackResult(player, pVal, dealer, handValue(dealer), outcome, payout) });
};
