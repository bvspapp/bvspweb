import React, { useRef, useCallback, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { FormHandles } from '@unform/core';

import { FiSearch, FiX } from 'react-icons/fi';
import { MdArrowBack } from 'react-icons/md';

import firebase from '../../../config/firebase';
import light from '../../../styles/themes/light';

import HighlightTitle from '../../../components/HighlightTitle';
import SimpleSelectCard from '../../../components/SimpleSelectCard';
import MessageAlert from '../../../utils/MessageAlert';
import Load from '../../../components/Load';

import {
  Container,
  Header,
  Content,
  BackButton,
  SearchContainer,
  SearchInput,
  SearchButton,
  ClearButton,
  ServiceContainer,
  MessageContainer,
  MessageText,
} from './styles';

interface IData {
  id: string;
  description: string;
}

interface IDataSearch {
  searchValue: string;
}

const DepartmentsSelect: React.FC = () => {
  const [dataTable, setDataTable] = useState<IData[]>([]);
  const [loading, setLoading] = useState(true);
  const formRef = useRef<FormHandles>(null);

  const history = useHistory();

  const handleFetchDepartments = useCallback(async (data: IDataSearch) => {
    setLoading(true);

    const { searchValue } = data;
    const valueFormatted = searchValue.toLowerCase().trim();

    if (valueFormatted) {
      await firebase
        .firestore()
        .collection('departments')
        .orderBy('order')
        .orderBy('description_insensitive')
        .startAt(valueFormatted)
        .endAt(`${valueFormatted}\uf8ff`)
        .get()
        .then(snapshot => {
          const dataFormatted = snapshot.docs.map(doc => {
            return {
              id: String(doc.id),
              description: String(doc.data().description),
            };
          });

          setDataTable(dataFormatted);
        })
        .catch(() =>
          MessageAlert('Não foi possível carregar os dados!', 'error'),
        )
        .finally(() => setLoading(false));
    } else {
      await firebase
        .firestore()
        .collection('departments')

        .get()
        .then(snapshot => {
          const dataFormatted = snapshot.docs.map(doc => {
            return {
              id: String(doc.id),
              description: String(doc.data().description),
            };
          });

          setDataTable(dataFormatted);
        })
        .catch(() =>
          MessageAlert('Não foi possível carregar os dados!', 'error'),
        )
        .finally(() => setLoading(false));
    }
  }, []);

  const handleSearchClear = useCallback(() => {
    formRef.current?.setFieldValue('searchValue', '');
    formRef.current?.getFieldRef('searchValue').focus();

    handleFetchDepartments({ searchValue: '' });
  }, [handleFetchDepartments]);

  useEffect(() => {
    handleFetchDepartments({ searchValue: '' });
  }, [handleFetchDepartments]);

  return (
    <Container>
      <Header>
        <HighlightTitle title="Departamentos" lineAlign="left" />
        <BackButton
          type="button"
          color={light.colors.primary}
          onClick={() => history.goBack()}
        >
          <MdArrowBack />
        </BackButton>
      </Header>

      <SearchContainer ref={formRef} onSubmit={handleFetchDepartments}>
        <SearchInput
          type="text"
          name="searchValue"
          placeholder="Pesquisar..."
        />

        <SearchButton type="submit" color={light.colors.success}>
          <FiSearch />
        </SearchButton>
        <ClearButton
          type="button"
          color={light.colors.tertiary}
          onClick={handleSearchClear}
        >
          <FiX />
        </ClearButton>
      </SearchContainer>

      <MessageContainer>
        <MessageText>Escolha o departamento</MessageText>
      </MessageContainer>

      {loading ? (
        <Load />
      ) : (
        <ServiceContainer>
          {dataTable.map(department => (
            <SimpleSelectCard
              key={department.id}
              title={department.description}
              link={`/equipaments/${department.id}`}
            />
          ))}
        </ServiceContainer>
      )}

      <Content />
    </Container>
  );
};

export default DepartmentsSelect;
