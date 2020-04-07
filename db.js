const dotenv = require('dotenv');
dotenv.config();
const mongodb = require('mongodb');

mongodb.connect(process.env.URI, {useNewUrlParser: true, useUnifiedTopology: true}, function (err, client) {
    module.exports = client.db();
    const {app, port} = require('./app')
    app.listen(port, () => console.log(`App listening on port ${port}`))
})