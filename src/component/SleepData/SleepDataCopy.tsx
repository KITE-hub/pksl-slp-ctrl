import {useState, useCallback} from 'react';
import {SleepDataActionProps, iResult} from '../../types';
import {ThemeProvider} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {IconButton, Snackbar} from '@mui/material';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import {DescriptionTheme} from '../MUIStyledComponents';

function SleepDataCopy({result}: SleepDataActionProps) {
  const [copiedMessageVisible, setCopiedMessageVisible] = useState<boolean>(false);
  const formatResultsAsArray = (results: iResult[]): string => {
    return JSON.stringify(
      results.map(({date, startTime, endTime, sleepType, sleepRate}) => [
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
    const formattedText = formatResultsAsArray(result);
    copyToClipboard(formattedText)
      .then(() => {
        setCopiedMessageVisible(true);
      })
      .catch(() => {});
  }, [result]);
  const onCopiedMessageClose = useCallback(() => {
    setCopiedMessageVisible(false);
  }, [setCopiedMessageVisible]);

  return (
    <div className="SleepDataAction flex items-center ml-auto mr-1">
      <ThemeProvider theme={DescriptionTheme}>
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
