import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { paths } from '../../common/router/routePaths';
import { useAuthStore } from '../../store/useAuthStore';
import { useBoardStore } from '../../store/useBoardStore';
import { NotFoundPage } from '../content/ContentPages';
import PageShell from '../../common/layout/PageShell';
import '../../styled/FormPages.css';
import Pagination from '../../ui/Pagination';
import './BoardPages.css';

export function BoardListPage() {
  const posts = useBoardStore((state) => state.posts);
  const [search, setSearch] = useState(''); const [category, setCategory] = useState('ALL');
  const [sort, setSort] = useState('latest'); const [page, setPage] = useState(1);
  const filtered = posts.filter((item) => (category === 'ALL' || item.category === category) && item.title.toLowerCase().includes(search.toLowerCase())).sort((a, b) => sort === 'likes' ? b.likes.length - a.likes.length : b.createdAt.localeCompare(a.createdAt));
  const pageCount = Math.ceil(filtered.length / 5);
  return <PageShell eyebrow="BOARD" title="게시판"><div className="board-toolbar">
    <input aria-label="게시글 제목 검색" placeholder="제목 검색" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} />
    <select aria-label="카테고리 선택" value={category} onChange={(event) => { setCategory(event.target.value); setPage(1); }}>{['ALL', 'NOTICE', 'STYLE', 'REVIEW', 'Q&A'].map((value) => <option key={value}>{value}</option>)}</select>
    <select aria-label="정렬 기준" value={sort} onChange={(event) => setSort(event.target.value)}><option value="latest">최신순</option><option value="likes">좋아요순</option></select>
    <Link to="/board/write">글 작성</Link></div>
    <div className="board-list">{filtered.slice((page - 1) * 5, page * 5).map((post) => <Link key={post.id} to={`/board/${post.id}`}><span>{post.category}</span><strong>{post.title}</strong><span>{post.authorName}</span><time>{new Date(post.createdAt).toLocaleDateString('ko-KR')}</time></Link>)}</div>
    <Pagination page={page} count={pageCount} onChange={setPage} />
  </PageShell>;
}

export function BoardDetailPage() { const { postId } = useParams(); const navigate = useNavigate(); const user = useAuthStore((state) => state.user); const post = useBoardStore((state) => state.posts.find((item) => item.id === postId)); const remove = useBoardStore((state) => state.deletePost); const toggleLike = useBoardStore((state) => state.toggleLike); if (!post) return <NotFoundPage />; return <PageShell eyebrow={`${post.category} / ${post.authorName}`} title={post.title}><article className="board-detail"><time>{new Date(post.createdAt).toLocaleDateString('ko-KR')}</time><p>{post.content}</p><button type="button" onClick={() => user ? toggleLike(post.id, user.id) : navigate(paths.login, { state: { from: `/board/${post.id}` } })}>좋아요 {post.likes.length}</button><div><Link to="/board">목록</Link>{post.authorId === user?.id && <><Link to={`/board/${post.id}/edit`}>수정</Link><button type="button" onClick={() => { if (window.confirm('게시글을 삭제하시겠습니까?')) { remove(post.id, user.id); navigate('/board'); } }}>삭제</button></>}</div></article></PageShell>; }

export function BoardFormPage({ edit = false }) { const { postId } = useParams(); const navigate = useNavigate(); const user = useAuthStore((state) => state.user); const post = useBoardStore((state) => state.posts.find((item) => item.id === postId)); const add = useBoardStore((state) => state.addPost); const update = useBoardStore((state) => state.updatePost); const [values, setValues] = useState({ category: post?.category || 'REVIEW', title: post?.title || '', content: post?.content || '' }); if (edit && (!post || post.authorId !== user.id)) return <NotFoundPage />; return <PageShell eyebrow="BOARD" title={edit ? '글 수정' : '글 작성'}><form className="form-card board-form" onSubmit={(event) => { event.preventDefault(); if (edit) { update(postId, user.id, values); navigate(`/board/${postId}`); } else { const id = add({ ...values, authorId: user.id, authorName: user.name }); navigate(`/board/${id}`); } }}><label>카테고리<select value={values.category} onChange={(event) => setValues({ ...values, category: event.target.value })}>{['NOTICE', 'STYLE', 'REVIEW', 'Q&A'].map((value) => <option key={value}>{value}</option>)}</select></label><label>제목<input value={values.title} onChange={(event) => setValues({ ...values, title: event.target.value })} minLength="2" maxLength="100" required /></label><label>내용<textarea value={values.content} onChange={(event) => setValues({ ...values, content: event.target.value })} minLength="10" required /></label><button className="form-button" type="submit">{edit ? '수정 완료' : '등록하기'}</button></form></PageShell>; }
