const DOOD_KEY = `38628me4ip8ztuqanhpyb`
module.exports = {
    itemPerPage: 12,
    DOOD_API_LIST_FILE: `https://doodapi.com/api/file/list?key=${DOOD_KEY}&per_page=200`,
    DOOD_UPLOAD_API:`https://doodapi.com/api/upload/url?key=${DOOD_KEY}&url=[URL]&new_title=[TITLE]`,
    DOOD_EMBED_API:`https://dood.to/e/[FILECODE]`,
    DOOD_SEARCH:`https://doodapi.com/api/search/videos?key=${DOOD_KEY}&search_term=`
}