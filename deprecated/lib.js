const {TESTSERVER} = require('./config');

const logit = (el) => {
    if(TESTSERVER) console.log(el);
}
module.exports = {
    logit,
}