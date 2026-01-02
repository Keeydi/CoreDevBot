const { Events } = require('discord.js');
const { createTicketChannel } = require('../functions/ticketSystem');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        // Handle button interactions
        if (interaction.isButton()) {
            // Support Ticket button
            if (interaction.customId === 'create_support_ticket') {
                await interaction.deferReply({ ephemeral: true });

                try {
                    const categoryId = process.env.TICKET_CATEGORY_ID || '1456583891568558142';
                    const supportId = process.env.SUPPORT_ROLE_ID || '1411885432702111767';

                    const result = await createTicketChannel(
                        interaction.member,
                        categoryId,
                        supportId
                    );

                    if (result.success) {
                        await interaction.editReply({
                            content: `✅ ${result.message}`,
                        });
                    } else {
                        await interaction.editReply({
                            content: `⚠️ ${result.message}`,
                        });
                    }
                } catch (error) {
                    console.error('Error handling ticket creation:', error);
                    await interaction.editReply({
                        content: '❌ An error occurred while creating your ticket. Please try again later.',
                    });
                }
            }

            // Ban Appeal button (placeholder for future implementation)
            if (interaction.customId === 'create_ban_appeal') {
                await interaction.reply({
                    content: '🚫 Ban Appeal functionality coming soon!',
                    ephemeral: true,
                });
            }

            // Close Ticket button
            if (interaction.customId === 'close_ticket') {
                const channel = interaction.channel;
                
                // Check if this is a ticket channel (Discord channel names are lowercase)
                if (!channel.name.startsWith('support-')) {
                    return await interaction.reply({
                        content: '❌ This button can only be used in ticket channels.',
                        ephemeral: true,
                    });
                }

                // Check permissions
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

                await interaction.deferReply({ ephemeral: true });

                try {
                    const { closeTicketChannel } = require('../functions/ticketSystem');
                    const result = await closeTicketChannel(channel, member);
                    
                    await interaction.editReply({
                        content: `✅ ${result.message}${result.transcriptChannel ? `\n📄 Transcript saved to ${result.transcriptChannel}` : ''}`,
                    });
                } catch (error) {
                    console.error('Error closing ticket:', error);
                    await interaction.editReply({
                        content: '❌ An error occurred while closing the ticket.',
                    });
                }
            }
        }

        // Handle slash commands
        if (interaction.isChatInputCommand()) {
            const command = interaction.client.commands?.get(interaction.commandName);
            
            if (!command) {
                console.error(`No command matching ${interaction.commandName} was found.`);
                return;
            }

            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(`Error executing ${interaction.commandName}:`, error);
                
                const errorMessage = { content: 'There was an error while executing this command!', ephemeral: true };
                
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp(errorMessage);
                } else {
                    await interaction.reply(errorMessage);
                }
            }
        }
    },
};

