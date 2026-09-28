import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function NewsroomPagination() {
    return (
        <nav className="newsroom-pagination" aria-label="뉴스 페이지">
            <button type="button" aria-label="이전 페이지" disabled>
                <ChevronLeft aria-hidden="true" size={30} strokeWidth={1.5} />
            </button>
            <button type="button" aria-current="page" aria-label="1페이지">
                1
            </button>
            <button type="button" aria-label="2페이지" disabled>
                2
            </button>
            <button type="button" aria-label="3페이지" disabled>
                3
            </button>
            <button type="button" aria-label="다음 페이지" disabled>
                <ChevronRight aria-hidden="true" size={30} strokeWidth={1.5} />
            </button>
        </nav>
    );
}
