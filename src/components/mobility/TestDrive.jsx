import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Clock3 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { paths } from '../../common/router/routePaths';
import { drivePrograms } from '../../common/data/vehicleDatabase';
import { useAuthStore } from '../../store/useAuthStore';
import { useReservationStore } from '../../store/useReservationStore';
import PageShell from '../../common/layout/PageShell';
import './TestDrive.css';

const programs=[
 {id:'test-drive',category:'Experience',title:'Basic Drive',description:'도심과 고속화 도로를 아우르는 일상 주행 프로그램입니다.',duration:'60분',price:30000}
];
const defaultDriveProgram=drivePrograms.find(item=>item.driveType==='베이직 드라이브')||drivePrograms[0];
const defaultLocation=defaultDriveProgram.locations[0];
const locationVehicles=(location)=>{
 const list=location?.vehicles?.length?location.vehicles:(location?.vehiclePairs||[]).flat();
 return [...new Map(list.map(vehicle=>[vehicle.id,vehicle])).values()];
};
const vehicleImage=(id)=>({IONIQ_5_N:'/images/vehicles/ioniq-5-n.svg',CASPER:'/images/vehicles/casper.svg',G90_BLACK:'/images/vehicles/g90.svg',GV80:'/images/reservation/figma-04.png'}[id]||'/images/reservation/figma-04.png');
const week=['일','월','화','수','목','금','토'];
const times=['10:00','11:30','13:30','15:00','16:30'];

export function Calendar({selected,onSelect}){
 const today=new Date();
 const [view,setView]=useState(new Date(today.getFullYear(),today.getMonth(),1));
 const year=view.getFullYear(),month=view.getMonth();
 const cells=useMemo(()=>[...Array(new Date(year,month,1).getDay()).fill(null),...Array.from({length:new Date(year,month+1,0).getDate()},(_,i)=>i+1)],[year,month]);
 const key=(day)=>`${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
 const past=(day)=>new Date(year,month,day,23,59,59)<today;
 return <div className="booking-calendar">
  <div className="booking-calendar__head"><button type="button" aria-label="이전 달" onClick={()=>setView(new Date(year,month-1,1))}><ChevronLeft/></button><strong>{year}. {String(month+1).padStart(2,'0')}</strong><button type="button" aria-label="다음 달" onClick={()=>setView(new Date(year,month+1,1))}><ChevronRight/></button></div>
  <div className="booking-calendar__week">{week.map(day=><span key={day}>{day}</span>)}</div>
  <div className="booking-calendar__days">{cells.map((day,i)=>day?<button key={day} type="button" disabled={past(day)} className={selected===key(day)?'is-selected':''} onClick={()=>onSelect(key(day))}>{day}</button>:<span key={`empty-${i}`}/>)}</div>
 </div>;
}

export function ReservationPage(){
 const navigate=useNavigate();
 const pageRef=useRef(null);
 const user=useAuthStore(s=>s.user);
 const [driveType,setDriveType]=useState(defaultDriveProgram.driveType),[locationName,setLocationName]=useState(defaultLocation.location),[vehicleId,setVehicleId]=useState(locationVehicles(defaultLocation)[0]?.id||''),[programId,setProgramId]=useState('test-drive'),[date,setDate]=useState(''),[time,setTime]=useState('');
 const selectedDriveProgram=drivePrograms.find(item=>item.driveType===driveType)||defaultDriveProgram;
 const locations=selectedDriveProgram.locations;
 const selectedLocation=locations.find(item=>item.location===locationName)||locations[0];
 const availableVehicles=locationVehicles(selectedLocation);
 const vehicle=availableVehicles.find(item=>item.id===vehicleId)||availableVehicles[0],program=programs.find(item=>item.id===programId);
 const ready=Boolean(vehicle&&program&&date&&time);
 const changeDriveType=(nextDriveType)=>{const nextProgram=drivePrograms.find(item=>item.driveType===nextDriveType);const nextLocation=nextProgram.locations[0];setDriveType(nextDriveType);setLocationName(nextLocation.location);setVehicleId(locationVehicles(nextLocation)[0]?.id||'');};
 const changeLocation=(nextLocationName)=>{const nextLocation=locations.find(item=>item.location===nextLocationName);setLocationName(nextLocationName);setVehicleId(locationVehicles(nextLocation)[0]?.id||'');};
 useEffect(()=>{
  const updateSummaryPosition=()=>{
   if(!pageRef.current)return;
   const viewportHeight=window.visualViewport?.height||window.innerHeight;
   pageRef.current.classList.toggle('is-summary-docked',pageRef.current.getBoundingClientRect().bottom<=viewportHeight);
  };
  updateSummaryPosition();
  window.addEventListener('scroll',updateSummaryPosition,{passive:true});
  window.addEventListener('resize',updateSummaryPosition);
  return()=>{window.removeEventListener('scroll',updateSummaryPosition);window.removeEventListener('resize',updateSummaryPosition)};
 },[]);
 function submit(){if(!ready)return;if(!user){navigate(paths.login,{state:{from:paths.reservations}});return;}navigate(paths.reservationCheckout,{state:{reservation:{programName:driveType,targetName:vehicle.name,date,time,guests:1,price:program.price,payload:{kind:'test-drive',location:locationName,target:vehicle.id,program:driveType,date,time,guests:'1'}}}});}
 return <main className="booking-page" ref={pageRef}>
  <div className="booking-page__heading"><p>RESERVATION</p><h1>시승 예약</h1><span>차량 및 프로그램, 일정을 순서대로 선택해 주세요.</span></div>
  <div className="booking-grid">
   <section className="booking-panel booking-panel--vehicle">
    <Title number="01" title="체험 차량" copy="체험할 차량 모델을 선택해주세요."/>
    <div className="brand-tabs vehicle-dropdowns"><label className="is-active"><span className="sr-only">시승 프로그램</span><select value={driveType} onChange={(event)=>changeDriveType(event.target.value)}>{drivePrograms.map(item=><option key={item.driveType} value={item.driveType}>{item.driveType}</option>)}</select></label><label><span className="sr-only">지점</span><select value={locationName} onChange={(event)=>changeLocation(event.target.value)}>{locations.map(item=><option key={item.location} value={item.location}>{item.location}</option>)}</select></label><label><span className="sr-only">차량</span><select value={vehicle?.id||''} onChange={(event)=>setVehicleId(event.target.value)}>{availableVehicles.map(item=><option key={item.id} value={item.id}>{item.name}</option>)}</select></label></div>
    <div className="vehicle-selector">
    {vehicle?<div className="vehicle-card"><div className="vehicle-card__visual"><img src={vehicleImage(vehicle.id)} alt={vehicle.name}/></div><div className="vehicle-card__copy"><h3>{vehicle.name}</h3><dl><div><dt>ENGINE</dt><dd>{vehicle.ENGINE||'-'}</dd></div><div><dt>FUEL ECONOMY</dt><dd>{vehicle.FUEL_ECONOMY||'-'}</dd></div><div><dt>MAX POWER</dt><dd>{vehicle.MAX_POWER||'-'}</dd></div><div><dt>MAX TORQUE</dt><dd>{vehicle.MAX_TORQUE||'-'}</dd></div></dl>{vehicle.note&&<p className="vehicle-card__note">{vehicle.note}</p>}</div></div>:<div className="booking-empty">선택 가능한 차량이 없습니다.</div>}</div>
   </section>
   <section className="booking-panel">
    <Title number="02" title="시승" copy=""/>
    <div className="program-visual"><span>Experience</span><img src="/images/reservation/figma-06.png" alt="해안 도로를 주행하는 제네시스 GV90"/></div>
    <div className="program-list">{programs.map(item=><button key={item.id} type="button" className={`program-card${programId===item.id?' is-active':''}`} onClick={()=>setProgramId(item.id)}><h3>{item.title}</h3><p>{item.description}</p><div><span>소요 시간</span><strong><Clock3 size={15}/>{item.duration}</strong></div><div><span>가격</span><strong>{item.price.toLocaleString()}원</strong></div></button>)}</div>
    <div className="course-card"><div className="course-card__head"><span>DRIVING COURSE</span></div><div className="course-map"><img src="/images/reservation/figma-05.png" alt="현대 모터스튜디오 고양 시승 코스 지도"/></div></div>
   </section>
   <section className="booking-panel booking-panel--schedule">
    <Title number="03" title="체험 일정" copy="예약 가능한 날짜와 시간을 선택해 주세요."/>
    <Calendar selected={date} onSelect={next=>{setDate(next);setTime('');}}/>
    <div className="calendar-legend"><span><i className="available"/>예약 가능</span><span><i/>예약 불가</span><span><i className="selected"/>선택</span></div>
    <div className="time-picker"><h3>{date?`${date.replaceAll('-','.')} 예약 시간`:'날짜를 먼저 선택해 주세요'}</h3>{date&&<div>{times.map(item=><button key={item} type="button" className={time===item?'is-active':''} onClick={()=>setTime(item)}>{item}</button>)}</div>}</div>
   </section>
  </div>
  <div className="booking-summary"><div className="booking-summary__inner"><dl><div><dt>체험 프로그램</dt><dd>{driveType}</dd></div><div><dt>체험 차량</dt><dd>{vehicle?.name||'-'}</dd></div><div><dt>체험 일시</dt><dd>{date&&time?`${date.replaceAll('-','.')} ${time}`:'-'}</dd></div></dl><div className="booking-summary__action"><p>예상 결제 금액<strong>{program?.price.toLocaleString()||0}원</strong></p><button type="button" disabled={!ready} onClick={submit}>{user?'예약하기':'로그인 후 예약'}</button></div></div></div>
 </main>;
}

function Title({number,title,copy}){return <div className="booking-panel__title"><span>{number}</span><div><h2>{title}</h2><p>{copy}</p></div></div>}

export function MyReservationsPage(){
 const user=useAuthStore(s=>s.user),reservations=useReservationStore(s=>s.reservations),cancel=useReservationStore(s=>s.cancelReservation),mine=reservations.filter(item=>item.userId===user.id);
 return <PageShell eyebrow="MY RESERVATION" title="나의 예약" intro="예약 내역을 확인하고 관리해 보세요."><div className="reservation-list">{mine.length===0?<div className="empty-state"><h2>아직 예약 내역이 없습니다.</h2><p>현대 모터스튜디오의 새로운 경험을 예약해 보세요.</p><Link className="reservation-link" to={paths.reservations}>예약하기</Link></div>:mine.map(item=><article className="reservation-card" key={item.id}><div><span>{item.status}</span><h2>{item.kind==='test-drive'?'드라이빙 체험':'공간 방문'}</h2><p>{item.date} {item.time} · {item.guests}명</p></div>{item.status==='예약 완료'&&<button type="button" onClick={()=>{if(window.confirm('예약을 취소하시겠습니까?'))cancel(item.id,user.id)}}>예약 취소</button>}</article>)}</div></PageShell>;
}
