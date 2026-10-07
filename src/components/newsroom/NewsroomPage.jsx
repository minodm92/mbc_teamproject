import { useRef } from 'react';
import heroNight from './assets/hero-night.png';
import { Link, useSearchParams } from 'react-router-dom';
import { paths } from '../../common/router/routePaths';
import { newsroomArticles } from './data/newsroomData';
import FeaturedNewsCard from './components/FeaturedNewsCard';
import NewsCard from './components/NewsCard';
import NewsroomPagination from './components/NewsroomPagination';
import PromotionalVideo from './components/PromotionalVideo';
import './NewsroomPage.css';

export function NewsroomPage() {
    const newsSection = useRef(null);
    const pageArticles = [
        newsroomArticles.slice(0, 9),
        newsroomArticles.slice(9, 18),
        newsroomArticles.slice(18, 27),
    ];
    const [searchParams, setSearchParams] = useSearchParams();
    const requestedPage = Number(searchParams.get('page'));
    const currentPage = Number.isInteger(requestedPage) && requestedPage >= 1 && requestedPage <= pageArticles.length
        ? requestedPage
        : 1;

    const changePage = (page) => {
        setSearchParams(page === 1 ? {} : { page: String(page) });
        newsSection.current?.scrollIntoView({ block: 'start', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    };

    return (
        <main className="newsroom-page">
            <section className="newsroom-intro" aria-label="뉴스룸">
                <div className="newsroom-hero">
                    <img
                        className="newsroom-hero__image"
                        src={heroNight}
                        alt=""
                        fetchPriority="high"
                    />
                    <div className="newsroom-hero__copy">
                        <nav className="newsroom-hero__breadcrumb" aria-label="현재 위치">
                            <Link to={paths.home}>HOME</Link><span aria-hidden="true"> / </span><span>안내</span><span aria-hidden="true"> / </span><span aria-current="page">뉴스룸</span>
                        </nav>
                        <h1 className="newsroom-hero__title">NEWSROOM</h1>
                        <p className="newsroom-hero__description">공간과 모빌리티, 문화가 만나는<br />최신 소식을 확인해보세요.</p>
                    </div>
                </div>

                <div className="newsroom-featured" aria-label="주요 뉴스">
                    {newsroomArticles.slice(0, 4).map((article) => (
                        <FeaturedNewsCard key={article.id} article={article} />
                    ))}
                </div>
            </section>

            <PromotionalVideo />

            <section ref={newsSection} className="newsroom-news" aria-labelledby="newsroom-news-title">
                <h2 className="newsroom-news__title" id="newsroom-news-title">
                    NEWS
                </h2>
                <p className="newsroom-news__description">일상 너머의 새로운 모빌리티 경험이 이곳에서 시작됩니다.</p>
                <div className="newsroom-news__grid">
                    {pageArticles[currentPage - 1].map((article) => (
                        <NewsCard key={`${article.id}-${currentPage}`} article={article} listPage={currentPage} />
                    ))}
                </div>
                <NewsroomPagination
                    currentPage={currentPage}
                    pageCount={pageArticles.length}
                    onPageChange={changePage}
                />
            </section>
        </main>
    );
}

export default NewsroomPage;
