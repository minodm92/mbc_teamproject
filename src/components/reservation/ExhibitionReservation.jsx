import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Minus, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { paths } from '../../common/router/routePaths';
import { exhibitionReservations, getExhibitionTimes } from '../../common/data/exhibitionReservations';
import { useAuthStore } from '../../store/useAuthStore';
import { Calendar } from '../mobility/TestDrive';
import ReservationSelect from './ReservationSelect';
import '../mobility/TestDrive.css';
import './ProgramReservation.css';

const locations = [{ value: 'goyang', label: '고양' }, { value: 'seoul', label: '서울' }, { value: 'busan', label: '부산' }];
const initialCounts = (exhibition) => Object.fromEntries(exhibition.tickets.map((ticket) => [ticket.id, 0]));
const formatPrice = (price) => price === null ? '요금 확인 필요' : price === 0 ? '무료' : `${price.toLocaleString()}원`;
const dateKey = (day) => `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`;

export default function ExhibitionReservationPage() {
  const navigate = useNavigate();
  const pageRef = useRef(null);
  const user = useAuthStore((state) => state.user);
  const [location, setLocation] = useState('goyang');
  const [exhibitionId, setExhibitionId] = useState(exhibitionReservations.goyang[0].id);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [counts, setCounts] = useState(() => initialCounts(exhibitionReservations.goyang[0]));
  const availableExhibitions = exhibitionReservations[location];
  const exhibition = availableExhibitions.find((item) => item.id === exhibitionId) || availableExhibitions[0];
  const selectedLocation = locations.find((item) => item.value === location);
  const guests = Object.values(counts).reduce((sum, value) => sum + value, 0);
  const priceKnown = exhibition.tickets.every((ticket) => ticket.price !== null);
  const total = exhibition.tickets.reduce((sum, ticket) => sum + (ticket.price || 0) * (counts[ticket.id] || 0), 0);
  const times = getExhibitionTimes(exhibition, date);
  const ready = Boolean(priceKnown && date && times.includes(time) && guests >= exhibition.minGuests && (!exhibition.maxGuests || guests <= exhibition.maxGuests));
  const today = new Date();
  const firstDate = dateKey(new Date(today.getFullYear(), today.getMonth(), today.getDate() + exhibition.minDays));
  const lastDate = dateKey(new Date(today.getFullYear(), today.getMonth(), today.getDate() + exhibition.maxDays));

  useEffect(() => {
    const update = () => {
      if (!pageRef.current) return;
      const height = window.visualViewport?.height || window.innerHeight;
      pageRef.current.classList.toggle('is-summary-docked', pageRef.current.getBoundingClientRect().bottom <= height);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => { window.removeEventListener('scroll', update); window.removeEventListener('resize', update); };
  }, []);

  const resetSelection = (next) => { setDate(''); setTime(''); setCounts(initialCounts(next)); };
  const changeLocation = (next) => {
    const first = exhibitionReservations[next][0];
    setLocation(next); setExhibitionId(first.id); resetSelection(first);
  };
  const changeExhibition = (next) => {
    setExhibitionId(next); resetSelection(availableExhibitions.find((item) => item.id === next));
  };
  const stepExhibition = (offset) => {
    const index = availableExhibitions.findIndex((item) => item.id === exhibition.id);
    changeExhibition(availableExhibitions[(index + offset + availableExhibitions.length) % availableExhibitions.length].id);
  };
  const changeCount = (id, amount) => setCounts((current) => {
    const other = Object.entries(current).filter(([key]) => key !== id).reduce((sum, [, value]) => sum + value, 0);
    const next = Math.max(0, (current[id] || 0) + amount);
    return { ...current, [id]: exhibition.maxGuests ? Math.min(next, exhibition.maxGuests - other) : next };
  });
  const submit = () => {
    if (!user) { navigate(paths.login, { state: { from: paths.exhibitionReservation } }); return; }
    if (!ready) return;
    navigate(paths.reservationCheckout, { state: { reservation: {
      programName: exhibition.title, targetName: `${selectedLocation.label} 모터스튜디오`, date, time, guests, price: total,
      payload: { kind: 'exhibition', location, target: exhibition.id, program: exhibition.title, date, time,
        guests: String(guests), counts, unit: '명' },
    } } });
  };

  return <main className="booking-page exhibition-booking program-booking exhibition-reservation" ref={pageRef}>
    <div className="booking-page__heading"><h1>전시 예약</h1><span>체험할 전시 및 일정을 순서대로 선택해 주세요.</span></div>
    <div className="booking-grid exhibition-booking__grid">
      <section className="booking-panel booking-panel--vehicle exhibition-select">
        <div className="booking-panel__title"><div><h2>전시</h2><p>체험할 전시를 선택해주세요.</p></div></div>
        <ReservationSelect className="exhibition-location" label="지점" value={location} options={locations} onChange={changeLocation} />
        <div className="program-booking__picker">
          <label htmlFor="reservation-exhibition">전시 선택</label>
          <select id="reservation-exhibition" value={exhibition.id} onChange={(event) => changeExhibition(event.target.value)}>
            {availableExhibitions.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}
          </select>
        </div>
        <div className="program-booking__visual">
          <img className="exhibition-select__image" src={exhibition.image} alt={exhibition.title} />
          {availableExhibitions.length > 1 && <>
            <button type="button" className="program-booking__previous" aria-label="이전 전시" onClick={() => stepExhibition(-1)}><ChevronLeft /></button>
            <button type="button" className="program-booking__next" aria-label="다음 전시" onClick={() => stepExhibition(1)}><ChevronRight /></button>
          </>}
        </div>
        <div className="program-booking__dots" aria-label="전시 목록">
          {availableExhibitions.map((item) => <button key={item.id} type="button" aria-label={item.title} aria-pressed={item.id === exhibition.id} onClick={() => changeExhibition(item.id)} />)}
        </div>
        <div className="exhibition-select__copy">
          <h3>{exhibition.title}</h3><p>{exhibition.description}</p>
          <dl>
            <div><dt>참여 가능 연령</dt><dd>{exhibition.age}</dd></div>
            <div><dt>예약 가능 인원</dt><dd>{exhibition.reservationCount}</dd></div>
            <div><dt>운영시간</dt><dd className="program-booking__schedule">{exhibition.schedule}</dd></div>
            <div><dt>가격</dt><dd>{exhibition.tickets.map((ticket) => <div key={ticket.id}>{ticket.label} {formatPrice(ticket.price)}</div>)}</dd></div>
          </dl>
        </div>
      </section>
      <section className="booking-panel exhibition-schedule">
        <div className="booking-panel__title"><div><h2>체험 일정</h2><p>운영 요일과 시간을 확인해주세요.</p></div></div>
        <Calendar selected={date} onSelect={(next) => { setDate(next); setTime(''); }} isDateDisabled={(next) => next < firstDate || next > lastDate || !getExhibitionTimes(exhibition, next).length} />
        <div className="calendar-legend"><span><i className="available" />운영 요일</span><span><i />미운영/지난 날짜</span><span><i className="selected" />선택</span></div>
        <div className="time-picker"><h3>{date ? '방문 예정 시간을 선택해 주세요.' : '체험할 날짜를 먼저 선택해 주세요.'}</h3>
          {date && <div>{times.map((item) => <button key={item} type="button" className={time === item ? 'is-active' : ''} onClick={() => setTime(item)}>{item}</button>)}</div>}
        </div>
      </section>
      <section className="booking-panel exhibition-price">
        <div className="booking-panel__title"><div><h2>체험 가격/인원 선택</h2></div></div>
        <img src={exhibition.image} alt={exhibition.title} />
        <div className="ticket-box"><h3>{exhibition.title}</h3>
          {exhibition.tickets.map((ticket) => <div className="ticket-row" key={ticket.id}>
            <div><strong>{ticket.label}</strong><span>{ticket.age}</span><span>{formatPrice(ticket.price)}</span></div>
            <div className="ticket-counter">
              <button type="button" aria-label={`${ticket.label} 인원 줄이기`} disabled={!counts[ticket.id]} onClick={() => changeCount(ticket.id, -1)}><Minus /></button>
              <b aria-live="polite">{counts[ticket.id] || 0}</b>
              <button type="button" aria-label={`${ticket.label} 인원 늘리기`} disabled={Boolean(exhibition.maxGuests && guests >= exhibition.maxGuests)} onClick={() => changeCount(ticket.id, 1)}><Plus /></button>
              <small>{ticket.price === null ? '확인 필요' : `${(ticket.price * (counts[ticket.id] || 0)).toLocaleString()}원`}</small>
            </div>
          </div>)}
          <p className="ticket-total">합계 : <strong>{priceKnown ? `${total.toLocaleString()}원` : '요금 확인 필요'}</strong></p>
        </div>
      </section>
    </div>
    <div className="booking-summary"><div className="booking-summary__inner"><dl><div><dt>체험 전시</dt><dd>{exhibition.title}</dd></div><div><dt>체험 인원</dt><dd>{guests ? `${guests}명` : '-'}</dd></div><div><dt>체험 일시</dt><dd>{date && time ? `${date.replaceAll('-', '.')} ${time}` : '-'}</dd></div></dl><div className="booking-summary__action"><p>예상 결제 금액<strong>{priceKnown ? `${total.toLocaleString()}원` : '확인 필요'}</strong></p><button type="button" disabled={!priceKnown || (Boolean(user) && !ready)} onClick={submit}>{!priceKnown ? '요금 확인 필요' : user ? '예약하기' : '로그인 후 예약'}</button></div></div></div>
  </main>;
}
