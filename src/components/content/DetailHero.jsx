import { Link } from 'react-router-dom';
import { paths } from '../../common/router/routePaths';
import './DetailHero.css';

/* Hero for the notice / newsroom detail pages: same frame as the list-page heroes (photo, dim, breadcrumb, title). */
export default function DetailHero({ image, title, section, sectionPath, titleTag = 'h1', showBreadcrumb = true }) {
    return (
        <header className="detail-hero" data-header-theme="dark">
            <img className="detail-hero__image" src={image} alt="" fetchPriority="high" />
            {showBreadcrumb && <nav className="detail-hero__breadcrumb" aria-label="현재 위치">
                <Link to={paths.home}>HOME</Link>
                <span aria-hidden="true">/</span>
                <span>안내</span>
                <span aria-hidden="true">/</span>
                <Link to={sectionPath}>{section}</Link>
            </nav>}
            {titleTag === 'p'
                ? <p className="detail-hero__title">{title}</p>
                : <h1 className="detail-hero__title">{title}</h1>}
        </header>
    );
}
