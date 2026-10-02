import { useState } from "react";
import { Link } from "react-router-dom";
import { studioPrograms, studioVehicles } from "./data/locationShowcase";
import { paths } from "../../common/router/routePaths";
import driveBasicImage from "../../assets/images/locations/figma/drive-basic.png";
import highPerformanceImage from "../../assets/images/locations/figma/high-performance.png";

const asset = (name, type = "png") => `/images/locations/figma/${name}.${type}`;
const driveTabs = [
  {
    id: "private-new-car",
    label: "PRIVATE NEW CAR DRIVE",
    image: asset("drive-test", "svg"),
    alt: "현대 모터스튜디오 시승 차량",
    location: "GOYANG · HANAM",
    service: "UNTACT",
  },
  {
    id: "high-performance",
    label: "HIGH PERFORMANCE",
    image: highPerformanceImage,
    alt: "차량 내부에서 주행을 경험하는 모습",
    location: "GOYANG · HANAM",
    service: "UNTACT",
  },
  {
    id: "basic-drive",
    label: "BASIC DRIVE",
    image: driveBasicImage,
    alt: "주차장에 전시된 차량들",
    location: "SEOUL",
    service: "UNTACT",
  },
];

export default function LocationDetails() {
  const [activeView, setActiveView] = useState(0);
  const [activeDriveIndex, setActiveDriveIndex] = useState(0);
  const activeDrive = driveTabs[activeDriveIndex];
  const views = ["avante", "avante-1", "avante-2", "avante-3"];
  return (
    <div className="studio-details studio-desktop">
      <section className="studio-avante" aria-labelledby="studio-avante-title">
        <div className="studio-avante__media studio-mask">
          <img
            key={activeView}
            src={asset(views[activeView])}
            alt="현대 모터스튜디오 아반떼 전시"
            className={activeView === 0 ? "studio-avante__original" : ""}
          />
        </div>
        <div className="studio-avante__views" aria-label="아반떼 이미지 선택">
          {[1, 2, 3].map((number) => (
            <button
              key={number}
              type="button"
              aria-label={`아반떼 전시 이미지 ${number}`}
              aria-pressed={activeView === number}
              onClick={() => setActiveView(activeView === number ? 0 : number)}
            >
              <img src={asset(`avante-${number}`)} alt="" />
            </button>
          ))}
        </div>
        <div className="studio-avante__copy studio-copy">
          <h2 id="studio-avante-title">THE ALL-NEW AVANTE</h2>
          <p className="studio-avante__date">2026.09.08 ~</p>
          <p>
            국내 준중형 세단의 기준을 제시해 온 아반떼가 8세대 완전 변경 모델로
            새롭게 태어났습니다. 3가지 컬러의 차량, 그리고 헤리티지 테이블을
            통해 1세대 엘란트라부터 이어져 온 아반떼의 혁신과 진화 그리고 진보된
            디자인과 기술을 직접 경험해 보세요.
          </p>
        </div>
      </section>
      <section
        className="studio-vehicles"
        aria-labelledby="studio-vehicles-title"
      >
        <h2
          className="studio-section-title studio-copy"
          id="studio-vehicles-title"
        >
          VEHICLE
          <br />
          EXHIBITION
        </h2>
        <div className="studio-vehicles__grid">
          {studioVehicles.map((vehicle) => (
            <Link
              className={`studio-vehicle studio-vehicle--${vehicle.id}`}
              key={vehicle.id}
              to={paths.mobility}
              aria-label={`${vehicle.name} 차량 전시 보기`}
            >
              <div className="studio-vehicle__image">
                <img src={asset(vehicle.id)} alt={vehicle.name} />
              </div>
              <div className="studio-vehicle__copy studio-copy">
                <p>{vehicle.location}</p>
                <h3>{vehicle.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <section className="studio-drive" aria-labelledby="studio-drive-title">
        <div
          className="studio-drive__image studio-mask"
          id="studio-drive-image"
        >
          <img src={activeDrive.image} alt={activeDrive.alt} />
        </div>
        <div className="studio-drive__copy">
          <h2
            className="studio-section-title studio-copy"
            id="studio-drive-title"
          >
            DRIVE TEST
          </h2>
          <div
            className="studio-drive__links studio-copy"
            role="tablist"
            aria-label="시승 프로그램 선택"
          >
            {driveTabs.map((tab, index) => {
              const isActive = index === activeDriveIndex;
              return (
                <button
                  className={`studio-drive__tab${isActive ? " is-active" : ""}`}
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls="studio-drive-image"
                  onClick={() => setActiveDriveIndex(index)}
                >
                  <div
                    className={`studio-drive__metadata-wrap${isActive ? " is-active" : ""}`}
                    aria-hidden={!isActive}
                  >
                    <span className="studio-drive__metadata">
                      {tab.location}
                      <i aria-hidden="true" />
                      {tab.service}
                    </span>
                  </div>
                  <h3>{tab.label}</h3>
                </button>
              );
            })}
          </div>
        </div>
      </section>
      <section
        className="studio-programs"
        aria-labelledby="studio-programs-title"
      >
        <h2
          className="studio-section-title studio-copy"
          id="studio-programs-title"
        >
          PROGRAM
        </h2>
        <div className="studio-programs__grid">
          {studioPrograms.map((title, index) => (
            <Link to={paths.programs} key={title} className="studio-program">
              <div className="studio-program__image">
                <img src={asset(`program-${index + 1}`)} alt={title} />
              </div>
              <h3 className="studio-copy">{title}</h3>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
