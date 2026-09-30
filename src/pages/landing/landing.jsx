import { useState, useCallback } from "react"
import { Link, useNavigate } from "react-router-dom"

function Landing() {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const closeMenu = useCallback(() => {
    setMenuOpen(false)
  }, [])

  const handleScrollToFeatures = useCallback(
    (e) => {
      e.preventDefault()
      closeMenu()
      const el = document.getElementById("features")
      if (el) {
        el.scrollIntoView({ behavior: "smooth" })
      }
    },
    [closeMenu],
  )

  return (
    <div className="bg-sky-50 text-sky-900 antialiased font-body">
      {/* ========= Site Header ========= */}
      <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-white/80 backdrop-blur-md border-b border-sky-100">
        <div className="max-w-6xl mx-auto h-full flex items-center justify-between px-6">
          {/* Wordmark */}
          <Link
            to="/"
            className="font-heading text-xl font-semibold text-sky-900 tracking-tight transition-colors duration-150 hover:text-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6] focus-visible:ring-offset-2 rounded"
          >
            AniTrack
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              onClick={handleScrollToFeatures}
              className="text-sm font-medium text-sky-700 hover:text-sky-900 transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6] focus-visible:ring-offset-2 rounded px-1 py-0.5"
            >
              特性
            </a>
            <Link
              to="/login"
              className="text-sm font-medium text-[#94A3B8] hover:text-sky-700 transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6] focus-visible:ring-offset-2 rounded px-1 py-0.5"
            >
              登录
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center justify-center bg-[#F97316] text-[#0A0A0F] text-sm font-bold px-5 py-2 rounded-lg transition-colors duration-150 hover:bg-[#ea580c] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6] focus-visible:ring-offset-2"
            >
              免费开始
            </Link>
          </nav>

          {/* Mobile: CTA + Hamburger */}
          <div className="flex items-center gap-3 md:hidden">
            <Link
              to="/register"
              className="inline-flex items-center justify-center bg-[#F97316] text-[#0A0A0F] text-sm font-bold px-4 py-2 rounded-lg transition-colors duration-150 hover:bg-[#ea580c] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6] focus-visible:ring-offset-2"
            >
              免费开始
            </Link>
            <button
              type="button"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen((prev) => !prev)}
              className="w-10 h-10 flex items-center justify-center rounded-lg transition-colors duration-150 hover:bg-sky-50 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6] focus-visible:ring-offset-2"
            >
              {menuOpen ? (
                <svg
                  className="w-6 h-6 text-sky-700"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6 text-sky-700"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="4" y1="6" x2="20" y2="6" />
                  <line x1="4" y1="12" x2="20" y2="12" />
                  <line x1="4" y1="18" x2="20" y2="18" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Panel */}
        <div
          id="mobile-menu"
          className={`${menuOpen ? "block" : "hidden"} md:hidden bg-white/95 backdrop-blur-md border-b border-sky-100`}
        >
          <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col gap-3">
            <a
              href="#features"
              onClick={handleScrollToFeatures}
              className="text-base font-medium text-sky-700 hover:text-sky-900 transition-colors duration-150 py-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6] focus-visible:ring-offset-2 rounded px-1"
            >
              特性
            </a>
            <Link
              to="/login"
              onClick={closeMenu}
              className="text-base font-medium text-[#94A3B8] hover:text-sky-700 transition-colors duration-150 py-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6] focus-visible:ring-offset-2 rounded px-1"
            >
              登录
            </Link>
          </div>
        </div>
      </header>

      {/* ========= Hero Section ========= */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-6">
        {/* Decorative background shapes */}
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-sky-100 opacity-60 blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full bg-sky-100 opacity-50 blur-3xl pointer-events-none" />

        {/* Floating anime-themed SVG decorations */}
        <svg
          className="absolute top-[12%] left-[8%] w-16 h-16 text-sky-400 opacity-40 animate-bounce"
          style={{ animationDuration: "3s" }}
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
        </svg>

        <svg
          className="absolute top-[20%] right-[12%] w-12 h-12 text-sky-400 opacity-30"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>

        <svg
          className="absolute bottom-[18%] right-[15%] w-14 h-14 text-sky-400 opacity-35"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>

        <svg
          className="absolute bottom-[25%] left-[10%] w-10 h-10 text-sky-400 opacity-30"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h10c.55 0 1-.45 1-1z" />
        </svg>

        {/* Main Content */}
        <div className="relative z-10 max-w-[720px] text-center">
          {/* Small badge / tag */}
          <div className="inline-flex items-center gap-2 border border-sky-200 rounded-full px-4 py-1.5 mb-8 bg-white/60 backdrop-blur-sm">
            <svg
              className="w-4 h-4 text-warm-500"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
            <span className="text-sm font-semibold text-sky-900">
              已帮助 120,000+ 番友记录追番历程
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-heading text-6xl md:text-7xl font-bold text-sky-900 leading-[1.1] tracking-tight mb-6">
            你追的番
            <br />
            都在这儿
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-sky-700 font-medium leading-relaxed mb-10 max-w-[560px] mx-auto">
            记录每一部看过、想看和正在追的动画，再也不怕忘记看到第几集。
          </p>

          {/* CTA Button */}
          <button
            type="button"
            onClick={() => navigate("/register")}
            className="inline-flex items-center justify-center gap-3 bg-warm-500 hover:bg-warm-600 text-white font-bold text-lg px-10 py-4 rounded-full transition-colors duration-200 cursor-pointer shadow-sm"
          >
            <span>开始记录</span>
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>

          {/* Micro copy */}
          <p className="mt-4 text-sm text-sky-500 font-medium">
            免费开始，无需信用卡
          </p>
        </div>

        {/* Bottom separator */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-sky-200" />
      </section>

      {/* ========= Features + Stats Section ========= */}
      <section id="features" className="bg-white py-24 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-sky-900 mb-4">
              为番友设计的功能
            </h2>
            <p className="text-lg text-sky-600 font-medium">
              记录、发现、提醒——一个都不能少
            </p>
          </div>

          {/* Bento Grid: 2x2 desktop, 1 col mobile */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            {/* Card 1 */}
            <div className="border border-sky-100 rounded-3xl p-8 bg-sky-50/50 hover:bg-sky-50 transition-colors duration-200">
              <div className="w-12 h-12 rounded-2xl bg-sky-100 flex items-center justify-center mb-6">
                <svg
                  className="w-6 h-6 text-sky-500"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </div>
              <h3 className="font-heading text-xl font-bold text-sky-900 mb-3">
                随手一记
              </h3>
              <p className="text-sky-700 leading-relaxed">
                看过的、在追的、想看的随手一记——看到第几集，永远不会忘。
              </p>
            </div>

            {/* Card 2 */}
            <div className="border border-sky-100 rounded-3xl p-8 bg-sky-50/50 hover:bg-sky-50 transition-colors duration-200">
              <div className="w-12 h-12 rounded-2xl bg-sky-100 flex items-center justify-center mb-6">
                <svg
                  className="w-6 h-6 text-sky-500"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
                  <path d="M22 12A10 10 0 0 0 12 2v10z" />
                </svg>
              </div>
              <h3 className="font-heading text-xl font-bold text-sky-900 mb-3">
                口味画像
              </h3>
              <p className="text-sky-700 leading-relaxed">
                自动画出你的口味画像：今年看了几部、最爱什么类型、打分有多挑剔。
              </p>
            </div>

            {/* Card 3 */}
            <div className="border border-sky-100 rounded-3xl p-8 bg-sky-50/50 hover:bg-sky-50 transition-colors duration-200">
              <div className="w-12 h-12 rounded-2xl bg-sky-100 flex items-center justify-center mb-6">
                <svg
                  className="w-6 h-6 text-sky-500"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                  <path d="M11 8v6M8 11h6" />
                </svg>
              </div>
              <h3 className="font-heading text-xl font-bold text-sky-900 mb-3">
                智能推荐
              </h3>
              <p className="text-sky-700 leading-relaxed">
                选三部你喜欢的，马上告诉你下一部看什么——还告诉你为什么。
              </p>
            </div>

            {/* Card 4 */}
            <div className="border border-sky-100 rounded-3xl p-8 bg-sky-50/50 hover:bg-sky-50 transition-colors duration-200">
              <div className="w-12 h-12 rounded-2xl bg-sky-100 flex items-center justify-center mb-6">
                <svg
                  className="w-6 h-6 text-sky-500"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                  <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                  <path d="M4 2C2.8 3.7 2 5.7 2 8" />
                  <path d="M22 8c0-2.3-.8-4.3-2-6" />
                </svg>
              </div>
              <h3 className="font-heading text-xl font-bold text-sky-900 mb-3">
                更新提醒
              </h3>
              <p className="text-sky-700 leading-relaxed">
                你追的番一更新就通知你，不用每周自己蹲点查。
              </p>
            </div>
          </div>

          {/* Stats Chart */}
          <div className="border border-sky-100 rounded-3xl p-8 md:p-10 bg-sky-50/30">
            <h3 className="font-heading text-2xl font-bold text-sky-900 mb-2">
              收录番剧条目
            </h3>
            <p className="text-sky-600 text-sm mb-8">
              数据来自 AniList 开放 API · 每日同步
            </p>

            {/* Inline SVG Bar Chart */}
            <svg
              viewBox="0 0 640 200"
              className="w-full h-auto"
              role="img"
              aria-label="收录番剧条目统计图表"
            >
              {/* Background grid lines */}
              <line
                x1="80"
                y1="20"
                x2="620"
                y2="20"
                stroke="#e0f2fe"
                strokeWidth="1"
              />
              <line
                x1="80"
                y1="70"
                x2="620"
                y2="70"
                stroke="#e0f2fe"
                strokeWidth="1"
              />
              <line
                x1="80"
                y1="120"
                x2="620"
                y2="120"
                stroke="#e0f2fe"
                strokeWidth="1"
              />

              {/* Y-axis labels */}
              <text
                x="70"
                y="25"
                textAnchor="end"
                fontSize="12"
                fill="#64748b"
                fontFamily="Nunito, sans-serif"
              >
                15,000
              </text>
              <text
                x="70"
                y="75"
                textAnchor="end"
                fontSize="12"
                fill="#64748b"
                fontFamily="Nunito, sans-serif"
              >
                10,000
              </text>
              <text
                x="70"
                y="125"
                textAnchor="end"
                fontSize="12"
                fill="#64748b"
                fontFamily="Nunito, sans-serif"
              >
                5,000
              </text>
              <text
                x="70"
                y="170"
                textAnchor="end"
                fontSize="12"
                fill="#64748b"
                fontFamily="Nunito, sans-serif"
              >
                0
              </text>

              {/* Bar 1: TV Series */}
              <rect
                x="100"
                y="68"
                width="140"
                height="102"
                rx="8"
                fill="#0ea5e9"
              />
              <text
                x="170"
                y="120"
                textAnchor="middle"
                fontSize="18"
                fontWeight="700"
                fill="#ffffff"
                fontFamily="Fredoka, sans-serif"
              >
                12,847
              </text>
              <text
                x="170"
                y="185"
                textAnchor="middle"
                fontSize="13"
                fill="#0c4a6e"
                fontWeight="600"
                fontFamily="Nunito, sans-serif"
              >
                TV 动画
              </text>

              {/* Bar 2: Movies */}
              <rect
                x="280"
                y="108"
                width="140"
                height="62"
                rx="8"
                fill="#38bdf8"
              />
              <text
                x="350"
                y="145"
                textAnchor="middle"
                fontSize="18"
                fontWeight="700"
                fill="#ffffff"
                fontFamily="Fredoka, sans-serif"
              >
                7,231
              </text>
              <text
                x="350"
                y="185"
                textAnchor="middle"
                fontSize="13"
                fill="#0c4a6e"
                fontWeight="600"
                fontFamily="Nunito, sans-serif"
              >
                剧场版
              </text>

              {/* Bar 3: OVAs */}
              <rect
                x="460"
                y="128"
                width="140"
                height="42"
                rx="8"
                fill="#7dd3fc"
              />
              <text
                x="530"
                y="155"
                textAnchor="middle"
                fontSize="18"
                fontWeight="700"
                fill="#0c4a6e"
                fontFamily="Fredoka, sans-serif"
              >
                4,156
              </text>
              <text
                x="530"
                y="185"
                textAnchor="middle"
                fontSize="13"
                fill="#0c4a6e"
                fontWeight="600"
                fontFamily="Nunito, sans-serif"
              >
                OVA / ONA
              </text>
            </svg>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Landing
