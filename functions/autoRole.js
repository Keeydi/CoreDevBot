/**
 * Auto-Role Function
 * Automatically assigns a role to new members when they join the server
 */

async function assignAutoRole(member) {
    try {
        // Get the role ID from environment variable
        const roleId = process.env.AUTO_ROLE_ID;
        
        if (!roleId) {
            console.error('❌ AUTO_ROLE_ID is not set in .env file');
            return;
        }

        // Find the role in the server
        const role = member.guild.roles.cache.get(roleId);
        
        if (!role) {
            console.error(`❌ Role with ID ${roleId} not found in server ${member.guild.name}`);
            return;
        }

        // Assign the role to the new member
        await member.roles.add(role);
        console.log(`✅ Assigned role "${role.name}" to ${member.user.tag} in ${member.guild.name}`);
        
        // Optional: Send a welcome message
        const welcomeChannelId = process.env.WELCOME_CHANNEL_ID;
        if (welcomeChannelId) {
            const welcomeChannel = member.guild.channels.cache.get(welcomeChannelId);
            if (welcomeChannel) {
                await welcomeChannel.send(`Welcome to the server, ${member}! You have been given the ${role.name} role.`);
            }
        }
    } catch (error) {
        console.error(`❌ Error assigning auto-role to ${member.user.tag}:`, error);
        throw error;
    }
}

module.exports = {
    assignAutoRole,
};

