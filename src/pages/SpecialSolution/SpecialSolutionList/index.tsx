import React, {
  useMemo,
  useCallback,
  useEffect,
  useState,
  useRef,
} from 'react';
import { useHistory } from 'react-router-dom';
import { FormHandles } from '@unform/core';

import { FiEdit, FiSearch, FiX, FiFilter } from 'react-icons/fi';
import { MdRemoveRedEye, MdDelete, MdArrowBack, MdAdd } from 'react-icons/md';

import firebase from '../../../config/firebase';
import light from '../../../styles/themes/light';

import TableData from '../../../components/TableData';
import Button from '../../../components/Form/Button';
import Select from '../../../components/Form/SelectInput';
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
  bvspcode: string;
  description: string;
}

interface IDataSearch {
  searchValue: string;
  filterValue: string;
}

const SpecialSolutionList: React.FC = () => {
  const [dataTable, setDataTable] = useState<IData[]>([]);
  const [loading, setLoading] = useState(true);
  const formRef = useRef<FormHandles>(null);

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
      { route: 'special-solution', action: 'view', icon: MdRemoveRedEye },
      { route: 'special-solution', action: 'delete', icon: MdDelete },
      { route: 'special-solution', action: 'edit', icon: FiEdit },
    ];
  }, []);

  const optionsSearchFilterSpecialSolution = useMemo(() => {
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

  const handleNewSpecialSolution = useCallback(() => {
    history.push('/special-solution/new');
  }, [history]);

  const handleFetchSpecialSolutions = useCallback(async (data: IDataSearch) => {
    const { searchValue, filterValue } = data;

    setLoading(true);

    const valueFormatted = searchValue.toLowerCase().trim();

    await firebase
      .firestore()
      .collection('special-solutions')
      .orderBy(filterValue)
      .startAt(valueFormatted)
      .endAt(`${valueFormatted}\uf8ff`)
      .get()
      .then(snapshot => {
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

  const handleSearchClear = useCallback(() => {
    formRef.current?.setFieldValue('searchValue', '');
    formRef.current?.getFieldRef('searchValue').focus();

    handleFetchSpecialSolutions({
      searchValue: '',
      filterValue: 'description_insensitive',
    });
  }, [handleFetchSpecialSolutions]);

  useEffect(() => {
    handleFetchSpecialSolutions({
      searchValue: '',
      filterValue: 'description_insensitive',
    });
  }, [handleFetchSpecialSolutions]);

  return (
    <Container>
      <Header>
        <Title>Soluções especiais cadastradas</Title>
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
            onClick={handleNewSpecialSolution}
          >
            <MdAdd />
            Novo
          </Button>
        </ButtonsContainer>
      </Header>

      <SearchContainer ref={formRef} onSubmit={handleFetchSpecialSolutions}>
        <SearchInput
          type="text"
          name="searchValue"
          placeholder="Pesquisar..."
        />
        <SearchControllers>
          <Select
            name="filterValue"
            icon={FiFilter}
            options={optionsSearchFilterSpecialSolution}
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
        </Content>
      )}
    </Container>
  );
};

export default SpecialSolutionList;
