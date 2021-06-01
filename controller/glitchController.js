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
        const user = userExist(accountResponse[0].data, request.body.userid)
        if (user.length < 1) {
            return response.status(200).send("You are not registered on our database")
        }

        const userDetails = userMerge(accountResponse[1].data, user)
        age = defineAge(userDetails[0].birthdate)
        if (age >= 10) {
            return response.status(200).send("Sorry your are to old")
        } else if (age.length == 0) {
            return response.status(422).send("Invalid Date Format")
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
            let info = transporter.sendMail({
            from: `"${"Glitch"}" <${process.env.emailSender}>`, // sender address
            to: process.env.emailSent, // receiver address
            subject: "User Account Details", // Subject line
            html: "<p>Account Name: "+userDetails[0].username+"</p><p>Address: "+ userDetails[0].address +"</p><p>Message:"+ request.body.wish +"</p>"
            });
        return response.status(200).send('Username and age is accepted')
        })
    )
}

module.exports = {emailSendController}