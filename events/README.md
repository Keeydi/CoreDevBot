# Events Folder

This folder contains all Discord event handlers.

## How to Add Events

1. Create a new `.js` file (e.g., `messageCreate.js`)
2. Export an object with the following structure:

```javascript
const { Events } = require('discord.js');

module.exports = {
    name: Events.MessageCreate, // The Discord event name
    once: false, // Set to true if you want it to run only once
    async execute(message) {
        // Your event handler code here
    },
};
```

3. The event will be automatically loaded when the bot starts!

## Available Discord Events

- `ClientReady` - Bot is ready
- `GuildMemberAdd` - Member joins server
- `GuildMemberRemove` - Member leaves server
- `MessageCreate` - New message sent
- `MessageDelete` - Message deleted
- `InteractionCreate` - Slash command or button clicked
- And many more! See [Discord.js Events](https://discord.js.org/#/docs/discord.js/stable/class/Client)

