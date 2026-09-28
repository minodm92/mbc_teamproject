import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { locationShowcase } from '../../common/data/locationShowcase';
import LocationDetails from './LocationDetails';
import './LocationShowcase.css';

gsap.registerPlugin(ScrollTrigger);

const information = [['hours', '운영시간'], ['closed', '휴관일'], ['address', '주소'], ['price', '이용요금']];

export default function LocationShowcase() {
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const media = gsap.matchMedia();
    const panels = [...root.querySelectorAll('.location-scene:not(.studio-desktop)')];
    const resetAccessibility = () => panels.forEach((panel) => panel.removeAttribute('aria-hidden'));

    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from('.location-hero__image', { scale: 1.06, duration: 1.2, ease: 'power2.out' });
      gsap.from('.location-hero__wordmark', { opacity: 0, y: 20, duration: 1, ease: 'power2.out' });
    }, root);

    media.add('(min-width: 1440px) and (prefers-reduced-motion: no-preference)', () => {
      const hero = root.querySelector('.location-hero');
      const visual = root.querySelector('.location-hero__visual');
      const unit = () => root.clientWidth / 1920;
      const heroHeight = () => Math.max(window.innerHeight, 101 + 779 * unit());
      gsap.set(hero, { height: heroHeight, position: 'relative', overflow: 'hidden' });
      gsap.set('.studio-hero-wide', { display: 'none' });
      gsap.set(visual, { position: 'absolute', maxWidth: 'none', zIndex: 1 });
      const expansion = gsap.timeline({ scrollTrigger: {
        id: 'studio-hero-expansion', trigger: hero, start: 'top top',
        end: () => `+=${window.innerHeight * 1.8}`, pin: true, pinType: 'transform',
        scrub: 1, anticipatePin: 1, invalidateOnRefresh: true,
        onRefreshInit: () => gsap.set(hero, { height: heroHeight }),
      } });
      expansion.fromTo(visual, {
        left: () => 1498 * unit(), top: () => 101 + 549 * unit(),
        width: () => 402 * unit(), height: () => 230 * unit(),
      }, {
        left: () => root.clientWidth * .15,
        top: () => (heroHeight() - root.clientWidth * .7 * 230 / 402) / 2,
        width: () => root.clientWidth * .7, height: () => root.clientWidth * .7 * 230 / 402,
        duration: .55, ease: 'power2.inOut',
      }, .15)
        .to('.location-hero__wordmark', { opacity: 0, y: -25, duration: .3, ease: 'power2.out' }, .3)
        .to(visual, { left: 0, top: 0, width: () => root.clientWidth, height: heroHeight, duration: .35, ease: 'power2.inOut' }, .7)
        .to('.location-hero__image', { scale: 1.035, duration: .35, ease: 'none' }, .7)
        .to({}, { duration: .2 });

      root.querySelectorAll('.studio-copy, .location-scene__heading').forEach((copy) => {
        gsap.from(copy, { opacity: 0, y: 24, duration: .9, ease: 'power2.out',
          scrollTrigger: { trigger: copy, start: 'top 94%', toggleActions: 'play none none reverse' } });
      });
      root.querySelectorAll('.location-scene__info').forEach((info) => {
        gsap.from(info.children, { opacity: 0, y: 20, stagger: .04, duration: .8, ease: 'power2.out',
          scrollTrigger: { trigger: info, start: 'top 96%', toggleActions: 'play none none reverse' } });
      });
      root.querySelectorAll('.studio-mask').forEach((frame) => {
        const timeline = gsap.timeline({ scrollTrigger: { trigger: frame, start: 'top 90%', end: 'top 15%', scrub: 1 } });
        timeline.from(frame, { clipPath: 'inset(15% 0 0 0)', ease: 'power2.out' }, 0)
          .from(frame.querySelector('img'), { scale: 1.08, ease: 'power2.out' }, 0);
      });
      root.querySelectorAll('.studio-vehicle__image, .studio-program__image').forEach((frame) => {
        gsap.from(frame.querySelector('img'), { scale: 1.04, duration: 1, ease: 'power2.out',
          scrollTrigger: { trigger: frame, start: 'top 92%', toggleActions: 'play none none reverse' } });
      });
    }, root);

    media.add('(min-width: 768px) and (max-width: 1439px) and (prefers-reduced-motion: no-preference)', () => {
      const hero = root.querySelector('.location-hero');
      const stage = root.querySelector('.location-stage');
      const track = root.querySelector('.location-track');
      const parts = panels.map((panel) => ({
        heading: panel.querySelector('.location-scene__heading'),
        rows: panel.querySelectorAll('.location-scene__row'),
        frame: panel.querySelector('.location-scene__image'),
        image: panel.querySelector('img'),
      }));

      // Keep parallax within 30px of the Figma resting coordinates.
      gsap.timeline({ scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 1 } })
        .to('.location-hero__crop', { y: -15, ease: 'none' }, 0)
        .to('.location-hero__wordmark', { y: 30, ease: 'none' }, 0);

      parts.slice(1).forEach(({ heading, rows, frame, image }) => {
        gsap.set([heading, ...rows], { opacity: 0, y: 30 });
        gsap.set(frame, { clipPath: 'inset(100% 0% 0% 0%)' });
        gsap.set(image, { scale: 1.06 });
      });

      let active = -1;
      const syncAccessibility = (time) => {
        const next = Math.min(panels.length - 1, Math.max(0, Math.floor((time + .42) / 2)));
        if (active === next) return;
        active = next;
        panels.forEach((panel, index) => panel.setAttribute('aria-hidden', String(index !== active)));
      };
      const timeline = gsap.timeline({
        defaults: { ease: 'power2.out' },
        scrollTrigger: {
          trigger: track, start: 'top top', end: 'bottom bottom', scrub: 1,
          invalidateOnRefresh: true,
        },
        onUpdate() { syncAccessibility(this.time()); },
      });
      // Each chapter has a reading hold before its reversible transition.
      parts.forEach((part, index) => {
        if (!index) return;
        const start = index * 2 - .8;
        const previous = parts[index - 1];
        timeline.to([previous.heading, ...previous.rows], { opacity: 0, y: -30, duration: .7 }, start)
          .to(stage, { backgroundColor: locationShowcase[index].background, duration: .8 }, start)
          .to('.location-stage__title', { color: locationShowcase[index].color, duration: .8 }, start)
          .to(part.frame, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1 }, start)
          .to(part.image, { scale: 1, duration: 1 }, start)
          .to(part.heading, { opacity: 1, y: 0, duration: .7 }, start + .7)
          .to(part.rows, { opacity: 1, y: 0, duration: .7, stagger: .04 }, start + .75);
      });
      timeline.to({}, { duration: .8 });
      syncAccessibility(0);
      return resetAccessibility;
    }, root);

    // Image dimensions are reserved in CSS; refresh once web fonts have settled.
    let disposed = false;
    document.fonts.ready.then(() => { if (!disposed) ScrollTrigger.refresh(); });
    return () => {
      disposed = true;
      media.revert();
      resetAccessibility();
    };
  }, []);

  return <div className="location-showcase" ref={rootRef}>
    <section className="location-hero" aria-label="현대 모터스튜디오">
      <h1 className="location-hero__wordmark"><img src="/images/locations/figma/wordmark.svg" alt="HYUNDAI MOTORSTUDIO" width="1880" height="113" /></h1>
      <div className="location-hero__visual"><div className="location-hero__crop"><img className="location-hero__image" src="/images/locations/figma/hero.svg" alt="현대 모터스튜디오의 푸른 미디어 전시 공간" width="402" height="230" fetchPriority="high" /></div></div>
    </section>
    <section className="studio-hero-wide studio-desktop" aria-label="현대 모터스튜디오 미디어 공간"><img src="/images/locations/figma/hero-wide.svg" alt="현대 모터스튜디오의 몰입형 미디어 공간" /></section>
    <section className="studio-intro studio-desktop" aria-labelledby="studio-intro-title">
      <h2 className="studio-copy" id="studio-intro-title">EXPLORE THE<br />POSSIBILITIES OF MOBILITY</h2>
      <div className="studio-intro__columns"><p className="studio-copy">현대 모터스튜디오는 자동차를 단순히 바라보는 공간을 넘어, 모빌리티가 만들어가는 새로운 일상과 라이프스타일을 직접 경험할 수 있는 브랜드 공간입니다. 전시와 체험을 통해 현대자동차가 그리는 미래의 이동을 보다 가까이에서 만나볼 수 있습니다.</p><p className="studio-copy">누구나 자신의 관심과 취향에 따라 현대 모터스튜디오를 자유롭게 경험할 수 있습니다. 자동차를 살펴보고 운전하는 순간부터 디자인과 예술, 새로운 기술을 발견하는 과정까지 다양한 콘텐츠를 통해 모빌리티를 자신만의 방식으로 즐겨보세요.</p></div>
    </section>
    <section className="location-track" aria-labelledby="location-stage-title">
      <div className="location-stage">
        <h2 id="location-stage-title" className="location-stage__title">LOCATIONS</h2>
        <div className="location-stage__scenes">
          {locationShowcase.map((location) => <article className={`location-scene${location.desktopOnly ? ' studio-desktop' : ''}`} key={location.id} data-location={location.id} aria-labelledby={`location-${location.id}`} style={{ '--scene-background': location.background, '--scene-color': location.color }}>
            <div className="location-scene__heading"><h3 id={`location-${location.id}`}>{location.title}</h3><ul>{location.keywords.map((keyword) => <li key={keyword}>{keyword}</li>)}</ul></div>
            <dl className="location-scene__info">{information.filter(([key]) => location[key]).map(([key, label]) => <div className="location-scene__row" key={key}><dt>{label}</dt><dd>{location[key]}</dd></div>)}</dl>
            <div className="location-scene__image"><img src={location.image} alt={`현대 모터스튜디오 ${location.name} 공간`} width="714" height="529" decoding="async" /></div>
          </article>)}
        </div>
      </div>
    </section>
    <LocationDetails />
  </div>;
}
