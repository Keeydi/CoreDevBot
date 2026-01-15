const { Events } = require('discord.js');
const { registerCommands } = require('../utils/loadCommands');
const { countOpenTickets } = require('../functions/ticketSystem');

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        console.log(`✅ Bot is ready! Logged in as ${client.user.tag}`);
        console.log(`🤖 Bot is in ${client.guilds.cache.size} server(s)`);
        console.log(`📊 Total members: ${client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)}`);
        
        // Register slash commands
        await registerCommands(client);

        // Set initial bot status
        try {
            const categoryId = process.env.TICKET_CATEGORY_ID || '1456583891568558142';
            const guild = client.guilds.cache.first();
            if (guild) {
                const openTickets = await countOpenTickets(guild, categoryId);
                const statusText = openTickets === 1 
                    ? `1 Inquire Ticket` 
                    : `${openTickets} Inquire Tickets`;
                await client.user.setActivity(statusText, { type: 3 }); // type 3 = WATCHING
                console.log(`📊 Bot status set to: Watching ${statusText}`);
            }
        } catch (error) {
            console.error('Error setting bot status:', error);
        }
    },
};

