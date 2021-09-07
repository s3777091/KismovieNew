const mongo = require("./mongo");
const MoviePartSerieSchema = require('../src/db/schema/MoviePartSerieSchema');


const connectToMongoDB = async () => {
    await mongo().then(async (mongoose) => {
        try {
            const movie = {
                resources: [[
                        {
                            file: "https://zembed.net/v/VxHDaPLDGy.html",
                            type: "video/mp4",
                        }
                ]],
                title: "What if - Tập 4",
                slug: "what-if-tap-4",
                serieSlug: "what-if",
                cloneLink: "fulfim/p/what-if-tap-4",
                cloneFrom: "fulfim",
            };
            await new MoviePartSerieSchema(movie).save();

            console.log(`cài thành công ${movie.title}`);
        } finally {
            mongoose.connection.close();
        }
    });
};

connectToMongoDB();