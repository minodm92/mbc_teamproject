import { Link } from 'react-router-dom';
import { paths } from '../../../common/router/routePaths';

// Keys are compared without spaces, so "스나얀 파크" and "스나얀파크" are the same branch.
const branchNames = {
    서울: 'SEOUL',
    하남: 'HANAM',
    고양: 'GOYANG',
    부산: 'BUSAN',
    스나얀파크: 'SENAYAN PARK',
    메타버스: 'METAVERSE',
};

const warnedLocations = new Set();

// Figma shows branches in English capitals. Unknown branches show the original text and warn once.
function getBranchLabel(location) {
    const key = location.replace(/^현대\s*모터\s*스튜디오/, '').replace(/\s/g, '');
    if (!key) return '';
    if (branchNames[key]) return branchNames[key];
    if (!warnedLocations.has(location)) {
        warnedLocations.add(location);
        console.warn(`[NewsCard] 지점 변환표에 없는 지점입니다: "${location}"`);
    }
    return location;
}

export default function NewsCard({ article, variant = 'default', listPage = 1 }) {
    const branchLabel = getBranchLabel(article.location);

    return (
        <article className={`newsroom-card${variant === 'related' ? ' newsroom-card--related' : ''}`}>
            <Link
                className="newsroom-card__link"
                to={`${paths.newsroomArticle(article.id)}?page=${listPage}`}
                aria-label={`${article.title} · ${article.location} · ${article.date}`}
            >
                <span className="newsroom-card__media" data-header-theme="dark">
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
                    {branchLabel && <p className="newsroom-card__location">{branchLabel}</p>}
                </div>
            </Link>
        </article>
    );
}
