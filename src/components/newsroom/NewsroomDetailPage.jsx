import { useEffect, useRef, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { Download } from 'lucide-react';
import { paths } from '../../common/router/routePaths';
import { NotFoundPage } from '../content/ContentPages';
import { newsroomArticles } from './data/newsroomData';
import './NewsroomDetailPage.css';

export default function NewsroomDetail() {
    const { articleId } = useParams();
    const [searchParams] = useSearchParams();
    const sourcePage = Math.max(1, Math.min(3, Number(searchParams.get('page')) || 1));
    const newsroomListPath = sourcePage === 1 ? paths.newsroom : `${paths.newsroom}?page=${sourcePage}`;
    const article = newsroomArticles.find((item) => String(item.id) === String(articleId));
    const galleryRef = useRef(null);
    const dragRef = useRef(null);
    const [activeSlide, setActiveSlide] = useState(0);

    useEffect(() => {
        setActiveSlide(0);
        galleryRef.current?.scrollTo({ left: 0 });
    }, [articleId]);

    if (!article) return <NotFoundPage />;

    const images = Array.isArray(article.images) ? article.images.filter(Boolean) : [];
    const files = Array.isArray(article.files) ? article.files.filter((file) => file?.url) : [];
    const highlights = Array.isArray(article.highlights) ? article.highlights.filter(Boolean) : [];
    const body = Array.isArray(article.body) ? article.body.filter((block) => block?.text) : [];
    const relatedArticles = (Array.isArray(article.relatedNews) ? article.relatedNews : [])
        .map((id) => newsroomArticles.find((item) => String(item.id) === String(id)))
        .filter(Boolean)
        .slice(0, 4);

    const moveToSlide = (index) => {
        const slide = galleryRef.current?.children[index];
        if (!slide) return;
        galleryRef.current.scrollTo({ left: slide.offsetLeft, behavior: 'smooth' });
        setActiveSlide(index);
    };

    const updateActiveSlide = () => {
        const gallery = galleryRef.current;
        const slides = gallery ? Array.from(gallery.children) : [];
        if (!slides.length) return;
        const atEnd = gallery.scrollLeft + gallery.clientWidth >= gallery.scrollWidth - 8;
        if (atEnd) {
            setActiveSlide(slides.length - 1);
            return;
        }
        const viewportCenter = gallery.scrollLeft + (gallery.clientWidth / 2);
        const closest = slides.reduce((result, slide, index) => (
            Math.abs((slide.offsetLeft + (slide.offsetWidth / 2)) - viewportCenter)
                < Math.abs((slides[result].offsetLeft + (slides[result].offsetWidth / 2)) - viewportCenter)
                ? index
                : result
        ), 0);
        setActiveSlide(closest);
    };

    const scrollGalleryWithWheel = (event) => {
        const gallery = galleryRef.current;
        if (!gallery || images.length < 2) return;
        const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
        const atStart = gallery.scrollLeft <= 1;
        const atEnd = gallery.scrollLeft + gallery.clientWidth >= gallery.scrollWidth - 1;
        if (delta > 0 && atEnd) {
            setActiveSlide(images.length - 1);
            return;
        }
        if (delta < 0 && atStart) return;
        event.preventDefault();
        gallery.scrollBy({ left: delta });
    };

    const startDrag = (event) => {
        if (event.button !== 0 || !galleryRef.current || images.length < 2) return;
        dragRef.current = { pointerId: event.pointerId, startX: event.clientX, scrollLeft: galleryRef.current.scrollLeft };
        galleryRef.current.setPointerCapture(event.pointerId);
        galleryRef.current.classList.add('is-dragging');
    };

    const moveDrag = (event) => {
        const drag = dragRef.current;
        if (!drag || drag.pointerId !== event.pointerId) return;
        galleryRef.current.scrollLeft = drag.scrollLeft - (event.clientX - drag.startX);
    };

    const endDrag = (event) => {
        const gallery = galleryRef.current;
        if (!gallery || !dragRef.current || dragRef.current.pointerId !== event.pointerId) return;
        dragRef.current = null;
        gallery.classList.remove('is-dragging');
        if (gallery.hasPointerCapture(event.pointerId)) gallery.releasePointerCapture(event.pointerId);
    };

    const downloadAll = () => {
        files.forEach((file) => {
            const anchor = document.createElement('a');
            anchor.href = file.url;
            anchor.download = file.name;
            document.body.appendChild(anchor);
            anchor.click();
            anchor.remove();
        });
    };

    return (
        <main className="newsroom-page newsroom-detail">
            <header className="newsroom-detail__page-header">
                <h1>NEWS</h1>
                <nav aria-label="현재 위치">
                    <Link to="/">현대 모터 스튜디오</Link><span aria-hidden="true">›</span>
                    <span>안내</span><span aria-hidden="true">›</span>
                    <Link to={newsroomListPath}>뉴스룸</Link>
                </nav>
            </header>

            <article className="newsroom-detail__article">
                <div className="newsroom-detail__main">
                    <header className="newsroom-detail__header">
                        <h2 className="newsroom-detail__title">{article.title}</h2>
                        <p className="newsroom-detail__meta">
                            <span>{article.location}</span><span aria-hidden="true" />
                            <time dateTime={article.dateISO}>{article.date}</time>
                        </p>
                    </header>

                    {images.length > 0 && (
                        <div className="newsroom-detail__gallery-wrap">
                            <div className="newsroom-detail__gallery" ref={galleryRef} onScroll={updateActiveSlide}
                                onWheel={scrollGalleryWithWheel} onPointerDown={startDrag} onPointerMove={moveDrag}
                                onPointerUp={endDrag} onPointerCancel={endDrag}>
                                {images.map((image, index) => (
                                    <img src={image} alt={`${article.title} 관련 이미지 ${index + 1}`} draggable={false}
                                        key={`${image}-${index}`} />
                                ))}
                            </div>
                            {images.length > 1 && (
                                <div className="newsroom-detail__gallery-nav" aria-label="기사 이미지 선택">
                                    {images.map((image, index) => (
                                        <button type="button" className={activeSlide === index ? 'is-active' : ''}
                                            aria-label={`${index + 1}번째 이미지`}
                                            aria-current={activeSlide === index ? 'true' : undefined}
                                            onClick={() => moveToSlide(index)} key={`${image}-${index}`} />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {highlights.length > 0 && (
                        <ul className="newsroom-detail__highlights">
                            {highlights.map((highlight, index) => <li key={`${highlight}-${index}`}>{highlight}</li>)}
                        </ul>
                    )}

                    {body.length > 0 && (
                        <div className="newsroom-detail__copy">
                            {body.map((block, index) => (
                                block.type === 'heading'
                                    ? <h3 key={`${block.text}-${index}`}>{block.text}</h3>
                                    : <p key={`${block.text}-${index}`}>{block.text}</p>
                            ))}
                        </div>
                    )}
                </div>

                <aside className="newsroom-detail__files" aria-labelledby="related-files-title">
                    <div className="newsroom-detail__files-heading">
                        <h2 id="related-files-title">관련파일</h2>
                        <button type="button" onClick={downloadAll} disabled={!files.length}>전체 다운로드</button>
                    </div>
                    {files.length > 0 && (
                        <ul>
                            {files.map((file, index) => (
                                <li key={`${file.url}-${index}`}>
                                    <a href={file.url} download={file.name}>
                                        <span>{file.name}</span>
                                        <Download aria-hidden="true" size={22} strokeWidth={1.5} />
                                    </a>
                                </li>
                            ))}
                        </ul>
                    )}
                </aside>
            </article>

            <section className="newsroom-detail__related" aria-labelledby="newsroom-related-title">
                <h2 id="newsroom-related-title">RELATED NEWS</h2>
                <div className="newsroom-detail__related-grid">
                    {relatedArticles.map((relatedArticle) => (
                        <article className="newsroom-detail__related-card" key={relatedArticle.id}>
                            <Link to={`${paths.newsroomArticle(relatedArticle.id)}?page=${sourcePage}`}>
                                <img src={relatedArticle.image} alt="" loading="lazy" />
                                <time dateTime={relatedArticle.dateISO}>{relatedArticle.date}</time>
                                <h3>{relatedArticle.title}</h3>
                            </Link>
                        </article>
                    ))}
                </div>
            </section>

            <div className="newsroom-detail__back-wrap">
                <Link className="newsroom-detail__back" to={newsroomListPath}>목록</Link>
            </div>
        </main>
    );
}
