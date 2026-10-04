import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function NewsroomPagination({ currentPage, pageCount, onPageChange }) {
    const pages = Array.from({ length: pageCount }, (_, index) => index + 1);

    return (
        <nav className="newsroom-pagination" aria-label="뉴스 페이지">
            <button
                type="button"
                aria-label="이전 페이지"
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
            >
                <ChevronLeft aria-hidden="true" size={30} strokeWidth={1.5} />
            </button>
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
            <button
                type="button"
                aria-label="다음 페이지"
                disabled={currentPage === pageCount}
                onClick={() => onPageChange(currentPage + 1)}
            >
                <ChevronRight aria-hidden="true" size={30} strokeWidth={1.5} />
            </button>
        </nav>
    );
}
