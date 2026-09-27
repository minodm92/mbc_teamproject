// 예약 상태가 확인되지 않은 항목은 undefined로 둔다. 예약 버튼 노출 여부를 추측하지 않는다.
export const experienceFinderContent = [
  {
    sourceType: 'exhibition',
    sourceId: 'vehicle-exhibition',
    category: 'vehicleExhibition',
    locationSlugs: ['goyang'],
    preferences: ['explore', 'discover'],
    reservationStatus: undefined,
    reservationRoute: undefined,
  },
  {
    sourceType: 'program',
    sourceId: 'hydrogen-energy',
    category: 'program',
    locationSlugs: ['goyang'],
    preferences: ['explore', 'discover'],
    reservationStatus: undefined,
    reservationRoute: undefined,
  },
  {
    sourceType: 'program',
    sourceId: 'design-workshop',
    category: 'program',
    locationSlugs: ['busan'],
    preferences: ['interactive', 'discover'],
    reservationStatus: undefined,
    reservationRoute: undefined,
  },
];

// sourceId는 기존 데이터 또는 예약 화면에 실제 존재하는 값이다.
// 분류, 지점, 예약 연결 중 필요한 정보가 확인되면 위 목록에 추가한다.
export const unresolvedExperienceFinderContent = [
  { sourceType: 'exhibition', sourceId: 'plastic-new-discovery', missing: ['category', 'reservationStatus'] },
  { sourceType: 'exhibition', sourceId: 'retrace-first-step', missing: ['category', 'reservationStatus'] },
  { sourceType: 'reservationProgram', sourceId: 'test-drive', missing: ['exportedSource', 'locationSlugs'] },
  { sourceType: 'reservationExhibition', sourceId: 'mini-car', missing: ['exportedSource', 'category'] },
  ...['gv80', 'ioniq-5-n', 'casper', 'g90'].map(sourceId => ({
    sourceType: 'vehicle',
    sourceId,
    missing: ['recommendationCategory', 'locationSlugs', 'reservationStatus'],
  })),
];

export const experienceTypeCategories = {
  mobility: ['vehicleExhibition', 'testDrive'],
  art: ['artExhibition'],
  experience: ['experientialExhibition'],
  program: ['program'],
};

export const experienceFinderHero = {
  default: {
    title: '나의 일상에 꼭 맞는 경험 추천',
    image: '/images/locations/goyang.svg',
  },
  mobility: {
    title: '차량을 직접 보고 운전해보고 싶어요',
    image: '/images/experience-finder/mobility.webp',
  },
  art: {
    title: '작품과 공간을 감상하고 싶어요',
    image: '/images/experience-finder/art.webp',
  },
  experience: {
    title: '몰입감 있는 전시를 직접 체험하고 싶어요',
    image: '/images/experience-finder/experience.webp',
  },
  program: {
    title: '클래스와 프로그램에 참여하고 싶어요',
    image: '/images/experience-finder/program.webp',
  },
};
