import { ArrowLeft, ArrowRight } from 'lucide-react';
import { notices } from '../../common/data/content';
import { Link } from 'react-router-dom';
import { paths } from '../../common/router/routePaths';
import './NoticesPage.css';
import './NoticeOperatingDetail.css';
import DetailHero from './DetailHero';
import noticeHeroImage from '../../assets/images/notices/notice-hero.png';

const detailedNotices = {
  'goyang-october-access': {
    location: '현대 모터스튜디오 고양',
    paragraphs: ['내부 행사 일정으로 10월 7일(수)과 8일(목)의 일부 시설 관람 및 이용이 제한됩니다.', '방문하실 분들은 아래 시설별 운영 현황을 확인해 주세요.'],
    caption: '10월 7~8일 시설별 운영 현황',
    columns: ['구분', '10/7(수)', '10/8(목)'],
    rows: [
      ['쇼케이스', '미운영', '미운영'],
      ['인투더카/4D라이드', '미운영', '미운영'],
      ['시승', '미운영', '미운영'],
      ['브랜드샵', '미운영', '미운영'],
      ['안내데스크', '운영', '운영'],
      ['키친', '미운영', '오후 5시부터 운영'],
      ['1층 카페', '미운영', '오후 5시부터 운영'],
      ['3층 카페M', '미운영', '미운영'],
    ],
    closing: '방문에 불편을 드리는 점 양해 부탁드립니다. 감사합니다.',
  },
  'hanam-drive-light': {
    location: '현대 모터스튜디오 하남',
    paragraphs: ['하남의 신규 테마 시승 프로그램, 아웃도어 데이트립 드라이브 라이트를 소개합니다.', '기존 아웃도어 데이트립 드라이브를 짧은 시간 안에 경험할 수 있도록 구성한 프로그램입니다.', '2026년 4월 16일(목) 진행 프로그램부터 예약할 수 있습니다.'],
    caption: '기존 프로그램과 라이트 프로그램 비교',
    columns: ['구분', '아웃도어 데이트립 드라이브', '아웃도어 데이트립 드라이브 라이트'],
    rows: [
      ['운영시간', '매주 월·화·목·금·토', '매주 수요일 11:30 / 14:00'],
      ['소요시간', '180분', '90분'],
      ['참가비', '없음', '없음'],
    ],
    closing: '운영 일정과 프로그램 구성을 확인하시고 이용해 주세요. 감사합니다.',
  },
};

function NoticeBody({ detail, content }) {
  if (!detail) {
    if (!content) return <p>상세 내용은 준비 중입니다.</p>;
    if (typeof content === 'string') return content.split(/\n{2,}/).map((text, index) => <p key={index}>{text}</p>);
    if (!Array.isArray(content)) return null;
    return content.map((block, index) => {
      if (block.type === 'list') return <ol key={index}>{block.items.map((text, itemIndex) => <li key={itemIndex}>{text}</li>)}</ol>;
      if (block.type === 'image') return <figure key={index}><img src={block.src} alt={block.alt || ''} />{block.caption && <figcaption>{block.caption}</figcaption>}</figure>;
      if (block.type === 'link') return <p key={index}><a href={block.href} target="_blank" rel="noreferrer">{block.label}</a></p>;
      return <p key={index}>{block.strong ? <strong>{block.text}</strong> : block.text}</p>;
    });
  }
  return <>
    <p>안녕하세요. {detail.location}입니다.</p>
    {detail.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
    <div className="notice-operating-page__table-wrap" role="region" aria-label={detail.caption} tabIndex={0}>
      <table>
        <caption>{detail.caption}</caption>
        <thead><tr>{detail.columns.map((column) => <th key={column} scope="col">{column}</th>)}</tr></thead>
        <tbody>{detail.rows.map(([label, ...cells]) => <tr key={label}><th scope="row">{label}</th>{cells.map((cell, index) => <td key={index}>{cell}</td>)}</tr>)}</tbody>
      </table>
    </div>
    <p>{detail.closing}</p>
  </>;
}
export default function NoticeOperatingDetail({ notice }) {
  const detail = detailedNotices[notice.id];
  const isPlaceholder = !['goyang-october-hours', 'goyang-october-access', 'hanam-drive-light'].includes(notice.id);
  const hasShortTitle = isPlaceholder && notice.title.length <= 30;
  const noticeIndex = notices.findIndex((item) => item.id === notice.id);
  const nextNotice = noticeIndex >= 0 ? notices[noticeIndex + 1] : undefined;
  const previousNotice = noticeIndex > 0 ? notices[noticeIndex - 1] : undefined;
  const contentImage = Array.isArray(notice.content)
    ? notice.content.find((block) => block.type === 'image')?.src
    : undefined;
  const heroImage = contentImage || noticeHeroImage;
  return (
    <main className={`notices-page notice-operating-page${isPlaceholder ? ' notice-operating-page--placeholder' : ''}${hasShortTitle ? ' notice-operating-page--short-title' : ''}`}>
      <DetailHero image={heroImage} title={notice.title} section="공지사항" sectionPath={paths.notices} titleTag="p" />
      <div className="notice-operating-page__inner">
        <article>
          <header className="notice-operating-page__heading">
            <h1>{notice.title}</h1>
            <div className="notice-operating-page__metadata">
              {!isPlaceholder && <span>{detail?.location || (notice.id === 'goyang-october-hours' ? '현대 모터스튜디오 고양' : notice.category)}</span>}
              <time dateTime={notice.date.replaceAll('.', '-')}>{notice.date}</time>
            </div>
          </header>
          <div className="notice-operating-page__body">
            {isPlaceholder ? <p>상세 내용은 준비 중입니다.</p> : detail ? <NoticeBody detail={detail} /> : notice.id === 'goyang-october-hours' ? <>
            <p>안녕하세요. 현대 모터스튜디오 고양입니다.</p>
            <p>10월 5일 월요일은 정기 휴관 없이 정상 운영합니다. 방문 계획에 참고해 주세요.</p>
            <ul><li><strong>10월 5일(월) 정상 운영</strong><br />기존 정기 휴관일에서 정상 운영일로 변경됩니다.</li></ul>
            <p>여러분의 방문을 기다립니다. 감사합니다.</p>
            </> : <NoticeBody content={notice.content} />}
          </div>
        </article>
        <div className="notice-operating-page__actions">
          {previousNotice ? <Link className="notice-operating-page__previous" to={paths.notice(previousNotice.id)} aria-label={'이전 공지사항: ' + previousNotice.title}>
            <ArrowLeft size={20} strokeWidth={1.5} aria-hidden="true" />
            <span className="notice-operating-page__previous-copy"><span className="notice-operating-page__next-label">PREV</span><span className="notice-operating-page__next-title">{previousNotice.title}</span></span>
          </Link> : <span className="notice-operating-page__previous notice-operating-page__previous--disabled" aria-disabled="true">
            <ArrowLeft size={20} strokeWidth={1.5} aria-hidden="true" /><span>PREV</span>
          </span>}
          <Link className="notice-operating-page__list-link" to={paths.notices}>목록</Link>
          {nextNotice && <Link className="notice-operating-page__next" to={paths.notice(nextNotice.id)} aria-label={'다음 공지사항: ' + nextNotice.title}>
            <span className="notice-operating-page__next-copy"><span className="notice-operating-page__next-label">NEXT</span><span className="notice-operating-page__next-title">{nextNotice.title}</span></span>
            <ArrowRight size={20} strokeWidth={1.5} aria-hidden="true" />
          </Link>}
        </div>
      </div>
    </main>
  );
}
