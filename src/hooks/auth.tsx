import React, { createContext, useCallback, useState, useContext } from 'react';

import firebase from '../config/firebase';
import MessageAlert from '../utils/MessageAlert';

interface IAuthState {
  user: IUser;
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

    return user ? { user: JSON.parse(user) } : ({} as IAuthState);
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
            setData({ user });
          })
          .catch(() => MessageAlert('Usuário e/ou senha inválidos!', 'info'));
      }

      if (type === 'user') {
        await firebase
          .firestore()
          .collection('users')
          .where('email', '==', email.toLowerCase().trim())
          .where('accesscode', '==', password.trim())
          .get()
          .then(snapshot => {
            if (snapshot.empty) {
              MessageAlert('Usuário e/ou senha inválidos!', 'info');
            } else {
              const user = {
                id: snapshot.docs[0].id,
                name: String(snapshot.docs[0].data().name),
                country: String(snapshot.docs[0].data()?.country),
                email,
                type,
              };
              localStorage.setItem('@bvspparts:user', JSON.stringify(user));
              setData({ user });
            }
          });
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
