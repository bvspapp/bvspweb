import React, { createContext, useCallback, useState, useContext } from 'react';
import api from '../services/api';
import MessageAlert from '../utils/MessageAlert';

interface IAuthState {
  user: IUser;
}

interface IUser {
  id: string;
  country: string;
  city: string;
  company: string;
  name: string;
  email: string;
  profile_type: 'atendimento' | 'engenharia' | 'cliente' | 'admin';
  currentCountryCode?: string;
}

interface ISignInCredentials {
  email: string;
  password: string;
}

interface IResponseSession {
  user: IUser;
  token: string;
}

interface IAuthContextData {
  user: IUser;
  signIn(credentials: ISignInCredentials): Promise<void>;
  signOut(): void;
  setData(data: IAuthState): void;
}

const AuthContext = createContext<IAuthContextData>({} as IAuthContextData);

const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<IAuthState>(() => {
    const user = localStorage.getItem('@bvspparts:user');
    const token = localStorage.getItem('@bvspparts:token');

    if (user) {
      api.defaults.headers.authorization = `Bearer ${token}`;

      return { token, user: JSON.parse(user) };
    }

    return {} as IAuthState;
  });

  const signIn = useCallback(
    async ({ email, password }: ISignInCredentials) => {
      const countryCode: string = await fetch(
        'https://geolocation-db.com/json/7733a990-ebd4-11ea-b9a6-2955706ddbf3',
      )
        .then(response => {
          return response.json();
        })
        .then(response => {
          return response.country_code;
        });

      await api
        .post('sessions', {
          email,
          password,
        })
        .then(userData => {
          const { user, token }: IResponseSession = userData.data;
          api.defaults.headers.authorization = `Bearer ${token}`;

          const userFormatted = {
            ...user,
            currentCountryCode: countryCode,
          };

          localStorage.setItem(
            '@bvspparts:user',
            JSON.stringify(userFormatted),
          );
          localStorage.setItem('@bvspparts:token', JSON.stringify(token));
          setData({ user: userFormatted });
          window.location.href = '/';
        })
        .catch(() => MessageAlert('Usuário e/ou senha inválidos!', 'info'));
    },
    [],
  );

  const signOut = useCallback(() => {
    localStorage.removeItem('@bvspparts:user');
    setData({} as IAuthState);
  }, []);

  return (
    <AuthContext.Provider value={{ user: data.user, setData, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

function useAuth(): IAuthContextData {
  const context = useContext(AuthContext);

  return context;
}

export { AuthProvider, useAuth };
