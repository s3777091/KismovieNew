const mongo = require("./mongo");
const movieSchema = require("../src/db/schema/MovieSchema");

const connectToMongoDB = async() => {
    await mongo().then(async(mongoose) => {
        try {
            console.log("you are connected to mogodb!");

            const movie = {
                resources: ["https://hlsgdrive.xyz/player/index.php?data=8f14e45fceea167a5a36dedd4bea2543"],
                slug: "SAS-red-notice-2021",
                title: "SAS: red notice 2021",
                description: "An off-duty SAS soldier, Tom Buckingham, must thwart a terror attack on a train running through the Channel Tunnel. As the action escalates on the train, events transpire in the corridors of power that may make the difference as to whether Buckingham and the civilian passengers make it out of the tunnel alive.",
                trial: "https://www.youtube.com/watch?v=hRuUB6RKExQ",
                cloneLink: "phim4400/sas-red-notice-2021/",
                cloneFrom: "phim4400",
                movieThumb: [
                    "https://www.themoviedb.org/t/p/original/vZWYzuoK6A56joeZRf20YvxrIlf.jpg",
                    "https://image.tmdb.org/t/p/w220_and_h330_face//sFC1ElvoKGdHJIWRpNB3xWJ9lJA.jpg",
                    "https://image.tmdb.org/t/p/original///sFC1ElvoKGdHJIWRpNB3xWJ9lJA.jpg"
                ],
                createdAt: Date("2021-06-07T03:14:25.627+00:00"),
                score: 6,
            };

            await new movieSchema(movie).save();
        } finally {
            mongoose.connection.close();
        }
    });
};

connectToMongoDB();