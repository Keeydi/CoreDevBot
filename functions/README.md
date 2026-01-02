# Functions Folder

This folder contains reusable bot functions and features.

## How to Add Functions

1. Create a new `.js` file (e.g., `moderation.js`)
2. Export your functions:

```javascript
module.exports = {
    banUser: async (member, reason) => {
        // Your function code
        return result;
    },
    
    kickUser: async (member, reason) => {
        // Another function
    },
};
```

3. Import and use in your events or commands:

```javascript
const { banUser } = require('../functions/moderation');
await banUser(member, 'Spamming');
```

## Function Organization

Each file should represent a related group of functions:
- `autoRole.js` - Auto-role related functions
- `ticketSystem.js` - Support ticket system (create/close tickets)
- `moderation.js` - Moderation commands (ban, kick, mute)
- `utility.js` - Utility functions (cleanup, formatting)
- `music.js` - Music bot functions
- etc.

## Current Functions

### ticketSystem.js
- `createTicketChannel(member, categoryId, supportId)` - Creates a private ticket channel
- `closeTicketChannel(channel, member)` - Closes and deletes a ticket channel
