const mongo = require("./mongo");
const MovieSerieSchema = require('../src/db/schema/MovieSerieSchema');


const connectToMongoDB = async () => {
    await mongo().then(async (mongoose) => {
        try {
            const movie = {
                title: "Di Sản Mộc Tinh (2021)",
                slug: "di-san-moc-tin-2021",
                description: "Họ là thế hệ siêu anh hùng đầu tiên. Nhưng khi họ truyền lại sứ mệnh cho con cái, căng thẳng dần leo thang – và những quy tắc cũ không còn được áp dụng.",
                category: "Phim phiêu lưu",
                categorySlug: "phim-phieu-luu",
                movieThumb: {
                    full: "https://www.themoviedb.org/t/p/original/4YKkS95v9o9c0tBVA46xIn6M1tx.jpg",
                    thumb: "https://image.tmdb.org/t/p/w220_and_h330_face//gIPsXY7QoqMsb1w5OkRn9Bm7xVi.jpg",
                    medium: "https://www.themoviedb.org/t/p/original/gIPsXY7QoqMsb1w5OkRn9Bm7xVi.jpg"
                },
                year: "2021",
                trial: "https://www.youtube.com/watch?v=Pq3HWXfHdXI",
                parts: "8",
                times: "60 phút/tập",
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