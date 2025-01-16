import {useState, useEffect} from 'react';
import {SleepDataStatProps, ISleepData} from '../../types';

function SleepDataStat({sleepData}: SleepDataStatProps) {
  const [sleepRateStats, setSleepRateStats] = useState<{
    averages: [number, number, number];
    stdDevs: [number, number, number];
  }>(() => {
    const savedData = localStorage.getItem('sleepData');
    if (savedData) {
      const initialSleepData: ISleepData[] = JSON.parse(savedData).slice(0, 30); // 最初の30要素

      const averages = [0, 1, 2].map((index) => {
        const total = initialSleepData.reduce<number>((acc, item) => acc + (item.sleepRate[index] || 0), 0);
        return total / initialSleepData.length;
      }) as [number, number, number];
      const stdDevs = [0, 1, 2].map((index) => {
        const variance =
          initialSleepData.reduce<number>(
            (acc, item) => acc + Math.pow((item.sleepRate[index] || 0) - averages[index], 2),
            0
          ) / initialSleepData.length;
        return Math.sqrt(variance);
      }) as [number, number, number];

      return {averages, stdDevs};
    }
    return {averages: [0, 0, 0], stdDevs: [0, 0, 0]};
  });

  const [startTimeAvarage, setStartTimeAvarage] = useState<[number, number]>(() => {
    const savedData = localStorage.getItem('SleepData');
    if (savedData) {
      const initialSleepData: ISleepData[] = JSON.parse(savedData).slice(0, 30); // 最初の30要素
      const totalMinutes = initialSleepData.reduce(
        (acc, item) => acc + (item.startTime[0] * 60 + item.startTime[1]),
        0
      );
      const hourAverage = Math.floor(totalMinutes / initialSleepData.length / 60);
      const minuteAverage = totalMinutes / initialSleepData.length - hourAverage * 60;
      return [hourAverage, minuteAverage];
    }
    return [0, 0];
  });

  const [endTimeAvarage, setEndTimeAvarage] = useState<[number, number]>(() => {
    const savedData = localStorage.getItem('SleepData');
    if (savedData) {
      const initialSleepData: ISleepData[] = JSON.parse(savedData).slice(0, 30); // 最初の30要素
      const totalMinutes = initialSleepData.reduce((acc, item) => acc + (item.endTime[0] * 60 + item.endTime[1]), 0);
      const hourAverage = Math.floor(totalMinutes / initialSleepData.length / 60);
      const minuteAverage = totalMinutes / initialSleepData.length - hourAverage * 60;
      return [hourAverage, minuteAverage];
    }
    return [0, 0];
  });

  const [sleepTimeAvarage, setSleepTimeAvarage] = useState<[number, number]>(() => {
    const savedData = localStorage.getItem('SleepData');
    if (savedData) {
      const initialSleepData: ISleepData[] = JSON.parse(savedData).slice(0, 30); // 最初の30要素
      const totalMinutes = initialSleepData.reduce(
        (acc, item) =>
          acc +
          ((((((item.endTime[0] - item.startTime[0]) * 60) % 1440) + 1440) % 1440) +
            item.endTime[1] -
            item.startTime[1]),
        0
      );
      const hourAverage = Math.floor(totalMinutes / initialSleepData.length / 60);
      const minuteAverage = totalMinutes / initialSleepData.length - hourAverage * 60;
      return [hourAverage, minuteAverage];
    }
    return [0, 0];
  });

  useEffect(() => {
    if (sleepData.length > 0) {
      const initialSleepData = sleepData.slice(0, 30); // 最初の30要素
      const averages = [0, 1, 2].map((index) => {
        const total = initialSleepData.reduce((acc, item) => acc + (item.sleepRate[index] || 0), 0);
        return total / initialSleepData.length;
      }) as [number, number, number];
      const stdDevs = [0, 1, 2].map((index) => {
        const variance =
          initialSleepData.reduce<number>(
            (acc, item) => acc + Math.pow((item.sleepRate[index] || 0) - averages[index], 2),
            0
          ) / initialSleepData.length;
        return Math.sqrt(variance);
      }) as [number, number, number];

      const startTimeTotalMinutes = initialSleepData.reduce(
        (acc, item) => acc + (item.startTime[0] * 60 + item.startTime[1]),
        0
      );
      const startTimeHourAverage = Math.floor(startTimeTotalMinutes / initialSleepData.length / 60);
      const startTimeMinuteAverage = startTimeTotalMinutes / initialSleepData.length - startTimeHourAverage * 60;
      const endTimeTotalMinutes = initialSleepData.reduce(
        (acc, item) => acc + (item.endTime[0] * 60 + item.endTime[1]),
        0
      );
      const endTimeHourAverage = Math.floor(endTimeTotalMinutes / initialSleepData.length / 60);
      const endTimeMinuteAverage = endTimeTotalMinutes / initialSleepData.length - endTimeHourAverage * 60;
      const sleepTimeTotalMinutes = initialSleepData.reduce(
        (acc, item) =>
          acc +
          ((((((item.endTime[0] - item.startTime[0]) * 60) % 1440) + 1440) % 1440) +
            item.endTime[1] -
            item.startTime[1]),
        0
      );
      const sleepTimeHourAverage = Math.floor(sleepTimeTotalMinutes / initialSleepData.length / 60);
      const sleepTimeMinuteAverage = sleepTimeTotalMinutes / initialSleepData.length - sleepTimeHourAverage * 60;
      setSleepRateStats({averages, stdDevs});
      setStartTimeAvarage([startTimeHourAverage, startTimeMinuteAverage]);
      setEndTimeAvarage([endTimeHourAverage, endTimeMinuteAverage]);
      setSleepTimeAvarage([sleepTimeHourAverage, sleepTimeMinuteAverage]);
    }
  }, [sleepData]);
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
