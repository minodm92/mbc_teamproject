import { Link } from 'react-router-dom';
import { paths } from '../../../common/router/routePaths';
import { mobileVehicles } from './homeMobileData';

export default function MobileVehicles() {
    return (
        <section className="home-mobile-vehicles" aria-labelledby="home-mobile-vehicles-title">
            <h2 className="home-mobile-title" id="home-mobile-vehicles-title">
                {mobileVehicles.title.map((line) => (
                    <span key={line}>{line}</span>
                ))}
            </h2>
            <ul className="home-mobile-vehicles__list">
                {mobileVehicles.items.map((vehicle) => (
                    <li key={vehicle.name}>
                        <Link className="home-mobile-vehicle" to={paths.mobility}>
                            <span className="home-mobile-vehicle__media">
                                <img
                                    className={vehicle.imageBox === 'contain' ? 'is-contain' : undefined}
                                    style={vehicle.imageBox === 'contain' ? undefined : vehicle.imageBox}
                                    src={vehicle.image}
                                    alt=""
                                    loading="lazy"
                                    decoding="async"
                                />
                            </span>
                            <span className="home-mobile-vehicle__location">{vehicle.location}</span>
                            <strong className="home-mobile-vehicle__name">{vehicle.name}</strong>
                        </Link>
                    </li>
                ))}
            </ul>
        </section>
    );
}
