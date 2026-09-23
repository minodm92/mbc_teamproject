import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useReservationStore = create(persist((set) => ({
  reservations: [],
  addReservation: (reservation) => set((state) => ({ reservations: [{ ...reservation, id: crypto.randomUUID(), status: '예약 완료', createdAt: new Date().toISOString() }, ...state.reservations] })),
  cancelReservation: (id, userId) => set((state) => ({ reservations: state.reservations.map((item) => item.id === id && item.userId === userId ? { ...item, status: '취소 완료' } : item) })),
}), { name: 'hms-reservations' }));
