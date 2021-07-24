const mongo = require("./mongo");
const MoviePartSerieSchema = require('../src/db/schema/MoviePartSerieSchema');


const connectToMongoDB = async () => {
    await mongo().then(async (mongoose) => {
        try {
            const movie = {
                resources: [[
                        {
                            file: "//ok.ru/videoembed/2865219045962",
                            type: "video/mp4",
                        }
                ]],
                title: "Mùa hè của hương bạc hà tập 24 End",
                slug: "mua-he-cua-huong-bac-ha-tap-24",
                serieSlug: "mua-he-cua-huong-bac-ha",
                cloneLink: "fulfim/p/mua-he-cua-huong-bac-ha-tap-24",
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