import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { fetchAnimeDetail } from "../../api/anime.js"
import {
  toggleCollection,
  fetchLibraryRecord,
  saveLibraryRecord,
} from "../../api/user.js"
import useCollectionStore from "../../store/useCollectionStore.js"

function AnimeDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [anime, setAnime] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [coverError, setCoverError] = useState(false)
  const [bannerError, setBannerError] = useState(false)
  const [toggling, setToggling] = useState(false)
  const [currentEpisode, setCurrentEpisode] = useState(null)
  const [progressLoading, setProgressLoading] = useState(true)
  const [progressUpdating, setProgressUpdating] = useState(false)
  const isFavorited = useCollectionStore((s) => s.isFavorited(id))
  const toggleStoreFavorite = useCollectionStore((s) => s.toggleFavorite)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    setCoverError(false)
    setBannerError(false)

    fetchAnimeDetail(id)
      .then((data) => {
        if (cancelled) return
        setAnime(data)
      })
      .catch((err) => {
        if (cancelled) return
        console.error("获取动漫详情失败:", err)
        setError("无法加载动漫详情，请稍后重试")
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [id])

  // 获取观看进度
  useEffect(() => {
    let cancelled = false
    setProgressLoading(true)
    fetchLibraryRecord(id)
      .then((record) => {
        if (cancelled) return
        setCurrentEpisode(record?.currentEpisode ?? null)
      })
      .catch(() => {
        if (!cancelled) setCurrentEpisode(null)
      })
      .finally(() => {
        if (!cancelled) setProgressLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [id])

  const handleProgressAddOne = async () => {
    if (!anime || progressUpdating) return
    const next = (currentEpisode ?? 0) + 1
    const maxEp = anime.episodes
    if (maxEp != null && next > maxEp) return
    setProgressUpdating(true)
    const prev = currentEpisode
    setCurrentEpisode(next)
    try {
      await saveLibraryRecord({ animeId: anime.id, currentEpisode: next })
    } catch (err) {
      console.error("更新观看进度失败:", err)
      setCurrentEpisode(prev)
      alert("更新观看进度失败，请重试")
    } finally {
      setProgressUpdating(false)
    }
  }

  const toggleFavorite = async () => {
    if (!anime || toggling) return
    setToggling(true)
    const prevState = isFavorited
    // 乐观更新全局状态
    toggleStoreFavorite(anime.id)
    try {
      await toggleCollection(anime.id)
    } catch (err) {
      console.error("切换收藏失败:", err)
      // 回滚：如果之前是收藏状态，就重新添加；反之移除
      toggleStoreFavorite(anime.id)
    } finally {
      setToggling(false)
    }
  }

  const safeJsonParse = (str) => {
    if (!str) return null
    try {
      const parsed = JSON.parse(str)
      return Array.isArray(parsed) ? parsed : null
    } catch {
      return null
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc]">
        <div className="relative h-56 sm:h-64 bg-gradient-to-br from-sky-700/60 to-indigo-900/60 animate-pulse overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-[#f8fafc] via-transparent to-transparent" />
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10">
          <div className="flex flex-col sm:flex-row gap-5 sm:gap-8">
            <div className="w-36 sm:w-48 shrink-0">
              <div className="aspect-[3/4] rounded-xl bg-white/80 shadow-lg animate-pulse">
                <div className="w-full h-full rounded-xl bg-slate-200" />
              </div>
            </div>
            <div className="flex-1 min-w-0 pt-0 sm:pt-10 space-y-4">
              <div className="h-8 w-2/3 bg-white/60 rounded-lg animate-pulse" />
              <div className="h-4 w-1/2 bg-white/40 rounded animate-pulse" />
              <div className="flex gap-3">
                <div className="h-6 w-16 bg-white/40 rounded animate-pulse" />
                <div className="h-6 w-24 bg-white/40 rounded animate-pulse" />
              </div>
              <div className="flex gap-2">
                <div className="h-6 w-16 bg-white/30 rounded-full animate-pulse" />
                <div className="h-6 w-20 bg-white/30 rounded-full animate-pulse" />
                <div className="h-6 w-14 bg-white/30 rounded-full animate-pulse" />
              </div>
            </div>
          </div>
          <div className="mt-8 space-y-6">
            <div className="h-5 w-24 bg-slate-200 rounded animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 w-full bg-slate-100 rounded animate-pulse" />
              <div className="h-4 w-5/6 bg-slate-100 rounded animate-pulse" />
              <div className="h-4 w-4/6 bg-slate-100 rounded animate-pulse" />
            </div>
            <div className="h-5 w-24 bg-slate-200 rounded animate-pulse" />
            <div className="flex flex-wrap gap-2">
              <div className="h-7 w-20 bg-slate-100 rounded-full animate-pulse" />
              <div className="h-7 w-28 bg-slate-100 rounded-full animate-pulse" />
              <div className="h-7 w-24 bg-slate-100 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-[#f8fafc] relative overflow-hidden">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 z-10 inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/80 backdrop-blur-md text-[#0f172a] text-sm rounded-lg hover:bg-white/90 transition-all duration-200 cursor-pointer border border-[#e2e8f0] hover:border-sky-200"
          aria-label="返回上一页"
        >
          <BackIcon />
          <span className="hidden sm:inline">返回</span>
        </button>
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-sky-50 flex items-center justify-center">
            <svg
              className="w-10 h-10 text-sky-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4" />
              <path d="M12 16h.01" />
            </svg>
          </div>
          <p className="text-[#475569] text-lg font-medium mb-2">加载失败</p>
          <p className="text-[#94a3b8] text-sm">{error}</p>
        </div>
      </div>
    )
  }

  if (!anime) return null

  const tags = safeJsonParse(anime.tags)
  const streamingEpisodes = safeJsonParse(anime.streamingEpisodes)
  const seasonLabel = anime.season
    ? { SPRING: "春", SUMMER: "夏", FALL: "秋", WINTER: "冬" }[anime.season] ||
      anime.season
    : ""

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* ═══ 顶部横幅 Banner：背景大图固定区域 ═══ */}
      <header className="relative bg-gradient-to-br from-sky-800 via-indigo-900 to-slate-900 overflow-hidden">
        {/* 背景大图 - 固定高度容器，不拉伸 */}
        {anime.bannerImage && !bannerError && (
          <div className="w-full h-48 sm:h-56 overflow-hidden">
            <img
              src={anime.bannerImage}
              alt=""
              className="w-full h-full object-cover"
              onError={() => setBannerError(true)}
            />
          </div>
        )}

        {/* 顶部导航栏 */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 sm:px-6 py-4 z-20">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/80 backdrop-blur-md text-[#0f172a] text-sm rounded-lg hover:bg-white/90 transition-all duration-200 cursor-pointer border border-[#e2e8f0] hover:border-sky-200"
            aria-label="返回上一页"
          >
            <BackIcon />
            <span className="hidden sm:inline">返回</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleFavorite}
              disabled={toggling}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-wait ${
                isFavorited
                  ? "bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20"
                  : "bg-white/80 backdrop-blur-md text-[#0f172a] hover:bg-white/90 border border-[#e2e8f0] hover:border-sky-200"
              }`}
              aria-label={isFavorited ? "取消收藏" : "添加到收藏"}
            >
              <HeartIcon filled={isFavorited} />
              <span className="hidden sm:inline">
                {isFavorited ? "已收藏" : "收藏"}
              </span>
            </button>

            {anime.isAdult && (
              <span className="px-2.5 py-0.5 bg-red-500 text-white text-xs font-bold rounded-md">
                R18
              </span>
            )}
          </div>
        </div>
      </header>

      {/* ═══ 主体内容 ═══ */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-28 relative z-10">
        {/* 封面 + 基本信息区 */}
        <div className="flex flex-col sm:flex-row gap-5 sm:gap-8">
          {/* 封面卡片 */}
          <div className="w-36 sm:w-48 shrink-0">
            <div className="relative aspect-[3/4] rounded-xl bg-white shadow-lg shadow-black/5 overflow-hidden ring-1 ring-black/5 transition-shadow duration-300 hover:shadow-xl hover:shadow-black/10">
              {anime.coverImage && !coverError ? (
                <img
                  src={anime.coverImage}
                  alt={`${anime.title} 封面`}
                  className="w-full h-full object-cover"
                  onError={() => setCoverError(true)}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-sky-100 to-indigo-100">
                  <svg
                    className="w-12 h-12 text-sky-300"
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

            {anime.isLicensed === false && (
              <p className="mt-2 text-xs text-[#94a3b8] text-center flex items-center justify-center gap-1">
                <svg
                  className="w-3 h-3"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M15 9h-4.5a1.5 1.5 0 0 0 0 3H13a1.5 1.5 0 0 1 0 3H8.5" />
                  <path d="M12 6v2" />
                  <path d="M12 16v2" />
                </svg>
                未授权作品
              </p>
            )}
            {anime.isLicensed === true && (
              <p className="mt-2 text-xs text-green-600 text-center flex items-center justify-center gap-1">
                <svg
                  className="w-3 h-3"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
                正版授权
              </p>
            )}
          </div>

          {/* 信息区 */}
          <div className="flex-1 min-w-0 pt-0 sm:pt-16">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0f172a] leading-tight">
              {anime.title}
            </h1>

            {anime.synonyms?.length > 0 && (
              <p className="text-sm text-[#64748b] mt-1.5 line-clamp-1">
                {anime.synonyms.join(" / ")}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-4">
              <div className="flex items-center gap-1.5">
                <StarIcon />
                <span className="text-lg font-bold text-[#0f172a]">
                  {anime.score != null ? anime.score : "-"}
                </span>
                {anime.averageScore != null && (
                  <span className="text-sm text-[#64748b]">
                    / {anime.averageScore}
                  </span>
                )}
              </div>

              <span className="text-[#cbd5e1] hidden sm:inline">|</span>

              <span className="inline-flex items-center gap-1.5 text-sm text-[#475569]">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${anime.status === "RELEASING" ? "bg-green-400" : anime.status === "FINISHED" ? "bg-sky-400" : "bg-yellow-400"}`}
                />
                {anime.statusDesc || anime.status}
              </span>

              {seasonLabel && (
                <span className="text-sm text-[#475569]">
                  {anime.seasonYear || ""}年{seasonLabel}季
                </span>
              )}

              {anime.episodes != null && (
                <span className="text-sm text-[#475569]">
                  共 {anime.episodes} 集
                </span>
              )}
            </div>

            {anime.genres?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {anime.genres.map((genre) => (
                  <span
                    key={genre}
                    className="px-3 py-0.5 bg-[#e2e8f0] text-[#475569] text-xs font-medium rounded-full border border-[#cbd5e1] transition-all duration-200 hover:bg-sky-100 hover:border-sky-200 hover:text-sky-700"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            )}

            {/* ═══ 观看进度 ═══ */}
            <div className="mt-5">
              <h3 className="text-sm font-semibold text-[#0f172a] mb-3 flex items-center gap-1.5">
                <PlayCircleIcon />
                观看进度
              </h3>

              {progressLoading ? (
                <div className="h-10 bg-slate-100 rounded-lg animate-pulse" />
              ) : currentEpisode != null ? (
                <div className="bg-sky-50 border border-sky-100 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-[#475569]">
                      已看{" "}
                      <strong className="text-sky-600">{currentEpisode}</strong>
                      {anime.episodes != null && (
                        <>
                          {" "}
                          / <strong>{anime.episodes}</strong> 集
                        </>
                      )}
                      {anime.episodes == null && <> 集</>}
                    </span>
                    <span className="text-xs text-[#64748b]">
                      {anime.episodes != null
                        ? Math.round((currentEpisode / anime.episodes) * 100)
                        : 0}
                      %
                    </span>
                  </div>
                  {/* 进度条 */}
                  {anime.episodes != null && (
                    <div className="w-full h-2 bg-sky-200 rounded-full overflow-hidden mb-3">
                      <div
                        className="h-full bg-sky-500 rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.min((currentEpisode / anime.episodes) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  )}
                  {/* +1 按钮 */}
                  <div className="flex gap-2">
                    <button
                      onClick={handleProgressAddOne}
                      disabled={
                        progressUpdating ||
                        (anime.episodes != null &&
                          currentEpisode >= anime.episodes)
                      }
                      className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-1.5 bg-sky-500 text-white text-sm font-medium rounded-lg hover:bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
                    >
                      <PlusIcon />
                      {anime.episodes != null &&
                      currentEpisode >= anime.episodes
                        ? "已看完"
                        : "已看 +1"}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-center">
                  <p className="text-sm text-[#64748b] mb-2">还没有观看记录</p>
                  <button
                    onClick={handleProgressAddOne}
                    disabled={progressUpdating}
                    className="inline-flex items-center gap-1 px-4 py-1.5 bg-sky-500 text-white text-sm font-medium rounded-lg hover:bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
                  >
                    <PlusIcon />
                    开始追番
                  </button>
                </div>
              )}
            </div>

            {/* 剧情简介 - 直接显示在信息区下方 */}
            {anime.description && (
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-[#0f172a] mb-2 flex items-center gap-1.5">
                  <DescriptionIcon />
                  剧情简介
                </h3>
                <p className="text-sm text-[#475569] leading-relaxed whitespace-pre-line">
                  {anime.description}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ═══ 内容区块 ═══ */}
        <div className="mt-8 space-y-6 pb-12">
          {anime.studios?.length > 0 && (
            <ContentCard title="制作公司" icon={<StudioIcon />}>
              <div className="flex flex-wrap gap-2">
                {anime.studios.map((studio, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-lg border border-[#e2e8f0] text-sm text-[#334155] transition-all duration-200 hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700"
                  >
                    <svg
                      className="w-3.5 h-3.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect width="18" height="10" x="3" y="11" rx="2" />
                      <circle cx="12" cy="5" r="2" />
                      <path d="M12 7v4" />
                      <line x1="8" x2="8" y1="16" y2="16" />
                      <line x1="16" x2="16" y1="16" y2="16" />
                    </svg>
                    {studio}
                  </span>
                ))}
              </div>
            </ContentCard>
          )}

          {tags && tags.length > 0 && (
            <ContentCard title="标签" icon={<TagIcon />}>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-white rounded-full border border-[#e2e8f0] text-xs text-[#334155] transition-all duration-200 hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700 cursor-default"
                  >
                    {tag.name}
                    <span className="text-[#94a3b8] font-medium">
                      {tag.rank}%
                    </span>
                  </span>
                ))}
              </div>
            </ContentCard>
          )}

          {streamingEpisodes && streamingEpisodes.length > 0 && (
            <ContentCard title="在线观看" icon={<PlayIcon />}>
              <div className="grid gap-2 sm:grid-cols-2">
                {streamingEpisodes.map((ep, idx) => (
                  <a
                    key={idx}
                    href={ep.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-3 bg-white rounded-lg border border-[#e2e8f0] transition-all duration-200 hover:border-sky-300 hover:bg-sky-50 hover:shadow-sm group cursor-pointer"
                  >
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-sky-50 text-sky-500 group-hover:bg-sky-100 group-hover:text-sky-600 transition-colors duration-200 shrink-0">
                      <svg
                        className="w-4 h-4 ml-0.5"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-[#0f172a] truncate">
                        {ep.site || "在线观看"}
                      </p>
                      {ep.title && (
                        <p className="text-xs text-[#64748b] truncate mt-0.5">
                          {ep.title}
                        </p>
                      )}
                    </div>
                    <svg
                      className="w-4 h-4 text-[#94a3b8] shrink-0 group-hover:text-sky-500 transition-colors duration-200"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M7 7h10v10" />
                      <path d="M7 17 21 3" />
                    </svg>
                  </a>
                ))}
              </div>
            </ContentCard>
          )}

          <div className="flex items-center justify-center pt-2">
            <p className="text-xs text-[#94a3b8] inline-flex items-center gap-1.5">
              <svg
                className="w-3 h-3"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="2" x2="22" y1="12" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
              AniList ID: {anime.id}
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

function ContentCard({ title, icon, children }) {
  return (
    <section className="bg-white rounded-xl border border-[#e2e8f0] p-5 sm:p-6 transition-shadow duration-200 hover:shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-sky-500">{icon}</span>
        <h2 className="text-base font-semibold text-[#0f172a]">{title}</h2>
      </div>
      {children}
    </section>
  )
}

function BackIcon() {
  return (
    <svg
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  )
}

function HeartIcon({ filled = false }) {
  return (
    <svg
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  )
}

function StarIcon() {
  return (
    <svg
      className="w-5 h-5 text-yellow-400"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  )
}

function StudioIcon() {
  return (
    <svg
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="10" x="3" y="11" rx="2" />
      <circle cx="12" cy="5" r="2" />
      <path d="M12 7v4" />
      <line x1="8" x2="8" y1="16" y2="16" />
      <line x1="16" x2="16" y1="16" y2="16" />
    </svg>
  )
}

function DescriptionIcon() {
  return (
    <svg
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" x2="8" y1="13" y2="13" />
      <line x1="16" x2="8" y1="17" y2="17" />
    </svg>
  )
}

function TagIcon() {
  return (
    <svg
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" />
      <path d="M7 7h.01" />
    </svg>
  )
}

function PlayIcon() {
  return (
    <svg
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  )
}

function PlayCircleIcon() {
  return (
    <svg
      className="w-4 h-4 text-sky-500"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" />
    </svg>
  )
}

function PlusIcon() {
  return (
    <svg
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  )
}

export default AnimeDetail
