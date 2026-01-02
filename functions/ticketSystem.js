const { ChannelType, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const fs = require('fs');
const path = require('path');

/**
 * Get the next ticket number for a user
 * @param {Guild} guild - The Discord guild
 * @param {string} categoryId - The category ID
 * @param {string} username - The username (cleaned)
 * @returns {number} The next ticket number
 */
async function getNextTicketNumber(guild, categoryId, username) {
    try {
        // Fetch all channels in the category
        const category = guild.channels.cache.get(categoryId);
        if (!category) return 1;

        // Get all text channels in the category
        const channels = category.children.cache.filter(
            channel => channel.type === ChannelType.GuildText
        );

        // Pattern: Support-username-XXX
        const pattern = new RegExp(`^Support-${username.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}-(\\d+)$`, 'i');
        
        let maxNumber = 0;
        
        channels.forEach(channel => {
            const match = channel.name.match(pattern);
            if (match) {
                const ticketNum = parseInt(match[1], 10);
                if (ticketNum > maxNumber) {
                    maxNumber = ticketNum;
                }
            }
        });

        return maxNumber + 1;
    } catch (error) {
        console.error('Error getting next ticket number:', error);
        return 1; // Default to 001 if error
    }
}

/**
 * Ticket System Function
 * Creates a private support ticket channel for a user
 */

async function createTicketChannel(member, categoryId, supportId) {
    try {
        const guild = member.guild;
        
        // Get the category
        const category = guild.channels.cache.get(categoryId);
        if (!category) {
            throw new Error(`Category with ID ${categoryId} not found`);
        }

        // Clean username for channel name (Discord channel names have restrictions)
        const cleanUsername = member.user.username
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '-')
            .substring(0, 20); // Limit length

        // Check if user already has an open ticket
        const existingTicket = guild.channels.cache.find(
            channel => 
                channel.parentId === categoryId &&
                channel.name.startsWith(`Support-${cleanUsername}-`) &&
                channel.type === ChannelType.GuildText
        );

        if (existingTicket) {
            return {
                success: false,
                message: `You already have an open ticket: ${existingTicket}`,
                channel: existingTicket
            };
        }

        // Get next ticket number
        const ticketNumber = await getNextTicketNumber(guild, categoryId, cleanUsername);
        const ticketNumberFormatted = String(ticketNumber).padStart(3, '0'); // 001, 002, etc.

        // Create the channel with format: Support-username-001
        const channelName = `Support-${cleanUsername}-${ticketNumberFormatted}`;
        
        const ticketChannel = await guild.channels.create({
            name: channelName,
            type: ChannelType.GuildText,
            parent: categoryId,
            permissionOverwrites: [
                {
                    id: guild.id, // @everyone
                    deny: [PermissionFlagsBits.ViewChannel],
                },
                {
                    id: member.id, // Ticket creator
                    allow: [
                        PermissionFlagsBits.ViewChannel,
                        PermissionFlagsBits.SendMessages,
                        PermissionFlagsBits.ReadMessageHistory,
                    ],
                },
                {
                    id: supportId, // Support role/user
                    allow: [
                        PermissionFlagsBits.ViewChannel,
                        PermissionFlagsBits.SendMessages,
                        PermissionFlagsBits.ReadMessageHistory,
                        PermissionFlagsBits.ManageMessages,
                    ],
                },
                {
                    id: guild.members.me.id, // Bot itself
                    allow: [
                        PermissionFlagsBits.ViewChannel,
                        PermissionFlagsBits.SendMessages,
                        PermissionFlagsBits.ReadMessageHistory,
                        PermissionFlagsBits.ManageMessages,
                    ],
                },
            ],
        });

        // Send modern welcome message in the ticket with close button
        const welcomeEmbed = new EmbedBuilder()
            .setTitle('🎫 Support Ticket Created')
            .setDescription(
                `Hello ${member}, welcome to your **CoreDev Studio** support ticket!\n\n` +
                `**What happens next?**\n` +
                `• Please describe your issue, question, or concern in detail\n` +
                `• Our support team will respond as soon as possible\n` +
                `• Be patient and respectful while waiting for assistance\n\n` +
                `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
                `💡 **Tip:** Click the button below to close this ticket when your issue is resolved.`
            )
            .setColor(0x00D9FF)
            .setFooter({ text: 'CoreDev Studio Support Team' })
            .setTimestamp();

        // Create close button
        const closeButton = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('close_ticket')
                    .setLabel('Close Ticket')
                    .setStyle(ButtonStyle.Danger)
                    .setEmoji('🔒')
            );

        await ticketChannel.send({
            embeds: [welcomeEmbed],
            components: [closeButton],
            content: `${member} | <@&${supportId}>`,
        });

        return {
            success: true,
            message: `Ticket created: ${ticketChannel}`,
            channel: ticketChannel
        };
    } catch (error) {
        console.error('Error creating ticket channel:', error);
        throw error;
    }
}

/**
 * Generate transcript of ticket conversation
 * @param {TextChannel} channel - The ticket channel
 * @returns {string} Formatted transcript text
 */
async function generateTranscript(channel) {
    try {
        const messages = [];
        let lastId = null;
        
        // Fetch all messages (Discord limits to 100 per fetch)
        while (true) {
            const options = { limit: 100 };
            if (lastId) options.before = lastId;
            
            const fetched = await channel.messages.fetch(options);
            if (fetched.size === 0) break;
            
            messages.push(...Array.from(fetched.values()));
            lastId = fetched.last().id;
            
            if (fetched.size < 100) break;
        }
        
        // Reverse to get chronological order
        messages.reverse();
        
        // Format transcript
        const transcriptLines = [
            '='.repeat(60),
            `TICKET TRANSCRIPT: ${channel.name.toUpperCase()}`,
            '='.repeat(60),
            `Created: ${channel.createdAt.toLocaleString()}`,
            `Closed: ${new Date().toLocaleString()}`,
            `Ticket ID: ${channel.id}`,
            '='.repeat(60),
            '',
        ];
        
        for (const message of messages) {
            const timestamp = message.createdAt.toLocaleString();
            const author = message.author.tag;
            const content = message.content || '[No text content]';
            
            transcriptLines.push(`[${timestamp}] ${author}:`);
            transcriptLines.push(content);
            
            // Add attachments if any
            if (message.attachments.size > 0) {
                message.attachments.forEach(attachment => {
                    transcriptLines.push(`  📎 Attachment: ${attachment.name} (${attachment.url})`);
                });
            }
            
            // Add embeds if any
            if (message.embeds.length > 0) {
                message.embeds.forEach(embed => {
                    transcriptLines.push(`  📋 Embed: ${embed.title || 'Untitled'}`);
                    if (embed.description) transcriptLines.push(`     ${embed.description}`);
                });
            }
            
            transcriptLines.push('');
        }
        
        transcriptLines.push('='.repeat(60));
        transcriptLines.push('End of Transcript');
        transcriptLines.push('='.repeat(60));
        
        return transcriptLines.join('\n');
    } catch (error) {
        console.error('Error generating transcript:', error);
        throw error;
    }
}

/**
 * Save transcript to a channel in the transcript category
 * @param {Guild} guild - The Discord guild
 * @param {TextChannel} ticketChannel - The ticket channel
 * @param {string} transcriptCategoryId - Category ID for transcripts
 * @param {string} transcriptText - The transcript text
 */
async function saveTranscript(guild, ticketChannel, transcriptCategoryId, transcriptText) {
    try {
        const category = guild.channels.cache.get(transcriptCategoryId);
        if (!category) {
            throw new Error(`Transcript category with ID ${transcriptCategoryId} not found`);
        }

        // Create transcript channel
        const transcriptChannel = await guild.channels.create({
            name: `transcript-${ticketChannel.name}`,
            type: ChannelType.GuildText,
            parent: transcriptCategoryId,
            permissionOverwrites: [
                {
                    id: guild.id, // @everyone
                    deny: [PermissionFlagsBits.ViewChannel],
                },
                {
                    id: process.env.SUPPORT_ROLE_ID || '1411885432702111767', // Support role
                    allow: [
                        PermissionFlagsBits.ViewChannel,
                        PermissionFlagsBits.SendMessages,
                        PermissionFlagsBits.ReadMessageHistory,
                    ],
                },
                {
                    id: guild.members.me.id, // Bot itself
                    allow: [
                        PermissionFlagsBits.ViewChannel,
                        PermissionFlagsBits.SendMessages,
                        PermissionFlagsBits.ReadMessageHistory,
                    ],
                },
            ],
        });

        // Create transcript file
        const transcriptEmbed = new EmbedBuilder()
            .setTitle('📄 Ticket Transcript')
            .setDescription(
                `**Ticket:** ${ticketChannel.name}\n` +
                `**Closed:** ${new Date().toLocaleString()}\n` +
                `**Total Messages:** ${transcriptText.split('\n').filter(line => line.includes(']:')).length}`
            )
            .setColor(0x00D9FF)
            .setFooter({ text: 'CoreDev Studio' })
            .setTimestamp();

        // Send transcript as file attachment
        const buffer = Buffer.from(transcriptText, 'utf-8');
        const attachment = {
            attachment: buffer,
            name: `transcript-${ticketChannel.name}-${Date.now()}.txt`,
        };

        await transcriptChannel.send({
            embeds: [transcriptEmbed],
            files: [attachment],
        });

        return transcriptChannel;
    } catch (error) {
        console.error('Error saving transcript:', error);
        throw error;
    }
}

async function closeTicketChannel(channel, member) {
    try {
        // Generate transcript before closing
        const transcriptCategoryId = process.env.TRANSCRIPT_CATEGORY_ID || '1456585966935478355';
        
        let transcriptChannel = null;
        try {
            const transcriptText = await generateTranscript(channel);
            transcriptChannel = await saveTranscript(channel.guild, channel, transcriptCategoryId, transcriptText);
        } catch (error) {
            console.error('Error creating transcript (continuing with close):', error);
        }

        const closeEmbed = new EmbedBuilder()
            .setTitle('🔒 Ticket Closing')
            .setDescription(
                `This ticket is being closed by ${member}\n\n` +
                (transcriptChannel ? `📄 **Transcript saved:** ${transcriptChannel}\n\n` : '') +
                `**The channel will be deleted in 5 seconds...**\n\n` +
                `Thank you for using **CoreDev Studio** support!`
            )
            .setColor(0xFF6B6B)
            .setFooter({ text: 'CoreDev Studio' })
            .setTimestamp();

        await channel.send({ embeds: [closeEmbed] });
        
        setTimeout(async () => {
            try {
                await channel.delete();
            } catch (error) {
                console.error('Error deleting ticket channel:', error);
            }
        }, 5000);
        
        return { 
            success: true, 
            message: 'Ticket will be closed in 5 seconds',
            transcriptChannel: transcriptChannel
        };
    } catch (error) {
        console.error('Error closing ticket:', error);
        throw error;
    }
}

module.exports = {
    createTicketChannel,
    closeTicketChannel,
    generateTranscript,
    saveTranscript,
};

