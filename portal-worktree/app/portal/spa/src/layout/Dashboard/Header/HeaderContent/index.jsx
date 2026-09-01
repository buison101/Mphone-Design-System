// material-ui
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';

// project imports
import Profile from './Profile';
import MobileSection from './MobileSection';
import ThemeToggle from './ThemeToggle';
import LanguageToggle from './LanguageToggle';
import HeaderSearch from './HeaderSearch';
import LayoutWidthToggle from './LayoutWidthToggle';

// ==============================|| HEADER - CONTENT ||============================== //

export default function HeaderContent() {
  const downLG = useMediaQuery((theme) => theme.breakpoints.down('lg'));

  return (
    <>
      <HeaderSearch />
      <Box sx={{ flexGrow: 1 }} />
      <LanguageToggle />
      <ThemeToggle />
      {!downLG && <LayoutWidthToggle />}
      {!downLG && <Profile />}
      {downLG && <MobileSection />}
    </>
  );
}
