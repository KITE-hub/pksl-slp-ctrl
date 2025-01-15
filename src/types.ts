import {SelectChangeEvent} from '@mui/material';

export interface iResult {
  date: [number, number, number];
  startTime: [number, number];
  endTime: [number, number];
  sleepType: 'うとうと' | 'すやすや' | 'ぐっすり';
  // Dozing=うとうと sleepRate[0], Snoozing=すやすや sleepRate[1], Slumbering=ぐっすり sleepRate[2]
  sleepRate: [number, number, number];
}

// 1時間半以上
export interface ISleepScore {
  sleepScore: number;
  NP: number;
  vibStartTime: [number, number];
  vibEndTimeMin: [number, number];
  vibEndTimeMax: [number, number];
  endTimeMin: [number, number];
  endTimeMax: [number, number];
}

export interface InputProps {
  result: iResult[];
  setResult: (result: iResult[]) => void;
}

export interface NPControlInputProps {
  targetTime: [number, number];
  setTargetTime: React.Dispatch<React.SetStateAction<[number, number]>>;
  targetEnergy: number;
  setTargetEnergy: (targetEnergy: number) => void;
  targetNP: number;
  setTargetNP: (targetNP: number) => void;
  NPMultiplier: number;
  handleNPMultiplier: (e: SelectChangeEvent<number>) => void;
}

export interface NPMultiplierSelectProps {
  NPMultiplier: number;
  handleNPMultiplier: (e: SelectChangeEvent<number>) => void;
}

export interface NPControlOutputProps {
  targetTime: [number, number];
  targetEnergy: number;
  targetNP: number;
  NPMultiplier: number;
}

export interface SleepDataActionProps {
  result: iResult[];
}

export interface SleepDataStatProps {
  result: iResult[];
}

export interface SleepDataGridProps {
  result: iResult[];
  setResult: (result: iResult[]) => void;
}

export interface SleepTimeTableProps {
  targetTime: [number, number];
  sleepScore: ISleepScore;
}

export interface TimeBlockProps {
  rangeStart: [number, number];
  start: [number, number];
  end: [number, number];
  totalHour: number;
  color: string;
  height: number;
}
