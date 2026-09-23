import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, MapPin } from 'lucide-react';
import { locations, exhibitions, programs, notices, news, vehicles } from '../../common/data/content';
import { paths } from '../../common/router/routePaths';
import ContentCard from '../../ui/ContentCard';
import PageShell from '../../common/layout/PageShell';
import './ContentPages.css';

export function MotorstudioPage() { return <PageShell eyebrow="ABOUT HYUNDAI MOTORSTUDIO" title="움직임에서 경험으로" intro="현대 모터스튜디오는 자동차를 넘어 사람과 문화가 만나는 공간입니다."><div className="editorial-panel"><div><span>WHAT YOU FIND WHEN MOTION MEETS EXPERIENCE</span><h2>모빌리티의 새로운 가능성을 발견하는 곳</h2><p>공간마다 다른 이야기와 경험이 기다립니다. 원하는 지점을 선택해 자세한 정보를 확인해 보세요.</p></div><img src="/images/locations/seoul.svg" alt="현대 모터스튜디오 공간 일러스트" width="900" height="600" /></div><div className="page-grid">{locations.map((item) => <ContentCard key={item.slug} image={item.image} eyebrow={item.english} title={`현대 모터스튜디오 ${item.name}`} description={item.description} to={paths.location(item.slug)} />)}</div></PageShell>; }

export function LocationPage() { const { location } = useParams(); const item = locations.find((row) => row.slug === location); if (!item) return <NotFoundPage />; return <PageShell eyebrow={`HYUNDAI MOTORSTUDIO ${item.english}`} title={`현대 모터스튜디오 ${item.name}`} intro={item.tagline}><div className="feature-image"><img src={item.image} alt={`${item.name} 공간 일러스트`} width="1500" height="850" /></div><div className="detail-copy"><span>EXPLORE THE SPACE</span><h2>{item.tagline}</h2><p>{item.description}</p><Link className="action-link" to={paths.reservations}>방문 예약 <ArrowUpRight size={18} /></Link></div></PageShell>; }

export function MobilityPage() { return <PageShell eyebrow="MOBILITY" title="새로운 움직임을 경험하다" intro="미래의 이동 경험을 가까이에서 만나보세요."><div className="page-grid">{vehicles.map((item) => <ContentCard key={item.id} image={item.image} eyebrow={item.category} title={item.name} description={item.description} to={paths.reservations} />)}</div></PageShell>; }

export function ExhibitionsPage() { return <PageShell eyebrow="EXHIBITION" title="지금 만나볼 수 있는 전시" intro="디자인, 기술, 문화가 만나는 현대 모터스튜디오의 전시를 소개합니다."><div className="page-grid">{exhibitions.map((item) => <ContentCard key={item.id} image={item.image} eyebrow={`${item.location} · ${item.date}`} title={item.subtitle} description={item.description} to={paths.exhibition(item.id)} />)}</div></PageShell>; }

export function ExhibitionDetailPage() { const { exhibitionId } = useParams(); const item = exhibitions.find((row) => row.id === exhibitionId); if (!item) return <NotFoundPage />; return <PageShell eyebrow={`${item.location} / EXHIBITION`} title={item.subtitle} intro={item.title}><div className="feature-image"><img src={item.image} alt={`${item.subtitle} 전시 일러스트`} width="1500" height="850" /></div><div className="detail-copy"><span>{item.date}</span><h2>{item.title}</h2><p>{item.description}</p><Link className="action-link" to={paths.reservations}>예약하기 <ArrowUpRight size={18} /></Link></div></PageShell>; }

export function ProgramsPage() { return <PageShell eyebrow="PROGRAM" title="직접 경험하는 모빌리티" intro="현대 모터스튜디오에서 새로운 생각과 감각을 깨워보세요."><div className="page-grid">{programs.map((item) => <ContentCard key={item.id} image={item.image} eyebrow={item.location} title={item.title} description={item.description} to={paths.program(item.id)} />)}</div></PageShell>; }

export function ProgramDetailPage() { const { programId } = useParams(); const item = programs.find((row) => row.id === programId); if (!item) return <NotFoundPage />; return <PageShell eyebrow={`${item.location} / PROGRAM`} title={item.title} intro={item.english}><div className="feature-image"><img src={item.image} alt={`${item.title} 프로그램 일러스트`} width="1500" height="850" /></div><div className="detail-copy"><span>JOIN THE EXPERIENCE</span><h2>{item.title}</h2><p>{item.description}</p><Link className="action-link" to={paths.reservations}>프로그램 예약 <ArrowUpRight size={18} /></Link></div></PageShell>; }

export function MembershipPage() { return <PageShell eyebrow="MEMBERSHIP" title="경험을 더 가까이" intro="현대 모터스튜디오 멤버십과 함께 새로운 소식을 만나보세요."><div className="info-box"><h2>HYUNDAI MOTORSTUDIO MEMBERSHIP</h2><p>회원 계정으로 예약 내역을 관리하고 프로그램 정보를 확인할 수 있습니다.</p><Link className="action-link" to={paths.signup}>가입하기 <ArrowUpRight size={18} /></Link></div></PageShell>; }

export function NoticesPage() { return <PageShell eyebrow="NOTICE" title="공지사항" intro="현대 모터스튜디오의 운영과 이용 소식을 확인하세요."><div className="notice-list">{notices.map((item) => <Link key={item.id} to={paths.notice(item.id)}><span>{item.category}</span><strong>{item.title}</strong><time>{item.date}</time><ArrowUpRight size={20} /></Link>)}</div></PageShell>; }

export function NoticeDetailPage() { const { noticeId } = useParams(); const item = notices.find((row) => row.id === noticeId); if (!item) return <NotFoundPage />; return <PageShell eyebrow={`${item.category} / ${item.date}`} title={item.title}><article className="notice-detail"><p>{item.content}</p><Link className="action-link" to={paths.notices}><ArrowLeft size={18} /> 목록으로</Link></article></PageShell>; }

export function NewsroomPage() { return <PageShell eyebrow="NEWSROOM" title="현대 모터스튜디오의 이야기" intro="공간과 사람, 모빌리티의 새로운 소식을 만나보세요."><div className="page-grid">{news.map((item) => <ContentCard key={item.id} image={item.image} eyebrow={item.subtitle} title={item.title} description={item.description} to={paths.location(item.location)} />)}</div></PageShell>; }

export function NotFoundPage() { return <PageShell eyebrow="404 / NOT FOUND" title="페이지를 찾을 수 없습니다" intro="입력한 주소를 다시 확인해 주세요."><Link className="action-link" to={paths.home}>홈으로 돌아가기 <ArrowUpRight size={18} /></Link></PageShell>; }

export function SiteMapPage() { return <PageShell eyebrow="EXPLORE" title="사이트 안내"><div className="page-grid">{locations.map((item) => <Link key={item.slug} className="info-box" to={paths.location(item.slug)}><MapPin size={20} /><h2>현대 모터스튜디오 {item.name}</h2></Link>)}</div></PageShell>; }
