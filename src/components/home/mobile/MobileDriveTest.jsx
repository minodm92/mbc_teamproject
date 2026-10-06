import { Link } from 'react-router-dom';
import { paths } from '../../../common/router/routePaths';
import { mobileDriveTest } from './homeMobileData';

export default function MobileDriveTest() {
    return (
        <section className="home-mobile-drive" aria-labelledby="home-mobile-drive-title">
            <h2 className="home-mobile-title" id="home-mobile-drive-title">
                {mobileDriveTest.title}
            </h2>
            <ul className="home-mobile-drive__list">
                {mobileDriveTest.items.map((item) => (
                    <li key={item.title}>
                        <Link
                            className={`home-mobile-drive__item${item.meta ? ' is-featured' : ''}`}
                            to={paths.reservations}
                        >
                            {item.meta && (
                                <span className="home-mobile-drive__meta">
                                    {item.meta.map((text) => (
                                        <span key={text}>{text}</span>
                                    ))}
                                </span>
                            )}
                            <strong>{item.title}</strong>
                        </Link>
                    </li>
                ))}
            </ul>
        </section>
    );
}
