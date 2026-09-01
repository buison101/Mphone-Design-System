import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import PromptsLayout from 'layout/Prompts';

const PromptsOverview = Loadable(lazy(() => import('pages/prompts-overview')));
const PromptDetails = Loadable(lazy(() => import('pages/prompts-overview/prompt-details')));

// ==============================|| PROMPTS ROUTES ||============================== //

const PromptsRoutes = {
  path: 'prompts-overview',
  element: <PromptsLayout />,
  children: [
    {
      path: '',
      element: <PromptsOverview />
    },
    {
      path: 'category/:category/:item',
      element: <PromptDetails />
    },
    {
      path: ':filter/category/:category/:item',
      element: <PromptDetails />
    },
    {
      path: ':filter',
      element: <PromptsOverview />
    }
  ]
};

export default PromptsRoutes;
