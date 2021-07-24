var Movies = require('../db/schema/MovieSchema');
var MovieOptionSchema = require("../db/schema/MovieOptionSchema");


var MovieSerieSchema = require('../db/schema/MovieSerieSchema');

var MoviePartSerieSchema = require('../db/schema/MoviePartSerieSchema');


// create and save new user
exports.createPhimle = (req, res) => {
    // validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be emtpy!"
        });
        return;
    }
    const movies = new Movies({
        title: req.body.title,
        slug: req.body.slug,
        trial: req.body.trial,
        description: req.body.description,
        cloneLink: req.body.cloneLink,
        cloneFrom: "phim4400",
        resources: req.body.resources,
        score: req.body.score,
        movieThumb: req.body
    })

    // save user in the database
    movies
        .save(movies)
        .then(data => {
            //res.send(data)
            res.redirect('/be-admin/list-movie/page/1');
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating a create operation"
            });
        });
}

exports.createPhimbo = (req, res) => {
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be emtpy!"
        });
        return;
    }
    const MovieSerie = new MovieSerieSchema({
        title: req.body.title,
        slug: req.body.slug,
        trial: req.body.trial,
        description: req.body.description,
        cloneLink: req.body.cloneLink,
        cloneFrom: "fulfim",
        year: req.body.year,
        categorySlug: req.body.categorySlug,
        category: req.body.category,
        parts: req.body.parts,
        region: req.body. region,
        regionSlug: req.body.regionSlug,
        times: req.body.times,
        movieThumb: req.body
    })

    // save user in the database
    MovieSerie
        .save(MovieSerie)
        .then(data => {
            //res.send(data)
            res.redirect('/be-admin/series/page/1');
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating a create operation"
            });
        });

}


exports.createPartPhimbo = (req, res) => {
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be emtpy!"
        });
        return;
    }
    const MoviePartSerie = new MoviePartSerieSchema({
        resources: req.body,
    })

    // save user in the database
    MoviePartSerie
        .save(MoviePartSerie)
        .then(data => {
            //res.send(data)
            res.redirect('/be-admin/series/page/1');
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating a create operation"
            });
        });

}



exports.createCatoryPhimLe = (req, res) => {
    // validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be emtpy!"
        });
        return;
    }
    const CatoryMovies = new MovieOptionSchema({
        categorySlug: req.body.categorySlug,
        category: req.body.category,
        regionSlug: req.body.regionSlug,
        region: req.body.region,
        year: req.body.year,
        times: req.body.times,
        quanlity: "FHD 1080",
        movieId: req.body.movieId,
        views: getRandomInt(10000),
        downloads: getRandomInt(10000),
        shares: getRandomInt(10000),
        likes: getRandomInt(10000)
    })

    function getRandomInt(max) {
        return Math.floor(Math.random() * max);
      }
      
    // save user in the database
    CatoryMovies
        .save(CatoryMovies)
        .then(data => {
            //res.send(data)
            res.redirect('/be-admin/list-movie/page/1');
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating a create operation"
            });
        });

}