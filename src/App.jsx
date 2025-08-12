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
const sampleResults = [
  {
    name: '미도인',
    stars: '★★★★☆',
    distance: '700m, 약 15분',
    reason: '맛있고 가성비 좋음\n조건 만족',
    menus: [
      { name: '스테이크 덮밥', price: '16,800원', desc: '400g 듬뿍' },
      { name: '마제소바', price: '10,300원', desc: '매콤한 일본식 비빔면' },
    ],
    map: 'https://via.placeholder.com/300x200?text=Map',
    lat: 37.5563,
    lng: 126.9220,
  },
  {
    name: '홍밥이네',
    stars: '★★★★★',
    distance: '300m, 약 5분',
    reason: '가성비+빠른 대기시간',
    menus: [
      { name: '김치찌개', price: '8,000원', desc: '돼지고기 푸짐' },
      { name: '제육볶음', price: '9,000원', desc: '매콤달콤' },
    ],
    map: 'https://via.placeholder.com/300x200?text=Map2',
    lat: 37.5585,
    lng: 126.9250,
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
