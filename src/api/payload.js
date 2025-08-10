// src/api/payload.js
// 의미 있는 값만 서버로 보냅니다 (레벨값 X)

const distanceMap = { 1: 100, 2: 300, 3: 500, 4: 700, 5: 900, 6: 1000 };      // m
const waitMap     = { 1: 10,  2: 20,  3: 30,  4: 40,  5: 50,  6: 60   };      // min
const priceMap    = { 1: 5000,2: 10000,3: 15000,4: 20000,5: 25000,6: 30000 }; // KRW
const spicyMap    = { 1: '순한맛', 2: '신라면급', 3: '매운맛' };

export function buildPreferencePayload({
  selected, distance, waitTime, spicy, price, period, hour, minute, query
}) {
  return {
    v: 1,
    cuisine: selected ?? null,
    maxDistanceMeters: distanceMap[distance] ?? null,
    maxWaitMinutes:    waitMap[waitTime] ?? null,
    maxPriceKRW:       priceMap[price] ?? null,
    spicyLabel:        spicyMap[spicy] ?? null,
    mealTime: { period, hour, minute },
    aiQuery: query ?? null,
    ts: Date.now(),
  };
}
