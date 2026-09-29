const KAKAO_SDK_URL = 'https://t1.kakaocdn.net/kakao_js_sdk/2.8.3/kakao.min.js';
const KAKAO_STATE_KEY = 'hms-kakao-oauth-state';

let sdkPromise;

function loadKakaoSdk() {
  if (window.Kakao) return Promise.resolve(window.Kakao);
  if (sdkPromise) return sdkPromise;

  sdkPromise = new Promise((resolve, reject) => {
    const existingScript = document.querySelector('script[data-hms-kakao-sdk]');
    const script = existingScript ?? document.createElement('script');
    const handleLoad = () => {
      script.dataset.loaded = 'true';
      if (window.Kakao) resolve(window.Kakao);
      else reject(new Error('Kakao SDK를 초기화하지 못했습니다.'));
    };
    const handleError = () => {
      script.remove();
      sdkPromise = undefined;
      reject(new Error('Kakao SDK를 불러오지 못했습니다. 네트워크를 확인한 뒤 다시 시도해 주세요.'));
    };

    script.addEventListener('load', handleLoad, { once: true });
    script.addEventListener('error', handleError, { once: true });
    if (!existingScript) {
      script.src = KAKAO_SDK_URL;
      script.async = true;
      script.dataset.hmsKakaoSdk = 'true';
      document.head.appendChild(script);
    }
  });

  return sdkPromise;
}

function createOAuthState() {
  if (!window.crypto?.getRandomValues) {
    throw new Error('안전한 인증 요청을 시작할 수 없습니다. 브라우저 환경을 확인해 주세요.');
  }

  const bytes = new Uint8Array(32);
  window.crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

function getRedirectUri() {
  const configuredUri = import.meta.env.VITE_KAKAO_REDIRECT_URI?.trim();
  const redirectUri = configuredUri || new URL('/auth/kakao/callback', window.location.origin).href;
  let parsedUri;

  try {
    parsedUri = new URL(redirectUri);
  } catch {
    throw new Error('Kakao redirect URI 설정을 확인해 주세요.');
  }

  if (!['http:', 'https:'].includes(parsedUri.protocol) || parsedUri.search || parsedUri.hash) {
    throw new Error('Kakao redirect URI 설정을 확인해 주세요.');
  }

  return parsedUri.href;
}

export async function beginKakaoLogin() {
  const javascriptKey = import.meta.env.VITE_KAKAO_JAVASCRIPT_KEY?.trim();
  if (!javascriptKey) {
    throw new Error('카카오 로그인을 사용하려면 Kakao Developers 설정이 필요합니다.');
  }

  const redirectUri = getRedirectUri();
  let state;
  try {
    state = createOAuthState();
    window.sessionStorage.setItem(KAKAO_STATE_KEY, state);
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : '인증 요청을 준비하지 못했습니다.');
  }

  try {
    const Kakao = await loadKakaoSdk();
    if (typeof Kakao.isInitialized !== 'function' || typeof Kakao.Auth?.authorize !== 'function') {
      throw new Error('Kakao SDK 로그인 기능을 사용할 수 없습니다.');
    }
    if (!Kakao.isInitialized()) Kakao.init(javascriptKey);

    Kakao.Auth.authorize({ redirectUri, state });
  } catch (error) {
    try {
      window.sessionStorage.removeItem(KAKAO_STATE_KEY);
    } catch {
      // A failed storage cleanup must not hide the original SDK error.
    }
    if (error instanceof Error) throw error;
    throw new Error('카카오 인증 요청을 시작하지 못했습니다.');
  }
}

export function consumeKakaoCallback(search) {
  const params = new URLSearchParams(search);
  const code = params.get('code');
  const error = params.get('error');
  const errorDescription = params.get('error_description');
  const returnedState = params.get('state');
  let savedState = null;

  try {
    savedState = window.sessionStorage.getItem(KAKAO_STATE_KEY);
    window.sessionStorage.removeItem(KAKAO_STATE_KEY);
  } catch {
    return { status: 'error', message: '브라우저에서 인증 상태를 확인할 수 없습니다. 다시 시도해 주세요.' };
  }

  if (!savedState || !returnedState || savedState !== returnedState) {
    return { status: 'error', message: '인증 요청을 확인할 수 없습니다. 카카오 로그인을 다시 시작해 주세요.' };
  }

  if (error) {
    const detail = errorDescription?.slice(0, 240);
    return {
      status: 'error',
      message: error === 'access_denied'
        ? '카카오 로그인을 취소했습니다.'
        : `카카오 인증을 완료하지 못했습니다.${detail ? ` ${detail}` : ''}`,
    };
  }

  if (!code) {
    return { status: 'error', message: '카카오 인증 응답에 인가 코드가 없습니다. 다시 시도해 주세요.' };
  }

  return {
    status: 'authorized',
    message: '카카오 동의가 완료됐습니다. 서비스 계정 확인과 로그인을 마치려면 토큰 교환 서버 연동이 필요합니다.',
  };
}
