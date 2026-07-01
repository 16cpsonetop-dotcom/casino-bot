const { SlashCommandBuilder } = require('discord.js');
const econ = require('../lib/economy');
const templates = require('../lib/templates');

module.exports.data = new SlashCommandBuilder()
  .setName('mines')
  .setDescription('Joue aux Mines Royales')
  .addIntegerOption(opt => opt.setName('mise').setDescription('Montant à miser').setRequired(true))
  .addIntegerOption(opt => opt.setName('cases').setDescription('Nombre de cases à découvrir').setRequired(true));

module.exports.execute = async (interaction) => {
  const userId = interaction.user.id;
  const bet = interaction.options.getInteger('mise');
  const picks = interaction.options.getInteger('cases');
  const balance = econ.getBalance(userId);
  if (bet <= 0) return interaction.reply({ content: 'La mise doit être supérieure à 0.', ephemeral: true });
  if (bet > balance) return interaction.reply({ content: 'Fonds insuffisants.', ephemeral: true });
  if (picks < 1 || picks > 24) return interaction.reply({ content: 'Choisissez entre 1 et 24 cases.', ephemeral: true });

  econ.addBalance(userId, -bet);
  const gridSize = 5;
  const mines = 6; // fixed
  let diamonds = 0; let avoided = 0;
  let hitMine = false;
  for (let i=0;i<picks;i++){
    const chance = Math.random();
    const mineProb = mines / (gridSize*gridSize);
    if (chance < mineProb) { hitMine = true; break; }
    diamonds++;
  }
  let multiplier = 1 + diamonds * 0.25;
  let payout = 0;
  let outcome = '';
  if (hitMine) {
    outcome = '💥 Oups — vous avez touché une mine. Tout perdu.';
    econ.setStreak(userId, 0);
  } else {
    avoided = picks - diamonds;
    payout = Math.floor(bet * multiplier);
    econ.addBalance(userId, payout);
    const newStreak = econ.addStreak(userId, 1);
    outcome = '🎉 Bravo — vous avez évité les mines et récupéré vos gains !';
  }
  await interaction.reply({ content: templates.minesResult(gridSize, diamonds, avoided, multiplier.toFixed(2), outcome, payout) });
};
