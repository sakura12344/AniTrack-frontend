import { create } from "zustand"

/**
 * 全局收藏状态管理
 *
 * 将「是否收藏动漫」提升为全局状态，避免在每个页面重复请求和分散管理。
 * 使用方法：
 *   const isFav = useCollectionStore((s) => s.isFavorited(id))
 *   const toggle = useCollectionStore((s) => s.toggleFavorite)
 */
const useCollectionStore = create((set, get) => ({
  /** 已收藏的动漫 ID 列表（统一存为字符串） */
  favoritedIds: [],

  /** 从 API 批量设置收藏列表 */
  setFavoritedIds: (ids) => set({ favoritedIds: ids.map(String) }),

  /** 追加单个收藏 ID（避免重复） */
  addFavorite: (id) =>
    set((state) => {
      const idStr = String(id)
      if (state.favoritedIds.includes(idStr)) return state
      return { favoritedIds: [...state.favoritedIds, idStr] }
    }),

  /** 移除单个收藏 ID */
  removeFavorite: (id) =>
    set((state) => {
      const idStr = String(id)
      return { favoritedIds: state.favoritedIds.filter((fid) => fid !== idStr) }
    }),

  /** 切换收藏状态 */
  toggleFavorite: (id) =>
    set((state) => {
      const idStr = String(id)
      if (state.favoritedIds.includes(idStr)) {
        return {
          favoritedIds: state.favoritedIds.filter((fid) => fid !== idStr),
        }
      }
      return { favoritedIds: [...state.favoritedIds, idStr] }
    }),

  /** 判断指定 ID 是否已收藏 */
  isFavorited: (id) => get().favoritedIds.includes(String(id)),

  /** 收藏总数 */
  favoritedCount: () => get().favoritedIds.length,
}))

export default useCollectionStore
