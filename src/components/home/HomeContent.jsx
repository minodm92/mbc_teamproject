import { useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';
import { locations } from '../../common/data/content';
import { paths } from '../../common/router/routePaths';
import { withInstantScroll } from '../../common/utils/scrollPosition';
import { HomeHero, HomeStories, VisitorGuide } from '../../components/home/HomeSections';
import SpiralGallery from './SpiralGallery';
import HomeProgramSequence from './HomeProgramSequence';
import { homeAsset as asset } from './homeAssets';
import {
    setHomeScrollLocked,
    setupHomeScrollControls,
    registerHomeScrollBoundary,
} from './homeScrollControls';
import { setupVehicleSlogan } from './vehicleSloganInteraction';
import './HomeContent.css';

gsap.registerPlugin(ScrollTrigger, TextPlugin);

const driveModels = [
    {
        name: 'GV80',
        body: asset('drive-gv80-body.png'),
        wheel: asset('drive-gv80-wheel.png'),
        wheels: [
            { left: 9.05, top: 58.25, width: 16.16, height: 41.75, rotation: 0 },
            { left: 70.19, top: 58.25, width: 16.16, height: 41.75, rotation: 0 },
        ],
        shadow: asset('drive-shadow-standard.svg'),
        contactOffset: 0,
        title: '아웃도어 라이프_데이트립 드라이브',
        copy: '넉넉한 시간과 자유로운 코스로 차량의 주행감과 편의성을 경험해보세요.\n일상 속에서 차량의 매력을 더욱 깊이 느낄 수 있습니다.',
        mobileCopy: '넉넉한 시간과 자유로운 코스로 차량의\n주행감과 편의성을 경험해보세요.',
    },
    {
        name: 'IONIQ5N',
        body: asset('drive-ioniq5n-body.png'),
        wheel: asset('drive-ioniq5n-wheel.png'),
        wheels: [
            { left: 8.773, top: 53.411, width: 15.97, height: 39.382, rotation: 0 },
            { left: 81.915, top: 46.203, width: 15.97, height: 39.382, rotation: 60 },
        ],
        shadow: asset('drive-shadow-ioniq5n.svg'),
        vehicleClass: 'is-ioniq5n',
        shadowClass: 'is-ioniq5n',
        contactOffset: 25,
        title: '하이 퍼포먼스 드라이브_언택트',
        copy: 'N 브랜드의 강렬한 퍼포먼스와 고성능 감성을 직접 경험해보세요.\n공공도로 주행을 통해 역동적인 드라이빙의 즐거움을 느낄 수 있습니다.',
        mobileCopy: 'N 브랜드의 강렬한 퍼포먼스와 GV60\n마그마의 고성능 감성을 직접 경험해보세요.',
    },
    {
        name: 'CASPER',
        body: asset('drive-casper-body.png'),
        wheel: asset('drive-casper-wheel.png'),
        wheels: [
            { left: 7.899, top: 62.697, width: 17.345, height: 37.303, rotation: 0 },
            { left: 92.59, top: 62.522, width: 17.345, height: 37.303, rotation: 90 },
        ],
        shadow: asset('drive-shadow-casper.svg'),
        vehicleClass: 'is-casper',
        shadowClass: 'is-casper',
        contactOffset: 24,
        title: '베이직 드라이브',
        copy: '자동차 전문가 Guru의 친절한 설명과 함께 다양한 현대자동차를 직접 시승해보세요.\n차량의 특징과 주행 감각을 보다 쉽고 깊이 있게 경험할 수 있습니다.',
        mobileCopy:
            '자동차 전문가 Guru의 친절한 설명과\n함께 다양한 현대자동차를 직접 시승해보세요.',
    },
    {
        name: 'G90',
        body: asset('drive-g90-body.png'),
        wheel: asset('drive-g90-wheel.png'),
        wheels: [
            { left: 7.82, top: 51.667, width: 15.363, height: 40.756, rotation: 0 },
            { left: 80.312, top: 45.242, width: 15.363, height: 40.756, rotation: 67.739 },
        ],
        shadow: asset('drive-shadow-g90.svg'),
        vehicleClass: 'is-g90',
        shadowClass: 'is-g90',
        contactOffset: 53,
        title: '아웃도어 라이프_데이트립 드라이브',
        copy: '자동차 전문가 Guru의 설명과 함께 현대자동차의 다양한 차량을 시승해보세요.\n차량의 특징과 주행 감각을 보다 쉽고 편안하게 경험할 수 있습니다.',
        mobileCopy: '자동차 전문가 Guru의 설명과 함께\n현대자동차의 다양한 차량을 시승해보세요.',
    },
];
const exhibitionVehicles = [
    {
        name: 'AVANTE N',
        powertrain: 'GASOLINE 2.0 TURBO',
        color: 'PERFORMANCE BLUE',
        image: 'vehicle-1.svg',
        mobileImage: 'mobile-vehicle-exhibition-1.svg',
        position: 'is-avante-n',
    },
    {
        name: 'THE NEW GRANDEUR',
        powertrain: '3.5 GASOLINE CALLIGRAPHY',
        color: 'ABYSS BLACK PEARL',
        image: 'vehicle-2.svg',
        mobileImage: 'mobile-vehicle-exhibition-2.svg',
        position: 'is-grandeur',
    },
    {
        name: 'IONIQ 9',
        powertrain: 'CALLIGRAPHY AWD',
        color: 'IONOSPHERE GREEN PEARL',
        image: 'vehicle-3.svg',
        mobileImage: 'mobile-vehicle-exhibition-3.svg',
        position: 'is-ioniq-9',
    },
    {
        name: 'IONIQ 5',
        powertrain: 'PRESTIGE 2WD',
        color: 'DIGITAL TEAL GREEN PEARL',
        image: 'vehicle-4.svg',
        mobileImage: 'mobile-vehicle-exhibition-4.svg',
        position: 'is-ioniq-5',
    },
    {
        name: 'GV80',
        powertrain: '3.5T GASOLINE AWD',
        color: 'VEARING BLUE',
        image: 'vehicle-5.svg',
        mobileImage: 'mobile-vehicle-exhibition-5.svg',
        position: 'is-gv80',
    },
    {
        name: 'ELANTRA',
        powertrain: '1ST GENERATION AVANTE',
        color: 'DARK RED',
        image: 'vehicle-6.svg',
        mobileImage: 'mobile-vehicle-exhibition-6.svg',
        position: 'is-elantra',
    },
];
const mobileExhibitionVehicles = [
    {
        name: '엘란트라 N TCR',
        copy: '속도를 즐기는 당신에게',
        image: 'experience-source-7.png',
        featured: true,
    },
    {
        name: 'G90',
        copy: '오늘에 머물지 않는 당신에게',
        image: 'experience-source-8.png',
    },
    {
        name: '아이오닉 6 N',
        copy: 'Rule the Paradigm',
        image: 'experience-source-9.png',
    },
    {
        name: 'SANTA FE',
        copy: '일상과 일상 사이를 열다',
        image: 'experience-source-10.png',
    },
    {
        name: 'ELANTRA',
        copy: "Heritage 1990's",
        image: 'experience-source-3.png',
    },
];
const mobileCurrentExhibitions = [
    { image: 'current-exhibition-1.png', crop: 'is-left-1' },
    { image: 'current-exhibition-4.png' },
    { image: 'current-exhibition-2.png', crop: 'is-left-2' },
    { image: 'current-exhibition-5.png', crop: 'is-left-3' },
    { image: 'current-exhibition-3.png', crop: 'is-left-4' },
    { image: 'current-exhibition-6.png' },
];
const experienceRing = [
    {
        image: 'experience-source-1.png',
        preview: 'vehicle-exhibition.png',
        name: 'IONIQ 5',
        x: 73.49,
        y: 26.3,
        rotate: 0,
    },
    {
        image: 'experience-source-2.png',
        preview: 'story-seoul.svg',
        name: 'AVANTE N',
        x: 82.83,
        y: 44.59,
        rotate: 36.05,
    },
    {
        image: 'experience-source-3.png',
        preview: 'story-hanam.svg',
        name: 'ELANTRA',
        x: 35.04,
        y: 20.31,
        rotate: -72.03,
    },
    {
        image: 'experience-source-4.png',
        preview: 'story-first-step.svg',
        name: 'GV80',
        x: 55.19,
        y: 17.08,
        rotate: -36.05,
    },
    {
        image: 'experience-source-5.png',
        preview: 'story-plastic.svg',
        name: 'IONIQ 9',
        x: 65.23,
        y: 79.43,
        rotate: 107.97,
    },
    {
        image: 'experience-source-6.png',
        preview: 'location-seoul.svg',
        name: 'GRANDEUR',
        x: 79.7,
        y: 64.86,
        rotate: 72.03,
    },
    {
        image: 'experience-source-7.png',
        preview: 'location-hanam.svg',
        name: 'ELANTRA N TCR',
        x: 45,
        y: 82.67,
        rotate: 143.95,
    },
    {
        image: 'experience-source-8.png',
        preview: 'location-busan.svg',
        name: 'G90',
        x: 26.75,
        y: 73.41,
        rotate: 180,
    },
    {
        image: 'experience-source-9.png',
        preview: 'location-beijing.svg',
        name: 'IONIQ 6 N',
        x: 17.17,
        y: 55.16,
        rotate: -143.95,
    },
    {
        image: 'experience-source-10.png',
        preview: 'vehicle-exhibition.png',
        name: 'SANTA FE',
        x: 20.58,
        y: 34.89,
        rotate: -107.97,
    },
];
const experienceSelectionOrder = [0, 1, 5, 4, 6, 7, 8, 9, 2, 3];
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
    'senayan-park': {
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
    const previousLocationRef = useRef(selectedLocation);
    const locationTransitionRef = useRef(null);
    const locationScrollRef = useRef(null);
    const locationNavigationRef = useRef(null);
    const locationImageRef = useRef(null);
    const locationCopyRef = useRef(null);
    const sloganRef = useRef(null);
    const sloganTextRef = useRef(null);
    const sloganCursorRef = useRef(null);
    const driveRef = useRef(null);
    const experienceRef = useRef(null);
    const experienceRingRef = useRef(null);
    const experienceIndicatorRef = useRef(null);
    const experienceTitleRef = useRef(null);
    const vehicleSloganRef = useRef(null);
    const currentExhibitionRef = useRef(null);
    const currentExhibitionTopRef = useRef(null);
    const currentExhibitionBottomRef = useRef(null);
    const currentExhibitionCopyRef = useRef(null);
    const spiralGalleryRef = useRef(null);
    const location = locations[selectedLocation];
    const locationDetail = locationDetails[location.slug] ?? location;
    const selectLocation = (index) => {
        setSelectedLocation(index);
        const trigger = locationScrollRef.current;
        if (trigger) {
            const target =
                trigger.start + (trigger.end - trigger.start) * ((index + 0.5) / locations.length);
            locationNavigationRef.current = { target };
            trigger.scroll(target);
            ScrollTrigger.update();
        }
    };
    useLayoutEffect(() => {
        const cancelNavigation = () => {
            locationNavigationRef.current = null;
        };
        const handleKeyDown = (event) => {
            if (
                ['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '].includes(
                    event.key
                )
            ) {
                cancelNavigation();
            }
        };
        const finishNavigation = () => {
            if (!locationNavigationRef.current) return;
            cancelNavigation();
            const trigger = locationScrollRef.current;
            if (trigger) {
                setSelectedLocation(
                    Math.min(locations.length - 1, Math.floor(trigger.progress * locations.length))
                );
            }
        };
        window.addEventListener('wheel', cancelNavigation, { passive: true, capture: true });
        window.addEventListener('touchstart', cancelNavigation, { passive: true });
        window.addEventListener('pointerdown', cancelNavigation, { passive: true });
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('scrollend', finishNavigation);
        return () => {
            cancelNavigation();
            window.removeEventListener('wheel', cancelNavigation, true);
            window.removeEventListener('touchstart', cancelNavigation);
            window.removeEventListener('pointerdown', cancelNavigation);
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('scrollend', finishNavigation);
        };
    }, []);
    useLayoutEffect(() => {
        if (previousLocationRef.current === selectedLocation) return undefined;
        previousLocationRef.current = selectedLocation;

        if (window.matchMedia('(max-width: 767px), (prefers-reduced-motion: reduce)').matches)
            return undefined;
        const image = locationImageRef.current;
        const copy = locationCopyRef.current;
        if (!image || !copy) return undefined;

        const context = gsap.context(() => {
            gsap.fromTo(
                image,
                { autoAlpha: 0, y: -20 },
                { autoAlpha: 1, y: 0, duration: 0.3, ease: 'power2.out', overwrite: true }
            );
            gsap.fromTo(
                copy,
                { autoAlpha: 0, y: 20 },
                { autoAlpha: 1, y: 0, duration: 0.3, ease: 'power2.out', overwrite: true }
            );
        });

        return () => context.revert();
    }, [selectedLocation]);
    useLayoutEffect(() => {
        const drive = driveRef.current;
        if (!drive) return undefined;

        const media = gsap.matchMedia();
        media.add('(max-width: 767px)', () => {
            const slides = gsap.utils.toArray('.renewal-drive__slide', drive);
            const prefersReducedMotion = window.matchMedia(
                '(prefers-reduced-motion: reduce)'
            ).matches;
            const timelines = [];

            slides.forEach((slide) => {
                const vehicle = slide.querySelector('.renewal-drive__vehicle-frame');
                const wheels = [...slide.querySelectorAll('.renewal-drive__wheel')];
                if (!vehicle) return;

                if (prefersReducedMotion) {
                    gsap.set(vehicle, { x: 0 });
                    gsap.set(wheels, { '--wheel-roll': '0deg' });
                    return;
                }

                const timeline = gsap.timeline({
                    defaults: { ease: 'none' },
                    scrollTrigger: {
                        trigger: slide,
                        start: 'top 92%',
                        end: 'top 42%',
                        scrub: 0.65,
                        invalidateOnRefresh: true,
                    },
                });
                timeline.fromTo(
                    vehicle,
                    { x: () => window.innerWidth * 0.88 },
                    { x: 0, duration: 1 },
                    0
                );
                timeline.fromTo(
                    wheels,
                    { '--wheel-roll': '0deg' },
                    { '--wheel-roll': '-720deg', duration: 1 },
                    0
                );
                timelines.push(timeline);
            });

            return () => {
                timelines.forEach((timeline) => {
                    timeline.scrollTrigger?.kill();
                    timeline.kill();
                });
                gsap.set('.renewal-drive__vehicle-frame', { clearProps: 'transform' });
                gsap.set('.renewal-drive__wheel', { clearProps: '--wheel-roll' });
            };
        });

        return () => media.revert();
    }, []);
    useLayoutEffect(() => {
        const transition = locationTransitionRef.current;
        if (!transition) return undefined;
        const navigationEntry = performance.getEntriesByType('navigation')[0];
        if (navigationEntry?.type === 'reload' && window.scrollY > 0) {
            window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        }
        const media = gsap.matchMedia();
        let refreshFrame;
        let disposed = false;
        const refreshScrollLayout = () => {
            cancelAnimationFrame(refreshFrame);
            refreshFrame = requestAnimationFrame(() => {
                if (!disposed) ScrollTrigger.refresh();
            });
        };
        media.add('(min-width: 901px)', () => {
            let typingSequence;
            let sloganPin;
            let isSloganTyping = false;
            let sloganAdvanceFrame;
            let removeSloganBoundary;
            const resetSloganPresentation = () => {
                typingSequence?.pause(0);
                if (sloganTextRef.current) gsap.set(sloganTextRef.current, { text: '' });
                if (sloganCursorRef.current) gsap.set(sloganCursorRef.current, { opacity: 0 });
            };
            const holdSloganPosition = () => {
                if (!isSloganTyping || !sloganPin) return;
                const target = sloganPin.start + 1;
                if (Math.abs(window.scrollY - target) > 1) {
                    withInstantScroll(() => sloganPin.scroll(target));
                }
            };
            let cleanupDriveInteraction;
            let cleanupExperienceWheel;
            let cleanupVehicleSlogan;
            let cleanupVehicleModelNames;
            let cleanupCurrentExhibition;
            const prefersReducedMotion = window.matchMedia(
                '(prefers-reduced-motion: reduce)'
            ).matches;
            const image = transition.querySelector('.renewal-location-transition__image');
            const imageViewport = transition.querySelector(
                '.renewal-location-transition__viewport'
            );
            const intro = transition.previousElementSibling?.matches('.renewal-intro')
                ? transition.previousElementSibling
                : null;
            const locationSection = transition.querySelector('.renewal-location');
            const target = transition.querySelector('.renewal-location__detail img');
            const hero = intro?.previousElementSibling?.matches('.renewal-hero')
                ? intro.previousElementSibling
                : null;
            let heroSequenceTrigger;
            if (hero && intro) {
                const stepHold = 0.4;
                const openingDuration = 2.4;
                const introFullHold = 0.5;
                const stepTwoEnd = 2;
                const stepThreeStart = stepTwoEnd + stepHold;
                const stepThreeEnd = stepThreeStart + 0.2;
                const stepFourStart = stepThreeEnd + stepHold;
                const stepFourEnd = stepFourStart + 1;
                const openingStart = stepFourEnd + stepHold;
                const introFullStart = openingStart + openingDuration;
                const heroTimelineDuration = introFullStart + introFullHold;
                const heroDistance = () => window.innerHeight * heroTimelineDuration;
                const shade = hero.querySelector('.renewal-hero__shade-layer');
                const copy = (step) => [...hero.querySelectorAll(`[data-hero-copy="${step}"]`)];
                const shadeSubtract = hero.querySelector('.renewal-hero__shade-subtract');
                const openingGeometry = hero.querySelector('.renewal-hero__opening-geometry');
                const openingPath = openingGeometry.querySelector('path');
                const heroCanvas = hero.querySelector('.renewal-hero__canvas');
                if (prefersReducedMotion) {
                    hero.dataset.heroStep = '4';
                    copy(4).forEach((word) => {
                        word.style.visibility = 'visible';
                    });
                    gsap.set(shade, { autoAlpha: 1 });
                    gsap.set(shadeSubtract, {
                        attr: { x: 688, y: 355, width: 545, height: 319, opacity: 1 },
                    });
                    gsap.set(openingGeometry, { attr: { opacity: 1, transform: '' } });
                } else {
                    gsap.set(heroCanvas, { autoAlpha: 1 });
                    gsap.set(shade, { autoAlpha: 0 });
                    gsap.set(shadeSubtract, {
                        attr: { x: 960.5, y: 515.5, width: 0, height: 0, opacity: 1 },
                    });
                    gsap.set([...copy(2), ...copy(3), ...copy(4)], { autoAlpha: 0 });
                    gsap.set(openingGeometry, { attr: { opacity: 0, transform: '' } });
                    const openingProgress = { value: 0 };
                    const stepFourOpening = openingPath.getAttribute('d');
                    const smootherstep = (value) => {
                        const t = Math.min(1, Math.max(0, value));
                        return t * t * t * (t * (t * 6 - 15) + 10);
                    };
                    const rectilinearUnion = (rectangles) => {
                        const rects = rectangles
                            .map(([left, top, right, bottom]) => [
                                Math.max(0, left),
                                Math.max(0, top),
                                Math.min(1920, right),
                                Math.min(1080, bottom),
                            ])
                            .filter(([left, top, right, bottom]) => left < right && top < bottom);
                        const xs = [
                            ...new Set(rects.flatMap(([left, , right]) => [left, right])),
                        ].sort((a, b) => a - b);
                        const ys = [
                            ...new Set(rects.flatMap(([, top, , bottom]) => [top, bottom])),
                        ].sort((a, b) => a - b);
                        const cells = Array.from({ length: xs.length - 1 }, (_, x) =>
                            Array.from({ length: ys.length - 1 }, (_, y) => {
                                const midX = (xs[x] + xs[x + 1]) / 2;
                                const midY = (ys[y] + ys[y + 1]) / 2;
                                return rects.some(
                                    ([left, top, right, bottom]) =>
                                        left < midX && midX < right && top < midY && midY < bottom
                                );
                            })
                        );
                        const edges = [];
                        const add = (fromX, fromY, toX, toY) => {
                            edges.push({
                                from: `${fromX},${fromY}`,
                                to: `${toX},${toY}`,
                                x: fromX,
                                y: fromY,
                            });
                        };
                        for (let x = 0; x < cells.length; x += 1) {
                            for (let y = 0; y < cells[x].length; y += 1) {
                                if (!cells[x][y]) continue;
                                if (y === 0 || !cells[x][y - 1])
                                    add(xs[x], ys[y], xs[x + 1], ys[y]);
                                if (x === cells.length - 1 || !cells[x + 1][y])
                                    add(xs[x + 1], ys[y], xs[x + 1], ys[y + 1]);
                                if (y === cells[x].length - 1 || !cells[x][y + 1])
                                    add(xs[x + 1], ys[y + 1], xs[x], ys[y + 1]);
                                if (x === 0 || !cells[x - 1][y])
                                    add(xs[x], ys[y + 1], xs[x], ys[y]);
                            }
                        }
                        const byStart = new Map();
                        edges.forEach((edge, index) => {
                            if (!byStart.has(edge.from)) byStart.set(edge.from, []);
                            byStart.get(edge.from).push(index);
                        });
                        const visited = new Set();
                        const point = (edge) =>
                            `${Number(edge.x.toFixed(3))} ${Number(edge.y.toFixed(3))}`;
                        const loops = [];
                        edges.forEach((first, index) => {
                            if (visited.has(index)) return;
                            const parts = [`M ${point(first)}`];
                            let next = index;
                            do {
                                visited.add(next);
                                const edge = edges[next];
                                const candidates = byStart.get(edge.to) ?? [];
                                next = candidates.find((candidate) => !visited.has(candidate));
                                if (next !== undefined) parts.push(`L ${point(edges[next])}`);
                            } while (next !== undefined && edges[next].from !== first.from);
                            loops.push(`${parts.join(' ')} Z`);
                        });
                        return loops.join(' ');
                    };
                    const updateOpeningGeometry = () => {
                        const progress = openingProgress.value;
                        if (progress <= 0) {
                            openingPath.setAttribute('d', stepFourOpening);
                            return;
                        }
                        const opened = smootherstep(progress);
                        const finish = smootherstep((progress - 0.7) / 0.3);
                        const vertical = 400 * opened + 550 * finish;
                        const horizontal = 600 * opened + 350 * finish;
                        const band = 320 * opened + 250 * finish;
                        const stem = 140 * smootherstep(progress / 0.2);
                        const postOffset = 47.9560036663611 * (1 - smootherstep(progress / 0.4));
                        openingPath.setAttribute(
                            'd',
                            rectilinearUnion([
                                [924 - vertical, 0, 996 + vertical, 355 + stem],
                                [924 - vertical, 674 - stem, 996 + vertical, 1080],
                                [
                                    735.9560036663611 - horizontal - postOffset,
                                    355,
                                    735.9560036663611,
                                    674,
                                ],
                                [
                                    1185.043996333639,
                                    355,
                                    1185.043996333639 + horizontal + postOffset,
                                    674,
                                ],
                                [
                                    735.9560036663611 - horizontal,
                                    490.7871674491393 - band,
                                    1185.043996333639 + horizontal,
                                    532.2222222222222 + band,
                                ],
                            ])
                        );
                    };
                    const heroTimeline = gsap.timeline({
                        defaults: { ease: 'none' },
                        scrollTrigger: {
                            trigger: hero,
                            start: 'top top',
                            end: () => `+=${heroDistance()}`,
                            pin: hero,
                            pinSpacing: true,
                            scrub: 1.2,
                            // Pin at the measured boundary; velocity prediction can toggle a stationary section.
                            anticipatePin: 0,
                            invalidateOnRefresh: true,
                            onLeave: () => {
                                gsap.set(heroCanvas, { visibility: 'hidden' });
                            },
                            onEnterBack: () => gsap.set(heroCanvas, { visibility: 'visible' }),
                        },
                    });

                    heroTimeline
                        .addLabel('step-01', 0)
                        .to(shade, { autoAlpha: 1, duration: 0.35 }, 1)
                        .to(
                            shadeSubtract,
                            {
                                attr: { x: 688, y: 355, width: 545, height: 321 },
                                duration: 0.65,
                            },
                            1
                        )
                        .to(copy(2), { autoAlpha: 1, duration: 0.2 }, 1.75)
                        .call(
                            () => {
                                hero.dataset.heroStep = '2';
                            },
                            [],
                            stepTwoEnd
                        )
                        .addLabel('step-02-hold', stepTwoEnd)
                        .to(copy(2), { autoAlpha: 0, duration: 0.2 }, stepThreeStart)
                        .to(copy(3), { autoAlpha: 1, duration: 0.2 }, stepThreeStart)
                        .call(
                            () => {
                                hero.dataset.heroStep = '3';
                            },
                            [],
                            stepThreeEnd
                        )
                        .addLabel('step-03-hold', stepThreeEnd)
                        .to(copy(3), { autoAlpha: 0, duration: 0.2 }, stepFourStart)
                        .to(copy(4), { autoAlpha: 1, duration: 0.2 }, stepFourStart)
                        .to(shadeSubtract, { attr: { height: 319 }, duration: 0.65 }, stepFourStart)
                        .to(
                            openingGeometry,
                            { attr: { opacity: 1 }, duration: 0.65 },
                            stepFourStart + 0.35
                        )
                        .call(
                            () => {
                                hero.dataset.heroStep = '4';
                            },
                            [],
                            stepFourEnd
                        )
                        .addLabel('step-04-hold', stepFourEnd)
                        .to(shade, { autoAlpha: 0, duration: 0.35 }, openingStart)
                        .to(
                            openingProgress,
                            {
                                value: 1,
                                duration: openingDuration,
                                onUpdate: updateOpeningGeometry,
                            },
                            openingStart
                        )
                        .addLabel('intro-full', introFullStart)
                        .to({}, { duration: introFullHold }, introFullStart)
                        .addLabel('intro-hold', heroTimelineDuration);
                    heroSequenceTrigger = heroTimeline.scrollTrigger;
                }
            }
            const locationButtonHandlers = [];
            if (
                !prefersReducedMotion &&
                intro &&
                image &&
                imageViewport &&
                target &&
                locationSection
            ) {
                const bounds = () => {
                    const destination = target.getBoundingClientRect();
                    const section = locationSection.getBoundingClientRect();
                    return {
                        x: locationSection.offsetLeft + destination.left - section.left,
                        y: destination.top - section.top,
                        width: destination.width,
                        height: destination.height,
                    };
                };
                const syncSharedImage = (self) => {
                    const atLocation = self.progress >= 1;
                    gsap.set(imageViewport, { autoAlpha: atLocation ? 0 : 1 });
                    gsap.set(target, { autoAlpha: atLocation ? 1 : 0 });
                };
                const introFade = gsap.fromTo(
                    intro,
                    { '--intro-copy-opacity': 1 },
                    {
                        '--intro-copy-opacity': 0,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: intro,
                            start: () => heroSequenceTrigger?.end ?? 'top top',
                            end: () => `+=${window.innerHeight * 0.25}`,
                            scrub: true,
                            invalidateOnRefresh: true,
                            onLeave: () => gsap.set(intro, { autoAlpha: 0 }),
                            onEnterBack: () => gsap.set(intro, { autoAlpha: 1 }),
                        },
                    }
                );
                const timeline = gsap.timeline({
                    defaults: { ease: 'none' },
                    scrollTrigger: {
                        trigger: transition,
                        start: () => introFade.scrollTrigger.end,
                        // The CSS entry space includes the copy fade, then one viewport of travel.
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
                        onRefresh: syncSharedImage,
                    },
                });
                const viewportWidth = () => imageViewport.clientWidth;
                const viewportHeight = () => window.innerHeight;
                const clipAtProgress = (progress) => {
                    const destination = bounds();
                    const x = destination.x * progress;
                    const y = destination.y * progress;
                    const width =
                        viewportWidth() + (destination.width - viewportWidth()) * progress;
                    const height =
                        viewportHeight() + (destination.height - viewportHeight()) * progress;
                    const cropProgress = Math.min(1, progress / 0.15);
                    const lowerRightY = 1 - 0.1493 * cropProgress;
                    const lowerRightX = 1 - 0.082609 * cropProgress;
                    return `polygon(${x}px ${y}px, ${x + width}px ${y}px, ${x + width}px ${y + height * lowerRightY}px, ${x + width * lowerRightX}px ${y + height}px, ${x}px ${y + height}px)`;
                };
                timeline.fromTo(
                    image,
                    {
                        xPercent: -50,
                        yPercent: -50,
                        x: 0,
                        y: 0,
                        width: viewportWidth,
                        height: viewportHeight,
                        force3D: true,
                    },
                    {
                        xPercent: -50,
                        yPercent: -50,
                        x: () => {
                            const destination = bounds();
                            return destination.x + destination.width / 2 - viewportWidth() / 2;
                        },
                        y: () => {
                            const destination = bounds();
                            return destination.y + destination.height / 2 - viewportHeight() / 2;
                        },
                        width: () => bounds().width,
                        height: () => bounds().height,
                        force3D: true,
                        autoRound: false,
                        duration: 1,
                    },
                    0
                );
                timeline.fromTo(
                    imageViewport,
                    { clipPath: () => clipAtProgress(0) },
                    { clipPath: () => clipAtProgress(0.15), duration: 0.15 },
                    0
                );
                timeline.to(
                    imageViewport,
                    { clipPath: () => clipAtProgress(1), duration: 0.85 },
                    0.15
                );
                // Cover the location rail/links only while travelling; restore on arrival.
                // A positive start keeps the intro copy above the image before shrinking.
                timeline.set(imageViewport, { zIndex: 3 }, 0.000001);
                timeline.set(imageViewport, { zIndex: 1 }, 1);
                timeline.set(target, { autoAlpha: 0 }, 0);
                timeline.set(target, { autoAlpha: 1 }, 1);
                timeline.set(imageViewport, { autoAlpha: 0 }, 1);
                const locationRail = locationSection.querySelector('.renewal-location__rail');
                gsap.set(locationRail, { display: 'none' });
                const syncLocationRail = (self) => {
                    gsap.set(locationRail, {
                        display: self.scroll() >= self.start ? 'block' : 'none',
                    });
                };
                // Match the 580 × 320 location asset's lower-right diagonal cut.
                const updateLocation = (self) => {
                    const navigation = locationNavigationRef.current;
                    if (navigation) {
                        // Keep the clicked location visible while its existing smooth scroll runs.
                        if (Math.abs(window.scrollY - navigation.target) > 1) return;
                        locationNavigationRef.current = null;
                    }
                    setSelectedLocation(
                        Math.min(locations.length - 1, Math.floor(self.progress * locations.length))
                    );
                };
                locationScrollRef.current = ScrollTrigger.create({
                    trigger: locationSection,
                    start: () => timeline.scrollTrigger.end,
                    end: () => `+=${locations.length * window.innerHeight}`,
                    pin: locationSection,
                    // Keep viewport pin coordinates independent of the page wrappers.
                    pinReparent: true,
                    invalidateOnRefresh: true,
                    onUpdate: updateLocation,
                    onEnter: syncLocationRail,
                    onEnterBack: (self) => {
                        syncLocationRail(self);
                        resetSloganPresentation();
                    },
                    onLeaveBack: syncLocationRail,
                    onRefresh: (self) => {
                        locationNavigationRef.current = null;
                        updateLocation(self);
                        syncLocationRail(self);
                    },
                });
                // pinReparent moves the section outside React's delegated event root.
                // Keep its existing tabs clickable while that pin is active.
                locationButtonHandlers.push(
                    ...[...locationSection.querySelectorAll('.renewal-location__list button')].map(
                        (button, index) => {
                            const handleClick = () => {
                                if (locationSection.parentElement === document.body)
                                    selectLocation(index);
                            };
                            button.addEventListener('click', handleClick);
                            return () => button.removeEventListener('click', handleClick);
                        }
                    )
                );
            }
            const slogan = sloganRef.current;
            const sloganText = sloganTextRef.current;
            const sloganCursor = sloganCursorRef.current;
            if (slogan && sloganText && sloganCursor) {
                const typingDuration = 1.2;
                gsap.set(sloganText, { text: '' });
                gsap.set(sloganCursor, { opacity: 0 });
                typingSequence = gsap
                    .timeline({
                        defaults: { ease: 'steps(1)' },
                        paused: true,
                        onComplete: () => {
                            sloganAdvanceFrame = requestAnimationFrame(() => {
                                if (!isSloganTyping || !sloganPin) return;
                                isSloganTyping = false;
                                setHomeScrollLocked(false);
                                sloganPin.scroll(sloganPin.end + 1);
                            });
                        },
                    })
                    .to({}, { duration: 0.4 })
                    .set(sloganCursor, { opacity: 1 })
                    .to(sloganCursor, { duration: 0.2, opacity: 0 })
                    .to(sloganCursor, { duration: 0.2, opacity: 1 })
                    .to(sloganCursor, { duration: 0.2, opacity: 0 })
                    .to(sloganCursor, { duration: 0.2, opacity: 1 })
                    .to(sloganText, {
                        duration: typingDuration,
                        ease: 'none',
                        text: 'EXPERIENCE',
                    })
                    .to(sloganCursor, { duration: 0.2, opacity: 0 })
                    .to(sloganCursor, { duration: 0.2, opacity: 1 })
                    .to(sloganCursor, { duration: 0.2, opacity: 0 })
                    .to({}, { duration: 0.4 });
                sloganPin = ScrollTrigger.create({
                    trigger: slogan,
                    start: 'top top',
                    end: () => `+=${window.innerHeight}`,
                    pin: slogan,
                    pinReparent: true,
                    anticipatePin: 0,
                    invalidateOnRefresh: true,
                    onEnter: () => {
                        if (isSloganTyping) return;
                        isSloganTyping = true;
                        setHomeScrollLocked(true);
                        holdSloganPosition();
                        resetSloganPresentation();
                        typingSequence.restart();
                    },
                    onLeaveBack: () => {
                        if (isSloganTyping) {
                            holdSloganPosition();
                            return;
                        }
                        isSloganTyping = false;
                        setHomeScrollLocked(false);
                    },
                });
                window.addEventListener('scroll', holdSloganPosition);
                removeSloganBoundary = registerHomeScrollBoundary(
                    (from, target) =>
                        from <= sloganPin.start && target > sloganPin.start
                            ? sloganPin.start + 1
                            : target,
                    () => [sloganPin.start, sloganPin.end]
                );
            }
            const driveSection = driveRef.current;
            const driveStage = driveSection?.parentElement;
            const driveTrack = driveSection?.querySelector('.renewal-drive__track');
            if (driveSection && driveTrack) {
                const driveSlides = [...driveTrack.querySelectorAll('.renewal-drive__slide')];
                const driveFrames = driveSlides.map((slide) =>
                    slide.querySelector('.renewal-drive__vehicle-frame')
                );
                const driveWheels = driveSlides.map((slide) => [
                    ...slide.querySelectorAll('.renewal-drive__wheel'),
                ]);
                const driveCopies = driveSlides.map((slide) => [
                    slide.querySelector('h2'),
                    slide.querySelector('.renewal-drive__copy'),
                ]);
                const revealStart = 0.25;
                const driveCopyVisibility = driveSlides.map((_, index) => index === 0);
                const centeredHold = 0.5;
                const driveTargets = [];
                const measureDriveLayout = () => {
                    const viewportWidth = driveSection.clientWidth;
                    const blankGap = viewportWidth * 0.04;
                    const frameWidths = driveFrames.map((frame) => frame?.offsetWidth ?? 0);
                    const vehicleCenters = [viewportWidth / 2];
                    driveSlides.forEach((slide, index) => {
                        if (index > 0) {
                            vehicleCenters[index] =
                                vehicleCenters[index - 1] +
                                viewportWidth +
                                frameWidths[index - 1] / 2 +
                                frameWidths[index] / 2 +
                                blankGap;
                        }
                        const defaultCenter = slide.offsetLeft + viewportWidth / 2;
                        slide.style.setProperty(
                            '--drive-vehicle-offset',
                            `${vehicleCenters[index] - defaultCenter}px`
                        );
                        driveTargets[index] = viewportWidth / 2 - vehicleCenters[index];
                    });
                };
                measureDriveLayout();
                const driveScrollDistance = () =>
                    Math.max(
                        Math.abs(driveTargets.at(-1) ?? 0),
                        window.innerHeight * driveModels.length * 2
                    );
                const refreshDriveStage = () => {
                    measureDriveLayout();
                    gsap.set(driveStage, {
                        height: driveSection.offsetHeight + driveScrollDistance(),
                    });
                };
                gsap.set(driveSection, { position: 'sticky', top: 0 });
                refreshDriveStage();
                const setDriveCopyVisibility = (index, shouldShow) => {
                    if (driveCopyVisibility[index] === shouldShow) return;
                    driveCopyVisibility[index] = shouldShow;
                    const targets = driveCopies[index];
                    gsap.killTweensOf(targets);

                    if (shouldShow) {
                        gsap.set(targets, {
                            opacity: 1,
                            visibility: 'visible',
                        });
                        gsap.fromTo(
                            targets,
                            { opacity: 0 },
                            {
                                opacity: 1,
                                duration: 0.35,
                                ease: 'power1.out',
                            }
                        );
                        return;
                    }

                    gsap.to(targets, {
                        opacity: 0,
                        duration: 0.28,
                        ease: 'power1.in',
                        onComplete: () => {
                            if (!driveCopyVisibility[index]) {
                                gsap.set(targets, { visibility: 'hidden' });
                            }
                        },
                    });
                };
                const updateDriveCopy = () => {
                    const viewportWidth = window.innerWidth;
                    const trackX = Number(gsap.getProperty(driveTrack, 'x')) || 0;
                    driveWheels.forEach((wheels) => {
                        wheels.forEach((wheel) => {
                            const wheelDiameter = wheel.offsetWidth * 0.9;
                            const rotation = wheelDiameter
                                ? (trackX / (Math.PI * wheelDiameter)) * 360
                                : 0;
                            wheel.style.setProperty('--wheel-roll', `${rotation}deg`);
                        });
                    });
                    driveFrames.forEach((frame, index) => {
                        if (!frame) return;
                        driveSlides[index].style.setProperty(
                            '--drive-copy-offset',
                            `${-driveSlides[index].offsetLeft - trackX}px`
                        );
                        const bounds = frame.getBoundingClientRect();
                        const visibleWidth = Math.max(
                            0,
                            Math.min(bounds.right, viewportWidth) - Math.max(bounds.left, 0)
                        );
                        const visibleRatio = Math.min(1, visibleWidth / bounds.width);
                        const isEntering = bounds.left + bounds.width / 2 >= viewportWidth / 2;
                        const shouldShow = isEntering
                            ? visibleRatio >= revealStart
                            : visibleRatio > revealStart;
                        setDriveCopyVisibility(index, shouldShow);
                    });
                };
                gsap.set(driveCopies.slice(1).flat(), {
                    autoAlpha: 0,
                });
                gsap.set(driveCopies[0], {
                    autoAlpha: 1,
                });
                let driveExitTimer;
                let driveExitLocked = false;
                let driveExitAllowed = false;
                const holdDriveExit = (trigger) => {
                    if (driveExitAllowed || driveExitLocked) return;
                    driveExitLocked = true;
                    setHomeScrollLocked(true);
                    withInstantScroll(() => trigger.scroll(trigger.end - 1));
                    ScrollTrigger.update();
                    driveExitTimer = window.setTimeout(() => {
                        driveExitLocked = false;
                        driveExitAllowed = true;
                        setHomeScrollLocked(false);
                    }, 300);
                };
                const driveTimeline = gsap.timeline({
                    scrollTrigger: {
                        id: 'home-drive',
                        trigger: driveStage,
                        start: 'top top',
                        end: () => `+=${driveScrollDistance()}`,
                        scrub: true,
                        invalidateOnRefresh: true,
                        onRefreshInit: refreshDriveStage,
                        onRefresh: updateDriveCopy,
                        onLeave: (self) => {
                            // A direct navigation to a distant section is not a vehicle-exit gesture.
                            if (self.scroll() <= self.end + window.innerHeight) holdDriveExit(self);
                        },
                        onUpdate: (self) => {
                            if (!driveExitLocked && self.progress < 0.9) driveExitAllowed = false;
                        },
                    },
                    onUpdate: updateDriveCopy,
                });
                driveTimeline.to({}, { duration: centeredHold });
                driveSlides.slice(1).forEach((_, index) => {
                    driveTimeline
                        .to(driveTrack, {
                            x: () => driveTargets[index + 1],
                            duration: 1,
                            ease: 'none',
                        })
                        .to({}, { duration: centeredHold });
                });
                const removeDriveBoundary = registerHomeScrollBoundary(
                    (from, target) => {
                        const trigger = driveTimeline.scrollTrigger;
                        if (
                            target > from &&
                            from <= trigger.end &&
                            target >= trigger.end &&
                            !driveExitAllowed
                        ) {
                            holdDriveExit(trigger);
                            return trigger.end - 1;
                        }
                        return target;
                    },
                    () => [driveTimeline.scrollTrigger.start, driveTimeline.scrollTrigger.end]
                );
                const keepDriveExitPosition = () => {
                    if (!driveExitLocked) return;
                    const trigger = driveTimeline.scrollTrigger;
                    if (Math.abs(window.scrollY - (trigger.end - 1)) > 1) {
                        withInstantScroll(() => trigger.scroll(trigger.end - 1));
                        ScrollTrigger.update();
                    }
                };
                window.addEventListener('scroll', keepDriveExitPosition);
                updateDriveCopy();
                cleanupDriveInteraction = () => {
                    window.clearTimeout(driveExitTimer);
                    if (driveExitLocked) setHomeScrollLocked(false);
                    driveExitLocked = false;
                    removeDriveBoundary();
                    window.removeEventListener('scroll', keepDriveExitPosition);
                    driveTimeline.scrollTrigger?.kill();
                    driveTimeline.kill();
                    driveSlides.forEach((slide) => {
                        slide.style.removeProperty('--drive-copy-offset');
                        slide.style.removeProperty('--drive-vehicle-offset');
                    });
                    driveWheels.flat().forEach((wheel) => {
                        wheel.style.removeProperty('--wheel-roll');
                    });
                    gsap.killTweensOf(driveCopies.flat());
                    gsap.set(driveCopies.flat(), { clearProps: 'opacity,visibility' });
                };
            }
            const experienceSection = experienceRef.current;
            const experienceRingElement = experienceRingRef.current;
            const experienceIndicator = experienceIndicatorRef.current;
            const experienceTitle = experienceTitleRef.current;
            if (
                experienceSection &&
                experienceRingElement &&
                experienceIndicator &&
                experienceTitle
            ) {
                const experienceRotationAmount = 360;
                const wheelDegreesPerScrollPixel = 0.05;
                const experienceRotationDistance =
                    experienceRotationAmount / wheelDegreesPerScrollPixel;
                const previews = [
                    ...experienceSection.querySelectorAll('[data-experience-preview]'),
                ];
                let currentIndicatorRotation = 0;
                let targetIndicatorRotation = 0;
                let currentSpinnerRotation = 0;
                let targetSpinnerRotation = 0;
                let scrollRotation = 0;
                let automaticIndicatorRotation = 0;
                let automaticSpinnerRotation = 0;
                let lastSegmentIndex = -1;
                let isActive = false;
                gsap.set(previews, { autoAlpha: 0 });
                gsap.set(previews[0], { autoAlpha: 1 });
                const updateExperienceContent = () => {
                    const relativeRotation =
                        (((currentIndicatorRotation - currentSpinnerRotation) % 360) + 360) % 360;
                    const orderIndex = Math.ceil(relativeRotation / 36) % experienceRing.length;
                    const segmentIndex = experienceSelectionOrder[orderIndex];
                    if (segmentIndex === lastSegmentIndex) return;
                    lastSegmentIndex = segmentIndex;
                    experienceTitle.textContent = experienceRing[segmentIndex].name;
                    gsap.to(previews, { autoAlpha: 0, duration: 0.1, overwrite: true });
                    gsap.to(previews[segmentIndex], {
                        autoAlpha: 1,
                        duration: 0.1,
                        ease: 'power2.out',
                        overwrite: true,
                    });
                };
                const updateExperienceWheel = (_, deltaTime) => {
                    const seconds = Math.min(deltaTime / 1000, 0.1);
                    if (isActive) {
                        automaticIndicatorRotation += 18 * seconds;
                        automaticSpinnerRotation -= 18 * 0.25 * seconds;
                    }
                    targetIndicatorRotation = automaticIndicatorRotation + scrollRotation;
                    targetSpinnerRotation = automaticSpinnerRotation - scrollRotation;
                    currentIndicatorRotation +=
                        (targetIndicatorRotation - currentIndicatorRotation) * 0.1;
                    currentSpinnerRotation +=
                        (targetSpinnerRotation - currentSpinnerRotation) * 0.1;
                    gsap.set(experienceIndicator, { rotation: currentIndicatorRotation });
                    gsap.set(experienceRingElement, {
                        rotation: currentSpinnerRotation,
                        '--ring-rotation': `${currentSpinnerRotation}deg`,
                    });
                    updateExperienceContent();
                };
                const experienceTrigger = ScrollTrigger.create({
                    trigger: experienceSection,
                    start: 'center center',
                    end: () => `+=${experienceRotationDistance}`,
                    pin: experienceSection,
                    pinReparent: true,
                    anticipatePin: 0,
                    invalidateOnRefresh: true,
                    onToggle: (self) => {
                        isActive = self.isActive;
                    },
                    onUpdate: (self) => {
                        scrollRotation = self.progress * experienceRotationAmount;
                    },
                });
                gsap.ticker.add(updateExperienceWheel);
                updateExperienceContent();
                cleanupExperienceWheel = () => {
                    isActive = false;
                    experienceTrigger.kill();
                    gsap.ticker.remove(updateExperienceWheel);
                    gsap.killTweensOf(previews);
                };
            }
            if (vehicleSloganRef.current && !prefersReducedMotion) {
                cleanupVehicleSlogan = setupVehicleSlogan(vehicleSloganRef.current);
            }
            if (!prefersReducedMotion) {
                const modelNameAnimations = [...document.querySelectorAll(
                    '.renewal-vehicle-exhibition-card-list__item'
                )].map((card, index) => {
                    const modelName = card.querySelector('.renewal-vehicle-exhibition-card-list__model-name');
                    const image = card.querySelector('img');
                    const movesRight = index % 2 !== 0;
                    const startX = () => Math.min(window.innerWidth * 0.0625, 120) * (movesRight ? -1 : 1);
                    let tween;
                    let hasAppeared = false;
                    const reveal = () => {
                        tween?.kill();
                        hasAppeared = true;
                        gsap.set(modelName, { xPercent: card.matches('.is-gv80') ? -100 : 0 });
                        tween = gsap.fromTo(modelName, {
                            x: startX,
                            opacity: 0,
                            clipPath: movesRight ? 'inset(0 100% 0 0%)' : 'inset(0 0% 0 100%)',
                        }, {
                            x: 0,
                            opacity: 0.24,
                            clipPath: 'inset(0 0% 0 0%)',
                            duration: 0.8,
                            ease: 'power2.out',
                        });
                    };
                    const revealOffset = () => {
                        const rect = image.getBoundingClientRect();
                        return rect.top - window.innerHeight / 3;
                    };
                    let previousOffset = revealOffset();
                    let revealFrame;
                    const checkRevealPosition = () => {
                        cancelAnimationFrame(revealFrame);
                        revealFrame = requestAnimationFrame(() => {
                            const currentOffset = revealOffset();
                            if ((previousOffset > 0 && currentOffset <= 0) ||
                                (previousOffset < 0 && currentOffset >= 0)) reveal();
                            previousOffset = currentOffset;
                        });
                    };
                    window.addEventListener('scroll', checkRevealPosition, { passive: true });
                    window.addEventListener('resize', checkRevealPosition, { passive: true });
                    const visibilityObserver = new IntersectionObserver(([entry]) => {
                        if (hasAppeared) return;
                        if (entry.isIntersecting) {
                            if (revealOffset() <= 0) reveal();
                            else gsap.set(modelName, { opacity: 0 });
                        } else {
                            modelName.style.removeProperty('opacity');
                        }
                    });
                    visibilityObserver.observe(image);
                    return () => {
                        visibilityObserver.disconnect();
                        cancelAnimationFrame(revealFrame);
                        window.removeEventListener('scroll', checkRevealPosition);
                        window.removeEventListener('resize', checkRevealPosition);
                        tween?.kill();
                        ['opacity', 'visibility', 'clip-path', 'transform', 'translate', 'rotate', 'scale']
                            .forEach((property) => modelName.style.removeProperty(property));
                    };
                });
                cleanupVehicleModelNames = () => {
                    modelNameAnimations.forEach((cleanup) => cleanup());
                };
            }
            const currentExhibition = currentExhibitionRef.current;
            const currentTop = currentExhibitionTopRef.current;
            const currentBottom = currentExhibitionBottomRef.current;
            const currentCopy = currentExhibitionCopyRef.current;
            if (currentExhibition && currentTop && currentBottom && currentCopy) {
                const helixState = { progress: 0 };
                const renderHelix = () => spiralGalleryRef.current?.render(helixState.progress);
                const outsideLeft = () => -(window.innerWidth + currentTop.offsetWidth);
                const outsideRight = () => window.innerWidth + currentBottom.offsetWidth;
                const animationScrollViewports = 7;
                const finalHoldViewports = 0.6;
                const animationDuration = 4.05;
                const finalHoldDuration =
                    (animationDuration * finalHoldViewports) / animationScrollViewports;
                let syncHelixTicker = () => {};
                const currentTimeline = gsap.timeline({
                    defaults: { ease: 'none' },
                    scrollTrigger: {
                        trigger: currentExhibition,
                        start: 'center center',
                        end: () =>
                            `+=${
                                window.innerHeight * (animationScrollViewports + finalHoldViewports)
                            }`,
                        pin: currentExhibition,
                        pinReparent: true,
                        scrub: 1.5,
                        anticipatePin: 0,
                        invalidateOnRefresh: true,
                        onUpdate: () => {
                            renderHelix();
                            syncHelixTicker();
                        },
                        onRefresh: () => {
                            spiralGalleryRef.current?.resize();
                            renderHelix();
                            syncHelixTicker();
                        },
                    },
                });
                syncHelixTicker = () => {
                    const scrollTrigger = currentTimeline.scrollTrigger;
                    if (!scrollTrigger) return;
                    const margin = window.innerHeight;
                    const viewTop = window.scrollY - margin;
                    const viewBottom = window.scrollY + window.innerHeight + margin;
                    spiralGalleryRef.current?.setActive(
                        viewBottom > scrollTrigger.start && viewTop < scrollTrigger.end
                    );
                };
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
                    { progress: 1, duration: 3.4, onUpdate: renderHelix },
                    0.35
                );
                currentTimeline.to(currentTop, { x: outsideRight, duration: 1 }, 3.05);
                currentTimeline.to(currentBottom, { x: outsideLeft, duration: 1 }, 3.05);
                currentTimeline.to(currentCopy, { autoAlpha: 0, duration: 0.3 }, 3.05);
                currentTimeline.to(
                    helixState,
                    { progress: 1, duration: finalHoldDuration, onUpdate: renderHelix },
                    animationDuration
                );
                renderHelix();
                syncHelixTicker();
                cleanupCurrentExhibition = () => {
                    spiralGalleryRef.current?.setActive(false);
                    currentTimeline.scrollTrigger?.kill();
                    currentTimeline.kill();
                };
            }
            return () => {
                cancelAnimationFrame(sloganAdvanceFrame);
                removeSloganBoundary?.();
                window.removeEventListener('scroll', holdSloganPosition);
                isSloganTyping = false;
                setHomeScrollLocked(false);
                sloganPin?.kill();
                sloganPin = null;
                typingSequence?.kill();
                cleanupDriveInteraction?.();
                cleanupExperienceWheel?.();
                cleanupVehicleSlogan?.();
                cleanupVehicleModelNames?.();
                cleanupCurrentExhibition?.();
                locationButtonHandlers.forEach((removeHandler) => removeHandler());
                locationScrollRef.current = null;
                locationNavigationRef.current = null;
            };
        });
        window.addEventListener('load', refreshScrollLayout);
        if (document.readyState === 'complete') refreshScrollLayout();
        document.fonts?.ready.then(() => {
            if (!disposed) refreshScrollLayout();
        });
        return () => {
            disposed = true;
            cancelAnimationFrame(refreshFrame);
            window.removeEventListener('load', refreshScrollLayout);
            media.revert();
        };
    }, []);
    useLayoutEffect(() => setupHomeScrollControls(), []);

    return (
        <main className="renewal-home" id="top">
            <HomeHero />
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
                    구성된 전시와 프로그램을 통해 자동차는 물론 디자인과 예술까지 누구나 자신만의
                    <br />
                    방식으로 몰입할 수 있는 특별한 순간을 만나보세요.
                </p>
            </section>
            <div className="renewal-location-transition" ref={locationTransitionRef}>
                <div className="renewal-location-transition__viewport" aria-hidden="true">
                    <img
                        className="renewal-location-transition__image"
                        src={asset('intro.svg')}
                        alt=""
                    />
                </div>
                <section className="renewal-location" aria-label="현대 모터스튜디오 지점">
                    <div
                        className="renewal-location__list"
                        role="tablist"
                        aria-label="지점 선택"
                        onWheel={(event) => {
                            if (!window.matchMedia('(max-width: 767px)').matches) return;
                            if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
                            event.preventDefault();
                            event.currentTarget.scrollLeft += event.deltaY;
                        }}
                    >
                        {locations.map((item, index) => (
                            <button
                                key={item.slug}
                                type="button"
                                role="tab"
                                aria-selected={selectedLocation === index}
                                className={selectedLocation === index ? 'is-active' : ''}
                                onClick={() => selectLocation(index)}
                            >
                                {item.slug === 'senayan-park' ? 'SENAYAN PARK' : item.english}
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
                            ref={locationImageRef}
                            className={selectedLocation === 0 ? 'is-goyang' : ''}
                            src={
                                selectedLocation === 0
                                    ? asset('intro.svg')
                                    : (locationDetail.image ?? location.image)
                            }
                            alt={`${location.name} 공간`}
                        />
                        <div ref={locationCopyRef}>
                            <strong>{locationDetail.tagline}</strong>
                            <p>{locationDetail.description}</p>
                        </div>
                    </Link>
                </section>
            </div>
            <div className="renewal-slogan-entry">
                <section className="renewal-slogan" ref={sloganRef} aria-label="브랜드 슬로건">
                    <p>
                        WHAT YOU FIND
                        <br />
                        WHEN MOTION
                        <br />
                        MEETS
                    </p>
                    <strong aria-label="EXPERIENCE">
                        <span ref={sloganTextRef} />
                        <span
                            className="renewal-slogan__cursor"
                            ref={sloganCursorRef}
                            aria-hidden="true"
                        />
                    </strong>
                </section>
            </div>
            <div className="renewal-drive-stage">
                <section className="renewal-drive" ref={driveRef} aria-label="시승 프로그램">
                    <div className="renewal-drive__track">
                        {driveModels.map((item) => (
                            <article
                                className={`renewal-drive__slide ${item.shadowClass ?? ''}`}
                                key={item.name}
                                style={{
                                    '--drive-vehicle-contact-offset': `${item.contactOffset}px`,
                                }}
                            >
                                <h2>{item.name}</h2>
                                <div
                                    className={`renewal-drive__vehicle-frame ${item.vehicleClass ?? ''}`}
                                >
                                    <div className="renewal-drive__vehicle-body-frame">
                                        <img
                                            className="renewal-drive__vehicle-body"
                                            src={item.body}
                                            alt={`${item.name} 시승 차량`}
                                        />
                                    </div>
                                    {item.wheels.map((wheel, wheelIndex) => (
                                        <span
                                            className="renewal-drive__wheel-position"
                                            key={`${item.name}-wheel-${wheelIndex}`}
                                            style={{
                                                '--wheel-left': `${wheel.left}%`,
                                                '--wheel-top': `${wheel.top}%`,
                                                '--wheel-width': `${wheel.width}%`,
                                                '--wheel-height': `${wheel.height}%`,
                                                '--wheel-rotation': `${wheel.rotation}deg`,
                                            }}
                                        >
                                            <img
                                                className="renewal-drive__wheel"
                                                src={item.wheel}
                                                alt=""
                                                aria-hidden="true"
                                            />
                                        </span>
                                    ))}
                                </div>
                                <img
                                    className={`renewal-drive__shadow ${item.shadowClass ?? ''}`}
                                    src={item.shadow}
                                    alt=""
                                    aria-hidden="true"
                                />
                                <div className="renewal-drive__copy">
                                    <h3>{item.title}</h3>
                                    <p className="renewal-drive__copy-desktop">{item.copy}</p>
                                    <p className="renewal-drive__copy-mobile">{item.mobileCopy}</p>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>
            </div>
            <section
                className="renewal-experience"
                ref={experienceRef}
                aria-label="휠로 탐색하는 차량 전시"
            >
                <div className="renewal-experience__mobile">
                    <h2>차량 전시</h2>
                    <div className="renewal-experience__mobile-track">
                        {mobileExhibitionVehicles.map((item) => (
                            <article
                                className={item.featured ? 'is-featured' : undefined}
                                key={item.name}
                            >
                                <img src={asset(item.image)} alt={item.name} />
                                <p>
                                    <strong>{item.name}</strong>
                                    <span>{item.copy}</span>
                                </p>
                            </article>
                        ))}
                    </div>
                </div>
                <div className="renewal-experience__previews" aria-hidden="true">
                    {experienceRing.map((item) => (
                        <img
                            data-experience-preview
                            key={`${item.image}-${item.preview}`}
                            src={asset(item.image.replace('experience-source-', 'experience-bg-'))}
                            alt=""
                        />
                    ))}
                </div>
                <div className="renewal-experience__shade" aria-hidden="true" />
                <div className="renewal-experience__ring-position">
                    <div className="renewal-experience__ring" ref={experienceRingRef}>
                        {experienceRing.map((item) => (
                            <span
                                className="renewal-experience__ring-item"
                                key={item.image}
                                style={{
                                    '--x': `${item.x}%`,
                                    '--y': `${item.y}%`,
                                    '--rotate': `${item.rotate}deg`,
                                }}
                            >
                                <img src={asset(item.image)} alt="" draggable={false} />
                            </span>
                        ))}
                    </div>
                    <div className="renewal-experience__indicator" ref={experienceIndicatorRef}>
                        <img
                            className="renewal-experience__pointer"
                            src={asset('experience-pointer.svg')}
                            alt=""
                            draggable={false}
                        />
                    </div>
                </div>
                <p ref={experienceTitleRef} aria-live="polite">
                    IONIQ5N
                </p>
            </section>
            <section className="renewal-vehicle-exhibition-slogan" ref={vehicleSloganRef} aria-label="Vehicle Exhibition">
                <h2>
                    <span>HYUNDAI MOTORSTUDIO</span>
                    <span>VEHICLE EXHIBITION</span>
                </h2>
            </section>
            <section className="renewal-vehicle-exhibition-card-list">
                <header className="renewal-vehicle-exhibition-card-list__mobile-header">
                    <h2>
                        HYUNDAI MOTORSTUDIO
                        <br />
                        VEHICLE EXHIBITION
                    </h2>
                    <p>
                        직접 달리며 만나는 현대자동차의 새로운 가능성을 보고,
                        <br />
                        듣고, 느끼는 것에서 한 걸음 더 나아가 현대자동차의
                        <br />
                        다양한 모델의 감각과 기술을 경험해보세요.
                    </p>
                </header>
                <header className="renewal-vehicle-exhibition-card-list__header">
                    <div className="renewal-vehicle-exhibition-card-list__header-content">
                        <div className="renewal-vehicle-exhibition-card-list__title-slot">
                            <h2 className="renewal-vehicle-exhibition-card-list__mobile-title">
                                <span>HYUNDAI MOTORSTUDIO</span>
                                <span>VEHICLE EXHIBITION</span>
                            </h2>
                        </div>
                        <p>
                            직접 달리며 만나는 현대자동차의 새로운 가능성 보고, 듣고, 느끼는 것에서
                            한 걸음
                            <br />더 나아가 현대자동차의 다양한 모델의 감각과 기술을 경험해보세요.
                        </p>
                    </div>
                </header>
                <div className="renewal-vehicle-exhibition-card-list__items">
                    {exhibitionVehicles.map(
                        ({ name, powertrain, color, image, mobileImage, position }) => (
                            <article
                                className={`renewal-vehicle-exhibition-card-list__item ${position}`}
                                key={name}
                            >
                                <span className="renewal-vehicle-exhibition-card-list__model-name" aria-hidden="true">
                                    {name === 'THE NEW GRANDEUR' ? <>THE NEW<br />GRANDEUR</> : name}
                                </span>
                                <img src={asset(image)} alt={name} />
                                <img
                                    className="renewal-vehicle-exhibition-card-list__mobile-image"
                                    src={asset(mobileImage)}
                                    alt={name}
                                />
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
                        )
                    )}
                </div>
            </section>
            <section className="renewal-current" ref={currentExhibitionRef}>
                <div className="renewal-current__mobile">
                    <header>
                        <h2>
                            DISCOVER OUR
                            <br />
                            CURRENT EXHIBITIONS
                        </h2>
                        <p>
                            자동차와 모빌리티를 더욱 깊이 이해할 수 있도록 다양한 체험과 문화
                            프로그램을 준비했습니다. 관심과 취향에 맞는 프로그램을 선택해 새로운
                            영감을 만나보세요.
                        </p>
                    </header>
                    <div className="renewal-current__mobile-grid">
                        {mobileCurrentExhibitions.map((item) => (
                            <figure className={item.crop ?? ''} key={item.image}>
                                <img src={asset(item.image)} alt="" />
                            </figure>
                        ))}
                    </div>
                </div>
                <div className="renewal-current__content">
                    <div className="renewal-current__heading">
                        <h2 className="renewal-current__title" ref={currentExhibitionTopRef}>
                            CURRENT
                        </h2>
                        <p className="renewal-current__copy" ref={currentExhibitionCopyRef}>
                            DISCOVER OUR
                            <br />
                            CURRENT EXHIBITIONS
                        </p>
                    </div>
                    <h2 className="renewal-current__title" ref={currentExhibitionBottomRef}>
                        EXHIBITION
                    </h2>
                </div>
                <SpiralGallery ref={spiralGalleryRef} />
            </section>
            <HomeProgramSequence />
            <section className="renewal-story-title">
                <h2>
                    THE LATEST FROM
                    <br />
                    HYUNDAI MOTORSTUDIO
                </h2>
                <p>현대 모터스튜디오의 새로운 이야기를 만나보세요.</p>
                <span className="renewal-story-title__line-track" aria-hidden="true">
                    <img
                        className="renewal-story-title__line-base"
                        src={asset('title-center-line.svg')}
                        alt=""
                    />
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
