require('dotenv').config();
const Discord = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const TwitterClient = require('twitter-api-sdk').Client;
const {Collection, Client, Events, GatewayIntentBits} = Discord;
const client = new Client({intents:[GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]});

// Begin setting client commands
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}

// Initialize and login
client.once(Events.ClientReady, c=> {
    console.log(`Ready! Logging in as ${c.user.tag}`);
});
client.login(process.env.CLIENT_TOKEN);

// Interaction event handler
client.on(Events.InteractionCreate, async interaction => {
    if(!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);
    if(!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }
    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({content:"There was an error while executing this command!", ephemeral:true})
    }
})

client.on("messageCreate", async message=>{
    try {
        let regex = new RegExp(/(?:^|http)(?:s)?(?:\:\/\/)?(?:www\.)?twitter\.com/, "i");
        if(regex.test(message.content)) {
            const tweetReg = new RegExp(/(?:.*)\/status\/([0-9]+)(?:\?|$| )/, "i");
            let id = message.content.match(tweetReg)[1] ?? false;
            if(!id) { 
                //debugging logic goes here
                return;
            }
            const twitter = new TwitterClient(process.env.TWITTER_BEARER);
            let tweet = await twitter.tweets.findTweetById(id, {"tweet.fields":["attachments", "entities"]});
            if(!tweet.data?.entities?.urls[0]?.expanded_url?.includes("/video")) {
                //debugging logic goes here
                return;
            }
            const {channelId, content, member} = message;
            let fxt = content.replace(/twitter.com/, "fxtwitter.com")
            client.channels.cache.get(channelId).send(`(${member})\n${fxt}`);
            message.delete();      
        }
    } catch(e) {
        console.error(e);
        return;
    }
})