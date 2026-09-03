// material-ui
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// third-party
import { motion } from 'framer-motion';

// project imports
import CategoryCard from './CategoryCard';
import ContainerWrapper from 'components/ContainerWrapper';
import MainCard from 'components/MainCard';
import SectionTypeset from 'components/pages/SectionTypeset';

// data
import { promptCategories } from 'data/prompt-categories';

// assets
import CheckOutlined from '@ant-design/icons/CheckOutlined';

import categoryApplications from 'assets/images/landing/category-application.svg';
import categoryAuthentication from 'assets/images/landing/category-auth.svg';
import categoryCommon from 'assets/images/landing/category-common.svg';
import categoryDashboard from 'assets/images/landing/category-dashboard.svg';
import categoryData from 'assets/images/landing/category-data.svg';
import categoryForms from 'assets/images/landing/category-forms.svg';
import categoryLanding from 'assets/images/landing/category-landing.svg';
import categoryLayout from 'assets/images/landing/category-layout.svg';
import categoryTheme from 'assets/images/landing/category-theme.svg';

// ==============================|| MAPPING: FOLDER NAME TO CATEGORY NAME ||============================== //

// Helper function to get items for a folderName
// Matched on `slug`, not on the display name. The old code mapped a folder name
// to a category's LABEL and then searched by that label, so translating the
// label emptied every pricing card. Every category carries a stable `slug`.
const getCategoryItems = (folderName) => promptCategories.find((cat) => cat.slug === folderName)?.items || [];

// Hoisted into a function so the labels are rebuilt on every render. As a
// module-scope constant this was evaluated once on import, which froze the
// first locale loaded. See docs/15 §4.7.
const getPromptsItems = () => [
  {
    image: categoryTheme,
    title: 'Theming',
    description: 'Color palettes, typography, directions, i18n and dark mode.',
    promptsNumber: 6,
    freePrompts: '2 Free Prompts',
    delay: 0.2,
    folderName: 'theming',
    items: getCategoryItems('theming')
  },
  {
    image: categoryApplications,
    title: 'Applications',
    description: 'Ready-to-use application templates for various use cases.',
    promptsNumber: 16,
    delay: 0.4,
    folderName: 'apps',
    items: getCategoryItems('apps')
  },
  {
    image: categoryAuthentication,
    title: 'Authentication',
    description: 'Login forms, JWT handling, and secure routes.',
    promptsNumber: 5,
    freePrompts: '1 Free Prompt',
    delay: 0.6,
    folderName: 'auth',
    items: getCategoryItems('auth')
  },
  {
    image: categoryData,
    title: 'Data Fetching [API]',
    description: 'API integration, react-query, and SWR patterns.',
    promptsNumber: 2,
    delay: 0.8,
    folderName: 'api',
    items: getCategoryItems('api')
  },
  {
    image: categoryDashboard,
    title: 'Dashboards',
    description: 'Enhance your dashboard with various features',
    promptsNumber: 5,
    freePrompts: '1 Free Prompt',
    delay: 1.2,
    folderName: 'dashboard',
    items: getCategoryItems('dashboard')
  },
  {
    image: categoryLanding,
    title: 'Landing Page',
    description: 'Pre-built landing page templates for various use cases',
    promptsNumber: 1,
    delay: 1.0,
    folderName: 'landing',
    items: getCategoryItems('landing')
  },
  {
    image: categoryCommon,
    title: 'Core',
    description: 'Miscellaneous prompts for various use cases',
    promptsNumber: 16,
    freePrompts: '3 Free Prompts',
    delay: 1.6,
    folderName: 'core',
    items: getCategoryItems('core')
  },
  {
    image: categoryLayout,
    title: 'Layouts',
    description: 'Pre-built layouts for dashboards, admin panels, and more',
    promptsNumber: 6,
    freePrompts: '3 Free Prompts',
    delay: 1.2,
    folderName: 'layouts',
    items: getCategoryItems('layouts')
  },
  {
    image: categoryForms,
    title: 'UI Elements',
    description: 'Complete form layouts, validation, and input components.',
    promptsNumber: 3,
    freePrompts: '1 Free Prompt',
    delay: 1.4,
    folderName: 'ui-elements',
    items: getCategoryItems('ui-elements')
  }
];

const planList = [
  'Unlimited prompt access',
  'Agents.md integration',
  'Advance chain-of-thought',
  'Constantly adding new prompts',
  'Performance optimization',
  '8+ prompts categories',
  'Advanced Model Tuning',
  'Custom logic support',
  'Support within 24-48 hours'
];

// ==============================|| AI PROMPTS - PRICING CARD ||============================== //

function PricingCard() {
  return (
    <MainCard sx={{ borderWidth: 3, borderColor: 'primary.main', position: 'relative', overflow: 'visible' }}>
      <Chip
        label="PRO ACCESS"
        color="primary"
        sx={{ position: 'absolute', top: 0, left: '50%', transform: 'translate(-50%, -50%)', fontSize: '0.75rem' }}
      />

      <Stack sx={{ gap: 2 }}>
        <Typography variant="h6">Full library</Typography>
        <Typography variant="h2">Free for Mantis Pro Users </Typography>
        <Typography sx={{ mt: -1.5, color: 'text.secondary' }}>Powerful prompts to ship your project faster.</Typography>
        <Button variant="contained" href="https://mui.com/store/items/mantis-react-admin-dashboard-template/" target="_blank">
          Unlock 50+ Pro Prompts
        </Button>
        <List
          component="ul"
          sx={(theme) => ({ m: 0, p: 0, '&> li': { px: 0, py: 0.625, '& svg': { fill: theme.vars.palette.success.dark } } })}
        >
          {planList.map((list, i) => (
            <ListItem key={i} divider>
              <ListItemIcon>
                <CheckOutlined />
              </ListItemIcon>
              <ListItemText primary={list} />
            </ListItem>
          ))}
        </List>
      </Stack>
    </MainCard>
  );
}

// ==============================|| AI PROMPTS - PRICING ||============================== //

export default function Pricing() {
  const promptsItems = getPromptsItems();
  return (
    <ContainerWrapper>
      <Grid container spacing={2}>
        <Grid size={12}>
          <Grid container spacing={1} sx={{ mb: 4, textAlign: 'center', justifyContent: 'center' }}>
            <Grid size={{ sm: 10, md: 6 }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <SectionTypeset
                  caption="Free for mantis pro users"
                  heading="Buy Now to Get Full Access to All Prompts and Features"
                  description=""
                  headingProps={{ sx: { alignSelf: 'center', width: { xs: '100%', sm: '80%' } } }}
                />
              </motion.div>
            </Grid>
          </Grid>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <PricingCard />
          </motion.div>
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          <Grid container spacing={2.5}>
            {promptsItems.map((item, index) => (
              <Grid key={index} size={{ xs: 12, sm: 4 }}>
                <CategoryCard {...item} />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </ContainerWrapper>
  );
}
