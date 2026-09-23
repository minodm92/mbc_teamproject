/**
 * 현대 모터스튜디오 국내 시승 데이터
 * 확인 기준일: 2026-09-21
 *
 * 제원 적용 기준
 * - 파워트레인이나 트림이 여러 개인 경우 최고출력 사양을 적용합니다.
 * - 연비는 선택한 대표 사양의 공식 복합연비를 적용합니다.
 * - 전기차 전비: km/kWh
 * - 수소전기차 연비: km/kg
 * - 내연기관·하이브리드 연비: km/L
 * - 헤리티지 차량과 임의배정 차량은 단일 제원을 적용하지 않습니다.
 */

export const vehicleSpecs = {
  IONIQ_5_N: {
    name: "아이오닉 5 N",
    ENGINE: "Dual electric motor (AWD)",
    FUEL_ECONOMY: "3.7 km/kWh",
    MAX_POWER: "478 kW (650 PS, N Grin Boost)",
    MAX_TORQUE: "770 Nm (78.5 kgf·m)",
  },

  IONIQ_6_N: {
    name: "아이오닉 6 N",
    ENGINE: "Dual electric motor (AWD)",
    FUEL_ECONOMY: "공식 인증값 확인 필요",
    MAX_POWER: "478 kW (650 PS, N Grin Boost)",
    MAX_TORQUE: "770 Nm (78.5 kgf·m)",
  },

  GV60_MAGMA: {
    name: "GV60 MAGMA",
    ENGINE: "Dual electric motor (AWD)",
    FUEL_ECONOMY: "공식 인증값 확인 필요",
    MAX_POWER: "478 kW (650 PS, Boost)",
    MAX_TORQUE: "790 Nm (80.6 kgf·m)",
  },

  AVANTE_N: {
    name: "아반떼 N",
    ENGINE: "Gasoline 2.0 Turbo",
    FUEL_ECONOMY: "10.4 km/L",
    MAX_POWER: "280 PS",
    MAX_TORQUE: "40.0 kgf·m",
  },

  GRANDEUR: {
    name: "그랜저 / 더 뉴 그랜저",
    ENGINE: "Gasoline 3.5 GDi",
    FUEL_ECONOMY: "10.4 km/L",
    MAX_POWER: "300 PS",
    MAX_TORQUE: "36.6 kgf·m",
  },

  GRANDEUR_HYBRID: {
    name: "더 뉴 그랜저 Hybrid",
    ENGINE: "Gasoline 1.6 Turbo Hybrid",
    FUEL_ECONOMY: "18.0 km/L",
    MAX_POWER: "230 PS (system)",
    MAX_TORQUE: "27.0 kgf·m (engine)",
  },

  SONATA_EDGE: {
    name: "쏘나타 디 엣지",
    ENGINE: "Gasoline 2.5 Turbo",
    FUEL_ECONOMY: "11.1 km/L",
    MAX_POWER: "290 PS",
    MAX_TORQUE: "43.0 kgf·m",
  },

  SONATA_HYBRID: {
    name: "쏘나타 Hybrid",
    ENGINE: "Gasoline 2.0 GDi Hybrid",
    FUEL_ECONOMY: "19.4 km/L",
    MAX_POWER: "195 PS (system)",
    MAX_TORQUE: "19.2 kgf·m (engine)",
  },

  AVANTE: {
    name: "아반떼",
    ENGINE: "Gasoline 1.6",
    FUEL_ECONOMY: "15.3 km/L",
    MAX_POWER: "123 PS",
    MAX_TORQUE: "15.7 kgf·m",
  },

  PALISADE: {
    name: "팰리세이드",
    ENGINE: "Gasoline 2.5 Turbo",
    FUEL_ECONOMY: "9.7 km/L",
    MAX_POWER: "281 PS",
    MAX_TORQUE: "43.0 kgf·m",
  },

  PALISADE_HYBRID: {
    name: "팰리세이드 Hybrid",
    ENGINE: "Gasoline 2.5 Turbo Hybrid",
    FUEL_ECONOMY: "14.1 km/L",
    MAX_POWER: "334 PS (system)",
    MAX_TORQUE: "36.0 kgf·m (engine)",
  },

  SANTA_FE: {
    name: "싼타페",
    ENGINE: "Gasoline 2.5 Turbo",
    FUEL_ECONOMY: "11.0 km/L",
    MAX_POWER: "281 PS",
    MAX_TORQUE: "43.0 kgf·m",
  },

  SANTA_FE_HYBRID: {
    name: "싼타페 Hybrid",
    ENGINE: "Gasoline 1.6 Turbo Hybrid",
    FUEL_ECONOMY: "15.5 km/L",
    MAX_POWER: "235 PS (system)",
    MAX_TORQUE: "27.0 kgf·m (engine)",
  },

  TUCSON: {
    name: "투싼",
    ENGINE: "Gasoline 1.6 Turbo",
    FUEL_ECONOMY: "12.5 km/L",
    MAX_POWER: "180 PS",
    MAX_TORQUE: "27.0 kgf·m",
  },

  TUCSON_HYBRID: {
    name: "투싼 Hybrid",
    ENGINE: "Gasoline 1.6 Turbo Hybrid",
    FUEL_ECONOMY: "16.2 km/L",
    MAX_POWER: "235 PS (system)",
    MAX_TORQUE: "27.0 kgf·m (engine)",
  },

  KONA: {
    name: "코나",
    ENGINE: "Gasoline 1.6 Turbo",
    FUEL_ECONOMY: "13.0 km/L",
    MAX_POWER: "198 PS",
    MAX_TORQUE: "27.0 kgf·m",
  },

  KONA_N_LINE: {
    name: "코나 N Line",
    ENGINE: "Gasoline 1.6 Turbo",
    FUEL_ECONOMY: "12.2 km/L",
    MAX_POWER: "198 PS",
    MAX_TORQUE: "27.0 kgf·m",
  },

  KONA_ELECTRIC: {
    name: "코나 Electric",
    ENGINE: "Electric motor",
    FUEL_ECONOMY: "5.5 km/kWh",
    MAX_POWER: "150 kW (204 PS)",
    MAX_TORQUE: "255 Nm (26.0 kgf·m)",
  },

  CASPER: {
    name: "캐스퍼",
    ENGINE: "Gasoline 1.0 Turbo",
    FUEL_ECONOMY: "12.8 km/L",
    MAX_POWER: "100 PS",
    MAX_TORQUE: "17.5 kgf·m",
  },

  CASPER_ELECTRIC: {
    name: "캐스퍼 Electric / Electric Cross",
    ENGINE: "Electric motor",
    FUEL_ECONOMY: "5.6 km/kWh",
    MAX_POWER: "84.5 kW (115 PS)",
    MAX_TORQUE: "147 Nm (15.0 kgf·m)",
  },

  STARIA_LIMOUSINE_EV: {
    name: "스타리아 리무진 Electric",
    ENGINE: "Electric motor",
    FUEL_ECONOMY: "공식 인증값 확인 필요",
    MAX_POWER: "공식 최종 제원 확인 필요",
    MAX_TORQUE: "공식 최종 제원 확인 필요",
  },

  IONIQ_5: {
    name: "아이오닉 5",
    ENGINE: "Dual electric motor (AWD)",
    FUEL_ECONOMY: "4.8 km/kWh",
    MAX_POWER: "239 kW (325 PS)",
    MAX_TORQUE: "605 Nm (61.7 kgf·m)",
  },

  IONIQ_6: {
    name: "아이오닉 6",
    ENGINE: "Dual electric motor (AWD)",
    FUEL_ECONOMY: "5.5 km/kWh",
    MAX_POWER: "239 kW (325 PS)",
    MAX_TORQUE: "605 Nm (61.7 kgf·m)",
  },

  IONIQ_9: {
    name: "아이오닉 9",
    ENGINE: "Dual electric motor (Performance AWD)",
    FUEL_ECONOMY: "4.1 km/kWh",
    MAX_POWER: "315 kW (428 PS)",
    MAX_TORQUE: "700 Nm (71.4 kgf·m)",
  },

  NEXO: {
    name: "넥쏘",
    ENGINE: "Hydrogen fuel-cell electric motor",
    FUEL_ECONOMY: "96.2 km/kg",
    MAX_POWER: "150 kW (204 PS)",
    MAX_TORQUE: "350 Nm (35.7 kgf·m)",
  },

  G90_BLACK: {
    name: "G90 BLACK / G90 LWB BLACK",
    ENGINE: "Gasoline 3.5 Turbo 48V e-S/C AWD",
    FUEL_ECONOMY: "8.2 km/L",
    MAX_POWER: "415 PS",
    MAX_TORQUE: "56.0 kgf·m",
  },

  G80_BLACK: {
    name: "G80 BLACK",
    ENGINE: "Gasoline 3.5 Turbo AWD",
    FUEL_ECONOMY: "8.3 km/L",
    MAX_POWER: "380 PS",
    MAX_TORQUE: "54.0 kgf·m",
  },

  G70: {
    name: "G70",
    ENGINE: "Gasoline 3.3 Turbo AWD",
    FUEL_ECONOMY: "8.8 km/L",
    MAX_POWER: "370 PS",
    MAX_TORQUE: "52.0 kgf·m",
  },

  GV80: {
    name: "GV80",
    ENGINE: "Gasoline 3.5 Turbo AWD",
    FUEL_ECONOMY: "8.6 km/L",
    MAX_POWER: "380 PS",
    MAX_TORQUE: "54.0 kgf·m",
  },

  GV80_COUPE: {
    name: "GV80 COUPE",
    ENGINE: "Gasoline 3.5 Turbo 48V e-S/C AWD",
    FUEL_ECONOMY: "8.2 km/L",
    MAX_POWER: "415 PS",
    MAX_TORQUE: "56.0 kgf·m",
  },

  GV70: {
    name: "GV70",
    ENGINE: "Gasoline 3.5 Turbo AWD",
    FUEL_ECONOMY: "8.5 km/L",
    MAX_POWER: "380 PS",
    MAX_TORQUE: "54.0 kgf·m",
  },

  ELECTRIFIED_GV70: {
    name: "ELECTRIFIED GV70",
    ENGINE: "Dual electric motor (AWD)",
    FUEL_ECONOMY: "4.6 km/kWh",
    MAX_POWER: "360 kW (490 PS, Boost)",
    MAX_TORQUE: "700 Nm (71.4 kgf·m)",
  },

  GV60: {
    name: "GV60",
    ENGINE: "Dual electric motor (Performance AWD)",
    FUEL_ECONOMY: "4.1 km/kWh",
    MAX_POWER: "360 kW (490 PS, Boost)",
    MAX_TORQUE: "700 Nm (71.4 kgf·m)",
  },

  HERITAGE: {
    name: "헤리티지 차량",
    ENGINE: null,
    FUEL_ECONOMY: null,
    MAX_POWER: null,
    MAX_TORQUE: null,
    note: "연식과 복원 차량에 따라 제원이 다릅니다.",
  },

  RANDOM: {
    name: "임의배정",
    ENGINE: null,
    FUEL_ECONOMY: null,
    MAX_POWER: null,
    MAX_TORQUE: null,
    note: "현장에서 차량이 임의 배정됩니다.",
  },
};

const v = (...ids) =>
  ids.map((id) => ({
    id,
    ...vehicleSpecs[id],
  }));

export const drivePrograms = [
  {
    driveType: "프라이빗 신차 드라이브_언택트",
    locations: [
      {
        location: "고양",
        vehicles: v("GRANDEUR", "GRANDEUR_HYBRID"),
      },
      {
        location: "하남",
        vehicles: v("GRANDEUR"),
      },
    ],
  },

  {
    driveType: "하이 퍼포먼스 드라이브_언택트",
    locations: [
      {
        location: "고양",
        vehicles: v(
          "IONIQ_5_N",
          "IONIQ_6_N",
          "GV60_MAGMA",
          "AVANTE_N"
        ),
      },
    ],
  },

  {
    driveType: "베이직 드라이브",
    locations: [
      {
        location: "고양",
        vehicles: v(
          "G90_BLACK",
          "G80_BLACK",
          "GV80",
          "GV80_COUPE",
          "GV70",
          "ELECTRIFIED_GV70",
          "GV60",
          "GRANDEUR",
          "GRANDEUR_HYBRID",
          "SONATA_EDGE",
          "SONATA_HYBRID",
          "AVANTE",
          "PALISADE",
          "PALISADE_HYBRID",
          "SANTA_FE",
          "SANTA_FE_HYBRID",
          "TUCSON",
          "TUCSON_HYBRID",
          "KONA_N_LINE",
          "KONA_ELECTRIC",
          "CASPER",
          "CASPER_ELECTRIC",
          "STARIA_LIMOUSINE_EV",
          "IONIQ_5",
          "IONIQ_6",
          "IONIQ_9",
          "NEXO",
          "G70"
        ),
      },
      {
        location: "서울",
        vehicles: v(
          "IONIQ_9",
          "IONIQ_5",
          "PALISADE",
          "KONA",
          "GRANDEUR",
          "AVANTE",
          "G90_BLACK",
          "G80_BLACK",
          "GV80"
        ),
      },
      {
        location: "하남",
        vehicles: v(
          "CASPER_ELECTRIC",
          "IONIQ_5",
          "IONIQ_6",
          "IONIQ_9",
          "NEXO",
          "KONA",
          "SANTA_FE_HYBRID",
          "PALISADE",
          "PALISADE_HYBRID"
        ),
      },
    ],
  },

  {
    driveType: "베이직 드라이브_장거리 시승",
    locations: [
      {
        location: "서울",
        vehicles: v(
          "IONIQ_9",
          "IONIQ_5",
          "PALISADE",
          "KONA",
          "GRANDEUR",
          "AVANTE",
          "G90_BLACK",
          "G80_BLACK",
          "GV80"
        ),
      },
    ],
  },

  {
    driveType: "베이직 드라이브_언택트",
    locations: [
      {
        location: "고양",
        vehicles: v(
          "G90_BLACK",
          "G80_BLACK",
          "G70",
          "GV80",
          "GV80_COUPE",
          "GV70",
          "ELECTRIFIED_GV70",
          "GV60",
          "GRANDEUR",
          "GRANDEUR_HYBRID",
          "SONATA_EDGE",
          "SONATA_HYBRID",
          "AVANTE",
          "PALISADE",
          "PALISADE_HYBRID",
          "SANTA_FE",
          "SANTA_FE_HYBRID",
          "TUCSON",
          "TUCSON_HYBRID",
          "KONA_N_LINE",
          "KONA_ELECTRIC",
          "CASPER",
          "CASPER_ELECTRIC",
          "IONIQ_5",
          "IONIQ_6",
          "IONIQ_9",
          "NEXO",
          "STARIA_LIMOUSINE_EV"
        ),
      },
      {
        location: "서울",
        vehicles: v(
          "IONIQ_9",
          "IONIQ_5",
          "PALISADE",
          "KONA",
          "GRANDEUR",
          "AVANTE",
          "G90_BLACK",
          "G80_BLACK",
          "GV80"
        ),
      },
      {
        location: "하남",
        vehicles: v(
          "CASPER_ELECTRIC",
          "IONIQ_5",
          "IONIQ_6",
          "IONIQ_9",
          "NEXO",
          "KONA",
          "SANTA_FE_HYBRID",
          "PALISADE",
          "PALISADE_HYBRID"
        ),
      },
    ],
  },

  {
    driveType: "베이직 드라이브_언택트_장거리 시승",
    locations: [
      {
        location: "서울",
        vehicles: v(
          "IONIQ_9",
          "IONIQ_5",
          "PALISADE",
          "KONA",
          "GRANDEUR",
          "AVANTE",
          "G90_BLACK",
          "G80_BLACK",
          "GV80"
        ),
      },
    ],
  },

  {
    driveType: "비기너 드라이브",
    locations: [
      {
        location: "고양",
        vehicles: v("RANDOM"),
      },
      {
        location: "서울",
        vehicles: v("AVANTE", "KONA"),
      },
      {
        location: "하남",
        vehicles: v("KONA"),
      },
    ],
  },

  {
    driveType: "시티 나이트 드라이브",
    locations: [
      {
        location: "서울",
        vehicles: v(
          "IONIQ_9",
          "IONIQ_5",
          "PALISADE",
          "KONA",
          "GRANDEUR",
          "AVANTE",
          "G90_BLACK",
          "G80_BLACK",
          "GV80"
        ),
      },
    ],
  },

  {
    driveType: "N 드라이브_언택트",
    locations: [
      {
        location: "하남",
        vehicles: v("IONIQ_5_N"),
      },
    ],
  },

  {
    driveType: "아웃도어 라이프_차콕",
    locations: [
      {
        location: "고양",
        vehicles: v("IONIQ_9", "PALISADE_HYBRID"),
      },
      {
        location: "하남",
        vehicles: v(
          "SANTA_FE_HYBRID",
          "PALISADE",
          "PALISADE_HYBRID",
          "IONIQ_9"
        ),
      },
    ],
  },

  {
    driveType: "아웃도어 라이프_데이트립 드라이브",
    locations: [
      {
        location: "고양",
        vehicles: v(
          "G90_BLACK",
          "G80_BLACK",
          "G70",
          "GV80",
          "GV80_COUPE",
          "GV70",
          "ELECTRIFIED_GV70",
          "GV60",
          "SONATA_EDGE",
          "SONATA_HYBRID",
          "AVANTE",
          "PALISADE",
          "PALISADE_HYBRID",
          "SANTA_FE",
          "SANTA_FE_HYBRID",
          "TUCSON",
          "TUCSON_HYBRID",
          "KONA_N_LINE",
          "CASPER",
          "CASPER_ELECTRIC",
          "STARIA_LIMOUSINE_EV",
          "IONIQ_5",
          "IONIQ_6",
          "IONIQ_9",
          "KONA_ELECTRIC"
        ),
      },
      {
        location: "하남",
        vehicles: v(
          "CASPER_ELECTRIC",
          "IONIQ_5",
          "IONIQ_6",
          "KONA",
          "SANTA_FE_HYBRID",
          "PALISADE"
        ),
      },
    ],
  },

  {
    driveType: "아웃도어 라이프_데이트립 드라이브 라이트",
    locations: [
      {
        location: "하남",
        vehicles: v(
          "CASPER_ELECTRIC",
          "IONIQ_5",
          "IONIQ_6",
          "KONA",
          "SANTA_FE_HYBRID",
          "PALISADE"
        ),
      },
    ],
  },

  {
    driveType: "컴-페어 드라이브",
    locations: [
      {
        location: "고양",
        vehiclePairs: [
          ["GV80", "GV80_COUPE"],
          ["IONIQ_5", "IONIQ_6"],
          ["GRANDEUR", "SONATA_EDGE"],
          ["SANTA_FE", "PALISADE"],
        ].map(([firstVehicle, secondVehicle]) =>
          v(firstVehicle, secondVehicle)
        ),
      },
    ],
  },

  {
    driveType: "헤리티지 드라이브",
    locations: [
      {
        location: "고양",
        vehicleNames: ["그랜저", "스쿠프", "포니2", "갤로퍼"],
        vehicles: v("HERITAGE"),
      },
      {
        location: "서울",
        vehicleNames: ["포니2", "다이너스티", "그랜저"],
        vehicles: v("HERITAGE"),
      },
    ],
  },
];

export const vehicleDatabaseMeta = {
  name: "현대 모터스튜디오 국내 시승 데이터",
  verifiedAt: "2026-09-21",
  schemaVersion: 1,
};

export const vehicles = Object.entries(vehicleSpecs).map(([id, spec]) => ({
  id,
  ...spec,
}));

export const driveProgramRecords = drivePrograms.flatMap((program, programIndex) =>
  program.locations.map((location, locationIndex) => ({
    id: `drive-program-${programIndex + 1}-${locationIndex + 1}`,
    driveType: program.driveType,
    location: location.location,
    vehicles: location.vehicles ?? [],
    vehiclePairs: location.vehiclePairs ?? [],
    vehicleNames: location.vehicleNames ?? [],
  }))
);

export function findVehicleById(id) {
  return vehicleSpecs[id] ? { id, ...vehicleSpecs[id] } : null;
}

export function getDriveProgramsByLocation(location) {
  return driveProgramRecords.filter((record) => record.location === location);
}

export function getVehiclesByDriveTypeAndLocation(driveType, location) {
  const record = driveProgramRecords.find(
    (item) => item.driveType === driveType && item.location === location
  );
  return record?.vehicles ?? [];
}

export function searchVehicles(keyword = "") {
  const normalizedKeyword = keyword.trim().toLocaleLowerCase("ko-KR");
  if (!normalizedKeyword) return vehicles;
  return vehicles.filter(({ id, name }) =>
    `${id} ${name}`.toLocaleLowerCase("ko-KR").includes(normalizedKeyword)
  );
}

export const vehicleDatabase = {
  meta: vehicleDatabaseMeta,
  vehicles,
  vehicleSpecs,
  drivePrograms,
  driveProgramRecords,
};

export default vehicleDatabase;
