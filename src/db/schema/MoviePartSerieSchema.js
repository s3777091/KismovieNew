const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// const ObjectId = Schema.ObjectId;

const MoviePartSerieSchema = new Schema(
  {
    title: String,
    slug: String,
    serieSlug: String,
    cloneLink: String,
    resources: Array,
    createdAt: Date,
    cloneFrom:String,
    
    times:String,//Thoi luong / tap
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
MoviePartSerieSchema.virtual("movie_series", {
    ref: "movie_series",
    localField: "serieSlug",
    foreignField: "slug",
  });
module.exports = mongoose.model("movie_part_series", MoviePartSerieSchema);
