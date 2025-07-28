import { useState } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import styles from './SelectScreen.module.css';
import 홍밥1 from './assets/홍밥1.png';

const optionsList = ['한식', '일식', '중식', '양식', '기타'];
const distanceMarks = {1: '100m', 2: '300m', 3: '500m', 4: '700m', 5: '900m', 6: '1km+'};
const waitTimeMarks = {1: '10분', 2: '20분', 3: '30분', 4: '40분', 5: '50분', 6: '1시간'};
const spicyMarks = {1: '1단계', 2: '2단계', 3: '3단계'};
const priceMarks = {1: '5천원', 2: '1만원', 3: '1만5천원', 4: '2만원', 5: '2만5천원', 6: '3만원+'};

export default function SelectScreen({ onNext }) {
  const [selected, setSelected] = useState(null);
  const [distance, setDistance] = useState(1);
  const [waitTime, setWaitTime] = useState(3);
  const [spicy, setSpicy] = useState(1);
  const [price, setPrice] = useState(2);
  const [period, setPeriod] = useState('오전');
  const [hour, setHour] = useState(12);
  const [minute, setMinute] = useState(0);

  const handleNext = () => {
    if (selected) {
      onNext({ selected, distance, waitTime, spicy, price, period, hour, minute });
    }
  };

  const sliderStyle = {
    trackStyle: { backgroundColor: '#d04e41' },
    handleStyle: {
      borderColor: '#d04e41',
      backgroundColor: '#fff2e9',
      width: 24,
      height: 24,
      marginTop: -10,
      boxShadow: '0 0 0 2px #d04e41',
    },
    dotStyle: { backgroundColor: '#d04e41', width: 2, height: 12, marginLeft: -1, border: 'none' },
    activeDotStyle: { backgroundColor: '#d04e41' },
    railStyle: { backgroundColor: '#f3d5c9', height: 4 },
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>홍밥</div>
        <img className={styles.character} src={홍밥1} alt="홍밥이" />
      </div>

      <div className={styles.timeBox}>
        <div className={styles.timeLabelWrapper}>
          <span className={styles.timeLabel}>식사 시간</span>
        </div>
        <div className={styles.timePicker}>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            style={{ minWidth: '70px' }}
          >
            <option value="오전">오전</option>
            <option value="오후">오후</option>
          </select>
          <input
            type="number"
            min="1"
            max="12"
            value={hour}
            onChange={(e) => setHour(Math.min(12, Math.max(1, Number(e.target.value))))}
          />
          :
          <input
            type="number"
            min="0"
            max="59"
            value={minute}
            onChange={(e) => setMinute(Math.min(59, Math.max(0, Number(e.target.value))))}
          />
        </div>
      </div>

      <div className={styles.innerBox}>
        <div className={styles.options}>
          {optionsList.map((opt) => (
            <button
              key={opt}
              type="button"
              className={`${styles.optionBtn} ${selected === opt ? styles.selected : ''}`}
              onClick={() => setSelected(opt)}
            >
              {opt}
            </button>
          ))}
        </div>

        {[{
          label: '거리', value: distance, setValue: setDistance, marks: distanceMarks, max: 6
        }, {
          label: '대기시간', value: waitTime, setValue: setWaitTime, marks: waitTimeMarks, max: 6
        }, {
          label: '맵기 정도', value: spicy, setValue: setSpicy, marks: spicyMarks, max: 3
        }, {
          label: '가격', value: price, setValue: setPrice, marks: priceMarks, max: 6
        }].map((item) => (
          <div key={item.label} className={styles.sliderGroup}>
            <div className={styles.sliderLabelWrapper}>
              <span className={styles.sliderLabel}>{item.label}</span>
            </div>
            <div style={{ maxWidth: '320px', width: '100%', margin: '0 auto' }}>
              <Slider
                min={1}
                max={item.max}
                marks={item.marks}
                step={1}
                value={item.value}
                onChange={item.setValue}
                {...sliderStyle}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
