import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const seed = [
  { id: 'post-001', category: 'NOTICE', title: '현대 모터스튜디오에 오신 것을 환영합니다', content: '새로운 공간과 경험을 만나보세요.', authorId: 'admin', authorName: '관리자', createdAt: '2026-09-18T10:00:00.000Z', likes: [] },
  { id: 'post-002', category: 'REVIEW', title: '현대 모터스튜디오 방문 후기', content: '다양한 모빌리티 경험을 가까이에서 만나볼 수 있었습니다.', authorId: 'test-user-001', authorName: '테스트 사용자', createdAt: '2026-09-17T10:00:00.000Z', likes: [] },
];

export const useBoardStore = create(persist((set) => ({
  posts: seed,
  addPost: (post) => { const id = crypto.randomUUID(); set((state) => ({ posts: [{ ...post, id, createdAt: new Date().toISOString(), likes: [] }, ...state.posts] })); return id; },
  updatePost: (id, userId, updates) => set((state) => ({ posts: state.posts.map((post) => post.id === id && post.authorId === userId ? { ...post, ...updates } : post) })),
  deletePost: (id, userId) => set((state) => ({ posts: state.posts.filter((post) => !(post.id === id && post.authorId === userId)) })),
  toggleLike: (id, userId) => set((state) => ({ posts: state.posts.map((post) => post.id === id ? { ...post, likes: post.likes.includes(userId) ? post.likes.filter((value) => value !== userId) : [...post.likes, userId] } : post) })),
}), { name: 'hms-board' }));
