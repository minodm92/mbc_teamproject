import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { paths } from '../../common/router/routePaths';
import { NotFoundPage } from '../content/ContentPages';
import NewsCard from './components/NewsCard';
import { newsroomArticles } from './data/newsroomData';
import './NewsroomDetailPage.css';

export default function NewsroomDetailPage() {
    const { articleId } = useParams();
    const article = newsroomArticles.find((item) => item.id === articleId);

    if (!article) return <NotFoundPage />;

    const relatedArticles = newsroomArticles
        .filter((item) => item.id !== article.id)
        .slice(0, 3);

    return (
        <main className="newsroom-page newsroom-detail">
            <article>
                <header className="newsroom-detail__header">
                    <p className="newsroom-detail__location">NEWSROOM <span aria-hidden="true">/</span> {article.location}</p>
                    <h1 className="newsroom-detail__title">{article.title}</h1>
                    <time className="newsroom-detail__date" dateTime={article.dateISO}>
                        {article.date}
                    </time>
                </header>

                <figure className="newsroom-detail__hero">
                    <img src={article.image} alt="" width="465" height="450" fetchPriority="high" />
                </figure>

                {(article.summary || article.description || article.body) && (
                    <div className="newsroom-detail__copy">
                        {(article.summary || article.description) && (
                            <p className="newsroom-detail__summary">{article.summary || article.description}</p>
                        )}
                        {article.body && (
                            <div className="newsroom-detail__body">
                                {(Array.isArray(article.body) ? article.body : [article.body]).map((paragraph, index) => (
                                    <p key={`${article.id}-paragraph-${index}`}>{paragraph}</p>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </article>

            <section className="newsroom-detail__related" aria-labelledby="newsroom-related-title">
                <h2 id="newsroom-related-title">RELATED NEWS</h2>
                <div className="newsroom-detail__related-grid">
                    {relatedArticles.map((relatedArticle) => (
                        <NewsCard key={relatedArticle.id} article={relatedArticle} variant="related" />
                    ))}
                </div>
            </section>

            <div className="newsroom-detail__back-wrap">
                <Link className="newsroom-detail__back" to={paths.newsroom}>
                    <ArrowLeft aria-hidden="true" size={18} />
                    <span>BACK TO NEWSROOM</span>
                </Link>
            </div>
        </main>
    );
}
