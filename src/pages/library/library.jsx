import { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { browseAnime, fetchGenres } from "../../api/anime.js"
import { fetchCollection, toggleCollection } from "../../api/user.js"

const ITEMS_PER_PAGE = 20

// 模块级 genres 缓存（genres 几乎不变，永远不需要重复请求）
let genresCache = null

function AnimeCard({ anime, isFavorited, onToggleFavorite }) {
  const [imgError, setImgError] = useState(false)

  return (
    <Link
      to={`/app/anime/${anime.id}`}
      className="block bg-white rounded-lg border border-[#e2e8f0] p-3 hover:shadow-md transition-shadow duration-150"
    >
      <div className="relative w-full aspect-[3/4] rounded-lg bg-sky-50 overflow-hidden mb-3">
        {anime.coverImage && !imgError && (
          <img
            src={anime.coverImage}
            alt={anime.title}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        )}
        {(!anime.coverImage || imgError) && (
          <div className="absolute inset-0 flex items-center justify-center text-4xl">
            🎬
          </div>
        )}
        <button
          onClick={(e) => {
            e.preventDefault()
            onToggleFavorite(anime)
          }}
          className={`absolute top-2 right-2 p-1.5 rounded-full transition-colors duration-150 shadow-sm ${
            isFavorited
              ? "bg-red-50 text-red-500 hover:bg-red-100"
              : "bg-white/80 text-gray-400 hover:bg-white hover:text-red-400"
          }`}
          title={isFavorited ? "取消收藏" : "添加到收藏"}
        >
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill={isFavorited ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </svg>
        </button>
      </div>
      <h3 className="font-semibold text-[#0f172a] text-sm mb-0.5 truncate">
        {anime.title}
      </h3>
      <p className="text-xs text-[#64748b] mb-1.5 truncate">
        {anime.genres?.join(" / ") || "未分类"}
      </p>
      <div className="flex items-center text-xs">
        <span className="text-[#94a3b8]">
          {anime.episodes} 集 · {anime.statusDesc || anime.status}
        </span>
      </div>
    </Link>
  )
}

function Library() {
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [selectedGenre, setSelectedGenre] = useState("全部")
  const [currentPage, setCurrentPage] = useState(1)
  const [animeItems, setAnimeItems] = useState([])
  const [total, setTotal] = useState(0)
  const [lastPage, setLastPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [genres, setGenres] = useState(["全部"])
  const [favoriteIds, setFavoriteIds] = useState(new Set())
  const [togglingIds, setTogglingIds] = useState(new Set())
  const [favLoaded, setFavLoaded] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const debounceRef = useRef(null)

  // 监听个性化设置保存事件
  useEffect(() => {
    const handlePrefsSaved = () => setRefreshKey((k) => k + 1)
    window.addEventListener("preferencesSaved", handlePrefsSaved)
    return () =>
      window.removeEventListener("preferencesSaved", handlePrefsSaved)
  }, [])

  // Fetch genres on mount（模块级缓存，只请求一次）
  useEffect(() => {
    if (genresCache) {
      setGenres(genresCache)
      return
    }
    fetchGenres()
      .then((data) => {
        const list = ["全部", ...data]
        genresCache = list
        setGenres(list)
      })
      .catch(() => {})
  }, [])

  // 从 API 加载收藏列表中的 ID 集合（每次最多 100 条，若超过可分页获取）
  useEffect(() => {
    let cancelled = false
    fetchCollection(1, 100)
      .then((data) => {
        if (cancelled) return
        const items = Array.isArray(data?.items) ? data.items : []
        setFavoriteIds(new Set(items.map((item) => item.id)))
        setFavLoaded(true)
      })
      .catch(() => {
        if (cancelled) return
        setFavLoaded(true)
      })
    return () => {
      cancelled = true
    }
  }, [refreshKey])

  // Fetch anime data when deps change（AbortController 取消冗余请求）
  useEffect(() => {
    const abortController = new AbortController()
    setLoading(true)
    const params = {
      page: currentPage,
      perPage: ITEMS_PER_PAGE,
    }
    if (debouncedSearch) params.keyword = debouncedSearch
    if (selectedGenre !== "全部") params.genre = selectedGenre

    // 从个性设置读取过滤参数
    params.adultFilter = localStorage.getItem("adultFilter") || "hide"
    params.excludeUnlicensed =
      localStorage.getItem("excludeUnlicensed") !== "false"

    browseAnime(params, abortController.signal)
      .then((data) => {
        if (abortController.signal.aborted) return
        setAnimeItems(Array.isArray(data?.items) ? data.items : [])
        setTotal(typeof data?.total === "number" ? data.total : 0)
        setLastPage(typeof data?.lastPage === "number" ? data.lastPage : 1)
      })
      .catch((err) => {
        if (abortController.signal.aborted) return
        if (err?.name === "CanceledError") return
        console.error("API请求失败:", err)
        setAnimeItems([])
        setTotal(0)
        setLastPage(1)
      })
      .finally(() => {
        if (abortController.signal.aborted) return
        setLoading(false)
      })

    return () => abortController.abort()
  }, [debouncedSearch, selectedGenre, currentPage, refreshKey])

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => clearTimeout(debounceRef.current)
  }, [])

  const handleSearchChange = (e) => {
    const value = e.target.value
    setSearchQuery(value)
    setLoading(true)
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(value)
      setCurrentPage(1)
    }, 400)
  }

  const handleGenreChange = (e) => {
    setSelectedGenre(e.target.value)
    setCurrentPage(1)
    setLoading(true)
  }

  const toggleFavorite = async (anime) => {
    const id = anime.id
    if (togglingIds.has(id)) return

    setTogglingIds((prev) => new Set(prev).add(id))
    // 乐观更新
    setFavoriteIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })

    try {
      await toggleCollection(id)
    } catch (err) {
      // 失败时恢复
      console.error("切换收藏失败:", err)
      setFavoriteIds((prev) => {
        const next = new Set(prev)
        if (next.has(id)) {
          next.delete(id)
        } else {
          next.add(id)
        }
        return next
      })
    } finally {
      setTogglingIds((prev) => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
    }
  }

  const isFavorited = (id) => favoriteIds.has(id)

  const goToPage = (page) => {
    if (page >= 1 && page <= lastPage) {
      setCurrentPage(page)
    }
  }

  const [jumpPage, setJumpPage] = useState("")
  const handleJump = (e) => {
    e.preventDefault()
    const page = parseInt(jumpPage, 10)
    if (!isNaN(page) && page >= 1 && page <= lastPage) {
      goToPage(page)
      setJumpPage("")
    }
  }

  const getPageNumbers = () => {
    const pages = []
    const maxVisible = 5
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2))
    let end = Math.min(lastPage, start + maxVisible - 1)
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1)
    }
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    return pages
  }

  return (
    <div className="p-8">
      <div>
        <h1 className="text-xl font-bold text-[#0f172a] mb-4">番剧浏览</h1>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="搜索动漫..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full px-4 py-2 pl-10 bg-white border border-[#e2e8f0] rounded-lg text-sm text-[#0f172a] placeholder:text-[#94a3b8] focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition-all duration-150"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </div>
          <select
            value={selectedGenre}
            onChange={handleGenreChange}
            className="px-4 py-2 bg-white border border-[#e2e8f0] rounded-lg text-sm text-[#0f172a] focus:outline-none focus:border-sky-400 cursor-pointer"
          >
            {genres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </div>

        {/* Results Count */}
        <p className="text-sm text-[#64748b] mb-3">
          {loading ? "加载中..." : `共找到 ${total} 部动漫`}
          {!loading && lastPage > 1 && ` · 第 ${currentPage}/${lastPage} 页`}
        </p>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-[#94a3b8] text-lg">加载中...</p>
          </div>
        )}

        {/* Anime Grid */}
        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {animeItems.map((anime) => (
              <AnimeCard
                key={anime.id}
                anime={anime}
                isFavorited={isFavorited(anime.id)}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && lastPage > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-2.5 py-1.5 text-sm rounded-md border border-[#e2e8f0] bg-white text-[#64748b] hover:bg-sky-50 hover:text-sky-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-150"
              >
                上一页
              </button>
              {getPageNumbers().map((page) => (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`min-w-[32px] px-2 py-1.5 text-sm rounded-md border transition-colors duration-150 ${
                    currentPage === page
                      ? "bg-sky-500 text-white border-sky-500"
                      : "bg-white text-[#64748b] border-[#e2e8f0] hover:bg-sky-50 hover:text-sky-600"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === lastPage}
                className="px-2.5 py-1.5 text-sm rounded-md border border-[#e2e8f0] bg-white text-[#64748b] hover:bg-sky-50 hover:text-sky-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-150"
              >
                下一页
              </button>
            </div>
            <form
              onSubmit={handleJump}
              className="flex items-center gap-2 text-sm text-[#64748b]"
            >
              <span>前往</span>
              <input
                type="number"
                min={1}
                max={lastPage}
                value={jumpPage}
                onChange={(e) => setJumpPage(e.target.value)}
                className="w-14 px-2 py-1.5 text-center bg-white border border-[#e2e8f0] rounded-md text-sm text-[#0f172a] focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition-all duration-150"
                placeholder="页码"
              />
              <span>页</span>
              <button
                type="submit"
                className="px-3 py-1.5 text-sm rounded-md border border-[#e2e8f0] bg-white text-[#64748b] hover:bg-sky-50 hover:text-sky-600 transition-colors duration-150"
              >
                确定
              </button>
            </form>
          </div>
        )}

        {/* Empty State */}
        {!loading && animeItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[#94a3b8] text-lg">没有找到匹配的动漫</p>
            <p className="text-[#94a3b8] text-sm mt-1">试试其他搜索词或分类</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Library
