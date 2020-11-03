import React, {
  useMemo,
  useCallback,
  useEffect,
  useState,
  useRef,
} from 'react';
import { useHistory } from 'react-router-dom';
import { FormHandles } from '@unform/core';

import {
  FiEdit,
  FiFilter,
  FiSearch,
  FiX,
  FiArrowLeft,
  FiArrowRight,
} from 'react-icons/fi';
import { MdRemoveRedEye, MdDelete, MdArrowBack, MdAdd } from 'react-icons/md';

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
  Select,
  PaginationButtons,
  PaginationButton,
  SearchControllers,
} from './styles';

interface IData {
  id: string;
  name: string;
  email: string;
  city: string;
  company: string;
}

interface IDataSearch {
  filterValue: string;
  searchValue: string;
}

const UserList: React.FC = () => {
  const [dataTable, setDataTable] = useState<IData[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastValueConsulted, setLastValueConsulted] = useState<string>();
  const [lastFilterConsulted, setLastFilterConsulted] = useState<string>(
    'description_insensitive',
  );
  const [lastDocPaginate, setLastDocPaginate] = useState<
    firebase.firestore.QueryDocumentSnapshot
  >();
  const [pageNumber, setPageNumber] = useState(1);
  const [existsMoreRecords, setExistsMoreRecords] = useState(false);
  const [firstDocPaginate, setFirstDocPaginate] = useState<
    firebase.firestore.QueryDocumentSnapshot
  >();

  const pageSize = 8;
  const formRef = useRef<FormHandles>(null);
  const history = useHistory();

  const dataTableColumns = useMemo(() => {
    return [
      {
        name: 'Nome',
        selector: 'name',
      },
      {
        name: 'Empresa',
        selector: 'company',
      },
      {
        name: 'Cidade',
        selector: 'city',
      },
      {
        name: 'E-mail',
        selector: 'email',
      },
    ];
  }, []);

  const controllers = useMemo(() => {
    return [
      { route: 'user', action: 'view', icon: MdRemoveRedEye },
      { route: 'user', action: 'delete', icon: MdDelete },
      { route: 'user', action: 'edit', icon: FiEdit },
    ];
  }, []);

  const optionsSearchFilterUser = useMemo(() => {
    return [
      {
        value: 'name_insensitive',
        label: 'Nome',
      },
      {
        value: 'email',
        label: 'E-mail',
      },
    ];
  }, []);

  const handleBack = useCallback(() => {
    history.push('/');
  }, [history]);

  const handleNewUser = useCallback(() => {
    history.push('/user/new');
  }, [history]);

  const handleFetchUserData = useCallback(async (data: IDataSearch) => {
    const { searchValue, filterValue = 'name_insensitive' } = data;

    setLoading(true);

    const valueFormatted = searchValue.toLowerCase().trim();
    setLastValueConsulted(valueFormatted);
    setLastFilterConsulted(filterValue);

    await firebase
      .firestore()
      .collection('users')
      .orderBy(filterValue)
      .startAt(valueFormatted)
      .endAt(`${valueFormatted}\uf8ff`)
      .limit(pageSize)
      .get()
      .then(snapshot => {
        const lastVisible = snapshot.docs[snapshot.docs.length - 1];
        setLastDocPaginate(lastVisible);

        const firstVisible = snapshot.docs[0];
        setFirstDocPaginate(firstVisible);

        // show or unshow next button.
        snapshot.docs.length === pageSize
          ? setExistsMoreRecords(true)
          : setExistsMoreRecords(false);

        const dataFormatted = snapshot.docs.map(doc => {
          return {
            id: String(doc.id),
            name: String(doc.data().name),
            email: String(doc.data().email),
            company: String(doc.data().company),
            city: String(doc.data().city),
          };
        });

        setDataTable(dataFormatted);
      })
      .catch(() => MessageAlert('Não foi possível carregar os dados!', 'error'))
      .finally(() => setLoading(false));
  }, []);

  const handlePagination = useCallback(
    async (action: 'prev' | 'next') => {
      setLoading(true);

      if (action === 'next') {
        setPageNumber(prevState => prevState + 1);
      } else {
        setPageNumber(prevState => prevState - 1);
      }

      const query =
        action === 'next'
          ? firebase
              .firestore()
              .collection('users')
              .orderBy(lastFilterConsulted)
              .startAt(lastValueConsulted)
              .endAt(`${lastValueConsulted}\uf8ff`)
              .startAfter(lastDocPaginate)
              .limit(pageSize)
          : firebase
              .firestore()
              .collection('users')
              .orderBy(lastFilterConsulted)
              .startAt(lastValueConsulted)
              .endAt(`${lastValueConsulted}\uf8ff`)
              .endBefore(firstDocPaginate)
              .limitToLast(pageSize);

      query
        .get()
        .then(snapshot => {
          const lastVisible = snapshot.docs[snapshot.docs.length - 1];
          const firstVisible = snapshot.docs[0];

          if (snapshot.docs.length === pageSize) {
            setLastDocPaginate(lastVisible);
            setExistsMoreRecords(true);
          } else {
            setExistsMoreRecords(false);
            setPageNumber(prevState => prevState - 1);
          }

          if (firstVisible) {
            setFirstDocPaginate(firstVisible);
          }

          const dataFormatted = snapshot.docs.map(doc => {
            return {
              id: String(doc.id),
              name: String(doc.data().name),
              email: String(doc.data().email),
              company: String(doc.data().company),
              city: String(doc.data().city),
            };
          });

          setDataTable(dataFormatted);
        })
        .catch(() =>
          MessageAlert('Não foi possível carregar os dados!', 'error'),
        )
        .finally(() => setLoading(false));
    },
    [
      firstDocPaginate,
      lastDocPaginate,
      lastFilterConsulted,
      lastValueConsulted,
    ],
  );

  const handleSearchClear = useCallback(() => {
    formRef.current?.setFieldValue('searchValue', '');
    formRef.current?.setFieldValue('filterValue', 'name_insensitive');
    formRef.current?.getFieldRef('searchValue').focus();

    handleFetchUserData({ searchValue: '', filterValue: 'name_insensitive' });
  }, [handleFetchUserData]);

  useEffect(() => {
    handleFetchUserData({ searchValue: '', filterValue: 'name_insensitive' });
  }, [handleFetchUserData]);

  return (
    <Container>
      <Header>
        <Title>Usuários cadastrados</Title>
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
            onClick={handleNewUser}
          >
            <MdAdd />
            Novo
          </Button>
        </ButtonsContainer>
      </Header>

      <SearchContainer ref={formRef} onSubmit={handleFetchUserData}>
        <SearchInput
          type="text"
          name="searchValue"
          placeholder="Pesquisar..."
        />
        <SearchControllers>
          <Select
            name="filterValue"
            icon={FiFilter}
            options={optionsSearchFilterUser}
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

          <PaginationButtons>
            {pageNumber > 1 && (
              <PaginationButton
                type="button"
                color={light.colors.success}
                onClick={() => handlePagination('prev')}
              >
                <FiArrowLeft />
              </PaginationButton>
            )}

            {existsMoreRecords && (
              <PaginationButton
                type="button"
                color={light.colors.success}
                onClick={() => handlePagination('next')}
              >
                <FiArrowRight />
              </PaginationButton>
            )}
          </PaginationButtons>
        </Content>
      )}
    </Container>
  );
};

export default UserList;
