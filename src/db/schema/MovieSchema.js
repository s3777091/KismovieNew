const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// const ObjectId = Schema.ObjectId;

const MovieSchema = new Schema({
    title: String,
    slug: String,
    trial: String,
    score: Number,
    cloneLink: String,
    description: String,
    movieThumb: {
        full: String,
        medium: String,
        thumb: String,
    },
    resources: Array,
    createdAt: {
        type: Date,
        default: Date.now
    },
    typeMovie: String,
    group: String, //Phim bo
    cloneFrom: String
}, {
    toObject: {
        virtuals: true,
    },
    toJSON: {
        virtuals: true,
    },
});
MovieSchema.virtual("movie_options", {
    ref: "movie_options",
    localField: "_id",
    foreignField: "movieId",
});
module.exports = mongoose.model("movies", MovieSchema);