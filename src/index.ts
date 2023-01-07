import { getCommandFromFile } from "./interfaces/command";

require('dotenv').config();
const Discord = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const {Collection, Client, Events} = Discord;
const client = new Client({
    intents: ["Guilds", "GuildMessages", "DirectMessages"],
})

// Begin setting client commands
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = getCommandFromFile(require(filePath));
    if(command) client.commands.set(command.data.name, command);
    else console.log(`[WARNING] The command at ${filePath} was unable to successfully be set.`);
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