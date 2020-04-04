const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.set('views', 'views');
app.set('views engine', 'ejs')

app.get('/', (req, res) => {
    res.send('Welcome to my site.')
})

app.listen(port, () => console.log(`App listening on port ${port}`))