import { forwardRef, useImperativeHandle, useLayoutEffect, useRef } from 'react';

import { homeAsset } from './homeAssets';
import { createThreeHelix, getThreeHelixCopyProgress } from './threeHelix';
import './SpiralGallery.css';

const spiralImages = [
    homeAsset('spiral-1.svg'),
    homeAsset('spiral-3.svg'),
    homeAsset('spiral-5.svg'),
    homeAsset('spiral-2.svg'),
    homeAsset('spiral-4.svg'),
    homeAsset('spiral-6.svg'),
    homeAsset('spiral-7.jpg'),
    homeAsset('spiral-8.jpg'),
];

const exhibitionLabels = [
    'The all-new AVANTE',
    '미니카 전시',
    'TCR 특별 전시',
    'GV60 마그마',
    'Community Studio',
    'Mobility Studio',
];

const labelPositions = [
    { left: 228, top: 496 },
    { left: 727, top: 496 },
    { left: 1232, top: 496 },
    { left: 228, top: 900 },
    { left: 727, top: 900 },
    { left: 1232, top: 900 },
];

const SpiralGallery = forwardRef(function SpiralGallery(_, ref) {
    const rootRef = useRef(null);
    const canvasRef = useRef(null);
    const engineRef = useRef(null);
    const progressRef = useRef(0);

    useImperativeHandle(ref, () => ({
        render(progress) {
            progressRef.current = progress;
            const copyProgress = getThreeHelixCopyProgress(progress);
            rootRef.current?.style.setProperty('--copy-progress', copyProgress);
            engineRef.current?.render(progress);
        },
        resize() {
            engineRef.current?.resize();
        },
        setActive(active) {
            engineRef.current?.setActive(active);
        },
    }), []);

    useLayoutEffect(() => {
        const root = rootRef.current;
        const canvas = canvasRef.current;
        if (!root || !canvas) return undefined;

        const media = window.matchMedia('(min-width: 901px) and (prefers-reduced-motion: no-preference)');
        let resizeObserver;

        const teardown = () => {
            resizeObserver?.disconnect();
            resizeObserver = undefined;
            engineRef.current?.dispose();
            engineRef.current = null;
            root.classList.remove('is-webgl-ready');
        };

        const setup = () => {
            teardown();
            if (!media.matches) return;
            try {
                engineRef.current = createThreeHelix(canvas, spiralImages);
                engineRef.current.render(progressRef.current);
                root.classList.add('is-webgl-ready');
                resizeObserver = new ResizeObserver(() => engineRef.current?.resize());
                resizeObserver.observe(root);
            } catch (error) {
                console.warn('Three.js helix gallery fallback enabled.', error);
            }
        };

        setup();
        media.addEventListener('change', setup);
        return () => {
            media.removeEventListener('change', setup);
            teardown();
        };
    }, []);

    return (
        <div ref={rootRef} className="spiral-gallery" aria-label="현재 전시 이미지 갤러리">
            <canvas ref={canvasRef} className="spiral-gallery__canvas" aria-hidden="true" />
            <div className="spiral-gallery__copy-layer" aria-live="polite">
                {exhibitionLabels.map((label, index) => (
                    <p
                        key={label}
                        style={{
                            '--copy-left': `${labelPositions[index].left / 19.2}%`,
                            '--copy-top': `${labelPositions[index].top / 10.8}%`,
                        }}
                    >
                        {label}
                    </p>
                ))}
            </div>
            <div className="spiral-gallery__static">
                {spiralImages.slice(0, 6).map((image, index) => (
                    <figure key={image}>
                        <img src={image} alt="" />
                        <figcaption>{exhibitionLabels[index]}</figcaption>
                    </figure>
                ))}
            </div>
        </div>
    );
});

export default SpiralGallery;
