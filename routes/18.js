var express = require("express");
var router = express.Router();
const MovieModel = require("../src/db/model/Movie");

const MovieOptionModel = require("../src/db/model/MovieOption");

const config = require("../src/config");

router.get("/page/:currentPage", async (req, res) => {
  const { currentPage } = req.params;

  const category = "phim-18";

  let itemPerPage = config.itemPerPage;
  const promMenu = MovieModel.getMenu();

  const promTotalMovies = MovieModel.countMovieByCategory(category);
  const promNameCategory = MovieOptionModel.findCategoryName(category);

  let [menu, totalMovies, resCategory] = await Promise.all([
    promMenu,
    promTotalMovies,
    promNameCategory,
  ]);
  let totalPage =
    totalMovies <= itemPerPage ? 1 : Math.ceil(totalMovies / itemPerPage);
  let skipItem = (currentPage - 1) * itemPerPage;

  let listMovies = await MovieModel.findMovieByCategory(
    category,
    itemPerPage,
    skipItem
  );

  res.render("18", {
    title: "KiSMovie - Thể loại " + category,
    movie: null,
    listMovies: listMovies,
    menu: menu,
    category: resCategory.category,
    totalPage: totalPage,
    currentPage: currentPage,
    isShowPaging: itemPerPage < totalMovies,
    parentLink: `/the-loai/${category}`,
  });
});

module.exports = router;
