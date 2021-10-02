const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// const ObjectId = Schema.ObjectId;

const RegionSchema = new Schema(
  {
    region: String,
    regionSlug: String,
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
module.exports = mongoose.model("regions", RegionSchema);
