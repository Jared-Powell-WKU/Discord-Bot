import {slippiRankUrl} from '../assets/config.json'

const {request} = require('graphql-request')
export interface SlippiRank {
    connectCode: string;
    displayName: string;
    title: string;
    elo: number;
    wins: number;
    losses: number;
}

export async function getSlippiRankFromConnectCode(
    connectCode:string
): Promise<SlippiRank> {
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
    let res = await request(slippiRankUrl, query, {cc:connectCode});
    let user = res.getConnectCode.user;
    let title = getTitleFromSlpResponse(user.rankedNetplayProfile);
    return {
        connectCode:connectCode,
        displayName:user.displayName,
        title:title,
        elo:user.rankedNetplayProfile.ratingOrdinal,
        wins:user.rankedNetplayProfile.wins ?? 0,
        losses:user.rankedNetplayProfile.losses ?? 0
    }
}

function getTitleFromSlpResponse(netplayProfile) {
    if(netplayProfile.ratingUpdateCount < 5) return "Unranked";
    let title:string;
    let rank:number = netplayProfile.ratingOrdinal;
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