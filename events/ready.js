const { Events } = require('discord.js');
const { registerCommands } = require('../utils/loadCommands');

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        console.log(`✅ Bot is ready! Logged in as ${client.user.tag}`);
        console.log(`🤖 Bot is in ${client.guilds.cache.size} server(s)`);
        console.log(`📊 Total members: ${client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)}`);
        
        // Register slash commands
        await registerCommands(client);
    },
};

