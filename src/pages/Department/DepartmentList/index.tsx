import React, {
  useMemo,
  useCallback,
  useEffect,
  useState,
  useRef,
} from 'react';
import { useHistory } from 'react-router-dom';
import { FormHandles } from '@unform/core';

import { FiEdit, FiSearch, FiX } from 'react-icons/fi';
import {
  MdRemoveRedEye,
  MdDelete,
  MdArrowBack,
  MdAdd,
  MdSwapVert,
} from 'react-icons/md';

import firebase from '../../../config/firebase';
import light from '../../../styles/themes/light';

import { useAuth } from '../../../hooks/auth';

import TableData from '../../../components/TableData';
import Button from '../../../components/Form/Button';
import Load from '../../../components/Load';
import MessageAlert from '../../../utils/MessageAlert';

import {
  Container,
  Header,
  Content,
  Title,
  ButtonsContainer,
  SearchContainer,
  SearchInput,
  SearchButton,
  ClearButton,
  SearchControllers,
} from './styles';

interface IData {
  id: string;
  description: string;
}

interface IDataSearch {
  searchValue: string;
}

const DepartmentList: React.FC = () => {
  const [dataTable, setDataTable] = useState<IData[]>([]);
  const [loading, setLoading] = useState(true);
  const formRef = useRef<FormHandles>(null);
  const { user } = useAuth();

  const history = useHistory();

  const dataTableColumns = useMemo(() => {
    return [
      {
        name: 'Nome',
        selector: 'description',
      },
    ];
  }, []);

  const controllers = useMemo(() => {
    return user.profile_type === 'admin'
      ? [
          { route: 'department', action: 'view', icon: MdRemoveRedEye },
          { route: 'department', action: 'delete', icon: MdDelete },
          { route: 'department', action: 'edit', icon: FiEdit },
        ]
      : [{ route: 'department', action: 'view', icon: MdRemoveRedEye }];
  }, [user.profile_type]);

  const handleBack = useCallback(() => {
    history.push('/');
  }, [history]);

  const handleNewDepartment = useCallback(() => {
    history.push('/department/new');
  }, [history]);

  const handleDepartmentOrdersUpdate = useCallback(() => {
    history.push('/department-order');
  }, [history]);

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
        <Title>Departamentos cadastradas</Title>
        <ButtonsContainer>
          <Button
            type="button"
            color={light.colors.primary}
            onClick={handleBack}
          >
            <MdArrowBack />
            Voltar
          </Button>
          <Button
            type="button"
            color={light.colors.success}
            onClick={handleNewDepartment}
          >
            <MdAdd />
            Novo
          </Button>
          <Button
            type="button"
            color={light.colors.success}
            onClick={handleDepartmentOrdersUpdate}
          >
            <MdSwapVert />
            Posições
          </Button>
        </ButtonsContainer>
      </Header>

      <SearchContainer ref={formRef} onSubmit={handleFetchDepartments}>
        <SearchInput
          type="text"
          name="searchValue"
          placeholder="Pesquisar..."
        />
        <SearchControllers>
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
        </SearchControllers>
      </SearchContainer>

      {loading ? (
        <Load />
      ) : (
        <Content>
          <TableData
            data={dataTable}
            columns={dataTableColumns}
            controllers={controllers}
          />
        </Content>
      )}
    </Container>
  );
};

export default DepartmentList;
