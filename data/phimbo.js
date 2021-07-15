const mongo = require("./mongo");
const MoviePartSerieSchema = require('../src/db/schema/MoviePartSerieSchema');


const connectToMongoDB = async () => {
    await mongo().then(async (mongoose) => {
        try {
            const movie = {
                resources: [[
                        {
                            file: "https://dood.la/e/khhzjh6qp4wh",
                            type: "video/mp4",
                        }
                ]],
                title: "Loki Part 1 tập 6",
                slug: "loki-part-1-tap-6",
                serieSlug: "loki-part-1",
                cloneLink: "fulfim/p/loki-part-1-tap-6",
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