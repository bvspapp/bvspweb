import React, {
  useMemo,
  useCallback,
  useEffect,
  useState,
  useRef,
} from 'react';
import { useHistory } from 'react-router-dom';
import { FormHandles } from '@unform/core';
import { format, subHours } from 'date-fns';

import {
  FiSearch,
  FiX,
  FiFilter,
  FiArrowLeft,
  FiArrowRight,
} from 'react-icons/fi';
import { MdRemoveRedEye, MdArrowBack } from 'react-icons/md';
import api from '../../../../services/api';

import light from '../../../../styles/themes/light';

import TableData from '../../../../components/TableData';
import Button from '../../../../components/Form/Button';
import Select from '../../../../components/Form/SelectInput';
import Load from '../../../../components/Load';

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
  request_id: string;
  user_name: string;
  created_at: string;
}

interface IDataSearch {
  searchValue: string;
  statusFilter: number;
}

const QualityRequestsList: React.FC = () => {
  const [dataTable, setDataTable] = useState<IData[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);

  const formRef = useRef<FormHandles>(null);
  const history = useHistory();

  const dataTableColumns = useMemo(() => {
    return [
      {
        name: 'Nome do Cliente',
        selector: 'client_name',
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
    return [{ route: 'quality', action: 'edit', icon: MdRemoveRedEye }];
  }, []);

  const optionsSearchFilter = useMemo(() => {
    return [
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

  const handleFetchData = useCallback(
    async (data: IDataSearch) => {
      const { searchValue, statusFilter } = data;

      setLoading(true);

      await api
        .get(
          `requests/followup/search-all?name=${searchValue}&request_status_id=${statusFilter}&request_type_id=2&page=${pageNumber}&perpage=8`,
        )
        .then(response => {
          const date = new Date();
          const offsetInHours = date.getTimezoneOffset() / 60;


          const dataFormatted = response.data.map(
            (request: IRequestResponse) => {
              return {
                id: String(request.request_id),
                client_name: String(request.user_name),
                date: format(new Date(request.created_at), 'dd/MM/yyyy'),
                hour: format(subHours((new Date(request.created_at)), offsetInHours), 'HH:mm:ss'),
              };
            },
          );

          setDataTable(dataFormatted);
        })
        .finally(() => setLoading(false));
    },
    [pageNumber],
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
      statusFilter: 2,
    });




  }, [handleFetchData]);

  return (
    <Container>
      <Header>
        <Title>Solicitações para Qualidade</Title>
        <ButtonsContainer>
          <Button
            type="button"
            color={light.colors.primary}
            onClick={handleBack}
          >
            <MdArrowBack />
            Voltar
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

            {dataTable.length === 8 && (
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

export default QualityRequestsList;
