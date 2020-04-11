const User = require('../model/User')

exports.login = function(req, res) {
    let user = new User(req.body)
    user.login().then(result => {
        req.session.user = {favColor: 'blue', username: user.data.username}
        req.session.save(() => {
            res.redirect('/')
        })
    }).catch(e => {
        req.flash('errors', e)
        req.session.save(() => {
            res.redirect('/')
        })
    })
}


exports.logout = function(req, res) {
    req.session.destroy(() => {
        res.redirect('/')
    })
}


exports.register = function(req, res) {
    let user = new User(req.body)
    user.register().then(() => {
        req.session.user = {username: this.data.username}
        req.session.save(() => {
            res.redirect('/')
        })
    }).catch((regErrors) => {
        user.errors.forEach(error => {
            req.flash('regErrors', error);
        })
        req.session.save(() => {
            res.redirect('/')
        })
    })
}


exports.home = function(req, res) {
    if (req.session.user) {
        res.render('home-dashboard', {username: req.session.user.username})
    } else {
        res.render('home-guest', {errors: req.flash('errors'), regErrors: req.flash('regErrors')})
    }
}


