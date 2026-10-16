import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CalendarDays, ChevronRight, FileText, LogOut } from 'lucide-react';
import { profileAvatars } from '../../common/data/content';
import { paths } from '../../common/router/routePaths';
import { useAuthStore } from '../../store/useAuthStore';
import { useInquiryStore } from '../../store/useInquiryStore';
import { useReservationStore } from '../../store/useReservationStore';
import PageShell from '../../common/layout/PageShell';
import { compressProfileImage } from '../../common/utils/imageUpload';
import { openKakaoPostcode } from '../../common/api/kakaoPostcode';
import membershipSeparator from './assets/membership-separator.svg';
import membershipArrow from './assets/membership-arrow-up-right.svg';
import './MyPageContent.css';

const EXPERIENCE_RESULT_KEY = 'hyundai-experience-finder-result';
const experienceLabels = {
    mobility: '차량 전시 · 시승',
    art: '아트 전시',
    experience: '체험 전시',
    program: '프로그램',
};
const preferenceLabels = {
    immersive: '몰입감 있는 경험',
    interactive: '직접 참여하는 경험',
    explore: '깊이 알아가는 경험',
    sensory: '감각적인 경험',
    together: '함께 즐기는 경험',
    discover: '새로운 발견의 경험',
};
const dashboardPanels = {
    reservations: 'RESERVATION HISTORY',
    inquiries: 'INQUIRY HISTORY',
    inquiryWrite: 'WRITE AN INQUIRY',
    profile: 'PROFILE EDIT',
};
const periodOptions = [
    { label: '1개월', months: 1 },
    { label: '3개월', months: 3 },
    { label: '6개월', months: 6 },
    { label: '1년', months: 12 },
];

function formatDateInput(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function createDateRange(months = 1) {
    const end = new Date();
    const start = new Date(end);
    const day = start.getDate();
    start.setDate(1);
    start.setMonth(start.getMonth() - months);
    const lastDay = new Date(start.getFullYear(), start.getMonth() + 1, 0).getDate();
    start.setDate(Math.min(day, lastDay));
    return { start: formatDateInput(start), end: formatDateInput(end) };
}

function normalizeReservationDate(value) {
    if (typeof value !== 'string') return '';
    const match = value.trim().match(/^(\d{4})[.-](\d{1,2})[.-](\d{1,2})/);
    if (!match) return '';
    const [, year, month, day] = match;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

function getExperienceSummary() {
    if (typeof window === 'undefined') return '아직 찾은 경험이 없습니다.';
    try {
        const result = JSON.parse(window.localStorage.getItem(EXPERIENCE_RESULT_KEY));
        if (!result) return '아직 찾은 경험이 없습니다.';
        const recommendation = result.recommendationTitles?.[0];
        return recommendation
            || [experienceLabels[result.experienceType], preferenceLabels[result.preference]]
                .filter(Boolean)
                .join(' · ')
            || '아직 찾은 경험이 없습니다.';
    } catch {
        return '아직 찾은 경험이 없습니다.';
    }
}

export function MyPage() {
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);
    const navigate = useNavigate();
    const [period, setPeriod] = useState('1개월');
    const [dateRange, setDateRange] = useState(createDateRange);
    const [appliedRange, setAppliedRange] = useState(createDateRange);
    const [filterError, setFilterError] = useState('');
    const [activePanel, setActivePanel] = useState(null);
    const [experienceSummary] = useState(getExperienceSummary);
    const allInquiries = useInquiryStore((state) => state.inquiries ?? []);
    const allReservations = useReservationStore((state) => state.reservations ?? []);
    const inquiries = allInquiries.filter((item) => item.userId === user?.id);
    const reservations = allReservations.filter((item) => item.userId === user?.id);
    const filteredReservations = reservations.filter((item) => {
        const reservationDate = normalizeReservationDate(item.date);
        if (!reservationDate) return true;
        return reservationDate >= appliedRange.start && reservationDate <= appliedRange.end;
    });

    function selectPeriod(label, months) {
        const nextRange = createDateRange(months);
        setPeriod(label);
        setDateRange(nextRange);
        setAppliedRange(nextRange);
        setFilterError('');
    }

    function changeDateRange(field, value) {
        setPeriod('');
        setDateRange((current) => ({ ...current, [field]: value }));
        setFilterError('');
    }

    function applyDateRange(event) {
        event.preventDefault();
        if (!dateRange.start || !dateRange.end) {
            setFilterError('조회할 시작일과 종료일을 모두 선택해 주세요.');
            return;
        }
        if (dateRange.start > dateRange.end) {
            setFilterError('시작일은 종료일보다 늦을 수 없습니다.');
            return;
        }
        setAppliedRange(dateRange);
        setFilterError('');
    }

    return (
        <main className="mypage-dashboard">
            <div className="mypage-dashboard__breadcrumb" aria-hidden="true" />
            <div className="mypage-dashboard__layout">
                <aside className="mypage-sidebar">
                    <nav aria-label="마이페이지 메뉴">
                        <section>
                            <h2>마이 페이지</h2>
                            <button
                                className="mypage-sidebar__item"
                                type="button"
                                aria-pressed={activePanel === null}
                                onClick={() => setActivePanel(null)}
                            >
                                내 정보
                                <ChevronRight />
                            </button>
                        </section>
                        <section>
                            <h2>나의 예약</h2>
                            <button
                                className="mypage-sidebar__item"
                                type="button"
                                aria-pressed={activePanel === 'reservations'}
                                onClick={() => setActivePanel('reservations')}
                            >
                                예약 내역
                                <ChevronRight />
                            </button>
                            <Link to={paths.reservations}>
                                새로운 예약
                                <ChevronRight />
                            </Link>
                        </section>
                        <section>
                            <h2>나의 활동</h2>
                            <button
                                className="mypage-sidebar__item"
                                type="button"
                                aria-pressed={activePanel === 'inquiries'}
                                onClick={() => setActivePanel('inquiries')}
                            >
                                고객문의 내역
                                <ChevronRight />
                            </button>
                            <button
                                className="mypage-sidebar__item"
                                type="button"
                                aria-pressed={activePanel === 'inquiryWrite'}
                                onClick={() => setActivePanel('inquiryWrite')}
                            >
                                문의 작성
                                <ChevronRight />
                            </button>
                        </section>
                        <section>
                            <h2>개인정보 관리</h2>
                            <button
                                className="mypage-sidebar__item"
                                type="button"
                                aria-pressed={activePanel === 'profile'}
                                onClick={() => setActivePanel('profile')}
                            >
                                프로필 수정
                                <ChevronRight />
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    sessionStorage.setItem('hms-logout-notice', 'true');
                                    logout();
                                    window.location.replace(paths.home);
                                }}
                            >
                                로그아웃
                                <LogOut />
                            </button>
                        </section>
                    </nav>
                </aside>

                <div className="mypage-dashboard__content">
                    <header className="mypage-dashboard__heading">
                        <div>
                            <span>MY HYUNDAI MOTORSTUDIO</span>
                            <h2>{user?.name || '테스트 사용자'}님의 마이페이지</h2>
                        </div>
                        <p>{user?.email}</p>
                    </header>

                    <section className="mypage-finding" aria-label="경험 찾기 결과">
                        <span>관심 분야</span>
                        <strong>{experienceSummary}</strong>
                    </section>

                    <section
                        className="mypage-information"
                        aria-labelledby="mypage-information-title"
                    >
                        <p className="mypage-information__eyebrow">
                            {activePanel ? dashboardPanels[activePanel] : 'HYUNDAI MOTORSTUDIO CLUB'}
                        </p>
                        <h2 id="mypage-information-title">
                            {activePanel ? '제작 중인 페이지입니다.' : 'BASIC'}
                        </h2>
                        <p className="mypage-information__description">
                            {activePanel ? (
                                <>
                                    상세 페이지는 현재 작업 중인 페이지입니다.
                                    <br />
                                    이용에 불편을 드려 죄송합니다.
                                </>
                            ) : (
                                <>
                                    현대 모터스튜디오의 기본 멤버십 전시와 프로그램,
                                    <br />
                                    다양한 멤버십 혜택을 경험해보세요.
                                </>
                            )}
                        </p>
                        {!activePanel && (
                            <div className="mypage-information__footer">
                                <ul className="mypage-information__benefits" aria-label="멤버십 혜택">
                                    {['PROGRAM BENEFIT', 'MEMBER CONTENT', 'EVENT ACCESS'].map(
                                        (benefit, index) => (
                                            <li key={benefit}>
                                                {index > 0 && (
                                                    <img
                                                        src={membershipSeparator}
                                                        alt=""
                                                        aria-hidden="true"
                                                    />
                                                )}
                                                <span>{benefit}</span>
                                            </li>
                                        )
                                    )}
                                </ul>
                                <Link className="mypage-information__link" to={paths.membership}>
                                    멤버십 혜택 확인하기
                                    <img src={membershipArrow} alt="" aria-hidden="true" />
                                </Link>
                            </div>
                        )}
                    </section>

                    {activePanel ? (
                        <section className="mypage-empty mypage-empty--construction">
                            <FileText />
                            <strong>제작 중인 페이지입니다.</strong>
                            <p>
                                상세 페이지는 현재 작업 중인 페이지입니다.
                                <br />
                                이용에 불편을 드려 죄송합니다.
                            </p>
                        </section>
                    ) : (
                    <>
                        <section className="mypage-history">
                        <div className="mypage-history__title">
                            <h2>예약 및 활동 현황</h2>
                            <Link to={paths.myReservations}>
                                전체 예약 보기
                                <ChevronRight />
                            </Link>
                        </div>
                        <form className="mypage-filter" onSubmit={applyDateRange}>
                            <div>
                                {periodOptions.map((item) => (
                                    <button
                                        className={period === item.label ? 'is-active' : ''}
                                        type="button"
                                        aria-pressed={period === item.label}
                                        onClick={() => selectPeriod(item.label, item.months)}
                                        key={item.label}
                                    >
                                        {item.label}
                                    </button>
                                ))}
                            </div>
                            <label>
                                <span>시작일</span>
                                <input
                                    type="date"
                                    value={dateRange.start}
                                    onChange={(event) => changeDateRange('start', event.target.value)}
                                />
                            </label>
                            <label>
                                <span>종료일</span>
                                <input
                                    type="date"
                                    value={dateRange.end}
                                    onChange={(event) => changeDateRange('end', event.target.value)}
                                />
                            </label>
                            <button type="submit">조회</button>
                            {filterError && (
                                <p className="mypage-filter__error" role="alert">
                                    {filterError}
                                </p>
                            )}
                        </form>

                        {filteredReservations.length ? (
                            <div className="mypage-reservations">
                                {filteredReservations.map((item) => (
                                    <article key={item.id}>
                                        <CalendarDays />
                                        <div>
                                            <span>{item.status}</span>
                                            <h3>
                                                {item.programName ||
                                                    item.targetName ||
                                                    '현대 모터스튜디오 예약'}
                                            </h3>
                                            <p>
                                                {item.date} {item.time} · {item.guests}명
                                            </p>
                                        </div>
                                        <Link to={paths.myReservations}>
                                            상세 보기
                                            <ChevronRight />
                                        </Link>
                                    </article>
                                ))}
                            </div>
                        ) : (
                            <div className="mypage-empty">
                                <FileText />
                                <strong>
                                    {reservations.length
                                        ? '선택한 기간의 예약 및 이용 내역이 없습니다.'
                                        : '예약 및 이용 내역이 없습니다.'}
                                </strong>
                                <p>
                                    {reservations.length
                                        ? '다른 조회 기간을 선택해 주세요.'
                                        : '현대 모터스튜디오의 새로운 경험을 예약해 보세요.'}
                                </p>
                                {!reservations.length && (
                                    <Link to={paths.reservations}>예약하러 가기</Link>
                                )}
                            </div>
                        )}
                        </section>

                        <section className="mypage-quick-links">
                            <Link to={paths.myReservations}>
                                <CalendarDays />
                                <span>
                                    나의 예약<strong>{reservations.length}건</strong>
                                </span>
                                <ChevronRight />
                            </Link>
                            <Link to={paths.inquiries}>
                                <FileText />
                                <span>
                                    고객문의<strong>{inquiries.length}건</strong>
                                </span>
                                <ChevronRight />
                            </Link>
                        </section>
                        <button className="mypage-mobile-logout" type="button" onClick={() => {
                            sessionStorage.setItem('hms-logout-notice', 'true');
                            logout();
                            window.location.replace(paths.home);
                        }}>로그아웃</button>
                    </>
                    )}
                </div>
            </div>
        </main>
    );
}

export function ProfileEditPage() {
    const user = useAuthStore((state) => state.user);
    const updateProfile = useAuthStore((state) => state.updateProfile);
    const navigate = useNavigate();
    const [values, setValues] = useState({
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
        profileImageType: user.profileImageType || 'avatar',
        selectedAvatarId: user.selectedAvatarId || 'character-01',
        address: user.address || {},
        marketingConsent: Boolean(user.marketingConsent),
    });
    const [error, setError] = useState('');
    async function pickFile(event) {
        const file = event.target.files?.[0];
        event.target.value = '';
        if (!file) return;
        try {
            const dataUrl = await compressProfileImage(file);
            setValues((current) => ({
                ...current,
                profileImage: dataUrl,
                profileImageType: 'upload',
                selectedAvatarId: null,
            }));
            setError('');
        } catch (cause) {
            setError(cause.message);
        }
    }
    async function searchAddress() {
        try {
            await openKakaoPostcode((result) => {
                setValues((current) => ({
                    ...current,
                    address: {
                        ...current.address,
                        zonecode: result.zonecode,
                        roadAddress: result.roadAddress,
                        jibunAddress: result.jibunAddress,
                        extraAddress: result.bname,
                    },
                }));
                setError('');
            });
        } catch (cause) {
            setError(cause.message);
        }
    }
    return (
        <PageShell eyebrow="PROFILE" title="프로필 수정">
            <form
                className="profile-form"
                onSubmit={(event) => {
                    event.preventDefault();
                    updateProfile(values);
                    navigate(paths.mypage);
                }}
            >
                <div className="profile-form__image">
                    <img
                        src={values.profileImage}
                        alt="현재 프로필 미리보기"
                        width="130"
                        height="130"
                    />
                    <label className="profile-form__upload">
                        사진 선택
                        <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={pickFile}
                        />
                    </label>
                    <button
                        type="button"
                        onClick={() =>
                            setValues({
                                ...values,
                                profileImage: profileAvatars[0].src,
                                profileImageType: 'avatar',
                                selectedAvatarId: profileAvatars[0].id,
                            })
                        }
                    >
                        사진 삭제
                    </button>
                </div>
                {error && (
                    <p className="form-error" role="alert">
                        {error}
                    </p>
                )}
                <h2>기본 캐릭터 선택</h2>
                <div className="profile-form__avatars">
                    {profileAvatars.map((avatar) => (
                        <button
                            type="button"
                            key={avatar.id}
                            aria-pressed={values.selectedAvatarId === avatar.id}
                            onClick={() =>
                                setValues({
                                    ...values,
                                    profileImage: avatar.src,
                                    profileImageType: 'avatar',
                                    selectedAvatarId: avatar.id,
                                })
                            }
                        >
                            <img src={avatar.src} alt="" width="80" height="80" />
                            <span>{avatar.name}</span>
                        </button>
                    ))}
                </div>
                <div className="profile-form__fields">
                    <label>
                        이름
                        <input
                            value={values.name}
                            onChange={(event) => setValues({ ...values, name: event.target.value })}
                            required
                        />
                    </label>
                    <label>
                        이메일
                        <input
                            type="email"
                            value={values.email}
                            onChange={(event) =>
                                setValues({ ...values, email: event.target.value })
                            }
                            required
                        />
                    </label>
                    <label>
                        우편번호
                        <input
                            value={values.address.zonecode || ''}
                            onChange={(event) =>
                                setValues({
                                    ...values,
                                    address: { ...values.address, zonecode: event.target.value },
                                })
                            }
                        />
                    </label>
                    <button type="button" onClick={searchAddress}>
                        카카오 주소검색
                    </button>
                    <label>
                        도로명 주소
                        <input
                            value={values.address.roadAddress || ''}
                            onChange={(event) =>
                                setValues({
                                    ...values,
                                    address: { ...values.address, roadAddress: event.target.value },
                                })
                            }
                        />
                    </label>
                    <label>
                        상세 주소
                        <input
                            value={values.address.detailAddress || ''}
                            onChange={(event) =>
                                setValues({
                                    ...values,
                                    address: {
                                        ...values.address,
                                        detailAddress: event.target.value,
                                    },
                                })
                            }
                        />
                    </label>
                </div>
                <label className="profile-form__consent">
                    <input
                        type="checkbox"
                        checked={values.marketingConsent}
                        onChange={(event) =>
                            setValues({ ...values, marketingConsent: event.target.checked })
                        }
                    />{' '}
                    마케팅 정보 수신 동의
                </label>
                <div className="form-actions">
                    <button
                        type="button"
                        className="form-button form-button--outline"
                        onClick={() => navigate(paths.mypage)}
                    >
                        취소
                    </button>
                    <button type="submit" className="form-button">
                        변경사항 저장
                    </button>
                </div>
            </form>
        </PageShell>
    );
}
