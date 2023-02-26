const TwitterClient = require('twitter-api-sdk').Client;

async function fxTwitterMessage(content) {
    const tweetReg = new RegExp(/(?:.*)\/status\/([0-9]+)(?:\?|$| )/, "i");
    let regArr = content.match(tweetReg);
    let id = regArr ? regArr[1] : false;
    if(!id) return false;
    let isVideo = await isTwitterVideo(id);
    if(!isVideo) return false;
    return content.replaceAll(/twitter.com/g, "fxtwitter.com")
}

async function isTwitterVideo(tweetId) {
    const twitter = new TwitterClient(process.env.TWITTER_BEARER);
    let tweet = await twitter.tweets.findTweetById(tweetId, {"tweet.fields":["attachments", "entities"]});
    return (tweet.data?.entities?.urls[0]?.expanded_url?.includes("/video") ?? false);
}

exports.fxTwitterMessage = fxTwitterMessage;