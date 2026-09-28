import { useSearchParams, Link } from 'react-router-dom';
import { notices } from '../../common/data/content';
import { paths } from '../../common/router/routePaths';
import Pagination from '../../ui/Pagination';
import './NoticesPage.css';

const categories = ['전체', '알림', '보도기사'];
const pageSize = 10;

export default function NoticesListing() {
  const [params, setParams] = useSearchParams();
  const category = categories.includes(params.get('category')) ? params.get('category') : '전체';
  const search = params.get('q') || '';
  const query = search.trim().toLocaleLowerCase('ko-KR');
  const filtered = notices.filter((notice) => (
    (category === '전체' || (category === '알림' ? notice.category !== '보도기사' : notice.category === category))
    && notice.title.toLocaleLowerCase('ko-KR').includes(query)
  ));
  const pinned = filtered.filter((notice) => notice.pinned);
  const regular = filtered.filter((notice) => !notice.pinned);
  const pageCount = Math.max(1, Math.ceil(regular.length / pageSize));
  const requestedPage = Number(params.get('page'));
  const page = Math.min(pageCount, Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1);
  const offset = (page - 1) * pageSize;
  const visible = [...pinned, ...regular.slice(offset, offset + pageSize)];

  function updateFilter(key, value) {
    setParams((previous) => {
      const next = new URLSearchParams(previous);
      if (value && value !== '전체') next.set(key, value);
      else next.delete(key);
      next.delete('page');
      return next;
    }, { replace: true });
  }

  return <main className="notices-page">
    <header className="notices-page__hero">
      <nav className="notices-page__breadcrumb" aria-label="현재 위치">
        <Link to={paths.home}>HOME</Link><span aria-hidden="true">/</span>
        <Link to={paths.membership}>안내</Link><span aria-hidden="true">/</span>
        <span aria-current="page">공지사항</span>
      </nav>
      <div className="notices-page__heading">
        <p>BEFORE YOUR VISIT</p>
        <h1>NOTICE<span>.</span></h1>
      </div>
    </header>
    <section aria-label="공지사항 목록">
      <div className="notices-page__toolbar">
        <div className="notices-page__filters" role="group" aria-label="공지사항 분류">
          {categories.map((label) => <button key={label} type="button" aria-pressed={category === label} aria-controls="notice-results" onClick={() => updateFilter('category', label)}>{label}</button>)}
        </div>
        <form className="notices-page__search" role="search" onSubmit={(event) => event.preventDefault()}>
          <input type="search" aria-label="공지사항 제목 검색" value={search} onChange={(event) => updateFilter('q', event.target.value)} />
          <button type="submit" aria-label="검색"><img src="/images/notices/search.svg" width="24" height="24" alt="" /></button>
        </form>
      </div>
      <div className="notices-page__results" id="notice-results">
        <p className="notices-page__sr-only" role="status">검색 결과 {filtered.length}건, {page}페이지</p>
        {visible.length ? <ul className="notices-page__list">
          {visible.map((notice, index) => <li key={notice.id}>
            <Link className={`notices-page__row${notice.pinned ? ' notices-page__row--pinned' : ''}`} to={paths.notice(notice.id)}>
              <span className="notices-page__number">{notice.pinned ? <img src="/images/notices/pin.png" width="13" height="18" alt="고정 공지" /> : offset + index - pinned.length + 1}</span>
              <span className="notices-page__category">{notice.category}</span>
              <strong className="notices-page__title">{notice.title}</strong>
              <time dateTime={notice.date.replaceAll('.', '-')}>{notice.date}</time>
              <span className="notices-page__arrow" aria-hidden="true"><img src="/images/notices/arrow.svg" width="15" height="15" alt="" /></span>
            </Link>
          </li>)}
        </ul> : <p className="notices-page__empty">검색 결과가 없습니다.</p>}
        {visible.length > 0 && <Pagination variant="notice" page={page} count={pageCount} onChange={(nextPage) => setParams((previous) => {
          const next = new URLSearchParams(previous);
          if (nextPage === 1) next.delete('page');
          else next.set('page', String(nextPage));
          return next;
        })} />}
      </div>
    </section>
  </main>;
}
