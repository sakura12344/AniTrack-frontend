import { useState, useEffect, useCallback } from "react"
import { Link } from "react-router-dom"
import { fetchWatchingCards } from "../../api/user.js"

const PAGE_SIZE = 20

function Watch() {
  const [items, setItems] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  const loadWatching = useCallback(async (page) => {
    setLoading(true)
    try {
      const data = await fetchWatchingCards(page, PAGE_SIZE)
      const items = Array.isArray(data?.items) ? data.items : []

      setItems(items)
      setTotal(typeof data?.total === "number" ? data.total : 0)
      setLastPage(typeof data?.lastPage === "number" ? data.lastPage : 1)
      setCurrentPage(
        typeof data?.currentPage === "number" ? data.currentPage : page,
      )
    } catch (err) {
      console.error("获取追番列表失败:", err)
      setItems([])
      setTotal(0)
      setLastPage(1)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadWatching(currentPage)
  }, [loadWatching, currentPage])

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
        <h1 className="text-xl font-bold text-[#0f172a] mb-4">我的追番</h1>

        <p className="text-sm text-[#64748b] mb-3">
          {loading ? "加载中..." : `共 ${total} 部在看`}
          {!loading && lastPage > 1 && ` · 第 ${currentPage}/${lastPage} 页`}
        </p>

        {loading && (
          <div className="text-center py-12">
            <p className="text-[#94a3b8] text-lg">加载中...</p>
          </div>
        )}

        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {items.map((anime) => (
              <WatchCard key={anime.id} anime={anime} />
            ))}
          </div>
        )}

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

        {!loading && items.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[#94a3b8] text-lg">还没有正在追的动漫</p>
            <p className="text-[#94a3b8] text-sm mt-1">
              去
              <Link
                to="/app/library"
                className="text-sky-500 hover:text-sky-600 mx-1"
              >
                番剧浏览
              </Link>
              中找到喜欢的作品并开始追番吧
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

function WatchCard({ anime }) {
  const [imgError, setImgError] = useState(false)

  return (
    <div className="block bg-white rounded-lg border border-[#e2e8f0] p-3 hover:shadow-md transition-shadow duration-150">
      <Link to={`/app/anime/${anime.id}`}>
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
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                className="w-16 h-16 text-sky-200"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <circle cx="9" cy="9" r="2" />
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
              </svg>
            </div>
          )}
        </div>
      </Link>
      <Link to={`/app/anime/${anime.id}`}>
        <h3 className="font-semibold text-[#0f172a] text-sm mb-0.5 truncate">
          {anime.title}
        </h3>
      </Link>
      <p className="text-xs text-[#64748b] mb-1.5 truncate">
        {anime.genres?.join(" / ") || "未分类"}
      </p>
      <div className="flex items-center justify-between text-xs">
        <span className="text-[#94a3b8]">
          {anime.episodes ? `${anime.episodes} 集` : "连载中"}
        </span>
      </div>
    </div>
  )
}

export default Watch
