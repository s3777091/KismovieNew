const mongo = require('./mongo')
const movieSchema = require('../src/db/schema/MovieOptionSchema');

const connectToMongoDB = async() => {
    await mongo().then(async(mongoose) => {
        try {
            console.log("you are connected to mogodb!");

            const MovieOptionSchema = {
                times: '1h46',
                category: "phim hay",
                categorySlug: "phim-hay",
                year: "2021",
                quanlity: "FHD 1080p",
                region: "QUỐC GIA KHÁC",
                regionSlug: "quoc-gia-khac",
                movieId: "60cc8cc3914c2037c88bcc5b",
                createdAt: Date("2021-06-18T03:14:25.706+00:00"),
                updatedAt: Date("2021-06-18T03:14:25.706+00:00"),
                shares: "2212",
                views: "3229",
                downloads: "313",
                likes: "6331",
            }

            await new movieSchema(MovieOptionSchema).save()
        } finally {
            mongoose.connection.close();
        }
    });
};

connectToMongoDB()