// StartScreen.jsx
import React from 'react';
import styles from './StartScreen.module.css';
import 시작배경 from './assets/시작배경.png';
import 홍밥1 from './assets/홍밥1.png';

export default function StartScreen({ onStart }) {
  return (
    <div className={styles.container}>
      <div
        className={styles.bgImage}
        style={{ backgroundImage: `url(${시작배경})` }}
      />
      <div className={styles.content}>
        <div className={styles.speechBubble}>식사 시간마다 <br />식당 고르기 힘드시다구요? <br />홍밥이가 해결해드려요!</div>
        <img className={styles.logo} src={홍밥1} alt="로고" />
        <h1 className={styles.title}>홍밥</h1>
        <button className={styles.startButton} onClick={onStart}>
          시작하기
        </button>
      </div>
    </div>
  );
}