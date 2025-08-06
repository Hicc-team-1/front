// StartScreen.jsx
import React from 'react';
import styles from './StartScreen.module.css';
import 시작배경 from '../assets/시작배경.png';
import 홍밥1 from '../assets/홍밥1.png';
import 홍밥로고 from '../assets/홍밥로고.png';
import 말풍선 from '../assets/말풍선.png';

export default function StartScreen({ onStart }) {
  return (
    <div className={styles.container}>
      <div
        className={styles.bgImage}
        style={{ backgroundImage: `url(${시작배경})` }}
      />
      <div className={styles.content}>
        <div className={styles.speechBubbleWrapper}>
          <img src={말풍선} className={styles.speechBubbleImage} alt="말풍선" />
          <div className={styles.speechText}>
          식사 시간마다 <br />식당 고르기 힘드시다구요?<br />홍밥이가 해결해드려요!
          </div>
        </div>
        <img className={styles.logo} src={홍밥1} alt="로고" />
        <img className={styles.appLogo} src={홍밥로고} alt="홍밥 로고" />
        <button className={styles.startButton} onClick={onStart}>
          시작하기
        </button>
      </div>
    </div>
  );
}