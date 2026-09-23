import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useRecentlyViewedStore = create(persist((set) => ({
  recentlyViewedByUser: {},
  addRecentlyViewed: (userId, productId) => set((state) => ({ recentlyViewedByUser: { ...state.recentlyViewedByUser, [userId]: [{ productId, viewedAt: new Date().toISOString() }, ...(state.recentlyViewedByUser[userId] ?? []).filter((item) => item.productId !== productId)].slice(0, 10) } })),
  removeRecentlyViewed: (userId, productId) => set((state) => ({ recentlyViewedByUser: { ...state.recentlyViewedByUser, [userId]: (state.recentlyViewedByUser[userId] ?? []).filter((item) => item.productId !== productId) } })),
  clearRecentlyViewed: (userId) => set((state) => ({ recentlyViewedByUser: { ...state.recentlyViewedByUser, [userId]: [] } })),
}), { name: 'hms-recently-viewed' }));
