const express = require('express')
const app = express()



// custom module import
const router = require('./router.js')

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(express.static('public'))
app.set('views', 'views');
app.set('view engine', 'ejs')

app.use('/', router)

// module.exports = app;

module.exports = app;


