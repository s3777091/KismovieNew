const mongo = require("./mongo");
const MoviePartSerieSchema = require('../src/db/schema/MoviePartSerieSchema');


const connectToMongoDB = async () => {
    await mongo().then(async (mongoose) => {
        try {
            const movie = {
                resources: [[
                        {
                            file: "https://dood.la/e/ihhzoqtp9cij",
                            type: "video/mp4",
                        }
                ]],
                title: "Thế Giới Hoàn Mỹ tập 12",
                slug: "the-gioi-hoan-my-perfect-world-tap-12",
                serieSlug: "the-gioi-hoan-my-perfect-world",
                cloneLink: "fulfim/p/the-gioi-hoan-my-perfect-world-tap-12",
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