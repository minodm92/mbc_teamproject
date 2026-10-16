import { Fragment, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { isDemoEmailRegistered } from '../../common/auth/demoAccounts';
import { paths } from '../../common/router/routePaths';
import { AuthSocialButtons, PasswordToggle } from './AuthControls';
import { MoveLeft } from 'lucide-react';
import './AuthHomeLink.css';
import './SignUpPage.css';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const fields = [
  { key: 'name', label: 'Name', placeholder: '이름을 입력해주세요', type: 'text', autoComplete: 'name', required: true },
  { key: 'email', label: 'Email', placeholder: '이메일을 입력해주세요', type: 'email', autoComplete: 'email', required: true },
  { key: 'phone', label: 'Phone Number', placeholder: '전화번호를 입력해주세요', type: 'tel', autoComplete: 'tel' },
  { key: 'password', label: 'Password', placeholder: '비밀번호를 입력해주세요', type: 'password', autoComplete: 'new-password', required: true, minLength: 6 },
];

export default function SignUpPageView() {
  const navigate = useNavigate();
  const loginWithKakao = useAuthStore((state) => state.loginWithKakao);
  const authError = useAuthStore((state) => state.authError);
  const clearAuthError = useAuthStore((state) => state.clearAuthError);
  const registerDemoAccount = useAuthStore((state) => state.registerDemoAccount);
  const isAuthLoading = useAuthStore((state) => state.isAuthLoading);
  const [values, setValues] = useState({ name: '', email: '', phone: '', password: '' });
  const [agreed, setAgreed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState('');
  const errorMessage = formError || authError;
  const completedSteps = [values.name, values.email, values.phone, values.password]
    .findIndex((value) => !value.trim());
  const progressCount = completedSteps === -1 ? 4 : completedSteps;

  useEffect(() => { clearAuthError(); }, [clearAuthError]);

  function validate() {
    const missing = fields.find(({ key, required }) => required && !values[key].trim());
    if (missing) return `${missing.label}을(를) 입력해주세요.`;
    if (!EMAIL_PATTERN.test(values.email.trim())) return '올바른 이메일 형식을 입력해주세요.';
    if (values.password.length < 6) return '비밀번호는 6자 이상 입력해주세요.';
    if (!agreed) return '이용약관 및 개인정보 처리방침에 동의해주세요.';
    // registerDemoAccount는 같은 이메일을 덮어쓰므로 저장 전에 중복을 먼저 막는다.
    if (isDemoEmailRegistered(values.email)) return '이미 사용 중인 아이디입니다.';
    return '';
  }

  function submit(event) {
    event.preventDefault();
    if (isAuthLoading) return;
    clearAuthError();
    const error = validate();
    setFormError(error);
    if (error) return;
    const result = registerDemoAccount({ email: values.email, password: values.password });
    if (!result.success) { setFormError(result.error); return; }
    alert('회원가입이 완료되었습니다.');
    navigate(paths.login);
  }

  return <main className="signup-page">
    <section className="signup-page__visual" aria-label="현대 모터스튜디오">
      <Link className="signup-page__logo" to={paths.home} aria-label="현대 모터스튜디오 홈"><img src="/images/login/logo.png" width="220" height="50" alt="HYUNDAI MOTORSTUDIO" /></Link>
      <div className="signup-page__brand">
        <p>A NEW WAY TO EXPERIENCE</p>
        <h2>START YOUR<br />EXPERIENCE</h2>
        <p className="signup-page__brand-description">현대 모터스튜디오 회원이 되어<br />다양한 전시와 프로그램을 더욱 편리하게 경험해보세요.</p>
      </div>
      <div className="signup-page__locations"><span>HYUNDAI MOTORSTUDIO</span><span>SEOUL · GOYANG · HANAM · BUSAN</span></div>
    </section>
    <section className="signup-page__panel" aria-labelledby="signup-heading">
      <Link className="signup-page__home auth-home-link" to={paths.home} aria-label="홈으로 이동"><MoveLeft className="auth-home-link__mobile-icon" size={24} aria-hidden="true" /><span>BACK TO HOME</span><img src="/images/login/home-arrow.svg" width="14" height="14" alt="" /></Link>
      <div className="signup-page__progress" aria-hidden="true">
        {Array.from({ length: 4 }, (_, index) => <Fragment key={index}>
          <span className={`signup-page__progress-dot${index < progressCount ? ' is-complete' : ''}`} />
          {index < 3 && <span className={`signup-page__progress-line${index < progressCount - 1 ? ' is-complete' : ''}`} />}
        </Fragment>)}
      </div>
      <div className="signup-page__content">
        <p className="signup-page__eyebrow">MEMBERSHIP</p>
        <h1 id="signup-heading">CREATE ACCOUNT</h1>
        <p className="signup-page__intro">현대 모터스튜디오 서비스를 이용하기 위한<br />회원 정보를 입력해주세요.</p>
        <form className="signup-page__form" noValidate onSubmit={submit} aria-busy={isAuthLoading}>
          {fields.map(({ key, label, type, ...inputProps }) => <div className="signup-page__field" key={key}>
            <label htmlFor={`signup-${key}`}>{label}</label>
            <div className={key === 'password' ? 'signup-page__password' : undefined}>
              <input {...inputProps} id={`signup-${key}`} name={key} type={key === 'password' && showPassword ? 'text' : type} value={values[key]} onChange={(event) => setValues((previous) => ({ ...previous, [key]: event.target.value }))} disabled={isAuthLoading} />
              {key === 'password' && <PasswordToggle className="signup-page__eye" visible={showPassword} controls="signup-password" onToggle={() => setShowPassword((previous) => !previous)} />}
            </div>
          </div>)}
          <label className="signup-page__terms"><input type="checkbox" checked={agreed} onChange={(event) => setAgreed(event.target.checked)} disabled={isAuthLoading} />이용약관 및 개인정보 처리방침에 동의합니다.</label>
          {errorMessage && <p className="signup-page__error" role="alert">{errorMessage}</p>}
          <button className="signup-page__submit" type="submit" disabled={isAuthLoading}>GET STARTED<img src="/images/login/login-arrow.svg" width="16" height="16" alt="" /></button>
        </form>
        <div className="signup-page__divider"><span>Or continue with</span></div>
        <AuthSocialButtons className="signup-page__social" loading={isAuthLoading} onKakao={loginWithKakao} kakaoOnly />
        <p className="signup-page__login">이미 회원이신가요?<Link to={paths.login}>Log In<img src="/images/signup/login-arrow.svg" width="9" height="9" alt="" /></Link></p>
      </div>
    </section>
  </main>;
}
