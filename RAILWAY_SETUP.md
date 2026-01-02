# 🚂 Railway Deployment Guide

Complete step-by-step guide to deploy your CoreDev Discord Bot on Railway.

## 📋 Prerequisites

- ✅ GitHub account
- ✅ Railway account (sign up at [railway.app](https://railway.app))
- ✅ Discord bot token from [Discord Developer Portal](https://discord.com/developers/applications)

---

## 🚀 Quick Deployment Steps

### Step 1: Push Code to GitHub

1. Initialize git (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Railway ready"
   ```

2. Create a new repository on GitHub

3. Push your code:
   ```bash
   git remote add origin https://github.com/yourusername/your-repo.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Deploy on Railway

1. **Sign up/Login to Railway**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub (recommended)

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Railway will automatically detect it's a Node.js project

3. **Configure Environment Variables**
   - Click on your service
   - Go to "Variables" tab
   - Click "New Variable" and add each of these:

   ```
   DISCORD_BOT_TOKEN=your_bot_token_here
   AUTO_ROLE_ID=your_role_id_here
   TICKET_CATEGORY_ID=1456583891568558142
   SUPPORT_ROLE_ID=1411885432702111767
   TRANSCRIPT_CATEGORY_ID=1456585966935478355
   ```

   **Important:** 
   - Replace `your_bot_token_here` with your actual bot token
   - Replace `your_role_id_here` with your actual role ID
   - No quotes, no spaces around the `=`

4. **Deploy**
   - Railway will automatically start deploying
   - Watch the build logs in the "Deployments" tab
   - Wait for "Deploy successful" message

---

## 🔧 Railway Configuration

### Environment Variables

Railway will automatically use the variables you set. You can also use **Shared Variables** for multiple services:

1. Go to your project dashboard
2. Click "Variables" in the sidebar
3. Click "New Variable" to create shared variables
4. Reference them in services using `${{VARIABLE_NAME}}`

### Service Settings

- **Start Command:** `npm start` (automatically detected)
- **Build Command:** `npm install` (automatically detected)
- **Node Version:** 18+ (specified in package.json)

---

## 📊 Monitoring Your Bot

### View Logs

1. Click on your service in Railway dashboard
2. Go to "Deployments" tab
3. Click on the latest deployment
4. View real-time logs

### Check Bot Status

Look for these messages in logs:
- ✅ `Bot is ready! Logged in as [Bot Name]`
- ✅ `Loaded event: ClientReady`
- ✅ `Successfully reloaded X application (/) commands`

---

## 🔄 Updating Your Bot

### Automatic Updates (Recommended)

1. Push changes to your GitHub repository
2. Railway automatically detects changes
3. Triggers new deployment
4. Bot restarts with new code

### Manual Redeploy

1. Go to your service in Railway
2. Click "Deployments" tab
3. Click "Redeploy" on latest deployment

---

## 🐛 Troubleshooting

### Bot Not Starting

1. **Check Logs**
   - Go to Railway dashboard → Your service → Deployments
   - Click on latest deployment
   - Look for error messages

2. **Common Issues:**
   - ❌ `TokenInvalid` → Check `DISCORD_BOT_TOKEN` is set correctly
   - ❌ `Module not found` → Check `package.json` dependencies
   - ❌ `Port already in use` → Railway handles this automatically

### Environment Variables Not Working

1. **Verify Variables are Set**
   - Go to Variables tab
   - Make sure all required variables are present
   - Check for typos in variable names

2. **Restart Service**
   - After adding/changing variables, redeploy the service
   - Variables are loaded at startup

### Bot Goes Offline

1. **Check Railway Status**
   - Visit [status.railway.app](https://status.railway.app)
   - Check for service issues

2. **Check Usage Limits**
   - Free tier: $5 credit/month
   - Check usage in Railway dashboard
   - Upgrade if needed

3. **View Logs**
   - Check for crash errors
   - Look for "Restarting" messages

---

## 💰 Railway Pricing

### Free Tier
- $5 credit/month
- Perfect for small Discord bots
- Auto-sleeps after inactivity (wakes on activity)

### Paid Plans
- Hobby: $5/month + usage
- Pro: $20/month + usage
- Team: Custom pricing

**For Discord bots:** Free tier is usually sufficient!

---

## 🔐 Security Best Practices

1. **Never commit `.env` file**
   - Already in `.gitignore`
   - Use Railway Variables instead

2. **Use Shared Variables**
   - For multiple services
   - Easier to manage

3. **Rotate tokens regularly**
   - Reset bot token in Discord Developer Portal
   - Update in Railway Variables

---

## 📝 Railway-Specific Features

### Custom Domain
- Add custom domain in Railway settings
- Not needed for Discord bots (but available)

### Health Checks
- Railway automatically monitors your service
- Restarts on failure

### Metrics
- View CPU, Memory usage
- Monitor deployment history

---

## ✅ Deployment Checklist

Before deploying, make sure:

- [ ] Code is pushed to GitHub
- [ ] All environment variables are set in Railway
- [ ] Bot token is valid and not expired
- [ ] Required intents are enabled in Discord Developer Portal
- [ ] Bot is invited to your Discord server
- [ ] Bot has proper permissions in server

---

## 🎉 Success!

Once deployed, you should see:
- ✅ Bot online in Discord
- ✅ Commands working
- ✅ Auto-role assigning
- ✅ Ticket system functional

Your bot is now running 24/7 on Railway! 🚀

---

## 📚 Additional Resources

- [Railway Documentation](https://docs.railway.app/)
- [Railway Discord](https://discord.gg/railway)
- [Discord.js Guide](https://discordjs.guide/)

---

## 🆘 Need Help?

1. Check Railway logs for errors
2. Verify all environment variables are set
3. Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
4. Visit Railway Discord for support

