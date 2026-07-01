const { SlashCommandBuilder } = require('discord.js');
const econ = require('../lib/economy');
const templates = require('../lib/templates');

module.exports.data = new SlashCommandBuilder()
  .setName('balance')
  .setDescription("Affiche ton solde Csino");

module.exports.execute = async (interaction) => {
  const userId = interaction.user.id;
  const balance = econ.getBalance(userId);
  await interaction.reply({ content: `${templates.header('💰 Ton solde')}\n\n💰 **${balance}** crédits` });
};
