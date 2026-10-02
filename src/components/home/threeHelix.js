import * as THREE from 'three';

const CARD_WIDTH = 2.8;
const CARD_HEIGHT = (CARD_WIDTH * 320) / 460;
const W_SEGS = 24;
const N = 8;
const FINAL_CARD_COUNT = 6;
const MID = Math.PI * 1.2;
const R = 7;
const PITCH_PER_RAD = 1.6;
const DIP_A = 0.48;
const DIP_S = 0.82;
const HELIX_X = 0;
const HELIX_Y = 0;
const FRONT_ANGLE = Math.PI / 2 + Math.round((MID - Math.PI / 2) / (Math.PI * 2)) * Math.PI * 2;
const DS_PER_RAD = Math.sqrt(R * R + PITCH_PER_RAD * PITCH_PER_RAD);
const HELIX_CARD_GAP = CARD_WIDTH * (20 / 460);
const CARD_STEP_ANGLE = (CARD_WIDTH + HELIX_CARD_GAP) / DS_PER_RAD;
const PATH_HALF_ANGLE = 6.3;
const PATH_START_ANGLE = MID - PATH_HALF_ANGLE;
const PATH_END_ANGLE = MID + PATH_HALF_ANGLE;
const ENTRY_ANGLE_OFFSET = 0.75;
const HELIX_TRAVEL_END = 1.4;
const GRID_STAGE_DURATION = 0.05;
const GRID_ENTRY_DELAY = 0.022;
const GRID_ENTRY_DURATION = 0.2;
const HOVER_LERP_K = 0.14;
const GRID_ENTRY_ANGLES = [125, 90, 45, -125, -90, -45];
const GRID_ENTRY_ORDER = [0, 1, 2, 5, 4, 3];
const GRID_STAGE_START = HELIX_TRAVEL_END;
const GRID_ENTRY_START = GRID_STAGE_START + GRID_STAGE_DURATION;
const LAST_GRID_ENTRY_ORDER = Math.max(...GRID_ENTRY_ORDER.slice(0, FINAL_CARD_COUNT));
const GRID_ENTRY_END =
    GRID_ENTRY_START + LAST_GRID_ENTRY_ORDER * GRID_ENTRY_DELAY + GRID_ENTRY_DURATION;
const COPY_REVEAL_DELAY = 0.025;
const COPY_REVEAL_DURATION = 0.025;
export const THREE_HELIX_TIMELINE_END =
    GRID_ENTRY_END + COPY_REVEAL_DELAY + COPY_REVEAL_DURATION;

const vertexShader = `
varying vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
uniform sampler2D map;
uniform float opacity;
varying vec2 vUv;
void main() {
    vec4 color = texture2D(map, vUv);
    if (color.a <= 0.001) discard;
    gl_FragColor = vec4(color.rgb, color.a * opacity);
}
`;

const clamp01 = (value) => THREE.MathUtils.clamp(value, 0, 1);
const smoothstep = (value) => value * value * (3 - 2 * value);
const mix = (from, to, progress) => from + (to - from) * progress;
const toTimelineProgress = (normalizedProgress) =>
    clamp01(normalizedProgress) * THREE_HELIX_TIMELINE_END;

export const getThreeHelixCopyProgress = (normalizedProgress) => {
    const timelineProgress = toTimelineProgress(normalizedProgress);
    const copyStart = GRID_ENTRY_END + COPY_REVEAL_DELAY;
    return clamp01((timelineProgress - copyStart) / COPY_REVEAL_DURATION);
};

const dip = (a) => {
    const d = (a - MID) / DIP_S;
    return DIP_A * Math.exp(-d * d);
};

// Place the nearest, front-facing pass through the viewport's vertical center.
const Y_START = -FRONT_ANGLE * PITCH_PER_RAD + dip(FRONT_ANGLE);

const hPos = (a) =>
    new THREE.Vector3(
        HELIX_X + R * Math.cos(a),
        HELIX_Y + Y_START + a * PITCH_PER_RAD - dip(a),
        R * Math.sin(a)
    );

function createCardGeometry() {
    return new THREE.PlaneGeometry(CARD_WIDTH, CARD_HEIGHT, W_SEGS, 1);
}

function createCardMaterial(texture) {
    return new THREE.ShaderMaterial({
        uniforms: { map: { value: texture }, opacity: { value: 1 } },
        vertexShader,
        fragmentShader,
        side: THREE.DoubleSide,
        transparent: true,
        depthWrite: true,
        depthTest: true,
    });
}

function gridCenter(index, camera, viewportWidth, viewportHeight) {
    const designScale = Math.min(viewportWidth / 1920, viewportHeight / 1080);
    const frameLeft = (viewportWidth - 1920 * designScale) * 0.5;
    const frameTop = (viewportHeight - 1080 * designScale) * 0.5;
    const left = [228, 727, 1232, 228, 727, 1232][index];
    const top = index < 3 ? 156 : 560;
    const centerX = frameLeft + (left + 230) * designScale;
    const centerY = frameTop + (top + 160) * designScale;
    const halfHeight = Math.tan(THREE.MathUtils.degToRad(camera.fov * 0.5)) * camera.position.z;
    const halfWidth = halfHeight * camera.aspect;
    const ndcX = (centerX / viewportWidth) * 2 - 1;
    const ndcY = 1 - (centerY / viewportHeight) * 2;
    const worldWidth = ((460 * designScale) / viewportWidth) * halfWidth * 2;
    return {
        x: ndcX * halfWidth,
        y: ndcY * halfHeight,
        scale: worldWidth / CARD_WIDTH,
    };
}

export function createThreeHelix(canvas, imageUrls) {
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    const scene = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    cam.position.set(0, 0, 13.5);

    const textureLoader = new THREE.TextureLoader();
    const pointer = new THREE.Vector2(2, 2);
    const raycaster = new THREE.Raycaster();
    const cards = [];
    const textures = [];
    let pointerActive = false;
    let hoveredCard = null;
    let progress = 0;
    let tickerFrame = 0;
    let tickerActive = false;
    let disposed = false;
    let loadedTextures = 0;
    let viewportWidth = 1;
    let viewportHeight = 1;

    const onTextureReady = () => {
        loadedTextures += 1;
        if (loadedTextures === imageUrls.length && !disposed) warmUp();
    };

    imageUrls.forEach((url) => {
        const texture = textureLoader.load(url, onTextureReady, undefined, onTextureReady);
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        textures.push(texture);
    });

    for (let index = 0; index < N; index += 1) {
        const mesh = new THREE.Mesh(
            createCardGeometry(),
            createCardMaterial(textures[index % textures.length])
        );
        mesh.userData.index = index;
        mesh.userData.hoverScale = 1;
        scene.add(mesh);
        cards.push(mesh);
    }

    const updateCard = (card, travelProgress, stageProgress, gridProgress) => {
        const pos = card.geometry.attributes.position;
        const C = W_SEGS + 1;
        // At progress 0 every card is below the path; at progress 1 even the
        // trailing card has cleared its upper end.
        const leadEndAngle = PATH_END_ANGLE + (N - 1) * CARD_STEP_ANGLE;
        const centerAngle =
            mix(PATH_START_ANGLE - ENTRY_ANGLE_OFFSET, leadEndAngle, travelProgress) -
            card.userData.index * CARD_STEP_ANGLE;
        const sArcWidth = CARD_WIDTH;
        const sArcStart = centerAngle * DS_PER_RAD - sArcWidth * 0.5;
        const center = hPos(centerAngle);
        const joinsFinalGrid = card.userData.index < FINAL_CARD_COUNT;
        const grid = joinsFinalGrid
            ? gridCenter(card.userData.index, cam, viewportWidth, viewportHeight)
            : null;
        const gridScale = grid?.scale ?? 1;
        const hoverScale = card.userData.hoverScale;
        const entryProgress = joinsFinalGrid ? gridProgress : 0;
        const departureOpacity = 1 - clamp01(stageProgress * 3);
        const arrivalOpacity = smoothstep(clamp01(entryProgress * 2.5));
        card.material.uniforms.opacity.value = joinsFinalGrid
            ? Math.max(departureOpacity, arrivalOpacity)
            : 1 - stageProgress;
        card.visible = joinsFinalGrid || stageProgress < 0.999;
        const entryAngle = THREE.MathUtils.degToRad(GRID_ENTRY_ANGLES[card.userData.index] ?? 0);
        const halfHeight = Math.tan(THREE.MathUtils.degToRad(cam.fov * 0.5)) * cam.position.z;
        const halfWidth = halfHeight * cam.aspect;
        const sourceX = Math.cos(entryAngle) * halfWidth * 2;
        const sourceY = Math.sin(entryAngle) * halfHeight * 2;

        for (let col = 0; col < C; col += 1) {
            const angle = (sArcStart + (col / W_SEGS) * sArcWidth) / DS_PER_RAD;
            const cpX = HELIX_X + R * Math.cos(angle);
            const gaussian = dip(angle);
            const cpY = HELIX_Y + Y_START + angle * PITCH_PER_RAD - gaussian;
            const cpZ = R * Math.sin(angle);
            const dipSlope = (-2 * (angle - MID) * gaussian) / (DIP_S * DIP_S);
            const slope = PITCH_PER_RAD - dipSlope;
            const upLength = Math.sqrt(R * R + slope * slope);
            const ux = (slope * Math.cos(angle)) / upLength;
            const uy = R / upLength;
            const uz = (slope * Math.sin(angle)) / upLength;

            for (let row = 0; row < 2; row += 1) {
                const vertex = row * C + col;
                const offsetAmt = (0.5 - row) * CARD_HEIGHT;
                const helixX = center.x + (cpX + ux * offsetAmt - center.x) * hoverScale;
                const helixY = center.y + (cpY + uy * offsetAmt - center.y) * hoverScale;
                const helixZ = center.z + (cpZ + uz * offsetAmt - center.z) * hoverScale;
                const localX = (col / W_SEGS - 0.5) * CARD_WIDTH;
                const flatX = joinsFinalGrid ? grid.x + localX * grid.scale * hoverScale : helixX;
                const flatY = joinsFinalGrid
                    ? grid.y + offsetAmt * grid.scale * hoverScale
                    : helixY;
                const sourceFlatX = sourceX + localX * gridScale * hoverScale;
                const sourceFlatY = sourceY + offsetAmt * gridScale * hoverScale;
                const stagedX = joinsFinalGrid ? mix(helixX, sourceFlatX, stageProgress) : helixX;
                const stagedY = joinsFinalGrid ? mix(helixY, sourceFlatY, stageProgress) : helixY;
                const stagedZ = joinsFinalGrid ? mix(helixZ, 0, stageProgress) : helixZ;

                pos.setXYZ(
                    vertex,
                    mix(stagedX, flatX, entryProgress),
                    mix(stagedY, flatY, entryProgress),
                    mix(stagedZ, 0, entryProgress)
                );
            }
        }

        pos.needsUpdate = true;
        card.geometry.computeBoundingSphere();
    };

    const updateGeometry = () => {
        const timelineProgress = toTimelineProgress(progress);
        const travelProgress = clamp01(timelineProgress / HELIX_TRAVEL_END);
        const stageProgress = smoothstep(
            clamp01((timelineProgress - GRID_STAGE_START) / GRID_STAGE_DURATION)
        );
        cards.forEach((card) => {
            const order = GRID_ENTRY_ORDER[card.userData.index] ?? FINAL_CARD_COUNT;
            const entryStart = GRID_ENTRY_START + order * GRID_ENTRY_DELAY;
            const gridProgress = smoothstep(
                clamp01((timelineProgress - entryStart) / GRID_ENTRY_DURATION)
            );
            updateCard(card, travelProgress, stageProgress, gridProgress);
        });
    };

    const updateHover = () => {
        hoveredCard = null;
        if (pointerActive) {
            raycaster.setFromCamera(pointer, cam);
            const hits = raycaster.intersectObjects(
                cards.filter((card) => card.visible),
                false
            );
            if (hits.length > 0) hoveredCard = hits[0].object;
        }

        for (let index = 0; index < N; index += 1) {
            const current = cards[index].userData.hoverScale ?? 1;
            const target = cards[index] === hoveredCard ? 1.12 : 1;
            const next = current + (target - current) * HOVER_LERP_K;
            cards[index].userData.hoverScale = Math.abs(target - next) < 0.001 ? target : next;
        }
    };

    const renderTick = () => {
        updateHover();
        updateGeometry();
        renderer.render(scene, cam);
    };

    const tick = () => {
        if (!tickerActive || disposed) {
            tickerFrame = 0;
            return;
        }
        renderTick();
        tickerFrame = requestAnimationFrame(tick);
    };

    const startTicker = () => {
        tickerActive = true;
        if (!tickerFrame) tickerFrame = requestAnimationFrame(tick);
    };

    const stopTicker = () => {
        tickerActive = false;
        cancelAnimationFrame(tickerFrame);
        tickerFrame = 0;
    };

    function warmUp() {
        if (disposed) return;
        const wasVisible = cards.map((mesh) => mesh.visible);
        cards.forEach((mesh) => {
            mesh.visible = true;
        });
        renderer.compile(scene, cam);
        renderer.render(scene, cam);
        cards.forEach((mesh, index) => {
            mesh.visible = wasVisible[index];
        });
        renderer.clear();
        renderTick();
    }

    const render = (nextProgress = progress) => {
        progress = clamp01(nextProgress);
        renderTick();
    };

    const updatePointer = (event) => {
        const rect = canvas.getBoundingClientRect();
        pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        pointerActive = true;
        if (!tickerActive) renderTick();
    };

    const clearPointer = () => {
        pointerActive = false;
        hoveredCard = null;
        if (!tickerActive) renderTick();
    };

    const resize = () => {
        const width = Math.max(1, canvas.clientWidth);
        const height = Math.max(1, canvas.clientHeight);
        viewportWidth = width;
        viewportHeight = height;
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.setSize(width, height, false);
        cam.aspect = width / height;
        cam.position.z = cam.aspect < 1.35 ? 15.5 : 13.5;
        cam.updateProjectionMatrix();
        cam.updateMatrixWorld();
        renderTick();
    };

    canvas.addEventListener('pointermove', updatePointer);
    canvas.addEventListener('pointerleave', clearPointer);
    resize();
    warmUp();

    return {
        render,
        resize,
        setActive(active) {
            active ? startTicker() : stopTicker();
        },
        dispose() {
            disposed = true;
            stopTicker();
            canvas.removeEventListener('pointermove', updatePointer);
            canvas.removeEventListener('pointerleave', clearPointer);
            cards.forEach((card) => {
                card.geometry.dispose();
                card.material.dispose();
            });
            textures.forEach((texture) => texture.dispose());
            renderer.dispose();
        },
    };
}
