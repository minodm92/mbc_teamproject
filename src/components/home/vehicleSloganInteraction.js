import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { withInstantScroll } from '../../common/utils/scrollPosition';
import { registerHomeScrollBoundary, setHomeScrollLocked } from './homeScrollControls';

export function setupVehicleSlogan(section) {
    const source = section.querySelector('h2');
    const cards = section.closest('main').querySelector('.renewal-vehicle-exhibition-card-list');
    const target = cards.querySelector('.renewal-vehicle-exhibition-card-list__header h2');
    const description = cards.querySelector('.renewal-vehicle-exhibition-card-list__header p');
    const lines = [...source.querySelectorAll('span')];

    let titleState = 'source';
    let descriptionVisible = false;
    let moving = false;
    let touchY = null;
    let titleTimeline;
    let floating;
    let sourceAnchor;
    let motion;
    let motionNeedsMeasure = true;
    let descriptionTween;

    const captureSourceAnchor = () => {
        const rect = source.getBoundingClientRect();
        sourceAnchor = { left: rect.left, top: rect.top };
    };
    const removeMotion = () => {
        titleTimeline?.kill();
        titleTimeline = null;
        motion = null;
        floating?.remove();
        floating = null;
    };
    const setDescription = (visible, immediate = false) => {
        descriptionVisible = visible;
        descriptionTween?.kill();
        if (immediate) gsap.set(description, { autoAlpha: visible ? 1 : 0 });
        else
            descriptionTween = gsap.to(description, {
                autoAlpha: visible ? 1 : 0,
                duration: 0.3,
                overwrite: true,
            });
    };
    const showSource = () => {
        titleState = 'source';
        moving = false;
        setHomeScrollLocked(false);
        gsap.set(source, { autoAlpha: 1 });
        gsap.set(target, { autoAlpha: 0 });
        gsap.set(floating, { autoAlpha: 0 });
        setDescription(false, true);
    };
    const showTarget = () => {
        titleState = 'target';
        moving = false;
        setHomeScrollLocked(false);
        gsap.set(source, { autoAlpha: 0 });
        gsap.set(target, { autoAlpha: 1 });
        const floatingRect = floating?.getBoundingClientRect();
        const targetRect = target.getBoundingClientRect();
        if (
            import.meta.env.DEV &&
            floatingRect &&
            (Math.abs(floatingRect.left - targetRect.left) > 1 ||
                Math.abs(floatingRect.top - targetRect.top) > 1)
        ) {
            console.warn('[vehicle slogan] title handoff position mismatch', {
                floating: { left: floatingRect.left, top: floatingRect.top },
                target: { left: targetRect.left, top: targetRect.top },
                pin: motion && { start: motion.pinStart, end: motion.pinEnd },
                scroll: motion && { start: motion.scrollStart, end: motion.scrollTarget },
            });
        }
        gsap.set(floating, { autoAlpha: 0 });
        setDescription(descriptionVisible, true);
    };

    const pin = ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: () => `+=${window.innerHeight * 0.5}`,
        pin: true,
        invalidateOnRefresh: true,
        onEnter: () => {
            if (titleState === 'source' && !moving) {
                captureSourceAnchor();
                motionNeedsMeasure = true;
                gsap.set(source, { autoAlpha: 1 });
                gsap.set(target, { autoAlpha: 0 });
                setDescription(false, true);
            }
        },
    });
    const getMotion = () => {
        const sourceRect = source.getBoundingClientRect();
        const targetRect = target.getBoundingClientRect();
        const sourcePosition = sourceAnchor || { left: sourceRect.left, top: sourceRect.top };
        const scrollStart = pin.start + 1;
        const cardsDocumentTop = cards.getBoundingClientRect().top + window.scrollY;
        const targetDocumentTop = targetRect.top + window.scrollY;
        const targetOffsetInCards = targetDocumentTop - cardsDocumentTop;
        const targetPosition = {
            left: targetRect.left,
            top: sourcePosition.top + targetOffsetInCards,
        };
        const scrollTarget = targetDocumentTop - targetPosition.top;
        return {
            pinStart: pin.start,
            pinEnd: pin.end,
            scrollStart,
            scrollTarget,
            sourcePosition,
            sourceDocumentTop: sourcePosition.top + scrollStart,
            targetDocumentTop,
            targetPosition,
        };
    };
    const handoffY = () => motion?.scrollTarget ?? getMotion().scrollTarget;
    const handoffTolerance = () => Math.max(12, window.innerHeight * 0.015);
    const isAtHandoff = () => Math.abs(window.scrollY - handoffY()) <= handoffTolerance();

    const createTimeline = (initialProgress = 0) => {
        removeMotion();
        motion = getMotion();
        const {
            sourcePosition,
            sourceDocumentTop,
            targetDocumentTop,
            targetPosition,
            scrollStart,
            scrollTarget,
        } = motion;
        const sourceRect = source.getBoundingClientRect();
        floating = source.cloneNode(true);
        floating.className = 'renewal-vehicle-exhibition-floating-title';
        floating.setAttribute('aria-hidden', 'true');
        document.body.appendChild(floating);
        gsap.set(floating, {
            position: 'fixed',
            left: sourcePosition.left,
            top: sourcePosition.top,
            width: sourceRect.width,
            margin: 0,
            zIndex: 100,
            autoAlpha: 1,
            font: getComputedStyle(source).font,
            color: getComputedStyle(source).color,
            pointerEvents: 'none',
        });
        const floatingLines = [...floating.querySelectorAll('span')];
        const offsets = lines.map((line) => {
            const range = document.createRange();
            range.selectNodeContents(line);
            return (sourceRect.width - range.getBoundingClientRect().width) / 2;
        });
        const progress = { value: 0 };
        const renderProgress = (value) => {
            const scrollY = gsap.utils.interpolate(scrollStart, scrollTarget, value);
            const titleDocumentY = gsap.utils.interpolate(
                sourceDocumentTop,
                targetDocumentTop,
                value
            );
            gsap.set(floating, {
                left: gsap.utils.interpolate(sourcePosition.left, targetPosition.left, value),
                top: titleDocumentY - scrollY,
            });
            floatingLines.forEach((line, index) =>
                gsap.set(line, {
                    clipPath: 'inset(0 0% 0 0)',
                    x: offsets[index] * (1 - value),
                })
            );
            return scrollY;
        };
        const applyProgress = () => {
            const scrollY = renderProgress(progress.value);
            withInstantScroll(() => window.scrollTo({ top: scrollY, left: window.scrollX }));
            ScrollTrigger.update();
        };
        titleTimeline = gsap
            .timeline({
                paused: true,
                onComplete: showTarget,
                onReverseComplete: showSource,
            })
            .to(progress, {
                value: 1,
                duration: 1.5,
                ease: 'power2.inOut',
                onUpdate: applyProgress,
            });
        if (initialProgress === 1) titleTimeline.progress(1, true);
        progress.value = initialProgress;
        // Creating or refreshing a timeline must only lay out the clone. The
        // document scroll is changed exclusively while its tween is playing.
        renderProgress(initialProgress);
        gsap.set(floating, { autoAlpha: 0 });
        motionNeedsMeasure = false;
    };
    const ensureTimeline = (direction) => {
        if (!titleTimeline || motionNeedsMeasure) createTimeline(direction > 0 ? 0 : 1);
    };
    const beginTitleTransition = (direction) => {
        ensureTimeline(direction);
        moving = true;
        titleState = 'transitioning';
        setHomeScrollLocked(true);
        if (direction < 0) setDescription(false);
        gsap.set([source, target], { autoAlpha: 0 });
        gsap.set(floating, { autoAlpha: 1 });
        if (direction > 0) titleTimeline.play();
        else titleTimeline.reverse();
    };
    const refreshMotion = () => {
        if (moving) return;
        motionNeedsMeasure = true;
        if (titleState === 'source' && pin.isActive) captureSourceAnchor();
    };
    ScrollTrigger.addEventListener('refresh', refreshMotion);

    const controlsInput = (direction) => {
        if (moving) return true;
        if (titleState === 'source') return pin.isActive && direction > 0;
        if (titleState === 'target' && isAtHandoff()) return direction < 0 || !descriptionVisible;
        return false;
    };
    const advance = (direction) => {
        if (moving) {
            if (direction > 0) titleTimeline.play();
            else titleTimeline.reverse();
            return;
        }
        if (titleState === 'source' && direction > 0) beginTitleTransition(1);
        else if (titleState === 'target' && direction < 0) beginTitleTransition(-1);
        else if (titleState === 'target' && direction > 0 && !descriptionVisible)
            setDescription(true);
    };
    const removeBoundary = registerHomeScrollBoundary(
        (from, to) => {
            if (moving) return to;
            if (titleState === 'source' && to > from && from <= pin.end && to >= pin.start) {
                return Math.min(to, pin.start + 1);
            }
            const anchor = handoffY();
            const tolerance = handoffTolerance();
            if (titleState === 'target' && to < from && from >= anchor - tolerance && to <= anchor)
                return anchor;
            if (
                titleState === 'target' &&
                !descriptionVisible &&
                to > from &&
                from <= anchor + tolerance &&
                to >= anchor
            )
                return anchor;
            return to;
        },
        () => [pin.start, handoffY()]
    );
    const wheel = (event) => {
        if (event.ctrlKey || !event.deltaY || Math.abs(event.deltaX) > Math.abs(event.deltaY))
            return;
        const direction = Math.sign(event.deltaY);
        if (!controlsInput(direction)) return;
        event.preventDefault();
        advance(direction);
    };
    const key = (event) => {
        if (
            event.defaultPrevented ||
            event.ctrlKey ||
            event.altKey ||
            event.metaKey ||
            event.target?.closest?.('input, textarea, select, button, a, [contenteditable]')
        )
            return;
        const direction = {
            ArrowDown: 1,
            PageDown: 1,
            ArrowUp: -1,
            PageUp: -1,
            ' ': event.shiftKey ? -1 : 1,
        }[event.key];
        if (!direction || !controlsInput(direction)) return;
        event.preventDefault();
        if (!event.repeat) advance(direction);
    };
    const touchStart = (event) => {
        touchY = event.touches.length === 1 ? event.touches[0].clientY : null;
    };
    const touchMove = (event) => {
        if (touchY === null || event.touches.length !== 1) return;
        const delta = touchY - event.touches[0].clientY;
        const direction = Math.sign(delta);
        if (Math.abs(delta) <= 20 || !controlsInput(direction)) return;
        event.preventDefault();
        touchY = null;
        advance(direction);
    };

    window.addEventListener('wheel', wheel, { passive: false, capture: true });
    window.addEventListener('keydown', key, { capture: true });
    window.addEventListener('touchstart', touchStart, { passive: true });
    window.addEventListener('touchmove', touchMove, { passive: false });
    return () => {
        removeBoundary();
        ScrollTrigger.removeEventListener('refresh', refreshMotion);
        window.removeEventListener('wheel', wheel, true);
        window.removeEventListener('keydown', key, true);
        window.removeEventListener('touchstart', touchStart);
        window.removeEventListener('touchmove', touchMove);
        descriptionTween?.kill();
        removeMotion();
        setHomeScrollLocked(false);
        pin.kill();
        lines.forEach((line) => line.style.removeProperty('clip-path'));
        [source, target, description].forEach((node) => {
            node.style.removeProperty('opacity');
            node.style.removeProperty('visibility');
        });
    };
}
