import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { paths } from '../router/routePaths';
import { useAuthStore } from '../../store/useAuthStore';
import './Header.css';

const nav = [
  { label: '현대모터스튜디오', to: paths.motorstudio, children: [{ label: '소개', to: paths.motorstudio }, ...[['고양', 'goyang'], ['서울', 'seoul'], ['하남', 'hanam'], ['부산', 'busan'], ['베이징', 'beijing'], ['스노우 파크', 'snow-park']].map(([label, slug]) => ({ label, to: paths.location(slug) }))] },
  { label: '모빌리티', to: paths.mobility },
  { label: '전시/프로그램', to: paths.exhibitions, children: [{ label: '전시', to: paths.exhibitions }, { label: '프로그램', to: paths.programs }] },
  { label: '예약', to: paths.reservations },
  { label: '안내', to: paths.membership, children: [{ label: '멤버십', to: paths.membership }, { label: '공지사항', to: paths.notices }, { label: '뉴스룸', to: paths.newsroom }] },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [subnavOpen, setSubnavOpen] = useState(false);
  const headerRef = useRef(null);
  const navigate = useNavigate();
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

  return <header ref={headerRef} className={`site-header${subnavOpen ? ' site-header--expanded' : ''}`}>
    <Link className="site-header__logo" to={paths.home} onClick={closeMenus} aria-label="현대 모터스튜디오 홈">
      <img src="/images/common/hyundai-motorstudio-logo.svg" alt="" />
    </Link>
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
        <img className="site-header__experience-car" src="/images/common/experience-car.svg" alt="" />
        <img className="site-header__experience-eye" src="/images/common/experience-eye.svg" alt="" />
        <img className="site-header__experience-wheel site-header__experience-wheel--front" src="/images/common/experience-wheel.svg" alt="" />
        <img className="site-header__experience-wheel site-header__experience-wheel--rear" src="/images/common/experience-wheel.svg" alt="" />
        <span>경험</span>
      </Link>
      <button className="site-header__account" type="button" aria-label={isAuthenticated ? '마이페이지' : '로그인'} onClick={() => { closeMenus(); navigate(isAuthenticated ? paths.mypage : paths.login); }}>
        <img src="/images/common/profile.svg" alt="" />
      </button>
      <button className="site-header__toggle" type="button" aria-label={open ? '메뉴 닫기' : '메뉴 열기'} aria-expanded={open} onClick={() => { setOpen((value) => !value); setSubnavOpen(false); }}>{open ? <X /> : <Menu />}</button>
    </div>
  </header>;
}
