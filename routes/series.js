const config = require("../src/config");
const MovieSerieModel = require("../src/db/model/MovieSerie");
const MovieModel = require("../src/db/model/Movie");
const RegionModel = require("../src/db/schema/RegionSchema");

const log = require("pino")({ level: "error" });

const fastify = require("fastify")({ logger: log });

async function seriesRouter(fastify, options, done) {
  fastify.get("/phim-bo/page/:currentPage", async (req, res, next) => {
    try {
      const { currentPage } = req.params;
      let itemPerPage = config.itemPerPage;
      const promMenu = MovieModel.getMenu();
      const promTotalMovies = MovieSerieModel.countListSerieMovie();

      let [menu, totalMovies] = await Promise.all([promMenu, promTotalMovies]);
      let totalPage =
        totalMovies <= itemPerPage ? 1 : Math.ceil(totalMovies / itemPerPage);
      let skipItem = (currentPage - 1) * itemPerPage;
      let listMovies = await MovieSerieModel.findListSerieMovies(
        itemPerPage,
        skipItem
      );

      res.view("series", {
        title: "Phim bộ",
        currentPage: currentPage,
        totalPage: totalPage,
        parentLink: `/phim-bo`,
        listMovies: listMovies,
        menu: menu,
        movie: null,
        isShowPaging: itemPerPage < totalMovies,
      });
    } catch (err) {
      req.log.error(err);
    }
  });
  fastify.get("/phim-bo/phim/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const promMovie = MovieSerieModel.getDetailSerieMovie(slug);
      const promMenu = MovieModel.getMenu();

      let [menu, infoMovie] = await Promise.all([promMenu, promMovie]);
      res.view("serie-detail", {
        title: "KiMovies - " + infoMovie.title,
        movie: infoMovie,
        menu: menu,
      });
    } catch (err) {
      req.log.error(err);
    }
  });

  //Page Xem phim
  fastify.get("/phim-bo/phim/:slug/xem-phim", async (req, res, next) => {
    try {
      const { slug } = req.params;
      const movie = MovieSerieModel.getDetailPartSerieMovie(slug);
      const menu = MovieModel.getMenu();
      let [resMV, resMenu] = await Promise.all([movie, menu]);
      const listParts = await MovieSerieModel.getListPartBySlugSerie(
        resMV.movie_series[0].slug
      );

      res.view("serie-play", {
        title: "KiMovies - " + resMV.title,
        movie: resMV,
        menu: resMenu,
        parts: listParts.movie_part_series,
        currentPart: slug,
      });
    } catch (err) {
      req.log.error(err);
    }
  });

  //Page the loai
  fastify.get(
    "/phim-bo/the-loai/:category/page/:currentPage",
    async (req, res) => {
      try {
        const { category, currentPage } = req.params;

        let itemPerPage = config.itemPerPage;
        const promMenu = MovieModel.getMenu();
        const promTotalMovies = MovieSerieModel.countMovieByCategory(category);
        const promNameCategory = MovieSerieModel.findCategoryName(category);

        let [menu, totalMovies, resCategory] = await Promise.all([
          promMenu,
          promTotalMovies,
          promNameCategory,
        ]);
        let totalPage =
          totalMovies <= itemPerPage ? 1 : Math.ceil(totalMovies / itemPerPage);
        let skipItem = (currentPage - 1) * itemPerPage;
        let listMovies = await MovieSerieModel.findMovieByCategory(
          category,
          itemPerPage,
          skipItem
        );

        res.view("series-view/list", {
          title: "KiMovie - Thể loại " + category,
          movie: null,
          listMovies: listMovies,
          menu: menu,
          category: resCategory.category,
          totalPage: totalPage,
          currentPage: currentPage,
          isShowPaging: itemPerPage < totalMovies,
          parentLink: `/phim-bo/the-loai/${category}`,
        });
      } catch (err) {
        req.log.error(err);
      }
    }
  );

  //Page quoc gia
  fastify.get(
    "/phim-bo/quoc-gia/:region/page/:currentPage",
    async (req, res) => {
      try {
        const { region, currentPage } = req.params;

        let itemPerPage = config.itemPerPage;
        const promMenu = MovieModel.getMenu();
        const promTotalMovies = MovieSerieModel.countMovieByRegion(region);
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
        let listMovies = await MovieSerieModel.findMovieByRegion(
          region,
          itemPerPage,
          skipItem
        );

        res.view("series-view/region", {
          title: "KiMovie - Quốc gia " + resRegion.region,
          movie: null,
          listMovies: listMovies,
          menu: menu,
          region: resRegion.region,
          totalPage: totalPage,
          currentPage: currentPage,
          parentLink: `/phim-bo/quoc-gia/${region}`,
          isShowPaging: itemPerPage < totalMovies,
        });
      } catch (err) {
        req.log.error(err);
      }
    }
  );

  //Page tim kiem theo nam
  fastify.get("/phim-bo/nam/:year/page/:currentPage", async (req, res) => {
    try {
      const { year, currentPage } = req.params;
      let itemPerPage = config.itemPerPage;
      const promMenu = MovieModel.getMenu();
      const promTotalMovies = MovieSerieModel.countMovieByYear(year);
      let [menu, totalMovies] = await Promise.all([promMenu, promTotalMovies]);
      let totalPage =
        totalMovies <= itemPerPage ? 1 : Math.ceil(totalMovies / itemPerPage);
      let skipItem = (currentPage - 1) * itemPerPage;
      let listMovies = await MovieSerieModel.findMovieByYear(
        year,
        itemPerPage,
        skipItem
      );

      res.view("series-view/year", {
        title: "KiMovie - Năm phát hành " + year,
        movie: null,
        listMovies: listMovies,
        menu: menu,
        year: year,
        totalPage: totalPage,
        currentPage: currentPage,
        isShowPaging: itemPerPage < totalMovies,
        parentLink: `/phim-bo/nam/${year}`,
      });
    } catch (err) {
      req.log.error(err);
    }
  });

  //Page tim kiem
  fastify.get("/phim-bo/tim-kiem/:name/page/:currentPage", async (req, res) => {
    try {
      const { name, currentPage } = req.params;
      let itemPerPage = config.itemPerPage;

      const promMenu = MovieModel.getMenu();
      const promTotalMovies = MovieSerieModel.countMovieByName(name);
      let [menu, totalMovies] = await Promise.all([promMenu, promTotalMovies]);

      let totalPage =
        totalMovies <= itemPerPage ? 1 : Math.ceil(totalMovies / itemPerPage);
      let skipItem = (currentPage - 1) * itemPerPage;
      let listMovies = await MovieSerieModel.findMovieByName(
        name,
        itemPerPage,
        skipItem
      );

      res.view("series-view/search", {
        title: "KiMovie - Tìm kiếm " + name,
        movie: null,
        listMovies: listMovies,
        menu: menu,
        search: decodeURIComponent(name),
        currentPage: currentPage,
        totalPage: totalPage,
        isShowPaging: itemPerPage < totalMovies,
        parentLink: `/phim-bo/tim-kiem/${encodeURIComponent(name)}`,
      });
    } catch (err) {
      req.log.error(err);
    }
  });

  done();
}

module.exports = seriesRouter;
