import { useEffect, useRef } from 'react';
import styles from './KakaoStaticMap.module.css';

/**
 * Kakao StaticMap을 렌더링하되, 클릭 시 새창이 아니라
 * 같은 탭에서 link로 이동하도록 오버레이로 직접 처리합니다.
 */
export default function KakaoStaticMap({ lat, lng, level = 3, link }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current || !window.kakao?.maps) return;

    window.kakao.maps.load(() => {
      const center = new window.kakao.maps.LatLng(Number(lat), Number(lng));
      ref.current.innerHTML = ''; // 재렌더 대비
      new window.kakao.maps.StaticMap(ref.current, {
        center,
        level,
        marker: [{ position: center }],
      });
    });
  }, [lat, lng, level]);

  const handleClick = () => {
    if (!link) return;
    // ✅ 같은 탭으로 이동 (뒤로가기 가능)
    window.location.href = link;
  };

  return (
    <div className={styles.mapWrapper}>
      {/* 실제 지도: 클릭 불가(포인터 이벤트 차단) */}
      <div ref={ref} className={styles.mapContainer} />

      {/* 투명 오버레이: 우리가 클릭 처리 */}
      <button
        type="button"
        className={styles.mapOverlay}
        onClick={handleClick}
        aria-label="카카오 지도 열기"
      />
    </div>
  );
}
