// src/api/recommend.js
import { http } from './client.js';
import { buildPreferencePayload, toQueryString } from './payload.js';

/** (선택) 리뷰 요약용 살짝 트림 */
const trimText = (t, n = 160) => {
  if (!t) return '';
  const s = String(t).replace(/\s+/g, ' ').trim();
  return s.length > n ? s.slice(0, n) + '…' : s;
};

/** 백엔드 KakaoPlaceDto 배열 → 화면에서 쓰는 구조로 정규화 */
export function normalizeItems(items = []) {
  return items.map((it) => ({
    // 핵심
    name: it.name ?? '',
    distance: Number(it.distance ?? 0),              // m (숫자)
    rating: Number(it.googleRating ?? 0),           // 숫자 별점
    reason: it.reason ?? '',

    // 위치/링크
    lat: it.lat != null ? Number(it.lat) : undefined,
    lng: it.lng != null ? Number(it.lng) : undefined,
    map: it.mapUrl ?? '',

    // ID
    kakaoId: it.kakaoId ?? null,
    googlePlaceId: it.googlePlaceId ?? null,

    // 리뷰(최대 2개, 작성자명은 UI에서 미표시)
    reviews: Array.isArray(it.googleReviews)
      ? it.googleReviews.slice(0, 2).map((r) => ({
          rating: Number(r.rating ?? 0),
          when: r.relativeTimeDescription ?? '',
          text: r.text ? trimText(r.text, 220) : '',
        }))
      : [],

    // (옵션) 부가
    category: it.category ?? '',
    address: it.address ?? '',
    openAtRequested: it.openAtRequested ?? null,
    reviewCount: it.googleReviewCount ?? null,
    businessStatus: it.googleBusinessStatus ?? '',
    reasonType: it.reasonType ?? '',
  }));
}

/**
 * 추천 요청
 * @param {object} selectData - SelectScreen 값들 { selected, distance, spicy, period, hour, minute }
 * @param {string} query - AI 입력 시트 자연어
 * @param {object} opts - { signal, extraParams } 테스트/디버그용 추가 파라미터 가능
 */
export async function requestRecommendations(selectData = {}, query = '', { signal, extraParams } = {}) {
  // 1) 선택값을 백엔드 스펙에 맞는 파라미터로 변환
  const baseParams = buildPreferencePayload({ ...selectData, query });

  // 2) 필요 시 테스트/완화 옵션 추가 (예: excludeUnknownOpen=false 등)
  const paramsObj = { ...baseParams, ...(extraParams || {}) };

  // 3) GET 쿼리스트링 구성
  const qs = toQueryString(paramsObj);

  // 4) 호출
  const res = await http(`/api/places/nearby-genre?${qs}`, { method: 'GET', signal });

  // 5) 응답 정규화
  const arr = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
  return normalizeItems(arr);
}
