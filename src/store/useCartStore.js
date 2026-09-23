import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(persist((set) => ({
  itemsByUser: {},
  addItem: (userId, productId) => set((state) => ({ itemsByUser: { ...state.itemsByUser, [userId]: [...(state.itemsByUser[userId] ?? []), productId] } })),
  removeItem: (userId, index) => set((state) => ({ itemsByUser: { ...state.itemsByUser, [userId]: (state.itemsByUser[userId] ?? []).filter((_, itemIndex) => itemIndex !== index) } })),
}), { name: 'hms-cart' }));
