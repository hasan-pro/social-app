const dotenv = require('dotenv');
dotenv.config();
const mongodb = require('mongodb');

mongodb.connect(process.env.URI, {useNewUrlParser: true, useUnifiedTopology: true}, function (err, client) {
    module.exports = client
    const app = require('./app')
    app.listen(process.env.PORT, () => console.log(`App listening on port ${process.env.PORT}`))
})