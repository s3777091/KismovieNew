const mongo = require("./mongo");
const MoviePartSerieSchema = require('../src/db/schema/MoviePartSerieSchema');


const connectToMongoDB = async () => {
    await mongo().then(async (mongoose) => {
        try {
            const movie = {
                resources: [[
                        {
                            file: "https://dood.la/e/ifur4uwgo7n1",
                            type: "video/mp4",
                        }
                ]],
                title: "Mùa hè đen season 2 tập 8",
                slug: "mua-he-den-season-2-tap-8",
                serieSlug: "mua-he-den-season-2",
                cloneLink: "fulfim/p/mua-he-den-season-2-tap-8",
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