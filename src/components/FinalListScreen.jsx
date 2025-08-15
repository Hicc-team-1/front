import styles from './FinalListScreen.module.css';
import 영수증윗부분 from '../assets/영수증윗부분.png';
import 영수증아랫부분 from '../assets/영수증아랫부분.png';
import 홍밥3 from '../assets/홍밥3.png';
import 다시하기 from '../assets/다시하기.png';

// UA 체크: 모바일이면 true
function isMobileUA() {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent || navigator.vendor || '';
  return /android/i.test(ua) || /iphone|ipad|ipod/i.test(ua);
}

export default function FinalListScreen({ results, onBack }) {
  const isMobile = isMobileUA();

  return (
    <div className={styles.wrapper}>
      <img src={영수증윗부분} className={styles.receiptTop} alt="영수증 상단" />

      <div className={styles.container}>
        <div className={styles.innerOffset}>
          <div className={styles.dottedLine}></div>
          <div className={styles.title}>최종 리스트</div>
          <div className={styles.dottedLine}></div>

          {results?.map((item, index) => (
            <div key={index} className={styles.item}>
              <h3>{index + 1}. {item.name}</h3>

              {/* 추천 이유 */}
              <div className={styles.reasonBox}>
                <strong>추천 이유</strong>
                {String(item.reason || '')
                  .split('\n')
                  .map((line, i) => <div key={i}>{line}</div>)}
              

                {/* 카카오맵 실제 URL 표시 */}
                {item.map && (
                  <a
                    href={item.map}
                   target={isMobile ? undefined : '_blank'}
                   rel={isMobile ? undefined : 'noopener noreferrer'}
                   className={styles.kakaoLink}
                  >
                   {item.map}
                 </a>
               )}
              </div>
            </div>
          ))}

          <div className={styles.dottedLine}></div>
          <div className={styles.again}>
            마음에 드는 식당을 찾지 못하셨나요?<br />
            다시 한번 찾아볼게요!
          </div>
          <img
            src={다시하기}
            className={styles.againImage}
            alt="다시하기 버튼"
            onClick={onBack}
          />
          <img src={홍밥3} className={styles.character} alt="홍밥이" />
        </div>
      </div>

      <img src={영수증아랫부분} className={styles.receiptBottom} alt="영수증 하단" />
    </div>
  );
}
