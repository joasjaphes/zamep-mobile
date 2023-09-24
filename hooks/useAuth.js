import {
  createContext, useCallback, useContext, useEffect, useMemo, useState,
} from 'react';
import { useMutation } from 'react-query';

import { formatPhone } from '../helper/numeral';
import { deleteItem, save } from '../helper/store';
import useToggle from './useToggle';

/**
 * @typedef useAuth
 * @property {User} user
 * @property {function()} setUser
 * @property {boolean} isLoggingIn
 * @property {boolean} isUpdating
 * @property {function()} login
 * @property {function()} logout
 * @property {function()} refetchUser
 * @property {function()} updateUser
 */

/**
 * ZAMEP user
 * @typedef {object} User
 * @property {number} id
 * @property {date} date_created
 * @property {date} date_updated
 * @property {string} name
 * @property {string} description
 * @property {string} phone_number
 * @property {boolean} can_login
 * @property {campaign} campaign
 * @property {string} initials Processed name initials
 * @property {string} firstName Processed first name value
 * @property {string} lastName Processed last name value
 * @property {string} phoneNumber Processed phone number
 * @property {string} fullName Generated full name value
 * @property {string} phoneNumber Generated formatted mobile value
 */

/**
 * @param {Context<{user: User|null, setUser: function()}>} AuthContext
 */
const AuthContext = createContext({
  user: null,
  setUser: () => {},
});

/**
 * useAuth
 * @returns {useAuth}
 */
export const useAuth = () => useContext(AuthContext);

/**
 * @param {object} props
 * @param {React.ReactElement} props.children
 * @returns {React.ProviderProps<{user: User}>}
 */
export function AuthProvider({ children }) {
  // useMutation due to form variable dependency
  const { mutateAsync: loginUser, isLoading: isLoggingIn } = useMutation('loginUser');
  const { mutateAsync: fetchUser } = useMutation('fetchUser');
  const { mutateAsync: putUser, isLoading: isUpdating } = useMutation('putUser');

  const [isLoggingOut, toggleIsLoggingOut] = useToggle(false);

  const [currentUser, setCurrentUser] = useState(null);

  const saveUser = useCallback(async () => {
    // update storage everytime user is updated
    if (currentUser && currentUser?.can_login) {
      await save('user', currentUser);
    }
    return true;
  }, [currentUser]);

  useEffect(() => {
    saveUser();
  }, [saveUser]);

  /**
   * Function to update user
   * @param {User} user
   */
  const setUser = useCallback((user) => {
    const names = user?.name.split(' ');
    const firstName = names?.[0] ?? '';
    const lastName = names?.[names.length - 1] ?? '';
    const initials = `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`;
    const fullName = user?.name;
    const phoneNumber = formatPhone(user?.phone_number);
    const isSheha = Boolean(user?.roles?.find(({ name }) => name.match(/^(sheha|sheha role)/i))?.id);
    let location = user?.locations?.find(({ level }) => level === 5)?.id;
    if (!location) {
      location = user?.locations?.find(({ level }) => level === 4)?.id;
    }
    // const photo = user?.photo ?
    // `${Constants?.manifest?.extra?.bucket}${user?.photo}` : undefined;
    const userToSave = {
      ...user, initials, firstName, lastName, fullName, phoneNumber, isSheha, location,
    };
    setCurrentUser(userToSave);
    return userToSave;
  }, []);

  // const getStoredUser = useCallback(async () => {
  //   // check for stored user on startup
  //   const storedUser = await getValueFor('user');
  //   if (storedUser && storedUser?.can_login && !currentUser?.can_login) {
  //     setUser(storedUser);
  //   }
  //   return true;
  // }, [currentUser?.can_login, setUser]);

  // useEffect(() => {
  //   getStoredUser();
  // }, [getStoredUser]);

  /**
   * Function to fetch user information
   * @param {User} user
   */
  const refetchUser = useCallback(async () => {
    try {
      const result = await fetchUser([{}, { endpoint: 'me?fields=roles,locations' }]);
      if (!result && result?.error) {
        throw new Error('Error fetching user info');
      }

      const userToSave = setUser(result);
      // saving user phone number
      await save('phone', userToSave?.phone_number ?? '');

      return userToSave;
    } catch (error) {
      return false;
    }
  }, [setUser, fetchUser]);

  const updateUser = useCallback(async (userData) => {
    const formData = {
      ID: currentUser.ID,
      mobile: currentUser.mobile,
      account_type: currentUser.account_type,
      ...userData,
    };

    const { code, payload } = await putUser([formData, { endpoint: 'update-system-user', method: 'POST' }]);
    setUser(payload);
    return code;
  }, [currentUser, setUser, putUser]);

  const login = useCallback(async (mobile, password) => {
    const formData = {
      username: mobile ?? currentUser?.mobile,
      password,
    };

    const data = await loginUser([formData, { endpoint: 'login', method: 'POST' }]);

    if (data?.can_login) {
      // saving user password
      await save('password', password ?? '');
      // user enabled to login
      const res = await refetchUser();
      return res;
    }

    // API error response
    if (data?.error) {
      return data;
    }

    if (data) {
      // API resolved without an error
      // but user not enabled to login
      return {
        error: 'User disabled',
      };
    }

    return null;
  }, [currentUser?.mobile, loginUser, refetchUser]);

  const logout = useCallback(async () => {
    try {
      toggleIsLoggingOut();
      await deleteItem('user');
      toggleIsLoggingOut();
      setCurrentUser(null);
    } catch { /* */ }
  }, [toggleIsLoggingOut]);

  const value = useMemo(() => ({
    user: currentUser,
    isLoggingIn,
    isLoggingOut,
    isUpdating,
    login,
    logout,
    updateUser,
  }), [
    currentUser,
    isLoggingIn,
    isLoggingOut,
    isUpdating,
    login,
    logout,
    updateUser,
  ]);

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}
