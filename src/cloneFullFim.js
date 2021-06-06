const axios = require("axios");
const cheerio = require("cheerio");
const common = require("./common");
const SerieModel = require("./db/model/MovieSerie");
const MovieModel = require("./db/model/Movie");

// const { getListMovies } = require("./db/firebaseDb");
const hostClone = require("./config/hostClone");
const { removeVI } = require("jsrmvi");
const { httpGet } = require("./common");
const fs = require("fs");
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
const getListPhimByCategory = async (urlCategory) => {
  console.log(`START GET LIST LINK CATEGORY ${urlCategory}`);
  let buf = await common.httpGet(urlCategory);
  let contentCategory = buf.toString("utf-8");
  let $ = cheerio.load(contentCategory, { decodeEntities: false });

  //Lay danh sach link phim moi cap nhat
  let listLinkElement = $('.item-list-wrapper.w-dyn-list div[role="listitem"]');
  let linkClones = await MovieModel.getListLinkClone();

  console.log("TOTAL MOVIES: ", listLinkElement.length);
  for (let i = 0; i < listLinkElement.length; i++) {
    let linkMV = $(listLinkElement[i]).find("a").attr("href");
    linkMV = await getFullUrlFullFim(linkMV);
    let rebaseLink = rebaseLinkClone(linkMV);
    console.log({ rebaseLink });
  }

  for (let i = 0; i < listLinkElement.length; i++) {
    let linkMV = $(listLinkElement[i]).find("a").attr("href");
    linkMV = await getFullUrlFullFim(linkMV);
    let rebaseLink = rebaseLinkClone(linkMV);
    if (!linkClones.includes(rebaseLink)) {
      await getInfoPhim(linkMV);
    }
  }
};

const getInfoPhim = async (linkMV) => {
  let buf = await common.httpGet(linkMV);
  let contentHome = buf.toString("utf-8");
  fs.writeFileSync("fulfim.html", contentHome);
  let $ = cheerio.load(contentHome, { decodeEntities: false });

  let linkSource = $(".button_xemphim").attr("href");
  linkSource = await getFullUrlFullFim(linkSource);

  let rebaseLink = rebaseLinkClone(linkSource);
  let linkClones = await MovieModel.getListLinkClone();
  if (linkClones.includes(rebaseLink)) {
    return;
  }

  let title = $(".header-title").text();
  let slug = removeVI(title);

  let category = $(".header-content-block .info-title-link").text();
  let categorySlug = removeVI(category);
  let inforMovieContent = $(".header-short-description.w-richtext p").html();
  let inforMovie = inforMovieContent.split("<br>");

  let year = "";
  try {
    year = inforMovie
      .find((item) => item.includes("Năm") || item.includes("Phát hành"))
      .split(":")[1]
      .trim();
  } catch (error) {}

  let quanlity = "";
  try {
    quanlity = inforMovie
      .find((item) => item.includes("Chất lượng"))
      .split(":")[1]
      .trim();
  } catch (error) {}

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
  let trial = decodeURIComponent($("#review .embedly-embed").attr("src"))
    .split("src=")[1]
    .split("?feature")[0];
  //Tao thumb phim
  let urlImgThumb = $('meta[property="twitter:image"]').attr("content");
  const movieThumb = await common.cloneImage(urlImgThumb);
  let infoMovie = {
    slug,
    title,
    description,
    movieThumb,
    trial,
    cloneLink: rebaseLink,
    cloneFrom: hostClone.FULFIM,
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
  await getDetailMVSingle(linkSource, infoMovie, movieOption);
};

const getDetailMVSingle = async (link, infoMovie, movieOption) => {

  console.log({ link });
  let buf = await common.httpGet(link);
  let contentVMDetail = buf.toString("utf-8");
  fs.writeFileSync('detailFulfim.html', contentVMDetail)
  const $ = cheerio.load(contentVMDetail, { decodeEntities: false });


  let resources = $("video source").attr("src");

  if (resources) {
    infoMovie.resources = [[{ file: resources, type: 'video/mp4' }]];
  } else {
    resources = $(".w-embed.w-iframe").find("iframe").attr("src");
    if (resources) {
      infoMovie.resources = [[{ file: resources, type: 'video/mp4' }]];
    }
  }
  if(resources.includes('streamtape') || resources.includes('playhydrax')) {
    console.log('IGNORE THI MOVIE only streamtape link: ', infoMovie.title);
    return;
  }
  if(resources) {
    let idMovie = await common.insertMovie(infoMovie);
    movieOption.movieId = idMovie;
    console.log("INSERT MOVIE: ", idMovie);
    common.insertMovieOption(movieOption);
  }

};
const getFullUrlFullFim = async (url) => {
  if (!url.includes("http")) {
    url = "https://www.fullphim.net" + url;
  }
  return url;
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
  let title = $(".header-title").text().replace('&nbsp;','');
  let slug = removeVI(title);

  let category = $(".header-content-block .info-title-link").text();
  let categorySlug = removeVI(category);
  let inforMovieContent = $(".header-short-description.w-richtext p").html();

  let inforMovie = "";
  try {
    inforMovie  = inforMovieContent.split("<br>");
  } catch (error) {
      return;
  }
 

  let year = "2020";
  try {
    year = inforMovie
    .find((item) => item.includes("Năm"))
    .split(":")[1]
    .replace('</strong>','')
    .trim();
  } catch (error) {
    
  }
 
  let parts = 0;
  try {
    parts = inforMovie
      .find((item) => item.includes("Số tập"))
      .split(":")[1]
      .trim();
  } catch (e) {}
  let times = ""
  try {
    times = inforMovie
    .find((item) => item.includes("Thời lượng"))
    .split(":")[1]
    .trim();
  } catch (error) {
    
  }

  let region = "Quốc gia khác"
  try {
    region =  inforMovie
    .find((item) => item.includes("Quốc gia"))
    .split(":")[1]  
    .trim();
  } catch (error) {
    
  }
   
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
  let listPhimElement = $(".collection-list-wrapper").find(".collection-item");
  let linkClones = await SerieModel.getPartLinkClones();
  for (let i = 0; i < listPhimElement.length; i++) {
    let linkVM = $(listPhimElement[i]).find("a").attr("href");
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
  const $ = cheerio.load(contentVMDetail, { decodeEntities: false });

  let title = $(".header-title").text();
  let slug = removeVI(title);
  // console.log({ movieThumb, titleMVOrigin, description, trial });
  let infoMovie = {
    slug,
    title,
    cloneLink: rebaseLinkClone(urlDetail),
    cloneFrom: hostClone.FULFIM,
    serieSlug: serieSlug,
  };
  let resources = $("video source").attr("src");

  if (resources) {
    infoMovie.resources = [[{ file: resources, type: 'video/mp4' }]];
    let resPart = await SerieModel.insertPartSerieMovie(infoMovie);
    console.log({ resPart });
  } else {
    resources = $(".w-embed.w-iframe").find("iframe").attr("src");
    if (resources) {
      infoMovie.resources = [[{ file: resources, type: 'video/mp4' }]];
      //await common.insertMovie(infoMovie);
      let resPart = await SerieModel.insertPartSerieMovie(infoMovie);
      console.log({ resPart });
    }
  }
};

//Format lai link clone
const rebaseLinkClone = (link) => {
  return link.replace(hostClone.BASE_LINK_FULLFIM, hostClone.FULFIM);
};
//Clone phim bo
const clonePhimBo = async (urlParent) => {
  //TODO: Get List phim
  const bufHome = await httpGet(urlParent);
  const contentHome = bufHome.toString();
  const $ = cheerio.load(contentHome);

  let listMV = $('.item-list-wrapper.w-dyn-list div[role="listitem"]');
  //Lay danh sach link phim bo
  for (let i = listMV.length - 1; i >= 0; i--) {
    let linkVM = $(listMV[i]).find("a").attr("href");
    linkVM = await getFullUrlFullFim(linkVM);
    await getListPhimGroup(linkVM);
  }
};

//Lay source play tu streamtape
const getSourceStreamTape = async(link) => {
  console.log({link});
  const buf = await httpGet(link);
  fs.writeFileSync('streamfile.html', buf.toString("utf-8"))
  const $ = cheerio.load(buf.toString("utf-8"), { decodeEntities: false});

}

module.exports = {
  getListHomePage,
  clonePhimBo,
  getListPhimByCategory,
  getDetailMV,
  getSourceStreamTape
};
