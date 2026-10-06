import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { withInstantScroll } from '../../common/utils/scrollPosition';

const SCROLL_KEYS = new Set(['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' ']);
let homeScrollLocked = false;
const boundaries = new Set();
let stopScrollMotion;

export const registerHomeScrollBoundary = (guard, getRange) => {
    const boundary = { guard, getRange };
    boundaries.add(boundary);
    return () => boundaries.delete(boundary);
};

export const setHomeScrollLocked = (locked) => {
    homeScrollLocked = locked;
    if (locked) stopScrollMotion?.();
};

// Only timed holds need managed input; ordinary scrolling remains native.
export const setupHomeScrollControls = () => {
    let motion;
    let touch;
    const stopMotion = () => {
        motion?.kill();
        motion = null;
        if (touch) touch.blocked = true;
    };
    stopScrollMotion = stopMotion;
    const hasNestedScroll = (event, delta) => {
        for (let node = event.target; node && node !== document.body; node = node.parentElement) {
            if (!(node instanceof HTMLElement)) continue;
            const overflow = getComputedStyle(node).overflowY;
            if (!/auto|scroll/.test(overflow) || node.scrollHeight <= node.clientHeight) continue;
            if (delta < 0 ? node.scrollTop > 0 : node.scrollTop + node.clientHeight < node.scrollHeight - 1) return true;
        }
        return false;
    };
    const intersectsHold = (target) => {
        const from = Math.min(window.scrollY, target);
        const to = Math.max(window.scrollY, target);
        return [...boundaries].some(({ getRange }) => {
            const [start, end] = getRange();
            return to >= start && from <= end;
        });
    };
    const constrainTarget = (target) => {
        const from = window.scrollY;
        for (const { guard } of boundaries) target = guard(from, target);
        return target;
    };
    const moveTo = (target) => {
        if (homeScrollLocked) return false;
        target = constrainTarget(target);
        withInstantScroll(() => window.scrollTo({ top: target, left: window.scrollX }));
        ScrollTrigger.update();
        return !homeScrollLocked;
    };
    const animateTo = (target, duration, ease) => {
        motion?.kill();
        const position = { y: window.scrollY };
        motion = gsap.to(position, {
            y: target, duration, ease,
            onUpdate: () => { if (!moveTo(position.y)) stopMotion(); },
            onComplete: () => { motion = null; },
        });
    };
    const handleWheel = (event) => {
        if (event.ctrlKey) return;
        if (homeScrollLocked) {
            event.preventDefault();
            return;
        }
        if (event.defaultPrevented || !event.cancelable || !event.deltaY || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
        motion?.kill();
        motion = null;
        const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1;
        const delta = event.deltaY * unit;
        if (hasNestedScroll(event, delta)) return;
        const target = window.scrollY + delta;
        const constrained = constrainTarget(target);
        if (constrained === target) return;
        event.preventDefault();
        stopMotion();
        moveTo(constrained);
    };
    const handleTouchStart = (event) => {
        motion?.kill();
        touch = event.touches.length === 1 ? { x: event.touches[0].clientX, y: event.touches[0].clientY, time: performance.now(), velocity: 0, controlled: false, blocked: homeScrollLocked, native: false } : null;
    };
    const handleTouchMove = (event) => {
        if (event.touches.length !== 1) { touch = null; return; }
        if (homeScrollLocked) {
            event.preventDefault();
            if (touch) touch.blocked = true;
            return;
        }
        if (!touch || event.defaultPrevented) return;
        if (touch.native) return;
        if (touch.blocked) { event.preventDefault(); return; }
        const y = event.touches[0].clientY;
        const x = event.touches[0].clientX;
        const now = performance.now();
        const delta = touch.y - y;
        if (!touch.controlled && Math.abs(x - touch.x) > Math.abs(delta)) { touch.native = true; return; }
        const elapsed = Math.max(1, now - touch.time);
        touch.y = y;
        touch.time = now;
        if (hasNestedScroll(event, delta) || (!touch.controlled && !intersectsHold(window.scrollY + delta))) return;
        touch.controlled = true;
        touch.velocity = delta / elapsed;
        event.preventDefault();
        moveTo(window.scrollY + delta);
    };
    const handleTouchEnd = () => {
        if (touch?.controlled && !touch.blocked && !homeScrollLocked && performance.now() - touch.time < 80) {
            const velocity = Math.max(-3, Math.min(3, touch.velocity));
            if (Math.abs(velocity) > 0.1) animateTo(window.scrollY + velocity * 200, 0.4, 'power2.out');
        }
        touch = null;
    };
    const handleTouchCancel = () => { stopMotion(); touch = null; };

    const handleKeyDown = (event) => {
        const tagName = event.target?.tagName;
        const isEditable =
            event.target?.isContentEditable ||
            tagName === 'INPUT' ||
            tagName === 'TEXTAREA' ||
            tagName === 'SELECT';

        if (isEditable || !SCROLL_KEYS.has(event.key) || event.ctrlKey || event.altKey || event.metaKey) return;
        if (homeScrollLocked) {
            event.preventDefault();
            return;
        }
        // Preserve activation keys on buttons and links.
        if (event.defaultPrevented || event.target?.closest?.('button, a, [role="button"]')) return;
        const page = window.innerHeight * 0.875;
        const distances = { ArrowDown: 40, ArrowUp: -40, PageDown: page, PageUp: -page, ' ': event.shiftKey ? -page : page };
        const target = event.key === 'Home' ? 0 : event.key === 'End' ? document.documentElement.scrollHeight - window.innerHeight : window.scrollY + distances[event.key];
        if (hasNestedScroll(event, target - window.scrollY) || !intersectsHold(target)) return;
        event.preventDefault();
        animateTo(target, 0.18, 'power2.out');
    };

    window.addEventListener('wheel', handleWheel, { passive: false, capture: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('keydown', handleKeyDown, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('touchcancel', handleTouchCancel);
    window.addEventListener('pointerdown', stopMotion, { passive: true });

    return () => {
        stopMotion();
        if (stopScrollMotion === stopMotion) stopScrollMotion = null;
        window.removeEventListener('wheel', handleWheel, true);
        window.removeEventListener('touchstart', handleTouchStart);
        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('touchend', handleTouchEnd);
        window.removeEventListener('touchcancel', handleTouchCancel);
        window.removeEventListener('pointerdown', stopMotion);
    };
};
