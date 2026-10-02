import heroPosterUrl from "../../../public/videos/home-hero-poster.png?url";
import heroVideoUrl from "../../../public/videos/home-hero.mp4?url";
import { homeAssetEntries } from "./homeAssets";

const CRITICAL_NAMES = new Set([
  "home-hero-poster.png",
  "home-hero.mp4",
  "intro.svg",
  "location.svg",
]);

const UNUSED_NAMES = new Set([
  "notice.svg",
  ...Array.from(
    { length: 9 },
    (_, index) => `experience-ring-${index + 2}.png`,
  ),
]);

const SCROLL_ASSET_PATTERN =
  /^(drive-|experience-|vehicle-|spiral-|story-|guide-|program\.)/;
const LARGE_ASSET_THRESHOLD = 1024 * 1024;
const FALLBACK_ASSET_SIZE = 256 * 1024;
const decodedImages = new Map();
let homeAssetsPreloaded = false;

export function areHomeAssetsPreloaded() {
  return homeAssetsPreloaded;
}

function createManifest() {
  const entries = [
    { name: "home-hero-poster.png", url: heroPosterUrl },
    { name: "home-hero.mp4", url: heroVideoUrl },
    ...homeAssetEntries().filter(({ name }) => !UNUSED_NAMES.has(name)),
  ];
  const uniqueAssets = new Map();

  entries.forEach((asset) => {
    const existing = uniqueAssets.get(asset.url);
    if (existing) {
      existing.names.add(asset.name);
      return;
    }
    uniqueAssets.set(asset.url, { ...asset, names: new Set([asset.name]) });
  });

  return [...uniqueAssets.values()];
}

async function measureAsset(asset, signal) {
  try {
    const response = await fetch(asset.url, {
      method: "HEAD",
      cache: "force-cache",
      signal,
    });
    const size = Number(response.headers.get("content-length"));
    return {
      ...asset,
      size: Number.isFinite(size) && size > 0 ? size : FALLBACK_ASSET_SIZE,
    };
  } catch (error) {
    if (error.name === "AbortError") throw error;
    return { ...asset, size: FALLBACK_ASSET_SIZE };
  }
}

async function decodeImage(url, signal) {
  if (decodedImages.has(url)) return;
  if (signal.aborted) throw new DOMException("Loading aborted", "AbortError");

  const image = new Image();
  image.decoding = "async";
  image.src = url;
  await image.decode();
  decodedImages.set(url, image);
}

async function loadAsset(asset, signal, reportBytes) {
  let loadedBytes = 0;

  try {
    const response = await fetch(asset.url, { cache: "force-cache", signal });
    if (!response.ok)
      throw new Error(`Failed to preload ${asset.name}: ${response.status}`);

    if (response.body) {
      const reader = response.body.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        loadedBytes += value.byteLength;
        reportBytes(value.byteLength);
      }
    } else {
      loadedBytes = asset.size;
      reportBytes(asset.size);
    }

    if (!asset.name.endsWith(".mp4")) await decodeImage(asset.url, signal);
  } catch (error) {
    if (error.name === "AbortError") throw error;
    console.warn(error);
  } finally {
    if (loadedBytes < asset.size) reportBytes(asset.size - loadedBytes);
  }
}

async function loadBatch(assets, concurrency, load) {
  let cursor = 0;
  const workers = Array.from(
    { length: Math.min(concurrency, assets.length) },
    async () => {
      while (cursor < assets.length) {
        const asset = assets[cursor];
        cursor += 1;
        await load(asset);
      }
    },
  );
  await Promise.all(workers);
}

export async function preloadHomeAssets({ signal, onProgress }) {
  const measuredAssets = await Promise.all(
    createManifest().map((asset) => measureAsset(asset, signal)),
  );
  const totalBytes = measuredAssets.reduce((sum, asset) => sum + asset.size, 0);
  let loadedBytes = 0;
  const reportBytes = (bytes) => {
    loadedBytes = Math.min(totalBytes, loadedBytes + bytes);
    onProgress(Math.min(99, (loadedBytes / totalBytes) * 100));
  };

  const critical = measuredAssets.filter((asset) =>
    [...asset.names].some((name) => CRITICAL_NAMES.has(name)),
  );
  const rest = measuredAssets.filter((asset) => !critical.includes(asset));
  const large = rest
    .filter((asset) => asset.size >= LARGE_ASSET_THRESHOLD)
    .sort((a, b) => b.size - a.size);
  const afterLarge = rest.filter((asset) => !large.includes(asset));
  const scrollSensitive = afterLarge.filter((asset) =>
    [...asset.names].some((name) => SCROLL_ASSET_PATTERN.test(name)),
  );
  const remaining = afterLarge.filter(
    (asset) => !scrollSensitive.includes(asset),
  );
  const load = (asset) => loadAsset(asset, signal, reportBytes);

  await loadBatch(critical, 3, load);
  await loadBatch(large, 3, load);
  await loadBatch(scrollSensitive, 4, load);
  await loadBatch(remaining, 4, load);
  await document.fonts?.ready;
  homeAssetsPreloaded = true;
  onProgress(100);
}
