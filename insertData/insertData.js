const mongo = require("./mongo");
const movieSchema = require("../src/db/schema/MovieSchema");

const connectToMongoDB = async () => {
  await mongo().then(async (mongoose) => {
    try {
      console.log("you are connected to mogodb!");

      const movie = {
        resources: ["https://dood.la/e/cg05jbc288m5"],
        slug: "hoa-moc-lan",
        title: "Hoa mộc lan 2021",
        description:
          "Hoa Mộc Lan thay cha tòng quân. Cô đã phải vượt qua sự mọi sự bất tiện cùng cơ thể yếu đuối của mình, cố gắng gấp bội và rồi nhận được sự đánh giá cao của tướng quân Lý Nhung. Việc các huynh đệ lần lượt hy sinh trên chiến trường khiến Mộc Lan không thể chấp nhận. Cô mong sớm kết thúc chiến tranh. Khi cuộc chiến đi vào bế tắc, Mộc Lan đã táo bạo, thận trọng và mạnh dạn đưa ra những chiến lược mới giúp đội quân liên tiếp giành chiến thắng. Cuối cùng, Mộc Lan và Lý Nhung đã cùng phối hợp với nhau đánh tan quân thù. Phim được Disney chuyển thể từ tác phẩm hoạt hình ăn khách năm 1998. Nữ diễn viên nổi tiếng Lưu Diệc Phi đảm nhận vai diễn Mộc Lan",
        trial: "https://www.youtube.com/watch?v=x0Ib2pqwmEQ",
        cloneLink: "phim4400/hoa-moc-lan/",
        cloneFrom: "phim4400",
        movieThumb: [
          {
            "full": "https://i3.wp.com/bilugo.com/upload/images/2020/06/hoa-moc-lan-2020_1593126884.jpg",
            "thumb":
              "https://i3.wp.com/bilugo.com/upload/images/2020/06/hoa-moc-lan-2020_1593126884.jpg",
            "medium":
              "https://i3.wp.com/bilugo.com/upload/images/2020/06/hoa-moc-lan-2020_1593126884.jpg",
          },
        ],
        createdAt: Date("2021-06-06T03:14:25.627+00:00"),
      };

      await new movieSchema(movie).save();
    } finally {
      mongoose.connection.close();
    }
  });
};

connectToMongoDB();
