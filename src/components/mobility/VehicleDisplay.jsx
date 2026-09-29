import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { paths } from '../../common/router/routePaths';
import routeOverviewImage from '../../../public/images/mobility/route-overview-con6.png';
import routeState01 from '../../../public/images/mobility/route-state-01.png';
import routeState02 from '../../../public/images/mobility/route-state-02.jpg';
import routeState03 from '../../../public/images/mobility/route-state-03.jpg';
import routeState04 from '../../../public/images/mobility/route-state-04.jpg';
import routeState05 from '../../../public/images/mobility/route-state-05.jpg';
import routeState06 from '../../../public/images/mobility/route-state-06.jpg';
import routeState07 from '../../../public/images/mobility/route-state-07.jpg';
import routeState08 from '../../../public/images/mobility/route-state-08.jpg';
import './VehicleDisplay.css';

const routes = [
    {
        title: '하이 퍼포먼스 드라이브_언택트',
        description:
            '드라이빙의 즐거움을 끌어올린 N브랜드의 퍼포먼스와 럭셔리 고성능의 GV60 마그마를 공공도로에서 안전하게 경험해 보세요.',
        image: routeState01,
    },
    {
        title: '프라이빗 신차 드라이브_언택트',
        description:
            '현대자동차에서 새롭게 출시한 차량을 빠르게 만나볼 수 있는 시승 프로그램을 체험해보세요.',
        image: routeState02,
    },
    {
        title: '베이직 드라이브',
        description:
            '자동차 전문가 Guru의 친절한 설명과 함께 현대자동차의 다양한 차량들을 현대 모터스튜디오에서 시승해보세요.',
        image: routeState03,
    },
    {
        title: '베이직 드라이브_언택트',
        description:
            "혼자 또는 사랑하는 가족, 지인들과 함께 차량에 집중하고 싶으시다면. '베이직 드라이브 언택트' 프로그램을 이용해 보세요.",
        image: routeState04,
    },
    {
        title: '비기너 드라이브',
        description:
            "수준별 다양한 코스가 준비된 '비기너 드라이브'! 아직은 운전이 서툴고 두려운 당신이라면 참여하셔서 운전에 대한 자신감을 키워보세요.",
        image: routeState05,
    },
    {
        title: '아웃도어 라이프_차콕',
        description:
            '차에서~ 콕! 다양한 용품을 싣고 떠나는 힐링 드라이브! 김포 한강 오토캠핑장에서 특별한 경험과 감성 가득한 추억을 만들어 보세요.',
        image: routeState06,
    },
    {
        title: '컴-페어 드라이브',
        description:
            '비교 가능한 시승 체험, 컴페어 드라이브. 가족, 친구와 함께 두 대를 시승해보고 차이를 느껴보세요.',
        image: routeState07,
    },
    {
        title: '헤리티지 드라이브',
        description:
            '한 시대를 풍미한 현대자동차의 클래식카 시승을 통해 그 때 그 시절의 레트로 감성을 느껴보세요.',
        image: routeState08,
    },
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
        image: '/images/mobility/playground-state-02.png',
        imageAlt: '뒷좌석에서 바라본 차량의 넓은 실내 공간',
    },
    {
        number: '03',
        title: 'Build a connection through every interaction',
        description:
            '운전석에 앉아 주요 조작 장치와 디스플레이를 직접 확인할 수 있습니다. 손끝에서 자연스럽게 이어지는 직관적인 상호작용을 경험해 보세요.',
        image: '/images/mobility/playground-state-03.png',
        imageAlt: '운전석에서 주요 조작 장치를 안내받는 방문객',
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
        imageAlt: '해안 도로를 배경으로 전시된 차량의 측면 모습',
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

                    timeline.to({}, { duration: outroHoldDuration });

                    section.dataset.slideCount = String(slides.length);
                    section.dataset.scrollTrigger = timeline.scrollTrigger ? 'active' : 'inactive';
                    requestAnimationFrame(() => ScrollTrigger.refresh());
                }, section);
            }
        );

        return () => {
            cancelled = true;
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
    const driveRef = useRef(null);
    const routesRef = useRef(null);
    const galleryRef = useRef(null);
    const [activeRouteIndex, setActiveRouteIndex] = useState(0);
    const [isRouteListActive, setIsRouteListActive] = useState(false);
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
        let refreshLayout;

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

                gsap.registerPlugin(ScrollTrigger);
                refreshLayout = () => {
                    requestAnimationFrame(() => ScrollTrigger.refresh());
                };
                handleModelLoad = () => {
                    model.classList.add('is-loaded');
                    refreshLayout();
                };
                modelViewer.addEventListener('load', handleModelLoad);
                if (modelViewer.loaded) handleModelLoad();
                window.addEventListener('load', refreshLayout);
                window.addEventListener('pageshow', refreshLayout);
                document.fonts?.ready.then(() => {
                    if (!cancelled) refreshLayout();
                });

                context = gsap.context(() => {
                    const belowViewport = (element) =>
                        window.innerHeight - element.offsetTop + element.offsetHeight;
                    const entranceDuration = 3;
                    const exitDuration = 1.8;

                    const syncStatementHandoff = (self) => {
                        const playground = playgroundRef.current;
                        const playgroundIsAhead = playground?.getBoundingClientRect().bottom > 0;
                        const handoffIsActive = self.progress >= 0.92 && playgroundIsAhead;

                        section.dataset.handoffActive = String(handoffIsActive);
                        gsap.set(handoffTitle, { autoAlpha: handoffIsActive ? 0 : 1 });
                        gsap.set(persistentTitle, { autoAlpha: handoffIsActive ? 1 : 0 });
                    };

                    const timeline = gsap.timeline({
                        scrollTrigger: {
                            trigger: section,
                            start: 'center center',
                            end: () => `+=${window.innerHeight * 10}`,
                            scrub: 1.5,
                            pin: true,
                            pinSpacing: true,
                            anticipatePin: 1,
                            invalidateOnRefresh: true,
                            onUpdate: syncStatementHandoff,
                            onRefresh: syncStatementHandoff,
                        },
                    });

                    if (!reduceMotion) {
                        timeline
                            .to({}, { duration: 1 })
                            .fromTo(
                                model,
                                { y: () => -window.innerHeight, scale: 0.96 },
                                { y: 0, scale: 1, duration: entranceDuration, ease: 'power2.inOut' }
                            )
                            .fromTo(
                                title,
                                { y: () => belowViewport(title) },
                                { y: 0, duration: entranceDuration, ease: 'power2.out' },
                                '<'
                            )
                            .fromTo(
                                sub,
                                { y: () => belowViewport(sub) },
                                { y: 0, duration: entranceDuration, ease: 'power2.out' },
                                '<'
                            )
                            .to({}, { duration: 1.5 })
                            .to(
                                model,
                                {
                                    y: () => window.innerHeight + model.offsetHeight,
                                    scale: 0.96,
                                    duration: exitDuration,
                                    ease: 'power2.inOut',
                                },
                                '>'
                            )
                            .to(
                                [eyebrow, sub],
                                {
                                    y: () => -window.innerHeight,
                                    duration: exitDuration,
                                    ease: 'power2.inOut',
                                },
                                '<'
                            )
                            .to(
                                handoffTitle,
                                {
                                    y: () => -handoffTitle.offsetTop,
                                    duration: exitDuration,
                                    ease: 'power2.inOut',
                                },
                                '<'
                            )
                            .to({}, { duration: 0.7 });
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
            delete section.dataset.handoffActive;
            if (refreshLayout) {
                window.removeEventListener('load', refreshLayout);
                window.removeEventListener('pageshow', refreshLayout);
            }
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
                        const syncPlaygroundState = (self) => {
                            const nextIndex = Math.min(
                                playgroundItems.length - 1,
                                Math.floor(self.progress * playgroundItems.length)
                            );

                            setActivePlaygroundIndex(nextIndex);

                            if (self.isActive) {
                                gsap.set(persistentTitle, { autoAlpha: 1 });
                                gsap.set(sectionTitle, { autoAlpha: 0 });
                            } else if (self.progress >= 1) {
                                gsap.set(persistentTitle, { autoAlpha: 0 });
                                gsap.set(sectionTitle, { autoAlpha: 1 });
                            } else {
                                const handoffIsActive =
                                    statementRef.current?.dataset.handoffActive === 'true';
                                gsap.set(persistentTitle, {
                                    autoAlpha: handoffIsActive ? 1 : 0,
                                });
                                gsap.set(sectionTitle, { autoAlpha: 0 });
                            }
                        };

                        ScrollTrigger.create({
                            trigger: section,
                            start: 'center center',
                            end: () => `+=${window.innerHeight * playgroundItems.length}`,
                            pin: true,
                            pinSpacing: true,
                            anticipatePin: 1,
                            invalidateOnRefresh: true,
                            onUpdate: syncPlaygroundState,
                            onRefresh: syncPlaygroundState,
                            onEnter: syncPlaygroundState,
                            onEnterBack: syncPlaygroundState,
                            onLeave: syncPlaygroundState,
                            onLeaveBack: () => {
                                gsap.set(sectionTitle, { autoAlpha: 0 });
                                const handoffIsActive =
                                    statementRef.current?.dataset.handoffActive === 'true';
                                gsap.set(persistentTitle, {
                                    autoAlpha: handoffIsActive ? 1 : 0,
                                });
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

    useEffect(() => {
        const section = driveRef.current;
        if (!section) return undefined;

        void import('@google/model-viewer');

        let context;
        let cancelled = false;
        let modelViewer;
        let handleModelLoad;
        let refreshLayout;

        Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(
            ([gsapModule, triggerModule]) => {
                if (cancelled) return;

                const gsap = gsapModule.gsap;
                const ScrollTrigger = triggerModule.ScrollTrigger;
                const title = section.querySelector('.mobility-drive__title');
                const list = section.querySelector('ol');
                const model = section.querySelector('.mobility-statement__model-entry');
                modelViewer = section.querySelector('model-viewer');
                const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                if (!title || !list || !model || !modelViewer) return;

                gsap.registerPlugin(ScrollTrigger);
                refreshLayout = () => {
                    requestAnimationFrame(() => ScrollTrigger.refresh());
                };
                handleModelLoad = () => {
                    model.classList.add('is-loaded');
                    refreshLayout();
                };
                modelViewer.addEventListener('load', handleModelLoad);
                if (modelViewer.loaded) handleModelLoad();
                window.addEventListener('load', refreshLayout);
                window.addEventListener('pageshow', refreshLayout);
                document.fonts?.ready.then(() => {
                    if (!cancelled) refreshLayout();
                });

                context = gsap.context(() => {
                    const belowViewport = (element) =>
                        window.innerHeight - element.offsetTop + element.offsetHeight;
                    const entranceDuration = 3;
                    const exitDuration = 1.8;
                    const timeline = gsap.timeline({
                        scrollTrigger: {
                            trigger: section,
                            start: 'center center',
                            end: () => `+=${window.innerHeight * 10}`,
                            scrub: 1.5,
                            pin: true,
                            pinSpacing: true,
                            anticipatePin: 1,
                            invalidateOnRefresh: true,
                        },
                    });

                    if (!reduceMotion) {
                        timeline
                            .to({}, { duration: 1 })
                            .fromTo(
                                model,
                                { y: () => -window.innerHeight, scale: 0.96 },
                                { y: 0, scale: 1, duration: entranceDuration, ease: 'power2.inOut' }
                            )
                            .fromTo(
                                title,
                                { y: () => belowViewport(title) },
                                { y: 0, duration: entranceDuration, ease: 'power2.out' },
                                '<'
                            )
                            .fromTo(
                                list,
                                { y: () => belowViewport(list) },
                                { y: 0, duration: entranceDuration, ease: 'power2.out' },
                                '<'
                            )
                            .to({}, { duration: 1.5 })
                            .to(
                                model,
                                {
                                    y: () => window.innerHeight + model.offsetHeight,
                                    scale: 0.96,
                                    duration: exitDuration,
                                    ease: 'power2.inOut',
                                },
                                '>'
                            )
                            .to(
                                [title, list],
                                {
                                    y: () => -window.innerHeight,
                                    duration: exitDuration,
                                    ease: 'power2.inOut',
                                },
                                '<'
                            )
                            .to({}, { duration: 0.7 });
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
            if (refreshLayout) {
                window.removeEventListener('load', refreshLayout);
                window.removeEventListener('pageshow', refreshLayout);
            }
            modelViewer?.removeEventListener('load', handleModelLoad);
            context?.revert();
        };
    }, []);

    useEffect(() => {
        const section = routesRef.current;
        if (
            !section ||
            window.matchMedia('(max-width: 900px)').matches ||
            window.matchMedia('(prefers-reduced-motion: reduce)').matches
        )
            return undefined;

        let context;
        let cancelled = false;

        Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(
            ([gsapModule, triggerModule]) => {
                if (cancelled) return;

                const gsap = gsapModule.gsap;
                const ScrollTrigger = triggerModule.ScrollTrigger;
                const visual = section.querySelector('.mobility-routes__visual');
                const content = section.querySelector('.mobility-routes__content');
                const heading = section.querySelector('.mobility-routes__visual-title h2');
                const intro = section.querySelector('.mobility-routes__intro');
                const difference = section.querySelector('.mobility-routes__difference');
                const exploreHeading = section.querySelector('.mobility-routes__content > h3');
                const routeList = section.querySelector('.mobility-routes ul');
                if (
                    !visual ||
                    !content ||
                    !heading ||
                    !intro ||
                    !difference ||
                    !exploreHeading ||
                    !routeList
                )
                    return;

                gsap.registerPlugin(ScrollTrigger);
                context = gsap.context(() => {
                    const revealScreens = 2.5;
                    const listTransitionScreens = 1.5;
                    const routeScreens = routes.length;
                    const routeStartScreen = revealScreens + listTransitionScreens;
                    const totalScreens = routeStartScreen + routeScreens;
                    const syncRouteState = (self) => {
                        const routePhase = self.progress * totalScreens - routeStartScreen;
                        const nextRouteListActive = routePhase >= 0;
                        const routeProgress = Math.max(
                            0,
                            Math.min(0.999999, routePhase / routeScreens)
                        );
                        const nextIndex = Math.floor(routeProgress * routeScreens);
                        setIsRouteListActive((currentValue) =>
                            currentValue === nextRouteListActive
                                ? currentValue
                                : nextRouteListActive
                        );
                        setActiveRouteIndex((currentIndex) =>
                            currentIndex === nextIndex ? currentIndex : nextIndex
                        );
                    };
                    const timeline = gsap.timeline({
                        scrollTrigger: {
                            trigger: section,
                            start: 'center center',
                            end: () => `+=${window.innerHeight * totalScreens}`,
                            scrub: 1,
                            pin: true,
                            pinSpacing: true,
                            anticipatePin: 1,
                            invalidateOnRefresh: true,
                            onUpdate: syncRouteState,
                            onRefresh: syncRouteState,
                        },
                    });

                    timeline
                        .to({}, { duration: 0.5 })
                        .fromTo(
                            visual,
                            { width: '100%' },
                            { width: '50%', duration: 2, ease: 'power2.inOut' }
                        )
                        .fromTo(
                            heading,
                            {
                                fontSize: () =>
                                    `${Math.max(74, Math.min(120, window.innerWidth * 0.0625))}px`,
                            },
                            {
                                fontSize: () =>
                                    `${Math.max(58, Math.min(80, window.innerWidth * 0.04167))}px`,
                                duration: 2,
                                ease: 'power2.inOut',
                            },
                            '<'
                        )
                        .fromTo(
                            content,
                            { autoAlpha: 0, xPercent: 20 },
                            { autoAlpha: 1, xPercent: 0, duration: 1.5, ease: 'power2.out' },
                            '-=1.2'
                        )
                        .to({}, { duration: 0.5 })
                        .to([intro, difference, exploreHeading], {
                            y: () => -window.innerHeight,
                            autoAlpha: 0,
                            duration: 1.2,
                            ease: 'power2.inOut',
                        })
                        .to(
                            routeList,
                            {
                                top: '7.593%',
                                duration: 1.5,
                                ease: 'power2.inOut',
                            },
                            '<'
                        )
                        .to({}, { duration: routes.length * 1.2 });

                    section.dataset.scrollTrigger = timeline.scrollTrigger ? 'active' : 'inactive';
                    requestAnimationFrame(() => ScrollTrigger.refresh());
                }, section);
            }
        );

        return () => {
            cancelled = true;
            context?.revert();
        };
    }, []);

    useEffect(() => {
        const section = galleryRef.current;
        if (!section) return undefined;

        let context;
        let cancelled = false;

        Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(
            ([gsapModule, triggerModule]) => {
                if (cancelled) return;

                const gsap = gsapModule.gsap;
                const ScrollTrigger = triggerModule.ScrollTrigger;

                gsap.registerPlugin(ScrollTrigger);
                context = gsap.context(() => {
                    const galleryImages = Array.from(section.querySelectorAll('img'));
                    const layersToRemove = galleryImages.slice(1).reverse();
                    const entranceDelayScreens = 0.6;
                    const betweenLayerDelayScreens = 0.5;
                    const releaseDelayScreens = 0.6;
                    const timeline = gsap.timeline({
                        scrollTrigger: {
                            trigger: section,
                            start: 'center center',
                            end: () =>
                                `+=${
                                    window.innerHeight *
                                    (layersToRemove.length +
                                        entranceDelayScreens +
                                        betweenLayerDelayScreens *
                                            Math.max(0, layersToRemove.length - 1) +
                                        releaseDelayScreens)
                                }`,
                            scrub: 1,
                            pin: true,
                            pinSpacing: true,
                            anticipatePin: 1,
                            invalidateOnRefresh: true,
                        },
                    });

                    timeline.to({}, { duration: entranceDelayScreens });
                    layersToRemove.forEach((image, index) => {
                        timeline.to(image, {
                            y: () => -(image.offsetTop + image.offsetHeight),
                            duration: 2,
                            ease: 'none',
                        });
                        if (index < layersToRemove.length - 1) {
                            timeline.to({}, { duration: betweenLayerDelayScreens });
                        }
                    });
                    timeline.to({}, { duration: releaseDelayScreens });

                    section.dataset.scrollTrigger = timeline.scrollTrigger ? 'active' : 'inactive';
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

            <section className="mobility-drive mobility-section" ref={driveRef}>
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

            <section className="mobility-routes mobility-section" ref={routesRef}>
                <div className="mobility-routes__visual">
                    <img
                        className={!isRouteListActive ? 'is-active' : ''}
                        src={routeOverviewImage}
                        alt="현대 모터스튜디오 고양 드라이빙 경로 지도"
                    />
                    {routes.map((route, index) => (
                        <img
                            key={route.title}
                            className={
                                isRouteListActive && index === activeRouteIndex ? 'is-active' : ''
                            }
                            src={route.image}
                            alt={`${route.title} 경로 이미지`}
                        />
                    ))}
                    <div
                        className={`mobility-routes__visual-title${
                            isRouteListActive ? ' is-hidden' : ''
                        }`}
                    >
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
                    <ul style={{ '--active-route-index': activeRouteIndex }}>
                        {routes.map((route, index) => (
                            <li
                                key={route.title}
                                className={
                                    isRouteListActive && index === activeRouteIndex
                                        ? 'is-active'
                                        : ''
                                }
                            >
                                <small>ROUTE</small>
                                <b>{String(index + 1).padStart(2, '0')} .</b>
                                <strong>{route.title}</strong>
                                <p>{route.description}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            <section className="mobility-gallery mobility-section" ref={galleryRef}>
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
