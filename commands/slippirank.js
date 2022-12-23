const { SlashCommandBuilder } = require('discord.js');
const {request, gql} = require('graphql-request')
module.exports = {
    data: new SlashCommandBuilder()
        .setName('rank')
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
        const vars = {cc:interaction.options.getString("code")}
        const url = "https://gql-gateway-dot-slippi.uc.r.appspot.com/graphql";
        let res = await request(url, query, vars);
        let user = res.getConnectCode.user;
        let msg = `${user.displayName}: ${user.rankedNetplayProfile.ratingOrdinal}. Wins: ${user.rankedNetplayProfile.wins}, Losses: ${user.rankedNetplayProfile.losses}`
        await interaction.reply(msg);
    }
}