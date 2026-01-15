const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup-ticket-panel')
        .setDescription('Setup the support ticket panel (Admin only)'),
    async execute(interaction) {
        // Check if user has administrator permission
        if (!interaction.member.permissions.has('Administrator')) {
            return await interaction.reply({
                content: '❌ You need Administrator permission to use this command.',
                ephemeral: true,
            });
        }

        // Create modern, advanced embed
        const embed = new EmbedBuilder()
            .setTitle('🎫 CoreDev Studio Support Center')
            .setDescription(
                '**Welcome to CoreDev Studio Support!**\n\n' +
                'Need assistance? Our support team is here to help you.\n' +
                'Select an option below to create a private ticket channel where you can discuss your issue with our staff.\n\n' +
                '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
            )
            .addFields(
                {
                    name: '❓ Inquire',
                    value: 'Get help with technical issues, questions, or general inquiries. Our team will assist you promptly.',
                    inline: false,
                },
                {
                    name: '🛒 Buy',
                    value: 'Interested in purchasing our services or products? Click here to get started.',
                    inline: false,
                },
                {
                    name: '🔧 Support',
                    value: 'Need technical support or have a specific issue? Our support team is ready to help.',
                    inline: false,
                }
            )
            .setColor(0x00D9FF) // Modern cyan/blue color
            .setThumbnail(interaction.guild.iconURL({ dynamic: true, size: 128 }) || null)
            // .setImage('https://your-banner-image-url-here.png') // Optional: Uncomment and add your banner image URL
            .setFooter({ 
                text: 'CoreDev Studio • Click a button below to get started',
                iconURL: interaction.client.user.displayAvatarURL({ dynamic: true })
            })
            .setTimestamp();

        // Create modern buttons with better styling
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('create_inquire_ticket')
                    .setLabel('Inquire')
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji('❓'),
                new ButtonBuilder()
                    .setCustomId('create_buy_ticket')
                    .setLabel('Buy')
                    .setStyle(ButtonStyle.Success)
                    .setEmoji('🛒'),
                new ButtonBuilder()
                    .setCustomId('create_support_ticket')
                    .setLabel('Support')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('🔧')
            );

        await interaction.reply({
            embeds: [embed],
            components: [row],
        });
    },
};

