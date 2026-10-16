import { useEffect, useRef, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { notices } from '../../common/data/content';
import { paths } from '../../common/router/routePaths';
import './NoticesPage.css';

const categories = ['전체', '알림', '보도기사'];
const pageSize = 10;
const MOBILE_QUERY = '(max-width: 767px)';

function useMediaQuery(query) {
    const [matches, setMatches] = useState(() => window.matchMedia(query).matches);
    useEffect(() => {
        const media = window.matchMedia(query);
        const update = () => setMatches(media.matches);
        update();
        media.addEventListener('change', update);
        return () => media.removeEventListener('change', update);
    }, [query]);
    return matches;
}

// Page numbers are shown in groups (10 on PC, 5 on mobile).
function NoticePagination({ page, count, onChange, groupSize = 10 }) {
    const groupStart = Math.floor((page - 1) / groupSize) * groupSize + 1;
    const groupEnd = Math.min(groupStart + groupSize - 1, count);
    const pages = Array.from({ length: groupEnd - groupStart + 1 }, (_, index) => groupStart + index);
    const hasPrev = page > 1;
    const hasNext = page < count;

    return (
        <nav className="notices-page__pagination" aria-label="공지사항 페이지">
            {hasPrev && (
                <>
                    <button type="button" className="notices-page__pagination-arrow notices-page__pagination-edge" aria-label="첫 페이지" onClick={() => onChange(1)}>«</button>
                    <button type="button" className="notices-page__pagination-arrow" aria-label="이전 페이지" onClick={() => onChange(page - 1)}>‹</button>
                </>
            )}
            {pages.map((number) => (
                <button key={number} type="button" aria-label={number + '페이지'} aria-current={page === number ? 'page' : undefined} aria-controls="notice-results" onClick={() => onChange(number)}>{number}</button>
            ))}
            {hasNext && (
                <>
                    <button type="button" className="notices-page__pagination-arrow" aria-label="다음 페이지" onClick={() => onChange(page + 1)}>›</button>
                    <button type="button" className="notices-page__pagination-arrow notices-page__pagination-edge" aria-label="마지막 페이지" onClick={() => onChange(count)}>»</button>
                </>
            )}
        </nav>
    );
}

export default function NoticesListing() {
    const [params, setParams] = useSearchParams();
    const category = categories.includes(params.get('category')) ? params.get('category') : '전체';
    const search = params.get('q') || '';
    const query = search.trim().toLocaleLowerCase('ko-KR');
    const filtered = notices
        .filter(
            (notice) =>
                (category === '전체' ||
                    (category === '알림'
                        ? notice.category !== '보도기사'
                        : notice.category === category)) &&
                notice.title.toLocaleLowerCase('ko-KR').includes(query)
        )
        // Sort the full filtered set by date (newest first) before paginating, so a page
        // boundary never splits a date out of order. Equal dates keep a stable, deterministic
        // order via the notice id so the list doesn't reshuffle between renders.
        .sort((a, b) => Number(b.date.replaceAll('.', '')) - Number(a.date.replaceAll('.', '')) || a.id.localeCompare(b.id));
    const pinned = filtered.filter((notice) => notice.pinned);
    const regular = filtered.filter((notice) => !notice.pinned);
    const pageCount = Math.max(1, Math.ceil(regular.length / pageSize));
    const requestedPage = Number(params.get('page'));
    const page = Math.min(
        pageCount,
        Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1
    );
    const offset = (page - 1) * pageSize;
    const visible = [...pinned, ...regular.slice(offset, offset + pageSize)];
    const [searchOpen, setSearchOpen] = useState(Boolean(search));
    const searchInputRef = useRef(null);
    const searchToggleRef = useRef(null);
    const focusSearchRef = useRef(false);
    const isMobile = useMediaQuery(MOBILE_QUERY);

    useEffect(() => {
        if (searchOpen && focusSearchRef.current) searchInputRef.current?.focus();
        focusSearchRef.current = false;
    }, [searchOpen]);

    function updateFilter(key, value) {
        setParams(
            (previous) => {
                const next = new URLSearchParams(previous);
                if (value && value !== '전체') next.set(key, value);
                else next.delete(key);
                next.delete('page');
                return next;
            },
            { replace: true }
        );
    }

    return (
        <main className="notices-page notices-page--list">
            <header className="notices-page__hero" data-header-theme="dark">
                <img className="notices-page__hero-image" src="/images/notices/notice-hero.png" alt="" fetchPriority="high" />
                <div className="notices-page__heading">
                    <h1>
                        NOTICE
                    </h1>
                    <p className="notices-page__intro">운영 시간부터 휴관 일정까지,<br />방문 전 필요한 소식을 확인해보세요</p>
                </div>
            </header>
            <nav className="notices-page__breadcrumb" aria-label="현재 위치">
                <Link to={paths.home}>HOME</Link>
                <ChevronRight size={12} aria-hidden="true" />
                <Link to={paths.membership}>안내</Link>
                <ChevronRight size={12} aria-hidden="true" />
                <span aria-current="page">공지사항</span>
            </nav>
            <section aria-label="공지사항 목록">
                <div className="notices-page__toolbar">
                    <div className="notices-page__filters" role="group" aria-label="공지사항 분류">
                        {categories.map((label) => (
                            <button
                                key={label}
                                type="button"
                                aria-pressed={category === label}
                                aria-controls="notice-results"
                                onClick={() => updateFilter('category', label)}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                    {/* The magnifier opens a title search field to its left; Esc or leaving it empty closes it. */}
                    <form
                        className={`notices-page__search${searchOpen ? ' notices-page__search--open' : ''}`}
                        role="search"
                        onSubmit={(event) => event.preventDefault()}
                    >
                        <input
                            ref={searchInputRef}
                            id="notice-search"
                            placeholder="검색어를 입력하세요."
                            type="search"
                            aria-label="공지사항 제목 검색"
                            aria-hidden={!searchOpen}
                            tabIndex={searchOpen ? undefined : -1}
                            value={search}
                            onChange={(event) => updateFilter('q', event.target.value)}
                            onKeyDown={(event) => {
                                if (event.key !== 'Escape') return;
                                event.preventDefault();
                                updateFilter('q', '');
                                setSearchOpen(false);
                                searchToggleRef.current?.focus();
                            }}
                            onBlur={(event) => {
                                if (!event.target.value.trim() && event.relatedTarget !== searchToggleRef.current) setSearchOpen(false);
                            }}
                        />
                        <button
                            ref={searchToggleRef}
                            type="button"
                            aria-label={searchOpen && !search.trim() ? '검색창 닫기' : '공지사항 검색'}
                            aria-expanded={searchOpen}
                            aria-controls="notice-search"
                            onClick={() => {
                                if (!searchOpen) {
                                    focusSearchRef.current = true;
                                    setSearchOpen(true);
                                } else if (!search.trim()) {
                                    setSearchOpen(false);
                                } else {
                                    searchInputRef.current?.focus();
                                }
                            }}
                        >
                            <img src="/images/notices/search.svg" width="24" height="24" alt="" />
                        </button>
                    </form>
                </div>
                <div className="notices-page__results" id="notice-results">
                    <p className="notices-page__sr-only" role="status">
                        검색 결과 {filtered.length}건, {page}페이지
                    </p>
                    {visible.length ? (
                        <ul className="notices-page__list">
                            {visible.map((notice, index) => (
                                <li key={notice.id}>
                                    <Link
                                        className={`notices-page__row${notice.pinned ? ' notices-page__row--pinned' : ''}`}
                                        to={paths.notice(notice.id)}
                                    >
                                        <span className="notices-page__number">
                                            {notice.pinned ? (
                                                <img
                                                    src="/images/notices/pin.png"
                                                    width="13"
                                                    height="18"
                                                    alt="고정 공지"
                                                />
                                            ) : (
                                                offset + index - pinned.length + 1
                                            )}
                                        </span>
                                        <span className="notices-page__category">
                                            {notice.category}
                                        </span>
                                        <strong className="notices-page__title">
                                            {notice.title}
                                        </strong>
                                        <time dateTime={notice.date.replaceAll('.', '-')}>
                                            {notice.date}
                                        </time>
                                        <span className="notices-page__arrow" aria-hidden="true">
                                            <img
                                                src="/images/notices/arrow.svg"
                                                width="15"
                                                height="15"
                                                alt=""
                                            />
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="notices-page__empty">검색 결과가 없습니다.</p>
                    )}
                    {visible.length > 0 && (
                        <NoticePagination
                            page={page}
                            count={pageCount}
                            groupSize={isMobile ? 5 : 10}
                            onChange={(nextPage) => {
                                setParams((previous) => {
                                    const next = new URLSearchParams(previous);
                                    if (nextPage === 1) next.delete('page');
                                    else next.set('page', String(nextPage));
                                    return next;
                                });
                                window.scrollTo({
                                    top: 0,
                                    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
                                });
                            }}
                        />
                    )}
                </div>
            </section>
        </main>
    );
}
