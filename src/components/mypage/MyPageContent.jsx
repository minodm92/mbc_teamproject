import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CalendarDays, ChevronRight, CircleDollarSign, FileText, LogOut } from 'lucide-react';
import { profileAvatars } from '../../common/data/content';
import { paths } from '../../common/router/routePaths';
import { useAuthStore } from '../../store/useAuthStore';
import { useInquiryStore } from '../../store/useInquiryStore';
import { useReservationStore } from '../../store/useReservationStore';
import PageShell from '../../common/layout/PageShell';
import { compressProfileImage } from '../../common/utils/imageUpload';
import { openKakaoPostcode } from '../../common/api/kakaoPostcode';
import './MyPageContent.css';

export function MyPage() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const [period, setPeriod] = useState('1개월');
  const allInquiries = useInquiryStore((state) => state.inquiries ?? []);
  const allReservations = useReservationStore((state) => state.reservations ?? []);
  const inquiries = allInquiries.filter((item) => item.userId === user?.id);
  const reservations = allReservations.filter((item) => item.userId === user?.id);

  return (
    <main className="mypage-dashboard">
      <div className="mypage-dashboard__breadcrumb"><Link to={paths.home}>HOME</Link><span>/</span><strong>마이페이지</strong></div>
      <div className="mypage-dashboard__layout">
        <aside className="mypage-sidebar">
          <h1>마이페이지</h1>
          <nav aria-label="마이페이지 메뉴">
            <section><h2>나의 예약</h2><Link to={paths.myReservations}>예약 내역<ChevronRight /></Link><Link to={paths.reservations}>새로운 예약<ChevronRight /></Link></section>
            <section><h2>나의 활동</h2><Link to={paths.inquiries}>고객문의 내역<ChevronRight /></Link><Link to={paths.inquiryWrite}>문의 작성<ChevronRight /></Link></section>
            <section><h2>개인정보 관리</h2><Link to={paths.profile}>프로필 수정<ChevronRight /></Link><button type="button" onClick={() => { logout(); navigate(paths.home); }}>로그아웃<LogOut /></button></section>
          </nav>
        </aside>

        <div className="mypage-dashboard__content">
          <header className="mypage-dashboard__heading">
            <div><span>MY HYUNDAI MOTORSTUDIO</span><h2>{user?.name || '테스트 사용자'}님의 마이페이지</h2></div>
            <p>{user?.email}</p>
          </header>

          <section className="mypage-points" aria-label="포인트 현황">
            <div><span>사용 가능 포인트</span><strong><CircleDollarSign />0P</strong></div>
            <div><span>소멸 예정 포인트 (30일)</span><strong><CircleDollarSign />0P</strong></div>
          </section>

          <section className="mypage-history">
            <div className="mypage-history__title"><h2>예약 및 활동 현황</h2><Link to={paths.myReservations}>전체 예약 보기<ChevronRight /></Link></div>
            <div className="mypage-filter">
              <div>{['1개월', '3개월', '6개월', '1년'].map((item) => <button className={period === item ? 'is-active' : ''} type="button" onClick={() => setPeriod(item)} key={item}>{item}</button>)}</div>
              <label><span>시작일</span><input type="date" defaultValue="2026-08-22" /></label>
              <label><span>종료일</span><input type="date" defaultValue="2026-09-22" /></label>
              <button type="button">조회</button>
            </div>

            {reservations.length ? (
              <div className="mypage-reservations">{reservations.map((item) => <article key={item.id}><CalendarDays /><div><span>{item.status}</span><h3>{item.programName || item.targetName || '현대 모터스튜디오 예약'}</h3><p>{item.date} {item.time} · {item.guests}명</p></div><Link to={paths.myReservations}>상세 보기<ChevronRight /></Link></article>)}</div>
            ) : (
              <div className="mypage-empty"><FileText /><strong>예약 및 이용 내역이 없습니다.</strong><p>현대 모터스튜디오의 새로운 경험을 예약해 보세요.</p><Link to={paths.reservations}>예약하러 가기</Link></div>
            )}
          </section>

          <section className="mypage-quick-links">
            <Link to={paths.myReservations}><CalendarDays /><span>나의 예약<strong>{reservations.length}건</strong></span><ChevronRight /></Link>
            <Link to={paths.inquiries}><FileText /><span>고객문의<strong>{inquiries.length}건</strong></span><ChevronRight /></Link>
          </section>
        </div>
      </div>
    </main>
  );
}

export function ProfileEditPage() {
  const user = useAuthStore((state) => state.user); const updateProfile = useAuthStore((state) => state.updateProfile); const navigate = useNavigate();
  const [values, setValues] = useState({ name: user.name, email: user.email, profileImage: user.profileImage, profileImageType: user.profileImageType || 'avatar', selectedAvatarId: user.selectedAvatarId || 'character-01', address: user.address || {}, marketingConsent: Boolean(user.marketingConsent) });
  const [error, setError] = useState('');
  async function pickFile(event) { const file = event.target.files?.[0]; event.target.value = ''; if (!file) return; try { const dataUrl = await compressProfileImage(file); setValues((current) => ({ ...current, profileImage: dataUrl, profileImageType: 'upload', selectedAvatarId: null })); setError(''); } catch (cause) { setError(cause.message); } }
  async function searchAddress() { try { await openKakaoPostcode((result) => { setValues((current) => ({ ...current, address: { ...current.address, zonecode: result.zonecode, roadAddress: result.roadAddress, jibunAddress: result.jibunAddress, extraAddress: result.bname } })); setError(''); }); } catch (cause) { setError(cause.message); } }
  return <PageShell eyebrow="PROFILE" title="프로필 수정"><form className="profile-form" onSubmit={(event) => { event.preventDefault(); updateProfile(values); navigate(paths.mypage); }}><div className="profile-form__image"><img src={values.profileImage} alt="현재 프로필 미리보기" width="130" height="130" /><label className="profile-form__upload">사진 선택<input type="file" accept="image/jpeg,image/png,image/webp" onChange={pickFile} /></label><button type="button" onClick={() => setValues({ ...values, profileImage: profileAvatars[0].src, profileImageType: 'avatar', selectedAvatarId: profileAvatars[0].id })}>사진 삭제</button></div>{error && <p className="form-error" role="alert">{error}</p>}<h2>기본 캐릭터 선택</h2><div className="profile-form__avatars">{profileAvatars.map((avatar) => <button type="button" key={avatar.id} aria-pressed={values.selectedAvatarId === avatar.id} onClick={() => setValues({ ...values, profileImage: avatar.src, profileImageType: 'avatar', selectedAvatarId: avatar.id })}><img src={avatar.src} alt="" width="80" height="80" /><span>{avatar.name}</span></button>)}</div><div className="profile-form__fields"><label>이름<input value={values.name} onChange={(event) => setValues({ ...values, name: event.target.value })} required /></label><label>이메일<input type="email" value={values.email} onChange={(event) => setValues({ ...values, email: event.target.value })} required /></label><label>우편번호<input value={values.address.zonecode || ''} onChange={(event) => setValues({ ...values, address: { ...values.address, zonecode: event.target.value } })} /></label><button type="button" onClick={searchAddress}>카카오 주소검색</button><label>도로명 주소<input value={values.address.roadAddress || ''} onChange={(event) => setValues({ ...values, address: { ...values.address, roadAddress: event.target.value } })} /></label><label>상세 주소<input value={values.address.detailAddress || ''} onChange={(event) => setValues({ ...values, address: { ...values.address, detailAddress: event.target.value } })} /></label></div><label className="profile-form__consent"><input type="checkbox" checked={values.marketingConsent} onChange={(event) => setValues({ ...values, marketingConsent: event.target.checked })} /> 마케팅 정보 수신 동의</label><div className="form-actions"><button type="button" className="form-button form-button--outline" onClick={() => navigate(paths.mypage)}>취소</button><button type="submit" className="form-button">변경사항 저장</button></div></form></PageShell>;
}
