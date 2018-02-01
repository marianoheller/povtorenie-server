var express = require('express');
var router = express.Router();
const User = require('../models/User');


router.post('/add', function(req, res, next) {
    if( !req.body || !req.body.word ) return res.sendStatus(400);

    const userID = String(req.user._id);
    User.findOne({ _id: userID })
    .then( user => {
        user.words = [...user.words, req.body.word];
        user.save( (err) => {
            if(err) return res.sendStatus(409);
            res.sendStatus(200);
        })
    } )
    .catch( error => res.status(400).send(String(error)) )
});


router.post('/remove', function(req, res, next) {
    if( !req.body || !req.body.word ) return res.sendStatus(400);

    const userID = String(req.user._id);
    User.findOne({ _id: userID })
    .then( user => {
        const targetIndex = user.words.findIndex( (word) => word===req.body.word );
        if( targetIndex !== -1 ) user.words.splice(targetIndex, 1);
        user.save( (err) => {
            if(err) return res.sendStatus(409);
            res.status(200).json({
                words: user.words
            });
        })
    })
    .catch( error => res.status(400).send(String(error)) )
});


router.post('/sync', function(req, res, next) {
    if( !req.body || !req.body.words ) return res.sendStatus(400);

    const userID = String(req.user._id);
    User.findOne({ _id: userID })
    .then( user => {
        user.words = req.body.words;
        user.save( (err) => {
            if(err) return res.sendStatus(409);
            res.status(200).json({
                words: user.words
            });
        })
    })
    .catch( error => res.status(400).send(String(error)) )
});

module.exports = router;
