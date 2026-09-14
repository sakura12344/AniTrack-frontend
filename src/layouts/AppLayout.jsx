import { useState, useRef, useEffect, useCallback } from "react"
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom"

const navItems = [
  { path: "library", label: "番剧浏览", icon: LibraryIcon },
  { path: "watch", label: "我的追番", icon: WatchIcon },
  { path: "favorites", label: "我的收藏", icon: FavoritesIcon },
  { path: "history", label: "观看历史", icon: HistoryIcon },
  { path: "stats", label: "个人统计", icon: StatsIcon },
  { path: "recommend", label: "动漫推荐", icon: RecommendIcon },
  { path: "notifications", label: "更新提醒", icon: NotificationsIcon },
]

const extNavItems = [
  { path: "comment-analysis", label: "评论分析", icon: CommentIcon },
  { path: "relation-graph", label: "作品关系图", icon: GlobeIcon },
]

function LibraryIcon() {
  return (
    <svg
      className="w-5 h-5 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m4 6 3-3 3 3" />
      <path d="M10 12a4 4 0 0 1 4-4h0a4 4 0 0 1 4 4v0a4 4 0 0 1-4 4h0a4 4 0 0 1-4-4v0Z" />
      <path d="M18 22H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2Z" />
    </svg>
  )
}

function WatchIcon() {
  return (
    <svg
      className="w-5 h-5 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="15" x="2" y="7" rx="2" ry="2" />
      <polyline points="17 2 12 7 7 2" />
    </svg>
  )
}

function FavoritesIcon() {
  return (
    <svg
      className="w-5 h-5 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  )
}

function HistoryIcon() {
  return (
    <svg
      className="w-5 h-5 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 3v5h5" />
      <path d="M3.05 13A9 9 0 1 0 6 5.3L3 8" />
      <path d="M12 7v5l4 2" />
    </svg>
  )
}

function StatsIcon() {
  return (
    <svg
      className="w-5 h-5 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 3v18h18" />
      <path d="m19 9-5 5-4-4-3 3" />
    </svg>
  )
}

function RecommendIcon() {
  return (
    <svg
      className="w-5 h-5 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
    </svg>
  )
}

function NotificationsIcon() {
  return (
    <svg
      className="w-5 h-5 shrink-0"
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
  )
}

function CommentIcon() {
  return (
    <svg
      className="w-5 h-5 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  )
}

function GlobeIcon() {
  return (
    <svg
      className="w-5 h-5 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  )
}

function UserIcon({ className = "w-4 h-4" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

function SettingsIcon({ className = "w-4 h-4" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function LogoutIcon({ className = "w-4 h-4" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" x2="9" y1="12" y2="12" />
    </svg>
  )
}

function CloseIcon({ className = "w-5 h-5" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}

function MenuIcon() {
  return (
    <svg
      className="w-5 h-5"
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
  )
}

function BrandIcon() {
  return (
    <svg
      className="w-5 h-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Z" />
      <path d="m12 6 4 6-4 6" />
      <path d="M8 12h8" />
    </svg>
  )
}

function CollapseIcon() {
  return (
    <svg
      className="w-5 h-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M9 3v18" />
      <path d="m14 15-3-3 3-3" />
    </svg>
  )
}

function SearchIcon({ className = "w-4 h-4" }) {
  return (
    <svg
      className={className}
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
  )
}

function AppLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const [expanded, setExpanded] = useState(true)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [popoverOpen, setPopoverOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [settingsCat, setSettingsCat] = useState("appearance")
  const accountTriggerRef = useRef(null)
  const popoverRef = useRef(null)

  const currentPath = location.pathname.replace("/app/", "")
  const pageTitle =
    navItems.find((i) => i.path === currentPath)?.label || "观影管理"

  const toggleExpanded = useCallback(() => setExpanded((v) => !v), [])
  const openDrawer = useCallback(() => setDrawerOpen(true), [])
  const closeDrawer = useCallback(() => setDrawerOpen(false), [])

  const togglePopover = useCallback(() => setPopoverOpen((v) => !v), [])

  const openProfile = useCallback(() => {
    setPopoverOpen(false)
    setProfileOpen(true)
  }, [])
  const closeProfile = useCallback(() => setProfileOpen(false), [])

  const openSettings = useCallback(() => {
    setPopoverOpen(false)
    setSettingsOpen(true)
  }, [])
  const closeSettings = useCallback(() => setSettingsOpen(false), [])

  const handleLogout = useCallback(() => {
    localStorage.removeItem("currentUser")
    navigate("/login")
  }, [navigate])

  useEffect(() => {
    function onClick(e) {
      if (
        popoverOpen &&
        popoverRef.current &&
        !popoverRef.current.contains(e.target) &&
        accountTriggerRef.current &&
        !accountTriggerRef.current.contains(e.target)
      ) {
        setPopoverOpen(false)
      }
    }
    document.addEventListener("click", onClick)
    return () => document.removeEventListener("click", onClick)
  }, [popoverOpen])

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") {
        if (profileOpen) setProfileOpen(false)
        if (settingsOpen) setSettingsOpen(false)
        if (drawerOpen) setDrawerOpen(false)
        if (popoverOpen) setPopoverOpen(false)
      }
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [profileOpen, settingsOpen, drawerOpen, popoverOpen])

  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [drawerOpen])

  const sidebarWidth = expanded ? 240 : 64

  function NavLink({ item, isExt }) {
    const isActive = location.pathname === `/app/${item.path}`
    return (
      <li className={`group ${expanded ? "" : "flex justify-center"}`}>
        <Link
          to={item.path === "#" ? "#" : `/app/${item.path}`}
          className={`nav-item relative flex items-center gap-3 rounded-lg text-sm font-medium transition-colors duration-150 ${
            expanded ? "px-3 py-2.5" : "w-10 h-10 px-0 py-0 justify-center"
          } ${
            isActive
              ? "bg-sky-100 text-sky-700"
              : isExt
                ? "text-[#64748b] hover:bg-sky-50 hover:text-sky-700"
                : "text-sky-700 hover:bg-sky-50"
          }`}
          onClick={closeDrawer}
        >
          <item.icon />
          <span
            className={`nav-label whitespace-nowrap ${expanded ? "" : "hidden"}`}
          >
            {item.label}
          </span>
          {!expanded && (
            <span className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2.5 py-1 bg-[#0f172a] text-white text-xs font-semibold rounded-md whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-150 z-50 pointer-events-none">
              {item.label}
            </span>
          )}
        </Link>
      </li>
    )
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a] antialiased">
      {/* Mobile Drawer Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 lg:hidden transition-opacity duration-150 ${drawerOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={closeDrawer}
      />

      {/* Mobile Drawer Panel */}
      <div
        className={`fixed top-0 left-0 bottom-0 w-64 bg-white border-r border-[#e2e8f0] z-50 lg:hidden flex flex-col transition-transform duration-150 ${drawerOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="h-14 flex items-center px-4 border-b border-[#e2e8f0]">
          <Link
            to="/"
            className="font-heading text-lg font-semibold text-sky-900 tracking-tight rounded"
          >
            AniTrack
          </Link>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-3">
          <ul className="flex flex-col gap-1">
            {navItems.map((item) => (
              <NavLink key={item.path} item={item} />
            ))}
          </ul>
          <div className="my-3 border-t border-[#e2e8f0]" />
          <p className="px-3 mb-2 text-xs font-semibold text-[#64748b] uppercase tracking-wider">
            扩展功能
          </p>
          <ul className="flex flex-col gap-1">
            {extNavItems.map((item, idx) => (
              <NavLink key={idx} item={item} isExt />
            ))}
          </ul>
        </nav>
        <div className="border-t border-[#e2e8f0] px-3 py-3">
          <button
            className="flex items-center gap-3 w-full px-3 py-2 rounded-none hover:bg-sky-50 transition-colors duration-150 text-left"
            onClick={handleLogout}
          >
            <div className="w-7 h-7 rounded-full bg-sky-100 flex items-center justify-center shrink-0">
              <UserIcon className="w-3.5 h-3.5 text-sky-500" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[#0f172a] truncate">
                用户
              </p>
              <p className="text-xs text-[#64748b] truncate">退出登录</p>
            </div>
          </button>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <aside
        className="fixed top-0 left-0 bottom-0 bg-white border-r border-[#e2e8f0] z-30 hidden lg:flex flex-col transition-[width] duration-150"
        style={{ width: sidebarWidth }}
      >
        <div
          className={`h-14 flex items-center border-b border-[#e2e8f0] shrink-0 ${expanded ? "justify-between px-4" : "justify-center px-0"}`}
        >
          {expanded ? (
            <>
              <Link
                to="/"
                className="font-heading text-lg font-semibold text-sky-900 tracking-tight rounded truncate"
              >
                AniTrack
              </Link>
              <button
                type="button"
                onClick={toggleExpanded}
                className="group relative w-10 h-10 flex items-center justify-center rounded-lg hover:bg-sky-50 transition-colors duration-150 cursor-ew-resize"
                aria-label="收起侧边栏"
              >
                <CollapseIcon />
                <span className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2.5 py-1 bg-[#0f172a] text-white text-xs font-semibold rounded-md whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-150 z-50 pointer-events-none">
                  收起侧边栏
                </span>
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={toggleExpanded}
              className="group relative w-10 h-10 flex items-center justify-center rounded-lg hover:bg-sky-50 transition-colors duration-150 cursor-ew-resize"
              aria-label="展开侧边栏"
            >
              <BrandIcon />
              <span className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2.5 py-1 bg-[#0f172a] text-white text-xs font-semibold rounded-md whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-150 z-50 pointer-events-none">
                展开侧边栏
              </span>
            </button>
          )}
        </div>

        <nav className="flex-1 px-3 py-3 overflow-visible">
          <ul className="flex flex-col gap-1">
            {navItems.map((item) => (
              <NavLink key={item.path} item={item} />
            ))}
          </ul>
          <div
            className={`my-3 border-t border-[#e2e8f0] ${expanded ? "" : "hidden"}`}
          />
          <p
            className={`px-3 mb-2 text-xs font-semibold text-[#64748b] uppercase tracking-wider ${expanded ? "" : "hidden"}`}
          >
            扩展功能
          </p>
          <ul className="flex flex-col gap-1">
            {extNavItems.map((item, idx) => (
              <NavLink key={idx} item={item} isExt />
            ))}
          </ul>
        </nav>

        <div
          className={`border-t border-[#e2e8f0] px-3 py-3 shrink-0 relative ${expanded ? "" : "flex justify-center"}`}
        >
          <button
            ref={accountTriggerRef}
            type="button"
            onClick={togglePopover}
            className={`group flex items-center gap-3 rounded-lg hover:bg-sky-50 transition-colors duration-150 text-left cursor-pointer ${popoverOpen ? "bg-sky-50" : ""} ${expanded ? "w-full px-3 py-2" : "w-10 h-10 px-0 py-0 justify-center"}`}
            aria-haspopup="menu"
            aria-expanded={popoverOpen}
          >
            <div className="w-7 h-7 rounded-full bg-sky-100 flex items-center justify-center shrink-0">
              <UserIcon className="w-3.5 h-3.5 text-sky-500" />
            </div>
            {expanded && (
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#0f172a] truncate">
                  用户
                </p>
                <p className="text-xs text-[#64748b] truncate">account menu</p>
              </div>
            )}
            {!expanded && (
              <span className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2.5 py-1 bg-[#0f172a] text-white text-xs font-semibold rounded-md whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-150 z-50 pointer-events-none">
                用户
              </span>
            )}
          </button>

          {/* Account Popover */}
          {popoverOpen && (
            <div
              ref={popoverRef}
              className={`absolute bottom-full mb-2 bg-white rounded-xl border border-[#e2e8f0] shadow-lg z-50 py-1.5 ${expanded ? "left-3 right-3" : "left-3 w-48"}`}
              role="menu"
            >
              <button
                role="menuitem"
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-[#0f172a] hover:bg-sky-50 transition-colors duration-150 text-left min-h-11 cursor-pointer"
                onClick={openProfile}
              >
                <UserIcon className="w-4 h-4 text-[#64748b] shrink-0" />
                个人资料
              </button>
              <button
                role="menuitem"
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-[#0f172a] hover:bg-sky-50 transition-colors duration-150 text-left min-h-11 cursor-pointer"
                onClick={openSettings}
              >
                <SettingsIcon className="w-4 h-4 text-[#64748b] shrink-0" />
                设置
              </button>
              <div className="my-1 border-t border-[#e2e8f0]" />
              <button
                role="menuitem"
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-[#0f172a] hover:bg-sky-50 transition-colors duration-150 text-left min-h-11 cursor-pointer"
                onClick={handleLogout}
              >
                <LogoutIcon className="w-4 h-4 text-[#64748b] shrink-0" />
                Log out
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Profile Modal */}
      {profileOpen && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center bg-black/30"
          onClick={closeProfile}
        >
          <div
            className="w-full max-w-4xl mx-4 bg-white rounded-2xl border border-[#e2e8f0] shadow-xl"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-14 flex items-center justify-between px-5 border-b border-[#e2e8f0]">
              <h2 className="text-base font-semibold text-[#0f172a]">
                编辑个人资料
              </h2>
              <button
                type="button"
                onClick={closeProfile}
                className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-sky-50 transition-colors duration-150 cursor-pointer"
                aria-label="关闭"
              >
                <CloseIcon className="w-5 h-5 text-[#64748b]" />
              </button>
            </div>
            <div className="px-6 py-6">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 rounded-full bg-sky-100 flex items-center justify-center">
                  <UserIcon className="w-10 h-10 text-sky-400" />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-xs font-medium text-[#64748b] mb-1.5">
                  显示名称
                </label>
                <input
                  type="text"
                  defaultValue="用户昵称"
                  className="w-full px-3 py-2.5 rounded-lg border border-[#e2e8f0] text-sm text-[#0f172a] bg-white focus:outline-none focus:border-sky-400 transition-colors duration-150"
                  autoComplete="name"
                />
              </div>
              <div className="mb-6">
                <label className="block text-xs font-medium text-[#64748b] mb-1.5">
                  用户名
                </label>
                <input
                  type="text"
                  defaultValue="username"
                  className="w-full px-3 py-2.5 rounded-lg border border-[#e2e8f0] text-sm text-[#0f172a] bg-white focus:outline-none focus:border-sky-400 transition-colors duration-150"
                  autoComplete="username"
                />
              </div>
              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={closeProfile}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-[#64748b] hover:bg-gray-100 transition-colors duration-150 cursor-pointer min-h-9 border border-[#e2e8f0]"
                >
                  取消
                </button>
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-black transition-colors duration-150 cursor-pointer min-h-9"
                >
                  保存
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {settingsOpen && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center bg-black/30"
          onClick={closeSettings}
        >
          <div
            className="w-full max-w-210 h-155 max-h-[calc(100vh-32px)] mx-4 bg-white rounded-2xl border border-[#e2e8f0] shadow-xl flex flex-col overflow-hidden"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-14 flex items-center justify-between px-5 border-b border-[#e2e8f0] shrink-0">
              <h2 className="text-base font-semibold text-[#0f172a]">设置</h2>
              <button
                type="button"
                onClick={closeSettings}
                className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-sky-50 transition-colors duration-150 cursor-pointer"
                aria-label="关闭"
              >
                <CloseIcon className="w-5 h-5 text-[#64748b]" />
              </button>
            </div>
            <div className="flex-1 flex overflow-hidden">
              <nav className="w-48 border-r border-[#e2e8f0] flex flex-col p-3 gap-1 shrink-0 overflow-y-auto">
                {[
                  { key: "appearance", label: "外观", icon: GlobeIcon },
                  {
                    key: "notifications",
                    label: "通知",
                    icon: NotificationsIcon,
                  },
                  { key: "application", label: "应用", icon: StatsIcon },
                ].map((cat) => (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() => setSettingsCat(cat.key)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-none text-sm font-medium transition-colors duration-150 text-left min-h-11 cursor-pointer ${
                      settingsCat === cat.key
                        ? "bg-sky-50 text-[#0f172a]"
                        : "text-[#64748b] hover:bg-sky-50 hover:text-[#0f172a]"
                    }`}
                  >
                    <cat.icon />
                    {cat.label}
                  </button>
                ))}
              </nav>
              <div className="flex-1 p-6 overflow-y-auto">
                {settingsCat === "appearance" && (
                  <div>
                    <h3 className="text-sm font-semibold text-[#0f172a] mb-4">
                      外观
                    </h3>
                    <div className="space-y-4">
                      <div className="rounded-lg border border-[#e2e8f0] p-4 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-[#0f172a]">
                            主题
                          </p>
                          <p className="text-xs text-[#64748b] mt-0.5">
                            选择应用界面主题
                          </p>
                        </div>
                        <div className="text-sm text-[#64748b]">浅色</div>
                      </div>
                      <div className="rounded-lg border border-[#e2e8f0] p-4 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-[#0f172a]">
                            侧边栏
                          </p>
                          <p className="text-xs text-[#64748b] mt-0.5">
                            默认展开或收起
                          </p>
                        </div>
                        <div className="text-sm text-[#64748b]">展开</div>
                      </div>
                    </div>
                  </div>
                )}
                {settingsCat === "notifications" && (
                  <div>
                    <h3 className="text-sm font-semibold text-[#0f172a] mb-4">
                      通知
                    </h3>
                    <div className="space-y-4">
                      <div className="rounded-lg border border-[#e2e8f0] p-4 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-[#0f172a]">
                            番剧更新
                          </p>
                          <p className="text-xs text-[#64748b] mt-0.5">
                            追番更新时发送通知
                          </p>
                        </div>
                        <div className="text-sm text-[#64748b]">已开启</div>
                      </div>
                      <div className="rounded-lg border border-[#e2e8f0] p-4 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-[#0f172a]">
                            邮件提醒
                          </p>
                          <p className="text-xs text-[#64748b] mt-0.5">
                            接收每周观看报告
                          </p>
                        </div>
                        <div className="text-sm text-[#64748b]">已关闭</div>
                      </div>
                    </div>
                  </div>
                )}
                {settingsCat === "application" && (
                  <div>
                    <h3 className="text-sm font-semibold text-[#0f172a] mb-4">
                      应用
                    </h3>
                    <div className="space-y-4">
                      <div className="rounded-lg border border-[#e2e8f0] p-4 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-[#0f172a]">
                            语言
                          </p>
                          <p className="text-xs text-[#64748b] mt-0.5">
                            界面显示语言
                          </p>
                        </div>
                        <div className="text-sm text-[#64748b]">简体中文</div>
                      </div>
                      <div className="rounded-lg border border-[#e2e8f0] p-4 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-[#0f172a]">
                            数据同步
                          </p>
                          <p className="text-xs text-[#64748b] mt-0.5">
                            自动同步观看记录
                          </p>
                        </div>
                        <div className="text-sm text-[#64748b]">已开启</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Application Area */}
      <div
        className="h-screen flex flex-col transition-[margin] duration-150"
        style={{
          marginLeft:
            typeof window !== "undefined" && window.innerWidth >= 1024
              ? sidebarWidth
              : 0,
        }}
      >
        {/* Top Bar */}
        <header className="h-14 flex items-center gap-3 px-4 border-b border-[#e2e8f0] bg-white sticky top-0 z-20">
          <button
            type="button"
            onClick={openDrawer}
            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-sky-50 transition-colors duration-150 cursor-pointer"
            aria-label="打开导航"
          >
            <MenuIcon />
          </button>
          <div className="min-w-0">
            <h1 className="text-base font-semibold text-[#0f172a] truncate">
              {pageTitle}
            </h1>
          </div>
          <div className="hidden sm:flex items-center ml-8">
            <div className="flex items-center gap-2 px-3 py-2 bg-[#f1f5f9] border border-transparent rounded-lg text-sm text-[#64748b] cursor-text w-70 focus-within:bg-white focus-within:border-sky-400 focus-within:ring-1 focus-within:ring-sky-400 transition-all duration-150">
              <SearchIcon className="w-4 h-4 text-[#94a3b8] shrink-0" />
              <input
                type="text"
                placeholder="搜索动漫、用户..."
                className="bg-transparent outline-none text-sm text-[#0f172a] placeholder:text-[#94a3b8] w-full"
              />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AppLayout
