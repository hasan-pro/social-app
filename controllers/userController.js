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
        // for example it's goint to add masseage to 
        // req.session.user.flash.errors = [e]
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
    user.register()

    if (user.errors.length) {
        res.send(user.errors)
    } else {
        res.send('Congrats!')
    }
}


exports.home = function(req, res) {
    if (req.session.user) {
        res.render('home-dashboard', {username: req.session.user.username})
    } else {
        res.render('home-guest', {errors: req.flash('error')})
    }
}


