const mongo = require("./mongo");
const MoviePartSerieSchema = require('../src/db/schema/MoviePartSerieSchema');


const connectToMongoDB = async () => {
    await mongo().then(async (mongoose) => {
        try {
            const movie = {
                resources: [[
                        {
                            file: "https://hlss.xyz/video/a4df48d0b71376788fee0b92746fd7d5",
                            type: "video/mp4",
                        }
                ]],
                title: "Plot Love - Tập 1",
                slug: "plot-love-2021-tap-1",
                serieSlug: "plot-love-2021",
                cloneLink: "fulfim/p/plot-love-2021-tap-1",
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