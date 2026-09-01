// material-ui
import Box from '@mui/material/Box';

// project imports
import logoMphone from 'assets/images/Logo-Mphone.svg';
import { maskSx } from 'utils/brandMark';

// ==============================|| LOGO - MAIN ||============================== //
//
export default function LogoMain() {
  return <Box role="img" aria-label="Mphone" sx={{ ...maskSx(logoMphone, { height: 28, width: 102 }), bgcolor: 'text.primary' }} />;
}
