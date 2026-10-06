import MobileHero from './MobileHero';
import MobileLocations from './MobileLocations';
import './HomeMobile.css';

// Mobile-only home (<=900px). The desktop .renewal-home stays mounted but hidden,
// and its scroll scenes only run from 901px (see gsap.matchMedia in HomeContent).
export default function HomeMobile() {
    return (
        <div className="home-mobile">
            <MobileHero />
            <MobileLocations />
        </div>
    );
}
