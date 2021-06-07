const hostClone = require("./config/hostClone");
const axios = require("axios");
const { removeVI } = require("jsrmvi");
const initDb = () => {
  const dbConfig = require("./config/db.json");
  const mongoose = require("mongoose");
  //CONNECT DB
  mongoose
    .connect(dbConfig.DB_CONNECTION_DEV, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useFindAndModify: false,
    })
    .then(() => {
      console.log("CONNECT DB SUCCESS....");
    })
    .catch((err) => {
      console.log("ERROR: ", err);
    });
};
const randomNumber = (max, min) => {
  return Math.floor(Math.random() * max + min);
};
const httpGet = async (url) => {
  return new Promise((resolve, reject) => {
    const http = require("http"),
      https = require("https");

    let client = http;

    if (url.toString().indexOf("https") === 0) {
      client = https;
    }

    client
      .get(url, (resp) => {
        let chunks = [];

        // A chunk of data has been recieved.
        resp.on("data", (chunk) => {
          chunks.push(chunk);
        });

        // The whole response has been received. Print out the result.
        resp.on("end", () => {
          resolve(Buffer.concat(chunks));
        });
      })
      .on("error", (err) => {
        reject(err);
      });
  });
};

var path = require("path");
var mtd = require("zeltice-mt-downloader");
const googleUtils = require("./utils/ggDriverUtils");
const fs = require("fs");
//Download movie and upload to google driver
const download = async (fileName, targetUrl, infoMovie) => {
  console.log(`INIT DOWNLOAD`);
  console.log({ targetUrl, fileName });
  var filePath = path.join(__dirname, "/movies/" + fileName);
  var options = {
    //To set the total number of download threads
    count: 4, //(Default: 2)

    method: "GET", //(Default: GET)

    //HTTP port
    port: 80, //(Default: 80)

    //If no data is received the download times out. It is measured in seconds.
    timeout: 60, //(Default: 5 seconds)

    //Control the part of file that needs to be downloaded.
    range: "0-100", //(Default: '0-100')

    //Triggered when the download is started
    onStart: function (meta) {
      console.log("Download Started", meta);
    },
    //Triggered when the download is completed
    onEnd: async (err, result) => {
      if (err) console.error(err);
      else {
        console.log("Download Complete");
        // uploadVideo(filePath, fileName);
        const folderId = "17E1WcSuAZyH51GpJh0MsV8l56X67WxC2";
        const id = await googleUtils.ggDriverUpload(
          folderId,
          filePath,
          fileName,
          "video/mp4"
        );
        infoMovie.movieId = id;
        await insertMovie(infoMovie);
        fs.unlinkSync(filePath);
      }
    },
  };

  new mtd(filePath, targetUrl, options).start();
};

// Clone thumbnail movie
var imgbbUploader = require("imgbb-uploader");
const fetch = require("node-fetch");
const cloneImage = async (urlImage) => {
  const API_IMG_BB = "a73441ccad25132ef5a4f50ac1af5032";
  console.log({ urlImage });
  if (!urlImage) {
    return "";
  }
  urlImage = urlImage.replace("\n", "");
  let splitNameImg = null;
  if (urlImage.includes("?")) {
    splitNameImg = urlImage.split("?")[0].split("/");
  } else {
    splitNameImg = urlImage.split("/");
  }
  let imgName = splitNameImg[splitNameImg.length - 1];
  let ext = imgName.split(".");
  imgName = removeVI(ext[0]);
  ext = ext[ext.length - 1];
  imgName = imgName + "." + ext;
  // const response = await fetch(encodeURIComponent(urlImage));
  // const buffer = await response.buffer();
  let localImage = `/images/${imgName}`;
  const imgTmp = path.join(__dirname, localImage);
  try {
    await downloadImage(encodeURI(urlImage), imgTmp);
    // fs.writeFileSync(imgTmp, buffer);
  } catch (error) {
    console.error(error.message);
    return {
      full: "/img/placeholder-medium.png",
      thumb: "/img/placeholder.png",
      medium: "/img/placeholder-medium.png",
    };
  }

  try {
    let imgUpload = await imgbbUploader(API_IMG_BB, imgTmp);
    fs.unlinkSync(imgTmp);
    const { image, thumb, medium } = imgUpload;
    let thumbUrl = thumb ? thumb.url : image.url;
    let mediumUrl = medium ? medium.url : image.url;
    return {
      full: image.url,
      thumb: thumbUrl,
      medium: mediumUrl,
    };
  } catch (error) {
    console.log("Error UPLOAD: ", error.message);
    return {
      full: "/img/placeholder-medium.png",
      thumb: "/img/placeholder.png",
      medium: "/img/placeholder-medium.png",
    };
  }
};
const cloneCaption = async (url) => {
  if (!url) {
    return "";
  }
  url = url.replace("\n", "");
  let splitNameCaption = null;
  if (url.includes("?")) {
    splitNameCaption = url.split("?")[0].split("/");
  } else {
    splitNameCaption = url.split("/");
  }
  let captionName = splitNameCaption[splitNameCaption.length - 1];
  const response = await fetch(url);
  const buffer = await response.buffer();
  let localImage = `../public/captions/${captionName}`;
  const captionDir = path.join(__dirname, localImage);
  fs.writeFileSync(captionDir, buffer);
  return captionName;
};
const downloadImage = async (url, fileName) => {
  console.log(url);
  const writer = fs.createWriteStream(fileName);
  const response = await axios({
    url,
    method: "GET",
    responseType: "stream",
    timeout: 20 * 1000,
  });
  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
};
const MovieModel = require("./db/schema/MovieSchema");
const MovieOptionModel = require("./db/schema/MovieOptionSchema");
const RegionModel = require("./db/schema/RegionSchema");
const CategoryModel = require("./db/schema/CategorySchema");
const insertMovie = async (infoMovie) => {
  infoMovie.createdAt = new Date().toISOString();
  let newMovie = new MovieModel(infoMovie);
  let res = await newMovie.save();
  console.log("INSERT MV SUCCESS: ", res._id);
  return res._id;
};
const insertMovieOption = async (movieOption) => {
  movieOption.createdAt = new Date().toISOString();
  movieOption.updatedAt = new Date().toISOString();
  movieOption.shares = randomNumber(1200, 300);
  movieOption.views = randomNumber(30000, 500);
  movieOption.downloads = randomNumber(10000, 400);
  movieOption.likes = randomNumber(30000, 400);
  let options = new MovieOptionModel(movieOption);
  let res = await options.save();
  console.log("INSERT SUCCESS MOVIE OPTION: ", res._id);
};

const initRegion = async () => {
  let listRegion = [
    "Việt Nam",
    "Mỹ",
    "Hàn Quốc",
    "Nhật Bản",
    "Thái Lan",
    "Pháp",
    "Quốc gia khác",
  ];
  let convertRegions = [];
  listRegion.map((r) => {
    let regionSlug = removeVI(r.toLowerCase());
    convertRegions.push({ region: r, regionSlug });
  });
  //Lay danh sach quoc gia
  let exitsRegion = await RegionModel.find();
  //Loc danh sach quoc gia can insert
  let listInsert = [];
  convertRegions.map((cr) => {
    let isExited = exitsRegion.some((er) => er.regionSlug == cr.regionSlug);
    if (!isExited) {
      listInsert.push(cr);
    }
  });
  await RegionModel.insertMany(listInsert);
};

const initCategory = async () => {
  let listCategory = [
    "Phim hành động",
    "Phim viễn tưởng",
    "Phim chiến tranh",
    "Phim hình sự",
    "Phim phiêu lưu",
    "Phim hài hước",
    "Phim võ thuật",
    "Phim kinh dị",
    "Phim tâm lý",
    "Phim tài liệu",
    "Phim hoạt hình",
    "Phim chiếu rạp",
    "Phim lẻ",
  ];
  let convertCat = [];
  listCategory.map((r) => {
    let categorySlug = removeVI(r.toLowerCase());
    convertCat.push({ category: r, categorySlug });
  });
  //Lay danh sach
  let exitsCategory = await CategoryModel.find();
  //Loc danh sach
  let listInsert = [];
  convertCat.map((cr) => {
    let isExited = exitsCategory.some(
      (er) => er.categorySlug == cr.categorySlug
    );
    if (!isExited) {
      listInsert.push(cr);
    }
  });
  await CategoryModel.insertMany(listInsert);
};
const removeMovieNoThumb = async () => {
  let listMoviesErr = await MovieModel.find({ movieThumb: { $eq: null } });
  if (listMoviesErr) {
    listMoviesErr.map((mv) => {
      MovieModel.deleteOne({ _id: mv._id });
    });
  }
};
const checkMovieNoTrial = async () => {
  let listNoTrial = await MovieModel.find({ trial: { $eq: "" } });
  if (listNoTrial) {
    listNoTrial.map((mv) => {
      console.log("Id: ", mv._id);
      console.log("Title: ", mv.title);
      console.log("Slug: ", mv.slug);
      console.log("==================================");
    });
  }
};

const checkIds = async () => {
  let moviesOptions = await MovieOptionModel.find()
    .select(["_id", "movieId"])
    .populate({ path: "movies" });
  let movieNull = moviesOptions
    .filter((op) => op.movies.length == 0)
    .map((mv) => mv._id);
  let deletes = await MovieOptionModel.deleteMany({ _id: { $in: movieNull } });
  console.log({ deletes });
};

const makeid = (t) => {
  for (
    var e = "",
      r =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+{}|":<>?',
      i = r.length,
      n = 0;
    n < t;
    n++
  )
    e += r.charAt(Math.floor(Math.random() * i));
  return e;
};
const getSourcesXuongPhim = async (id) => {
  const CryptoJS = require("crypto-js");
  const hash = makeid(15);
  const key = CryptoJS.AES.encrypt(id, hash).toString();
  const {data: {data: {sources}}} = await axios.get(hostClone.API_GET_SOURCES_XUONG_PHIM, {
    headers: {
      hash,
      key,
    },
  });
  console.log({sources});
  return sources;
};
module.exports = {
  httpGet,
  download,
  cloneImage,
  insertMovie,
  insertMovieOption,
  initRegion,
  initCategory,
  initDb,
  removeMovieNoThumb,
  checkMovieNoTrial,
  checkIds,
  cloneCaption,
  makeid,
  getSourcesXuongPhim,
};
