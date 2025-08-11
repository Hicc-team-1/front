import { useEffect, useRef } from 'react';
import styles from './KakaoStaticMap.module.css';

export default function KakaoStaticMap({ lat, lng, level = 3 }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!window.kakao || !ref.current) return;

    window.kakao.maps.load(() => {
      const center = new window.kakao.maps.LatLng(Number(lat), Number(lng));
      ref.current.innerHTML = ''; // 재렌더 대비 초기화
      new window.kakao.maps.StaticMap(ref.current, {
        center,
        level,
        marker: [{ position: center }],
      });
    });
  }, [lat, lng, level]);

  return <div ref={ref} className={styles.mapContainer} />;
}
