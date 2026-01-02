# CoreDev Discord Bot

A modular Discord bot with organized folder structure, designed to easily scale to 20+ functions.

## 📁 Project Structure

```
CoreDevBot/
├── events/              # Event handlers (guildMemberAdd, messageCreate, etc.)
│   ├── ready.js         # Bot ready event
│   └── guildMemberAdd.js # Member join event
├── functions/           # Individual bot functions/features
│   └── autoRole.js      # Auto-role functionality
├── commands/            # Slash commands or message commands (future)
├── utils/               # Utility functions
│   ├── loadEvents.js    # Dynamic event loader
│   └── loadFunctions.js # Function loader
├── config/              # Configuration files (optional)
├── index.js             # Main bot file
├── package.json         # Dependencies
├── .env                 # Environment variables (create this)
└── README.md            # This file
```

## ✨ Features

- ✅ **Modular Structure**: Organized by function for easy scaling
- ✅ **Auto-Role Assignment**: Automatically assigns a role to new members
- ✅ **Dynamic Event Loading**: Automatically loads all events from the events folder
- ✅ **Scalable Architecture**: Easy to add new functions and features

## 🚀 Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

1. Create a `.env` file in the root directory:
   ```bash
   copy env.example .env
   ```
   (On Linux/Mac: `cp env.example .env`)

2. Fill in your `.env` file:
   ```
   DISCORD_BOT_TOKEN=your_bot_token_here
   AUTO_ROLE_ID=your_role_id_here
   WELCOME_CHANNEL_ID=your_channel_id_here (optional)
   ```

### 3. Discord Bot Setup

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application and bot
3. Enable **Server Members Intent** in the Bot section
4. Invite the bot to your server with "Manage Roles" permission
5. Make sure the bot's role is positioned **above** the auto-role in role hierarchy

### 4. Run the Bot

```bash
npm start
```

### 5. Deploy for 24/7 Uptime

**🚂 Railway (Recommended):** See [RAILWAY_SETUP.md](./RAILWAY_SETUP.md) for complete Railway deployment guide

**Other Options:** See [DEPLOYMENT.md](./DEPLOYMENT.md) for other hosting options:
- **Railway** (⭐ Recommended - Easy & Free)
- **Render** (Free tier available)
- **Fly.io** (Good free tier)
- **DigitalOcean** (Paid but reliable)
- And more options with setup instructions!

## 📝 Adding New Functions

### Adding a New Event Handler

1. Create a new file in `events/` folder (e.g., `messageCreate.js`):
   ```javascript
   const { Events } = require('discord.js');
   
   module.exports = {
       name: Events.MessageCreate,
       execute(message) {
           // Your code here
       },
   };
   ```

2. The event will be automatically loaded on bot restart!

### Adding a New Function

1. Create a new file in `functions/` folder (e.g., `moderation.js`):
   ```javascript
   module.exports = {
       banUser: async (member, reason) => {
           // Your function code
       },
   };
   ```

2. Import and use it in your events or commands:
   ```javascript
   const { banUser } = require('../functions/moderation');
   ```

### Adding Slash Commands

1. Create a new file in `commands/` folder (e.g., `ping.js`):
   ```javascript
   const { SlashCommandBuilder } = require('discord.js');
   
   module.exports = {
       data: new SlashCommandBuilder()
           .setName('ping')
           .setDescription('Replies with Pong!'),
       async execute(interaction) {
           await interaction.reply('Pong!');
       },
   };
   ```

## 🗂️ Current Functions

- **Auto-Role**: Automatically assigns a role when someone joins the server

## 🔧 Troubleshooting

### Bot doesn't assign roles
- ✅ Check bot's role is above target role in hierarchy
- ✅ Verify "Manage Roles" permission
- ✅ Check AUTO_ROLE_ID in `.env` is correct
- ✅ Ensure Server Members Intent is enabled

### Events not loading
- ✅ Check file names match Discord event names
- ✅ Verify `module.exports` structure
- ✅ Check console for loading messages

## 📚 Resources

- [Discord.js Documentation](https://discord.js.org/)
- [Discord Developer Portal](https://discord.com/developers/applications)
- [Discord.js Guide](https://discordjs.guide/)

## ⚠️ Security Note

**Never commit your `.env` file!** It contains sensitive tokens. The `.gitignore` file is already configured to exclude it.

## 📄 License

MIT
