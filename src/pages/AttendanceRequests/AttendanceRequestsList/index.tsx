import React, {
  useMemo,
  useCallback,
  useEffect,
  useState,
  useRef,
} from 'react';
import { useHistory } from 'react-router-dom';
import { FormHandles } from '@unform/core';
import { format } from 'date-fns';

import {
  FiSearch,
  FiX,
  FiFilter,
  FiArrowLeft,
  FiArrowRight,
} from 'react-icons/fi';
import { MdRemoveRedEye, MdArrowBack, MdAdd, MdTimeline } from 'react-icons/md';
import api from '../../../services/api';

import light from '../../../styles/themes/light';

import TableData from '../../../components/TableData';
import Button from '../../../components/Form/Button';
import Select from '../../../components/Form/SelectInput';
import Load from '../../../components/Load';

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
  PageNumberLabel,
} from './styles';

interface IData {
  id: string;
  client_name: string;
  date: string;
  hour: string;
}

interface IRequestResponse {
  id: string;
  user: { name: string };
  contact_type: { name: string };
  created_at: string;
}

interface IDataSearch {
  searchValue: string;
  statusFilter: number;
}

const AttendanceRequestsList: React.FC = () => {
  const [dataTable, setDataTable] = useState<IData[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const [statusFilter, setStatusFilter] = useState(1);

  const formRef = useRef<FormHandles>(null);
  const history = useHistory();

  const dataTableColumns = useMemo(() => {
    return [
      {
        name: 'Nome do Cliente',
        selector: 'client_name',
      },
      {
        name: 'Contato',
        selector: 'contact',
      },
      {
        name: 'Data',
        selector: 'date',
      },
      {
        name: 'Hora',
        selector: 'hour',
      },
    ];
  }, []);

  const controllers = useMemo(() => {
    return [
      { route: 'attendance-request', action: 'view', icon: MdRemoveRedEye },
    ];
  }, []);

  const optionsSearchFilter = useMemo(() => {
    return [
      {
        value: 1,
        label: 'Em Aberto',
      },
      {
        value: 2,
        label: 'Em Andamento',
      },
      {
        value: 3,
        label: 'Concluído',
      },
    ];
  }, []);

  const handleBack = useCallback(() => {
    history.push('/');
  }, [history]);

  const handleBvspPartNew = useCallback(() => {
    history.push('/attendance-register');
  }, [history]);

  const handleIndicators = useCallback(() => {
    history.push('/attendance-request-indicators');
  }, [history]);

  const handleFetchData = useCallback(
    async (data: IDataSearch) => {
      const { searchValue } = data;

      setLoading(true);

      await api
        .get(
          `requests?name=${searchValue}&request_status_id=${statusFilter}&page=${pageNumber}&perpage=8`,
        )
        .then(response => {
          const dataFormatted = response.data.map(
            (request: IRequestResponse) => {
              return {
                id: String(request.id),
                client_name: String(request.user.name),
                contact: String(request.contact_type.name).toUpperCase(),
                date: format(new Date(request.created_at), 'dd/MM/yyyy'),
                hour: format(new Date(request.created_at), 'HH:mm:ss'),
              };
            },
          );

          setDataTable(dataFormatted);
        })
        .finally(() => setLoading(false));
    },
    [pageNumber, statusFilter],
  );

  const handleSearchClear = useCallback(() => {
    formRef.current?.setFieldValue('searchValue', '');
    formRef.current?.getFieldRef('searchValue').focus();

    handleFetchData({
      searchValue: '',
      statusFilter: 1,
    });
  }, [handleFetchData]);

  useEffect(() => {
    handleFetchData({
      searchValue: '',
      statusFilter: 1,
    });
  }, [handleFetchData]);

  return (
    <Container>
      <Header>
        <Title>Solicitações de Atendimentos</Title>
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
            onClick={handleIndicators}
          >
            <MdTimeline />
            Indicadores
          </Button>
          <Button
            type="button"
            color={light.colors.success}
            onClick={handleBvspPartNew}
          >
            <MdAdd />
            Novo Atendimento
          </Button>
        </ButtonsContainer>
      </Header>

      <SearchContainer ref={formRef} onSubmit={handleFetchData}>
        <SearchInput
          type="text"
          name="searchValue"
          placeholder="Pesquisar pelo nome do cliente..."
        />
        <Select
          name="statusFilter"
          icon={FiFilter}
          options={optionsSearchFilter}
          containerCustomStyle={{ marginTop: 17 }}
          onChange={e => setStatusFilter(Number(e.target.value))}
          value={statusFilter}
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
              <>
                <PaginationButton
                  type="button"
                  color={light.colors.success}
                  onClick={() => setPageNumber(prevState => prevState - 1)}
                >
                  <FiArrowLeft />
                </PaginationButton>
                <PageNumberLabel>{`Página ${pageNumber}`}</PageNumberLabel>
              </>
            )}

            {dataTable.length > 0 && (
              <PaginationButton
                type="button"
                color={light.colors.success}
                onClick={() => setPageNumber(prevState => prevState + 1)}
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

export default AttendanceRequestsList;
