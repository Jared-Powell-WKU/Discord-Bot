const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const fs = require('fs');
const path = require('path');
const tempPath = path.resolve(__dirname, "../json/temp.json");
const commands = {
    setbracket: {
        data: new SlashCommandBuilder()
            .setName("setbracket")
            .addStringOption((option=>option.setName("link").setDescription("Allows moderator to update bracket link").setRequired(true)))
            .setDescription("Updates bracket link")
            .setDefaultMemberPermissions(PermissionsBitField.Flags.ModerateMembers),
            async execute(interaction) {
                var tmpObj = JSON.parse(fs.readFileSync(tempPath).toString())
                tmpObj.bracket = interaction.options.getString("link");
                fs.writeFileSync(tempPath, JSON.stringify(tmpObj));
                await interaction.reply(tmpObj.bracket);
            }
    },
    bracket: {
        data: new SlashCommandBuilder()
            .setName("bracket")
            .setDescription("Retrieves latest bracket"),
            async execute(interaction) {
                var tmpObj = JSON.parse(fs.readFileSync(tempPath).toString())
                if(!tmpObj || !tmpObj.bracket) await interaction.reply("No bracket found")
                else await interaction.reply(tmpObj.bracket)
            }
    }
}
module.exports = Object.keys(commands).map(name=>{return commands[name]});