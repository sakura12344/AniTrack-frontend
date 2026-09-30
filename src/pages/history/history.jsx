import { useState } from "react"
import { Link } from "react-router-dom"

// ── 假数据 ──────────────────────────────────────────
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

// ── 日期格式化 ──────────────────────────────────────
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

// ── 按日期分组 ──────────────────────────────────────
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

  // 按时间倒序排列
  for (const group of map.values()) {
    group.items.sort((a, b) => b.timestamp - a.timestamp)
  }

  const sorted = Array.from(map.values())
  sorted.sort((a, b) => b.date - a.date)

  return sorted
}

// ── 进度条组件 ──────────────────────────────────────
function ProgressBar({ watched, total }) {
  const pct = Math.min((watched / total) * 100, 100)
  return (
    <div className="w-full">
      <div className="flex items-center justify-between text-xs text-[#64748b] mb-1">
        <span>
          观看进度 {watched}/{total} 集
        </span>
        <span>{Math.round(pct)}%</span>
      </div>
      <div className="w-full h-1.5 bg-sky-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-sky-400 rounded-full transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

// ── 时间轴卡片 ──────────────────────────────────────
function HistoryCard({ item }) {
  const [imgError, setImgError] = useState(false)

  return (
    <Link
      to={`/app/anime/${item.id}`}
      className="group flex gap-4 bg-white rounded-lg border border-[#e2e8f0] p-3 hover:shadow-md transition-all duration-150"
    >
      {/* 封面 */}
      <div className="relative w-16 h-22 rounded-md bg-sky-50 overflow-hidden shrink-0">
        {item.coverImage && !imgError && (
          <img
            src={item.coverImage}
            alt={item.title}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        )}
        {(!item.coverImage || imgError) && (
          <div className="absolute inset-0 flex items-center justify-center text-xl">
            🎬
          </div>
        )}
      </div>

      {/* 信息 */}
      <div className="flex-1 min-w-0 flex flex-col justify-center gap-1.5">
        <h3 className="font-semibold text-[#0f172a] text-sm truncate group-hover:text-sky-600 transition-colors">
          {item.title}
        </h3>
        <p className="text-xs text-[#64748b]">{item.episode}</p>
        <ProgressBar
          watched={item.progress.watched}
          total={item.progress.total}
        />
      </div>
    </Link>
  )
}

// ── 时间轴组件 ──────────────────────────────────────
function HistoryTimeline() {
  const groups = groupByDate(MOCK_HISTORY)

  return (
    <div className="relative">
      {/* 左侧时间轴竖线 */}
      <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-sky-200 rounded-full" />

      <div className="space-y-8">
        {groups.map((group) => (
          <div key={group.label}>
            {/* 日期标题 */}
            <div className="flex items-center gap-3 mb-3">
              <div className="relative z-10 w-6 h-6 rounded-full bg-sky-400 border-2 border-white shadow-sm flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-white" />
              </div>
              <h2 className="text-sm font-bold text-[#0f172a]">
                {group.label}
              </h2>
            </div>

            {/* 该日期下的卡片列表 */}
            <div className="ml-9 space-y-3">
              {group.items.map((item) => (
                <HistoryCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── 页面入口 ────────────────────────────────────────
function History() {
  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-[#0f172a]">观看历史</h1>

      {MOCK_HISTORY.length === 0 ? (
        <div className="text-center py-20 text-[#94a3b8]">
          <svg
            className="w-16 h-16 mx-auto mb-4 text-sky-200"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 3v5h5" />
            <path d="M3.05 13A9 9 0 1 0 6 5.3L3 8" />
            <path d="M12 7v5l4 2" />
          </svg>
          <p className="text-base">暂无观看记录</p>
          <p className="text-sm mt-1">去番剧浏览页面开始追番吧</p>
        </div>
      ) : (
        <HistoryTimeline />
      )}
    </div>
  )
}

export default History
