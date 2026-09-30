import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import tailwindcss from "@tailwindcss/vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  server: {
    // 监听所有网络接口，局域网内其他设备可通过 IP 访问
    host: true,
    // 默认端口 5173，可通过环境变量 VITE_DEV_PORT 覆盖
    port: Number(process.env.VITE_DEV_PORT) || 8088,
    // 端口被占用时自动尝试下一个
    strictPort: false,
    proxy: {
      "/api": {
        target: process.env.VITE_API_PROXY_TARGET || "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
})
