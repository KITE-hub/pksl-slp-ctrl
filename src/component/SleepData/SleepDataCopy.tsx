import {useState, useCallback} from 'react';
import {SleepDataActionProps, ISleepData} from '../../types';
import {ThemeProvider} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {IconButton, Snackbar} from '@mui/material';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import {theme} from '../MUIStyledComponents';

function SleepDataCopy({sleepData}: SleepDataActionProps) {
  const [copiedMessageVisible, setCopiedMessageVisible] = useState<boolean>(false);
  const formatSleepDataAsArray = (sleepData: ISleepData[]): string => {
    return JSON.stringify(
      sleepData.map(({date, startTime, endTime, sleepType, sleepRate}) => [
        date,
        startTime,
        endTime,
        sleepType,
        sleepRate
      ])
    );
  };
  const copyToClipboard = async (text: string) => {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
    }
  };
  const onCopy = useCallback(() => {
    const formattedText = formatSleepDataAsArray(sleepData);
    copyToClipboard(formattedText)
      .then(() => {
        setCopiedMessageVisible(true);
      })
      .catch(() => {});
  }, [sleepData]);
  const onCopiedMessageClose = useCallback(() => {
    setCopiedMessageVisible(false);
  }, [setCopiedMessageVisible]);

  return (
    <div className="SleepDataAction flex items-center ml-auto mr-1">
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <IconButton aria-label="actions" sx={{color: 'white', width: '22px', height: '22px'}} onClick={onCopy}>
          <FileCopyIcon sx={{width: '15px', height: '15px'}} />
        </IconButton>
      </ThemeProvider>
      <Snackbar
        open={copiedMessageVisible}
        autoHideDuration={2000}
        onClose={onCopiedMessageClose}
        message="睡眠データをコピーしました(定期的なバックアップを推奨します)。"
      />
    </div>
  );
}

export default SleepDataCopy;
