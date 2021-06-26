const MovieOption = require("../schema/MovieOptionSchema");
const Category = require("../schema/CategorySchema");
//Cap nhat views, downloads, likes, shares
const updateOption = async (movieId, key) => {
  const filter = { movieId: movieId };
  const update = { $inc: { [key]: 1 } };
  try {
    const resUpdate = await MovieOption.findOneAndUpdate(filter, update, {
      new: true,
    });
    return resUpdate;
  } catch (error) {
    console.log(error.message);
    return null;
  }
};
//cap nhat thong tin phim
const updateOne = async (condition, params) => {
  try {
    return await MovieOption.updateOne(condition, params, {
      new: true,
    });
  } catch (error) {
    console.log("UPDATE MOVIE OPTION ERROR: ", error.message);
    return null;
  }
};
const findCategoryName = async (categorySlug) => {
  let cat =  await Category.findOne({ categorySlug:  formatCategory(categorySlug)  }).select([
    "category",
  ]);
  if(cat) {
    return cat;
  }else {
    return {category: categorySlug};
  }
};
const formatCategory = (categorySlug) => {
  if(categorySlug.includes('kinh-di')) {
    return 'phim-kinh-di'
  }
  if(categorySlug.includes('kinh-dien')){
    return 'phim-kinh-dien'
  }
  else {
    return categorySlug;
  }
}
module.exports = {
  updateOption,
  findCategoryName,
  updateOne
};
