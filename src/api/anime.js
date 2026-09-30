import api from "./api.js"

/**
 * 浏览全部动漫（支持分页、搜索、类型筛选）
 * GET /anilist/browse
 */
async function browseAnime(
  {
    page = 1,
    perPage = 20,
    keyword,
    genre,
    adultFilter,
    excludeUnlicensed,
  } = {},
  signal,
) {
  const params = { page, per_page: perPage }
  if (keyword) params.keyword = keyword
  if (genre) params.genre = genre
  if (adultFilter) params.adultFilter = adultFilter
  if (excludeUnlicensed !== undefined)
    params.excludeUnlicensed = excludeUnlicensed

  const response = await api.get("/anilist/browse", { params, signal })
  // response.data = { code: 200, message: "success", data: { items, currentPage, lastPage, hasNextPage, total } }
  return response.data.data
}

/**
 * 获取所有动漫类型列表
 * GET /anilist/genres
 */
async function fetchGenres() {
  const response = await api.get("/anilist/genres")
  // response.data = { code: 200, message: "success", data: [...] }
  return response.data.data
}

/**
 * 获取单个动漫详情
 * GET /anilist/anime/{id}
 */
async function fetchAnimeDetail(id) {
  const response = await api.get(`/anilist/anime/${id}`)
  return response.data.data
}

export { browseAnime, fetchGenres, fetchAnimeDetail }
