const { SlashCommandBuilder } = require('discord.js');
const { closeTicketChannel, countOpenTickets } = require('../functions/ticketSystem');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('close')
        .setDescription('Close the current support ticket'),
    async execute(interaction) {
        const channel = interaction.channel;
        
        // Check if this is a ticket channel (Discord channel names are lowercase)
        if (!channel.name.toLowerCase().startsWith('inquire-')) {
            return await interaction.reply({
                content: '❌ This command can only be used in ticket channels.',
                ephemeral: true,
            });
        }

        // Check if user has permission (either ticket creator or support staff)
        const member = interaction.member;
        
        // Check if user is ticket creator by checking permission overwrites
        // Ticket creators get explicit ViewChannel permission when channel is created
        const memberOverwrite = channel.permissionOverwrites.cache.get(member.id);
        const isTicketCreator = memberOverwrite?.allow.has('ViewChannel') || false;
        
        // Check support role/admin
        const supportRoleId = process.env.SUPPORT_ROLE_ID || '1411885432702111767';
        const hasSupportRole = member.roles.cache.has(supportRoleId) || 
                              member.permissions.has('Administrator');
        
        // User can close if they're the ticket creator OR have support role/admin
        const canClose = isTicketCreator || hasSupportRole;

        if (!canClose) {
            return await interaction.reply({
                content: '❌ You do not have permission to close this ticket.',
                ephemeral: true,
            });
        }

        await interaction.reply({
            content: '🔒 Closing ticket...',
        });

        try {
            const result = await closeTicketChannel(channel, member);
            if (result.transcriptChannel) {
                await interaction.followUp({
                    content: `📄 Transcript saved to ${result.transcriptChannel}`,
                    ephemeral: true,
                });
            }
            // Update bot status after ticket closure
            const categoryId = process.env.TICKET_CATEGORY_ID || '1456583891568558142';
            const openTickets = await countOpenTickets(channel.guild, categoryId);
            const statusText = openTickets === 1 
                ? `1 Inquire Ticket` 
                : `${openTickets} Inquire Tickets`;
            await interaction.client.user.setActivity(statusText, { type: 3 }); // type 3 = WATCHING
        } catch (error) {
            console.error('Error closing ticket:', error);
            await interaction.followUp({
                content: '❌ An error occurred while closing the ticket.',
            });
        }
    },
};

