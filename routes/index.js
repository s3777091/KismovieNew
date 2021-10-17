const clonePhim4400 = require("../src/clonePhim4400");
const hostClone = require("../src/config/hostClone");
const MovieSerieModel = require("../src/db/model/MovieSerie");
const MovieModel = require("../src/db/model/Movie");
const MovieOptionModel = require("../src/db/model/MovieOption");
const RegionModel = require("../src/db/schema/RegionSchema");
const log = require("pino")({ level: "error" });

const fastify = require("fastify")({ logger: log });

const config = require("../src/config");
const common = require("../src/common");

async function indexRouter(fastify, options, done) {
  fastify.get("/", async (req, res, next) => {
    try {
      const hotMovies = MovieModel.findMovieByCategory(
        "phim-hanh-dong",
        config.itemPerPage,
        0
      );

      const topMv = MovieModel.getTopMovie(config.itemPerPage);
      const phimhoathinh = MovieModel.findMovieByCategory(
        "phim-hoat-hinh",
        config.itemPerPage
      );
      const seriaMovies = MovieSerieModel.getTopListSerieMovie(
        config.itemPerPage
      );
      const menu = MovieModel.getMenu();

      let [resHotMV, resSeriaMV, reshoathinh, resMenu, restop] =
        await Promise.all([hotMovies, seriaMovies, phimhoathinh, menu, topMv]);

      res.view("index", {
        title: "KiSMovies",
        hotMovies: resHotMV,
        seriaMovies: resSeriaMV,
        hoathinh: reshoathinh,
        movie: null,
        menu: resMenu,
        top: restop,
      });
    } catch (err) {
      req.log.error(err);
    }
  });

  //Page thong tin phim
  fastify.get("/phim/:slug", async (req, res, next) => {
    try {
      const { slug } = req.params;
      const movie = MovieModel.findMovieBySlug(slug);
      const menu = MovieModel.getMenu();
      let [resMV, resMenu] = await Promise.all([movie, menu]);
      console.log({
        resMV,
      });

      const movieRelated = await MovieModel.getListMovieRelated(
        resMV.movie_options[0].categorySlug,
        resMV._id,
        config.itemPerPage
      );
      res.view("movie", {
        title: "KiSMovies - " + resMV.title,
        movie: resMV,
        menu: resMenu,
        movieRelated: movieRelated,
      });
    } catch (err) {
      req.log.error(err);
    }
  });

  //Page Xem phim
  fastify.get("/phim/:slug/xem-phim", async (req, res, next) => {
    try {
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
      res.view("play", {
        title: "kisMovies - " + resMV.title,
        movie: resMV,
        menu: resMenu,
        //truyen method get source phim
        movieRelated: movieRelated,
      });
    } catch (err) {
      req.log.error(err);
    }
  });

  //Page the loai
  fastify.get("/the-loai/:category/page/:currentPage", async (req, res) => {
    try {
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

      if (category == "phim-18") {
        res.view("18", {
          title: "KiSMovie - Thể loại",
          listMovies: listMovies,
          movie: null,
          totalPage: totalPage,
          currentPage: currentPage,
          isShowPaging: itemPerPage < totalMovies,
          parentLink: `/the-loai/${category}`,
          menu: menu,
        });
      } else {
        res.view("list", {
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
      }
    } catch (err) {
      req.log.error(err);
    }
  });

  //Page quoc gia
  fastify.get("/quoc-gia/:region/page/:currentPage", async (req, res) => {
    try {
      const { region, currentPage } = req.params;

      let itemPerPage = config.itemPerPage;
      const promMenu = MovieModel.getMenu();
      const promTotalMovies = MovieModel.countMovieByRegion(region);
      const promRegionName = RegionModel.findOne({
        regionSlug: region,
      });

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

      if (region == "phim-nguoi-lon") {
        res.redirect("/the-loai/phim-18/page/1");
      }
      res.view("region", {
        title: "KiSMovie - Quốc gia " + resRegion.region,
        movie: null,
        listMovies: listMovies,
        menu: menu,
        region: resRegion.region,
        totalPage: totalPage,
        currentPage: currentPage,
        parentLink: `/quoc-gia/${region}`,
        isShowPaging: itemPerPage < totalMovies,
      });
    } catch (err) {
      req.log.error(err);
    }
  });

  //Page tim kiem theo nam
  //Page tim kiem
  fastify.get("/tim-kiem/:name/page/:currentPage", async (req, res) => {
    try {
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

      res.view("search", {
        title: "KiSMovie - Tìm kiếm " + name,
        movie: null,
        listMovies: listMovies,
        menu: menu,
        search: decodeURIComponent(name),
        currentPage: currentPage,
        totalPage: totalPage,
        isShowPaging: itemPerPage < totalMovies,
        parentLink: `/tim-kiem/${encodeURIComponent(name)}`,
      });
    } catch (err) {
      req.log.error(err);
    }
  });

  //API tim kiem phim
  fastify.get("/api/search/:name", async (req, res) => {
    try {
      const { name } = req.params;
      const list = await MovieModel.findListNameMovie(name);
      res.json({
        list,
      });
    } catch (err) {
      req.log.error(err);
    }
  });

  //API tim kiem phim bo
  fastify.get("/api/search/phim-bo/:name", async (req, res) => {
    try {
      const { name } = req.params;
      const list = await MovieSerieModel.findMovieByName(name);
      res.json({
        list,
      });
    } catch (err) {
      req.log.error(err);
    }
  });

  done();
}

module.exports = indexRouter;
