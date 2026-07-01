const { SlashCommandBuilder } = require('discord.js');
const econ = require('../lib/economy');
const templates = require('../lib/templates');

module.exports.data = new SlashCommandBuilder()
  .setName('vip')
  .setDescription('Affiche ton statut VIP et avantages');

module.exports.execute = async (interaction) => {
  const userId = interaction.user.id;
  const tierNum = econ.getVipTier(userId) || 0;
  const tiers = ['Bronze','Argent','Or','Diamant','Légende'];
  const tier = tiers[Math.min(tierNum, tiers.length-1)];
  const perks = [];
  if (tierNum >= 0) perks.push('Bonus quotidien standard');
  if (tierNum >= 1) perks.push('Multiplicateur de gains +5%');
  if (tierNum >= 2) perks.push('Accès aux événements VIP');
  if (tierNum >= 3) perks.push('Badge exclusif + priorité support');
  if (tierNum >= 4) perks.push('Invitations privées et récompenses légendaires');

  await interaction.reply({ content: templates.vipStatus(tier, perks) });
};
