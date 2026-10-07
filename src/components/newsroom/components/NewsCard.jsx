import { Link } from 'react-router-dom';
import { paths } from '../../../common/router/routePaths';

const branchNames = {
    서울: 'SEOUL',
    하남: 'HANAM',
    고양: 'GOYANG',
    부산: 'BUSAN',
};

// Figma shows the branch in English; articles without a branch in `location` (e.g. news-01) name it in the title.
function getBranchLabel({ location, title }) {
    const branch = Object.keys(branchNames).find((name) => location.includes(name))
        ?? (/^현대 모터\s?스튜디오$/.test(location) ? Object.keys(branchNames).find((name) => title.includes(`모터스튜디오 ${name}`)) : undefined);
    return branch ? branchNames[branch] : location;
}

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
                    <div className="newsroom-card__text">
                        <h3 className="newsroom-card__title" title={article.title}>
                            {article.title}
                        </h3>
                        <time className="newsroom-card__date" dateTime={article.dateISO}>
                            {article.date}
                        </time>
                    </div>
                    <p className="newsroom-card__location">{getBranchLabel(article)}</p>
                </div>
            </Link>
        </article>
    );
}
