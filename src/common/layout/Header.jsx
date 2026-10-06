import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { paths } from '../router/routePaths';
import { useAuthStore } from '../../store/useAuthStore';
import ReservationSelect from '../../components/reservation/ReservationSelect';
import experienceFindingIcon from './assets/experience-finding.svg';
import './Header.css';

const nav = [
  { label: '현대모터스튜디오', to: paths.motorstudio },
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
  const [mobileDarkBackground, setMobileDarkBackground] = useState(false);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [topHovered, setTopHovered] = useState(false);
  const [mobileGroup, setMobileGroup] = useState(null);
  const [subnavOpen, setSubnavOpen] = useState(false);
  const headerRef = useRef(null);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isReservation = pathname === paths.reservations || pathname.startsWith(`${paths.reservations}/`);
  const isNewsroom = /^\/newsroom(?:\/|$)/.test(pathname);
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

  useEffect(() => {
    if (!open) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onEscape = event => {
      if (event.key === 'Escape') { setOpen(false); setMobileGroup(null); }
    };
    window.addEventListener('keydown', onEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onEscape);
    };
  }, [open]);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const nextScrolled = window.scrollY > 80;
      setScrolled(nextScrolled);
      if (nextScrolled) setTopHovered(false);
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
    };
  }, [pathname]);

  useEffect(() => {
    const leaveTopArea = event => {
      if (event.pointerType !== 'mouse') return;
      const insideTopArea = event.clientY <= (headerRef.current?.offsetHeight || 80);
      setTopHovered(insideTopArea);
      if (!insideTopArea) setSubnavOpen(false);
    };
    window.addEventListener('pointermove', leaveTopArea);
    return () => window.removeEventListener('pointermove', leaveTopArea);
  }, []);


  useEffect(() => {
    const mobile = window.matchMedia('(max-width: 1000px)');
    let frame = 0;
    const update = () => {
      frame = 0;
      if (!mobile.matches || open) return;
      const element = document.elementsFromPoint(window.innerWidth / 2, 26)
        .find(item => !item.closest('.site-header, .site-header__reveal-zone, .site-top-button'));
      if (!element) return;
      const section = element.closest('[data-header-theme], [data-top-button-theme], section, footer');
      const explicit = section?.getAttribute('data-header-theme') || section?.getAttribute('data-top-button-theme');
      if (explicit) { setMobileDarkBackground(explicit === 'dark'); return; }
      if (section?.matches('.renewal-hero, .renewal-intro, .renewal-experience')) {
        setMobileDarkBackground(true); return;
      }
      let color = [255, 255, 255];
      const layers = [];
      for (let current = element; current; current = current.parentElement) {
        const values = getComputedStyle(current).backgroundColor.match(/[\d.]+/g)?.map(Number);
        if (values?.length >= 3) layers.push(values);
      }
      for (const [r, g, b, alpha = 1] of layers.reverse()) {
        color = [r, g, b].map((value, index) => value * alpha + color[index] * (1 - alpha));
      }
      setMobileDarkBackground(color[0] * .2126 + color[1] * .7152 + color[2] * .0722 < 145);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const observer = new ResizeObserver(schedule);
    observer.observe(document.body);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    document.addEventListener('load', schedule, true);
    schedule();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      document.removeEventListener('load', schedule, true);
    };
  }, [pathname, open]);

  const closeMenus = () => {
    setMobileGroup(null);
    setOpen(false);
    setSubnavOpen(false);
    window.scrollTo(0, 0);
  };
  const renderAsset = (name, className) => variant === 'light' || isReservation || isNewsroom
    ? <img className={className} src={`/images/common/${name}.svg`} alt="" />
    : <>
      <img className={`${className} site-header__asset--dark`} src={`/images/common/${name}-black.svg`} alt="" />
      <img className={`${className} site-header__asset--light`} src={`/images/common/${name}.svg`} alt="" />
    </>;

  return <>
    {scrolled && <button className="site-header__reveal-zone" type="button" aria-label="상단 메뉴 표시" onFocus={() => setTopHovered(true)} onClick={() => setTopHovered(true)} />}
    <header data-mobile-theme={mobileDarkBackground ? 'light' : 'dark'} onPointerEnter={() => setTopHovered(true)} onPointerLeave={event => { if (event.clientY > (headerRef.current?.offsetHeight || 80)) { setTopHovered(false); setSubnavOpen(false); } }} ref={headerRef} className={`site-header site-header--${variant}${isReservation ? ' site-header--reservation' : ''}${isNewsroom ? ' site-header--newsroom' : ''}${subnavOpen ? ' site-header--expanded' : ''}${scrolled ? ' site-header--scrolled' : ''}${scrolled && !topHovered && !open ? ' site-header--scroll-hidden' : ''}`}>
    <div className="site-header__bar">
      <Link className="site-header__logo" to={paths.home} onClick={closeMenus} aria-label="현대 모터스튜디오 홈">
        {renderAsset('hyundai-motorstudio-logo', 'site-header__logo-image')}
        <img className="site-header__mobile-header-logo" src="/images/common/mobile-menu/header-logo.svg" alt="" />
      </Link>
      {isReservation && <div className={`site-header__reservation-switch${reservationPage.to === paths.programReservation ? ' site-header__reservation-switch--program' : ''}`}>
        <ReservationSelect label="예약 페이지 선택" value={reservationPage.to}
          options={reservationPages.map((page) => ({ value: page.to, label: page.label }))}
          onChange={(value) => { closeMenus(); navigate(value); }}/>
        <img src="/images/reservation/dropdown-chevron.svg" alt="" aria-hidden="true" />
      </div>}
      <nav className={`site-header__nav${open ? ' site-header__nav--open' : ''}`} aria-label="주 메뉴">
        {nav.map((item) => <div className="site-header__group" key={item.label} onPointerEnter={() => setSubnavOpen(Boolean(item.children))}>
          {item.children
            ? <button className="site-header__link" type="button" aria-expanded={subnavOpen} onFocus={() => setSubnavOpen(true)} onClick={() => setSubnavOpen((value) => !value)}>{item.label}</button>
            : <NavLink to={item.to} onClick={closeMenus} className="site-header__link">{item.label}</NavLink>}
          {item.children && <div className="site-header__submenu">{item.children.map((child) => <NavLink key={child.to} to={child.to} onClick={closeMenus}>{child.label}</NavLink>)}</div>}
        </div>)}
      </nav>
      <div className="site-header__actions">
        <Link className="site-header__experience" to={paths.experience} onClick={closeMenus} aria-label="경험 찾기">
          <img className="site-header__experience-finding" src={experienceFindingIcon} alt="" />
        </Link>
        <button className="site-header__account" type="button" aria-label={isAuthenticated ? '마이페이지' : '로그인'} onClick={() => { closeMenus(); navigate(isAuthenticated ? paths.mypage : paths.login); }}>
          {renderAsset('profile', 'site-header__account-image')}
        </button>
        <button className="site-header__toggle" type="button" aria-label={open ? '메뉴 닫기' : '메뉴 열기'} aria-expanded={open} onClick={() => { setOpen((value) => !value); setSubnavOpen(false); }}>{open ? <X /> : <img src="/images/common/mobile-menu/header-menu.svg" alt="" />}</button>
      </div>
    </div>
    {open && <div className="site-header__mobile-menu" role="dialog" aria-modal="true" aria-label="모바일 메뉴">
      <div className="site-header__mobile-tools">
        <Link to={paths.experience} onClick={closeMenus} aria-label="경험 찾기" className="site-header__experience site-header__mobile-experience">
          <img className="site-header__experience-finding" src={experienceFindingIcon} alt="" />
        </Link>
        <Link to={isAuthenticated ? paths.mypage : paths.login} onClick={closeMenus} aria-label={isAuthenticated ? '마이페이지' : '로그인'}>
          <img src="/images/common/profile-black.svg" width="24" height="24" alt="" />
        </Link>
      </div>
      <button className="site-header__mobile-close" type="button" aria-label="메뉴 닫기" onClick={closeMenus}>
        <img src="/images/common/mobile-menu/close.svg" width="24" height="24" alt="" />
      </button>
      <Link className="site-header__mobile-logo" to={paths.home} onClick={closeMenus} aria-label="현대 모터스튜디오 홈">
        <img src="/images/common/mobile-menu/logo.svg" width="218" height="50" alt="HYUNDAI MOTORSTUDIO" />
      </Link>
      <nav className="site-header__mobile-navigation" aria-label="모바일 주 메뉴">
        {nav.map((item, index) => {
          const children = item.children || [];
          const label = item.to === paths.exhibitions ? '전시 / 프로그램' : item.to === paths.motorstudio ? '현대 모터스튜디오' : item.label;
          const expanded = mobileGroup === index;
          return <div key={item.to}>
            {children.length ? <button className="site-header__mobile-category" type="button" aria-expanded={expanded} aria-controls={`mobile-navigation-${index}`} onClick={() => setMobileGroup(expanded ? null : index)}>
              <span>{label}</span>
              <img src={expanded ? '/images/common/mobile-menu/minus.svg' : '/images/common/mobile-menu/plus.svg'} width="24" height="24" alt="" />
            </button> : <div className="site-header__mobile-category">
              <NavLink to={item.to} onClick={closeMenus}>{label}</NavLink>
              <button className="site-header__mobile-category-icon" type="button" aria-label={label + ' 페이지로 이동'} onClick={() => { closeMenus(); navigate(item.to); }}>
                <img src="/images/common/mobile-menu/plus.svg" width="24" height="24" alt="" />
              </button>
            </div>}
            {expanded && children.length > 0 && <div id={`mobile-navigation-${index}`} className="site-header__mobile-children">
              {children.map(child => <NavLink key={child.to} to={child.to} onClick={closeMenus}>{child.label}</NavLink>)}
            </div>}
          </div>;
        })}
      </nav>
    </div>}
  </header>
  </>;
}
