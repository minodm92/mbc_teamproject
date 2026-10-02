import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { paths } from '../../common/router/routePaths';
import { consumeKakaoCallback } from '../../common/auth/kakaoLogin';

export default function KakaoCallbackPage() {
  const [result, setResult] = useState({ status: 'loading', message: '카카오 인증 응답을 확인하고 있습니다.' });
  const callbackHandled = useRef(false);

  useEffect(() => {
    if (callbackHandled.current) return;
    callbackHandled.current = true;
    const callbackResult = consumeKakaoCallback(window.location.search);
    window.history.replaceState(window.history.state, '', window.location.pathname);
    setResult(callbackResult);
  }, []);

  return <main className="form-page">
    <div className="form-page__wrap">
      <h1>카카오 로그인</h1>
      <p role={result.status === 'error' ? 'alert' : 'status'} aria-live="polite">{result.message}</p>
      <Link className="form-button" to={paths.login}>로그인으로 돌아가기</Link>
    </div>
  </main>;
}
