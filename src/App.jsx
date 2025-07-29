import { useState } from 'react';
import StartScreen from './components/StartScreen.jsx';
import SelectScreen from './components/SelectScreen.jsx';
import AIInputSheet from './components/AIinputSheet.jsx';
import ResultScreen from './components/ResultScreen.jsx';
import FinalListScreen from './components/FinalListScreen.jsx'; // 이거 빠져 있으면 꼭 추가!

function App() {
  const [step, setStep] = useState('start');
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [results, setResults] = useState(null);

  const handleStart = () => {
    setStep('select');
  };

  const handleSearch = (query) => {
    console.log('검색 쿼리:', query);

    // ✅ 샘플 데이터 추가
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

    setResults(sampleResults); // ✅ 꼭 있어야 함
    setIsSheetOpen(false);

    setTimeout(() => {
      setStep('result');
    }, 300);
  };

  return (
    <div>
      {step === 'start' && <StartScreen onStart={handleStart} />}

      {step === 'select' && (
        <>
          <SelectScreen onNext={() => setIsSheetOpen(true)} />
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
          onBack={() => setStep('result')}
        />
      )}
    </div>
  );
}

export default App;
