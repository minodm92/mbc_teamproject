import { Link } from 'react-router-dom';
import { paths } from '../../../common/router/routePaths';
import news01Featured from '../assets/news-01-featured.png';
import news02Featured from '../assets/news-02-featured.png';
import news03Featured from '../assets/news-03-featured.png';
import news04Featured from '../assets/news-04-featured.png';

const branchNames = {
    서울: 'SEOUL',
    하남: 'HANAM',
    고양: 'GOYANG',
    부산: 'BUSAN',
};

// Figma 4181:104/107/110/113: source image placement inside the 305x400 card (desktop only).
const featuredImages = {
    'news-01': { src: news01Featured, width: '201.07%', height: '153.82%', left: '-50.59%', top: '-49.39%' },
    'news-02': { src: news02Featured, width: '171.77%', height: '131.4%', left: '-36.04%', top: '-31.52%' },
    'news-03': { src: news03Featured, width: '193.26%', height: '147.85%', left: '-26.56%', top: '-44.4%' },
    'news-04': { src: news04Featured, width: '187.87%', height: '143.72%', left: '-46.37%', top: '-21.97%' },
};

export default function FeaturedNewsCard({ article }) {
    const branchName = Object.keys(branchNames).find((name) => article.location.includes(name));
    const locationText = branchName ? branchNames[branchName] : `현대 모터스튜디오 ${article.location}`;
    const featured = featuredImages[article.id];

    return (
        <article className="newsroom-feature-card" data-header-theme="dark">
            <Link
                className="newsroom-feature-card__link"
                to={paths.newsroomArticle(article.id)}
                aria-label={`${article.title} · ${article.location} · ${article.date}`}
            >
                <picture>
                    {featured && <source media="(min-width: 1101px)" srcSet={featured.src} />}
                    <img
                        className={`newsroom-feature-card__image${featured ? ' newsroom-feature-card__image--cropped' : ''}`}
                        src={article.image}
                        alt=""
                        width="305"
                        height="400"
                        style={featured && {
                            '--crop-width': featured.width,
                            '--crop-height': featured.height,
                            '--crop-left': featured.left,
                            '--crop-top': featured.top,
                        }}
                    />
                </picture>
                <h2 className="newsroom-feature-card__title">{(article.featuredTitle || [article.title]).join(' ')}</h2>
                <p className="newsroom-feature-card__location">{locationText}</p>
            </Link>
        </article>
    );
}
