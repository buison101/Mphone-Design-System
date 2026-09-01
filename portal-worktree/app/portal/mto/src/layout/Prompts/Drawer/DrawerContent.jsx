import PropTypes from 'prop-types';

// third-party
import { FormattedMessage } from 'react-intl';
import { useMemo, useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';

// material-ui
import { useColorScheme } from '@mui/material/styles';
import Collapse from '@mui/material/Collapse';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

// assets
import ApiOutlined from '@ant-design/icons/ApiOutlined';
import AppstoreAddOutlined from '@ant-design/icons/AppstoreAddOutlined';
import AppstoreOutlined from '@ant-design/icons/AppstoreOutlined';
import BgColorsOutlined from '@ant-design/icons/BgColorsOutlined';
import DashboardOutlined from '@ant-design/icons/DashboardOutlined';
import FileTextOutlined from '@ant-design/icons/FileTextOutlined';
import LayoutOutlined from '@ant-design/icons/LayoutOutlined';
import LockOutlined from '@ant-design/icons/LockOutlined';
import RocketOutlined from '@ant-design/icons/RocketOutlined';
import SettingOutlined from '@ant-design/icons/SettingOutlined';
import UnorderedListOutlined from '@ant-design/icons/UnorderedListOutlined';

// project imports
import SimpleBar from 'components/third-party/SimpleBar';

// data
import { promptCategories } from 'data/prompt-categories';

import { ThemeMode } from 'config';

const categoryIcons = {
  API: ApiOutlined,
  Apps: AppstoreOutlined,
  Auth: LockOutlined,
  Core: SettingOutlined,
  Dashboard: DashboardOutlined,
  Landing: RocketOutlined,
  Layouts: LayoutOutlined,
  Theming: BgColorsOutlined,
  'UI Elements': AppstoreAddOutlined
};

// ==============================|| PROMPTS DRAWER CONTENT ||============================== //

export default function DrawerContent({ search, filterType = 'all' }) {
  const navigate = useNavigate();
  const { pathname, search: urlSearch } = useLocation();
  const { filter } = useParams();
  const { colorScheme } = useColorScheme();
  const [expandedCategories, setExpandedCategories] = useState({});

  const filterPrefix = filter && ['free', 'pro'].includes(filter) ? `/${filter}` : '';

  const filteredCategories = useMemo(() => {
    let categories = promptCategories;

    // Filter by type
    if (filterType !== 'all') {
      categories = categories
        .map((category) => ({
          ...category,
          items: category.items.filter((item) => item.type === filterType)
        }))
        .filter((category) => category.items.length > 0);
    }

    // Filter by search
    if (!search.trim()) {
      return categories;
    }

    const searchLower = search.toLowerCase();
    return categories
      .map((category) => ({
        ...category,
        items: category.items.filter(
          (item) => item.title.toLowerCase().includes(searchLower) || item.id.toLowerCase().includes(searchLower)
        )
      }))
      .filter((category) => category.items.length > 0);
  }, [search, filterType]);

  const toggleCategory = (categoryName) => {
    setExpandedCategories((prev) => {
      const isCurrentlyExpanded = prev[categoryName];
      // If expanding, close all others. If collapsing, just close this one.
      if (isCurrentlyExpanded) {
        // Collapsing: just toggle off
        return {
          ...prev,
          [categoryName]: false
        };
      } else {
        // Expanding: close all others, open only this one
        return {
          [categoryName]: true
        };
      }
    });
  };

  // Get current category and item from URL query or path
  const urlParams = new URLSearchParams(urlSearch);
  const queryCategory = urlParams.get('category');
  const queryItem = urlParams.get('item');

  const pathSegments = pathname.split('/').filter((segment) => segment);

  // Handle both routes: /prompts-overview/:filter/category/:cat/:item and /prompts-overview/category/:cat/:item
  let pathCategorySlug = null;
  let pathItemSlug = null;

  if (pathSegments[0] === 'prompts-overview') {
    if (pathSegments[1] === 'category') {
      // Route: /prompts-overview/category/:category/:item
      pathCategorySlug = decodeURIComponent(pathSegments[2] || '');
      pathItemSlug = decodeURIComponent(pathSegments[3] || '');
    } else if (['free', 'pro'].includes(pathSegments[1]) && pathSegments[2] === 'category') {
      // Route: /prompts-overview/:filter/category/:category/:item
      pathCategorySlug = decodeURIComponent(pathSegments[3] || '');
      pathItemSlug = decodeURIComponent(pathSegments[4] || '');
    }
  }

  const normalizeCategorySlug = (category) => category.slug || category.name.toLowerCase().replace(/\s+/g, '-');

  const activeCategory =
    queryCategory ||
    (pathCategorySlug ? promptCategories.find((cat) => normalizeCategorySlug(cat) === pathCategorySlug)?.name || null : null);

  const activeItem = queryItem || pathItemSlug;

  // Auto-expand the active category for consistent collapsable active design
  useEffect(() => {
    if (activeCategory) {
      setExpandedCategories({ [activeCategory]: true });
    }
  }, [activeCategory]);

  const textColor = colorScheme === ThemeMode.DARK ? 'grey.400' : 'text.primary';
  const iconSelectedColor = colorScheme === ThemeMode.DARK ? 'text.primary' : 'primary.main';

  // Helper function to get dynamic text color based on selection state
  const getDynamicColor = (isSelected) => (isSelected ? iconSelectedColor : textColor);

  // Common hover style
  const hoverStyle = (theme) => ({
    bgcolor: 'primary.lighter',
    ...theme.applyStyles('dark', { bgcolor: 'divider' })
  });

  const isSelected =
    (filterPrefix === '' && pathname === '/prompts-overview' && !activeCategory && !activeItem) ||
    (filterPrefix !== '' && pathname === `/prompts-overview${filterPrefix}` && !activeCategory && !activeItem);

  return (
    <SimpleBar
      sx={{
        height: { xs: 'calc(100vh - 115px)', md: 'calc(100% - 115px)' },
        '& .simplebar-content': { display: 'flex', flexDirection: 'column' }
      }}
    >
      <List sx={{ width: '100%', bgcolor: 'background.paper' }} subheader={<li />}>
        {/* All Prompts Menu Item */}
        <ListItemButton
          onClick={() => navigate(`/prompts-overview${filterPrefix}`)}
          selected={isSelected}
          sx={(theme) => ({
            pl: 3,
            py: 1,
            mb: 0.5,
            '&:hover': hoverStyle(theme),
            '&.Mui-selected': {
              bgcolor: 'primary.lighter',
              ...theme.applyStyles('dark', { bgcolor: 'divider' }),
              borderRight: '2px solid',
              borderColor: 'primary.main',
              color: iconSelectedColor,
              '&:hover': { color: iconSelectedColor, ...hoverStyle(theme) }
            }
          })}
        >
          <ListItemIcon sx={{ minWidth: 36, color: isSelected ? iconSelectedColor : textColor }}>
            <UnorderedListOutlined style={{ fontSize: 18 }} />
          </ListItemIcon>
          <ListItemText
            primary={
              <Typography variant="h6" sx={{ color: isSelected ? iconSelectedColor : textColor }}>
                <FormattedMessage id="prompts.allPrompts" />
              </Typography>
            }
          />
        </ListItemButton>

        {filteredCategories.map((category) => {
          const isCategorySelected = category.name === activeCategory;
          const hasSelectedItem = category.items.some((item) => item.id === activeItem);
          const isExpanded = Boolean(expandedCategories[category.name]);
          const categoryColor = getDynamicColor(isCategorySelected || hasSelectedItem);

          return (
            <div key={category.name}>
              <ListItemButton
                onClick={() => toggleCategory(category.name)}
                selected={isCategorySelected || hasSelectedItem}
                sx={(theme) => ({
                  pl: 3,
                  py: 1,
                  mb: 0.5,
                  color: isExpanded ? iconSelectedColor : textColor,
                  '&:hover': hoverStyle(theme),
                  '&.Mui-selected': {
                    bgcolor: 'transparent',
                    color: categoryColor,
                    ...(!isCategorySelected &&
                      hasSelectedItem && {
                        bgcolor: 'primary.lighter',
                        ...theme.applyStyles('dark', { bgcolor: 'divider' }),
                        borderRight: '2px solid',
                        borderColor: 'primary.main'
                      }),
                    '&:hover': { color: categoryColor, ...hoverStyle(theme) }
                  }
                })}
              >
                <ListItemIcon sx={{ minWidth: 36, color: isExpanded ? iconSelectedColor : categoryColor }}>
                  {(() => {
                    const CategoryIcon = categoryIcons[category.name] || FileTextOutlined;
                    return <CategoryIcon style={{ fontSize: 18 }} />;
                  })()}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="h6" sx={{ color: isExpanded ? iconSelectedColor : categoryColor }}>
                      {category.name}
                    </Typography>
                  }
                />
              </ListItemButton>
              <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {category.items.map((item) => {
                    const isItemSelected = item.id === activeItem;
                    const itemColor = getDynamicColor(isItemSelected);
                    const categorySlug = normalizeCategorySlug(category);

                    return (
                      <ListItemButton
                        key={item.id}
                        selected={isItemSelected}
                        onClick={() => {
                          navigate(
                            `/prompts-overview${filterPrefix}/category/${encodeURIComponent(categorySlug)}/${encodeURIComponent(item.id)}`
                          );
                        }}
                        sx={(theme) => ({
                          pl: 6,
                          py: 1,
                          mb: 0.5,
                          '&:hover': hoverStyle(theme),
                          '&.Mui-selected': {
                            bgcolor: 'primary.lighter',
                            ...theme.applyStyles('dark', { bgcolor: 'divider' }),
                            borderRight: '2px solid',
                            borderColor: 'primary.main',
                            color: itemColor,
                            '&:hover': { color: itemColor, ...hoverStyle(theme) }
                          }
                        })}
                      >
                        <ListItemText
                          primary={
                            <Typography variant="body1" sx={{ color: itemColor }}>
                              {item.title}
                            </Typography>
                          }
                        />
                      </ListItemButton>
                    );
                  })}
                </List>
              </Collapse>
            </div>
          );
        })}
      </List>
    </SimpleBar>
  );
}

DrawerContent.propTypes = { search: PropTypes.string, filterType: PropTypes.oneOf(['all', 'free', 'pro']) };
