// src/api/payload.js
// ✅ 백엔드 GET /api/places/nearby-genre 에 맞춘 파라미터 빌더

// 슬라이더 레벨 → 미터
const distanceMap = { 1: 100, 2: 300, 3: 500, 4: 700, 5: 900, 6: 1000 };

/** null/undefined/빈문자 제거 */
function stripNulls(obj) {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => {
      if (v === null || v === undefined) return false;
      if (typeof v === 'string' && v.trim() === '') return false;
      return true;
    })
  );
}

/** 서버 허용 포맷으로 when 문자열 생성
 * 예) "오전 11시", "오후 6:05", "11:30"
 */
export function toWhenParam({ period, hour, minute } = {}) {
  const h = (hour ?? '').toString().trim();
  const m = (minute ?? '').toString().trim();

  if (!period && !h && !m) return '';

  const hh = h ? String(Number(h)) : '';
  const mm = m ? String(Number(m)).padStart(2, '0') : '';

  if (period) {
    if (hh && mm && mm !== '00') return `${period} ${hh}:${mm}`; // "오후 6:05"
    if (hh) return `${period} ${hh}시`;                          // "오후 6시"
    return '';
  }
  if (hh && mm && mm !== '00') return `${hh}:${mm}`;             // "11:30"
  if (hh) return `${hh}시`;                                      // "11시"
  return '';
}

/** SelectScreen 값 + query → 백엔드 쿼리 파라미터 객체 */
export function buildPreferencePayload({
  selected,         // 장르 (예: '한식')
  distance,         // 거리 슬라이더 레벨(1~6)
  spicy,            // 0~3 (숫자 그대로)
  period, hour, minute,
  query,            // 자연어
} = {}) {
  const when = toWhenParam({ period, hour, minute });
  const payload = {
    genre: selected ?? null,
    radius: distanceMap[distance] ?? null, // m
    spicy: typeof spicy === 'number' ? spicy : null, // 0~3
    q: query ?? null,
    when: when || null,
    
  };
  return stripNulls(payload);
}

/** 쿼리스트링 만들 때 편하게 쓰는 유틸 */
export function toQueryString(paramsObj) {
  return new URLSearchParams(stripNulls(paramsObj)).toString();
}
