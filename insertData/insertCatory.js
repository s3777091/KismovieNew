const mongo = require('./mongo')
const movieSchema = require('../src/db/schema/MovieOptionSchema');

const connectToMongoDB = async () => {
  await mongo().then(async (mongoose) => {
    try {
      console.log("you are connected to mogodb!");

      const MovieOptionSchema = {
        times: '1h54p',
        category: "phim ma – kinh dị,phim tâm lý",
        categorySlug: "phim-ma-–-kinh-di,phim-tam-ly,",
        year: "2020",
        quanlity: "FHD 1080p",
        region: "QUỐC GIA KHÁC",
        regionSlug: "quoc-gia-khac",
        movieId: "ID number",
        createdAt: Date("2021-06-06T03:14:25.706+00:00"),
        updatedAt: Date("2021-06-06T03:14:25.706+00:00"),
        shares: "19314",
        views: "323323",
        downloads: "3133",
        likes: "13123",
      }

      await new movieSchema(MovieOptionSchema).save()
    } finally {
      mongoose.connection.close();
    }
  });
};

connectToMongoDB()
