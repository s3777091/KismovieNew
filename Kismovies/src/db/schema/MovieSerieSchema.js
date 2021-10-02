const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// const ObjectId = Schema.ObjectId;

const MovieSerieSchema = new Schema({
  title: String,
  slug: String,
  trial: String,

  description: String,

  movieThumb: {
    full: String,
    medium: String,
    thumb: String,
  },
  createdAt: {
    type: Date,
    default: Date.now
  },


  cloneLink: String,
  cloneFrom: String,

  parts: String, //So tap
  times: String, //Thoi luong / tap

  year: Number, //Nam phat hanh

  categorySlug: String, //Slug the loai
  category: String, //The loai

  region: String, //Quoc gia
  regionSlug: String, //Slug quoc gia
}, {
  toObject: {
    virtuals: true,
  },
  toJSON: {
    virtuals: true,
  },
});
MovieSerieSchema.virtual("movie_part_series", {
  ref: "movie_part_series",
  localField: "slug",
  foreignField: "serieSlug",
});
module.exports = mongoose.model("movie_series", MovieSerieSchema);