const { SlashCommandBuilder } = require('discord.js');
const { spin } = require('../lib/probability');
const econ = require('../lib/economy');
const templates = require('../lib/templates');

module.exports.data = new SlashCommandBuilder()
  .setName('slots')
  .setDescription('Joue aux machines à sous')
  .addIntegerOption(opt => opt.setName('mise').setDescription("Montant à miser").setRequired(true));

module.exports.execute = async (interaction) => {
  const userId = interaction.user.id;
  const bet = interaction.options.getInteger('mise');
  const balance = econ.getBalance(userId);
  if (bet <= 0) return interaction.reply({ content: 'La mise doit être supérieure à 0.', ephemeral: true });
  if (bet > balance) return interaction.reply({ content: 'Fonds insuffisants.', ephemeral: true });

  // Deduct the bet immediately
  econ.addBalance(userId, -bet);

  // Contribution to community jackpot (2% of bet, minimum 1)
  const contribution = Math.max(1, Math.floor(bet * 0.02));
  econ.addToJackpot(contribution);
  const effectiveBet = Math.max(0, bet - contribution);

  const result = spin();
  let payout = 0;
  if (result.multiplier > 0) {
    payout = effectiveBet * result.multiplier;
    econ.addBalance(userId, payout);
    const newStreak = econ.addStreak(userId, 1);
    const top = econ.getTop(1)[0];
    const rank = top && top.id === userId ? 1 : '—';
    await interaction.reply({ content: `${templates.header('🎰 CSINO CASINO 🎰')}\n\n${result.reel.join(' ')}\n\n${templates.win(payout, newStreak, rank)}\n\n💰 Contribution jackpot : **${contribution}**` });
  } else {
    econ.setStreak(userId, 0);
    await interaction.reply({ content: `${templates.header('🎰 CSINO CASINO 🎰')}\n\n${result.reel.join(' ')}\n\n${templates.lose()}\n\n💰 Contribution jackpot : **${contribution}**` });
  }
};
