const common = require("./src/common");
common.initDb();

const clonePhim4400 = require("./src/clonePhim4400");
const phim4400 = async () => {
  await clonePhim4400.getListHomePage(
    `https://xemphimnao.com`
  );
  console.log("========== CLONE DONE ==========");
};



const fullPhim = async () => {
  const cloneFullFim = require("./src/cloneFullFim");
  await cloneFullFim.getListHomePage("https://www.ssphim.net");
  let count = 4;
  for (let i = count; i >= 1; i--) {
    await cloneFullFim.clonePhimBo(
      `https://www.ssphim.net/the-loai/phim-bo?d5307828_page=${i}`
    );
  }
  await cloneFullFim.clonePhimBo(`https://www.fullphim.net/the-loai/phim-bo`);
  console.log("=========== CLONE DONE ==========");
};



const triggerClone = async () => {
  phim4400();
  // activemotpim();
  // activexemphimhay();
  fullPhim();
};
triggerClone();
module.exports = {
  triggerClone,
};
