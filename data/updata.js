const mongo = require("./mongo");
const category = require("../src/db/schema/CategorySchema");

const connectToMongoDB = async() => {
    await mongo().then(async(mongoose) => {
        try {
            const filter = { categorySlug: 'phim-vo-thuat' };
            const update = { img: "https://images.unsplash.com/photo-1544243747-b8ca15da2450?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=751&q=80%20751w" };

            await category.findOneAndUpdate(filter, update, {
                new: true,
                upsert: true
            });

            console.log(`succes update the ${update.img}`);
        } finally {
            mongoose.connection.close();
        }
    });
};

connectToMongoDB();