const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// const ObjectId = Schema.ObjectId;

const MovieSchema = new Schema(
  {
    title: String,
    slug: String,
    trial: String,
    cloneLink: String,
    description: String,
    movieThumb: Object,
    resources: Array,
    createdAt: Date,
    typeMovie: String,
    group: String, //Phim bo
    cloneFrom:String
  },
  {
    toObject: {
      virtuals: true,
    },
    toJSON: {
      virtuals: true,
    },
  }
);
MovieSchema.virtual("movie_options", {
  ref: "movie_options",
  localField: "_id",
  foreignField: "movieId",
});
module.exports = mongoose.model("movies", MovieSchema);
