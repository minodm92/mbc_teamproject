import './Pagination.css';

export default function Pagination({ page, count, onChange }) {
  if (count <= 1) return null;
  return <nav className="pagination" aria-label="페이지 이동">
    <button type="button" disabled={page === 1} onClick={() => onChange(page - 1)}>이전</button>
    {Array.from({ length: count }, (_, index) => <button type="button" key={index + 1} aria-current={page === index + 1 ? 'page' : undefined} onClick={() => onChange(index + 1)}>{index + 1}</button>)}
    <button type="button" disabled={page === count} onClick={() => onChange(page + 1)}>다음</button>
  </nav>;
}
