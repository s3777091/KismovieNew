const mongo = require("./mongo");
const movieSchema = require("../src/db/schema/MovieSchema");

const connectToMongoDB = async() => {
    await mongo().then(async(mongoose) => {
        try {
            console.log("you are connected to mogodb!");


            const filter = { trial: 'https://www.youtube.com/watch?v=FJfuVkgcDJQ' };
            const update = { score: 6 };

            await movieSchema.findOneAndUpdate(filter, update, {
                new: true,
                upsert: true
            });
        } finally {
            mongoose.connection.close();
        }
    });
};

connectToMongoDB();