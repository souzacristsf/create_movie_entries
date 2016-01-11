var express = require('express'),
app = express(),
engines = require('consolidate'),
// bodyParser = require('body-parser'),
MongoClient = require('mongodb').MongoClient,
assert = require('assert');

app.engine('html', engines.nunjucks);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

// app.use(bodyParser.urlencoded({ extended: true }));

// Handler for internal server errors
function errorHandler(err, req, res, next) {
    console.error(err.message);
    console.error(err.stack);
    res.status(500).render('error_template', { error: err });
}

MongoClient.connect('mongodb://localhost:27017/video', function(err, db) {

    assert.equal(null, err);
    console.log("Successfully connected to MongoDB.");

    app.get('/', function(req, res, next) {

        db.collection('movies').find({}).toArray(function(err, docs) {
            res.render('movies', { 'movies': docs } );
        });
        // res.render('entries');

    });

    app.post('/create_movie_entries', function(req, res, next) {
        var title = req.body.title;
        var year = req.body.year;
        var imdb = req.body.imdb;
        console.log(req)
        db.collection('movies').insert({title: title, year: year, imdb: imdb}, function(err, docs) {

            res.send("inserido com sucesso");
            db.close();

        });

    });
    app.use(errorHandler);

    app.use(function(req, res){
        res.sendStatus(404);
    });

    var server = app.listen(3000, function() {
        var port = server.address().port;
        console.log('Express server listening on port %s.', port);
    });
});
