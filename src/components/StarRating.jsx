import styles from './StarRating.module.css';

/**
 * 구글 평점(0~5)을 별 5개로 표시. 0.5 단위 반영.
 * ex) 4.3 → 4개 꽉찬 별 + 1개 50% 채움
 */
export default function StarRating({ rating = 0, size = 18, className = '' }) {
  // 0~5 범위로 클램프 + 0.5 단위 반올림
  const value = Math.max(0, Math.min(5, Math.round(Number(rating || 0) * 2) / 2));

  // 각 별의 채움 비율(0, 50, 100) 계산
  const fills = Array.from({ length: 5 }, (_, i) => {
    const base = i + 1;
    if (value >= base) return 100;
    if (value >= base - 0.5) return 50;
    return 0;
  });

  return (
    <div
      className={`${styles.wrap} ${className}`}
      aria-label={`별점 ${value} / 5`}
      title={`${value.toFixed(1)} / 5`}
    >
      {fills.map((pct, i) => (
        <Star key={i} size={size} fillPercent={pct} />
      ))}
      <span className={styles.scoreText}>{value.toFixed(1)}</span>
    </div>
  );
}

function Star({ size, fillPercent }) {
  const id = Math.random().toString(36).slice(2); // gradient id 충돌 방지
  const fillStop = `${fillPercent}%`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={styles.star}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={id}>
          {/* 채워진 부분 */}
          <stop offset={fillStop} stopColor="currentColor" />
          {/* 비어있는 부분(연한 색) */}
          <stop offset={fillStop} stopColor="rgba(0,0,0,0.15)" />
        </linearGradient>
      </defs>
      <path
        fill={`url(#${id})`}
        d="M12 2l2.9 5.88 6.5.95-4.7 4.58 1.1 6.49L12 17.77 6.2 19.9l1.1-6.49-4.7-4.58 6.5-.95L12 2z"
      />
    </svg>
  );
}
