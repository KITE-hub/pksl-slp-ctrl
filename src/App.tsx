import React, {useState, useEffect, useRef, useReducer, useCallback} from 'react';
import {iResult} from './types';
import {styled} from '@mui/material/styles';
import {Tabs, Tab} from '@mui/material';
import TextInput from './component/SleepData/TextInput';
import NPControlInput from './component/NPControl/NPControlInput';
import Description from './component/Description';
import Collapse from '@mui/material/Collapse';
import {IconButton} from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SleepDataCopy from './component/SleepData/SleepDataCopy';
import SleepDataStat from './component/SleepData/SleepDataStat';
import SleepDataGrid from './component/SleepData/SleepDataGrid';
import SleepScoreGrid from './component/NPControl/SleepScoreGrid';

interface State {
  tabIndex: number;
}
interface Action {
  type: string;
  payload?: {index: number};
}
const initialState: State = {tabIndex: 0}; // 初期状態を定義
const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'changeUpperTab':
      return {...state, tabIndex: action.payload?.index ?? state.tabIndex};
    default:
      return state;
  }
};

function App() {
  const [result, setResult] = useState<iResult[]>(() => {
    const savedData = localStorage.getItem('resultData');
    return savedData ? JSON.parse(savedData) : [];
  });
  useEffect(() => {
    localStorage.setItem('resultData', JSON.stringify(result));
  }, [result]);

  const [isSleepDataGridOpen, setIsSleepDataGridOpen] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const storedIsInputOpen = localStorage.getItem('isSleepDataGridOpen');
      return storedIsInputOpen ? JSON.parse(storedIsInputOpen) : true;
    }
    return true;
  });
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('isSleepDataGridOpen', JSON.stringify(isSleepDataGridOpen));
    }
  }, [isSleepDataGridOpen]);

  const inputRef = useRef<HTMLDivElement | null>(null);
  const toggleSleepDataGrid = () => {
    setIsSleepDataGridOpen(!isSleepDataGridOpen);
  };

  const [targetTime, setTargetTime] = useState<[number, number]>([22, 0]);
  const [targetEnergy, setTargetEnergy] = useState<number>(1000000);
  const [targetNP, setTargetNP] = useState<number>(100000000);

  const StyledTabs = styled(Tabs)(({selectedcolor}: {selectedcolor: string}) => ({
    minHeight: '36px',
    '& .MuiTabs-indicator': {
      backgroundColor: selectedcolor // 選択中の下のバーの色を変更
    }
  }));
  const StyledTab = styled(Tab)<{selectedcolor: string}>(({selectedcolor}) => ({
    minHeight: '36px',
    padding: '6px 6px',
    flex: 1,
    fontSize: '12px',
    '&.Mui-selected': {
      color: selectedcolor // 選択中の文字色を変更
    }
  }));
  const [state, dispatch] = useReducer(reducer, initialState);
  const selectedcolor = '#21C462';
  const onTabChange = useCallback((event: React.SyntheticEvent, newValue: number) => {
    dispatch({type: 'changeUpperTab', payload: {index: newValue}});
  }, []);

  return (
    <div className="App">
      <header className="text-xl flex items-center bg-[#25d76b] border-b-2 border-[#0d974f] shadow-md m-0 px-3">
        <h1 className="font-bold m-0 text-white">
          睡眠管理ツール <small>for ポケモンスリープ</small>
        </h1>
        <Description />
      </header>
      <div className="Input w-[360px] mt-4 mb-6 mx-auto">
        <div className="flex">
          <span className="bg-[#25d76b] w-1.5 mr-1.5"></span>
          <div className="flex text-white bg-[#25d76b] px-2 w-full items-end">
            <h2 className="font-bold">テキスト入力</h2>
            <small className="ml-1">(使い方必読)</small>
          </div>
        </div>
        <StyledTabs
          value={state.tabIndex}
          onChange={onTabChange}
          selectedcolor={selectedcolor}
          variant="scrollable"
          scrollButtons="auto"
        >
          <StyledTab selectedcolor={selectedcolor} label="睡眠データ入力" />
          <StyledTab selectedcolor={selectedcolor} label="睡眠計測" />
        </StyledTabs>
        {state.tabIndex === 0 && <TextInput result={result} setResult={setResult} />}
        {state.tabIndex === 1 && (
          <NPControlInput
            targetTime={targetTime}
            setTargetTime={setTargetTime}
            targetEnergy={targetEnergy}
            setTargetEnergy={setTargetEnergy}
            targetNP={targetNP}
            setTargetNP={setTargetNP}
          />
        )}
      </div>
      <div className="SleepData w-[360px] mx-auto mt-4 mb-6 flex flex-col flex-grow-0">
        <div className="flex">
          <span className="bg-[#5dabfe] w-1.5 mr-1.5"></span>
          <div className="flex text-white bg-[#5dabfe] px-2 w-full items-center">
            <h2 className="font-bold">睡眠データ</h2>
            <SleepDataCopy result={result} />
            <IconButton
              aria-label="actions"
              sx={{color: 'white', width: '22px', height: '22px'}}
              onClick={toggleSleepDataGrid}
            >
              {isSleepDataGridOpen ? (
                <KeyboardArrowUpIcon style={{color: 'white', alignSelf: 'center'}} />
              ) : (
                <KeyboardArrowDownIcon style={{color: 'white', alignSelf: 'center'}} />
              )}
            </IconButton>
          </div>
        </div>
        <StyledTabs
          value={state.tabIndex}
          onChange={onTabChange}
          selectedcolor={selectedcolor}
          variant="scrollable"
          scrollButtons="auto"
        >
          <StyledTab selectedcolor={selectedcolor} label="睡眠データ" />
          <StyledTab selectedcolor={selectedcolor} label="ねむけパワー調整" />
        </StyledTabs>
        {state.tabIndex === 0 && (
          <div className="mt-3">
            <SleepDataStat result={result} />
            <Collapse in={isSleepDataGridOpen} timeout="auto" unmountOnExit>
              <div ref={inputRef}>
                <SleepDataGrid result={result} setResult={setResult} />
              </div>
            </Collapse>
          </div>
        )}
        {state.tabIndex === 1 && (
          <div className="mt-3">
            <Collapse in={isSleepDataGridOpen} timeout="auto" unmountOnExit>
              <div ref={inputRef}>
                <SleepScoreGrid targetTime={targetTime} targetEnergy={targetEnergy} targetNP={targetNP} />
              </div>
            </Collapse>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
