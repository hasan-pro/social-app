const mongodb = require('mongodb');
const uri = 'mongodb+srv://todoAppUser:12211221@cluster0-lr1bi.mongodb.net/SocialApp?retryWrites=true&w=majority'


mongodb.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true}, function (err, client) {
    module.exports = client.db();
    const {app, port} = require('./app')
    app.listen(port, () => console.log(`App listening on port ${port}`))
})