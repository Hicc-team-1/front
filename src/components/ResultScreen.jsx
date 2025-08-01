import { useEffect, useRef, useState } from 'react';
import styles from './ResultScreen.module.css';
import 홍밥1 from '../assets/홍밥1.png';
import 홍밥3 from '../assets/홍밥3.png';
import 홍밥2 from '../assets/홍밥2.png';
import 영수증상단 from '../assets/영수증상단.png';
import 영수증하단 from '../assets/영수증하단.png';

export default function ResultScreen({ results, onFinish }) {
  const sentinelRef = useRef(null);
  const [canTrigger, setCanTrigger] = useState(false);
  const [scrollStart, setScrollStart] = useState(null);

  // ✅ 하단 도달 감지
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          console.log('✅ sentinel 감지됨');
          setCanTrigger(true);
          setScrollStart(window.scrollY);
        }
      },
      { threshold: 0.1 } // ✅ 완화: 10%만 보여도 감지
    );

    if (sentinelRef.current) observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, []);

  // ✅ 추가 스크롤 감지
  useEffect(() => {
    if (!canTrigger) return;
  
    const handleScroll = () => {
      const currentScroll = window.scrollY;
  
      // ✅ scrollStart가 null일 경우 보정
      if (scrollStart === null && sentinelRef.current) {
        const rect = sentinelRef.current.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          console.log('🛠️ 후속 감지: scrollStart 보정');
          setScrollStart(currentScroll);
        }
        return;
      }
  
      const diff = currentScroll - scrollStart;
      console.log('📏 추가 스크롤 거리:', diff);
  
      const isMobile = /Mobi|Android/i.test(navigator.userAgent);
      const scrollThreshold = isMobile ? 100 : 55;
  
      if (diff >= scrollThreshold) {
        console.log('🔥 FinalListScreen으로 이동');
        onFinish?.();
      }
    };
  
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [canTrigger, scrollStart, onFinish]);
  

  return (
    <div className={styles.screenWrapper}>
      {results?.map((data, index) => (
        <div key={index} className={styles.receiptShell}>
          <img src={영수증상단} className={styles.receiptEdgeTop} alt="영수증 상단" />

          <div className={styles.wrapper}>
            <div className={styles.container}>
              <div className={styles.header}>
                <img src={홍밥1} className={styles.icon1} />
                <div className={styles.badge}>홍밥이 선정<br />베스트 밥집 !</div>
              </div>

              <div className={styles.dottedLine}></div>

              <div className={styles.title}>여기 어때요?</div>
              <div className={styles.nameBox}>{data.name}</div>
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
                <strong>정확한 위치입니다!<br />지도를 누르면 네이버로 연결돼요<br/></strong>
                <img className={styles.mapImage} src={data.map} alt="지도" />
              </div>
            </div>
          </div>

          <img src={영수증하단} className={styles.receiptEdgeBottom} alt="영수증 하단" />
        </div>
      ))}

      {/* 안내 문구 및 감지용 sentinel */}
      <p className={styles.scrollNotice}>⬇️ 당겨서 최종 맛집 리스트를 확인하세요!</p>
      <div
        ref={sentinelRef}
        style={{ height: '100px', background: 'transparent', width: '100%' }}
      />
    </div>
  );
}
