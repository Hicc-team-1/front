import { useState, useRef } from 'react';
import StartScreen from './components/StartScreen.jsx';
import SelectScreen from './components/SelectScreen.jsx';
import AIInputSheet from './components/AIinputSheet.jsx';
import ResultScreen from './components/ResultScreen.jsx';
import FinalListScreen from './components/FinalListScreen.jsx';
import { buildPreferencePayload } from './api/payload.js';
import { requestRecommendations } from './api/recommend.js';
const USE_SAMPLE = import.meta.env.VITE_USE_SAMPLE === 'true';


// ✅ 샘플 결과 데이터 (화면 확인용)
// ✅ 샘플 결과 데이터 (화면 확인용)
const sampleResults = [
  {
    name: '미도인',
    rating: 4.5,
    distance: 700, // m
    reason: '맛있고 가성비 좋음\n조건 만족',
    googlePlaceId: "ChIJt3ZCOACZfDURJSCI8n1_Tbo",
    reviews: [
      {
        rating: 5,
        when: '1년 전',
        text: '국물 진하고 맛있어요. 혼밥하기도 좋아요.'
      },
      {
        rating: 4,
        when: '2개월 전',
        text: '양이 많고 가격도 적당합니다.'
      }
    ],
    map: 'http://place.map.kakao.com/1850685972',
    lat: 37.5563,
    lng: 126.9220,
  },
  {
    name: '한식선생 홍대점',
    rating: 4.8,
    distance: 300, // m
    reason: '가성비+빠른 대기시간',
    googlePlaceId: 'ChIJyyyyyyyyyyyyyyyyyyy',
    reviews: [
      {
        rating: 5,
        when: '3주 전',
        text: '매콤한 제육볶음이 정말 맛있습니다.'
      },
      {
        rating: 4.5,
        when: '5일 전',
        text: '김치찌개가 아주 푸짐하고 국물 맛이 좋아요.'
      }
    ],
    map: 'http://place.map.kakao.com/1749518727',
    lat: 37.5536974225374,
    lng: 126.925172662023,
  },
];


function App() {
  const [step, setStep] = useState('start');      // 'start' | 'select' | 'result' | 'final'
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [results, setResults] = useState([]);     // 배열로 고정 (안전)
  const [selectData, setSelectData] = useState(null); // SelectScreen에서 받은 선택값 저장

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const abortRef = useRef(null);

  const handleStart = () => setStep('select');

  // SelectScreen → 시트 열기 전에 선택값을 App으로 올려둠
  const handleOpenSheet = (dataFromSelect) => {
    setSelectData(dataFromSelect);   // { selected, distance, waitTime, spicy, price, period, hour, minute }
    setIsSheetOpen(true);
  };

  // AIInputSheet에서 "검색하기" 눌렀을 때
  const handleSearch = async (query) => {
    if (!selectData) return;
    const payload = buildPreferencePayload({ ...selectData, query });
    console.log('[SEND PAYLOAD]', payload);
  
    try {
      setLoading(true);
      setErrorMsg('');
  
      const data = USE_SAMPLE
        ? sampleResults
        : await requestRecommendations(selectData, query, { signal: abortRef.current?.signal });

      
      console.log('[API RESULTS]', data); // ✅ 실제 최종 데이터 확인
  
      setResults(data);
      setIsSheetOpen(false);
      setTimeout(() => setStep('result'), 300);
    } catch (e) {
      setErrorMsg(e.message || '검색 중 오류가 발생했어요.');
    } finally {
      setLoading(false);
    }
  };

  const handleRestart = () => {
    setResults([]);      // 🔁 결과 리셋
    setStep('select');   // 👉 SelectScreen으로 이동
  };

  return (
    <div>
      {step === 'start' && <StartScreen onStart={handleStart} />}

      {step === 'select' && (
        <>
          
          <SelectScreen
            onNext={handleOpenSheet}
            onChange={setSelectData}         // ✅ 실시간 동기화
          />
          <AIInputSheet
            isOpen={isSheetOpen}
            onClose={() => setIsSheetOpen(false)}
            onSearch={handleSearch}
            loading={loading}
          />
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
    </div>
  );
}

export default App;
