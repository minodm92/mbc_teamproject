import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { paths } from '../../common/router/routePaths';
import { findDemoAccount } from '../../common/auth/demoAccounts';
import { beginKakaoLogin } from '../../common/auth/kakaoLogin';
import { PasswordToggle } from './AuthControls';
import './SignUpPage.css';

const fields = [
  { key: 'name', label: 'Name', placeholder: '이름을 입력해주세요', type: 'text', autoComplete: 'name', required: true },
  { key: 'email', label: 'Email', placeholder: '이메일을 입력해주세요', type: 'email', autoComplete: 'email', required: true },
  { key: 'phone', label: 'Phone Number', placeholder: '전화번호를 입력해주세요', type: 'tel', autoComplete: 'tel' },
  { key: 'password', label: 'Password', placeholder: '비밀번호를 입력해주세요', type: 'password', autoComplete: 'new-password', required: true, minLength: 6 },
];

export default function SignUpPageView() {
  const navigate = useNavigate();
  const registerDemoAccount = useAuthStore((state) => state.registerDemoAccount);
  const isAuthLoading = useAuthStore((state) => state.isAuthLoading);
  const [values, setValues] = useState({ name: '', email: '', phone: '', password: '' });
  const [agreed, setAgreed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [signupFeedback, setSignupFeedback] = useState('');
  const [kakaoFeedback, setKakaoFeedback] = useState('');
  const [isKakaoLoading, setIsKakaoLoading] = useState(false);
  const [registrationSucceeded, setRegistrationSucceeded] = useState(false);

  const hasStartedRequiredFields = ['name', 'email', 'password'].some((key) => values[key].trim());
  const hasValidRequiredFields = Boolean(
    values.name.trim()
    && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())
    && values.password.length >= 6
    && agreed
  );
  const progressStep = registrationSucceeded ? 4 : hasValidRequiredFields ? 3 : hasStartedRequiredFields ? 2 : 1;

  useEffect(() => {
    if (!registrationSucceeded) return undefined;
    const redirectTimer = window.setTimeout(() => navigate(paths.login), 1600);
    return () => window.clearTimeout(redirectTimer);
  }, [registrationSucceeded, navigate]);

  function submit(event) {
    event.preventDefault();
    if (isAuthLoading || registrationSucceeded) return;

    const name = values.name.trim();
    const email = values.email.trim();
    const emailInput = event.currentTarget.elements.email;
    setFieldErrors({});
    setSignupFeedback('');

    if (!name) {
      setFieldErrors({ name: '이름을 입력해 주세요.' });
      return;
    }
    if (!email) {
      setFieldErrors({ email: '이메일을 입력해 주세요.' });
      return;
    }
    if (emailInput.validity.typeMismatch) {
      setFieldErrors({ email: '올바른 이메일 주소를 입력해 주세요.' });
      return;
    }
    if (!values.password) {
      setFieldErrors({ password: '비밀번호를 입력해 주세요.' });
      return;
    }
    if (values.password.length < 6) {
      setFieldErrors({ password: '비밀번호는 6자 이상 입력해 주세요.' });
      return;
    }
    if (!agreed) {
      setFieldErrors({ terms: '필수 약관에 동의해 주세요.' });
      return;
    }

    const result = registerDemoAccount({ email, password: values.password });
    if (!result.success) {
      if (/이메일|아이디/.test(result.error)) setFieldErrors({ email: result.error });
      else setSignupFeedback(result.error);
      return;
    }

    const storedAccount = findDemoAccount(email, values.password);
    if (!storedAccount) {
      setSignupFeedback('계정 저장을 확인할 수 없습니다. 브라우저 저장 공간을 확인한 뒤 다시 시도해 주세요.');
      return;
    }

    setSignupFeedback('회원가입이 완료되었습니다. 로그인 화면으로 이동합니다.');
    setRegistrationSucceeded(true);
  }

  async function handleKakaoLogin() {
    if (isKakaoLoading || registrationSucceeded) return;
    setKakaoFeedback('');
    setIsKakaoLoading(true);
    try {
      await beginKakaoLogin();
    } catch (error) {
      setKakaoFeedback(error instanceof Error ? error.message : '카카오 인증을 시작하지 못했습니다.');
      setIsKakaoLoading(false);
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
      <svg className="signup-page__progress" viewBox="0 0 780 16" role="progressbar" aria-label="회원가입 진행 상태" aria-valuemin="1" aria-valuemax="4" aria-valuenow={progressStep} aria-valuetext={`4단계 중 ${progressStep}단계`}>
        <g aria-hidden="true">
          {[{ x1: 27, x2: 244 }, { x1: 281, x2: 498 }, { x1: 536, x2: 752 }].map(({ x1, x2 }, index) => <line key={`line-${x1}`} className={progressStep > index + 1 ? 'signup-page__progress-line signup-page__progress-line--active' : 'signup-page__progress-line'} x1={x1} y1="7.5" x2={x2} y2="7.5" />)}
          {[8, 262.5, 517.5, 772].map((cx, index) => <circle key={`point-${cx}`} className={progressStep >= index + 1 ? 'signup-page__progress-point signup-page__progress-point--active' : 'signup-page__progress-point'} cx={cx} cy="8" r={index === 0 || index === 3 ? 8 : 8.5} />)}
        </g>
      </svg>
      <div className="signup-page__content">
        <p className="signup-page__eyebrow">MEMBERSHIP</p>
        <h1 id="signup-heading">Create Account</h1>
        <p className="signup-page__intro">현대 모터스튜디오 서비스를 이용하기 위한<br />회원 정보를 입력해주세요.</p>
        <p className="signup-page__demo-note">데모 가입 안내 · 이름, 이메일, 비밀번호를 입력해 직접 계정을 만들어 주세요.<br />입력 예시: HMS USER · hmsuser01@example.com · 01012345678 · hms1234</p>
        <form className="signup-page__form" onSubmit={submit} aria-busy={isAuthLoading || registrationSucceeded} noValidate>
          {fields.map(({ key, label, type, ...inputProps }) => <div className="signup-page__field" key={key}>
            <label htmlFor={`signup-${key}`}>{label}</label>
            <div className={key === 'password' ? 'signup-page__password' : undefined}>
              <input {...inputProps} id={`signup-${key}`} name={key} type={key === 'password' && showPassword ? 'text' : type} value={values[key]} onChange={(event) => { setValues((previous) => ({ ...previous, [key]: event.target.value })); setFieldErrors((previous) => ({ ...previous, [key]: '' })); setSignupFeedback(''); }} disabled={isAuthLoading || registrationSucceeded} />
              {key === 'password' && <PasswordToggle className="signup-page__eye" visible={showPassword} controls="signup-password" onToggle={() => setShowPassword((previous) => !previous)} />}
            </div>
            {fieldErrors[key] && <p className="signup-page__field-error" role="alert">{fieldErrors[key]}</p>}
          </div>)}
          <div className="signup-page__terms-wrap">
            <label className="signup-page__terms"><input type="checkbox" checked={agreed} onChange={(event) => { setAgreed(event.target.checked); setFieldErrors((previous) => ({ ...previous, terms: '' })); }} disabled={isAuthLoading || registrationSucceeded} />이용약관 및 개인정보 처리방침에 동의합니다.</label>
            {fieldErrors.terms && <p className="signup-page__field-error" role="alert">{fieldErrors.terms}</p>}
          </div>
          <button className="signup-page__submit" type="submit" disabled={isAuthLoading || registrationSucceeded}>GET STARTED<img src="/images/login/login-arrow.svg" width="16" height="16" alt="" /></button>
          <p className={`signup-page__feedback${registrationSucceeded ? ' signup-page__feedback--success' : ''}`} role={registrationSucceeded ? 'status' : 'alert'} aria-live="polite">{signupFeedback}</p>
        </form>
        <div className="signup-page__divider"><span>Or continue with</span></div>
        <div className="signup-page__social">
          <button type="button" onClick={handleKakaoLogin} disabled={isKakaoLoading || registrationSucceeded} aria-busy={isKakaoLoading}>
            <img src="/images/login/kakao.png" width="15" height="16" alt="" />Kakao
          </button>
          {kakaoFeedback && <p className="signup-page__kakao-feedback" role="alert" aria-live="polite">{kakaoFeedback}</p>}
        </div>
        <p className="signup-page__login">이미 회원이신가요?<Link to={paths.login}>Log In<img src="/images/signup/login-arrow.svg" width="9" height="9" alt="" /></Link></p>
      </div>
    </section>
  </main>;
}
