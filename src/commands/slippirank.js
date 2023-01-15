const { SlashCommandBuilder } = require('discord.js');
const {request, gql} = require('graphql-request')
module.exports = {
    data: new SlashCommandBuilder()
        .setName('slp')
        .setDescription('Provides Slippi Rank')
        .addStringOption(option=>option.setName('code').setDescription("Slippi Code").setRequired(true)),
    async execute(interaction) {
        const query = `fragment userProfilePage on User {
            fbUid
            email
            displayName
            connectCode {
                code
                    __typename
                }
            status
            activeSubscription {
                level
                hasGiftSub
                __typename
                }
            rankedNetplayProfile {
                id
                ratingOrdinal
                ratingUpdateCount
                wins
                losses
                dailyGlobalPlacement
                dailyRegionalPlacement
                continent
                characters {
                    id
                    character
                    gameCount
                    __typename
                    }
                __typename
                }
                __typename
        }
        query AccountManagementPageQuery($cc: String!) {
            getConnectCode(code: $cc) {
                user {
                    ...userProfilePage
                    __typename
                    }
            __typename
            }
        }`;
        const code = interaction.options.getString("code");
        let codeReg = new RegExp(/[a-zA-Z]+#[0-9]+/)
        if(!codeReg.test(code)) {
            await interaction.reply(`Code "${code}" is an invalid connect code.`);
            return;
        }

        const vars = {cc:code.toUpperCase()}
        const url = "https://gql-gateway-dot-slippi.uc.r.appspot.com/graphql";
        try {
            let res = await request(url, query, vars);
            let user = res.getConnectCode?.user;
            if(!user) {
                interaction.reply(`There was not a user found with code ${code}.`);
                return;
            }
            let title = getTitleFromSlpResponse(user.rankedNetplayProfile);
            let msg = `${user.displayName}: ${Math.round(user.rankedNetplayProfile.ratingOrdinal)} (${title})\nWins: ${user.rankedNetplayProfile.wins || "0"}, Losses: ${user.rankedNetplayProfile.losses || "0"}`
            await interaction.reply(msg);
        } catch(e) {
            console.error("Error communicating with Slippi servers", e);
            interaction.reply("There was a problem communicating with Slippi servers. Ensure that you've typed the user's code correctly.");
        }
    }
}

function getTitleFromSlpResponse(netplayProfile) {
    if(netplayProfile.ratingUpdateCount < 5) return "Unranked";
    if(netplayProfile.dailyRegionalPlacement) return "Grandmaster";
    let rank = netplayProfile.ratingOrdinal;
    if(rank >= 2350) return "Master 3";
    if(rank >= 2275) return "Master 2";
    if(rank >= 2191.75) return "Master 1";
    if(rank >= 2136.28) return  "Diamond 3";
    if(rank >= 2073.67) return "Diamond 2";
    if(rank >= 2003.92) return "Diamond 1";
    if(rank >= 1927.03) return "Platinum 3";
    if(rank >= 1843) return "Platinum 2";
    if(rank >= 1751.83) return "Platinum 1";
    if(rank >= 1653.52) return "Gold 3";
    if(rank >= 1548.07) return "Gold 2";
    if(rank >= 1435.48) return "Gold 1";
    if(rank >= 1315.75) return "Silver 3";
    if(rank >= 1188.88) return "Silver 2";
    if(rank >= 1054.87) return "Silver 1";
    if(rank >= 913.72) return "Bronze 3";
    if(rank >= 765.43) return "Bronze 2";
    return "Bronze 1";
}