// react
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';

// material-ui
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project imports
import MainCard from 'components/MainCard';
import CategoryCard from 'sections/landing/CategoryCard';

// data
import { promptCategories } from 'data/prompt-categories';

// assets - Category images
import categoryAPI from 'assets/images/landing/category-data.svg';
import categoryApps from 'assets/images/landing/category-application.svg';
import categoryAuth from 'assets/images/landing/category-auth.svg';
import categoryCore from 'assets/images/landing/category-common.svg';
import categoryDashboard from 'assets/images/landing/category-dashboard.svg';
import categoryLanding from 'assets/images/landing/category-landing.svg';
import categoryLayouts from 'assets/images/landing/category-layout.svg';
import categoryTheming from 'assets/images/landing/category-theme.svg';
import categoryUI from 'assets/images/landing/category-forms.svg';

// Category metadata with images and descriptions
const categoryMetadata = {
  API: {
    image: categoryAPI,
    description: 'Connect to backend APIs and integrate real-time data'
  },
  Apps: {
    image: categoryApps,
    description: 'Complete applications and feature implementations'
  },
  Auth: {
    image: categoryAuth,
    description: 'Authentication providers and security features'
  },
  Core: {
    image: categoryCore,
    description: 'Core functionality and system configurations'
  },
  Dashboard: {
    image: categoryDashboard,
    description: 'Dashboard enhancements and widgets'
  },
  Landing: {
    image: categoryLanding,
    description: 'Landing page customizations'
  },
  Layouts: {
    image: categoryLayouts,
    description: 'Navigation and menu management'
  },
  Theming: {
    image: categoryTheming,
    description: 'Theme customization and styling'
  },
  'UI Elements': {
    image: categoryUI,
    description: 'Form inputs and UI components'
  }
};

export default function PromptsOverviewPage() {
  const pageTitle = 'Prompts Overview';
  const headerCaption = 'Select a category to explore available prompts.';
  const { filter } = useParams();

  const filterType = (() => {
    if (filter === 'free' || filter === 'pro') {
      return filter;
    }
    return 'all';
  })();

  // Calculate filtered categories and prompt counts
  const filteredCategoriesData = useMemo(() => {
    return promptCategories
      .map((category) => {
        const filteredItems = filterType === 'all' ? category.items : category.items.filter((item) => item.type === filterType);

        return {
          ...category,
          promptCount: filteredItems.length
        };
      })
      .filter((category) => category.promptCount > 0)
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [filterType]);

  return (
    <Stack sx={{ gap: 3 }}>
      <MainCard>
        <Stack sx={{ gap: 1.5 }}>
          <Typography variant="h4">{pageTitle}</Typography>
          <Typography variant="h5" sx={{ color: 'grey.600', fontWeight: 400, width: { xs: 1, sm: '75%' } }}>
            {headerCaption}
          </Typography>
        </Stack>
      </MainCard>
      {/* Category Cards Grid */}
      <Grid container spacing={3}>
        {filteredCategoriesData.map((category, index) => {
          const metadata = categoryMetadata[category.name] || {
            image: categoryCore,
            description: `Explore ${category.name} prompts`
          };

          const categorySlug = (category.slug || category.name.toLowerCase().replace(/\s+/g, '-')).toLowerCase();

          return (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={category.name}>
              <CategoryCard
                id={categorySlug}
                image={metadata.image}
                title={category.name}
                description={metadata.description}
                promptsNumber={category.promptCount}
                items={category.items}
                delay={index * 0.1}
              />
            </Grid>
          );
        })}
      </Grid>
    </Stack>
  );
}
