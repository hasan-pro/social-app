const Post = require('../model/Post')

exports.viewCreateScreen = function(req, res) {
    res.render('create-post')
}

exports.create = function(req, res) {
    let post = new Post(req.body, req.session.user._id)
    post.create().then((newId) => {
        req.flash('success', 'New post successfully created.')
        req.session.save(() => res.redirect(`/post/${newId}`))
    }).catch((errors) => {
        errors.forEach((error) => {req.flash('errors', error)})
        req.session.save(() => res.redirect('/create-post'))
    })
}


exports.viewSingle = async function(req, res) {
    try {
        let post = await Post.findSingleByid(req.params.id, req.visitorId)
        res.render('single-post-screen', {post: post})
    } catch {
        res.render('../views/404.ejs')
    }
}

exports.viewEditScreen = async function(req, res) {
  try {
    let post = await Post.findSingleByid(req.params.id)
    if (post.authorId == req.visitorId) {
      res.render('edit-post', {post: post})
    } else {
      req.flash('errors', 'You do not have permisssion to perform that action.')
      req.session.save(() => {
        res.redirect('/')
      })
    }
  } catch {
    res.render('404')
  }
} 

exports.edit = function (req, res) {
  let post = new Post(req.body, req.visitorId, req.params.id)
  post.update().then((status) => {
    // the post was successfully updated in the database
    // or user did have permission but there were validation errors
    if (status === 'success') {
      // post was updated in db
      req.flash('success', 'Post successfully updated.')
      req.session.save(() => {
        res.redirect(`/post/${req.params.id}/edit`)
      })
    } else {
      post.errors.forEach((error) => {
        req.flash('errors', error)
      })
      req.session.save(() => {
        res.redirect(`/post/${req.params.id}/edit`)
      })
    }
  }).catch(() => {
    // a post with requested id doesn't exist
    // or if the current visitor is not owner of the requested post
    req.flash('errors', 'You do not have the permission to perform that action')
    req.session.save(() => {
      res.redirect('/')
    })
  })
}
