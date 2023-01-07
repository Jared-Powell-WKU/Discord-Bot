import { Command } from "../interfaces/command";
import { SlashCommandBuilder } from "discord.js";
import { getSlippiRankFromConnectCode } from "../interfaces/slippiRank";


export const getSlippiRank:Command = {
    data: new SlashCommandBuilder()
    .setName("rank")
    .setDescription("Provides Slippi Rank")
    .addStringOption(option=>option.setName('code').setDescription("Slippi Code").setRequired(true)),
    async execute(interaction) {
        let code:string = interaction.options.getString("code") ?? "";
        if(code == "") return; 
        let profile = await getSlippiRankFromConnectCode(code);
        let msg = `${profile.displayName}: ${Math.round(profile.elo)} (${profile.title})\nWins: ${profile.wins}, Losses: ${profile.losses}`;
        await interaction.reply(msg);
    }
}