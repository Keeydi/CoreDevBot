const { Events } = require('discord.js');
const { assignAutoRole } = require('../functions/autoRole');

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {
        try {
            await assignAutoRole(member);
        } catch (error) {
            console.error(`❌ Error in guildMemberAdd event for ${member.user.tag}:`, error);
        }
    },
};

