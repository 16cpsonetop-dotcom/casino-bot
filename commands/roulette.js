// commands/roulette.js
const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const RouletteEngine = require('../lib/casino/RouletteEngine');
const { getBalance, addBalance } = require('../lib/economy');

const engine = new RouletteEngine();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('roulette')
        .setDescription('🎰 Roulette Européenne - Casino Luxe')
        .addIntegerOption(option =>
            option.setName('mise')
                .setDescription('Montant de la mise')
                .setMinValue(100)
                .setRequired(true))
        .addStringOption(option =>
            option.setName('parie')
                .setDescription('rouge | noir | vert | pair | impair | nombre')
                .setRequired(true)),

    async execute(interaction) {
        const mise = interaction.options.getInteger('mise');
        const parie = interaction.options.getString('parie').toLowerCase().trim();

        const balance = await getBalance(interaction.user.id);
        if (!balance || balance < mise) {
            return interaction.reply({ content: `❌ Solde insuffisant (${balance || 0} crédits).`, ephemeral: true });
        }

        await interaction.deferReply();

        try {
            const result = await engine.play(interaction, mise, parie);

            if (result && result.win) {
                await addBalance(interaction.user.id, result.payout - mise);
            } else {
                await addBalance(interaction.user.id, -mise);
            }
        } catch (error) {
            console.error('Erreur roulette:', error);
            await interaction.editReply({ content: '❌ Erreur pendant la partie.' });
        }
    }
};