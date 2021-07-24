const mongo = require("./mongo");
const MoviePartSerieSchema = require('../src/db/schema/MoviePartSerieSchema');


const connectToMongoDB = async () => {
    await mongo().then(async (mongoose) => {
        try {
            const movie = {
                resources: [[
                        {
                            file: "https://short.ink/8PkuhFjJ_",
                            type: "video/mp4",
                        }
                ]],
                title: "Tình Dục/Đời Sống - Sex/Life Tập 8",
                slug: "tinh-duc-doi-song-sex-life-2021-tap-8",
                serieSlug: "tinh-duc-doi-song-sex-life-2021",
                cloneLink: "fulfim/p/tinh-duc-doi-song-sex-life-2021-tap-8",
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