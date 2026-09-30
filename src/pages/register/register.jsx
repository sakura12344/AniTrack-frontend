import { useState } from "react"
import { Link } from "react-router-dom"
import { register as apiRegister } from "../../api/auth.js"
import authBg from "../../assets/images/authBg.png"

function Register() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState("") // F-16 异常处理：网络/服务端错误提示

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  function isWeakPassword(password) {
    return /^\d+$/.test(password) || /^[a-zA-Z]+$/.test(password)
  }

  function validate() {
    const newErrors = {}
    const trimmedEmail = email.trim() // F-02 输入首尾空格自动去除

    // ── F-05 必填校验 ──
    if (!username.trim()) {
      newErrors.username = "请输入用户名"
    } else if (/\s/.test(username)) {
      // 用户名空格校验
      newErrors.username = "用户名不能包含空格"
    }

    if (!trimmedEmail) {
      newErrors.email = "请输入邮箱"
    } else if (!validateEmail(trimmedEmail)) {
      // F-06 邮箱格式校验
      newErrors.email = "邮箱格式不正确"
    }

    if (!password) {
      newErrors.password = "请输入密码"
    } else if (/\s/.test(password)) {
      // 密码空格校验（含中间空格）
      newErrors.password = "密码不能包含空格"
    } else if (password.length < 8) {
      // F-07 密码长度校验
      newErrors.password = "密码至少 8 位"
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "请确认密码"
    } else if (password !== confirmPassword) {
      // F-08 密码一致性校验（双向比对）
      newErrors.confirmPassword = "两次密码输入不一致"
    }

    // F-10 弱密码提示（仅建议性提示，不阻止提交）
    if (
      password &&
      password.length >= 8 &&
      !/\s/.test(password) &&
      isWeakPassword(password)
    ) {
      newErrors.passwordWeak = "建议使用字母与数字混合的密码"
    }

    return newErrors
  }

  // F-15 防重复提交 + F-16 异常处理 + F-13/F-14 唯一性校验
  async function handleSubmit(e) {
    e.preventDefault()
    setApiError("") // 清除上次 API 错误

    const validationErrors = validate()
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) {
      return
    }

    setIsSubmitting(true)

    try {
      await apiRegister(username.trim(), email.trim(), password)

      // F-17 注册成功提示与跳转
      alert("注册成功")
      window.location.href = "/login"
    } catch (error) {
      // F-16 异常处理与友好提示
      const errCode = error.errorBody?.code

      if (errCode === "USERNAME_EXISTS") {
        setApiError("用户名已被占用")
      } else if (errCode === "EMAIL_EXISTS") {
        setApiError("邮箱已被注册")
      } else {
        setApiError(error.message || "网络异常，请重试")
      }
    } finally {
      setIsSubmitting(false)
    }
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
              {/* Username —— F-01 */}
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
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  maxLength={30}
                  className={`w-full px-4 py-3 rounded-lg text-base transition-colors duration-150 focus:outline-none min-h-11 bg-[#f8fafc] border ${
                    errors.username
                      ? "border-[#EF4444] focus:border-[#EF4444]"
                      : "border-[#e2e8f0] focus:border-[#3B82F6]"
                  } text-[#172033]`}
                />
                {errors.username && (
                  <p className="mt-1.5 text-sm text-[#EF4444]">
                    {errors.username}
                  </p>
                )}
              </div>

              {/* Email —— F-02 */}
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
                  onBlur={() => setEmail((prev) => prev.trim())}
                  maxLength={100}
                  className={`w-full px-4 py-3 rounded-lg text-base transition-colors duration-150 focus:outline-none min-h-11 bg-[#f8fafc] border ${
                    errors.email
                      ? "border-[#EF4444] focus:border-[#EF4444]"
                      : "border-[#e2e8f0] focus:border-[#3B82F6]"
                  } text-[#172033]`}
                />
                {errors.email && (
                  <p className="mt-1.5 text-sm text-[#EF4444]">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password —— F-03 */}
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
                    maxLength={64}
                    className={`w-full px-4 py-3 pr-12 rounded-lg text-base transition-colors duration-150 focus:outline-none min-h-11 bg-[#f8fafc] border ${
                      errors.password
                        ? "border-[#EF4444] focus:border-[#EF4444]"
                        : "border-[#e2e8f0] focus:border-[#3B82F6]"
                    } text-[#172033]`}
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
                {errors.password && (
                  <p className="mt-1.5 text-sm text-[#EF4444]">
                    {errors.password}
                  </p>
                )}
                {errors.passwordWeak && !errors.password && (
                  <p className="mt-1.5 text-sm text-[#F59E0B]">
                    {errors.passwordWeak}
                  </p>
                )}
                {!errors.password && !errors.passwordWeak && (
                  <p
                    id="password-hint"
                    className="mt-2 text-sm"
                    style={{ color: "#64748b" }}
                  >
                    至少 8 位，建议混合字母与数字
                  </p>
                )}
              </div>

              {/* Confirm Password —— F-04 */}
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
                    maxLength={64}
                    className={`w-full px-4 py-3 pr-12 rounded-lg text-base transition-colors duration-150 focus:outline-none min-h-11 bg-[#f8fafc] border ${
                      errors.confirmPassword
                        ? "border-[#EF4444] focus:border-[#EF4444]"
                        : "border-[#e2e8f0] focus:border-[#3B82F6]"
                    } text-[#172033]`}
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
                {errors.confirmPassword && (
                  <p className="mt-1.5 text-sm text-[#EF4444]">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* F-16 API 异常与业务错误提示 */}
              {apiError && (
                <div
                  className="mb-5 p-3 rounded-lg text-sm text-center"
                  style={{
                    backgroundColor: "#FEF2F2",
                    color: "#B91C1C",
                    border: "1px solid #FECACA",
                  }}
                  role="alert"
                >
                  {apiError}
                </div>
              )}

              {/* Submit —— F-15, F-17 */}
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

            {/* Footer links —— F-18, F-19 */}
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
