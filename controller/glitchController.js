const axios = require('axios');
const email = require('../utilities/email');
const methods = require('../utilities/methods');


function emailSendController(request, response) {
    let age
    axios.all([
        axios.get(process.env.userAccount),
        axios.get(process.env.userDetails)
    ])
    .then(
        axios.spread((...accountResponse) => {
        const user = methods.userExist(accountResponse[0].data, request.body.userid)
        if (user.length < 1) {
            return response.status(200).send("You are not registered on our database")
        }

        const userDetails = methods.userMerge(accountResponse[1].data, user)
        age = methods.defineAge(userDetails[0].birthdate)
        if (age >= 10) {
            return response.status(200).send("Sorry your are to old")
        } else if (age.length == 0) {
            return response.status(422).send("Invalid Date Format")
        }

        email.emailSetup(userDetails, request.body.wish)
       
        return response.status(200).send('Username and age is accepted')
        })
    )
}

module.exports = {emailSendController}