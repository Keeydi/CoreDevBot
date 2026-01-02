# Commands Folder

This folder contains slash commands or message commands.

## Slash Commands

Create a new `.js` file for each command:

```javascript
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!'),
    async execute(interaction) {
        await interaction.reply('Pong!');
    },
};
```

## Message Commands

For prefix-based commands:

```javascript
module.exports = {
    name: 'ping',
    description: 'Replies with Pong!',
    async execute(message, args) {
        await message.reply('Pong!');
    },
};
```

## Command Loading

Commands can be loaded dynamically using a similar pattern to events.
Create a `utils/loadCommands.js` file to auto-load commands.

