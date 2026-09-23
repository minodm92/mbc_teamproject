import { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import { demoProducts } from '../../common/data/content';
import { useAuthStore } from '../../store/useAuthStore';
import { useWishlistStore } from '../../store/useWishlistStore';
import { useRecentlyViewedStore } from '../../store/useRecentlyViewedStore';
import { useCartStore } from '../../store/useCartStore';
import { NotFoundPage } from '../content/ContentPages';
import PageShell from '../../common/layout/PageShell';
import './ProductPages.css';

export function CollectionPage() { return <PageShell eyebrow="COLLECTION" title="컬렉션" intro="가이드의 상품 기능을 확인하는 데모 컬렉션입니다."><div className="product-grid">{demoProducts.map((item) => <ProductCard key={item.id} item={item} />)}</div></PageShell>; }

function ProductCard({ item }) { const user = useAuthStore((state) => state.user); const navigate = useNavigate(); const liked = useWishlistStore((state) => state.likedByUser[user?.id] ?? []); const toggleLiked = useWishlistStore((state) => state.toggleLiked); return <article className="product-card"><Link to={`/products/${item.id}`}><img src={item.image} alt={item.name} width="600" height="800" /><span>{item.category}{item.isNew ? ' · NEW' : ''}</span><h2>{item.name}</h2><p>{item.price.toLocaleString()}원</p></Link><button type="button" aria-label={`${item.name} 좋아요`} aria-pressed={liked.includes(item.id)} onClick={() => user ? toggleLiked(user.id, item.id) : navigate('/login', { state: { from: '/collections' } })}><Heart size={22} fill={liked.includes(item.id) ? '#dd0000' : 'none'} /></button></article>; }

export function ProductDetailPage() { const { productId } = useParams(); const item = demoProducts.find((row) => row.id === productId); const user = useAuthStore((state) => state.user); const navigate = useNavigate(); const addViewed = useRecentlyViewedStore((state) => state.addRecentlyViewed); const addItem = useCartStore((state) => state.addItem); useEffect(() => { if (user && item) addViewed(user.id, item.id); }, [user, item, addViewed]); if (!item) return <NotFoundPage />; return <PageShell eyebrow="PRODUCT DETAIL" title={item.name}><div className="product-detail"><img src={item.image} alt={item.name} width="600" height="800" /><div><span>{item.category}</span><h2>{item.name}</h2><p>{item.price.toLocaleString()}원</p><p>컬러: {item.colors.join(', ')}</p><button type="button" onClick={() => { if (!user) { navigate('/login', { state: { from: `/products/${item.id}` } }); return; } addItem(user.id, item.id); navigate('/cart'); }}><ShoppingBag size={19} /> 장바구니 담기</button></div></div></PageShell>; }

export function CartPage() { const user = useAuthStore((state) => state.user); const items = useCartStore((state) => state.itemsByUser[user.id] ?? []); const remove = useCartStore((state) => state.removeItem); return <PageShell eyebrow="CART" title="장바구니"><div className="cart-list">{items.length ? items.map((id, index) => { const item = demoProducts.find((row) => row.id === id); return item && <article key={`${id}-${index}`}><img src={item.image} alt={item.name} width="100" height="120" /><div><h2>{item.name}</h2><p>{item.price.toLocaleString()}원</p></div><button type="button" onClick={() => remove(user.id, index)}>삭제</button></article>; }) : <p>장바구니가 비었습니다. <Link to="/collections">컬렉션 둘러보기</Link></p>}</div></PageShell>; }
