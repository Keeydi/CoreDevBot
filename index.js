const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const { loadEvents } = require('./utils/loadEvents');
const { loadFunctions } = require('./utils/loadFunctions');

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
client.login(process.env.DISCORD_BOT_TOKEN);

