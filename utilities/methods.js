const _ = require('lodash');

function defineAge(birthday) {
    birthday = + new Date(birthday);
    const yearLength = 24 * 3600 * 365.25 * 1000
    return ~~((Date.now() - birthday) / (yearLength));
}
  
function userExist(user, userID) {
    return _.filter(user, x => x.username === userID)
}

function userMerge(userDetails, user) {
    userDetails = _.filter(userDetails, x => x.userUid === user[0].uid)
    userDetails[0]["username"] = user[0].username
    return userDetails
}

module.exports = {defineAge, userExist, userMerge}