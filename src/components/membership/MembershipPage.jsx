import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { paths } from '../../common/router/routePaths';
import './MembershipPage.css';

const membershipTypes = [
  ['Basic', 'HMS Club 가입 고객', '별도의 조건 없이 누구나 가입 가능'],
  ['Plus', '현대자동차 또는 제네시스 신차 구매 고객', '렌트·리스, 일반 개인, 법인 임직원 실운행자 포함'],
];

const benefits = [
  ['01', 'WELCOME PACKAGE', '해비치 커피 쿠폰과 1시간 주차권, 상설전시 및 CX프로그램 할인 혜택을 제공합니다.'],
  ['02', 'PARKING SERVICE', '현대 모터스튜디오 고양과 서울에서 사용할 수 있는 1시간 주차권을 분기별로 제공합니다.'],
  ['03', 'HMS CLUB LOUNGE', '서울과 부산의 HMS Club Lounge를 동반 2인 포함, 1일 최대 3시간 이용할 수 있습니다.'],
];

const plusBenefits = [
  ['PLUS PACKAGE', '분기별 주차권과 상설전시 통합권·CX프로그램 할인 혜택'],
  ['BIRTHDAY COUPON', '브랜드샵 또는 F&B에서 사용할 수 있는 생일 할인 쿠폰'],
  ['EXCLUSIVE PROGRAM', 'Plus 회원만을 위한 시즈널 이벤트 및 프로모션 초청'],
];

const locations = [
  ['SEOUL', '멤버십 라운지', 'CX프로그램', '시승'],
  ['GOYANG', '상설전시', 'CX프로그램', '시승'],
  ['BUSAN', '상설전시', 'CX프로그램', '멤버십 라운지'],
  ['HANAM', '시승', '베이직 및 테마 드라이브'],
];

export default function MembershipPage() {
  return (
    <main className="membership-page">
      <section className="membership-hero" aria-labelledby="membership-title">
        <div className="membership-hero__copy">
          <p>HYUNDAI MOTORSTUDIO MEMBERSHIP</p>
          <h1 id="membership-title">HMS CLUB</h1>
          <p className="membership-hero__intro">더 깊은 경험과 새로운 영감이 시작되는<br />현대 모터스튜디오 전용 멤버십</p>
        </div>
        <a className="membership-hero__scroll" href="#membership-intro">
          Explore membership <ArrowDown aria-hidden="true" />
        </a>
        <span className="membership-hero__index" aria-hidden="true">01</span>
      </section>

      <nav className="membership-nav" aria-label="멤버십 페이지 목차">
        <a href="#membership-intro">멤버십 소개</a>
        <a href="#membership-join">가입 안내</a>
        <a href="#membership-benefits">혜택 안내</a>
        <a href="#membership-locations">이용 안내</a>
      </nav>

      <section className="membership-intro" id="membership-intro" aria-labelledby="membership-intro-title">
        <p className="membership-eyebrow">WELCOME TO HMS CLUB</p>
        <h2 id="membership-intro-title">EXPERIENCE<br />MORE<span>.</span></h2>
        <div className="membership-intro__copy">
          <p>HMS Club은 현대 모터스튜디오의 전용 멤버십 프로그램입니다. 현대 모터스튜디오를 더 깊이 경험하고 싶다면, HMS Club 멤버가 되어보세요.</p>
          <p>새로운 소식을 가장 먼저 접하고, 큐레이션된 콘텐츠와 전용 혜택을 우선적으로 만나볼 수 있습니다.</p>
        </div>
      </section>

      <section className="membership-join" id="membership-join" aria-labelledby="membership-join-title">
        <header className="membership-section-heading">
          <p>HOW TO JOIN</p>
          <h2 id="membership-join-title">가입 안내</h2>
        </header>
        <div className="membership-join__audience">
          <h3>가입 대상</h3>
          <p>국내에서 본인 인증이 가능한 고객이라면 누구나 HMS Club에 가입할 수 있습니다.</p>
          <small>기존 현대 모터스튜디오 회원은 로그인 후 약관 동의를 통해 HMS Club 멤버십으로 전환됩니다.</small>
        </div>
        <div className="membership-join__methods">
          <article>
            <span>01</span><h3>WEB</h3><p>모바일 / PC</p>
            <ol><li>현대 모터스튜디오 홈페이지에 접속합니다.</li><li>프로필에서 ‘멤버십 가입’을 선택합니다.</li><li>HMS Club 가입 절차를 진행합니다.</li></ol>
          </article>
          <article>
            <span>02</span><h3>APP</h3><p>마이현대</p>
            <ol><li>마이현대 앱에서 통합 계정으로 로그인합니다.</li><li>서비스 바로가기에서 ‘현대 모터스튜디오’를 선택합니다.</li><li>HMS Club 가입 약관에 동의합니다.</li></ol>
          </article>
        </div>
        <div className="membership-types" aria-labelledby="membership-types-title">
          <h3 id="membership-types-title">멤버십 구분</h3>
          <div className="membership-types__table">
            {membershipTypes.map(([name, description, note]) => (
              <article key={name}><h4>{name}</h4><div><strong>{description}</strong><p>{note}</p></div></article>
            ))}
          </div>
          <ul className="membership-notes">
            <li>가입 시 본인 인증이 필요합니다.</li>
            <li>렌트·리스 고객은 계약 기간 12개월 이상이며 실운행자 명의로 가입 시 Plus가 적용됩니다.</li>
            <li>차량 등록 및 시스템 반영 일정에 따라 Plus 혜택 제공 시점이 달라질 수 있습니다.</li>
          </ul>
        </div>
      </section>

      <section className="membership-benefits" id="membership-benefits" aria-labelledby="membership-benefits-title">
        <header className="membership-section-heading">
          <p>MEMBERSHIP BENEFITS</p><h2 id="membership-benefits-title">혜택 안내</h2>
        </header>
        <p className="membership-benefits__lead">일상 가까이에서 현대 모터스튜디오를 경험할 수 있도록<br />HMS Club만의 혜택을 준비했습니다.</p>
        <div className="membership-benefits__grid">
          {benefits.map(([number, title, description]) => (
            <article key={number}><span>{number}</span><h3>{title}</h3><p>{description}</p></article>
          ))}
        </div>
        <div className="membership-plus">
          <div><p>FOR PLUS MEMBERS</p><h3>PLUS<br />BENEFITS</h3></div>
          <ol>{plusBenefits.map(([title, description], index) => (
            <li key={title}><span>{String(index + 1).padStart(2, '0')}</span><div><strong>{title}</strong><p>{description}</p></div></li>
          ))}</ol>
        </div>
      </section>

      <section className="membership-locations" id="membership-locations" aria-labelledby="membership-locations-title">
        <header className="membership-section-heading">
          <p>USE YOUR MEMBERSHIP</p><h2 id="membership-locations-title">HMS Club 이용</h2>
        </header>
        <p className="membership-locations__lead">HMS Club 회원은 현대 모터스튜디오 거점별 프로그램과 라운지를 이용할 수 있습니다.</p>
        <div className="membership-locations__grid">
          {locations.map(([name, ...services]) => (
            <article key={name}><h3>HYUNDAI<br />MOTORSTUDIO<br /><strong>{name}</strong></h3><ul>{services.map((service) => <li key={service}>{service}</li>)}</ul></article>
          ))}
        </div>
      </section>

      <section className="membership-cta" aria-labelledby="membership-cta-title">
        <p>READY TO JOIN?</p><h2 id="membership-cta-title">더 많은 경험을<br />가까이에서 만나보세요.</h2>
        <Link className="membership-cta__link" to={paths.signup}>HMS Club 가입하기 <ArrowUpRight aria-hidden="true" /></Link>
      </section>
    </main>
  );
}
