import React, {
  useMemo,
  useCallback,
  useEffect,
  useState,
  useRef,
} from 'react';
import { FormHandles } from '@unform/core';

import { FiSearch, FiX } from 'react-icons/fi';
import { MdAddCircleOutline, MdClose } from 'react-icons/md';

import firebase from '../../../config/firebase';
import light from '../../../styles/themes/light';

import Load from '../../../components/Load';
import MessageAlert from '../../../utils/MessageAlert';

import {
  Container,
  Header,
  SelectButton,
  Title,
  SearchContainer,
  SearchInput,
  SearchButton,
  ClearButton,
  Table,
  CloseButton,
} from './styles';

interface IData {
  id: string;
  description: string;
}

interface IDataSearch {
  searchValue: string;
}

interface IDepartmentSelectModalProps {
  handleCloseModal(): void;
  handleDepartmentSelected(row: object): void;
}

const DepartmentSelectModal: React.FC<IDepartmentSelectModalProps> = ({
  handleCloseModal,
  handleDepartmentSelected,
}) => {
  const [dataTable, setDataTable] = useState<IData[]>([]);
  const [loading, setLoading] = useState(true);
  const formRef = useRef<FormHandles>(null);

  const columns = useMemo(() => {
    return [
      {
        name: '',
        selector: 'description',
      },
      {
        name: '',
        right: true,
        cell: (row: object) => (
          <SelectButton onClick={() => handleDepartmentSelected(row)}>
            <MdAddCircleOutline />
          </SelectButton>
        ),
      },
    ];
  }, [handleDepartmentSelected]);

  const handleFetchDepartments = useCallback(async (data: IDataSearch) => {
    setLoading(true);

    const { searchValue } = data;
    const valueFormatted = searchValue.toLowerCase().trim();

    await firebase
      .firestore()
      .collection('departments')
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
      .catch(() => MessageAlert('Não foi possível carregar os dados!', 'error'))
      .finally(() => setLoading(false));
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
        <Title>Selecione o departamento</Title>
        <CloseButton type="button" onClick={handleCloseModal}>
          <MdClose />
        </CloseButton>
      </Header>

      <SearchContainer ref={formRef} onSubmit={handleFetchDepartments}>
        <SearchInput
          type="text"
          name="searchValue"
          placeholder="Pesquisar..."
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
        <Table
          progressPending={false}
          progressComponent="carregando..."
          noHeader
          noDataComponent=""
          columns={columns}
          data={dataTable}
          highlightOnHover
          fixedHeader
          pagination
          paginationComponentOptions={{
            rowsPerPageText: 'Items por página:',
            rangeSeparatorText: 'de',
            noRowsPerPage: false,
            selectAllRowsItem: false,
            selectAllRowsItemText: 'Todos',
          }}
        />
      )}
    </Container>
  );
};

export default DepartmentSelectModal;
