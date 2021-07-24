const mongo = require("./mongo");
const MoviePartSerieSchema = require('../src/db/schema/MoviePartSerieSchema');


const connectToMongoDB = async () => {
    await mongo().then(async (mongoose) => {
        try {
            const movie = {
                resources: [[
                        {
                            file: "https://www.youtube.com/embed/eBNHUunuSDc",
                            type: "video/mp4",
                        }
                ]],
                title: "Thế Giới Hoàn Mỹ - Perfect World Tập 16",
                slug: "the-gioi-hoan-my-perfect-world-tap-16",
                serieSlug: "the-gioi-hoan-my-perfect-world",
                cloneLink: "fulfim/p/the-gioi-hoan-my-perfect-world-tap-16",
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