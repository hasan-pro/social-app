const express = require('express');
const app = express();
const port = process.env.PORT || 3000;


// custom module import
const router = require('./router.js');

app.use(express.static('public'))
app.set('views', 'views');
app.set('view engine', 'ejs')

app.use('/', router)

app.listen(port, () => console.log(`App listening on port ${port}`))