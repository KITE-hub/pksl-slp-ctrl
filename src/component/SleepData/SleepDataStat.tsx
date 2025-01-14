import {useState, useEffect} from 'react';
import {SleepDataStatProps, iResult} from '../../types';

function SleepDataStat({result}: SleepDataStatProps) {
  const [sleepRateStats, setSleepRateStats] = useState<{
    averages: [number, number, number];
    stdDevs: [number, number, number];
  }>(() => {
    const savedData = localStorage.getItem('resultData');
    if (savedData) {
      const initialResult: iResult[] = JSON.parse(savedData).slice(0, 30); // 最初の30要素

      const averages = [0, 1, 2].map((index) => {
        const total = initialResult.reduce<number>((acc, item) => acc + (item.sleepRate[index] || 0), 0);
        return total / initialResult.length;
      }) as [number, number, number];
      const stdDevs = [0, 1, 2].map((index) => {
        const variance =
          initialResult.reduce<number>(
            (acc, item) => acc + Math.pow((item.sleepRate[index] || 0) - averages[index], 2),
            0
          ) / initialResult.length;
        return Math.sqrt(variance);
      }) as [number, number, number];

      return {averages, stdDevs};
    }
    return {averages: [0, 0, 0], stdDevs: [0, 0, 0]};
  });

  const [startTimeAvarage, setStartTimeAvarage] = useState<[number, number]>(() => {
    const savedData = localStorage.getItem('resultData');
    if (savedData) {
      const initialResult: iResult[] = JSON.parse(savedData).slice(0, 30); // 最初の30要素
      const totalMinutes = initialResult.reduce((acc, item) => acc + (item.startTime[0] * 60 + item.startTime[1]), 0);
      const hourAverage = Math.floor(totalMinutes / initialResult.length / 60);
      const minuteAverage = totalMinutes / initialResult.length - hourAverage * 60;
      return [hourAverage, minuteAverage];
    }
    return [0, 0];
  });

  const [endTimeAvarage, setEndTimeAvarage] = useState<[number, number]>(() => {
    const savedData = localStorage.getItem('resultData');
    if (savedData) {
      const initialResult: iResult[] = JSON.parse(savedData).slice(0, 30); // 最初の30要素
      const totalMinutes = initialResult.reduce((acc, item) => acc + (item.endTime[0] * 60 + item.endTime[1]), 0);
      const hourAverage = Math.floor(totalMinutes / initialResult.length / 60);
      const minuteAverage = totalMinutes / initialResult.length - hourAverage * 60;
      return [hourAverage, minuteAverage];
    }
    return [0, 0];
  });

  const [sleepTimeAvarage, setSleepTimeAvarage] = useState<[number, number]>(() => {
    const savedData = localStorage.getItem('resultData');
    if (savedData) {
      const initialResult: iResult[] = JSON.parse(savedData).slice(0, 30); // 最初の30要素
      const totalMinutes = initialResult.reduce(
        (acc, item) =>
          acc +
          ((((((item.endTime[0] - item.startTime[0]) * 60) % 1440) + 1440) % 1440) +
            item.endTime[1] -
            item.startTime[1]),
        0
      );
      const hourAverage = Math.floor(totalMinutes / initialResult.length / 60);
      const minuteAverage = totalMinutes / initialResult.length - hourAverage * 60;
      return [hourAverage, minuteAverage];
    }
    return [0, 0];
  });

  useEffect(() => {
    if (result.length > 0) {
      const initialResult = result.slice(0, 30); // 最初の30要素
      const averages = [0, 1, 2].map((index) => {
        const total = initialResult.reduce((acc, item) => acc + (item.sleepRate[index] || 0), 0);
        return total / initialResult.length;
      }) as [number, number, number];
      const stdDevs = [0, 1, 2].map((index) => {
        const variance =
          initialResult.reduce<number>(
            (acc, item) => acc + Math.pow((item.sleepRate[index] || 0) - averages[index], 2),
            0
          ) / initialResult.length;
        return Math.sqrt(variance);
      }) as [number, number, number];

      const startTimeTotalMinutes = initialResult.reduce(
        (acc, item) => acc + (item.startTime[0] * 60 + item.startTime[1]),
        0
      );
      const startTimeHourAverage = Math.floor(startTimeTotalMinutes / initialResult.length / 60);
      const startTimeMinuteAverage = startTimeTotalMinutes / initialResult.length - startTimeHourAverage * 60;
      const endTimeTotalMinutes = initialResult.reduce(
        (acc, item) => acc + (item.endTime[0] * 60 + item.endTime[1]),
        0
      );
      const endTimeHourAverage = Math.floor(endTimeTotalMinutes / initialResult.length / 60);
      const endTimeMinuteAverage = endTimeTotalMinutes / initialResult.length - endTimeHourAverage * 60;
      const sleepTimeTotalMinutes = initialResult.reduce(
        (acc, item) =>
          acc +
          ((((((item.endTime[0] - item.startTime[0]) * 60) % 1440) + 1440) % 1440) +
            item.endTime[1] -
            item.startTime[1]),
        0
      );
      const sleepTimeHourAverage = Math.floor(sleepTimeTotalMinutes / initialResult.length / 60);
      const sleepTimeMinuteAverage = sleepTimeTotalMinutes / initialResult.length - sleepTimeHourAverage * 60;
      setSleepRateStats({averages, stdDevs});
      setStartTimeAvarage([startTimeHourAverage, startTimeMinuteAverage]);
      setEndTimeAvarage([endTimeHourAverage, endTimeMinuteAverage]);
      setSleepTimeAvarage([sleepTimeHourAverage, sleepTimeMinuteAverage]);
    }
  }, [result]);
  return (
    <div className="SleepDataStat flex justify-center w-[360px] mx-auto">
      <div className="mb-3 mr-2 flex flex-col items-center">
        <p className="text-xs mb-2">過去30回の平均睡眠時間</p>
        <span className="text-lg font-bold">
          {sleepTimeAvarage[0]}時間{sleepTimeAvarage[1].toFixed()}分
        </span>
        <span className="text-sm mt-1">
          就寝: {startTimeAvarage[0]}:{startTimeAvarage[1].toFixed()}
          <br />
          起床: {endTimeAvarage[0]}:{endTimeAvarage[1].toFixed()}
        </span>
      </div>
      <div className="mb-4 ml-2 flex flex-col items-center">
        <p className="text-xs mb-2">
          過去30回のタイプ別平均%<small> (標準偏差)</small>
        </p>
        <div>
          <div className="mb-2">
            <span className="text-[#795516] bg-[#ffec6f] rounded-full py-0.5 px-3 text-center">うとうと</span> :{' '}
            <span className="text-[#976a1c] font-bold">{sleepRateStats.averages[0].toFixed(1)}%</span>{' '}
            <span className="text-[#976a1c] text-xs">({sleepRateStats.stdDevs[0].toFixed(1)})</span>
          </div>
          <div className="my-2">
            <span className="text-[#166A7C] bg-[#85fbff] rounded-full py-0.5 px-3 text-center">すやすや</span> :{' '}
            <span className="text-[#1b8198] font-bold">{sleepRateStats.averages[1].toFixed(1)}%</span>{' '}
            <span className="text-[#1b8198] text-xs">({sleepRateStats.stdDevs[1].toFixed(1)})</span>
          </div>
          <div className="mt-2">
            <span className="text-white bg-[#4488fb] rounded-full py-0.5 px-3 text-center">ぐっすり</span> :{' '}
            <span className="text-[#173e82] font-bold">{sleepRateStats.averages[2].toFixed(1)}%</span>{' '}
            <span className="text-[#173e82] text-xs">({sleepRateStats.stdDevs[2].toFixed(1)})</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SleepDataStat;
