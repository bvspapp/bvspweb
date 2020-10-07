import React, { createContext, useCallback, useState, useContext } from 'react';
import firebase from '../config/firebase';
import api from '../services/api';
import MessageAlert from '../utils/MessageAlert';

interface IAuthState {
  user: IUser;
  token?: string;
}

interface IUser {
  id?: string;
  country?: string;
  city?: string;
  company?: string;
  name?: string;
  email: string;
  type: 'user' | 'admin';
}

interface ISignInCredentials {
  email: string;
  password: string;
  type: 'user' | 'admin';
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

    if (token && user) {
      api.defaults.headers.authorization = `Bearer ${token}`;

      return { token, user: JSON.parse(user) };
    }

    return {} as IAuthState;
  });

  const signIn = useCallback(
    async ({ email, password, type }: ISignInCredentials) => {
      if (type === 'admin') {
        await firebase
          .auth()
          .signInWithEmailAndPassword(email, password)
          .then(() => {
            const user = { email, type };
            localStorage.setItem('@bvspparts:user', JSON.stringify(user));
            setData({ user, token: '' });
          })
          .catch(() => MessageAlert('Usuário e/ou senha inválidos!', 'info'));
      }

      if (type === 'user') {
        const userData = await api.post('sessions', {
          email,
          password,
        });

        const { user: userResponse, token }: IAuthState = userData.data;

        localStorage.setItem(
          '@bvspparts:user',
          JSON.stringify({ userResponse, token }),
        );
        setData({ user: { ...userResponse, type: 'user' }, token });
      }
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
