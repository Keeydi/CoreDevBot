# 🚀 Discord Bot Deployment Guide

This guide covers various hosting options to keep your Discord bot online 24/7.

## 📋 Prerequisites

Before deploying, make sure you have:
- ✅ Your `.env` file configured with all required values
- ✅ Your bot token from Discord Developer Portal
- ✅ Node.js 16.9.0 or higher

---

## 🌟 Recommended Free Hosting Options

### 1. **Railway** (⭐ Easiest & Recommended)

**Pros:**
- Free tier with $5 credit/month
- Very easy setup
- Automatic deployments from GitHub
- Built-in environment variables
- Great for beginners
- Auto-detects Node.js projects

**Steps:**
1. Push your code to GitHub
2. Go to [railway.app](https://railway.app)
3. Sign up with GitHub
4. Click "New Project" → "Deploy from GitHub repo"
5. Select your repository
6. Railway auto-detects Node.js and starts building
7. Add environment variables in the "Variables" tab:
   - `DISCORD_BOT_TOKEN`
   - `AUTO_ROLE_ID`
   - `TICKET_CATEGORY_ID`
   - `SUPPORT_ROLE_ID`
   - `TRANSCRIPT_CATEGORY_ID`
8. Railway automatically runs `npm start`

**📖 Detailed Guide:** See [RAILWAY_SETUP.md](./RAILWAY_SETUP.md) for complete step-by-step instructions

**Cost:** Free tier available ($5 credit/month)

---

### 2. **Render** (⭐ Great Free Tier)

**Pros:**
- Free tier available
- Easy setup
- Auto-deploy from GitHub
- Good documentation

**Steps:**
1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Click "New" → "Web Service"
4. Connect your GitHub repository
5. Configure:
   - **Name:** `coredev-bot` (or any name)
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `node index.js`
6. Add environment variables in "Environment" section
7. Click "Create Web Service"

**Note:** Free tier spins down after 15 minutes of inactivity. Use a ping service to keep it alive.

**Cost:** Free tier available

---

### 3. **Fly.io** (⭐ Good Free Tier)

**Pros:**
- Generous free tier
- Global edge deployment
- Good performance

**Steps:**
1. Install Fly CLI: `npm install -g @fly/cli`
2. Sign up at [fly.io](https://fly.io)
3. Run `fly launch` in your project directory
4. Follow the prompts
5. Set secrets: `fly secrets set DISCORD_BOT_TOKEN=your_token`
6. Deploy: `fly deploy`

**Cost:** Free tier available

---

### 4. **Replit** (⚠️ Not Recommended for 24/7)

**Pros:**
- Very easy to use
- Free tier

**Cons:**
- Free tier stops after inactivity
- Not ideal for 24/7 bots

**Steps:**
1. Go to [replit.com](https://replit.com)
2. Create new Repl → "Node.js"
3. Upload your files
4. Add secrets in "Secrets" tab
5. Run the bot

**Cost:** Free (but not reliable for 24/7)

---

## 💰 Paid Options (More Reliable)

### 5. **DigitalOcean Droplet**

**Pros:**
- Full control
- Very reliable
- $4/month for basic droplet

**Steps:**
1. Create account at [digitalocean.com](https://digitalocean.com)
2. Create a Droplet (Ubuntu 22.04)
3. SSH into your server
4. Install Node.js: `curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - && sudo apt-get install -y nodejs`
5. Clone your repo: `git clone <your-repo-url>`
6. Install dependencies: `npm install`
7. Create `.env` file
8. Use PM2 to keep it running: `npm install -g pm2 && pm2 start index.js --name discord-bot`
9. Save PM2: `pm2 save && pm2 startup`

**Cost:** $4-6/month

---

### 6. **AWS EC2 / Lightsail**

**Pros:**
- Very reliable
- Scalable
- Free tier available (limited)

**Steps:**
1. Create AWS account
2. Launch EC2 instance (Ubuntu)
3. SSH and follow similar steps as DigitalOcean

**Cost:** Free tier available, then pay-as-you-go

---

## 🔧 Keeping Your Bot Online

### Using PM2 (Recommended for VPS)

```bash
# Install PM2 globally
npm install -g pm2

# Start your bot
pm2 start index.js --name discord-bot

# Make it start on server reboot
pm2 save
pm2 startup

# Useful commands
pm2 list          # View running processes
pm2 logs discord-bot  # View logs
pm2 restart discord-bot  # Restart bot
pm2 stop discord-bot    # Stop bot
```

### Using systemd (Linux VPS)

Create `/etc/systemd/system/discord-bot.service`:

```ini
[Unit]
Description=CoreDev Discord Bot
After=network.target

[Service]
Type=simple
User=your-username
WorkingDirectory=/path/to/your/bot
ExecStart=/usr/bin/node index.js
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

Then:
```bash
sudo systemctl enable discord-bot
sudo systemctl start discord-bot
```

---

## 📝 Environment Variables Setup

Make sure to set these in your hosting platform:

```
DISCORD_BOT_TOKEN=your_bot_token
AUTO_ROLE_ID=your_role_id
TICKET_CATEGORY_ID=your_category_id
SUPPORT_ROLE_ID=your_support_role_id
TRANSCRIPT_CATEGORY_ID=your_transcript_category_id
WELCOME_CHANNEL_ID=your_welcome_channel_id (optional)
```

---

## 🎯 Quick Start Recommendation

**For Beginners:** Use **Railway** or **Render**
- Easiest setup
- Free tier available
- Auto-deploy from GitHub

**For Production:** Use **DigitalOcean** or **AWS**
- More reliable
- Full control
- Better performance

---

## ⚠️ Important Notes

1. **Never commit your `.env` file** - Always use environment variables in your hosting platform
2. **Keep your bot token secret** - Don't share it publicly
3. **Monitor your bot** - Check logs regularly
4. **Backup your code** - Use GitHub for version control
5. **Test locally first** - Make sure everything works before deploying

---

## 🆘 Troubleshooting

### Bot goes offline
- Check logs in your hosting platform
- Verify environment variables are set correctly
- Check if your hosting service has usage limits

### Bot not responding
- Check if the bot is online in Discord
- Verify intents are enabled in Discord Developer Portal
- Check console logs for errors

---

## 📚 Additional Resources

- [Discord.js Guide](https://discordjs.guide/)
- [Railway Documentation](https://docs.railway.app/)
- [Render Documentation](https://render.com/docs)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/)


