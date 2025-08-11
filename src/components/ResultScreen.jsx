import { useEffect, useRef, useState } from 'react';
import styles from './ResultScreen.module.css';
import 홍밥1 from '../assets/홍밥1.png';
import 홍밥3 from '../assets/홍밥3.png';
import 홍밥2 from '../assets/홍밥2.png';
import 식당제목 from '../assets/식당제목.png';
import 영수증상단 from '../assets/영수증상단.png';
import 영수증하단 from '../assets/영수증하단.png';
import KakaoStaticMap from './KakaoStaticMap';

export default function ResultScreen({ results, onFinish }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scrollPercent, setScrollPercent] = useState(0);
  const [canTrigger, setCanTrigger] = useState(false);
  const sentinelRef = useRef(null);
  const scrollStart = useRef(null);
  const timeoutRef = useRef(null);

  const currentData = results?.[currentIndex];

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

  useEffect(() => {
    if (!canTrigger) return;

    const handleScroll = () => {
      const currentScroll = window.scrollY;
      const start = scrollStart.current ?? currentScroll;
      const diff = currentScroll - start;
      const scrollThreshold = 60;

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
        }, 1000); // ✅ 게이지 다 차고 1초 후 전환
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [canTrigger, currentIndex, results.length, onFinish]);

  if (!currentData) return null;

  const isLast = currentIndex === results.length - 1;
  const nextCta = isLast ? '최종리스트 보러가기' : `${currentIndex + 2}번째 식당 보러가기`;

  return (
    <div className={styles.screenWrapper}>
      <div className={styles.receiptShell}>
        <img src={영수증상단} className={styles.receiptEdgeTop} alt="영수증 상단" />

        <div className={styles.wrapper}>
          <div className={styles.container}>
            <div className={styles.header}>
              <img src={홍밥1} className={styles.icon1} alt="홍밥이" />
              <div className={styles.badge}>
                홍밥이 선정<br />베스트 밥집 {currentIndex + 1}
              </div>
            </div>

            <div className={styles.dottedLine}></div>
            <div className={styles.title}>여기 어때요?</div>
            <div className={styles.nameBoxWithBg}>
              <img src={식당제목} className={styles.nameBoxBg} alt="식당 제목 배경" />
              <div className={styles.nameText}>{currentData.name}</div>
            </div>

            <img className={styles.mainImage} src={홍밥1} alt="대표 이미지" />

            <div className={styles.ratingRow}>
              <span className={styles.stars}>{currentData.stars}</span>
              <span className={styles.distance}>📍 {currentData.distance}</span>
            </div>

            <div className={styles.dottedLine}></div>
            <div className={styles.reasonBox}>
              <strong>추천 이유는 말이죠!</strong><br />
              {currentData.reason.split('\n').map((line, i) => (
                <div key={i}>{line}</div>
              ))}
            </div>

            <div className={styles.lineWithIcon}>
              <div className={styles.dottedLine}></div>
              <img src={홍밥3} className={styles.icon2} alt="홍밥이" />
            </div>

            <div className={styles.menuList}>
              <strong>대표 메뉴</strong>
              {currentData.menus.map((menu, idx) => (
                <div key={idx} className={styles.menuItem}>
                  <img src={홍밥2} alt="메뉴 이미지" />
                  <div>
                    <div className={styles.menuTitle}>
                      {menu.name}
                    </div>
                    <div className={styles.menuPrice}>{menu.price}</div>
                    <div>{menu.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.dottedLine}></div>
            <div className={styles.mapSection}>
              <strong>정확한 위치입니다!<br />지도를 누르면 카카오 지도가 열려요<br /></strong>
              <a href={currentData.map} target="_blank" rel="noopener noreferrer" aria-label="카카오 지도 열기">
                <KakaoStaticMap lat={currentData.lat} lng={currentData.lng} />
              </a>
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
