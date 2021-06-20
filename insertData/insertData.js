const mongo = require("./mongo");
const movieSchema = require("../src/db/schema/MovieSchema");

const connectToMongoDB = async() => {
    await mongo().then(async(mongoose) => {
        try {
            console.log("you are connected to mogodb!");

            const movie = {
                resources: ["https://kimovies.xyz/player/index.php?data=1f0e3dad99908345f7439f8ffabdffc4"],
                slug: "in-the-heights",
                title: "In The Heights(nonSub)",
                description: "Lấy bối cảnh khu phố Washington Heights của New York, nội dung phim xoay quanh hành trình thực hiện giấc mơ trở thành ca sĩ nổi tiếng của anh chủ quán bar Usnavi. Vốn là nơi có không khí luôn dâng đầy nguồn cảm hứng bất tận cho âm nhạc, từ hương cà phê thoang thoảng khắp không gian, cho đến trạm dừng tàu điện ngầm trên con đường 181, nên rất nhiều người tại đây luôn biết cách ngân nga những bài hát mình yêu thích. Còn với Usnavi, anh luôn nỗ lực tiết kiệm từng đồng mỗi ngày, ôm giấc mơ về một cuộc sống tràn ngập âm nhạc cùng với những người bạn của mình.",
                trial: "https://www.youtube.com/watch?v=u5pTICZ2oeg",
                cloneLink: "phim4400/in-the-heights/",
                cloneFrom: "phim4400",
                movieThumb: [
                    "https://www.themoviedb.org/t/p/original/uEJuqp08dH6IQwZJGASlPZOXqKu.jpg",
                    "https://image.tmdb.org/t/p/w220_and_h330_face//4puYT4R4nqSeqvaQnkMzRQe6aWc.jpg",
                    "https://www.themoviedb.org/t/p/original/9Lcj7rZC9t7TBAUIKUkAgvjNvsq.jpg"
                ],
                createdAt: Date("2021-06-20T03:14:25.627+00:00"),
                score: 7.4,
            };

            await new movieSchema(movie).save();
        } finally {
            mongoose.connection.close();
        }
    });
};

connectToMongoDB();