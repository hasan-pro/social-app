const postsCollection = require('../db').db().collection('posts')
const ObjectId = require('mongodb').ObjectId

let Post = function(data, userid) {
    this.data = data
    this.errors = []
    this.userid = userid
}

Post.prototype.cleanUP = function() {
    if (typeof (this.data.title) !== "string") {this.data.title = ""}
    if (typeof (this.data.body) !== "string") {this.data.body = ""}

    // get rid of any bogus properties
    this.data = {
        title: this.data.title.trim(),
        body: this.data.body.trim(),
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
            postsCollection.insertOne(this.data).then(() => {
                resolve()
            }).catch(() => {
                this.errors.push('Please try again leter.')
                reject(this.errors)
            })
        } else {
            reject(this.errors)
        }
    })
}


module.exports = Post