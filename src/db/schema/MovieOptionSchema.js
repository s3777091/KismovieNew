const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const MovieOptionSchema = new Schema(
  {
    movieId: ObjectId,
    categorySlug: String,
    category: String,
    regionSlug: String,
    region: String,
    tags: String,
    year: Number,
    times: String,
    quanlity: String,
    views: Number,
    downloads: Number,
    shares: Number,
    likes: Number,
    updatedAt: {
      type: Date,
      default: Date.now
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
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
MovieOptionSchema.virtual("movies", {
  ref: "movies",
  localField: "movieId",
  foreignField: "_id",
});
module.exports = mongoose.model("movie_options", MovieOptionSchema);
