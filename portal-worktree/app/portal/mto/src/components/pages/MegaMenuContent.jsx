import { Link } from 'react-router-dom';

// material-ui
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project imports
import AnimateButton from 'components/@extended/AnimateButton';
import Dot from 'components/@extended/Dot';
import MainCard from 'components/MainCard';
import SimpleBar from 'components/third-party/SimpleBar';

// assets
import ArrowRightOutlined from '@ant-design/icons/ArrowRightOutlined';
import backgroundVector from 'assets/images/mega-menu/back.svg';

// ==============================|| HEADER CONTENT - MEGA MENU CONTENT ||============================== //

const menuSections = [
  {
    id: 'auth',
    title: 'Authentication',
    size: { md: 4.25 },
    items: [
      { id: 'login', title: 'Login', to: '/auth/login', target: '_blank' },
      { id: 'register', title: 'Register', to: '/auth/register', target: '_blank' },
      { id: 'reset-password', title: 'Reset Password', to: '/auth/reset-password', target: '_blank' },
      { id: 'forgot-password', title: 'Forgot Password', to: '/auth/forgot-password', target: '_blank' },
      { id: 'check-mail', title: 'Check Mail', to: '/auth/check-mail', target: '_blank' },
      { id: 'code-verification', title: 'Verify Code', to: '/auth/code-verification', target: '_blank' }
    ]
  },
  {
    id: 'maintenance',
    title: 'Maintenance Pages',
    size: { md: 4 },
    items: [
      { id: 'error-404', title: '404 Error', to: '/maintenance/404', target: '_blank' },
      { id: 'error-500', title: '500 Error', to: '/maintenance/500', target: '_blank' },
      { id: 'coming-soon', title: 'Coming Soon', to: '/maintenance/coming-soon', target: '_blank' },
      { id: 'construction', title: 'Construction', to: '/maintenance/under-construction', target: '_blank' },
      { id: 'join-waitlist', title: 'Join Waitlist', to: '/maintenance/join-waitlist', target: '_blank' }
    ]
  },
  {
    id: 'saas',
    title: 'SAAS Pages',
    size: { xs: 12, md: 3.75 },
    items: [
      { id: 'contact-us', title: 'Contact us', to: '/contact-us', target: '_blank' },
      { id: 'faq', title: 'FAQ', to: '/faqs', target: '_blank' },
      { id: 'pricing', title: 'Pricing', to: '/pricing', target: '_blank' },
      { id: 'change-log', title: 'Change Log', to: '/change-log', target: '_blank' },
      { id: 'landing', title: 'Landing', to: '/', target: '_blank' }
    ]
  }
];

export default function MegaMenuContent() {
  return (
    <MainCard
      elevation={0}
      border={false}
      content={false}
      sx={{ boxShadow: 'none', width: 1, borderRadius: { xs: 0, md: 1 }, '&:hover': { boxShadow: 'none' } }}
    >
      <SimpleBar sx={{ maxHeight: 'calc(100vh - 70px)', '& .simplebar-content': { display: 'flex', flexDirection: 'column' } }}>
        <Grid container>
          <Grid
            sx={(theme) => ({
              background: `url(${backgroundVector}), linear-gradient(183.77deg, ${theme.vars.palette.primary.main} 11.46%, ${theme.vars.palette.primary[700]} 100.33%)`
            })}
            size={{ md: 4.25 }}
          >
            <Box sx={{ p: 4.5, pb: 3, height: '100%' }}>
              <Stack
                sx={(theme) => ({
                  height: '100%',
                  justifyContent: 'center',
                  color: 'background.paper',
                  ...theme.applyStyles('dark', { color: 'text.primary' })
                })}
              >
                <Typography variant="h2" sx={{ fontSize: '1.875rem', mb: 1 }}>
                  Prompt Library
                </Typography>
                <Typography variant="h6">Curated prompts for common use cases to build faster without repeating instructions.</Typography>
                <AnimateButton>
                  <Button
                    variant="contained"
                    color="secondary"
                    sx={{
                      my: 4,
                      bgcolor: 'background.paper',
                      color: 'text.primary',
                      '&:hover': { bgcolor: 'background.paper', color: 'text.primary' }
                    }}
                    endIcon={<ArrowRightOutlined />}
                    component={Link}
                    to="/prompts-overview"
                    target="_blank"
                  >
                    Browse Prompts
                  </Button>
                </AnimateButton>
              </Stack>
            </Box>
          </Grid>
          <Grid size={{ md: 7.75 }}>
            <Box
              sx={{
                p: 4,
                '& .MuiList-root': { pb: 0 },
                '& .MuiListSubheader-root': { p: 0, pb: { xs: 1, md: 1.5 } },
                '& .MuiListItemButton-root': {
                  p: 0.5,
                  '&:hover': { bgcolor: 'transparent', '& .MuiTypography-root': { color: 'primary.main' } }
                }
              }}
            >
              <Grid container spacing={{ xs: 3.5, md: 6 }}>
                {menuSections.map((section) => (
                  <Grid key={section.id} size={section.size}>
                    <List
                      component="nav"
                      aria-labelledby={`nested-list-${section.id}`}
                      subheader={
                        <ListSubheader id={`nested-list-${section.id}`}>
                          <Typography variant="subtitle1" sx={{ color: 'text.primary' }}>
                            {section.title}
                          </Typography>
                        </ListSubheader>
                      }
                    >
                      {section.items.map((item) => (
                        <ListItemButton
                          key={item.id}
                          disableRipple
                          component={Link}
                          to={item.to}
                          {...(item.target && { target: item.target })}
                        >
                          <ListItemIcon>
                            <Dot size={7} color="secondary" variant="outlined" />
                          </ListItemIcon>
                          <ListItemText primary={item.title} />
                        </ListItemButton>
                      ))}
                    </List>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </SimpleBar>
    </MainCard>
  );
}
