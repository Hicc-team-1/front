import { useEffect, useState, useRef } from 'react';
import styles from './AIinputSheet.module.css';
import 홍밥1 from '../assets/홍밥1.png';
import 말풍선 from '../assets/말풍선.png';

export default function AIInputSheet({ isOpen, onClose, onSearch, loading=false }) {
  const [dragStartY, setDragStartY] = useState(null);
  const [dragHeight, setDragHeight] = useState(() => window.innerHeight * 0.1);
  const [isDragging, setIsDragging] = useState(false);
  const [query, setQuery] = useState('');
  const pointerIdRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setDragHeight(window.innerHeight * 0.1);
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  const handleStart = (y) => {
    setDragStartY(y);
    setIsDragging(true);
  };

  const handleMove = (y) => {
    if (dragStartY === null) return;
    const offset = dragStartY - y;
    const winH = window.innerHeight;

    // 10% ~ 80% 사이로 클램프
    const minH = winH * 0.1;
    const maxH = winH * 0.8;
    const next = Math.min(maxH, Math.max(minH, dragHeight + offset));
    setDragHeight(next);
  };

  const handleEnd = () => {
    const winH = window.innerHeight;
    const threshold = winH * 0.4;
    setDragHeight((h) => (h > threshold ? winH * 0.8 : winH * 0.1));
    setDragStartY(null);
    setIsDragging(false);
  };

  const handleSearch = () => {
    if (query.trim()) onSearch?.(query.trim());
  };

  return (
    <>
      {/* ✅ 드래그가 크게 열렸을 때만 백그라운드 dim */}
      {dragHeight > window.innerHeight * 0.3 && (
        <div className={styles.dimmedBackground} onClick={onClose} />
      )}

      <div
        className={`${styles.sheet} ${isDragging ? styles.dragging : ''}`}
        style={{ height: `${dragHeight}px` }}
        onPointerDown={(e) => {
          e.stopPropagation();
          handleStart(e.clientY);
          pointerIdRef.current = e.pointerId;
          e.currentTarget.setPointerCapture?.(e.pointerId);
        }}
        onPointerMove={(e) => {
          e.stopPropagation();
          if (dragStartY !== null) handleMove(e.clientY);
        }}
        onPointerUp={(e) => {
          e.stopPropagation();
          handleEnd();
          if (pointerIdRef.current != null) {
            e.currentTarget.releasePointerCapture?.(pointerIdRef.current);
            pointerIdRef.current = null;
          }
        }}
        onPointerCancel={(e) => {
          if (pointerIdRef.current != null) {
            e.currentTarget.releasePointerCapture?.(pointerIdRef.current);
            pointerIdRef.current = null;
          }
          handleEnd();
        }}
      >
        <div className={styles.dragHandle} />

        <div className={styles.content}>
          {dragHeight > window.innerHeight * 0.3 ? (
            <>
              <div className={styles.speechBubbleWrapper}>
                <img src={말풍선} className={styles.speechBubbleImage} alt="말풍선" />
              </div>

              <img className={styles.logo} src={홍밥1} alt="로고" />

              <input
                type="text"
                placeholder="예: 근처 맛집 추천해줘"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSearch();
                }}
                aria-label="AI에게 물어보기 입력창"
              />

              <button className={styles.searchButton} onClick={handleSearch} disabled={loading}>
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
