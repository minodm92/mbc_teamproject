import './PageShell.css';

export default function PageShell({ eyebrow, title, intro, children }) {
  return (
    <main className="page-shell">
      <header className="page-shell__hero">
        <span>{eyebrow}</span>
        <h1>{title}</h1>
        {intro && <p>{intro}</p>}
      </header>
      <div className="page-shell__body">{children}</div>
    </main>
  );
}
