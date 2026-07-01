const { SlashCommandBuilder } = require('discord.js');
const econ = require('../lib/economy');
const templates = require('../lib/templates');

module.exports.data = new SlashCommandBuilder()
  .setName('leaderboard')
  .setDescription('Affiche le classement des meilleurs joueurs');

module.exports.execute = async (interaction) => {
  const top = econ.getTop(10);
  let text = `${templates.header('🏆 Classement')}\n\n`;
  if (top.length === 0) text += 'Aucun joueur trouvé.';
  else {
    for (let i=0;i<top.length;i++){
      text += `#${i+1} <@${top[i].id}> — **${top[i].balance}** crédits\n`;
    }
  }
  await interaction.reply({ content: text });
};
