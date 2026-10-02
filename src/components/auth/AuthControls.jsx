export function AuthSocialButtons({ className, loading, onKakao, providers = ['google', 'kakao', 'naver'] }) {
  return <div className={className}>
    {providers.includes('google') && <button type="button" disabled aria-label="Google 로그인 (미지원)"><img src="/images/login/google.png" width="15" height="16" alt="" />Google</button>}
    {providers.includes('kakao') && <button type="button" disabled={loading} onClick={onKakao}><img src="/images/login/kakao.png" width="15" height="16" alt="" />Kakao</button>}
    {providers.includes('naver') && <button type="button" disabled aria-label="Naver 로그인 (미지원)"><img src="/images/login/naver.png" width="15" height="16" alt="" />Naver</button>}
  </div>;
}

export function PasswordToggle({ className, visible, onToggle, controls }) {
  return <button type="button" className={className} aria-label={visible ? '비밀번호 숨기기' : '비밀번호 보기'} aria-pressed={visible} aria-controls={controls} onClick={onToggle}><img src="/images/login/eye.png" width="22" height="22" alt="" /></button>;
}
