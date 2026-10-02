import { designNotices } from './notices';

export const locations = [
  { slug: 'goyang', name: '고양', english: 'GOYANG', tagline: '자동차와 사람이 만나는 새로운 공간', description: '다양한 차량과 모빌리티 경험을 한자리에서 만나보세요.', image: '/images/locations/goyang.svg' },
  { slug: 'seoul', name: '서울', english: 'SEOUL', tagline: '자동차 문화를 발견하는 공간', description: '자동차 문화와 취향을 공유하는 새로운 경험이 펼쳐집니다.', image: '/images/locations/seoul.svg' },
  { slug: 'hanam', name: '하남', english: 'HANAM', tagline: '일상 속에 스며드는 모빌리티', description: '차량 전시와 미디어 콘텐츠를 통해 모빌리티를 경험하세요.', image: '/images/locations/hanam.svg' },
  { slug: 'busan', name: '부산', english: 'BUSAN', tagline: '디자인과 미래를 잇는 공간', description: '디자인과 지속가능성을 새로운 시선으로 바라봅니다.', image: '/images/locations/busan.svg' },
  { slug: 'beijing', name: '베이징', english: 'BEIJING', tagline: '도시와 미래가 만나는 곳', description: '현대 모터스튜디오의 이야기를 도시의 시선으로 만나보세요.', image: '/images/locations/beijing.svg' },
  {
    slug: 'senayan-park',
    name: '스나얀 파크',
    english: 'SENAYAN PARK',
    tagline: '',
    description: '',
    keywords: ['CREATIVE PROGRAM', 'INTERACTIVE EXPERIENCE', 'DIGITAL TECHNOLOGY', 'BRAND EXPERIENCE'],
    hours: '10:00 – 22:00',
    address: 'Jl. Gerbang Pemuda No.3, Gelora, Tanah Abang,\nJakarta Pusat 10270, Indonesia (UG Floor)',
    price: '무료 관람',
    image: '/images/locations/senayan-park.svg',
  },
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
  ...designNotices,
  {
    id: 'opening', title: '현대 모터스튜디오 운영 안내', date: '2026.09.18', category: '운영',
    content: [
      { type: 'paragraph', text: '안녕하세요. 현대 모터스튜디오입니다. 방문을 계획해 주셔서 감사합니다.' },
      { type: 'paragraph', text: '각 지점은 전시와 프로그램을 통해 다양한 모빌리티 경험을 제공하고 있습니다. 지점별 운영 정보와 이용 가능한 콘텐츠가 다를 수 있으니, 방문 전에 희망 지점의 최신 안내를 확인해 주세요.' },
      { type: 'paragraph', text: '전시 및 체험 프로그램은 현장 상황이나 운영 여건에 따라 일부 내용이 변경될 수 있습니다. 원활한 관람을 위해 방문 당일 공지와 현장 안내를 함께 확인해 주시기 바랍니다.' },
      { type: 'list', items: ['방문할 지점의 운영 정보를 확인해 주세요.', '관람 또는 참여를 원하는 전시와 프로그램의 이용 가능 여부를 살펴봐 주세요.', '변경 사항이 안내된 경우 현장 직원의 안내에 따라 이용해 주세요.'] },
      { type: 'paragraph', text: '보다 편안하고 안전한 관람을 위해 방문 전 안내 사항을 확인해 주시기 바랍니다. 감사합니다.' },
    ],
  },
  {
    id: 'reservation', title: '프로그램 예약 이용 안내', date: '2026.09.12', category: '예약',
    content: [
      { type: 'paragraph', text: '안녕하세요. 현대 모터스튜디오입니다. 프로그램 이용을 위한 예약 방법을 안내드립니다.' },
      { type: 'paragraph', text: '프로그램별 예약 가능 여부와 참여 일정은 운영 상황에 따라 달라질 수 있습니다. 예약을 진행하기 전에 프로그램 상세 안내를 확인하고, 화면에 표시되는 신청 정보를 살펴봐 주세요.' },
      { type: 'list', items: ['로그인 후 원하는 프로그램의 상세 안내를 확인해 주세요.', '신청 가능한 일정과 참여 정보를 확인한 뒤 예약을 진행해 주세요.', '예약 후에는 마이페이지에서 신청 내역과 현재 상태를 확인해 주세요.', '예약 변경이나 취소가 필요한 경우 해당 프로그램에 표시된 안내를 확인해 주세요.'] },
      { type: 'paragraph', text: '프로그램 운영 내용과 신청 가능 여부는 변경될 수 있습니다. 방문 전 예약 페이지에서 최신 정보를 확인해 주시고, 현장 이용 시에는 직원의 안내를 따라 주시기 바랍니다.' },
      { type: 'paragraph', text: '감사합니다.' },
    ],
  },
  {
    id: 'exhibition', title: '새로운 전시 소식을 만나보세요', date: '2026.09.08', category: '전시',
    content: [
      { type: 'paragraph', text: '현대 모터스튜디오에서 새로운 전시와 모빌리티 이야기를 만나보세요.' },
      { type: 'paragraph', text: '전시는 자동차와 이동의 경험을 바탕으로 기술, 디자인, 문화가 연결되는 다양한 관점을 소개합니다. 공간을 둘러보며 전시 콘텐츠와 함께 오늘날의 모빌리티가 만들어 가는 변화를 살펴볼 수 있습니다.' },
      { type: 'paragraph', text: '전시 구성과 관람 가능한 콘텐츠는 지점 및 운영 시기에 따라 다를 수 있습니다. 일부 공간이나 콘텐츠는 현장 상황에 따라 이용이 제한되거나 변경될 수 있습니다.' },
      { type: 'list', items: ['방문할 지점에서 현재 진행 중인 전시 정보를 확인해 주세요.', '전시장 내 안내 문구를 참고해 각 콘텐츠를 관람해 주세요.', '관람 중에는 다른 방문객과 공간을 배려해 주시기 바랍니다.'] },
      { type: 'paragraph', text: '방문하셔서 전시 공간에서 새로운 시선과 경험을 만나보시기 바랍니다. 감사합니다.' },
    ],
  },
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
