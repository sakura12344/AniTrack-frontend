import api from "./api.js"

const STORAGE_KEY_USER = "currentUser"
const STORAGE_KEY_TOKEN = "auth_token"
const STORAGE_KEY_REFRESH = "refresh_token"

// ──────────────────────────────────────────────
//  登录
// ──────────────────────────────────────────────
async function login(username, password) {
  const response = await api.post("/auth/login", { username, password })

  // response.data = { code: 200, message: "success", data: { token, refreshToken, userId, username, email } }
  const body = response.data
  const { token, refreshToken, userId, username: uname, email } = body.data

  localStorage.setItem(STORAGE_KEY_TOKEN, token)
  if (refreshToken) {
    localStorage.setItem(STORAGE_KEY_REFRESH, refreshToken)
  }
  localStorage.setItem(
    STORAGE_KEY_USER,
    JSON.stringify({ userId, username: uname, email }),
  )

  return body.data
}

// ──────────────────────────────────────────────
//  注册
// ──────────────────────────────────────────────
async function register(username, email, password) {
  const response = await api.post("/auth/register", {
    username,
    email,
    password,
  })

  // response.data = { code: 200, message: "success", data: userId }
  return response.data
}

// ──────────────────────────────────────────────
//  登出（调用后端撤消 refresh token + 清理本地）
// ──────────────────────────────────────────────
async function logout() {
  try {
    // api.js 拦截器会自动带上 Authorization: Bearer <accessToken>
    // 后端会撤消该用户的所有 refresh token
    await api.post("/auth/logout")
  } catch {
    // 即使接口失败（如网络断开），也清理本地登录状态
  } finally {
    clearAuth()
  }
}

// ──────────────────────────────────────────────
//  清理本地认证数据
// ──────────────────────────────────────────────
function clearAuth() {
  localStorage.removeItem(STORAGE_KEY_TOKEN)
  localStorage.removeItem(STORAGE_KEY_REFRESH)
  localStorage.removeItem(STORAGE_KEY_USER)
}

// ──────────────────────────────────────────────
//  工具函数
// ──────────────────────────────────────────────
function getCurrentUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_USER)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function isAuthenticated() {
  return !!localStorage.getItem(STORAGE_KEY_TOKEN)
}

export { login, register, logout, clearAuth, getCurrentUser, isAuthenticated }
