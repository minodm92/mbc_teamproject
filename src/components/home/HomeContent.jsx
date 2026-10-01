import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';
import { locations } from '../../common/data/content';
import { paths } from '../../common/router/routePaths';
import { HomeHero, HomeStories, VisitorGuide } from '../../components/home/HomeSections';
import SpiralGallery from './SpiralGallery';
import { createSpiralPath, spiralStripPose } from './spiralPath';
import { homeAsset as asset } from './homeAssets';
import './HomeContent.css';

gsap.registerPlugin(ScrollTrigger, TextPlugin);

const driveModels = [
    {
        name: 'GV80',
        image: asset('drive-gv80.png'),
        shadow: asset('drive-shadow-standard.svg'),
        title: '아웃도어 라이프_데이트립 드라이브',
        copy: '넉넉한 시간과 자유로운 코스로 차량의 주행감과 편의성을 경험해보세요.\n일상 속에서 차량의 매력을 더욱 깊이 느낄 수 있습니다.',
    },
    {
        name: 'IONIQ5N',
        image: asset('drive-ioniq5n.png'),
        shadow: asset('drive-shadow-ioniq5n.svg'),
        vehicleClass: 'is-ioniq5n',
        shadowClass: 'is-ioniq5n',
        title: '하이 퍼포먼스 드라이브_언택트',
        copy: 'N 브랜드의 강렬한 퍼포먼스와 고성능 감성을 직접 경험해보세요.\n공공도로 주행을 통해 역동적인 드라이빙의 즐거움을 느낄 수 있습니다.',
    },
    {
        name: 'CASPER',
        image: asset('drive-casper.png'),
        shadow: asset('drive-shadow-casper.svg'),
        vehicleClass: 'is-casper',
        shadowClass: 'is-casper',
        title: '베이직 드라이브',
        copy: '자동차 전문가 Guru의 친절한 설명과 함께 다양한 현대자동차를 직접 시승해보세요.\n차량의 특징과 주행 감각을 보다 쉽고 깊이 있게 경험할 수 있습니다.',
    },
    {
        name: 'G90',
        image: asset('drive-g90.png'),
        shadow: asset('drive-shadow-g90.svg'),
        vehicleClass: 'is-g90',
        shadowClass: 'is-g90',
        title: '아웃도어 라이프_데이트립 드라이브',
        copy: '자동차 전문가 Guru의 설명과 함께 현대자동차의 다양한 차량을 시승해보세요.\n차량의 특징과 주행 감각을 보다 쉽고 편안하게 경험할 수 있습니다.',
    },
];
const exhibitionVehicles = [
    { name: 'AVANTE N', powertrain: 'GASOLINE 2.0 TURBO', color: 'PERFORMANCE BLUE', image: 'vehicle-1.svg', position: 'is-avante-n' },
    { name: 'THE NEW GRANDEUR', powertrain: '3.5 GASOLINE CALLIGRAPHY', color: 'ABYSS BLACK PEARL', image: 'vehicle-2.svg', position: 'is-grandeur' },
    { name: 'IONIQ 9', powertrain: 'CALLIGRAPHY AWD', color: 'IONOSPHERE GREEN PEARL', image: 'vehicle-3.svg', position: 'is-ioniq-9' },
    { name: 'IONIQ 5', powertrain: 'PRESTIGE 2WD', color: 'DIGITAL TEAL GREEN PEARL', image: 'vehicle-4.svg', position: 'is-ioniq-5' },
    { name: 'GV80', powertrain: '3.5T GASOLINE AWD', color: 'VEARING BLUE', image: 'vehicle-5.svg', position: 'is-gv80' },
    { name: 'ELANTRA', powertrain: '1ST GENERATION AVANTE', color: 'DARK RED', image: 'vehicle-6.svg', position: 'is-elantra' },
];
const experienceRing = [
    { image: 'experience-ring-1.png', x: 73.49, y: 26.3, rotate: 0 },
    { image: 'experience-ring-2.png', x: 82.83, y: 44.59, rotate: 36.05 },
    { image: 'experience-ring-3.png', x: 35.04, y: 20.31, rotate: -72.03 },
    { image: 'experience-ring-4.png', x: 55.19, y: 17.08, rotate: -36.05 },
    { image: 'experience-ring-5.png', x: 65.23, y: 79.43, rotate: 107.97 },
    { image: 'experience-ring-6.png', x: 79.7, y: 64.86, rotate: 72.03 },
    { image: 'experience-ring-7.png', x: 45, y: 82.67, rotate: 143.95 },
    { image: 'experience-ring-8.png', x: 26.75, y: 73.41, rotate: 180 },
    { image: 'experience-ring-9.png', x: 17.17, y: 55.16, rotate: -143.95 },
    { image: 'experience-ring-10.png', x: 20.58, y: 34.89, rotate: -107.97 },
];
const stories = [
    {
        title: 'SEOUL, REBORN FOR CAR CULTURE',
        titleLines: ['SEOUL, REBORN', 'FOR CAR CULTURE'],
        place: '현대 모터스튜디오 서울',
        copy: '자동차 마니아들의 놀이터로 새롭게 돌아온 현대 모터스튜디오 서울. 자동차 문화와 취향을 공유하는 새로운 공간을 만나보세요.',
        image: 'story-seoul.svg',
        to: paths.location('seoul'),
    },
    {
        title: 'A NEW EXPERIENCE IN HANAM',
        titleLines: ['A NEW EXPERIENCE', 'IN HANAM'],
        place: '현대 모터스튜디오 하남',
        copy: '새롭게 리뉴얼된 현대 모터스튜디오 하남에서 차량 전시와 미디어 콘텐츠를 통해 더욱 몰입감 있는 모빌리티 경험을 제공합니다.',
        image: 'story-hanam.svg',
        to: paths.location('hanam'),
    },
    {
        title: 'RETRACING THE FIRST STEP',
        place: '현대 모터스튜디오 서울',
        copy: '현대자동차 1억 대 생산을 기념해 시작과 성장을 돌아보는 전시를 선보입니다. 헤리티지를 통해 과거와 현재, 미래를 연결합니다.',
        image: 'story-first-step.svg',
        to: paths.location('seoul'),
    },
    {
        title: 'PLASTIC, A NEW DISCOVERY',
        place: '현대 모터스튜디오 부산',
        copy: '비트라 디자인 뮤지엄과 함께 플라스틱의 새로운 가능성을 탐구합니다. 디자인과 지속가능성을 새로운 시선으로 바라보는 전시입니다.',
        image: 'story-plastic.svg',
        to: paths.location('busan'),
    },
];
const guideLinks = [
    ['NOTICE', 'BEFORE YOUR VISIT', paths.notices],
    ['RESERVATION', 'PLAN YOUR EXPERIENCE', paths.reservations],
    ['MY RESERVATION', 'CHECK YOUR SCHEDULE', paths.myReservations],
    ['MEMBERSHIP', 'JOIN HMS CLUB', paths.membership],
    ['NEWSROOM', 'DISCOVER WHAT’S NEW', paths.newsroom],
];
const locationDetails = {
    seoul: {
        image: asset('location-seoul.svg'),
        tagline: '매니아들의 열정이 머무는 자동차 문화 공간.',
        description:
            '트렌디한 모빌리티 콘텐츠를 통해 다양한 자동차 문화를 경험하고, 취향이 닮은 사람들과 자유롭게 교류하며 새로운 영감을 발견할 수 있습니다. 자동차를 좋아하는 누구나 자신의 관심과 열정을 자연스럽게 확장해갈 수 있습니다.',
    },
    hanam: {
        image: asset('location-hanam.svg'),
        tagline: '다채로운 모빌리티 라이프스타일을 발견하는 플랫폼.',
        description:
            '미디어아트를 배경으로 펼쳐지는 다양한 자동차 전시를 통해 새로운 모빌리티 라이프와 감각적인 브랜드 경험을 만나볼 수 있습니다. 차량과 공간이 어우러진 콘텐츠를 통해 색다른 영감과 즐거움을 느껴보세요.',
    },
    busan: {
        image: asset('location-busan.svg'),
        tagline: '예술과 디자인이 살아 숨 쉬는 창의적 실험 공간.',
        description:
            '감각적인 아트 전시와 창의적인 프로그램을 통해 모빌리티를 바라보는 새로운 시각과 다양한 영감을 경험할 수 있습니다. 예술과 기술이 어우러진 콘텐츠를 통해 미래 모빌리티의 새로운 가능성을 만나보세요.',
    },
    beijing: {
        image: asset('location-beijing.svg'),
        tagline: '예술과 디자인이 살아 숨 쉬는 창의적 실험 공간.',
        description:
            '감각적인 아트 전시와 창의적인 프로그램을 통해 모빌리티를 바라보는 새로운 시각과 다양한 영감을 경험할 수 있습니다. 예술과 기술이 어우러진 콘텐츠를 통해 미래 모빌리티의 새로운 가능성을 만나보세요.',
    },
    'snow-park': {
        image: asset('location-snow-park.svg'),
        tagline: '다채로운 모빌리티 라이프스타일을 발견하는 플랫폼.',
        description:
            '미디어아트를 배경으로 펼쳐지는 다양한 자동차 전시를 통해 새로운 모빌리티 라이프와 감각적인 브랜드 경험을 만나볼 수 있습니다. 차량과 공간이 어우러진 콘텐츠를 통해 색다른 영감과 즐거움을 느껴보세요.',
    },
    goyang: {
        image: asset('location.svg'),
        tagline: '가족과 함께 즐기는 짜릿한 모빌리티 탐험.',
        description:
            '몰입감 넘치는 자동차 전시와 테마 시승을 통해 자동차가 만들어지는 과정을 직접 보고 듣고 만지며, N 브랜드와 4D Ride 등 다양한 콘텐츠를 체험할 수 있습니다. 아이들에게는 상상력을, 어른들에게는 색다른 경험을 제공합니다.',
    },
};

export default function HomeContent() {
    const [selectedLocation, setSelectedLocation] = useState(0);
    const locationTransitionRef = useRef(null);
    const locationScrollRef = useRef(null);
    const sloganRef = useRef(null);
    const sloganTextRef = useRef(null);
    const driveRef = useRef(null);
    const experienceRef = useRef(null);
    const experienceRingRef = useRef(null);
    const experienceRingPositionRef = useRef(null);
    const experienceOutlineRef = useRef(null);
    const currentExhibitionRef = useRef(null);
    const currentExhibitionTopRef = useRef(null);
    const currentExhibitionBottomRef = useRef(null);
    const currentExhibitionCopyRef = useRef(null);
    const ringDragRef = useRef({ pointerId: null, angle: 0, rotation: 0 });
    const location = locations[selectedLocation];
    const locationDetail = locationDetails[location.slug] ?? location;
    const selectLocation = (index) => {
        setSelectedLocation(index);
        const trigger = locationScrollRef.current;
        if (trigger) {
            trigger.scroll(
                trigger.start + (trigger.end - trigger.start) * ((index + 0.5) / locations.length)
            );
            ScrollTrigger.update();
        }
    };
    useEffect(() => {
        const transition = locationTransitionRef.current;
        if (!transition) return undefined;
        const media = gsap.matchMedia();
        const ringElement = experienceRingPositionRef.current;
        const ring = experienceRingRef.current;
        const ringOutline = experienceOutlineRef.current;
        const getRingAngle = (event) => {
            const bounds = ringElement.getBoundingClientRect();
            return Math.atan2(
                event.clientY - bounds.top - bounds.height / 2,
                event.clientX - bounds.left - bounds.width / 2,
            ) * 180 / Math.PI;
        };
        const startRingRotation = (event) => {
            event.preventDefault();
            ringElement.setPointerCapture(event.pointerId);
            ringDragRef.current = {
                pointerId: event.pointerId,
                angle: getRingAngle(event),
                rotation: Number(gsap.getProperty(ring, 'rotation')) || 0,
            };
        };
        const rotateRing = (event) => {
            const drag = ringDragRef.current;
            if (drag.pointerId !== event.pointerId) return;
            const angle = getRingAngle(event);
            let difference = angle - drag.angle;
            if (difference > 180) difference -= 360;
            if (difference < -180) difference += 360;
            drag.rotation += difference;
            drag.angle = angle;
            gsap.set(ring, {
                rotation: drag.rotation,
                '--ring-rotation': `${drag.rotation}deg`,
            });
            gsap.set(ringOutline, { rotation: drag.rotation });
        };
        const endRingRotation = (event) => {
            if (ringDragRef.current.pointerId === event.pointerId) {
                if (ringElement.hasPointerCapture(event.pointerId)) {
                    ringElement.releasePointerCapture(event.pointerId);
                }
                ringDragRef.current.pointerId = null;
            }
        };
        if (ringElement && ring && ringOutline) {
            ringElement.addEventListener('pointerdown', startRingRotation, { passive: false });
            ringElement.addEventListener('pointermove', rotateRing, { passive: false });
            ringElement.addEventListener('pointerup', endRingRotation);
            ringElement.addEventListener('pointercancel', endRingRotation);
        }
        media.add('(min-width: 901px) and (prefers-reduced-motion: no-preference)', () => {
            const image = transition.querySelector('.renewal-location-transition__image');
            const intro = transition.querySelector('.renewal-intro');
            const locationSection = transition.querySelector('.renewal-location');
            const target = transition.querySelector('.renewal-location__detail img');
            // Reserve the later pin's space before the parent intro pin caches its height.
            gsap.set(transition, { '--location-scroll-distance': `${locations.length * 65}vh` });
            const bounds = () => {
                const container = transition.getBoundingClientRect();
                const destination = target.getBoundingClientRect();
                return {
                    x: destination.left - container.left,
                    y: intro.offsetHeight + target.parentElement.offsetTop,
                    width: destination.width,
                    height: destination.height,
                };
            };
            // Hold the entire image/text group still until the intro copy has faded.
            // Animate the child, not the pinned container, to keep pin measurements stable.
            const introFade = gsap.fromTo(
                intro,
                { '--intro-copy-opacity': 1 },
                {
                    '--intro-copy-opacity': 0,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: intro,
                        start: 'top top',
                        end: () => `+=${window.innerHeight * 0.25}`,
                        pin: transition,
                        scrub: true,
                        invalidateOnRefresh: true,
                    },
                }
            );
            const timeline = gsap.timeline({
                defaults: { ease: 'none' },
                scrollTrigger: {
                    trigger: transition,
                    start: () => introFade.scrollTrigger.end,
                    // Include the pin's scroll distance while retaining center-to-center arrival.
                    end: () =>
                        introFade.scrollTrigger.end +
                        Math.max(
                            1,
                            intro.offsetHeight +
                                locationSection.offsetHeight / 2 -
                                window.innerHeight / 2
                        ),
                    scrub: true,
                    invalidateOnRefresh: true,
                },
            });
            timeline.fromTo(
                image,
                {
                    x: 0,
                    y: 0,
                    width: () => transition.clientWidth,
                    height: () => intro.offsetHeight,
                },
                {
                    x: () => bounds().x,
                    y: () => bounds().y,
                    width: () => bounds().width,
                    height: () => bounds().height,
                    duration: 1,
                },
                0
            );
            // Cover the location rail/links only while travelling; restore on arrival.
            // A positive start keeps the intro copy above the image before shrinking.
            timeline.set(image, { zIndex: 3 }, 0.000001);
            timeline.set(image, { zIndex: 1 }, 1);
            timeline.set(target, { autoAlpha: 0 }, 0);
            timeline.set(target, { autoAlpha: 1 }, 1);
            timeline.set(image, { autoAlpha: 0 }, 1);
            // Match the 580 × 320 location asset's lower-right diagonal cut.
            timeline.fromTo(
                image,
                {
                    clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 100% 100%, 0% 100%)',
                },
                {
                    clipPath: 'polygon(0% 0%, 100% 0%, 100% 85.07%, 91.7391% 100%, 0% 100%)',
                    duration: 0.15,
                },
                0
            );
            const updateLocation = (self) => {
                setSelectedLocation(
                    Math.min(locations.length - 1, Math.floor(self.progress * locations.length))
                );
            };
            locationScrollRef.current = ScrollTrigger.create({
                trigger: locationSection,
                start: () => timeline.scrollTrigger.end,
                end: () => `+=${locations.length * window.innerHeight * 0.65}`,
                pin: locationSection,
                // Reparent while pinned so the intro pin's transformed wrapper cannot
                // change the location section's viewport coordinates.
                pinReparent: true,
                invalidateOnRefresh: true,
                onUpdate: updateLocation,
                onRefresh: updateLocation,
            });
            const slogan = sloganRef.current;
            const sloganText = sloganTextRef.current;
            if (slogan && sloganText) {
                gsap.set(sloganText, { text: '' });
                const typing = gsap.to(sloganText, {
                    duration: 1.2,
                    ease: 'none',
                    text: 'EXPERIENCE',
                    paused: true,
                });
                ScrollTrigger.create({
                    trigger: slogan,
                    start: 'top top',
                    end: () => `+=${window.innerHeight * 0.7}`,
                    pin: slogan,
                    pinReparent: true,
                    invalidateOnRefresh: true,
                    onEnter: () => typing.restart(),
                    onEnterBack: () => typing.restart(),
                    onLeaveBack: () => typing.pause(0),
                });
            }
            const driveSection = driveRef.current;
            const driveTrack = driveSection?.querySelector('.renewal-drive__track');
            if (driveSection && driveTrack) {
                // Keep each vehicle on screen long enough for the next one to enter,
                // matching the slow, continuous horizontal vehicle movement in Rivian's section.
                const driveScrollDistance = () =>
                    Math.max(
                        driveSection.clientWidth * (driveModels.length - 1),
                        window.innerHeight * driveModels.length * 2
                    );
                gsap.to(driveTrack, {
                    x: () => -(driveTrack.scrollWidth - driveSection.clientWidth),
                    ease: 'none',
                    scrollTrigger: {
                        trigger: driveSection,
                        start: 'top top',
                        end: () => `+=${driveScrollDistance()}`,
                        pin: driveSection,
                        pinReparent: true,
                        anticipatePin: 1,
                        scrub: true,
                        invalidateOnRefresh: true,
                    },
                });
            }
            const experienceSection = experienceRef.current;
            if (experienceSection) {
                ScrollTrigger.create({
                    trigger: experienceSection,
                    start: 'top top',
                    end: () => `+=${window.innerHeight}`,
                    pin: experienceSection,
                    pinReparent: true,
                    anticipatePin: 1,
                    invalidateOnRefresh: true,
                });
            }
            const currentExhibition = currentExhibitionRef.current;
            const currentTop = currentExhibitionTopRef.current;
            const currentBottom = currentExhibitionBottomRef.current;
            const currentCopy = currentExhibitionCopyRef.current;
            if (currentExhibition && currentTop && currentBottom && currentCopy) {
                const gallery = currentExhibition.querySelector('.spiral-gallery');
                const stage = gallery.querySelector('.spiral-gallery__stage');
                const strips = [...gallery.querySelectorAll('.spiral-gallery__slice')].map((element) => ({
                    element, card: Number(element.dataset.card), slice: Number(element.dataset.slice),
                }));
                const helixState = { progress: 0 };
                let path;
                const measureHelix = () => {
                    path = createSpiralPath(window.innerWidth, window.innerHeight,
                        Math.max(...strips.map(({ card }) => card)) + 1,
                        Number(strips[0].element.dataset.slices));
                    gsap.set(gallery, {
                        perspective: path.perspective,
                        left: window.innerWidth / 2 - currentExhibition.getBoundingClientRect().left,
                    });
                    const stripWidth = path.cardWidth / path.slices;
                    strips.forEach(({ element, slice }) => {
                        gsap.set(element, {
                            width: stripWidth + 1,
                            height: path.cardHeight,
                            backgroundSize: `${path.cardWidth}px ${path.cardHeight}px`,
                            backgroundPosition: `${-slice * stripWidth + 0.5}px 0px`,
                        });
                    });
                };
                measureHelix();
                gsap.set(strips.map(({ element }) => element), { transform: 'none' });
                gsap.set(stage, { visibility: 'hidden' });
                const updateHelix = (progress) => {
                    stage.style.visibility = progress <= 0 ? 'hidden' : 'visible';
                    const halfWidth = (path.cardWidth / path.slices + 1) / 2;
                    strips.forEach(({ element, card, slice }) => {
                        const p = spiralStripPose(path, progress, card, slice);
                        const x = p.x - p.dx * halfWidth;
                        const y = p.y - p.dy * halfWidth - path.cardHeight / 2;
                        const z = p.z - p.dz * halfWidth;
                        element.style.transform = `matrix3d(${p.dx},${p.dy},${p.dz},0,0,1,0,0,${-p.dz},0,${p.dx},0,${x},${y},${z},1)`;
                    });
                };
                const outsideLeft = () => -(window.innerWidth + currentTop.offsetWidth);
                const outsideRight = () => window.innerWidth + currentBottom.offsetWidth;
                const currentTimeline = gsap.timeline({
                    defaults: { ease: 'none' },
                    scrollTrigger: {
                        trigger: currentExhibition,
                        start: 'center center',
                        end: () => `+=${window.innerHeight * 6}`,
                        pin: currentExhibition,
                        pinReparent: true,
                        scrub: true,
                        anticipatePin: 1,
                        invalidateOnRefresh: true,
                        onRefresh: () => {
                            measureHelix();
                            updateHelix(helixState.progress);
                        },
                    },
                });
                currentTimeline.fromTo(
                    currentTop,
                    { autoAlpha: 1, x: outsideLeft },
                    { x: 0, duration: 0.7 },
                    0
                );
                currentTimeline.fromTo(
                    currentBottom,
                    { autoAlpha: 1, x: outsideRight },
                    { x: 0, duration: 0.7 },
                    0
                );
                currentTimeline.fromTo(
                    currentCopy,
                    { autoAlpha: 0 },
                    { autoAlpha: 1, duration: 0.3 },
                    0.7
                );
                currentTimeline.to(
                    helixState,
                    { progress: 1, duration: 3, onUpdate: () => updateHelix(helixState.progress) },
                    1.05
                );
                currentTimeline.to(currentTop, { x: outsideRight, duration: 1 }, 3.05);
                currentTimeline.to(currentBottom, { x: outsideLeft, duration: 1 }, 3.05);
            }
            return () => {
                locationScrollRef.current = null;
            };
        });
        return () => {
            if (ringElement && ring && ringOutline) {
                ringElement.removeEventListener('pointerdown', startRingRotation);
                ringElement.removeEventListener('pointermove', rotateRing);
                ringElement.removeEventListener('pointerup', endRingRotation);
                ringElement.removeEventListener('pointercancel', endRingRotation);
            }
            media.revert();
        };
    }, []);
    return (
        <main className="renewal-home" id="top">
            <HomeHero />
            <div className="renewal-location-transition" ref={locationTransitionRef}>
                <img
                    className="renewal-location-transition__image"
                    src={asset('intro.svg')}
                    alt=""
                    aria-hidden="true"
                />
                <section className="renewal-intro">
                    <img
                        className="renewal-intro__static-background"
                        src={asset('intro.svg')}
                        alt="현대 모터스튜디오 공간"
                    />
                    <h1 className="renewal-intro__title">
                        SHAPING THE
                        <br />
                        FUTURE OF <em>MOTION</em>
                    </h1>
                    <p className="renewal-intro__description">
                        차량 전시부터 시승, 디자인 콘텐츠와 브랜드 컬렉션까지 모빌리티에 대한
                        <br />
                        이해와 취향을 넓힐 수 있는 다양한 경험을 제공합니다. 세심하게
                        <br />
                        구성된 전시와 프로그램을 통해 자동차는 물론 디자인과 예술까지 누구나
                        자신만의
                        <br />
                        방식으로 몰입할 수 있는 특별한 순간을 만나보세요.
                    </p>
                    <a className="renewal-top" href="#top" aria-label="페이지 상단으로 이동">
                        <img src={asset('top-arrow.svg')} alt="" />
                        <span>TOP</span>
                    </a>
                </section>
                <section className="renewal-location" aria-label="현대 모터스튜디오 지점">
                    <div className="renewal-location__list" role="tablist" aria-label="지점 선택">
                        {locations.map((item, index) => (
                            <button
                                key={item.slug}
                                type="button"
                                role="tab"
                                aria-selected={selectedLocation === index}
                                className={selectedLocation === index ? 'is-active' : ''}
                                onClick={() => selectLocation(index)}
                            >
                                {item.english}
                            </button>
                        ))}
                    </div>
                    <div className="renewal-location__rail" aria-hidden="true">
                        <i style={{ '--location-index': selectedLocation }} />
                    </div>
                    <Link
                        className="renewal-location__detail"
                        role="tabpanel"
                        to={paths.location(location.slug)}
                    >
                        <img
                            className={selectedLocation === 0 ? 'is-goyang' : ''}
                            src={locationDetail.image ?? location.image}
                            alt={`${location.name} 공간`}
                        />
                        <div>
                            <strong>{locationDetail.tagline}</strong>
                            <p>{locationDetail.description}</p>
                        </div>
                    </Link>
                </section>
            </div>
            <section className="renewal-slogan" ref={sloganRef} aria-label="브랜드 슬로건">
                <p>
                    WHAT YOU FIND
                    <br />
                    WHEN MOTION
                    <br />
                    MEETS
                </p>
                <strong ref={sloganTextRef} aria-label="EXPERIENCE" />
            </section>
            <section className="renewal-drive" ref={driveRef} aria-label="시승 프로그램">
                <div className="renewal-drive__track">
                    {driveModels.map((item) => (
                        <article className="renewal-drive__slide" key={item.name}>
                            <h2>{item.name}</h2>
                            <div
                                className={`renewal-drive__vehicle-frame ${item.vehicleClass ?? ''}`}
                            >
                                <img
                                    className="renewal-drive__vehicle"
                                    src={item.image}
                                    alt={`${item.name} 시승 차량`}
                                />
                            </div>
                            <img
                                className={`renewal-drive__shadow ${item.shadowClass ?? ''}`}
                                src={item.shadow}
                                alt=""
                                aria-hidden="true"
                            />
                            <div className="renewal-drive__copy">
                                <h3>{item.title}</h3>
                                <p>{item.copy}</p>
                            </div>
                        </article>
                    ))}
                </div>
            </section>
            <section
                className="renewal-experience"
                ref={experienceRef}
                aria-label="IONIQ 5 N 차량 전시"
            >
                <img
                    className="renewal-experience__background"
                    src={asset('vehicle-exhibition.png')}
                    alt="도심을 달리는 IONIQ 5 N"
                />
                <div className="renewal-experience__shade" aria-hidden="true" />
                <div className="renewal-experience__blur" aria-hidden="true" />
                <div className="renewal-experience__ring-position" ref={experienceRingPositionRef}>
                    <div
                        className="renewal-experience__ring"
                        ref={experienceRingRef}
                    >
                        {experienceRing.map((item) => (
                            <span
                                className="renewal-experience__ring-item"
                                key={item.image}
                                style={{
                                    '--x': `${item.x}%`,
                                    '--y': `${item.y}%`,
                                    '--rotate': `${item.rotate}deg`,
                                    '--mask-image': `url(${asset(item.image)})`,
                                }}
                            >
                                <img src={asset(item.image)} alt="" draggable={false} />
                            </span>
                        ))}
                        <img
                            className="renewal-experience__pointer"
                            src={asset('experience-pointer.svg')}
                            alt=""
                            draggable={false}
                        />
                    </div>
                    <div
                        className="renewal-experience__ring-outline"
                        ref={experienceOutlineRef}
                        aria-label="드래그해서 회전하는 도넛 링 테두리"
                    />
                </div>
                <p>IONIQ5N</p>
            </section>
            <section className="renewal-vehicle-exhibition-title">
                <h2>
                    HYUNDAI MOTORSTUDIO
                    <br />
                    VEHICLE EXHIBITION
                </h2>
            </section>
            <section className="renewal-vehicle-exhibition">
                <header className="renewal-vehicle-exhibition__header">
                    <h2>
                        HYUNDAI MOTORSTUDIO
                        <br />
                        VEHICLE EXHIBITION
                    </h2>
                    <p>
                        직접 달리며 만나는 현대자동차의 새로운 가능성. 보고, 듣고, 느끼는 것에서 한
                        걸음 더 나아가
                        <br />
                        현대자동차의 다양한 모델의 감각과 기술을 경험해보세요.
                    </p>
                </header>
                <div className="renewal-vehicle-exhibition__cards">
                    {exhibitionVehicles.map(({ name, powertrain, color, image, position }) => (
                        <article className={`renewal-vehicle-exhibition__card ${position}`} key={name}>
                            <img src={asset(image)} alt={name} />
                            <h3>{name}</h3>
                            <dl>
                                <div>
                                    <dt>POWERTRAIN</dt>
                                    <dd>{powertrain}</dd>
                                </div>
                                <div>
                                    <dt>EXTERIOR COLOR</dt>
                                    <dd>{color}</dd>
                                </div>
                            </dl>
                        </article>
                    ))}
                </div>
            </section>
            <section className="renewal-current" ref={currentExhibitionRef}>
                <div className="renewal-current__content">
                    <div className="renewal-current__heading">
                        <h2 className="renewal-current__title" ref={currentExhibitionTopRef}>CURRENT</h2>
                        <p className="renewal-current__copy" ref={currentExhibitionCopyRef}>
                            DISCOVER OUR
                            <br />
                            CURRENT EXHIBITIONS
                        </p>
                    </div>
                    <h2 className="renewal-current__title" ref={currentExhibitionBottomRef}>EXHIBITION</h2>
                </div>
                <SpiralGallery />
            </section>
            <Link className="renewal-program" to={paths.programs}>
                <img src={asset('program.svg')} alt="수소 에너지 탐험 프로그램" />
                <div>
                    <span>PROGRAM 01</span>
                    <h2>수소 에너지 탐험</h2>
                    <p>
                        수전해 실험과 넥쏘 조립을 통해 수소에너지를 이해하고,
                        <br />
                        수소전기차의 구동 원리를 배우는 클래스입니다.
                    </p>
                </div>
            </Link>
            <section className="renewal-story-title">
                <h2>
                    THE LATEST FROM
                    <br />
                    HYUNDAI MOTORSTUDIO
                </h2>
                <p>현대 모터스튜디오의 새로운 이야기를 만나보세요.</p>
                <span className="renewal-story-title__line-track" aria-hidden="true">
                    <img className="renewal-story-title__line-base" src={asset('title-center-line.svg')} alt="" />
                    <span className="renewal-story-title__line-fill">
                        <img src={asset('title-center-line.svg')} alt="" />
                    </span>
                </span>
            </section>
            <HomeStories stories={stories} />
            <VisitorGuide links={guideLinks} />
        </main>
    );
}
