const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const { loadEvents } = require('./utils/loadEvents');
const { loadFunctions } = require('./utils/loadFunctions');

// Validate environment variables
const token = process.env.DISCORD_BOT_TOKEN;

if (!token) {
    console.error('❌ ERROR: DISCORD_BOT_TOKEN is not set!');
    console.error('📝 Please set your bot token in one of the following ways:');
    console.error('   1. Create a .env file with: DISCORD_BOT_TOKEN=your_token_here');
    console.error('   2. Set it as an environment variable in your hosting platform');
    console.error('   3. Export it: export DISCORD_BOT_TOKEN=your_token_here');
    process.exit(1);
}

if (token === 'your_bot_token_here' || token.length < 50) {
    console.error('❌ ERROR: Invalid Discord bot token!');
    console.error('📝 Please get your bot token from: https://discord.com/developers/applications');
    process.exit(1);
}

// Create a new client instance
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Load all events dynamically
loadEvents(client);

// Load all functions (for initialization if needed)
loadFunctions();

// Log in to Discord with your client's token
client.login(token).catch(error => {
    console.error('❌ Failed to login to Discord:', error.message);
    console.error('📝 Please check:');
    console.error('   - Your bot token is correct');
    console.error('   - Your bot is not already running elsewhere');
    console.error('   - Required intents are enabled in Discord Developer Portal');
    process.exit(1);
});

