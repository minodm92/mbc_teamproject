import { useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';
import { locations } from '../../common/data/content';
import { paths } from '../../common/router/routePaths';
import { HomeHero, HomeStories, VisitorGuide } from '../../components/home/HomeSections';
import SpiralGallery from './SpiralGallery';
import HomeProgramSequence from './HomeProgramSequence';
import { homeAsset as asset } from './homeAssets';
import {
    setHomeScrollLocked,
    setHomeWheelDistanceRatio,
    setupHomeScrollSmoothing,
} from './homeScrollSmoothing';
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
        title: '아웃도어 라이프_데이트립 드라이브',
        copy: '넉넉한 시간과 자유로운 코스로 차량의 주행감과 편의성을 경험해보세요.\n일상 속에서 차량의 매력을 더욱 깊이 느낄 수 있습니다.',
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
        title: '하이 퍼포먼스 드라이브_언택트',
        copy: 'N 브랜드의 강렬한 퍼포먼스와 고성능 감성을 직접 경험해보세요.\n공공도로 주행을 통해 역동적인 드라이빙의 즐거움을 느낄 수 있습니다.',
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
        title: '베이직 드라이브',
        copy: '자동차 전문가 Guru의 친절한 설명과 함께 다양한 현대자동차를 직접 시승해보세요.\n차량의 특징과 주행 감각을 보다 쉽고 깊이 있게 경험할 수 있습니다.',
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
        title: '아웃도어 라이프_데이트립 드라이브',
        copy: '자동차 전문가 Guru의 설명과 함께 현대자동차의 다양한 차량을 시승해보세요.\n차량의 특징과 주행 감각을 보다 쉽고 편안하게 경험할 수 있습니다.',
    },
];
const exhibitionVehicles = [
    {
        name: 'AVANTE N',
        powertrain: 'GASOLINE 2.0 TURBO',
        color: 'PERFORMANCE BLUE',
        image: 'vehicle-1.svg',
        position: 'is-avante-n',
    },
    {
        name: 'THE NEW GRANDEUR',
        powertrain: '3.5 GASOLINE CALLIGRAPHY',
        color: 'ABYSS BLACK PEARL',
        image: 'vehicle-2.svg',
        position: 'is-grandeur',
    },
    {
        name: 'IONIQ 9',
        powertrain: 'CALLIGRAPHY AWD',
        color: 'IONOSPHERE GREEN PEARL',
        image: 'vehicle-3.svg',
        position: 'is-ioniq-9',
    },
    {
        name: 'IONIQ 5',
        powertrain: 'PRESTIGE 2WD',
        color: 'DIGITAL TEAL GREEN PEARL',
        image: 'vehicle-4.svg',
        position: 'is-ioniq-5',
    },
    {
        name: 'GV80',
        powertrain: '3.5T GASOLINE AWD',
        color: 'VEARING BLUE',
        image: 'vehicle-5.svg',
        position: 'is-gv80',
    },
    {
        name: 'ELANTRA',
        powertrain: '1ST GENERATION AVANTE',
        color: 'DARK RED',
        image: 'vehicle-6.svg',
        position: 'is-elantra',
    },
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
    const vehicleExhibitionSloganRef = useRef(null);
    const vehicleExhibitionSloganTitleRef = useRef(null);
    const vehicleExhibitionTitleSlotRef = useRef(null);
    const vehicleExhibitionTitleLayerRef = useRef(null);
    const vehicleExhibitionCardListRef = useRef(null);
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
            trigger.scroll(
                trigger.start + (trigger.end - trigger.start) * ((index + 0.5) / locations.length)
            );
            ScrollTrigger.update();
        }
    };
    useLayoutEffect(() => {
        if (previousLocationRef.current === selectedLocation) return undefined;
        previousLocationRef.current = selectedLocation;

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
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
        const transition = locationTransitionRef.current;
        if (!transition) return undefined;
        const navigationEntry = performance.getEntriesByType('navigation')[0];
        if (navigationEntry?.type === 'reload' && window.scrollY > 0) {
            window.scrollTo(0, 0);
        }
        const media = gsap.matchMedia();
        let refreshFrame;
        let disposed = false;
        const refreshScrollLayout = () => {
            cancelAnimationFrame(refreshFrame);
            refreshFrame = requestAnimationFrame(() => {
                if (!disposed && window.scrollY === 0) ScrollTrigger.refresh();
            });
        };
        media.add('(min-width: 901px) and (prefers-reduced-motion: no-preference)', () => {
            let typingSequence;
            let sloganPin;
            let isSloganTyping = false;
            let cleanupDriveInteraction;
            let cleanupExperienceWheel;
            let cleanupVehicleExhibitionTransition;
            let cleanupCurrentExhibition;
            const image = transition.querySelector('.renewal-location-transition__image');
            const intro = transition.querySelector('.renewal-intro');
            const locationSection = transition.querySelector('.renewal-location');
            const target = transition.querySelector('.renewal-location__detail img');
            // Reserve the later pin's space before the parent intro pin caches its height.
            gsap.set(transition, { '--location-scroll-distance': `${locations.length * 120}vh` });
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
                    onUpdate: (self) => {
                        const hasArrived = self.progress >= 0.999;
                        gsap.set(target, { autoAlpha: hasArrived ? 1 : 0 });
                        gsap.set(image, { autoAlpha: hasArrived ? 0 : 1 });
                    },
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
                end: () => `+=${locations.length * window.innerHeight}`,
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
                            isSloganTyping = false;
                            setHomeScrollLocked(false);
                            requestAnimationFrame(() => sloganPin?.scroll(sloganPin.end + 1));
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
                    anticipatePin: 1,
                    invalidateOnRefresh: true,
                    onEnter: () => {
                        if (isSloganTyping) return;
                        isSloganTyping = true;
                        setHomeScrollLocked(true);
                        typingSequence.restart();
                    },
                    onLeaveBack: () => {
                        isSloganTyping = false;
                        setHomeScrollLocked(false);
                        typingSequence.pause(0);
                        gsap.set(sloganText, { text: '' });
                        gsap.set(sloganCursor, { opacity: 0 });
                    },
                });
            }
            const driveSection = driveRef.current;
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
                let driveMotionDirection = -1;
                let previousTrackX = 0;
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
                const setDriveCopyVisibility = (index, shouldShow, motionDirection) => {
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
                            {
                                clipPath:
                                    motionDirection < 0
                                        ? 'inset(-4px 0% -4px 100%)'
                                        : 'inset(-4px 100% -4px 0%)',
                            },
                            {
                                clipPath: 'inset(-4px 0% -4px 0%)',
                                duration: 0.35,
                                ease: 'power1.out',
                            }
                        );
                        return;
                    }

                    gsap.to(targets, {
                        clipPath:
                            motionDirection < 0
                                ? 'inset(-4px 100% -4px 0%)'
                                : 'inset(-4px 0% -4px 100%)',
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
                    if (Math.abs(trackX - previousTrackX) > 0.1) {
                        driveMotionDirection = trackX < previousTrackX ? -1 : 1;
                    }
                    previousTrackX = trackX;
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
                        setDriveCopyVisibility(index, shouldShow, driveMotionDirection);
                    });
                };
                gsap.set(driveCopies.slice(1).flat(), {
                    autoAlpha: 0,
                    clipPath: 'inset(-4px 0% -4px 100%)',
                });
                gsap.set(driveCopies[0], {
                    autoAlpha: 1,
                    clipPath: 'inset(-4px 0% -4px 0%)',
                });
                const driveTimeline = gsap.timeline({
                    scrollTrigger: {
                        trigger: driveSection,
                        start: 'center center',
                        end: () => `+=${driveScrollDistance()}`,
                        pin: driveSection,
                        pinReparent: true,
                        anticipatePin: 1,
                        scrub: true,
                        invalidateOnRefresh: true,
                        onRefreshInit: measureDriveLayout,
                        onRefresh: updateDriveCopy,
                        onToggle: (self) => setHomeWheelDistanceRatio(self.isActive ? 0.8 : 1),
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
                updateDriveCopy();
                cleanupDriveInteraction = () => {
                    setHomeWheelDistanceRatio(1);
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
                    gsap.set(driveCopies.flat(), { clearProps: 'clipPath,opacity,visibility' });
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
                    const orderIndex = Math.floor(relativeRotation / 36) % experienceRing.length;
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
                    anticipatePin: 1,
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
            const vehicleExhibitionSlogan = vehicleExhibitionSloganRef.current;
            const vehicleExhibitionSloganTitle = vehicleExhibitionSloganTitleRef.current;
            const vehicleExhibitionTitleSlot = vehicleExhibitionTitleSlotRef.current;
            const vehicleExhibitionTitleLayer = vehicleExhibitionTitleLayerRef.current;
            const vehicleExhibitionCardList = vehicleExhibitionCardListRef.current;
            if (
                vehicleExhibitionSlogan &&
                vehicleExhibitionSloganTitle &&
                vehicleExhibitionTitleSlot &&
                vehicleExhibitionTitleLayer &&
                vehicleExhibitionCardList
            ) {
                const vehicleExhibitionSloganPin = ScrollTrigger.create({
                    trigger: vehicleExhibitionSlogan,
                    start: 'center center',
                    end: () => `+=${window.innerHeight * 0.6}`,
                    pin: vehicleExhibitionSlogan,
                    pinSpacing: true,
                    anticipatePin: 1,
                    invalidateOnRefresh: true,
                });
                const vehicleExhibitionTitleReveal = gsap.fromTo(
                    vehicleExhibitionSloganTitle,
                    { autoAlpha: 0, y: -35 },
                    {
                        autoAlpha: 1,
                        y: 0,
                        duration: 0.8,
                        ease: 'power2.out',
                        scrollTrigger: {
                            trigger: vehicleExhibitionSlogan,
                            start: () =>
                                vehicleExhibitionSloganPin.start + window.innerHeight * 0.3,
                            toggleActions: 'play none none reverse',
                            invalidateOnRefresh: true,
                        },
                    }
                );
                const titleLines = vehicleExhibitionSloganTitle.querySelectorAll('span');
                const clearTitleHandoffStyles = () => {
                    gsap.set(vehicleExhibitionSloganTitle, {
                        clearProps:
                            'position,top,left,width,margin,fontSize,lineHeight,textAlign,whiteSpace',
                    });
                    gsap.set(titleLines, { clearProps: 'x' });
                };
                const measureSourceTitle = () => {
                    const computedTitle = getComputedStyle(vehicleExhibitionSloganTitle);
                    const currentFontSize = parseFloat(computedTitle.fontSize) || 70;
                    const sourceFontSize = Math.max(
                        48,
                        Math.min(70, window.innerWidth * 0.0364583)
                    );
                    const scale = sourceFontSize / currentFontSize;
                    const measureLineText = (line) => {
                        const range = document.createRange();
                        range.selectNodeContents(line);
                        const width = range.getBoundingClientRect().width;
                        range.detach();
                        return width;
                    };
                    const firstLineWidth = measureLineText(titleLines[0]) * scale;
                    const secondLineWidth = measureLineText(titleLines[1]) * scale;
                    const width = Math.max(firstLineWidth, secondLineWidth);
                    const height = sourceFontSize * 1.2 * titleLines.length;

                    return {
                        fontSize: sourceFontSize,
                        left: (window.innerWidth - width) / 2,
                        lineHeight: 1.2,
                        secondLineOffset: (firstLineWidth - secondLineWidth) / 2,
                        top: (window.innerHeight - height) / 2,
                        width,
                    };
                };
                const measureTargetTitle = () => {
                    const cardListBounds = vehicleExhibitionCardList.getBoundingClientRect();
                    const slotBounds = vehicleExhibitionTitleSlot.getBoundingClientRect();

                    // Finish the handoff while the card list is still 30% below the
                    // viewport top. Once reparented, the title follows the section
                    // upward through that extra scroll space into its final slot.
                    return {
                        top:
                            slotBounds.top -
                            cardListBounds.top +
                            window.innerHeight * 0.3,
                        left: slotBounds.left,
                        width: slotBounds.width,
                    };
                };
                let sourceTitleMetrics = measureSourceTitle();
                let targetTitleMetrics = measureTargetTitle();
                const renderVehicleExhibitionTitleHandoff = (progress) => {
                    if (
                        vehicleExhibitionSloganTitle.parentElement ===
                            vehicleExhibitionTitleSlot &&
                        progress >= 0.995
                    ) {
                        return;
                    }
                    if (progress <= 0) {
                        if (
                            vehicleExhibitionSloganTitle.parentElement !== vehicleExhibitionSlogan
                        ) {
                            vehicleExhibitionSlogan.append(vehicleExhibitionSloganTitle);
                        }
                        clearTitleHandoffStyles();
                        sourceTitleMetrics = measureSourceTitle();
                        targetTitleMetrics = measureTargetTitle();
                        return;
                    }
                    if (progress >= 1) {
                        if (
                            vehicleExhibitionSloganTitle.parentElement !==
                            vehicleExhibitionTitleSlot
                        ) {
                            vehicleExhibitionTitleSlot.prepend(vehicleExhibitionSloganTitle);
                        }
                        clearTitleHandoffStyles();
                        return;
                    }

                    const source = sourceTitleMetrics;
                    const target = targetTitleMetrics;
                    const targetFontSize = Math.min(80, window.innerWidth * 0.0416667);
                    const easedProgress = progress * progress * (3 - 2 * progress);
                    const interpolate = (from, to) => from + (to - from) * easedProgress;

                    if (
                        vehicleExhibitionSloganTitle.parentElement !== vehicleExhibitionTitleLayer
                    ) {
                        vehicleExhibitionTitleLayer.append(vehicleExhibitionSloganTitle);
                    }
                    gsap.set(vehicleExhibitionSloganTitle, {
                        position: 'absolute',
                        top: interpolate(source.top, target.top),
                        left: interpolate(source.left, target.left),
                        width: interpolate(source.width, target.width),
                        margin: 0,
                        fontSize: interpolate(source.fontSize, targetFontSize),
                        lineHeight: interpolate(source.lineHeight, 1.1),
                        textAlign: 'left',
                        whiteSpace: 'nowrap',
                    });
                    gsap.set(titleLines[1], {
                        x: interpolate(source.secondLineOffset, 0),
                    });
                };
                const vehicleExhibitionTitleHandoff = ScrollTrigger.create({
                    trigger: vehicleExhibitionCardList,
                    start: () => vehicleExhibitionSloganPin.end,
                    end: 'top 30%',
                    scrub: 1,
                    onUpdate: ({ progress }) => renderVehicleExhibitionTitleHandoff(progress),
                    onRefresh: ({ progress }) => {
                        targetTitleMetrics = measureTargetTitle();
                        renderVehicleExhibitionTitleHandoff(progress);
                    },
                    invalidateOnRefresh: true,
                });
                const vehicleExhibitionSectionPin = ScrollTrigger.create({
                    trigger: vehicleExhibitionCardList,
                    start: 'top top',
                    end: () => `+=${window.innerHeight * 1.3}`,
                    pin: vehicleExhibitionCardList,
                    pinSpacing: true,
                    anticipatePin: 1,
                    invalidateOnRefresh: true,
                });
                const vehicleExhibitionDescription = vehicleExhibitionCardList.querySelector(
                    '.renewal-vehicle-exhibition-card-list__header p'
                );
                const vehicleExhibitionDescriptionReveal = vehicleExhibitionDescription
                    ? gsap.fromTo(
                          vehicleExhibitionDescription,
                          {
                              autoAlpha: 1,
                              maskImage:
                                  'linear-gradient(90deg, #000 0%, #000 45%, transparent 50%, transparent 100%)',
                              maskPosition: '100% 0',
                              maskSize: '240% 100%',
                              webkitMaskImage:
                                  'linear-gradient(90deg, #000 0%, #000 45%, transparent 50%, transparent 100%)',
                              webkitMaskPosition: '100% 0',
                              webkitMaskSize: '240% 100%',
                              willChange: 'mask-position',
                          },
                          {
                              maskPosition: '0% 0',
                              webkitMaskPosition: '0% 0',
                              duration: 1.2,
                              ease: 'power2.out',
                              scrollTrigger: {
                                  trigger: vehicleExhibitionCardList,
                                  start: () => vehicleExhibitionSectionPin.start,
                                  toggleActions: 'play none none reverse',
                                  invalidateOnRefresh: true,
                              },
                          }
                      )
                    : null;
                const vehicleExhibitionCards = gsap.utils.toArray(
                    '.renewal-vehicle-exhibition-card-list__item',
                    vehicleExhibitionCardList
                );
                const cardRevealTweens = vehicleExhibitionCards.map((card) => {
                    const cardImage = card.querySelector('img');

                    return gsap.fromTo(
                        card,
                        {
                            autoAlpha: 0,
                            clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
                        },
                        {
                            autoAlpha: 1,
                            clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
                            duration: 1,
                            ease: 'power2.out',
                            scrollTrigger: {
                                trigger: cardImage ?? card,
                                start: () =>
                                    Math.max(
                                        vehicleExhibitionSectionPin.end + 1,
                                        vehicleExhibitionSectionPin.end +
                                            card.offsetTop -
                                            window.innerHeight * 0.7
                                    ),
                                toggleActions: 'play none none reverse',
                                invalidateOnRefresh: true,
                            },
                        }
                    );
                });
                cleanupVehicleExhibitionTransition = () => {
                    vehicleExhibitionDescriptionReveal?.kill();
                    if (vehicleExhibitionDescription) {
                        gsap.set(vehicleExhibitionDescription, {
                            clearProps:
                                'opacity,visibility,maskImage,maskPosition,maskSize,webkitMaskImage,webkitMaskPosition,webkitMaskSize,willChange',
                        });
                    }
                    cardRevealTweens.forEach((tween) => tween.kill());
                    gsap.set(vehicleExhibitionCards, {
                        clearProps: 'opacity,visibility,clipPath',
                    });
                    vehicleExhibitionSectionPin.kill();
                    vehicleExhibitionTitleHandoff.kill();
                    vehicleExhibitionTitleReveal.kill();
                    if (vehicleExhibitionSloganTitle.parentElement !== vehicleExhibitionSlogan) {
                        vehicleExhibitionSlogan.append(vehicleExhibitionSloganTitle);
                    }
                    gsap.set(vehicleExhibitionSloganTitle, { clearProps: 'all' });
                    gsap.set(titleLines, { clearProps: 'all' });
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
                const animationScrollViewports = 7.5;
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
                        anticipatePin: 1,
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
                isSloganTyping = false;
                setHomeScrollLocked(false);
                sloganPin?.kill();
                sloganPin = null;
                typingSequence?.kill();
                cleanupDriveInteraction?.();
                cleanupExperienceWheel?.();
                cleanupVehicleExhibitionTransition?.();
                cleanupCurrentExhibition?.();
                locationScrollRef.current = null;
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
    useLayoutEffect(() => setupHomeScrollSmoothing(), []);

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
                            src={locationDetail.image ?? location.image}
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
            <section className="renewal-drive" ref={driveRef} aria-label="시승 프로그램">
                <div className="renewal-drive__track">
                    {driveModels.map((item) => (
                        <article
                            className={`renewal-drive__slide ${item.shadowClass ?? ''}`}
                            key={item.name}
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
                                <p>{item.copy}</p>
                            </div>
                        </article>
                    ))}
                </div>
            </section>
            <section
                className="renewal-experience"
                ref={experienceRef}
                aria-label="휠로 탐색하는 차량 전시"
            >
                <div className="renewal-experience__previews" aria-hidden="true">
                    {experienceRing.map((item) => (
                        <img
                            data-experience-preview
                            key={`${item.image}-${item.preview}`}
                            src={asset(item.preview)}
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
            <div className="renewal-vehicle-exhibition-slogan-entry">
                <section
                    className="renewal-vehicle-exhibition-slogan"
                    ref={vehicleExhibitionSloganRef}
                >
                    <h2
                        className="renewal-vehicle-exhibition-shared-title"
                        ref={vehicleExhibitionSloganTitleRef}
                    >
                        <span>HYUNDAI MOTORSTUDIO</span>
                        <span>VEHICLE EXHIBITION</span>
                    </h2>
                </section>
            </div>
            <div
                className="renewal-vehicle-exhibition-title-handoff-layer"
                ref={vehicleExhibitionTitleLayerRef}
            />
            <section
                className="renewal-vehicle-exhibition-card-list"
                ref={vehicleExhibitionCardListRef}
            >
                <header className="renewal-vehicle-exhibition-card-list__header">
                    <div
                        className="renewal-vehicle-exhibition-card-list__title-slot"
                        ref={vehicleExhibitionTitleSlotRef}
                    >
                        <h2 className="renewal-vehicle-exhibition-card-list__mobile-title">
                            <span>HYUNDAI MOTORSTUDIO</span>
                            <span>VEHICLE EXHIBITION</span>
                        </h2>
                    </div>
                    <p>
                        직접 달리며 만나는 현대자동차의 새로운 가능성 보고, 듣고, 느끼는 것에서 한 걸음
                        <br />
                        더 나아가 현대자동차의 다양한 모델의 감각과 기술을 경험해보세요.
                    </p>
                </header>
                <div className="renewal-vehicle-exhibition-card-list__items">
                    {exhibitionVehicles.map(({ name, powertrain, color, image, position }) => (
                        <article
                            className={`renewal-vehicle-exhibition-card-list__item ${position}`}
                            key={name}
                        >
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
