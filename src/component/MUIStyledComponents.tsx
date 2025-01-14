import {TextField, Button, DialogTitle} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import {styled} from '@mui/material/styles';
import {createTheme} from '@mui/material/styles';

// TextInput.tsx

export const StyledTextInputField = styled(TextField)({
  width: '70%',
  display: 'block',
  margin: '4px 0px 4px 20px',
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    boxShadow: '0px 2px 0px 0px rgba(0, 0, 0, .1)',
    backgroundColor: 'white',
    padding: '8px 10px',
    width: '100%',
    fontSize: '16px',
    fontWeight: 'normal',
    // eslint-disable-next-line
    fontFamily: "'M PLUS 1p'",
    '& fieldset': {
      borderColor: '#25d76b'
    },
    '&:hover fieldset': {
      borderColor: '#25d76b'
    },
    '&.Mui-focused fieldset': {
      borderColor: '#25d76b'
    }
  }
});

// Description.tsx

export const DescriptionTheme = createTheme({
  typography: {
    fontFamily:
      // eslint-disable-next-line
      "'M PLUS 1p','Noto Sans JP', 'Helvetica Neue', 'Helvetica', 'Hiragino Sans', 'Arial', 'Yu Gothic', 'Meiryo', sans-serif",
    fontSize: 14
  }
});
export const StyledDialogTitle = styled(DialogTitle)({
  fontSize: '20px',
  fontWeight: 'bold',
  color: '#333'
});
export const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    boxShadow: '0px 2px 0px 0px rgba(0, 0, 0, .1)',
    backgroundColor: 'white',
    // padding: '8px 10px',
    width: '100%',
    fontSize: '16px',
    fontWeight: 'normal',
    // eslint-disable-next-line
    fontFamily: "'M PLUS 1p'",
    '& fieldset': {
      borderColor: '#25d76b'
    },
    '&:hover fieldset': {
      borderColor: '#25d76b'
    },
    '&.Mui-focused fieldset': {
      borderColor: '#25d76b'
    }
  }
});
export const StyledButton = styled(Button)({
  color: '#333',
  fontWeight: 'bold',
  borderRadius: '9999px',
  fontSize: '16px',
  paddingTop: '6px',
  paddingBottom: '6px',
  display: 'flex',
  margin: '5px auto',
  width: '128px',
  border: '1px solid #999',
  boxShadow: '0px 2px 0px 0px rgba(0, 0, 0, .1)',
  '&:hover': {
    backgroundColor: 'inherit'
  }
});
