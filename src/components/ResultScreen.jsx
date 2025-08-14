import { useEffect, useRef, useState } from 'react';
import styles from './ResultScreen.module.css';
import 홍밥1 from '../assets/홍밥1.png';
import 홍밥3 from '../assets/홍밥3.png';
// import 홍밥2 from '../assets/홍밥2.png'; // 👋 대표메뉴 제거로 더 이상 사용하지 않음
import 식당제목 from '../assets/식당제목.png';
import 영수증상단 from '../assets/영수증상단.png';
import 영수증하단 from '../assets/영수증하단.png';
import KakaoStaticMap from './KakaoStaticMap';
import 다시하기 from '../assets/다시하기.png';
import StarRating from '../components/StarRating.jsx';

/** (옵션) 구글 Place 사진 1장 로드 훅
 *  - index.html에 Maps JS + Places 라이브러리 로드되어 있으면 동작
 *  - 없으면 자동으로 폴백 이미지 사용
 */
function usePlaceMainPhoto(placeId, maxWidth = 800) {
  const [photoUrl, setPhotoUrl] = useState(null);

  useEffect(() => {
    if (!placeId) return;
    const g = window.google;
    if (!g?.maps?.places) return; // 스크립트 미로딩 시 폴백으로 둠

    const svc = new g.maps.places.PlacesService(document.createElement('div'));
    svc.getDetails({ placeId, fields: ['photos'] }, (place, status) => {
      if (status !== g.maps.places.PlacesServiceStatus.OK) return;
      const p = place?.photos?.[0];
      if (!p) return;
      setPhotoUrl(p.getUrl({ maxWidth }));
    });
  }, [placeId, maxWidth]);

  return photoUrl;
}

export default function ResultScreen({ results, onFinish, onRestart = () => {} }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scrollPercent, setScrollPercent] = useState(0);
  const [canTrigger, setCanTrigger] = useState(false);
  const sentinelRef = useRef(null);
  const scrollStart = useRef(null);
  const timeoutRef = useRef(null);

  const currentData = results?.[currentIndex];
  const photoUrl = usePlaceMainPhoto(currentData?.googlePlaceId, 800);

  // 하단 감지 시작
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !scrollStart.current) {
          setCanTrigger(true);
          scrollStart.current = window.scrollY;
        }
      },
      { threshold: 0.1 }
    );

    if (sentinelRef.current) observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, []);

  // 스크롤 게이지 & 카드 전환
  useEffect(() => {
    if (!canTrigger) return;

    const handleScroll = () => {
      const currentScroll = window.scrollY;
      const start = scrollStart.current ?? currentScroll;
      const diff = currentScroll - start;
      const scrollThreshold = 60; // px

      const percent = Math.min((diff / scrollThreshold) * 100, 100);
      setScrollPercent(percent);

      if (percent >= 100 && timeoutRef.current === null) {
        timeoutRef.current = setTimeout(() => {
          if (currentIndex < results.length - 1) {
            setCurrentIndex((prev) => prev + 1);
            scrollStart.current = null;
            setScrollPercent(0);
            setCanTrigger(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else {
            onFinish?.();
          }
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }, 1000); // 게이지 다 차고 1초 후 전환
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [canTrigger, currentIndex, results.length, onFinish]);

  // 빈 결과
  if (!currentData) {
    return (
      <div className={styles.emptyWrapper}>
        <div className={styles.emptyText}>
          조건에 맞는 결과가 없어요 😢<br />
          조건을 완화해서 다시 시도해 주세요.
        </div>
        <img
          src={다시하기}
          alt="다시하기 버튼"
          className={styles.emptyRestartBtn}
          onClick={onRestart}
        />
      </div>
    );
  }

  const isLast = currentIndex === results.length - 1;
  const nextCta = isLast ? '최종리스트 보러가기' : `${currentIndex + 2}번째 식당 보러가기`;

  return (
    <div className={styles.screenWrapper}>
      <div className={styles.receiptShell}>
        <img src={영수증상단} className={styles.receiptEdgeTop} alt="영수증 상단" />

        <div className={styles.wrapper}>
          <div className={styles.container}>
            <div className={styles.header}>
              {/* 좌상단 배지 */}
              <img src={홍밥1} className={styles.icon1} alt="홍밥이" />
              <div className={styles.badge}>
                홍밥이 선정<br />베스트 밥집 {currentIndex + 1}
              </div>
            </div>

            <div className={styles.dottedLine}></div>
            <div className={styles.title}>여기 어때요?</div>

            {/* 식당명 */}
            <div className={styles.nameBoxWithBg}>
              <img src={식당제목} className={styles.nameBoxBg} alt="식당 제목 배경" />
              <div className={styles.nameText}>{currentData.name}</div>
            </div>

            {/* 대표 이미지: 구글 사진 → 폴백 */}
            <img
              className={styles.mainImage}
              src={photoUrl || 홍밥1}
              alt="대표 이미지"
            />

            {/* 평점 & 거리 */}
            <div className={styles.ratingRow}>
              <StarRating rating={currentData.rating ?? currentData.stars} />
              <span className={styles.distance}>📍 {currentData.distance} m</span>
            </div>

            <div className={styles.dottedLine}></div>

            {/* 추천 이유 */}
            <div className={styles.reasonBox}>
              <strong>추천 이유는 말이죠!</strong><br />
              {String(currentData.reason || '')
                .split('\n')
                .map((line, i) => (
                  <div key={i}>{line}</div>
                ))}
            </div>

            <div className={styles.lineWithIcon}>
              <div className={styles.dottedLine}></div>
              <img src={홍밥3} className={styles.icon2} alt="홍밥이" />
            </div>

            {/* ✅ 리뷰(최대 2개), 리뷰자 이름 노출 X */}
            {currentData.reviews?.length > 0 && (
              <div className={styles.reviewsBox}>
                <strong>리뷰</strong>
                {currentData.reviews.map((rv, idx) => (
                  <div key={idx} className={styles.reviewItem}>
                    <div className={styles.reviewHeader}>
                      <span className={styles.reviewRating}>⭐ {Number(rv.rating ?? 0).toFixed(1)}</span>
                      {rv.when && <span className={styles.reviewWhen}> · {rv.when}</span>}
                    </div>
                    <div className={styles.reviewText}>{rv.text}</div>
                  </div>
                ))}
              </div>
            )}

            <div className={styles.dottedLine}></div>

            {/* 지도 */}
            <div className={styles.mapSection}>
              <strong>정확한 위치입니다!<br />지도를 누르면 카카오 지도가 열려요<br /></strong>
              <KakaoStaticMap
                lat={currentData.lat}
                lng={currentData.lng}
                level={3}
                link={currentData.map}  // 같은 탭에서 이 링크로 이동
              />

              
            </div>
          </div>
        </div>

        <img src={영수증하단} className={styles.receiptEdgeBottom} alt="영수증 하단" />
      </div>

      {/* 하단 스크롤 유도 영역 */}
      <div className={styles.scrollTrigger} ref={sentinelRef}>
        <img src={영수증상단} className={styles.receiptEdgeTop} alt="영수증 상단 (배너)" />
        <div className={styles.wrapper}>
          <div className={styles.scrollFixedText}>{nextCta}</div>
          <div className={styles.scrollProgressBarWrapper}>
            <div
              className={styles.scrollProgressBar}
              style={{ width: `${scrollPercent}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
