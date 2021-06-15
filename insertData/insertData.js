const mongo = require("./mongo");
const movieSchema = require("../src/db/schema/MovieSchema");

const connectToMongoDB = async() => {
    await mongo().then(async(mongoose) => {
        try {
            console.log("you are connected to mogodb!");

            const movie = {
                resources: ["https://hlsgdrive.xyz/player/index.php?data=8f14e45fceea167a5a36dedd4bea2543"],
                slug: "The-nun-2019",
                title: "The nun 2019",
                description: "Ác quỷ ma sơ là phim điện ảnh kinh dị siêu nhiên của Mỹ năm 2018 do Corin Hardy đạo diễn và Gary Dauberman biên kịch, thực hiện từ cốt truyện gốc của Dauberman và James Wan. Đây là tác phẩm spin-off của phim điện ảnh Ám ảnh kinh hoàng 2 năm 2016 và đồng thời cũng là bộ phim thứ năm của thương hiệu The Conjuring Universe.",
                trial: "https://www.youtube.com/watch?v=pzD9zGcUNrw",
                cloneLink: "phim4400/thenun-2019/",
                cloneFrom: "phim4400",
                movieThumb: [
                    "https://www.themoviedb.org/t/p/original/vZWYzuoK6A56joeZRf20YvxrIlf.jpg",
                    "https://image.tmdb.org/t/p/w220_and_h330_face//sFC1ElvoKGdHJIWRpNB3xWJ9lJA.jpg",
                    "https://image.tmdb.org/t/p/original///sFC1ElvoKGdHJIWRpNB3xWJ9lJA.jpg"
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