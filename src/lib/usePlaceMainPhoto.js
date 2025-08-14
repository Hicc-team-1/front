import { useEffect, useState } from 'react';

export default function usePlaceMainPhoto(placeId, maxWidth = 800) {
  const [photoUrl, setPhotoUrl] = useState(null);
  const [attributions, setAttributions] = useState(null);

  useEffect(() => {
    if (!placeId) return;
    const g = window.google;
    if (!g?.maps?.places) return;

    const svc = new g.maps.places.PlacesService(document.createElement('div'));
    svc.getDetails({ placeId, fields: ['photos'] }, (place, status) => {
      if (status !== g.maps.places.PlacesServiceStatus.OK) return;
      const p = place?.photos?.[0];
      if (!p) return;
      setPhotoUrl(p.getUrl({ maxWidth }));
      // html_attributions는 문자열 배열. 필요 시 UI에 표시
      setAttributions(p.html_attributions || null);
    });
  }, [placeId, maxWidth]);

  return { photoUrl, attributions };
}
