/**
 * Configuration Example File
 * Copy this to config.js and fill in your values
 * Or use .env file for sensitive data
 */

module.exports = {
    // Bot Settings
    prefix: '!', // Command prefix (if using message commands)
    
    // Auto-Role Settings
    autoRole: {
        enabled: true,
        roleId: process.env.AUTO_ROLE_ID || 'your_role_id_here',
    },
    
    // Welcome Message Settings
    welcome: {
        enabled: false,
        channelId: process.env.WELCOME_CHANNEL_ID || null,
        message: 'Welcome {user} to {server}!',
    },
    
    // Add more configuration options as needed
};

