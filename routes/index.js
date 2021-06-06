var express = require("express");
var router = express.Router();

const clonePhim4400 = require("../src/clonePhim4400");
const hostClone = require("../src/config/hostClone");

const MovieSerieModel = require("../src/db/model/MovieSerie");
const MovieModel = require("../src/db/model/Movie");
const MovieOptionModel = require("../src/db/model/MovieOption");
const RegionModel = require("../src/db/schema/RegionSchema");

const config = require("../src/config");
const common = require("../src/common");
//Page trang chu
router.get("/", async (req, res, next) => {
  //Phim moi
  const topMovies = MovieModel.getTopMovie(config.itemPerPage);
  //Phim hanh dong
  const hotMovies = MovieModel.findMovieByCategory(
    "phim-hanh-dong",
    config.itemPerPage,
    0
  );
  //Phim viet
  const vietMovies = MovieModel.findMovieByCategory("pr", config.itemPerPage);
  //Danh sach phim bo
  const seriaMovies = MovieSerieModel.getTopListSerieMovie(config.itemPerPage);
  const menu = MovieModel.getMenu();
  let [resTopMV, resHotMV, resSeriaMV, resVietMV, resMenu] = await Promise.all([
    topMovies,
    hotMovies,
    seriaMovies,
    vietMovies,
    menu,
  ]);
  res.render("index", {
    title: "KiMovies",
    topMovies: resTopMV,
    hotMovies: resHotMV,
    seriaMovies: resSeriaMV,
    vietMovies: resVietMV,
    movie: null,
    menu: resMenu,
  });
});

//Page thong tin phim
router.get("/phim/:slug", async (req, res, next) => {
  const { slug } = req.params;
  const movie = MovieModel.findMovieBySlug(slug);
  const menu = MovieModel.getMenu();
  let [resMV, resMenu] = await Promise.all([movie, menu]);
  console.log({resMV});
  res.render("movie", {
    title: "KiMovies - " + resMV.title,
    movie: resMV,
    menu: resMenu,
  });
});

//Page Xem phim
router.get("/phim/:slug/xem-phim", async (req, res, next) => {
  const { slug } = req.params;
  const movie = MovieModel.findMovieBySlug(slug);
  const menu = MovieModel.getMenu();
  let [resMV, resMenu] = await Promise.all([movie, menu]);
  const movieRelated = await MovieModel.getListMovieRelated(
    resMV.movie_options[0].categorySlug,
    resMV._id,
    config.itemPerPage
  );
  console.log(resMV.resources);
  res.render("play", {
    title: "BeMovies - " + resMV.title,
    movie: resMV,
    menu: resMenu,
    //truyen method get source phim
    movieRelated: movieRelated,
  });
});

//Page the loai
router.get("/the-loai/:category/page/:currentPage", async (req, res) => {
  const { category, currentPage } = req.params;

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
  res.render("list", {
    title: "KiMovie - Thể loại " + category,
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

//Page quoc gia
router.get("/quoc-gia/:region/page/:currentPage", async (req, res) => {
  const { region, currentPage } = req.params;

  let itemPerPage = config.itemPerPage;
  const promMenu = MovieModel.getMenu();
  const promTotalMovies = MovieModel.countMovieByRegion(region);
  const promRegionName = RegionModel.findOne({ regionSlug: region });

  let [menu, totalMovies, resRegion] = await Promise.all([
    promMenu,
    promTotalMovies,
    promRegionName,
  ]);
  let totalPage =
    totalMovies <= itemPerPage ? 1 : Math.ceil(totalMovies / itemPerPage);
  let skipItem = (currentPage - 1) * itemPerPage;
  let listMovies = await MovieModel.findMovieByRegion(
    region,
    itemPerPage,
    skipItem
  );
  res.render("region", {
    title: "KiMovie - Quốc gia " + resRegion.region,
    movie: null,
    listMovies: listMovies,
    menu: menu,
    region: resRegion.region,
    totalPage: totalPage,
    currentPage: currentPage,
    parentLink: `/quoc-gia/${region}`,
    isShowPaging: itemPerPage < totalMovies,
  });
});

//Page tim kiem theo nam
router.get("/nam/:year/page/:currentPage", async (req, res) => {
  const { year, currentPage } = req.params;
  let itemPerPage = config.itemPerPage;
  const promMenu = MovieModel.getMenu();
  const promTotalMovies = MovieModel.countMovieByYear(year);
  let [menu, totalMovies] = await Promise.all([promMenu, promTotalMovies]);
  let totalPage =
    totalMovies <= itemPerPage ? 1 : Math.ceil(totalMovies / itemPerPage);
  let skipItem = (currentPage - 1) * itemPerPage;
  let listMovies = await MovieModel.findMovieByYear(
    year,
    itemPerPage,
    skipItem
  );

  res.render("year", {
    title: "KiMovie - Năm phát hành " + year,
    movie: null,
    listMovies: listMovies,
    menu: menu,
    year: year,
    totalPage: totalPage,
    currentPage: currentPage,
    isShowPaging: itemPerPage < totalMovies,
    parentLink: `/nam/${year}`,
  });
});

//Page tim kiem
router.get("/tim-kiem/:name/page/:currentPage", async (req, res) => {
  const { name, currentPage } = req.params;
  let itemPerPage = config.itemPerPage;

  const promMenu = MovieModel.getMenu();
  const promTotalMovies = MovieModel.countMovieByName(name);
  let [menu, totalMovies] = await Promise.all([promMenu, promTotalMovies]);

  let totalPage =
    totalMovies <= itemPerPage ? 1 : Math.ceil(totalMovies / itemPerPage);
  let skipItem = (currentPage - 1) * itemPerPage;
  let listMovies = await MovieModel.findMovieByName(
    name,
    itemPerPage,
    skipItem
  );

  res.render("search", {
    title: "KiMovie - Tìm kiếm " + name,
    movie: null,
    listMovies: listMovies,
    menu: menu,
    search: decodeURIComponent(name),
    currentPage: currentPage,
    totalPage: totalPage,
    isShowPaging: itemPerPage < totalMovies,
    parentLink: `/tim-kiem/${encodeURIComponent(name)}`,
  });
});

//API tim kiem phim
router.get("/api/search/:name", async (req, res) => {
  const { name } = req.params;
  const list = await MovieModel.findListNameMovie(name);
  res.json({ list });
});

//API tim kiem phim bo
router.get("/api/search/phim-bo/:name", async (req, res) => {
  const { name } = req.params;
  const list = await MovieSerieModel.findMovieByName(name);
  res.json({ list });
});

//API Lay source play video cua phim
router.post("/api/resource/", async (req, res) => {
  const { slug } = req.body;
  let movie = await MovieModel.findMovieBySlug(slug);
  let listResource = [];
  if (movie.cloneFrom == hostClone.PHIM4400) {
    //get link
    let resources = movie.resources;
    console.log({resources});
    //Get resource from fembed
    let hxfileLink = resources.find((s) => s.includes("hxfile"));
    let hxfile = null;
	 
    if (hxfileLink) {
      hxfile = await clonePhim4400.getResourceHxFile(hxfileLink);
    }
    let results = [[{file: '1'}], hxfile];
    try {
      results.map((res) => {
        if (res) {
          listResource.push(res);
        }
      });
    } catch (error) {
      console.log(error.message);
    }
  } else if (movie.cloneFrom == hostClone.FULFIM) {
    let resources = movie.resources;
    let streamSource = resources.find((s) => s[0].file.includes("ok.ru"));
    if (streamSource) {
      listResource = resources;
    }
  }
  else if(movie.cloneFrom == hostClone.XUONG_PHIM) {
    let resources = movie.resources;
    let id = resources[0].file;
    console.log({id});
    try {
      listResource = await common.getSourcesXuongPhim(id);
    } catch (error) {
      console.log(error.message);
    }
   
  }
  return res.json({ resources: listResource });
});

//API Cap nhat thong tin phim
router.post("/api/movie/update", async (req, res) => {
  const KEYS = ["likes", "views", "downloads", "shares"];
  const { key, movieId } = req.body;
  if (KEYS.includes(key)) {
    const resUpdate = await MovieOptionModel.updateOption(movieId, key);
    res.json({ resUpdate });
  }
});

module.exports = router;
