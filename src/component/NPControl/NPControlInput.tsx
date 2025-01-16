import React, {useState, useEffect} from 'react';
import {NPControlInputProps} from '../../types';
import NPMultiplierSelect from './NPMultiplierSelect';

function NPControlInput({
  setTargetTime,
  targetEnergy,
  setTargetEnergy,
  targetNP,
  setTargetNP,
  NPMultiplier,
  handleNPMultiplier
}: NPControlInputProps) {
  const handleInputChange =
    (setter: React.Dispatch<React.SetStateAction<[number | null, number | null]>>, index: number) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value === '' ? null : parseInt(e.target.value, 10);
      setter((prev) => {
        const updated = [...prev];
        updated[index] = value;
        return updated as [number | null, number | null];
      });
    };

  const [targetTimeBase, setTargetTimeBase] = useState<[number | null, number | null]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('targetTimeBase');
      return saved ? JSON.parse(saved) : [22, 0];
    }
    return [22, 0];
  });
  useEffect(() => {
    localStorage.setItem('targetTimeBase', JSON.stringify(targetTimeBase));
    const expandedValue = (() => {
      const [hour, minute] = targetTimeBase;
      if (hour !== null && minute !== null) {
        const timeToMinute = hour * 60 + minute;
        return [Math.floor(timeToMinute / 60) % 24, timeToMinute % 60] as [number, number];
      }
      return null;
    })();
    if (expandedValue !== null) {
      setTargetTime(expandedValue);
    }
  }, [targetTimeBase]);

  const [targetEnergyBase, setTargetEnergyBase] = useState<[number | null, number | null]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('targetEnergyBase');
      return saved ? JSON.parse(saved) : [100, 4];
    }
    return [100, 4];
  });
  useEffect(() => {
    localStorage.setItem('targetEnergyBase', JSON.stringify(targetEnergyBase));
    const expandedValue = (() => {
      const [base, exponent] = targetEnergyBase;
      if (base !== null && exponent !== null) {
        return Math.min(Math.pow(10, 12), Math.round(base * Math.pow(10, exponent) * 100) / 100);
      }
      return null;
    })();
    if (expandedValue !== null) {
      setTargetEnergy(expandedValue);
    }
  }, [targetEnergyBase]);

  const [targetNPBase, setTargetNPBase] = useState<[number | null, number | null]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('targetNPBase');
      return saved ? JSON.parse(saved) : [100, 6];
    }
    return [100, 6];
  });
  useEffect(() => {
    localStorage.setItem('targetNPBase', JSON.stringify(targetNPBase));
    const expandedValue = (() => {
      const [base, exponent] = targetNPBase;
      if (base !== null && exponent !== null) {
        return Math.min(Math.pow(10, 12), Math.round(base * Math.pow(10, exponent) * 100) / 100);
      }
      return null;
    })();
    if (expandedValue !== null) {
      setTargetNP(expandedValue);
    }
  }, [targetNPBase]);

  return (
    <div className="NPControl mt-3">
      <table className="mx-auto">
        <tr>
          <th>
            <div className="bg-[#6aea4b] text-white rounded-full w-40 h-6 mr-3 flex items-center justify-center">
              計測開始時刻
            </div>
          </th>
          <td className="block my-0.5">
            <div className="flex">
              <input
                type="number"
                value={targetTimeBase[0] ?? ''}
                onChange={handleInputChange(setTargetTimeBase, 0)}
                className="font-bold px-2 focus:px-[7px] w-12 h-8 box-border rounded-md border border-[#25d76b] buttonShadow focus:outline-none focus:border-2 focus:border-[#25d76b]"
              />
              <p className="flex items-center mx-2">時</p>
              <input
                type="number"
                value={targetTimeBase[1] ?? ''}
                onChange={handleInputChange(setTargetTimeBase, 1)}
                className="font-bold px-2 focus:px-[7px] w-12 h-8 box-border rounded-md border border-[#25d76b] buttonShadow focus:outline-none focus:border-2 focus:border-[#25d76b]"
              />
              <p className="flex items-center mx-2">分</p>
            </div>
          </td>
        </tr>
        <tr>
          <th>
            <div className="bg-[#6aea4b] text-white rounded-full w-40 h-6 mr-3 flex items-center justify-center">
              現在のエナジー
            </div>
          </th>
          <td className="block my-0.5">
            <div className="flex">
              <input
                type="number"
                value={targetEnergyBase[0] ?? ''}
                onChange={handleInputChange(setTargetEnergyBase, 0)}
                className="font-bold px-2 focus:px-[7px] w-16 h-8 box-border rounded-md border border-[#25d76b] buttonShadow focus:outline-none focus:border-2 focus:border-[#25d76b]"
              />
              <p className="flex items-center mx-2">× 10</p>
              <sup>
                <input
                  type="number"
                  value={targetEnergyBase[1] ?? ''}
                  onChange={handleInputChange(setTargetEnergyBase, 1)}
                  className="font-bold px-1 focus:px-[3px] pb-1 focus:pb-[3px] w-8 box-border relative top-1.5 rounded-md border border-[#25d76b] buttonShadow focus:outline-none focus:border-2 focus:border-[#25d76b]"
                />
              </sup>
            </div>
            <p className="mx-1.5 text-sm">= {targetEnergy.toLocaleString()}</p>
          </td>
        </tr>
        <tr>
          <th>
            <div className="bg-[#6aea4b] text-white rounded-full w-40 h-6 mr-3 flex items-center justify-center">
              目標ねむけパワー
            </div>
          </th>
          <td className="block my-0.5">
            <div className="flex">
              <input
                type="number"
                value={targetNPBase[0] ?? ''}
                onChange={handleInputChange(setTargetNPBase, 0)}
                className="font-bold px-2 focus:px-[7px] w-16 h-8 box-border rounded-md border border-[#25d76b] buttonShadow focus:outline-none focus:border-2 focus:border-[#25d76b]"
              />
              <p className="flex items-center mx-2">× 10</p>
              <sup>
                <input
                  type="number"
                  value={targetNPBase[1] ?? ''}
                  onChange={handleInputChange(setTargetNPBase, 1)}
                  className="font-bold px-1 focus:px-[3px] pb-1 focus:pb-[3px] w-8 box-border relative top-1.5 rounded-md border border-[#25d76b] buttonShadow focus:outline-none focus:border-2 focus:border-[#25d76b]"
                />
              </sup>
            </div>
            <p className="mx-1.5 text-sm">= {targetNP.toLocaleString()}</p>
          </td>
        </tr>
        <tr>
          <th>
            <div className="bg-[#6aea4b] text-white rounded-full w-40 h-6 mr-3 flex items-center justify-center">
              ねむけボーナス
            </div>
          </th>
          <td className="block my-0.5">
            <NPMultiplierSelect NPMultiplier={NPMultiplier} handleNPMultiplier={handleNPMultiplier} />
          </td>
        </tr>
      </table>
    </div>
  );
}

export default NPControlInput;
