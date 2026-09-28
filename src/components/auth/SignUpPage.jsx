import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { paths } from '../../common/router/routePaths';
import { AuthSocialButtons, PasswordToggle } from './AuthControls';
import './SignUpPage.css';

const fields = [
  { key: 'name', label: 'Name', placeholder: '이름을 입력해주세요', type: 'text', autoComplete: 'name', required: true },
  { key: 'email', label: 'Email', placeholder: '이메일을 입력해주세요', type: 'email', autoComplete: 'email', required: true },
  { key: 'phone', label: 'Phone Number', placeholder: '전화번호를 입력해주세요', type: 'tel', autoComplete: 'tel' },
  { key: 'password', label: 'Password', placeholder: '비밀번호를 입력해주세요', type: 'password', autoComplete: 'new-password', required: true, minLength: 6 },
];

export default function SignUpPageView() {
  const navigate = useNavigate();
  const loginWithEmail = useAuthStore((state) => state.loginWithEmail);
  const updateProfile = useAuthStore((state) => state.updateProfile);
  const loginWithKakao = useAuthStore((state) => state.loginWithKakao);
  const authError = useAuthStore((state) => state.authError);
  const isAuthLoading = useAuthStore((state) => state.isAuthLoading);
  const [values, setValues] = useState({ name: '', email: '', phone: '', password: '' });
  const [agreed, setAgreed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function submit(event) {
    event.preventDefault();
    if (isAuthLoading) return;
    if (loginWithEmail(values.email, values.password)) {
      updateProfile({ name: values.name, phone: values.phone, termsAgreed: agreed });
      navigate(paths.mypage);
    }
  }

  return <main className="signup-page">
    <section className="signup-page__visual" aria-label="현대 모터스튜디오">
      <Link className="signup-page__logo" to={paths.home} aria-label="현대 모터스튜디오 홈"><img src="/images/login/logo.png" width="220" height="50" alt="HYUNDAI MOTORSTUDIO" /></Link>
      <div className="signup-page__brand">
        <p>A NEW WAY TO EXPERIENCE</p>
        <h2>START YOUR<br />EXPERIENCE<span>.</span></h2>
        <p className="signup-page__brand-description">현대 모터스튜디오 회원이 되어<br />다양한 전시와 프로그램을 더욱 편리하게 경험해보세요.</p>
      </div>
      <div className="signup-page__locations"><span>HYUNDAI MOTORSTUDIO</span><span>SEOUL · GOYANG · HANAM · BUSAN</span></div>
    </section>
    <section className="signup-page__panel" aria-labelledby="signup-heading">
      <Link className="signup-page__home" to={paths.home}>BACK TO HOME<img src="/images/login/home-arrow.svg" width="14" height="14" alt="" /></Link>
      <img className="signup-page__progress" src="/images/signup/progress.svg" width="780" height="16" alt="" aria-hidden="true" />
      <div className="signup-page__content">
        <p className="signup-page__eyebrow">MEMBERSHIP</p>
        <h1 id="signup-heading">Create Account</h1>
        <p className="signup-page__intro">현대 모터스튜디오 서비스를 이용하기 위한<br />회원 정보를 입력해주세요.</p>
        <form className="signup-page__form" onSubmit={submit} aria-busy={isAuthLoading}>
          {fields.map(({ key, label, type, ...inputProps }) => <div className="signup-page__field" key={key}>
            <label htmlFor={`signup-${key}`}>{label}</label>
            <div className={key === 'password' ? 'signup-page__password' : undefined}>
              <input {...inputProps} id={`signup-${key}`} name={key} type={key === 'password' && showPassword ? 'text' : type} value={values[key]} onChange={(event) => setValues((previous) => ({ ...previous, [key]: event.target.value }))} disabled={isAuthLoading} />
              {key === 'password' && <PasswordToggle className="signup-page__eye" visible={showPassword} controls="signup-password" onToggle={() => setShowPassword((previous) => !previous)} />}
            </div>
          </div>)}
          <label className="signup-page__terms"><input type="checkbox" checked={agreed} onChange={(event) => setAgreed(event.target.checked)} disabled={isAuthLoading} />이용약관 및 개인정보 처리방침에 동의합니다.</label>
          {authError && <p className="signup-page__error" role="alert">{authError}</p>}
          <button className="signup-page__submit" type="submit" disabled={isAuthLoading}>GET STARTED<img src="/images/login/login-arrow.svg" width="16" height="16" alt="" /></button>
        </form>
        <div className="signup-page__divider"><span>Or continue with</span></div>
        <AuthSocialButtons className="signup-page__social" loading={isAuthLoading} onKakao={loginWithKakao} />
        <p className="signup-page__login">이미 회원이신가요?<Link to={paths.login}>Log In<img src="/images/signup/login-arrow.svg" width="9" height="9" alt="" /></Link></p>
      </div>
    </section>
  </main>;
}
