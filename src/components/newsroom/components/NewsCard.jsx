import { Link } from 'react-router-dom';
import { paths } from '../../../common/router/routePaths';

export default function NewsCard({ article, variant = 'default', listPage = 1 }) {
    return (
        <article className={`newsroom-card${variant === 'related' ? ' newsroom-card--related' : ''}`}>
            <Link
                className="newsroom-card__link"
                to={`${paths.newsroomArticle(article.id)}?page=${listPage}`}
                aria-label={`${article.title} · ${article.location} · ${article.date}`}
            >
                <span className="newsroom-card__media">
                    <img
                        className="newsroom-card__image"
                        src={article.image}
                        alt=""
                        width="465"
                        height="450"
                        loading="lazy"
                    />
                </span>
                <div className="newsroom-card__information">
                    <p className="newsroom-card__location">{article.location}</p>
                    <div className="newsroom-card__text">
                        <h3 className="newsroom-card__title" title={article.title}>
                            {article.title}
                        </h3>
                        <time className="newsroom-card__date" dateTime={article.dateISO}>
                            {article.date}
                        </time>
                    </div>
                </div>
            </Link>
        </article>
    );
}
