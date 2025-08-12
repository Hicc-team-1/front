// src/api/recommend.js
// 추천 API 요청 + 응답 정규화 유틸

import { http } from './client.js';
import { buildPreferencePayload } from './payload.js';

/**
 * 백엔드 응답 items[] → 화면에서 바로 쓰기 좋은 형태로 변환
 * ResultScreen / FinalListScreen 스키마에 맞춤
 * @param {Array<any>} items
 * @returns {Array<{
 *  name:string, stars:string, distance:string, reason:string,
 *  map:string, lat:number, lng:number,
 *  menus:Array<{name:string, price:string, desc:string}>
 * }>}
 */
export function normalizeItems(items = []) {
  return items.map((it) => ({
    name: it.name,
    stars: `⭐ ${Number(it.stars ?? 0).toFixed(1)}`,
    distance: it.distance_text ?? '',
    reason: it.reason ?? '',
    map: it.map_url,
    lat: Number(it.lat),
    lng: Number(it.lng),
    menus: (it.menus || []).map((m) => ({
      name: m.name,
      price:
        typeof m.price === 'number'
          ? `₩${m.price.toLocaleString()}`
          : (m.price ?? ''),
      desc: m.desc ?? '',
    })),
  }));
}

/**
 * 추천 요청
 * @param {object} selectData - SelectScreen에서 올라온 선택값
 * @param {string} query - AIInputSheet 자연어 질문(없으면 '')
 * @param {{signal?:AbortSignal}} opts
 * @returns {Promise<ReturnType<typeof normalizeItems>>}
 */
export async function requestRecommendations(selectData, query = '', { signal } = {}) {
  const payload = buildPreferencePayload({ ...selectData, query });
  const data = await http('/api/recommendations', {
    method: 'POST',
    body: payload,
    signal,
  });

  // 방어적 처리: data.items가 없거나 배열이 아니면 빈 배열로
  const items = Array.isArray(data?.items) ? data.items : [];
  return normalizeItems(items);
}
