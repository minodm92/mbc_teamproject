import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Matter from 'matter-js';
import { Instagram, Youtube, Facebook } from 'lucide-react';
import carOneUrl from '../../../public/images/footer/car-1.png';
import carTwoUrl from '../../../public/images/footer/car-2.png';
import carThreeUrl from '../../../public/images/footer/car-3.png';
import carFourUrl from '../../../public/images/footer/car-4.png';
import carFiveUrl from '../../../public/images/footer/car-5.png';
import carSixUrl from '../../../public/images/footer/car-6.png';
import carSevenUrl from '../../../public/images/footer/car-7.png';
import toyCar01Url from '../../../public/images/footer/toy-cars/toy_car_01.png';
import toyCar02Url from '../../../public/images/footer/toy-cars/toy_car_02.png';
import toyCar03Url from '../../../public/images/footer/toy-cars/toy_car_03.png';
import toyCar04Url from '../../../public/images/footer/toy-cars/toy_car_04.png';
import toyCar05Url from '../../../public/images/footer/toy-cars/toy_car_05.png';
import toyCar06Url from '../../../public/images/footer/toy-cars/toy_car_06.png';
import toyCar07Url from '../../../public/images/footer/toy-cars/toy_car_07.png';
import toyCar08Url from '../../../public/images/footer/toy-cars/toy_car_08.png';
import toyCar09Url from '../../../public/images/footer/toy-cars/toy_car_09.png';
import toyCar10Url from '../../../public/images/footer/toy-cars/toy_car_10.png';
import toyCar11Url from '../../../public/images/footer/toy-cars/toy_car_11.png';
import toyCar12Url from '../../../public/images/footer/toy-cars/toy_car_12.png';
import toyCar13Url from '../../../public/images/footer/toy-cars/toy_car_13.png';
import toyCar14Url from '../../../public/images/footer/toy-cars/toy_car_14.png';
import toyCar15Url from '../../../public/images/footer/toy-cars/toy_car_15.png';
import toyCar16Url from '../../../public/images/footer/toy-cars/toy_car_16.png';
import toyCar17Url from '../../../public/images/footer/toy-cars/toy_car_17.png';
import toyCar18Url from '../../../public/images/footer/toy-cars/toy_car_18.png';
import carRockUrl from '../../../public/images/footer/car-rock.png';
import carRockEyeUrl from '../../../public/images/footer/car-rock-eye.svg';
import carRockTwoUrl from '../../../public/images/footer/car-rock-2.png';
import carRockTwoEyeUrl from '../../../public/images/footer/car-rock-2-eye.svg';
import carRockTwoEyelidUrl from '../../../public/images/footer/car-rock-2-eyelid.svg';
import wordmarkUrl from '../../../public/images/footer/wordmark.svg';
import './Footer.css';

const randomBetween = (min, max) => min + Math.random() * (max - min);
const ALPHA_SAMPLE_WIDTH = 180;
const COLLISION_CATEGORY = {
  boundary: 0x0001,
  mainVehicle: 0x0002,
  toyCar: 0x0004,
  wordmark: 0x0008,
};
const toyCarUrls = [
  toyCar01Url, toyCar02Url, toyCar03Url, toyCar04Url, toyCar05Url, toyCar06Url,
  toyCar07Url, toyCar08Url, toyCar09Url, toyCar10Url, toyCar11Url, toyCar12Url,
  toyCar13Url, toyCar14Url, toyCar15Url, toyCar16Url, toyCar17Url, toyCar18Url,
];

function getOpaqueHull(image, displayWidth, displayHeight, Vertices) {
  if (!(image instanceof HTMLImageElement) || !image.complete || !image.naturalWidth) return null;

  try {
    const sampleWidth = Math.min(ALPHA_SAMPLE_WIDTH, image.naturalWidth);
    const sampleHeight = Math.max(1, Math.round(sampleWidth * image.naturalHeight / image.naturalWidth));
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d', { willReadFrequently: true });
    if (!context) return null;

    canvas.width = sampleWidth;
    canvas.height = sampleHeight;
    context.drawImage(image, 0, 0, sampleWidth, sampleHeight);
    const pixels = context.getImageData(0, 0, sampleWidth, sampleHeight).data;
    const points = [];
    const rowStep = Math.max(1, Math.floor(sampleHeight / 48));

    for (let y = 0; y < sampleHeight; y += rowStep) {
      let left = -1;
      let right = -1;
      for (let x = 0; x < sampleWidth; x += 1) {
        if (pixels[(y * sampleWidth + x) * 4 + 3] < 24) continue;
        if (left < 0) left = x;
        right = x;
      }
      if (left < 0) continue;
      const mappedY = (y / sampleHeight - 0.5) * displayHeight;
      points.push({ x: (left / sampleWidth - 0.5) * displayWidth, y: mappedY });
      points.push({ x: ((right + 1) / sampleWidth - 0.5) * displayWidth, y: mappedY });
    }

    return points.length >= 6 ? Vertices.hull(points) : null;
  } catch {
    return null;
  }
}

async function getWordmarkGeometry(url) {
  try {
    const svgText = await fetch(url).then((response) => response.text());
    const documentNode = new DOMParser().parseFromString(svgText, 'image/svg+xml');
    const sourceSvg = documentNode.documentElement;
    const viewBox = sourceSvg.viewBox?.baseVal;
    const host = document.createElement('div');
    host.setAttribute('aria-hidden', 'true');
    host.style.cssText = 'position:fixed;left:-10000px;top:-10000px;visibility:hidden;pointer-events:none;';
    host.innerHTML = svgText;
    document.body.appendChild(host);
    const svg = host.querySelector('svg');
    const paths = [...host.querySelectorAll('path')];
    const bounds = paths.map((path) => path.getBBox()).filter((box) => box.width > 0 && box.height > 0);
    const geometry = {
      bounds,
      width: viewBox?.width || Number(svg?.getAttribute('width')) || 1130,
      height: viewBox?.height || Number(svg?.getAttribute('height')) || 242,
    };
    host.remove();
    return geometry;
  } catch {
    return null;
  }
}

export default function Footer() {
  const { pathname } = useLocation();
  const footerRef = useRef(null);
  const stageRef = useRef(null);

  useEffect(() => {
    const footer = footerRef.current;
    const stage = stageRef.current;
    if (!footer || !stage) return undefined;

    const { Engine, Bodies, Body, Composite, Events, Vertices } = Matter;
    const elements = [...stage.querySelectorAll('[data-physics-body]')];
    const mainElements = elements.filter((element) => !element.classList.contains('reservation-footer__toy-car'));
    const toyElements = elements.filter((element) => element.classList.contains('reservation-footer__toy-car'));
    let animationFrame = 0;
    let observer;
    let engine;
    let hasPlayed = false;
    let disposed = false;

    const clearPhysicsStyles = () => {
      footer.classList.remove('is-physics-running', 'is-physics-static', 'is-toys-active');
      elements.forEach((element) => element.removeAttribute('style'));
    };

    clearPhysicsStyles();

    const startPhysics = async () => {
      if (hasPlayed) return;
      hasPlayed = true;
      observer?.disconnect();

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        footer.classList.add('is-physics-static');
        return;
      }

      const images = [...stage.querySelectorAll('img'), footer.querySelector('.reservation-footer__wordmark')].filter(Boolean);
      const wordmarkGeometryPromise = getWordmarkGeometry(wordmarkUrl);
      await Promise.all(images.map((image) => {
        if (image.complete && image.naturalWidth > 0) return Promise.resolve();
        if (typeof image.decode === 'function') return image.decode().catch(() => undefined);
        return new Promise((resolve) => {
          image.addEventListener('load', resolve, { once: true });
          image.addEventListener('error', resolve, { once: true });
        });
      }));
      const wordmarkGeometry = await wordmarkGeometryPromise;
      if (disposed) return;

      const stageRect = stage.getBoundingClientRect();
      const wordmark = footer.querySelector('.reservation-footer__wordmark');
      const visibleMainElements = mainElements.filter((element) => element.offsetWidth > 0 && element.offsetHeight > 0);
      const visibleToyElements = toyElements.filter((element) => element.offsetWidth > 0 && element.offsetHeight > 0);
      engine = Engine.create({ enableSleeping: true });
      engine.gravity.y = 1;
      engine.gravity.scale = 0.00105;

      const createBodyItem = (element, index, isToy, position) => {
        const width = element.offsetWidth;
        const height = element.offsetHeight;
        const isRock = element.classList.contains('reservation-footer__rock');
        const hitWidth = width * (isRock ? 0.76 : 0.86);
        const hitHeight = height * (isRock ? 0.76 : 0.66);
        const x = position.x;
        const y = position.y;
        const usesToyCarPhysics = isToy || !isRock;
        const options = {
          angle: randomBetween(isToy ? -0.35 : -0.16, isToy ? 0.35 : 0.16),
          restitution: usesToyCarPhysics ? 0.68 : 0.24,
          friction: usesToyCarPhysics ? 0.55 : 0.72,
          frictionStatic: usesToyCarPhysics ? 0.72 : 0.92,
          frictionAir: usesToyCarPhysics ? 0.008 : 0.012,
          density: usesToyCarPhysics ? 0.0008 : 0.0012,
          sleepThreshold: usesToyCarPhysics ? 52 : 38,
          chamfer: { radius: Math.min(hitHeight * 0.28, 30) },
          label: isToy ? 'footer-toy-car' : isRock ? 'footer-rock' : 'footer-car',
          collisionFilter: {
            category: isToy ? COLLISION_CATEGORY.toyCar : COLLISION_CATEGORY.mainVehicle,
            mask: isToy
              ? COLLISION_CATEGORY.boundary | COLLISION_CATEGORY.mainVehicle | COLLISION_CATEGORY.toyCar | COLLISION_CATEGORY.wordmark
              : COLLISION_CATEGORY.boundary | COLLISION_CATEGORY.mainVehicle | COLLISION_CATEGORY.toyCar,
          },
        };
        const opaqueHull = isRock ? null : getOpaqueHull(element, width, height, Vertices);
        const hullCenter = opaqueHull ? Vertices.centre(opaqueHull) : { x: 0, y: 0 };
        const matterBody = isRock
          ? Bodies.circle(x, y, Math.min(hitWidth, hitHeight) / 2, options)
          : opaqueHull
            ? Bodies.fromVertices(x, y, opaqueHull, options, true)
            : Bodies.rectangle(x, y, hitWidth, hitHeight, options);

        element.style.left = '0';
        element.style.right = 'auto';
        element.style.top = '0';
        element.style.bottom = 'auto';
        element.style.opacity = isToy ? '0' : '1';
        element.style.zIndex = `${index + 1}`;

        return {
          element,
          matterBody,
          width,
          height,
          renderOffset: { x: -hullCenter.x, y: -hullCenter.y },
          isToy,
        };
      };

      const mainBodies = visibleMainElements.map((element, index) => {
        const width = element.offsetWidth;
        const item = createBodyItem(element, index, false, {
          x: randomBetween(width / 2, Math.max(width / 2, stageRect.width - width / 2)),
          y: -element.offsetHeight / 2 - randomBetween(18, stageRect.height * 0.55),
        });
        Body.setVelocity(item.matterBody, { x: randomBetween(-1.4, 1.4), y: randomBetween(0.2, 1.2) });
        Body.setAngularVelocity(item.matterBody, randomBetween(-0.014, 0.014));
        return item;
      });

      const bodies = [...mainBodies];

      const boundaryOptions = {
        isStatic: true,
        restitution: 0.05,
        friction: 0.9,
        label: 'footer-boundary',
        collisionFilter: {
          category: COLLISION_CATEGORY.boundary,
          mask: COLLISION_CATEGORY.mainVehicle | COLLISION_CATEGORY.toyCar,
        },
      };
      const boundaries = [
        Bodies.rectangle(stageRect.width / 2, stageRect.height + 35, stageRect.width + 160, 70, boundaryOptions),
        Bodies.rectangle(-35, stageRect.height / 2, 70, stageRect.height * 3, boundaryOptions),
        Bodies.rectangle(stageRect.width + 35, stageRect.height / 2, 70, stageRect.height * 3, boundaryOptions),
      ];

      const wordmarkRect = wordmark?.getBoundingClientRect();
      const wordmarkOptions = {
        isStatic: true,
        friction: 0.88,
        restitution: 0.08,
        label: 'footer-wordmark-glyph',
        collisionFilter: {
          category: COLLISION_CATEGORY.wordmark,
          mask: COLLISION_CATEGORY.toyCar,
        },
      };
      const wordmarkBodies = [];

      if (wordmarkRect && wordmarkGeometry?.bounds.length) {
        const scaleX = wordmarkRect.width / wordmarkGeometry.width;
        const scaleY = wordmarkRect.height / wordmarkGeometry.height;
        const originX = wordmarkRect.left - stageRect.left;
        const originY = wordmarkRect.top - stageRect.top;

        wordmarkGeometry.bounds.forEach((box) => {
          wordmarkBodies.push(Bodies.rectangle(
            originX + (box.x + box.width / 2) * scaleX,
            originY + (box.y + box.height / 2) * scaleY,
            Math.max(3, box.width * scaleX),
            Math.max(3, box.height * scaleY),
            wordmarkOptions,
          ));
        });

        const firstLine = wordmarkGeometry.bounds.filter((box) => box.y + box.height / 2 < wordmarkGeometry.height / 2);
        const secondLine = wordmarkGeometry.bounds.filter((box) => box.y + box.height / 2 >= wordmarkGeometry.height / 2);
        const firstLineBottom = Math.max(...firstLine.map((box) => box.y + box.height));
        const secondLineTop = Math.min(...secondLine.map((box) => box.y));
        if (firstLine.length && secondLine.length && secondLineTop > firstLineBottom) {
          const gapHeight = Math.max(5, (secondLineTop - firstLineBottom) * scaleY);
          wordmarkBodies.push(Bodies.rectangle(
            originX + wordmarkRect.width / 2,
            originY + ((firstLineBottom + secondLineTop) / 2) * scaleY,
            wordmarkRect.width,
            gapHeight,
            { ...wordmarkOptions, label: 'footer-wordmark-line-gap' },
          ));
        }
      } else if (wordmarkRect) {
        wordmarkBodies.push(Bodies.rectangle(
          wordmarkRect.left - stageRect.left + wordmarkRect.width / 2,
          wordmarkRect.top - stageRect.top + wordmarkRect.height / 2,
          wordmarkRect.width,
          wordmarkRect.height,
          wordmarkOptions,
        ));
      }

      Composite.add(engine.world, [
        ...boundaries,
        ...wordmarkBodies,
        ...mainBodies.map(({ matterBody }) => matterBody),
      ]);

      footer.classList.add('is-physics-running');
      let previousTime = performance.now();
      const startTime = previousTime;
      let settledFrames = 0;
      let mainSlowFrames = 0;
      let toysReleased = false;

      const releaseToyCars = () => {
        if (toysReleased || disposed) return;
        toysReleased = true;
        footer.classList.add('is-toys-active');

        const burstY = wordmarkRect
          ? Math.max(60, wordmarkRect.top - stageRect.top - 35)
          : stageRect.height * 0.32;

        const toyBodies = visibleToyElements.map((element, index) => {
          const progress = index / Math.max(1, visibleToyElements.length - 1);
          const burstX = wordmarkRect
            ? wordmarkRect.left - stageRect.left + wordmarkRect.width * (0.04 + progress * 0.92)
            : stageRect.width * (0.08 + progress * 0.84);
          const horizontalDirection = (progress - 0.5) * 2;
          const item = createBodyItem(element, mainBodies.length + index, true, {
            x: burstX + randomBetween(-28, 28),
            y: burstY + randomBetween(-24, 24),
          });
          Body.setVelocity(item.matterBody, {
            x: horizontalDirection * randomBetween(2.5, 6.5) + randomBetween(-2.8, 2.8),
            y: -randomBetween(11.5, 17.5),
          });
          Body.setAngularVelocity(item.matterBody, randomBetween(-0.22, 0.22));
          item.element.style.opacity = '1';
          return item;
        });

        bodies.push(...toyBodies);
        Composite.add(engine.world, toyBodies.map(({ matterBody }) => matterBody));
      };

      const animate = (time) => {
        const delta = Math.min(33.34, time - previousTime);
        previousTime = time;
        Engine.update(engine, delta);

        let movingBodies = 0;
        let movingMainBodies = 0;
        bodies.forEach((item) => {
          const { matterBody, element, width, height, renderOffset } = item;
          const cos = Math.cos(matterBody.angle);
          const sin = Math.sin(matterBody.angle);
          const offsetX = renderOffset.x * cos - renderOffset.y * sin;
          const offsetY = renderOffset.x * sin + renderOffset.y * cos;
          const x = matterBody.position.x + offsetX - width / 2;
          const y = matterBody.position.y + offsetY - height / 2;
          element.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${matterBody.angle}rad)`;
          const isMoving = !matterBody.isSleeping && matterBody.speed + Math.abs(matterBody.angularSpeed) > 0.08;
          if (isMoving) {
            movingBodies += 1;
            if (!item.isToy) movingMainBodies += 1;
          }
        });

        if (!toysReleased) {
          mainSlowFrames = movingMainBodies <= Math.max(1, Math.floor(mainBodies.length * 0.2))
            ? mainSlowFrames + 1
            : 0;
          if ((time - startTime > 1400 && mainSlowFrames >= 16) || time - startTime > 6500) releaseToyCars();
        }

        settledFrames = toysReleased && movingBodies === 0 ? settledFrames + 1 : 0;
        if ((!toysReleased || settledFrames < 90) && time - startTime < 30000) {
          animationFrame = requestAnimationFrame(animate);
        }
      };

      animationFrame = requestAnimationFrame(animate);
    };

    observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) startPhysics();
    }, { threshold: 0.12 });
    observer.observe(stage);

    return () => {
      disposed = true;
      observer?.disconnect();
      cancelAnimationFrame(animationFrame);
      if (engine) {
        Events.off(engine);
        Composite.clear(engine.world, false);
        Engine.clear(engine);
      }
      clearPhysicsStyles();
    };
  }, [pathname]);

  return <footer className="reservation-footer" ref={footerRef}>
    <div className="reservation-footer__meta">
      <div className="reservation-footer__social"><a href="https://www.instagram.com/hyundaimotorstudio/" aria-label="인스타그램" target="_blank" rel="noreferrer"><Instagram /></a><a href="https://www.youtube.com/user/hyundai" aria-label="유튜브" target="_blank" rel="noreferrer"><Youtube /></a><a href="https://www.facebook.com/Hyundaiworldwide" aria-label="페이스북" target="_blank" rel="noreferrer"><Facebook /></a></div>
      <nav aria-label="푸터 메뉴"><a href="#terms">이용약관</a><a href="#privacy">개인정보처리방침</a><a href="#sitemap">사이트맵</a></nav>
      <p>고객센터 1899-6611</p>
    </div>
    <img className="reservation-footer__wordmark" src={wordmarkUrl} alt="HYUNDAI MOTORSTUDIO" />
    <small>© HYUNDAI MOTOR COMPANY. ALL RIGHTS RESERVED.</small>
    <div className="reservation-footer__cars" ref={stageRef} aria-hidden="true">
      <img data-physics-body className="reservation-footer__car reservation-footer__car--one" src={carOneUrl} alt="" />
      <img data-physics-body className="reservation-footer__car reservation-footer__car--two" src={carTwoUrl} alt="" />
      <img data-physics-body className="reservation-footer__car reservation-footer__car--three" src={carThreeUrl} alt="" />
      <div data-physics-body className="reservation-footer__rock">
        <img className="reservation-footer__rock-image" src={carRockUrl} alt="" />
        <img className="reservation-footer__rock-eye" src={carRockEyeUrl} alt="" />
      </div>
      <img data-physics-body className="reservation-footer__car reservation-footer__car--four" src={carFourUrl} alt="" />
      <img data-physics-body className="reservation-footer__car reservation-footer__car--five" src={carFiveUrl} alt="" />
      <img data-physics-body className="reservation-footer__car reservation-footer__car--six" src={carSixUrl} alt="" />
      <div data-physics-body className="reservation-footer__rock reservation-footer__rock--two">
        <img className="reservation-footer__rock-image" src={carRockTwoUrl} alt="" />
        <img className="reservation-footer__rock-eye" src={carRockTwoEyeUrl} alt="" />
        <img className="reservation-footer__rock-eyelid" src={carRockTwoEyelidUrl} alt="" />
      </div>
      <img data-physics-body className="reservation-footer__car reservation-footer__car--seven" src={carSevenUrl} alt="" />
      {toyCarUrls.map((src, index) => (
        <img
          key={src}
          data-physics-body
          className="reservation-footer__car reservation-footer__toy-car"
          src={src}
          alt=""
          style={{ '--toy-car-index': index }}
        />
      ))}
    </div>
  </footer>;
}
