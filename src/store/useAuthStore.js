import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

// Preserve existing local sessions; unchecked logins are scoped to this tab.
const authStorage = createJSONStorage(() => ({
  getItem: (name) => sessionStorage.getItem(name) ?? localStorage.getItem(name),
  setItem: (name, value) => {
    const remember = JSON.parse(value).state.rememberLogin !== false;
    const storage = remember ? localStorage : sessionStorage;
    const otherStorage = remember ? sessionStorage : localStorage;
    storage.setItem(name, value);
    otherStorage.removeItem(name);
  },
  removeItem: (name) => { localStorage.removeItem(name); sessionStorage.removeItem(name); },
}));

export const TEST_ACCOUNT = {
  id: 'test',
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
  rememberLogin: true,
  setRememberLogin: (rememberLogin) => set({ rememberLogin }),
  loginWithTestCredentials: (id, password) => {
    const normalizedId = typeof id === 'string' ? id.trim().toLowerCase() : '';
    if (!normalizedId || !password) {
      set({ authError: '아이디와 비밀번호를 입력해 주세요.' });
      return false;
    }
    if (normalizedId !== TEST_ACCOUNT.id || password !== TEST_ACCOUNT.password) {
      set({ authError: '아이디 또는 비밀번호를 확인해 주세요.' });
      return false;
    }
    set({ user: TEST_USER, isAuthenticated: true, authProvider: 'test', authError: null });
    return true;
  },
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
}), { name: 'hms-auth', storage: authStorage, partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated, authProvider: state.authProvider, rememberLogin: state.rememberLogin }) }));
