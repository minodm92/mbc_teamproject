import { Link, useParams } from 'react-router-dom';
import { ArrowUpRight, MapPin } from 'lucide-react';
import { locations, exhibitions, programs, notices, news, vehicles } from '../../common/data/content';
import { paths } from '../../common/router/routePaths';
import ContentCard from '../../ui/ContentCard';
import PageShell from '../../common/layout/PageShell';
import NoticesListing from './NoticesListing';
import NoticeDetail from './NoticeDetail';
import LocationShowcase from './LocationShowcase';
import { locationShowcase } from '../../common/data/locationShowcase';
import './ContentPages.css';

export function MotorstudioPage() { return <main><LocationShowcase /></main>; }

export function LocationPage() { const { location } = useParams(); const item = locations.find((row) => row.slug === location); if (!item) return <NotFoundPage />; const detail = <div className="detail-copy"><span>EXPLORE THE SPACE</span>{item.tagline && <h2>{item.tagline}</h2>}{item.description && <p>{item.description}</p>}<Link className="action-link" to={paths.reservations}>방문 예약 <ArrowUpRight size={18} /></Link></div>; if (location === 'senayan-park' || locationShowcase.some((row) => !row.desktopOnly && row.id === location)) return <main><LocationShowcase key={location} /><div className="page-shell__body location-legacy-detail">{detail}</div></main>; if (location === 'beijing') return <><main className="studio-desktop"><LocationShowcase key={location} /></main><div className="location-legacy-detail"><PageShell eyebrow={`HYUNDAI MOTORSTUDIO ${item.english}`} title={`현대 모터스튜디오 ${item.name}`} intro={item.tagline}><div className="feature-image"><img src={item.image} alt={`${item.name} 공간 일러스트`} width="1500" height="850" /></div>{detail}</PageShell></div></>; return <PageShell eyebrow={`HYUNDAI MOTORSTUDIO ${item.english}`} title={`현대 모터스튜디오 ${item.name}`} intro={item.tagline}><div className="feature-image"><img src={item.image} alt={`${item.name} 공간 일러스트`} width="1500" height="850" /></div>{detail}</PageShell>; }

export function MobilityPage() { return <PageShell eyebrow="MOBILITY" title="새로운 움직임을 경험하다" intro="미래의 이동 경험을 가까이에서 만나보세요."><div className="page-grid">{vehicles.map((item) => <ContentCard key={item.id} image={item.image} eyebrow={item.category} title={item.name} description={item.description} to={paths.reservations} />)}</div></PageShell>; }

export { default as ExhibitionsPage } from './ExhibitionsPage';

export function ExhibitionDetailPage() { const { exhibitionId } = useParams(); const item = exhibitions.find((row) => row.id === exhibitionId); if (!item) return <NotFoundPage />; return <PageShell eyebrow={`${item.location} / EXHIBITION`} title={item.subtitle} intro={item.title}><div className="feature-image"><img src={item.image} alt={`${item.subtitle} 전시 일러스트`} width="1500" height="850" /></div><div className="detail-copy"><span>{item.date}</span><h2>{item.title}</h2><p>{item.description}</p><Link className="action-link" to={paths.reservations}>예약하기 <ArrowUpRight size={18} /></Link></div></PageShell>; }

export function ProgramsPage() { return <PageShell eyebrow="PROGRAM" title="직접 경험하는 모빌리티" intro="현대 모터스튜디오에서 새로운 생각과 감각을 깨워보세요."><div className="page-grid">{programs.map((item) => <ContentCard key={item.id} image={item.image} eyebrow={item.location} title={item.title} description={item.description} to={paths.program(item.id)} />)}</div></PageShell>; }

export function ProgramDetailPage() { const { programId } = useParams(); const item = programs.find((row) => row.id === programId); if (!item) return <NotFoundPage />; return <PageShell eyebrow={`${item.location} / PROGRAM`} title={item.title} intro={item.english}><div className="feature-image"><img src={item.image} alt={`${item.title} 프로그램 일러스트`} width="1500" height="850" /></div><div className="detail-copy"><span>JOIN THE EXPERIENCE</span><h2>{item.title}</h2><p>{item.description}</p><Link className="action-link" to={paths.reservations}>프로그램 예약 <ArrowUpRight size={18} /></Link></div></PageShell>; }

export function NoticesPage() { return <NoticesListing />; }

export function NoticeDetailPage() { const { noticeId } = useParams(); const index = notices.findIndex((row) => row.id === noticeId); if (index < 0) return <NotFoundPage />; return <NoticeDetail item={notices[index]} previous={notices[index - 1]} next={notices[index + 1]} />; }

export function NewsroomPage() { return <PageShell eyebrow="NEWSROOM" title="현대 모터스튜디오의 이야기" intro="공간과 사람, 모빌리티의 새로운 소식을 만나보세요."><div className="page-grid">{news.map((item) => <ContentCard key={item.id} image={item.image} eyebrow={item.subtitle} title={item.title} description={item.description} to={paths.location(item.location)} />)}</div></PageShell>; }

export function NotFoundPage() { return <PageShell eyebrow="404 / NOT FOUND" title="페이지를 찾을 수 없습니다" intro="입력한 주소를 다시 확인해 주세요."><Link className="action-link" to={paths.home}>홈으로 돌아가기 <ArrowUpRight size={18} /></Link></PageShell>; }

export function SiteMapPage() { return <PageShell eyebrow="EXPLORE" title="사이트 안내"><div className="page-grid">{locations.map((item) => <Link key={item.slug} className="info-box" to={paths.location(item.slug)}><MapPin size={20} /><h2>현대 모터스튜디오 {item.name}</h2></Link>)}</div></PageShell>; }
