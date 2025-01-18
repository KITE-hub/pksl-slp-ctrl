import React, {useEffect} from 'react';
import {NPControlInputProps} from '../../types';
import FieldNameSelect from './FieldNameSelect';
import NPMultiplierSelect from './NPMultiplierSelect';
import PokeNumberSelect from './PokeNumberSelect';
import UpdateIcon from '@mui/icons-material/Update';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import {IconButton} from '@mui/material';
import {SelectChangeEvent} from '@mui/material';
import fieldPokeNumberNP from '../../db/fieldPokeNumberNP.json';
import {useLocalStorageState} from '../UseLocalStorageState';

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

  const [targetTimeBase, setTargetTimeBase] = useLocalStorageState<[number | null, number | null]>(
    'targetTimeBase',
    [22, 0]
  );
  useEffect(() => {
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
  const updateToCurrentTime = () => {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    setTargetTimeBase([hour, minute]);
    setTargetTime([hour, minute]);
  };

  const [targetEnergyBase, setTargetEnergyBase] = useLocalStorageState<[number | null, number | null]>(
    'targetEnergyBase',
    [100, 4]
  );
  useEffect(() => {
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

  const [targetNPBase, setTargetNPBase] = useLocalStorageState<[number | null, number | null]>(
    'targetNPBase',
    [100, 6]
  );
  const [fieldNumber, setFieldNumber] = useLocalStorageState<number>('fieldNumber', 5);
  const handleFieldNumber = (e: SelectChangeEvent<number>) => {
    setFieldNumber(Number(e.target.value));
  };

  const [isPokeNumberMode, setIsPokeNumberMode] = useLocalStorageState<boolean>('isPokeNumberMode', true);
  const handleIsPokeNumberMode = () => {
    setIsPokeNumberMode((prevMode) => !prevMode);
  };

  const [pokeNumber, setPokeNumber] = useLocalStorageState<number>('pokeNumber', 8);
  const handlePokeNumber = (e: SelectChangeEvent<number>) => {
    setPokeNumber(Number(e.target.value));
  };

  //TargetNPの更新
  useEffect(() => {
    if (isPokeNumberMode) {
      const newNP: number = (fieldPokeNumberNP[fieldNumber] as Record<string, number>)[String(pokeNumber)];
      if (newNP) setTargetNP(newNP);
      else setTargetNP(0);
    } else {
      const [base, exponent] = targetNPBase;
      if (base !== null && exponent !== null) {
        setTargetNP(Math.min(Math.pow(10, 12), Math.round(base * Math.pow(10, exponent) * 100) / 100));
      }
    }
  }, [fieldNumber, isPokeNumberMode, targetNPBase, pokeNumber]);

  return (
    <div className="NPControl mt-3">
      <table className="mx-auto">
        <tr>
          <th>
            <div className="bg-[#6aea4b] text-white rounded-full w-36 h-6 mr-3 flex items-center justify-center">
              計測開始時刻
            </div>
          </th>
          <td className="block my-0.5">
            <div className="flex items-center">
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
              <IconButton aria-label="actions" onClick={updateToCurrentTime}>
                <UpdateIcon sx={{color: '#666'}} />
              </IconButton>
            </div>
          </td>
        </tr>
        <tr>
          <th>
            <div className="bg-[#6aea4b] text-white rounded-full w-36 h-6 mr-3 flex items-center justify-center">
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
            <div className="bg-[#6aea4b] text-white rounded-full w-36 h-6 mr-3 flex items-center justify-center">
              フィールド
            </div>
          </th>
          <td className="block my-0.5">
            <FieldNameSelect fieldNumber={fieldNumber} handleFieldNumber={handleFieldNumber} />
          </td>
        </tr>
        <tr>
          <th>
            {isPokeNumberMode ? (
              <div className="bg-[#6aea4b] text-white rounded-full w-36 h-6 mr-3 flex items-center justify-center">
                出現数
              </div>
            ) : (
              <div className="bg-[#6aea4b] text-white rounded-full w-36 h-6 mr-3 flex items-center justify-center">
                目標ねむけパワー
              </div>
            )}
          </th>
          <td className="block my-0.5">
            <div className="flex items-center">
              {isPokeNumberMode ? (
                <div className="mr-3">
                  <div className="flex items-center">
                    <PokeNumberSelect pokeNumber={pokeNumber} handlePokeNumber={handlePokeNumber} />
                    <span className="ml-2">匹</span>
                  </div>
                  <p className="mx-1.5 text-sm">= {targetNP.toLocaleString()}</p>
                </div>
              ) : (
                <div className="mr-3">
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
                </div>
              )}
              <IconButton aria-label="actions" onClick={handleIsPokeNumberMode}>
                <SwapHorizIcon sx={{color: '#666'}} />
              </IconButton>
            </div>
          </td>
        </tr>
        <tr>
          <th>
            <div className="bg-[#6aea4b] text-white rounded-full w-36 h-6 mr-3 flex items-center justify-center">
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
