import { useEffect, useRef, useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { paths } from '../../common/router/routePaths';
import { useAuthStore } from '../../store/useAuthStore';
import { Calendar } from '../mobility/TestDrive';
import '../mobility/TestDrive.css';
import './ExhibitionReservation.css';

const tickets=[{id:'adult',label:'성인',price:16000},{id:'youth',label:'청소년',price:12000},{id:'child',label:'어린이',price:8000}];

export default function ExhibitionReservationPage(){
 const navigate=useNavigate(),pageRef=useRef(null);
 const user=useAuthStore(s=>s.user);
 const [date,setDate]=useState(''),[time,setTime]=useState(''),[counts,setCounts]=useState({adult:0,youth:0,child:0});
 const guests=Object.values(counts).reduce((sum,value)=>sum+value,0);
 const total=tickets.reduce((sum,item)=>sum+item.price*counts[item.id],0);
 const ready=Boolean(date&&time&&guests);
 useEffect(()=>{const update=()=>{if(!pageRef.current)return;const height=window.visualViewport?.height||window.innerHeight;pageRef.current.classList.toggle('is-summary-docked',pageRef.current.getBoundingClientRect().bottom<=height)};update();window.addEventListener('scroll',update,{passive:true});window.addEventListener('resize',update);return()=>{window.removeEventListener('scroll',update);window.removeEventListener('resize',update)}},[]);
 const change=(id,amount)=>setCounts(current=>{const next=Math.max(0,Math.min(6,current[id]+amount));const other=Object.entries(current).filter(([key])=>key!==id).reduce((sum,[,value])=>sum+value,0);return{...current,[id]:Math.min(next,6-other)}});
 function submit(){if(!ready)return;if(!user){navigate(paths.login,{state:{from:paths.exhibitionReservation}});return;}navigate(paths.reservationCheckout,{state:{reservation:{programName:'미니카 전시',targetName:'고양 모터스튜디오',date,time,guests,price:total,payload:{kind:'exhibition',location:'goyang',target:'mini-car',date,time,guests:String(guests),counts}}}})}
 return <main className="booking-page exhibition-booking" ref={pageRef}>
  <div className="booking-page__heading"><p>RESERVATION</p><h1>전시 예약</h1><span>체험할 전시 및 일정을 순서대로 선택해 주세요.</span></div>
  <div className="exhibition-booking__grid">
   <section className="booking-panel booking-panel--vehicle exhibition-select"><div className="booking-panel__title"><div><h2>전시</h2><p>체험할 전시를 선택해주세요.</p></div></div><button type="button" className="exhibition-location">고양⌄</button><img className="exhibition-select__image" src="/images/reservation/exhibition-mini-car.png" alt="미니카 전시 공간"/><div className="exhibition-dots"><i className="is-active"/><i/><i/><i/><i/><i/></div><div className="exhibition-select__copy"><h3>미니카 전시</h3><p>손안의 드림카를 만나는 시간. 향수를 담은 빈티지 다이캐스트부터, 손안의 작은 차가 만들어지는 과정, 그리고 작가의 손을 거쳐 하나의 작품으로 완성되기까지— 미니카와 다이캐스트의 세계로 여러분을 초대합니다.</p><dl><div><dt>참여 가능 연령</dt><dd>일반 관람객</dd></div><div><dt>예약 가능 인원</dt><dd>1 ~ 6명</dd></div><div><dt>가격</dt><dd>성인 16,000원<br/>청소년 12,000원<br/>어린이 8,000원</dd></div></dl></div></section>
   <section className="booking-panel exhibition-schedule"><div className="booking-panel__title"><div><h2>체험 일정</h2><p>예약 가능한 날짜와 시간을 선택해 주세요.</p></div></div><Calendar selected={date} onSelect={next=>{setDate(next);setTime('')}}/><div className="calendar-legend"><span><i className="available"/>예약 가능</span><span><i/>예약 불가</span><span><i className="selected"/>선택</span></div><div className="time-picker"><h3>{date?'체험 시간을 선택해 주세요.':'체험할 날짜를 먼저 선택해 주세요.'}</h3>{date&&<div>{['10:00','13:00','15:00'].map(item=><button key={item} type="button" className={time===item?'is-active':''} onClick={()=>setTime(item)}>{item}</button>)}</div>}</div></section>
   <section className="booking-panel exhibition-price"><div className="booking-panel__title"><div><h2>체험 가격/인원 선택</h2></div></div><img src="/images/reservation/exhibition-mini-car.png" alt="미니카 전시"/><div className="ticket-box"><h3>주니어 캠퍼스 실험실</h3>{tickets.map(item=><div className="ticket-row" key={item.id}><div><strong>{item.label}</strong><span>{item.price.toLocaleString()}원</span></div><div className="ticket-counter"><button type="button" onClick={()=>change(item.id,-1)}><Minus/></button><b>{counts[item.id]}</b><button type="button" onClick={()=>change(item.id,1)}><Plus/></button><small>{(item.price*counts[item.id]).toLocaleString()}원</small></div></div>)}<p className="ticket-total">합계 : <strong>{total.toLocaleString()}원</strong></p><aside>ⓘ 임직원, 국가유공자 및 가족일 경우 50% 할인된 금액이 적용됩니다.</aside></div></section>
  </div>
  <div className="booking-summary"><div className="booking-summary__inner"><dl><div><dt>체험 프로그램</dt><dd>미니카 전시</dd></div><div><dt>체험 인원</dt><dd>{guests?`${guests}명`:'-'}</dd></div><div><dt>체험 일시</dt><dd>{date&&time?`${date.replaceAll('-','.')} ${time}`:'-'}</dd></div></dl><div className="booking-summary__action"><p>예상 결제 금액<strong>{total.toLocaleString()}원</strong></p><button type="button" disabled={!ready} onClick={submit}>{user?'예약하기':'로그인 후 예약'}</button></div></div></div>
 </main>;
}
