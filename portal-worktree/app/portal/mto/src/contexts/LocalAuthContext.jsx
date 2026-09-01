import { createContext } from 'react';

const localUser = {
  id: 'mphone-ui-lab',
  email: 'portal@example.local',
  name: 'Mphone UI Lab',
  firstname: 'Mphone',
  lastname: 'UI Lab',
  avatar: 'avatar-1.png',
  role: 'Product preview'
};

const LocalAuthContext = createContext(null);

export function LocalAuthProvider({ children }) {
  const completeLocally = async () => ({ simulated: true });

  const value = {
    isLoggedIn: true,
    isInitialized: true,
    user: localUser,
    login: completeLocally,
    logout: completeLocally,
    register: completeLocally,
    resetPassword: completeLocally,
    updateProfile: completeLocally
  };

  return <LocalAuthContext value={value}>{children}</LocalAuthContext>;
}

export default LocalAuthContext;
