// Public driving guides checked on 2026-10-05. This is not live booking availability.
export function getDriveTimes(program, date) {
  if (!date) return [];
  const weekday = new Date(`${date}T12:00:00`).getDay();
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
  const times = new Set();
  const schedule = program.schedule.replace(/요일/g, '').replace(/\s*([~/])\s*/g, '$1');
  const clauses = schedule.split(/,\s*(?=[월화수목금토일])/);
  for (const clause of clauses) {
    const dayPart = clause.split(/\d/)[0];
    const range = dayPart.match(/([월화수목금토일])~([월화수목금토일])/);
    const days = range
      ? Array.from({ length: (dayNames.indexOf(range[2]) - dayNames.indexOf(range[1]) + 7) % 7 + 1 }, (_, i) => (dayNames.indexOf(range[1]) + i) % 7)
      : dayNames.flatMap((name, i) => dayPart.includes(name) ? [i] : []);
    if (!days.includes(weekday)) continue;
    const timeRange = clause.match(/(\d{2}):(\d{2})~(\d{2}):(\d{2})/);
    if (timeRange) {
      // Arrival examples within published hours; these are not available booking slots.
      const start = Number(timeRange[1]) * 60 + Number(timeRange[2]);
      const end = Number(timeRange[3]) * 60 + Number(timeRange[4]);
      const step = clause.includes('15분') ? 15 : 30;
      for (let minute = start; minute <= end; minute += step) times.add(`${String(Math.floor(minute / 60)).padStart(2, '0')}:${String(minute % 60).padStart(2, '0')}`);
    } else {
      for (const match of clause.matchAll(/\d{2}:\d{2}/g)) times.add(match[0]);
    }
  }
  return [...times].sort();
}

export const reservationDrivePrograms = [
  {
    "driveType": "프라이빗 신차 드라이브_언택트",
    "locations": [
      {
        "location": "고양",
        "vehicles": [
          {
            "id": "AVANTE",
            "name": "아반떼",
            "ENGINE": "Gasoline 1.6",
            "FUEL_ECONOMY": "15.3 km/L",
            "MAX_POWER": "123 PS",
            "MAX_TORQUE": "15.7 kgf·m"
          },
          {
            "id": "GRANDEUR",
            "name": "더 뉴 그랜저",
            "ENGINE": "Gasoline 3.5 GDi",
            "FUEL_ECONOMY": "10.4 km/L",
            "MAX_POWER": "300 PS",
            "MAX_TORQUE": "36.6 kgf·m"
          },
          {
            "id": "GRANDEUR_HYBRID",
            "name": "더 뉴 그랜저 Hybrid",
            "ENGINE": "Gasoline 1.6 Turbo Hybrid",
            "FUEL_ECONOMY": "18.0 km/L",
            "MAX_POWER": "230 PS (system)",
            "MAX_TORQUE": "27.0 kgf·m (engine)"
          }
        ],
        "id": "DFPNEWD",
        "title": "프라이빗 신차 드라이브_언택트",
        "description": "현대자동차에서 새롭게 출시한 차량을 빠르게 만나볼 수 있는 시승 프로그램을 체험해보세요.",
        "duration": "40분",
        "price": 0,
        "schedule": "화~목 11:00 / 15:00",
        "distance": "15Km",
        "course": "도심 + 자동차 전용도로",
        "driver": "고객",
        "vehicleNames": "아반떼, 더 뉴 그랜저, 더 뉴 그랜저 Hybrid",
        "image": "/images/reservation/drives/goyang-DFPNEWD.png",
        "source": "https://motorstudio.hyundai.com/goyang/cotn/exp/tsrdPgm.do?strgCd=01",
        "courses": [
          {
            "image": "/images/reservation/drives/courses/goyang-DFPNEWD-0.png",
            "caption": "코스 : 도심 + 자동차 전용도로 / 거리 : 15km / 40분",
            "source": "https://motorstudio.hyundai.com/goyang/cotn/exp/tsrdCoursePop.do?inputPgmNo=DFPNEWD"
          }
        ]
      },
      {
        "location": "하남",
        "vehicles": [
          {
            "id": "AVANTE",
            "name": "디 올 뉴 아반떼",
            "ENGINE": "Gasoline 1.6",
            "FUEL_ECONOMY": "15.3 km/L",
            "MAX_POWER": "123 PS",
            "MAX_TORQUE": "15.7 kgf·m"
          }
        ],
        "id": "DFPNEWD",
        "title": "프라이빗 신차 드라이브_언택트",
        "description": "현대자동차에서 새롭게 출시한 차량을 빠르게 만나볼 수 있는 시승 프로그램을 체험해보세요.",
        "duration": "30분",
        "price": 0,
        "schedule": "월~일요일 12:30~16:00",
        "distance": "16Km",
        "course": "도심 + 자동차 전용도로",
        "driver": "고객",
        "vehicleNames": "디 올 뉴 아반떼",
        "image": "/images/reservation/drives/hanam-DFPNEWD.png",
        "source": "https://motorstudio.hyundai.com/hanam/cotn/exp/tsrdPgm.do?strgCd=03",
        "courses": [
          {
            "image": "/images/reservation/drives/courses/hanam-DFPNEWD-0.jpg",
            "caption": "코스 : 도심 + 자동차 전용도로 / 거리 : 16km / 30분",
            "source": "https://motorstudio.hyundai.com/hanam/cotn/exp/tsrdCoursePop.do?inputPgmNo=DFPNEWD"
          }
        ]
      }
    ]
  },
  {
    "driveType": "하이 퍼포먼스 드라이브_언택트",
    "locations": [
      {
        "location": "고양",
        "vehicles": [
          {
            "id": "IONIQ_5_N",
            "name": "아이오닉 5 N",
            "ENGINE": "Dual electric motor (AWD)",
            "FUEL_ECONOMY": "3.7 km/kWh",
            "MAX_POWER": "478 kW (650 PS, N Grin Boost)",
            "MAX_TORQUE": "770 Nm (78.5 kgf·m)"
          },
          {
            "id": "IONIQ_6_N",
            "name": "아이오닉 6 N",
            "ENGINE": "Dual electric motor (AWD)",
            "FUEL_ECONOMY": "공식 인증값 확인 필요",
            "MAX_POWER": "478 kW (650 PS, N Grin Boost)",
            "MAX_TORQUE": "770 Nm (78.5 kgf·m)"
          },
          {
            "id": "AVANTE_N",
            "name": "아반떼 N",
            "ENGINE": "Gasoline 2.0 Turbo",
            "FUEL_ECONOMY": "10.4 km/L",
            "MAX_POWER": "280 PS",
            "MAX_TORQUE": "40.0 kgf·m"
          },
          {
            "id": "GV60_MAGMA",
            "name": "GV60 MAGMA",
            "ENGINE": "Dual electric motor (AWD)",
            "FUEL_ECONOMY": "공식 인증값 확인 필요",
            "MAX_POWER": "478 kW (650 PS, Boost)",
            "MAX_TORQUE": "790 Nm (80.6 kgf·m)"
          }
        ],
        "id": "DFNDRAV",
        "title": "하이 퍼포먼스 드라이브_언택트",
        "description": "드라이빙의 즐거움을 끌어올린 N브랜드의 퍼포먼스와 럭셔리 고성능의 GV60 마그마를 공공도로에서 안전하게 경험해 보세요.",
        "duration": "90분",
        "price": 0,
        "schedule": "화·수·목 10:30/15:30",
        "distance": "47Km",
        "course": "도심 + 자동차 전용도로",
        "driver": "고객",
        "vehicleNames": "아이오닉 5 N, 아이오닉 6 N, 아반떼 N, GV60 MAGMA",
        "image": "/images/reservation/drives/goyang-DFNDRAV.png",
        "source": "https://motorstudio.hyundai.com/goyang/cotn/exp/tsrdPgm.do?strgCd=01",
        "courses": [
          {
            "image": "/images/reservation/drives/courses/goyang-DFNDRAV-0.jpg",
            "caption": "코스 : 도심 + 자동차 전용도로 / 거리 : 47km / 90분",
            "source": "https://motorstudio.hyundai.com/goyang/cotn/exp/tsrdCoursePop.do?inputPgmNo=DFNDRAV"
          }
        ]
      }
    ]
  },
  {
    "driveType": "베이직 드라이브",
    "locations": [
      {
        "location": "고양",
        "vehicles": [
          {
            "id": "G90_BLACK",
            "name": "G90 BLACK",
            "ENGINE": "Gasoline 3.5 Turbo 48V e-S/C AWD",
            "FUEL_ECONOMY": "8.2 km/L",
            "MAX_POWER": "415 PS",
            "MAX_TORQUE": "56.0 kgf·m"
          },
          {
            "id": "G80_BLACK",
            "name": "G80 BLACK",
            "ENGINE": "Gasoline 3.5 Turbo AWD",
            "FUEL_ECONOMY": "8.3 km/L",
            "MAX_POWER": "380 PS",
            "MAX_TORQUE": "54.0 kgf·m"
          },
          {
            "id": "GV80",
            "name": "GV80",
            "ENGINE": "Gasoline 3.5 Turbo AWD",
            "FUEL_ECONOMY": "8.6 km/L",
            "MAX_POWER": "380 PS",
            "MAX_TORQUE": "54.0 kgf·m"
          },
          {
            "id": "GV80_COUPE",
            "name": "GV80 COUPE",
            "ENGINE": "Gasoline 3.5 Turbo 48V e-S/C AWD",
            "FUEL_ECONOMY": "8.2 km/L",
            "MAX_POWER": "415 PS",
            "MAX_TORQUE": "56.0 kgf·m"
          },
          {
            "id": "GV70",
            "name": "GV70",
            "ENGINE": "Gasoline 3.5 Turbo AWD",
            "FUEL_ECONOMY": "8.5 km/L",
            "MAX_POWER": "380 PS",
            "MAX_TORQUE": "54.0 kgf·m"
          },
          {
            "id": "ELECTRIFIED_GV70",
            "name": "ELECTRIFIED GV70",
            "ENGINE": "Dual electric motor (AWD)",
            "FUEL_ECONOMY": "4.6 km/kWh",
            "MAX_POWER": "360 kW (490 PS, Boost)",
            "MAX_TORQUE": "700 Nm (71.4 kgf·m)"
          },
          {
            "id": "GV60",
            "name": "GV60",
            "ENGINE": "Dual electric motor (Performance AWD)",
            "FUEL_ECONOMY": "4.1 km/kWh",
            "MAX_POWER": "360 kW (490 PS, Boost)",
            "MAX_TORQUE": "700 Nm (71.4 kgf·m)"
          },
          {
            "id": "GRANDEUR",
            "name": "그랜저",
            "ENGINE": "Gasoline 3.5 GDi",
            "FUEL_ECONOMY": "10.4 km/L",
            "MAX_POWER": "300 PS",
            "MAX_TORQUE": "36.6 kgf·m"
          },
          {
            "id": "GRANDEUR_HYBRID",
            "name": "더 뉴 그랜저 Hybrid",
            "ENGINE": "Gasoline 1.6 Turbo Hybrid",
            "FUEL_ECONOMY": "18.0 km/L",
            "MAX_POWER": "230 PS (system)",
            "MAX_TORQUE": "27.0 kgf·m (engine)"
          },
          {
            "id": "SONATA_EDGE",
            "name": "쏘나타 디 엣지",
            "ENGINE": "Gasoline 2.5 Turbo",
            "FUEL_ECONOMY": "11.1 km/L",
            "MAX_POWER": "290 PS",
            "MAX_TORQUE": "43.0 kgf·m"
          },
          {
            "id": "SONATA_HYBRID",
            "name": "쏘나타 Hybrid",
            "ENGINE": "Gasoline 2.0 GDi Hybrid",
            "FUEL_ECONOMY": "19.4 km/L",
            "MAX_POWER": "195 PS (system)",
            "MAX_TORQUE": "19.2 kgf·m (engine)"
          },
          {
            "id": "AVANTE",
            "name": "아반떼",
            "ENGINE": "Gasoline 1.6",
            "FUEL_ECONOMY": "15.3 km/L",
            "MAX_POWER": "123 PS",
            "MAX_TORQUE": "15.7 kgf·m"
          },
          {
            "id": "PALISADE",
            "name": "팰리세이드",
            "ENGINE": "Gasoline 2.5 Turbo",
            "FUEL_ECONOMY": "9.7 km/L",
            "MAX_POWER": "281 PS",
            "MAX_TORQUE": "43.0 kgf·m"
          },
          {
            "id": "PALISADE_HYBRID",
            "name": "팰리세이드 Hybrid",
            "ENGINE": "Gasoline 2.5 Turbo Hybrid",
            "FUEL_ECONOMY": "14.1 km/L",
            "MAX_POWER": "334 PS (system)",
            "MAX_TORQUE": "36.0 kgf·m (engine)"
          },
          {
            "id": "SANTA_FE",
            "name": "싼타페",
            "ENGINE": "Gasoline 2.5 Turbo",
            "FUEL_ECONOMY": "11.0 km/L",
            "MAX_POWER": "281 PS",
            "MAX_TORQUE": "43.0 kgf·m"
          },
          {
            "id": "SANTA_FE_HYBRID",
            "name": "싼타페 Hybrid",
            "ENGINE": "Gasoline 1.6 Turbo Hybrid",
            "FUEL_ECONOMY": "15.5 km/L",
            "MAX_POWER": "235 PS (system)",
            "MAX_TORQUE": "27.0 kgf·m (engine)"
          },
          {
            "id": "TUCSON",
            "name": "투싼",
            "ENGINE": "Gasoline 1.6 Turbo",
            "FUEL_ECONOMY": "12.5 km/L",
            "MAX_POWER": "180 PS",
            "MAX_TORQUE": "27.0 kgf·m"
          },
          {
            "id": "TUCSON_HYBRID",
            "name": "투싼 Hybrid",
            "ENGINE": "Gasoline 1.6 Turbo Hybrid",
            "FUEL_ECONOMY": "16.2 km/L",
            "MAX_POWER": "235 PS (system)",
            "MAX_TORQUE": "27.0 kgf·m (engine)"
          },
          {
            "id": "KONA",
            "name": "코나 N Line",
            "ENGINE": "Gasoline 1.6 Turbo",
            "FUEL_ECONOMY": "13.0 km/L",
            "MAX_POWER": "198 PS",
            "MAX_TORQUE": "27.0 kgf·m"
          },
          {
            "id": "KONA_ELECTRIC",
            "name": "코나 Electric",
            "ENGINE": "Electric motor",
            "FUEL_ECONOMY": "5.5 km/kWh",
            "MAX_POWER": "150 kW (204 PS)",
            "MAX_TORQUE": "255 Nm (26.0 kgf·m)"
          },
          {
            "id": "CASPER",
            "name": "캐스퍼",
            "ENGINE": "Gasoline 1.0 Turbo",
            "FUEL_ECONOMY": "12.8 km/L",
            "MAX_POWER": "100 PS",
            "MAX_TORQUE": "17.5 kgf·m"
          },
          {
            "id": "CASPER_ELECTRIC",
            "name": "캐스퍼 Electric Cross",
            "ENGINE": "Electric motor",
            "FUEL_ECONOMY": "5.6 km/kWh",
            "MAX_POWER": "84.5 kW (115 PS)",
            "MAX_TORQUE": "147 Nm (15.0 kgf·m)"
          },
          {
            "id": "STARIA_LIMOUSINE_EV",
            "name": "스타리아 리무진 Electric",
            "ENGINE": "Electric motor",
            "FUEL_ECONOMY": "공식 인증값 확인 필요",
            "MAX_POWER": "공식 최종 제원 확인 필요",
            "MAX_TORQUE": "공식 최종 제원 확인 필요"
          },
          {
            "id": "IONIQ_5",
            "name": "아이오닉 5",
            "ENGINE": "Dual electric motor (AWD)",
            "FUEL_ECONOMY": "4.8 km/kWh",
            "MAX_POWER": "239 kW (325 PS)",
            "MAX_TORQUE": "605 Nm (61.7 kgf·m)"
          },
          {
            "id": "IONIQ_6",
            "name": "아이오닉 6",
            "ENGINE": "Dual electric motor (AWD)",
            "FUEL_ECONOMY": "5.5 km/kWh",
            "MAX_POWER": "239 kW (325 PS)",
            "MAX_TORQUE": "605 Nm (61.7 kgf·m)"
          },
          {
            "id": "IONIQ_9",
            "name": "아이오닉 9",
            "ENGINE": "Dual electric motor (Performance AWD)",
            "FUEL_ECONOMY": "4.1 km/kWh",
            "MAX_POWER": "315 kW (428 PS)",
            "MAX_TORQUE": "700 Nm (71.4 kgf·m)"
          },
          {
            "id": "NEXO",
            "name": "넥쏘",
            "ENGINE": "Hydrogen fuel-cell electric motor",
            "FUEL_ECONOMY": "96.2 km/kg",
            "MAX_POWER": "150 kW (204 PS)",
            "MAX_TORQUE": "350 Nm (35.7 kgf·m)"
          },
          {
            "id": "G70",
            "name": "G70",
            "ENGINE": "Gasoline 3.3 Turbo AWD",
            "FUEL_ECONOMY": "8.8 km/L",
            "MAX_POWER": "370 PS",
            "MAX_TORQUE": "52.0 kgf·m"
          }
        ],
        "id": "DFHMSD",
        "title": "베이직 드라이브",
        "description": "자동차 전문가 Guru의 친절한 설명과 함께 현대자동차의 다양한 차량들을 현대 모터스튜디오에서 시승해보세요.",
        "duration": "30분",
        "price": 0,
        "schedule": "화~일요일 10:00~17:00 (매 15분)",
        "distance": "19.8Km",
        "course": "도심 + 자동차 전용도로",
        "driver": "고객",
        "vehicleNames": "G90 BLACK, G80 BLACK, GV80, GV80 COUPE, GV70, ELECTRIFIED GV70, GV60, 그랜저, 더 뉴 그랜저 Hybrid, 쏘나타 디 엣지, 쏘나타 Hybrid, 아반떼, 팰리세이드, 팰리세이드 Hybrid, 싼타페, 싼타페 Hybrid, 투싼, 투싼 Hybrid, 코나 N Line, 코나 Electric, 캐스퍼, 캐스퍼 Electric Cross, 스타리아 리무진 Electric, 아이오닉 5, 아이오닉 6, 아이오닉 9, 넥쏘, G70",
        "image": "/images/reservation/drives/goyang-DFHMSD.png",
        "source": "https://motorstudio.hyundai.com/goyang/cotn/exp/tsrdPgm.do?strgCd=01",
        "courses": [
          {
            "image": "/images/reservation/drives/courses/goyang-DFHMSD-0.jpg",
            "caption": "코스 : 도심 + 자동차 전용도로 / 거리 : 19.8km / 30분",
            "source": "https://motorstudio.hyundai.com/goyang/cotn/exp/tsrdCoursePop.do?inputPgmNo=DFHMSD"
          }
        ]
      },
      {
        "location": "서울",
        "vehicles": [
          {
            "id": "IONIQ_9",
            "name": "아이오닉 9",
            "ENGINE": "Dual electric motor (Performance AWD)",
            "FUEL_ECONOMY": "4.1 km/kWh",
            "MAX_POWER": "315 kW (428 PS)",
            "MAX_TORQUE": "700 Nm (71.4 kgf·m)"
          },
          {
            "id": "PALISADE_HYBRID",
            "name": "팰리세이드 Hybrid",
            "ENGINE": "Gasoline 2.5 Turbo Hybrid",
            "FUEL_ECONOMY": "14.1 km/L",
            "MAX_POWER": "334 PS (system)",
            "MAX_TORQUE": "36.0 kgf·m (engine)"
          },
          {
            "id": "IONIQ_5",
            "name": "아이오닉 5",
            "ENGINE": "Dual electric motor (AWD)",
            "FUEL_ECONOMY": "4.8 km/kWh",
            "MAX_POWER": "239 kW (325 PS)",
            "MAX_TORQUE": "605 Nm (61.7 kgf·m)"
          },
          {
            "id": "KONA",
            "name": "코나",
            "ENGINE": "Gasoline 1.6 Turbo",
            "FUEL_ECONOMY": "13.0 km/L",
            "MAX_POWER": "198 PS",
            "MAX_TORQUE": "27.0 kgf·m"
          },
          {
            "id": "GRANDEUR",
            "name": "더 뉴 그랜저",
            "ENGINE": "Gasoline 3.5 GDi",
            "FUEL_ECONOMY": "10.4 km/L",
            "MAX_POWER": "300 PS",
            "MAX_TORQUE": "36.6 kgf·m"
          },
          {
            "id": "AVANTE",
            "name": "아반떼",
            "ENGINE": "Gasoline 1.6",
            "FUEL_ECONOMY": "15.3 km/L",
            "MAX_POWER": "123 PS",
            "MAX_TORQUE": "15.7 kgf·m"
          },
          {
            "id": "G90_BLACK",
            "name": "G90 LWB BLACK",
            "ENGINE": "Gasoline 3.5 Turbo 48V e-S/C AWD",
            "FUEL_ECONOMY": "8.2 km/L",
            "MAX_POWER": "415 PS",
            "MAX_TORQUE": "56.0 kgf·m"
          },
          {
            "id": "G80_BLACK",
            "name": "G80 BLACK",
            "ENGINE": "Gasoline 3.5 Turbo AWD",
            "FUEL_ECONOMY": "8.3 km/L",
            "MAX_POWER": "380 PS",
            "MAX_TORQUE": "54.0 kgf·m"
          },
          {
            "id": "GV80",
            "name": "GV80",
            "ENGINE": "Gasoline 3.5 Turbo AWD",
            "FUEL_ECONOMY": "8.6 km/L",
            "MAX_POWER": "380 PS",
            "MAX_TORQUE": "54.0 kgf·m"
          },
          {
            "id": "GV70",
            "name": "GV70",
            "ENGINE": "Gasoline 3.5 Turbo AWD",
            "FUEL_ECONOMY": "8.5 km/L",
            "MAX_POWER": "380 PS",
            "MAX_TORQUE": "54.0 kgf·m"
          }
        ],
        "id": "DFANWEX",
        "title": "베이직 드라이브",
        "description": "자동차 전문가 Guru의 친절한 설명과 함께 현대자동차의 신차를 현대 모터스튜디오 서울에서 가장 빠르게 경험해보세요!",
        "duration": "30분",
        "price": 0,
        "schedule": "월~일요일 10:00~18:00",
        "distance": "3.8Km, 5Km",
        "course": "도심 + 자동차 전용도로",
        "driver": "고객 / 구루",
        "vehicleNames": "아이오닉 9, 팰리세이드 Hybrid, 아이오닉 5, 코나, 더 뉴 그랜저, 아반떼, G90 LWB BLACK, G80 BLACK, GV80, GV70",
        "image": "/images/reservation/drives/seoul-DFANWEX.png",
        "source": "https://motorstudio.hyundai.com/seoul/cotn/exp/tsrdPgm.do?strgCd=02",
        "courses": [
          {
            "image": "/images/reservation/drives/courses/seoul-DFANWEX-0.jpg",
            "caption": "코스 : 도심 + 자동차 전용도로 / 거리 : 3.8km / 30분",
            "source": "https://motorstudio.hyundai.com/seoul/cotn/exp/tsrdCoursePop.do?inputPgmNo=DFANWEX"
          },
          {
            "image": "/images/reservation/drives/courses/seoul-DFANWEX-1.jpg",
            "caption": "코스 : 도심 + 자동차 전용도로 / 거리 : 5km / 30분",
            "source": "https://motorstudio.hyundai.com/seoul/cotn/exp/tsrdCoursePop.do?inputPgmNo=DFANWEX"
          }
        ]
      },
      {
        "location": "하남",
        "vehicles": [
          {
            "id": "CASPER_ELECTRIC",
            "name": "캐스퍼 Electric Cross",
            "ENGINE": "Electric motor",
            "FUEL_ECONOMY": "5.6 km/kWh",
            "MAX_POWER": "84.5 kW (115 PS)",
            "MAX_TORQUE": "147 Nm (15.0 kgf·m)"
          },
          {
            "id": "IONIQ_5",
            "name": "아이오닉 5",
            "ENGINE": "Dual electric motor (AWD)",
            "FUEL_ECONOMY": "4.8 km/kWh",
            "MAX_POWER": "239 kW (325 PS)",
            "MAX_TORQUE": "605 Nm (61.7 kgf·m)"
          },
          {
            "id": "IONIQ_6",
            "name": "아이오닉 6",
            "ENGINE": "Dual electric motor (AWD)",
            "FUEL_ECONOMY": "5.5 km/kWh",
            "MAX_POWER": "239 kW (325 PS)",
            "MAX_TORQUE": "605 Nm (61.7 kgf·m)"
          },
          {
            "id": "IONIQ_9",
            "name": "아이오닉 9",
            "ENGINE": "Dual electric motor (Performance AWD)",
            "FUEL_ECONOMY": "4.1 km/kWh",
            "MAX_POWER": "315 kW (428 PS)",
            "MAX_TORQUE": "700 Nm (71.4 kgf·m)"
          },
          {
            "id": "NEXO",
            "name": "넥쏘",
            "ENGINE": "Hydrogen fuel-cell electric motor",
            "FUEL_ECONOMY": "96.2 km/kg",
            "MAX_POWER": "150 kW (204 PS)",
            "MAX_TORQUE": "350 Nm (35.7 kgf·m)"
          },
          {
            "id": "KONA",
            "name": "코나",
            "ENGINE": "Gasoline 1.6 Turbo",
            "FUEL_ECONOMY": "13.0 km/L",
            "MAX_POWER": "198 PS",
            "MAX_TORQUE": "27.0 kgf·m"
          },
          {
            "id": "SANTA_FE_HYBRID",
            "name": "싼타페 Hybrid",
            "ENGINE": "Gasoline 1.6 Turbo Hybrid",
            "FUEL_ECONOMY": "15.5 km/L",
            "MAX_POWER": "235 PS (system)",
            "MAX_TORQUE": "27.0 kgf·m (engine)"
          },
          {
            "id": "PALISADE",
            "name": "팰리세이드",
            "ENGINE": "Gasoline 2.5 Turbo",
            "FUEL_ECONOMY": "9.7 km/L",
            "MAX_POWER": "281 PS",
            "MAX_TORQUE": "43.0 kgf·m"
          },
          {
            "id": "PALISADE_HYBRID",
            "name": "팰리세이드 Hybrid",
            "ENGINE": "Gasoline 2.5 Turbo Hybrid",
            "FUEL_ECONOMY": "14.1 km/L",
            "MAX_POWER": "334 PS (system)",
            "MAX_TORQUE": "36.0 kgf·m (engine)"
          },
          {
            "id": "GRANDEUR",
            "name": "그랜저",
            "ENGINE": "Gasoline 3.5 GDi",
            "FUEL_ECONOMY": "10.4 km/L",
            "MAX_POWER": "300 PS",
            "MAX_TORQUE": "36.6 kgf·m"
          },
          {
            "id": "GRANDEUR_HYBRID",
            "name": "그랜저 Hybrid",
            "ENGINE": "Gasoline 1.6 Turbo Hybrid",
            "FUEL_ECONOMY": "18.0 km/L",
            "MAX_POWER": "230 PS (system)",
            "MAX_TORQUE": "27.0 kgf·m (engine)"
          }
        ],
        "id": "DFANWEX",
        "title": "베이직 드라이브",
        "description": "자동차 전문가 Guru의 친절한 설명과 함께 현대자동차의 다양한 차량들을 현대 모터스튜디오에서 시승해보세요.",
        "duration": "40분",
        "price": 0,
        "schedule": "월~일요일 10:30~17:00",
        "distance": "31Km",
        "course": "도심 + 자동차 전용도로",
        "driver": "고객 / 구루",
        "vehicleNames": "캐스퍼 Electric Cross, 아이오닉 5, 아이오닉 6, 아이오닉 9, 넥쏘, 코나, 싼타페 Hybrid, 팰리세이드, 팰리세이드 Hybrid, 그랜저, 그랜저 Hybrid",
        "image": "/images/reservation/drives/hanam-DFANWEX.png",
        "source": "https://motorstudio.hyundai.com/hanam/cotn/exp/tsrdPgm.do?strgCd=03",
        "courses": [
          {
            "image": "/images/reservation/drives/courses/hanam-DFANWEX-0.jpg",
            "caption": "코스 : 도심 + 자동차 전용도로 / 거리 : 31km / 40분",
            "source": "https://motorstudio.hyundai.com/hanam/cotn/exp/tsrdCoursePop.do?inputPgmNo=DFANWEX"
          }
        ]
      }
    ]
  },
  {
    "driveType": "베이직 드라이브_언택트",
    "locations": [
      {
        "location": "고양",
        "vehicles": [
          {
            "id": "G90_BLACK",
            "name": "G90 BLACK",
            "ENGINE": "Gasoline 3.5 Turbo 48V e-S/C AWD",
            "FUEL_ECONOMY": "8.2 km/L",
            "MAX_POWER": "415 PS",
            "MAX_TORQUE": "56.0 kgf·m"
          },
          {
            "id": "G80_BLACK",
            "name": "G80 BLACK",
            "ENGINE": "Gasoline 3.5 Turbo AWD",
            "FUEL_ECONOMY": "8.3 km/L",
            "MAX_POWER": "380 PS",
            "MAX_TORQUE": "54.0 kgf·m"
          },
          {
            "id": "G70",
            "name": "G70",
            "ENGINE": "Gasoline 3.3 Turbo AWD",
            "FUEL_ECONOMY": "8.8 km/L",
            "MAX_POWER": "370 PS",
            "MAX_TORQUE": "52.0 kgf·m"
          },
          {
            "id": "GV80",
            "name": "GV80",
            "ENGINE": "Gasoline 3.5 Turbo AWD",
            "FUEL_ECONOMY": "8.6 km/L",
            "MAX_POWER": "380 PS",
            "MAX_TORQUE": "54.0 kgf·m"
          },
          {
            "id": "GV80_COUPE",
            "name": "GV80 COUPE",
            "ENGINE": "Gasoline 3.5 Turbo 48V e-S/C AWD",
            "FUEL_ECONOMY": "8.2 km/L",
            "MAX_POWER": "415 PS",
            "MAX_TORQUE": "56.0 kgf·m"
          },
          {
            "id": "GV70",
            "name": "GV70",
            "ENGINE": "Gasoline 3.5 Turbo AWD",
            "FUEL_ECONOMY": "8.5 km/L",
            "MAX_POWER": "380 PS",
            "MAX_TORQUE": "54.0 kgf·m"
          },
          {
            "id": "ELECTRIFIED_GV70",
            "name": "ELECTRIFIED GV70",
            "ENGINE": "Dual electric motor (AWD)",
            "FUEL_ECONOMY": "4.6 km/kWh",
            "MAX_POWER": "360 kW (490 PS, Boost)",
            "MAX_TORQUE": "700 Nm (71.4 kgf·m)"
          },
          {
            "id": "GV60",
            "name": "GV60",
            "ENGINE": "Dual electric motor (Performance AWD)",
            "FUEL_ECONOMY": "4.1 km/kWh",
            "MAX_POWER": "360 kW (490 PS, Boost)",
            "MAX_TORQUE": "700 Nm (71.4 kgf·m)"
          },
          {
            "id": "GRANDEUR",
            "name": "그랜저",
            "ENGINE": "Gasoline 3.5 GDi",
            "FUEL_ECONOMY": "10.4 km/L",
            "MAX_POWER": "300 PS",
            "MAX_TORQUE": "36.6 kgf·m"
          },
          {
            "id": "GRANDEUR_HYBRID",
            "name": "더 뉴 그랜저 Hybrid",
            "ENGINE": "Gasoline 1.6 Turbo Hybrid",
            "FUEL_ECONOMY": "18.0 km/L",
            "MAX_POWER": "230 PS (system)",
            "MAX_TORQUE": "27.0 kgf·m (engine)"
          },
          {
            "id": "SONATA_EDGE",
            "name": "쏘나타 디 엣지",
            "ENGINE": "Gasoline 2.5 Turbo",
            "FUEL_ECONOMY": "11.1 km/L",
            "MAX_POWER": "290 PS",
            "MAX_TORQUE": "43.0 kgf·m"
          },
          {
            "id": "SONATA_HYBRID",
            "name": "쏘나타 Hybrid",
            "ENGINE": "Gasoline 2.0 GDi Hybrid",
            "FUEL_ECONOMY": "19.4 km/L",
            "MAX_POWER": "195 PS (system)",
            "MAX_TORQUE": "19.2 kgf·m (engine)"
          },
          {
            "id": "AVANTE",
            "name": "아반떼",
            "ENGINE": "Gasoline 1.6",
            "FUEL_ECONOMY": "15.3 km/L",
            "MAX_POWER": "123 PS",
            "MAX_TORQUE": "15.7 kgf·m"
          },
          {
            "id": "PALISADE",
            "name": "팰리세이드",
            "ENGINE": "Gasoline 2.5 Turbo",
            "FUEL_ECONOMY": "9.7 km/L",
            "MAX_POWER": "281 PS",
            "MAX_TORQUE": "43.0 kgf·m"
          },
          {
            "id": "PALISADE_HYBRID",
            "name": "팰리세이드 Hybrid",
            "ENGINE": "Gasoline 2.5 Turbo Hybrid",
            "FUEL_ECONOMY": "14.1 km/L",
            "MAX_POWER": "334 PS (system)",
            "MAX_TORQUE": "36.0 kgf·m (engine)"
          },
          {
            "id": "SANTA_FE",
            "name": "싼타페",
            "ENGINE": "Gasoline 2.5 Turbo",
            "FUEL_ECONOMY": "11.0 km/L",
            "MAX_POWER": "281 PS",
            "MAX_TORQUE": "43.0 kgf·m"
          },
          {
            "id": "SANTA_FE_HYBRID",
            "name": "싼타페 Hybrid",
            "ENGINE": "Gasoline 1.6 Turbo Hybrid",
            "FUEL_ECONOMY": "15.5 km/L",
            "MAX_POWER": "235 PS (system)",
            "MAX_TORQUE": "27.0 kgf·m (engine)"
          },
          {
            "id": "TUCSON",
            "name": "투싼",
            "ENGINE": "Gasoline 1.6 Turbo",
            "FUEL_ECONOMY": "12.5 km/L",
            "MAX_POWER": "180 PS",
            "MAX_TORQUE": "27.0 kgf·m"
          },
          {
            "id": "TUCSON_HYBRID",
            "name": "투싼 Hybrid",
            "ENGINE": "Gasoline 1.6 Turbo Hybrid",
            "FUEL_ECONOMY": "16.2 km/L",
            "MAX_POWER": "235 PS (system)",
            "MAX_TORQUE": "27.0 kgf·m (engine)"
          },
          {
            "id": "KONA",
            "name": "코나 N Line",
            "ENGINE": "Gasoline 1.6 Turbo",
            "FUEL_ECONOMY": "13.0 km/L",
            "MAX_POWER": "198 PS",
            "MAX_TORQUE": "27.0 kgf·m"
          },
          {
            "id": "KONA_ELECTRIC",
            "name": "코나 Electric",
            "ENGINE": "Electric motor",
            "FUEL_ECONOMY": "5.5 km/kWh",
            "MAX_POWER": "150 kW (204 PS)",
            "MAX_TORQUE": "255 Nm (26.0 kgf·m)"
          },
          {
            "id": "CASPER",
            "name": "캐스퍼",
            "ENGINE": "Gasoline 1.0 Turbo",
            "FUEL_ECONOMY": "12.8 km/L",
            "MAX_POWER": "100 PS",
            "MAX_TORQUE": "17.5 kgf·m"
          },
          {
            "id": "CASPER_ELECTRIC",
            "name": "캐스퍼 Electric Cross",
            "ENGINE": "Electric motor",
            "FUEL_ECONOMY": "5.6 km/kWh",
            "MAX_POWER": "84.5 kW (115 PS)",
            "MAX_TORQUE": "147 Nm (15.0 kgf·m)"
          },
          {
            "id": "IONIQ_5",
            "name": "아이오닉 5",
            "ENGINE": "Dual electric motor (AWD)",
            "FUEL_ECONOMY": "4.8 km/kWh",
            "MAX_POWER": "239 kW (325 PS)",
            "MAX_TORQUE": "605 Nm (61.7 kgf·m)"
          },
          {
            "id": "IONIQ_6",
            "name": "아이오닉 6",
            "ENGINE": "Dual electric motor (AWD)",
            "FUEL_ECONOMY": "5.5 km/kWh",
            "MAX_POWER": "239 kW (325 PS)",
            "MAX_TORQUE": "605 Nm (61.7 kgf·m)"
          },
          {
            "id": "IONIQ_9",
            "name": "아이오닉 9",
            "ENGINE": "Dual electric motor (Performance AWD)",
            "FUEL_ECONOMY": "4.1 km/kWh",
            "MAX_POWER": "315 kW (428 PS)",
            "MAX_TORQUE": "700 Nm (71.4 kgf·m)"
          },
          {
            "id": "NEXO",
            "name": "넥쏘",
            "ENGINE": "Hydrogen fuel-cell electric motor",
            "FUEL_ECONOMY": "96.2 km/kg",
            "MAX_POWER": "150 kW (204 PS)",
            "MAX_TORQUE": "350 Nm (35.7 kgf·m)"
          },
          {
            "id": "STARIA_LIMOUSINE_EV",
            "name": "스타리아 리무진 Electric",
            "ENGINE": "Electric motor",
            "FUEL_ECONOMY": "공식 인증값 확인 필요",
            "MAX_POWER": "공식 최종 제원 확인 필요",
            "MAX_TORQUE": "공식 최종 제원 확인 필요"
          }
        ],
        "id": "DFSGTDV",
        "title": "베이직 드라이브_언택트",
        "description": "혼자 또는 사랑하는 가족, 지인들과 함께 차량에 집중하고 싶으시다면. '베이직 드라이브 언택트' 프로그램을 이용해 보세요.",
        "duration": "30분",
        "price": 0,
        "schedule": "화~일요일 10:00~17:00 (매 15분)",
        "distance": "15Km",
        "course": "도심 + 자동차 전용도로",
        "driver": "고객",
        "vehicleNames": "G90 BLACK, G80 BLACK, G70, GV80, GV80 COUPE, GV70, ELECTRIFIED GV70, GV60, 그랜저, 더 뉴 그랜저 Hybrid, 쏘나타 디 엣지, 쏘나타 Hybrid, 아반떼, 팰리세이드, 팰리세이드 Hybrid, 싼타페, 싼타페 Hybrid, 투싼, 투싼 Hybrid, 코나 N Line, 코나 Electric, 캐스퍼, 캐스퍼 Electric Cross, 아이오닉 5, 아이오닉 6, 아이오닉 9, 넥쏘, 스타리아 리무진 Electric",
        "image": "/images/reservation/drives/goyang-DFSGTDV.png",
        "source": "https://motorstudio.hyundai.com/goyang/cotn/exp/tsrdPgm.do?strgCd=01",
        "courses": [
          {
            "image": "/images/reservation/drives/courses/goyang-DFSGTDV-0.png",
            "caption": "코스 : 도심 + 자동차 전용도로 / 거리 : 15km / 30분",
            "source": "https://motorstudio.hyundai.com/goyang/cotn/exp/tsrdCoursePop.do?inputPgmNo=DFSGTDV"
          }
        ]
      },
      {
        "location": "서울",
        "vehicles": [
          {
            "id": "IONIQ_9",
            "name": "아이오닉 9",
            "ENGINE": "Dual electric motor (Performance AWD)",
            "FUEL_ECONOMY": "4.1 km/kWh",
            "MAX_POWER": "315 kW (428 PS)",
            "MAX_TORQUE": "700 Nm (71.4 kgf·m)"
          },
          {
            "id": "IONIQ_5",
            "name": "아이오닉 5",
            "ENGINE": "Dual electric motor (AWD)",
            "FUEL_ECONOMY": "4.8 km/kWh",
            "MAX_POWER": "239 kW (325 PS)",
            "MAX_TORQUE": "605 Nm (61.7 kgf·m)"
          },
          {
            "id": "PALISADE_HYBRID",
            "name": "팰리세이드 Hybrid",
            "ENGINE": "Gasoline 2.5 Turbo Hybrid",
            "FUEL_ECONOMY": "14.1 km/L",
            "MAX_POWER": "334 PS (system)",
            "MAX_TORQUE": "36.0 kgf·m (engine)"
          },
          {
            "id": "KONA",
            "name": "코나",
            "ENGINE": "Gasoline 1.6 Turbo",
            "FUEL_ECONOMY": "13.0 km/L",
            "MAX_POWER": "198 PS",
            "MAX_TORQUE": "27.0 kgf·m"
          },
          {
            "id": "GRANDEUR",
            "name": "더 뉴 그랜저",
            "ENGINE": "Gasoline 3.5 GDi",
            "FUEL_ECONOMY": "10.4 km/L",
            "MAX_POWER": "300 PS",
            "MAX_TORQUE": "36.6 kgf·m"
          },
          {
            "id": "AVANTE",
            "name": "아반떼",
            "ENGINE": "Gasoline 1.6",
            "FUEL_ECONOMY": "15.3 km/L",
            "MAX_POWER": "123 PS",
            "MAX_TORQUE": "15.7 kgf·m"
          },
          {
            "id": "G90_BLACK",
            "name": "G90 LWB BLACK",
            "ENGINE": "Gasoline 3.5 Turbo 48V e-S/C AWD",
            "FUEL_ECONOMY": "8.2 km/L",
            "MAX_POWER": "415 PS",
            "MAX_TORQUE": "56.0 kgf·m"
          },
          {
            "id": "G80_BLACK",
            "name": "G80 BLACK",
            "ENGINE": "Gasoline 3.5 Turbo AWD",
            "FUEL_ECONOMY": "8.3 km/L",
            "MAX_POWER": "380 PS",
            "MAX_TORQUE": "54.0 kgf·m"
          },
          {
            "id": "GV80",
            "name": "GV80",
            "ENGINE": "Gasoline 3.5 Turbo AWD",
            "FUEL_ECONOMY": "8.6 km/L",
            "MAX_POWER": "380 PS",
            "MAX_TORQUE": "54.0 kgf·m"
          },
          {
            "id": "GV70",
            "name": "GV70",
            "ENGINE": "Gasoline 3.5 Turbo AWD",
            "FUEL_ECONOMY": "8.5 km/L",
            "MAX_POWER": "380 PS",
            "MAX_TORQUE": "54.0 kgf·m"
          }
        ],
        "id": "DFSGTDV",
        "title": "베이직 드라이브_언택트",
        "description": "혼자 또는 사랑하는 가족, 지인들과 함께 차량에 집중하고 싶으시다면. '베이직 드라이브 언택트' 프로그램을 이용해 보세요.",
        "duration": "30분",
        "price": 0,
        "schedule": "월~일요일 10:00~18:00",
        "distance": "3.8Km, 5Km",
        "course": "도심 + 자동차 전용도로",
        "driver": "고객",
        "vehicleNames": "아이오닉 9, 아이오닉 5, 팰리세이드 Hybrid, 코나, 더 뉴 그랜저, 아반떼, G90 LWB BLACK, G80 BLACK, GV80, GV70",
        "image": "/images/reservation/drives/seoul-DFSGTDV.png",
        "source": "https://motorstudio.hyundai.com/seoul/cotn/exp/tsrdPgm.do?strgCd=02",
        "courses": [
          {
            "image": "/images/reservation/drives/courses/seoul-DFSGTDV-0.jpg",
            "caption": "코스 : 도심 + 자동차 전용도로 / 거리 : 3.8km / 30분",
            "source": "https://motorstudio.hyundai.com/seoul/cotn/exp/tsrdCoursePop.do?inputPgmNo=DFSGTDV"
          },
          {
            "image": "/images/reservation/drives/courses/seoul-DFSGTDV-1.jpg",
            "caption": "코스 : 도심 + 자동차 전용도로 / 거리 : 5km / 30분",
            "source": "https://motorstudio.hyundai.com/seoul/cotn/exp/tsrdCoursePop.do?inputPgmNo=DFSGTDV"
          }
        ]
      },
      {
        "location": "하남",
        "vehicles": [
          {
            "id": "CASPER_ELECTRIC",
            "name": "캐스퍼 Electric Cross",
            "ENGINE": "Electric motor",
            "FUEL_ECONOMY": "5.6 km/kWh",
            "MAX_POWER": "84.5 kW (115 PS)",
            "MAX_TORQUE": "147 Nm (15.0 kgf·m)"
          },
          {
            "id": "IONIQ_5",
            "name": "아이오닉 5",
            "ENGINE": "Dual electric motor (AWD)",
            "FUEL_ECONOMY": "4.8 km/kWh",
            "MAX_POWER": "239 kW (325 PS)",
            "MAX_TORQUE": "605 Nm (61.7 kgf·m)"
          },
          {
            "id": "IONIQ_6",
            "name": "아이오닉 6",
            "ENGINE": "Dual electric motor (AWD)",
            "FUEL_ECONOMY": "5.5 km/kWh",
            "MAX_POWER": "239 kW (325 PS)",
            "MAX_TORQUE": "605 Nm (61.7 kgf·m)"
          },
          {
            "id": "IONIQ_9",
            "name": "아이오닉 9",
            "ENGINE": "Dual electric motor (Performance AWD)",
            "FUEL_ECONOMY": "4.1 km/kWh",
            "MAX_POWER": "315 kW (428 PS)",
            "MAX_TORQUE": "700 Nm (71.4 kgf·m)"
          },
          {
            "id": "NEXO",
            "name": "넥쏘",
            "ENGINE": "Hydrogen fuel-cell electric motor",
            "FUEL_ECONOMY": "96.2 km/kg",
            "MAX_POWER": "150 kW (204 PS)",
            "MAX_TORQUE": "350 Nm (35.7 kgf·m)"
          },
          {
            "id": "KONA",
            "name": "코나",
            "ENGINE": "Gasoline 1.6 Turbo",
            "FUEL_ECONOMY": "13.0 km/L",
            "MAX_POWER": "198 PS",
            "MAX_TORQUE": "27.0 kgf·m"
          },
          {
            "id": "SANTA_FE_HYBRID",
            "name": "싼타페 Hybrid",
            "ENGINE": "Gasoline 1.6 Turbo Hybrid",
            "FUEL_ECONOMY": "15.5 km/L",
            "MAX_POWER": "235 PS (system)",
            "MAX_TORQUE": "27.0 kgf·m (engine)"
          },
          {
            "id": "PALISADE",
            "name": "팰리세이드",
            "ENGINE": "Gasoline 2.5 Turbo",
            "FUEL_ECONOMY": "9.7 km/L",
            "MAX_POWER": "281 PS",
            "MAX_TORQUE": "43.0 kgf·m"
          },
          {
            "id": "PALISADE_HYBRID",
            "name": "팰리세이드 Hybrid",
            "ENGINE": "Gasoline 2.5 Turbo Hybrid",
            "FUEL_ECONOMY": "14.1 km/L",
            "MAX_POWER": "334 PS (system)",
            "MAX_TORQUE": "36.0 kgf·m (engine)"
          },
          {
            "id": "GRANDEUR",
            "name": "그랜저",
            "ENGINE": "Gasoline 3.5 GDi",
            "FUEL_ECONOMY": "10.4 km/L",
            "MAX_POWER": "300 PS",
            "MAX_TORQUE": "36.6 kgf·m"
          },
          {
            "id": "GRANDEUR_HYBRID",
            "name": "그랜저 Hybrid",
            "ENGINE": "Gasoline 1.6 Turbo Hybrid",
            "FUEL_ECONOMY": "18.0 km/L",
            "MAX_POWER": "230 PS (system)",
            "MAX_TORQUE": "27.0 kgf·m (engine)"
          }
        ],
        "id": "DFRERFR",
        "title": "베이직 드라이브_언택트",
        "description": "혼자 또는 사랑하는 가족, 지인들과 함께 차량에 집중하고 싶으시다면. '베이직 드라이브 언택트' 프로그램을 이용해 보세요.",
        "duration": "30분",
        "price": 0,
        "schedule": "월~일요일 10:30~17:00",
        "distance": "16Km",
        "course": "도심 + 자동차 전용도로",
        "driver": "고객",
        "vehicleNames": "캐스퍼 Electric Cross, 아이오닉 5, 아이오닉 6, 아이오닉 9, 넥쏘, 코나, 싼타페 Hybrid, 팰리세이드, 팰리세이드 Hybrid, 그랜저, 그랜저 Hybrid",
        "image": "/images/reservation/drives/hanam-DFRERFR.png",
        "source": "https://motorstudio.hyundai.com/hanam/cotn/exp/tsrdPgm.do?strgCd=03",
        "courses": [
          {
            "image": "/images/reservation/drives/courses/hanam-DFRERFR-0.jpg",
            "caption": "코스 : 도심 + 자동차 전용도로 / 거리 : 16km / 30분",
            "source": "https://motorstudio.hyundai.com/hanam/cotn/exp/tsrdCoursePop.do?inputPgmNo=DFRERFR"
          }
        ]
      }
    ]
  },
  {
    "driveType": "비기너 드라이브",
    "locations": [
      {
        "location": "고양",
        "vehicles": [
          {
            "id": "RANDOM",
            "name": "임의배정",
            "ENGINE": null,
            "FUEL_ECONOMY": null,
            "MAX_POWER": null,
            "MAX_TORQUE": null,
            "note": "현장에서 차량이 임의 배정됩니다."
          }
        ],
        "id": "DFLSDRV",
        "title": "비기너 드라이브",
        "description": "수준별 다양한 코스가 준비된 '비기너 드라이브'! 아직은 운전이 서툴고 두려운 당신이라면 참여하셔서 운전에 대한 자신감을 키워보세요.",
        "duration": "40분",
        "price": 0,
        "schedule": "화~일요일 17:00",
        "distance": "7.5Km, 20.3Km, 23.3Km",
        "course": "자동차 관리법 + 도로주행",
        "driver": "고객",
        "vehicleNames": "임의배정",
        "image": "/images/reservation/drives/goyang-DFLSDRV.png",
        "source": "https://motorstudio.hyundai.com/goyang/cotn/exp/tsrdPgm.do?strgCd=01",
        "courses": [
          {
            "image": "/images/reservation/drives/courses/goyang-DFLSDRV-0.jpg",
            "caption": "코스 : 자동차 관리법 + 도로주행 / 거리 : 7.5km / 40분",
            "source": "https://motorstudio.hyundai.com/goyang/cotn/exp/tsrdCoursePop.do?inputPgmNo=DFLSDRV"
          },
          {
            "image": "/images/reservation/drives/courses/goyang-DFLSDRV-1.jpg",
            "caption": "코스 : 도로주행 / 거리 : 20.3km / 40분",
            "source": "https://motorstudio.hyundai.com/goyang/cotn/exp/tsrdCoursePop.do?inputPgmNo=DFLSDRV"
          },
          {
            "image": "/images/reservation/drives/courses/goyang-DFLSDRV-2.jpg",
            "caption": "코스 : 도로주행 / 거리 : 23.3km / 40분",
            "source": "https://motorstudio.hyundai.com/goyang/cotn/exp/tsrdCoursePop.do?inputPgmNo=DFLSDRV"
          }
        ]
      },
      {
        "location": "서울",
        "vehicles": [
          {
            "id": "AVANTE",
            "name": "아반떼",
            "ENGINE": "Gasoline 1.6",
            "FUEL_ECONOMY": "15.3 km/L",
            "MAX_POWER": "123 PS",
            "MAX_TORQUE": "15.7 kgf·m"
          },
          {
            "id": "KONA",
            "name": "코나",
            "ENGINE": "Gasoline 1.6 Turbo",
            "FUEL_ECONOMY": "13.0 km/L",
            "MAX_POWER": "198 PS",
            "MAX_TORQUE": "27.0 kgf·m"
          }
        ],
        "id": "DFLSDRV",
        "title": "비기너 드라이브",
        "description": "아직은 운전이 서툴고 두려운 당신이라면, '비기너 드라이브'에 참여하셔서 운전에 대한 자신감을 키워보세요!",
        "duration": "50분",
        "price": 0,
        "schedule": "화·목·금 14:00",
        "distance": "5.3Km, 9.7Km",
        "course": "자동차 관리법 + 도로주행",
        "driver": "고객",
        "vehicleNames": "아반떼, 코나",
        "image": "/images/reservation/drives/seoul-DFLSDRV.png",
        "source": "https://motorstudio.hyundai.com/seoul/cotn/exp/tsrdPgm.do?strgCd=02",
        "courses": [
          {
            "image": "/images/reservation/drives/courses/seoul-DFLSDRV-0.jpg",
            "caption": "코스 : 자동차 관리법 + 도로주행 / 거리 : 5.3km / 50분",
            "source": "https://motorstudio.hyundai.com/seoul/cotn/exp/tsrdCoursePop.do?inputPgmNo=DFLSDRV"
          },
          {
            "image": "/images/reservation/drives/courses/seoul-DFLSDRV-1.jpg",
            "caption": "코스 : 도로주행 / 거리 : 9.7km / 50분",
            "source": "https://motorstudio.hyundai.com/seoul/cotn/exp/tsrdCoursePop.do?inputPgmNo=DFLSDRV"
          }
        ]
      },
      {
        "location": "하남",
        "vehicles": [
          {
            "id": "KONA",
            "name": "코나",
            "ENGINE": "Gasoline 1.6 Turbo",
            "FUEL_ECONOMY": "13.0 km/L",
            "MAX_POWER": "198 PS",
            "MAX_TORQUE": "27.0 kgf·m"
          }
        ],
        "id": "DFLSDRV",
        "title": "비기너 드라이브",
        "description": "아직은 운전이 서툴고 두려운 당신이라면, '비기너 드라이브'에 참여하셔서 운전에 대한 자신감을 키워보세요.",
        "duration": "50분",
        "price": 0,
        "schedule": "월~금요일 10:30~16:00",
        "distance": "5.2Km, 16.3Km",
        "course": "자동차 관리법 + 도로주행",
        "driver": "고객 / 구루",
        "vehicleNames": "코나",
        "image": "/images/reservation/drives/hanam-DFLSDRV.png",
        "source": "https://motorstudio.hyundai.com/hanam/cotn/exp/tsrdPgm.do?strgCd=03",
        "courses": [
          {
            "image": "/images/reservation/drives/courses/hanam-DFLSDRV-0.jpg",
            "caption": "코스 : 자동차 관리법 + 도로주행 / 거리 : 5.2km / 50분",
            "source": "https://motorstudio.hyundai.com/hanam/cotn/exp/tsrdCoursePop.do?inputPgmNo=DFLSDRV"
          },
          {
            "image": "/images/reservation/drives/courses/hanam-DFLSDRV-1.jpg",
            "caption": "코스 : 자동차 관리법 + 도로주행 / 거리 : 16.3km / 50분",
            "source": "https://motorstudio.hyundai.com/hanam/cotn/exp/tsrdCoursePop.do?inputPgmNo=DFLSDRV"
          }
        ]
      }
    ]
  },
  {
    "driveType": "아웃도어 라이프_차콕",
    "locations": [
      {
        "location": "고양",
        "vehicles": [
          {
            "id": "PALISADE_HYBRID",
            "name": "팰리세이드 Hybrid",
            "ENGINE": "Gasoline 2.5 Turbo Hybrid",
            "FUEL_ECONOMY": "14.1 km/L",
            "MAX_POWER": "334 PS (system)",
            "MAX_TORQUE": "36.0 kgf·m (engine)"
          },
          {
            "id": "IONIQ_9",
            "name": "아이오닉 9",
            "ENGINE": "Dual electric motor (Performance AWD)",
            "FUEL_ECONOMY": "4.1 km/kWh",
            "MAX_POWER": "315 kW (428 PS)",
            "MAX_TORQUE": "700 Nm (71.4 kgf·m)"
          }
        ],
        "id": "DCACDVG",
        "title": "아웃도어 라이프_차콕",
        "description": "차에서~ 콕! 다양한 용품을 싣고 떠나는 힐링 드라이브! 김포 한강 오토캠핑장에서 특별한 경험과 감성 가득한 추억을 만들어 보세요.",
        "duration": "210분",
        "price": 35000,
        "schedule": "금·토·일 10:00 / 13:00",
        "distance": "33.1Km",
        "course": "도심 + 캠핑장",
        "driver": "고객",
        "vehicleNames": "팰리세이드 Hybrid, 아이오닉 9",
        "image": "/images/reservation/drives/goyang-DCACDVG.png",
        "source": "https://motorstudio.hyundai.com/goyang/cotn/exp/tsrdPgm.do?strgCd=01",
        "courses": [
          {
            "image": "/images/reservation/drives/courses/goyang-DCACDVG-0.png",
            "caption": "코스 : 도심 + 캠핑장 / 거리 : 33.1km / 210분",
            "source": "https://motorstudio.hyundai.com/goyang/cotn/exp/tsrdCoursePop.do?inputPgmNo=DCACDVG"
          }
        ]
      },
      {
        "location": "하남",
        "vehicles": [
          {
            "id": "SANTA_FE_HYBRID",
            "name": "싼타페 Hybrid",
            "ENGINE": "Gasoline 1.6 Turbo Hybrid",
            "FUEL_ECONOMY": "15.5 km/L",
            "MAX_POWER": "235 PS (system)",
            "MAX_TORQUE": "27.0 kgf·m (engine)"
          },
          {
            "id": "PALISADE",
            "name": "팰리세이드",
            "ENGINE": "Gasoline 2.5 Turbo",
            "FUEL_ECONOMY": "9.7 km/L",
            "MAX_POWER": "281 PS",
            "MAX_TORQUE": "43.0 kgf·m"
          },
          {
            "id": "PALISADE_HYBRID",
            "name": "팰리세이드 Hybrid",
            "ENGINE": "Gasoline 2.5 Turbo Hybrid",
            "FUEL_ECONOMY": "14.1 km/L",
            "MAX_POWER": "334 PS (system)",
            "MAX_TORQUE": "36.0 kgf·m (engine)"
          },
          {
            "id": "IONIQ_9",
            "name": "아이오닉 9",
            "ENGINE": "Dual electric motor (Performance AWD)",
            "FUEL_ECONOMY": "4.1 km/kWh",
            "MAX_POWER": "315 kW (428 PS)",
            "MAX_TORQUE": "700 Nm (71.4 kgf·m)"
          }
        ],
        "id": "DCACDVH",
        "title": "아웃도어 라이프_차콕",
        "description": "차에서 콕! 안전하게 즐기는 힐링 드라이브, 감성충만한 특별한 추억을 만들어보세요.",
        "duration": "240분",
        "price": 25000,
        "schedule": "일요일 14:00",
        "distance": "11Km",
        "course": "아웃도어 라이프_차콕 코스",
        "driver": "고객",
        "vehicleNames": "싼타페 Hybrid, 팰리세이드, 팰리세이드 Hybrid, 아이오닉 9",
        "image": "/images/reservation/drives/hanam-DCACDVH.png",
        "source": "https://motorstudio.hyundai.com/hanam/cotn/exp/tsrdPgm.do?strgCd=03",
        "courses": [
          {
            "image": "/images/reservation/drives/courses/hanam-DCACDVH-0.jpg",
            "caption": "코스 : 아웃도어 라이프_차콕 코스 / 거리 : 11km / 240분",
            "source": "https://motorstudio.hyundai.com/hanam/cotn/exp/tsrdCoursePop.do?inputPgmNo=DCACDVH"
          }
        ]
      }
    ]
  },
  {
    "driveType": "아웃도어 라이프_데이트립 드라이브",
    "locations": [
      {
        "location": "고양",
        "vehicles": [
          {
            "id": "G90_BLACK",
            "name": "G90 BLACK",
            "ENGINE": "Gasoline 3.5 Turbo 48V e-S/C AWD",
            "FUEL_ECONOMY": "8.2 km/L",
            "MAX_POWER": "415 PS",
            "MAX_TORQUE": "56.0 kgf·m"
          },
          {
            "id": "G80_BLACK",
            "name": "G80 BLACK",
            "ENGINE": "Gasoline 3.5 Turbo AWD",
            "FUEL_ECONOMY": "8.3 km/L",
            "MAX_POWER": "380 PS",
            "MAX_TORQUE": "54.0 kgf·m"
          },
          {
            "id": "G70",
            "name": "G70",
            "ENGINE": "Gasoline 3.3 Turbo AWD",
            "FUEL_ECONOMY": "8.8 km/L",
            "MAX_POWER": "370 PS",
            "MAX_TORQUE": "52.0 kgf·m"
          },
          {
            "id": "GV80",
            "name": "GV80",
            "ENGINE": "Gasoline 3.5 Turbo AWD",
            "FUEL_ECONOMY": "8.6 km/L",
            "MAX_POWER": "380 PS",
            "MAX_TORQUE": "54.0 kgf·m"
          },
          {
            "id": "GV80_COUPE",
            "name": "GV80 COUPE",
            "ENGINE": "Gasoline 3.5 Turbo 48V e-S/C AWD",
            "FUEL_ECONOMY": "8.2 km/L",
            "MAX_POWER": "415 PS",
            "MAX_TORQUE": "56.0 kgf·m"
          },
          {
            "id": "GV70",
            "name": "GV70",
            "ENGINE": "Gasoline 3.5 Turbo AWD",
            "FUEL_ECONOMY": "8.5 km/L",
            "MAX_POWER": "380 PS",
            "MAX_TORQUE": "54.0 kgf·m"
          },
          {
            "id": "ELECTRIFIED_GV70",
            "name": "ELECTRIFIED GV70",
            "ENGINE": "Dual electric motor (AWD)",
            "FUEL_ECONOMY": "4.6 km/kWh",
            "MAX_POWER": "360 kW (490 PS, Boost)",
            "MAX_TORQUE": "700 Nm (71.4 kgf·m)"
          },
          {
            "id": "GV60",
            "name": "GV60",
            "ENGINE": "Dual electric motor (Performance AWD)",
            "FUEL_ECONOMY": "4.1 km/kWh",
            "MAX_POWER": "360 kW (490 PS, Boost)",
            "MAX_TORQUE": "700 Nm (71.4 kgf·m)"
          },
          {
            "id": "SONATA_EDGE",
            "name": "쏘나타 디 엣지",
            "ENGINE": "Gasoline 2.5 Turbo",
            "FUEL_ECONOMY": "11.1 km/L",
            "MAX_POWER": "290 PS",
            "MAX_TORQUE": "43.0 kgf·m"
          },
          {
            "id": "SONATA_HYBRID",
            "name": "쏘나타 Hybrid",
            "ENGINE": "Gasoline 2.0 GDi Hybrid",
            "FUEL_ECONOMY": "19.4 km/L",
            "MAX_POWER": "195 PS (system)",
            "MAX_TORQUE": "19.2 kgf·m (engine)"
          },
          {
            "id": "PALISADE",
            "name": "팰리세이드",
            "ENGINE": "Gasoline 2.5 Turbo",
            "FUEL_ECONOMY": "9.7 km/L",
            "MAX_POWER": "281 PS",
            "MAX_TORQUE": "43.0 kgf·m"
          },
          {
            "id": "PALISADE_HYBRID",
            "name": "팰리세이드 Hybrid",
            "ENGINE": "Gasoline 2.5 Turbo Hybrid",
            "FUEL_ECONOMY": "14.1 km/L",
            "MAX_POWER": "334 PS (system)",
            "MAX_TORQUE": "36.0 kgf·m (engine)"
          },
          {
            "id": "SANTA_FE",
            "name": "싼타페",
            "ENGINE": "Gasoline 2.5 Turbo",
            "FUEL_ECONOMY": "11.0 km/L",
            "MAX_POWER": "281 PS",
            "MAX_TORQUE": "43.0 kgf·m"
          },
          {
            "id": "SANTA_FE_HYBRID",
            "name": "싼타페 Hybrid",
            "ENGINE": "Gasoline 1.6 Turbo Hybrid",
            "FUEL_ECONOMY": "15.5 km/L",
            "MAX_POWER": "235 PS (system)",
            "MAX_TORQUE": "27.0 kgf·m (engine)"
          },
          {
            "id": "TUCSON",
            "name": "투싼",
            "ENGINE": "Gasoline 1.6 Turbo",
            "FUEL_ECONOMY": "12.5 km/L",
            "MAX_POWER": "180 PS",
            "MAX_TORQUE": "27.0 kgf·m"
          },
          {
            "id": "TUCSON_HYBRID",
            "name": "투싼 Hybrid",
            "ENGINE": "Gasoline 1.6 Turbo Hybrid",
            "FUEL_ECONOMY": "16.2 km/L",
            "MAX_POWER": "235 PS (system)",
            "MAX_TORQUE": "27.0 kgf·m (engine)"
          },
          {
            "id": "KONA",
            "name": "코나 N Line",
            "ENGINE": "Gasoline 1.6 Turbo",
            "FUEL_ECONOMY": "13.0 km/L",
            "MAX_POWER": "198 PS",
            "MAX_TORQUE": "27.0 kgf·m"
          },
          {
            "id": "CASPER",
            "name": "캐스퍼",
            "ENGINE": "Gasoline 1.0 Turbo",
            "FUEL_ECONOMY": "12.8 km/L",
            "MAX_POWER": "100 PS",
            "MAX_TORQUE": "17.5 kgf·m"
          },
          {
            "id": "CASPER_ELECTRIC",
            "name": "캐스퍼 Electric Cross",
            "ENGINE": "Electric motor",
            "FUEL_ECONOMY": "5.6 km/kWh",
            "MAX_POWER": "84.5 kW (115 PS)",
            "MAX_TORQUE": "147 Nm (15.0 kgf·m)"
          },
          {
            "id": "STARIA_LIMOUSINE_EV",
            "name": "스타리아 리무진 Electric",
            "ENGINE": "Electric motor",
            "FUEL_ECONOMY": "공식 인증값 확인 필요",
            "MAX_POWER": "공식 최종 제원 확인 필요",
            "MAX_TORQUE": "공식 최종 제원 확인 필요"
          },
          {
            "id": "IONIQ_5",
            "name": "아이오닉 5",
            "ENGINE": "Dual electric motor (AWD)",
            "FUEL_ECONOMY": "4.8 km/kWh",
            "MAX_POWER": "239 kW (325 PS)",
            "MAX_TORQUE": "605 Nm (61.7 kgf·m)"
          },
          {
            "id": "IONIQ_6",
            "name": "아이오닉 6",
            "ENGINE": "Dual electric motor (AWD)",
            "FUEL_ECONOMY": "5.5 km/kWh",
            "MAX_POWER": "239 kW (325 PS)",
            "MAX_TORQUE": "605 Nm (61.7 kgf·m)"
          },
          {
            "id": "IONIQ_9",
            "name": "아이오닉 9",
            "ENGINE": "Dual electric motor (Performance AWD)",
            "FUEL_ECONOMY": "4.1 km/kWh",
            "MAX_POWER": "315 kW (428 PS)",
            "MAX_TORQUE": "700 Nm (71.4 kgf·m)"
          },
          {
            "id": "KONA_ELECTRIC",
            "name": "코나 Electric",
            "ENGINE": "Electric motor",
            "FUEL_ECONOMY": "5.5 km/kWh",
            "MAX_POWER": "150 kW (204 PS)",
            "MAX_TORQUE": "255 Nm (26.0 kgf·m)"
          }
        ],
        "id": "DFUDDRV",
        "title": "아웃도어 라이프_데이트립 드라이브",
        "description": "넉넉한 시간, 자유로운 코스. 언택트 데이트립 드라이브로 더욱더 자세히 차량을 체험해 보세요.",
        "duration": "180분",
        "price": 0,
        "schedule": "화·수·목 11:00",
        "distance": "자율코스",
        "course": "자율코스",
        "driver": "고객",
        "vehicleNames": "G90 BLACK, G80 BLACK, G70, GV80, GV80 COUPE, GV70, ELECTRIFIED GV70, GV60, 쏘나타 디 엣지, 쏘나타 Hybrid, 팰리세이드, 팰리세이드 Hybrid, 싼타페, 싼타페 Hybrid, 투싼, 투싼 Hybrid, 코나 N Line, 캐스퍼, 캐스퍼 Electric Cross, 스타리아 리무진 Electric, 아이오닉 5, 아이오닉 6, 아이오닉 9, 코나 Electric",
        "image": "/images/reservation/drives/goyang-DFUDDRV.png",
        "source": "https://motorstudio.hyundai.com/goyang/cotn/exp/tsrdPgm.do?strgCd=01",
        "courses": [
          {
            "image": "/images/reservation/drives/courses/goyang-DFUDDRV-0.png",
            "caption": "코스 : 자율코스 / 거리 : 자율주행 / 180분",
            "source": "https://motorstudio.hyundai.com/goyang/cotn/exp/tsrdCoursePop.do?inputPgmNo=DFUDDRV"
          }
        ]
      },
      {
        "location": "하남",
        "vehicles": [
          {
            "id": "CASPER_ELECTRIC",
            "name": "캐스퍼 Electric Cross",
            "ENGINE": "Electric motor",
            "FUEL_ECONOMY": "5.6 km/kWh",
            "MAX_POWER": "84.5 kW (115 PS)",
            "MAX_TORQUE": "147 Nm (15.0 kgf·m)"
          },
          {
            "id": "IONIQ_5",
            "name": "아이오닉 5",
            "ENGINE": "Dual electric motor (AWD)",
            "FUEL_ECONOMY": "4.8 km/kWh",
            "MAX_POWER": "239 kW (325 PS)",
            "MAX_TORQUE": "605 Nm (61.7 kgf·m)"
          },
          {
            "id": "IONIQ_6",
            "name": "아이오닉 6",
            "ENGINE": "Dual electric motor (AWD)",
            "FUEL_ECONOMY": "5.5 km/kWh",
            "MAX_POWER": "239 kW (325 PS)",
            "MAX_TORQUE": "605 Nm (61.7 kgf·m)"
          },
          {
            "id": "KONA",
            "name": "코나",
            "ENGINE": "Gasoline 1.6 Turbo",
            "FUEL_ECONOMY": "13.0 km/L",
            "MAX_POWER": "198 PS",
            "MAX_TORQUE": "27.0 kgf·m"
          },
          {
            "id": "SANTA_FE_HYBRID",
            "name": "싼타페 Hybrid",
            "ENGINE": "Gasoline 1.6 Turbo Hybrid",
            "FUEL_ECONOMY": "15.5 km/L",
            "MAX_POWER": "235 PS (system)",
            "MAX_TORQUE": "27.0 kgf·m (engine)"
          },
          {
            "id": "PALISADE",
            "name": "팰리세이드",
            "ENGINE": "Gasoline 2.5 Turbo",
            "FUEL_ECONOMY": "9.7 km/L",
            "MAX_POWER": "281 PS",
            "MAX_TORQUE": "43.0 kgf·m"
          }
        ],
        "id": "DFANWEK",
        "title": "아웃도어 라이프_데이트립 드라이브",
        "description": "넉넉한 시간, 자유로운 코스. 언택트 데이트립 드라이브로 더욱더 자세히 차량을 체험해 보세요.",
        "duration": "180분",
        "price": 0,
        "schedule": "월,화,목,금,토 11:30, 14:00",
        "distance": "자율코스",
        "course": "자율코스",
        "driver": "고객",
        "vehicleNames": "캐스퍼 Electric Cross, 아이오닉 5, 아이오닉 6, 코나, 싼타페 Hybrid, 팰리세이드",
        "image": "/images/reservation/drives/hanam-DFANWEK.png",
        "source": "https://motorstudio.hyundai.com/hanam/cotn/exp/tsrdPgm.do?strgCd=03",
        "courses": [
          {
            "image": "/images/reservation/drives/courses/hanam-DFANWEK-0.png",
            "caption": "코스 : 자율코스 / 거리 : 자율주행 / 180분",
            "source": "https://motorstudio.hyundai.com/hanam/cotn/exp/tsrdCoursePop.do?inputPgmNo=DFANWEK"
          }
        ]
      }
    ]
  },
  {
    "driveType": "컴-페어 드라이브",
    "locations": [
      {
        "location": "고양",
        "vehicles": [
          {
            "id": "GV80__GV80_COUPE",
            "imageId": "GV80",
            "name": "GV80 / GV80 COUPE",
            "note": "두 차량을 번갈아 시승하는 프로그램입니다."
          },
          {
            "id": "IONIQ_5__IONIQ_6",
            "imageId": "IONIQ_5",
            "name": "아이오닉 5 / 아이오닉 6",
            "note": "두 차량을 번갈아 시승하는 프로그램입니다."
          },
          {
            "id": "GRANDEUR__SONATA_EDGE",
            "imageId": "GRANDEUR",
            "name": "그랜저 / 쏘나타",
            "note": "두 차량을 번갈아 시승하는 프로그램입니다."
          },
          {
            "id": "SANTA_FE__PALISADE",
            "imageId": "SANTA_FE",
            "name": "싼타페 / 팰리세이드",
            "note": "두 차량을 번갈아 시승하는 프로그램입니다."
          }
        ],
        "id": "DFCPDRV",
        "title": "컴-페어 드라이브",
        "description": "비교 가능한 시승 체험, 컴페어 드라이브. 가족, 친구와 함께 두 대를 시승해보고 차이를 느껴보세요.",
        "duration": "90분",
        "price": 0,
        "schedule": "토·일 10:00",
        "distance": "44Km",
        "course": "도심 + 자동차 전용도로",
        "driver": "고객 2인",
        "vehicleNames": "GV80/GV80 COUPE, 아이오닉 5/아이오닉 6, 그랜저/쏘나타, 싼타페/팰리세이드",
        "image": "/images/reservation/drives/goyang-DFCPDRV.png",
        "source": "https://motorstudio.hyundai.com/goyang/cotn/exp/tsrdPgm.do?strgCd=01",
        "courses": [
          {
            "image": "/images/reservation/drives/courses/goyang-DFCPDRV-0.jpg",
            "caption": "코스 : 도심 + 자동차 전용도로 / 거리 : 44km / 90분",
            "source": "https://motorstudio.hyundai.com/goyang/cotn/exp/tsrdCoursePop.do?inputPgmNo=DFCPDRV"
          }
        ]
      }
    ]
  },
  {
    "driveType": "헤리티지 드라이브",
    "locations": [
      {
        "location": "고양",
        "vehicles": [
          {
            "id": "HERITAGE",
            "name": "헤리티지 차량",
            "ENGINE": null,
            "FUEL_ECONOMY": null,
            "MAX_POWER": null,
            "MAX_TORQUE": null,
            "note": "그랜저, 스쿠프, 포니2, 갤로퍼"
          }
        ],
        "id": "DFHGDRV",
        "title": "헤리티지 드라이브",
        "description": "한 시대를 풍미한 현대자동차의 클래식카 시승을 통해 그 때 그 시절의 레트로 감성을 느껴보세요.",
        "duration": "20분",
        "price": 0,
        "schedule": "토 15:00",
        "distance": "4.6Km",
        "course": "도심 + 헤리티지 체험",
        "driver": "구루",
        "vehicleNames": "그랜저, 스쿠프, 포니2, 갤로퍼",
        "image": "/images/reservation/drives/goyang-DFHGDRV.png",
        "source": "https://motorstudio.hyundai.com/goyang/cotn/exp/tsrdPgm.do?strgCd=01",
        "courses": [
          {
            "image": "/images/reservation/drives/courses/goyang-DFHGDRV-0.jpg",
            "caption": "코스 : 도심 + 헤리티지 체험 / 거리 : 4.6km / 20분",
            "source": "https://motorstudio.hyundai.com/goyang/cotn/exp/tsrdCoursePop.do?inputPgmNo=DFHGDRV"
          }
        ]
      },
      {
        "location": "서울",
        "vehicles": [
          {
            "id": "HERITAGE",
            "name": "헤리티지 차량",
            "ENGINE": null,
            "FUEL_ECONOMY": null,
            "MAX_POWER": null,
            "MAX_TORQUE": null,
            "note": "포니2, 다이너스티, 그랜저"
          }
        ],
        "id": "DFHSDRV",
        "title": "헤리티지 드라이브",
        "description": "한 시대를 풍미한 현대자동차의 클래식카 시승을 통해 그 때 그 시절의 레트로 감성을 느껴보세요.",
        "duration": "30분",
        "price": 0,
        "schedule": "화/목/금 11:00, 월~금 15:00",
        "distance": "3.2Km, 3.8Km",
        "course": "도심 + 헤리티지 체험",
        "driver": "구루",
        "vehicleNames": "포니2, 다이너스티, 그랜저",
        "image": "/images/reservation/drives/seoul-DFHSDRV.png",
        "source": "https://motorstudio.hyundai.com/seoul/cotn/exp/tsrdPgm.do?strgCd=02",
        "courses": [
          {
            "image": "/images/reservation/drives/courses/seoul-DFHSDRV-0.jpg",
            "caption": "코스 : 도심 + 헤리티지 체험 / 거리 : 3.8km / 30분",
            "source": "https://motorstudio.hyundai.com/seoul/cotn/exp/tsrdCoursePop.do?inputPgmNo=DFHSDRV"
          },
          {
            "image": "/images/reservation/drives/courses/seoul-DFHSDRV-1.jpg",
            "caption": "코스 : 도심 + 헤리티지 체험 / 거리 : 3.2km / 25분",
            "source": "https://motorstudio.hyundai.com/seoul/cotn/exp/tsrdCoursePop.do?inputPgmNo=DFHSDRV"
          }
        ]
      }
    ]
  },
  {
    "driveType": "베이직 드라이브_장거리 시승",
    "locations": [
      {
        "location": "서울",
        "vehicles": [
          {
            "id": "IONIQ_9",
            "name": "아이오닉 9",
            "ENGINE": "Dual electric motor (Performance AWD)",
            "FUEL_ECONOMY": "4.1 km/kWh",
            "MAX_POWER": "315 kW (428 PS)",
            "MAX_TORQUE": "700 Nm (71.4 kgf·m)"
          },
          {
            "id": "IONIQ_5",
            "name": "아이오닉 5",
            "ENGINE": "Dual electric motor (AWD)",
            "FUEL_ECONOMY": "4.8 km/kWh",
            "MAX_POWER": "239 kW (325 PS)",
            "MAX_TORQUE": "605 Nm (61.7 kgf·m)"
          },
          {
            "id": "PALISADE_HYBRID",
            "name": "팰리세이드 Hybrid",
            "ENGINE": "Gasoline 2.5 Turbo Hybrid",
            "FUEL_ECONOMY": "14.1 km/L",
            "MAX_POWER": "334 PS (system)",
            "MAX_TORQUE": "36.0 kgf·m (engine)"
          },
          {
            "id": "KONA",
            "name": "코나",
            "ENGINE": "Gasoline 1.6 Turbo",
            "FUEL_ECONOMY": "13.0 km/L",
            "MAX_POWER": "198 PS",
            "MAX_TORQUE": "27.0 kgf·m"
          },
          {
            "id": "GRANDEUR",
            "name": "더 뉴 그랜저",
            "ENGINE": "Gasoline 3.5 GDi",
            "FUEL_ECONOMY": "10.4 km/L",
            "MAX_POWER": "300 PS",
            "MAX_TORQUE": "36.6 kgf·m"
          },
          {
            "id": "AVANTE",
            "name": "아반떼",
            "ENGINE": "Gasoline 1.6",
            "FUEL_ECONOMY": "15.3 km/L",
            "MAX_POWER": "123 PS",
            "MAX_TORQUE": "15.7 kgf·m"
          },
          {
            "id": "G90_BLACK",
            "name": "G90 LWB BLACK",
            "ENGINE": "Gasoline 3.5 Turbo 48V e-S/C AWD",
            "FUEL_ECONOMY": "8.2 km/L",
            "MAX_POWER": "415 PS",
            "MAX_TORQUE": "56.0 kgf·m"
          },
          {
            "id": "G80_BLACK",
            "name": "G80 BLACK",
            "ENGINE": "Gasoline 3.5 Turbo AWD",
            "FUEL_ECONOMY": "8.3 km/L",
            "MAX_POWER": "380 PS",
            "MAX_TORQUE": "54.0 kgf·m"
          },
          {
            "id": "GV80",
            "name": "GV80",
            "ENGINE": "Gasoline 3.5 Turbo AWD",
            "FUEL_ECONOMY": "8.6 km/L",
            "MAX_POWER": "380 PS",
            "MAX_TORQUE": "54.0 kgf·m"
          },
          {
            "id": "GV70",
            "name": "GV70",
            "ENGINE": "Gasoline 3.5 Turbo AWD",
            "FUEL_ECONOMY": "8.5 km/L",
            "MAX_POWER": "380 PS",
            "MAX_TORQUE": "54.0 kgf·m"
          }
        ],
        "id": "DFANVEX",
        "title": "베이직 드라이브_장거리 시승",
        "description": "자동차 전문가 Guru의 친절한 설명과 함께 현대자동차의 신차를, 보다 긴 시간 동안 현대모터스튜디오에서 경험해보세요!",
        "duration": "40분",
        "price": 0,
        "schedule": "월~일요일 10:00, 13:00",
        "distance": "8.7Km",
        "course": "장거리 시승 코스",
        "driver": "고객",
        "vehicleNames": "아이오닉 9, 아이오닉 5, 팰리세이드 Hybrid, 코나, 더 뉴 그랜저, 아반떼, G90 LWB BLACK, G80 BLACK, GV80, GV70",
        "image": "/images/reservation/drives/seoul-DFANVEX.png",
        "source": "https://motorstudio.hyundai.com/seoul/cotn/exp/tsrdPgm.do?strgCd=02",
        "courses": [
          {
            "image": "/images/reservation/drives/courses/seoul-DFANVEX-0.jpg",
            "caption": "코스 : 장거리 시승 코스 / 거리 : 8.7km / 40분",
            "source": "https://motorstudio.hyundai.com/seoul/cotn/exp/tsrdCoursePop.do?inputPgmNo=DFANVEX"
          }
        ]
      }
    ]
  },
  {
    "driveType": "베이직 드라이브_언택트_장거리 시승",
    "locations": [
      {
        "location": "서울",
        "vehicles": [
          {
            "id": "IONIQ_9",
            "name": "아이오닉 9",
            "ENGINE": "Dual electric motor (Performance AWD)",
            "FUEL_ECONOMY": "4.1 km/kWh",
            "MAX_POWER": "315 kW (428 PS)",
            "MAX_TORQUE": "700 Nm (71.4 kgf·m)"
          },
          {
            "id": "IONIQ_5",
            "name": "아이오닉 5",
            "ENGINE": "Dual electric motor (AWD)",
            "FUEL_ECONOMY": "4.8 km/kWh",
            "MAX_POWER": "239 kW (325 PS)",
            "MAX_TORQUE": "605 Nm (61.7 kgf·m)"
          },
          {
            "id": "PALISADE_HYBRID",
            "name": "팰리세이드 Hybrid",
            "ENGINE": "Gasoline 2.5 Turbo Hybrid",
            "FUEL_ECONOMY": "14.1 km/L",
            "MAX_POWER": "334 PS (system)",
            "MAX_TORQUE": "36.0 kgf·m (engine)"
          },
          {
            "id": "KONA",
            "name": "코나",
            "ENGINE": "Gasoline 1.6 Turbo",
            "FUEL_ECONOMY": "13.0 km/L",
            "MAX_POWER": "198 PS",
            "MAX_TORQUE": "27.0 kgf·m"
          },
          {
            "id": "GRANDEUR",
            "name": "더 뉴 그랜저",
            "ENGINE": "Gasoline 3.5 GDi",
            "FUEL_ECONOMY": "10.4 km/L",
            "MAX_POWER": "300 PS",
            "MAX_TORQUE": "36.6 kgf·m"
          },
          {
            "id": "AVANTE",
            "name": "아반떼",
            "ENGINE": "Gasoline 1.6",
            "FUEL_ECONOMY": "15.3 km/L",
            "MAX_POWER": "123 PS",
            "MAX_TORQUE": "15.7 kgf·m"
          },
          {
            "id": "G90_BLACK",
            "name": "G90 LWB BLACK",
            "ENGINE": "Gasoline 3.5 Turbo 48V e-S/C AWD",
            "FUEL_ECONOMY": "8.2 km/L",
            "MAX_POWER": "415 PS",
            "MAX_TORQUE": "56.0 kgf·m"
          },
          {
            "id": "G80_BLACK",
            "name": "G80 BLACK",
            "ENGINE": "Gasoline 3.5 Turbo AWD",
            "FUEL_ECONOMY": "8.3 km/L",
            "MAX_POWER": "380 PS",
            "MAX_TORQUE": "54.0 kgf·m"
          },
          {
            "id": "GV80",
            "name": "GV80",
            "ENGINE": "Gasoline 3.5 Turbo AWD",
            "FUEL_ECONOMY": "8.6 km/L",
            "MAX_POWER": "380 PS",
            "MAX_TORQUE": "54.0 kgf·m"
          },
          {
            "id": "GV70",
            "name": "GV70",
            "ENGINE": "Gasoline 3.5 Turbo AWD",
            "FUEL_ECONOMY": "8.5 km/L",
            "MAX_POWER": "380 PS",
            "MAX_TORQUE": "54.0 kgf·m"
          }
        ],
        "id": "DFWFDER",
        "title": "베이직 드라이브_언택트_장거리 시승",
        "description": "혼자 또는 사랑하는 가족, 지인들과 함께 차량에 보다 긴 시간 동안 차량에 집중하고 싶으시다면, ‘베이직 드라이브 언택트 장거리 시승’ 프로그램을 이용해보세요.",
        "duration": "40분",
        "price": 0,
        "schedule": "월~일요일 10:00, 13:00",
        "distance": "8.7Km",
        "course": "장거리 시승 코스",
        "driver": "고객",
        "vehicleNames": "아이오닉 9, 아이오닉 5, 팰리세이드 Hybrid, 코나, 더 뉴 그랜저, 아반떼, G90 LWB BLACK, G80 BLACK, GV80, GV70",
        "image": "/images/reservation/drives/seoul-DFWFDER.jpg",
        "source": "https://motorstudio.hyundai.com/seoul/cotn/exp/tsrdPgm.do?strgCd=02",
        "courses": [
          {
            "image": "/images/reservation/drives/courses/seoul-DFWFDER-0.jpg",
            "caption": "코스 : 장거리 시승 코스 / 거리 : 8.7km / 40분",
            "source": "https://motorstudio.hyundai.com/seoul/cotn/exp/tsrdCoursePop.do?inputPgmNo=DFWFDER"
          }
        ]
      }
    ]
  },
  {
    "driveType": "시티 나이트 드라이브",
    "locations": [
      {
        "location": "서울",
        "vehicles": [
          {
            "id": "IONIQ_9",
            "name": "아이오닉 9",
            "ENGINE": "Dual electric motor (Performance AWD)",
            "FUEL_ECONOMY": "4.1 km/kWh",
            "MAX_POWER": "315 kW (428 PS)",
            "MAX_TORQUE": "700 Nm (71.4 kgf·m)"
          },
          {
            "id": "IONIQ_5",
            "name": "아이오닉 5",
            "ENGINE": "Dual electric motor (AWD)",
            "FUEL_ECONOMY": "4.8 km/kWh",
            "MAX_POWER": "239 kW (325 PS)",
            "MAX_TORQUE": "605 Nm (61.7 kgf·m)"
          },
          {
            "id": "PALISADE_HYBRID",
            "name": "팰리세이드 Hybrid",
            "ENGINE": "Gasoline 2.5 Turbo Hybrid",
            "FUEL_ECONOMY": "14.1 km/L",
            "MAX_POWER": "334 PS (system)",
            "MAX_TORQUE": "36.0 kgf·m (engine)"
          },
          {
            "id": "KONA",
            "name": "코나",
            "ENGINE": "Gasoline 1.6 Turbo",
            "FUEL_ECONOMY": "13.0 km/L",
            "MAX_POWER": "198 PS",
            "MAX_TORQUE": "27.0 kgf·m"
          },
          {
            "id": "GRANDEUR",
            "name": "더 뉴 그랜저",
            "ENGINE": "Gasoline 3.5 GDi",
            "FUEL_ECONOMY": "10.4 km/L",
            "MAX_POWER": "300 PS",
            "MAX_TORQUE": "36.6 kgf·m"
          },
          {
            "id": "AVANTE",
            "name": "아반떼",
            "ENGINE": "Gasoline 1.6",
            "FUEL_ECONOMY": "15.3 km/L",
            "MAX_POWER": "123 PS",
            "MAX_TORQUE": "15.7 kgf·m"
          },
          {
            "id": "G90_BLACK",
            "name": "G90 LWB BLACK",
            "ENGINE": "Gasoline 3.5 Turbo 48V e-S/C AWD",
            "FUEL_ECONOMY": "8.2 km/L",
            "MAX_POWER": "415 PS",
            "MAX_TORQUE": "56.0 kgf·m"
          },
          {
            "id": "G80_BLACK",
            "name": "G80 BLACK",
            "ENGINE": "Gasoline 3.5 Turbo AWD",
            "FUEL_ECONOMY": "8.3 km/L",
            "MAX_POWER": "380 PS",
            "MAX_TORQUE": "54.0 kgf·m"
          },
          {
            "id": "GV80",
            "name": "GV80",
            "ENGINE": "Gasoline 3.5 Turbo AWD",
            "FUEL_ECONOMY": "8.6 km/L",
            "MAX_POWER": "380 PS",
            "MAX_TORQUE": "54.0 kgf·m"
          },
          {
            "id": "GV70",
            "name": "GV70",
            "ENGINE": "Gasoline 3.5 Turbo AWD",
            "FUEL_ECONOMY": "8.5 km/L",
            "MAX_POWER": "380 PS",
            "MAX_TORQUE": "54.0 kgf·m"
          }
        ],
        "id": "FDCNDRV",
        "title": "시티 나이트 드라이브",
        "description": "평일 퇴근 후 직장인을 위한 시티 나이트 드라이브, 낭만 가득한 특별한 추억을 만들어 보세요!",
        "duration": "110분",
        "price": 0,
        "schedule": "화·목 19:00",
        "distance": "12Km",
        "course": "도심 + 시티 나이트 체험",
        "driver": "고객",
        "vehicleNames": "아이오닉 9, 아이오닉 5, 팰리세이드 Hybrid, 코나, 더 뉴 그랜저, 아반떼, G90 LWB BLACK, G80 BLACK, GV80, GV70",
        "image": "/images/reservation/drives/seoul-FDCNDRV.png",
        "source": "https://motorstudio.hyundai.com/seoul/cotn/exp/tsrdPgm.do?strgCd=02",
        "courses": [
          {
            "image": "/images/reservation/drives/courses/seoul-FDCNDRV-0.png",
            "caption": "코스 : 도심 + 시티 나이트 체험 / 거리 : 12km / 110분",
            "source": "https://motorstudio.hyundai.com/seoul/cotn/exp/tsrdCoursePop.do?inputPgmNo=FDCNDRV"
          }
        ]
      }
    ]
  },
  {
    "driveType": "N 드라이브_언택트",
    "locations": [
      {
        "location": "하남",
        "vehicles": [
          {
            "id": "IONIQ_5_N",
            "name": "아이오닉 5 N",
            "ENGINE": "Dual electric motor (AWD)",
            "FUEL_ECONOMY": "3.7 km/kWh",
            "MAX_POWER": "478 kW (650 PS, N Grin Boost)",
            "MAX_TORQUE": "770 Nm (78.5 kgf·m)"
          }
        ],
        "id": "DFNDRAV",
        "title": "N 드라이브_언택트",
        "description": "Never just drive. 고성능 N 브랜드 차량을 공공도로에서 안전하고 재미있게 체험해 보세요.",
        "duration": "90분",
        "price": 0,
        "schedule": "월~일요일 10:30, 15:00",
        "distance": "38Km",
        "course": "도심 + 자동차 전용도로",
        "driver": "고객",
        "vehicleNames": "아이오닉 5 N",
        "image": "/images/reservation/drives/hanam-DFNDRAV.png",
        "source": "https://motorstudio.hyundai.com/hanam/cotn/exp/tsrdPgm.do?strgCd=03",
        "courses": [
          {
            "image": "/images/reservation/drives/courses/hanam-DFNDRAV-0.png",
            "caption": "코스 : 도심 + 자동차 전용도로 / 거리 : 38km / 90분",
            "source": "https://motorstudio.hyundai.com/hanam/cotn/exp/tsrdCoursePop.do?inputPgmNo=DFNDRAV"
          }
        ]
      }
    ]
  },
  {
    "driveType": "아웃도어 라이프_데이트립 드라이브 라이트",
    "locations": [
      {
        "location": "하남",
        "vehicles": [
          {
            "id": "CASPER_ELECTRIC",
            "name": "캐스퍼 Electric",
            "ENGINE": "Electric motor",
            "FUEL_ECONOMY": "5.6 km/kWh",
            "MAX_POWER": "84.5 kW (115 PS)",
            "MAX_TORQUE": "147 Nm (15.0 kgf·m)"
          },
          {
            "id": "IONIQ_5",
            "name": "아이오닉 5",
            "ENGINE": "Dual electric motor (AWD)",
            "FUEL_ECONOMY": "4.8 km/kWh",
            "MAX_POWER": "239 kW (325 PS)",
            "MAX_TORQUE": "605 Nm (61.7 kgf·m)"
          },
          {
            "id": "IONIQ_6",
            "name": "아이오닉 6",
            "ENGINE": "Dual electric motor (AWD)",
            "FUEL_ECONOMY": "5.5 km/kWh",
            "MAX_POWER": "239 kW (325 PS)",
            "MAX_TORQUE": "605 Nm (61.7 kgf·m)"
          },
          {
            "id": "KONA",
            "name": "코나",
            "ENGINE": "Gasoline 1.6 Turbo",
            "FUEL_ECONOMY": "13.0 km/L",
            "MAX_POWER": "198 PS",
            "MAX_TORQUE": "27.0 kgf·m"
          },
          {
            "id": "SANTA_FE_HYBRID",
            "name": "싼타페 Hybrid",
            "ENGINE": "Gasoline 1.6 Turbo Hybrid",
            "FUEL_ECONOMY": "15.5 km/L",
            "MAX_POWER": "235 PS (system)",
            "MAX_TORQUE": "27.0 kgf·m (engine)"
          },
          {
            "id": "PALISADE",
            "name": "팰리세이드",
            "ENGINE": "Gasoline 2.5 Turbo",
            "FUEL_ECONOMY": "9.7 km/L",
            "MAX_POWER": "281 PS",
            "MAX_TORQUE": "43.0 kgf·m"
          }
        ],
        "id": "DFANWEL",
        "title": "아웃도어 라이프_데이트립 드라이브 라이트",
        "description": "효율적인 시간, 자유로운 코스. 언택트 데이트립 라이트로 더욱더 자세히 차량을 체험해 보세요.",
        "duration": "90분",
        "price": 0,
        "schedule": "수요일 11:30",
        "distance": "자율코스",
        "course": "자율코스",
        "driver": "고객",
        "vehicleNames": "캐스퍼 Electric, 아이오닉 5, 아이오닉 6, 코나, 싼타페 Hybrid, 팰리세이드",
        "image": "/images/reservation/drives/hanam-DFANWEL.png",
        "source": "https://motorstudio.hyundai.com/hanam/cotn/exp/tsrdPgm.do?strgCd=03",
        "courses": [
          {
            "image": "/images/reservation/drives/courses/hanam-DFANWEL-0.png",
            "caption": "코스 : 자율코스 / 거리 : 자율주행 / 90분",
            "source": "https://motorstudio.hyundai.com/hanam/cotn/exp/tsrdCoursePop.do?inputPgmNo=DFANWEL"
          }
        ]
      }
    ]
  }
];
