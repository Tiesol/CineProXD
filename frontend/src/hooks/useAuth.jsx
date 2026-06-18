import { getToken, getTokenPayload, isAdmin } from '../utils/tokenUtils';

export const useAuth = () => {
  const token = getToken();
  const payload = getTokenPayload();

  return {
    isLoggedIn: !!token,
    isAdmin: isAdmin(),
    userId: payload?.sub ?? null,
    role: payload?.role ?? null,
  };
};
