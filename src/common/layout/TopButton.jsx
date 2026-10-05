import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import arrow from '../../assets/images/home-renewal/top-arrow.svg';
import './TopButton.css';

const SCROLL_THRESHOLD = 750;

function backgroundIsDark(element) {
    const section = element.closest('[data-top-button-theme], section, footer');
    const explicitTheme = section?.getAttribute('data-top-button-theme');
    if (explicitTheme) return explicitTheme === 'dark';
    // These existing home sections display dark video/photo backgrounds.
    if (section?.matches('.renewal-hero, .renewal-intro, .renewal-experience')) return true;
    let color = [255, 255, 255];
    const layers = [];
    for (let current = element; current; current = current.parentElement) {
        const values = getComputedStyle(current).backgroundColor.match(/[\d.]+/g)?.map(Number);
        if (values?.length >= 3) layers.push(values);
    }
    for (const [red, green, blue, alpha = 1] of layers.reverse()) {
        color = [red, green, blue].map((value, index) => value * alpha + color[index] * (1 - alpha));
    }
    return color[0] * 0.2126 + color[1] * 0.7152 + color[2] * 0.0722 < 145;
}

export default function TopButton() {
    const { pathname } = useLocation();
    const buttonRef = useRef(null);
    const [visible, setVisible] = useState(false);
    const [darkBackground, setDarkBackground] = useState(false);
    const excludedPage = /^\/(login|signup|membership|notices)(\/|$)/.test(pathname);

    useEffect(() => {
        let frame = 0;
        const update = () => {
            frame = 0;
            const height = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
            const minimumHeight = Math.min(3000, Math.max(2200, window.innerHeight * 2.5));
            const longPage = height >= minimumHeight && height - window.innerHeight >= Math.max(1000, window.innerHeight);
            setVisible(!excludedPage && longPage && window.scrollY >= SCROLL_THRESHOLD);
            const button = buttonRef.current;
            if (!button) return;
            const rect = button.getBoundingClientRect();
            const element = document.elementsFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2)
                .find(candidate => !button.contains(candidate) && candidate !== button && !candidate.closest('.site-header'));
            if (element) setDarkBackground(backgroundIsDark(element));
        };
        const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
        const resizeObserver = new ResizeObserver(schedule);
        resizeObserver.observe(document.body);
        resizeObserver.observe(document.documentElement);
        const mutationObserver = new MutationObserver(schedule);
        mutationObserver.observe(document.getElementById('root'), { childList: true, subtree: true });
        window.addEventListener('scroll', schedule, { passive: true });
        window.addEventListener('resize', schedule);
        document.addEventListener('load', schedule, true);
        schedule();
        return () => {
            cancelAnimationFrame(frame);
            resizeObserver.disconnect();
            mutationObserver.disconnect();
            window.removeEventListener('scroll', schedule);
            window.removeEventListener('resize', schedule);
            document.removeEventListener('load', schedule, true);
        };
    }, [pathname, excludedPage]);

    return <button ref={buttonRef} className={`site-top-button site-top-button--${darkBackground ? 'light' : 'dark'}${visible && !excludedPage ? ' is-visible' : ''}`}
        type="button" aria-label="페이지 맨 위로 이동" aria-hidden={!visible || excludedPage} tabIndex={visible && !excludedPage ? 0 : -1}
        onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })}>
        <img src={arrow} alt="" />
        <span>TOP</span>
    </button>;
}
