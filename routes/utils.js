var express = require('express');
var router = express.Router();
var translate = require('translate');


router.get('/translate', function(req, res) {
    if( !req.query.word ) return res.sendStatus(400);

    translate(req.query.word, {
        from: 'ru',
        to: 'en',
        engine: 'yandex',
        key: process.env.YANDEX_KEY  
    }).then(text => {
        res.json({ translation: text });
    }).catch( (err) => {
        console.log(err);
        res.status(500).send(err.message || err);
    });
})
module.exports = router;
