import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const seed = [];
const demoInquiryIds = new Set(['inquiry-001', 'inquiry-002', 'inquiry-003']);

export const useInquiryStore = create(persist((set, get) => ({
  inquiries: seed,
  addInquiry: (item) => { const id = crypto.randomUUID(); set((state) => ({ inquiries: [{ ...item, id, status: 'PENDING', answer: null, createdAt: new Date().toISOString(), updatedAt: null }, ...state.inquiries] })); return id; },
  updateInquiry: (id, userId, updates) => set((state) => ({ inquiries: state.inquiries.map((item) => item.id === id && item.userId === userId && item.status !== 'ANSWERED' ? { ...item, ...updates, updatedAt: new Date().toISOString() } : item) })),
  deleteInquiry: (id, userId) => set((state) => ({ inquiries: state.inquiries.filter((item) => !(item.id === id && item.userId === userId && item.status === 'PENDING')) })),
  getInquiryById: (id) => get().inquiries.find((item) => item.id === id),
  getMyInquiries: (userId) => get().inquiries.filter((item) => item.userId === userId),
  canEditInquiry: (id, userId) => { const item = get().inquiries.find((row) => row.id === id); return Boolean(item && item.userId === userId && item.status !== 'ANSWERED'); },
  canDeleteInquiry: (id, userId) => { const item = get().inquiries.find((row) => row.id === id); return Boolean(item && item.userId === userId && item.status === 'PENDING'); },
}), {
  name: 'hms-inquiries',
  version: 1,
  migrate: (persistedState) => ({
    ...persistedState,
    inquiries: (persistedState?.inquiries ?? []).filter((item) => !demoInquiryIds.has(item.id)),
  }),
}));
