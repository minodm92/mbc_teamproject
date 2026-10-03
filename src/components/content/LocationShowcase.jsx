import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { locationShowcase } from "./data/locationShowcase";
import LocationDetails from "./LocationDetails";
import "./LocationShowcase.css";

gsap.registerPlugin(ScrollTrigger, Flip);

const INTRO_TIMING = {
  decodeCap: 3, // seconds to wait for the logo and photo to decode before the intro starts anyway
  hold: 1.2, // first scene (black background, small logo, photo bottom-right) stays this long after decode
  move: 0.8, // step 1: logo grows and rises to its final top position
  color: 0.8, // step 2: background to white, logo to black, header fades in
  lead: 0.3, // step 2 starts this long before step 1 ends, so the two overlap
  from: "#0f0f0f",
};

// PROGRAM reveal tuning. start/end are viewport percentages for the image frame's top edge.
// All four program images share these values so they move and finish together.
const PROGRAM_REVEAL = {
  start: 92,
  end: 50,
  scrub: 1,
};

// HERO sequence (1440px+, non-intro). Values are on the 1920px canvas; unit() scales them.
// Logo and photo share one start/duration, so they move in the same scroll window.
const HERO_REVEAL = {
  scrub: 0.5,
  logoStartScale: 0.5,
  // Photo card -> centred middle -> FULL. One progress value drives clipPath and picture transform (scrub 0.5).
  start: 0.4, // photo holds its small card state, then starts expanding here
  duration: 0.4, // ends at 0.8: phase 1 (card -> middle) 0.4-0.6, phase 2 (middle -> FULL) 0.6-0.8
  // Logo and HERO background run across most of the pin, from the first scroll step.
  logoStart: 0,
  logoDuration: 1.05,
  // Logo scale and y run on separate windows (timeline units; the pin timeline is 1.25 long).
  logoScaleStart: 0, // 0% of pin
  logoScaleDuration: 1.0625, // ends at 85%
  logoYStart: 0.125, // 10% of pin: y stays near the centre before this
  logoYDuration: 1.0625, // ends at 95%, reaching the top position
  // Desktop pin length in viewport heights. Longer pin = less logo travel per wheel notch.
  pinLength: 3,
  backgroundFrom: "#000",
  backgroundTo: "#fff",
  cardLeft: 1632,
  cardTop: 626,
  cardWidth: 268,
  cardHeight: 153,
  imageAspect: 402 / 230,
};

const information = [
  ["hours", "운영시간"],
  ["closed", "휴관일"],
  ["address", "주소"],
  ["price", "이용요금"],
];

export default function LocationShowcase({ intro = false }) {
  const rootRef = useRef(null);
  const [introVisible, setIntroVisible] = useState(intro);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const media = gsap.matchMedia();
    const introMotionEnabled =
      intro &&
      window.matchMedia("(prefers-reduced-motion: no-preference)").matches;

    if (intro) {
      // Reloads must not restore a scroll position: the intro always starts at the top.
      if ("scrollRestoration" in window.history) window.history.scrollRestoration = "manual";
      // Keep the scrollbar lane reserved, so the layout width does not change when the page becomes scrollable.
      document.documentElement.style.scrollbarGutter = "stable";
      window.scrollTo(0, 0);
      const hero = root.querySelector(".location-hero");
      const title = root.querySelector(".location-hero__wordmark");
      const titleImage = title?.querySelector("img");
      const header = document.querySelector(".site-header");
      if (hero && title && titleImage) {
        media.add(
          "(prefers-reduced-motion: no-preference)",
          () => {
            // State A: black background, small white logo at the centre, header hidden. The photo is not touched here.
            const mainColor =
              getComputedStyle(root).getPropertyValue("--color-main-1").trim() || "#fff";
            gsap.set(hero, { backgroundColor: INTRO_TIMING.from });
            gsap.set(titleImage, { filter: "brightness(0) invert(1)" });
            if (header) gsap.set(header, { autoAlpha: 0 });
            // Promote the logo to its own layer while the first scene is shown, so the layer is ready before the move.
            title.style.willChange = "transform";

            let finished = false;
            const finish = () => {
              if (finished) return;
              finished = true;
              gsap.set(hero, { clearProps: "backgroundColor" });
              gsap.set(titleImage, { clearProps: "filter" });
              if (header) gsap.set(header, { clearProps: "opacity,visibility,transform" });
              // Flip leaves absolute positioning on the title; clear it so the final layout is the normal flow.
              gsap.set(title, { clearProps: "all" });
              document.documentElement.style.background = ""; // back to the normal page background
              root.classList.remove("location-showcase--intro");
              setIntroVisible(false);
              const expansion = ScrollTrigger.getById("studio-hero-expansion");
              expansion?.enable(false, true);
              ScrollTrigger.refresh();
            };
            const timeline = gsap.timeline({
              paused: true,
              onComplete: () => finish(),
            });
            // Step 1: the logo grows and rises to its final top position. Colours hold.
            // Step 1: the logo is laid out at its final frame (left 20, top 101, width clientWidth - 40) from the start,
            // and only a transform carries it from the centred small frame: transform-origin 0 0,
            // scale = small width / large width, translate = the difference of the two top-left corners.
            timeline.call(
              () => {
                root.classList.remove("location-showcase--intro");
                const W = hero.clientWidth;
                const bigW = W - 40;
                const smallW = W * 0.551042;
                const s0 = smallW / bigW;
                const smallLeft = (W - smallW) / 2;
                const smallTop = document.documentElement.clientHeight * 0.527 - (smallW * 113) / 1880 / 2;
                // The transform is written as a string from a plain progress object, so GSAP never reads the
                // intro CSS transform. Only transform changes during the move.
                const move = { x: smallLeft - 20, y: smallTop - 101, s: s0 };
                const writeMove = () => {
                  title.style.transformOrigin = "0 0";
                  title.style.transform = `translate3d(${move.x}px, ${move.y}px, 0) scale(${move.s})`;
                };
                writeMove();
                timeline.add(
                  gsap.to(move, {
                    x: 0,
                    y: 0,
                    s: 1,
                    duration: INTRO_TIMING.move,
                    ease: "expo.inOut",
                    force3D: true,
                    onUpdate: writeMove,
                    onComplete: () => {
                      title.style.transform = "none";
                    },
                  }),
                  0,
                );
              },
              null,
              0,
            );
            // Step 2 starts lead seconds before step 1 ends (overlap): background and logo colour turn, header rises 8px.
            const step2 = INTRO_TIMING.move - INTRO_TIMING.lead;
            timeline
              .to(hero, { backgroundColor: mainColor, duration: INTRO_TIMING.color, ease: "power2.inOut" }, step2)
              .to(titleImage, { filter: "brightness(0) invert(0)", duration: INTRO_TIMING.color, ease: "power2.inOut" }, step2);
            if (header)
              timeline.fromTo(header, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: "power2.out" }, step2);

            // State A waits until the logo and photo are decoded, then holds for INTRO_TIMING.hold seconds.
            let disposed = false;
            let startTimer = 0;
            const decoded = [titleImage, root.querySelector(".location-hero__image")]
              .filter(Boolean)
              .map((img) => (img.decode ? img.decode().catch(() => {}) : Promise.resolve()));
            // A slow photo must not stall the intro: start after decode, or after the cap, whichever comes first.
            // The cap counts from the logo's decode, so the wait does not run out before the logo is on screen.
            const cap = decoded[0].then(() => new Promise((resolve) => window.setTimeout(resolve, INTRO_TIMING.decodeCap * 1000)));
            Promise.race([Promise.all(decoded), cap]).then(() => {
              // Count the hold from the first painted frame of the black first scene (two frames to be sure it is on screen).
              window.requestAnimationFrame(() =>
                window.requestAnimationFrame(() => {
                  if (!disposed) startTimer = window.setTimeout(() => timeline.play(), INTRO_TIMING.hold * 1000);
                }),
              );
            });

            // Only real user input skips the intro: wheel, touch move, and scroll keys. Scroll events from the browser's
            // scroll restoration or from ScrollTrigger do not count.
            const skipEvents = ["wheel", "touchmove"];
            const skipKeys = ["ArrowDown", "ArrowUp", "PageDown", "PageUp", "End", "Home", " "];
            const skip = (event) => {
              console.log(`[intro] skipped by ${event.type}${event.key ? ` (${event.key})` : ""}`);
              window.clearTimeout(startTimer);
              timeline.progress(1);
              timeline.kill();
              finish();
            };
            const onKey = (event) => {
              if (skipKeys.includes(event.key)) skip(event);
            };
            skipEvents.forEach((e) => window.addEventListener(e, skip, { once: true, passive: true }));
            window.addEventListener("keydown", onKey);

            return () => {
              disposed = true;
              window.clearTimeout(startTimer);
              skipEvents.forEach((e) => window.removeEventListener(e, skip));
              window.removeEventListener("keydown", onKey);
              timeline.kill();
              if (header)
                gsap.set(header, { clearProps: "opacity,visibility" });
              // Leaving /motorstudio (or unmounting) restores the page-level styles set above.
              document.documentElement.style.scrollbarGutter = "";
              document.documentElement.style.background = "";
            };
          },
          root,
        );
        media.add(
          "(prefers-reduced-motion: reduce)",
          () => {
            root.classList.remove("location-showcase--intro");
            setIntroVisible(false);
          },
          root,
        );
      }
    }

    media.add(
      "(max-width: 1439px) and (prefers-reduced-motion: no-preference)",
      () => {
        if (!intro) {
          gsap.from(".location-hero__image", {
            scale: 1.06,
            duration: 1.2,
            ease: "power2.out",
          });
          gsap.from(".location-hero__wordmark", {
            opacity: 0,
            y: 20,
            duration: 1,
            ease: "power2.out",
          });
        }
      },
      root,
    );

    media.add(
      "(min-width: 1440px) and (prefers-reduced-motion: no-preference)",
      () => {
        const hero = root.querySelector(".location-hero");
        const visual = root.querySelector(".location-hero__visual");
        const unit = () => Math.min(root.clientWidth, 1920) / 1920; // capped at the 1920 canvas
        // The intro hero is exactly the viewport height, so its bottom edge is the bottom of the screen.
        const heroHeight = () =>
          intro ? document.documentElement.clientHeight : Math.max(window.innerHeight, 101 + 779 * unit());
        gsap.set(hero, {
          height: heroHeight,
          position: "relative",
          overflow: "hidden",
        });
        gsap.set(".studio-hero-wide", { display: "none" });
        if (!intro) gsap.set(visual, { position: "absolute", maxWidth: "none", zIndex: 1 });
        // Non-intro desktop: logo and photo are driven by transforms. The intro keeps its own tweens below.
        const sequence = !intro;
        const wordmark = root.querySelector(".location-hero__wordmark");
        const picture = root.querySelector(".location-hero__image");
        const imageAspect = HERO_REVEAL.imageAspect;
        const pictureStart = () => ({
          scale: HERO_REVEAL.cardWidth / 1920,
          x: HERO_REVEAL.cardLeft * unit(),
          y: 101 + HERO_REVEAL.cardTop * unit(),
        });
        // Cover-fit the picture into a window (fractions of the hero width/height), centred on the screen.
        // Picture centre always equals window centre, so the frame and the photo move as one object.
        const pictureCover = (fractionW, fractionH) => {
          const width = root.clientWidth;
          const height = heroHeight();
          const layoutHeight = width / imageAspect;
          const scale = Math.max(fractionW, (fractionH * height) / layoutHeight);
          return {
            scale,
            x: (width - scale * width) / 2,
            y: (height - scale * layoutHeight) / 2,
          };
        };
        // Card window as inset() percentages [top, right, bottom, left] of the full-size visual box.
        const cardInsets = () => {
          const width = root.clientWidth;
          const height = heroHeight();
          const left = HERO_REVEAL.cardLeft * unit();
          const top = 101 + HERO_REVEAL.cardTop * unit();
          const cardWidth = HERO_REVEAL.cardWidth * unit();
          const cardHeight = HERO_REVEAL.cardHeight * unit();
          return [
            (top / height) * 100,
            ((width - left - cardWidth) / width) * 100,
            ((height - top - cardHeight) / height) * 100,
            (left / width) * 100,
          ];
        };
        const insetOf = ([top, right, bottom, left]) =>
          `inset(${top}% ${right}% ${bottom}% ${left}%)`;
        // Same curves as GSAP power1.inOut and power1.in, applied to one shared progress value.
        const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - 2 * (1 - t) * (1 - t));
        const easeIn = (t) => t * t;
        const lerp = (a, b, t) => a + (b - a) * t;
        const photoKeys = {
          card: () => ({ insets: cardInsets(), ...pictureStart() }),
          middle: () => ({ insets: [25, 25, 25, 25], ...pictureCover(0.5, 0.5) }),
          full: () => ({ insets: [0, 0, 0, 0], ...pictureCover(1, 1) }),
        };
        const photo = { u: 0 };
        let photoLatched = false;
        // u 0 -> 0.5: card to centred middle (ease in-out). u 0.5 -> 1: middle to FULL around the centre (ease in).
        // Both clipPath and picture read the same keys and the same t, so they never drift apart.
        // Once FULL is reached the photo latches, so scrolling back up or scrub catch-up cannot move it.
        const applyPhoto = (value) => {
          if (value >= 1) photoLatched = true;
          const u = photoLatched ? 1 : value;
          const firstPhase = u < 0.5;
          const from = firstPhase ? photoKeys.card() : photoKeys.middle();
          const to = firstPhase ? photoKeys.middle() : photoKeys.full();
          const t = firstPhase ? easeInOut(u / 0.5) : easeIn((u - 0.5) / 0.5);
          gsap.set(visual, {
            clipPath: insetOf(from.insets.map((v, i) => lerp(v, to.insets[i], t))),
          });
          gsap.set(picture, {
            x: lerp(from.x, to.x, t),
            y: lerp(from.y, to.y, t),
            scale: lerp(from.scale, to.scale, t),
          });
        };
        // Logo starts centred at half its size, then grows and rises to the top wordmark position.
        const logoStartY = () =>
          heroHeight() / 2 - (113 * unit() * HERO_REVEAL.logoStartScale) / 2 - 101;
        const setStaticSizes = () => {
          if (!sequence) return;
          gsap.set(visual, {
            left: 0,
            top: 0,
            width: () => root.clientWidth,
            height: heroHeight,
          });
          gsap.set(picture, {
            position: "absolute",
            left: 0,
            top: 0,
            maxWidth: "none",
            width: () => root.clientWidth,
            height: () => root.clientWidth / imageAspect,
          });
        };
        if (sequence) {
          gsap.set(wordmark, { transformOrigin: "50% 0%" });
          gsap.set(picture, { transformOrigin: "0 0" });
          setStaticSizes();
          applyPhoto(0);
        }
        let lastStep = 0; // intro only: last resting step (0 = below 70%)
        const photoProgress = { p: 0 }; // intro only: scrubbed progress for the photo
        const introSteps = [0.7, 0.85, 1];
        // Intro only: the photo frame as a function of pin progress. 0 = bottom-right card (268 x 153),
        // 0.7 = centred 70%, 0.85 = centred 85%, 1 = full screen. Linear between the keys.
        const applyIntroCard = (progress) => {
          // At the card the CSS rule places the photo, so no inline size is left behind. The scrubbed progress can settle at
          // a tiny non-zero value, so anything below 0.0005 counts as the card.
          if (progress <= 0.0005) {
            gsap.set(visual, { clearProps: "left,top,width,height" });
            return;
          }
          const W = root.clientWidth;
          const H = heroHeight();
          const frame = (fraction) => {
            const w = W * fraction;
            const h = (w * 153) / 268;
            return { left: (W - w) / 2, top: (H - h) / 2, width: w, height: h };
          };
          const keys = [
            [0, { left: W - 20 - 268, top: H - 153, width: 268, height: 153 }],
            [0.7, frame(0.7)],
            [0.85, frame(0.85)],
            [1, { left: 0, top: 0, width: W, height: H }],
          ];
          let a = keys[0];
          let b = keys[1];
          for (let i = 0; i < keys.length - 1; i++) {
            if (progress >= keys[i][0] && progress <= keys[i + 1][0]) {
              a = keys[i];
              b = keys[i + 1];
              break;
            }
          }
          const u = Math.min(1, Math.max(0, (progress - a[0]) / (b[0] - a[0])));
          const mix = (k) => a[1][k] + (b[1][k] - a[1][k]) * u;
          gsap.set(visual, { left: mix("left"), top: mix("top"), width: mix("width"), height: mix("height") });
        };
        const expansion = gsap.timeline({
          scrollTrigger: {
            id: "studio-hero-expansion",
            trigger: hero,
            start: "top top",
            end: () =>
              `+=${document.documentElement.clientHeight * (sequence ? HERO_REVEAL.pinLength : 1.8)}`,
            pin: true,
            pinType: "transform",
            scrub: sequence ? HERO_REVEAL.scrub : 1.5,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onRefreshInit: () => {
              gsap.set(hero, { height: heroHeight });
              setStaticSizes();
              if (sequence) applyPhoto(photo.u);
            },
            // Intro only: at full progress the photo is exactly full-bleed (scrub lag would leave a few px).
            onUpdate: (self) => {
              if (sequence) return;
              const progress = self.progress;
              if (progress < 0.7) lastStep = 0;
            },
            ...(sequence
              ? {}
              : {
                  // Below 70% scrolling is free. From 70% each gesture moves one step (70 -> 85 -> 100 and back),
                  // so a hard flick cannot skip 85%.
                  snap: {
                    snapTo: (value) => {
                      if (value < 0.7) return value;
                      if (value > lastStep) {
                        if (value - lastStep < 0.02) return lastStep;
                        return introSteps.find((step) => step > lastStep) ?? 1;
                      }
                      return [...introSteps].reverse().find((step) => step < lastStep) ?? value;
                    },
                    duration: 0.6,
                    ease: "power3.out",
                    inertia: false,
                  },
                  onSnapComplete: (self) => {
                    const p = self.progress;
                    lastStep = p < 0.7 ? 0 : introSteps.reduce((best, step) => (Math.abs(step - p) < Math.abs(best - p) ? step : best));
                  },
                }),
          },
        });
        if (introMotionEnabled) expansion.scrollTrigger.disable(false);
        if (!sequence) applyIntroCard(0); // start the intro photo at its bottom-right card
        if (sequence) {
          expansion
            // Logo grows from the first scroll step; its y move starts later and eases into the top position.
            .fromTo(
              wordmark,
              { scale: HERO_REVEAL.logoStartScale },
              {
                scale: 1,
                duration: HERO_REVEAL.logoScaleDuration,
                ease: "none",
              },
              HERO_REVEAL.logoScaleStart,
            )
            .fromTo(
              wordmark,
              { y: logoStartY },
              {
                y: 0,
                duration: HERO_REVEAL.logoYDuration,
                ease: "none",
              },
              HERO_REVEAL.logoYStart,
            )
            .fromTo(
              hero,
              { backgroundColor: HERO_REVEAL.backgroundFrom },
              {
                backgroundColor: HERO_REVEAL.backgroundTo,
                duration: HERO_REVEAL.logoDuration,
                ease: "none",
              },
              HERO_REVEAL.logoStart,
            )
            // The wordmark is a single-colour #111 SVG. brightness(0) makes it a silhouette, and invert sets
            // its colour: white on the black start, black on the white end (same filter pattern as the intro).
            .fromTo(
              wordmark.querySelector("img"),
              { filter: "brightness(0) invert(1)" },
              {
                filter: "brightness(0) invert(0)",
                duration: HERO_REVEAL.logoDuration,
                ease: "none",
              },
              HERO_REVEAL.logoStart,
            )
            .fromTo(
              photo,
              { u: 0 },
              {
                u: 1,
                duration: HERO_REVEAL.duration,
                ease: "none",
                onUpdate: () => applyPhoto(photo.u),
              },
              HERO_REVEAL.start,
            );
        } else {
          expansion
            .to(
              ".location-hero__wordmark",
              { opacity: 0, y: -25, duration: 0.3, ease: "power2.out" },
              0.3,
            )
            ;
          // The scrub covers only 0-70% of the pin: a fixed 1.0-long timeline keeps 0.7 at the end of the tween above.
          expansion.set({}, {}, 1);
          // The intro photo follows the scrubbed progress (scrub 1.5), so it lags the wheel slightly and stays smooth.
          expansion.to(photoProgress, { p: 1, duration: 1, ease: "none", onUpdate: () => applyIntroCard(photoProgress.p) }, 0);
        }
        if (sequence) expansion.to({}, { duration: 0.2 });
        root.querySelectorAll(".studio-copy").forEach((copy) => {
          // PROGRAM copy is handled below so it can latch after its first reveal.
          if (copy.closest(".studio-programs")) return;
          gsap.from(copy, {
            opacity: 0,
            y: 24,
            duration: 0.9,
            ease: "power2.out",
            scrollTrigger: {
              trigger: copy,
              start: "top 94%",
              toggleActions: "play none none reverse",
            },
          });
        });
        // PROGRAM copy: same entrance, but "none" on leave-back keeps it visible once shown.
        root.querySelectorAll(".studio-programs .studio-copy").forEach((copy) => {
          gsap.from(copy, {
            opacity: 0,
            y: 24,
            duration: 0.9,
            ease: "power2.out",
            scrollTrigger: {
              trigger: copy,
              start: "top 94%",
              toggleActions: "play none none none",
            },
          });
        });
        root.querySelectorAll(".studio-mask").forEach((frame) => {
          // The avante photo is driven by the Senayan pin timeline below instead.
          if (sequence && frame.closest(".studio-avante")) return;
          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: frame,
              start: "top 90%",
              end: "top 15%",
              scrub: 1,
            },
          });
          timeline
            .from(
              frame,
              { clipPath: "inset(15% 0 0 0)", ease: "power2.out" },
              0,
            )
            .from(
              frame.querySelector("img"),
              { scale: 1.08, ease: "power2.out" },
              0,
            );
        });
        // Senayan Park pin: the last location card is pinned for one viewport while the avante photo, which
        // follows it in the DOM, rises from the bottom edge and fills the screen. One ScrollTrigger drives it.
        const senayanCard = root.querySelector(".loc.is-last");
        const avanteMedia = root.querySelector(".studio-avante__media");
        if (sequence && senayanCard && avanteMedia) {
          root.classList.add("location-showcase--senayan-pin");
          // Natural gap = photo top - Senayan bottom, in document coordinates, with the photo's transform cleared.
          // The pin wrapper (.pin-spacer) starts where the card's natural top is, so its rect gives that top
          // even while the card is pinned.
          let senayanGap = 0;
          // The whole AVANTE section (photo + copy) moves together, so nothing is left behind at the old spot.
          const avanteSection = avanteMedia.closest(".studio-avante") || avanteMedia;
          // Gap = AVANTE section top - pin wrapper bottom. The section's own transform is cleared first.
          const measureSenayanGap = () => {
            gsap.set(avanteSection, { y: 0 });
            const spacer = senayanCard.parentElement;
            const cardBox = spacer?.classList.contains("pin-spacer") ? spacer : senayanCard;
            senayanGap = avanteSection.getBoundingClientRect().top - cardBox.getBoundingClientRect().bottom;
          };
          measureSenayanGap();
          const pinTimeline = gsap.timeline({
            scrollTrigger: {
              id: "senayan-pin",
              trigger: senayanCard,
              start: "top top",
              // Pin length is the gap itself, with a minimum, so the photo closes the gap as the page scrolls.
              end: () => `+=${Math.max(senayanGap, window.innerHeight * 0.5)}`,
              pin: true,
              scrub: 0.5,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onRefreshInit: measureSenayanGap,
            },
          });
          // The pin wrapper does not push the section down in this layout, so the page scroll moves it up by the
          // pin length. The translate (-gap, where gap already includes that spacer) cancels that, so the visual
          // gap reaches 0 exactly at pin end.
          pinTimeline
            .fromTo(
              avanteSection,
              { y: 0 },
              { y: () => -senayanGap, duration: 1, ease: "none" },
              0,
            )
            .fromTo(
              avanteMedia,
              { clipPath: "inset(15% 0% 0% 0%)" },
              { clipPath: "inset(0% 0% 0% 0%)", duration: 1, ease: "none" },
              0,
            )
            .fromTo(
              ".studio-avante__media img",
              { scale: 1.08 },
              { scale: 1, duration: 1, ease: "none" },
              0,
            );
        }
        root.querySelectorAll(".studio-vehicle__image").forEach((frame) => {
          gsap.from(frame.querySelector("img"), {
            scale: 1.04,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: frame,
              start: "top 92%",
              toggleActions: "play none none reverse",
            },
          });
        });
        // Program reveal: the wrapper clip and the image translate share one progress value,
        // so the visible window always ends exactly at the image's leading edge (no gap).
        root.querySelectorAll(".studio-program__image").forEach((frame) => {
          const image = frame.querySelector("img");
          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: frame,
              start: `top ${PROGRAM_REVEAL.start}%`,
              end: `top ${PROGRAM_REVEAL.end}%`,
              scrub: PROGRAM_REVEAL.scrub,
              // onComplete does not fire for scrubbed playback, so watch the scroll progress instead.
              // Once it reaches 1, finish the timeline, release the scrub link, and pin the final state.
              onUpdate: (self) => {
                if (self.progress < 1) return;
                self.animation?.progress(1);
                self.kill();
                gsap.set(frame, { clipPath: "inset(0% 0% 0% 0%)" });
                gsap.set(image, { yPercent: 0 });
              },
            },
          });
          timeline
            .fromTo(
              frame,
              { clipPath: "inset(0% 0% 100% 0%)" },
              { clipPath: "inset(0% 0% 0% 0%)", ease: "none" },
              0,
            )
            .fromTo(
              image,
              { yPercent: -100 },
              { yPercent: 0, ease: "none" },
              0,
            );
        });
      },
      root,
    );

    media.add(
      "(min-width: 768px) and (max-width: 1439px) and (prefers-reduced-motion: no-preference)",
      () => {
        const hero = root.querySelector(".location-hero");

        // Keep parallax within 30px of the Figma resting coordinates.
        gsap
          .timeline({
            scrollTrigger: {
              trigger: hero,
              start: "top top",
              end: "bottom top",
              scrub: 1,
            },
          })
          .to(".location-hero__crop", { y: -15, ease: "none" }, 0)
          .to(".location-hero__wordmark", { y: 30, ease: "none" }, 0);
      },
      root,
    );

    const locations = root.querySelector(".locations");
    const cardsContainer = root.querySelector(".locations__cards");
    const cards = [...root.querySelectorAll(".loc")];
    let metrics = [];
    let firstCardHeight = 0;
    let frame = 0;
    let previousScrollY = -1;

    const clamp = (value) => Math.min(1, Math.max(0, value));
    const round = (value) => Math.round(value * 1000) / 1000;
    const measureLocations = () => {
      const configuredBar = Number.parseFloat(
        getComputedStyle(locations).getPropertyValue("--bar"),
      );
      const bar = Number.isFinite(configuredBar)
        ? configuredBar
        : cards[0].querySelector(".loc__bar").offsetHeight;
      const firstStackedCard = cards[1];
      const firstStackedIndex = Number.parseFloat(
        firstStackedCard?.style.getPropertyValue("--i"),
      );
      const configuredStackStep =
        firstStackedCard && firstStackedIndex
          ? Number.parseFloat(getComputedStyle(firstStackedCard).top) /
            firstStackedIndex
          : Number.NaN;
      const stackStep = Number.isFinite(configuredStackStep)
        ? configuredStackStep
        : bar;
      const sectionTop = locations.getBoundingClientRect().top + window.scrollY;
      const cardsTop =
        cardsContainer.getBoundingClientRect().top + window.scrollY;
      let naturalTop = cardsTop;
      firstCardHeight = cards[0]?.offsetHeight || window.innerHeight;
      metrics = cards.map((card, index) => {
        const result = { naturalTop, stick: index * stackStep };
        naturalTop += card.offsetHeight;
        return result;
      });
      locations.style.setProperty(
        "--locations-document-top",
        `${sectionTop}px`,
      );
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
        card.classList.toggle("is-active", active);
        let cover = 0;
        if (metrics[index + 1]) {
          const nextStart = metrics[index + 1].naturalTop - firstCardHeight;
          const nextStuck =
            metrics[index + 1].naturalTop - metrics[index + 1].stick;
          cover = clamp(
            (scrollY - nextStart) / Math.max(1, nextStuck - nextStart),
          );
        }
        cover = round(cover);
        card.style.setProperty(
          "--card-opacity",
          String(round(1 - cover * 0.5)),
        );
      });
    };
    const requestLocationsUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(updateLocations);
    };
    window.addEventListener("scroll", requestLocationsUpdate, {
      passive: true,
    });
    window.addEventListener("resize", measureLocations);
    window.addEventListener("load", measureLocations);
    measureLocations();

    // Image dimensions are reserved in CSS; refresh once web fonts have settled.
    let disposed = false;
    document.fonts.ready.then(() => {
      if (!disposed) {
        measureLocations();
        ScrollTrigger.refresh();
      }
    });
    return () => {
      disposed = true;
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestLocationsUpdate);
      window.removeEventListener("resize", measureLocations);
      window.removeEventListener("load", measureLocations);
      root.classList.remove("location-showcase--senayan-pin");
      media.revert();
    };
  }, [intro]);

  return (
    <div
      className={`location-showcase${introVisible ? " location-showcase--intro" : ""}${intro ? " location-showcase--motorstudio" : ""}`}
      ref={rootRef}
    >
      <section className="location-hero" aria-label="현대 모터스튜디오">
        <h1 className="location-hero__wordmark">
          <img
            src="/images/locations/figma/wordmark.svg"
            alt="HYUNDAI MOTORSTUDIO"
            width="1880"
            height="113"
          />
        </h1>
        <div className="location-hero__visual">
          <div className="location-hero__crop">
            <img
              className="location-hero__image"
              src="/images/locations/figma/hero.webp"
              alt="현대 모터스튜디오의 푸른 미디어 전시 공간"
              width="402"
              height="230"
              fetchPriority="high"
            />
          </div>
        </div>
      </section>
      <section
        className="studio-hero-wide studio-desktop"
        aria-label="현대 모터스튜디오 미디어 공간"
      >
        <img
          src="/images/locations/figma/hero-wide.svg"
          alt="현대 모터스튜디오의 몰입형 미디어 공간"
        />
      </section>
      <section
        className="studio-intro studio-desktop"
        aria-labelledby="studio-intro-title"
      >
        <h2 className="studio-copy" id="studio-intro-title">
          EXPLORE THE
          <br />
          POSSIBILITIES OF MOBILITY
        </h2>
        <div className="studio-intro__columns">
          <p className="studio-copy">
            현대 모터스튜디오는 자동차를 단순히 바라보는 공간을 넘어, 모빌리티가
            만들어가는 새로운 일상과 라이프스타일을 직접 경험할 수 있는 브랜드
            공간입니다. 전시와 체험을 통해 현대자동차가 그리는 미래의 이동을
            보다 가까이에서 만나볼 수 있습니다.
          </p>
          <p className="studio-copy">
            누구나 자신의 관심과 취향에 따라 현대 모터스튜디오를 자유롭게 경험할
            수 있습니다. 자동차를 살펴보고 운전하는 순간부터 디자인과 예술,
            새로운 기술을 발견하는 과정까지 다양한 콘텐츠를 통해 모빌리티를
            자신만의 방식으로 즐겨보세요.
          </p>
        </div>
      </section>
      <section className="locations" aria-labelledby="locations-title">
        <h2 id="locations-title" className="locations__title">
          LOCATIONS
        </h2>
        <div className="locations__cards">
          {locationShowcase.map((location, index) => (
            <article
              className={`loc${index === locationShowcase.length - 1 ? " is-last" : ""}`}
              key={location.id}
              data-location={location.id}
              aria-labelledby={`location-${location.id}`}
              style={{
                "--i": index,
                "--loc-background": location.background,
                "--loc-color": location.color,
              }}
            >
              <div className="loc__bar">
                <h3 id={`location-${location.id}`}>{location.title}</h3>
              </div>
              <div className="loc__inner">
                <ul className="loc__keywords">
                  {location.keywords.map((keyword) => (
                    <li key={keyword}>{keyword}</li>
                  ))}
                </ul>
                <dl className="loc__info">
                  {information
                    .filter(([key]) => location[key])
                    .map(([key, label]) => (
                      <div className="loc__row" data-field={key} key={key}>
                        <dt>{label}</dt>
                        <dd>{location[key]}</dd>
                      </div>
                    ))}
                </dl>
                <div className="loc__image">
                  <img
                    src={location.image}
                    alt={`현대 모터스튜디오 ${location.name} 공간`}
                    width={location.id === "goyang" ? 712 : 714}
                    height="529"
                    decoding="async"
                  />
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
      <LocationDetails />
    </div>
  );
}
