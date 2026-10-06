import { Link } from 'react-router-dom';
import { paths } from '../../../common/router/routePaths';
import { mobileNowExhibition as exhibition } from './homeMobileData';

export default function MobileNowExhibition() {
    return (
        <section className="home-mobile-now" aria-label="NOW EXHIBITION">
            <Link className="home-mobile-now__link" to={paths.exhibitions}>
                <img
                    className="home-mobile-now__background"
                    src={exhibition.background}
                    alt=""
                    width="1736"
                    height="906"
                    loading="lazy"
                    decoding="async"
                />
                <div className="home-mobile-now__head">
                    <h2 className="home-mobile-title">{exhibition.title}</h2>
                    <p className="home-mobile-now__date">{exhibition.date}</p>
                    <ul className="home-mobile-now__thumbs">
                        {exhibition.thumbnails.map((thumbnail) => (
                            <li key={thumbnail}>
                                <img src={thumbnail} alt="" width="87" height="57" loading="lazy" decoding="async" />
                            </li>
                        ))}
                    </ul>
                </div>
                <p className="home-mobile-now__copy">{exhibition.description}</p>
            </Link>
        </section>
    );
}
