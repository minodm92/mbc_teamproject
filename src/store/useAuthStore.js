import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const TEST_ACCOUNT = {
  email: 'test@hyundaimotorstudio.com',
  password: 'test1234',
};

export const TEST_USER = {
  id: 'test-user-001', name: '테스트 사용자', email: TEST_ACCOUNT.email,
  profileImage: '/images/characters/character-01.svg', profileImageType: 'avatar',
  selectedAvatarId: 'character-01', loginProvider: 'test', grade: 'MEMBER', interests: ['WOMAN', 'NEW'],
  address: { zonecode: '04524', roadAddress: '서울특별시 중구 세종대로 110', jibunAddress: '', detailAddress: '', extraAddress: '' },
};

export const useAuthStore = create(persist((set) => ({
  user: null, isAuthenticated: false, authProvider: null, isAuthLoading: false, authError: null,
  loginAsTestUser: () => set({ user: TEST_USER, isAuthenticated: true, authProvider: 'test', authError: null }),
  loginWithEmail: (email, password) => {
    if (!email || !password) { set({ authError: '이메일과 비밀번호를 입력해 주세요.' }); return false; }
    const isTestAccount = email.trim().toLowerCase() === TEST_ACCOUNT.email && password === TEST_ACCOUNT.password;
    set({ user: isTestAccount ? TEST_USER : { ...TEST_USER, email, name: email.split('@')[0], loginProvider: 'email' }, isAuthenticated: true, authProvider: isTestAccount ? 'test' : 'email', authError: null });
    return true;
  },
  loginWithKakao: () => set({ authError: '카카오 로그인을 이용하려면 서버 설정이 필요합니다. 테스트 로그인을 이용해 주세요.' }),
  handleKakaoCallback: () => set({ authError: '카카오 인증 서버가 연결되지 않았습니다.' }),
  updateProfile: (updates) => set((state) => ({ user: { ...state.user, ...updates } })),
  logout: () => set({ user: null, isAuthenticated: false, authProvider: null }),
  clearAuthError: () => set({ authError: null }),
}), { name: 'hms-auth', partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated, authProvider: state.authProvider }) }));
