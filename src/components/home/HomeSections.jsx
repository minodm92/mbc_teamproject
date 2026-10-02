import { Fragment, useId, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import heroPosterUrl from "../../../public/videos/home-hero-poster.png?url";
import heroVideoUrl from "../../../public/videos/home-hero.mp4?url";
import { homeAsset as asset } from "./homeAssets";
import "./HomeSections.css";

gsap.registerPlugin(ScrollTrigger);

export function HomeHero() {
  return (
    <section
      className="renewal-hero"
      aria-label="현대 모터스튜디오 메인 비주얼"
    >
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster={heroPosterUrl}
        aria-label="도심을 주행하는 현대자동차 영상"
      >
        <source src={heroVideoUrl} type="video/mp4" />
      </video>
    </section>
  );
}

export function HomeStories({ stories }) {
  const sectionRef = useRef(null);
  const lineRef = useRef(null);
  const lineProgressRef = useRef(null);
  const lineClipId = useId().replace(/:/g, "");

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section || !stories.length) return undefined;

    const titleSection = section.previousElementSibling;
    const titleLine = titleSection?.querySelector(
      ".renewal-story-title__line-track",
    );
    const titleLineFill = titleLine?.querySelector(
      ".renewal-story-title__line-fill",
    );
    const media = gsap.matchMedia();
    const storiesSetup = (isMobile, reduceMotion = false) => {
      const rows = [...section.querySelectorAll(".renewal-story")];
      const images = rows
        .map((row) => row.querySelector("img"))
        .filter(Boolean);
      let isActive = true;
      let layoutRefreshFrame;
      let finalRefreshFrame;
      let contentObserver;
      let lineAnchors = [];
      let lineTrigger;
      const lineState = { progress: 0 };

      const updateLineGeometry = () => {
        if (isMobile || !lineRef.current) return;

        const sectionRect = section.getBoundingClientRect();
        const scale = Math.min(1, window.innerWidth / 1920);
        const lineHeight = section.offsetHeight;
        const markerGap = 16 * scale;
        const lineInset = 2 * scale;
        lineAnchors = rows.map((row) => {
          const copy = row.querySelector(".renewal-story__copy");
          const copyRect = copy?.getBoundingClientRect();
          return copyRect ? copyRect.top - sectionRect.top + 10 * scale : 0;
        });

        lineRef.current.setAttribute("viewBox", `0 0 8 ${lineHeight}`);
        lineRef.current.style.height = `${lineHeight}px`;

        const updateGroup = (groupName) => {
          const group = lineRef.current.querySelector(
            `[data-line-group="${groupName}"]`,
          );
          const segments = group?.querySelectorAll("[data-line-segment]") || [];
          const dots = group?.querySelectorAll("[data-line-dot]") || [];
          const tail = group?.querySelector("[data-line-tail]");
          let segmentStart = lineInset;

          lineAnchors.forEach((anchor, index) => {
            segments[index]?.setAttribute(
              "d",
              `M4 ${segmentStart}V${Math.max(segmentStart, anchor - markerGap)}`,
            );
            dots[index]?.setAttribute("cy", anchor);
            segmentStart = anchor + markerGap;
          });
          tail?.setAttribute(
            "d",
            `M4 ${segmentStart}V${Math.max(segmentStart, lineHeight - lineInset)}`,
          );
        };

        updateGroup("base");
        updateGroup("progress");
      };

      const setLineProgress = (progressY) => {
        if (isMobile || !lineProgressRef.current || !Number.isFinite(progressY))
          return;
        lineProgressRef.current.setAttribute(
          "height",
          gsap.utils.clamp(0, section.offsetHeight, progressY),
        );
      };

      const updateLineFromProgress = () => {
        if (!titleLine || !titleLineFill) return;
        const titleRect = titleLine.getBoundingClientRect();
        const storyRect = section.getBoundingClientRect();
        const titleHeight = titleLine.offsetHeight;
        const storyStart = storyRect.top - titleRect.top;
        const totalLength = storyRect.bottom - titleRect.top;
        const traveled = totalLength * lineState.progress;
        const titleFill = gsap.utils.clamp(0, titleHeight, traveled);

        titleLineFill.style.clipPath = `inset(0 0 ${titleHeight - titleFill}px 0)`;
        if (!isMobile && !reduceMotion) {
          setLineProgress(traveled - storyStart);
        }
      };

      const refreshAfterLayout = () => {
        cancelAnimationFrame(layoutRefreshFrame);
        cancelAnimationFrame(finalRefreshFrame);
        layoutRefreshFrame = requestAnimationFrame(() => {
          finalRefreshFrame = requestAnimationFrame(() => {
            if (isActive) {
              updateLineGeometry();
              ScrollTrigger.refresh();
            }
          });
        });
      };

      updateLineGeometry();

      if (typeof ResizeObserver !== "undefined") {
        contentObserver = new ResizeObserver(refreshAfterLayout);
        contentObserver.observe(section);
        if (section.parentElement)
          contentObserver.observe(section.parentElement);
        if (titleSection) contentObserver.observe(titleSection);
        if (titleSection?.previousElementSibling)
          contentObserver.observe(titleSection.previousElementSibling);
        if (titleLine) contentObserver.observe(titleLine);
        rows.forEach((row) => contentObserver.observe(row));
      }

      if (document.readyState === "complete") {
        refreshAfterLayout();
      } else {
        window.addEventListener("load", refreshAfterLayout, { once: true });
      }
      document.fonts?.ready.then(refreshAfterLayout);

      if (titleLine) {
        const lineTween = gsap.fromTo(
          lineState,
          { progress: 0 },
          {
            progress: 1,
            duration: 1,
            ease: "none",
            onUpdate: updateLineFromProgress,
            scrollTrigger: {
              trigger: titleLine,
              start: "top bottom",
              endTrigger: section,
              end: "bottom bottom",
              scrub: 1,
              invalidateOnRefresh: true,
              onRefresh: updateLineFromProgress,
            },
          },
        );
        lineTrigger = lineTween.scrollTrigger;
      }

      rows.forEach((row, index) => {
        const image = row.querySelector("img");
        const copy = row.querySelector(".renewal-story__copy");
        const isRightImageRow = index % 2 === 0;
        const distance = isMobile ? 22 : 48;
        const imageX = isMobile ? 0 : isRightImageRow ? distance : -distance;
        const copyX = isMobile ? 0 : isRightImageRow ? -distance : distance;
        const startState = isMobile
          ? { y: 20, opacity: 0 }
          : { x: copyX, opacity: 0 };
        const imageStartState = isMobile
          ? { y: 24, opacity: 0 }
          : { x: imageX, opacity: 0 };
        const settleState = isMobile
          ? { y: 0, opacity: 1 }
          : { x: 0, opacity: 1 };
        if (reduceMotion) return;

        const revealHold = 1;
        const reveal = gsap.timeline({
          scrollTrigger: {
            trigger: row,
            start: () => {
              const anchorOffset = copy
                ? copy.offsetTop + 10
                : row.offsetHeight / 2;
              const nextRow = rows[index + 1];
              const availableDistance = nextRow
                ? nextRow.offsetTop - row.offsetTop
                : section.offsetHeight - row.offsetTop;
              const scrollDistance = Math.max(
                window.innerHeight * 0.42,
                availableDistance * 0.68,
              );
              const timelineDuration = revealHold + 0.08 + 0.9;
              const holdDistance =
                scrollDistance * (revealHold / timelineDuration);
              const topViewportPercent =
                100 * (1 - (anchorOffset - holdDistance) / window.innerHeight);
              return `top ${topViewportPercent}%`;
            },
            end: () => {
              const nextRow = rows[index + 1];
              const availableDistance = nextRow
                ? nextRow.offsetTop - row.offsetTop
                : section.offsetHeight - row.offsetTop;
              return `+=${Math.max(window.innerHeight * 0.42, availableDistance * 0.68)}`;
            },
            refreshPriority: -1,
            scrub: 0.35,
            invalidateOnRefresh: true,
          },
        });

        reveal.to({}, { duration: revealHold, ease: "none" });
        if (copy)
          reveal.fromTo(
            copy,
            startState,
            { ...settleState, duration: 0.9, ease: "none" },
            revealHold,
          );
        if (image)
          reveal.fromTo(
            image,
            imageStartState,
            { ...settleState, duration: 0.9, ease: "none" },
            revealHold + 0.08,
          );
      });

      if (reduceMotion) {
        setLineProgress(section.offsetHeight);
        if (titleLineFill) titleLineFill.style.clipPath = "inset(0 0 0 0)";
      }

      const refreshOnImageLoad = refreshAfterLayout;
      images.forEach((image) => {
        if (!image.complete)
          image.addEventListener("load", refreshOnImageLoad, { once: true });
      });

      return () => {
        isActive = false;
        cancelAnimationFrame(layoutRefreshFrame);
        cancelAnimationFrame(finalRefreshFrame);
        window.removeEventListener("load", refreshAfterLayout);
        images.forEach((image) =>
          image.removeEventListener("load", refreshOnImageLoad),
        );
        contentObserver?.disconnect();
        lineTrigger?.kill();
      };
    };

    media.add(
      "(min-width: 901px) and (prefers-reduced-motion: no-preference)",
      () => storiesSetup(false),
    );
    media.add(
      "(max-width: 900px) and (prefers-reduced-motion: no-preference)",
      () => storiesSetup(true),
    );
    media.add("(min-width: 901px) and (prefers-reduced-motion: reduce)", () =>
      storiesSetup(false, true),
    );
    media.add("(max-width: 900px) and (prefers-reduced-motion: reduce)", () =>
      storiesSetup(true, true),
    );

    return () => media.revert();
  }, [stories.length]);

  return (
    <section ref={sectionRef} className="renewal-stories">
      <svg
        ref={lineRef}
        className="renewal-stories__center-line"
        viewBox="0 0 8 2904"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <clipPath id={lineClipId} clipPathUnits="userSpaceOnUse">
            <rect ref={lineProgressRef} x="0" y="0" width="8" height="0" />
          </clipPath>
        </defs>
        <g data-line-group="base" className="renewal-stories__line-base">
          {stories.map((story) => (
            <Fragment key={`base-${story.title}`}>
              <path data-line-segment />
              <circle data-line-dot cx="4" r="4" />
            </Fragment>
          ))}
          <path data-line-tail />
        </g>
        <g
          data-line-group="progress"
          className="renewal-stories__line-progress"
          clipPath={`url(#${lineClipId})`}
        >
          {stories.map((story) => (
            <Fragment key={`progress-${story.title}`}>
              <path data-line-segment />
              <circle data-line-dot cx="4" r="4" />
            </Fragment>
          ))}
          <path data-line-tail />
        </g>
      </svg>
      {stories.map((story, index) => (
        <Link
          key={story.title}
          className={`renewal-story renewal-story--${index + 1}`}
          to={story.to}
        >
          <img src={asset(story.image)} alt="" />
          <div className="renewal-story__copy">
            <h3>
              {(story.titleLines || [story.title]).map((line) => (
                <span key={line}>{line}</span>
              ))}
            </h3>
            <strong>{story.place}</strong>
            <p>{story.copy}</p>
          </div>
        </Link>
      ))}
    </section>
  );
}

function positionGuideVisual(index, linksRef, visualsRef) {
  const row = linksRef.current?.querySelectorAll(".renewal-guide__link")[index];
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
    "휴관 및 운영시간 · 전시 관람 제한 · 시설 이용 안내 · 주요 공지사항",
    "전시 예약 · 시승 예약 · 프로그램 예약 · 콘텐츠 일정 한눈에 보기",
    "예약 내역 확인 · 일정 변경/취소 · 이용 유의사항 · 방문 준비 확인",
    "웰컴 패키지 · 전시/프로그램 할인 · 멤버십 라운지 · 회원 전용 콘텐츠",
    "신규 전시 소식 · 모빌리티 이야기 · 공간별 주요 소식 · 브랜드 콘텐츠",
  ];
  const visuals = [
    "guide-before.svg",
    "guide-plan.svg",
    "guide-schedule.svg",
    "guide-club.svg",
    "guide-new.svg",
  ];

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const menu = linksRef.current;
    if (!section || !menu || links.length < 2) return undefined;

    const media = gsap.matchMedia();
    const setupFrame = requestAnimationFrame(() => {
      media.add("(min-width: 901px)", () => {
        const rows = [...menu.querySelectorAll(".renewal-guide__link")];
        let previousIndex = -1;
        const rowStops = rows.map((row) => row.offsetTop);
        const movementStart = rowStops[0];
        const movementEnd = rowStops.at(-1);
        const emphasisRange = rows[0].getBoundingClientRect().height * 1.1;
        const updateActiveRow = (self) => {
          const currentPosition = self.progress * (movementEnd - movementStart);
          let index = rowStops.length - 1;
          for (
            let rowIndex = 0;
            rowIndex < rowStops.length - 1;
            rowIndex += 1
          ) {
            if (
              currentPosition <
              (rowStops[rowIndex] + rowStops[rowIndex + 1]) / 2
            ) {
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
            const opacity = gsap.utils.clamp(
              0.22,
              1,
              1 - distance / emphasisRange,
            );
            row.style.setProperty("--scroll-emphasis", opacity.toFixed(3));
            row.style.setProperty(
              "--description-emphasis",
              gsap.utils.clamp(0, (opacity - 0.22) / 0.78, 1).toFixed(3),
            );
          });
        };

        const movement = gsap.to(menu, {
          y: () => {
            const scrollTravel = section.offsetHeight - window.innerHeight;
            const firstRowCenter =
              menu.parentElement.offsetTop +
              menu.offsetTop +
              rows[0].offsetTop +
              rows[0].getBoundingClientRect().height / 2;
            return (
              window.innerHeight / 2 -
              firstRowCenter -
              movementEnd +
              scrollTravel
            );
          },
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.45,
            invalidateOnRefresh: true,
            onUpdate: updateActiveRow,
            onRefresh: updateActiveRow,
          },
        });

        return () => {
          movement.scrollTrigger?.kill();
          movement.kill();
          gsap.set(menu, { clearProps: "transform" });
        };
      });
    });

    return () => {
      cancelAnimationFrame(setupFrame);
      media.revert();
    };
  }, [links.length]);

  return (
    <section
      ref={sectionRef}
      className="renewal-guide"
      aria-labelledby="renewal-guide-title"
    >
      <div className="renewal-guide__stage">
        <header>
          <h2 id="renewal-guide-title">
            VISITOR
            <br />
            INFORMATION
          </h2>
          <p>현대모터스튜디오 이용안내</p>
        </header>
        <div
          ref={visualsRef}
          className="renewal-guide__visuals"
          aria-hidden="true"
        >
          {visuals.map((visual, index) => (
            <div
              key={visual}
              className={`renewal-guide__visual renewal-guide__visual--${index + 1}${hoverIndex === index ? " is-active" : ""}`}
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
                className={`renewal-guide__link${activeIndex === index ? " is-active" : ""}${hoverIndex === index ? " is-hovered" : ""}`}
                onPointerEnter={() => {
                  setHoverIndex(index);
                  requestAnimationFrame(() =>
                    positionGuideVisual(index, linksRef, visualsRef),
                  );
                }}
                onFocus={() => {
                  setHoverIndex(index);
                  requestAnimationFrame(() =>
                    positionGuideVisual(index, linksRef, visualsRef),
                  );
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
