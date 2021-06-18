const mongo = require("./mongo");
const movieSchema = require("../src/db/schema/MovieSchema");

const connectToMongoDB = async() => {
    await mongo().then(async(mongoose) => {
        try {
            console.log("you are connected to mogodb!");

            const movie = {
                resources: ["https://kimovies.xyz/player/index.php?data=aab3238922bcc25a6f606eb525ffdc56"],
                slug: "infinite-2021",
                title: "Infinite 2021",
                description: "Evan McCauley has skills he never learned and memories of places he has never visited. Self-medicated and on the brink of a mental breakdown, a secret group that call themselves “Infinites” come to his rescue, revealing that his memories are real.",
                trial: "https://www.youtube.com/watch?v=_WWEOCQGxSw",
                cloneLink: "phim4400/infinite-2021/",
                cloneFrom: "phim4400",
                movieThumb: [
                    "https://www.themoviedb.org/t/p/original/hjypZf7Juayon8emI6HNSyjbqWF.jpg",
                    "https://image.tmdb.org/t/p/w220_and_h330_face//wFl2rumfzQJzTf50WqmK7zDg6Aa.jpg",
                    "https://www.themoviedb.org/t/p/original/wFl2rumfzQJzTf50WqmK7zDg6Aa.jpg"
                ],
                createdAt: Date("2021-06-18T03:14:25.627+00:00"),
                score: 4.2,
            };

            await new movieSchema(movie).save();
        } finally {
            mongoose.connection.close();
        }
    });
};

connectToMongoDB();