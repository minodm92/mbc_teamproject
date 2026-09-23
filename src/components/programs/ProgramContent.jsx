import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { paths } from '../../common/router/routePaths';
import './ProgramContent.css';

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

const monthlyPrograms = [
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
];

function Calendar() {
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
                        className={`${day && (day === 31 || day <= 15) ? 'is-muted' : ''}${day === 16 ? ' is-selected' : ''}`}
                        key={`${day}-${index}`}
                    >
                        {day === 16 && <img src="/images/programs/program-calendar-selected.svg" alt="" />}
                        <b>{day}</b>
                    </span>
                ))}
            </div>
            <Link to={paths.programReservation}>Reservation</Link>
        </div>
    );
}

export default function ProgramContent() {
    return (
        <main className="program-page">
            <section className="program-hero">
                <h1>Explore Programs<br />Through Creative<br />Experiences</h1>
                <p>현대 모터스튜디오의 다양한 프로그램을 만나보세요.<br />새로운 아이디어를 발견하고, 직접 만들어보며, 다양한 방식으로 모빌리티를 경험할 수 있습니다.</p>
                <img src={asset(1)} alt="자동차 디자인 프로그램을 체험하는 모습" />
            </section>

            <section className="program-manifesto">
                <div className="program-strip">{stripImages.map((image) => <img src={image} alt="" key={image} />)}</div>
                <p>탐색 · 창작 · 경험 · 발견</p>
                <h2>Experience Mobility in New Ways<br />Through Creative Programs at Hyundai Motorstudio</h2>
            </section>

            <section className="program-about">
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
                <Calendar />
                <div className="program-monthly__programs">
                    {monthlyPrograms.map((program) => (
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
                        <a href="#program-details">Details</a>
                    </div>
                </div>
                <img className="program-feature__visual" src="/images/programs/program-feature-main.svg" alt="레고로 만든 미래자동차 코딩 워크샵 모형" />
            </section>

            <section className="program-locations">
                <div className="program-locations__canvas">
                    <div className="program-locations__intro">
                        <h2>PROGRAMS BY LOCATION</h2>
                        <p>각 지점에서 만나볼 수 있는 다양한 체험 프로그램을 확인해보세요.</p>
                    </div>
                    <div className="program-locations__branch program-locations__branch--seoul">
                        <h3>SEOUL<br />PROGRAMS</h3>
                        <p>서울 지점의 다양한 프로그램을 만나보세요.</p>
                    </div>
                    <div className="program-locations__branch program-locations__branch--goyang">
                        <h3>GOYANG<br />PROGRAMS</h3>
                        <p>고양 지점의 다양한 프로그램을 만나보세요.</p>
                    </div>
                    {locationPrograms.map((program) => (
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
            </section>

            <section className="program-discover"><h2>DISCOVER HANDS-ON PROGRAMS<br />AT HYUNDAI MOTORSTUDIO.</h2><p>보고, 만들고, 경험하는 모빌리티 프로그램</p></section>
            <section className="program-cards">{discoverPrograms.map((program) => <Link to={paths.programReservation} key={program.title}><img src={`/images/programs/program-discover-${String(program.image).padStart(2, '0')}.svg`} alt={program.title} /><strong>{program.title}</strong></Link>)}</section>
            <section className="program-closing"><img src="/images/programs/program-closing.svg" alt="현대 모터스튜디오 프로그램에 참여하는 어린이들" /></section>
        </main>
    );
}
