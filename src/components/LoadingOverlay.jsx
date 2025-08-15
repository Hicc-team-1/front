// components/LoadingOverlay.jsx
import styles from "./LoadingOverlay.module.css";

export default function LoadingOverlay() {
  return (
    <div className={styles.loadingOverlay}>
      <div className={styles.spinner}></div>
      <p>검색 중입니다...</p>
    </div>
  );
}
