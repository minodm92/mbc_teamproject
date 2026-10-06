import { Fragment } from 'react';
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
            {/* Name bars and bodies are siblings so every bar sticks to this wrapper:
                the bars stack up while scrolling and leave together when it ends. */}
            <div
                className="home-mobile-locations"
                style={{ '--hm-stack-count': mobileLocations.length }}
            >
                {mobileLocations.map((location, index) => {
                    const to = paths.location(location.slug);
                    const style = { '--i': index, '--location-bg': location.background };
                    return (
                        <Fragment key={location.slug}>
                            <h3
                                className={`home-mobile-location__bar is-${location.theme}`}
                                style={style}
                            >
                                <Link to={to}>{location.name}</Link>
                            </h3>
                            {/* Same destination as the name link, so it stays out of the tab order. */}
                            <Link
                                className={`home-mobile-location is-${location.theme}`}
                                style={style}
                                to={to}
                                tabIndex={-1}
                            >
                                <ul className="home-mobile-location__keywords">
                                    {location.keywords.map((keyword, keywordIndex) => (
                                        <li
                                            className={
                                                keywordIndex < location.leadKeywords
                                                    ? 'is-lead'
                                                    : undefined
                                            }
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
                        </Fragment>
                    );
                })}
            </div>
        </>
    );
}
