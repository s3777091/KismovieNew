const mongo = require("./mongo");
const MoviePartSerieSchema = require('../src/db/schema/MoviePartSerieSchema');


const connectToMongoDB = async () => {
    await mongo().then(async (mongoose) => {
        try {
            const movie = {
                resources: [[
                        {
                            file: "https://dood.la/e/re4b7evswrxm",
                            type: "video/mp4",
                        }
                ]],
                title: "Thế Giới Hoàn Mỹ - Perfect World Tập 11",
                slug: "the-gioi-hoan-my-perfect-world-tap-11",
                serieSlug: "the-gioi-hoan-my-perfect-world",
                cloneLink: "fulfim/p/the-gioi-hoan-my-perfect-world-tap-11",
                cloneFrom: "fulfim",
            };
            await new MoviePartSerieSchema(movie).save();
        } finally {
            mongoose.connection.close();
        }
    });
};

connectToMongoDB();