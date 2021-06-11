const common = require("./src/common");
common.initDb();

const clonePhim4400 = require("./src/clonePhim4400");
const phim4400 = async () => {
  await clonePhim4400.getListHomePage(
    `https://xemphimnao.com/phim-phep-thuat/`
  );
  console.log("========== CLONE DONE ==========");
};
//
const clonePhimtophd = require("./src/cloneTopPhimHD");
const activeCloneTopPhim = async () => {
  await clonePhimtophd.getListHomePage(
    `http://topphimhdz.net/`
  );
  console.log("========== CLONE DONE ==========");
}

const clonexemphimhay = require("./src/clonexemphimhay");
const activexemphimhay = async () => {
  await clonexemphimhay.getListHomePage(
    `http://xemphimhay.net/`
  );

  console.log("========== CLONE DONE ==========");

}



const clonemotphim = require("./src/clonemotphim");
const activemotpim = async () => {
  await clonemotphim.getListHomePage(
    `https://motphims.net`
  );
  console.log("=========== CLONE DONE ==========");
};


const triggerClone = async () => {
  // activeCloneTopPhim();
  phim4400();
  // activemotpim();
  // activexemphimhay();
  // fullPhim();
};
triggerClone();
module.exports = {
  triggerClone,
};
