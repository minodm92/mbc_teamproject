import { useState } from 'react';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { paths } from '../../common/router/routePaths';
import membershipHeroImage from './assets/membership-hero.png';
import membershipBenefitsImage from './assets/membership-benefits.png';
import membershipJoinImage from './assets/membership-join.png';
import membershipLocationsImage from './assets/membership-locations.png';
import './MembershipPage.css';

const membershipTypes = [
    ['Basic', 'HMS Club 가입 고객', '별도의 조건 없이 누구나 가입 가능'],
    [
        'Plus',
        '현대자동차 또는 제네시스 신차 구매 고객',
        '렌트·리스, 일반 개인, 법인 임직원 실운행자 포함',
    ],
];

const benefits = [
    [
        '01',
        '웰컴 패키지',
        '해비치 커피 쿠폰 1매와 1시간 주차권 2매, 상설전시 30% 할인권 2매와 CX프로그램 10% 할인권 2매를 제공합니다.',
    ],
    [
        '02',
        '주차 서비스',
        '현대 모터스튜디오 고양·서울에서 사용할 수 있는 1시간 주차권을 분기별 1매 제공합니다.',
    ],
    [
        '03',
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
const membershipTabs = [
    ['intro', '멤버십 안내'],
    ['join', '가입 안내'],
    ['benefits', '혜택 안내'],
    ['locations', '이용·라운지 안내'],
];

export default function MembershipPage() {
    const [activeTab, setActiveTab] = useState('intro');
    const [activeLounge, setActiveLounge] = useState('seoul');

    function handleTabKeyDown(event, index) {
        let nextIndex;
        if (event.key === 'ArrowRight') nextIndex = (index + 1) % membershipTabs.length;
        else if (event.key === 'ArrowLeft')
            nextIndex = (index - 1 + membershipTabs.length) % membershipTabs.length;
        else if (event.key === 'Home') nextIndex = 0;
        else if (event.key === 'End') nextIndex = membershipTabs.length - 1;
        else return;
        event.preventDefault();
        setActiveTab(membershipTabs[nextIndex][0]);
        event.currentTarget.parentElement.children[nextIndex].focus();
    }
    return (
        <main className="membership-page membership-page--tabs">
            <section
                className="membership-hero"
                aria-labelledby="membership-title"
                style={{ backgroundImage: `linear-gradient(90deg, rgba(0,0,0,.68), rgba(0,0,0,.12)), url("${membershipHeroImage}")` }}
            >
                <div className="membership-hero__copy">
                    <p>HYUNDAI MOTORSTUDIO MEMBERSHIP</p>
                    <h1 id="membership-title">멤버십 소개</h1>
                    <p className="membership-hero__intro">
                        더 깊은 경험과 새로운 영감이 시작되는
                        <br />
                        현대 모터스튜디오 전용 멤버십
                    </p>
                </div>
                <span className="membership-hero__index" aria-hidden="true">
                    01
                </span>
            </section>

            <div className="membership-breadcrumb" aria-label="현재 위치">
                <Link to={paths.home}>홈</Link>
                <span aria-hidden="true">›</span>
                <span>멤버십 소개</span>
                <span aria-hidden="true">›</span>
                <span>{membershipTabs.find(([id]) => id === activeTab)[1]}</span>
            </div>
            <div className="membership-content">
                <div
                    className="membership-nav"
                    id="membership-tabs"
                    role="tablist"
                    aria-label="멤버십 안내"
                >
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

                <section
                    hidden={activeTab !== 'intro'}
                    role="tabpanel"
                    tabIndex={0}
                    id="membership-panel-intro"
                    aria-labelledby="membership-tab-intro"
                    className="membership-intro"
                >
                    <p className="membership-eyebrow">WELCOME TO HMS CLUB</p>
                    <h2 id="membership-intro-title">HMS Club 멤버십 혜택 카테고리</h2>
                    <div className="membership-category-grid">
                        {[
                            [
                                '혜택 안내',
                                membershipBenefitsImage,
                                '주차권부터 특별한 프로그램까지, HMS Club의 다양한 혜택을 만나보세요.',
                                'benefits',
                            ],
                            [
                                '가입 안내',
                                membershipJoinImage,
                                '멤버십 가입 대상과 방법, Basic·Plus 회원 유형을 확인해 보세요.',
                                'join',
                            ],
                            [
                                '이용 안내',
                                membershipLocationsImage,
                                '현대 모터스튜디오의 각 거점에서 즐길 수 있는 경험을 확인해 보세요.',
                                'locations',
                            ],
                        ].map(([title, image, description, target]) => (
                            <article key={target}>
                                <img src={image} alt="" loading="lazy" />
                                <h3>{title}</h3>
                                <p>{description}</p>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setActiveTab(target);
                                        document
                                            .getElementById(`membership-tab-${target}`)
                                            ?.focus();
                                    }}
                                >
                                    {title} 바로가기 <ArrowUpRight aria-hidden="true" />
                                </button>
                            </article>
                        ))}
                    </div>
                    <div className="membership-intro__copy">
                        <p>
                            HMS Club은 현대 모터스튜디오의 전용 멤버십 프로그램입니다. 현대
                            모터스튜디오를 더 깊이 경험하고 싶다면, HMS Club 멤버가 되어보세요.
                        </p>
                        <p>
                            새로운 소식을 가장 먼저 접하고, 큐레이션된 콘텐츠와 전용 혜택을
                            우선적으로 만나볼 수 있습니다.
                        </p>
                    </div>
                </section>

                <section
                    hidden={activeTab !== 'join'}
                    role="tabpanel"
                    tabIndex={0}
                    id="membership-panel-join"
                    aria-labelledby="membership-tab-join"
                    className="membership-join"
                >
                    <header className="membership-section-heading">
                        <p>HOW TO JOIN</p>
                        <h2 id="membership-join-title">가입 안내</h2>
                    </header>
                    <div className="membership-join__audience">
                        <h3>가입 대상</h3>
                        <p>
                            국내에서 본인 인증이 가능한 고객이라면 누구나 HMS Club에 가입할 수
                            있습니다.
                        </p>
                        <small>
                            기존 현대 모터스튜디오 회원은 로그인 후 약관 동의를 통해 HMS Club
                            멤버십으로 전환됩니다.
                        </small>
                    </div>
                    <div className="membership-join__methods">
                        <article>
                            <span>01</span>
                            <h3>WEB</h3>
                            <p>모바일 / PC</p>
                            <ol>
                                <li>
                                    현대 모터스튜디오 홈페이지에 접속한 뒤 오른쪽 위의 프로필
                                    아이콘을 누릅니다.
                                </li>
                                <li>프로필에서 ‘멤버십 가입’을 선택합니다.</li>
                                <li>HMS Club 가입 절차를 진행합니다.</li>
                            </ol>
                        </article>
                        <article>
                            <span>02</span>
                            <h3>APP</h3>
                            <p>마이현대</p>
                            <ol>
                                <li>
                                    마이현대 앱에서 현대자동차 통합 계정으로 로그인합니다. 계정이
                                    없다면 먼저 계정을 만들어 주세요.
                                </li>
                                <li>서비스 바로가기에서 ‘현대 모터스튜디오’를 선택합니다.</li>
                                <li>HMS Club 가입 약관에 동의합니다.</li>
                            </ol>
                        </article>
                    </div>
                    <div className="membership-types" aria-labelledby="membership-types-title">
                        <h3 id="membership-types-title">멤버십 구분</h3>
                        <div className="membership-types__table">
                            {membershipTypes.map(([name, description, note]) => (
                                <article key={name}>
                                    <h4>{name}</h4>
                                    <div>
                                        <strong>{description}</strong>
                                        <p>{note}</p>
                                    </div>
                                </article>
                            ))}
                        </div>
                        <ul className="membership-notes">
                            <li>가입 시 본인 인증이 필요합니다.</li>
                            <li>
                                렌트·리스 고객은 계약 기간 12개월 이상이며 실운행자 명의로 가입 시
                                Plus가 적용됩니다.
                            </li>
                            <li>
                                Basic 회원이 현대·제네시스 차량을 구매하면 차량 등록 익일부터 Plus
                                혜택이 제공됩니다. 시스템 반영 일정에 따라 지연될 수 있습니다.
                            </li>
                        </ul>
                    </div>
                </section>

                <section
                    hidden={activeTab !== 'benefits'}
                    role="tabpanel"
                    tabIndex={0}
                    id="membership-panel-benefits"
                    aria-labelledby="membership-tab-benefits"
                    className="membership-benefits"
                >
                    <header className="membership-section-heading">
                        <p>MEMBERSHIP BENEFITS</p>
                        <h2 id="membership-benefits-title">혜택 안내</h2>
                    </header>
                    <p className="membership-benefits__lead">
                        일상 가까이에서 현대 모터스튜디오를 경험할 수 있도록
                        <br />
                        HMS Club만의 혜택을 준비했습니다.
                    </p>
                    <div className="membership-detail-heading">
                        <h3>공통 혜택</h3>
                        <p>HMS Club 가입 시 모든 멤버십 회원에게 제공되는 혜택입니다.</p>
                    </div>
                    <div className="membership-benefits__grid">
                        {benefits.map(([number, title, description]) => (
                            <article key={number}>
                                <span>{number}</span>
                                <h3>{title}</h3>
                                <p>{description}</p>
                            </article>
                        ))}
                    </div>
                    <p className="membership-detail-note">
                        웰컴 패키지는 가입 시 선택한 항목에 추가 동의한 고객에게 최초 가입 1회에
                        한하여 제공됩니다.
                    </p>
                    <div className="membership-detail-heading">
                        <h3>추가 혜택</h3>
                        <p>Plus 멤버십 회원에게 더욱 특별한 혜택을 제공합니다.</p>
                    </div>
                    <div className="membership-plus">
                        <div>
                            <p>FOR PLUS MEMBERS</p>
                            <h3>
                                PLUS
                                <br />
                                BENEFITS
                            </h3>
                        </div>
                        <ol>
                            {plusBenefits.map(([title, description], index) => (
                                <li key={title}>
                                    <span>{String(index + 1).padStart(2, '0')}</span>
                                    <div>
                                        <strong>{title}</strong>
                                        <p>{description}</p>
                                    </div>
                                </li>
                            ))}
                        </ol>
                    </div>
                </section>

                <section
                    hidden={activeTab !== 'locations'}
                    role="tabpanel"
                    tabIndex={0}
                    id="membership-panel-locations"
                    aria-labelledby="membership-tab-locations"
                    className="membership-locations"
                >
                    <header className="membership-section-heading">
                        <p>USE YOUR MEMBERSHIP</p>
                        <h2 id="membership-locations-title">HMS Club 이용</h2>
                    </header>
                    <p className="membership-locations__lead">
                        HMS Club 회원은 현대 모터스튜디오 거점별 프로그램과 라운지를 이용할 수
                        있습니다.
                    </p>
                    <p className="membership-detail-note">
                        차량 전시, 미디어 월 등 거점별 무료 전시는 HMS Club 회원이 아니어도 누구나
                        이용할 수 있습니다.
                    </p>
                    <div className="membership-locations__grid">
                        {locations.map(([name, ...services]) => (
                            <article key={name}>
                                <h3>
                                    HYUNDAI
                                    <br />
                                    MOTORSTUDIO
                                    <br />
                                    <strong>{name}</strong>
                                </h3>
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
                    <div className="membership-lounge">
                        <h3>멤버십 라운지</h3>
                        <div
                            className="membership-lounge-switch"
                            role="group"
                            aria-label="라운지 지역 선택"
                        >
                            {[
                                ['seoul', '서울'],
                                ['busan', '부산'],
                            ].map(([id, label]) => (
                                <button
                                    key={id}
                                    type="button"
                                    aria-pressed={activeLounge === id}
                                    aria-controls="membership-lounge-detail"
                                    onClick={() => setActiveLounge(id)}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                        <div id="membership-lounge-detail">
                            <h4>{lounges[activeLounge].title}</h4>
                            <p>{lounges[activeLounge].description}</p>
                            <h4>이용 안내</h4>
                            <ul>
                                {lounges[activeLounge].rules.map((rule) => (
                                    <li key={rule}>{rule}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>

                <section
                    hidden={activeTab !== 'join'}
                    className="membership-cta"
                    aria-labelledby="membership-cta-title"
                >
                    <p>READY TO JOIN?</p>
                    <h2 id="membership-cta-title">
                        더 많은 경험을
                        <br />
                        가까이에서 만나보세요.
                    </h2>
                    <Link className="membership-cta__link" to={paths.signup}>
                        HMS Club 가입하기 <ArrowUpRight aria-hidden="true" />
                    </Link>
                </section>
            </div>
        </main>
    );
}
