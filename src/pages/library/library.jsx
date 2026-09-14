import { useState, useMemo } from "react"

const mockAnimeList = [
  {
    id: 1,
    title: "进击的巨人",
    genre: "动作/奇幻",
    rating: 9.8,
    cover: "🗿",
    status: "已完结",
    episodes: 87,
  },
  {
    id: 2,
    title: "鬼灭之刃",
    genre: "动作/奇幻",
    rating: 9.5,
    cover: "⚔️",
    status: "连载中",
    episodes: 55,
  },
  {
    id: 3,
    title: "咒术回战",
    genre: "动作/超自然",
    rating: 9.3,
    cover: "👊",
    status: "连载中",
    episodes: 47,
  },
  {
    id: 4,
    title: "间谍过家家",
    genre: "喜剧/动作",
    rating: 9.0,
    cover: "🕵️",
    status: "连载中",
    episodes: 37,
  },
  {
    id: 5,
    title: "电锯人",
    genre: "动作/恐怖",
    rating: 9.2,
    cover: "🪚",
    status: "已完结",
    episodes: 12,
  },
  {
    id: 6,
    title: "孤独摇滚",
    genre: "音乐/日常",
    rating: 9.1,
    cover: "🎸",
    status: "已完结",
    episodes: 12,
  },
  {
    id: 7,
    title: "灵能百分百",
    genre: "超自然/喜剧",
    rating: 9.4,
    cover: "💥",
    status: "已完结",
    episodes: 37,
  },
  {
    id: 8,
    title: "辉夜大小姐",
    genre: "恋爱/喜剧",
    rating: 9.0,
    cover: "💕",
    status: "已完结",
    episodes: 37,
  },
  {
    id: 9,
    title: "异度侵入",
    genre: "科幻/悬疑",
    rating: 8.9,
    cover: "🔍",
    status: "已完结",
    episodes: 13,
  },
  {
    id: 10,
    title: "约定的梦幻岛",
    genre: "悬疑/惊悚",
    rating: 8.8,
    cover: "🏃",
    status: "已完结",
    episodes: 23,
  },
  {
    id: 11,
    title: "文豪野犬",
    genre: "动作/超自然",
    rating: 8.7,
    cover: "📖",
    status: "连载中",
    episodes: 60,
  },
  {
    id: 12,
    title: "紫罗兰永恒花园",
    genre: "剧情/治愈",
    rating: 9.3,
    cover: "✉️",
    status: "已完结",
    episodes: 13,
  },
  {
    id: 13,
    title: "海贼王",
    genre: "动作/冒险",
    rating: 9.6,
    cover: "🏴‍☠️",
    status: "连载中",
    episodes: 1070,
  },
  {
    id: 14,
    title: "火影忍者",
    genre: "动作/冒险",
    rating: 9.2,
    cover: "🍥",
    status: "已完结",
    episodes: 720,
  },
  {
    id: 15,
    title: "死神",
    genre: "动作/超自然",
    rating: 8.9,
    cover: "⚔️",
    status: "已完结",
    episodes: 366,
  },
  {
    id: 16,
    title: "钢之炼金术师",
    genre: "动作/科幻",
    rating: 9.7,
    cover: "⚗️",
    status: "已完结",
    episodes: 64,
  },
  {
    id: 17,
    title: "银魂",
    genre: "喜剧/动作",
    rating: 9.5,
    cover: "🍡",
    status: "已完结",
    episodes: 367,
  },
  {
    id: 18,
    title: "命运石之门",
    genre: "科幻/悬疑",
    rating: 9.4,
    cover: "🔬",
    status: "已完结",
    episodes: 24,
  },
  {
    id: 19,
    title: "Clannad",
    genre: "剧情/治愈",
    rating: 9.2,
    cover: "🌸",
    status: "已完结",
    episodes: 47,
  },
  {
    id: 20,
    title: "反叛的鲁路修",
    genre: "科幻/机战",
    rating: 9.1,
    cover: "🤖",
    status: "已完结",
    episodes: 50,
  },
]

const ITEMS_PER_PAGE = 8

function Library() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedGenre, setSelectedGenre] = useState("全部")
  const [currentPage, setCurrentPage] = useState(1)
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("animeFavorites")
    return saved ? JSON.parse(saved) : []
  })

  const genres = [
    "全部",
    "动作/奇幻",
    "动作/超自然",
    "喜剧/动作",
    "动作/恐怖",
    "音乐/日常",
    "超自然/喜剧",
    "恋爱/喜剧",
    "科幻/悬疑",
    "悬疑/惊悚",
    "剧情/治愈",
    "动作/冒险",
    "动作/科幻",
    "科幻/机战",
  ]

  const filteredAnime = useMemo(() => {
    return mockAnimeList.filter((anime) => {
      const matchesSearch = anime.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
      const matchesGenre =
        selectedGenre === "全部" || anime.genre === selectedGenre
      return matchesSearch && matchesGenre
    })
  }, [searchQuery, selectedGenre])

  const totalPages = Math.ceil(filteredAnime.length / ITEMS_PER_PAGE)
  const paginatedAnime = filteredAnime.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  )

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1)
  }

  const handleGenreChange = (e) => {
    setSelectedGenre(e.target.value)
    setCurrentPage(1)
  }

  const toggleFavorite = (anime) => {
    const isFavorited = favorites.some((f) => f.id === anime.id)
    let newFavorites
    if (isFavorited) {
      newFavorites = favorites.filter((f) => f.id !== anime.id)
    } else {
      newFavorites = [...favorites, anime]
    }
    setFavorites(newFavorites)
    localStorage.setItem("animeFavorites", JSON.stringify(newFavorites))
  }

  const isFavorited = (id) => favorites.some((f) => f.id === id)

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const getPageNumbers = () => {
    const pages = []
    const maxVisible = 5
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2))
    let end = Math.min(totalPages, start + maxVisible - 1)
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
          共找到 {filteredAnime.length} 部动漫
          {totalPages > 1 && ` · 第 ${currentPage}/${totalPages} 页`}
        </p>

        {/* Anime Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {paginatedAnime.map((anime) => (
            <div
              key={anime.id}
              className="bg-white rounded-lg border border-[#e2e8f0] p-3 hover:shadow-md transition-shadow duration-150"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="w-10 h-10 rounded-lg bg-sky-50 flex items-center justify-center text-xl">
                  {anime.cover}
                </div>
                <button
                  onClick={() => toggleFavorite(anime)}
                  className={`p-1 rounded-md transition-colors duration-150 ${
                    isFavorited(anime.id)
                      ? "bg-red-50 text-red-500 hover:bg-red-100"
                      : "bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-red-400"
                  }`}
                  title={isFavorited(anime.id) ? "取消收藏" : "添加到收藏"}
                >
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill={isFavorited(anime.id) ? "currentColor" : "none"}
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
              <p className="text-xs text-[#64748b] mb-1.5">{anime.genre}</p>
              <div className="flex items-center justify-between text-xs">
                <span className="text-amber-500 font-medium">
                  ★ {anime.rating}
                </span>
                <span className="text-[#94a3b8]">
                  {anime.episodes} 集 · {anime.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-1.5 mt-6">
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
              disabled={currentPage === totalPages}
              className="px-2.5 py-1.5 text-sm rounded-md border border-[#e2e8f0] bg-white text-[#64748b] hover:bg-sky-50 hover:text-sky-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-150"
            >
              下一页
            </button>
          </div>
        )}

        {filteredAnime.length === 0 && (
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
