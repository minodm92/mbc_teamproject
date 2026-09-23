import { useEffect, useRef } from 'react';
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

        Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([gsapModule, triggerModule]) => {
            if (cancelled) return;

            const gsap = gsapModule.gsap;
            const ScrollTrigger = triggerModule.ScrollTrigger;
            gsap.registerPlugin(ScrollTrigger);

            context = gsap.context(() => {
                const slides = gsap.utils.toArray('.con2-slide', section);
                const reveals = gsap.utils.toArray('.con2-slide__reveal', section);
                const introDuration = 2.6;
                const outroHoldDuration = 0.5;

                gsap.set(slides[0], { yPercent: 0 });
                gsap.set(reveals[0], { yPercent: 0 });
                gsap.set(slides.slice(1), { yPercent: 100, visibility: 'visible' });
                gsap.set(reveals.slice(1), { yPercent: -100 });

                const timeline = gsap.timeline({
                    scrollTrigger: {
                        trigger: section,
                        start: 'top top',
                        end: () => `+=${window.innerHeight * (introDuration + slides.length - 1 + outroHoldDuration)}`,
                        scrub: 0.5,
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
                        .to(
                            slide,
                            { yPercent: 0, duration: 1, ease: 'none' },
                        )
                        .to(
                            reveal,
                            { yPercent: 0, duration: 1, ease: 'none' },
                            '<',
                        );
                });

                // Keep con2_4 fully visible before releasing the pin into con3_1.
                timeline.to({}, { duration: outroHoldDuration });

                section.dataset.slideCount = String(slides.length);
                section.dataset.scrollTrigger = timeline.scrollTrigger ? 'active' : 'inactive';
                requestAnimationFrame(() => ScrollTrigger.refresh());
            }, section);
        });

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
    useEffect(() => {
        const section = transitionRef.current;
        if (!section || window.matchMedia('(prefers-reduced-motion: reduce)').matches)
            return undefined;
        let frame = 0;
        const update = () => {
            frame = 0;
            const rect = section.getBoundingClientRect();
            const distance = Math.max(1, window.innerHeight * 2.6);
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
            const detail = ease(clamp((progress - 0.42) / 0.58));
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

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            section.style.setProperty('--model-translate', '-50%');
            return undefined;
        }

        let frame = 0;
        const updateModel = () => {
            frame = 0;
            const rect = section.getBoundingClientRect();
            const distance = Math.max(1, rect.height - window.innerHeight);
            const progress = Math.min(1, Math.max(0, -rect.top / distance));
            section.style.setProperty('--model-translate', `${-200 + progress * 150}%`);
        };
        const requestModelUpdate = () => {
            if (!frame) frame = requestAnimationFrame(updateModel);
        };

        updateModel();
        window.addEventListener('scroll', requestModelUpdate, { passive: true });
        window.addEventListener('resize', requestModelUpdate);

        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener('scroll', requestModelUpdate);
            window.removeEventListener('resize', requestModelUpdate);
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

            <section className="mobility-intro con2" ref={transitionRef} aria-label="차량 모델 소개">
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
                        SEE MORE IN
                        <br />
                        MOTOR PLAYGROUND
                    </h2>
                    <p>
                        FROM THE FIRST TOUCH TO THE OPEN ROAD,
                        <br />
                        EXPERIENCE EVERY DETAIL AS IT WAS MEANT TO BE FELT.
                    </p>
                    <div className="mobility-statement__model" aria-label="2024 Hyundai Elantra N 3D model">
                        <model-viewer
                            src="/models/2024_hyundai_elantra_n.glb"
                            alt="2024 Hyundai Elantra N"
                            camera-orbit="0deg 75deg 105%"
                            field-of-view="30deg"
                            shadow-intensity="1"
                            interaction-prompt="none"
                            disable-zoom
                        />
                    </div>
                </div>
            </section>

            <section className="mobility-playground mobility-section">
                <h2>MOTOR PLAYGOUND</h2>
                <ol className="mobility-playground__list">
                    <li className="is-active">
                        <span>01</span>
                        <strong>Build a connection through every interaction</strong>
                        <p>
                            차량의 실루엣과 균형 잡힌 비례를 가까이에서 살펴볼 수 있습니다. 빛과
                            시선에 따라 달라지는 섬세한 디자인의 깊이를 발견해 보세요.
                        </p>
                    </li>
                    <li><span>02</span><strong>Step inside and experience thoughtful comfort</strong></li>
                    <li><span>03</span><strong>Build a connection through every interaction</strong></li>
                    <li><span>04</span><strong>Discover intelligence designed around your journey</strong></li>
                    <li><span>05</span><strong>Imagine every possibility beyond the showroom</strong></li>
                </ol>
                <img
                    className="mobility-playground__image"
                    src="/images/mobility/playground-con4-primary.png"
                    alt="모터 플레이그라운드에 전시된 빨간색 차량을 살펴보는 방문객"
                />
            </section>

            <section className="mobility-drive mobility-section">
                <div className="mobility-drive__title">
                    <h2>
                        CHOOSE YOUR ROAD
                        <br />
                        OWN THE DRIVE
                    </h2>
                    <p>
                        DISCOVER DISTINCT ROUTES DESIGNED TO REVEAL A DIFFERENT SIDE OF EVERY
                        DRIVE.
                    </p>
                </div>
                <div className="mobility-drive__model">
                    <img src="/images/mobility/drive-top-primary.png" alt="위에서 바라본 파란색 차량" />
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
                <img src="/images/mobility/route-hero-primary.jpg" alt="안개가 내려앉은 숲길 전경" />
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
                            직접 느껴보세요. 나의 운전 스타일과 목적에 가장 잘 어울리는 코스를 선택해
                            새로운 이동의 즐거움을 발견할 수 있습니다.
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
