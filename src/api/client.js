// src/api/client.js
// 공통 API 호출 유틸
// .env의 VITE_API_BASE_URL을 기반으로 요청을 보냅니다.

const BASE = import.meta.env.VITE_API_BASE_URL || '';

/**
 * HTTP 요청 함수
 * @param {string} path - API 경로 (예: "/api/recommendations")
 * @param {object} options - fetch 옵션 (method, body, signal 등)
 * @returns {Promise<any>} - JSON 응답
 */
export async function http(path, { method = 'GET', body, signal } = {}) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
    signal,
    credentials: 'include', // 세션 쿠키 필요하면 유지, 아니면 삭제 가능
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`HTTP ${res.status} ${res.statusText} :: ${text}`);
  }

  return res.json();
}
