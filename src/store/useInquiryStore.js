import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const seed = [
  { id: 'inquiry-001', userId: 'test-user-001', category: 'DELIVERY', title: '이용 안내를 확인하고 싶습니다.', content: '방문 예약과 이용 방법을 알려주세요.', status: 'PENDING', answer: null, createdAt: '2026-09-17T10:00:00.000Z', updatedAt: null },
  { id: 'inquiry-002', userId: 'test-user-001', category: 'ETC', title: '프로그램 일정 문의', content: '주말 프로그램 진행 시간을 확인하고 싶습니다.', status: 'IN_REVIEW', answer: null, createdAt: '2026-09-16T10:00:00.000Z', updatedAt: null },
  { id: 'inquiry-003', userId: 'test-user-001', category: 'ACCOUNT', title: '멤버십 가입 문의', content: '멤버십 가입 방법을 확인하고 싶습니다.', status: 'ANSWERED', answer: '멤버십 페이지에서 가입할 수 있습니다.', createdAt: '2026-09-15T10:00:00.000Z', updatedAt: null },
];

export const useInquiryStore = create(persist((set, get) => ({
  inquiries: seed,
  addInquiry: (item) => { const id = crypto.randomUUID(); set((state) => ({ inquiries: [{ ...item, id, status: 'PENDING', answer: null, createdAt: new Date().toISOString(), updatedAt: null }, ...state.inquiries] })); return id; },
  updateInquiry: (id, userId, updates) => set((state) => ({ inquiries: state.inquiries.map((item) => item.id === id && item.userId === userId && item.status !== 'ANSWERED' ? { ...item, ...updates, updatedAt: new Date().toISOString() } : item) })),
  deleteInquiry: (id, userId) => set((state) => ({ inquiries: state.inquiries.filter((item) => !(item.id === id && item.userId === userId && item.status === 'PENDING')) })),
  getInquiryById: (id) => get().inquiries.find((item) => item.id === id),
  getMyInquiries: (userId) => get().inquiries.filter((item) => item.userId === userId),
  canEditInquiry: (id, userId) => { const item = get().inquiries.find((row) => row.id === id); return Boolean(item && item.userId === userId && item.status !== 'ANSWERED'); },
  canDeleteInquiry: (id, userId) => { const item = get().inquiries.find((row) => row.id === id); return Boolean(item && item.userId === userId && item.status === 'PENDING'); },
}), { name: 'hms-inquiries' }));
