import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import programThreeVideoUrl from '../../assets/videos/program-step-03-figma.mp4?url';
import { homeAsset as asset } from './homeAssets';
import './HomeProgramSequence.css';

gsap.registerPlugin(ScrollTrigger);

const steps = [
    {
        image: 'program.svg', label: 'PROGRAM 01', title: '수소 에너지 탐험', count: '2 / 3',
        description: <>수전해 실험과 넥쏘 조립을 통해 수소에너지를 이해하고,<br />수소전기차의 구동 원리를 배우는 클래스입니다.</>,
    },
    {
        image: 'program-step-02.svg', label: 'PROGRAM 02', title: '교통 안전 교육(단체)', count: '3 / 3',
        description: <>생활 속 교통사고 위험 상황을 이해하고, 보행과<br />통학버스 이용 시 필요한 안전 수칙 및 대처 방법을 배울 수 있는 교육 프로그램입니다.</>,
    },
];

// Each reveal mask stays attached to the viewport bottom. Overlapping starts
// let their top edges rise as one continuous wave until they fill the screen.
const panels = [
    { x: 0, w: .31 },
    { x: .16, w: .27 },
    { x: .39, w: .36 },
    { x: .64, w: .23 },
    { x: .81, w: .19 },
];

const PANEL_REVEAL_DURATION = 1.10;
const PANEL_STAGGER = .16;
const STEP_HOLD = .20;
const PANEL_SEQUENCE_DURATION = PANEL_REVEAL_DURATION + (panels.length - 1) * PANEL_STAGGER;

function addTransition(timeline, rects, start) {
    rects.forEach((rect, index) => {
        const enter = start + index * PANEL_STAGGER;
        timeline.to(rect, {
            attr: { y: 0, height: 1 },
            duration: PANEL_REVEAL_DURATION,
            ease: 'none',
        }, enter);
    });

    // y + height remains 1 for every tween: the bottom edge is anchored while
    // only the top edge travels upward. The final mask completes the same motion.
    return start + PANEL_SEQUENCE_DURATION;
}

function PanelClip({ id, rectsRef }) {
    return <clipPath id={id} clipPathUnits="objectBoundingBox">
        {panels.map((panel, index) => <rect key={index} ref={(element) => { rectsRef.current[index] = element; }} x={panel.x} y={1} width={panel.w} height={0} />)}
    </clipPath>;
}

export default function HomeProgramSequence() {
    const sequenceRef = useRef(null);
    const viewportRef = useRef(null);
    const stepTwoRef = useRef(null);
    const stepThreeRef = useRef(null);
    const videoRef = useRef(null);
    const panelsTwoRef = useRef([]);
    const panelsThreeRef = useRef([]);

    useLayoutEffect(() => {
        const sequence = sequenceRef.current;
        const viewport = viewportRef.current;
        const video = videoRef.current;
        if (!sequence || !viewport) return undefined;

        const context = gsap.context(() => {
            gsap.set([stepTwoRef.current, stepThreeRef.current], { autoAlpha: 1 });
            const timeline = gsap.timeline({ paused: true });
            const stepTwoStart = STEP_HOLD;
            const stepTwoComplete = addTransition(timeline, panelsTwoRef.current, stepTwoStart);
            const stepThreeStart = stepTwoComplete + STEP_HOLD;
            const stepThreeComplete = addTransition(timeline, panelsThreeRef.current, stepThreeStart);
            timeline.to({ hold: 0 }, { hold: 1, duration: STEP_HOLD, ease: 'none' }, stepThreeComplete);

            ScrollTrigger.create({
                trigger: sequence,
                start: 'top top',
                end: () => `+=${sequence.offsetHeight}`,
                animation: timeline,
                pin: viewport,
                pinSpacing: false,
                scrub: 1.8,
                anticipatePin: 1,
                refreshPriority: -1,
                invalidateOnRefresh: true,
            });
        }, sequence);

        let disposed = false;
        let refreshFrame = 0;
        const refresh = () => {
            if (disposed || refreshFrame) return;
            refreshFrame = requestAnimationFrame(() => {
                refreshFrame = 0;
                if (!disposed) ScrollTrigger.refresh();
            });
        };
        const images = [...sequence.querySelectorAll('img')];
        images.forEach((image) => image.addEventListener('load', refresh));
        video?.addEventListener('loadedmetadata', refresh);
        document.fonts?.ready.then(refresh);
        const resizeObserver = new ResizeObserver(refresh);
        resizeObserver.observe(sequence);
        resizeObserver.observe(viewport);

        return () => {
            disposed = true;
            cancelAnimationFrame(refreshFrame);
            resizeObserver.disconnect();
            images.forEach((image) => image.removeEventListener('load', refresh));
            video?.removeEventListener('loadedmetadata', refresh);
            context.revert();
        };
    }, []);

    return <section className="renewal-program-sequence" ref={sequenceRef} aria-label="PROGRAM">
        <div className="renewal-program-sequence__viewport" ref={viewportRef}>
            <svg className="renewal-program-sequence__masks" width="0" height="0" aria-hidden="true" focusable="false"><defs>
                <PanelClip id="home-program-step-02-clip" rectsRef={panelsTwoRef} />
                <PanelClip id="home-program-step-03-clip" rectsRef={panelsThreeRef} />
            </defs></svg>
            <article className="renewal-program-sequence__step renewal-program-sequence__step--one" aria-label="PROGRAM 01 수소 에너지 탐험">
                <img className="renewal-program-sequence__background" src={asset(steps[0].image)} alt="" />
                <div className="renewal-program-sequence__copy renewal-program-sequence__copy--one">
                    <span>{steps[0].label}</span><h2>{steps[0].title}</h2><p>{steps[0].description}</p>
                </div>
                <span className="renewal-program-sequence__count">{steps[0].count}</span>
            </article>
            <article className="renewal-program-sequence__step renewal-program-sequence__step--two" ref={stepTwoRef} aria-label="PROGRAM 02 교통 안전 교육(단체)">
                <img className="renewal-program-sequence__background" src={asset(steps[1].image)} alt="" />
                <div className="renewal-program-sequence__copy renewal-program-sequence__copy--two">
                    <span>{steps[1].label}</span><h2>{steps[1].title}</h2><p>{steps[1].description}</p>
                </div>
                <span className="renewal-program-sequence__count renewal-program-sequence__count--two">{steps[1].count}</span>
            </article>
            <article className="renewal-program-sequence__step renewal-program-sequence__step--three" ref={stepThreeRef} aria-label="CURRENT PROGRAMS">
                <video className="renewal-program-sequence__background" ref={videoRef} src={programThreeVideoUrl} autoPlay muted loop playsInline preload="auto" aria-hidden="true" />
            </article>
        </div>
    </section>;
}
