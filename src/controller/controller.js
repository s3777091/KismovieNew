var Movies = require('../db/schema/MovieSchema');
var MovieOptionSchema = require("../db/schema/MovieOptionSchema");

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
        views: req.body.views,
        downloads: req.body.downloads,
        shares: req.body.shares,
        movieId: req.body.movieId,
        likes: req.body.likes
    })

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