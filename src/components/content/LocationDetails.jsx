import { useState } from 'react';
import { Link } from 'react-router-dom';
import { studioPrograms, studioVehicles } from '../../common/data/locationShowcase';
import { paths } from '../../common/router/routePaths';

const asset = (name, type = 'png') => `/images/locations/figma/${name}.${type}`;

export default function LocationDetails() {
  const [activeView, setActiveView] = useState(0);
  const views = ['avante', 'avante-1', 'avante-2', 'avante-3'];
  return <div className="studio-details studio-desktop">
    <section className="studio-avante" aria-labelledby="studio-avante-title">
      <div className="studio-avante__media studio-mask"><img key={activeView} src={asset(views[activeView])} alt="현대 모터스튜디오 아반떼 전시" className={activeView === 0 ? 'studio-avante__original' : ''} /></div>
      <div className="studio-avante__views" aria-label="아반떼 이미지 선택">
        {[1, 2, 3].map((number) => <button key={number} type="button" aria-label={`아반떼 전시 이미지 ${number}`} aria-pressed={activeView === number} onClick={() => setActiveView(activeView === number ? 0 : number)}><img src={asset(`avante-${number}`)} alt="" /></button>)}
      </div>
      <div className="studio-avante__copy studio-copy"><h2 id="studio-avante-title">THE ALL-NEW AVANTE</h2><p className="studio-avante__date">2026.09.08 ~</p><p>국내 준중형 세단의 기준을 제시해 온 아반떼가 8세대 완전 변경 모델로 새롭게 태어났습니다. 3가지 컬러의 차량, 그리고 헤리티지 테이블을 통해 1세대 엘란트라부터 이어져 온 아반떼의 혁신과 진화 그리고 진보된 디자인과 기술을 직접 경험해 보세요.</p></div>
    </section>
    <section className="studio-vehicles" aria-labelledby="studio-vehicles-title">
      <h2 className="studio-section-title studio-copy" id="studio-vehicles-title">VEHICLE<br />EXHIBITION</h2>
      <div className="studio-vehicles__grid">{studioVehicles.map((vehicle) => <Link className={`studio-vehicle studio-vehicle--${vehicle.id}`} key={vehicle.id} to={paths.mobility} aria-label={`${vehicle.name} 차량 전시 보기`}><div className="studio-vehicle__image"><img src={asset(vehicle.id)} alt={vehicle.name} /></div><div className="studio-vehicle__copy studio-copy"><p>{vehicle.location}</p><h3>{vehicle.name}</h3></div></Link>)}</div>
    </section>
    <section className="studio-drive" aria-labelledby="studio-drive-title">
      <div className="studio-drive__image studio-mask"><img src={asset('drive-test', 'svg')} alt="현대 모터스튜디오 시승 차량" /></div>
      <div className="studio-drive__copy"><h2 className="studio-section-title studio-copy" id="studio-drive-title">DRIVE TEST</h2><div className="studio-drive__links studio-copy"><Link to={paths.reservations}><span>GOYANG · HANAM <i aria-hidden="true" /> UNTACT</span><h3>PRIVATE NEW CAR DRIVE</h3></Link><Link to={paths.reservations}><h3>HIGH PERFORMANCE</h3></Link><Link to={paths.reservations}><h3>BASIC DRIVE</h3></Link></div></div>
    </section>
    <section className="studio-programs" aria-labelledby="studio-programs-title">
      <h2 className="studio-section-title studio-copy" id="studio-programs-title">PROGRAM</h2><div className="studio-programs__grid">{studioPrograms.map((title, index) => <Link to={paths.programs} key={title} className="studio-program"><div className="studio-program__image"><img src={asset(`program-${index + 1}`)} alt={title} /></div><h3 className="studio-copy">{title}</h3></Link>)}</div>
    </section>
  </div>;
}
