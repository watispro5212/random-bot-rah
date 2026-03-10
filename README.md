# NexusBot

A clean, simple, and unique Discord bot with comprehensive features including economy, casino, leveling, moderation, and fun commands.

## Features

### 🛠️ Utility Commands
- **ping** - Checks the bot's network status and latency metrics
- **info** - Displays information about the bot and the current server
- **serverinfo** - Displays detailed information about the current server
- **userinfo** - Displays detailed information about a user
- **avatar** - Displays a user's avatar in high resolution
- **math** - Evaluates a mathematical expression
- **timer** - Sets a countdown timer

### 💰 Economy System
- **balance** - Check your current account balance and net worth
- **daily** - Claim your 24-hour reward and build streaks
- **work** - Work a random shift to earn some credits
- **rob** - Risk it all and attempt to steal from a user
- **transfer** - Safely transfer credits to another user
- **leaderboard** - Displays the top 10 richest users based on net worth
- **shop** - View the item shop catalog
- **buy** - Buy an item from the shop
- **inventory** - View your purchased items

### 🎰 Casino Games
- **blackjack** - Play a game of Blackjack against the dealer
- **slots** - Bet your credits on the slot machine

### 📊 Leveling System
- **rank** - Displays your current Level and XP progress

### 🔒 Moderation Tools
- **ban** - Ban a user from the server
- **kick** - Kick a user from the server
- **purge** - Bulk delete messages in the current channel
- **lock** - Locks the current channel (@everyone cannot send messages)
- **unlock** - Unlocks the current channel
- **slowmode** - Sets the channel slowmode duration
- **verify-setup** - Drops a verification panel (Admin Only)

### 🎮 Fun Commands
- **8ball** - Ask the Magic 8-Ball a yes/no question
- **coinflip** - Flips a coin returning Heads or Tails
- **roll** - Rolls a die (default 6 sides)
- **rps** - Play Rock, Paper, Scissors against the bot
- **trivia** - Answer a random trivia question

### 🖼️ Media Commands
- **cat** - Fetches a random picture of a cute cat
- **dog** - Fetches a random picture of a cute dog
- **meme** - Fetches a random top meme

## Installation

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with the following variables:
   ```
   TOKEN=your_discord_bot_token
   CLIENT_ID=your_client_id
   GUILD_ID=your_guild_id (optional, for faster development)
   ```

## Usage

### Starting the Bot
```bash
npm start
```

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Deploying Commands
The `deploy-commands.js` script will automatically register all commands from the `src/commands` directory:
```bash
node deploy-commands.js
```

## Project Structure

- `src/commands/` - All bot command files
- `deploy-commands.js` - Script to register commands with Discord
- `package.json` - Project dependencies and scripts

## Dependencies

- **discord.js** (v13.17.1) - Discord API wrapper
- **dotenv** (v16.3.1) - Environment variable management
- **nodemon** (v3.0.1) - Auto-reload for development

## Author

watispro5212, watispro1

## License

This project is open source and available under the MIT License.
