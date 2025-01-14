import React, {useState, useEffect} from 'react';
import {NPControlInputProps} from '../../types';

function NPControlInput({
  targetTime,
  setTargetTime,
  targetEnergy,
  setTargetEnergy,
  targetNP,
  setTargetNP
}: NPControlInputProps) {
  const handleEnergy = (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10);
    if (!isNaN(value)) {
      setTargetTime((prev): [number, number] => {
        const updated = [...prev];
        updated[index] = value;
        if ((index === 1 && updated[1] >= 60) || (index === 0 && updated[0] >= 24)) {
          const minute = updated[0] * 60 + updated[1];
          updated[0] = Math.floor(minute / 60) % 24;
          updated[1] = minute % 60;
        }
        return updated as [number, number];
      });
    }
  };
  const handleInputChange =
    (setter: React.Dispatch<React.SetStateAction<[number, number]>>, index: number) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(e.target.value, 10);
      if (!isNaN(value)) {
        setter((prev) => {
          const updated = [...prev];
          updated[index] = value;
          return updated as [number, number];
        });
      }
    };

  const [targetEnergyBase, setTargetEnergyBase] = useState<[number, number]>([100, 4]);
  useEffect(() => {
    const expandedValue = Math.round(targetEnergyBase[0] * Math.pow(10, targetEnergyBase[1]) * 100) / 100;
    setTargetEnergy(expandedValue);
  }, [targetEnergyBase]);
  const [targetNPBase, setTargetNPBase] = useState<[number, number]>([100, 6]);
  useEffect(() => {
    const expandedValue = Math.round(targetNPBase[0] * Math.pow(10, targetNPBase[1]) * 100) / 100;
    setTargetNP(expandedValue);
  }, [targetNPBase]);

  return (
    <div className="NPControl mt-3">
      <table className="mx-auto">
        <tr className="h-10">
          <th>
            <div className="bg-[#6aea4b] text-white rounded-full w-40 h-6 mr-3 flex items-center justify-center">
              計測開始時刻
            </div>
          </th>
          <td className="flex">
            <input
              type="number"
              value={targetTime[0]}
              onChange={handleEnergy(0)}
              className="font-bold px-2 focus:px-[7px] w-12 py-1 focus:py-[3px] box-border rounded-md border border-[#25d76b] buttonShadow focus:outline-none focus:border-2 focus:border-[#25d76b]"
            />
            <p className="flex items-center mx-2">時</p>
            <input
              type="number"
              value={targetTime[1]}
              onChange={handleEnergy(1)}
              className="font-bold px-2 focus:px-[7px] w-12 py-1 focus:py-[3px] box-border rounded-md border border-[#25d76b] buttonShadow focus:outline-none focus:border-2 focus:border-[#25d76b]"
            />
            <p className="flex items-center mx-2">分</p>
          </td>
        </tr>
        <tr className="h-14">
          <th>
            <div className="bg-[#6aea4b] text-white rounded-full w-40 h-6 mr-3 flex items-center justify-center">
              現在のエナジー
            </div>
          </th>
          <td className="py-1">
            <div className="flex">
              <input
                type="number"
                value={targetEnergyBase[0]}
                onChange={handleInputChange(setTargetEnergyBase, 0)}
                className="font-bold px-2 focus:px-[7px] w-16 py-1 focus:py-[3px] box-border rounded-md border border-[#25d76b] buttonShadow focus:outline-none focus:border-2 focus:border-[#25d76b]"
              />
              <p className="flex items-center mx-2">× 10</p>
              <sup>
                <input
                  type="number"
                  value={targetEnergyBase[1]}
                  onChange={handleInputChange(setTargetEnergyBase, 1)}
                  className="font-bold px-1 focus:px-[3px] pb-1 focus:pb-[3px] w-8 box-border relative top-1.5 rounded-md border border-[#25d76b] buttonShadow focus:outline-none focus:border-2 focus:border-[#25d76b]"
                />
              </sup>
            </div>
            <p className="flex items-center mx-1.5 text-sm">= {targetEnergy.toLocaleString()}</p>
          </td>
        </tr>
        <tr className="h-14">
          <th>
            <div className="bg-[#6aea4b] text-white rounded-full w-40 h-6 mr-3 flex items-center justify-center">
              目標ねむけパワー
            </div>
          </th>
          <td className="py-1">
            <div className="flex">
              <input
                type="number"
                value={targetNPBase[0]}
                onChange={handleInputChange(setTargetNPBase, 0)}
                className="font-bold px-2 focus:px-[7px] w-16 py-1 focus:py-[3px] box-border rounded-md border border-[#25d76b] buttonShadow focus:outline-none focus:border-2 focus:border-[#25d76b]"
              />
              <p className="flex items-center mx-2">× 10</p>
              <sup>
                <input
                  type="number"
                  value={targetNPBase[1]}
                  onChange={handleInputChange(setTargetNPBase, 1)}
                  className="font-bold px-1 focus:px-[3px] pb-1 focus:pb-[3px] w-8 box-border relative top-1.5 rounded-md border border-[#25d76b] buttonShadow focus:outline-none focus:border-2 focus:border-[#25d76b]"
                />
              </sup>
            </div>
            <p className="flex items-center mx-1.5 text-sm">= {targetNP.toLocaleString()}</p>
          </td>
        </tr>
      </table>
    </div>
  );
}

export default NPControlInput;
