// Internal pin corrections must complete before smooth scrolling resumes.
export function withInstantScroll(updatePosition) {
    const root = document.documentElement;
    const previous = root.style.getPropertyValue('scroll-behavior');
    const priority = root.style.getPropertyPriority('scroll-behavior');
    root.style.setProperty('scroll-behavior', 'auto', 'important');
    try {
        return updatePosition();
    } finally {
        if (previous) root.style.setProperty('scroll-behavior', previous, priority);
        else root.style.removeProperty('scroll-behavior');
    }
}
