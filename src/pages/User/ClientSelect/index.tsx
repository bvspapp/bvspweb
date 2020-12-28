import React, {
  useMemo,
  useCallback,
  useEffect,
  useState,
  useRef,
} from 'react';
import { FormHandles } from '@unform/core';

import {
  FiFilter,
  FiSearch,
  FiX,
  FiArrowLeft,
  FiArrowRight,
} from 'react-icons/fi';
import { MdClose, MdAddCircleOutline } from 'react-icons/md';

import light from '../../../styles/themes/light';

import TableData from '../../../components/TableData';
import Load from '../../../components/Load';
import MessageAlert from '../../../utils/MessageAlert';

import api from '../../../services/api';

import {
  Container,
  Header,
  Content,
  Title,
  CloseButton,
  SearchContainer,
  SearchInput,
  SearchButton,
  ClearButton,
  Select,
  PaginationButtons,
  PaginationButton,
  SearchControllers,
  PageNumberLabel,
  SelectButton,
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

interface ISelectModalProps {
  handleCloseModal(): void;
  handleSelected(row: object): void;
}

const ClientSelect: React.FC<ISelectModalProps> = ({
  handleCloseModal,
  handleSelected,
}) => {
  const [dataTable, setDataTable] = useState<IData[]>([]);
  const [loading, setLoading] = useState(true);

  const [pageNumber, setPageNumber] = useState(1);

  const formRef = useRef<FormHandles>(null);

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
        name: 'Telefone',
        selector: 'telephone',
      },
      {
        name: 'E-mail',
        selector: 'email',
      },
      {
        name: '',
        right: true,
        cell: (row: object) => (
          <SelectButton onClick={() => handleSelected(row)}>
            <MdAddCircleOutline />
          </SelectButton>
        ),
      },
    ];
  }, [handleSelected]);

  const optionsSearchFilterUser = useMemo(() => {
    return [
      {
        value: 'byname',
        label: 'Nome',
      },
      {
        value: 'byemail',
        label: 'E-mail',
      },
    ];
  }, []);

  const handleFetchUserData = useCallback(
    async (data: IDataSearch) => {
      const { searchValue = '', filterValue = 'byname' } = data;

      setLoading(true);

      const routeFormatted =
        filterValue === 'byname'
          ? `users/${filterValue}?page=${pageNumber}&perpage=5&name=${searchValue}&profile_id=6`
          : `users/${filterValue}?email=${searchValue}`;

      await api
        .get(routeFormatted)
        .then(response => setDataTable(response.data))
        .catch(() =>
          MessageAlert('Não foi possível carregar os dados!', 'error'),
        )
        .finally(() => setLoading(false));
    },
    [pageNumber],
  );

  const handleSearchClear = useCallback(() => {
    formRef.current?.setFieldValue('searchValue', '');
    formRef.current?.setFieldValue('filterValue', 'byname');
    formRef.current?.getFieldRef('searchValue').focus();

    handleFetchUserData({ searchValue: '', filterValue: 'byname' });
  }, [handleFetchUserData]);

  useEffect(() => {
    handleFetchUserData({ searchValue: '', filterValue: 'byname' });
  }, [handleFetchUserData]);

  return (
    <Container>
      <Header>
        <Title>Clientes</Title>
        <CloseButton type="button" onClick={handleCloseModal}>
          <MdClose />
        </CloseButton>
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
          <TableData data={dataTable} columns={dataTableColumns} />

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

export default ClientSelect;
