const { SlashCommandBuilder } = require('discord.js');
const { closeTicketChannel } = require('../functions/ticketSystem');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('close')
        .setDescription('Close the current support ticket'),
    async execute(interaction) {
        const channel = interaction.channel;
        
        // Check if this is a ticket channel (Discord channel names are lowercase)
        if (!channel.name.startsWith('support-')) {
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
        
        // Also check by username in channel name as backup
        const cleanUsername = member.user.username
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '-')
            .substring(0, 20);
        const channelNameLower = channel.name.toLowerCase();
        const isTicketCreatorByName = channelNameLower.startsWith(`support-${cleanUsername}-`);
        
        // Check support role/admin
        const supportRoleId = process.env.SUPPORT_ROLE_ID || '1411885432702111767';
        const hasSupportRole = member.roles.cache.has(supportRoleId) || 
                              member.permissions.has('Administrator');
        
        // User can close if they're the ticket creator OR have support role/admin
        const canClose = isTicketCreator || isTicketCreatorByName || hasSupportRole;

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
        } catch (error) {
            console.error('Error closing ticket:', error);
            await interaction.followUp({
                content: '❌ An error occurred while closing the ticket.',
            });
        }
    },
};

