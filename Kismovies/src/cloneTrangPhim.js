const axios = require("axios");
const cheerio = require("cheerio");
const common = require("./common");
const SerieModel = require("./db/model/MovieSerie");
const MovieModel = require("./db/model/Movie");

const hostClone = require("./config/hostClone");
const { removeVI } = require("jsrmvi");
const { httpGet } = require("./common");
const fs = require("fs");

//Lay phim tu trang chu
const getListHomePage = async (url) => {
  console.log(`START GET LIST LINK HOME ${url}`);
  let buf = await common.httpGet(url);
  let contentHome = buf.toString("utf-8");
  const $ = cheerio.load(contentHome);
  let listMV = $('div[role="listitem"]');
  let linkClones = await MovieModel.getListLinkClone();
  for (let i = 0; i < listMV.length; i++) {
    let linkVM = $(listMV[i]).find("a").attr("href");
    linkVM = await getFullUrlFullFim(linkVM);
    let rebaseLink = rebaseLinkClone(linkVM);
    if (!linkClones.includes(rebaseLink)) {
      await getListPhimGroup(linkVM);
    }
  }
};

//Lay phim theo the loai
const getListPhimByCategory = async (urlCategory) => {
  console.log(`START GET LIST LINK CATEGORY ${urlCategory}`);
  let buf = await common.httpGet(urlCategory);
  let contentCategory = buf.toString("utf-8");
  let $ = cheerio.load(contentCategory, { decodeEntities: false });

  //Lay danh sach link phim moi cap nhat
  let listLinkElement = $(".imgfilm");

  for (let i = 0; i < listLinkElement.length; i++) {
    let linkMV = $(listLinkElement[i]).find("a").attr("href");
    await getInfoPhim(linkMV);
  }
};

//Lay thong tin phim
const getInfoPhim = async (linkMV) => {
  let buf = await common.httpGet(linkMV);
  let contentHome = buf.toString("utf-8");
  let $ = cheerio.load(contentHome, { decodeEntities: false });

  let linkSource = $(".detail_film .btn.orange").attr("href");
  if (!linkSource) {
    return;
  }
  let rebaseLink = rebaseLinkClone(linkSource);
  let linkClones = await MovieModel.getListLinkByCloneFrom(
    hostClone.TRANG_PHIM
  );
  if (linkClones.includes(rebaseLink)) {
    return;
  }

  let title = $(".details-title").text().replace(/\n/g,'');
  let slug = removeVI(title).replace("&", "-").replace('\n','');

  let inforMovieContent = $(".dec-review-meta ul li");
  let inforMovie = [];
  for (let i = 0; i < inforMovieContent.length; i++) {
    inforMovie.push($(inforMovieContent[i]).text().toLowerCase());
  }

  let year = "2020";
  try {
    year = inforMovie
      .find((item) => item.includes("năm"))
      .split(":")[1]
      .trim();
  } catch (error) {}

  let quanlity = "";
  try {
    quanlity = inforMovie
      .find((item) => item.includes("chất lượng"))
      .split(":")[1]
      .trim();
  } catch (error) {}

  let times = "";
  try {
    times = inforMovie
      .find((item) => item.includes("thời lượng"))
      .split(":")[1]
      .trim();
  } catch (error) {}

  let category = "";
  try {
    category = inforMovie
      .find((item) => item.includes("thể loại"))
      .split(":")[1]
      .trim();
  } catch (error) {}
  let categorySlug = "";
  if (category) {
    let catSplit = category.split(",");
    catSplit.map((c) => (categorySlug += removeVI(c) + ","));
  }

  let region = "Quốc gia khác";
  try {
    region = inforMovie
      .find((item) => item.includes("quốc gia"))
      .split(":")[1]
      .trim();
  } catch (error) {}

  let regionSlug = removeVI(region);
  let description = $(".zmovo-trailor-dec").text();
  let trial = "";
  try {
    let trialLink = $(".detail_film .btn.btn-success").attr("href");
    if (trialLink.includes("v=")) {
      trial = trialLink;
    } else {
      trialLink = trialLink.split("/");
      trial = "//youtube.com/watch?v=" + trialLink[trialLink.length - 1];
    }
  } catch (error) {}

  //Tao thumb phim
  let urlImgThumb = $('meta[property="og:image"]').attr("content");
  let infoMovie = {
    slug,
    title,
    description,
    // movieThumb,
    trial,
    cloneLink: rebaseLink,
    cloneFrom: hostClone.TRANG_PHIM,
  };
  let movieOption = {
    times,
    category: category,
    categorySlug: categorySlug,
    year,
    quanlity,
    region: region,
    regionSlug: regionSlug,
  };
  await getDetailMVSingle(linkSource, infoMovie, movieOption, urlImgThumb);
};

const getDetailMVSingle = async (link, infoMovie, movieOption, urlImgThumb) => {
  console.log({ link });
  let buf = await common.httpGet(link);
  let contentVMDetail = buf.toString("utf-8");
  let patternKeyMap = /return p}\(.+?\{\}\)\)/g;
  let scripSource = contentVMDetail.match(patternKeyMap);
  if (scripSource) {
    scripSource = scripSource[0].replace("return p}(", "").replace("{}))", "");
  }
  let formatData = scripSource.split(";'");
  let p = formatData[0].replace("'", "") + ";";
  let formatData2 = formatData[1].split(",").slice(1);
  let a = formatData2[0];
  let c = formatData2[1];
  let k = formatData2[2].split(".split")[0].replace(/\'/g, "").split("|");
  let resources = await getSource(p, a, c, k, 0, {});
  if (resources) {
    const movieThumb = await common.cloneImage(urlImgThumb);
    infoMovie.movieThumb = movieThumb;
    infoMovie.resources = resources;
    console.log({infoMovie});
    let idMovie = await common.insertMovie(infoMovie);
    movieOption.movieId = idMovie;
    console.log("INSERT MOVIE: ", idMovie);
    common.insertMovieOption(movieOption);
  }
};
const getSource = async (p, a, c, k, e, d) => {
  e = function (c) {
    return (
      (c < a ? "" : e(parseInt(c / a))) +
      ((c = c % a) > 35 ? String.fromCharCode(c + 29) : c.toString(36))
    );
  };
  if (!"".replace(/^/, String)) {
    while (c--) {
      d[e(c)] = k[c] || e(c);
    }
    k = [
      function (e) {
        return d[e];
      },
    ];
    e = function () {
      return "\\w+";
    };
    c = 1;
  }
  while (c--) {
    if (k[c]) {
      p = p.replace(new RegExp("\\b" + e(c) + "\\b", "g"), k[c]);
    }
  }
  // console.log({ p });
  if (p.includes("stream_urls")) {
    let pattern = /stream_urls=\[.+?}]/g;
    let urls = p.match(pattern);
    if (urls) {
      urls = urls[0].replace("stream_urls=", "").replace(/\\\\/g, "");
      urls = JSON.parse(urls);
      urls[0].type = "video/mp4";
      return urls;
    } else {
      return null;
    }
  } else if (p.includes("videojs(")) {
    let pattern = /src:.+?}/g;
    let urls = p.match(pattern);
    if (urls) {
      urls = urls[0].replace("src:\\'", "").replace("\\'}", "");
      return [{ file: urls, type: "video/mp4" }];
    } else {
      return null;
    }
  } else {
    let pData = /data:.+?\}/g;
    let data = p.match(pData)[0].replace("data:", "");
    data = data.split(",");
    let slug = data.find((d) => d.includes("slug:"));
    let token = data.find((d) => d.includes("token:"));
    let episode = data.find((d) => d.includes("episode:"));
    slug = slug.split(":")[1].replace(/\"/g, "").replace("}", "");
    token = token.split(":")[1].replace(/\"/g, "").replace("}", "");
    episode = episode.split(":")[1].replace(/\"/g, "").replace("}", "");
    let formData = { 'slug': slug, 'slug_episode': episode, '_token': hostClone.TOKEN_TRANG_PHIM};
    console.log({formData});
    var querystring = require('querystring');
    let headers = {
      "x-requested-with": `XMLHttpRequest`,
      "Content-Type": "application/x-www-form-urlencoded",
      "Cookie":hostClone.COOKIE_TRANG_PHIM
    };
    try {
      let resData = await axios.post(
        "https://trangphim.net/ajax_fetch_url_episode",
        querystring.stringify(formData),
        {
          headers
        }
      );
      let data = resData.data;
      urls = data.urls;
      return urls;
    } catch (error) {
      console.log(error.response.data.message);
    }
  }
  return null;
};

//Lay danh sach phim bo
const getListPhimGroup = async (url) => {
  console.log(`START GET LIST LINK GROUP VM ${url}`);
  //Load page lay thong tin phim
  let buf = await common.httpGet(url);
  let contentHome = buf.toString("utf-8");
  let $ = cheerio.load(contentHome, { decodeEntities: false });

  //Insert thong tin phim bo neu chua co trong db
  let listMovieSerie = await SerieModel.getSerieLinkClones();
  let title = $(".header-title").text().replace("&nbsp;", "").replace(/\n/g,'');
  let slug = removeVI(title);

  let category = $(".header-content-block .info-title-link").text();
  let categorySlug = removeVI(category);
  let inforMovieContent = $(".header-short-description.w-richtext p").html();

  let inforMovie = "";
  try {
    inforMovie = inforMovieContent.split("<br>");
  } catch (error) {
    return;
  }

  let year = "2020";
  try {
    year = inforMovie
      .find((item) => item.includes("Năm"))
      .split(":")[1]
      .replace("</strong>", "")
      .trim();
  } catch (error) {}

  let parts = 0;
  try {
    parts = inforMovie
      .find((item) => item.includes("Số tập"))
      .split(":")[1]
      .trim();
  } catch (e) {}
  let times = "";
  try {
    times = inforMovie
      .find((item) => item.includes("Thời lượng"))
      .split(":")[1]
      .trim();
  } catch (error) {}

  let region = "Quốc gia khác";
  try {
    region = inforMovie
      .find((item) => item.includes("Quốc gia"))
      .split(":")[1]
      .trim();
  } catch (error) {}

  let regionSlug = removeVI(region);
  let description = $("#review .rtb.w-richtext").html();
  let trialLink = decodeURIComponent($("#review .embedly-embed").attr("src"))
    .split("src=")[1]
    .split("?feature")[0];
  // console.log({title, slug, year, parts, times, region, regionSlug, category, categorySlug, description});
  if (!listMovieSerie.includes(rebaseLinkClone(url))) {
    //Tao thumb phim
    let urlImgThumb = $('meta[property="twitter:image"]').attr("content");
    const movieThumb = await common.cloneImage(urlImgThumb);
    //Tao ten phim bo
    let insertMovieSerie = await SerieModel.insertSerieMovie({
      title,
      description,
      slug,
      category,
      categorySlug,
      movieThumb,
      year,
      trial: trialLink,
      parts,
      times,
      region,
      regionSlug,
      createdAt: new Date().toISOString(),
      cloneFrom: hostClone.FULFIM,
      cloneLink: rebaseLinkClone(url),
    });
    console.log({ insertMovieSerie });
  }

  //Load page phim chi tiet de lay danh sach phim
  let linkSource = $(".button_xemphim").attr("href");
  linkSource = await getFullUrlFullFim(linkSource);

  let bufList = await common.httpGet(linkSource);
  let contentList = bufList.toString("utf-8");
  // fs.writeFileSync('contentList.html', contentList);
  $ = cheerio.load(contentList, { decodeEntities: false });

  //Lay danh sach link phim cua group
  let listPhimElement = $(".tap-phim .tap-phim--detail").find("a");
  let linkClones = await SerieModel.getPartLinkClones();
  for (let i = 0; i < listPhimElement.length; i++) {
    let linkVM = $(listPhimElement[i]).attr("href");
    linkVM = await getFullUrlFullFim(linkVM);
    let rebaseLink = rebaseLinkClone(linkVM);
    console.log({ rebaseLink });
    if (!linkClones.includes(rebaseLink)) {
      await getDetailMV(linkVM, slug);
    }
  }
};

//Lay thong tin chi tiet phim
const getDetailMV = async (urlDetail, serieSlug) => {
  console.log(`======START GET DETAIL MV LINK: ${urlDetail}`);

  let buf = await common.httpGet(urlDetail);
  let contentVMDetail = buf.toString("utf-8");
  let patternKeyMap = /return p}\(.+?\{\}\)\)/g;
  let scripSource = contentVMDetail.match(patternKeyMap);
  if (scripSource) {
    scripSource = scripSource[0].replace("return p}(", "").replace("{}))", "");
  }
  let formatDat = "";
  try {
    formatData = scripSource.split(";'");
  } catch (error) {
    console.log("ERORR GET SOURCE: ", urlDetail);
    return;
  }

  let p = formatData[0].replace("'", "") + ";";
  let formatData2 = formatData[1].split(",").slice(1);
  let a = formatData2[0];
  let c = formatData2[1];
  let k = formatData2[2].split(".split")[0].replace(/\'/g, "").split("|");
  let resources = await getSource(p, a, c, k, 0, {});
  $ = cheerio.load(contentVMDetail, { decodeEntities: false });
  let title = $("title").text();
  title = title.toLowerCase().replace("trangphim.net", "");

  let slug = removeVI(title);
  // console.log({ movieThumb, titleMVOrigin, description, trial });
  let infoMovie = {
    slug,
    title,
    cloneLink: rebaseLinkClone(urlDetail),
    cloneFrom: hostClone.TRANG_PHIM,
    serieSlug: serieSlug,
  };

  if (resources) {
    infoMovie.resources = resources;
    let resPart = await SerieModel.insertPartSerieMovie(infoMovie);
    console.log({ resPart });
  } else {
    console.log("NotFound resource link: ", urlDetail);
  }
};

//Format lai link clone
const rebaseLinkClone = (link) => {
  console.log({ link });
  return link.replace(hostClone.BASE_LINK_TRANG_PHIM, hostClone.TRANG_PHIM);
};
//Clone phim bo
const clonePhimBo = async (urlCategory) => {
  console.log(`START GET PHIM BO TRANG PHIM:  ${urlCategory}`);
  let buf = await common.httpGet(urlCategory);
  let contentCategory = buf.toString("utf-8");
  let $ = cheerio.load(contentCategory, { decodeEntities: false });

  //Lay danh sach link phim moi cap nhat
  let listLinkElement = $(".imgfilm");

  for (let i = 0; i < listLinkElement.length; i++) {
    let linkMV = $(listLinkElement[i]).find("a").attr("href");
    await getInfoPhimBo(linkMV);
  }
};
//Lay thong tin cho phim bo
const getInfoPhimBo = async (linkMV) => {
  let buf = await common.httpGet(linkMV);
  let contentHome = buf.toString("utf-8");
  let $ = cheerio.load(contentHome, { decodeEntities: false });

  let title = $(".details-title").text();
  let slug = removeVI(title).replace("&", "-").replace('\n','');
  let rebaseLinkSerie = rebaseLinkClone(linkMV);
  //lay danh sach phim bo
  let listMovieSerie = await SerieModel.getSerieLinkClonesByClone(
    hostClone.TRANG_PHIM
  );

  let inforMovieContent = $(".dec-review-meta ul li");
  let inforMovie = [];
  for (let i = 0; i < inforMovieContent.length; i++) {
    inforMovie.push($(inforMovieContent[i]).text().toLowerCase());
  }

  let year = "2020";
  try {
    year = inforMovie
      .find((item) => item.includes("năm"))
      .split(":")[1]
      .trim();
  } catch (error) {}

  let quanlity = "";
  try {
    quanlity = inforMovie
      .find((item) => item.includes("chất lượng"))
      .split(":")[1]
      .trim();
  } catch (error) {}

  let times = "";
  try {
    times = inforMovie
      .find((item) => item.includes("thời lượng"))
      .split(":")[1]
      .trim();
  } catch (error) {}

  let category = "";
  try {
    category = inforMovie
      .find((item) => item.includes("thể loại"))
      .split(":")[1]
      .trim();
  } catch (error) {}
  let categorySlug = "";
  if (category) {
    let catSplit = category.split(",");
    catSplit.map((c) => (categorySlug += removeVI(c) + ","));
  }

  let region = "Quốc gia khác";
  try {
    region = inforMovie
      .find((item) => item.includes("quốc gia"))
      .split(":")[1]
      .trim();
  } catch (error) {}

  let regionSlug = removeVI(region);
  let description = $(".zmovo-trailor-dec").text();
  let trial = "";
  try {
    let trialLink = $(".detail_film .btn.btn-success").attr("href");
    if (trialLink.includes("v=")) {
      trial = trialLink;
    } else {
      trialLink = trialLink.split("/");
      trial = "//youtube.com/watch?v=" + trialLink[trialLink.length - 1];
    }
  } catch (error) {}
  let parts = 0;
  try {
    parts = inforMovie
      .find((item) => item.includes("số tập"))
      .split(":")[1]
      .trim();
  } catch (error) {}
  //Lay danh sach link phim
  let listPhimElement = $(".tap-phim--detail a");
  if (listPhimElement.length == 0) {
    return await getInfoPhim(linkMV);
  }
  //Chua co phim bo thi tao moi
  if (!listMovieSerie.includes(rebaseLinkSerie)) {
    //Tao thumb phim
    let urlImgThumb = $('meta[property="og:image"]').attr("content");
    const movieThumb = await common.cloneImage(urlImgThumb);
    //Tao ten phim bo
    let insertMovieSerie = await SerieModel.insertSerieMovie({
      title,
      description,
      slug,
      category,
      categorySlug,
      movieThumb,
      year,
      trial,
      parts,
      times,
      region,
      regionSlug,
      createdAt: new Date().toISOString(),
      cloneFrom: hostClone.TRANG_PHIM,
      cloneLink: rebaseLinkSerie,
    });
    console.log({ insertMovieSerie });
  }

  let linkClones = await SerieModel.getPartLinkClonesByCloneFrom(
    hostClone.TRANG_PHIM
  );
  for (let i = 0; i < listPhimElement.length; i++) {
    let linkVM = $(listPhimElement[i]).attr("href");
    let rebaseLink = rebaseLinkClone(linkVM);
    console.log({ rebaseLink });
    if (!linkClones.includes(rebaseLink)) {
      console.log("ADD NEW: ", rebaseLink);
      await getDetailMV(linkVM, slug);
    } else {
      console.log("IGNORE NEW: ", rebaseLink);
    }
  }
};

module.exports = {
  getListHomePage,
  clonePhimBo,
  getListPhimByCategory,
  getDetailMV,
  getSource,
  getInfoPhim
};
