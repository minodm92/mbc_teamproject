import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ChevronRight } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { paths } from '../../common/router/routePaths';
import membershipHeroImage from '../../assets/images/membership/membership-hero.png';
import categoryJoinImage from '../../assets/images/membership/category-join.png';
import categoryBenefitsImage from '../../assets/images/membership/category-benefits.png';
import categoryLocationsImage from '../../assets/images/membership/category-locations.png';
import './MembershipPage.css';

/*
 * 멤버십 페이지 — 제네시스 멤버십 소개 페이지 구조(탭 → 혜택 카테고리 → 가입 대상 표 → 가입 방법)를
 * 따르고, 타이포·여백·탭·리스트 행·배지는 공지사항(NoticesPage.css)과 뉴스룸(NewsroomPage.css) 값을 그대로 쓴다.
 */

const membershipTabs = [
    ['intro', '멤버십 안내'],
    ['benefits', '혜택 안내'],
    ['locations', '이용·라운지 안내'],
];
// 탭별 히어로 제목·사진 (feature/motorstudio-mobile.v2 708ab11과 동일한 동작)
const membershipHeroByTab = {
    intro: ['MEMBERSHIP', membershipHeroImage],
    benefits: ['혜택 안내', categoryBenefitsImage],
    locations: ['이용·라운지 안내', categoryLocationsImage],
};

const categories = [
    [
        'join',
        '가입 안내',
        categoryJoinImage,
        '멤버십 가입 대상과 방법, Basic·Plus 회원 유형을 확인해 보세요.',
    ],
    [
        'benefits',
        '혜택 안내',
        categoryBenefitsImage,
        '주차권부터 특별한 프로그램까지, HMS Club의 다양한 혜택을 만나보세요.',
    ],
    [
        'locations',
        '이용·라운지 안내',
        categoryLocationsImage,
        '현대 모터스튜디오의 각 거점과 라운지에서 즐길 수 있는 경험을 확인해 보세요.',
    ],
];

const membershipTypes = [
    ['Basic', 'HMS Club 가입 고객', '별도의 조건 없이 누구나 가입 가능'],
    [
        'Plus',
        '현대자동차 또는 제네시스 신차 구매 고객',
        '렌트·리스, 일반 개인, 법인 임직원 실운행자 포함',
    ],
];

const joinNotes = [
    '기존 현대 모터스튜디오 회원은 로그인 후 약관 동의를 통해 HMS Club 멤버십으로 전환됩니다.',
    '가입 시 본인 인증이 필요합니다.',
    '렌트·리스 고객은 계약 기간 12개월 이상이며 실운행자 명의로 가입 시 Plus가 적용됩니다.',
    'Basic 회원이 현대·제네시스 차량을 구매하면 차량 등록 익일부터 Plus 혜택이 제공됩니다. 시스템 반영 일정에 따라 지연될 수 있습니다.',
];

const joinMethods = [
    [
        'WEB',
        '모바일 / PC',
        [
            '현대 모터스튜디오 홈페이지에 접속한 뒤 오른쪽 위의 프로필 아이콘을 누릅니다.',
            '프로필에서 ‘멤버십 가입’을 선택합니다.',
            'HMS Club 가입 절차를 진행합니다.',
        ],
    ],
    [
        'APP',
        '마이현대',
        [
            '마이현대 앱에서 현대자동차 통합 계정으로 로그인합니다. 계정이 없다면 먼저 계정을 만들어 주세요.',
            '서비스 바로가기에서 ‘현대 모터스튜디오’를 선택합니다.',
            'HMS Club 가입 약관에 동의합니다.',
        ],
    ],
];

const benefits = [
    [
        '웰컴 패키지',
        '해비치 커피 쿠폰 1매와 1시간 주차권 2매, 상설전시 30% 할인권 2매와 CX프로그램 10% 할인권 2매를 제공합니다.',
    ],
    ['주차 서비스', '현대 모터스튜디오 고양·서울에서 사용할 수 있는 1시간 주차권을 분기별 1매 제공합니다.'],
    [
        '멤버십 라운지 이용',
        '서울·부산의 HMS Club Lounge를 이용할 수 있습니다. 동반 2인을 포함하여 최대 3시간 이용이 가능합니다.',
    ],
];
const plusBenefits = [
    [
        '플러스 패키지',
        '분기 1회, 1시간 주차권 1매와 상설전시 통합권 30% 할인권 1매, CX프로그램 10% 할인권 1매를 제공합니다.',
    ],
    [
        '생일 쿠폰',
        '브랜드샵 또는 F&B 30% 할인 쿠폰 1매를 제공합니다. 최대 할인 금액은 5만원이며, 원하는 곳에서 1회 사용 후 소멸됩니다.',
    ],
    ['Plus 회원 전용 프로그램', '시즌별 이벤트 및 프로모션에 초청합니다.'],
];

const locations = [
    [
        'SEOUL',
        ['멤버십 라운지', '라운지 및 코워킹 스페이스'],
        ['CX프로그램', '키즈 워크샵, 마스터 토크'],
        ['시승', '베이직 및 테마 드라이브'],
    ],
    [
        'GOYANG',
        ['상설전시 (유료)', '일반 전시 체험 / 가이드 투어'],
        ['CX프로그램', '키즈 워크샵, 원데이 클래스'],
        ['시승', '베이직 및 테마 드라이브'],
    ],
    [
        'BUSAN',
        ['상설전시 (무료)', '일반 전시 체험 / 가이드 투어'],
        ['CX프로그램', '키즈 워크샵'],
        ['멤버십 라운지', '라운지 및 게임존'],
    ],
    ['HANAM', ['시승', '베이직 및 테마 드라이브']],
];
const lounges = {
    seoul: {
        label: '서울',
        title: 'HMS Club Lounge (서울)',
        description:
            '편안하게 머물며 새로운 영감을 나누는 멤버십 공간입니다. 라운지 및 코워킹 스페이스를 이용할 수 있습니다.',
        rules: [
            'HMS Club 회원을 위한 라운지입니다.',
            '동반 2인을 포함하여 최대 3시간 이용이 가능합니다.',
            '방문 전 현장 운영 상황과 이용 가능 여부를 확인해 주세요.',
        ],
    },
    busan: {
        label: '부산',
        title: 'HMS Club Lounge (부산 1층)',
        description:
            '현대자동차와 협업한 게임 콘텐츠를 경험할 수 있는 체험형 라운지입니다. 멤버십 회원을 대상으로 다채로운 레이싱 게임과 가챠·벤딩 머신, 그리고 락커룸 서비스를 제공합니다.',
        rules: [
            '동반인을 포함하여 최대 3인까지 입장 가능합니다. 초등학교 저학년 이하 어린이는 반드시 보호자와 동반해 주세요.',
            '게임 이용 시간은 최대 20분이며, 대기자가 없을 경우 시간제한 없이 이용할 수 있습니다.',
            '별도 예약 없이 셀프 체크인 후 입장할 수 있습니다. 홈페이지 로그인 후 마이 페이지의 My QR을 출입구 리더기에 스캔해 주세요.',
            '락커룸은 3시간 단위로 이용 가능합니다. 출입구에서 직원의 안내를 받은 후 이용해 주세요.',
            '별도 휴게 공간은 4층에 마련되어 있습니다. 이용을 원하시면 2층 안내 데스크로 문의해 주세요.',
        ],
    },
};

function SectionHeading({ id, title, description }) {
    return (
        <header className="membership-heading">
            <h2 id={id}>{title}</h2>
            {description && <p>{description}</p>}
        </header>
    );
}

export default function MembershipPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const tabParam = searchParams.get('tab');
    // 예전 '가입 안내' 탭 링크(?tab=join)는 멤버십 안내 탭의 가입 안내 섹션으로 보낸다.
    const activeTab = membershipTabs.some(([id]) => id === tabParam) ? tabParam : 'intro';
    const currentTabLabel = membershipTabs.find(([id]) => id === activeTab)[1];
    const [heroTitle, heroImage] = membershipHeroByTab[activeTab] || membershipHeroByTab.intro;
    const [activeLounge, setActiveLounge] = useState('seoul');
    const tabsRef = useRef(null);
    const joinRef = useRef(null);
    const previousTab = useRef(null);

    const scrollBehavior = () =>
        window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth';

    useEffect(() => {
        if (tabParam === 'join') {
            joinRef.current?.scrollIntoView({ block: 'start', behavior: scrollBehavior() });
        } else if (previousTab.current !== null && previousTab.current !== activeTab) {
            tabsRef.current?.scrollIntoView({ block: 'start', behavior: scrollBehavior() });
        }
        previousTab.current = activeTab;
    }, [activeTab, tabParam]);

    function setActiveTab(id) {
        setSearchParams(id === 'intro' ? {} : { tab: id });
    }

    function handleTabKeyDown(event, index) {
        let nextIndex;
        if (event.key === 'ArrowRight') nextIndex = (index + 1) % membershipTabs.length;
        else if (event.key === 'ArrowLeft') nextIndex = (index - 1 + membershipTabs.length) % membershipTabs.length;
        else if (event.key === 'Home') nextIndex = 0;
        else if (event.key === 'End') nextIndex = membershipTabs.length - 1;
        else return;
        event.preventDefault();
        setActiveTab(membershipTabs[nextIndex][0]);
        event.currentTarget.parentElement.children[nextIndex].focus();
    }

    function openCategory(target) {
        if (target === 'join') {
            if (activeTab === 'intro') joinRef.current?.scrollIntoView({ block: 'start', behavior: scrollBehavior() });
            else setSearchParams({ tab: 'join' });
            return;
        }
        setActiveTab(target);
    }

    return (
        <main className="membership-page">
            <section
                className="membership-hero"
                aria-labelledby="membership-title"
                data-header-theme="dark"
                style={{ '--membership-hero-image': `url("${heroImage}")` }}
            >
                <nav className="membership-hero__breadcrumb" aria-label="현재 위치">
                    <Link to={paths.home}>HOME</Link>
                    <span aria-hidden="true">/</span>
                    <span>안내</span>
                    <span aria-hidden="true">/</span>
                    {activeTab === 'intro' ? (
                        <span aria-current="page">멤버십</span>
                    ) : (
                        <>
                            <Link to={paths.membership}>멤버십</Link>
                            <span aria-hidden="true">/</span>
                            <span aria-current="page">{currentTabLabel}</span>
                        </>
                    )}
                </nav>
                <h1 id="membership-title">{heroTitle}</h1>
                <p className="membership-hero__intro">
                    공간과 모빌리티, 문화를 더 가까이
                    <br />
                    HMS Club 멤버십 혜택을 확인해보세요.
                </p>
            </section>

            <div className="membership-tabs" ref={tabsRef} role="tablist" aria-label="멤버십 안내">
                {membershipTabs.map(([id, label], index) => (
                    <button
                        key={id}
                        type="button"
                        role="tab"
                        id={`membership-tab-${id}`}
                        aria-selected={activeTab === id}
                        aria-controls={`membership-panel-${id}`}
                        tabIndex={activeTab === id ? 0 : -1}
                        onClick={() => setActiveTab(id)}
                        onKeyDown={(event) => handleTabKeyDown(event, index)}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {/* ===== 멤버십 안내: 혜택 카테고리 + 가입 안내 (제네시스 '멤버십 안내' 탭 구조) ===== */}
            <div
                hidden={activeTab !== 'intro'}
                role="tabpanel"
                id="membership-panel-intro"
                aria-labelledby="membership-tab-intro"
                className="membership-panel"
            >
                <section className="membership-section" aria-labelledby="membership-category-title">
                    <SectionHeading
                        id="membership-category-title"
                        title="HMS CLUB CATEGORY"
                        description="HMS Club은 현대 모터스튜디오의 전용 멤버십 프로그램입니다."
                    />
                    <div className="membership-category">
                        {categories.map(([target, title, image, description]) => (
                            <article key={target} className="membership-category__item">
                                <img src={image} alt="" className="membership-category__image" />
                                <h3>{title}</h3>
                                <p>{description}</p>
                                <button type="button" onClick={() => openCategory(target)}>
                                    바로가기 <ChevronRight aria-hidden="true" />
                                </button>
                            </article>
                        ))}
                    </div>
                </section>

                <section
                    className="membership-section membership-join"
                    ref={joinRef}
                    aria-labelledby="membership-join-title"
                >
                    <SectionHeading
                        id="membership-join-title"
                        title="HOW TO JOIN"
                        description="가입 안내"
                    />

                    <div className="membership-block">
                        <h3>가입 대상</h3>
                        <p className="membership-block__lead">
                            국내에서 본인 인증이 가능한 고객이라면 누구나 HMS Club에 가입할 수 있습니다.
                        </p>
                        <table className="membership-table">
                            <caption className="membership-sr-only">회원 유형별 가입 조건</caption>
                            <thead>
                                <tr>
                                    <th scope="col">회원 유형</th>
                                    <th scope="col">가입 조건</th>
                                </tr>
                            </thead>
                            <tbody>
                                {membershipTypes.map(([grade, description, note]) => (
                                    <tr key={grade}>
                                        <th scope="row">
                                            <span
                                                className={`membership-badge${grade === 'Plus' ? ' membership-badge--fill' : ''}`}
                                            >
                                                {grade}
                                            </span>
                                        </th>
                                        <td>
                                            <strong>{description}</strong>
                                            <span className="membership-table__note">{note}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <ul className="membership-notes">
                            {joinNotes.map((note) => (
                                <li key={note}>{note}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="membership-block">
                        <h3>가입 방법</h3>
                        <div className="membership-methods">
                            {joinMethods.map(([name, channel, steps], index) => (
                                <article key={name}>
                                    <header>
                                        <span>{String(index + 1).padStart(2, '0')}</span>
                                        <h4>{name}</h4>
                                        <p>{channel}</p>
                                    </header>
                                    <ol>
                                        {steps.map((step, stepIndex) => (
                                            <li key={step}>
                                                <span aria-hidden="true">{stepIndex + 1}</span>
                                                {step}
                                            </li>
                                        ))}
                                    </ol>
                                </article>
                            ))}
                        </div>
                        <Link className="membership-cta" to={paths.signup}>
                            HMS Club 가입하기 <ArrowUpRight aria-hidden="true" />
                        </Link>
                    </div>
                </section>
            </div>

            {/* ===== 혜택 안내: 공지사항 리스트 행 + 배지 재사용 ===== */}
            <div
                hidden={activeTab !== 'benefits'}
                role="tabpanel"
                id="membership-panel-benefits"
                aria-labelledby="membership-tab-benefits"
                className="membership-panel"
            >
                <section className="membership-section" aria-labelledby="membership-benefits-title">
                    <SectionHeading
                        id="membership-benefits-title"
                        title="MEMBERSHIP BENEFITS"
                        description="일상 가까이에서 현대 모터스튜디오를 경험할 수 있도록 HMS Club만의 혜택을 준비했습니다."
                    />
                    <div className="membership-block">
                        <h3>공통 혜택</h3>
                        <p className="membership-block__lead">HMS Club 가입 시 모든 멤버십 회원에게 제공되는 혜택입니다.</p>
                        <ol className="membership-rows">
                            {benefits.map(([title, description], index) => (
                                <li key={title} className="membership-row">
                                    <span className="membership-row__number">{String(index + 1).padStart(2, '0')}</span>
                                    <span className="membership-badge membership-badge--fill">전체</span>
                                    <strong className="membership-row__title">{title}</strong>
                                    <p className="membership-row__text">{description}</p>
                                </li>
                            ))}
                        </ol>
                        <ul className="membership-notes">
                            <li>웰컴 패키지는 가입 시 선택한 항목에 추가 동의한 고객에게 최초 가입 1회에 한하여 제공됩니다.</li>
                        </ul>
                    </div>
                    <div className="membership-block">
                        <h3>추가 혜택</h3>
                        <p className="membership-block__lead">Plus 멤버십 회원에게 더욱 특별한 혜택을 제공합니다.</p>
                        <ol className="membership-rows">
                            {plusBenefits.map(([title, description], index) => (
                                <li key={title} className="membership-row">
                                    <span className="membership-row__number">{String(index + 1).padStart(2, '0')}</span>
                                    <span className="membership-badge membership-badge--fill">Plus</span>
                                    <strong className="membership-row__title">{title}</strong>
                                    <p className="membership-row__text">{description}</p>
                                </li>
                            ))}
                        </ol>
                    </div>
                </section>
            </div>

            {/* ===== 이용·라운지 안내 ===== */}
            <div
                hidden={activeTab !== 'locations'}
                role="tabpanel"
                id="membership-panel-locations"
                aria-labelledby="membership-tab-locations"
                className="membership-panel"
            >
                <section className="membership-section" aria-labelledby="membership-locations-title">
                    <SectionHeading
                        id="membership-locations-title"
                        title="USE YOUR MEMBERSHIP"
                        description="HMS Club 회원은 현대 모터스튜디오 거점별 프로그램과 라운지를 이용할 수 있습니다."
                    />
                    <div className="membership-block">
                        <p className="membership-block__lead membership-block__lead--first">
                            차량 전시, 미디어 월 등 거점별 무료 전시는 HMS Club 회원이 아니어도 누구나 이용할 수 있습니다.
                        </p>
                        <div className="membership-locations">
                            {locations.map(([name, ...services]) => (
                                <article key={name}>
                                    <h4>{name}</h4>
                                    <ul>
                                        {services.map(([title, description]) => (
                                            <li key={title}>
                                                <strong>{title}</strong>
                                                <p>{description}</p>
                                            </li>
                                        ))}
                                    </ul>
                                </article>
                            ))}
                        </div>
                    </div>
                    <div className="membership-block">
                        <h3>멤버십 라운지</h3>
                        <div className="membership-lounge-switch" role="group" aria-label="라운지 지역 선택">
                            {Object.entries(lounges).map(([id, lounge]) => (
                                <button
                                    key={id}
                                    type="button"
                                    aria-pressed={activeLounge === id}
                                    aria-controls="membership-lounge-detail"
                                    onClick={() => setActiveLounge(id)}
                                >
                                    {lounge.label}
                                </button>
                            ))}
                        </div>
                        <div id="membership-lounge-detail" className="membership-lounge">
                            <h4>{lounges[activeLounge].title}</h4>
                            <p>{lounges[activeLounge].description}</p>
                            <ul className="membership-notes membership-notes--dark">
                                {lounges[activeLounge].rules.map((rule) => (
                                    <li key={rule}>{rule}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}
