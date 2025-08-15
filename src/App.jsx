import { useState, useRef, useEffect } from 'react';
import StartScreen from './components/StartScreen.jsx';
import SelectScreen from './components/SelectScreen.jsx';
import AIInputSheet from './components/AIinputSheet.jsx'; // ← 네 프로젝트 경로명 유지
import ResultScreen from './components/ResultScreen.jsx';
import FinalListScreen from './components/FinalListScreen.jsx';
import LoadingOverlay from './components/LoadingOverlay.jsx';

import { buildPreferencePayload } from './api/payload.js';
import { requestRecommendations } from './api/recommend.js';

const USE_SAMPLE = import.meta.env.VITE_USE_SAMPLE === 'true';

// ✅ 샘플 결과 데이터 (화면 확인용)
const sampleResults = [
  {
    name: '미도인',
    rating: 4.5,
    distance: 700,
    reason: '맛있고 가성비 좋음\n조건 만족',
    googlePlaceId: 'ChIJt3ZCOACZfDURJSCI8n1_Tbo',
    reviews: [
      { rating: 5, when: '1년 전', text: '국물 진하고 맛있어요. 혼밥하기도 좋아요.' },
      { rating: 4, when: '2개월 전', text: '양이 많고 가격도 적당합니다.' },
    ],
    map: 'http://place.map.kakao.com/1850685972',
    lat: 37.5563,
    lng: 126.922,
  },
  {
    name: '한식선생 홍대점',
    rating: 4.8,
    distance: 300,
    reason: '가성비+빠른 대기시간',
    googlePlaceId: 'ChIJyyyyyyyyyyyyyyyyyyy',
    reviews: [
      { rating: 5, when: '3주 전', text: '매콤한 제육볶음이 정말 맛있습니다.' },
      { rating: 4.5, when: '5일 전', text: '김치찌개가 아주 푸짐하고 국물 맛이 좋아요.' },
    ],
    map: 'http://place.map.kakao.com/1749518727',
    lat: 37.5536974225374,
    lng: 126.925172662023,
  },
];

function App() {
  // 화면 단계: 'start' | 'select' | 'result' | 'final'
  const [step, setStep] = useState('start');

  // Select + AIInputSheet
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectData, setSelectData] = useState(null); // { selected, distance, waitTime, spicy, price, period, hour, minute }

  // 결과
  const [results, setResults] = useState([]);

  // 로딩/오류
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // 요청 취소 제어
  const abortRef = useRef(null);

  const handleStart = () => setStep('select');

  // SelectScreen → 시트 열기 전에 선택값을 App으로 올려둠
  const handleOpenSheet = (dataFromSelect) => {
    setSelectData(dataFromSelect);
    setIsSheetOpen(true);
  };

  // AIInputSheet에서 "검색하기"
  const handleSearch = async (query) => {
    if (!selectData) return;

    const payload = buildPreferencePayload({ ...selectData, query });
    console.log('[SEND PAYLOAD]', payload);

    try {
      setLoading(true);
      setErrorMsg('');

      // 요청 취소를 위한 컨트롤러 생성
      abortRef.current = new AbortController();

      const data = USE_SAMPLE
        ? sampleResults
        : await requestRecommendations(selectData, query, {
            signal: abortRef.current.signal,
          });

      console.log('[API RESULTS]', data);

      setResults(data);
      // 검색 종료 후 시트 닫고, 약간의 딜레이 후 결과 화면으로
      setIsSheetOpen(false);
      setTimeout(() => setStep('result'), 300);
    } catch (e) {
      console.error(e);
      setErrorMsg(e?.message || '검색 중 오류가 발생했어요.');
      // 에러 시에는 시트는 열어둔 채로 재시도할 수도 있음(현재는 열려있던 상태 유지)
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  };

  // 결과화면 → 다시 선택 화면으로
  const handleRestart = () => {
    setResults([]);
    setStep('select');
  };

  // 언마운트 시 진행 중 요청이 있으면 취소
  useEffect(() => {
    return () => {
      if (abortRef.current) abortRef.current.abort();
    };
  }, []);

  return (
    <div>
      {step === 'start' && <StartScreen onStart={handleStart} />}

      {step === 'select' && (
        <>
          <SelectScreen
            onNext={handleOpenSheet}
            onChange={setSelectData} // 선택값 실시간 동기화
          />

          <AIInputSheet
            isOpen={isSheetOpen}
            onClose={() => setIsSheetOpen(false)}
            onSearch={handleSearch}  // 부모(App)에서 내려준 검색 실행
            loading={loading}        // 버튼 내부에 '검색 중...' 등 표시 용도(선택)
          />

          {/* 에러 메시지 간단 노출(원하면 토스트/모달로 대체 가능) */}
          {!!errorMsg && (
            <div
              style={{
                position: 'fixed',
                left: '50%',
                bottom: 24,
                transform: 'translateX(-50%)',
                background: '#fff7ef',
                border: '1px solid #f3d6c6',
                boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
                borderRadius: 12,
                padding: '10px 14px',
                fontSize: 13,
                color: '#b24',
                zIndex: 3500,
              }}
            >
              {errorMsg}
            </div>
          )}
        </>
      )}

      {step === 'result' && (
        <ResultScreen
          results={results}
          onFinish={() => setStep('final')}
          onRestart={() => {
            setResults([]);
            setStep('select');
          }}
        />
      )}

      {step === 'final' && (
        <FinalListScreen
          results={results}
          onBack={handleRestart}
        />
      )}

      {/* ✅ 오버레이 로딩: 모든 화면 위를 덮도록 마지막에 렌더 */}
      {loading && (
        <LoadingOverlay
          text="검색 중입니다..."
          subText="조건에 맞는 맛집을 찾고 있어요"
        />
      )}
    </div>
  );
}

export default App;
