import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { paths } from '../../common/router/routePaths';
import SignUpPageView from './SignUpPage';
import { AuthSocialButtons, PasswordToggle } from './AuthControls';
import './AuthPages.css';
import './LoginPage.css';

export function ProtectedRoute({ children }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const location = useLocation();
  return isAuthenticated && user ? children : <Navigate to={paths.login} state={{ from: location.pathname }} replace />;
}

export function LoginPage() {
  const navigate = useNavigate(); const location = useLocation();
  const [email, setEmail] = useState(''); const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); const [rememberLogin, setRememberLogin] = useState(false);
  const loginWithEmail = useAuthStore((state) => state.loginWithEmail);
  const loginAsTestUser = useAuthStore((state) => state.loginAsTestUser);
  const loginWithKakao = useAuthStore((state) => state.loginWithKakao);
  const authError = useAuthStore((state) => state.authError);
  const isAuthLoading = useAuthStore((state) => state.isAuthLoading);
  const setPersistence = useAuthStore((state) => state.setRememberLogin);
  const destination = location.state?.from || paths.mypage;
  return <main className="login-page">
    <section className="login-page__visual" aria-label="현대 모터스튜디오">
      <img className="login-page__vehicle" src="/images/login/avante.png" alt="도심을 달리는 현대 AVANTE" />
      <div className="login-page__shade" />
      <Link className="login-page__logo" to={paths.home} aria-label="현대 모터스튜디오 홈"><img src="/images/login/logo.png" width="220" height="50" alt="HYUNDAI MOTORSTUDIO" /></Link>
      <div className="login-page__brand">
        <p>A NEW WAY TO EXPERIENCE</p>
        <h2>EXPERIENCE<br />BEYOND MOBILITY<span>.</span></h2>
        <p className="login-page__brand-description">현대 모터스튜디오의 다양한 전시와 프로그램을<br />로그인 후 더 편리하게 이용해보세요.</p>
      </div>
      <div className="login-page__locations"><span>HYUNDAI MOTORSTUDIO</span><span>SEOUL · GOYANG · HANAM · BUSAN</span></div>
    </section>
    <section className="login-page__panel" aria-labelledby="login-heading">
      <Link className="login-page__home" to={paths.home}>BACK TO HOME<img src="/images/login/home-arrow.svg" width="14" height="14" alt="" /></Link>
      <div className="login-page__content">
        <p className="login-page__eyebrow">MEMBER LOGIN</p>
        <h1 id="login-heading">WELCOME BACK.</h1>
        <p className="login-page__intro">현대 모터스튜디오 서비스를 계속 이용하려면 로그인해주세요.</p>
        <form className="login-page__form" aria-busy={isAuthLoading} onSubmit={(event) => {
          event.preventDefault();
          if (isAuthLoading) return;
          setPersistence(rememberLogin);
          if (loginWithEmail(email, password)) navigate(destination);
        }}>
          <label className="login-page__label" htmlFor="login-email">EMAIL</label>
          <input id="login-email" name="email" type="email" placeholder="이메일을 입력해주세요" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="email" disabled={isAuthLoading} />
          <div className="login-page__password-field">
            <label className="login-page__label" htmlFor="login-password">PASSWORD</label>
            <div className="login-page__password">
              <input id="login-password" name="password" type={showPassword ? 'text' : 'password'} placeholder="비밀번호를 입력해주세요" value={password} onChange={(event) => setPassword(event.target.value)} required autoComplete="current-password" disabled={isAuthLoading} />
              <PasswordToggle className="login-page__eye" visible={showPassword} controls="login-password" onToggle={() => setShowPassword((value) => !value)} />
            </div>
          </div>
          <div className="login-page__options">
            <label><input type="checkbox" checked={rememberLogin} onChange={(event) => setRememberLogin(event.target.checked)} disabled={isAuthLoading} />자동 로그인</label>
            <span>비밀번호 찾기</span>
          </div>
          {authError && <p role="alert" className="login-page__error">{authError}</p>}
          <button className="login-page__submit" type="submit" disabled={isAuthLoading}>LOGIN<span aria-hidden="true"><img src="/images/login/login-arrow.svg" width="16" height="16" alt="" /></span></button>
        </form>
        <div className="login-page__divider"><span>OR CONTINUE WITH</span></div>
        <AuthSocialButtons className="login-page__social" loading={isAuthLoading} onKakao={loginWithKakao} />
        <p className="login-page__signup">아직 회원이 아니신가요?<Link to={paths.signup}>SIGN UP<img src="/images/login/signup-arrow.svg" width="13" height="13" alt="" /></Link></p>
        <button className="login-page__demo" type="button" disabled={isAuthLoading} onClick={() => { setPersistence(rememberLogin); loginAsTestUser(); navigate(destination); }}>테스트 계정으로 로그인</button>
      </div>
      <div className="login-page__meta"><span>© HYUNDAI MOTOR COMPANY.</span><a href="tel:18996611">고객센터 1899-6611</a></div>
    </section>
  </main>;
}

export function SignUpPage() { return <SignUpPageView />; }

export function KakaoCallbackPage() { return <main className="form-page"><div className="form-page__wrap"><h1>카카오 로그인</h1><p>카카오 인증 서버가 연결되지 않았습니다. 테스트 계정을 이용해 주세요.</p><Link className="form-button" to={paths.login}>로그인으로 돌아가기</Link></div></main>; }
