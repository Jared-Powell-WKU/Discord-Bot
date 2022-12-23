const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Provides response'),
    async execute(interaction) {
        await interaction.reply("PONG");
    }
}