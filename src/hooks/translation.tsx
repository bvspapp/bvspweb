import React, { createContext, useCallback, useState, useContext } from 'react';

interface ITranslateContextData {
  translation: string;
  changeTranslation(value: string): void;
}

const TranslateContext = createContext<ITranslateContextData>(
  {} as ITranslateContextData,
);

const TranslateProvider: React.FC = ({ children }) => {
  const [translation, setTranslation] = useState<string>(() => {
    const userTranslate = localStorage.getItem('@bvspparts:translation');

    if (userTranslate) return userTranslate;

    return 'pt-br';
  });

  const changeTranslation = useCallback(value => {
    if (value === 'en-us') {
      localStorage.setItem('@bvspparts:translation', 'en-us');
      setTranslation('en-us');
    } else {
      localStorage.setItem('@bvspparts:translation', 'pt-br');
      setTranslation('pt-br');
    }
  }, []);

  return (
    <TranslateContext.Provider value={{ translation, changeTranslation }}>
      {children}
    </TranslateContext.Provider>
  );
};

function useTranslation(): ITranslateContextData {
  const context = useContext(TranslateContext);

  return context;
}

export { TranslateProvider, useTranslation };
