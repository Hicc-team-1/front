import { useState, useEffect } from 'react';
import styles from './AIinputSheet.module.css';
import 홍밥1 from '../assets/홍밥1.png';

export default function AIInputSheet({ isOpen, onClose, onSearch }) {
  const [dragStartY, setDragStartY] = useState(null);
  const [dragHeight, setDragHeight] = useState(window.innerHeight * 0.1);
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setDragHeight(window.innerHeight * 0.1);
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  const handleStart = (y) => setDragStartY(y);

  const handleMove = (y) => {
    if (dragStartY !== null) {
      const offset = dragStartY - y;
      const windowHeight = window.innerHeight;
      const newHeight = Math.min(
        windowHeight * 0.8,
        Math.max(windowHeight * 0.1, dragHeight + offset)
      );
      setDragHeight(newHeight);
    }
  };

  const handleEnd = () => {
    const windowHeight = window.innerHeight;
    if (dragHeight > windowHeight * 0.4) {
      setDragHeight(windowHeight * 0.8);
    } else {
      setDragHeight(windowHeight * 0.1);
    }
    setDragStartY(null);
  };

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className={styles.overlay}
          onClick={onClose} // ⬅️ 배경 클릭 시 닫히게 하고 싶으면 유지
        ></div>
      )}

      <div
        className={styles.sheet}
        style={{ height: `${dragHeight}px` }}
        onTouchStart={(e) => {
          e.stopPropagation();
          handleStart(e.touches[0].clientY);
        }}
        onTouchMove={(e) => {
          e.stopPropagation();
          handleMove(e.touches[0].clientY);
        }}
        onTouchEnd={handleEnd}
        onMouseDown={(e) => {
          e.stopPropagation();
          handleStart(e.clientY);
        }}
        onMouseMove={(e) => {
          e.stopPropagation();
          if (dragStartY !== null) handleMove(e.clientY);
        }}
        onMouseUp={handleEnd}
        onMouseLeave={() => {
          if (dragStartY !== null) handleEnd();
        }}
      >
        <div className={styles.dragHandle}></div>
        <div className={styles.content}>
          {dragHeight > window.innerHeight * 0.3 ? (
            <>
              <div className={styles.speechBubble}>어떤 식당을 찾고 계신가요?</div>
              <img className={styles.logo} src={홍밥1} alt="로고" />
              <input
                type="text"
                placeholder="예: 근처 맛집 추천해줘"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSearch();
                }}
              />
              <button className={styles.searchButton} onClick={handleSearch}>
                검색하기
              </button>
            </>
          ) : (
            <p>AI 홍밥이에게 물어보기</p>
          )}
        </div>
      </div>
    </>
  );
}
