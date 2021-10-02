var url = require("url");
var path = require("path");
var mtd = require("zeltice-mt-downloader");

// const { uploadVideo } = require("./app");

var target_url =
  "http://www824.o0-2.com/token=q9O9EOATl_L_Yf9h5FPFWA/1602936024/222.252.0.0/134/7/49/99d96748e32f41c3d9de44ebcd3a7497-480p.mp4";

var file_name = path.basename(url.parse(target_url).pathname);
var file_path = path.join(__dirname, file_name);

const downloadMV = async (fileName, targetUrl) => {
  console.log("INIT DOWNLOAD: ");
  console.log({ targetUrl, fileName });
  var filePath = path.join(__dirname, fileName);
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
    onEnd: (err, result) => {
      if (err) console.error(err);
      else {
        console.log("Download Complete");
        // uploadVideo(filePath, fileName);
      }
    },
  };

  new mtd(filePath, targetUrl, options).start();
};
// var downloader = new mtd(file_path, target_url, options);
// downloader.start();
module.exports = {
  downloadMV,
};
