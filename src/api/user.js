import api from "./api.js"

/**
 * 读取用户偏好设置
 * GET /api/user/{userId}/preferences
 */
async function fetchPreferences(userId) {
  const response = await api.get(`/user/${userId}/preferences`)
  // response.data = { code: 200, message: "success", data: { adultFilter, excludeUnlicensed } }
  return response.data.data
}

/**
 * 保存用户偏好设置（只传要改的字段即可）
 * PUT /api/user/{userId}/preferences
 */
async function savePreferences(userId, data) {
  const response = await api.put(`/user/${userId}/preferences`, data)
  // response.data = { code: 200, message: "success", data: { adultFilter, excludeUnlicensed } }
  return response.data.data
}

/**
 * 标准化收藏条目：后端返回的 id 可能是数据库自增主键，
 * 真正的 AniList ID 在 animeId 或 anime.id 中，
 * 同时将嵌套的 anime 对象展开到顶层，便于消费方直接使用 title / coverImage 等字段。
 */
function normalizeCollectionItem(item) {
  if (!item) return item
  // 取出真正的 AniList anime ID
  const realId = item.animeId ?? item.anime?.id
  if (!realId) return item // 没有 animeId，说明已经是标准格式

  // 展开嵌套的 anime 对象（如 { id, title, coverImage, genres, episodes }）
  // 注意：item 必须在 animeData 之后展开，确保 currentEpisode、watchStatus 等
  // 库级字段不被 anime 对象的字段覆盖
  const animeData = item.anime || {}
  return {
    ...animeData,
    ...item,
    id: realId,
    // 移除冗余字段避免混乱
    animeId: undefined,
    anime: undefined,
  }
}

/**
 * 获取收藏列表（分页，按收藏时间倒序）
 * GET /api/me/collection?page=1&pageSize=20
 *
 * 兼容多种响应格式：
 *   格式A: { code, message, data: { items, ... } }
 *   格式B: { items, currentPage, lastPage, total }
 *   格式C: { content, number, totalPages, totalElements }  (Spring Page)
 *   格式D: 直接数组
 */
async function fetchCollection(page = 1, pageSize = 100) {
  const response = await api.get("/me/collection", {
    params: { page, pageSize: Math.min(pageSize, 100) },
  })

  // 兼容外层包装：如果有 code/data 结构则剥开
  let raw = response.data
  if (raw && typeof raw === "object" && "code" in raw && "data" in raw) {
    raw = raw.data
  }
  if (!raw) return { items: [], currentPage: 1, lastPage: 1, total: 0 }

  // 情况 D：直接数组
  if (Array.isArray(raw)) {
    return {
      items: raw.map(normalizeCollectionItem),
      currentPage: 1,
      lastPage: 1,
      total: raw.length,
    }
  }

  // 情况 B / C：提取 items 或 content
  const items = raw.items ?? raw.content
  if (Array.isArray(items)) {
    return {
      items: items.map(normalizeCollectionItem),
      currentPage:
        raw.currentPage ?? (raw.number != null ? raw.number + 1 : page),
      lastPage: raw.lastPage ?? raw.totalPages ?? 1,
      total: raw.total ?? raw.totalElements ?? items.length,
    }
  }

  return { items: [], currentPage: 1, lastPage: 1, total: 0 }
}

/**
 * 切换收藏/取消收藏
 * POST /api/me/collection/{animeId}
 * 已收藏则取消，未收藏则添加
 */
async function toggleCollection(animeId) {
  const response = await api.post(`/me/collection/${animeId}`)
  // response.data = { code: 200, message: "success", data: { collected: true/false } }
  return response.data.data
}

/**
 * 获取观影记录库（支持 watchStatus 等过滤参数）
 * GET /api/me/library
 *
 * 兼容多种响应格式：
 *   格式A: { code, message, data: { items, ... } }
 *   格式B: { items, currentPage, lastPage, total }
 *   格式C: { content, number, totalPages, totalElements }  (Spring Page)
 *   格式D: 直接数组
 */
async function fetchLibrary(params = {}) {
  const response = await api.get("/me/library", { params })

  // 兼容外层包装：如果有 code/data 结构则剥开
  let raw = response.data
  if (raw && typeof raw === "object" && "code" in raw && "data" in raw) {
    raw = raw.data
  }
  if (!raw) return { items: [], currentPage: 1, lastPage: 1, total: 0 }

  // 情况 D：直接数组
  if (Array.isArray(raw)) {
    return {
      items: raw.map(normalizeCollectionItem),
      currentPage: 1,
      lastPage: 1,
      total: raw.length,
    }
  }

  // 情况 B / C：提取 items 或 content
  const items = raw.items ?? raw.content
  if (Array.isArray(items)) {
    return {
      items: items.map(normalizeCollectionItem),
      currentPage: raw.currentPage ?? (raw.number != null ? raw.number + 1 : 1),
      lastPage: raw.lastPage ?? raw.totalPages ?? 1,
      total: raw.total ?? raw.totalElements ?? items.length,
    }
  }

  return { items: [], currentPage: 1, lastPage: 1, total: 0 }
}

/**
 * 添加/更新观影记录（可同时设置收藏）
 * POST /api/me/library
 */
async function saveLibraryRecord(data) {
  const response = await api.post("/me/library", data)
  // response.data = { code: 200, message: "success", data: { ... } }
  return response.data.data
}

/**
 * 获取用户观影库记录（包含 currentEpisode 进度）
 * GET /api/me/library
 * 返回所有状态的记录，不限于 WATCHING
 */
async function fetchLibraryRecord(animeId) {
  const response = await api.get(`/me/library/${animeId}`)
  let raw = response.data
  if (raw && typeof raw === "object" && "code" in raw && "data" in raw) {
    raw = raw.data
  }
  if (!raw) return null
  // 新接口直接返回单条记录对象，不需要从数组取
  return normalizeCollectionItem(raw)
}

/**
 * 更新观看进度
 * POST /api/me/library/{animeId}/progress
 * { "progress": 15 }
 */
async function updateWatchProgress(animeId, progress) {
  const response = await api.post(`/me/library/${animeId}/progress`, {
    progress,
  })
  return response.data.data
}

/**
 * 获取收藏列表（轻量级，只返回展示所需字段）
 * GET /me/favorites?page=1&pageSize=20
 * 返回：{ items: [{ id, coverImage, title, genres, episodes }], currentPage, lastPage, total }
 */
async function fetchFavorites(page = 1, pageSize = 20) {
  const response = await api.get("/me/favorites", {
    params: { page, pageSize },
  })
  let raw = response.data
  if (raw && typeof raw === "object" && "code" in raw && "data" in raw) {
    raw = raw.data
  }
  if (!raw) return { items: [], currentPage: 1, lastPage: 1, total: 0 }

  const items = raw.items ?? []
  if (Array.isArray(items)) {
    return {
      items: items.map((item) => ({
        ...item,
        // genres 后端返回逗号分隔字符串，转为数组
        genres:
          typeof item.genres === "string"
            ? item.genres.split(",").filter(Boolean)
            : item.genres,
      })),
      currentPage: raw.currentPage ?? page,
      lastPage: raw.lastPage ?? 1,
      total: raw.total ?? items.length,
    }
  }

  return { items: [], currentPage: 1, lastPage: 1, total: 0 }
}

/**
 * 获取追番列表（轻量级卡片，只返回展示所需字段）
 * GET /me/watching/cards?page=1&pageSize=20
 * 返回：{ items: [{ id, coverImage, title, genres, episodes }], currentPage, lastPage, total }
 */
async function fetchWatchingCards(page = 1, pageSize = 20) {
  const response = await api.get("/me/watching/cards", {
    params: { page, pageSize },
  })
  let raw = response.data
  if (raw && typeof raw === "object" && "code" in raw && "data" in raw) {
    raw = raw.data
  }
  if (!raw) return { items: [], currentPage: 1, lastPage: 1, total: 0 }

  const items = raw.items ?? []
  if (Array.isArray(items)) {
    return {
      items: items.map((item) => ({
        ...item,
        // genres 后端返回逗号分隔字符串，转为数组
        genres:
          typeof item.genres === "string"
            ? item.genres.split(",").filter(Boolean)
            : item.genres,
      })),
      currentPage: raw.currentPage ?? page,
      lastPage: raw.lastPage ?? 1,
      total: raw.total ?? items.length,
    }
  }

  return { items: [], currentPage: 1, lastPage: 1, total: 0 }
}

export {
  fetchPreferences,
  savePreferences,
  fetchCollection,
  toggleCollection,
  fetchLibrary,
  saveLibraryRecord,
  fetchLibraryRecord,
  updateWatchProgress,
  fetchFavorites,
  fetchWatchingCards,
}
