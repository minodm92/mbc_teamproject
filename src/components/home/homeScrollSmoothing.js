const DESKTOP_QUERY = '(min-width: 901px) and (prefers-reduced-motion: no-preference)';
const SCROLL_RESPONSE_MS = 8;
const WHEEL_DISTANCE_RATIO = 1;
const SCROLL_KEYS = new Set(['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' ']);
let homeScrollLocked = false;
let homeWheelDistanceRatio = WHEEL_DISTANCE_RATIO;

export const setHomeScrollLocked = (locked) => {
    homeScrollLocked = locked;
    window.dispatchEvent(new Event('home-scroll-lock-change'));
};

export const setHomeWheelDistanceRatio = (ratio = WHEEL_DISTANCE_RATIO) => {
    homeWheelDistanceRatio = Number.isFinite(ratio) ? ratio : WHEEL_DISTANCE_RATIO;
    window.dispatchEvent(new Event('home-scroll-ratio-change'));
};

const getMaximumScroll = () =>
    Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

const canNestedElementScroll = (target, deltaY) => {
    let element = target instanceof Element ? target : null;

    while (element && element !== document.body && element !== document.documentElement) {
        const { overflowY } = window.getComputedStyle(element);
        const isScrollable =
            /(auto|scroll)/.test(overflowY) && element.scrollHeight > element.clientHeight;

        if (isScrollable) {
            const canScrollDown =
                deltaY > 0 && element.scrollTop + element.clientHeight < element.scrollHeight;
            const canScrollUp = deltaY < 0 && element.scrollTop > 0;
            if (canScrollDown || canScrollUp) return true;
        }

        element = element.parentElement;
    }

    return false;
};

export const setupHomeScrollSmoothing = () => {
    const media = window.matchMedia(DESKTOP_QUERY);
    let animationFrame = 0;
    let currentScroll = window.scrollY;
    let targetScroll = currentScroll;
    let previousTime = performance.now();
    let writingScroll = false;

    const stopAnimation = () => {
        cancelAnimationFrame(animationFrame);
        animationFrame = 0;
        currentScroll = window.scrollY;
        targetScroll = currentScroll;
    };

    const render = (time) => {
        const elapsed = Math.min(64, time - previousTime);
        previousTime = time;
        const response = 1 - Math.exp(-elapsed / SCROLL_RESPONSE_MS);
        currentScroll += (targetScroll - currentScroll) * response;

        if (Math.abs(targetScroll - currentScroll) < 0.35) currentScroll = targetScroll;

        writingScroll = true;
        window.scrollTo(0, currentScroll);
        writingScroll = false;

        if (currentScroll !== targetScroll) {
            animationFrame = requestAnimationFrame(render);
        } else {
            animationFrame = 0;
        }
    };

    const handleWheel = (event) => {
        if (homeScrollLocked) {
            event.preventDefault();
            return;
        }

        if (
            !media.matches ||
            event.defaultPrevented ||
            event.ctrlKey ||
            Math.abs(event.deltaY) <= Math.abs(event.deltaX) ||
            canNestedElementScroll(event.target, event.deltaY)
        ) {
            return;
        }

        event.preventDefault();
        const deltaUnit =
            event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1;
        const maximumScroll = getMaximumScroll();

        if (!animationFrame) currentScroll = window.scrollY;
        targetScroll = Math.min(
            maximumScroll,
            Math.max(0, targetScroll + event.deltaY * deltaUnit * homeWheelDistanceRatio)
        );
        previousTime = performance.now();

        if (!animationFrame) animationFrame = requestAnimationFrame(render);
    };

    const handleNativeScroll = () => {
        if (!writingScroll && !animationFrame) {
            currentScroll = window.scrollY;
            targetScroll = currentScroll;
        }
    };

    const handleMediaChange = () => {
        if (!media.matches) stopAnimation();
    };

    const handleScrollLockChange = () => {
        if (homeScrollLocked) stopAnimation();
    };

    const handleKeyDown = (event) => {
        stopAnimation();
        const tagName = event.target?.tagName;
        const isEditable =
            event.target?.isContentEditable ||
            tagName === 'INPUT' ||
            tagName === 'TEXTAREA' ||
            tagName === 'SELECT';

        if (homeScrollLocked && !isEditable && SCROLL_KEYS.has(event.key)) {
            event.preventDefault();
        }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('scroll', handleNativeScroll, { passive: true });
    window.addEventListener('keydown', handleKeyDown, { passive: false });
    window.addEventListener('pointerdown', stopAnimation);
    window.addEventListener('home-scroll-lock-change', handleScrollLockChange);
    window.addEventListener('home-scroll-ratio-change', stopAnimation);
    media.addEventListener('change', handleMediaChange);

    return () => {
        stopAnimation();
        window.removeEventListener('wheel', handleWheel);
        window.removeEventListener('scroll', handleNativeScroll);
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('pointerdown', stopAnimation);
        window.removeEventListener('home-scroll-lock-change', handleScrollLockChange);
        window.removeEventListener('home-scroll-ratio-change', stopAnimation);
        media.removeEventListener('change', handleMediaChange);
    };
};
