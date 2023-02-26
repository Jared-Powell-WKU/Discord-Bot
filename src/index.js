require('dotenv').config();
const Discord = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const {Collection, Client, Events, GatewayIntentBits} = Discord;
const client = new Client({intents:[GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]});
const {fxTwitterMessage} = require('./functions/twitter')
// Begin setting client commands
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if(command.length) {
        command.forEach(c => {
            if('data' in c && 'execute' in c) client.commands.set(c.data.name, c)
        });
    } else {
        if('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
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
        const {content, channelId, member} = message;
        if(member.user.bot) return;
        let isTwitter = new RegExp(/(?:^|http)(?:s)?(?:\:\/\/)?(?:www\.)?twitter\.com/, "i");
        if(isTwitter.test(content)) {
            let fxt = await fxTwitterMessage(content);
            if(!fxt) return;
            client.channels.cache.get(channelId).send(`(${member})\n${fxt}`);
            await message.delete();
        }
    } catch(e) {
        console.error(e);
        return;
    }
})