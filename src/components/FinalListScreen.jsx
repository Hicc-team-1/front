import styles from './FinalListScreen.module.css';
import 영수증윗부분 from '../assets/영수증윗부분.png';
import 영수증아랫부분 from '../assets/영수증아랫부분.png';
import 홍밥3 from '../assets/홍밥3.png';

export default function FinalListScreen({ results, onBack }) {
  return (
    <div className={styles.wrapper}>
      <img src={영수증윗부분} className={styles.receiptTop} alt="영수증 상단" />

      <div className={styles.container}>
        <div className={styles.dottedLine}></div>
        <div className={styles.title}>최종 리스트</div>
        <div className={styles.dottedLine}></div>

        {results?.map((item, index) => (
          <div key={index} className={styles.item}>
            <h3>{index + 1}. {item.name}</h3>
            <ul>
              {item.menus.map((menu, idx) => (
                <li key={idx}>
                  {menu.name} - {menu.price}
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className={styles.dottedLine}></div>
        <div className={styles.again}>마음에 드는 식당을 찾지 못하셨나요?<br />다시 한번 찾아볼게요!</div>
        <button className={styles.backBtn} onClick={onBack}>🔙 다시 찾기</button>
        <img src={홍밥3} className={styles.character} alt="홍밥이" />
      </div>

      <img src={영수증아랫부분} className={styles.receiptBottom} alt="영수증 하단" />
    </div>
  );
}
