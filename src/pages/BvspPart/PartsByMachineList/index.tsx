import React, {
  useMemo,
  useCallback,
  useEffect,
  useState,
  useRef,
} from 'react';
import { useHistory } from 'react-router-dom';
import { FormHandles } from '@unform/core';

import { FiSearch, FiX, FiFilter } from 'react-icons/fi';
import { MdOpenInNew, MdArrowBack } from 'react-icons/md';

import firebase from '../../../config/firebase';
import light from '../../../styles/themes/light';

import MessageConfirmation from '../../../utils/MessageConfirmation';
import MachineSelectModal from '../../Machine/MachineSelectModal';
import Modal from '../../../components/Modal';
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
  SelectButton,
  Table,
} from './styles';

interface IData {
  id: string;
  oemcode: string;
  description: string;
  machines: string[];
  departments: string[];
}

interface IMachineData {
  description: string;
  departments: string[];
}

interface IMachineSelected {
  id: string;
  departments: string[];
}

interface IDataSearch {
  searchValue: string;
  filterValue: string;
}

interface IRouteParams {
  match: {
    params: {
      id: string;
    };
  };
}

const PartsByMachineList: React.FC<IRouteParams> = ({ match }) => {
  const [dataTable, setDataTable] = useState<IData[]>([]);
  const [loading, setLoading] = useState(true);
  const [machine, setMachine] = useState<IMachineData>({} as IMachineData);
  const [partSelected, setPartSelected] = useState<IData>({} as IData);
  const [machineSelectIsOpen, setMachineSelectIsOpen] = useState(false);
  const formRef = useRef<FormHandles>(null);

  const history = useHistory();
  const { id: machineId } = match.params;

  const optionsSearchFilterBvspPart = useMemo(() => {
    return [
      {
        value: 'oemcode',
        label: 'Código OEM',
      },
      {
        value: 'description_insensitive',
        label: 'Nome',
      },
    ];
  }, []);

  const handleChangePartOfMachine = useCallback((row: IData) => {
    setPartSelected(row);
    setMachineSelectIsOpen(true);
  }, []);

  const handleBack = useCallback(() => {
    history.goBack();
  }, [history]);

  const handleCloseMachineSelectModal = useCallback(() => {
    setMachineSelectIsOpen(false);
  }, []);

  const handleMachineSelected = useCallback(
    async (machineSelected: IMachineSelected) => {
      const {
        id: machineSelectedId,
        departments: machineSelectedDepartments,
      } = machineSelected;

      const {
        id: partId,
        description: partDescription,
        machines: partMachines,
        departments: partDepartments,
      } = partSelected;

      const machineNameFormatted = machine.description.toUpperCase();
      const partNameFormatted = partDescription.toUpperCase();

      const { isConfirmed } = await MessageConfirmation(
        `Você tem certeza que deseja mover a peça ${partNameFormatted} para a máquina ${machineNameFormatted}?`,
        'Sim. Remover!',
        'question',
      );

      if (isConfirmed) {
        // Recover the actual machines and remove the old machine link.
        const machinesUpdated = partMachines.filter(id => id !== machineId);
        machinesUpdated.push(machineSelectedId);

        // Recover the actual departments parts and remove the old departments link.
        const departmentsUpdated = partDepartments.filter(
          department => !machine.departments.includes(department),
        );

        // Add new departments link.
        departmentsUpdated.push(...machineSelectedDepartments);

        const partUpdated = {
          machines: machinesUpdated,
          departments: departmentsUpdated,
        };

        await firebase
          .firestore()
          .collection('parts')
          .doc(partId)
          .update(partUpdated)
          .then(async () => {
            await MessageAlert('Atualizado com sucesso!', 'success');
            window.location.reload();
          })
          .catch(() => {
            MessageAlert('Não foi possível atualizar!', 'error');
            setLoading(false);
          });
      }
    },
    [machine.description, machineId, partSelected, machine.departments],
  );

  const handleFetchBvspPartsByMachine = useCallback(
    async (data: IDataSearch) => {
      const { searchValue, filterValue } = data;

      setLoading(true);

      const valueFormatted = searchValue.toLowerCase().trim();

      await firebase
        .firestore()
        .collection('parts')
        .where('machines', 'array-contains', machineId)
        .orderBy(filterValue)
        .startAt(valueFormatted)
        .endAt(`${valueFormatted}\uf8ff`)
        .get()
        .then(snapshot => {
          const dataFormatted = snapshot.docs.map(doc => {
            return {
              id: String(doc.id),
              oemcode: String(doc.data().oemcode),
              description: String(doc.data().description),
              machines: doc.data().machines,
              departments: doc.data().departments,
            };
          });

          setDataTable(dataFormatted);
        })
        .catch(() =>
          MessageAlert('Não foi possível carregar os dados!', 'error'),
        )
        .finally(() => setLoading(false));
    },
    [machineId],
  );

  const handleSearchClear = useCallback(() => {
    formRef.current?.setFieldValue('searchValue', '');
    formRef.current?.getFieldRef('searchValue').focus();

    handleFetchBvspPartsByMachine({
      searchValue: '',
      filterValue: 'description_insensitive',
    });
  }, [handleFetchBvspPartsByMachine]);

  const columns = useMemo(() => {
    return [
      {
        name: 'Código OEM',
        selector: 'oemcode',
      },
      {
        name: 'Nome',
        selector: 'description',
      },
      {
        name: '',
        right: true,
        cell: (row: IData) => (
          <SelectButton onClick={() => handleChangePartOfMachine(row)}>
            <MdOpenInNew />
          </SelectButton>
        ),
      },
    ];
  }, [handleChangePartOfMachine]);

  useEffect(() => {
    handleFetchBvspPartsByMachine({
      searchValue: '',
      filterValue: 'description_insensitive',
    });
  }, [handleFetchBvspPartsByMachine]);

  useEffect(() => {
    firebase
      .firestore()
      .collection('machines')
      .doc(machineId)
      .get()
      .then(snapshot => {
        const { description, departments } = snapshot.data() as IMachineData;

        setMachine({
          description,
          departments,
        });
      })
      .catch(() => {
        MessageAlert('Não foi possível atualizado!', 'error');
      })
      .finally(() => setLoading(false));
  }, [machineId]);

  return (
    <Container>
      <Header>
        <Title>
          {`Peças vinculadas a ${
            machine.description ? machine.description : '...'
          }`}
        </Title>
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
      <SearchContainer ref={formRef} onSubmit={handleFetchBvspPartsByMachine}>
        <SearchInput
          type="text"
          name="searchValue"
          placeholder="Pesquisar..."
        />
        <Select
          name="filterValue"
          icon={FiFilter}
          options={optionsSearchFilterBvspPart}
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
        </Content>
      )}
      <Modal isOpen={machineSelectIsOpen}>
        <MachineSelectModal
          handleCloseModal={handleCloseMachineSelectModal}
          handleMachineSelected={handleMachineSelected}
        />
      </Modal>
    </Container>
  );
};

export default PartsByMachineList;
