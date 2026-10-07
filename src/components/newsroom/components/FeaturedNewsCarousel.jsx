import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import FeaturedNewsCard from './FeaturedNewsCard';

const MOBILE_QUERY = '(max-width: 1100px)';
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
const AUTO_DELAY = 3000;
const SLIDE_MS = 500;
const DRAG_START = 6;

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
    const [inView, setInView] = useState(true);
    const [pageVisible, setPageVisible] = useState(() => document.visibilityState === 'visible');
    const [holding, setHolding] = useState(false);
    const [focused, setFocused] = useState(false);
    const count = articles.length;

    // One step = card width + gap, measured so it follows the fluid card width.
    useLayoutEffect(() => {
        if (!isMobile) return undefined;
        const measure = () => {
            const [first, second] = trackRef.current?.children ?? [];
            if (first && second) setStep(second.offsetLeft - first.offsetLeft);
        };
        measure();
        const observer = new ResizeObserver(measure);
        observer.observe(viewportRef.current);
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

    // After sliding onto a clone, jump back to the matching real card without animation.
    const handleTransitionEnd = (event) => {
        if (event.target !== trackRef.current || event.propertyName !== 'transform') return;
        if (index >= count) {
            setAnimate(false);
            setIndex(index - count);
        }
    };

    const handlePointerDown = (event) => {
        if (!isMobile || (event.pointerType === 'mouse' && event.button !== 0)) return;
        // Card 0 and its clone at `count` look the same; starting from the clone lets a right swipe reveal the last card.
        setAnimate(false);
        setIndex((current) => (current % count === 0 ? count : current % count));
        dragRef.current = { id: event.pointerId, startX: event.clientX, startY: event.clientY, dx: 0, active: false };
        setHolding(true);
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
                setHolding(false);
                return;
            } else {
                return;
            }
        }
        drag.dx = dx;
        setDragX(dx);
    };

    const handlePointerEnd = (event) => {
        const drag = dragRef.current;
        if (!drag || drag.id !== event.pointerId) return;
        dragRef.current = null;
        if (drag.active) {
            suppressClickRef.current = true;
            setTimeout(() => { suppressClickRef.current = false; }, 100);
            const threshold = step * 0.2;
            if (drag.dx < -threshold) setIndex((current) => current + 1);
            else if (drag.dx > threshold) setIndex((current) => current - 1);
            setAnimate(true);
            setDragX(0);
        }
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

    const trackStyle = isMobile
        ? {
            transform: `translate3d(${-index * step + dragX}px, 0, 0)`,
            transition: animate ? `transform ${SLIDE_MS}ms ease` : 'none',
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
