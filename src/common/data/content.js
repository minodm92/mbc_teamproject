export const locations = [
  { slug: 'goyang', name: '고양', english: 'GOYANG', tagline: '자동차와 사람이 만나는 새로운 공간', description: '다양한 차량과 모빌리티 경험을 한자리에서 만나보세요.', image: '/images/locations/goyang.svg' },
  { slug: 'seoul', name: '서울', english: 'SEOUL', tagline: '자동차 문화를 발견하는 공간', description: '자동차 문화와 취향을 공유하는 새로운 경험이 펼쳐집니다.', image: '/images/locations/seoul.svg' },
  { slug: 'hanam', name: '하남', english: 'HANAM', tagline: '일상 속에 스며드는 모빌리티', description: '차량 전시와 미디어 콘텐츠를 통해 모빌리티를 경험하세요.', image: '/images/locations/hanam.svg' },
  { slug: 'busan', name: '부산', english: 'BUSAN', tagline: '디자인과 미래를 잇는 공간', description: '디자인과 지속가능성을 새로운 시선으로 바라봅니다.', image: '/images/locations/busan.svg' },
  { slug: 'beijing', name: '베이징', english: 'BEIJING', tagline: '도시와 미래가 만나는 곳', description: '현대 모터스튜디오의 이야기를 도시의 시선으로 만나보세요.', image: '/images/locations/beijing.svg' },
  { slug: 'snow-park', name: '스노우 파크', english: 'SNOW PARK', tagline: '계절 속 특별한 드라이빙', description: '자연과 움직임이 어우러지는 모빌리티 공간입니다.', image: '/images/locations/snow-park.svg' },
];

export const vehicles = [
  { id: 'gv80', name: 'GV80', category: 'SUV', description: '모든 순간에 새로운 감각을 더하는 드라이빙 경험', image: '/images/vehicles/gv80.svg' },
  { id: 'ioniq-5-n', name: 'IONIQ 5 N', category: 'Electric', description: '전동화 시대의 새로운 퍼포먼스', image: '/images/vehicles/ioniq-5-n.svg' },
  { id: 'casper', name: 'CASPER', category: 'Compact', description: '도시의 일상과 함께 움직이는 즐거움', image: '/images/vehicles/casper.svg' },
  { id: 'g90', name: 'G90', category: 'Sedan', description: '품격 있는 이동을 위한 새로운 기준', image: '/images/vehicles/g90.svg' },
];

export const exhibitions = [
  { id: 'vehicle-exhibition', title: 'HYUNDAI MOTORSTUDIO VEHICLE EXHIBITION', subtitle: '현대자동차의 현재를 만나는 전시', location: '고양', date: '상설 전시', image: '/images/exhibitions/vehicle.svg', description: '현대자동차의 다양한 모델과 디자인을 가까이서 살펴보세요.' },
  { id: 'plastic-new-discovery', title: 'PLASTIC, A NEW DISCOVERY', subtitle: '플라스틱, 새로운 발견', location: '부산', date: '기획 전시', image: '/images/exhibitions/plastic.svg', description: '디자인과 지속가능성의 새로운 가능성을 탐구합니다.' },
  { id: 'retrace-first-step', title: 'RETRACING THE FIRST STEP', subtitle: '첫걸음을 돌아보다', location: '서울', date: '기획 전시', image: '/images/exhibitions/heritage.svg', description: '헤리티지를 통해 과거와 현재, 미래를 연결합니다.' },
];

export const programs = [
  { id: 'hydrogen-energy', title: '수소 에너지 탐험', english: 'HYDROGEN ENERGY JOURNEY', location: '고양', image: '/images/programs/hydrogen.svg', description: '수소 에너지와 미래 모빌리티를 직접 살펴보는 체험 프로그램' },
  { id: 'design-workshop', title: '모빌리티 디자인 워크숍', english: 'MOBILITY DESIGN WORKSHOP', location: '부산', image: '/images/programs/design.svg', description: '나만의 시선으로 미래 이동 경험을 상상하고 만들어보세요.' },
];

export const notices = [
  { id: 'opening', title: '현대 모터스튜디오 운영 안내', date: '2026.09.18', category: '운영', content: '방문 전 각 지점의 운영 시간과 프로그램 일정을 확인해 주세요.' },
  { id: 'reservation', title: '프로그램 예약 이용 안내', date: '2026.09.12', category: '예약', content: '프로그램 예약은 로그인 후 가능하며, 마이페이지에서 예약 내역을 확인할 수 있습니다.' },
  { id: 'exhibition', title: '새로운 전시 소식을 만나보세요', date: '2026.09.08', category: '전시', content: '현대 모터스튜디오의 새로운 전시와 이야기를 소개합니다.' },
];

export const news = [
  { id: 'seoul-story', title: 'SEOUL, REBORN FOR CAR CULTURE', subtitle: '현대 모터스튜디오 서울', description: '자동차 문화와 취향을 공유하는 새로운 공간을 만나보세요.', image: '/images/locations/seoul.svg', location: 'seoul' },
  { id: 'hanam-story', title: 'A NEW EXPERIENCE IN HANAM', subtitle: '현대 모터스튜디오 하남', description: '차량 전시와 미디어 콘텐츠가 선사하는 몰입감 있는 경험', image: '/images/locations/hanam.svg', location: 'hanam' },
  { id: 'heritage-story', title: 'RETRACING THE FIRST STEP', subtitle: '현대 모터스튜디오 서울', description: '시작과 성장을 돌아보는 헤리티지 전시', image: '/images/exhibitions/heritage.svg', location: 'seoul' },
  { id: 'plastic-story', title: 'PLASTIC, A NEW DISCOVERY', subtitle: '현대 모터스튜디오 부산', description: '디자인과 지속가능성을 바라보는 새로운 시선', image: '/images/exhibitions/plastic.svg', location: 'busan' },
];

export const profileAvatars = Array.from({ length: 6 }, (_, index) => ({
  id: `character-0${index + 1}`,
  name: ['블랙 캣', '화이트 래빗', '브라운 베어', '레드 폭스', '그레이 울프', '크림 퍼피'][index],
  src: `/images/characters/character-0${index + 1}.svg`,
}));

export const demoProducts = [
  { id: 'jacket-01', name: '오버사이즈 재킷', category: 'WOMAN', price: 129000, image: '/images/products/jacket-01.svg', colors: ['BLACK', 'BEIGE'], isNew: true },
  { id: 'pants-01', name: '와이드 팬츠', category: 'WOMAN', price: 89000, image: '/images/products/pants-01.svg', colors: ['BLACK'], isNew: false },
];
