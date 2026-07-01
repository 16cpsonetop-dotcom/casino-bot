const cron = require('node-cron');
const econ = require('./economy');
const templates = require('./templates');

async function start(client) {
  // Hourly check: si jackpot >= seuil, tirer un gagnant aléatoire
  cron.schedule('0 * * * *', async () => {
    try {
      const jackpot = econ.getJackpot();
      const threshold = 1000;
      if (jackpot >= threshold) {
        const winnerId = econ.getRandomUser();
        if (winnerId) {
          econ.addBalance(winnerId, jackpot);
          econ.resetJackpot();
          const guildId = process.env.GUILD_ID;
          if (guildId && client.guilds) {
            const guild = await client.guilds.fetch(guildId).catch(()=>null);
            if (guild) {
              const channel = guild.systemChannel || guild.channels.cache.find(c=>c.isTextBased && c.viewable);
              if (channel) {
                channel.send(`${templates.header('🎉 JACKPOT COMMUNAUTAIRE 🎉')}\n\n🏆 Gagnant : <@${winnerId}>\n\n💰 Montant : **${jackpot}**`);
                return;
              }
            }
          }
          console.log(`Jackpot awarded to ${winnerId}: ${jackpot}`);
        }
      }
    } catch (err) {
      console.error('Event scheduler error', err);
    }
  });
}

module.exports = { start };
