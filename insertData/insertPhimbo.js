const mongo = require("./mongo");
const MovieSerieSchema = require('../src/db/schema/MovieSerieSchema');


const connectToMongoDB = async () => {
    await mongo().then(async (mongoose) => {
        try {
            const movie = {
                title: "LuPin part 1 (2021)",
                slug: "lupin-part-1",
                description: "Lấy cảm hứng từ những cuộc phiêu lưu của Arsène Lupin, tên trộm lịch lãm Assane Diop tiến hành trả thù một gia đình giàu có để đòi lại công lý cho cha.",
                category: "Phim tâm lý",
                categorySlug: "phim-tam-ly",
                movieThumb: {
                    full: "https://www.themoviedb.org/t/p/original/dVHeJXUzHJJGadB2wvpuAn6fsdN.jpg",
                    thumb: "https://image.tmdb.org/t/p/w220_and_h330_face//sgxawbFB5Vi5OkPWQLNfl3dvkNJ.jpg",
                    medium: "https://www.themoviedb.org/t/p/original/sgxawbFB5Vi5OkPWQLNfl3dvkNJ.jpg"
                },
                year: "2021",
                trial: "https://www.youtube.com/watch?v=ga0iTWXCGa0",
                parts: "5",
                times: "50 phút/tập",
                region: "Mỹ",
                regionSlug: "my",
                createdAt: Date("2021-06-19T03:14:25.706+00:00"),
                cloneFrom: "fulfim",
                cloneLink: "fulfim/phim/lupin-part-1",
            };
            await new MovieSerieSchema(movie).save();

            console.log(`cài thành công ${movie.title}`);
        } finally {
            mongoose.connection.close();
        }
    });
};

connectToMongoDB();