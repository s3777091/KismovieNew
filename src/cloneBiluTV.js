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
    let linkClones = await MovieModel.getListLinkByCloneFrom(hostClone.BILU_TV);
    let linkVM = $(listMV[i]).find("a.halim-thumb").attr("href");
    let rebaseLink = rebaseLinkClone(linkVM);
    if (!linkClones.includes(rebaseLink)) {
      await getInfoPhim(linkVM);
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
  let listSV = $('#listsv-1 li');
  if(listSV.length > 1) {
    console.log('==== PHIM BO =====')
    return;
  }else {
    console.log('===== PHIM LE ======')
  }
  let rebaseLink = rebaseLinkClone(linkSource);
  let linkClones = await MovieModel.getListLinkByCloneFrom(hostClone.BILU_TV);
  if (linkClones.includes(rebaseLink)) {
    return;
  }

  let title = $(".movie-detail .entry-title").text();
  let slug = removeVI(title).replace("&", "-");

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
  let urlImgThumb = $('meta[property="og:image"]').attr("content");
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
    cloneFrom: hostClone.BILU_TV,
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
  let patternKeyMap = /var halim_cfg =.+?}}/g;
  let patternAjaxUrl = /var ajax_var =.+?}/g;
  let scripSource = contentVMDetail.match(patternKeyMap);
  let scriptAjaxUrl = contentVMDetail.match(patternAjaxUrl);
  let ajaxInfo = scriptAjaxUrl[0].replace("var ajax_var =", "").trim();
  ajaxInfo = JSON.parse(ajaxInfo);
  if (scripSource) {
    let configMV = scripSource[0].replace("var halim_cfg =", "").trim();

    configMV = JSON.parse(configMV);
    let urlHash = configMV.player_url;
    const nonce = ajaxInfo.nonce;
    const resGetHashMv = await axios.get(
      `${urlHash}?episode_slug=${configMV.episode_slug}&server_id=${configMV.server}&post_id=${configMV.post_id}&nonce=${nonce}`,
      {
        headers: {
          "X-Requested-With": "XMLHttpRequest",
        },
      }
    );
    const {
      data: { sources, status },
    } = resGetHashMv.data;
    const patternGetHash = /hash=.+?"/g;
    let hashResult = sources.match(patternGetHash);
    if (hashResult) {
      let hash = hashResult[0].replace("hash=", "").replace('"', "");
      const urlGetSourceMV =
        hostClone.BASE_LINK_BILU + "/iframe/ajax.php?url=" + hash;
      const resGetSourceMV = await axios.get(urlGetSourceMV);
      const result = resGetSourceMV.data;
      const filePlay = result.sources[0].file;
      //Kiem tra link con song ko
      try {
        await axios.get(filePlay);
      } catch (error) {
        console.log("=== LINK DIE ===");
        return;
      }
      infoMovie.resources = [result];
      let idMovie = await common.insertMovie(infoMovie);
      movieOption.movieId = idMovie;
      console.log("INSERT MOVIE: ", idMovie);
      console.log("MOVIE: ", infoMovie);
      console.log("MOVIE OPTION: ", movieOption);
      common.insertMovieOption(movieOption);
    }
  }
};

//Format lai link clone
const rebaseLinkClone = (link) => {
  return link.replace(hostClone.BASE_LINK_BILU, hostClone.BILU_TV);
};

module.exports = {
  getListHomePage,
  getInfoPhim,
};
