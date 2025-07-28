import styles from './ResultScreen.module.css';
import 홍밥1 from './assets/홍밥1.png';
import 영수증상단 from './assets/영수증상단.png';
import 영수증하단 from './assets/영수증하단.png';

export default function ResultScreen({ results }) {
  const sampleResults = [
    {
      name: '미도인',
      stars: '★★★★☆',
      distance: '700m, 약 15분',
      reason: '가게 세부 설명 (2~3줄: 약 50자)\n+ 어떤 점에서 좋은지 (입력한 조건에 어떻게 충족하는지)',
      menus: [
        {
          name: '400스테이크 덮밥',
          price: '16,800원',
          desc: '400g이나 한 그릇에 담아 미도인 외 몇몇 찾아주신 회원분에게 정성껏 만들어 보답하겠습니다',
        },
        {
          name: '미도인 스테이크 덮밥',
          price: '11,300원',
          desc: '부드러운 스테이크를 올린 말이 필요없는 미도인 대표 메뉴',
        },
        {
          name: '미도인 마제소바',
          price: '10,300원',
          desc: '특제소스에 돼지고기 민찌를 볶아 고기고명과 부추, 대파, 김가루를 함께 비벼먹는 일본식 비빔면',
        },
      ],
      map: 'https://via.placeholder.com/300x200?text=Map',
    },
    {
      name: '홍밥이네',
      stars: '★★★★★',
      distance: '300m, 약 5분',
      reason: '가성비 좋은 밥집으로 소문난 곳\n+ 가까운 거리, 빠른 대기시간 조건에 부합',
      menus: [
        {
          name: '홍밥 김치찌개',
          price: '8,000원',
          desc: '얼큰한 국물에 돼지고기가 푸짐하게 들어간 김치찌개',
        },
        {
          name: '홍밥 제육볶음',
          price: '9,000원',
          desc: '매콤달콤한 양념과 부드러운 고기의 조화',
        },
      ],
      map: 'https://via.placeholder.com/300x200?text=Map2',
    },
  ];

  const displayResults = results || sampleResults;

  return (
    <div className={styles.screenWrapper}>
      {displayResults.map((data, index) => (
        <div key={index} className={styles.receiptShell}>
          <img src={영수증상단} alt="영수증상단" className={styles.receiptEdgeTop} />
          <div className={styles.wrapper}>
            <div className={styles.container}>
              <div className={styles.header}>
                <img src={홍밥1} className={styles.icon} />
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

              <div className={styles.dottedLine}></div>

              <div className={styles.menuList}>
                <strong>대표 메뉴</strong>
                {data.menus.map((menu, idx) => (
                  <div key={idx} className={styles.menuItem}>
                    <img src={홍밥1} alt="메뉴 이미지" />
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
                <p>정확한 위치입니다!<br />지도를 누르면 네이버로 연결돼요</p>
                <img className={styles.mapImage} src={data.map} alt="지도" />
              </div>
            </div>
          </div>
          <img src={영수증하단} alt="영수증하단" className={styles.receiptEdgeBottom} />
        </div>
      ))}
    </div>
  );
}
