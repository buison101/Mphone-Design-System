// material-ui
import Box from '@mui/material/Box';

// project imports
import logoM from 'assets/images/M.svg';
import { maskSx } from 'utils/brandMark';

// ==============================|| LOGO - ICON ||============================== //
//
export default function LogoIcon() {
  return <Box role="img" aria-label="Mphone" sx={{ ...maskSx(logoM, { height: 30, width: 28 }), bgcolor: '#184fcf' }} />;
}
