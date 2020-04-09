const User = require('../model/User')

exports.login = function(req, res) {
    let user = new User(req.body)
    user.login().then(result => {
        req.session.user = {favColor: 'blue', username: user.data.username}
        res.send(result)
    }).catch(e => {
        res.send(e)
    })
}


exports.logout = function(req, res) {
    req.session.destroy()
    res.send('You are now logged out.')
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
        res.render('home-guest')
    }
}


