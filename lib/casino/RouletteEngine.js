// lib/casino/RouletteEngine.js
const RouletteRenderer = require('./RouletteRenderer');
const RoulettePhysics = require('./RoulettePhysics');
const { AttachmentBuilder, EmbedBuilder } = require('discord.js');

const COLORS = { GOLD: '#F1C40F' };

class RouletteEngine {
    constructor() {
        this.renderer = new RouletteRenderer();
        this.physics = new RoulettePhysics();
    }

    async play(interaction, betAmount, betInput) {
        const resultNumber = Math.floor(Math.random() * 37);
        const { win, multiplier } = this.checkBet(resultNumber, betInput);
        const payout = win ? Math.floor(betAmount * multiplier) : 0;

        const frames = this.physics.generateFrames(resultNumber);

        console.log(`Animation lancée : ${frames.length} frames (~5s)`);

        for (let i = 0; i < frames.length; i++) {
            try {
                const frame = frames[i];
                const buffer = await this.renderer.drawFrame(
                    frame.wheelRotation,
                    frame.ballAngle,
                    i === frames.length - 1 ? resultNumber : null
                );

                // Nom unique à chaque frame pour forcer Discord à mettre à jour l'image
                const timestamp = Date.now();
                const attachment = new AttachmentBuilder(buffer, { name: `roulette-${timestamp}.png` });

                const embed = new EmbedBuilder()
                    .setTitle('🎰 Roulette Européenne')
                    .setDescription(`**Mise :** ${betAmount} crédits\n**Pari :** ${betInput}\n\nLa bille tourne...`)
                    .setColor(COLORS.GOLD)
                    .setImage(`attachment://roulette-${timestamp}.png`);

                await interaction.editReply({ 
                    embeds: [embed], 
                    files: [attachment] 
                }).catch(e => console.error("Edit error:", e.message));

                await new Promise(r => setTimeout(r, 90)); // 90ms = fluide et rapide
            } catch (err) {
                console.error("Frame error:", err);
                break;
            }
        }

        console.log('Animation terminée');
        return this.showResult(interaction, resultNumber, win, payout, betAmount);
    }

    // ... (checkBet et showResult restent les mêmes)
    checkBet(result, betInput) {
        const num = parseInt(betInput);
        if (!isNaN(num)) return { win: result === num, multiplier: 36 };

        switch (betInput) {
            case 'rouge': case 'red':
                const reds = [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36];
                return { win: reds.includes(result), multiplier: 2 };
            case 'noir': case 'black':
                const reds2 = [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36];
                return { win: result !== 0 && !reds2.includes(result), multiplier: 2 };
            case 'vert': case 'green':
                return { win: result === 0, multiplier: 36 };
            case 'pair':
                return { win: result % 2 === 0 && result !== 0, multiplier: 2 };
            case 'impair':
                return { win: result % 2 === 1, multiplier: 2 };
            default:
                return { win: false, multiplier: 1 };
        }
    }

    async showResult(interaction, number, win, payout, bet) {
        const embed = new EmbedBuilder()
            .setTitle(win ? '💎 VICTOIRE !' : '❌ Perdu')
            .setDescription(`**Numéro sorti :** ${number}`)
            .addFields(
                { name: 'Mise', value: `${bet} crédits`, inline: true },
                { name: 'Gain', value: win ? `+${payout} crédits` : '0 crédits', inline: true }
            )
            .setColor(win ? '#00ff88' : '#ff4444');

        await interaction.editReply({ embeds: [embed], files: [] });
        return { win, payout };
    }
}

module.exports = RouletteEngine;