const express = require('express');
const router = express.Router()
const productController = require('../controller/glitchController');

router.get('/', (request, response) => {
    response.render('index');
});

router.post('/addGifts', productController.emailSendController)

module.exports = router