import { Link } from 'react-router-dom';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { paths } from '../../common/router/routePaths';
import './ProgramContent.css';

gsap.registerPlugin(ScrollTrigger);

const asset = (number) => `/images/programs/program-${String(number).padStart(2, '0')}.png`;

const stripImages = Array.from(
    { length: 7 },
    (_, index) => `/images/programs/program-con2-${String(index + 1).padStart(2, '0')}.svg`,
);
const locationPrograms = [
    { image: 1, x: 2613, title: '나만의 다이캐스트 꾸미기', description: '다이캐스트 커스텀 문화를 배우고 자신만의 다이캐스트를 직접 완성해 보며, 자동차 문화의 색다른\n재미를 느껴보는 프로그램입니다.', age: '8세~11세' },
    { image: 2, x: 3600, title: '현대자동차 어린이 직업체험 워크샵', description: '현대 모터스튜디오 12년의 기록 전시를 어린이 가이드 투어를 통해 쉽고 재미있게 체험하며 연관된 다양한\n직업 세계를 탐구하고 전문가용 태블릿으로 직접 디자인해 보는 드로잉 워크샵입니다.', age: '08세~11세' },
    { image: 4, x: 5489, title: '리틀 연구원의 수소에너지 탐험', description: '수소에너지를 이해하고, 수전해 실험과 넥쏘 조립을 직접 해보며, 스스로 전기를 만들어 달리는\n수소전기차와 핵심 부품인 ‘연료전지 스택’의 구동 원리를 배우는 클래스입니다.', age: '10세~13세' },
    { image: 3, x: 6523, title: '어린이 교통안전 교육 (단체)', description: '생활 속 교통사고 위험 상황을 이해하고, 보행과 통학버스 이용 시 필요한 안전 수칙 및 대처\n방법을 배울 수 있는 교육 프로그램입니다.', age: '어린이집/유치원 (6~7세), 초등학교 1-2학년 (8~9세)' },
    { image: 5, x: 7557, title: '수소전기차와 오호볼 이야기', description: "환경을 지키기 위한 현대자동차의 노력 '수소전기차'의 원리에 대해 배우고, 오호볼을 만들어보며\n환경과 미래 기술에 대해 생각해 보는 클래스입니다.", age: '06세~10세' },
    { image: 6, x: 8591, title: '로블록스 크리에이터 코딩 랩', description: '현대자동차 그룹의 미래 모빌리티에 대해 배우고, 그 모빌리티를 활용하여 로블록스\n스튜디오에서 직접 obby 맵을 제작해 보는 코딩 교육입니다.', age: '11세~13세' },
];
const discoverPrograms = [
    { image: 1, title: '어린이 교통안전 교육 (단체)' },
    { image: 2, title: '아틀라스 로봇 퍼즐 워크샵' },
    { image: 4, title: '현대자동차 직업체험 워크샵' },
    { image: 3, title: '초보운전자 정비 워크샵' },
    { image: 5, title: '아이오닉 5 충전 원리 체험 워크샵' },
];

const scheduleData = {
    16: [
    {
        location: '고양',
        image: '/images/programs/program-monthly-01.svg',
        title: '아이오닉 6 자율주행 기술 체험 워크샵',
        description: '아이오닉 6를 직접 만들어 주행해 보며 현대자동차의 자율주행 자동차와\n지능형 안전 기술에 대해 배워보는 클래스입니다.',
    },
    {
        location: '고양',
        image: '/images/programs/program-monthly-02.svg',
        title: '아이오닉 5 충전 원리 체험 워크샵',
        description: '아이오닉 5와 현대 모터스튜디오 충전 스테이션을 직접 만들고, 충전과\n주행을 해보면서 전기자동차가 움직이는 모습을 체험하는 클래스입니다.',
    },
    {
        location: '부산',
        image: '/images/programs/program-monthly-03.svg',
        title: '레고와 함께하는 SPOT 로봇 코딩 워크샵',
        description: '사람을 대신하여 다양한 임무를 수행하는 SPOT 로봇을 코딩 교육을 통해 직접\n움직여 보면서 우리의 생활을 더 편리하게 해주는 미래 모빌리티를 직접 경험해 보세요.',
    },
    ],
    17: [
        {
            location: '고양',
            image: '/images/programs/program-monthly-17-01.svg',
            title: '레고와 함께하는 미래자동차 코딩 워크샵 (새싹 Ver)',
            description: '미래 자동차의 다양한 기술과 자율주행의 원리를 아이들이 쉽게 이해할 수 있는\n새싹 단계 코딩 교육을 통해 재미있게 체험하는 클래스입니다.',
        },
        {
            location: '서울',
            image: '/images/programs/program-monthly-17-02.svg',
            title: '수소전기차와 오호볼 이야기',
            description: "환경을 지키기 위한 현대자동차의 노력 '수소전기차'의 원리에 대해 배우고,\n오호볼을 만들어보며 환경과 미래 기술에 대해 생각해 보는 클래스입니다.",
        },
        {
            location: '서울',
            image: '/images/programs/program-monthly-17-03.svg',
            title: '현대자동차 직업체험 워크샵 - 한국어',
            description: '현대자동차 엔지니어, 연구원, 디자이너가 되어 Into The Car 전시를 색다르게\n경험하는 어린이 가이드 투어 프로그램입니다.',
        },
    ],
};

function Calendar({ selectedDate, onSelectDate }) {
    const days = ['', 31, ...Array.from({ length: 30 }, (_, index) => index + 1), '', '', ''];
    return (
        <div className="program-calendar">
            <header>
                <img src="/images/programs/program-calendar-arrow-left.svg" alt="이전 달" />
                <strong>2026. 09</strong>
                <img src="/images/programs/program-calendar-arrow-right.svg" alt="다음 달" />
            </header>
            <div className="program-calendar__week">{['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day) => <span key={day}>{day}</span>)}</div>
            <div className="program-calendar__days">
                {days.map((day, index) => (
                    <span
                        className={`${day && (day === 31 || day <= 15 || (day === 16 && selectedDate === 17)) ? 'is-muted' : ''}${day === selectedDate ? ' is-selected' : ''}${day === 16 || day === 17 ? ' is-selectable' : ''}`}
                        key={`${day}-${index}`}
                        role={day === 16 || day === 17 ? 'button' : undefined}
                        tabIndex={day === 16 || day === 17 ? 0 : undefined}
                        onClick={day === 16 || day === 17 ? () => onSelectDate(day) : undefined}
                        onKeyDown={day === 16 || day === 17 ? (event) => {
                            if (event.key === 'Enter' || event.key === ' ') {
                                event.preventDefault();
                                onSelectDate(day);
                            }
                        } : undefined}
                    >
                        {day === selectedDate && <img src="/images/programs/program-calendar-selected.svg" alt="" />}
                        <b>{day}</b>
                    </span>
                ))}
            </div>
            <Link to={paths.programReservation}>Reservation</Link>
        </div>
    );
}

function StripRevealImage({ className, src, alt, stripCount = 8 }) {
    return (
        <div className={`program-image-reveal ${className}`}>
            <img className="program-image-reveal__source" src={src} alt={alt} />
            <div className="program-image-reveal__strips" aria-hidden="true">
                {Array.from({ length: stripCount }, (_, index) => (
                    <span
                        className="program-image-reveal__strip"
                        style={{ '--strip-count': stripCount, '--strip-index': index }}
                        key={index}
                    >
                        <img src={src} alt="" />
                    </span>
                ))}
            </div>
        </div>
    );
}

export default function ProgramContent() {
    const pageRef = useRef(null);
    const openingRef = useRef(null);
    const aboutRef = useRef(null);
    const locationsRef = useRef(null);
    const [activeMarqueeItem, setActiveMarqueeItem] = useState(null);
    const [selectedDate, setSelectedDate] = useState(16);
    const [displayedDate, setDisplayedDate] = useState(16);
    const [isFeatureDetailsOpen, setIsFeatureDetailsOpen] = useState(false);
    const toggleMarqueeItem = (itemKey) => {
        if (!window.matchMedia('(hover: none)').matches) return;
        setActiveMarqueeItem((current) => current === itemKey ? null : itemKey);
    };
    const selectScheduleDate = (date) => {
        if (date === selectedDate) return;
        setSelectedDate(date);
        setDisplayedDate(date);
    };

    useEffect(() => {
        if (!isFeatureDetailsOpen) return undefined;
        const previousOverflow = document.body.style.overflow;
        const closeOnEscape = (event) => {
            if (event.key === 'Escape') setIsFeatureDetailsOpen(false);
        };
        document.body.style.overflow = 'hidden';
        document.addEventListener('keydown', closeOnEscape);
        return () => {
            document.body.style.overflow = previousOverflow;
            document.removeEventListener('keydown', closeOnEscape);
        };
    }, [isFeatureDetailsOpen]);

    useLayoutEffect(() => {
        const opening = openingRef.current;
        const hero = opening.querySelector('.program-hero');
        const visual = hero.querySelector('.program-hero__visual');
        const manifesto = opening.querySelector('.program-manifesto');
        const strip = opening.querySelector('.program-strip');
        const track = strip.querySelector('.program-strip__track');
        const group = track.querySelector('.program-strip__group');
        const images = Array.from(group.children);
        const centerIndex = Math.floor(images.length / 2);
        const target = images[centerIndex];
        const media = gsap.matchMedia();

        media.add({
            desktop: '(min-width: 1280px)',
            tablet: '(min-width: 768px) and (max-width: 1279px)',
            mobile: '(max-width: 767px)',
            narrowMobile: '(max-width: 480px)',
            motion: '(prefers-reduced-motion: no-preference)',
        }, (context) => {
            if (!context.conditions.motion) return undefined;
            if (context.conditions.mobile || context.conditions.tablet) {
                gsap.set(visual, { clearProps: 'transform,clipPath,opacity' });
                if (!context.conditions.narrowMobile) return undefined;

                const loopDistance = () => group.offsetWidth + parseFloat(getComputedStyle(group).columnGap);
                const marquee = gsap.fromTo(track, {
                    x: () => -loopDistance(),
                }, {
                    x: 0,
                    duration: () => loopDistance() / 54,
                    ease: 'none',
                    repeat: -1,
                    invalidateOnRefresh: true,
                });
                requestAnimationFrame(() => ScrollTrigger.refresh());

                return () => {
                    marquee.kill();
                    gsap.set([track, visual], { clearProps: 'transform,opacity,clipPath,transformOrigin' });
                };
            }
            const marqueeSpeed = () => window.matchMedia('(max-width: 1024px)').matches ? 66 : 90;
            const loopDistance = () => group.offsetWidth + parseFloat(getComputedStyle(group).columnGap);
            const marquee = gsap.to(track, {
                x: () => -loopDistance(),
                duration: loopDistance() / marqueeSpeed(),
                ease: 'none',
                repeat: -1,
                paused: true,
            });
            let transitionComplete = false;
            const updateMarquee = () => {
                if (transitionComplete) marquee.play();
                else marquee.pause();
                if (!transitionComplete) marquee.progress(0);
            };
            const pauseMarquee = () => marquee.pause();
            const resumeMarquee = () => {
                if (transitionComplete) marquee.play();
            };
            const marqueeItems = track.querySelectorAll('.program-strip__item');
            marqueeItems.forEach((item) => {
                item.addEventListener('pointerenter', pauseMarquee);
                item.addEventListener('pointerleave', resumeMarquee);
            });

            const timeline = gsap.timeline({
                defaults: { ease: 'none' },
                onUpdate: function () {
                    transitionComplete = this.progress() >= 0.999;
                    updateMarquee();
                },
                scrollTrigger: {
                    trigger: hero,
                    start: () => `top+=${visual.offsetTop} 30%`,
                    endTrigger: manifesto,
                    end: 'top top',
                    scrub: 0.9,
                    invalidateOnRefresh: true,
                    onRefresh: () => {
                        marquee.invalidate().duration(loopDistance() / marqueeSpeed());
                        updateMarquee();
                    },
                },
            });

            // Preserve the photo's proportions and crop to the destination frame.
            const targetScale = () => Math.max(
                target.offsetWidth / visual.offsetWidth,
                target.offsetHeight / visual.offsetHeight,
            );
            timeline.fromTo(visual, { y: 0 }, {
                y: () => manifesto.offsetTop + strip.offsetTop + target.offsetHeight / 2
                    - hero.offsetTop - visual.offsetTop - visual.offsetHeight / 2,
                duration: 1,
            }, 0);
            timeline.fromTo(visual, { scale: 1, clipPath: 'inset(0% 0%)' }, {
                scale: targetScale,
                clipPath: () => {
                    const scale = targetScale();
                    const vertical = Math.max(0, (1 - target.offsetHeight / (visual.offsetHeight * scale)) * 50);
                    const horizontal = Math.max(0, (1 - target.offsetWidth / (visual.offsetWidth * scale)) * 50);
                    return `inset(${vertical}% ${horizontal}%)`;
                },
                duration: 1,
                ease: 'power1.inOut',
            }, 0);
            images.forEach((image, index) => {
                if (index === centerIndex) return;
                timeline.fromTo(image, {
                    x: (index - centerIndex) * 32,
                    y: 24,
                    autoAlpha: 0,
                }, {
                    x: 0, y: 0, autoAlpha: 1, duration: 0.55, ease: 'power2.out',
                }, 0.35 + Math.abs(index - centerIndex) * 0.08);
            });
            // Crossfade only after both images occupy exactly the same frame.
            timeline.fromTo(target, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.22 }, 1);
            timeline.fromTo(visual, { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.22 }, 1);
            timeline.fromTo(track.querySelectorAll('[aria-hidden="true"]'),
                { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.22 }, 1);

            let disposed = false;
            // Font metrics can change the hero image position on small screens.
            document.fonts.ready.then(() => {
                if (!disposed) ScrollTrigger.refresh();
            });
            return () => {
                disposed = true;
                marqueeItems.forEach((item) => {
                    item.removeEventListener('pointerenter', pauseMarquee);
                    item.removeEventListener('pointerleave', resumeMarquee);
                });
            };
        });

        return () => media.revert();
    }, []);

    useLayoutEffect(() => {
        const section = aboutRef.current;
        const collage = section.querySelector('.program-about__collage');
        const cards = Array.from(collage.querySelectorAll('img'));
        const media = gsap.matchMedia();
        // Unrotated image positions, derived from the centers of the Figma bounds.
        const stacked = [
            { x: 1074.31, y: 285.35, rotation: -5.54 },
            { x: 1075.73, y: 294.98, rotation: -14.16 },
            { x: 1065, y: 295, rotation: 0 },
        ];
        const spread = [
            { x: 1076.353, y: 155.371, rotation: 1.91 },
            { x: 975.516, y: 266.935, rotation: -9.59 },
            { x: 1089.636, y: 420.015, rotation: 5.14 },
        ];
        const expanded = [
            { x: 1100.123, y: 109.664, rotation: 14.62 },
            { x: 953.949, y: 248.095, rotation: -3.96 },
            { x: 1124.149, y: 461.695, rotation: 14.62 },
        ];
        media.add({
            desktop: '(min-width: 1280px)',
            tablet: '(min-width: 768px) and (max-width: 1279px)',
            mobile: '(max-width: 767px)',
            phone: '(max-width: 480px)',
            motion: '(prefers-reduced-motion: no-preference)',
        }, (context) => {
            if (!context.conditions.motion) return;
            if (context.conditions.phone) {
                gsap.set(cards, { clearProps: 'transform,opacity,visibility' });
                const targetOffsets = [
                    { x: -43.7, y: -3.02, rotation: -1.57 },
                    { x: 30.52, y: -1.57, rotation: 5.36 },
                    { x: -11.42, y: -13.27, rotation: 11.77 },
                ];
                const timeline = gsap.timeline({
                    scrollTrigger: {
                        trigger: collage,
                        start: 'top 82%',
                        end: 'bottom 48%',
                        scrub: 0.65,
                        invalidateOnRefresh: true,
                    },
                });

                cards.forEach((card, index) => {
                    const offset = targetOffsets[index];
                    timeline.to(card, {
                        x: () => offset.x * (card.offsetWidth / 224),
                        y: () => offset.y * (card.offsetWidth / 224),
                        rotation: offset.rotation,
                        ease: 'none',
                        duration: 1,
                    }, 0);
                });

                return () => gsap.set(cards, { clearProps: 'transform,opacity,visibility' });
            }
            if (context.conditions.mobile || context.conditions.tablet) {
                gsap.set([section, collage, ...cards, ...section.querySelectorAll('h2,p')], { clearProps: 'all' });
                return () => gsap.set([section, collage, ...cards, ...section.querySelectorAll('h2,p')], { clearProps: 'all' });
            }
            const timeline = gsap.timeline({
                defaults: { ease: 'none' },
                scrollTrigger: {
                    trigger: section,
                    start: 'top 75%',
                    end: 'center 45%',
                    scrub: 0.7,
                    invalidateOnRefresh: true,
                },
            });

            cards.forEach((card, index) => {
                const offset = (pose, axis) => (pose[index][axis] - stacked[index][axis]) * card.offsetWidth / 570;
                timeline.fromTo(card, {
                    x: 0, y: 0, rotation: stacked[index].rotation,
                }, {
                    x: () => offset(spread, 'x'),
                    y: () => offset(spread, 'y'),
                    rotation: spread[index].rotation,
                    duration: 0.55,
                }, 0);
                timeline.to(card, {
                    x: () => offset(expanded, 'x'),
                    y: () => offset(expanded, 'y'),
                    rotation: expanded[index].rotation,
                    duration: 0.45,
                }, 0.55);
            });
        });

        return () => media.revert();
    }, []);

    useLayoutEffect(() => {
        const section = locationsRef.current;
        const canvas = section.querySelector('.program-locations__canvas');
        const intro = section.querySelector('.program-locations__intro');
        const programs = section.querySelector('.program-locations__programs');
        const media = gsap.matchMedia();

        media.add({
            desktop: '(min-width: 1280px)',
            motion: '(prefers-reduced-motion: no-preference)',
        }, (context) => {
            if (!context.conditions.desktop || !context.conditions.motion) return undefined;
            section.classList.add('program-locations--scrolling');

            // Fit the full design height before measuring its horizontal travel.
            const scale = () => Math.min(1, section.clientHeight / canvas.offsetHeight);
            const introWidth = () => window.matchMedia('(max-width: 1024px)').matches ? section.clientWidth : 1920;
            const extraSpace = () => Math.max(0, section.clientWidth / scale() - introWidth());
            const distance = () => Math.max(0, (canvas.offsetWidth + extraSpace()) * scale() - section.clientWidth);
            const cards = Array.from(programs.querySelectorAll('.program-locations__branch, .program-location-card'));
            gsap.set(cards, { x: 0, y: 0, opacity: 1 });
            const cardSetters = cards.map((card) => ({
                card,
                x: gsap.quickSetter(card, 'x', 'px'),
                y: gsap.quickSetter(card, 'y', 'px'),
                opacity: gsap.quickSetter(card, 'opacity'),
            }));
            const revealEase = gsap.parseEase('power1.out');
            const revealCards = () => {
                const viewportWidth = section.clientWidth;
                const canvasX = Number(gsap.getProperty(canvas, 'x'));
                const canvasScale = scale();
                const programOffset = extraSpace();
                const revealDistance = Math.min(760, viewportWidth * 0.65);

                cardSetters.forEach(({ card, x, y, opacity }) => {
                    // Measure the layout position, excluding the card's reveal transform.
                    const left = canvasX + (programOffset + card.offsetLeft) * canvasScale;
                    const progress = gsap.utils.clamp(0, 1, (viewportWidth - left) / revealDistance);
                    const remaining = 1 - revealEase(progress);
                    // Anchor the starting position to the viewport's bottom-right corner.
                    const startX = (viewportWidth - left) / canvasScale;
                    const startY = section.clientHeight / canvasScale - card.offsetTop;
                    x(startX * remaining);
                    y(startY * remaining);
                    opacity(Math.min(1, progress * 3));
                });
            };
            const fitCanvas = () => {
                gsap.set(canvas, { scale: scale(), transformOrigin: 'top left' });
                gsap.set(intro, { width: section.clientWidth / scale() });
                gsap.set(programs, { x: extraSpace() });
            };
            fitCanvas();
            revealCards();

            const timeline = gsap.timeline({
                onUpdate: revealCards,
                scrollTrigger: {
                    trigger: section,
                    start: 'top top',
                    end: () => `+=${Math.max(1, distance()) * 1.06}`,
                    pin: true,
                    scrub: true,
                    invalidateOnRefresh: true,
                    onRefreshInit: fitCanvas,
                    onRefresh: revealCards,
                },
            });
            // Reserve the first part of the pinned scroll for the introduction.
            timeline.to({}, { duration: 0.06 });
            timeline.to(canvas, { x: () => -distance(), duration: 1, ease: 'none' });

            return () => section.classList.remove('program-locations--scrolling');
        });

        return () => media.revert();
    }, []);

    // Tablet keeps con6 and the calendar in document flow.  Limit motion here
    // to opacity and a small vertical offset so it cannot alter their measured
    // height, horizontal geometry, or the calendar/list spacing.
    useLayoutEffect(() => {
        const page = pageRef.current;
        const media = gsap.matchMedia();

        media.add({
            tablet: '(min-width: 768px) and (max-width: 1279px)',
            motion: '(prefers-reduced-motion: no-preference)',
        }, (context) => {
            if (!context.conditions.tablet || !context.conditions.motion) return undefined;

            const calendar = page.querySelector('.program-calendar');
            const scheduleRows = page.querySelectorAll('.program-monthly__row');
            const locationGroups = page.querySelectorAll('.program-locations__group');

            if (calendar) {
                gsap.fromTo(calendar, { autoAlpha: 0, y: 20 }, {
                    autoAlpha: 1,
                    y: 0,
                    duration: 0.55,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: calendar,
                        start: 'top 88%',
                        once: true,
                        invalidateOnRefresh: true,
                    },
                });
            }

            if (scheduleRows.length) {
                gsap.fromTo(scheduleRows, { autoAlpha: 0, y: 16 }, {
                    autoAlpha: 1,
                    y: 0,
                    duration: 0.45,
                    stagger: 0.08,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: scheduleRows[0].parentElement,
                        start: 'top 86%',
                        once: true,
                        invalidateOnRefresh: true,
                    },
                });
            }

            locationGroups.forEach((group) => {
                const heading = group.querySelector('.program-locations__branch');
                const cards = group.querySelectorAll('.program-location-card');
                const targets = [heading, ...cards].filter(Boolean);
                if (!targets.length) return;

                gsap.fromTo(targets, { autoAlpha: 0, y: 20 }, {
                    autoAlpha: 1,
                    y: 0,
                    duration: 0.55,
                    stagger: 0.08,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: group,
                        start: 'top 82%',
                        once: true,
                        invalidateOnRefresh: true,
                    },
                });
            });

            // matchMedia.revert() restores every inline transform/opacity when
            // the breakpoint changes, including the individual location cards.
            return undefined;
        });

        return () => media.revert();
    }, []);

    useLayoutEffect(() => {
        const page = pageRef.current;
        const track = page.querySelector('.program-cards__track');
        const media = gsap.matchMedia();

        media.add({
            desktop: '(min-width: 1280px)',
            tablet: '(min-width: 768px) and (max-width: 1279px)',
            mobile: '(max-width: 767px)',
            motion: '(prefers-reduced-motion: no-preference)',
        }, (context) => {
            if (!context.conditions.motion) return;

            const marquee = gsap.to(track, {
                xPercent: -50,
                duration: context.conditions.mobile || context.conditions.tablet ? 38 : 28,
                ease: 'none',
                repeat: -1,
            });
            const pauseMarquee = () => marquee.pause();
            const resumeMarquee = () => marquee.play();
            const marqueeItems = track.querySelectorAll('.program-cards__item');
            marqueeItems.forEach((item) => {
                item.addEventListener('pointerenter', pauseMarquee);
                item.addEventListener('pointerleave', resumeMarquee);
            });

            return () => {
                marqueeItems.forEach((item) => {
                    item.removeEventListener('pointerenter', pauseMarquee);
                    item.removeEventListener('pointerleave', resumeMarquee);
                });
                marquee.kill();
            };
        });

        return () => media.revert();
    }, []);

    useLayoutEffect(() => {
        const page = pageRef.current;
        const media = gsap.matchMedia();

        media.add({
            desktop: '(min-width: 1280px)',
            tablet: '(min-width: 768px) and (max-width: 1279px)',
            motion: '(prefers-reduced-motion: no-preference)',
        }, (context) => {
            if (!context.conditions.motion || context.conditions.tablet) return undefined;
            const sections = page.querySelectorAll('section:not(.program-hero):not(.program-monthly):not(.program-feature):not(.program-locations):not(.program-discover):not(.program-cards)');
            const textSelector = [
                'h2', 'h3', 'p', 'strong', 'dt', 'dd',
                '.program-monthly__row > span',
                '.program-feature__content > span',
                '.program-feature__actions > a',
                '.program-calendar__week',
                '.program-calendar__days',
                '.program-calendar > a',
            ].join(', ');

            sections.forEach((section) => {
                if (!context.conditions.desktop && section.classList.contains('program-about')) return;
                section.querySelectorAll(textSelector).forEach((text) => {
                    gsap.fromTo(text, { y: -28, autoAlpha: 0 }, {
                        y: 0,
                        autoAlpha: 1,
                        duration: 0.75,
                        ease: 'power2.out',
                        scrollTrigger: {
                            trigger: text,
                            start: 'top 90%',
                            toggleActions: 'play none none reverse',
                            invalidateOnRefresh: true,
                        },
                    });
                });
            });


            const discover = page.querySelector('.program-discover');
            const discoverHeading = discover?.querySelector('h2');
            const discoverDescription = discover?.querySelector('p');

            if (discoverHeading && !discoverHeading.querySelector('.program-discover__line')) {
                const [firstLine, secondLine, thirdLine] = context.conditions.desktop
                    ? ['DISCOVER HANDS-ON PROGRAMS', 'AT HYUNDAI MOTORSTUDIO.', null]
                    : ['DISCOVER HANDS-ON', 'PROGRAMS AT', 'HYUNDAI MOTORSTUDIO.'];
                discoverHeading.replaceChildren(
                    Object.assign(document.createElement('span'), { className: 'program-discover__line', textContent: firstLine }),
                    Object.assign(document.createElement('span'), { className: 'program-discover__line', textContent: secondLine }),
                    ...(thirdLine ? [Object.assign(document.createElement('span'), { className: 'program-discover__line', textContent: thirdLine })] : []),
                );
            }
            discoverDescription?.classList.add('program-discover__line');
            const discoverLines = discover?.querySelectorAll('.program-discover__line');

            if (discoverLines?.length && discover?.dataset.legacyAnimation === 'true') {
                discoverLines.forEach((line) => gsap.fromTo(line, { xPercent: -120, autoAlpha: 0 }, {
                    xPercent: 0,
                    autoAlpha: 1,
                    duration: 0.7,
                    ease: 'power2.out',
                    stagger: 0,
                    scrollTrigger: {
                        trigger: line,
                        start: 'top 88%',
                        toggleActions: 'play none none reverse',
                        invalidateOnRefresh: true,
                    },
                }));
            }
            // con7 sticky sequence
            if (discoverLines?.length && context.conditions.desktop) {
                const [firstLine, secondLine, thirdLine] = discoverLines;
                const discoverTimeline = gsap.timeline({
                    scrollTrigger: {
                        trigger: discover,
                        start: 'top 78%',
                        end: 'bottom 22%',
                        scrub: 0.7,
                        invalidateOnRefresh: true,
                    },
                });
                discoverTimeline
                    .fromTo(firstLine, { xPercent: -120, autoAlpha: 0 }, { xPercent: 0, autoAlpha: 1, duration: 0.8, ease: 'none' })
                    .to(firstLine, { xPercent: 0, autoAlpha: 1, duration: 0.45, ease: 'none' })
                    .to(firstLine, { y: -40, autoAlpha: 0, duration: 0.55, ease: 'none' })
                    .fromTo(secondLine, { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7, ease: 'none' }, '<')
                    .to(secondLine, { y: 0, autoAlpha: 1, duration: 0.45, ease: 'none' })
                    .to(secondLine, { y: -40, autoAlpha: 0, duration: 0.55, ease: 'none' })
                    .to([firstLine, secondLine], { xPercent: 0, y: 0, autoAlpha: 1, duration: 0.6, ease: 'none' })
                    .fromTo(thirdLine, { y: -36, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6, ease: 'none' }, '<')
                    .to([firstLine, secondLine, thirdLine], { y: 0, autoAlpha: 1, duration: 0.65, ease: 'none' })
                    .to({}, { duration: 1.5 });
            } else if (discoverLines?.length) {
                gsap.fromTo(discoverLines, { y: 20, autoAlpha: 0 }, {
                    y: 0,
                    autoAlpha: 1,
                    duration: 0.55,
                    stagger: 0.1,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: discover,
                        start: 'top 78%',
                        once: true,
                        invalidateOnRefresh: true,
                    },
                });
            }

            // con5 desktop visual: a single right-to-left reveal. It uses the
            // image source itself (rather than moving the layout wrapper), so
            // the text column and section geometry remain completely stable.
            const featureVisual = page.querySelector('.program-feature__visual');
            const featureSource = featureVisual?.querySelector('.program-image-reveal__source');
            const featureStrips = featureVisual?.querySelector('.program-image-reveal__strips');
            if (featureVisual && featureSource) {
                gsap.set(featureStrips, { display: 'none' });
                gsap.set(featureSource, { autoAlpha: 1, clipPath: 'inset(0 0 0 100%)' });
                gsap.to(featureSource, {
                    clipPath: 'inset(0 0% 0 0)',
                    duration: 1.05,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: featureVisual,
                        start: 'top 82%',
                        once: true,
                        invalidateOnRefresh: true,
                    },
                });
            }

            page.querySelectorAll('.program-image-reveal:not(.program-feature__visual)').forEach((reveal) => {
                const source = reveal.querySelector('.program-image-reveal__source');
                const stripLayer = reveal.querySelector('.program-image-reveal__strips');
                const strips = reveal.querySelectorAll('.program-image-reveal__strip');

                gsap.set(source, { autoAlpha: 0 });
                gsap.set(stripLayer, { display: 'flex' });
                gsap.set(strips, { clipPath: 'inset(0 0 100% 0)' });

                gsap.timeline({
                    scrollTrigger: {
                        trigger: reveal,
                        start: 'top 88%',
                        once: true,
                        invalidateOnRefresh: true,
                    },
                    onComplete: () => {
                        gsap.set(source, { autoAlpha: 1 });
                        gsap.set(stripLayer, { display: 'none' });
                    },
                }).to(strips, {
                    clipPath: 'inset(0 0 0% 0)',
                    duration: 1.25,
                    ease: 'power2.out',
                    stagger: {
                        amount: 0.18,
                        from: 'start',
                    },
                });
            });
        });

        return () => media.revert();
    }, []);

    return (
        <main className="program-page" ref={pageRef}>
            <div className="program-opening" ref={openingRef}>
            <section className="program-hero">
                <h1>Explore Programs<br />Through Creative<br />Experiences</h1>
                <p>현대 모터스튜디오의 다양한 프로그램을 만나보세요.<br />새로운 아이디어를 발견하고, 직접 만들어보며, 다양한 방식으로 모빌리티를 경험할 수 있습니다.</p>
                <div className="program-hero__visual"><img src={asset(1)} alt="자동차 디자인 프로그램을 체험하는 모습" /></div>
            </section>

            <section className="program-manifesto">
                <div className="program-strip">
                    <div className="program-strip__track">
                        <div className="program-strip__group">
                            {stripImages.map((image) => (
                                <span className="program-strip__item" key={image}>
                                    <span className="program-strip__motion"><img src={image} alt="" draggable={false} /></span>
                                </span>
                            ))}
                        </div>
                        {['before', 'after'].map((position) => (
                            <div className={`program-strip__group program-strip__group--${position}`} aria-hidden="true" key={position}>
                                {stripImages.map((image) => (
                                    <span className="program-strip__item" key={image}>
                                        <span className="program-strip__motion"><img src={image} alt="" draggable={false} /></span>
                                    </span>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
                <p>탐색 · 창작 · 경험 · 발견</p>
                <h2>Experience Mobility in New Ways<br />Through Creative Programs at Hyundai Motorstudio</h2>
            </section>

            </div>

            <section className="program-about" ref={aboutRef}>
                <div><h2>Explore More Than<br />Just Mobility</h2><p>현대 모터스튜디오의 프로그램은 자동차를 중심으로 디자인, 기술, 창작 활동까지 다양한 경험을 제공합니다. 단순히 정보를 보는 것에서 그치지 않고, 직접 만들고 탐색하며 새로운 방식으로 모빌리티를 이해할 수 있도록 구성되어 있습니다.<br /><br />아이들은 물론 다양한 방문객이 각자의 관심에 맞는 프로그램을 경험하며 아이디어를 발견하고, 창의적인 활동을 통해 새로운 가능성을 자연스럽게 만나볼 수 있습니다.</p></div>
                <div className="program-about__collage">
                    {[1, 2, 3].map((image) => (
                        <img
                            src={`/images/programs/program-con3-${String(image).padStart(2, '0')}.svg`}
                            alt="창의 프로그램 체험"
                            key={image}
                        />
                    ))}
                </div>
            </section>

            <section className="program-monthly">
                <div className="program-monthly__heading"><h2>MONTHLY CALENDAR</h2><p>이번 달 현대 모터스튜디오에서 진행되는<br />다양한 프로그램을 확인해 보세요.</p></div>
                <Calendar selectedDate={selectedDate} onSelectDate={selectScheduleDate} />
                <div className="program-monthly__programs" key={displayedDate}>
                    {scheduleData[displayedDate].map((program) => (
                        <div className="program-monthly__row" key={program.title}>
                            <span>{program.location}</span>
                            <article>
                                <img src={program.image} alt="" />
                                <div>
                                    <h3>{program.title}</h3>
                                    <p>{program.description}</p>
                                </div>
                            </article>
                        </div>
                    ))}
                </div>
            </section>

            <section className="program-feature" id="program-details">
                <div className="program-feature__content">
                    <span>모빌리티 · 코딩 · 창작 · 체험</span>
                    <h2>레고와 함께하는<br />미래자동차<br />코딩 워크샵</h2>
                    <p>미래 자동차의 다양한 기술과 자율주행의 원리를 아이들이<br />쉽게 이해할 수 있는 새싹 단계 코딩 교육을 통해 재미있게 체험하는 클래스입니다.</p>
                    <h3>Learn More</h3>
                    <dl className="program-feature__information">
                        <div>
                            <dt>참여 가능 연령</dt><dd>07세–09세</dd>
                            <img src="/images/programs/program-feature-child.svg" alt="" />
                        </div>
                        <div>
                            <dt>소요 시간</dt><dd>80분</dd>
                            <img src="/images/programs/program-feature-clock.svg" alt="" />
                        </div>
                        <div>
                            <dt>운영 시간</dt><dd>금 17:00 · 토 10:00</dd>
                            <span className="program-feature__calendar" aria-hidden="true">
                                <img src="/images/programs/program-feature-calendar-body.svg" alt="" />
                                <img src="/images/programs/program-feature-calendar-top.svg" alt="" />
                            </span>
                        </div>
                    </dl>
                    <div className="program-feature__actions">
                        <Link to={paths.programReservation}>Reservation</Link>
                        <button type="button" onClick={() => setIsFeatureDetailsOpen(true)}>Details</button>
                    </div>
                </div>
                <StripRevealImage
                    className="program-feature__visual"
                    src="/images/programs/program-feature-main.svg"
                    alt="레고로 만든 미래자동차 코딩 워크샵 모형"
                />
            </section>

            <section className="program-locations" ref={locationsRef} tabIndex={0} aria-label="지점별 프로그램">
                <div className="program-locations__canvas">
                    <div className="program-locations__intro">
                        <h2>PROGRAMS BY LOCATION</h2>
                        <p>각 지점에서 만나볼 수 있는 다양한 체험 프로그램을 확인해보세요.</p>
                    </div>
                    <div className="program-locations__programs">
                        <div className="program-locations__group program-locations__group--seoul">
                            <div className="program-locations__branch program-locations__branch--seoul">
                                <h3>SEOUL<br />PROGRAMS</h3>
                                <p>서울 지점의 다양한 프로그램을 만나보세요.</p>
                            </div>
                            <div className="program-locations__cards">
                                {locationPrograms.slice(0, 2).map((program) => (
                                    <article className="program-location-card" style={{ '--program-x': `${program.x}px` }} key={program.title}>
                                        <img src={`/images/programs/program-location-${String(program.image).padStart(2, '0')}.svg`} alt={program.title} />
                                        <div>
                                            <h4>{program.title}</h4>
                                            <p>{program.description}</p>
                                            <dl><dt>참여가능연령</dt><dd>{program.age}</dd></dl>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </div>
                        <div className="program-locations__group program-locations__group--goyang">
                            <div className="program-locations__branch program-locations__branch--goyang">
                                <h3>GOYANG<br />PROGRAMS</h3>
                                <p>고양 지점의 다양한 프로그램을 만나보세요.</p>
                            </div>
                            <div className="program-locations__cards">
                                {locationPrograms.slice(2).map((program) => (
                                    <article className="program-location-card" style={{ '--program-x': `${program.x}px` }} key={program.title}>
                                        <img src={`/images/programs/program-location-${String(program.image).padStart(2, '0')}.svg`} alt={program.title} />
                                        <div>
                                            <h4>{program.title}</h4>
                                            <p>{program.description}</p>
                                            <dl><dt>참여가능연령</dt><dd>{program.age}</dd></dl>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="program-discover"><h2>DISCOVER HANDS-ON PROGRAMS<br />AT HYUNDAI MOTORSTUDIO.</h2><p>각 지점에서 만나볼 수 있는 다양한 체험 프로그램을 확인해보세요.</p></section>
            <section className="program-cards" aria-label="체험 프로그램 목록">
                <div className="program-cards__track">
                    <div className="program-cards__group">
                        {discoverPrograms.map((program) => (
                            <Link
                                className={`program-cards__item program-marquee-item${activeMarqueeItem === `con8-${program.image}` ? ' is-active' : ''}`}
                                to={paths.programReservation}
                                key={program.title}
                                onClick={(event) => {
                                    if (!window.matchMedia('(hover: none)').matches) return;
                                    event.preventDefault();
                                    toggleMarqueeItem(`con8-${program.image}`);
                                }}
                            >
                                <img src={`/images/programs/program-discover-${String(program.image).padStart(2, '0')}.svg`} alt={program.title} />
                                <span className="program-marquee-item__overlay" aria-hidden="true">
                                    <span className="program-marquee-item__category">KIDS PROGRAM</span>
                                    <strong className="program-marquee-item__title">{program.title}</strong>
                                    <span className="program-marquee-item__link">VIEW →</span>
                                </span>
                            </Link>
                        ))}
                    </div>
                    <div className="program-cards__group" aria-hidden="true">
                        {discoverPrograms.map((program) => (
                            <Link
                                className={`program-cards__item program-marquee-item${activeMarqueeItem === `con8-${program.image}` ? ' is-active' : ''}`}
                                to={paths.programReservation}
                                key={program.title}
                                tabIndex={-1}
                                onClick={(event) => {
                                    if (!window.matchMedia('(hover: none)').matches) return;
                                    event.preventDefault();
                                    toggleMarqueeItem(`con8-${program.image}`);
                                }}
                            >
                                <img src={`/images/programs/program-discover-${String(program.image).padStart(2, '0')}.svg`} alt="" />
                                <span className="program-marquee-item__overlay" aria-hidden="true">
                                    <span className="program-marquee-item__category">KIDS PROGRAM</span>
                                    <strong className="program-marquee-item__title">{program.title}</strong>
                                    <span className="program-marquee-item__link">VIEW →</span>
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
            <section className="program-closing">
                <StripRevealImage
                    className="program-closing__visual"
                    src="/images/programs/program-closing.svg"
                    alt="현대 모터스튜디오 프로그램에 참여하는 어린이들"
                />
            </section>
            {isFeatureDetailsOpen && (
                <div className="program-detail-modal" role="presentation" onMouseDown={() => setIsFeatureDetailsOpen(false)}>
                    <section className="program-detail-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="program-detail-title" onMouseDown={(event) => event.stopPropagation()}>
                        <button className="program-detail-modal__close" type="button" aria-label="상세 정보 닫기" onClick={() => setIsFeatureDetailsOpen(false)}>×</button>
                        <img className="program-detail-modal__image" src="/images/programs/program-feature-main.svg" alt="레고로 만든 미래자동차 코딩 워크샵 모형" />
                        <div className="program-detail-modal__content">
                            <h2 id="program-detail-title">레고와 함께하는 미래자동차 코딩 워크샵 (새싹 ver)</h2>
                            <p>미래 자동차의 다양한 기술과 자율주행의 원리를 아이들이 쉽게 이해할 수 있는 새싹 단계 코딩 교육을 통해 재미있게 체험하는 클래스입니다.</p>
                            <Link to={paths.programReservation} onClick={() => setIsFeatureDetailsOpen(false)}>예약하기</Link>
                            <dl className="program-detail-modal__info">
                                <div><dt>참여가능연령</dt><dd>07세–09세</dd></div>
                                <div><dt>운영시간</dt><dd>금 17:00, 토 10:00</dd></div>
                                <div><dt>소요시간</dt><dd>80분</dd></div>
                                <div><dt>참가비</dt><dd>22,000원</dd></div>
                            </dl>
                            <div className="program-detail-modal__notice">
                                <strong>ⓘ 유의사항</strong>
                                <ul>
                                    <li>참가비에는 기념사진과 상설 전시 어린이 티켓 1매가 포함되어 있습니다.</li>
                                    <li>레고 코딩 교구는 체험용이며 증정되지 않습니다.</li>
                                    <li>본 프로그램은 보호자 당 어린이 1명 참여가 원칙이며, 부모님 미동반 프로그램입니다.</li>
                                    <li>연령에 맞지 않을 경우, 프로그램 참여가 제한될 수 있습니다.</li>
                                </ul>
                            </div>
                        </div>
                    </section>
                </div>
            )}
        </main>
    );
}
