import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { paths } from '../../common/router/routePaths';
import { useAuthStore } from '../../store/useAuthStore';
import { useInquiryStore } from '../../store/useInquiryStore';
import { NotFoundPage } from '../content/ContentPages';
import PageShell from '../../common/layout/PageShell';
import '../../styled/FormPages.css';
import Pagination from '../../ui/Pagination';
import './InquiryPages.css';

const categories = { PRODUCT: '상품 문의', DELIVERY: '배송 문의', RETURN: '교환·반품 문의', ACCOUNT: '회원정보 문의', ETC: '기타 문의' };
const statuses = { PENDING: '접수 완료', IN_REVIEW: '확인 중', ANSWERED: '답변 완료' };

export function InquiryListPage() {
  const user = useAuthStore((state) => state.user); const inquiries = useInquiryStore((state) => state.inquiries);
  const [filter, setFilter] = useState('ALL'); const [search, setSearch] = useState(''); const [page, setPage] = useState(1);
  const mine = inquiries.filter((item) => item.userId === user.id && (filter === 'ALL' || item.status === filter) && item.title.toLowerCase().includes(search.toLowerCase())).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const pageCount = Math.ceil(mine.length / 5);
  return <PageShell eyebrow="1:1 INQUIRY" title="고객문의" intro="등록한 문의와 처리 현황을 확인하세요."><div className="inquiry-toolbar">
    <input aria-label="제목 검색" placeholder="제목 검색" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} />
    <select aria-label="상태 필터" value={filter} onChange={(event) => { setFilter(event.target.value); setPage(1); }}><option value="ALL">전체 상태</option>{Object.entries(statuses).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select>
    <Link to={paths.inquiryWrite}>문의 작성 <ArrowUpRight size={18} /></Link></div>
    {mine.length ? <><div className="inquiry-list">{mine.slice((page - 1) * 5, page * 5).map((item) => <Link key={item.id} to={paths.inquiry(item.id)}><span className={`inquiry-status inquiry-status--${item.status.toLowerCase()}`}>{statuses[item.status]}</span><strong>{item.title}</strong><span>{categories[item.category]}</span><time>{new Date(item.createdAt).toLocaleDateString('ko-KR')}</time><ArrowUpRight size={20} /></Link>)}</div><Pagination page={page} count={pageCount} onChange={setPage} /></> : <div className="empty-state"><h2>등록한 고객문의가 없습니다.</h2><p>궁금한 내용을 문의해 주세요.</p><Link className="form-button" to={paths.inquiryWrite}>문의 작성하기</Link></div>}
  </PageShell>;
}

export function InquiryFormPage({ edit = false }) {
  const { inquiryId } = useParams(); const navigate = useNavigate(); const user = useAuthStore((state) => state.user);
  const inquiry = useInquiryStore((state) => state.inquiries.find((item) => item.id === inquiryId));
  const add = useInquiryStore((state) => state.addInquiry); const update = useInquiryStore((state) => state.updateInquiry);
  const [values, setValues] = useState({ category: inquiry?.category || 'ETC', title: inquiry?.title || '', content: inquiry?.content || '', orderNumber: inquiry?.orderNumber || '', answerNotification: inquiry?.answerNotification ?? false });
  const [attachments, setAttachments] = useState([]);
  const attachmentUrls = useRef(new Set());
  const [error, setError] = useState('');
  useEffect(() => { const urls = attachmentUrls.current; return () => urls.forEach((url) => URL.revokeObjectURL(url)); }, []);
  if (edit && (!inquiry || inquiry.userId !== user.id || inquiry.status === 'ANSWERED')) return <NotFoundPage />;
  function chooseFiles(event) {
    const files = Array.from(event.target.files || []); event.target.value = '';
    if (files.length + attachments.length > 3 || files.some((file) => !['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024)) {
      setError('첨부 이미지는 JPEG, PNG, WebP 형식으로 최대 3개, 개별 5MB 이하만 선택해 주세요.'); return;
    }
    setAttachments((current) => [...current, ...files.map((file) => { const url = URL.createObjectURL(file); attachmentUrls.current.add(url); return { name: file.name, url }; })]); setError('');
  }
  function submit(event) {
    event.preventDefault();
    if (values.title.trim().length < 2 || values.title.trim().length > 100 || values.content.trim().length < 10 || values.content.trim().length > 2000) {
      setError('제목은 2~100자, 내용은 10~2,000자로 작성해 주세요.'); return;
    }
    if (edit) { update(inquiryId, user.id, values); navigate(paths.inquiry(inquiryId)); }
    else { const id = add({ ...values, userId: user.id, attachments: [] }); navigate(paths.inquiry(id)); }
  }
  return <PageShell eyebrow="1:1 INQUIRY" title={edit ? '문의 수정' : '문의 작성'}><form className="form-card inquiry-form" onSubmit={submit}>
    <label>문의 카테고리<select value={values.category} onChange={(event) => setValues({ ...values, category: event.target.value })}>{Object.entries(categories).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></label>
    <label>제목<input value={values.title} onChange={(event) => setValues({ ...values, title: event.target.value })} minLength="2" maxLength="100" required /></label>
    <label>문의 내용<textarea value={values.content} onChange={(event) => setValues({ ...values, content: event.target.value })} minLength="10" maxLength="2000" required /></label>
    <label>주문번호 (선택)<input value={values.orderNumber} onChange={(event) => setValues({ ...values, orderNumber: event.target.value })} /></label>
    <label>첨부 이미지 (선택, 최대 3개)<input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={chooseFiles} /></label>
    {attachments.length > 0 && <div className="inquiry-form__previews">{attachments.map((item) => <div key={item.url}><img src={item.url} alt={`${item.name} 미리보기`} width="120" height="120" /><button type="button" onClick={() => setAttachments((current) => current.filter((row) => row.url !== item.url))}>제거</button></div>)}</div>}
    <p className="form-note">데모에서는 첨부 이미지 미리보기만 제공하며 파일은 저장하지 않습니다.</p>
    <label className="inquiry-form__checkbox"><input type="checkbox" checked={values.answerNotification} onChange={(event) => setValues({ ...values, answerNotification: event.target.checked })} /> 답변 알림 수신 동의</label>
    {error && <p className="form-error" role="alert">{error}</p>}
    <div className="form-actions"><button type="button" className="form-button form-button--outline" onClick={() => navigate(paths.inquiries)}>취소</button><button className="form-button" type="submit">{edit ? '수정 완료' : '문의 등록'}</button></div>
  </form></PageShell>;
}

export function InquiryDetailPage() {
  const { inquiryId } = useParams(); const navigate = useNavigate(); const user = useAuthStore((state) => state.user);
  const inquiry = useInquiryStore((state) => state.inquiries.find((item) => item.id === inquiryId)); const remove = useInquiryStore((state) => state.deleteInquiry);
  if (!inquiry || inquiry.userId !== user.id) return <NotFoundPage />;
  return <PageShell eyebrow={`1:1 INQUIRY / ${statuses[inquiry.status]}`} title={inquiry.title}><article className="inquiry-detail"><div className="inquiry-detail__meta"><span>{categories[inquiry.category]}</span><span>{statuses[inquiry.status]}</span><time>{new Date(inquiry.createdAt).toLocaleDateString('ko-KR')}</time></div><p>{inquiry.content}</p>{inquiry.orderNumber && <p>주문번호: {inquiry.orderNumber}</p>}<div className="inquiry-detail__answer"><h2>고객센터 답변</h2><p>{inquiry.answer || '문의 내용을 확인하고 있습니다. 답변이 등록되면 이 화면에서 확인할 수 있습니다.'}</p></div><div className="inquiry-detail__actions"><Link to={paths.inquiries}>목록으로</Link>{inquiry.status !== 'ANSWERED' && <Link to={paths.inquiryEdit(inquiry.id)}>문의 수정</Link>}{inquiry.status === 'PENDING' && <button type="button" onClick={() => { if (window.confirm('고객문의를 삭제하시겠습니까? 삭제한 문의는 복구할 수 없습니다.')) { remove(inquiry.id, user.id); navigate(paths.inquiries); } }}>문의 삭제</button>}</div></article></PageShell>;
}
