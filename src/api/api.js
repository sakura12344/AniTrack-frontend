import axios from "axios"

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
})

// ──────────────────────────────────────────────
//  请求拦截器：注入 access token
// ──────────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// ──────────────────────────────────────────────
//  响应拦截器：401 自动刷新令牌
// ──────────────────────────────────────────────
let isRefreshing = false
let refreshQueue = []

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // 401 且尚未重试过 → 尝试刷新令牌
    if (error.response?.status === 401 && !originalRequest._retry) {
      // 正在刷新中 → 将请求加入队列等待
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          refreshQueue.push({ resolve, reject, config: originalRequest })
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const refreshToken = localStorage.getItem("refresh_token")
        if (!refreshToken) throw new Error("无刷新令牌")

        // 使用原始 axios 避免再次触发拦截器
        const baseURL = api.defaults.baseURL
        const res = await axios.post(`${baseURL}/auth/refresh`, {
          refreshToken,
        })

        // 兼容 { code, data: { token, refreshToken } } 和直接响应
        const body = res.data?.data || res.data
        const newToken = body.token
        const newRefreshToken = body.refreshToken

        if (!newToken) throw new Error("刷新令牌响应格式异常")

        localStorage.setItem("auth_token", newToken)
        if (newRefreshToken) {
          localStorage.setItem("refresh_token", newRefreshToken)
        }

        // 更新原始请求的 Authorization
        originalRequest.headers.Authorization = `Bearer ${newToken}`

        // 重放队列中等待的请求
        refreshQueue.forEach(({ resolve: r, reject: j, config: cfg }) => {
          cfg.headers.Authorization = `Bearer ${newToken}`
          r(api(cfg))
        })
        refreshQueue = []

        // 重试原始请求
        return api(originalRequest)
      } catch (refreshError) {
        // 刷新失败 → 清理全部登录状态
        localStorage.removeItem("auth_token")
        localStorage.removeItem("refresh_token")
        localStorage.removeItem("currentUser")

        // 拒绝队列中所有请求
        refreshQueue.forEach(({ reject: j }) => {
          j({ status: 401, message: "登录已过期，请重新登录" })
        })
        refreshQueue = []

        // 跳转登录页
        window.location.href = "/login"
        return Promise.reject({
          status: 401,
          message: "登录已过期，请重新登录",
        })
      } finally {
        isRefreshing = false
      }
    }

    // ── 非 401 或已是重试请求的错误处理 ──
    if (error.code === "ECONNABORTED") {
      return Promise.reject({ status: 0, message: "请求超时，请稍后重试" })
    }
    if (!error.response) {
      return Promise.reject({
        status: 0,
        message: "网络异常，请检查网络连接后重试",
      })
    }
    const { status, data } = error.response

    const message =
      data?.message ||
      data?.error?.message ||
      {
        400: "请求参数有误",
        401: "账号或密码错误",
        403: "账号或密码错误",
        404: "请求的资源不存在",
        409: "数据冲突，请检查后重试",
        429: "操作过于频繁，请稍后重试",
        500: "系统繁忙，请稍后重试",
        503: "系统繁忙，请稍后重试",
      }[status] ||
      "系统繁忙，请稍后重试"

    return Promise.reject({ status, message, errorBody: data?.error || null })
  },
)

export default api
