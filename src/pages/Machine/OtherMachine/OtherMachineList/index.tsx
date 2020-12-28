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
  FiSearch,
  FiX,
  FiArrowRight,
  FiArrowLeft,
} from 'react-icons/fi';
import {
  MdRemoveRedEye,
  MdDelete,
  MdArrowBack,
  MdAdd,
  MdOpenInNew,
  MdGetApp,
} from 'react-icons/md';

import { useAuth } from '../../../../hooks/auth';

import firebase from '../../../../config/firebase';
import light from '../../../../styles/themes/light';

import TableData from '../../../../components/TableData';
import Button from '../../../../components/Form/Button';
import Load from '../../../../components/Load';
import MessageAlert from '../../../../utils/MessageAlert';

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
  PaginationButtons,
  PaginationButton,
  SearchControllers,
} from './styles';

interface IData {
  id: string;
  description: string;
}

interface IDataSearch {
  searchValue: string;
}

const OtherMachineList: React.FC = () => {
  const [dataTable, setDataTable] = useState<IData[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastValueConsulted, setLastValueConsulted] = useState('');
  const [lastDocPaginate, setLastDocPaginate] = useState<
    firebase.firestore.QueryDocumentSnapshot
  >();
  const [pageNumber, setPageNumber] = useState(1);
  const [existsMoreRecords, setExistsMoreRecords] = useState(true);
  const [firstDocPaginate, setFirstDocPaginate] = useState<
    firebase.firestore.QueryDocumentSnapshot
  >();
  const formRef = useRef<FormHandles>(null);
  const { user } = useAuth();

  const pageSize = 8;
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
          { route: 'export-pdf-parts-machine', action: 'view', icon: MdGetApp },
          { route: 'bvsp-parts-machine', action: 'list', icon: MdOpenInNew },
          { route: 'other-machines', action: 'view', icon: MdRemoveRedEye },
          { route: 'other-machines', action: 'delete', icon: MdDelete },
          { route: 'other-machines', action: 'edit', icon: FiEdit },
        ]
      : [
          { route: 'export-pdf-parts-machine', action: 'view', icon: MdGetApp },
          { route: 'bvsp-parts-machine', action: 'list', icon: MdOpenInNew },
          { route: 'other-machines', action: 'view', icon: MdRemoveRedEye },
        ];
  }, [user.profile.name]);

  const handleBack = useCallback(() => {
    history.push('/');
  }, [history]);

  const handleNewOtherMachine = useCallback(() => {
    history.push('/other-machines/new');
  }, [history]);

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
              .collection('machines')
              .where('type', '==', 'another-company')
              .orderBy('description_insensitive')
              .startAt(lastValueConsulted)
              .endAt(`${lastValueConsulted}\uf8ff`)
              .startAfter(lastDocPaginate)
              .limit(pageSize)
          : firebase
              .firestore()
              .collection('machines')
              .where('type', '==', 'another-company')
              .orderBy('description_insensitive')
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
              description: String(doc.data().description),
            };
          });

          setDataTable(dataFormatted);
        })
        .catch(() =>
          MessageAlert('Não foi possível carregar os dados!', 'error'),
        )
        .finally(() => setLoading(false));
    },
    [firstDocPaginate, lastDocPaginate, lastValueConsulted],
  );

  const handleFetchOtherMachinesData = useCallback(
    async (data: IDataSearch) => {
      const { searchValue } = data;

      setLoading(true);

      const valueFormatted = searchValue.toLowerCase().trim();
      setLastValueConsulted(valueFormatted);

      await firebase
        .firestore()
        .collection('machines')
        .where('type', '==', 'another-company')
        .orderBy('description_insensitive')
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
              description: String(doc.data().description),
            };
          });

          setDataTable(dataFormatted);
        })
        .catch(() =>
          MessageAlert('Não foi possível carregar os dados!', 'error'),
        )
        .finally(() => setLoading(false));
    },
    [],
  );

  const handleSearchClear = useCallback(() => {
    formRef.current?.setFieldValue('searchValue', '');
    formRef.current?.getFieldRef('searchValue').focus();

    handleFetchOtherMachinesData({ searchValue: '' });
  }, [handleFetchOtherMachinesData]);

  useEffect(() => {
    handleFetchOtherMachinesData({ searchValue: '' });
  }, [handleFetchOtherMachinesData]);

  return (
    <Container>
      <Header>
        <Title>Outras máquinas cadastradas</Title>
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
            onClick={handleNewOtherMachine}
          >
            <MdAdd />
            Novo
          </Button>
        </ButtonsContainer>
      </Header>

      <SearchContainer ref={formRef} onSubmit={handleFetchOtherMachinesData}>
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

export default OtherMachineList;
