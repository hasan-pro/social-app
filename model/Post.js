const postsCollection = require('../db').db().collection('posts')
const ObjectId = require('mongodb').ObjectId
const sanitizeHTML = require('sanitize-html')
const User = require('./User')

let Post = function(data, userid, requestedPostId) {
    this.data = data
    this.errors = []
    this.userid = userid
    this.requestedPostId = requestedPostId
}

Post.prototype.cleanUP = function() {
    if (typeof (this.data.title) !== "string") {this.data.title = ""}
    if (typeof (this.data.body) !== "string") {this.data.body = ""}

    // get rid of any bogus properties
    this.data = {
        title: sanitizeHTML(this.data.title.trim(), {allowedTags: [], allowedAttributes: {}}),
        body: sanitizeHTML(this.data.body.trim(), {allowedTags: [], allowedAttributes: {}}),
        createdDate: new Date(),
        author: ObjectId(this.userid)
    }
}

Post.prototype.validate = function() {
    if (this.data.title === "") {this.errors.push('You must provide a title.')}
    if (this.data.body === "") {this.errors.push('You must provide post content.')}
}

Post.prototype.create = function() {
    return new Promise((resolve, reject) => {
        this.cleanUP()
        this.validate()

        if (!this.errors.length) {
            // Save post into database
            postsCollection.insertOne(this.data).then((info) => {
                resolve(info.ops[0]._id)
            }).catch(() => {
                this.errors.push('Please try again leter.')
                reject(this.errors)
            })
        } else {
            reject(this.errors)
        }
    })
}


Post.prototype.update = function() {
  return new Promise(async (resolve, reject) => {
    try {
      let post = await Post.findSingleByid(this.requestedPostId, this.userid)
      if (post.isVisitorOwner) {
        // actually update the db
        let status = await this.actuallyUpdate()
        resolve(status)
      } else {
        reject()
      }
    } catch {
      reject()
    }
  })
}

Post.prototype.actuallyUpdate = function() {
  return new Promise(async (resolve, reject) => {
    this.cleanUP()
    this.validate()
    if (!this.errors.length) {
      await postsCollection.findOneAndUpdate({_id: new ObjectId(this.requestedPostId)}, {$set: {title: this.data.title, body: this.data.body}})
      resolve("success")
    } else {
      resolve("failure")
    }
  })
}

Post.reusablePostQuery = function(uniqueOperation, visitorId) {
    return new Promise( async (resolve, reject) => {
        let aggOperation = uniqueOperation.concat([
            {$lookup: {from: 'users', localField: 'author', foreignField: '_id', as: 'authorDocument'}},
            {$project: {
                title: 1,
                body: 1,
                createdDate: 1,
                authorId: "$author",
                author: {$arrayElemAt: ['$authorDocument', 0]}
            }},
        ])
        let posts = await postsCollection.aggregate(aggOperation).toArray()

        // clean up author property in each post object
        posts = posts.map((post) => {
            post.isVisitorOwner = post.authorId.equals(visitorId)

            post.author = {
                username: post.author.username,
                avatar: new User(post.author, true).avatar
            }
            return post
        })

        resolve(posts)
    })
}

Post.findSingleByid = function(id, visitorId) {
    return new Promise( async (resolve, reject) => {
        if (typeof(id) !== 'string' || !ObjectId.isValid(id)) {
            reject()
            return
        }

        let posts = await Post.reusablePostQuery([
            {$match: {_id: new ObjectId(id)}}
        ], visitorId)

        if (posts.length) {
            resolve(posts[0])
        } else {
            reject()
        }
    })
}

Post.findByAuthorId = function(authorId) {
    return Post.reusablePostQuery([
        {$match: {author: authorId}},
        {$sort: {createdDate: -1}}
    ])
}

Post.delete = function(postIdToDelete, currentUserId) {
    return new Promise(async (resolve, reject) => {
        try {
            let post = await Post.findSingleByid(postIdToDelete, currentUserId)
            if (post.isVisitorOwner) {
                await postsCollection.deleteOne({_id: new ObjectId(postIdToDelete)})
                resolve()
            } else {
                reject()
            }
        } catch {
            reject()
        }
    }) 
}


module.exports = Post
