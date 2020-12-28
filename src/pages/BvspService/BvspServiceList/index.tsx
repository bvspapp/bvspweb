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
import { useAuth } from '../../../hooks/auth';

import firebase from '../../../config/firebase';
import light from '../../../styles/themes/light';

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

const BvspService: React.FC = () => {
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
    return user.profile.name === 'gestão'
      ? [
          { route: 'bvsp-service', action: 'view', icon: MdRemoveRedEye },
          { route: 'bvsp-service', action: 'delete', icon: MdDelete },
          { route: 'bvsp-service', action: 'edit', icon: FiEdit },
        ]
      : [{ route: 'bvsp-service', action: 'view', icon: MdRemoveRedEye }];
  }, [user.profile.name]);

  const handleBack = useCallback(() => {
    history.push('/');
  }, [history]);

  const handleBvspServiceNew = useCallback(() => {
    history.push('/bvsp-service/new');
  }, [history]);

  const handleBvspServiceOrdersUpdate = useCallback(() => {
    history.push('/bvsp-services-order');
  }, [history]);

  const handleFetchBvspService = useCallback(async (data: IDataSearch) => {
    setLoading(true);

    const { searchValue } = data;
    const valueFormatted = searchValue.toLowerCase().trim();

    if (valueFormatted) {
      await firebase
        .firestore()
        .collection('services')
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
        .collection('services')
        .orderBy('order')
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
    formRef.current?.getFieldRef('searchValue').focus();

    handleFetchBvspService({
      searchValue: '',
    });
  }, [handleFetchBvspService]);

  useEffect(() => {
    handleFetchBvspService({
      searchValue: '',
    });
  }, [handleFetchBvspService]);

  return (
    <Container>
      <Header>
        <Title>Serviços cadastrados</Title>
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
            onClick={handleBvspServiceNew}
          >
            <MdAdd />
            Novo
          </Button>
          <Button
            type="button"
            color={light.colors.success}
            onClick={handleBvspServiceOrdersUpdate}
          >
            <MdSwapVert />
            Posições
          </Button>
        </ButtonsContainer>
      </Header>

      <SearchContainer ref={formRef} onSubmit={handleFetchBvspService}>
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

export default BvspService;
