import React, {useState} from 'react';
import {SleepDataInputProps} from '../../types';
import DeleteIcon from '@mui/icons-material/Delete';
import {IconButton} from '@mui/material';
import {StyledTextInputField} from '../MUIStyledComponents';
import {ISleepData} from '../../types';

const parseSleepData = (text: string): ISleepData | null => {
  const dateMatch = text.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/);
  if (!dateMatch) return null;
  const [year, month, day]: number[] = dateMatch.slice(1).map(Number);

  const timeMatch = text.match(/就寝：\s*(\d{2}):(\d{2})\s*起床：\s*(\d{2}):(\d{2})/);
  if (!timeMatch) return null;
  const [startHour, startMinute, endHour, endMinute]: number[] = timeMatch.slice(1).map(Number);

  const sleepTypeMatch = text.match(/(うとうと|すやすや|ぐっすり)タイプ/);
  if (!sleepTypeMatch) return null;
  const sleepType = sleepTypeMatch[1] as 'うとうと' | 'すやすや' | 'ぐっすり';

  const regex = /：\s*(\d+)%/g;
  const matches = text.matchAll(regex);
  const sleepRate = Array.from(matches, (match) => parseInt(match[1]));
  if (sleepRate.length != 3) return null;
  if (sleepRate[2] !== 100 - sleepRate[0] - sleepRate[1]) return null;

  const parsedSleepData: ISleepData = {
    date: [year, month, day],
    startTime: [startHour, startMinute],
    endTime: [endHour, endMinute],
    sleepType,
    sleepRate: sleepRate as [number, number, number]
  };
  return parsedSleepData;
};
const decodeSleepDataFromArray = (encoded: string): ISleepData[] => {
  const parsedArray = JSON.parse(encoded) as unknown;
  if (!Array.isArray(parsedArray)) {
    throw new Error();
  }
  return parsedArray.map((item) => {
    if (
      !Array.isArray(item) ||
      item.length !== 5 ||
      !Array.isArray(item[0]) ||
      item[0].length !== 3 ||
      item[0][0] < 0 ||
      item[0][1] < 0 ||
      item[0][1] > 12 ||
      item[0][2] < 0 ||
      item[0][2] > 31 ||
      !Array.isArray(item[1]) ||
      item[1].length !== 2 ||
      item[1][0] < 0 ||
      item[1][0] > 26 ||
      item[1][1] >= 60 ||
      item[1][1] < 0 ||
      !Array.isArray(item[2]) ||
      item[2].length !== 2 ||
      item[2][0] < 0 ||
      item[2][0] > 26 ||
      item[2][1] >= 60 ||
      item[2][1] < 0 ||
      !['うとうと', 'すやすや', 'ぐっすり'].includes(item[3]) ||
      !Array.isArray(item[4]) ||
      item[4].length !== 3 ||
      item[4][0] < 0 ||
      item[4][1] < 0 ||
      item[4][2] !== 100 - item[4][0] - item[4][1]
    ) {
      throw new Error();
    }

    return {
      date: item[0] as [number, number, number],
      startTime: item[1] as [number, number],
      endTime: item[2] as [number, number],
      sleepType: item[3] as 'うとうと' | 'すやすや' | 'ぐっすり',
      sleepRate: item[4] as [number, number, number]
    };
  });
};

function SleepDataInput({sleepData, setSleepData}: SleepDataInputProps) {
  const [inputValue, setInputValue] = useState<string>('');
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };
  const clearInputValue = () => {
    setInputValue('');
  };

  const [additionOrder, setAdditionOrder] = useState<boolean>(false);
  const handleAdditionClick = async () => {
    setAdditionOrder(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const preprocessInputValue = inputValue.replace(/\s+/g, ' ').trim();
      const parts = preprocessInputValue
        .split(/もどる/)
        .map((part) => part.trim())
        .filter((part) => part);

      const newSleepData: ISleepData[] = [];
      const errorSleepData: string[] = [];
      for (const part of parts) {
        const parsedSleepData = parseSleepData(part);
        if (parsedSleepData) newSleepData.push(parsedSleepData);
        else errorSleepData.push(part);
      }
      if (newSleepData.length > 0) {
        const mergedSleepData = [...sleepData, ...sleepData];
        const sortedSleepData = mergedSleepData.sort((a, b) => {
          const aDateTime = [...a.date, ...a.startTime];
          const bDateTime = [...b.date, ...b.startTime];
          for (let i = 0; i < aDateTime.length; i++) {
            if (aDateTime[i] !== bDateTime[i]) return bDateTime[i] - aDateTime[i]; // 降順
          }
          return 0;
        });
        setSleepData(sortedSleepData);
        setInputValue('');
      }
      if (errorSleepData) {
        alert(`以下のデータが解析できませんでした:\n${errorSleepData}`);
      }
    } finally {
      setAdditionOrder(false);
    }
  };

  const [importOrder, setImportOrder] = useState<boolean>(false);
  const handleImportClick = async () => {
    setImportOrder(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const decodedSleepData = decodeSleepDataFromArray(inputValue);
      if (decodedSleepData.length > 0) {
        const mergedSleepData = [...sleepData, ...decodedSleepData];
        const sortedSleepData = mergedSleepData.sort((a, b) => {
          const aDateTime = [...a.date, ...a.startTime];
          const bDateTime = [...b.date, ...b.startTime];
          for (let i = 0; i < aDateTime.length; i++) {
            if (aDateTime[i] !== bDateTime[i]) return bDateTime[i] - aDateTime[i]; // 降順
          }
          return 0;
        });
        setSleepData(sortedSleepData);
        setInputValue('');
      }
    } catch (error) {
      alert('インポートに失敗しました。');
    } finally {
      setImportOrder(false);
    }
  };

  return (
    <div className="TextInput mt-3">
      <div className="flex w-full justify-center items-center">
        <IconButton aria-label="actions" onClick={clearInputValue}>
          <DeleteIcon sx={{color: '#666'}} />
        </IconButton>
        <StyledTextInputField multiline rows={4} value={inputValue} onChange={handleInputChange} />
      </div>
      <div className="flex">
        {importOrder ? (
          <button
            className="buttonShadow font-bold text-center text-white bg-gray-400 rounded-full border border-gray-600 py-1.5 w-32 block mx-auto mt-3"
            disabled
          >
            処理中...
          </button>
        ) : (
          <button
            onClick={handleImportClick}
            className="buttonShadow font-bold text-center text-white bg-[#25d76b] rounded-full border border-[#0d974f] py-1.5 w-32 block mx-auto mt-3"
          >
            インポート
          </button>
        )}
        {additionOrder ? (
          <button
            className="buttonShadow font-bold text-center text-white bg-gray-400 rounded-full border border-gray-600 py-1.5 w-32 block mx-auto mt-3"
            disabled
          >
            処理中...
          </button>
        ) : (
          <button
            onClick={handleAdditionClick}
            className="buttonShadow font-bold text-center text-white bg-[#25d76b] rounded-full border border-[#0d974f] py-1.5 w-32 block mx-auto mt-3"
          >
            追加する
          </button>
        )}
      </div>
    </div>
  );
}

export default SleepDataInput;
