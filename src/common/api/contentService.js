import { locations, exhibitions, programs, notices, news, demoProducts } from '../data/content';

const localData = { locations, exhibitions, programs, notices, news, products: demoProducts };

export async function getContent(type) {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  if (!baseUrl) return localData[type] ?? [];
  const response = await fetch(`${baseUrl}/${type}`);
  if (!response.ok) throw new Error('콘텐츠를 불러오지 못했습니다.');
  return response.json();
}

export async function getLocations() { return getContent('locations'); }
export async function getExhibitions() { return getContent('exhibitions'); }
export async function getPrograms() { return getContent('programs'); }
export async function getNotices() { return getContent('notices'); }
export async function getNews() { return getContent('news'); }
export async function getProducts() { return getContent('products'); }
