import { Link } from 'react-router-dom';
import { paths } from '../../../common/router/routePaths';
import { mobileIntro, mobileLocations } from './homeMobileData';

export default function MobileLocations() {
    return (
        <>
            <section className="home-mobile-intro" aria-labelledby="home-mobile-intro-title">
                <h2 className="home-mobile-intro__title" id="home-mobile-intro-title">
                    {mobileIntro.title.map((line) => (
                        <span key={line}>{line}</span>
                    ))}
                </h2>
                {mobileIntro.paragraphs.map((paragraph) => (
                    <p className="home-mobile-intro__copy" key={paragraph}>
                        {paragraph}
                    </p>
                ))}
                <h2 className="home-mobile-title home-mobile-intro__locations">
                    {mobileIntro.locationsTitle}
                </h2>
            </section>
            <div className="home-mobile-locations">
                {mobileLocations.map((location) => (
                    <Link
                        className={`home-mobile-location is-${location.theme}`}
                        key={location.slug}
                        to={paths.location(location.slug)}
                        style={{ '--location-bg': location.background }}
                    >
                        <h3 className="home-mobile-location__name">{location.name}</h3>
                        <ul className="home-mobile-location__keywords">
                            {location.keywords.map((keyword, index) => (
                                <li
                                    className={index < location.leadKeywords ? 'is-lead' : undefined}
                                    key={keyword}
                                >
                                    {keyword}
                                </li>
                            ))}
                        </ul>
                        <img
                            className="home-mobile-location__image"
                            src={location.image}
                            alt={location.alt}
                            width="399"
                            height="296"
                            loading="lazy"
                            decoding="async"
                        />
                        <dl className="home-mobile-location__info">
                            {location.info.map(([label, value]) => (
                                <div key={label}>
                                    <dt>{label}</dt>
                                    <dd>{value}</dd>
                                </div>
                            ))}
                        </dl>
                    </Link>
                ))}
            </div>
        </>
    );
}
