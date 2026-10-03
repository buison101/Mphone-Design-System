import { lazy } from 'react';

import Profile from './Profile';

// Production always renders the official Profile popup. The dev server (v0
// preview) adds a review switch for the proposed layout; Vite replaces
// import.meta.env.DEV with false at build time, so the switch is dropped.
const HeaderProfile = import.meta.env.DEV ? lazy(() => import('./ProfileProposal/ProfilePreviewSwitch')) : Profile;

export default HeaderProfile;
