import { createElement, useRef, useState } from 'react';
import { BatteryCharging, Car, CarFront, ChevronRight, Gauge, House, Image, Leaf, MessageCircleMore, RotateCcw, Sparkles, UsersRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import { paths } from '../../common/router/routePaths';
import './ExperienceFinder.css';

const vehicleTypes=[
 {id:'eco',label:'수소·전기차',icon:BatteryCharging},{id:'sedan',label:'승용',icon:Car},{id:'suv',label:'SUV',icon:CarFront},{id:'mpv',label:'MPV',icon:Car}
];
const ages=['20대','30대','40대','50대','60대 이상'];
const lifestyles=[
 {id:'outdoor',english:'Outdoor Life',korean:'자연과 함께하는\n아웃도어 경험',icon:Leaf},{id:'performance',english:'Performance',korean:'모든 곳이 트랙,\n고성능 경험',icon:Gauge},
 {id:'nomad',english:'Digital Nomad',korean:'어디서든 일할 수 있는\n자유로운 경험',icon:Image},{id:'privacy',english:'Privacy',korean:'나만의 공간을\n지켜주는 경험',icon:House},
 {id:'beginner',english:'Beginner',korean:'초보 운전자를 위한\n설레는 첫 경험',icon:Car},{id:'early',english:'Early Adopter',korean:'혁신을 이끄는\n최첨단 경험',icon:Sparkles},
 {id:'commute',english:'Commute',korean:'편안한 출퇴근을 위한\n최적의 경험',icon:House},{id:'family',english:'Family',korean:'가족과 함께하는\n든든한 경험',icon:UsersRound},
 {id:'second',english:'Second Car',korean:'필요한 순간에 함께하는\n두 번째 경험',icon:Car},{id:'premium',english:'Premium',korean:'품격을 높여주는\n가치 있는 경험',icon:Sparkles}
];

function StepHeading({number,children,description}){return <div className="match-step__heading"><span><MessageCircleMore size={22}/> Step {number}.</span><h2>{children}<em>*</em></h2>{description&&<p>※ {description}</p>}</div>}

export default function ExperienceFinder(){
 const panelRef=useRef(null),dragRef=useRef({active:false,y:0,scroll:0});
 const [vehicle,setVehicle]=useState(''),[age,setAge]=useState(''),[lifestyle,setLifestyle]=useState('');
 const complete=vehicle&&age&&lifestyle;
 function dragStart(event){if(event.pointerType==='mouse'&&event.button!==0)return;dragRef.current={active:true,y:event.clientY,scroll:panelRef.current.scrollTop};panelRef.current.setPointerCapture(event.pointerId);panelRef.current.classList.add('is-dragging')}
 function dragMove(event){if(!dragRef.current.active)return;panelRef.current.scrollTop=dragRef.current.scroll-(event.clientY-dragRef.current.y)}
 function dragEnd(event){dragRef.current.active=false;panelRef.current?.releasePointerCapture?.(event.pointerId);panelRef.current?.classList.remove('is-dragging')}
 function reset(){setVehicle('');setAge('');setLifestyle('');panelRef.current?.scrollTo({top:0,behavior:'smooth'})}
 return <main className="match-page">
  <div className="match-page__backdrop" aria-hidden="true"><img src="/images/locations/goyang.svg" alt=""/></div>
  <div className="match-page__title"><i><Sparkles size={29}/></i><div><span>Lifestyle Match</span><h1>나의 일상에 꼭 맞는 경험 추천</h1><p>아래 설문을 완료하면 취향에 맞는 현대 모터스튜디오 경험을 알려드려요.</p></div></div>
  <aside className="match-panel" aria-label="경험 찾기 설문">
   <div className="match-panel__scroll" ref={panelRef} onPointerDown={dragStart} onPointerMove={dragMove} onPointerUp={dragEnd} onPointerCancel={dragEnd}>
    <section className="match-step"><StepHeading number="1">어떤 모빌리티 경험을 선호하시나요?</StepHeading><div className="match-options match-options--vehicles">{vehicleTypes.map(item=><button key={item.id} type="button" className={vehicle===item.id?'is-selected':''} onClick={()=>setVehicle(item.id)}>{createElement(item.icon)}<strong>{item.label}</strong></button>)}</div></section>
    <section className="match-step"><StepHeading number="2" description="비슷한 연령의 고객들이 선호하는 경험을 추천해 드립니다.">고객님의 연령은 어떻게 되나요?</StepHeading><div className="match-options match-options--ages">{ages.map(item=><button key={item} type="button" className={age===item?'is-selected':''} onClick={()=>setAge(item)}>{item}</button>)}</div></section>
    <section className="match-step"><StepHeading number="3">고객님이 추구하는 라이프스타일은<br/>어떤 것인가요?</StepHeading><div className="match-options match-options--lifestyles">{lifestyles.map(item=><button key={item.id} type="button" className={lifestyle===item.id?'is-selected':''} onClick={()=>setLifestyle(item.id)}>{createElement(item.icon)}<strong>{item.english}</strong><span>{item.korean}</span></button>)}</div></section>
    <div className="match-panel__spacer"/>
   </div>
   <div className="match-panel__actions"><Link className={!complete?'is-disabled':''} aria-disabled={!complete} tabIndex={complete?0:-1} to={complete?paths.reservations:'#'}>결과 보기 <ChevronRight/></Link><button type="button" onClick={reset}><RotateCcw/> 처음으로</button></div>
  </aside>
  <div className="match-page__hint"><span/>DRAG TO EXPLORE<span/></div>
 </main>;
}
