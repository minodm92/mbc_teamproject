import { useEffect, useRef } from 'react';
import './ExhibitionsPage.css';

const exhibitionImage = (name) => `/images/exhibitions/${name}.png`;
const exhibitionPreview = [
  [1, 526, 144, 159, 148], [2, 462, 275, 129, 103], [3, 243, 335, 163, 166],
  [4, 499, 526, 130, 106], [5, 680, 692, 104, 94], [6, 434, 729, 188, 164],
  [7, 961, 911, 122, 167], [8, 1227, 737, 229, 162], [9, 1530, 662, 96, 93],
  [10, 1456, 477, 128, 140], [11, 1520, 264, 142, 100], [12, 1281, 186, 182, 204],
];
const exhibitionPreviewDepth = [
  { delay: .015, end: 1.12, travel: 650, scale: 1.12, drift: .18 },
  { delay: .035, end: 1.24, travel: 610, scale: 1.3, drift: .25 },
  { delay: .005, end: 1.08, travel: 660, scale: 1.08, drift: .2 },
  { delay: .045, end: 1.18, travel: 625, scale: 1.22, drift: .22 },
  { delay: .025, end: 1.06, travel: 670, scale: 1.1, drift: .27 },
  { delay: .01, end: 1.2, travel: 635, scale: 1.28, drift: .22 },
  { delay: .04, end: 1.1, travel: 680, scale: 1.08, drift: .26 },
  { delay: .02, end: 1.25, travel: 610, scale: 1.34, drift: .17 },
  { delay: .03, end: 1.09, travel: 660, scale: 1.12, drift: .27 },
  { delay: .01, end: 1.16, travel: 645, scale: 1.25, drift: .23 },
  { delay: .05, end: 1.08, travel: 680, scale: 1.1, drift: .26 },
  { delay: .025, end: 1.21, travel: 635, scale: 1.3, drift: .21 },
];
const exhibitionScenes = [
  { title: 'INTO THE CAR', image: 'into-the-car', description: <>한 대의 자동차가 완성되는 과정을 따라가며<br />각 공정에 숨겨진 기술과 이야기를 직접 경험합니다.</> },
  { title: '4D RIDE', image: '4d-ride', description: <>움직임과 특수효과가 결합된 공간에서<br />온몸으로 몰입하는 새로운 경험을 만나보세요.</> },
  { title: 'CONNECT WALL', image: 'connect-wall', description: <>거대한 미디어 월과 자동차가 하나로 연결되며<br />공간 전체가 역동적인 전시 장면으로 확장됩니다.</> },
  { title: 'MEDIA ART', image: 'media-art', description: <>시시각각 변화하는 미디어 아트를 통해<br />모빌리티를 새로운 감각으로 경험합니다.</> },
  { title: <>MOBILITY<br />&amp; ART</>, label: 'MOBILITY & ART', image: 'mobility-art', description: <>자동차와 예술이 하나의 공간에서 만나<br />새로운 모빌리티 경험을 만들어냅니다.</> },
];

export default function ExhibitionsPage() {
  const pageRef = useRef(null);

  useEffect(() => {
    const page = pageRef.current;
    if (!page) return undefined;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mobileViewport = window.matchMedia('(max-width: 760px)');
    const hero = page.querySelector('.exhibition-hero');
    const heroImage = page.querySelector('.exhibition-hero__image');
    const heroCopy = page.querySelector('.exhibition-hero__copy');
    const heroScroll = page.querySelector('.exhibition-hero__scroll');
    const intro = page.querySelector('.exhibition-intro');
    const introContent = intro.querySelector('div');
    const introEyebrow = intro.querySelector('.exhibition-intro__eyebrow');
    const introTitle = intro.querySelector('.exhibition-intro__title-visual');
    const introTitleFrame = intro.querySelector('.exhibition-intro__title-frame');
    const introTitleSpacer = page.querySelector('.exhibition-intro__title-spacer');
    const introDescription = intro.querySelector('.exhibition-intro__english');
    const preview = page.querySelector('.exhibition-preview');
    const previewCanvas = preview.querySelector('.exhibition-preview__canvas');
    const previewTitle = preview.querySelector('h2');
    const previewImages = [...page.querySelectorAll('.exhibition-preview__image')];
    const previewExpandedImage = preview.querySelector('.exhibition-preview__expanded-image');
    const feature = page.querySelector('.exhibition-editorial--feature');
    const featureCopy = feature.querySelector('.exhibition-editorial__copy');
    const featureTitle = featureCopy.querySelector('h2');
    const featureDescription = featureCopy.querySelector('p');
    const featureImage = feature.querySelector('img');
    const sequence = page.querySelector('.exhibition-sequence');
    const sequenceViewport = sequence.querySelector('.exhibition-sequence__viewport');
    const sequencePerspective = Number.parseFloat(window.getComputedStyle(sequenceViewport).perspective) || 1400;
    const sequenceDepth = 360;
    const scenes = [...page.querySelectorAll('.exhibition-scene')];
    const sceneParts = scenes.map((scene) => ({
      scene,
      image: scene.querySelector('.exhibition-scene__frame > img'),
      shade: scene.querySelector('.exhibition-scene__shade'),
      title: scene.querySelector('h2'),
      description: scene.querySelector('p'),
    }));
    const reflection = page.querySelector('.exhibition-editorial--reflection');
    const reflectionCopy = reflection.querySelector('.exhibition-editorial__copy');
    const reflectionTitle = reflectionCopy.querySelector('h2');
    const reflectionTitleRenderLayer = reflectionTitle.querySelector('.exhibition-reflection__title-render-layer');
    const reflectionDescription = reflectionCopy.querySelector('p');
    const reflectionImage = reflection.querySelector('img');
    const editorialImages = [...page.querySelectorAll('.exhibition-editorial > img, .exhibition-editorial__stage > img')];
    const closing = page.querySelector('.exhibition-closing');
    const closingImage = closing.querySelector('img');
    const closingTitle = closing.querySelector('h2');
    const closingBackground = closing.querySelector('.exhibition-closing__stage > span');
    const closingDescription = closing.querySelector('.exhibition-closing__stage > p');
    const clamp = (value) => Math.min(1, Math.max(0, value));
    const ease = (value) => value * value * (3 - 2 * value);
    let introTitleBaseSize = 96;
    let introTitleMaxScale = 2.05;
    let reflectionTitleMaxScale = 1.72;
    let frame = 0;
    let closingScale = 1;
    let closingImageY = 0;
    const cursorTarget = { x: 0, y: 0 };
    const cursorCurrent = { x: 0, y: 0 };

    const update = () => {
      frame = 0;
      const vh = window.innerHeight;
      const mobilePacing = mobileViewport.matches;
      const sectionProgress = (rect, section, holdScreens) => {
        const holdDistance = mobilePacing ? vh * holdScreens : 0;
        return clamp(-rect.top / Math.max(1, rect.height - vh - holdDistance));
      };
      const heroRect = hero.getBoundingClientRect();
      const previewRect = preview.getBoundingClientRect();
      if (reducedMotion.matches) {
        heroImage.style.width = '';
        heroImage.style.height = '';
        heroCopy.style.opacity = '1';
        heroScroll.style.opacity = '1';
        introContent.style.opacity = '1';
        introContent.style.transform = 'none';
        introEyebrow.style.opacity = '1';
        introEyebrow.style.transform = 'none';
        introTitle.style.opacity = '1';
        introTitle.style.transform = `scale(${(1 / introTitleMaxScale).toFixed(5)})`;
        introDescription.style.opacity = '1';
        introDescription.style.transform = 'none';
        previewTitle.style.opacity = '1';
        previewTitle.style.transform = 'translateX(-50%)';
        previewImages.forEach((image) => { image.style.transform = 'none'; });
        previewImages.forEach((image) => { image.style.opacity = '1'; });
        previewExpandedImage.style.opacity = '1';
        previewExpandedImage.style.transform = 'translate3d(-50%, -50%, 0) scale(1)';
        previewTitle.style.opacity = '0';
        sceneParts.forEach(({ scene, image, shade, title, description }, index) => {
          scene.style.visibility = index === 0 ? 'visible' : 'hidden';
          image.style.clipPath = 'none';
          image.style.transform = 'none';
          shade.style.clipPath = 'none';
          shade.style.transform = 'none';
          title.style.opacity = '1';
          title.style.transform = 'none';
          description.style.opacity = '1';
          description.style.transform = 'none';
        });
        editorialImages.forEach((image) => { image.style.transform = 'none'; });
        featureImage.style.opacity = '1';
        featureImage.style.clipPath = 'none';
        featureCopy.style.transform = 'none';
        featureCopy.style.opacity = '1';
        featureTitle.style.opacity = '1';
        featureTitle.style.transform = 'none';
        featureDescription.style.opacity = '1';
        featureDescription.style.transform = 'none';
        reflectionCopy.style.opacity = '1';
        reflectionCopy.style.transform = 'none';
        reflectionTitle.style.opacity = '1';
        reflectionTitle.style.transform = 'none';
        reflectionTitleRenderLayer.style.transform = `scale(${(1 / reflectionTitleMaxScale).toFixed(5)})`;
        reflectionDescription.style.opacity = '1';
        reflectionDescription.style.transform = 'none';
        reflectionImage.style.opacity = '1';
        reflectionImage.style.transform = 'none';
        reflectionImage.style.clipPath = 'none';
        closingImage.style.transform = 'translateX(-50%)';
        closingImage.style.opacity = '1';
        closingBackground.style.transform = 'none';
        closingBackground.style.opacity = '1';
        closingTitle.style.opacity = '1';
        closingTitle.style.transform = 'none';
        closingDescription.style.opacity = '1';
        closingDescription.style.transform = 'none';
        return;
      }
      if (heroRect.bottom > 0 && heroRect.top <= 0) {
        const progress = sectionProgress(heroRect, hero, 0.25);
        const desktop = window.innerWidth > 1200;
        const expansion = ease(clamp((progress - (desktop ? 0.14 : 0.06)) / (desktop ? 0.6 : 0.68)));
        const initialWidth = window.innerWidth <= 760 ? 125 : 195;
        const initialHeight = window.innerWidth <= 760 ? vh * 0.48 : 540;
        heroImage.style.width = `${initialWidth + (window.innerWidth - initialWidth) * expansion}px`;
        heroImage.style.height = `${initialHeight + (vh - initialHeight) * expansion}px`;
        heroCopy.style.opacity = (1 - ease(clamp((progress - (desktop ? 0.26 : 0.22)) / (desktop ? 0.34 : 0.4)))).toFixed(3);
        heroScroll.style.opacity = (1 - ease(clamp((progress - 0.08) / 0.16))).toFixed(3);
      }
      const introRect = intro.getBoundingClientRect();
      if (introRect.bottom > 0 && introRect.top < vh) {
        const entry = ease(clamp((vh - introRect.top) / (vh * 0.8)));
        const progress = sectionProgress(introRect, intro, 0.3);
        let titleScale = 0.46 + 0.19 * entry;
        if (introRect.top <= 0) {
          if (progress < 0.38) titleScale = 0.65 + ease(progress / 0.38) * (introTitleMaxScale - 0.65);
          else if (progress < 0.68) titleScale = introTitleMaxScale - ease((progress - 0.38) / 0.3) * (introTitleMaxScale - 1);
          else titleScale = 1;
        }
        const detailReveal = ease(clamp((progress - 0.68) / 0.16));
        introContent.style.opacity = '1';
        introContent.style.transform = 'none';
        introTitle.style.opacity = entry.toFixed(3);
        introTitle.style.transform = `scale(${(titleScale / introTitleMaxScale).toFixed(5)})`;
        introEyebrow.style.opacity = detailReveal.toFixed(3);
        introEyebrow.style.transform = `translate3d(0, ${((1 - detailReveal) * 12).toFixed(1)}px, 0)`;
        introDescription.style.opacity = detailReveal.toFixed(3);
        introDescription.style.transform = `translate3d(0, ${((1 - detailReveal) * 16).toFixed(1)}px, 0)`;
      }
      if (previewRect.bottom > 0 && previewRect.top < vh) {
        const progress = sectionProgress(previewRect, preview, 0.5);
        previewImages.forEach((image, index) => {
          const [, x, y, width, height] = exhibitionPreview[index];
          const depthProfile = exhibitionPreviewDepth[index];
          const travelProgress = clamp((progress - depthProfile.delay) / (depthProfile.end - depthProfile.delay));
          const depth = ease(travelProgress);
          const centerX = x + width / 2;
          const centerY = y + height / 2;
          const outwardX = (centerX - 960) / 960;
          const outwardY = (centerY - 540) / 540;
          const driftProgress = depth ** 1.65;
          const translateX = outwardX * window.innerWidth * depthProfile.drift * driftProgress;
          const translateY = outwardY * vh * depthProfile.drift * driftProgress;
          const translateZ = depth * depthProfile.travel;
          const scale = 1 + depth * depthProfile.scale;
          image.style.opacity = '1';
          image.style.transform = `translate3d(${translateX.toFixed(2)}px, ${translateY.toFixed(2)}px, ${translateZ.toFixed(2)}px) scale(${scale.toFixed(4)})`;
        });
        const imageReveal = ease(clamp((progress - 0.5) / 0.06));
        const frameExpansion = ease(clamp((progress - 0.56) / 0.27));
        const coverExpansion = ease(clamp((progress - 0.83) / 0.15));
        const coverScale = Math.max(
          window.innerWidth / Math.max(1, previewExpandedImage.offsetWidth),
          vh / Math.max(1, previewExpandedImage.offsetHeight),
        );
        const frameScale = 0.07 + (1 - 0.07) * frameExpansion;
        const imageScale = progress < 0.83
          ? frameScale
          : 1 + (coverScale - 1) * coverExpansion;
        const textOcclusion = ease(clamp((imageScale - 0.58) / (0.96 - 0.58)));
        previewExpandedImage.style.opacity = imageReveal.toFixed(3);
        previewExpandedImage.style.transform = `translate3d(-50%, -50%, 0) scale(${imageScale.toFixed(5)})`;
        previewTitle.style.opacity = (1 - textOcclusion).toFixed(3);
        previewTitle.style.transform = 'translate3d(-50%, 0, 0)';
      }
      const sequenceRect = sequence.getBoundingClientRect();
      if (sequenceRect.bottom > 0 && sequenceRect.top < vh) {
        const travel = Math.max(1, sequenceRect.height - vh);
        const mobileSequence = mobileViewport.matches;
        const mobileLeadIn = mobileSequence ? vh : 0;
        const sequenceProgress = clamp((-sequenceRect.top - mobileLeadIn) / Math.max(1, travel - mobileLeadIn));
        const chapterProgress = sequenceProgress * (sceneParts.length - 1);
        const activeChapter = Math.min(sceneParts.length - 2, Math.floor(chapterProgress));
        const phase = chapterProgress - activeChapter;
        const renderChapter = (part, index) => {
          const isPast = index <= activeChapter;
          const isIncoming = index === activeChapter + 1;
          const titleReveal = index === 0
            ? mobileSequence ? 1 : ease(clamp(sequenceProgress / 0.025))
            : isIncoming ? ease(clamp((phase - 0.46) / 0.14)) : isPast ? 1 : 0;
          const imageProgress = index === 0
            ? 1
            : isIncoming ? ease(clamp(phase / 0.46)) : isPast ? 1 : 0;
          const imageOpacity = isIncoming ? ease(clamp(phase / 0.035)) : 1;
          const descriptionReveal = index === 0
            ? mobileSequence ? 1 : ease(clamp((sequenceProgress - 0.012) / 0.025))
            : isIncoming ? ease(clamp((phase - 0.56) / 0.12)) : isPast ? 1 : 0;
          const imageY = vh * 0.38 * (1 - imageProgress);
          const imageZ = sequenceDepth * imageProgress;
          const visualScale = 0.18 + imageProgress * 0.82;
          const imageScale = visualScale * (1 - imageZ / sequencePerspective);
          const imageTransform = `translate3d(0, ${imageY.toFixed(2)}px, ${imageZ.toFixed(2)}px) scale(${imageScale.toFixed(4)})`;

          part.scene.style.visibility = index <= activeChapter + 1 ? 'visible' : 'hidden';
          part.scene.style.zIndex = String(index + 1);
          part.image.style.opacity = imageOpacity.toFixed(3);
          part.image.style.clipPath = 'none';
          part.image.style.transform = imageTransform;
          part.shade.style.clipPath = 'none';
          part.shade.style.transform = imageTransform;
          part.title.style.opacity = titleReveal.toFixed(3);
          part.title.style.transform = `translate3d(0, ${((1 - titleReveal) * 18).toFixed(2)}px, 0) scale(${(0.985 + titleReveal * 0.015).toFixed(4)})`;
          part.description.style.opacity = descriptionReveal.toFixed(3);
          part.description.style.transform = `translate3d(0, ${((1 - descriptionReveal) * 14).toFixed(2)}px, 0)`;
        };

        sceneParts.forEach(renderChapter);
      }
      const featureRect = feature.getBoundingClientRect();
      if (featureRect.bottom > 0 && featureRect.top < vh) {
        let progress;
        if (mobilePacing) {
          const holdDistance = vh * 0.4;
          const animationDistance = Math.max(1, featureRect.height - vh - holdDistance);
          const distance = Math.max(0, -featureRect.top);
          const contentReadyDistance = animationDistance * 0.66;
          if (distance <= contentReadyDistance) progress = distance / animationDistance;
          else if (distance <= contentReadyDistance + holdDistance) progress = 0.66;
          else progress = (distance - holdDistance) / animationDistance;
          progress = clamp(progress);
        } else {
          progress = clamp(-featureRect.top / Math.max(1, featureRect.height - vh));
        }
        const imageReveal = ease(clamp((progress - 0.48) / 0.18));
        const exit = ease(clamp((progress - 0.84) / 0.14));
        featureImage.style.opacity = imageReveal.toFixed(3);
        featureImage.style.clipPath = `inset(0 ${(100 - imageReveal * 100).toFixed(2)}% 0 0)`;
        featureImage.style.transform = `translate3d(${((1 - imageReveal) * 36).toFixed(2)}px, 0, 0) scale(${(1.04 - imageReveal * 0.04).toFixed(4)})`;
        const titleReveal = ease(clamp((progress - 0.22) / 0.12));
        let titleScale = 0.96 + titleReveal * 0.04;
        if (progress >= 0.34 && progress < 0.4) titleScale = 1 + ease((progress - 0.34) / 0.06) * 0.055;
        else if (progress >= 0.4 && progress < 0.48) titleScale = 1.055 - ease((progress - 0.4) / 0.08) * 0.055;
        else if (progress >= 0.48) titleScale = 1;
        const descriptionReveal = ease(clamp((progress - 0.48) / 0.14));
        featureCopy.style.opacity = '1';
        featureCopy.style.transform = 'none';
        featureTitle.style.opacity = titleReveal.toFixed(3);
        featureTitle.style.transform = `translate3d(0, ${((1 - titleReveal) * 24 - exit * 8).toFixed(1)}px, 0) scale(${titleScale.toFixed(4)})`;
        featureDescription.style.opacity = descriptionReveal.toFixed(3);
        featureDescription.style.transform = `translate3d(0, ${((1 - descriptionReveal) * 18 - exit * 5).toFixed(1)}px, 0)`;
      }
      editorialImages.forEach((image) => {
        if (image === featureImage || image === reflectionImage) return;
        const rect = image.closest('.exhibition-editorial').getBoundingClientRect();
        if (rect.bottom <= 0 || rect.top >= vh) return;
        const progress = clamp((vh - rect.top) / (vh + rect.height));
        image.style.transform = `translate3d(0, ${((0.5 - progress) * 48).toFixed(1)}px, 0) scale(${(1.035 - progress * 0.035).toFixed(3)})`;
      });
      const reflectionRect = reflection.getBoundingClientRect();
      if (reflectionRect.bottom > 0 && reflectionRect.top < vh) {
        const entry = ease(clamp((vh - reflectionRect.top) / (vh * 0.52)));
        const progress = sectionProgress(reflectionRect, reflection, 0.4);
        const titleGrow = ease(clamp(progress / 0.22));
        const titleSettle = ease(clamp((progress - 0.28) / 0.3));
        const imageReveal = ease(clamp((progress - 0.48) / 0.18));
        const descriptionReveal = ease(clamp((progress - 0.68) / 0.12));
        const copyRect = reflectionCopy.getBoundingClientRect();
        const finalTitleCenterX = copyRect.left + reflectionTitle.offsetWidth / 2;
        const finalTitleCenterY = copyRect.top + reflectionTitle.offsetHeight / 2;
        const centerX = window.innerWidth / 2 - finalTitleCenterX;
        const centerY = vh / 2 - finalTitleCenterY;
        const centeredX = centerX * (1 - titleSettle);
        const centeredY = centerY * (1 - titleSettle);
        const titleScale = (0.68 + titleGrow * (reflectionTitleMaxScale - 0.68)) * (1 - titleSettle) + titleSettle;

        reflectionCopy.style.opacity = '1';
        reflectionCopy.style.transform = 'none';
        reflectionTitle.style.opacity = entry.toFixed(3);
        reflectionTitle.style.transform = `translate3d(${centeredX.toFixed(2)}px, ${centeredY.toFixed(2)}px, 0)`;
        reflectionTitleRenderLayer.style.transform = `scale(${(titleScale / reflectionTitleMaxScale).toFixed(5)})`;
        reflectionDescription.style.opacity = descriptionReveal.toFixed(3);
        reflectionDescription.style.transform = `translate3d(0, ${((1 - descriptionReveal) * 18).toFixed(2)}px, 0)`;
        reflectionImage.style.opacity = imageReveal.toFixed(3);
        reflectionImage.style.clipPath = `inset(0 ${(100 - imageReveal * 100).toFixed(2)}% 0 0)`;
        reflectionImage.style.transform = `translate3d(${((1 - imageReveal) * 36).toFixed(2)}px, 0, 0) scale(${(1.04 - imageReveal * 0.04).toFixed(4)})`;
      }
      const closingRect = closing.getBoundingClientRect();
      if (closingRect.bottom > 0 && closingRect.top < vh) {
        const progress = sectionProgress(closingRect, closing, 0.35);
        const titleReveal = ease(clamp((progress - 0.03) / 0.14));
        const backgroundReveal = ease(clamp((progress - 0.1) / 0.17));
        const imageReveal = ease(clamp((progress - 0.18) / 0.2));
        const descriptionReveal = ease(clamp((progress - 0.4) / 0.12));
        const parallaxTravel = ease(clamp((progress - 0.18) / 0.3));
        const parallaxSettle = ease(clamp((progress - 0.48) / 0.12));
        const backgroundOffset = (10 - parallaxTravel * 20) * (1 - parallaxSettle);
        const imageOffset = (26 - parallaxTravel * 48) * (1 - parallaxSettle);

        closingScale = 0.96 + imageReveal * 0.04 + parallaxTravel * (1 - parallaxSettle) * 0.025;
        closingImageY = (1 - imageReveal) * 24 + imageOffset;
        closingTitle.style.opacity = titleReveal.toFixed(3);
        closingTitle.style.transform = `translate3d(0, ${((1 - titleReveal) * 22).toFixed(1)}px, 0)`;
        closingBackground.style.opacity = backgroundReveal.toFixed(3);
        closingBackground.style.transform = `translate3d(0, ${backgroundOffset.toFixed(1)}px, 0)`;
        closingImage.style.opacity = imageReveal.toFixed(3);
        closingDescription.style.opacity = descriptionReveal.toFixed(3);
        closingDescription.style.transform = `translate3d(0, ${((1 - descriptionReveal) * 14).toFixed(1)}px, 0)`;
      }
      cursorCurrent.x += (cursorTarget.x - cursorCurrent.x) * 0.12;
      cursorCurrent.y += (cursorTarget.y - cursorCurrent.y) * 0.12;
      closingImage.style.transform = `translate3d(calc(-50% + ${(cursorCurrent.x * 9).toFixed(2)}px), ${(closingImageY + cursorCurrent.y * 7).toFixed(2)}px, 0) rotateX(${(-cursorCurrent.y * 1.4).toFixed(3)}deg) rotateY(${(cursorCurrent.x * 1.4).toFixed(3)}deg) scale(${closingScale.toFixed(3)})`;
      if (Math.abs(cursorTarget.x - cursorCurrent.x) > 0.001 || Math.abs(cursorTarget.y - cursorCurrent.y) > 0.001) requestUpdate();
    };
    const requestUpdate = () => { if (!frame) frame = window.requestAnimationFrame(update); };
    const updateIntroTitleBaseSize = () => {
      const scrollbarHalfWidth = (window.innerWidth - document.documentElement.clientWidth) / 2;
      introTitleFrame.style.setProperty('--viewport-scrollbar-half', `${scrollbarHalfWidth}px`);
      previewCanvas.style.setProperty('--viewport-scrollbar-half', `${scrollbarHalfWidth}px`);
      introTitleMaxScale = window.innerWidth <= 760 ? 1.08 : 2.05;
      reflectionTitleMaxScale = window.innerWidth <= 760 ? 1 : 1.72;
      introTitle.style.removeProperty('font-size');
      introTitleBaseSize = Number.parseFloat(window.getComputedStyle(introTitle).fontSize) || 96;
      introTitleSpacer.style.height = `${introTitleBaseSize * 2.2}px`;
      introTitle.style.fontSize = `${introTitleBaseSize * introTitleMaxScale}px`;
    };
    const handleResize = () => { updateIntroTitleBaseSize(); requestUpdate(); };
    const handlePointerMove = (event) => {
      const rect = closingImage.getBoundingClientRect();
      cursorTarget.x = Math.max(-1, Math.min(1, ((event.clientX - rect.left) / rect.width - 0.5) * 2));
      cursorTarget.y = Math.max(-1, Math.min(1, ((event.clientY - rect.top) / rect.height - 0.5) * 2));
      requestUpdate();
    };
    const handlePointerLeave = () => {
      cursorTarget.x = 0;
      cursorTarget.y = 0;
      requestUpdate();
    };
    requestUpdate();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    updateIntroTitleBaseSize();
    window.addEventListener('resize', handleResize);
    reducedMotion.addEventListener('change', requestUpdate);
    closingImage.addEventListener('pointermove', handlePointerMove);
    closingImage.addEventListener('pointerleave', handlePointerLeave);
    return () => {
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', handleResize);
      reducedMotion.removeEventListener('change', requestUpdate);
      closingImage.removeEventListener('pointermove', handlePointerMove);
      closingImage.removeEventListener('pointerleave', handlePointerLeave);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return <main className="exhibition-page" ref={pageRef}>
    <section className="exhibition-hero" aria-labelledby="exhibition-hero-title">
      <div className="exhibition-hero__frame"><img className="exhibition-hero__image" src={exhibitionImage('hero')} alt="현대 모터스튜디오 전시 공간" draggable="false" /><div className="exhibition-hero__copy exhibition-reveal"><h1 id="exhibition-hero-title">BEYOND<br />THE EXHIBITION</h1><p>자동차를 넘어 직접 경험하고 느끼며,<br />문화와 예술로 확장되는 전시를 만나보세요.</p></div><span className="exhibition-hero__scroll">SCROLL TO EXPLORE</span></div>
    </section>
    <section className="exhibition-intro exhibition-reveal"><div><p className="exhibition-intro__eyebrow">보는 것을 넘어, 경험으로 이어지는 전시</p><div className="exhibition-intro__title-spacer" aria-hidden="true" /><div className="exhibition-intro__title-frame"><h2 className="exhibition-intro__title-visual"><span>MORE THAN</span><span>JUST SEEING</span></h2></div><p className="exhibition-intro__english">Experience mobility beyond simply seeing, through technology and interaction.<br />Discover new perspectives through culture and art.</p></div></section>
    <section className="exhibition-preview exhibition-reveal" aria-label="전시 이미지 미리보기">
      <div className="exhibition-preview__canvas">{exhibitionPreview.map(([number, x, y, width, height]) => <img className="exhibition-preview__image" key={number} src={exhibitionImage(`preview-${String(number).padStart(2, '0')}`)} alt="" loading="lazy" style={{ '--x': `${x / 19.2}%`, '--y': `${y / 10.8}%`, '--w': `${width / 19.2}%`, '--h': `${height / 10.8}%` }} />)}<h2><span>EXPERIENCE,</span><span>UNFOLDED</span></h2><img className="exhibition-preview__expanded-image" src={exhibitionImage('preview-expanded')} alt="현대 모터스튜디오의 몰입형 전시 공간" loading="lazy" /></div>
    </section>
    <section className="exhibition-editorial exhibition-editorial--feature exhibition-reveal"><div className="exhibition-editorial__stage"><div className="exhibition-editorial__copy"><h2>DON'T JUST LOOK.<br />EXPERIENCE IT.</h2><p>보고 끝나는 전시가 아닌, 직접 움직이고<br />참여하며 모빌리티를 발견하는 경험.<br />자동차의 기술과 제작 과정부터 몰입형 콘텐츠까지<br />다양한 방식으로 자동차를 경험해 보세요.</p></div><img src={exhibitionImage('feature')} alt="현대 모터스튜디오 전시 공간" loading="lazy" /></div></section>
    <div className="exhibition-sequence"><div className="exhibition-sequence__viewport">{exhibitionScenes.map((scene) => <section className={`exhibition-scene exhibition-scene--${scene.image}`} key={scene.image} aria-label={scene.label || scene.title}><div className="exhibition-scene__frame"><img src={exhibitionImage(scene.image)} alt="" loading="lazy" /><div className="exhibition-scene__shade" /><div className="exhibition-scene__copy"><h2>{scene.title}</h2><p>{scene.description}</p></div></div></section>)}</div></div>
    <section className="exhibition-editorial exhibition-editorial--reflection exhibition-reveal"><div className="exhibition-editorial__stage"><div className="exhibition-editorial__copy"><h2><span className="exhibition-reflection__title-layout exhibition-reflection__title-layout--desktop">SO, WHAT<br />IS AN<br />EXHIBITION?</span><span className="exhibition-reflection__title-layout exhibition-reflection__title-layout--mobile">SO, WHAT IS AN<br />EXHIBITION?</span><span className="exhibition-reflection__title-render-layer" aria-hidden="true"><span className="exhibition-reflection__title-visual exhibition-reflection__title-visual--desktop"><span>SO, WHAT</span><span>IS AN</span><span>EXHIBITION?</span></span><span className="exhibition-reflection__title-visual exhibition-reflection__title-visual--mobile"><span>SO, WHAT IS AN</span><span>EXHIBITION?</span></span></span></h2><p>바라보는 것에서 그치지 않고,<br />직접 보고 느끼고 경험하는 순간.<br />현대 모터스튜디오의 전시는<br />모빌리티를 새로운 방식으로 만나는 경험입니다.</p></div><img src={exhibitionImage('reflection')} alt="현대 모터스튜디오 전시 관람객" loading="lazy" /></div></section>
    <section className="exhibition-closing exhibition-reveal"><div className="exhibition-closing__stage"><h2>EXPERIENCE THE EXHIBITION</h2><span aria-hidden="true">BEYOND WHAT<br />YOU SEE</span><img src={exhibitionImage('closing')} alt="현대 모터스튜디오 전시 공간" loading="lazy" /><p>자동차를 넘어 기술과 문화, 예술을 경험하는<br />현대 모터스튜디오의 전시를 만나보세요.</p></div></section>
  </main>;
}

