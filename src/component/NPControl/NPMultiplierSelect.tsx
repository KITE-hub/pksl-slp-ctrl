import React from 'react';
import {NPMultiplierSelectProps} from '../../types';
import {styled, createTheme, ThemeProvider} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {MenuItem, FormControl, InputLabel, Select, OutlinedInput} from '@mui/material';

const theme = createTheme({
  typography: {
    fontFamily:
      "'M PLUS 1p','Roboto','Noto Sans JP', 'Helvetica Neue', 'Helvetica', 'Hiragino Sans', 'Arial', 'Yu Gothic', 'Meiryo', sans-serif"
  },
  palette: {
    text: {
      primary: '#333'
    }
  }
});
const StyledOutlinedInput = styled(OutlinedInput)(({theme}) => ({
  backgroundColor: 'white',
  height: '36px',
  width: '80px',
  padding: '0px 0px 0px 10px',
  margin: '1px 0px',
  borderRadius: '8px',
  fontWeight: 'bold',
  boxShadow: '0px 2px 0px 0px rgba(0, 0, 0, .1)',
  '& .MuiInputBase-input': {
    padding: '0px' // 内側のpadding
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: '#25d76b' // 通常時の枠線
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: '#25d76b' // ホバー時の枠線
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: '#25d76b' // フォーカス時の枠線
  },
  '& .MuiSelect-icon': {
    right: '9px'
    // color: '#25d76b',
  }
}));
const menuProps = {
  PaperProps: {
    style: {
      boxShadow: 'none',
      border: '1px solid #25d76b',
      borderRadius: '8px'
    }
  }
};
const StyledMenuItem = styled(MenuItem)(({theme}) => ({
  '&.Mui-selected': {
    backgroundColor: 'white',
    borderColor: '#25d76b',
    '&:hover': {
      backgroundColor: 'hsl(143, 70%, 95%)' // 選択状態かつホバー　'#D3F7E1'
    }
  },
  '&.Mui-selected:not(:hover)': {
    backgroundColor: 'hsl(143, 70%, 98%)' // 選択中かつホバーしていない
  },
  '&:hover': {
    backgroundColor: 'hsl(143, 70%, 95%)' // 選択していないかつホバー
  }
}));

const NPMultiplierSelect: React.FC<NPMultiplierSelectProps> = ({NPMultiplier, handleNPMultiplier}) => {
  return (
    <div className="NPMultiplierSelect">
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <FormControl fullWidth>
          <InputLabel id="custom-select-label"></InputLabel>
          <Select
            labelId="custom-select-label"
            id="custom-select"
            value={NPMultiplier}
            onChange={(e) => handleNPMultiplier(e)}
            input={<StyledOutlinedInput />}
            MenuProps={menuProps}
          >
            <StyledMenuItem value={1}>なし</StyledMenuItem>
            <StyledMenuItem value={1.5}>×1.5</StyledMenuItem>
            <StyledMenuItem value={2}>×2.0</StyledMenuItem>
            <StyledMenuItem value={2.5}>×2.5</StyledMenuItem>
            <StyledMenuItem value={3}>×3</StyledMenuItem>
            <StyledMenuItem value={4}>×4</StyledMenuItem>
          </Select>
        </FormControl>
      </ThemeProvider>
    </div>
  );
};

export default NPMultiplierSelect;
