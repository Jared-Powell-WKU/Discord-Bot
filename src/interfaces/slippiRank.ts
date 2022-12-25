import {slippiRankUrl} from '../assets/config.json'

const {request} = require('graphql-request')
export interface SlippiRank {
    connectCode: string;
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
    let title = getTitle(user.rankedNetplayProfile);
    return {
        connectCode:connectCode,
        title:title,
        elo:user.rankedNetplayProfile.ratingOrdinal,
        wins:user.rankedNetplayProfile.wins ?? 0,
        losses:user.rankedNetplayProfile.losses ?? 0
    }
}

function getTitle(netplayProfile) {
    if(netplayProfile.ratingUpdateCount < 5) return "Unranked";
    let title:string;
    let rank:number = netplayProfile.ratingOrdinal;
    if(rank >= 2350) return "Master 3";
    if(rank >= 2275) return "Master 2";
    if(rank >= 2191.75) return "Master 1";
    // change to ifs
        switch(true) {
            case rank >= 2350:
                title = "Master 3"
                break;
            case rank >= 2275:
                title = "Master 2"
                break;
            case rank >= 2191.75:
                title = "Master 1"
                break;
            case rank >= 2136.28:
                title = "Diamond 3"
                break;
            case rank >= 2073.67:
                title = "Diamond 2"
                break;
            case rank >= 2003.92:
                title = "Diamond 1"
                break;
            case rank >= 1927.03:
                title = "Platinum 3"
                break;
            case rank >= 1843:
                title = "Platinum 2"
                break;
            case rank >= 1751.83:
                title = "Platinum 1"
                break;
            case rank >= 1653.52:
                title = "Gold 3"
                break;
            case rank >= 1548.07:
                title = "Gold 2"
                break;
            case rank >= 1435.48:
                title = "Gold 1"
                break;
            case rank >= 1315.75:
                title = "Silver 3"
                break;
            case rank >= 1188.88:
                title = "Silver 2"
                break;
            case rank >= 1054.87:
                title = "Literally anything but Silver 1"
                break;
            case rank >= 913.72:
                title = "Bronze 3"
                break;
            case rank >= 765.43:
                title = "Bronze 2"
                break;
            case rank > 0:
                title = "Bronze 1"
                break;
            default:
                title = "Unranked"
        }
        return title;
}