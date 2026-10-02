import { createElement, useRef, useState } from 'react';
import {
    Car,
    ChevronRight,
    Compass,
    GalleryVerticalEnd,
    Hand,
    MapPin,
    MessageCircleMore,
    RotateCcw,
    Sparkles,
    UsersRound,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { experienceFinderHero } from '../../common/data/experienceFinder';
import { getExperienceRecommendations } from '../../common/api/experienceFinder';
import './ExperienceFinder.css';

const experienceTypes = [
    {
        id: 'mobility',
        label: '차량을 직접 보고\n운전해보고 싶어요',
        category: '차량전시 · 시승',
        icon: Car,
    },
    {
        id: 'art',
        label: '작품과 공간을\n감상하고 싶어요',
        category: '아트전시',
        icon: GalleryVerticalEnd,
    },
    {
        id: 'experience',
        label: '몰입감 있는 전시를\n직접 체험하고 싶어요',
        category: '체험전시',
        icon: Sparkles,
    },
    {
        id: 'program',
        label: '클래스와 프로그램에\n참여하고 싶어요',
        category: '프로그램',
        icon: UsersRound,
    },
];
const locations = [
    { id: 'goyang', label: '고양' },
    { id: 'seoul', label: '서울' },
    { id: 'hanam', label: '하남' },
    { id: 'busan', label: '부산' },
    { id: 'all', label: '상관없어요' },
];
const preferences = [
    { id: 'immersive', english: 'Immersive', korean: '몰입감 있게 빠져드는 경험', icon: Sparkles },
    {
        id: 'interactive',
        english: 'Interactive',
        korean: '직접 움직이고 반응하는 경험',
        icon: Hand,
    },
    { id: 'explore', english: 'Explore', korean: '깊이 알아가고 탐구하는 경험', icon: Compass },
    {
        id: 'sensory',
        english: 'Sensory',
        korean: '감각적으로 보고 느끼는 경험',
        icon: GalleryVerticalEnd,
    },
    { id: 'together', english: 'Together', korean: '함께 즐기고 공유하는 경험', icon: UsersRound },
    {
        id: 'discover',
        english: 'Discover',
        korean: '새로운 관점과 아이디어를 발견하는 경험',
        icon: Sparkles,
    },
];
const categoryLabels = {
    vehicleExhibition: '차량전시',
    testDrive: '시승',
    artExhibition: '아트전시',
    experientialExhibition: '체험전시',
    program: '프로그램',
};

function StepHeading({ number, children, description }) {
    return (
        <div className="match-step__heading">
            <span>
                <MessageCircleMore size={22} /> Step {number}.
            </span>
            <h2>
                {children}
                <em>*</em>
            </h2>
            {description && <p>※ {description}</p>}
        </div>
    );
}

export default function ExperienceFinder() {
    const panelRef = useRef(null),
        dragRef = useRef({ active: false, y: 0, scroll: 0 });
    const step1Ref = useRef(null),
        step2Ref = useRef(null),
        step3Ref = useRef(null);
    const [experienceType, setExperienceType] = useState('');
    const [location, setLocation] = useState('');
    const [preference, setPreference] = useState('');
    const [showResult, setShowResult] = useState(false);
    const [recommendations, setRecommendations] = useState([]);
    const complete = Boolean(experienceType && location && preference);
    const hero = experienceFinderHero[experienceType] || experienceFinderHero.default;

    function scrollToStep(stepRef) {
        const panel = panelRef.current,
            step = stepRef.current;
        if (!panel || !step) return;
        const top =
            panel.scrollTop +
            step.getBoundingClientRect().top -
            panel.getBoundingClientRect().top -
            24;
        panel.scrollTo({ top, behavior: 'smooth' });
    }
    function selectExperienceType(value) {
        setExperienceType(value);
        setLocation('');
        setPreference('');
        requestAnimationFrame(() => scrollToStep(step2Ref));
    }
    function selectLocation(value) {
        if (!experienceType) return;
        setLocation(value);
        setPreference('');
        requestAnimationFrame(() => scrollToStep(step3Ref));
    }
    function selectPreference(value) {
        if (!experienceType || !location) return;
        setPreference(value);
    }
    function dragStart(event) {
        if (event.target.closest('button, a')) return;
        if (event.pointerType === 'mouse' && event.button !== 0) return;
        dragRef.current = { active: true, y: event.clientY, scroll: panelRef.current.scrollTop };
        panelRef.current.setPointerCapture(event.pointerId);
        panelRef.current.classList.add('is-dragging');
    }
    function dragMove(event) {
        if (!dragRef.current.active) return;
        panelRef.current.scrollTop = dragRef.current.scroll - (event.clientY - dragRef.current.y);
    }
    function dragEnd(event) {
        if (!dragRef.current.active) return;
        dragRef.current.active = false;
        if (panelRef.current?.hasPointerCapture(event.pointerId))
            panelRef.current.releasePointerCapture(event.pointerId);
        panelRef.current?.classList.remove('is-dragging');
    }
    function reset() {
        setShowResult(false);
        setRecommendations([]);
        setExperienceType('');
        setLocation('');
        setPreference('');
        requestAnimationFrame(() => scrollToStep(step1Ref));
    }
    function showRecommendations() {
        if (!complete) return;
        const nextRecommendations = getExperienceRecommendations({ experienceType, location, preference });
        setRecommendations(nextRecommendations);
        window.localStorage.setItem('hyundai-experience-finder-result', JSON.stringify({
            experienceType,
            location,
            preference,
            recommendationTitles: nextRecommendations.map((item) => item.title),
        }));
        setShowResult(true);
        requestAnimationFrame(() => panelRef.current?.scrollTo({ top: 0, behavior: 'smooth' }));
    }
    function returnToQuestions() {
        setShowResult(false);
        requestAnimationFrame(() => panelRef.current?.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    return (
        <main className="match-page">
            <div className="match-page__backdrop" aria-hidden="true">
                <img
                    key={experienceType || 'default'}
                    src={hero.image}
                    alt=""
                    onError={(event) => {
                        if (!event.currentTarget.src.endsWith(experienceFinderHero.default.image))
                            event.currentTarget.src = experienceFinderHero.default.image;
                    }}
                />
            </div>
            <div className="match-page__title">
                <i>
                    <Sparkles size={29} />
                </i>
                <div>
                    <span>Lifestyle Match</span>
                    <h1>{hero.title}</h1>
                    <p>아래 설문을 완료하면 취향에 맞는 현대 모터스튜디오 경험을 알려드려요.</p>
                </div>
            </div>
            <aside className="match-panel" aria-label={showResult ? '경험 추천 결과' : '경험 찾기 설문'}>
                <div
                    className="match-panel__scroll"
                    ref={panelRef}
                    onPointerDown={dragStart}
                    onPointerMove={dragMove}
                    onPointerUp={dragEnd}
                    onPointerCancel={dragEnd}
                >
                    {showResult ? (
                        <section className="match-result">
                            <header className="match-result__heading">
                                <span>RESULT</span>
                                <h2>나에게 맞는 경험 추천</h2>
                                <p>선택한 조건을 바탕으로<br />현대 모터스튜디오의 경험을 추천합니다.</p>
                            </header>
                            <div className="match-result__chips" aria-label="선택한 조건">
                                <span>{experienceTypes.find(item => item.id === experienceType)?.label}</span>
                                <span>{locations.find(item => item.id === location)?.label}</span>
                                <span>{preferences.find(item => item.id === preference)?.korean}</span>
                            </div>
                            {recommendations.length ? (
                                <div className="match-result__list">
                                    {recommendations.map(item => (
                                        <article className="match-result__card" key={item.id}>
                                            {item.image && <img src={item.image} alt="" />}
                                            <div className="match-result__card-body">
                                                <span className="match-result__category">{categoryLabels[item.category]}</span>
                                                <h3>{item.title}</h3>
                                                <p className="match-result__location">{item.locationSlugs.map(slug => locations.find(place => place.id === slug)?.label || slug).join(' · ')}</p>
                                                <p>{item.description}</p>
                                                <div className="match-result__links">
                                                    {item.detailRoute && <Link to={item.detailRoute}>자세히 보기 <ChevronRight size={16} /></Link>}
                                                    {item.reservationStatus === 'reservationAvailable' && item.reservationRoute && <Link to={item.reservationRoute}>예약하기 <ChevronRight size={16} /></Link>}
                                                </div>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            ) : (
                                <div className="match-result__empty">
                                    <strong>선택한 조건에 맞는 경험을 찾지 못했습니다.</strong>
                                    <p>조건을 변경해 다른 경험을 찾아보세요.</p>
                                </div>
                            )}
                            <div className="match-panel__spacer" />
                        </section>
                    ) : <>
                    <section className="match-step" ref={step1Ref}>
                        <StepHeading
                            number="1"
                            description="원하는 경험의 방향을 하나 선택해 주세요."
                        >
                            어떤 경험을 찾고 계신가요?
                        </StepHeading>
                        <div className="match-options match-options--vehicles">
                            {experienceTypes.map((item) => (
                                <button
                                    key={item.id}
                                    type="button"
                                    aria-pressed={experienceType === item.id}
                                    className={experienceType === item.id ? 'is-selected' : ''}
                                    onClick={() => selectExperienceType(item.id)}
                                >
                                    {createElement(item.icon)}
                                    <strong>{item.label}</strong>
                                    <span>{item.category}</span>
                                </button>
                            ))}
                        </div>
                    </section>
                    <section
                        className={`match-step${!experienceType ? ' is-disabled' : ''}`}
                        ref={step2Ref}
                    >
                        <StepHeading
                            number="2"
                            description="선택한 지점에서 이용 가능한 경험을 중심으로 추천해 드립니다."
                        >
                            어디에서 경험하고 싶으신가요?
                        </StepHeading>
                        <div className="match-options match-options--ages">
                            {locations.map((item) => (
                                <button
                                    key={item.id}
                                    type="button"
                                    disabled={!experienceType}
                                    aria-pressed={location === item.id}
                                    className={location === item.id ? 'is-selected' : ''}
                                    onClick={() => selectLocation(item.id)}
                                >
                                    {item.id !== 'all' && <MapPin size={18} />}
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    </section>
                    <section
                        className={`match-step${!experienceType || !location ? ' is-disabled' : ''}`}
                        ref={step3Ref}
                    >
                        <StepHeading
                            number="3"
                            description="가장 마음에 드는 경험 방식을 하나 선택해 주세요."
                        >
                            어떤 경험에 더 끌리시나요?
                        </StepHeading>
                        <div className="match-options match-options--lifestyles">
                            {preferences.map((item) => (
                                <button
                                    key={item.id}
                                    type="button"
                                    disabled={!experienceType || !location}
                                    aria-pressed={preference === item.id}
                                    className={preference === item.id ? 'is-selected' : ''}
                                    onClick={() => selectPreference(item.id)}
                                >
                                    {createElement(item.icon)}
                                    <strong>{item.english}</strong>
                                    <span>{item.korean}</span>
                                </button>
                            ))}
                        </div>
                    </section>
                    <div className="match-panel__spacer" />
                    </>}
                </div>
                <div className="match-panel__actions">
                    {showResult ? (
                        <button className="match-panel__primary" type="button" onClick={returnToQuestions}>조건 다시 선택하기 <ChevronRight /></button>
                    ) : <>
                        <button className="match-panel__primary" type="button" disabled={!complete} onClick={showRecommendations}>결과 보기 <ChevronRight /></button>
                        <button type="button" onClick={reset}><RotateCcw /> 처음으로</button>
                    </>}
                </div>
            </aside>
            <div className="match-page__hint">
                <span />
                DRAG TO EXPLORE
                <span />
            </div>
        </main>
    );
}
