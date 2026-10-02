import heroNight from './assets/hero-night.png';
import { useState } from 'react';
import { newsroomArticles } from './data/newsroomData';
import FeaturedNewsCard from './components/FeaturedNewsCard';
import NewsCard from './components/NewsCard';
import NewsroomPagination from './components/NewsroomPagination';
import PromotionalVideo from './components/PromotionalVideo';
import './NewsroomPage.css';

export function NewsroomPage() {
    const [currentPage, setCurrentPage] = useState(1);
    const pageArticles = Array.from({ length: 3 }, () => newsroomArticles);

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
                    <h1 className="newsroom-visually-hidden">NEWSROOM</h1>
                    <p className="newsroom-visually-hidden">
                        공간과 모빌리티, 문화가 만나는 최신 소식을 확인해보세요.
                    </p>
                </div>

                <div className="newsroom-featured" aria-label="주요 뉴스">
                    {newsroomArticles.slice(0, 4).map((article) => (
                        <FeaturedNewsCard key={article.id} article={article} />
                    ))}
                </div>
            </section>

            <PromotionalVideo />

            <section className="newsroom-news" aria-labelledby="newsroom-news-title">
                <h2 className="newsroom-news__title" id="newsroom-news-title">
                    NEWS
                </h2>
                <div className="newsroom-news__grid">
                    {pageArticles[currentPage - 1].map((article) => (
                        <NewsCard key={`${article.id}-${currentPage}`} article={article} />
                    ))}
                </div>
                <NewsroomPagination
                    currentPage={currentPage}
                    pageCount={pageArticles.length}
                    onPageChange={setCurrentPage}
                />
            </section>
        </main>
    );
}

export default NewsroomPage;
