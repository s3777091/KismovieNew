const SerieModel = require("../schema/MovieSerieSchema");
const PartModel = require("../schema/MoviePartSerieSchema");
const Category = require("../schema/CategorySchema");
//Lay danh sach link tap phim bo
const getPartLinkClones = async () => {
  let list = await PartModel.find().select("cloneLink");
  let res = [];
  list.map((l) => res.push(l.cloneLink));
  return res;
};
//Lay danh sach link tap phim bo theo host
const getPartLinkClonesByCloneFrom = async (cloneFrom) => {
  let list = await PartModel.find({ cloneFrom: cloneFrom }).select("cloneLink");
  let res = [];
  list.map((l) => res.push(l.cloneLink));
  return res;
};
//Lay top danh sach phim bo
const getTopListSerieMovie = async (limit) => {
  return await SerieModel.find()
    .sort({ createdAt: -1 })
    .populate({ path: "movie_part_series", select: ["slug"] })
    .select(["slug", "title", "movieThumb", "parts"])
    .limit(limit);
};

//Lay tong danh sach phim bo
const countListSerieMovie = async () => {
  return await SerieModel.countDocuments();
};
//Phan trang danh sach phim bo
const findListSerieMovies = async (limit, skip) => {
  return await SerieModel.find()
    .populate({ path: "movie_part_series", select: ["slug"] })
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip);
};
//Lay thong tin chi tiet phim bo
const getDetailSerieMovie = async (slug) => {
  return await SerieModel.findOne({ slug: slug }).populate({
    path: "movie_part_series",
    select: ["slug", "title"],
    limit: 1,
  });
};
//Lay danh sach tap phim theo slug phim bo
const getListPartBySlugSerie = async (slug) => {
  return await SerieModel.findOne({ slug: slug }).populate({
    path: "movie_part_series",
  });
};

//Lay thong tin tap phim
const getDetailPartSerieMovie = async (slug) => {
  return await PartModel.findOne({ slug: slug }).populate({
    path: "movie_series",
  });
};
//Lay danh sach link phim bo
const getSerieLinkClones = async () => {
  let list = await SerieModel.find().select("cloneLink");
  let res = [];
  list.map((l) => res.push(l.cloneLink));
  return res;
};
//Lay danh sach phim bo theo hostClone
const getSerieLinkClonesByClone = async (cloneFrom) => {
  let list = await SerieModel.find({ cloneFrom: cloneFrom }).select(
    "cloneLink"
  );
  let res = [];
  list.map((l) => res.push(l.cloneLink));
  return res;
};
//Insert phim bo
const insertSerieMovie = async (infoMovie) => {
  let mv = new SerieModel(infoMovie);
  return await mv.save();
};

//Insert tap phim bo
const insertPartSerieMovie = async (infoMovie) => {
  let mv = new PartModel(infoMovie);
  return await mv.save();
};

//Lay tong phim cua the loai
const countMovieByCategory = async (categorySlug) => {
  return await SerieModel.countDocuments({
    categorySlug: { $regex: categorySlug, $options: "i" },
  });
};
//Lay danh sach phim theo the loai
const findMovieByCategory = async (categorySlug, limit, skip) => {
  return await SerieModel.find({
    categorySlug: { $regex: categorySlug, $options: "i" },
  })
    .populate({ path: "movie_part_series", select: ["slug"] })
    .limit(limit)
    .skip(skip);
};

//Lay tong phim theo nam phat hanh
const countMovieByYear = async (year) => {
  return await SerieModel.countDocuments({ year: year });
};
//Lay danh sach phim theo nam phat hanh
const findMovieByYear = async (year, limit, skip) => {
  return await SerieModel.find({ year: year })
    .populate({ path: "movie_part_series", select: ["slug"] })
    .limit(limit)
    .skip(skip);
};

//Tim tong phim theo ten
const countMovieByName = async (name) => {
  return await SerieModel.countDocuments({ title: new RegExp(name, "i") });
};

//Tim kiem phim theo ten
const findMovieByName = async (name, limit, skip) => {
  return await SerieModel.find({ title: new RegExp(name, "i") })
    .populate({ path: "movie_part_series", select: ["slug"] })
    .limit(limit)
    .skip(skip);
};

//Tim kiem phim theo quoc gia
const findMovieByRegion = async (region, limit, skip) => {
  return await SerieModel.find({ regionSlug: region })
    .populate({ path: "movie_part_series", select: ["slug"] })
    .limit(limit)
    .skip(skip);
};
//Lay tong phim theo quoc gia
const countMovieByRegion = async (region) => {
  return await SerieModel.countDocuments({ regionSlug: region });
};

const findCategoryName = async (categorySlug) => {
  try {
    const cat = await Category.findOne({ categorySlug: categorySlug }).select([
      "category",
    ]);
    if(cat) {
      return cat;
    }else {
      return {category: categorySlug}
    }
  } catch (error) {
    return {category: categorySlug}
  }
  
};

//Xoa phim
const deleteMovieSerie = async (slugMovie) => {
  let resDeleteMovie = await SerieModel.deleteOne({ slug: slugMovie });
  let resDeletPartsMovie = await PartModel.deleteMany({ serieSlug: slugMovie });
  return { resDeleteMovie, resDeletPartsMovie };
};
module.exports = {
  getPartLinkClones,
  getPartLinkClonesByCloneFrom,
  insertSerieMovie,
  insertPartSerieMovie,
  getSerieLinkClones,
  getSerieLinkClonesByClone,
  getTopListSerieMovie,
  countListSerieMovie,
  findListSerieMovies,
  getListPartBySlugSerie,
  getDetailPartSerieMovie,
  getDetailSerieMovie,
  findCategoryName,
  //Paging
  countMovieByCategory,
  findMovieByCategory,

  countMovieByYear,
  findMovieByYear,

  countMovieByName,
  findMovieByName,

  findMovieByRegion,
  countMovieByRegion,
  deleteMovieSerie,
};
