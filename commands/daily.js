const { SlashCommandBuilder } = require('discord.js');
const econ = require('../lib/economy');
const templates = require('../lib/templates');

module.exports.data = new SlashCommandBuilder()
  .setName('daily')
  .setDescription('Réclame ta récompense quotidienne');

module.exports.execute = async (interaction) => {
  const userId = interaction.user.id;
  const now = Date.now();
  const last = econ.getLastDaily(userId) || 0;
  if (now - last < 24*60*60*1000) {
    return interaction.reply({ content: 'Tu as déjà réclamé ta récompense aujourd\'hui. Reviens demain !', ephemeral: true });
  }
  const vip = econ.getVipTier(userId) || 0;
  const base = 500;
  const reward = base + vip * 250;
  econ.addBalance(userId, reward);
  econ.setLastDaily(userId, now);
  await interaction.reply({ content: `${templates.header('🎁 Récompense quotidienne')}\n\n🎁 Tu reçois **${reward}** crédits. À bientôt !` });
};
