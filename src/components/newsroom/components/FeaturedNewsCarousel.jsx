import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import FeaturedNewsCard from './FeaturedNewsCard';

const MOBILE_QUERY = '(max-width: 1100px)';
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
const AUTO_DELAY = 3000;
const SLIDE_MS = 500;
const DRAG_START = 6;
const SWIPE_RATIO = 0.2;

function useMediaQuery(query) {
    const [matches, setMatches] = useState(() => window.matchMedia(query).matches);
    useEffect(() => {
        const media = window.matchMedia(query);
        const update = () => setMatches(media.matches);
        update();
        media.addEventListener('change', update);
        return () => media.removeEventListener('change', update);
    }, [query]);
    return matches;
}

// Mobile (≤1100px): the track slides one card left every 3s and loops through clones of the cards.
// Desktop: the track is `display: contents` and the clones are hidden, so the cards lay out as before.
export default function FeaturedNewsCarousel({ articles }) {
    const viewportRef = useRef(null);
    const trackRef = useRef(null);
    const dragRef = useRef(null);
    const suppressClickRef = useRef(false);
    const isMobile = useMediaQuery(MOBILE_QUERY);
    const reducedMotion = useMediaQuery(REDUCED_MOTION_QUERY);
    const [index, setIndex] = useState(0);
    const [animate, setAnimate] = useState(false);
    const [dragX, setDragX] = useState(0);
    const [step, setStep] = useState(0);
    const [cardWidth, setCardWidth] = useState(0);
    const [inView, setInView] = useState(true);
    const [pageVisible, setPageVisible] = useState(() => document.visibilityState === 'visible');
    const [holding, setHolding] = useState(false);
    const [focused, setFocused] = useState(false);
    const count = articles.length;

    // One step = rendered card width + gap, unrounded (offsetLeft would round 255.83 to 256 at 390px and drift).
    useLayoutEffect(() => {
        if (!isMobile) return undefined;
        const track = trackRef.current;
        const measure = () => {
            const width = track.children[0].getBoundingClientRect().width;
            setCardWidth(width);
            setStep(width + (parseFloat(getComputedStyle(track).columnGap) || 0));
        };
        measure();
        const observer = new ResizeObserver(measure);
        observer.observe(viewportRef.current);
        observer.observe(track.children[0]);
        return () => observer.disconnect();
    }, [isMobile]);

    useEffect(() => {
        if (isMobile) return;
        setIndex(0);
        setDragX(0);
        setAnimate(false);
    }, [isMobile]);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting));
        observer.observe(viewportRef.current);
        const onVisibility = () => setPageVisible(document.visibilityState === 'visible');
        document.addEventListener('visibilitychange', onVisibility);
        return () => {
            observer.disconnect();
            document.removeEventListener('visibilitychange', onVisibility);
        };
    }, []);

    const autoplay = isMobile && !reducedMotion && inView && pageVisible && !holding && !focused && step > 0;
    useEffect(() => {
        if (!autoplay) return undefined;
        const timer = setTimeout(() => {
            setAnimate(true);
            setIndex((current) => current + 1);
        }, AUTO_DELAY);
        return () => clearTimeout(timer);
    }, [autoplay, index]);

    // After sliding onto a clone: transition off, jump to the matching real card, re-enable two frames later.
    const handleTransitionEnd = (event) => {
        if (event.target !== trackRef.current || event.propertyName !== 'transform') return;
        if (index >= count) {
            setAnimate(false);
            setIndex(index - count);
            requestAnimationFrame(() => requestAnimationFrame(() => setAnimate(true)));
        }
    };

    const handlePointerDown = (event) => {
        if (!isMobile || step <= 0 || (event.pointerType === 'mouse' && event.button !== 0)) return;
        // Freeze where the track is right now (it may be mid-slide). Card 0 and its clone at `count` look the same,
        // so position 0 is moved to `count` to leave a card on the left for a right swipe.
        const currentX = new DOMMatrix(getComputedStyle(trackRef.current).transform).m41;
        let position = -currentX / step;
        if (Math.round(position) <= 0) position += count;
        else if (Math.round(position) > count) position -= count;
        const nearest = Math.round(position);
        const base = (nearest - position) * step;
        setAnimate(false);
        setIndex(nearest);
        setDragX(base);
        dragRef.current = { id: event.pointerId, startX: event.clientX, startY: event.clientY, base, dx: 0, active: false };
        setHolding(true);
    };

    const settle = (offset) => {
        const threshold = cardWidth * SWIPE_RATIO;
        if (offset < -threshold) setIndex((current) => current + 1);
        else if (offset > threshold) setIndex((current) => current - 1);
        setAnimate(true);
        setDragX(0);
    };

    const handlePointerMove = (event) => {
        const drag = dragRef.current;
        if (!drag || drag.id !== event.pointerId) return;
        const dx = event.clientX - drag.startX;
        const dy = event.clientY - drag.startY;
        if (!drag.active) {
            if (Math.abs(dx) > DRAG_START && Math.abs(dx) > Math.abs(dy)) {
                drag.active = true;
                viewportRef.current.setPointerCapture(event.pointerId);
            } else if (Math.abs(dy) > DRAG_START) {
                dragRef.current = null;
                settle(0);
                setHolding(false);
                return;
            } else {
                return;
            }
        }
        drag.dx = dx;
        setDragX(drag.base + dx);
    };

    const handlePointerEnd = (event) => {
        const drag = dragRef.current;
        if (!drag || drag.id !== event.pointerId) return;
        dragRef.current = null;
        if (drag.active) {
            suppressClickRef.current = true;
            setTimeout(() => { suppressClickRef.current = false; }, 100);
        }
        settle(drag.active ? drag.base + drag.dx : 0);
        setHolding(false);
    };

    // A swipe that ends on a card must not open it.
    const handleClickCapture = (event) => {
        if (!suppressClickRef.current) return;
        event.preventDefault();
        event.stopPropagation();
        suppressClickRef.current = false;
    };

    // Keyboard focus: stop rolling and bring the focused card into place (the viewport itself must not scroll).
    const handleFocus = (event) => {
        if (!isMobile || !event.target.matches(':focus-visible')) return;
        setFocused(true);
        const card = event.target.closest('.newsroom-feature-card');
        const position = [...trackRef.current.children].indexOf(card);
        if (position >= 0 && position < count) {
            setAnimate(true);
            setIndex(position);
        }
        viewportRef.current.scrollLeft = 0;
    };

    const handleBlur = (event) => {
        if (!viewportRef.current.contains(event.relatedTarget)) setFocused(false);
    };

    // Position is always index × step (never accumulated); ease-out has no overshoot.
    const trackStyle = isMobile
        ? {
            transform: `translate3d(${-index * step + dragX}px, 0, 0)`,
            transition: animate ? `transform ${SLIDE_MS}ms ease-out` : 'none',
        }
        : undefined;

    return (
        <div
            ref={viewportRef}
            className="newsroom-featured"
            aria-label="주요 뉴스"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerEnd}
            onPointerCancel={handlePointerEnd}
            onClickCapture={handleClickCapture}
            onDragStart={(event) => event.preventDefault()}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onScroll={(event) => { event.currentTarget.scrollLeft = 0; }}
        >
            <div ref={trackRef} className="newsroom-featured__track" style={trackStyle} onTransitionEnd={handleTransitionEnd}>
                {articles.map((article) => (
                    <FeaturedNewsCard key={article.id} article={article} />
                ))}
                {articles.map((article) => (
                    <FeaturedNewsCard key={`${article.id}-clone`} article={article} isClone />
                ))}
            </div>
        </div>
    );
}
