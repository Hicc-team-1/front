import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'  
import './index.css'

// ---- Google / Kakao 동적 로더 ----
function loadGoogleMaps(key) {
    if (window.google?.maps?.importLibrary) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const s = document.createElement('script');
      // 권장: loading=async, v=weekly. (libraries는 importLibrary에서 개별 로드)
      s.src = `https://maps.googleapis.com/maps/api/js?key=${key}&loading=async&v=weekly`;
      s.async = true;
      s.onerror = reject;
      s.onload = resolve;
      document.head.appendChild(s);
    });
  }
  
  function loadKakaoMaps(key) {
    if (window.kakao?.maps) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${key}&autoload=false`;
      s.async = true;
      s.onerror = reject;
      s.onload = () => window.kakao.maps.load(resolve); // autoload=false 대응
      document.head.appendChild(s);
    });
  }
  
// 필요 시: 초기에 로드(실패해도 앱은 렌더링)
loadGoogleMaps(import.meta.env.VITE_GOOGLE_MAPS_KEY).catch(() => {});
loadKakaoMaps(import.meta.env.VITE_KAKAO_MAP_KEY).catch(() => {});
  
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App /> 
  </React.StrictMode>
)

