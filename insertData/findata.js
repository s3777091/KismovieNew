const mongo = require('./mongo')
const movieSchema = require('../src/db/schema/MovieSchema');

const connectToMongoDB = async () => {
  await mongo().then(async (mongoose) => {
    try {
      console.log("you are connected to mogodb!");

      const results = await movieSchema.findOne({
        trial: "https://www.youtube.com/watch?v=FJfuVkgcDJQ",
      })
      console.log('Result:', results)

    } finally {
      mongoose.connection.close();
    }
  });
};

connectToMongoDB()
