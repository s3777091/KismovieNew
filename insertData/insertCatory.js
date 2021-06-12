const mongo = require('./mongo')
const movieSchema = require('../src/db/schema/MovieOptionSchema');

const connectToMongoDB = async () => {
  await mongo().then(async (mongoose) => {
    try {
      console.log("you are connected to mogodb!");

      const MovieOptionSchema = {
        times: '1h40pp',
        category: "phim hay",
        categorySlug: "phim-hay",
        year: "2021",
        quanlity: "FHD 1080p",
        region: "QUỐC GIA KHÁC",
        regionSlug: "quoc-gia-khac",
        movieId: "60c4bf7e2d615b12bcc530f4",
        createdAt: Date("2021-06-06T03:14:25.706+00:00"),
        updatedAt: Date("2021-06-06T03:14:25.706+00:00"),
        shares: "1234",
        views: "3223",
        downloads: "1432",
        likes: "2422",
      }

      await new movieSchema(MovieOptionSchema).save()
    } finally {
      mongoose.connection.close();
    }
  });
};

connectToMongoDB()
