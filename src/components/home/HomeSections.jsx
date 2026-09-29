import { useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { homeAsset as asset } from './homeAssets';
import './HomeSections.css';

gsap.registerPlugin(ScrollTrigger);

export function HomeHero() {
  return (
    <section className="renewal-hero" aria-label="현대 모터스튜디오 메인 비주얼">
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={asset('hero-1.png')}
        aria-label="도심을 주행하는 현대자동차 영상"
      >
        <source src="/videos/home-hero.webm" type="video/webm" />
        <source src="/videos/home-hero.mp4" type="video/mp4" />
      </video>
    </section>
  );
}

export function HomeStories({ stories }) {
  return (
    <section className="renewal-stories">
      {stories.map((story, index) => (
        <Link
          key={story.title}
          className={`renewal-story renewal-story--${index + 1}`}
          to={story.to}
        >
          <img src={asset(story.image)} alt="" />
          <div>
            <h3>{story.title}</h3>
            <strong>{story.place}</strong>
            <p>{story.copy}</p>
          </div>
        </Link>
      ))}
    </section>
  );
}

function positionGuideVisual(index, linksRef, visualsRef) {
  const row = linksRef.current?.querySelectorAll('.renewal-guide__link')[index];
  const layer = visualsRef.current;
  const visual = layer?.children[index];
  if (!row || !layer || !visual) return;

  const rowRect = row.getBoundingClientRect();
  const layerRect = layer.getBoundingClientRect();
  const rowCenter = rowRect.top + rowRect.height / 2;
  visual.style.top = `${rowCenter - layerRect.top - visual.offsetHeight / 2}px`;
}

export function VisitorGuide({ links }) {
  const sectionRef = useRef(null);
  const linksRef = useRef(null);
  const visualsRef = useRef(null);
  const [scrollActiveIndex, setScrollActiveIndex] = useState(0);
  const [hoverIndex, setHoverIndex] = useState(null);
  const activeIndex = hoverIndex ?? scrollActiveIndex;
  const descriptions = [
    '휴관 및 운영시간 · 전시 관람 제한 · 시설 이용 안내 · 주요 공지사항',
    '전시 예약 · 시승 예약 · 프로그램 예약 · 콘텐츠 일정 한눈에 보기',
    '예약 내역 확인 · 일정 변경/취소 · 이용 유의사항 · 방문 준비 확인',
    '웰컴 패키지 · 전시/프로그램 할인 · 멤버십 라운지 · 회원 전용 콘텐츠',
    '신규 전시 소식 · 모빌리티 이야기 · 공간별 주요 소식 · 브랜드 콘텐츠',
  ];
  const visuals = [
    'guide-before.svg',
    'guide-plan.svg',
    'guide-schedule.svg',
    'guide-club.svg',
    'guide-new.svg',
  ];

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const menu = linksRef.current;
    if (!section || !menu || links.length < 2) return undefined;

    const media = gsap.matchMedia();
    const setupFrame = requestAnimationFrame(() => {
      media.add('(min-width: 901px)', () => {
        const rows = [...menu.querySelectorAll('.renewal-guide__link')];
        let previousIndex = -1;
        const rowStops = rows.map((row) => row.offsetTop);
        const movementStart = rowStops[0];
        const movementEnd = rowStops.at(-1);
        const emphasisRange = rows[0].getBoundingClientRect().height * 1.1;
        const updateActiveRow = (self) => {
          const currentPosition = self.progress * (movementEnd - movementStart);
          let index = rowStops.length - 1;
          for (let rowIndex = 0; rowIndex < rowStops.length - 1; rowIndex += 1) {
            if (currentPosition < (rowStops[rowIndex] + rowStops[rowIndex + 1]) / 2) {
              index = rowIndex;
              break;
            }
          }
          if (index !== previousIndex) {
            previousIndex = index;
            setScrollActiveIndex(index);
          }
          rows.forEach((row, rowIndex) => {
            const distance = Math.abs(currentPosition - rowStops[rowIndex]);
            const opacity = gsap.utils.clamp(0.22, 1, 1 - distance / emphasisRange);
            row.style.setProperty('--scroll-emphasis', opacity.toFixed(3));
            row.style.setProperty('--description-emphasis', gsap.utils
              .clamp(0, (opacity - 0.22) / 0.78, 1).toFixed(3));
          });
        };

        const movement = gsap.to(menu, {
          y: () => {
            const scrollTravel = section.offsetHeight - window.innerHeight;
            const firstRowCenter = menu.parentElement.offsetTop + menu.offsetTop + rows[0].offsetTop
              + rows[0].getBoundingClientRect().height / 2;
            return window.innerHeight / 2 - firstRowCenter - movementEnd + scrollTravel;
          },
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.45,
            invalidateOnRefresh: true,
            onUpdate: updateActiveRow,
            onRefresh: updateActiveRow,
          },
        });

        return () => {
          movement.scrollTrigger?.kill();
          movement.kill();
          gsap.set(menu, { clearProps: 'transform' });
        };
      });
    });

    return () => {
      cancelAnimationFrame(setupFrame);
      media.revert();
    };
  }, [links.length]);

  return (
    <section ref={sectionRef} className="renewal-guide" aria-labelledby="renewal-guide-title">
      <div className="renewal-guide__stage">
        <header>
          <h2 id="renewal-guide-title">VISITOR<br />INFORMATION</h2>
          <p>현대모터스튜디오 이용안내</p>
        </header>
        <div ref={visualsRef} className="renewal-guide__visuals" aria-hidden="true">
          {visuals.map((visual, index) => (
            <div
              key={visual}
              className={`renewal-guide__visual renewal-guide__visual--${index + 1}${hoverIndex === index ? ' is-active' : ''}`}
            >
              <img src={asset(visual)} alt="" />
            </div>
          ))}
        </div>
        <div className="renewal-guide__viewport">
          <nav
            ref={linksRef}
            className="renewal-guide__links"
            aria-label="방문 정보"
            onPointerLeave={() => {
              setHoverIndex(null);
            }}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) {
                setHoverIndex(null);
              }
            }}
          >
            {links.map(([label, title, to], index) => (
              <Link
                key={label}
                to={to}
                className={`renewal-guide__link${activeIndex === index ? ' is-active' : ''}${hoverIndex === index ? ' is-hovered' : ''}`}
                onPointerEnter={() => {
                  setHoverIndex(index);
                  requestAnimationFrame(() => positionGuideVisual(index, linksRef, visualsRef));
                }}
                onFocus={() => {
                  setHoverIndex(index);
                  requestAnimationFrame(() => positionGuideVisual(index, linksRef, visualsRef));
                }}
              >
                <span>{label}</span>
                <strong>{title}</strong>
                <small>{descriptions[index]}</small>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </section>
  );
}
