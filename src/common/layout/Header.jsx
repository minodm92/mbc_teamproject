import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { paths } from '../router/routePaths';
import { useAuthStore } from '../../store/useAuthStore';
import ReservationSelect from '../../components/reservation/ReservationSelect';
import './Header.css';

const nav = [
  { label: '현대모터스튜디오', to: paths.motorstudio, children: [{ label: '소개', to: paths.motorstudio }, ...[['고양', 'goyang'], ['서울', 'seoul'], ['하남', 'hanam'], ['부산', 'busan'], ['베이징', 'beijing'], ['스나얀 파크', 'senayan-park']].map(([label, slug]) => ({ label, to: paths.location(slug) }))] },
  { label: '모빌리티', to: paths.mobility },
  { label: '전시/프로그램', to: paths.exhibitions, children: [{ label: '전시', to: paths.exhibitions }, { label: '프로그램', to: paths.programs }] },
  { label: '예약', to: paths.reservations },
  { label: '안내', to: paths.membership, children: [{ label: '멤버십', to: paths.membership }, { label: '공지사항', to: paths.notices }, { label: '뉴스룸', to: paths.newsroom }] },
];

const reservationPages = [
  { label: '시승 예약', to: paths.reservations },
  { label: '프로그램 예약', to: paths.programReservation },
  { label: '전시 예약', to: paths.exhibitionReservation },
];

export default function Header({ variant = 'light' }) {
  const [open, setOpen] = useState(false);
  const [subnavOpen, setSubnavOpen] = useState(false);
  const headerRef = useRef(null);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isReservation = pathname === paths.reservations || pathname.startsWith(`${paths.reservations}/`);
  const reservationPage = reservationPages.find((page) => page.to === pathname) || reservationPages[0];
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    const closeSubnav = (event) => {
      if (event.key === 'Escape' || (event.type === 'pointerdown' && !headerRef.current?.contains(event.target))) {
        setSubnavOpen(false);
      }
    };

    document.addEventListener('pointerdown', closeSubnav);
    document.addEventListener('keydown', closeSubnav);
    return () => {
      document.removeEventListener('pointerdown', closeSubnav);
      document.removeEventListener('keydown', closeSubnav);
    };
  }, []);

  const closeMenus = () => {
    setOpen(false);
    setSubnavOpen(false);
  };
  const renderAsset = (name, className) => variant === 'light' || isReservation
    ? <img className={className} src={`/images/common/${name}.svg`} alt="" />
    : <>
      <img className={`${className} site-header__asset--dark`} src={`/images/common/${name}-black.svg`} alt="" />
      <img className={`${className} site-header__asset--light`} src={`/images/common/${name}.svg`} alt="" />
    </>;

  return <header ref={headerRef} className={`site-header site-header--${variant}${isReservation ? ' site-header--reservation' : ''}${subnavOpen ? ' site-header--expanded' : ''}`}>
    <div className="site-header__bar">
      <Link className="site-header__logo" to={paths.home} onClick={closeMenus} aria-label="현대 모터스튜디오 홈">
        {renderAsset('hyundai-motorstudio-logo', 'site-header__logo-image')}
      </Link>
      {isReservation && <div className={`site-header__reservation-switch${reservationPage.to === paths.programReservation ? ' site-header__reservation-switch--program' : ''}`}>
        <ReservationSelect label="예약 페이지 선택" value={reservationPage.to}
          options={reservationPages.map((page) => ({ value: page.to, label: page.label }))}
          onChange={(value) => { closeMenus(); navigate(value); }}/>
        <img src="/images/reservation/dropdown-chevron.svg" alt="" aria-hidden="true" />
      </div>}
      <nav className={`site-header__nav${open ? ' site-header__nav--open' : ''}`} aria-label="주 메뉴">
        {nav.map((item) => <div className="site-header__group" key={item.label}>
          {item.children
            ? <button className="site-header__link" type="button" aria-expanded={subnavOpen} onClick={() => setSubnavOpen((value) => !value)}>{item.label}</button>
            : <NavLink to={item.to} onClick={closeMenus} className="site-header__link">{item.label}</NavLink>}
          {item.children && <div className="site-header__submenu">{item.children.map((child) => <NavLink key={child.to} to={child.to} onClick={closeMenus}>{child.label}</NavLink>)}</div>}
        </div>)}
      </nav>
      <div className="site-header__actions">
        <Link className="site-header__experience" to={paths.experience} onClick={closeMenus} aria-label="경험 찾기">
          {renderAsset('experience-car', 'site-header__experience-car')}
          {renderAsset('experience-eye', 'site-header__experience-eye')}
          {renderAsset('experience-wheel', 'site-header__experience-wheel site-header__experience-wheel--front')}
          {renderAsset('experience-wheel', 'site-header__experience-wheel site-header__experience-wheel--rear')}
          <span>경험</span>
        </Link>
        <button className="site-header__account" type="button" aria-label={isAuthenticated ? '마이페이지' : '로그인'} onClick={() => { closeMenus(); navigate(isAuthenticated ? paths.mypage : paths.login); }}>
          {renderAsset('profile', 'site-header__account-image')}
        </button>
        <button className="site-header__toggle" type="button" aria-label={open ? '메뉴 닫기' : '메뉴 열기'} aria-expanded={open} onClick={() => { setOpen((value) => !value); setSubnavOpen(false); }}>{open ? <X /> : <Menu />}</button>
      </div>
    </div>
  </header>;
}
