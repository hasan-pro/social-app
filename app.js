const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.set('views', 'views');
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.render('home-guest');
})

app.listen(port, () => console.log(`App listening on port ${port}`))