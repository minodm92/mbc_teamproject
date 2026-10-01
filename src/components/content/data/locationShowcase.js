// Figma 1570:12976. Keep these editorial values separate from booking data.
export const locationShowcase = [
  {
    id: 'goyang', title: 'GOYANG', name: '고양',
    keywords: ['FLAGSHIP SPACE', 'TEST DRIVE', 'EXHIBITION & PROGRAM'],
    image: '/images/locations/figma/goyang.svg', background: '#ffffff', color: '#111111',
    hours: '09:00–20:00 / 매주 월요일 휴무(시설별 운영일 상이)',
    closed: '매주 월요일 휴관 / 신정, 설날·추석 당일 및 익일 휴관',
    address: '경기도 고양시 일산서구 킨텍스로 217-6', price: '성인 10,000원 / 어린이· 청소년 5,000원',
  },
  {
    id: 'seoul', title: 'SEOUL', name: '서울',
    keywords: ['BRAND SHOWCASE', 'VEHICLE DISPLAY', 'TEST DRIVE', 'CULTURE & LIFESTYLE'],
    image: '/images/locations/figma/seoul.svg', background: '#2668d3', color: '#111111',
    hours: '09:00–21:00 / 매주 월요일 휴무(시설별 운영일 상이)',
    closed: '매월 첫째 주 월요일·신정, 설날/추석 당일 및 익일 휴관',
    address: '서울특별시 강남구 언주로 738', price: '무료 관람',
  },
  {
    id: 'hanam', title: 'HANAM', name: '하남',
    keywords: ['MOBILITY EXPERIENCE', 'VEHICLE DISPLAY', 'TEST DRIVE', 'LIFESTYLE PROGRAM'],
    image: '/images/locations/figma/hanam.svg', background: '#2c5e8a', color: '#111111',
    hours: '10:00 – 22:00', closed: '연중무휴',
    address: '경기도 하남시 미사대로 750, 스타필드 하남 1층', price: '무료 관람',
  },
  {
    id: 'busan', title: 'BUSAN', name: '부산',
    keywords: ['DESIGN & CULTURE', 'ART EXHIBITION', 'CREATIVE EXPERIENCE', 'LIFESTYLE PROGRAM'],
    image: '/images/locations/figma/busan.svg', background: '#063452', color: '#ffffff',
    // User requested retaining the mockup copy. Verify address/closure before publishing.
    hours: '09:00–20:00', closed: '현재 전시 교체 준비로 임시 휴관 중',
    address: '부산광역시 수영구 구락로123번길 20 F1963', price: '무료 관람',
  },
  {
    id: 'beijing', title: 'BEIJING', name: '베이징', desktopOnly: true,
    keywords: ['CULTURE & ART', 'DESIGN EXHIBITION', 'SUSTAINABLE MOBILITY', 'CREATIVE PROGRAM'],
    image: '/images/locations/figma/beijing.svg', background: '#a8a7ac', color: '#111111',
    hours: '09:00–20:00', closed: '매월 첫 월요일 및 춘절 연휴 휴관',
    address: 'E-1, Art District 798, Beijing, China', price: '무료 관람',
  },
  {
    id: 'senayan-park', title: 'SENAYAN PARK', name: '세나얀 파크', desktopOnly: true,
    keywords: ['CREATIVE PROGRAM', 'INTERACTIVE EXPERIENCE', 'DIGITAL TECHNOLOGY', 'BRAND EXPERIENCE'],
    image: '/images/locations/figma/senayan-park.svg', background: '#363636', color: '#ffffff',
    hours: '10:00 – 22:00',
    address: 'Jl. Gerbang Pemuda No.3, Gelora, Tanah Abang,\nJakarta Pusat 10270, Indonesia (UG Floor)', price: '무료 관람',
  },
];

export const studioVehicles = [
  { id: 'g90', name: 'G90', location: '고양' },
  { id: 'gv80', name: 'GV80', location: '서울' },
  { id: 'gv70', name: 'GV70', location: '고양' },
  { id: 'santafe', name: 'SANTAFE', location: '고양' },
];

export const studioPrograms = [
  '레고와 함께하는 미래자동차 코딩 워크샵 (새싹 ver)',
  '수소전기차와 오호볼 이야기',
  '현대자동차 직업체험 워크샵 (한국어)',
  '현대자동차 직업체험 워크샵 (영어)',
];
