import { ArrowLeft, ArrowRight, List } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { paths } from '../../common/router/routePaths';
import './NoticeDetail.css';

const allowedListParams = new Set(['category', 'q', 'page']);

function getListUrl(encodedParams) {
  if (!encodedParams) return paths.notices;
  const source = new URLSearchParams(encodedParams);
  const safe = new URLSearchParams();
  source.forEach((value, key) => {
    if (allowedListParams.has(key)) safe.set(key, value);
  });
  const query = safe.toString();
  return query ? `${paths.notices}?${query}` : paths.notices;
}

function NoticeBody({ content }) {
  if (!content) return <p className="notice-detail-page__empty">등록된 상세 내용이 없습니다.</p>;
  if (typeof content === 'string') {
    return content.split(/\n{2,}/).map((paragraph) => <p key={paragraph}>{paragraph}</p>);
  }
  if (!Array.isArray(content)) return null;

  return content.map((block, index) => {
    const key = `${block.type}-${index}`;
    if (block.type === 'list') return <ol key={key}>{block.items.map((item) => <li key={item}>{item}</li>)}</ol>;
    if (block.type === 'image') return <figure key={key}><img src={block.src} alt={block.alt || ''} />{block.caption && <figcaption>{block.caption}</figcaption>}</figure>;
    if (block.type === 'link') return <p key={key}><a href={block.href} target="_blank" rel="noreferrer">{block.label}</a></p>;
    return <p key={key}>{block.strong ? <strong>{block.text}</strong> : block.text}</p>;
  });
}

function AdjacentLink({ direction, notice, search }) {
  const isPrevious = direction === 'prev';
  const label = isPrevious ? 'PREV' : 'NEXT';
  const icon = isPrevious ? <ArrowLeft aria-hidden="true" /> : <ArrowRight aria-hidden="true" />;
  if (!notice) return <span className={`notice-detail-page__adjacent notice-detail-page__adjacent--${direction} is-disabled`} aria-disabled="true">{isPrevious && icon}<span>{label}</span>{!isPrevious && icon}</span>;
  return <Link className={`notice-detail-page__adjacent notice-detail-page__adjacent--${direction}`} to={{ pathname: paths.notice(notice.id), search }}>{isPrevious && icon}<span><small>{label}</small>{notice.title}</span>{!isPrevious && icon}</Link>;
}

export default function NoticeDetail({ item, previous, next }) {
  const [searchParams] = useSearchParams();
  const from = searchParams.get('from') || '';
  const listUrl = getListUrl(from);
  const detailSearch = from ? `?from=${encodeURIComponent(from)}` : '';

  return <main className="notices-page notice-detail-page">
    <header className="notices-page__hero">
      <nav className="notices-page__breadcrumb" aria-label="현재 위치">
        <Link to={paths.home}>HOME</Link><span aria-hidden="true">/</span>
        <Link to={paths.membership}>안내</Link><span aria-hidden="true">/</span>
        <Link to={listUrl}>공지사항</Link><span aria-hidden="true">/</span>
        <span aria-current="page">상세</span>
      </nav>
      <div className="notices-page__heading">
        <p>BEFORE YOUR VISIT</p>
        <h1>NOTICE<span>.</span></h1>
      </div>
    </header>

    <article className="notice-detail-page__article">
      <header className="notice-detail-page__header">
        <span className="notice-detail-page__category">{item.category}</span>
        <h2>{item.title}</h2>
        <time dateTime={item.date.replaceAll('.', '-')}>{item.date}</time>
      </header>
      <div className="notice-detail-page__body"><NoticeBody content={item.content} /></div>
      <nav className="notice-detail-page__navigation" aria-label="공지사항 게시물 이동">
        <AdjacentLink direction="prev" notice={previous} search={detailSearch} />
        <Link className="notice-detail-page__list" to={listUrl} aria-label="공지사항 목록으로"><List aria-hidden="true" /><span>LIST</span></Link>
        <AdjacentLink direction="next" notice={next} search={detailSearch} />
      </nav>
    </article>
  </main>;
}
