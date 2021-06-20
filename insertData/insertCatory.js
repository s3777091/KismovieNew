const mongo = require('./mongo')
const movieSchema = require('../src/db/schema/MovieOptionSchema');

const connectToMongoDB = async() => {
    await mongo().then(async(mongoose) => {
        try {
            console.log("you are connected to mogodb!");

            const MovieOptionSchema = {
                times: '2h23',
                category: "phim hay",
                categorySlug: "phim-hay",
                year: "2021",
                quanlity: "FHD 1080p",
                region: "QUỐC GIA KHÁC",
                regionSlug: "quoc-gia-khac",
                movieId: "60cf07861bc9bf2270cbbb9e",
                createdAt: Date("2021-06-19T03:14:25.706+00:00"),
                updatedAt: Date("2021-06-19T03:14:25.706+00:00"),
                shares: "2212",
                views: "9329",
                downloads: "234",
                likes: "5321",
            }

            await new movieSchema(MovieOptionSchema).save()
        } finally {
            mongoose.connection.close();
        }
    });
};

connectToMongoDB()