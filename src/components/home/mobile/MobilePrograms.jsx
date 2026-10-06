import { Link } from 'react-router-dom';
import { paths } from '../../../common/router/routePaths';
import { mobilePrograms } from './homeMobileData';

export default function MobilePrograms() {
    return (
        <section className="home-mobile-programs" aria-labelledby="home-mobile-programs-title">
            <h2 className="home-mobile-title" id="home-mobile-programs-title">
                {mobilePrograms.title}
            </h2>
            <ul className="home-mobile-programs__list">
                {mobilePrograms.items.map((program) => (
                    <li key={program.title}>
                        <Link className="home-mobile-program" to={paths.programs}>
                            <img
                                src={program.image}
                                alt=""
                                width="399"
                                height="263"
                                loading="lazy"
                                decoding="async"
                            />
                            <span>{program.title}</span>
                        </Link>
                    </li>
                ))}
            </ul>
        </section>
    );
}
