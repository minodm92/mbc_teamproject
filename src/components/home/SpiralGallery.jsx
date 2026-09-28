import './SpiralGallery.css';

import { homeAsset } from './homeAssets';

const spiralImages = [
    homeAsset('spiral-1.svg'),
    homeAsset('spiral-2.svg'),
    homeAsset('spiral-3.svg'),
    homeAsset('spiral-4.svg'),
    homeAsset('spiral-5.svg'),
    homeAsset('spiral-6.svg'),
];

// 같은 6장만 사용하되, 끊어지지 않는 카드 띠를 만들기 위해 두 바퀴에 배치한다.
const beltImages = [...spiralImages, ...spiralImages];
const sliceCount = 24;

export default function SpiralGallery() {
    return (
        <div className="spiral-gallery" aria-label="현재 전시 이미지 갤러리">
            <div className="spiral-gallery__stage" aria-hidden="true">
                {beltImages.flatMap((image, index) =>
                    Array.from({ length: sliceCount }, (_, slice) => (
                        <span
                            className="spiral-gallery__slice"
                            key={`${index}-${slice}`}
                            data-card={index}
                            data-slice={slice}
                            data-slices={sliceCount}
                            style={{ backgroundImage: `url("${image}")` }}
                        />
                    ))
                )}
            </div>
            <div className="spiral-gallery__static">
                {spiralImages.map((image) => <img key={image} src={image} alt="" />)}
            </div>
        </div>
    );
}
