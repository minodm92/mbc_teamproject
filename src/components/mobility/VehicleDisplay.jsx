import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { paths } from '../../common/router/routePaths';
import './VehicleDisplay.css';

const routes = [
    '하이 퍼포먼스 드라이브_언택트',
    '하이 퍼포먼스 드라이브_선택',
    '베이직 드라이브_언택트',
    '베이직 드라이브_선택',
    '비기너 드라이브',
];
const gallery = Array.from(
    { length: 6 },
    (_, index) => `/images/mobility/gallery-con7-${index + 1}.png`
);
const INTRO_SCROLL_DURATION = 7;
const SLIDE_SCROLL_DURATION = 2;

const playgroundItems = [
    {
        number: '01',
        title: 'Build a connection through every interaction',
        description:
            '차량의 실루엣과 균형 잡힌 비례를 가까이에서 살펴볼 수 있습니다. 빛과 시선에 따라 달라지는 섬세한 디자인의 깊이를 발견해 보세요.',
        image: '/images/mobility/playground-state-01.png',
        imageAlt: '전시 차량의 외관을 살펴보며 설명을 듣는 방문객',
    },
    {
        number: '02',
        title: 'Step inside and experience thoughtful comfort',
        description:
            '실내에 직접 앉아 소재의 감촉과 공간의 편안함을 경험할 수 있습니다. 탑승자를 중심으로 설계된 정교한 배려를 온몸으로 느껴보세요.',
        image: '/images/mobility/playground-state-03.png',
        imageAlt: '차량의 넓은 실내 공간과 좌석 구성',
    },
    {
        number: '03',
        title: 'Build a connection through every interaction',
        description:
            '운전석에 앉아 주요 조작 장치와 디스플레이를 직접 확인할 수 있습니다. 손끝에서 자연스럽게 이어지는 직관적인 상호작용을 경험해 보세요.',
        image: '/images/mobility/playground-state-02.png',
        imageAlt: '운전석의 조작 장치와 디스플레이를 안내받는 방문객',
    },
    {
        number: '04',
        title: 'Discover intelligence designed around your journey',
        description:
            '직관적인 디스플레이와 연결된 첨단 기능을 직접 조작할 수 있습니다. 운전자 중심의 지능형 기술이 만드는 새로운 경험을 만나보세요.',
        image: '/images/mobility/playground-state-04.png',
        imageAlt: '차량 인포테인먼트 화면을 조작하는 방문객',
    },
    {
        number: '05',
        title: 'Imagine every possibility beyond the showroom',
        description:
            '전시 공간을 넘어 도로 위에서 펼쳐질 다양한 가능성을 상상할 수 있습니다. 당신의 일상과 여정에 어울리는 새로운 순간을 발견해 보세요.',
        image: '/images/mobility/playground-state-05.png',
        imageAlt: '도로를 배경으로 전시된 차량의 측면 모습',
    },
];

const showcaseVehicles = [
    {
        name: 'GV80',
        exterior: '/images/mobility/gv80-exterior.png',
        interior: '/images/mobility/gv80-interior.png',
        description: [
            'EFFORTLESS LUXURY MEETS CONFIDENT PERFORMANCE,',
            'CREATING A REFINED JOURNEY FOR EVERY ROAD AHEAD.',
        ],
        specs: [
            ['ENGINE', 'GASOLINE 2.5 TURBO'],
            ['FUEL ECONOMY', 'UP TO 9.3 KM/L'],
            ['MAX POWER', '304 PS'],
            ['MAX TORQUE', '43.0 KGF·M'],
        ],
        specTopX: 338,
        specBottomX: 338,
    },
    {
        name: 'IONIQ 5 N',
        exterior: '/images/mobility/ioniq5n-exterior.png',
        interior: '/images/mobility/ioniq5n-interior.png',
        description: [
            'ELECTRIFY EVERY MOMENT WITH RACETRACK-BRED PERFORMANCE.',
            'TURN EVERYDAY ROADS INTO PURE DRIVING THRILLS.',
        ],
        specs: [
            ['ENGINE', 'DUAL ELECTRIC MOTOR'],
            ['FUEL ECONOMY', '3.7 KM/KWH'],
            ['MAX POWER', '650 PS'],
            ['MAX TORQUE', '78.5 KGF·M'],
        ],
        specTopX: 370,
        specBottomX: 370,
    },
    {
        name: 'CASPER',
        exterior: '/images/mobility/casper-exterior.png',
        interior: '/images/mobility/casper-interior.png',
        compact: true,
        description: [
            'COMPACT IN SIZE, BOLD IN EVERY DETAIL.',
            'MAKE EVERY CITY MOMENT UNIQUELY YOUR OWN.',
        ],
        specs: [
            ['ENGINE', 'GSL 1.0 TURBO'],
            ['FUEL ECONOMY', '12.8 KM/L'],
            ['MAX POWER', '100 PS'],
            ['MAX TORQUE', '17.5 KGF·M'],
        ],
        specTopX: 337,
        specBottomX: 338,
    },
    {
        name: 'G90',
        exterior: '/images/mobility/g90-exterior.png',
        interior: '/images/mobility/g90-interior.png',
        compact: true,
        description: [
            'EFFORTLESS ELEGANCE SHAPES EVERY QUIET MOMENT.',
            'EXPERIENCE FIRST-CLASS COMFORT BEYOND EVERY EXPECTATION.',
        ],
        specs: [
            ['ENGINE', 'GSL 3.5 TURBO 48V E-S/C'],
            ['FUEL ECONOMY', '9.1 KM/L'],
            ['MAX POWER', '415 PS'],
            ['MAX TORQUE', '56.0 KGF·M'],
        ],
        specTopX: 392,
        specBottomX: 391,
    },
];

function VehicleShowcase({ vehicle }) {
    return (
        <section
            className={`vehicle-showcase${vehicle.compact ? ' vehicle-showcase--compact' : ''}`}
            style={{
                '--spec-top-x': `${(vehicle.specTopX / 1920) * 100}vw`,
                '--spec-bottom-x': `${(vehicle.specBottomX / 1920) * 100}vw`,
            }}
        >
            <img
                className="vehicle-showcase__exterior"
                src={vehicle.exterior}
                alt={`${vehicle.name} exterior`}
            />
            <div className="vehicle-showcase__name">
                <h2>{vehicle.name}</h2>
                <p>
                    {vehicle.description[0]}
                    <br />
                    {vehicle.description[1]}
                </p>
            </div>
            <Link className="vehicle-showcase__link" to={paths.reservations}>
                View detail <ArrowUpRight />
            </Link>
            <dl className="vehicle-showcase__specs">
                {vehicle.specs.map(([label, value]) => (
                    <div key={label}>
                        <dt>{label}</dt>
                        <dd>{value}</dd>
                    </div>
                ))}
            </dl>
            <img
                className="vehicle-showcase__interior"
                src={vehicle.interior}
                alt={`${vehicle.name} interior`}
            />
        </section>
    );
}

function VehicleCurtains({ vehicles, triggerRef, children }) {
    const stickyRef = useRef(null);

    useEffect(() => {
        const section = triggerRef.current;
        const sticky = stickyRef.current;
        if (!section || !sticky || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return undefined;
        }

        let context;
        let cancelled = false;

        Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(
            ([gsapModule, triggerModule]) => {
                if (cancelled) return;

                const gsap = gsapModule.gsap;
                const ScrollTrigger = triggerModule.ScrollTrigger;
                gsap.registerPlugin(ScrollTrigger);

                context = gsap.context(() => {
                    const slides = gsap.utils.toArray('.con2-slide', section);
                    const reveals = gsap.utils.toArray('.con2-slide__reveal', section);
                    const introDuration = INTRO_SCROLL_DURATION;
                    const slideDuration = SLIDE_SCROLL_DURATION;
                    const outroHoldDuration = 1.5;

                    gsap.set(slides[0], { yPercent: 0 });
                    gsap.set(reveals[0], { yPercent: 0 });
                    gsap.set(slides.slice(1), { yPercent: 100, visibility: 'visible' });
                    gsap.set(reveals.slice(1), { yPercent: -100 });

                    const timeline = gsap.timeline({
                        scrollTrigger: {
                            trigger: section,
                            start: 'top top',
                            end: () =>
                                `+=${window.innerHeight * (introDuration + (slides.length - 1) * slideDuration + outroHoldDuration)}`,
                            scrub: 1,
                            pin: sticky,
                            pinSpacing: false,
                            anticipatePin: 1,
                            invalidateOnRefresh: true,
                        },
                    });

                    timeline.to({}, { duration: introDuration });

                    slides.slice(1).forEach((slide, index) => {
                        const reveal = reveals[index + 1];
                        timeline
                            .to(slide, { yPercent: 0, duration: slideDuration, ease: 'none' })
                            .to(
                                reveal,
                                { yPercent: 0, duration: slideDuration, ease: 'none' },
                                '<'
                            );
                    });

                    const setModelWarmup = (active) => {
                        document
                            .querySelector('.mobility-statement__model-entry')
                            ?.classList.toggle('is-warming', active);
                    };

                    // Render the real con3 model during the con2_4 hold so its
                    // textures, shaders, shadow, and idle motion are ready in advance.
                    timeline
                        .call(() => {
                            setModelWarmup(timeline.scrollTrigger.direction >= 0);
                        })
                        .to({}, { duration: outroHoldDuration })
                        .call(() => {
                            setModelWarmup(timeline.scrollTrigger.direction < 0);
                        });

                    section.dataset.slideCount = String(slides.length);
                    section.dataset.scrollTrigger = timeline.scrollTrigger ? 'active' : 'inactive';
                    requestAnimationFrame(() => ScrollTrigger.refresh());
                }, section);
            }
        );

        return () => {
            cancelled = true;
            document
                .querySelector('.mobility-statement__model-entry')
                ?.classList.remove('is-warming');
            context?.revert();
        };
    }, [triggerRef, vehicles.length]);

    return (
        <div className="mobility-intro__sticky con2__sticky" ref={stickyRef}>
            <div className="con2-slide" style={{ zIndex: 1 }} data-con2-index="1">
                <div className="con2-slide__reveal">{children}</div>
            </div>
            {vehicles.map((vehicle, index) => (
                <div
                    className="con2-slide"
                    style={{ zIndex: index + 2 }}
                    data-con2-index={index + 2}
                    key={vehicle.name}
                >
                    <div className="con2-slide__reveal">
                        <VehicleShowcase vehicle={vehicle} />
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function VehicleDisplay() {
    const transitionRef = useRef(null);
    const statementRef = useRef(null);
    const playgroundRef = useRef(null);
    const persistentPlaygroundTitleRef = useRef(null);
    const [activePlaygroundIndex, setActivePlaygroundIndex] = useState(0);
    useEffect(() => {
        const section = transitionRef.current;
        if (!section || window.matchMedia('(prefers-reduced-motion: reduce)').matches)
            return undefined;
        let frame = 0;
        const update = () => {
            frame = 0;
            const rect = section.getBoundingClientRect();
            const distance = Math.max(1, window.innerHeight * INTRO_SCROLL_DURATION);
            const progress = Math.min(1, Math.max(0, -rect.top / distance));
            const clamp = (value) => Math.min(1, Math.max(0, value));
            const ease = (value) => value * value * (3 - 2 * value);
            const mix = (from, to, value) => from + (to - from) * value;
            const expandEnd = 0.27;
            const expand = ease(clamp(progress / expandEnd));
            const copyExit = ease(clamp(progress / 0.22));
            const settleEnd = 0.61;
            const settle = ease(clamp((progress - expandEnd) / (settleEnd - expandEnd)));
            const swap = ease(clamp((progress - 0.28) / 0.14));
            const detailDuration = SLIDE_SCROLL_DURATION / INTRO_SCROLL_DURATION;
            const detail = ease(clamp((progress - 0.42) / detailDuration));
            const sticky = section.querySelector('.mobility-intro__sticky');
            const width = sticky?.clientWidth || section.clientWidth || window.innerWidth;
            const height = sticky?.clientHeight || window.innerHeight;
            const start = {
                x: width * (1128 / 1920),
                y: height * (314 / 1080),
                w: width * (727 / 1920),
                h: height * (697 / 1080),
            };
            const expanded = {
                x: 0,
                y: height * (314 / 1080),
                w: width * (1855 / 1920),
                h: height * (766 / 1080),
            };
            const target = { x: 0, y: 0, w: width * (800 / 1920), h: height };
            const current =
                progress < expandEnd
                    ? {
                          x: mix(start.x, expanded.x, expand),
                          y: mix(start.y, expanded.y, expand),
                          w: mix(start.w, expanded.w, expand),
                          h: mix(start.h, expanded.h, expand),
                      }
                    : {
                          x: mix(expanded.x, target.x, settle),
                          y: mix(expanded.y, target.y, settle),
                          w: mix(expanded.w, target.w, settle),
                          h: mix(expanded.h, target.h, settle),
                      };
            section.style.setProperty('--media-x', `${current.x}px`);
            section.style.setProperty('--media-y', `${current.y}px`);
            section.style.setProperty('--media-width', `${current.w}px`);
            section.style.setProperty('--media-height', `${current.h}px`);
            section.style.setProperty(
                '--copy-shift',
                `${mix(0, height * (-360 / 1080), copyExit)}px`
            );
            section.style.setProperty(
                '--copy-opacity',
                String(1 - ease(clamp((progress - 0.06) / 0.16)))
            );
            section.style.setProperty('--intro-opacity', String(1 - swap));
            section.style.setProperty('--model-opacity', String(swap));
            section.style.setProperty(
                '--detail-shift',
                `${mix(height * (1000 / 1080), 0, detail)}px`
            );
            section.style.setProperty('--detail-opacity', String(clamp((progress - 0.42) / 0.1)));
        };
        const requestUpdate = () => {
            if (!frame) frame = requestAnimationFrame(update);
        };
        update();
        window.addEventListener('scroll', requestUpdate, { passive: true });
        window.addEventListener('resize', requestUpdate);
        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener('scroll', requestUpdate);
            window.removeEventListener('resize', requestUpdate);
        };
    }, []);

    useEffect(() => {
        const section = statementRef.current;
        if (!section) return undefined;

        void import('@google/model-viewer');

        let context;
        let cancelled = false;
        let modelViewer;
        let handleModelLoad;
        let clearScrollInputLock = () => {};

        Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(
            ([gsapModule, triggerModule]) => {
                if (cancelled) return;

                const gsap = gsapModule.gsap;
                const ScrollTrigger = triggerModule.ScrollTrigger;
                const title = section.querySelector('h2');
                const eyebrow = section.querySelector('.mobility-statement__eyebrow');
                const handoffTitle = section.querySelector('.mobility-statement__handoff-title');
                const persistentTitle = persistentPlaygroundTitleRef.current;
                const sub = section.querySelector('p');
                const model = section.querySelector('.mobility-statement__model-entry');
                modelViewer = section.querySelector('model-viewer');
                const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                if (
                    !title ||
                    !eyebrow ||
                    !handoffTitle ||
                    !persistentTitle ||
                    !sub ||
                    !model ||
                    !modelViewer
                )
                    return;

                handleModelLoad = () => model.classList.add('is-loaded');
                modelViewer.addEventListener('load', handleModelLoad);
                if (modelViewer.loaded) handleModelLoad();

                gsap.registerPlugin(ScrollTrigger);
                context = gsap.context(() => {
                    const belowViewport = (element) =>
                        window.innerHeight - element.offsetTop + element.offsetHeight;
                    const entranceDuration = 3;
                    const exitDuration = 1.8;
                    const activeMotions = new Set();
                    const blockedScrollKeys = new Set([
                        'ArrowDown',
                        'ArrowUp',
                        'End',
                        'Home',
                        'PageDown',
                        'PageUp',
                        ' ',
                    ]);
                    let lockedScrollY = 0;
                    let scrollRestoreFrame = 0;
                    const preventScrollInput = (event) => event.preventDefault();
                    const preventScrollKey = (event) => {
                        if (blockedScrollKeys.has(event.key)) event.preventDefault();
                    };
                    const holdPinnedScrollPosition = () => {
                        if (scrollRestoreFrame) return;

                        scrollRestoreFrame = window.requestAnimationFrame(() => {
                            scrollRestoreFrame = 0;
                            if (activeMotions.size > 0 && window.scrollY !== lockedScrollY) {
                                window.scrollTo(0, lockedScrollY);
                            }
                        });
                    };
                    const lockScrollInput = (motion) => {
                        activeMotions.add(motion);
                        if (activeMotions.size > 1) return;

                        lockedScrollY = window.scrollY;
                        window.addEventListener('wheel', preventScrollInput, { passive: false });
                        window.addEventListener('touchmove', preventScrollInput, {
                            passive: false,
                        });
                        window.addEventListener('keydown', preventScrollKey);
                        window.addEventListener('scroll', holdPinnedScrollPosition, {
                            passive: true,
                        });
                    };
                    const releaseScrollInput = (motion) => {
                        activeMotions.delete(motion);
                        if (activeMotions.size > 0) return;

                        window.removeEventListener('wheel', preventScrollInput);
                        window.removeEventListener('touchmove', preventScrollInput);
                        window.removeEventListener('keydown', preventScrollKey);
                        window.removeEventListener('scroll', holdPinnedScrollPosition);
                        window.cancelAnimationFrame(scrollRestoreFrame);
                        scrollRestoreFrame = 0;
                    };
                    clearScrollInputLock = () => {
                        activeMotions.clear();
                        window.removeEventListener('wheel', preventScrollInput);
                        window.removeEventListener('touchmove', preventScrollInput);
                        window.removeEventListener('keydown', preventScrollKey);
                        window.removeEventListener('scroll', holdPinnedScrollPosition);
                        window.cancelAnimationFrame(scrollRestoreFrame);
                        scrollRestoreFrame = 0;
                    };
                    let entranceTimeline;
                    let exitTimeline;

                    if (!reduceMotion) {
                        entranceTimeline = gsap
                            .timeline({ paused: true })
                            .fromTo(
                                model,
                                { y: () => -window.innerHeight, scale: 0.96 },
                                {
                                    y: 0,
                                    scale: 1,
                                    duration: entranceDuration,
                                    ease: 'power2.inOut',
                                    immediateRender: true,
                                },
                                0
                            )
                            .fromTo(
                                title,
                                { y: () => belowViewport(title) },
                                {
                                    y: 0,
                                    duration: entranceDuration,
                                    ease: 'power2.out',
                                    immediateRender: true,
                                },
                                0
                            )
                            .fromTo(
                                sub,
                                { y: () => belowViewport(sub) },
                                {
                                    y: 0,
                                    duration: entranceDuration,
                                    ease: 'power2.out',
                                    immediateRender: true,
                                },
                                0
                            );

                        entranceTimeline
                            .eventCallback('onComplete', () => releaseScrollInput('entrance'))
                            .eventCallback('onReverseComplete', () =>
                                releaseScrollInput('entrance')
                            );

                        exitTimeline = gsap
                            .timeline({ paused: true })
                            .to(
                                model,
                                {
                                    y: () => window.innerHeight + model.offsetHeight,
                                    scale: 0.96,
                                    duration: exitDuration,
                                    ease: 'power2.inOut',
                                },
                                0
                            )
                            .to(
                                [eyebrow, sub],
                                {
                                    y: () => -window.innerHeight,
                                    duration: exitDuration,
                                    ease: 'power2.inOut',
                                },
                                0
                            )
                            .to(
                                persistentTitle,
                                {
                                    y: 0,
                                    duration: exitDuration,
                                    ease: 'power2.inOut',
                                },
                                0
                            );

                        exitTimeline.eventCallback('onReverseComplete', () => {
                            gsap.set(persistentTitle, { autoAlpha: 0 });
                            gsap.set(handoffTitle, { autoAlpha: 1 });
                            section.classList.remove('is-model-exiting');
                            releaseScrollInput('exit');
                        });
                        exitTimeline.eventCallback('onComplete', () => {
                            section.classList.remove('is-model-exiting');
                            releaseScrollInput('exit');
                        });
                    }

                    const timeline = gsap.timeline({
                        scrollTrigger: {
                            trigger: section,
                            start: 'center center',
                            end: () => `+=${window.innerHeight * 3}`,
                            scrub: 0.6,
                            pin: true,
                            pinSpacing: true,
                            anticipatePin: 1,
                            invalidateOnRefresh: true,
                        },
                    });

                    if (!reduceMotion) {
                        timeline
                            // Keep the first pinned view empty before beginning the entrance.
                            .to({}, { duration: 1 })
                            .call(() => {
                                lockScrollInput('entrance');
                                if (timeline.scrollTrigger.direction < 0) {
                                    entranceTimeline.reverse();
                                    return;
                                }

                                entranceTimeline.play();
                            })
                            // Keep the section pinned while the time-based entrance finishes.
                            .to({}, { duration: 2.5 })
                            .call(() => {
                                lockScrollInput('exit');
                                section.classList.add('is-model-exiting');
                                if (timeline.scrollTrigger.direction < 0) {
                                    exitTimeline.reverse();
                                    return;
                                }

                                gsap.set(persistentTitle, {
                                    autoAlpha: 1,
                                    y: () => handoffTitle.offsetTop,
                                });
                                gsap.set(handoffTitle, { autoAlpha: 0 });
                                exitTimeline.play();
                            })
                            // Hold the pin until the exit finishes; con4 enters on the next scroll.
                            .to({}, { duration: 2.5 });
                    } else {
                        timeline.to({}, { duration: 1 });
                    }

                    section.dataset.scrollTrigger = timeline.scrollTrigger ? 'active' : 'inactive';

                    requestAnimationFrame(() => ScrollTrigger.refresh());
                }, section);
            }
        );

        return () => {
            cancelled = true;
            clearScrollInputLock();
            section.classList.remove('is-model-exiting');
            modelViewer?.removeEventListener('load', handleModelLoad);
            context?.revert();
        };
    }, []);

    useEffect(() => {
        const section = playgroundRef.current;
        if (!section || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return undefined;
        }

        let context;
        let cancelled = false;

        Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(
            ([gsapModule, triggerModule]) => {
                if (cancelled) return;

                const gsap = gsapModule.gsap;
                const ScrollTrigger = triggerModule.ScrollTrigger;
                const persistentTitle = persistentPlaygroundTitleRef.current;
                const sectionTitle = section.querySelector('.mobility-playground__semantic-title');
                if (!persistentTitle || !sectionTitle) return;

                gsap.registerPlugin(ScrollTrigger);
                context = gsap.context(() => {
                    if (window.matchMedia('(min-width: 961px)').matches) {
                        ScrollTrigger.create({
                            trigger: section,
                            start: 'center center',
                            end: () => `+=${window.innerHeight * 2.5}`,
                            pin: true,
                            pinSpacing: true,
                            anticipatePin: 1,
                            invalidateOnRefresh: true,
                            onLeave: () => {
                                gsap.set(persistentTitle, { autoAlpha: 0 });
                                gsap.set(sectionTitle, { autoAlpha: 1 });
                            },
                            onEnterBack: () => {
                                gsap.set(sectionTitle, { autoAlpha: 0 });
                                gsap.set(persistentTitle, { autoAlpha: 1 });
                            },
                        });
                    } else {
                        ScrollTrigger.create({
                            trigger: section,
                            start: 'top top',
                            onEnter: () => {
                                gsap.set(persistentTitle, { autoAlpha: 0 });
                                gsap.set(sectionTitle, { autoAlpha: 1 });
                            },
                            onLeaveBack: () => {
                                gsap.set(sectionTitle, { autoAlpha: 0 });
                                gsap.set(persistentTitle, { autoAlpha: 1 });
                            },
                        });
                    }

                    requestAnimationFrame(() => ScrollTrigger.refresh());
                }, section);
            }
        );

        return () => {
            cancelled = true;
            context?.revert();
        };
    }, []);

    return (
        <main className="mobility-page">
            <section className="mobility-hero">
                <img
                    src="/images/mobility/hero.png"
                    alt="야간의 현대 모터스튜디오와 제네시스 차량"
                />
                <div className="mobility-hero__copy">
                    <h1>HYUNDAI IN MOTION</h1>
                    <p>
                        다양한 테마에 따라 드라이빙의 즐거움을 체험하고 깊이 있는 자동차 지식을
                        겸비한 구루와 함께 드라이빙의 매력에 빠져보세요.
                    </p>
                </div>
                <dl>
                    <div>
                        <dt>2014</dt>
                        <dd>Since</dd>
                    </div>
                    <div>
                        <dt>5,630K+</dt>
                        <dd>Total Visitors</dd>
                    </div>
                </dl>
            </section>

            <section
                className="mobility-intro con2"
                ref={transitionRef}
                aria-label="차량 모델 소개"
            >
                <VehicleCurtains vehicles={showcaseVehicles.slice(1)} triggerRef={transitionRef}>
                    <header>
                        <h2>
                            MEET YOUR MATCH
                            <br />
                            START THE DRIVE
                        </h2>
                        <p>
                            DISCOVER THE MODEL THAT FITS YOUR JOURNEY AND LIFESTYLE.
                            <br />
                            START THE DRIVE.
                        </p>
                    </header>
                    <div className="mobility-intro__media">
                        <img
                            className="mobility-intro__first"
                            src="/images/mobility/intro-car-expanded.png"
                            alt="모터스튜디오에 전시된 차량"
                        />
                        <img
                            className="mobility-intro__next"
                            src="/images/mobility/gv80-exterior.png"
                            alt="GV80 외관으로 이어지는 전환"
                        />
                    </div>
                    <div className="mobility-intro__detail">
                        <div className="mobility-intro__name">
                            <h2>GV80</h2>
                            <p>
                                EFFORTLESS LUXURY MEETS CONFIDENT PERFORMANCE,
                                <br />
                                CREATING A REFINED JOURNEY FOR EVERY ROAD AHEAD.
                            </p>
                        </div>
                        <Link className="mobility-intro__link" to={paths.reservations}>
                            View detail <ArrowUpRight />
                        </Link>
                        <dl className="mobility-intro__specs">
                            <div>
                                <dt>ENGINE</dt>
                                <dd>GASOLINE 2.5 TURBO</dd>
                            </div>
                            <div>
                                <dt>FUEL ECONOMY</dt>
                                <dd>UP TO 9.3 KM/L</dd>
                            </div>
                            <div>
                                <dt>MAX POWER</dt>
                                <dd>304 PS</dd>
                            </div>
                            <div>
                                <dt>MAX TORQUE</dt>
                                <dd>43.0 KGF·M</dd>
                            </div>
                        </dl>
                        <img
                            className="mobility-intro__interior"
                            src="/images/mobility/gv80-interior.png"
                            alt="GV80 interior"
                        />
                    </div>
                </VehicleCurtains>
            </section>

            <section className="mobility-statement mobility-section" ref={statementRef}>
                <div className="mobility-statement__sticky">
                    <h2>
                        <span className="mobility-statement__eyebrow">SEE MORE IN</span>
                        <span className="mobility-statement__handoff-title">MOTOR PLAYGROUND</span>
                    </h2>
                    <p>
                        FROM THE FIRST TOUCH TO THE OPEN ROAD,
                        <br />
                        EXPERIENCE EVERY DETAIL AS IT WAS MEANT TO BE FELT.
                    </p>
                    <div
                        className="mobility-statement__model-slot"
                        aria-label="2024 Hyundai Elantra N 3D model"
                    >
                        <div className="mobility-statement__model-entry">
                            <div className="mobility-statement__model-idle">
                                <model-viewer
                                    src="/models/2024_hyundai_elantra_n.glb"
                                    alt="2024 Hyundai Elantra N"
                                    loading="eager"
                                    camera-orbit="0deg 0deg 105%"
                                    min-camera-orbit="auto 0deg auto"
                                    max-camera-orbit="auto 0deg auto"
                                    field-of-view="30deg"
                                    shadow-intensity="1"
                                    interaction-prompt="none"
                                    disable-zoom
                                >
                                    <span
                                        className="mobility-statement__model-progress"
                                        slot="progress-bar"
                                        aria-hidden="true"
                                    />
                                </model-viewer>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div
                ref={persistentPlaygroundTitleRef}
                className="mobility-playground__persistent-title"
                aria-hidden="true"
            >
                MOTOR PLAYGROUND
            </div>

            <section className="mobility-playground mobility-section" ref={playgroundRef}>
                <h2 className="mobility-playground__semantic-title">MOTOR PLAYGROUND</h2>
                <ol className="mobility-playground__list">
                    {playgroundItems.map((item, index) => (
                        <li
                            className={index === activePlaygroundIndex ? 'is-active' : undefined}
                            key={item.number}
                            onMouseEnter={() => setActivePlaygroundIndex(index)}
                            onFocus={() => setActivePlaygroundIndex(index)}
                            tabIndex={0}
                        >
                            <span>{item.number}</span>
                            <strong>{item.title}</strong>
                            {index === activePlaygroundIndex && <p>{item.description}</p>}
                        </li>
                    ))}
                </ol>
                {playgroundItems.map((item, index) => (
                    <img
                        className={`mobility-playground__image${index === activePlaygroundIndex ? ' is-active' : ''}`}
                        src={item.image}
                        alt={index === activePlaygroundIndex ? item.imageAlt : ''}
                        aria-hidden={index !== activePlaygroundIndex}
                        key={item.number}
                    />
                ))}
            </section>

            <section className="mobility-drive mobility-section">
                <div className="mobility-drive__title">
                    <h2>
                        CHOOSE YOUR ROAD
                        <br />
                        OWN THE DRIVE
                    </h2>
                    <p>
                        DISCOVER DISTINCT ROUTES DESIGNED TO REVEAL A DIFFERENT SIDE OF EVERY DRIVE.
                    </p>
                </div>
                <div className="mobility-drive__model">
                    <img
                        src="/images/mobility/drive-top-primary.png"
                        alt="위에서 바라본 파란색 차량"
                    />
                </div>
                <ol>
                    <li>
                        <b>01 .</b>
                        <strong>FEEL EVERY RESPONSE</strong>
                        <p>
                            EXPERIENCE ACCELERATION, STEERING, AND BRAKING ACROSS REAL ROADS TO
                            DISCOVER THE VEHICLE’S TRUE CHARACTER.
                        </p>
                    </li>
                    <li>
                        <b>02 .</b>
                        <strong>DISCOVER YOUR COMFORT</strong>
                        <p>
                            EXPLORE RIDE QUALITY, CABIN QUIETNESS, AND EVERYDAY COMFORT THROUGH A
                            COURSE DESIGNED FOR NATURAL DRIVING.
                        </p>
                    </li>
                    <li>
                        <b>03 .</b>
                        <strong>DRIVE WITH CONFIDENCE</strong>
                        <p>
                            TEST SMART SAFETY AND DRIVER-ASSISTANCE FEATURES IN REAL CONDITIONS
                            BEFORE CHOOSING THE RIGHT MODEL.
                        </p>
                    </li>
                </ol>
            </section>

            <section className="mobility-route-hero">
                <img
                    src="/images/mobility/route-hero-primary.jpg"
                    alt="안개가 내려앉은 숲길 전경"
                />
                <div>
                    <p>EVERY ROAD TELLS A DIFFERENT STORY. FIND YOURS.</p>
                    <h2>ROUTE OVERVIEW</h2>
                </div>
            </section>

            <section className="mobility-routes mobility-section">
                <div className="mobility-routes__visual">
                    <img
                        src="/images/mobility/route-hero-primary.jpg"
                        alt="안개 낀 숲속 캠핑 드라이빙 코스"
                    />
                    <div className="mobility-routes__visual-title">
                        <p>EVERY ROAD TELLS A DIFFERENT STORY. FIND YOURS.</p>
                        <h2>ROUTE OVERVIEW</h2>
                    </div>
                </div>
                <div className="mobility-routes__content">
                    <div className="mobility-routes__intro">
                        <span>ROUTE OVERVIEW</span>
                        <p>
                            현대모터스튜디오 고양에서는 도심과 자동차 전용도로를 아우르는 다채로운
                            주행 코스를 경험할 수 있습니다. 코스마다 차량의 승차감과 가속 성능, 조향
                            감각을 서로 다른 환경에서 확인할 수 있도록 구성되어 있습니다. 여유로운
                            주행부터 역동적인 드라이빙까지, 차량과 도로가 만들어 내는 다양한 순간을
                            직접 느껴보세요. 나의 운전 스타일과 목적에 가장 잘 어울리는 코스를
                            선택해 새로운 이동의 즐거움을 발견할 수 있습니다.
                        </p>
                    </div>
                    <p className="mobility-routes__difference">
                        DIFFERENT ROADS
                        <br />
                        DISTINCT EXPERIENCES
                    </p>
                    <h3>EXPLORE THE ROUTES</h3>
                    <ul>
                        {routes.map((route, index) => (
                            <li key={route}>
                                <small>ROUTE</small>
                                <b>{String(index + 1).padStart(2, '0')} .</b>
                                <strong>{route}</strong>
                                {index === 0 && (
                                    <p>DISCOVER THE DESIGN, LOGYLOGYLOGYLOGYLOGY GY FFFFFFFFFF</p>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            <section className="mobility-gallery mobility-section">
                {gallery.map((image, index) => (
                    <img
                        key={image}
                        src={image}
                        alt={`현대 모터스튜디오 모빌리티 갤러리 ${index + 1}`}
                    />
                ))}
            </section>
        </main>
    );
}
