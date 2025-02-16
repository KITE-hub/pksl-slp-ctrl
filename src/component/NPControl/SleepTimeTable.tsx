import React from 'react';
import {SleepTimeTableProps, TimeBlockProps} from '../../types';

const TimeBlock: React.FC<TimeBlockProps> = ({rangeStart, start, end, totalHour, color, height}) => {
  const s = (start[0] * 60 + start[1] - rangeStart[0] * 60 + 24 * 60) % 1440;
  const e = ((end[0] * 60 + end[1] - rangeStart[0] * 60 - start[1] + 24 * 60) % 1440) + start[1];
  const blockStyle: React.CSSProperties = {
    left: `${(s / (totalHour * 60)) * 100}%`,
    top: `${100 - height}%`,
    width: `${((e - s) / (totalHour * 60)) * 100}%`,
    height: `${height}%`,
    backgroundColor: color
  };
  return (
    <div
      style={blockStyle}
      className="absolute flex pt-0.5 leading-snug justify-center text-white text-[10px] rounded"
    />
  );
};

export const SleepTimeTable: React.FC<SleepTimeTableProps> = ({targetTime, sleepScore}) => {
  const startHour = targetTime[0];
  const endHour = sleepScore.endTimeMax[0] + 1;
  const totalHours = (endHour + 24 - startHour) % 24;

  return (
    <div className="w-11/12 h-[30px] relative mx-auto">
      <div className="relative h-[17px]">
        <TimeBlock
          rangeStart={targetTime}
          start={targetTime}
          end={sleepScore.endTimeMax}
          totalHour={totalHours}
          color="#5dabfe"
          height={100}
        />
        <TimeBlock
          rangeStart={targetTime}
          start={sleepScore.vibStartTime}
          end={sleepScore.vibEndTimeMax}
          totalHour={totalHours}
          color="#4DCB7E"
          height={70}
        />
        <TimeBlock
          rangeStart={targetTime}
          start={sleepScore.vibEndTimeMin}
          end={sleepScore.vibEndTimeMax}
          totalHour={totalHours}
          color="#f4a825"
          height={70}
        />
        <TimeBlock
          rangeStart={targetTime}
          start={sleepScore.endTimeMin}
          end={sleepScore.endTimeMax}
          totalHour={totalHours}
          color="#f17255"
          height={100}
        />
      </div>
      <div aria-hidden="true" className="absolute h-[17px] inset-0 pointer-events-none">
        {Array.from({length: totalHours + 1}, (_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${(i / totalHours) * 100}%`,
              top: 0,
              bottom: 0,
              borderLeft: '1px solid #ccc'
            }}
          />
        ))}
      </div>
      <div className="flex justify-between relative leading-none text-[10px]">
        {Array.from({length: totalHours + 1}, (_, i) => {
          const hour = (startHour + i) % 24;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: `${(i / totalHours) * 100}%`,
                transform: 'translateX(-50%)',
                color: hour === 4 ? '#f17255' : 'inherit'
              }}
            >
              {hour.toString().padStart(2, '0')}
            </div>
          );
        })}
      </div>
    </div>
  );
};
