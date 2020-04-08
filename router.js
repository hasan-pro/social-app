const express = require('express');
const router = express.Router();
const userController = require('./controllers/userController');

router.get('/', (req, res) => {
    res.render('home-guest')
});

router.get('/about', userController.home);
router.post('/register', userController.register);
router.post('/login', userController.login)


module.exports = router;