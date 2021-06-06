var express = require("express");
var router = express.Router();
const hostClone = require("../src/config/hostClone");
const clonePhim4400 = require("../src/clonePhim4400");
const cloneFullFim = require("../src/cloneFullFim");
const cloneTrangPhim = require("../src/cloneTrangPhim");
/* GET users listing. */
router.post("/", async (req, res, next) => {
  const { cloneFrom, link } = req.body;
  try {
    if (cloneFrom.toLowerCase() == hostClone.PHIM4400) {
      await clonePhim4400.getListHomePage(link);
    }
    if (cloneFrom.toLowerCase() == hostClone.FULFIM) {
      await cloneFullFim.clonePhimBo(link);
    }
    if (cloneFrom.toLowerCase() == hostClone.TRANG_PHIM) {
      await cloneTrangPhim.clonePhimBo(link);
    }
    console.log('===CLONE DONE=====');
    res.json({ isDone: true });
  } catch (error) {
    res.status(404).json({ isDone: false });
  }
 
});

module.exports = router;
