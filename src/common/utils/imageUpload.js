export async function compressProfileImage(file) {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) throw new Error('JPEG, PNG, WebP 파일만 선택할 수 있습니다.');
  if (file.size > 5 * 1024 * 1024) throw new Error('5MB 이하의 이미지를 선택해 주세요.');
  const url = URL.createObjectURL(file);
  try {
    const image = await new Promise((resolve, reject) => { const img = new Image(); img.onload = () => resolve(img); img.onerror = reject; img.src = url; });
    const canvas = document.createElement('canvas'); canvas.width = 320; canvas.height = 320;
    const context = canvas.getContext('2d'); const size = Math.min(image.width, image.height);
    context.drawImage(image, (image.width - size) / 2, (image.height - size) / 2, size, size, 0, 0, 320, 320);
    for (const quality of [0.82, 0.68, 0.52, 0.38]) {
      const dataUrl = canvas.toDataURL('image/webp', quality);
      if (dataUrl.length * .75 < 500 * 1024) return dataUrl;
    }
    throw new Error('이미지를 충분히 압축할 수 없습니다. 다른 사진을 선택해 주세요.');
  } finally { URL.revokeObjectURL(url); }
}
