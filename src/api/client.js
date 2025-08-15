// src/api/client.js
const BASE = import.meta.env.VITE_API_BASE_URL || '';

export async function http(path, { method = 'GET', body, signal, withCredentials = false } = {}) {
  const headers = {};
  // body가 있을 때만 JSON 헤더 추가 (GET + 헤더 ⇒ 프리플라이트 유발)
  if (body != null && method !== 'GET') {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body != null ? JSON.stringify(body) : undefined,
    signal,
    // 🔑 기본은 자격증명 전송 안 함
    credentials: withCredentials ? 'include' : 'omit',
    mode: 'cors',
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`HTTP ${res.status} ${res.statusText} :: ${text}`);
  }
  return res.json();
}
