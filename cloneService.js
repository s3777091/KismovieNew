
const common = require('./src/common');
common.initDb();

const clonePhim4400 = require("./src/clonePhim4400");
const phim4400 = async () => {
  await clonePhim4400.getListHomePage("https://xemphimnao.com/phim-boom-tan/");
  console.log("========== CLONE DONE ==========");
};
// 
const fullPhim = async () => {
  const cloneFullFim = require("./src/cloneFullFim");
  await cloneFullFim.getListHomePage("https://www.fullphim.net");
  let count = 4
  for(let i = count ; i >= 1; i--) {
    await cloneFullFim.clonePhimBo(`https://www.fullphim.net/the-loai/phim-bo?d5307828_page=${i}`);
  }
  await cloneFullFim.clonePhimBo(`https://www.fullphim.net/the-loai/phim-bo`);
  console.log('=========== CLONE DONE ==========');
};


// fullPhim();
const cloneTopPhimHD = require('./src/cloneTopPhimHD');
const activeCloneTopPhim = async() => {
  await cloneTopPhimHD.getListHomePage(`http://topphimhdz.net/phim-thuyet-minh`);
  console.log('=========== CLONE DONE ==========');
}


const triggerClone = async() => {
  activeCloneTopPhim();
  // activeCloneXuongPhim();
  // activeClonebilutv();
  // phim4400();
  // activeClonePhimHay();
  // fullPhim();
}
triggerClone();
module.exports = {
  triggerClone
}