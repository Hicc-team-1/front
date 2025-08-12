// src/api/payload.js
// 의미 있는 값만 서버로 보냅니다 (레벨값 → 실제 값 변환)

const distanceMap = { 1: 100, 2: 300, 3: 500, 4: 700, 5: 900, 6: null }; // m, 6=null → 제한 없음
const waitMap     = { 1: 10,  2: 20,  3: 30,  4: 40,  5: 50,  6: 60   }; // min
const priceMap    = { 1: 5000, 2: 10000, 3: 15000, 4: 20000, 5: 25000, 6: 30000 }; // KRW
const spicyMap    = { 1: '순한맛', 2: '신라면급', 3: '매운맛' };

// null/undefined 키 제거
function stripNulls(obj) {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== null && v !== undefined)
  );
}

export function buildPreferencePayload({
  selected, distance, waitTime, spicy, price, period, hour, minute, query
}) {
  const payload = {
    v: 1,
    cuisine: selected ?? null,
    maxDistanceMeters: distanceMap[distance] ?? null,
    maxWaitMinutes: waitMap[waitTime] ?? null,
    maxPriceKRW: priceMap[price] ?? null,
    spicyLabel: spicyMap[spicy] ?? null,
    mealTime: { period, hour, minute }, // 원본 그대로
    aiQuery: query ?? null,
    ts: Date.now()
  };

  return stripNulls(payload);
}
