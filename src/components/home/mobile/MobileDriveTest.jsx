import { useState } from 'react';
import { mobileDriveTest } from './homeMobileData';

export default function MobileDriveTest() {
    const [selected, setSelected] = useState(0);

    return (
        <section className="home-mobile-drive" aria-labelledby="home-mobile-drive-title">
            <h2 className="home-mobile-title" id="home-mobile-drive-title">
                {mobileDriveTest.title}
            </h2>
            <ul className="home-mobile-drive__list">
                {mobileDriveTest.items.map((item, index) => {
                    const isSelected = index === selected;
                    return (
                        <li key={item.title}>
                            {/* TODO: ask whether tapping the selected row should go to /reservations. */}
                            <button
                                className={`home-mobile-drive__item${isSelected ? ' is-selected' : ''}`}
                                type="button"
                                aria-expanded={isSelected}
                                onClick={() => setSelected(index)}
                            >
                                <span className="home-mobile-drive__meta" aria-hidden={!isSelected}>
                                    {item.meta.map((text) => (
                                        <span key={text}>{text}</span>
                                    ))}
                                </span>
                                <strong>{item.title}</strong>
                            </button>
                        </li>
                    );
                })}
            </ul>
        </section>
    );
}
