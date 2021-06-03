const nodemailer = require('nodemailer');

function emailSetup(userDetails, message) {
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
        html: "<p>Account Name: "+userDetails[0].username+"</p><p>Address: "+ userDetails[0].address +"</p><p>Message:"+ message +"</p>"
    });
}


module.exports = {emailSetup}