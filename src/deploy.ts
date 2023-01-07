import { Command, getCommandFromFile } from "./interfaces/command";

const { REST, Routes } = require('discord.js');
require('dotenv').config();
const fs = require('node:fs');

const commands:object[] = [];
// Grab all the command files from the commands directory you created earlier
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
for (const file of commandFiles) {
	const command = getCommandFromFile(require(`./commands/${file}`));
    if(command) commands.push(command.data.toJSON());
    else console.error(`${file} was unable to compile as Command`);
}

// Construct and prepare an instance of the REST module
const rest = new REST({ version: '10' }).setToken(process.env.CLIENT_TOKEN);

// and deploy your commands!
(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
			{ body: commands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();