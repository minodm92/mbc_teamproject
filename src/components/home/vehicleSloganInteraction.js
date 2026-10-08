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
    // Blank, first scroll, first line, second line, hold, joined title, description.
    let stage = 0;
    let busy = false;
    let moving = false;
    let lastInput = 0;
    let touchY = null;
    let animation;
    let floating;
    const joinedY = () => cards.getBoundingClientRect().top + window.scrollY;
    const setPresentation = () => {
        gsap.set(source, { autoAlpha: stage < 5 ? 1 : 0 });
        gsap.set(target, { autoAlpha: stage >= 5 ? 1 : 0 });
        gsap.set(description, { autoAlpha: stage >= 6 ? 1 : 0 });
        lines.forEach((line, index) => gsap.set(line, {
            clipPath: stage >= index + 2 ? 'inset(0 0% 0 0)' : 'inset(0 100% 0 0)',
        }));
    };
    const finish = (nextStage) => {
        stage = nextStage;
        setPresentation();
        floating?.remove();
        floating = null;
        moving = false;
        busy = false;
        setHomeScrollLocked(false);
        lastInput = performance.now();
    };
    const pin = ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: () => `+=${window.innerHeight * 0.5}`,
        pin: true,
        invalidateOnRefresh: true,
        onEnter: () => { if (!moving) setPresentation(); lastInput = performance.now(); },
        onEnterBack: () => {
            if (moving) return;
            if (stage >= 5) stage = 4;
            setPresentation();
            lastInput = performance.now();
        },
        onLeave: () => {
            // Restore readable content when the scrollbar skips the controlled steps.
            if (!moving && stage < 5) {
                animation?.kill();
                finish(6);
            }
        },
    });
    const moveTitle = (forward) => {
        moving = true;
        const sourceRect = source.getBoundingClientRect();
        const targetRect = target.getBoundingClientRect();
        const scrollTarget = forward ? joinedY() : pin.start + 1;
        const centered = {
            left: sourceRect.left,
            top: (section.offsetHeight - sourceRect.height) / 2,
        };
        const destination = forward
            ? { left: targetRect.left, top: targetRect.top + window.scrollY - scrollTarget }
            : centered;
        const initial = forward ? centered : targetRect;
        floating = source.cloneNode(true);
        floating.className = 'renewal-vehicle-exhibition-floating-title';
        floating.setAttribute('aria-hidden', 'true');
        document.body.appendChild(floating);
        gsap.set(floating, {
            position: 'fixed', left: initial.left, top: initial.top,
            width: sourceRect.width, margin: 0, zIndex: 100, autoAlpha: 1,
            font: getComputedStyle(source).font, color: getComputedStyle(source).color,
            pointerEvents: 'none',
        });
        const floatingLines = [...floating.querySelectorAll('span')];
        const offsets = lines.map((line) => {
            const range = document.createRange();
            range.selectNodeContents(line);
            return (sourceRect.width - range.getBoundingClientRect().width) / 2;
        });
        floatingLines.forEach((line, index) => gsap.set(line, {
            clipPath: 'inset(0 0% 0 0)', x: forward ? offsets[index] : 0,
        }));
        gsap.set([source, target], { autoAlpha: 0 });
        const position = { y: window.scrollY };
        animation = gsap.timeline({ onComplete: () => finish(forward ? 5 : 4) })
            .to(position, {
                y: scrollTarget, duration: 1.5, ease: 'power2.inOut',
                onUpdate: () => {
                    withInstantScroll(() => window.scrollTo({ top: position.y, left: window.scrollX }));
                    ScrollTrigger.update();
                },
            }, 0)
            .to(floating, { ...destination, duration: 1.5, ease: 'power2.inOut' }, 0)
            .to(floatingLines, {
                x: (index) => forward ? 0 : offsets[index],
                duration: 1.5, ease: 'power2.inOut',
            }, 0);
    };
    const advance = (direction) => {
        if (busy) return;
        const nextStage = Math.max(0, Math.min(6, stage + direction));
        if (nextStage === stage) return;
        busy = true;
        setHomeScrollLocked(true);
        if ((stage === 4 && nextStage === 5) || (stage === 5 && nextStage === 4)) {
            moveTitle(direction > 0);
            return;
        }
        if ((stage === 5 && nextStage === 6) || (stage === 6 && nextStage === 5)) {
            animation = gsap.to(description, {
                autoAlpha: nextStage === 6 ? 1 : 0, duration: 0.8,
                onComplete: () => finish(nextStage),
            });
            return;
        }
        const lineIndex = direction > 0 ? nextStage - 2 : stage - 2;
        if (lineIndex === 0 || lineIndex === 1) {
            animation = gsap.to(lines[lineIndex], {
                clipPath: direction > 0 ? 'inset(0 0% 0 0)' : 'inset(0 100% 0 0)',
                duration: 1.4, ease: 'power2.inOut', onComplete: () => finish(nextStage),
            });
        } else finish(nextStage);
    };
    const controlsInput = (direction) => {
        if (moving) return true;
        if (stage < 5 && pin.isActive) return !(direction < 0 && stage === 0);
        if (stage >= 5 && Math.abs(window.scrollY - joinedY()) < 3) {
            return !(direction > 0 && stage === 6);
        }
        return false;
    };
    const removeBoundary = registerHomeScrollBoundary((from, to) => {
        if (moving) return to;
        if (stage < 5 && to > from && from <= pin.end && to >= pin.start) {
            return Math.min(to, pin.start + 1);
        }
        const anchor = joinedY();
        if (stage >= 5 && to < from && from >= anchor - 2 && to <= anchor) return anchor;
        if (stage === 5 && to > from && from <= anchor + 2 && to >= anchor) return anchor;
        return to;
    }, () => [pin.start, joinedY()]);
    const wheel = (event) => {
        if (event.ctrlKey || !event.deltaY || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
        const direction = Math.sign(event.deltaY);
        if (!controlsInput(direction)) return;
        event.preventDefault();
        const now = performance.now();
        if (busy) { lastInput = now; return; }
        if (now - lastInput < 400) return;
        lastInput = now;
        advance(direction);
    };
    const key = (event) => {
        if (event.defaultPrevented || event.ctrlKey || event.altKey || event.metaKey ||
            event.target?.closest?.('input, textarea, select, button, a, [contenteditable]')) return;
        const direction = { ArrowDown: 1, PageDown: 1, ArrowUp: -1, PageUp: -1, ' ': event.shiftKey ? -1 : 1 }[event.key];
        if (!direction || !controlsInput(direction)) return;
        event.preventDefault();
        if (!event.repeat) advance(direction);
    };
    const touchStart = (event) => { touchY = event.touches.length === 1 ? event.touches[0].clientY : null; };
    const touchMove = (event) => {
        if (touchY === null || event.touches.length !== 1) return;
        const delta = touchY - event.touches[0].clientY;
        if (Math.abs(delta) <= 20 || !controlsInput(Math.sign(delta))) return;
        event.preventDefault();
        touchY = null;
        advance(Math.sign(delta));
    };
    const observer = new IntersectionObserver(([entry]) => {
        if (stage !== 0 || moving) return;
        if (entry.isIntersecting) gsap.set(lines, { clipPath: 'inset(0 100% 0 0)' });
        else lines.forEach((line) => line.style.removeProperty('clip-path'));
    });
    observer.observe(section);
    window.addEventListener('wheel', wheel, { passive: false, capture: true });
    window.addEventListener('keydown', key, { capture: true });
    window.addEventListener('touchstart', touchStart, { passive: true });
    window.addEventListener('touchmove', touchMove, { passive: false });
    return () => {
        observer.disconnect();
        removeBoundary();
        window.removeEventListener('wheel', wheel, true);
        window.removeEventListener('keydown', key, true);
        window.removeEventListener('touchstart', touchStart);
        window.removeEventListener('touchmove', touchMove);
        animation?.kill();
        setHomeScrollLocked(false);
        floating?.remove();
        pin.kill();
        lines.forEach((line) => line.style.removeProperty('clip-path'));
        [source, target, description].forEach((node) => {
            node.style.removeProperty('opacity');
            node.style.removeProperty('visibility');
        });
    };
}
