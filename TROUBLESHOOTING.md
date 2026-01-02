# 🔧 Troubleshooting Guide

## Common Errors and Solutions

### ❌ Error: "An invalid token was provided" / TokenInvalid

**Symptoms:**
```
Error [TokenInvalid]: An invalid token was provided.
```

**Causes & Solutions:**

1. **Token not set in environment variables**
   - ✅ **Solution:** Make sure `DISCORD_BOT_TOKEN` is set in your hosting platform
   - For Railway: Go to your project → Variables tab → Add `DISCORD_BOT_TOKEN`
   - For Render: Go to your service → Environment → Add `DISCORD_BOT_TOKEN`
   - For local: Create `.env` file with `DISCORD_BOT_TOKEN=your_token`

2. **Token is incorrect or expired**
   - ✅ **Solution:** Get a fresh token from [Discord Developer Portal](https://discord.com/developers/applications)
   - Go to your application → Bot → Reset Token
   - Copy the new token and update it in your environment variables

3. **Token has extra spaces or quotes**
   - ✅ **Solution:** Make sure there are no spaces or quotes around the token
   - ❌ Wrong: `DISCORD_BOT_TOKEN="your_token_here"`
   - ✅ Correct: `DISCORD_BOT_TOKEN=your_token_here`

4. **.env file not being loaded**
   - ✅ **Solution:** Make sure `.env` file exists in the root directory
   - Check that `require('dotenv').config()` is at the top of `index.js`

---

### ❌ Error: "Missing Permissions" / Cannot assign roles

**Symptoms:**
- Bot doesn't assign auto-role
- Bot can't create ticket channels

**Solutions:**

1. **Check bot permissions in Discord**
   - ✅ Bot needs "Manage Roles" permission
   - ✅ Bot's role must be above the role it's trying to assign
   - ✅ Invite bot with proper permissions: `applications.commands` and `bot` scopes

2. **Check intents are enabled**
   - ✅ Go to Discord Developer Portal → Your Application → Bot
   - ✅ Enable "Server Members Intent" under Privileged Gateway Intents
   - ✅ Enable "Message Content Intent" if using message commands

---

### ❌ Error: "Cannot read property 'cache' of undefined"

**Symptoms:**
- Bot crashes when trying to access guild data

**Solutions:**

1. **Make sure bot is in the server**
   - ✅ Invite bot to your server first
   - ✅ Check bot appears in member list

2. **Check intents are enabled**
   - ✅ Enable "Server Members Intent" in Developer Portal

---

### ❌ Bot goes offline / Stops responding

**Solutions:**

1. **Check hosting platform logs**
   - Railway: View logs in dashboard
   - Render: Check logs in service page
   - VPS: Check with `pm2 logs discord-bot`

2. **Check for errors in logs**
   - Look for error messages
   - Check if token is still valid

3. **Restart the bot**
   - Railway: Click "Redeploy"
   - Render: Click "Manual Deploy"
   - VPS: `pm2 restart discord-bot`

---

### ❌ Commands not working / Slash commands not appearing

**Solutions:**

1. **Wait for command registration**
   - Commands can take up to 1 hour to appear globally
   - Or restart Discord client

2. **Check command registration**
   - Look for "Successfully reloaded X application (/) commands" in logs
   - If not appearing, check bot has `applications.commands` scope

3. **Re-register commands**
   - Restart the bot to re-register commands
   - Commands are registered when bot starts

---

### ❌ Environment Variables Not Working

**Symptoms:**
- Variables work locally but not in deployment

**Solutions:**

1. **Check variable names**
   - ✅ Must be exact match (case-sensitive)
   - ✅ No spaces around `=`

2. **Check hosting platform**
   - ✅ Railway: Variables tab in project settings
   - ✅ Render: Environment section in service settings
   - ✅ Make sure to save/apply changes

3. **Restart after adding variables**
   - ✅ Most platforms require restart to load new variables

---

### ❌ Module not found errors

**Symptoms:**
```
Error: Cannot find module 'discord.js'
```

**Solutions:**

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Check package.json exists**
   - ✅ Make sure `package.json` is in root directory

3. **Check hosting platform**
   - ✅ Railway/Render should auto-install, but check build logs
   - ✅ Make sure `npm install` runs during deployment

---

## 🆘 Getting Help

If you're still having issues:

1. **Check the logs** - Most errors will show in console/logs
2. **Verify your setup** - Double-check all environment variables
3. **Test locally first** - Make sure it works on your computer
4. **Check Discord.js version** - Make sure you're using v14+

## 📝 Quick Checklist

Before deploying, make sure:
- ✅ Bot token is set correctly
- ✅ All required intents are enabled
- ✅ Bot is invited to server with proper permissions
- ✅ Bot's role is above roles it needs to manage
- ✅ Environment variables are set in hosting platform
- ✅ Dependencies are installed (`npm install`)
- ✅ Code is pushed to GitHub (if using auto-deploy)

