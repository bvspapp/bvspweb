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
  FiFilter,
  FiArrowLeft,
  FiArrowRight,
} from 'react-icons/fi';
import {
  MdRemoveRedEye,
  MdDelete,
  MdArrowBack,
  MdAdd,
  MdOpenInNew,
  MdGetApp,
} from 'react-icons/md';

import firebase from '../../../../config/firebase';
import light from '../../../../styles/themes/light';

import TableData from '../../../../components/TableData';
import Button from '../../../../components/Form/Button';
import Select from '../../../../components/Form/SelectInput';
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
} from './styles';

interface IData {
  id: string;
  bvspcode: string;
  description: string;
}

interface IDataSearch {
  searchValue: string;
  filterValue: string;
}

const BvspMachineList: React.FC = () => {
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
  const formRef = useRef<FormHandles>(null);

  const pageSize = 10;
  const history = useHistory();

  const dataTableColumns = useMemo(() => {
    return [
      {
        name: 'Código BVSP',
        selector: 'bvspcode',
      },
      {
        name: 'Nome',
        selector: 'description',
      },
    ];
  }, []);

  const controllers = useMemo(() => {
    return [
      { route: 'export-pdf-parts-machine', action: 'view', icon: MdGetApp },
      { route: 'bvsp-parts-machine', action: 'list', icon: MdOpenInNew },
      { route: 'bvsp-machine', action: 'view', icon: MdRemoveRedEye },
      { route: 'bvsp-machine', action: 'delete', icon: MdDelete },
      { route: 'bvsp-machine', action: 'edit', icon: FiEdit },
    ];
  }, []);

  const optionsSearchFilterBvspMachine = useMemo(() => {
    return [
      {
        value: 'description_insensitive',
        label: 'Nome',
      },
      {
        value: 'bvspcode',
        label: 'Código BVSP',
      },
    ];
  }, []);

  const handleBack = useCallback(() => {
    history.push('/');
  }, [history]);

  const handleBvspMachineNew = useCallback(() => {
    history.push('/bvsp-machine/new');
  }, [history]);

  const handleFetchBvspMachines = useCallback(async (data: IDataSearch) => {
    const { searchValue, filterValue } = data;

    setLoading(true);

    const valueFormatted = searchValue.toLowerCase().trim();
    setLastValueConsulted(valueFormatted);
    setLastFilterConsulted(filterValue);

    await firebase
      .firestore()
      .collection('machines')
      .where('type', '==', 'bvsp-machine')
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
            bvspcode: String(doc.data().bvspcode),
            description: String(doc.data().description),
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
              .collection('machines')
              .where('type', '==', 'bvsp-machine')
              .orderBy(lastFilterConsulted)
              .startAt(lastValueConsulted)
              .endAt(`${lastValueConsulted}\uf8ff`)
              .startAfter(lastDocPaginate)
              .limit(pageSize)
          : firebase
              .firestore()
              .collection('machines')
              .where('type', '==', 'bvsp-machine')
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
              bvspcode: String(doc.data().bvspcode),
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
    [
      firstDocPaginate,
      lastDocPaginate,
      lastFilterConsulted,
      lastValueConsulted,
    ],
  );

  const handleSearchClear = useCallback(() => {
    formRef.current?.setFieldValue('searchValue', '');
    formRef.current?.getFieldRef('searchValue').focus();

    handleFetchBvspMachines({
      searchValue: '',
      filterValue: 'description_insensitive',
    });
  }, [handleFetchBvspMachines]);

  useEffect(() => {
    handleFetchBvspMachines({
      searchValue: '',
      filterValue: 'description_insensitive',
    });
  }, [handleFetchBvspMachines]);

  return (
    <Container>
      <Header>
        <Title>Máquinas BVSP cadastradas</Title>
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
            onClick={handleBvspMachineNew}
          >
            <MdAdd />
            Novo
          </Button>
        </ButtonsContainer>
      </Header>

      <SearchContainer ref={formRef} onSubmit={handleFetchBvspMachines}>
        <SearchInput
          type="text"
          name="searchValue"
          placeholder="Pesquisar..."
        />
        <Select
          name="filterValue"
          icon={FiFilter}
          options={optionsSearchFilterBvspMachine}
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

export default BvspMachineList;
