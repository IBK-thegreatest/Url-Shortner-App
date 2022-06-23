const express = require('express');
const mongoose  = require('mongoose');
const bodyParser = require('body-parser');
const ShortUrl = require('./models/ShortUrl');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(
    process.env.MONGO_URL,
    { useNewUrlParser: true },
    function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log('Database has successfully connected');
        }
    }
);

app.get('/', async function(req, res) {
    const shortUrls = await ShortUrl.find()
    res.render('index', { shortUrls: shortUrls});
});

app.post('/shortUrls', async function(req, res) {
    await ShortUrl.create({ full: req.body.fullUrl })

    res.redirect('/');
});

app.get('/:shortUrl', async function(req, res) {
    const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl })
    if (shortUrl == null) return res.sendStatus(404)

    shortUrl.clicks++
    shortUrl.save()

    res.redirect(shortUrl.full);
});


app.listen(process.env.PORT || 3000, function(req, res) {
    console.log("Backend Server is Currently running on port 3000");
});