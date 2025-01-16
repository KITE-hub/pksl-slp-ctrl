import React, {useState, useEffect, useRef, useReducer, useCallback} from 'react';
import {ISleepData} from './types';
import {styled} from '@mui/material/styles';
import {ThemeProvider} from '@mui/material/styles';
import {Tabs, Tab} from '@mui/material';
import {SelectChangeEvent} from '@mui/material';
import SleepDataInput from './component/SleepData/SleepDataInput';
import NPControlInput from './component/NPControl/NPControlInput';
import Description from './component/Description';
import Collapse from '@mui/material/Collapse';
import {IconButton} from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SleepDataCopy from './component/SleepData/SleepDataCopy';
import SleepDataStat from './component/SleepData/SleepDataStat';
import SleepDataGrid from './component/SleepData/SleepDataGrid';
import NPControlOutput from './component/NPControl/NPControlOutput';
import {theme} from './component/MUIStyledComponents';

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
  const [sleepData, setSleepData] = useState<ISleepData[]>(() => {
    const savedData = localStorage.getItem('resultData');
    return savedData ? JSON.parse(savedData) : [];
  });
  useEffect(() => {
    localStorage.setItem('result', JSON.stringify(sleepData));
  }, [sleepData]);

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

  const [targetTime, setTargetTime] = useState<[number, number]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('targetTime');
      return saved ? JSON.parse(saved) : [22, 0];
    }
    return [22, 0];
  });
  useEffect(() => {
    localStorage.setItem('targetTime', JSON.stringify(targetTime));
  }, [targetTime]);

  const [targetEnergy, setTargetEnergy] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('targetEnergy');
      return saved ? Number(saved) : 1000000;
    }
    return 1000000;
  });
  useEffect(() => {
    localStorage.setItem('targetEnergy', targetEnergy.toString());
  }, [targetEnergy]);

  const [targetNP, setTargetNP] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('targetNP');
      return saved ? Number(saved) : 1000000;
    }
    return 100000000;
  });
  useEffect(() => {
    localStorage.setItem('targetNP', targetNP.toString());
  }, [targetNP]);

  const [NPMultiplier, setNPMultiplier] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('NPMultiplier');
      return saved ? Number(saved) : 1000000;
    }
    return 1;
  });
  useEffect(() => {
    localStorage.setItem('NPMultiplier', NPMultiplier.toString());
  }, [NPMultiplier]);
  const handleNPMultiplier = (e: SelectChangeEvent<number>) => {
    setNPMultiplier(Number(e.target.value));
  };

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
    fontSize: '14px',
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
      <ThemeProvider theme={theme}>
        <div className="Input w-[360px] mt-4 mb-6 mx-auto">
          <div className="flex">
            <span className="bg-[#25d76b] w-1.5 mr-1.5"></span>
            <div className="flex text-white bg-[#25d76b] px-2 w-full items-end">
              <h2 className="font-bold">入力欄</h2>
              <small className="ml-1">(使い方,注意点必読)</small>
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
          {state.tabIndex === 0 && <SleepDataInput sleepData={sleepData} setSleepData={setSleepData} />}
          {state.tabIndex === 1 && (
            <NPControlInput
              setTargetTime={setTargetTime}
              targetEnergy={targetEnergy}
              setTargetEnergy={setTargetEnergy}
              targetNP={targetNP}
              setTargetNP={setTargetNP}
              NPMultiplier={NPMultiplier}
              handleNPMultiplier={handleNPMultiplier}
            />
          )}
        </div>
        <div className="SleepData w-[360px] mx-auto mt-4 mb-6 flex flex-col flex-grow-0">
          <div className="flex">
            <span className="bg-[#5dabfe] w-1.5 mr-1.5"></span>
            <div className="flex text-white bg-[#5dabfe] px-2 w-full items-center">
              <h2 className="font-bold">出力欄</h2>
              <SleepDataCopy sleepData={sleepData} />
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
              <SleepDataStat sleepData={sleepData} />
              <Collapse in={isSleepDataGridOpen} timeout="auto" unmountOnExit>
                <div ref={inputRef}>
                  <SleepDataGrid sleepData={sleepData} setSleepData={setSleepData} />
                </div>
              </Collapse>
            </div>
          )}
          {state.tabIndex === 1 && (
            <div className="mt-3">
              <Collapse in={isSleepDataGridOpen} timeout="auto" unmountOnExit>
                <div ref={inputRef}>
                  <NPControlOutput
                    targetTime={targetTime}
                    targetEnergy={targetEnergy}
                    targetNP={targetNP}
                    NPMultiplier={NPMultiplier}
                  />
                </div>
              </Collapse>
            </div>
          )}
        </div>
      </ThemeProvider>
    </div>
  );
}

export default App;
