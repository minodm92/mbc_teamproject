import './PageLoader.css';

const TICK_COUNT = 51;
const ticks = Array.from({ length: TICK_COUNT }, (_, index) => {
    const ratio = index / (TICK_COUNT - 1);
    const angle = Math.PI + Math.PI * ratio;
    const outerRadius = 154;
    const innerRadius = index % 5 === 0 ? 132 : 138;
    return {
        threshold: ((index + 1) / TICK_COUNT) * 100,
        color: `hsl(${30 - ratio * 24} 100% 50%)`,
        x1: 200 + Math.cos(angle) * innerRadius,
        y1: 190 + Math.sin(angle) * innerRadius,
        x2: 200 + Math.cos(angle) * outerRadius,
        y2: 190 + Math.sin(angle) * outerRadius,
    };
});

const labels = [0, 25, 50, 75, 100].map((value) => {
    const angle = Math.PI + Math.PI * (value / 100);
    return {
        value,
        x: 200 + Math.cos(angle) * 111,
        y: 190 + Math.sin(angle) * 111,
    };
});

export default function PageLoader({ phase, progress }) {
    if (!phase) return null;
    const roundedProgress = Math.round(progress);

    return (
        <div
            className={`page-loader${phase === 'leaving' ? ' is-leaving' : ''}`}
            role="status"
            aria-live="polite"
            aria-label={`메인 페이지 준비 중 ${roundedProgress}%`}
        >
            <svg
                className="page-loader__gauge"
                viewBox="0 0 400 220"
                role="img"
                aria-hidden="true"
            >
                <g className="page-loader__ticks">
                    {ticks.map((tick, index) => (
                        <line
                            key={index}
                            x1={tick.x1}
                            y1={tick.y1}
                            x2={tick.x2}
                            y2={tick.y2}
                            stroke={progress >= tick.threshold ? tick.color : '#454545'}
                        />
                    ))}
                </g>
                <g className="page-loader__labels">
                    {labels.map((label) => (
                        <text key={label.value} x={label.x} y={label.y}>
                            {label.value}
                        </text>
                    ))}
                </g>
                <text className="page-loader__number" x="200" y="181">
                    {String(roundedProgress).padStart(3, '0')}
                </text>
                <text className="page-loader__unit" x="255" y="179">%</text>
            </svg>
        </div>
    );
}
