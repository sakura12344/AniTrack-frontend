import { Routes, Route } from "react-router-dom"

import Landing from "../pages/landing/landing.jsx"
import Login from "../pages/login/login.jsx"
import Register from "../pages/register/register.jsx"

import AppLayout from "../layouts/AppLayout.jsx"
import Library from "../pages/library/library.jsx"
import ErrorBoundary from "../components/ErrorBoundary.jsx"
import Watch from "../pages/watch/watch.jsx"
import Favorites from "../pages/favorites/favorites.jsx"
import History from "../pages/history/history.jsx"
import Stats from "../pages/stats/stats.jsx"
import Recommend from "../pages/recommend/recommend.jsx"
import Notifications from "../pages/notifications/notifications.jsx"
import CommentAnalysis from "../pages/comment-analysis/comment-analysis.jsx"
import RelationGraph from "../pages/relation-graph/relation-graph.jsx"
import AnimeDetail from "../pages/AnimeDetailPage/index.jsx"

function AppRouter() {
  return (
    <Routes>
      {/* 公共页面 */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* 登录后的应用区域 */}
      <Route path="/app" element={<AppLayout />}>
        <Route
          path="library"
          element={
            <ErrorBoundary>
              <Library />
            </ErrorBoundary>
          }
        />
        <Route path="watch" element={<Watch />} />
        <Route path="favorites" element={<Favorites />} />
        <Route path="history" element={<History />} />
        <Route path="stats" element={<Stats />} />
        <Route path="recommend" element={<Recommend />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="comment-analysis" element={<CommentAnalysis />} />
        <Route path="relation-graph" element={<RelationGraph />} />
        <Route path="anime/:id" element={<AnimeDetail />} />
      </Route>
    </Routes>
  )
}

export default AppRouter
