import { useMemo } from 'react';

// material-ui
import Grid from '@mui/material/Grid';

// project imports
import CategoryCard from './CategoryCard';
import ContainerWrapper from 'components/ContainerWrapper';
import SectionTypeset from 'components/pages/SectionTypeset';

// data
import { promptCategories } from 'data/prompt-categories';

// assets
import categoryApps from 'assets/images/landing/category-application.svg';
import categoryAuth from 'assets/images/landing/category-auth.svg';
import categoryCore from 'assets/images/landing/category-common.svg';
import categoryDashboard from 'assets/images/landing/category-dashboard.svg';
import categoryAPI from 'assets/images/landing/category-data.svg';
import categoryUI from 'assets/images/landing/category-forms.svg';
import categoryLanding from 'assets/images/landing/category-landing.svg';
import categoryLayouts from 'assets/images/landing/category-layout.svg';
import categoryTheming from 'assets/images/landing/category-theme.svg';

// ==============================|| CATEGORY METADATA ||============================== //

// Category metadata with images and descriptions
// Hoisted into a function so the labels are rebuilt on every render. As a
// module-scope constant this was evaluated once on import, which froze the
// first locale loaded. See docs/15 §4.7.
// Keyed by slug, not by the display name. `categoryMetadata[category.name]`
// made the category's own label a lookup key, so translating it silently
// dropped every card to the fallback image and description — the same defect
// class as sorting by a column's header. Every category carries a `slug`.
const getCategoryMetadata = () => ({
  api: {
    image: categoryAPI,
    description: 'Connect to backend APIs and integrate real-time data'
  },
  apps: {
    image: categoryApps,
    description: 'Complete applications and feature implementations'
  },
  auth: {
    image: categoryAuth,
    description: 'Authentication providers and security features'
  },
  core: {
    image: categoryCore,
    description: 'Core functionality and system configurations'
  },
  dashboard: {
    image: categoryDashboard,
    description: 'Dashboard enhancements and widgets'
  },
  landing: {
    image: categoryLanding,
    description: 'Landing page customizations'
  },
  layouts: {
    image: categoryLayouts,
    description: 'Navigation and menu management'
  },
  theming: {
    image: categoryTheming,
    description: 'Theme customization and styling'
  },
  'ui-elements': {
    image: categoryUI,
    description: 'Form inputs and UI components'
  }
});

// ==============================|| LANDING - CATEGORY BLOCK PAGE ||============================== //

export default function CategoryBlock() {
  const categoryMetadata = getCategoryMetadata();
  const filteredCategoriesData = useMemo(() => {
    return promptCategories
      .map((category) => {
        const filteredItems = category.items;
        return {
          ...category,
          promptCount: filteredItems.length
        };
      })
      .filter((category) => category.promptCount > 0)
      .sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  return (
    <ContainerWrapper>
      <Grid container spacing={1} sx={{ mb: 3.5, textAlign: 'center', justifyContent: 'center' }}>
        <Grid size={{ sm: 10, md: 6 }}>
          <SectionTypeset
            caption="Multiple categories, endless possibilities"
            heading="Categories of AI Prompts"
            description="Explore a wide range of AI prompts across various categories, designed to help you build and enhance your applications with ease."
          />
        </Grid>
      </Grid>
      <Grid container spacing={2.5} sx={{ justifyContent: 'center' }}>
        {filteredCategoriesData.map((category, index) => {
          const metadata = categoryMetadata[category.slug] || {
            image: categoryCore,
            description: `Explore ${category.name} prompts`
          };

          const categorySlug = (category.slug || category.name.toLowerCase().replace(/\s+/g, '-')).toLowerCase();

          return (
            <Grid size={{ xs: 12, sm: 6, md: 3, lg: 2.4 }} key={category.name} sx={{ height: 1 }}>
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
    </ContainerWrapper>
  );
}
