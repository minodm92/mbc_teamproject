import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Minus, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { paths } from '../../common/router/routePaths';
import { programReservations, getProgramTimes } from '../../common/data/programReservations';
import { useAuthStore } from '../../store/useAuthStore';
import { Calendar } from '../mobility/TestDrive';
import ReservationSelect from './ReservationSelect';
import '../mobility/TestDrive.css';
import './ProgramReservation.css';

const locations = [{ value: 'goyang', label: '고양' }, { value: 'seoul', label: '서울' }];

export default function ProgramReservationPage() {
  const navigate = useNavigate();
  const pageRef = useRef(null);
  const user = useAuthStore((state) => state.user);
  const [location, setLocation] = useState('goyang');
  const [programId, setProgramId] = useState(programReservations.goyang[0].id);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [count, setCount] = useState(0);
  const availablePrograms = programReservations[location];
  const program = availablePrograms.find((item) => item.id === programId) || availablePrograms[0];
  const selectedLocation = locations.find((item) => item.value === location);
  const times = getProgramTimes(program, date);
  const total = program.price * count;
  const ready = Boolean(date && times.includes(time) && count && !program.contactOnly);

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

  const resetSelection = () => { setDate(''); setTime(''); setCount(0); };
  const changeLocation = (next) => {
    setLocation(next);
    setProgramId(programReservations[next][0].id);
    resetSelection();
  };
  const changeProgram = (next) => { setProgramId(next); resetSelection(); };
  const stepProgram = (offset) => {
    const index = availablePrograms.findIndex((item) => item.id === program.id);
    changeProgram(availablePrograms[(index + offset + availablePrograms.length) % availablePrograms.length].id);
  };
  const submit = () => {
    if (!user) { navigate(paths.login, { state: { from: paths.programReservation } }); return; }
    if (!ready) return;
    navigate(paths.reservationCheckout, { state: { reservation: {
      programName: program.title, targetName: `${selectedLocation.label} 모터스튜디오`, date, time,
      guests: count, price: total,
      payload: { kind: 'program', location, target: program.id, program: program.title, date, time,
        guests: String(count), counts: { participant: count }, unit: program.unit },
    } } });
  };

  return <main className="booking-page exhibition-booking program-booking" ref={pageRef}>
    <div className="booking-page__heading"><h1>프로그램 예약</h1><span>체험할 프로그램 및 일정을 순서대로 선택해 주세요.</span></div>
    <div className="booking-grid exhibition-booking__grid">
      <section className="booking-panel booking-panel--vehicle exhibition-select">
        <div className="booking-panel__title"><div><h2>프로그램</h2><p>체험할 프로그램을 선택해주세요.</p></div></div>
        <ReservationSelect className="exhibition-location" label="지점" value={location} options={locations} onChange={changeLocation} />
        <div className="program-booking__picker">
          <label htmlFor="reservation-program">프로그램 선택</label>
          <select id="reservation-program" value={program.id} onChange={(event) => changeProgram(event.target.value)}>
            {availablePrograms.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}
          </select>
        </div>
        <div className="program-booking__visual">
          <img className="exhibition-select__image" src={program.image} alt={program.title} />
          <button type="button" className="program-booking__previous" aria-label="이전 프로그램" onClick={() => stepProgram(-1)}><ChevronLeft /></button>
          <button type="button" className="program-booking__next" aria-label="다음 프로그램" onClick={() => stepProgram(1)}><ChevronRight /></button>
        </div>
        <div className="program-booking__dots" aria-label="프로그램 목록">
          {availablePrograms.map((item) => <button key={item.id} type="button" aria-label={item.title} aria-pressed={item.id === program.id} onClick={() => changeProgram(item.id)} />)}
        </div>
        <div className="exhibition-select__copy">
          <h3>{program.title}</h3><p>{program.description}</p>
          <dl>
            <div><dt>참여 가능 연령</dt><dd>{program.age}</dd></div>
            <div><dt>운영시간</dt><dd className="program-booking__schedule">{program.schedule}</dd></div>
            <div><dt>소요시간</dt><dd>{program.duration}</dd></div>
            <div><dt>참가비</dt><dd>{program.price ? `${program.price.toLocaleString()}원 / 1${program.unit}` : '무료'}</dd></div>
          </dl>
        </div>
      </section>
      <section className="booking-panel exhibition-schedule">
        <div className="booking-panel__title"><div><h2>체험 일정</h2><p>운영 요일과 시간을 확인해주세요.</p></div></div>
        {program.contactOnly ? <div className="program-booking__notice">단체 프로그램은 고객센터 상담을 통해 일정을 정합니다.<br /><a href="tel:1899-6611">1899-6611</a></div> : <>
          <Calendar selected={date} onSelect={(next) => { setDate(next); setTime(''); }} isDateDisabled={(next) => !getProgramTimes(program, next).length} />
          <div className="calendar-legend"><span><i className="available" />운영 요일</span><span><i />미운영/지난 날짜</span><span><i className="selected" />선택</span></div>
          <div className="time-picker"><h3>{date ? '체험 시간을 선택해 주세요.' : '체험할 날짜를 먼저 선택해 주세요.'}</h3>
            {date && <div>{times.map((item) => <button key={item} type="button" className={time === item ? 'is-active' : ''} onClick={() => setTime(item)}>{item}</button>)}</div>}
          </div>
        </>}
      </section>
      <section className="booking-panel exhibition-price">
        <div className="booking-panel__title"><div><h2>체험 가격/인원 선택</h2></div></div>
        <img src={program.image} alt={program.title} />
        <div className="ticket-box"><h3>{program.title}</h3>
          {program.contactOnly ? <aside>단체 인원과 참가비는 고객센터 상담 시 확인해주세요.<br /><a href="tel:1899-6611">1899-6611</a></aside> : <>
            <div className="ticket-row"><div><strong>{program.unit === '팀' ? '참여 팀' : '참여자'}</strong><span>{program.age}</span><span>{program.price ? `${program.price.toLocaleString()}원 / 1${program.unit}` : '무료'}</span></div>
              <div className="ticket-counter"><button type="button" aria-label="참여 수 줄이기" disabled={!count} onClick={() => setCount((current) => Math.max(0, current - 1))}><Minus /></button><b aria-live="polite">{count}</b><button type="button" aria-label="참여 수 늘리기" onClick={() => setCount((current) => current + 1)}><Plus /></button><small>{total.toLocaleString()}원</small></div>
            </div>
            <p className="ticket-total">합계 : <strong>{total.toLocaleString()}원</strong></p>
          </>}
        </div>
      </section>
    </div>
    <div className="booking-summary"><div className="booking-summary__inner"><dl><div><dt>체험 프로그램</dt><dd>{program.title}</dd></div><div><dt>체험 인원</dt><dd>{count ? `${count}${program.unit}` : '-'}</dd></div><div><dt>체험 일시</dt><dd>{date && time ? `${date.replaceAll('-', '.')} ${time}` : '-'}</dd></div></dl><div className="booking-summary__action"><p>예상 결제 금액<strong>{total.toLocaleString()}원</strong></p><button type="button" disabled={program.contactOnly || (Boolean(user) && !ready)} onClick={submit}>{program.contactOnly ? '고객센터 예약' : user ? '예약하기' : '로그인 후 예약'}</button></div></div></div>
  </main>;
}
