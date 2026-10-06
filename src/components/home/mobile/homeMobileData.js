// Mobile home content (<=900px). Copied from the Figma "Mobile" frame
// (fileKey Bg4O7mKzaKxNAxgeo9vwuR, node 3007:7248). Text that Figma renders
// with `text-transform: capitalize` is stored as it appears on screen.
import { locationShowcase } from '../../../common/data/locationShowcase';
import heroLogotype from '../../../assets/images/home-mobile/hero-logotype.svg';
import heroImage from '../../../assets/images/locations/figma/hero.webp';
import goyangImage from '../../../assets/images/locations/figma/goyang.svg';
import seoulImage from '../../../assets/images/locations/figma/seoul.svg';
import hanamImage from '../../../assets/images/locations/figma/hanam.svg';
import busanImage from '../../../assets/images/locations/figma/busan.svg';
import beijingImage from '../../../assets/images/locations/figma/beijing.svg';
import senayanParkImage from '../../../assets/images/locations/figma/senayan-park.svg';

// Figma's SEOUL table repeats the GOYANG values, so Seoul uses the location page data.
const seoul = locationShowcase.find((location) => location.id === 'seoul');

export const mobileHero = {
    title: 'HYUNDAI MOTORSTUDIO',
    logotype: heroLogotype,
    image: heroImage,
    imageAlt: '푸른 미디어 월이 이어지는 현대 모터스튜디오 전시 공간',
};

export const mobileIntro = {
    title: ['EXPLORE THE', 'POSSIBILITIES OF MOBILITY'],
    paragraphs: [
        '현대 모터스튜디오는 자동차를 단순히 바라보는 공간을 넘어, 모빌리티가 만들어가는 새로운 일상과 라이프스타일을 직접 경험할 수 있는 브랜드 공간입니다. 전시와 체험을 통해 현대자동차가 그리는 미래의 이동을 보다 가까이에서 만나볼 수 있습니다.',
        '누구나 자신의 관심과 취향에 따라 현대 모터스튜디오를 자유롭게 경험할 수 있습니다. 자동차를 살펴보고 운전하는 순간부터 디자인과 예술, 새로운 기술을 발견하는 과정까지 다양한 콘텐츠를 통해 모빌리티를 자신만의 방식으로 즐겨보세요.',
    ],
    locationsTitle: 'LOCATIONS',
};

// leadKeywords: how many leading keywords use the smaller bold style (16px)
// instead of 18px semibold, matching each Figma block.
export const mobileLocations = [
    {
        slug: 'goyang',
        name: 'GOYANG',
        alt: '현대 모터스튜디오 고양',
        theme: 'light',
        background: '#ffffff',
        keywords: ['FLAGSHIP SPACE', 'TEST DRIVE', 'EXHIBITION & PROGRAM'],
        leadKeywords: 3,
        image: goyangImage,
        info: [
            ['운영시간', '09:00–20:00 / 매주 월요일 휴무(시설별 운영일 상이)'],
            ['휴관일', '매주 월요일 휴관 / 신정, 설날·추석 당일 및 익일 휴관'],
            ['주소', '경기도 고양시 일산서구 킨텍스로 217-6'],
            ['이용요금', '성인 10,000원 / 어린이· 청소년 5,000원'],
        ],
    },
    {
        slug: 'seoul',
        name: 'SEOUL',
        alt: '현대 모터스튜디오 서울',
        theme: 'dark',
        background: '#2668d3',
        keywords: ['BRAND SHOWCASE', 'VEHICLE DISPLAY', 'TEST DRIVE', 'CULTURE & LIFESTYLE'],
        leadKeywords: 1,
        image: seoulImage,
        info: [
            ['운영시간', seoul.hours],
            ['휴관일', seoul.closed],
            ['주소', seoul.address],
            ['이용요금', seoul.price],
        ],
    },
    {
        slug: 'hanam',
        name: 'HANAM',
        alt: '현대 모터스튜디오 하남',
        theme: 'dark',
        background: '#2c5e8a',
        keywords: ['MOBILITY EXPERIENCE', 'VEHICLE DISPLAY', 'TEST DRIVE', 'CULTURE & LIFESTYLE'],
        leadKeywords: 1,
        image: hanamImage,
        info: [
            ['운영시간', '10:00 – 22:00'],
            ['휴관일', '연중무휴'],
            ['주소', '경기도 하남시 미사대로 750, 스타필드 하남 1층'],
            ['이용요금', '무료 관람'],
        ],
    },
    {
        slug: 'busan',
        name: 'BUSAN',
        alt: '현대 모터스튜디오 부산',
        theme: 'dark',
        background: '#063452',
        keywords: ['DESIGN & CULTURE', 'ART EXHIBITION', 'CREATIVE EXPERIENCE', 'LIFESTYLE PROGRAM'],
        leadKeywords: 1,
        image: busanImage,
        info: [
            ['운영시간', '09:00–20:00'],
            ['휴관일', '현재 전시 교체 준비로 임시 휴관 중'],
            ['주소', '부산광역시 수영구 구락로123번길 20 F1963'],
            ['이용요금', '무료 관람'],
        ],
    },
    {
        slug: 'beijing',
        name: 'BEIJING',
        alt: '현대 모터스튜디오 베이징',
        theme: 'light',
        background: '#a8a7ac',
        keywords: ['CULTURE & ART', 'DESIGN EXHIBITION', 'SUSTAINABLE MOBILITY', 'CREATIVE PROGRAM'],
        leadKeywords: 0,
        image: beijingImage,
        info: [
            ['운영시간', '09:00–20:00'],
            ['휴관일', '매월 첫 월요일 및 춘절 연휴 휴관'],
            ['주소', 'E-1, Art District 798, Beijing, China'],
            ['이용요금', '무료 관람'],
        ],
    },
    {
        slug: 'senayan-park',
        name: 'SENAYAN PARK',
        alt: '현대 모터스튜디오 스나얀 파크',
        theme: 'dark',
        background: '#363636',
        keywords: ['CREATIVE PROGRAM', 'INTERACTIVE EXPERIENCE', 'DIGITAL TECHNOLOGY', 'BRAND EXPERIENCE'],
        leadKeywords: 0,
        image: senayanParkImage,
        info: [
            ['운영시간', '10:00 – 22:00'],
            ['주소', 'Jl. Gerbang Pemuda No.3, Gelora, Tanah Abang,\nJakarta Pusat 10270, Indonesia (UG Floor)'],
            ['이용요금', '무료 관람'],
        ],
    },
];
