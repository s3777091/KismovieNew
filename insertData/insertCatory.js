const mongo = require('./mongo')
const movieSchema = require('../src/db/schema/MovieOptionSchema');

const connectToMongoDB = async() => {
    await mongo().then(async(mongoose) => {
        try {
            console.log("you are connected to mogodb!");

            const MovieOptionSchema = {
                times: '1h18',
                category: "phim hay",
                categorySlug: "phim-hay",
                year: "2019",
                quanlity: "FHD 1080p",
                region: "QUỐC GIA KHÁC",
                regionSlug: "quoc-gia-khac",
                movieId: "60c8a306b4f8e32274d56c0d",
                createdAt: Date("2021-06-06T03:14:25.706+00:00"),
                updatedAt: Date("2021-06-06T03:14:25.706+00:00"),
                shares: "23556",
                views: "32355",
                downloads: "1323",
                likes: "3133",
            }

            await new movieSchema(MovieOptionSchema).save()
        } finally {
            mongoose.connection.close();
        }
    });
};

connectToMongoDB()