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
    name: it.name ?? '',
    rating: Number(it.rating ?? 0),
    distance: Number(it.distance ?? 0),           // ✅ 숫자(m) 유지
    reason: it.reason ?? '',
    map: it.map ?? '',
    lat: Number(it.lat),
    lng: Number(it.lng),
    googlePlaceId: it.googlePlaceId ?? null,

    // googleReviews → 이름 제외, 2개만
    reviews: Array.isArray(it.googleReviews)
      ? it.googleReviews.slice(0, 2).map(r => ({
          rating: Number(r.rating ?? 0),
          when: r.relativeTimeDescription ?? '',
          text: r.text ?? '',
        }))
      : [],
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
