// One continuous cylindrical surface shared by every image strip.
export function createSpiralPath(width, height, cardCount = 12, slices = 24) {
    const radius = width * 0.37;
    const depth = radius * 0.65;
    const perspective = Math.max(1100, width * 0.85);
    const cardWidth = Math.min(360, Math.max(180, width * 0.18));
    const cardHeight = cardWidth * 320 / 460;
    // Solve the projected x position: enter at 1/3, leave at 2/3.
    let low = 0;
    let high = Math.PI / 2;
    for (let step = 0; step < 40; step += 1) {
        const angle = (low + high) / 2;
        const projectedX = radius * Math.sin(angle) * perspective /
            (perspective - depth * Math.cos(angle));
        if (projectedX < width / 6) low = angle;
        else high = angle;
    }
    const entryAngle = -(low + high) / 2;
    const exitDistance = Math.PI * 2 - 2 * entryAngle;
    const edgeScale = perspective / (perspective - depth * Math.cos(entryAngle));
    const entryY = height / 2 + cardHeight * edgeScale / 2;
    const pitch = entryY * 2 / exitDistance;
    const cardAngle = cardWidth / radius;
    const start = -0.7;
    const travel = exitDistance + cardCount * cardAngle - start + 0.7;
    return { radius, depth, perspective, cardWidth, cardHeight, pitch,
        entryAngle, entryY, exitDistance, cardAngle, start, travel, slices };
}

export function spiralStripPose(path, progress, card, slice) {
    const distance = path.start + progress * path.travel -
        (card + 1 - (slice + 0.5) / path.slices) * path.cardAngle;
    const angle = path.entryAngle + distance;
    const z = path.depth * Math.cos(angle);
    const inverseScale = 1 - z / path.perspective;
    const screenY = path.entryY - path.pitch * distance;
    // Tangent of the surface, per pixel of image width. Adjacent narrow
    // strips approximate a smooth surface instead of folding whole cards.
    return {
        x: path.radius * Math.sin(angle),
        y: screenY * inverseScale,
        z,
        dx: Math.cos(angle),
        dy: (-path.pitch * inverseScale + screenY * path.depth *
            Math.sin(angle) / path.perspective) / path.radius,
        dz: -path.depth / path.radius * Math.sin(angle),
    };
}
