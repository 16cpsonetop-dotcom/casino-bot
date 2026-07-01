# CSINO AI — Discord Casino Bot

Slogan:

> 🎰 **CSINO — Là où la chance rencontre l'excellence.** 💎

Installation rapide:

```bash
npm install
export DISCORD_TOKEN=your_token_here
# Optional: export GUILD_ID=your_guild_id (for quick command registration)
npm start
```

Sécuriser son token (recommandé)

1) Utiliser le script d'aide pour écrire `.env` localement sans le committer :

PowerShell (Windows) :
```powershell
.
\scripts\set-token.ps1
```

macOS / Linux :
```bash
./scripts/set-token.sh
```

Windows (cmd) :
```cmd
scripts\set-token.cmd
```

2) Vérifiez que `.env` est dans `.gitignore` (déjà configuré) et ne le partagez jamais.

Si vous avez accidentellement publié votre token, révoquez-le immédiatement dans le Developer Portal.

Fichiers clés:
- `index.js` : point d'entrée
- `commands/` : commandes slash (`/slots`, `/balance`, `/daily`, `/leaderboard`)
- `lib/economy.js` : gestion SQLite du portefeuille
- `lib/probability.js` : moteur de slots
- `lib/templates.js` : templates de messages en français

Notes:
- Configure `DISCORD_TOKEN` avant de démarrer.
- Ce projet est un squelette: adaptez les paiements, probabilités et la persistance selon vos besoins.

Fonctionnalités ajoutées:
- Jackpot communautaire : une petite portion de chaque mise alimente un pot qui est tiré périodiquement.
- Récompenses quotidiennes persistantes avec bonus VIP.

Variables d'environnement importantes:
- `DISCORD_TOKEN` : token du bot (obligatoire)
- `GUILD_ID` : (optionnel) pour enregistrer rapidement les commandes sur une guild et poster les annonces

