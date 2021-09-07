const mongo = require("./mongo");
const MoviePartSerieSchema = require('../src/db/schema/MoviePartSerieSchema');


const connectToMongoDB = async () => {
    await mongo().then(async (mongoose) => {
        try {
            const movie = {
                resources: [[
                        {
                            file: "//ok.ru/videoembed/2786468629111",
                            type: "video/mp4",
                        }
                ]],
                title: "Âm Thanh Tội Phạm 4 (Voice 4) - Tập 12",
                slug: "am-thanh-toi-pham-voice-4-tap-12",
                serieSlug: "am-thanh-toi-pham-voice-4",
                cloneLink: "fulfim/p/am-thanh-toi-pham-voice-4-tap-12",
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