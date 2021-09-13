const mongo = require("./mongo");
const MovieSerieSchema = require('../src/db/schema/MovieSerieSchema');


const connectToMongoDB = async () => {
    await mongo().then(async (mongoose) => {
        try {
            const movie = {
                title: "Plot Love (2021)",
                slug: "plot-love-2021",
                description: "Tình Yêu Và Âm Mưu kể về một nhà thiết kế trẻ tài năng và nhiệt huyết Tô Bắc. Tuy nhiên chỉ vì sai sót đáng trách mà cô bị ép phải ra nước ngoài, sau bảy năm dùng thân phận người quản lý người mẫu hàng đầu để trở về nước. Giờ đây Tô Bắc đã thay đổi mọi thứ từ kinh nghiệm làm việc cho đến cách suy nghĩ khiến nhiều người phải nể phục cô. Mục đích thứ hai của Tô Bắc quay trở về quê hương cũng chính là điều tra nguyên nhân mà dì Lan người thân duy nhất của cô nhảy cầu tự sát. Kể từ đây câu chuyện Tình Yêu Và Âm Mưu bắt đầu diễn ra.",
                category: "Phim phiêu lưu",
                categorySlug: "phim-phieu-luu",
                movieThumb: {
                    full: "https://i3.wp.com/img.bilutv.cc/film/18047/poster.jpg",
                    thumb: "https://i3.wp.com/img.bilutv.cc/film/18047/poster.jpg",
                    medium: "https://i3.wp.com/img.bilutv.cc/film/18047/poster.jpg"
                },
                year: "2021",
                trial: "https://www.youtube.com/watch?v=1kAtKzOAdZQ",
                parts: "24",
                times: "25 phút/tập",
                region: "Mỹ",
                regionSlug: "my",
                createdAt: Date("2021-06-19T03:14:25.706+00:00"),
                cloneFrom: "fulfim",
                cloneLink: "fulfim/phim/di-san-moc-tin-2021",
            };
            await new MovieSerieSchema(movie).save();

            console.log(`cài thành công ${movie.title}`);
        } finally {
            mongoose.connection.close();
        }
    });
};

connectToMongoDB();