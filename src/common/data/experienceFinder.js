// Reservation options are presented as representative exhibition experiences.
// Source titles, descriptions, and images are resolved from exhibitionReservations.
export const experienceFinderExhibitions = [
  {
    locationSlug: 'goyang',
    representativeId: 'BEPMEXB',
    memberIds: ['BEPMEXB', 'BEPMEXG'],
    category: 'experientialExhibition',
    preferences: ['interactive', 'sensory', 'explore'],
  },
  {
    locationSlug: 'goyang',
    representativeId: 'BEONRID',
    memberIds: ['BEONRID', 'BEWIRID'],
    category: 'experientialExhibition',
    preferences: ['immersive', 'interactive', 'sensory'],
  },
  {
    locationSlug: 'goyang',
    representativeId: 'GGBSTRK',
    memberIds: ['GGBSTRK', 'GGBSTRE', 'GGBSTRC', 'GGBSTRJ'],
    category: 'artExhibition',
    preferences: ['explore', 'discover'],
  },
  {
    locationSlug: 'seoul',
    representativeId: 'GGBSTSK',
    memberIds: ['GGBSTSK'],
    category: 'artExhibition',
    preferences: ['explore', 'discover'],
  },
  {
    locationSlug: 'busan',
    representativeId: 'BEBIFFS',
    memberIds: ['BEBIFFS'],
    category: 'artExhibition',
    preferences: ['immersive', 'explore', 'discover'],
  },
];

// Program recommendations use the records shown by the program reservation page.
// Language variants are grouped into one experience where the activity is the same.
export const experienceFinderPrograms = [
  { locationSlug: 'goyang', representativeId: 'KIDCM13', memberIds: ['KIDCM13'], preferences: ['interactive', 'explore', 'discover'] },
  { locationSlug: 'goyang', representativeId: 'KIDCM05', memberIds: ['KIDCM05'], preferences: ['interactive', 'sensory', 'discover'] },
  { locationSlug: 'goyang', representativeId: 'KIDCM09', memberIds: ['KIDCM09'], preferences: ['interactive', 'immersive', 'discover'] },
  { locationSlug: 'goyang', representativeId: 'KIDCM08', memberIds: ['KIDCM08'], preferences: ['interactive', 'sensory', 'discover'] },
  { locationSlug: 'goyang', representativeId: 'KIDCM07', memberIds: ['KIDCM07'], preferences: ['interactive', 'explore', 'discover'] },
  { locationSlug: 'goyang', representativeId: 'KIDCM04', memberIds: ['KIDCM04'], preferences: ['interactive', 'explore', 'discover'] },
  {
    locationSlug: 'goyang',
    representativeId: 'FWKIDKO',
    memberIds: ['FWKIDKO', 'FWKIDEN'],
    title: '현대자동차 직업체험 워크샵',
    preferences: ['interactive', 'explore', 'discover'],
  },
  { locationSlug: 'goyang', representativeId: 'FWGYRSW', memberIds: ['FWGYRSW'], preferences: ['interactive', 'immersive', 'discover'] },
  { locationSlug: 'seoul', representativeId: 'FWKDS01', memberIds: ['FWKDS01'], preferences: ['interactive', 'sensory', 'explore'] },
  { locationSlug: 'seoul', representativeId: 'FWCMMDC', memberIds: ['FWCMMDC'], preferences: ['interactive', 'sensory', 'discover'] },
  { locationSlug: 'seoul', representativeId: 'FWSOCDJ', memberIds: ['FWSOCDJ'], preferences: ['interactive', 'explore', 'discover'] },
];

// 원본 데이터에 저장되지 않은 ExperienceFinder 전용 추천 성향 메타데이터입니다.
export const experienceFinderSourcePreferences = {
  driveReservations: {
    DFPNEWD: ['interactive', 'explore', 'discover'],
    DFNDRAV: ['immersive', 'interactive', 'sensory'],
    DFHMSD: ['interactive', 'explore', 'discover'],
    DFANWEX: ['interactive', 'explore', 'discover'],
    DFSGTDV: ['interactive', 'together'],
    DFRERFR: ['interactive', 'together'],
    DFLSDRV: ['interactive', 'immersive'],
    DCACDVG: ['sensory', 'explore'],
    DCACDVH: ['sensory', 'explore'],
    DFUDDRV: ['immersive', 'explore'],
    DFANWEK: ['immersive', 'explore'],
    DFCPDRV: ['interactive', 'together'],
    DFHGDRV: ['explore', 'discover', 'sensory'],
    DFHSDRV: ['explore', 'discover', 'sensory'],
    DFANVEX: ['immersive', 'explore'],
    DFWFDER: ['immersive', 'together'],
    FDCNDRV: ['immersive', 'sensory'],
    DFANWEL: ['immersive', 'explore'],
  },
};

// ExperienceFinder presents these source records as one recommendation each.
// The reservation and calendar source records remain unchanged and available
// on their existing pages.
export const experienceFinderRecommendationGroups = [
  {
    id: 'basic-drive',
    representative: 'driveReservation:goyang:DFHMSD',
    members: [
      'driveReservation:goyang:DFHMSD',
      'driveReservation:seoul:DFANWEX',
      'driveReservation:hanam:DFANWEX',
      'driveReservation:goyang:DFSGTDV',
      'driveReservation:seoul:DFSGTDV',
      'driveReservation:hanam:DFRERFR',
    ],
  },
  {
    id: 'long-distance-drive',
    representative: 'driveReservation:seoul:DFANVEX',
    members: [
      'driveReservation:seoul:DFANVEX',
      'driveReservation:seoul:DFWFDER',
    ],
  },
  {
    id: 'beginner-drive',
    representative: 'driveReservation:goyang:DFLSDRV',
    members: [
      'driveReservation:goyang:DFLSDRV',
      'driveReservation:seoul:DFLSDRV',
      'driveReservation:hanam:DFLSDRV',
    ],
  },
  {
    id: 'private-new-car-drive',
    representative: 'driveReservation:goyang:DFPNEWD',
    members: [
      'driveReservation:goyang:DFPNEWD',
      'driveReservation:hanam:DFPNEWD',
    ],
  },
  {
    id: 'outdoor-car-camping',
    representative: 'driveReservation:goyang:DCACDVG',
    members: [
      'driveReservation:goyang:DCACDVG',
      'driveReservation:hanam:DCACDVH',
    ],
  },
  {
    id: 'outdoor-day-trip-drive',
    representative: 'driveReservation:goyang:DFUDDRV',
    members: [
      'driveReservation:goyang:DFUDDRV',
      'driveReservation:hanam:DFANWEK',
      'driveReservation:hanam:DFANWEL',
    ],
  },
  {
    id: 'heritage-drive',
    representative: 'driveReservation:goyang:DFHGDRV',
    members: [
      'driveReservation:goyang:DFHGDRV',
      'driveReservation:seoul:DFHSDRV',
    ],
  },
];

// sourceId는 기존 데이터 또는 예약 화면에 실제 존재하는 값이다.
// 차량 모델과 체험전시는 이번 연결 범위에서 제외한다.
export const unresolvedExperienceFinderContent = [
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
    image: '/images/locations/main.webp',
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
