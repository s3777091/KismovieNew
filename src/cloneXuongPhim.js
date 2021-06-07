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
  let listMV = $(".movie-item");
  for (let i = listMV.length - 1; i > 0; i--) {
    let linkClones = await MovieModel.getListLinkByCloneFrom(
      hostClone.XUONG_PHIM
    );
    let linkVM = $(listMV[i]).find("a.block-wrapper").attr("href");
    linkVM = await getFullLink(linkVM);
    console.log({linkVM});
    let rebaseLink = rebaseLinkClone(linkVM);
    if (!linkClones.includes(rebaseLink)) {
      try {
        await getInfoPhim(linkVM);
      } catch (error) {}
    }
  }
};
const getFullLink = async (link) => {
  if(!link.includes('http')) {
    return hostClone.BASE_LINK_XUONG_PHIM+link;
  }else {
    return link;
  }
}
//Lay thong tin phim
const getInfoPhim = async (linkMV) => {
  console.log(linkMV);
  let buf = await common.httpGet(linkMV);
  let contentHome = buf.toString("utf-8");
  let $ = cheerio.load(contentHome, { decodeEntities: false });

  let linkSource = $("#btn-film-watch").attr("href");
  if (!linkSource) {
    return;
  }
  //Kiem tra phim le hay phim bo
  let breadcrumb = $(".breadcrumb").text().toLowerCase();
  if (breadcrumb.includes("phim bộ")) {
    console.log("==== PHIM BO =====");
    return;
  } else {
    console.log("===== PHIM LE ======");
  }
  let rebaseLink = rebaseLinkClone(linkSource);
  let linkClones = await MovieModel.getListLinkByCloneFrom(
    hostClone.XUONG_PHIM
  );
  if (linkClones.includes(rebaseLink)) {
    return;
  }

  let title = $(".movie-title .title-1").text();
  let slug = removeVI(title).replace("&", "-") + "-xp";

  let description = $(".block-movie-content .content").text().trim();
  let info = $(".movie-meta-info .movie-dt");
  let contentInfo = $(".movie-meta-info .movie-dd");
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
  for (let i = 0; i < info.length; i++) {
    let text = $(info[i]).text().toLowerCase().replace(":", "");
    switch (text) {
      case "năm":
        year = $(contentInfo[i]).text().trim();
        break;
      case "thời gian":
        times = $(contentInfo[i]).text().trim();
        break;
      case "chất lượng":
      case "chất lượng [phút/tập]":
        quanlity = $(contentInfo[i]).text().trim();
        break;
    }
  }
  let category = "";
  try {
    let strCat = $(".movie-meta-info .dd-cat a");
    let tmpCat = [];
    if (strCat) {
      for (let i = 0; i < strCat.length; i++) {
        tmpCat.push($(strCat[i]).text().toLowerCase());
      }
    }
    if(tmpCat.includes('phim 18+ mới')) {
      console.log("KO CLONE PHIM 18+");
      return;
    }
    console.log({tmpCat});
    category = tmpCat.join(",");
  } catch (error) {}
  let categorySlug = "";
  if (category) {
    let catSplit = category.split(",");
    catSplit.map((c) => (categorySlug += removeVI(c) + ","));
  }

  let region = "Quốc gia khác";
  try {
    region = $(".movie-meta-info .dd-country").text().trim().replace(",", "");
  } catch (error) {}

  let regionSlug = removeVI(region);
  let trial = "";
  try {
    trial = $(".block-movie-content iframe").attr("src");
  } catch (error) {
    trial = "";
  }

  //Tao thumb phim
  let urlImgThumb = $(".movie-image img").attr("src");
  const movieThumb = await common.cloneImage(urlImgThumb);
  let infoMovie = {
    slug,
    title,
    description,
    movieThumb,
    trial,
    cloneLink: rebaseLink,
    cloneFrom: hostClone.XUONG_PHIM,
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
    await getDetailMVSingle(linkSource, infoMovie, movieOption, urlImgThumb);
  } catch (error) {
    console.log(error);
  }
};

const getDetailMVSingle = async (link, infoMovie, movieOption, urlImgThumb) => {
  console.log({ link });
  let buf = await common.httpGet(link);
  let contentVMDetail = buf.toString("utf-8");
  const $ = cheerio.load(contentVMDetail);
  const urlDetailMV = $("#watch-block iframe").attr("src");
  console.log({urlDetailMV});
  if(urlDetailMV && urlDetailMV.includes(hostClone.API_PLAY_XUONG_PHIM)) {
    //Get file
    let contentFile = await axios.get(urlDetailMV, {
      headers: {
        Referer:hostClone.API_PLAY_XUONG_PHIM
      }
    });
    let contentDetail = contentFile.data;
    const ptFile = /sources: \[\{.+?\}\]/g
    let sources = contentDetail.match(ptFile);
    if(sources) {
      sources = sources[0].replace('sources: ','');
      sources = JSON.parse(sources);
    }
    if(sources) {
      infoMovie.resources = sources;
    }
  }else 
  if(urlDetailMV && urlDetailMV.includes('i3cdn.xyz')) {
    let id = urlDetailMV.split("/").pop();
    infoMovie.resources = [{file:id}];
  }else {
    console.log('NO sources');
    return;
  }
 
  const {hash, key} = common.generateKeyAndHash(id);

  const resDetail = await axios.get(`https://i3cdn.xyz/get-info?ios=true`, {
    headers: {
      hash, key
    }
  });
  const {sources} = resDetail.data.data;
  if(infoMovie.resources) {
    const movieThumb = await common.cloneImage(urlImgThumb);
    infoMovie.movieThumb = movieThumb
    let idMovie = await common.insertMovie(infoMovie);
    movieOption.movieId = idMovie;
    console.log("INSERT MOVIE: ", idMovie);
    console.log("MOVIE: ", infoMovie);
    console.log("MOVIE OPTION: ", movieOption);
    common.insertMovieOption(movieOption);
  }
};
var countClone = 60;
const uploadRemoteDoodServer = async (linkSource, title) => {
  const requestlistVideos = await axios.get(config.DOOD_API_LIST_FILE);
  const listFiles = requestlistVideos.data.result.files;
  let isExisted = listFiles.find(f => encodeURIComponent(f.title) == encodeURIComponent(title));
  //Neu co file thi return
  if(isExisted) {
    console.log('File existed: ', isExisted);
    return config.DOOD_EMBED_API.replace("[FILECODE]", isExisted.file_code);
  }

  let apiUpload = config.DOOD_UPLOAD_API.replace(
    "[URL]",
    linkSource
  ).replace("[TITLE]", encodeURIComponent(title));
  console.log({ apiUpload });
  let resUploadRemoteDood = await axios.get(apiUpload);
  let fileCode = resUploadRemoteDood.data.result.filecode;
  let doodLink = config.DOOD_EMBED_API.replace("[FILECODE]", fileCode);
  countClone--;
  return doodLink;
};
//Format lai link clone
const rebaseLinkClone = (link) => {
  return link.replace(hostClone.BASE_LINK_XUONG_PHIM, hostClone.XUONG_PHIM);
};

module.exports = {
  getListHomePage,
  getInfoPhim,
};
