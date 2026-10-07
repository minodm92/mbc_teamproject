import { Link } from 'react-router-dom';
import { paths } from '../../../common/router/routePaths';

const branchNames = {
    서울: 'SEOUL',
    하남: 'HANAM',
    고양: 'GOYANG',
    부산: 'BUSAN',
};

export default function FeaturedNewsCard({ article }) {
    const branchName = Object.keys(branchNames).find((name) => article.location.includes(name));
    const locationText = branchName ? branchNames[branchName] : `현대 모터스튜디오 ${article.location}`;

    return (
        <article className="newsroom-feature-card">
            <Link
                className="newsroom-feature-card__link"
                to={paths.newsroomArticle(article.id)}
                aria-label={`${article.title} · ${article.location} · ${article.date}`}
            >
                <img
                    className="newsroom-feature-card__image"
                    src={article.image}
                    alt=""
                    width="306"
                    height="400"
                />
                <h2 className="newsroom-feature-card__title">{(article.featuredTitle || [article.title]).join(' ')}</h2>
                <p className="newsroom-feature-card__location">{locationText}</p>
            </Link>
        </article>
    );
}
