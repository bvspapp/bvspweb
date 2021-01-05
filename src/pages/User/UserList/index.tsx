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

import light from '../../../styles/themes/light';

import TableData from '../../../components/TableData';
import Button from '../../../components/Form/Button';
import Load from '../../../components/Load';
import MessageAlert from '../../../utils/MessageAlert';

import api from '../../../services/api';

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
  PageNumberLabel,
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
  profile: Number;
  searchValue: string;
}

const UserList: React.FC = () => {
  const [dataTable, setDataTable] = useState<IData[]>([]);
  const [loading, setLoading] = useState(true);

  const [pageNumber, setPageNumber] = useState(1);

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
        value: 'byname',
        label: 'Nome',
      },
      {
        value: 'byemail',
        label: 'E-mail',
      },
    ];
  }, []);

  const optionsUserProfile = useMemo(() => {
    return [
      {
        value: 2,
        label: 'Atendimento',
      },
      {
        value: 6,
        label: 'Cliente',
      },
      {
        value: 4,
        label: 'Engenharia',
      },
      {
        value: 3,
        label: 'Orçamento',
      },
      {
        value: 8,
        label: 'Técnico',
      },
      {
        value: 7,
        label: 'Qualidade',
      },
    ];
  }, []);

  const handleBack = useCallback(() => {
    history.push('/');
  }, [history]);

  const handleNewUser = useCallback(() => {
    history.push('/user/new');
  }, [history]);

  const handleFetchUserData = useCallback(
    async (data: IDataSearch) => {
      const { searchValue = '', filterValue = 'byname', profile = 6 } = data;

      setLoading(true);

      const routeFormatted =
        filterValue === 'byname'
          ? `users/${filterValue}?page=${pageNumber}&perpage=8&name=${searchValue}&profile_id=${profile}`
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

    handleFetchUserData({ searchValue: '', filterValue: 'byname', profile: 6 });
  }, [handleFetchUserData]);

  useEffect(() => {
    handleFetchUserData({ searchValue: '', filterValue: 'byname', profile: 6 });
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
            containerCustomStyle={{ marginRight: 7 }}
          />
          <Select
            name="profile"
            icon={FiFilter}
            options={optionsUserProfile}
            defaultValue={6}
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

export default UserList;
