const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');
const dotenv = require('dotenv');

// Load environment variables from a .env file
dotenv.config();

const TOKEN = process.env.TOKEN;
const WEBHOOK_URL = process.env.WEBHOOK_URL;
const LISTEN_CHANNELS = ['932299781903101952']; // Replace with your target channel IDs as strings

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.once('clientReady', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

// Event handler for new messages
client.on('messageCreate', async message => {
    // Ignore the bot's own messages to prevent a loop
    if (message.author.bot) return;

    // Check if the message is in one of the listened channels
    if (LISTEN_CHANNELS.includes(message.channel.id)) {
        try {
            // Create the payload for the webhook
            const payload = {
                channel_id: message.channel.id,
                chat_message: message.content,
                timestamp: message.createdAt.toISOString(),
                message_id: message.id,
                user_id: message.author.id
            };

            const headers = {
                'Content-Type': 'application/json'
            };

            // Send the payload to the webhook
            const response = await axios.post(WEBHOOK_URL, payload, { headers });

            // Log the success or failure
            if (response.status === 200) {
                console.log(`Message sent successfully: ${JSON.stringify(payload)}`);
            } else {
                console.log(`Failed to send message: ${response.status}, Response: ${response.data}`);
            }
        } catch (error) {
            // Handle any errors during the request
            console.error(`Error sending message: ${error.message}`);
        }
    }
});

// Log in to Discord with your bot's token
client.login(TOKEN);