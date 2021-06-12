const mongo = require("./mongo");
const movieSchema = require("../src/db/schema/MovieSchema");

const connectToMongoDB = async () => {
  await mongo().then(async (mongoose) => {
    try {
      console.log("you are connected to mogodb!");

      const movie = {
        resources: ["https://dood.la/e/u38j4d0j9p1a"],
        slug: "dai ha long",
        title: "ĐẠI MẠC THẦN LONG",
        description:
          "Đại Mạc Thần Long kể vào cuối thời nhà Đường, Lý Nguyên Cơ – một người bình thường và các bạn đồng hành của mình đã gặp gỡ đệ tử của Côn Ngô Các núi Côn Luân là Sở Linh Nhi và Tầm Đồ, cùng họ tham gia vào cuộc đọ sức với thụ yêu cũng như ma đạo. Trong quá trình đối đầu với thụ yêu, Lý Nguyên Cơ đã dần trưởng thành và thay đổi suy nghĩ về những việc lớn thì không liên quan đến những người dân thường nhỏ bé, đảm nhận sứ mệnh bảo vệ chính nghĩa, cuối cùng xả thân mình cứu lấy bách tính, đánh bại ma đạo, trở thành anh hùng của đại mạc.",
        trial: "https://www.youtube.com/watch?v=bqlU9-uaB-U",
        cloneLink: "phim4400/dai-ha-long/",
        cloneFrom: "phim4400",
        movieThumb: [
          "https://image.tmdb.org/t/p/original///5r8IKmy4I4gswqZqHSCal1adHi.jpg",
          "https://image.tmdb.org/t/p/w220_and_h330_face//5r8IKmy4I4gswqZqHSCal1adHi.jpg",
          "https://image.tmdb.org/t/p/original///5r8IKmy4I4gswqZqHSCal1adHi.jpg",
          ,
        ],
        createdAt: Date("2021-12-07T03:14:25.627+00:00"),
      };

      await new movieSchema(movie).save();
    } finally {
      mongoose.connection.close();
    }
  });
};

connectToMongoDB();
