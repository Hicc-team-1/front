
// ✅ 새 버전: Place + fetchFields + Photo.getURI()
import { useEffect, useState } from 'react';

export function usePlaceMainPhoto(placeId, maxWidth = 800) {
  const [photoUrl, setPhotoUrl] = useState(null);

  useEffect(() => {
    if (!placeId || !window.google) return;
    let cancelled = false;

    (async () => {
      try {
        // 새 로더 방식: 필요한 순간에 places 라이브러리 로드
        const { Place } = await google.maps.importLibrary('places');

        // placeId로 Place 인스턴스 생성
        const place = new Place({ id: placeId });

        // 필요한 필드만 요청 (요금/성능 최적화)
        await place.fetchFields({ fields: ['photos'] });

        const photo = place.photos?.[0];
        if (!cancelled && photo) {
          // 새 API는 getURI 사용 (크기 지정 가능)
          const uri = photo.getURI({ maxWidth });
          setPhotoUrl(uri);
        }
      } catch (err) {
        console.error('Place photo fetch failed:', err);
      }
    })();

    return () => { cancelled = true; };
  }, [placeId, maxWidth]);

  return photoUrl;
}

