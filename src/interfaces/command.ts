import { ApplicationCommandOption, ChatInputCommandInteraction, CacheType, SlashCommandBuilder } from "discord.js"

export interface Command {
    data: SlashCommandBuilder; 
    execute(interaction: ChatInputCommandInteraction<CacheType>):void;
}

export function getCommandFromFile(file:any):Command|null {
    let {data, execute} = file;
    try {
        return {
            data:data,
            execute:execute
        }
    } catch(e) {
        console.error(`Unable to create command from file ${file}.`, e);
        return null;
    }
}