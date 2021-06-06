const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// const ObjectId = Schema.ObjectId;

const CategorySchema = new Schema(
  {
    category: String,
    categorySlug: String,
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
module.exports = mongoose.model("categories", CategorySchema);
