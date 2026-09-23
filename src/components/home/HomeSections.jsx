import { Link } from 'react-router-dom';
import './HomeSections.css';

const asset = (name) => `/images/home-renewal/${name}`;

export function HomeHero() {
  return (
    <section className="renewal-hero" aria-label="현대 모터스튜디오 메인 비주얼">
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={asset('hero-1.png')}
        aria-label="도심을 주행하는 현대자동차 영상"
      >
        <source src="/videos/home-hero.webm" type="video/webm" />
        <source src="/videos/home-hero.mp4" type="video/mp4" />
      </video>
    </section>
  );
}

export function HomeStories({ stories }) {
  return (
    <section className="renewal-stories">
      {stories.map((story, index) => (
        <Link
          key={story.title}
          className={`renewal-story renewal-story--${index + 1}`}
          to={story.to}
        >
          <img src={asset(story.image)} alt="" />
          <div>
            <h3>{story.title}</h3>
            <strong>{story.place}</strong>
            <p>{story.copy}</p>
          </div>
        </Link>
      ))}
    </section>
  );
}

export function VisitorGuide({ links }) {
  return (
    <section className="renewal-guide">
      <header>
        <h2>VISITOR<br />INFORMATION</h2>
        <p>현대모터스튜디오 이용안내</p>
      </header>
      <img src={asset('notice.svg')} alt="" aria-hidden="true" />
      <div className="renewal-guide__links">
        {links.map(([label, title, to], index) => (
          <Link key={label} to={to} className={index === 0 ? 'is-featured' : ''}>
            <span>{label}</span>
            <strong>{title}</strong>
            {index === 0 && (
              <small>휴관 및 운영시간 · 전시 관람 제한 · 시설 이용 안내 · 주요 공지사항</small>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
