import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Matter from 'matter-js';
import { Instagram, Youtube, Facebook } from 'lucide-react';
import './Footer.css';

const randomBetween = (min, max) => min + Math.random() * (max - min);

export default function Footer() {
  const { pathname } = useLocation();
  const footerRef = useRef(null);
  const stageRef = useRef(null);

  useEffect(() => {
    const footer = footerRef.current;
    const stage = stageRef.current;
    if (!footer || !stage) return undefined;

    const { Engine, Bodies, Body, Composite, Events } = Matter;
    const elements = [...stage.querySelectorAll('[data-physics-body]')];
    let animationFrame = 0;
    let observer;
    let engine;
    let hasPlayed = false;

    const clearPhysicsStyles = () => {
      footer.classList.remove('is-physics-running', 'is-physics-static');
      elements.forEach((element) => element.removeAttribute('style'));
    };

    clearPhysicsStyles();

    const startPhysics = () => {
      if (hasPlayed) return;
      hasPlayed = true;
      observer?.disconnect();

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        footer.classList.add('is-physics-static');
        return;
      }

      const stageRect = stage.getBoundingClientRect();
      const visibleElements = elements.filter((element) => element.offsetWidth > 0 && element.offsetHeight > 0);
      engine = Engine.create({ enableSleeping: true });
      engine.gravity.y = 1;
      engine.gravity.scale = 0.00105;

      const bodies = visibleElements.map((element, index) => {
        const width = element.offsetWidth;
        const height = element.offsetHeight;
        const isRock = element.classList.contains('reservation-footer__rock');
        const hitWidth = width * (isRock ? 0.76 : 0.86);
        const hitHeight = height * (isRock ? 0.76 : 0.66);
        const x = randomBetween(width / 2, Math.max(width / 2, stageRect.width - width / 2));
        const y = -height / 2 - index * randomBetween(58, 105) - randomBetween(20, 100);
        const options = {
          angle: randomBetween(-0.16, 0.16),
          restitution: isRock ? 0.24 : 0.16,
          friction: 0.72,
          frictionStatic: 0.92,
          frictionAir: 0.012,
          density: isRock ? 0.0012 : 0.0024,
          sleepThreshold: 38,
          chamfer: { radius: Math.min(hitHeight * 0.28, 30) },
          label: isRock ? 'footer-rock' : 'footer-car',
        };
        const matterBody = isRock
          ? Bodies.circle(x, y, Math.min(hitWidth, hitHeight) / 2, options)
          : Bodies.rectangle(x, y, hitWidth, hitHeight, options);

        Body.setVelocity(matterBody, { x: randomBetween(-1.05, 1.05), y: randomBetween(0, 0.65) });
        Body.setAngularVelocity(matterBody, randomBetween(-0.012, 0.012));

        element.style.left = '0';
        element.style.right = 'auto';
        element.style.top = '0';
        element.style.bottom = 'auto';
        element.style.opacity = '1';
        element.style.zIndex = `${index + 1}`;

        return { element, matterBody, width, height, impact: 0 };
      });

      const boundaryOptions = { isStatic: true, restitution: 0.05, friction: 0.9, label: 'footer-boundary' };
      const boundaries = [
        Bodies.rectangle(stageRect.width / 2, stageRect.height + 35, stageRect.width + 160, 70, boundaryOptions),
        Bodies.rectangle(-35, stageRect.height / 2, 70, stageRect.height * 3, boundaryOptions),
        Bodies.rectangle(stageRect.width + 35, stageRect.height / 2, 70, stageRect.height * 3, boundaryOptions),
      ];

      Composite.add(engine.world, [...boundaries, ...bodies.map(({ matterBody }) => matterBody)]);

      Events.on(engine, 'collisionStart', ({ pairs }) => {
        pairs.forEach(({ bodyA, bodyB, collision }) => {
          const force = Math.min(0.075, collision.depth * 0.006);
          bodies.forEach((item) => {
            if (item.matterBody === bodyA || item.matterBody === bodyB) item.impact = Math.max(item.impact, force);
          });
        });
      });

      footer.classList.add('is-physics-running');
      let previousTime = performance.now();
      const startTime = previousTime;
      let settledFrames = 0;

      const animate = (time) => {
        const delta = Math.min(33.34, time - previousTime);
        previousTime = time;
        Engine.update(engine, delta);

        let movingBodies = 0;
        bodies.forEach((item) => {
          const { matterBody, element, width, height } = item;
          const x = matterBody.position.x - width / 2;
          const y = matterBody.position.y - height / 2;
          const speedStretch = Math.min(0.018, Math.max(0, matterBody.velocity.y) * 0.0012);
          const scaleX = 1 - speedStretch + item.impact;
          const scaleY = 1 + speedStretch - item.impact;
          element.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${matterBody.angle}rad) scale(${scaleX}, ${scaleY})`;
          item.impact *= 0.76;
          if (!matterBody.isSleeping && matterBody.speed + Math.abs(matterBody.angularSpeed) > 0.08) movingBodies += 1;
        });

        settledFrames = movingBodies === 0 ? settledFrames + 1 : 0;
        if (settledFrames < 50 && time - startTime < 14000) animationFrame = requestAnimationFrame(animate);
      };

      animationFrame = requestAnimationFrame(animate);
    };

    observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) startPhysics();
    }, { threshold: 0.12 });
    observer.observe(stage);

    return () => {
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
    <img className="reservation-footer__wordmark" src="/images/footer/wordmark.svg" alt="HYUNDAI MOTORSTUDIO" />
    <small>© HYUNDAI MOTOR COMPANY. ALL RIGHTS RESERVED.</small>
    <div className="reservation-footer__cars" ref={stageRef} aria-hidden="true">
      <img data-physics-body className="reservation-footer__car reservation-footer__car--one" src="/images/footer/car-1.png" alt="" />
      <img data-physics-body className="reservation-footer__car reservation-footer__car--two" src="/images/footer/car-2.png" alt="" />
      <img data-physics-body className="reservation-footer__car reservation-footer__car--three" src="/images/footer/car-3.png" alt="" />
      <div data-physics-body className="reservation-footer__rock">
        <img className="reservation-footer__rock-image" src="/images/footer/car-rock.png" alt="" />
        <img className="reservation-footer__rock-eye" src="/images/footer/car-rock-eye.svg" alt="" />
      </div>
      <img data-physics-body className="reservation-footer__car reservation-footer__car--four" src="/images/footer/car-4.png" alt="" />
    </div>
  </footer>;
}
