const axios = require("axios");
const cheerio = require("cheerio");
const common = require("./common");
const MovieModel = require("./db/model/Movie");
const hostClone = require("./config/hostClone");
const config = require("./config");
// const { getListMovies } = require("./db/firebaseDb");
const { removeVI } = require("jsrmvi");
const { httpGet } = require("./common");
const fs = require("fs");
const getListHomePage = async (url) => {
  console.log(`START GET LIST LINK HOME ${url}`);
  let buf = await common.httpGet(url);
  let contentHome = buf.toString("utf-8");
  const $ = cheerio.load(contentHome);
  let listMV = $(".uk-cover-container");

  for (let i = listMV.length - 1; i >= 0; i--) {
    let linkVM = $(listMV[i]).find("a").attr("href");
    console.log({ linkVM });
    let linkClones = await MovieModel.getListLinkByCloneFrom(
      hostClone.PHIM4400
    );
    let linkRebase = rebaseLinkClone(linkVM);
    if (!linkClones.includes(linkRebase)) {
      await getDetailMV_V2(linkVM);
    }
  }
};
const rebaseLinkClone = (link) => {
  return link.replace(hostClone.BASE_LINK_PHIM4400, hostClone.PHIM4400);
};
var countClone = 60;
const getListLinkMV = async (url) => {
  console.log(`START GET LIST LINK VM ${url}`);
  let buf = await common.httpGet(url);
  let contentHome = buf.toString("utf-8");
  const $ = cheerio.load(contentHome);
  let listMV = $(".uk-article");
  let linkClones = await MovieModel.getListLinkByCloneFrom(hostClone.PHIM4400);
  for (let i = 0; i < listMV.length; i++) {
    let linkVM = $(listMV[i]).find(".uk-link-reset").attr("href");
    let linkRebase = rebaseLinkClone(linkVM);
    if (!linkClones.includes(linkRebase)) {
      if (countClone > 0) {
        await getDetailMV_V2(linkVM);
      } else {
        console.log("==========WAIT IMPORT LATER===========");
      }
    }
  }
};
//V2
const getDetailMV_V2 = async (urlDetail) => {
  console.log(`======START GET DETAIL MV LINK: ${urlDetail}`);
  let buf = await common.httpGet(urlDetail);
  let contentVMDetail = buf.toString("utf-8");
  const $ = cheerio.load(contentVMDetail);

  let title = $(".info-phim h1").text();
  let slug = removeVI(title);
  let linkSource = $(".fb-like").attr("data-href");
  let description = $(".content p").text().trim();
  let trial = $(".trailer-phim a").attr("href");
  let thumbLink = $('meta[property="og:image"]').attr("content");
  let infoMovie = {
    slug,
    title,
    description,
    // movieThumb,
    trial,
    cloneLink: rebaseLinkClone(urlDetail),
    cloneFrom: hostClone.PHIM4400,
  };

  //Get mv option
  let trOptions = $(".uk-table.uk-table-striped").find("tr")[1];
  let options = $(trOptions).find("td");
  let times = $(options[0]).text().trim();
  let quanlity = $(options[1]).text().trim();
  let year = $(options[2]).text().trim();
  if(isNaN(parseInt(year))) {
    year = 2020
  };
  //Get category movie
  let category = $(".uk-breadcrumb").find("li");
  let categoryValue = $(category[1]).text().trim().toLowerCase(); //$(category).text().trim().toowerCase();

  let movieOption = {
    times,
    category: categoryValue,
    categorySlug: removeVI(categoryValue),
    year,
    quanlity,
    region: "Quốc gia khác",
    regionSlug: "quoc-gia-khac",
  };

  const resources = await getSourceMV_V2(linkSource, title);
  if (resources && resources.length > 0) {
    infoMovie.resources = resources;
    let movieThumb = await common.cloneImage(thumbLink);
    infoMovie.movieThumb = movieThumb;
    let movieId = await common.insertMovie(infoMovie);
    movieOption.movieId = movieId;
    common.insertMovieOption(movieOption);
    console.log({ countClone });
  }
};

const getSourceMV_V2 = async (url, title) => {
  console.log(`======START GET SOURCE MV LINK ${url}`);
  try {
    var buf = await common.httpGet(url);
    let contentPage = buf.toString("utf-8");
    const patternIframe1 = /id="ifame-1">.+?<\/iframe>/g;
    const patternIframe2 = /id="ifame-2">.+?<\/iframe>/g;
    const patternIframe3 = /id="ifame-3">.+?<\/iframe>/g;
    const patternIframe4 = /id="ifame-4">.+?<\/iframe>/g;

    let server1 = "";
    let server2 = "";
    let server3 = "";
    let server4 = "";

    try {
      server1 = contentPage.match(patternIframe1)[0];
    } catch (error) {
      console.log('Not found frame 1');
    }
    try {
      server2 = contentPage.match(patternIframe2)[0];
    } catch (error) {
      console.log('Not found frame 2');
    }
    try {
      server3 = contentPage.match(patternIframe3)[0];
    } catch (error) {
      console.log('Not found frame 3');
    }
    try {
      server4 = contentPage.match(patternIframe4)[0];
    } catch (error) {
      console.log('Not found frame 4');
    }
   
  
    let listServer = [server1, server2, server3, server4];
    let listResource = [];

    let fembedLink = listServer.find((s) => s.includes("fembed"));
    let feurlLink = listServer.find((s) => s.includes("feurl"));
    let srcFemberLink = ""
    if (fembedLink) {
      srcFemberLink  = await getSrcFromIframe(fembedLink);
    }

    if (feurlLink) {
      srcFemberLink = await getSrcFromIframe(feurlLink);
    }
    if(srcFemberLink) {
      let doodLink = await uploadRemoteDoodServer(srcFemberLink, title);
      listResource.push(doodLink);
    }
    //Get resource from fembed
    let hxfileLink = listServer.find((s) => s.includes("hxfile"));
    if (hxfileLink) {
      let srcHxFile = await getSrcFromIframe(hxfileLink);
      //Neu ko co fember link thi upload tu hfileLink
      if(!srcFemberLink && srcHxFile) {
        let hxSource = await getResourceHxFile(srcHxFile);
        let doodLink1 = await uploadRemoteDoodServer(hxSource[0].file, title);
        listResource.push(doodLink1);
      }
      listResource.push(srcHxFile);
    }
    console.log({ listResource });
    return listResource;
  } catch (error) {
    console.log(error);
    return null;
  }
};
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
const getSrcFromIframe = async (strIframe) => {
  const patternSrc = /src=".+?"/g;
  let src = strIframe.match(patternSrc)[0].split('"');
  return src[1];
};
const getSourceFembed = async (link) => {
  //Get list resource
  let listPart = link.split("/v/");
  let urlGetSource = listPart[0] + "/api/source/" + listPart[1];
  console.log({ urlGetSource });
  let sourceVideos = await axios.post(urlGetSource);
  console.log("HEADER", sourceVideos.headers);
  let { data } = sourceVideos.data;
  return data;
};

const getSourceDoodto = async (link) => {
  try {
    let realLinkMV = await axios.get(link);
    let realLink =
      "https://dood.to/" + realLinkMV.request.socket._httpMessage.path;

    let buf = await httpGet(realLink);
    let contentDoodto = buf.toString("utf-8");
    let patternLinkMd5 = /pass_md5\/.+?'/g;
    let patternToken = /a\+\"\?token=.+?"/g;

    let token = contentDoodto
      .match(patternToken)[0]
      .split("&")[0]
      .split("=")[1];
    let linkPassMd5 = contentDoodto.match(patternLinkMd5)[0].replace("'", "");
    let resLinkStream = await axios.get(`https://dood.to/${linkPassMd5}`, {
      headers: {
        Host: "dood.to",
        Referer: link,
      },
    });
    let file = resLinkStream.data + "?token=" + token;
    return [{ file }];
  } catch (error) {
    return null;
  }
};
let tryGetResouceHx = 0;
const getResourceHxFile = async (link) => {
  console.log({ link });
  let buf = await httpGet(link);
  let content = buf.toString("utf-8");
  let patternLink = /\'\|player.+?split/g;
  let patternKeyMap = /return p}\(.+?,36/g;
  let patternCountMap = /\,36,.+?,/g;
  try {
    let keyMap = content
      .match(patternKeyMap)[0]
      .replace("return p}('", "")
      .replace("',36", "");
    let countValueMap = content
      .match(patternCountMap)[0]
      .replace(",36,", "")
      .split(",")[0];

    let valueScript = content
      .match(patternLink)[0]
      .replace(/\'/g, "")
      .replace(/\.split/g, "");
    let srcConvert = await convertSourceHxfile( 
      keyMap,
      valueScript.split("|"),
      countValueMap
    );
    if (srcConvert) {
      let patternSource = /sources:\[.+?]/g;
      let source = srcConvert.match(patternSource)[0].replace("sources:", "");
      console.log({ source });
      tryGetResouceHx = 0;
      return JSON.parse(source);
    } else {
      return null;
    }
  } catch (error) {
      console.log("Can not get resource link: ", link);
      tryGetResouceHx = 0;
      return null;
  }
  // console.log(content);
};

const convertSourceHxfile = async (p, k, c) => {
  let a = 36;
  while (c--)
    if (k[c])
      p = p.replace(new RegExp("\\b" + c.toString(a) + "\\b", "g"), k[c]);
  return p;
};
module.exports = {
  getListLinkMV,
  getListHomePage,
  getResourceHxFile,
  getSourceFembed,
  getSourceDoodto,
  getDetailMV_V2,
};
