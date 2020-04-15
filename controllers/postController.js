const Post = require('../model/Post')

exports.viewCreateScreen = function(req, res) {
    res.render('create-post')
}

exports.create = function(req, res) {
    let post = new Post(req.body)
    post.create().then(() => {
        res.send('Created post success.')
    }).catch((errors) => {
        res.send(errors)
    })
}