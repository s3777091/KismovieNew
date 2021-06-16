const mongo = require('./mongo')
const movieSchema = require('../src/db/schema/MovieOptionSchema');

const connectToMongoDB = async() => {
    await mongo().then(async(mongoose) => {
        try {
            console.log("you are connected to mogodb!");

            const MovieOptionSchema = {
                times: '2h',
                category: "phim hay",
                categorySlug: "phim-hay",
                year: "2021",
                quanlity: "FHD 1080p",
                region: "QUỐC GIA KHÁC",
                regionSlug: "quoc-gia-khac",
                movieId: "60c9f62ea3fae41648440073",
                createdAt: Date("2021-06-06T03:14:25.706+00:00"),
                updatedAt: Date("2021-06-06T03:14:25.706+00:00"),
                shares: "2556",
                views: "3235",
                downloads: "123",
                likes: "2931",
            }

            await new movieSchema(MovieOptionSchema).save()
        } finally {
            mongoose.connection.close();
        }
    });
};

connectToMongoDB()