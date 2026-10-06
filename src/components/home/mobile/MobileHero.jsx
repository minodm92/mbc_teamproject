import { mobileHero } from './homeMobileData';

export default function MobileHero() {
    return (
        <section className="home-mobile-hero" aria-label="현대 모터스튜디오 메인 비주얼">
            <h1 className="home-mobile-hero__title">
                <img src={mobileHero.logotype} alt={mobileHero.title} width="400" height="98" />
            </h1>
            <div className="home-mobile-hero__media">
                <img src={mobileHero.image} alt={mobileHero.imageAlt} width="410" height="230" />
            </div>
        </section>
    );
}
