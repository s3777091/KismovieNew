const mongo = require("./mongo");
const MoviePartSerieSchema = require('../src/db/schema/MoviePartSerieSchema');


const connectToMongoDB = async () => {
    await mongo().then(async (mongoose) => {
        try {
            const movie = {
                resources: [[
                        {
                            file: "https://dood.la/e/xsnauv5ewsmz",
                            type: "video/mp4",
                        }
                ]],
                title: "Lupin Part 1 tập 5",
                slug: "lupin-part-1-tap-5",
                serieSlug: "lupin-part-1",
                cloneLink: "fulfim/p/lupin-part-1-tap-5",
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