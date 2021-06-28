const mongo = require("./mongo");
const MoviePartSerieSchema = require('../src/db/schema/MoviePartSerieSchema');


const connectToMongoDB = async () => {
    await mongo().then(async (mongoose) => {
        try {
            const movie = {
                resources: [[
                        {
                            file: "https://dood.la/e/hxp80ovosgs8",
                            type: "video/mp4",
                        }
                ]],
                title: "Di sản mộc tinh tập 8",
                slug: "di-san-moc-tin-2021-tap-8",
                serieSlug: "di-san-moc-tin-2021",
                cloneLink: "fulfim/p/di-san-moc-tin-2021-tap-8",
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