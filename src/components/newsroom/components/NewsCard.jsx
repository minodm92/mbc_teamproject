export default function NewsCard({ article }) {
    return (
        <article className="newsroom-card">
            <img
                className="newsroom-card__image"
                src={article.image}
                alt=""
                width="465"
                height="450"
                loading="lazy"
            />
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
        </article>
    );
}
