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

interface IMachineSelectModalProps {
  handleCloseModal(): void;
  handleMachineSelected(row: object): void;
  departmentFilter?: string;
}

const MachineSelectModal: React.FC<IMachineSelectModalProps> = ({
  handleCloseModal,
  handleMachineSelected,
  departmentFilter,
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
          <SelectButton onClick={() => handleMachineSelected(row)}>
            <MdAddCircleOutline />
          </SelectButton>
        ),
      },
    ];
  }, [handleMachineSelected]);

  const handleFetchMachines = useCallback(
    async (data: IDataSearch) => {
      setLoading(true);

      const { searchValue } = data;
      const valueFormatted = searchValue.toLowerCase().trim();

      const baseQuery = firebase
        .firestore()
        .collection('machines')
        .orderBy('description_insensitive')
        .startAt(valueFormatted)
        .endAt(`${valueFormatted}\uf8ff`);

      if (departmentFilter) {
        await baseQuery
          .where('departments', 'array-contains', departmentFilter)
          .get()
          .then(snapshot => {
            const dataFormatted = snapshot.docs.map(doc => {
              return {
                id: String(doc.id),
                description: String(doc.data().description),
                departments: doc.data().departments,
              };
            });

            setDataTable(dataFormatted);
          })
          .catch(() =>
            MessageAlert('Não foi possível carregar os dados!', 'error'),
          )
          .finally(() => setLoading(false));
      } else {
        await baseQuery
          .get()
          .then(snapshot => {
            const dataFormatted = snapshot.docs.map(doc => {
              return {
                id: String(doc.id),
                description: String(doc.data().description),
                departments: doc.data().departments,
              };
            });

            setDataTable(dataFormatted);
          })
          .catch(() =>
            MessageAlert('Não foi possível carregar os dados!', 'error'),
          )
          .finally(() => setLoading(false));
      }
    },
    [departmentFilter],
  );

  const handleSearchClear = useCallback(() => {
    formRef.current?.setFieldValue('searchValue', '');
    formRef.current?.getFieldRef('searchValue').focus();

    handleFetchMachines({ searchValue: '' });
  }, [handleFetchMachines]);

  useEffect(() => {
    handleFetchMachines({ searchValue: '' });
  }, [handleFetchMachines]);

  return (
    <Container>
      <Header>
        <Title>Selecione a máquina</Title>
        <CloseButton type="button" onClick={handleCloseModal}>
          <MdClose />
        </CloseButton>
      </Header>

      <SearchContainer ref={formRef} onSubmit={handleFetchMachines}>
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

export default MachineSelectModal;
