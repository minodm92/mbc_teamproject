import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Clock3 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { paths } from '../../common/router/routePaths';
import { reservationDrivePrograms as drivePrograms, getDriveTimes } from '../../common/data/driveReservations';
import { reservationVehicleImages } from '../../common/data/reservationVehicleImages';
import { useAuthStore } from '../../store/useAuthStore';
import { useReservationStore } from '../../store/useReservationStore';
import PageShell from '../../common/layout/PageShell';
import ReservationSelect from '../reservation/ReservationSelect';
import './TestDrive.css';

const defaultDriveProgram=drivePrograms.find(item=>item.driveType==='베이직 드라이브')||drivePrograms[0];
const defaultLocation=defaultDriveProgram.locations[0];
const locationVehicles=(location)=>{
 const list=location?.vehicles?.length?location.vehicles:(location?.vehiclePairs||[]).flat();
 return [...new Map(list.map(vehicle=>[vehicle.id,vehicle])).values()];
};
const vehicleImage=(id)=>reservationVehicleImages[id]||null;
const week=['일','월','화','수','목','금','토'];

export function Calendar({selected,onSelect,isDateDisabled}){
 const today=new Date();
 const [view,setView]=useState(new Date(today.getFullYear(),today.getMonth(),1));
 const year=view.getFullYear(),month=view.getMonth();
 const cells=useMemo(()=>[...Array(new Date(year,month,1).getDay()).fill(null),...Array.from({length:new Date(year,month+1,0).getDate()},(_,i)=>i+1)],[year,month]);
 const key=(day)=>`${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
 const past=(day)=>new Date(year,month,day,23,59,59)<today || Boolean(isDateDisabled?.(key(day)));
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
 const [courseIndex,setCourseIndex]=useState(0);
 const [driveType,setDriveType]=useState(defaultDriveProgram.driveType),[locationName,setLocationName]=useState(defaultLocation.location),[vehicleId,setVehicleId]=useState(locationVehicles(defaultLocation)[0]?.id||''),[date,setDate]=useState(''),[time,setTime]=useState('');
 const selectedDriveProgram=drivePrograms.find(item=>item.driveType===driveType)||defaultDriveProgram;
 const locations=selectedDriveProgram.locations;
 const selectedLocation=locations.find(item=>item.location===locationName)||locations[0];
 const availableVehicles=locationVehicles(selectedLocation);
 const vehicle=availableVehicles.find(item=>item.id===vehicleId)||availableVehicles[0],program=selectedLocation;
 const times=getDriveTimes(program,date);
 const resetSchedule=()=>{setDate('');setTime('');setCourseIndex(0);};
 const ready=Boolean(vehicle&&program&&date&&times.includes(time));
 const changeDriveType=(nextDriveType)=>{const nextProgram=drivePrograms.find(item=>item.driveType===nextDriveType);const nextLocation=nextProgram.locations[0];resetSchedule();setDriveType(nextDriveType);setLocationName(nextLocation.location);setVehicleId(locationVehicles(nextLocation)[0]?.id||'');};
 const changeLocation=(nextLocationName)=>{const nextLocation=locations.find(item=>item.location===nextLocationName);resetSchedule();setLocationName(nextLocationName);setVehicleId(locationVehicles(nextLocation)[0]?.id||'');};
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
 function submit(){if(!user){navigate(paths.login,{state:{from:paths.reservations}});return;}if(!ready)return;navigate(paths.reservationCheckout,{state:{reservation:{programName:driveType,targetName:vehicle.name,date,time,guests:driveType==='컴-페어 드라이브'?2:1,price:program.price,payload:{kind:'test-drive',courseIndex,course:program.courses?.[courseIndex]?.caption||program.course,location:locationName,target:vehicle.id,program:driveType,date,time,guests:driveType==='컴-페어 드라이브'?'2':'1'}}}});}
 return <main className="booking-page" ref={pageRef}>
  <div className="booking-page__heading"><h1>시승 예약</h1><span>차량 및 프로그램, 일정을 순서대로 선택해 주세요.</span></div>
  <div className="booking-grid">
   <section className="booking-panel booking-panel--vehicle">
    <Title number="01" title="체험 차량" copy="체험할 차량 모델을 선택해주세요."/>
    <div className="brand-tabs vehicle-dropdowns">
      <label className="is-active"><span className="sr-only">시승 프로그램</span><select value={driveType} onChange={(event)=>changeDriveType(event.target.value)}>{drivePrograms.map(item=><option key={item.driveType} value={item.driveType}>{item.driveType}</option>)}</select></label>
      <ReservationSelect label="지점" value={locationName} onChange={changeLocation} options={locations.map(item=>({value:item.location,label:item.location}))}/>
      <label><span className="sr-only">차량</span><select value={vehicle?.id||''} onChange={(event)=>{setVehicleId(event.target.value);resetSchedule();}}>{availableVehicles.map(item=><option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
    </div>
    <div className="vehicle-selector">
    {vehicle?vehicle.id==='RANDOM'?<div className="vehicle-card__visual"><p className="vehicle-card__assignment-message">해당 프로그램은 예약 확정시 차량이 배정 됩니다.</p></div>:<div className="vehicle-card"><div className="vehicle-card__visual">{vehicleImage(vehicle.imageId||vehicle.id)?<img src={vehicleImage(vehicle.imageId||vehicle.id)} alt={vehicle.id==='RANDOM'||vehicle.id==='HERITAGE'?'대표 차량 예시':vehicle.name}/>:<p className="vehicle-card__image-placeholder">{vehicle.name} 사진 준비 중</p>}</div><div className="vehicle-card__copy">{(vehicle.id==='HERITAGE')&&<p className="vehicle-card__allocation-note">대표 차량 예시이며, 실제 배정 차량은 달라질 수 있습니다.</p>}<h3>{vehicle.name}</h3><dl><div><dt>ENGINE</dt><dd>{vehicle.ENGINE||'-'}</dd></div><div><dt>FUEL ECONOMY</dt><dd>{vehicle.FUEL_ECONOMY||'-'}</dd></div><div><dt>MAX POWER</dt><dd>{vehicle.MAX_POWER||'-'}</dd></div><div><dt>MAX TORQUE</dt><dd>{vehicle.MAX_TORQUE||'-'}</dd></div></dl>{vehicle.note&&<p className="vehicle-card__note">{vehicle.note}</p>}</div></div>:<div className="booking-empty">선택 가능한 차량이 없습니다.</div>}</div>
   </section>
   <section className="booking-panel">
    <Title number="02" title="시승" copy=""/>
    <div className="program-visual"><img src={program.image} alt={program.title}/></div>
    <div className="program-list"><article className="program-card is-active"><h3>{program.title}</h3><p>{program.description}</p><div><span>운영시간</span><strong>{program.schedule}</strong></div><div><span>소요 시간</span><strong><Clock3 size={15}/>{program.duration}</strong></div><div><span>거리</span><strong>{program.distance}</strong></div><div><span>드라이버</span><strong>{program.driver}</strong></div><div><span>참가비</span><strong>{program.price===0?'무료':program.price.toLocaleString()+'원'}</strong></div></article></div>
    <div className="course-card">
      <div className="course-card__head"><span>Driving Course</span></div>
      {program.courses?.length > 1 && <div className="drive-course-tabs" aria-label="시승 코스">
        {program.courses.map((course,index)=><button key={course.image} type="button" aria-pressed={courseIndex===index} onClick={()=>{setCourseIndex(index);setDate('');setTime('');}}>코스 {String.fromCharCode(65+index)}</button>)}
      </div>}
      {program.courses?.[courseIndex] ? <figure className="drive-course-map">
        <img src={program.courses[courseIndex].image} alt={`${locationName} ${program.title} 코스 ${String.fromCharCode(65+courseIndex)} 지도`}/>
        <figcaption>{program.courses[courseIndex].caption}</figcaption>
      </figure> : <p className="drive-course-description">{locationName} · {program.course}<br/>{program.distance}</p>}
    </div>
   </section>
   <section className="booking-panel booking-panel--schedule">
    <Title number="03" title="체험 일정" copy="운영일과 방문 예정 시간을 선택해 주세요."/>
    <Calendar selected={date} onSelect={next=>{setDate(next);setTime('');}} isDateDisabled={next=>!getDriveTimes(program,next).length}/>
    <div className="calendar-legend"><span><i className="available"/>운영일</span><span><i/>미운영/지난 날짜</span><span><i className="selected"/>선택</span></div>
    <div className="time-picker"><h3>{date?`${date.replaceAll('-','.')} 방문 예정 시간`:'날짜를 먼저 선택해 주세요'}</h3>{date&&<div>{times.map(item=><button key={item} type="button" className={time===item?'is-active':''} onClick={()=>setTime(item)}>{item}</button>)}</div>}</div>
   </section>
  </div>
  <div className="booking-summary"><div className="booking-summary__inner"><dl><div><dt>체험 프로그램</dt><dd>{driveType}</dd></div><div><dt>체험 차량</dt><dd>{vehicle?.name||'-'}</dd></div><div><dt>체험 일시</dt><dd>{date&&time?`${date.replaceAll('-','.')} ${time}`:'-'}</dd></div></dl><div className="booking-summary__action"><p>예상 결제 금액<strong>{program.price===0?'무료':program.price.toLocaleString()+'원'}</strong></p><button type="button" disabled={Boolean(user)&&!ready} onClick={submit}>{user?'예약하기':'로그인 후 예약'}</button></div></div></div>
 </main>;
}

function Title({number,title,copy}){return <div className="booking-panel__title"><span>{number}</span><div><h2>{title}</h2><p>{copy}</p></div></div>}

export function MyReservationsPage(){
 const user=useAuthStore(s=>s.user),reservations=useReservationStore(s=>s.reservations),cancel=useReservationStore(s=>s.cancelReservation),mine=reservations.filter(item=>item.userId===user.id);
 return <PageShell eyebrow="MY RESERVATION" title="나의 예약" intro="예약 내역을 확인하고 관리해 보세요."><div className="reservation-list">{mine.length===0?<div className="empty-state"><h2>아직 예약 내역이 없습니다.</h2><p>현대 모터스튜디오의 새로운 경험을 예약해 보세요.</p><Link className="reservation-link" to={paths.reservations}>예약하기</Link></div>:mine.map(item=><article className="reservation-card" key={item.id}><div><span>{item.status}</span><h2>{item.kind==='test-drive'?'드라이빙 체험':'공간 방문'}</h2><p>{item.date} {item.time} · {item.guests}명</p></div>{item.status==='예약 완료'&&<button type="button" onClick={()=>{if(window.confirm('예약을 취소하시겠습니까?'))cancel(item.id,user.id)}}>예약 취소</button>}</article>)}</div></PageShell>;
}
