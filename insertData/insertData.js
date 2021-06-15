const mongo = require("./mongo");
const movieSchema = require("../src/db/schema/MovieSchema");

const connectToMongoDB = async() => {
    await mongo().then(async(mongoose) => {
        try {
            console.log("you are connected to mogodb!");

            const movie = {
                resources: ["https://hlsgdrive.xyz/player/index.php?data=e4da3b7fbbce2345d7772b0674a318d5"],
                slug: "The-flu-2013",
                title: "The Flu 2013",
                description: "A case of the flu quickly morphs into a pandemic. As the death toll mounts and the living panic, the government plans extreme measures to contain it.",
                trial: "https://www.youtube.com/watch?v=1BvKZMg2LjU",
                cloneLink: "phim4400/theflu-2013/",
                cloneFrom: "phim4400",
                movieThumb: [
                    "https://www.themoviedb.org/t/p/original/vZWYzuoK6A56joeZRf20YvxrIlf.jpg",
                    "https://image.tmdb.org/t/p/w220_and_h330_face//11XOE0YThTP4r5815Z8iw6VuUZN.jpg",
                    "https://image.tmdb.org/t/p/original///11XOE0YThTP4r5815Z8iw6VuUZN.jpg"
                ],
                createdAt: Date("2021-06-07T03:14:25.627+00:00"),
            };

            await new movieSchema(movie).save();
        } finally {
            mongoose.connection.close();
        }
    });
};

connectToMongoDB();