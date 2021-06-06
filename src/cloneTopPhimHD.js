const axios = require("axios");
const cheerio = require("cheerio");
const common = require("./common");
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
  let listMV = $(".halim-item");
  for (let i = listMV.length - 1; i > 0; i--) {
    let linkClones = await MovieModel.getListLinkByCloneFrom(hostClone.TOP_PHIM_HD);
    let linkVM = $(listMV[i]).find("a.halim-thumb").attr("href");
    let rebaseLink = rebaseLinkClone(linkVM);
    if (!linkClones.includes(rebaseLink)) {
      try {
        await getInfoPhim(linkVM);
      }catch (error) {}
    }
  }
};

//Lay thong tin phim
const getInfoPhim = async (linkMV) => {
  console.log(linkMV);
  let buf = await common.httpGet(linkMV);
  let contentHome = buf.toString("utf-8");
  let $ = cheerio.load(contentHome, { decodeEntities: false });

  let linkSource = $(".halim-watch-box a").attr("href");
  if (!linkSource) {
    return;
  }
  //Kiem tra phim le hay phim bo
  let listSV = $('#halim-list-server > .halim-server .halim-list-eps li');
  if(listSV.length > 1) {
    console.log('==== PHIM BO =====')
    return;
  }else {
    console.log('===== PHIM LE ======')
  }
  let rebaseLink = rebaseLinkClone(linkSource);
  let linkClones = await MovieModel.getListLinkByCloneFrom(hostClone.TOP_PHIM_HD);
  if (linkClones.includes(rebaseLink)) {
    return;
  }

  let title = $(".movie-detail .entry-title").text();
  let slug = removeVI(title).replace("&", "-")+'-tp';

  let description = $(".video-item.halim-entry-box article").text();

  let year = "2020";
  try {
    year = $(".released a").text();
    year = +year;
    if (isNaN(year)) {
      year = "2020";
    }
  } catch (error) {}

  let quanlity = "";

  let times = "";

  let category = "";
  try {
    let strCat = $(".movie-detail .category a");
    let tmpCat = [];
    if (strCat) {
      for (let i = 0; i < strCat.length; i++) {
        tmpCat.push($(strCat[i]).text().toLowerCase());
      }
    }
    category = tmpCat.join(",");
  } catch (error) {}
  let categorySlug = "";
  if (category) {
    let catSplit = category.split(",");
    catSplit.map((c) => (categorySlug += removeVI(c) + ","));
  }

  let region = "Quốc gia khác";
  try {
    region = $(".movie-detail .actors:first a").text();
  } catch (error) {}

  let regionSlug = removeVI(region);
  let trial = "";
  try {
    trial = $("#show-trailer").attr("data-url");
  } catch (error) {
    trial = ""
  }

  //Tao thumb phim
  let urlImgThumb = $('.movie-poster .movie-thumb').attr("src");
  if (urlImgThumb == undefined) {
    urlImgThumb = $('meta[name="twitter:image"]').attr("content");
  }
  const movieThumb = await common.cloneImage(urlImgThumb);
  let infoMovie = {
    slug,
    title,
    description,
    movieThumb,
    trial,
    cloneLink: rebaseLink,
    cloneFrom: hostClone.TOP_PHIM_HD,
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
  try {
    await getDetailMVSingle(linkSource, infoMovie, movieOption);
  } catch (error) {
    console.log(error);
  }
};

const getDetailMVSingle = async (link, infoMovie, movieOption) => {
  console.log({ link });
  let buf = await common.httpGet(link);
  let contentVMDetail = buf.toString("utf-8");
  const $ = cheerio.load(contentVMDetail);
  const urlDetailMV = $('.embed-responsive-item').attr('src');
  const resDetail = await axios.get(urlDetailMV);
  const apiData = resDetail.data;
  let resources = [];
  if(apiData.includes('urlVideo')) {
    let ptUrlVideo = /urlVideo = '.+?'/g
    let ptUrlVideoBK = /urlBK = '.+?'/g
    let ptCaption = /caption = '.+?'/g
    let ptTypeVideo =/typeVideo = '.+?'/g
    let urlVideo = apiData.match(ptUrlVideo)
    let urlVideoBk = apiData.match(ptUrlVideoBK)
    let urlCaption = apiData.match(ptCaption)
    let typeVideo = apiData.match(ptTypeVideo)
    if(urlVideo) {
      urlVideo = urlVideo[0].replace("urlVideo = \'","").replace("\'",'');
    }
    if(urlVideoBk) {
      urlVideoBk = urlVideoBk[0].replace("urlBK = \'","").replace("\'",'');
    }
    caption = ""
    if(urlCaption) {
      urlCaption = urlCaption[0].replace("caption = \'","").replace("\'",'');
      caption = await common.cloneCaption(urlCaption);
      console.log(caption)
    }
    if(typeVideo) {
      typeVideo = typeVideo[0].replace("typeVideo = \'","").replace("\'",'');
    }

    if(urlVideo) {
      resources.push({file: urlVideo, type: typeVideo, caption: caption})
    }
    if(urlVideoBk) {
      resources.push({file: urlVideoBk, type: typeVideo, caption: caption})
    }
  }else {
    //Lay iframe
    const $$ = cheerio.load(apiData);
    let iframe = $$('iframe').attr('src');
    resources.push({file:iframe})
  }
  console.log({resources});
  infoMovie.resources = resources;
  let idMovie = await common.insertMovie(infoMovie);
  movieOption.movieId = idMovie;
  console.log("INSERT MOVIE: ", idMovie);
  console.log("MOVIE: ", infoMovie);
  console.log("MOVIE OPTION: ", movieOption);
  common.insertMovieOption(movieOption);
};

//Format lai link clone
const rebaseLinkClone = (link) => {
  return link.replace(hostClone.BASE_LINK_TOP_PHIM_HD, hostClone.TOP_PHIM_HD);
};

module.exports = {
  getListHomePage,
  getInfoPhim,
};
