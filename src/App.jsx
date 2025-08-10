import { useState } from 'react';
import StartScreen from './components/StartScreen.jsx';
import SelectScreen from './components/SelectScreen.jsx';
import AIInputSheet from './components/AIinputSheet.jsx';
import ResultScreen from './components/ResultScreen.jsx';
import FinalListScreen from './components/FinalListScreen.jsx';
import { buildPreferencePayload } from './api/payload.js';

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
  },
];

function App() {
  const [step, setStep] = useState('start');      // 'start' | 'select' | 'result' | 'final'
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [results, setResults] = useState([]);     // 배열로 고정 (안전)
  const [selectData, setSelectData] = useState(null); // SelectScreen에서 받은 선택값 저장

  const handleStart = () => setStep('select');

  // SelectScreen → 시트 열기 전에 선택값을 App으로 올려둠
  const handleOpenSheet = (dataFromSelect) => {
    setSelectData(dataFromSelect);   // { selected, distance, waitTime, spicy, price, period, hour, minute }
    setIsSheetOpen(true);
  };

  // AIInputSheet에서 "검색하기" 눌렀을 때
  const handleSearch = async (query) => {
    console.log('검색 쿼리:', query);

    // ✅ 의미 있는 값만 담은 payload 생성
    const payload = buildPreferencePayload({ ...selectData, query });
    console.log('[SEND PAYLOAD]', payload);  // 서버 준비 전 확인용

    // 서버 준비 후 활성화:
    // try {
    //   const res = await fetch('/api/preferences', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(payload),
    //   });
    //   if (!res.ok) throw new Error(`sendPreferences failed: ${res.status}`);
    // } catch (e) {
    //   console.error(e);
    // }

    // ✅ 지금은 샘플 데이터로 결과 화면 확인
    setResults(sampleResults);
    setIsSheetOpen(false);
    setTimeout(() => setStep('result'), 300);
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
          {/* onNext가 선택값 객체를 넘겨주도록 SelectScreen.jsx에 구현되어 있음 */}
          <SelectScreen onNext={handleOpenSheet} />
          <AIInputSheet
            isOpen={isSheetOpen}
            onClose={() => setIsSheetOpen(false)}
            onSearch={handleSearch}
          />
        </>
      )}

      {step === 'result' && (
        <ResultScreen
          results={results}
          onFinish={() => setStep('final')}
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
