export default function FeaturedNewsCard({ article }) {
    return (
        <article className="newsroom-feature-card">
            <img
                className="newsroom-feature-card__image"
                src={article.image}
                alt=""
                width="306"
                height="400"
            />
            <h2 className="newsroom-feature-card__title">
                {article.featuredTitle.map((line) => (
                    <span key={line}>{line}</span>
                ))}
            </h2>
            <p className="newsroom-feature-card__location">현대 모터스튜디오 {article.location}</p>
        </article>
    );
}
