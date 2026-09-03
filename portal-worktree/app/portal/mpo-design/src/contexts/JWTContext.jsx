import { createContext, useReducer } from 'react';

// reducer - state management
import { LOGIN, LOGOUT } from 'contexts/auth-reducer/actions';
import authReducer from 'contexts/auth-reducer/auth';

// This preview session is the project's own content, not vendor demonstration
// content, so its text is written here directly rather than bound in the
// keymap: the object feeds useReducer's initial state, which is evaluated once
// per mount and would freeze whichever locale was loaded first. The project's
// default locale is Vietnamese. See docs/15 §4.7.
const previewUser = {
  id: 'local-preview-user',
  email: 'preview@example.invalid',
  name: 'Người dùng xem thử',
  role: 'Người duyệt UI Lab',
  avatar: 'avatar-1.png'
};

const initialState = {
  isLoggedIn: true,
  isInitialized: true,
  user: previewUser
};

// ==============================|| LOCAL UI LAB AUTH CONTEXT ||============================== //

const JWTContext = createContext(null);

export const JWTProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = async (email) => {
    dispatch({
      type: LOGIN,
      payload: {
        isLoggedIn: true,
        user: { ...previewUser, ...(email && { email }) }
      }
    });
  };

  const register = async (email, _password, firstName, lastName) => {
    dispatch({
      type: LOGIN,
      payload: {
        isLoggedIn: true,
        user: {
          ...previewUser,
          email: email || previewUser.email,
          name: [firstName, lastName].filter(Boolean).join(' ') || previewUser.name
        }
      }
    });
  };

  const logout = () => {
    dispatch({ type: LOGOUT });
  };

  const resetPassword = async () => {};
  const updateProfile = () => {};

  return <JWTContext value={{ ...state, login, logout, register, resetPassword, updateProfile }}>{children}</JWTContext>;
};

export default JWTContext;
