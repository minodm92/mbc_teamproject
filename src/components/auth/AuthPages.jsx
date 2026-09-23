import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { TEST_ACCOUNT, useAuthStore } from '../../store/useAuthStore';
import { paths } from '../../common/router/routePaths';
import './AuthPages.css';

export function ProtectedRoute({ children }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const location = useLocation();
  return isAuthenticated && user ? children : <Navigate to={paths.login} state={{ from: location.pathname }} replace />;
}

export function LoginPage() {
  const navigate = useNavigate(); const location = useLocation();
  const [email, setEmail] = useState(TEST_ACCOUNT.email); const [password, setPassword] = useState(TEST_ACCOUNT.password);
  const loginWithEmail = useAuthStore((state) => state.loginWithEmail);
  const loginAsTestUser = useAuthStore((state) => state.loginAsTestUser);
  const loginWithKakao = useAuthStore((state) => state.loginWithKakao);
  const authError = useAuthStore((state) => state.authError);
  const destination = location.state?.from || paths.mypage;
  return <main className="form-page"><div className="form-page__wrap"><span className="form-page__eyebrow">MEMBER LOGIN</span><h1>로그인</h1><p>현대 모터스튜디오의 경험을 이어가세요.</p><div className="form-test-account"><strong>테스트 계정</strong><span>이메일: {TEST_ACCOUNT.email}</span><span>비밀번호: {TEST_ACCOUNT.password}</span></div><form className="form-card" onSubmit={(event) => { event.preventDefault(); if (loginWithEmail(email, password)) navigate(destination); }}><label>이메일<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="email" /></label><label>비밀번호<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required autoComplete="current-password" /></label>{authError && <p role="alert" className="form-error">{authError}</p>}<button className="form-button" type="submit">로그인</button></form><div className="form-divider">또는</div><button className="form-button form-button--outline" type="button" onClick={loginWithKakao}>카카오로 시작하기</button><button className="form-button form-button--secondary" type="button" onClick={() => { loginAsTestUser(); navigate(destination); }}>테스트 계정으로 로그인</button><p className="form-page__hint">포트폴리오 기능을 바로 확인할 수 있는 테스트 계정입니다.</p><p className="form-page__foot">아직 계정이 없으신가요? <Link to={paths.signup}>회원가입</Link></p></div></main>;
}

export function SignUpPage() {
  const navigate = useNavigate(); const loginWithEmail = useAuthStore((state) => state.loginWithEmail);
  const [values, setValues] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  return <main className="form-page"><div className="form-page__wrap"><span className="form-page__eyebrow">JOIN US</span><h1>회원가입</h1><p>새로운 경험을 시작하세요.</p><form className="form-card" onSubmit={(event) => { event.preventDefault(); if (values.password !== values.confirm) { setError('비밀번호가 일치하지 않습니다.'); return; } loginWithEmail(values.email, values.password); navigate(paths.mypage); }}>{[['name', '이름', 'text'], ['email', '이메일', 'email'], ['password', '비밀번호', 'password'], ['confirm', '비밀번호 확인', 'password']].map(([key, label, type]) => <label key={key}>{label}<input type={type} value={values[key]} onChange={(event) => setValues({ ...values, [key]: event.target.value })} required minLength={key === 'password' ? 6 : undefined} /></label>)}{error && <p className="form-error" role="alert">{error}</p>}<button className="form-button" type="submit">가입하기</button></form><p className="form-page__foot">이미 계정이 있으신가요? <Link to={paths.login}>로그인</Link></p></div></main>;
}

export function KakaoCallbackPage() { return <main className="form-page"><div className="form-page__wrap"><h1>카카오 로그인</h1><p>카카오 인증 서버가 연결되지 않았습니다. 테스트 계정을 이용해 주세요.</p><Link className="form-button" to={paths.login}>로그인으로 돌아가기</Link></div></main>; }
