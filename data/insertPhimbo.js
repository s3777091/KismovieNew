const mongo = require("./mongo");
const MovieSerieSchema = require('../src/db/schema/MovieSerieSchema');


const connectToMongoDB = async () => {
    await mongo().then(async (mongoose) => {
        try {
            const movie = {
                title: "Mùa Hè Đen Season 2",
                slug: "mua-he-den-season-2",
                description: "Trong lúc xã hội đang vô cùng hỗn loạn với đại dịch zombie đang lan truyền với tốc độ chóng mặt, Rose một bà mẹ trẻ tìm kiếm đứa con gái thất lạc của mình. Trong suốt hành trình tìm con, Rose liên minh với những người tị nạn, cùng nhau vượt qua sự tấn công của hàng ngàn xác sống, chấp nhận kiến thiết thế giới hỗn độn này bằng cách lập ra luật mới.",
                category: "Phim phiêu lưu",
                categorySlug: "phim-phieu-luu",
                movieThumb: {
                    full: "https://www.themoviedb.org/t/p/original/rBFEE11zW2mmnZ4T9jAiSozKR9y.jpg",
                    thumb: "https://image.tmdb.org/t/p/w220_and_h330_face//gx36rMh4CyZAZLVpypkNBhPsFT5.jpg",
                    medium: "https://www.themoviedb.org/t/p/original/gx36rMh4CyZAZLVpypkNBhPsFT5.jpg"
                },
                year: "2021",
                trial: "https://www.youtube.com/watch?v=O9-kJB8AVFA",
                parts: "8",
                times: "75 phút/tập",
                region: "Mỹ",
                regionSlug: "my",
                createdAt: Date("2021-06-19T03:14:25.706+00:00"),
                cloneFrom: "fulfim",
                cloneLink: "fulfim/phim/mua-he-den-season-2",
            };
            await new MovieSerieSchema(movie).save();

            console.log(`cài thành công ${movie.title}`);
        } finally {
            mongoose.connection.close();
        }
    });
};

connectToMongoDB();