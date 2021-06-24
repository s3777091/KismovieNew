const mongo = require("./mongo");
const MoviePartSerieSchema = require('../src/db/schema/MoviePartSerieSchema');


const connectToMongoDB = async () => {
    await mongo().then(async (mongoose) => {
        try {
            const movie = {
                resources: [[
                        {
                            file: "https://dood.la/e/4650ipjp95b2",
                            type: "video/mp4",
                        }
                ]],
                title: "Loki Part 1 tập 3",
                slug: "loki-part-1-tap-3",
                serieSlug: "loki-part-1",
                cloneLink: "fulfim/p/loki-part-1-tap-3",
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