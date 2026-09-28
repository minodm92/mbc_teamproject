import promotionalVideo from '../assets/promotional-video.png';

const promotionalVideoUrl = 'https://youtu.be/PFf2gwcMDwI?si=gSPCtq9IZYukK7-q';

export default function PromotionalVideo() {
    return (
        <section className="newsroom-promo" aria-labelledby="newsroom-promo-title">
            <h2 className="newsroom-promo__title" id="newsroom-promo-title">
                PROMOTIONAL VIDEO
            </h2>
            <p className="newsroom-promo__description">
                일상 너머의 새로운 모빌리티 경험이
                <br />
                이곳에서 시작됩니다.
            </p>
            <a
                className="newsroom-promo__link"
                href={promotionalVideoUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="현대 모터스튜디오 프로모션 영상 새 창에서 재생"
            >
                <img src={promotionalVideo} alt="현대 모터스튜디오 전시 공간 영상" width="1720" height="415" />
            </a>
        </section>
    );
}
