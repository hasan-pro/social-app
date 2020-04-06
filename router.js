const express = require('express');
const router = express.Router();
const userController = require('./controllers/userController');

router.get('/', (req, res) => {
    res.render('home-guest')
});

router.get('/about', userController.home)



module.exports = router;