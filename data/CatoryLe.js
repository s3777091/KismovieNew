const mongo = require('./mongo')
const movieSchema = require('../src/db/schema/MovieOptionSchema');

const connectToMongoDB = async() => {
    await mongo().then(async(mongoose) => {
        try {
            console.log("you are connected to mogodb!");

            const MovieOptionSchema = {
                times: '1h38',
                category: "phim hay",
                categorySlug: "phim-hay",
                year: "2021",
                quanlity: "FHD 1080p",
                region: "QUỐC GIA KHÁC",
                regionSlug: "quoc-gia-khac",
                movieId: "60d33971bbd2321b20c82d36",
                createdAt: Date("2021-06-19T03:14:25.706+00:00"),
                updatedAt: Date("2021-06-19T03:14:25.706+00:00"),
                shares: "1912",
                views: "12422",
                downloads: "12245",
                likes: "9232",
            }

            await new movieSchema(MovieOptionSchema).save()
        } finally {
            mongoose.connection.close();
        }
    });
};

connectToMongoDB()