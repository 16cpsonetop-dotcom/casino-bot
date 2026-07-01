require('dotenv').config();

console.log("DISCORD_TOKEN chargé :", process.env.DISCORD_TOKEN ? "Oui" : "Non");

const { Client, GatewayIntentBits, REST, Routes } = require('discord.js');
const path = require('path');
const fs = require('fs');                    // ← Important
const { initDb } = require('./lib/economy');
const templates = require('./lib/templates');
const events = require('./lib/events');

const TOKEN = process.env.DISCORD_TOKEN;
const GUILD_ID = process.env.GUILD_ID;

if (!TOKEN) {
    console.error("❌ Le fichier .env n'a pas été chargé ou DISCORD_TOKEN est absent.");
    process.exit(1);
}

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

// ====================== CHARGEMENT SÉCURISÉ DES COMMANDES ======================
const commands = [];
const commandFiles = fs
    .readdirSync(path.join(__dirname, 'commands'))
    .filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    try {
        const command = require(`./commands/${file}`);
        
        if (command && command.data) {
            commands.push(command.data.toJSON());
            console.log(`✅ Commande chargée : ${file}`);
        } else {
            console.warn(`⚠️  Fichier ignoré (manque .data) : ${file}`);
        }
    } catch (err) {
        console.error(`❌ Erreur chargement ${file} :`, err.message);
    }
}
// =============================================================================

client.once('ready', async () => {
    console.log(`✅ Connecté en tant que ${client.user.tag}`);

    await initDb();

    try {
        events.start(client);
    } catch (err) {
        console.error(err);
    }

    const rest = new REST({ version: '10' }).setToken(TOKEN);

    try {
        if (GUILD_ID) {
            await rest.put(
                Routes.applicationGuildCommands(client.user.id, GUILD_ID),
                { body: commands }
            );
            console.log("✅ Commandes du serveur enregistrées.");
        } else {
            await rest.put(
                Routes.applicationCommands(client.user.id),
                { body: commands }
            );
            console.log("✅ Commandes globales enregistrées.");
        }
    } catch (err) {
        console.error(err);
    }
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    try {
        const command = require(`./commands/${interaction.commandName}.js`);
        await command.execute(interaction);
    } catch (err) {
        console.error(err);

        if (!interaction.replied) {
            await interaction.reply({
                content: templates.generalError(),
                ephemeral: true
            });
        }
    }
});

client.login(TOKEN);