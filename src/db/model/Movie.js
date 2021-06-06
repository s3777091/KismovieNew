const Movies = require("../schema/MovieSchema");
const MovieOption = require("../schema/MovieOptionSchema");
const Region = require("../schema/RegionSchema");
const Category = require("../schema/CategorySchema");

//Lay danh sach link da clone
const getListLinkClone = async () => {
  const list = await Movies.find().select(["cloneLink"]);
  let links = [];
  if (list && list.length > 0) {
    list.map((l) => links.push(l.cloneLink));
  }
  return links;
};
//Lay danh sach link clone cua trangphim.net
const getListLinkByCloneFrom = async (cloneFrom) => {
  const list = await Movies.find({ cloneFrom: cloneFrom }).select([
    "cloneLink",
  ]);
  let links = [];
  if (list && list.length > 0) {
    list.map((l) => links.push(l.cloneLink));
  }
  return links;
};
//Lay danh sach phim moi cap nhat
const getTopMovie = async (top) => {
  return await Movies.find({ group: null })
    .sort([["createdAt", -1]])
    .limit(top);
};
const getTopMoviePaging = async (top, skip) => {
  return await Movies.find()
    .sort([["createdAt", -1]])
    .populate({ path: "movie_options" })
    .limit(top)
    .skip(skip);
};
//Lay danh sach nhieu luot xem
const getTopViews = async (top) => {
  return await Movies.find({ group: null })
    .sort({ createdAt: -1 })
    .populate({
      path: "movie_option",
      select: { shares: 1, views: 1, likes: 1, downloads: 1 },
      options: { sort: { views: -1 } },
    })
    .limit(top);
};

//Lay top phim bo
const getTopPhimBo = async (top) => {
  return await Movies.aggregate([
    { $match: { group: { $ne: null } } },
    { $group: { _id: { group: "$group" }, count: { $sum: 1 } } },
  ]).sort({ createdAt: -1 });
};
//Tim kiem phim theo slug
const findMovieBySlug = async (slug) => {
  return await Movies.findOne({ slug: slug }).populate({
    path: "movie_options",
  });
};
//Tim kiem phim theo ten
const findMovieByName = async (name, limit, skip) => {
  return await Movies.find({ title: new RegExp(name, "i") })
    .limit(limit)
    .skip(skip);
};

//Tim tong phim theo ten
const countMovieByName = async (name) => {
  return await Movies.countDocuments({ title: new RegExp(name, "i") });
};

//Lay danh sach ten phim
const findListNameMovie = async (name) => {
  return await Movies.find({ title: new RegExp(name, "i") })
    .select(["title", "movieThumb", "slug"])
    .limit(10);
};
//Tim kiem phim theo category
const findMovieByCategory = async (category, limit, skip) => {
  let mvs = await MovieOption.find({
    categorySlug: { $regex: category, $options: "i" },
  })
    .sort({ createdAt: -1 })
    .populate({
      path: "movies",
    })
    .limit(limit)
    .skip(skip);
  let result = [];
  mvs.map((m) => {
    if (m.movies[0]) {
      result.push(m.movies[0]);
    }
  });
  return result;
};

//Lay tong phim category
const countMovieByCategory = async (category) => {
  let mvs = await MovieOption.countDocuments({
    categorySlug: { $regex: category, $options: "i" },
  }).populate({
    path: "movies",
  });
  return mvs;
};

//Tim kiem phim theo quoc gia
const findMovieByRegion = async (region, limit, skip) => {
  let mvs = await MovieOption.find({ regionSlug: region })
    .sort({ createdAt: -1 })
    .populate({
      path: "movies",
    })
    .limit(limit)
    .skip(skip);
  let result = [];
  mvs.map((m) => {
    if (m.movies[0]) {
      result.push(m.movies[0]);
    }
  });
  return result;
};
//Lay tong phim theo quoc gia
const countMovieByRegion = async (region) => {
  let mvs = await MovieOption.countDocuments({ regionSlug: region }).populate({
    path: "movies",
  });
  return mvs;
};
//Tim kiem phim theo nam phat hanh
const findMovieByYear = async (year, limit, skip) => {
  let mvs = await MovieOption.find({ year: year })
    .sort([["createdAt", -1]])
    .populate({
      path: "movies",
    })
    .limit(limit)
    .skip(skip);
  let result = [];
  mvs.map((m) => {
    if (m.movies[0]) {
      result.push(m.movies[0]);
    }
  });
  return result;
};
//Lay tong phim theo nam phat hanh
const countMovieByYear = async (year) => {
  let mvs = await MovieOption.countDocuments({ year: year }).populate({
    path: "movies",
  });
  return mvs;
};
//Lay danh sach nam phat hanh phim
const listYears = async () => {
  return await MovieOption.distinct("year");
};
//Lay danh sach the loai
const listGenre = async () => {
  return await Category.find().sort({ categorySlug: 1 });
};
//cap nhat thong tin phim
const updateOne = async (condition, params) => {
  try {
    return await Movies.updateOne(condition, params, {
      new: true,
    });
  } catch (error) {
    console.log("UPDATE MOVIE ERROR: ", error.message);
    return null;
  }
};

//Lay danh sach phim bo
const listSeriaMovie = async () => {
  return await Movies.find({ group: { $ne: null } });
};

const getMenu = async () => {
  let menuGenre = listGenre();
  let menuYears = listYears();
  let menuRegion = Region.find();
  let [resGenre, resYear, resRegion] = await Promise.all([
    menuGenre,
    menuYears,
    menuRegion,
  ]);
  return {
    years: resYear.sort((a, b) => b - a),
    genres: resGenre,
    regions: resRegion,
  };
};

//Admin
//Dem tong phim
const getTotalMovies = async () => {
  return await Movies.countDocuments();
};
//Tong phim them moi trong thang
const getTotalMoviesInMonth = async () => {
  let date = new Date();
  let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  return await Movies.countDocuments({
    createdAt: { $gte: firstDay, $lt: date },
  });
};
//Lay top danh sach phim xem nhieu nhat
const getTopMovieViews = async (limit) => {
  let topMostView = await MovieOption.find()
    .sort({ views: -1 })
    .limit(limit)
    .populate({
      path: "movies",
    });
  return topMostView;
};
//Lay danh sach phim moi them
const getTopMovieLastest = async (limit) => {
  return await Movies.find()
    .sort({ createdAt: -1 })
    .populate({
      path: "movie_options",
    })
    .limit(limit);
};
//Lay danh sach phim lien quan
const getListMovieRelated = async (categorySlug, movieId, limit) => {
  const list = await MovieOption.find({
    categorySlug: { $regex: categorySlug, $options: "i" },
    movieId: { $ne: movieId },
  })
    .sort({ createdAt: -1 })
    .limit(limit + 1)
    .populate({ path: "movies" });
  let result = [];
  list.map((m) => {
    if (m.movies[0]) {
      result.push(m.movies[0]);
    }
  });
  return result;
};

//Xoa phim
const deleteMovie = async (movieId) => {
  let resDeleteMovie = await Movies.deleteOne({ _id: movieId });
  let resDeleteMovieOption = await MovieOption.deleteOne({ movieId: movieId });
  return { resDeleteMovie, resDeleteMovieOption };
};
//Xoa phim theo hostClone
const deleteMovieByCloneFrom = async (cloneFrom) => {
  let resDeleteMovie = await Movies.deleteMany({ cloneFrom: cloneFrom });
  return { resDeleteMovie };
};

//Tim danh sach phim ko co thumb
const findMovieNoThumb = async() => {
  let res = await Movies.find({movieThumb: {$eq: []}});
  return res;
}
module.exports = {
  findMovieNoThumb,
  getListLinkClone,
  getTopMovie,
  getTopPhimBo,
  findMovieBySlug,
  getTopViews,

  findMovieByName,
  countMovieByName,

  findMovieByCategory,
  countMovieByCategory,

  getListLinkByCloneFrom,

  listYears,
  listGenre,
  listSeriaMovie,
  getMenu,

  findListNameMovie,

  findMovieByYear,
  countMovieByYear,

  findMovieByRegion,
  countMovieByRegion,

  updateOne,
  getTopMoviePaging,

  getListMovieRelated,

  deleteMovieByCloneFrom,

  //Admin
  getTotalMovies,
  getTotalMoviesInMonth,
  getTopMovieViews,
  getTopMovieLastest,
  deleteMovie,
};
