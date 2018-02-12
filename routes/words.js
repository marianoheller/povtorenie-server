var express = require('express');
var router = express.Router();
const User = require('../models/User');


router.post('/add', function(req, res, next) {
    if( !req.body || !req.body.word ) return res.sendStatus(400);

    const userID = String(req.user._id);
    User.findOne({ _id: userID })
    .then( user => {
        const newWords = uniq([...user.words, req.body.word]);
        user.words = newWords
        user.save( (err) => {
            if(err) return res.sendStatus(409);
            return res.json({
                words: newWords
            });
        })
    } )
    .catch( error => res.status(400).send(String(error)) )
});


router.post('/remove', function(req, res, next) {
    if( !req.body || !req.body.word ) return res.sendStatus(400);

    const userID = String(req.user._id);
    User.findOne({ _id: userID })
    .then( user => {
        const words = user.words;
        const targetIndex = words.findIndex( (word) => word===req.body.word );
        if( targetIndex !== -1 ) words.splice(targetIndex, 1);
        user.words = words;
        user.save( (err) => {
            if(err) return res.sendStatus(409);
            return res.json({
                words: words
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
        const syncedWords = uniq( user.words.concat(req.body.words) );
        user.words = syncedWords;
        console.log("Sync'ed words", syncedWords);
        user.save( (err) => {
            if(err) {
                console.log(err);
                return res.sendStatus(409);
            }
            return res.json({
                words: syncedWords
            });
        })
    })
    .catch( error => res.status(400).send(String(error)) )
});



module.exports = router;


function uniq(a) {
    var seen = {};
    return a.filter(function(item) {
        return seen.hasOwnProperty(item) ? false : (seen[item] = true);
    });
}