const mongo = require("./mongo");
const movieSchema = require("../src/db/schema/MovieSchema");

const connectToMongoDB = async () => {
    await mongo().then(async (mongoose) => {
        try {
            const movie = {
                resources: ["https://dood.la/e/su9kwxf4q1g3"],
                slug: "di-san-moc-tin-2021",
                title: "Loki Part 1",
                description: "Josee: Khi nàng thơ yêu - Josee: The tiger and the fish là bộ phim anime được chuyển thể từ truyện ngắn cùng tên của tác giả Seiko Tanabe được phát hành từ năm 1984. Bộ phim có sự góp mặt của mỹ nam Taishi Nakagawa lồng tiếng cho vai cho vai Tsuneo và Kaya Kiyohara cho nhân vật Josee",
                trial: "https://www.youtube.com/watch?v=VwRD9oqXPwg",
                cloneLink: "phim4400/josee-khi-nang-tho-yeu/",
                cloneFrom: "phim4400",
                movieThumb: {
                    full: "https://www.themoviedb.org/t/p/original/wr7nrzDrpGCEgYnw15jyAB59PtZ.jpg",
                    thumb: "https://image.tmdb.org/t/p/w220_and_h330_face//kEl2t3OhXc3Zb9FBh1AuYzRTgZp.jpg",
                    medium: "https://www.themoviedb.org/t/p/original/kEl2t3OhXc3Zb9FBh1AuYzRTgZp.jpg"
                },

                createdAt: Date("2021-06-20T03:14:25.627+00:00"),
                score: 6.3,
            };

            await new movieSchema(movie).save();
            console.log(`cài thành công ${movie.title}`);
        } finally {
            mongoose.connection.close();
        }
    });
};

connectToMongoDB();