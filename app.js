const express = require('express')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const flash = require('connect-flash')
const markdown = require('marked')
const app = express();


// Session setting
let sessionOptions = session({
    secret: 'You can trust me more than you',
    store: new MongoStore({client: require('./db')}),
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 1000 * 60 * 60 * 24, httpOnly: true}
})

app.use(sessionOptions)
app.use(flash())
app.use((req, res, next) => {
    // Make our markdown function available from withing ejs template
    res.locals.filterUserHTML = function(content) {
        return markdown(content)
    }
    // Make all error and success flash messages available from all templates
    res.locals.errors = req.flash('errors')
    res.locals.success = req.flash('success')

    // Make current user id available on the req object
    if (req.session.user) {req.visitorId = req.session.user._id} else {req.visitorId = 0}


    // Make user session data available from within view templates
    res.locals.user = req.session.user
    next()
})

// custom module import
const router = require('./router.js')

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(express.static('public'))
app.set('views', 'views');
app.set('view engine', 'ejs')

app.use('/', router)

module.exports = app
