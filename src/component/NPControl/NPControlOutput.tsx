import {useState, useEffect, useRef, useCallback} from 'react';
import {NPControlOutputProps, ISleepScore} from '../../types';
import {SleepTimeTable} from './SleepTimeTable';

const minuteToTime = (minute: number): [number, number] => {
  const hour = Math.floor(minute / 60);
  return [hour % 24, minute % 60];
};

function NPControlOutput({targetTime, targetEnergy, targetNP, NPMultiplier}: NPControlOutputProps) {
  const [sleepScores, setSleepScores] = useState<ISleepScore[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (targetTime[0] !== null && targetTime[1] !== null) {
      const newSleepScores: ISleepScore[] = [];
      const startMinute = targetTime[0] * 60 + targetTime[1];
      let minNPDiff: number = Infinity;
      let minNPDiffIndex: number = -1;
      for (let sleepScore = 17; sleepScore <= 100; sleepScore++) {
        const sleepTimeMin = Math.max(0, Math.ceil(((sleepScore - 0.5) / 100) * 8.5 * 60));
        const sleepTimeMax = Math.min(510, Math.ceil(((sleepScore + 0.5) / 100) * 8.5 * 60 - 1));
        const NP = sleepScore * targetEnergy * NPMultiplier;
        if (Math.abs(NP - targetNP) < minNPDiff) {
          minNPDiff = Math.abs(NP - targetNP);
          minNPDiffIndex = sleepScore - 17;
        }
        newSleepScores.push({
          sleepScore: sleepScore,
          NP: NP,
          vibStartTime: minuteToTime(startMinute + 15),
          vibEndTimeMin: minuteToTime(startMinute + sleepTimeMin),
          vibEndTimeMax: minuteToTime(startMinute + sleepTimeMax),
          endTimeMin: minuteToTime(startMinute + 5 + sleepTimeMin),
          endTimeMax: minuteToTime(startMinute + 5 + sleepTimeMax)
        });
      }
      setSleepScores(newSleepScores);
      setCurrentIndex(minNPDiffIndex);
    }
  }, [targetTime, targetEnergy, targetNP, NPMultiplier]);

  useEffect(() => {
    itemRefs.current = sleepScores.map((_, i) => itemRefs.current[i] || null);
    scrollToCurrentItem();
  }, [sleepScores, currentIndex]);

  const scrollToCurrentItem = useCallback(() => {
    const container = containerRef.current;
    const currentItem = itemRefs.current[currentIndex];
    if (container && currentItem) {
      const containerRect = container.getBoundingClientRect();
      const itemRect = currentItem.getBoundingClientRect();
      const relativeTop = itemRect.top - containerRect.top;
      const scrollPosition = container.scrollTop + relativeTop;
      container.scrollTo({
        top: scrollPosition,
        behavior: 'smooth'
      });
    }
  }, [currentIndex, sleepScores]);

  const img = (score: number): string => {
    return `radial-gradient(#ffffff 50%, transparent 51%), conic-gradient(#489eff 0% ${score}%, #dddddd ${score + 1}% 100%)`;
  };

  const sleepTimeMin = (score: number): number => {
    return Math.max(0, Math.ceil(((score - 0.5) / 100) * 8.5 * 60));
  };

  const sleepTimeMax = (score: number): number => {
    return Math.min(510, Math.ceil(((score + 0.5) / 100) * 8.5 * 60 - 1));
  };

  const timeDisplay = (time: [number, number]): string => {
    return `${time[0].toString().padStart(2, '0')}:${time[1].toString().padStart(2, '0')}`;
  };

  return (
    <div className="NPControlOutput">
      <div ref={containerRef} className="h-[330px] overflow-y-scroll border rounded-lg" role="list">
        {sleepScores.map((item, index) => (
          <div
            key={index}
            className="flex justify-between items-center mb-0.5"
            style={{backgroundColor: index === currentIndex ? '#f8fafc' : undefined}}
            ref={(el) => (itemRefs.current[index] = el)}
          >
            <div className="flex flex-col h-16 w-28 justify-center items-center">
              <div className="flex justify-center items-center">
                <div
                  className="pie flex justify-center items-center flex-shrink-0 w-10 h-10 text-xs font-bold rounded-full text-[#489eff]"
                  style={{backgroundImage: img(item.sleepScore)}}
                >
                  {item.sleepScore}
                </div>
                <div className="flex flex-col items-center ml-1 text-[11px] font-bold leading-snug">
                  <p>
                    {minuteToTime(sleepTimeMin(item.sleepScore))[0]}時間{minuteToTime(sleepTimeMin(item.sleepScore))[1]}
                    分
                  </p>
                  <p className="rotate-90 -my-0.5">-</p>
                  <p>
                    {minuteToTime(sleepTimeMax(item.sleepScore))[0]}時間{minuteToTime(sleepTimeMax(item.sleepScore))[1]}
                    分
                  </p>
                </div>
              </div>
              <p className="text-[#777] text-[11px] text-center leading-none mt-1">{item.NP.toLocaleString()}</p>
            </div>
            <div className="flex flex-col h-16 w-[250px] justify-center items-center">
              <div className="leading-tight text-xs text-center">
                <div className="space-x-2">
                  <span className="text-[#5dabfe]">
                    <span className="text-[11px]">計測開始:</span> <strong>{timeDisplay(targetTime)}</strong>
                  </span>
                  <span className="text-[#f17255]">
                    <span className="text-[11px]">計測終了:</span> <strong>{timeDisplay(item.endTimeMin)}</strong> -{' '}
                    <strong>{timeDisplay(item.endTimeMax)}</strong>
                  </span>
                </div>
                <div className="space-x-2">
                  <span className="text-[#42d77b]">
                    <span className="text-[11px]">振動開始:</span> <strong>{timeDisplay(item.vibStartTime)}</strong>
                  </span>
                  <span className="text-[#f6b74c]">
                    <span className="text-[11px]">振動終了:</span> <strong>{timeDisplay(item.vibEndTimeMin)}</strong> -{' '}
                    <strong>{timeDisplay(item.vibEndTimeMax)}</strong>
                  </span>
                </div>
              </div>
              <SleepTimeTable targetTime={targetTime} sleepScore={item} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NPControlOutput;
