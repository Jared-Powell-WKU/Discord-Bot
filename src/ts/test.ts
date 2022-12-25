import {getSlippiRankFromConnectCode} from '../interfaces/slippiRank'

async function main() {
    try{
    let profile = await getSlippiRankFromConnectCode("MEW#420");
    console.log(profile);
    } catch(e) {
        console.error(e);
    }
}
main();