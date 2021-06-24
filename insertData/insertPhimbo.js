const mongo = require("./mongo");
const MovieSerieSchema = require('../src/db/schema/MovieSerieSchema');


const connectToMongoDB = async () => {
    await mongo().then(async (mongoose) => {
        try {
            const movie = {
                title: "Loki part 1 (2021)",
                slug: "loki-part-1",
                description: "Khi Steve Rogers, Tony Stark và Scott Lang quay trở về cột mốc 2012, ngay khi trận chiến ở New York kết thúc, để “mượn tạm” quyền trượng của Loki. Nhưng một tai nạn bất ngờ xảy đến, khiến Loki nhặt được khối lặp phương Tesseract và tiện thể tẩu thoát. Cuộc trốn thoát này đã dẫn đến dòng thời gian bị rối loạn. Cục TVA – tổ chức bảo vệ tính nguyên vẹn của dòng chảy thời gian, buộc phải can thiệp, đi gô cổ ông thần này về làm việc. Tại đây, Loki có hai lựa chọn, một là giúp TVA ổn định lại thời gian, không thì bị tiêu hủy. Dĩ nhiên Loki chọn lựa chọn thứ nhất. Nhưng đây là nước đi vô cùng mạo hiểm, vì ông thần này thường lọc lừa, “lươn lẹo”, chuyên đâm lén như bản tính tự nhiên của gã.",
                category: "Phim phiêu lưu",
                categorySlug: "phim-phieu-luu",
                movieThumb: {
                    full: "https://www.themoviedb.org/t/p/original/wr7nrzDrpGCEgYnw15jyAB59PtZ.jpg",
                    thumb: "https://image.tmdb.org/t/p/w220_and_h330_face//kEl2t3OhXc3Zb9FBh1AuYzRTgZp.jpg",
                    medium: "https://www.themoviedb.org/t/p/original/kEl2t3OhXc3Zb9FBh1AuYzRTgZp.jpg"
                },
                year: "2021",
                trial: "https://www.youtube.com/watch?v=ga0iTWXCGa0",
                parts: "5",
                times: "50 phút/tập",
                region: "Mỹ",
                regionSlug: "my",
                createdAt: Date("2021-06-19T03:14:25.706+00:00"),
                cloneFrom: "fulfim",
                cloneLink: "fulfim/phim/loki-part-1",
            };
            await new MovieSerieSchema(movie).save();

            console.log(`cài thành công ${movie.title}`);
        } finally {
            mongoose.connection.close();
        }
    });
};

connectToMongoDB();