import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { locations } from '../../common/data/content';
import { paths } from '../../common/router/routePaths';
import { HomeHero, HomeStories, VisitorGuide } from '../../components/home/HomeSections';
import './HomeContent.css';

const asset = (name) => `/images/home-renewal/${name}`;
const driveModels = [
    {
        name: 'GV80',
        image: asset('drive-gv80.png'),
        title: '아웃도어 라이프_데이트립 드라이브',
        copy: '넉넉한 시간과 자유로운 코스로 차량의 주행감과 편의성을 경험해보세요.\n일상 속에서 차량의 매력을 더욱 깊이 느낄 수 있습니다.',
    },
    {
        name: 'IONIQ5N',
        image: asset('drive-ioniq5n.png'),
        title: '하이 퍼포먼스 드라이브_언택트',
        copy: 'N 브랜드의 강렬한 퍼포먼스와 고성능 감성을 직접 경험해보세요.\n공공도로 주행을 통해 역동적인 드라이빙의 즐거움을 느낄 수 있습니다.',
    },
    {
        name: 'CASPER',
        image: asset('drive-casper.png'),
        title: '베이직 드라이브',
        copy: '자동차 전문가 Guru의 친절한 설명과 함께 다양한 현대자동차를 직접 시승해보세요.\n차량의 특징과 주행 감각을 보다 쉽고 깊이 있게 경험할 수 있습니다.',
    },
    {
        name: 'G90',
        image: asset('drive-g90.png'),
        title: '아웃도어 라이프_데이트립 드라이브',
        copy: '자동차 전문가 Guru의 설명과 함께 현대자동차의 다양한 차량을 시승해보세요.\n차량의 특징과 주행 감각을 보다 쉽고 편안하게 경험할 수 있습니다.',
    },
];
const exhibitionVehicles = [
    ['AVANTE N', 'GASOLINE 2.0 TURBO', 'PERFORMANCE BLUE'],
    ['THE NEW GRANDEUR', '3.5 GASOLINE CALLIGRAPHY', 'ABYSS BLACK PEARL'],
    ['IONIQ 9', 'CALLIGRAPHY AWD', 'IONOSPHERE GREEN PEARL'],
    ['IONIQ 5', 'PRESTIGE 2WD', 'DIGITAL TEAL GREEN PEARL'],
    ['GV80', '3.5T GASOLINE AWD', 'VEARING BLUE'],
    ['ELANTRA', '1ST GENERATION AVANTE', 'DARK RED'],
];
const stories = [
    {
        title: 'SEOUL, REBORN FOR CAR CULTURE',
        place: '현대 모터스튜디오 서울',
        copy: '자동차 마니아들의 놀이터로 새롭게 돌아온 현대 모터스튜디오 서울. 자동차 문화와 취향을 공유하는 새로운 공간을 만나보세요.',
        image: 'story-seoul.svg',
        to: paths.location('seoul'),
    },
    {
        title: 'A NEW EXPERIENCE IN HANAM',
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
    goyang: {
        tagline: '가족과 함께 즐기는 짜릿한 모빌리티 탐험.',
        description:
            '몰입감 넘치는 자동차 전시와 테마 시승을 통해 자동차가 만들어지는 과정을 직접 보고 듣고 만지며, N 브랜드와 4D Ride 등 다양한 콘텐츠를 체험할 수 있습니다. 아이들에게는 상상력을, 어른들에게는 색다른 경험을 제공합니다.',
    },
};

export default function HomeContent() {
    const [selectedLocation, setSelectedLocation] = useState(0);
    const [selectedDrive, setSelectedDrive] = useState(0);
    const locationTransitionRef = useRef(null);
    const location = locations[selectedLocation];
    const locationDetail = locationDetails[location.slug] ?? location;
    const drive = driveModels[selectedDrive];

    useEffect(() => {
        const transition = locationTransitionRef.current;
        if (
            !transition ||
            window.matchMedia('(max-width: 900px), (prefers-reduced-motion: reduce)').matches
        )
            return undefined;
        let frame = 0;
        const update = () => {
            frame = 0;
            const rect = transition.getBoundingClientRect();
            const introHeight = transition.querySelector('.renewal-intro')?.offsetHeight ?? 1000;
            const width = transition.clientWidth || window.innerWidth;
            const holdDistance = window.innerHeight * 0.1;
            const scrollOffset = Math.min(introHeight + holdDistance, Math.max(0, -rect.top));
            const progress = Math.min(1, Math.max(0, (scrollOffset - holdDistance) / introHeight));
            const eased = progress * progress * (3 - 2 * progress);
            const mix = (from, to) => from + (to - from) * eased;
            const targetWidth = width * (580 / 1920);
            const targetHeight = targetWidth * (320 / 580);
            const imageTop =
                scrollOffset <= holdDistance
                    ? scrollOffset
                    : mix(holdDistance, introHeight + holdDistance + 243);
            transition.style.setProperty('--intro-hold-distance', `${holdDistance}px`);
            transition.style.setProperty('--transition-x', `${mix(0, width * (1178 / 1920))}px`);
            transition.style.setProperty('--transition-y', `${imageTop}px`);
            transition.style.setProperty('--transition-width', `${mix(width, targetWidth)}px`);
            transition.style.setProperty(
                '--transition-height',
                `${mix(introHeight, targetHeight)}px`
            );
            transition.style.setProperty(
                '--intro-copy-opacity',
                String(1 - Math.min(1, progress / 0.38))
            );
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
                                onClick={() => setSelectedLocation(index)}
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
                            src={location.image}
                            alt={`${location.name} 공간`}
                        />
                        <div>
                            <strong>{locationDetail.tagline}</strong>
                            <p>{locationDetail.description}</p>
                        </div>
                    </Link>
                </section>
            </div>
            <section className="renewal-slogan" aria-label="브랜드 슬로건">
                <p>
                    WHAT YOU FIND
                    <br />
                    WHEN MOTION
                    <br />
                    MEETS
                </p>
                <strong>EXPERIENCE</strong>
            </section>
            <section className="renewal-drive">
                <div className="renewal-drive__tabs">
                    {driveModels.map((item, index) => (
                        <button
                            key={item.name}
                            type="button"
                            className={selectedDrive === index ? 'is-active' : ''}
                            onClick={() => setSelectedDrive(index)}
                        >
                            {item.name}
                        </button>
                    ))}
                </div>
                <h2>{drive.name}</h2>
                <img src={drive.image} alt={`${drive.name} 시승 차량`} />
                <div>
                    <h3>{drive.title}</h3>
                    <p>{drive.copy}</p>
                    <Link to={paths.reservations}>시승 예약하기</Link>
                </div>
            </section>
            <section className="renewal-experience" aria-label="차량 전시 경험">
                <img src={asset('vehicle-exhibition.png')} alt="IONIQ 5 N 차량 전시" />
                <div aria-hidden="true" />
                <p>IONIQ5N</p>
            </section>
            <section className="renewal-vehicle-title">
                <h2>
                    HYUNDAI MOTORSTUDIO
                    <br />
                    VEHICLE EXHIBITION
                </h2>
            </section>
            <section className="renewal-vehicles">
                <header>
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
                <div className="renewal-vehicles__grid">
                    {exhibitionVehicles.map(([name, powertrain, color], index) => (
                        <article key={name}>
                            <img src={asset(`vehicle-${index + 1}.svg`)} alt={name} />
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
            <section className="renewal-current">
                <h2>CURRENT</h2>
                <p>
                    DISCOVER OUR
                    <br />
                    CURRENT EXHIBITIONS
                </p>
                <h2>EXHIBITION</h2>
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
                <i />
            </section>
            <HomeStories stories={stories} />
            <VisitorGuide links={guideLinks} />
        </main>
    );
}
