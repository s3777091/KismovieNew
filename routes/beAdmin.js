var express = require("express");
var router = express.Router();
const checkAdminLogin = require("../src/middleware/checkAdminLogin");
const MovieModel = require("../src/db/model/Movie");
const SerielModel = require("../src/db/model/MovieSerie");
const MovieOptionModel = require("../src/db/model/MovieOption");
const RegionModel = require("../src/db/schema/RegionSchema");
const moment = require("moment");
var sessionstorage = require("sessionstorage");

/* GET danh sach phim. */
router.get("/login", function (req, res, next) {
  res.render("admin/login", { title: "Đăng nhập KiMovie Admin" });
});
router.post("/login", function (req, res, next) {
  const { username, password } = req.body;
  console.log({ username, password });
  if (username == "dathuynh" && password == "123") {
    sessionstorage.setItem("user", "1");
    res.redirect("/be-admin");
  } else if (username == "newadmin" && password == "12345") {
    sessionstorage.setItem("user", "1");
    res.redirect("/be-admin");
  } else {
    res.render("admin/login", { title: "Đăng nhập KiMovie Admin" });
  }
});
router.get("/logout", function (req, res, next) {
  sessionstorage.removeItem("user");
  res.redirect("/be-admin/login");
});
router.get("/", checkAdminLogin, async (req, res, next) => {
  try {
    let promCountTotalMovies = MovieModel.getTotalMovies();
    let promCountTotalMoviesInMonth = MovieModel.getTotalMoviesInMonth();
    let promTopMostView = MovieModel.getTopMovieViews(10);
    let promLastesMovies = MovieModel.getTopMovieLastest(10);
    let [totalMovies, totalMoviesInMonth, moviesMostViews, moviesLastest] =
      await Promise.all([
        promCountTotalMovies,
        promCountTotalMoviesInMonth,
        promTopMostView,
        promLastesMovies,
      ]);
    res.render("admin/index", {
      title: "Kimovies Admin",
      totalMovies: totalMovies,
      totalMoviesInMonth: totalMoviesInMonth,
      moviesMostViews: moviesMostViews,
      moviesLastest: moviesLastest,
      active: "dashboard",
    });
  } catch (error) {
    console.log({ error });
    res.render("404", { title: "404", movie: null });
  }
});

//Page danh sach phim
router.get(
  "/list-movie/page/:currentPage",
  checkAdminLogin,
  async (req, res, next) => {
    const { currentPage } = req.params;
    const itemPerPage = 10;
    let totalMovies = await MovieModel.getTotalMovies();
    let totalPage =
      totalMovies <= itemPerPage ? 1 : Math.ceil(totalMovies / itemPerPage);
    let skipItem = (currentPage - 1) * itemPerPage;
    let listMovies = await MovieModel.getTopMoviePaging(itemPerPage, skipItem);
    res.render("admin/list-movies", {
      title: "Kimovies Admin",
      movies: listMovies,
      currentPage: currentPage,
      totalPage: totalPage,
      totalMovies: totalMovies,
      itemPerPage: itemPerPage,
      parentLink: "/be-admin/list-movie",
      moment: moment,
      active: "listMovie",
    });
  }
);

//Page danh sach phim bo
router.get(
  "/series/page/:currentPage",
  checkAdminLogin,
  async (req, res, next) => {
    const { currentPage } = req.params;
    const itemPerPage = 10;
    let totalMovies = await SerielModel.countListSerieMovie();
    let totalPage =
      totalMovies <= itemPerPage ? 1 : Math.ceil(totalMovies / itemPerPage);
    let skipItem = (currentPage - 1) * itemPerPage;
    let listMovies = await SerielModel.findListSerieMovies(
      itemPerPage,
      skipItem
    );
    res.render("admin/series-movie", {
      title: "BeMovie Admin",
      movies: listMovies,
      currentPage: currentPage,
      totalPage: totalPage,
      totalMovies: totalMovies,
      itemPerPage: itemPerPage,
      parentLink: "/be-admin/series",
      moment: moment,
      active: "series",
    });
  }
);

//Page clone phim
router.get("/clone", checkAdminLogin, async (req, res, next) => {
  res.render("admin/clone", { title: "Kimovies Admin", active: "clone" });
});

//Page cap nhat thong tin phim
router.get("/edit/:slug", checkAdminLogin, async (req, res, next) => {
  const { slug } = req.params;
  let promMovie = MovieModel.findMovieBySlug(slug);
  let promListGenre = MovieModel.listGenre();
  let promRegions = RegionModel.find();
  let [movie, genres, regions] = await Promise.all([
    promMovie,
    promListGenre,
    promRegions,
  ]);
  res.render("admin/edit", {
    title: "Kimovies Admin",
    movie: movie,
    genres: genres,
    regions: regions,
    active: "listMovie",
  });
});

//Page cap nhat thong tin phim bo
router.get("/series/edit/:slug", checkAdminLogin, async (req, res, next) => {
  const { slug } = req.params;
  let promMovie = SerielModel.getDetailSerieMovie(slug);
  let promListGenre = MovieModel.listGenre();
  let promRegions = RegionModel.find();
  let [movie, genres, regions] = await Promise.all([
    promMovie,
    promListGenre,
    promRegions,
  ]);
  res.render("admin/edit-serie", {
    title: "Kimovies Admin",
    movie: movie,
    genres: genres,
    regions: regions,
    active: "series",
  });
});
//API cap nhat thong tin phim
router.post("/api/edit", checkAdminLogin, async (req, res, next) => {
  try {
    const { movie, movieOption } = req.body;
    const promUpdateMovie = MovieModel.updateOne({ _id: movie._id }, movie);
    const promUpdateMovieOption = MovieOptionModel.updateOne(
      { movieId: movieOption.movieId },
      movieOption
    );
    let [updateMovie, updateMovieOption] = await Promise.all([
      promUpdateMovie,
      promUpdateMovieOption,
    ]);

    res.json({ success: true });
  } catch (error) {
    console.log("/api/edit ERROR UPDATE MOVIE: ", error.message);
    res.json({ success: false });
  }
});

//API tim kiem phim
router.post("/api/search", async (req, res) => {
  const { searchType, value } = req.body;
  try {
    if (searchType == "phim-le") {
      const list = await MovieModel.findListNameMovie(value);
      res.json({ list });
    } else {
      const list = await SerielModel.findMovieByName(value);
      res.json({ list });
    }
  } catch (error) {
    console.log("ERROR delete movie: ", error.message);
    res.status(404).json({ message: error.message });
  }
});

//API xoa phim
router.post("/api/delete", async (req, res) => {
  const { movieId } = req.body;
  try {
    let resDelete = await MovieModel.deleteMovie(movieId);
    console.log({ resDelete });
    res.json(resDelete);
  } catch (error) {
    console.log("ERROR delete movie: ", error.message);
    res.status(404).json({ message: error.message });
  }
});

//API xoa phim bo
router.post("/series/api/delete", async (req, res) => {
  const { movieId } = req.body;
  try {
    let resDelete = await SerielModel.deleteMovieSerie(movieId);
    console.log({ resDelete });
    res.json(resDelete);
  } catch (error) {
    console.log("ERROR delete movie: ", error.message);
    res.status(404).json({ message: error.message });
  }
});
module.exports = router;
