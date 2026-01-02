const fs = require('fs');
const path = require('path');
const { REST, Routes } = require('discord.js');

/**
 * Dynamically loads all command files from the commands directory
 * @param {Client} client - The Discord client instance
 */
function loadCommands(client) {
    const commandsPath = path.join(__dirname, '../commands');
    
    if (!fs.existsSync(commandsPath)) {
        console.log('⚠️  Commands directory does not exist');
        client.commands = new Map();
        return;
    }

    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    const commands = [];

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        
        if ('data' in command && 'execute' in command) {
            commands.push(command.data.toJSON());
            if (!client.commands) {
                client.commands = new Map();
            }
            client.commands.set(command.data.name, command);
            console.log(`📝 Loaded command: ${command.data.name}`);
        } else {
            console.log(`⚠️  Command at ${filePath} is missing required "data" or "execute" property.`);
        }
    }

    return commands;
}

/**
 * Registers slash commands with Discord
 * @param {Client} client - The Discord client instance
 */
async function registerCommands(client) {
    const commands = loadCommands(client);
    
    if (commands.length === 0) {
        console.log('⚠️  No commands to register');
        return;
    }

    const rest = new REST().setToken(process.env.DISCORD_BOT_TOKEN);

    try {
        console.log(`🔄 Started refreshing ${commands.length} application (/) commands.`);

        const data = await rest.put(
            Routes.applicationCommands(client.user.id),
            { body: commands },
        );

        console.log(`✅ Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        console.error('❌ Error registering commands:', error);
    }
}

module.exports = { loadCommands, registerCommands };

