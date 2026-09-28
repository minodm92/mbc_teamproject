import './Pagination.css';

export default function Pagination({ page, count, onChange, variant }) {
  if (variant === 'notice') {
    const start = Math.floor((page - 1) / 10) * 10 + 1;
    return <nav className="pagination pagination--notice" aria-label="공지사항 페이지">
      {page > 1 && <button type="button" aria-label="이전 페이지" onClick={() => onChange(page - 1)}>‹</button>}
      {Array.from({ length: Math.min(10, count - start + 1) }, (_, index) => start + index).map((number) => <button key={number} type="button" aria-label={`${number}페이지`} aria-current={page === number ? 'page' : undefined} onClick={() => onChange(number)}>{number}</button>)}
      <button type="button" aria-label="다음 페이지" disabled={page === count} onClick={() => onChange(page + 1)}>›</button>
      <button type="button" aria-label="마지막 페이지" disabled={page === count} onClick={() => onChange(count)}>»</button>
    </nav>;
  }
  if (count <= 1) return null;
  return <nav className="pagination" aria-label="페이지 이동">
    <button type="button" disabled={page === 1} onClick={() => onChange(page - 1)}>이전</button>
    {Array.from({ length: count }, (_, index) => <button type="button" key={index + 1} aria-current={page === index + 1 ? 'page' : undefined} onClick={() => onChange(index + 1)}>{index + 1}</button>)}
    <button type="button" disabled={page === count} onClick={() => onChange(page + 1)}>다음</button>
  </nav>;
}
