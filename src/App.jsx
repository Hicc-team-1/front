// App.jsx 완성본: AI 검색 후 ResultScreen으로 전환
import { useState } from 'react';
import StartScreen from './components/StartScreen.jsx';
import SelectScreen from './components/SelectScreen.jsx';
import AIInputSheet from './components/AIinputSheet.jsx';
import ResultScreen from './components/ResultScreen.jsx';

function App() {
  const [step, setStep] = useState('start');
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleStart = () => {
    setStep('select');
  };

  const handleSearch = (query) => {
    console.log('검색 쿼리:', query);
    setIsSheetOpen(false);
    setTimeout(() => {
      setStep('result');
    }, 300); // 시트 닫힌 후 결과화면 전환
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

      {step === 'result' && <ResultScreen />}
    </div>
  );
}

export default App;
