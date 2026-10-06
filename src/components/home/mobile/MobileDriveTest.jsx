import { useEffect, useRef, useState } from 'react';
import { mobileDriveTest } from './homeMobileData';

// The panel sticks while the section scrolls by one 40svh step per item. Each step has
// a sentinel stacked from the section top; whichever one crosses the top edge of the
// viewport selects its item (Figma Drive Test -> Drive Test2 -> Drive Test3).
export default function MobileDriveTest() {
    const [selected, setSelected] = useState(0);
    const sentinelsRef = useRef([]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) setSelected(Number(entry.target.dataset.step));
                });
            },
            { rootMargin: '0px 0px -99% 0px' }
        );
        sentinelsRef.current.forEach((sentinel) => sentinel && observer.observe(sentinel));
        return () => observer.disconnect();
    }, []);

    return (
        <section
            className="home-mobile-drive"
            aria-labelledby="home-mobile-drive-title"
            style={{ '--hm-drive-steps': mobileDriveTest.items.length }}
        >
            <div className="home-mobile-drive__steps" aria-hidden="true">
                {mobileDriveTest.items.map((title, index) => (
                    <div
                        key={title}
                        data-step={index}
                        ref={(element) => {
                            sentinelsRef.current[index] = element;
                        }}
                    />
                ))}
            </div>
            <div className="home-mobile-drive__panel">
                <h2 className="home-mobile-title" id="home-mobile-drive-title">
                    {mobileDriveTest.title}
                </h2>
                <ul className="home-mobile-drive__list">
                    {mobileDriveTest.items.map((title, index) => {
                        const isSelected = index === selected;
                        return (
                            <li key={title}>
                                {/* TODO: ask whether tapping the selected row should go to /reservations. */}
                                <button
                                    className={`home-mobile-drive__item${isSelected ? ' is-selected' : ''}`}
                                    type="button"
                                    aria-expanded={isSelected}
                                    onClick={() => setSelected(index)}
                                >
                                    <span
                                        className="home-mobile-drive__meta"
                                        aria-hidden={!isSelected}
                                    >
                                        {mobileDriveTest.meta.map((text) => (
                                            <span key={text}>{text}</span>
                                        ))}
                                    </span>
                                    <strong>{title}</strong>
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </section>
    );
}
