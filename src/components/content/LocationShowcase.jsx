import { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Flip } from 'gsap/Flip';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { locationShowcase } from './data/locationShowcase';
import LocationDetails from './LocationDetails';
import './LocationShowcase.css';

gsap.registerPlugin(ScrollTrigger, Flip);

const INTRO_TIMING = {
  hold: 2,
  transform: 0.8,
  headerReveal: 0.45,
  visualReveal: 0.55,
};

const information = [['hours', '운영시간'], ['closed', '휴관일'], ['address', '주소'], ['price', '이용요금']];

export default function LocationShowcase({ intro = false }) {
  const rootRef = useRef(null);
  const [introVisible, setIntroVisible] = useState(intro);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const media = gsap.matchMedia();
    const introMotionEnabled = intro && window.matchMedia('(prefers-reduced-motion: no-preference)').matches;

    if (intro) {
      const hero = root.querySelector('.location-hero');
      const title = root.querySelector('.location-hero__wordmark');
      const titleImage = title?.querySelector('img');
      const heroVisual = root.querySelector('.location-hero__visual');
      const header = document.querySelector('.site-header');
      if (hero && title && titleImage && heroVisual) {
        media.add('(prefers-reduced-motion: no-preference)', () => {
          const titleState = Flip.getState(title);
          gsap.set(hero, { backgroundColor: '#0f0f0f' });
          gsap.set(titleImage, { filter: 'brightness(0) invert(1)' });
          gsap.set(heroVisual, { autoAlpha: 0, clipPath: 'inset(100% 0 0 0)' });
          if (header) gsap.set(header, { autoAlpha: 0 });
          root.classList.remove('location-showcase--intro');

          const timeline = gsap.timeline({
            delay: INTRO_TIMING.hold,
            defaults: { ease: 'power3.inOut' },
            onComplete: () => {
              gsap.set(hero, { clearProps: 'backgroundColor' });
              gsap.set(titleImage, { clearProps: 'filter' });
              gsap.set(heroVisual, { clearProps: 'opacity,visibility,clipPath' });
              if (header) gsap.set(header, { clearProps: 'opacity,visibility' });
              setIntroVisible(false);
              const expansion = ScrollTrigger.getById('studio-hero-expansion');
              expansion?.enable(false, true);
              ScrollTrigger.refresh();
            },
          });
          timeline.to(hero, {
            backgroundColor: '#ffffff',
            duration: INTRO_TIMING.transform,
          }, 0)
            .to(titleImage, {
              filter: 'brightness(0)',
              duration: INTRO_TIMING.transform,
            }, 0)
            .add(Flip.from(titleState, {
              absolute: true,
              scale: true,
              duration: INTRO_TIMING.transform,
              ease: 'power3.inOut',
            }), 0);
          if (header) timeline.to(header, {
              autoAlpha: 1,
              duration: INTRO_TIMING.headerReveal,
              ease: 'power2.out',
            }, INTRO_TIMING.transform - INTRO_TIMING.headerReveal);
          timeline.to(heroVisual, {
              autoAlpha: 1,
              clipPath: 'inset(0% 0 0 0)',
              duration: INTRO_TIMING.visualReveal,
              ease: 'power3.out',
            }, INTRO_TIMING.transform - INTRO_TIMING.visualReveal);

          return () => {
            timeline.kill();
            if (header) gsap.set(header, { clearProps: 'opacity,visibility' });
          };
        }, root);
        media.add('(prefers-reduced-motion: reduce)', () => {
          root.classList.remove('location-showcase--intro');
          setIntroVisible(false);
        }, root);
      }
    }

    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from('.location-hero__image', { scale: 1.06, duration: 1.2, ease: 'power2.out' });
      if (!intro) gsap.from('.location-hero__wordmark', { opacity: 0, y: 20, duration: 1, ease: 'power2.out' });
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
      if (introMotionEnabled) expansion.scrollTrigger.disable(false);
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

      root.querySelectorAll('.studio-copy').forEach((copy) => {
        gsap.from(copy, { opacity: 0, y: 24, duration: .9, ease: 'power2.out',
          scrollTrigger: { trigger: copy, start: 'top 94%', toggleActions: 'play none none reverse' } });
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

      // Keep parallax within 30px of the Figma resting coordinates.
      gsap.timeline({ scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 1 } })
        .to('.location-hero__crop', { y: -15, ease: 'none' }, 0)
        .to('.location-hero__wordmark', { y: 30, ease: 'none' }, 0);
    }, root);

    const locations = root.querySelector('.locations');
    const cardsContainer = root.querySelector('.locations__cards');
    const cards = [...root.querySelectorAll('.loc')];
    let metrics = [];
    let firstCardHeight = 0;
    let frame = 0;
    let previousScrollY = -1;

    const clamp = (value) => Math.min(1, Math.max(0, value));
    const round = (value) => Math.round(value * 1000) / 1000;
    const measureLocations = () => {
      const configuredBar = Number.parseFloat(getComputedStyle(locations).getPropertyValue('--bar'));
      const bar = Number.isFinite(configuredBar) ? configuredBar : cards[0].querySelector('.loc__bar').offsetHeight;
      const firstStackedCard = cards[1];
      const firstStackedIndex = Number.parseFloat(firstStackedCard?.style.getPropertyValue('--i'));
      const configuredStackStep = firstStackedCard && firstStackedIndex
        ? Number.parseFloat(getComputedStyle(firstStackedCard).top) / firstStackedIndex
        : Number.NaN;
      const stackStep = Number.isFinite(configuredStackStep) ? configuredStackStep : bar;
      const sectionTop = locations.getBoundingClientRect().top + window.scrollY;
      const cardsTop = cardsContainer.getBoundingClientRect().top + window.scrollY;
      let naturalTop = cardsTop;
      firstCardHeight = cards[0]?.offsetHeight || window.innerHeight;
      metrics = cards.map((card, index) => {
        const result = { naturalTop, stick: index * stackStep };
        naturalTop += card.offsetHeight;
        return result;
      });
      locations.style.setProperty('--locations-document-top', `${sectionTop}px`);
      previousScrollY = -1;
      updateLocations();
    };
    const updateLocations = () => {
      frame = 0;
      const scrollY = window.scrollY;
      if (scrollY === previousScrollY || !metrics.length) return;
      previousScrollY = scrollY;
      cards.forEach((card, index) => {
        const { naturalTop, stick } = metrics[index];
        const active = scrollY >= naturalTop - stick - 1;
        card.classList.toggle('is-active', active);
        let cover = 0;
        if (metrics[index + 1]) {
          const nextStart = metrics[index + 1].naturalTop - firstCardHeight;
          const nextStuck = metrics[index + 1].naturalTop - metrics[index + 1].stick;
          cover = clamp((scrollY - nextStart) / Math.max(1, nextStuck - nextStart));
        }
        cover = round(cover);
        card.style.setProperty('--card-opacity', String(round(1 - cover * .5)));
      });
    };
    const requestLocationsUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(updateLocations);
    };
    window.addEventListener('scroll', requestLocationsUpdate, { passive: true });
    window.addEventListener('resize', measureLocations);
    window.addEventListener('load', measureLocations);
    measureLocations();

    // Image dimensions are reserved in CSS; refresh once web fonts have settled.
    let disposed = false;
    document.fonts.ready.then(() => { if (!disposed) { measureLocations(); ScrollTrigger.refresh(); } });
    return () => {
      disposed = true;
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', requestLocationsUpdate);
      window.removeEventListener('resize', measureLocations);
      window.removeEventListener('load', measureLocations);
      media.revert();
    };
  }, [intro]);

  return <div className={`location-showcase${introVisible ? ' location-showcase--intro' : ''}`} ref={rootRef}>
    <section className="location-hero" aria-label="현대 모터스튜디오">
      <h1 className="location-hero__wordmark"><img src="/images/locations/figma/wordmark.svg" alt="HYUNDAI MOTORSTUDIO" width="1880" height="113" /></h1>
      <div className="location-hero__visual"><div className="location-hero__crop"><img className="location-hero__image" src="/images/locations/figma/hero.svg" alt="현대 모터스튜디오의 푸른 미디어 전시 공간" width="402" height="230" fetchPriority="high" /></div></div>
    </section>
    <section className="studio-hero-wide studio-desktop" aria-label="현대 모터스튜디오 미디어 공간"><img src="/images/locations/figma/hero-wide.svg" alt="현대 모터스튜디오의 몰입형 미디어 공간" /></section>
    <section className="studio-intro studio-desktop" aria-labelledby="studio-intro-title">
      <h2 className="studio-copy" id="studio-intro-title">EXPLORE THE<br />POSSIBILITIES OF MOBILITY</h2>
      <div className="studio-intro__columns"><p className="studio-copy">현대 모터스튜디오는 자동차를 단순히 바라보는 공간을 넘어, 모빌리티가 만들어가는 새로운 일상과 라이프스타일을 직접 경험할 수 있는 브랜드 공간입니다. 전시와 체험을 통해 현대자동차가 그리는 미래의 이동을 보다 가까이에서 만나볼 수 있습니다.</p><p className="studio-copy">누구나 자신의 관심과 취향에 따라 현대 모터스튜디오를 자유롭게 경험할 수 있습니다. 자동차를 살펴보고 운전하는 순간부터 디자인과 예술, 새로운 기술을 발견하는 과정까지 다양한 콘텐츠를 통해 모빌리티를 자신만의 방식으로 즐겨보세요.</p></div>
    </section>
    <section className="locations" aria-labelledby="locations-title">
      <h2 id="locations-title" className="locations__title">LOCATIONS</h2>
      <div className="locations__cards">
        {locationShowcase.map((location, index) => <article className={`loc${index === locationShowcase.length - 1 ? ' is-last' : ''}`} key={location.id} data-location={location.id} aria-labelledby={`location-${location.id}`} style={{ '--i': index, '--loc-background': location.background, '--loc-color': location.color }}>
          <div className="loc__bar">
            <h3 id={`location-${location.id}`}>{location.title}</h3>
          </div>
          <div className="loc__inner">
            <ul className="loc__keywords">{location.keywords.map((keyword) => <li key={keyword}>{keyword}</li>)}</ul>
            <dl className="loc__info">{information.filter(([key]) => location[key]).map(([key, label]) => <div className="loc__row" data-field={key} key={key}><dt>{label}</dt><dd>{location[key]}</dd></div>)}</dl>
            <div className="loc__image"><img src={location.image} alt={`현대 모터스튜디오 ${location.name} 공간`} width={location.id === 'goyang' ? 712 : 714} height="529" decoding="async" /></div>
          </div>
        </article>)}
      </div>
    </section>
    <LocationDetails />
  </div>;
}
