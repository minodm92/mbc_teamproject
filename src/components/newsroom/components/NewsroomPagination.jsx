export default function NewsroomPagination({ currentPage, pageCount, onPageChange }) {
    const pages = Array.from({ length: pageCount }, (_, index) => index + 1);
    const hasPrev = currentPage > 1;
    const hasNext = currentPage < pageCount;

    return (
        <nav className="newsroom-pagination" aria-label="뉴스 페이지">
            {hasPrev && (
                <>
                    <button type="button" className="newsroom-pagination__arrow" aria-label="첫 페이지" onClick={() => onPageChange(1)}>«</button>
                    <button type="button" className="newsroom-pagination__arrow" aria-label="이전 페이지" onClick={() => onPageChange(currentPage - 1)}>‹</button>
                </>
            )}
            {pages.map((page) => (
                <button
                    key={page}
                    type="button"
                    aria-label={`${page}페이지`}
                    aria-current={currentPage === page ? 'page' : undefined}
                    onClick={() => onPageChange(page)}
                >
                    {page}
                </button>
            ))}
            {hasNext && (
                <>
                    <button type="button" className="newsroom-pagination__arrow" aria-label="다음 페이지" onClick={() => onPageChange(currentPage + 1)}>›</button>
                    <button type="button" className="newsroom-pagination__arrow" aria-label="마지막 페이지" onClick={() => onPageChange(pageCount)}>»</button>
                </>
            )}
        </nav>
    );
}
