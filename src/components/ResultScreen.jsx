// ✅ ResultScreen.jsx 개선본 (scroll 진행률 게이지 표시 추가)
import { useEffect, useRef, useState } from 'react';
import styles from './ResultScreen.module.css';
import 홍밥1 from '../assets/홍밥1.png';
import 홍밥3 from '../assets/홍밥3.png';
import 홍밥2 from '../assets/홍밥2.png';
import 영수증상단 from '../assets/영수증상단.png';
import 영수증하단 from '../assets/영수증하단.png';
import 식당제목 from '../assets/식당제목.png';

export default function ResultScreen({ results, onFinish }) {
  const sentinelRef = useRef(null);
  const [canTrigger, setCanTrigger] = useState(false);
  const [scrollStart, setScrollStart] = useState(null);
  const [hasScrolledPast, setHasScrolledPast] = useState(false);
  const [scrollPercent, setScrollPercent] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setCanTrigger(true);
          setScrollStart(window.scrollY);
        }
      },
      { threshold: 0.1 }
    );

    if (sentinelRef.current) observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!canTrigger) return;

    const scrollThreshold = /Mobi|Android/i.test(navigator.userAgent) ? 50 : 25;

    const handleScroll = () => {
      let current = scrollStart;
      const currentScroll = window.scrollY;

      if (scrollStart === null && sentinelRef.current) {
        const rect = sentinelRef.current.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          setScrollStart(currentScroll);
          current = currentScroll;
        } else {
          return;
        }
      }

      const diff = currentScroll - current;

      const percent = Math.min((diff / scrollThreshold) * 100, 100);
      setScrollPercent(percent);

      if (diff >= scrollThreshold - 30) {
        setHasScrolledPast(true);
      } else {
        setHasScrolledPast(false);
      }

      if (diff >= scrollThreshold) {
        setTimeout(() => onFinish?.(), 300);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [canTrigger, scrollStart, hasScrolledPast, onFinish]);

  return (
    <div className={styles.screenWrapper}>
      {results?.map((data, index) => (
        <div key={index} className={styles.receiptShell}>
          <img src={영수증상단} className={styles.receiptEdgeTop} alt="영수증 상단" />

          <div className={styles.wrapper}>
            <div className={styles.container}>
              <div className={styles.header}>
                <img src={홍밥1} className={styles.icon1} alt="홍밥이" />
                <div className={styles.badge}>홍밥이 선정<br />베스트 밥집 !</div>
              </div>

              <div className={styles.dottedLine}></div>
              <div className={styles.title}>여기 어때요?</div>
              <div className={styles.nameBoxWithBg}>
                <img src={식당제목} className={styles.nameBoxBg} alt="식당 제목 배경" />
                <div className={styles.nameText}>{data.name}</div>
              </div>
              <img className={styles.mainImage} src={홍밥1} alt="대표 이미지" />

              <div className={styles.ratingRow}>
                <span className={styles.stars}>{data.stars}</span>
                <span className={styles.distance}>📍 {data.distance}</span>
              </div>

              <div className={styles.dottedLine}></div>
              <div className={styles.reasonBox}>
                <strong>추천 이유는 말이죠!</strong><br />
                {data.reason.split('\n').map((line, i) => (
                  <div key={i}>{line}</div>
                ))}
              </div>

              <div className={styles.lineWithIcon}>
                <div className={styles.dottedLine}></div>
                <img src={홍밥3} className={styles.icon2} alt="홍밥이" />
              </div>

              <div className={styles.menuList}>
                <strong>대표 메뉴</strong>
                {data.menus.map((menu, idx) => (
                  <div key={idx} className={styles.menuItem}>
                    <img src={홍밥2} alt="메뉴 이미지" />
                    <div>
                      <div className={styles.menuTitle}>
                        <span>best</span>
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
                <strong>정확한 위치입니다!<br />지도를 누르면 네이버로 연결돼요<br /></strong>
                <img className={styles.mapImage} src={data.map} alt="지도" />
              </div>
            </div>
          </div>

          <img src={영수증하단} className={styles.receiptEdgeBottom} alt="영수증 하단" />
        </div>
      ))}

      <div className={styles.scrollTrigger} ref={sentinelRef}>
        <div className={styles.scrollFixedText}>🔽 더 내리면 최종 리스트로 이동합니다!</div>
        {canTrigger && (
          <div className={styles.scrollProgressBarWrapper}>
            <div
              className={styles.scrollProgressBar}
              style={{ width: `${scrollPercent}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
}