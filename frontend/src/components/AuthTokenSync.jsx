import { useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useDispatch } from 'react-redux';
import { setAuthToken } from '../Slicers/authSlice';

const AuthTokenSync = () => {
  const { getToken } = useAuth();
  const dispatch = useDispatch();

  useEffect(() => {
    const updateToken = async () => {
      try {
        const token = await getToken();
        dispatch(setAuthToken(token));
      } catch (error) {
        console.error('Token refresh failed:', error);
      }
    };

    updateToken();
    const interval = setInterval(updateToken, 60_000);
    
    return () => clearInterval(interval);
  }, [getToken, dispatch]);

  return null;
};

export default AuthTokenSync; 