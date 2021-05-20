const axios = require('axios');
const nodemailer = require('nodemailer');
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

function emailSendController(request, response) {
    let age
    axios.all([
        axios.get(process.env.userAccount),
        axios.get(process.env.userDetails)
    ])
    .then(
        axios.spread((...accountResponse) => {
        console.log(request)
        const user = userExist(accountResponse[0].data, request.body.userid)
        if (user.length < 1) {
            return response.send("Not exists", 404)
        }
        const userDetails = userMerge(accountResponse[1].data, user)
        age = defineAge(userDetails[0].birthdate)
        if (age < 10) {
            return response.send("Invalid age", 404)
        }

        let transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.emailUser, // generated ethereal user
                pass: process.env.emailPassword // generated ethereal password
            }
        })
        let emailAccounts = process.env.emailAccount.split(",")
        emailAccounts.forEach(account => {
            let info = transporter.sendMail({
            from: `"${"Glitch"}" <${"glicth@example.com"}>`, // sender address
            to: account, // receiver address
            subject: "User Account Details", // Subject line
            html: "<p>Account Name:"+userDetails.username+"</p><p>Address:"+ userDetails.address +"</p><p>Message:"+ request.body.wish +"</p>"
            });
        });
        return response.send('Username and age is accepted', 200)
        })
    )
}

module.exports = {emailSendController}