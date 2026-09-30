import { useState } from "react"
import { Link } from "react-router-dom"

const MOCK_HISTORY = [
  {
    id: 1,
    title: "咒术回战 第二季",
    coverImage: "https://picsum.photos/seed/jujutsu/300/400",
    episode: "第18话",
    progress: { watched: 18, total: 23 },
    timestamp: new Date("2026-09-24T21:15:00"),
  },
  {
    id: 2,
    title: "葬送的芙莉莲",
    coverImage: "https://picsum.photos/seed/frieren/300/400",
    episode: "第12话",
    progress: { watched: 12, total: 28 },
    timestamp: new Date("2026-09-24T19:40:00"),
  },
  {
    id: 3,
    title: "间谍过家家",
    coverImage: "https://picsum.photos/seed/spyfamily/300/400",
    episode: "第24话",
    progress: { watched: 24, total: 25 },
    timestamp: new Date("2026-09-23T22:00:00"),
  },
  {
    id: 4,
    title: "鬼灭之刃 柱训练篇",
    coverImage: "https://picsum.photos/seed/demonslayer/300/400",
    episode: "第6话",
    progress: { watched: 6, total: 8 },
    timestamp: new Date("2026-09-23T20:10:00"),
  },
  {
    id: 5,
    title: "我推的孩子",
    coverImage: "https://picsum.photos/seed/oshinoko/300/400",
    episode: "第10话",
    progress: { watched: 10, total: 11 },
    timestamp: new Date("2026-09-22T21:30:00"),
  },
  {
    id: 6,
    title: "迷宫饭",
    coverImage: "https://picsum.photos/seed/dungeonfood/300/400",
    episode: "第20话",
    progress: { watched: 20, total: 24 },
    timestamp: new Date("2026-09-21T19:50:00"),
  },
  {
    id: 7,
    title: "进击的巨人 最终季",
    coverImage: "https://picsum.photos/seed/aot/300/400",
    episode: "第28话",
    progress: { watched: 28, total: 30 },
    timestamp: new Date("2026-09-20T23:00:00"),
  },
  {
    id: 8,
    title: "Bang Dream! It's MyGO!!!!!",
    coverImage: "https://picsum.photos/seed/mygo/300/400",
    episode: "第7话",
    progress: { watched: 7, total: 13 },
    timestamp: new Date("2026-09-18T20:20:00"),
  },
]

function formatDateLabel(date) {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const diffDays = Math.round((today - target) / 86400000)

  if (diffDays === 0) return "今天"
  if (diffDays === 1) return "昨天"
  if (diffDays < 7) return `${diffDays} 天前`
  return `${date.getMonth() + 1}月${date.getDate()}日`
}

function groupByDate(items) {
  const groups = []
  const map = new Map()

  for (const item of items) {
    const key = formatDateLabel(item.timestamp)
    if (!map.has(key)) {
      map.set(key, { label: key, date: item.timestamp, items: [] })
    }
    map.get(key).items.push(item)
  }

  for (const group of map.values()) {
    group.items.sort((a, b) => b.timestamp - a.timestamp)
  }

  const sorted = Array.from(map.values())
  sorted.sort((a, b) => b.date - a.date)

  return sorted
}

function PlayIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 4.75v14.5a1 1 0 0 0 1.5.87l12-7.25a1 1 0 0 0 0-1.74l-12-7.25A1 1 0 0 0 6 4.75Z" />
    </svg>
  )
}

function FilmIcon({ className = "w-6 h-6" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M7 3v18" />
      <path d="M17 3v18" />
      <path d="M3 7.5h4" />
      <path d="M3 12h18" />
      <path d="M3 16.5h4" />
      <path d="M17 7.5h4" />
      <path d="M17 16.5h4" />
    </svg>
  )
}

function ClockIcon({ className = "w-16 h-16" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  )
}

function ProgressBar({ watched, total }) {
  const pct = Math.min((watched / total) * 100, 100)
  return (
    <div className="w-full">
      <div className="flex items-center justify-between text-[11px] text-[#64748b] mb-1.5">
        <span>
          观看进度 {watched}/{total} 集
        </span>
        <span>{Math.round(pct)}%</span>
      </div>
      <div className="w-full h-1.5 bg-[#f1f5f9] rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-sky-500 to-sky-400 rounded-full transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

function ContinueCard({ item }) {
  const [imgError, setImgError] = useState(false)
  const pct = Math.min((item.progress.watched / item.progress.total) * 100, 100)

  return (
    <Link
      to={`/app/anime/${item.id}`}
      className="group w-40 shrink-0 cursor-pointer"
    >
      <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-sky-50 shadow-sm ring-1 ring-[#e2e8f0] transition-shadow duration-200 group-hover:shadow-md">
        {item.coverImage && !imgError ? (
          <img
            src={item.coverImage}
            alt={item.title}
            className="w-full h-full object-cover transition-opacity duration-200 group-hover:opacity-90"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-sky-300">
            <FilmIcon className="w-10 h-10" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <div className="absolute inset-0 flex items-end justify-center pb-4">
          <span className="w-12 h-12 rounded-full bg-sky-500/90 flex items-center justify-center text-white shadow-md transition-transform duration-200 group-hover:scale-110">
            <PlayIcon className="w-5 h-5 translate-x-[1px]" />
          </span>
        </div>
        <div className="absolute top-2 right-2 text-[11px] font-semibold text-white bg-black/55 backdrop-blur px-2 py-0.5 rounded-md">
          {item.episode}
        </div>
      </div>
      <p className="mt-2.5 text-[13px] font-medium text-[#0f172a] truncate group-hover:text-sky-600 transition-colors">
        {item.title}
      </p>
      <div className="mt-2 h-1 bg-[#f1f5f9] rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-sky-500 to-sky-400 rounded-full transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </Link>
  )
}

function HistoryItem({ item }) {
  const [imgError, setImgError] = useState(false)

  return (
    <Link
      to={`/app/anime/${item.id}`}
      className="group flex gap-4 rounded-xl border border-[#e2e8f0] bg-white p-3 shadow-sm hover:shadow-md hover:border-[#e0f2fe] transition-all duration-150 cursor-pointer"
    >
      <div className="relative w-16 h-22 shrink-0 overflow-hidden rounded-lg bg-sky-50 ring-1 ring-[#e2e8f0]">
        {item.coverImage && !imgError ? (
          <img
            src={item.coverImage}
            alt={item.title}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-sky-300">
            <FilmIcon className="w-6 h-6" />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0 flex flex-col justify-center gap-1.5">
        <h4 className="font-semibold text-sm text-[#0f172a] truncate group-hover:text-sky-600 transition-colors">
          {item.title}
        </h4>
        <p className="text-xs text-[#64748b]">{item.episode}</p>
        <ProgressBar
          watched={item.progress.watched}
          total={item.progress.total}
        />
      </div>

      <span className="self-center text-[#94a3b8] group-hover:text-sky-500 transition-colors">
        <PlayIcon className="w-4 h-4" />
      </span>
    </Link>
  )
}

function HistoryTimeline() {
  const groups = groupByDate(MOCK_HISTORY)

  return (
    <div className="relative">
      <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-[#e0f2fe] rounded-full" />

      <div className="space-y-8">
        {groups.map((group) => (
          <div key={group.label}>
            <div className="flex items-center gap-3 mb-3">
              <div className="relative z-10 w-6 h-6 rounded-full bg-sky-500 ring-4 ring-sky-500/20 flex items-center justify-center shadow-sm">
                <div className="w-2 h-2 rounded-full bg-white" />
              </div>
              <h3 className="text-sm font-bold text-[#0f172a] font-display">
                {group.label}
              </h3>
            </div>

            <div className="ml-9 space-y-3">
              {group.items.map((item) => (
                <HistoryItem key={item.id} item={item} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function History() {
  const hasData = MOCK_HISTORY.length > 0
  const totalEpisodes = MOCK_HISTORY.reduce(
    (sum, i) => sum + i.progress.watched,
    0,
  )

  return (
    <div className="min-h-screen p-4 sm:p-8">
      <main className="max-w-2xl mx-auto">
        <header className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-1.5 h-6 rounded-full bg-sky-500 rounded-full" />
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0f172a] font-display">
              观看历史
            </h1>
          </div>
          <p className="text-sm text-[#64748b]">
            共 {MOCK_HISTORY.length} 部，累计观看 {totalEpisodes} 集
          </p>
        </header>

        {!hasData ? (
          <div className="text-center py-24 text-[#94a3b8]">
            <ClockIcon className="w-16 h-16 mx-auto mb-4 text-sky-300" />
            <p className="text-base text-[#0f172a]">暂无观看记录</p>
            <p className="text-sm mt-1">去番剧浏览页面开始追番吧</p>
            <Link
              to="/app/library"
              className="inline-flex items-center gap-1.5 mt-6 px-4 py-2 rounded-full bg-sky-500 text-white text-sm font-medium shadow-sm hover:bg-sky-600 transition-colors duration-150 cursor-pointer"
            >
              <PlayIcon className="w-4 h-4" />
              去逛逛
            </Link>
          </div>
        ) : (
          <>
            <section className="mb-10">
              <h2 className="text-base font-semibold text-[#0f172a] mb-4 flex items-center gap-2 font-display">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-sky-500" />
                继续观看
              </h2>
              <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 overscroll-x-contain">
                {MOCK_HISTORY.map((item) => (
                  <ContinueCard key={`cw-${item.id}`} item={item} />
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-base font-semibold text-[#0f172a] mb-4 flex items-center gap-2 font-display">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-sky-500" />
                全部记录
              </h2>
              <HistoryTimeline />
            </section>
          </>
        )}
      </main>
    </div>
  )
}

export default History
