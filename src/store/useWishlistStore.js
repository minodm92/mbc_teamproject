import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useWishlistStore = create(persist((set) => ({
  likedByUser: {},
  toggleLiked: (userId, productId) => set((state) => {
    const current = state.likedByUser[userId] ?? [];
    return { likedByUser: { ...state.likedByUser, [userId]: current.includes(productId) ? current.filter((id) => id !== productId) : [...current, productId] } };
  }),
}), { name: 'hms-wishlist' }));
