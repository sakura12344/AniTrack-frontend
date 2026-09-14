import { useState } from "react"
import { Link } from "react-router-dom"
import authBg from "../../assets/images/authBg.png"

function Register() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()

    setIsSubmitting(true)

    setTimeout(() => {
      setIsSubmitting(false)
      const users = JSON.parse(localStorage.getItem("users") || "[]")
      users.push({ email: email.trim(), password })
      localStorage.setItem("users", JSON.stringify(users))
      window.location.href = "/login"
    }, 1500)
  }

  return (
    <div className="min-h-screen flex">
      {/* Left: Illustration */}
      <div
        className="hidden lg:block lg:w-1/2 bg-cover bg-center"
        style={{ backgroundImage: `url(${authBg})` }}
        aria-hidden="true"
      />

      {/* Right: Form */}
      <div
        className="w-full lg:w-1/2 flex items-center justify-center px-4 py-12 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #edf4ff 0%, #deeaff 100%)",
        }}
      >
        <div className="w-full max-w-sm relative z-10">
          {/* 注册卡片 */}
          <div
            className="rounded-2xl p-8"
            style={{
              backgroundColor: "#ffffff",
              boxShadow: "0 4px 24px rgba(23, 32, 51, 0.06)",
            }}
          >
            {/* Wordmark */}
            <div className="text-center mb-10">
              <Link
                to="/"
                className="font-heading text-2xl font-semibold tracking-tight cursor-pointer transition-colors duration-150 focus-visible:outline-none rounded inline-block text-[#172033] hover:text-[#3B82F6]"
              >
                AniTrack
              </Link>
            </div>

            {/* Title */}
            <h1
              className="font-heading text-3xl font-bold text-center mb-8"
              style={{ color: "#172033" }}
            >
              创建你的追番档案
            </h1>

            <form id="register-form" noValidate onSubmit={handleSubmit}>
              {/* Username */}
              <div className="mb-5">
                <label
                  htmlFor="username"
                  className="block text-sm font-semibold mb-2"
                  style={{ color: "#172033" }}
                >
                  用户名
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  placeholder="想被怎么称呼"
                  className="w-full px-4 py-3 rounded-lg text-base transition-colors duration-150 focus:outline-none min-h-11 bg-[#f8fafc] border border-[#e2e8f0] text-[#172033] focus:border-[#3B82F6]"
                />
              </div>

              {/* Email */}
              <div className="mb-5">
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold mb-2"
                  style={{ color: "#172033" }}
                >
                  邮箱
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg text-base transition-colors duration-150 focus:outline-none min-h-11 bg-[#f8fafc] border border-[#e2e8f0] text-[#172033] focus:border-[#3B82F6]"
                />
              </div>

              {/* Password */}
              <div className="mb-5">
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold mb-2"
                  style={{ color: "#172033" }}
                >
                  密码
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 rounded-lg text-base transition-colors duration-150 focus:outline-none min-h-11 bg-[#f8fafc] border border-[#e2e8f0] text-[#172033] focus:border-[#3B82F6]"
                  />
                  <button
                    type="button"
                    id="toggle-password"
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-md transition-colors duration-150 cursor-pointer focus-visible:outline-none"
                    aria-label={showPassword ? "隐藏密码" : "显示密码"}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <svg
                      id="icon-eye"
                      className={`w-5 h-5 ${showPassword ? "hidden" : ""}`}
                      style={{ color: "#94a3b8" }}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    <svg
                      id="icon-eyeoff"
                      className={`w-5 h-5 ${showPassword ? "" : "hidden"}`}
                      style={{ color: "#94a3b8" }}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7c.78 0 1.53-.09 2.24-.26" />
                      <path d="M2 2l20 20" />
                    </svg>
                  </button>
                </div>
                <p
                  id="password-hint"
                  className="mt-2 text-sm"
                  style={{ color: "#64748b" }}
                >
                  至少 8 位，建议混合字母与数字
                </p>
              </div>

              {/* Confirm Password */}
              <div className="mb-6">
                <label
                  htmlFor="confirm-password"
                  className="block text-sm font-semibold mb-2"
                  style={{ color: "#172033" }}
                >
                  确认密码
                </label>
                <div className="relative">
                  <input
                    id="confirm-password"
                    name="confirm-password"
                    type={showConfirm ? "text" : "password"}
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 rounded-lg text-base transition-colors duration-150 focus:outline-none min-h-11 bg-[#f8fafc] border border-[#e2e8f0] text-[#172033] focus:border-[#3B82F6]"
                  />
                  <button
                    type="button"
                    id="toggle-confirm"
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-md transition-colors duration-150 cursor-pointer focus-visible:outline-none"
                    aria-label={showConfirm ? "隐藏密码" : "显示密码"}
                    onClick={() => setShowConfirm(!showConfirm)}
                  >
                    <svg
                      id="icon-eye-confirm"
                      className={`w-5 h-5 ${showConfirm ? "hidden" : ""}`}
                      style={{ color: "#94a3b8" }}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    <svg
                      id="icon-eyeoff-confirm"
                      className={`w-5 h-5 ${showConfirm ? "" : "hidden"}`}
                      style={{ color: "#94a3b8" }}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7c.78 0 1.53-.09 2.24-.26" />
                      <path d="M2 2l20 20" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                id="submit-btn"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 font-bold text-base px-6 py-3 rounded-lg transition-colors duration-150 cursor-pointer focus-visible:outline-none min-h-12 disabled:opacity-70 bg-[#3b82f6] text-white hover:bg-[#2563EB]"
              >
                {isSubmitting && (
                  <svg
                    id="loader"
                    className="w-5 h-5 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                )}
                <span id="btn-text">
                  {isSubmitting ? "创建中…" : "免费注册"}
                </span>
              </button>
            </form>

            {/* Footer link */}
            <div className="mt-8 text-center">
              <p className="text-sm" style={{ color: "#64748b" }}>
                已有账号？
                <Link
                  to="/login"
                  className="font-semibold transition-colors duration-150 cursor-pointer focus-visible:outline-none rounded text-[#172033] hover:text-[#3B82F6]"
                >
                  直接登录
                </Link>
              </p>
              <p className="mt-3 text-sm">
                <Link
                  to="/"
                  className="transition-colors duration-150 cursor-pointer focus-visible:outline-none rounded text-[#64748b] hover:text-[#3B82F6]"
                >
                  返回首页
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
