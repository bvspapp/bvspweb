import React, {
  useCallback,
  useState,
  useEffect,
  useRef,
  useMemo,
} from 'react';
import { FormHandles } from '@unform/core';
import { useHistory } from 'react-router-dom';
import { MdCheck, MdArrowBack, MdAdd } from 'react-icons/md';
import * as Yup from 'yup';
import Modal from '../../../../components/Modal';

import firebase from '../../../../config/firebase';

import MessageAlert from '../../../../utils/MessageAlert';
import MessageConfirmation from '../../../../utils/MessageConfirmation';
import light from '../../../../styles/themes/light';

import DepartmentSelectModal from '../../../Department/DepartmentSelectModal';
import TextInput from '../../../../components/Form/TextInput';
import Button from '../../../../components/Form/Button';
import Select from '../../../../components/Form/SelectInput';
import Load from '../../../../components/Load';

import {
  Container,
  Form,
  FormHeader,
  FormContent,
  Title,
  ButtonsContainer,
  DepartmentsContainer,
  DepartmentsHeader,
  DepartmentLabel,
  DepartmentCard,
} from './styles';

interface IFormData {
  description: string;
  description_english: string;
  family: string;
}

interface IOtherMachineData {
  family: string;
  description: string;
  description_insensitive: string;
  description_english: string;
  description_insensitive_english: string;
  departments: string[];
}

interface IFamilySelect {
  value: string;
  label: string;
}

interface IDepartmentData {
  id: string;
  description: string;
}

interface IRouteParams {
  match: {
    params: {
      id: string;
      action: string;
    };
  };
}

const OtherMachineRegister: React.FC<IRouteParams> = ({ match }) => {
  const formRef = useRef<FormHandles>(null);
  const [loading, setLoading] = useState(true);
  const [families, setFamilies] = useState<IFamilySelect[]>([]);
  const [departmentSelectIsOpen, setDepartmentSelectIsOpen] = useState(false);
  const [departmentsSelected, setDepartmentsSelected] = useState<
    IDepartmentData[]
  >([]);

  const [initialDataForm, setInitialDataForm] = useState<IFormData>();

  const history = useHistory();
  const { id: otherMachineId, action: formAction } = match.params;

  const customFormByAction = useMemo(() => {
    switch (formAction) {
      case 'new':
        return {
          buttonSaveLabel: 'Cadastrar',
          disabledFields: false,
          showButtonSave: true,
        };
      case 'edit':
        return {
          buttonSaveLabel: 'Salvar',
          disabledFields: false,
          showButtonSave: true,
        };
      case 'delete':
        return {
          buttonSaveLabel: 'Remover',
          disabledFields: true,
          showButtonSave: true,
        };
      default:
        return {
          buttonSaveLabel: 'Visualizar',
          disabledFields: true,
          showButtonSave: false,
        };
    }
  }, [formAction]);

  const handleOtherMachineNew = useCallback(
    async (data: IFormData, departments: string[]) => {
      setLoading(true);

      const { description, description_english, family }: IFormData = data;

      const machine: IOtherMachineData = {
        family,
        description: description.trim(),
        description_insensitive: description.toLowerCase().trim(),
        description_english,
        description_insensitive_english: description_english
          .toLowerCase()
          .trim(),
        departments,
      };
      await firebase
        .firestore()
        .collection('machines')
        .add({ ...machine, type: 'another-company' })
        .then(() => {
          MessageAlert('Cadastrado com sucesso!', 'success').then(() =>
            history.push('/other-machines'),
          );
        })
        .catch(() => {
          MessageAlert('Não foi possível cadastrar!', 'error');
          setLoading(false);
        });
    },
    [history],
  );

  const handleOtherMachineUpdate = useCallback(
    async (id: string, data: IFormData, departments: string[]) => {
      setLoading(true);

      const { description, description_english, family }: IFormData = data;

      const machine: IOtherMachineData = {
        family,
        description: description.trim(),
        description_insensitive: description.toLowerCase().trim(),
        description_english,
        description_insensitive_english: description_english
          .toLowerCase()
          .trim(),
        departments,
      };

      await firebase
        .firestore()
        .collection('machines')
        .doc(id)
        .update(machine)
        .then(() => {
          MessageAlert('Atualizado com sucesso!', 'success').then(() =>
            history.push('/other-machines'),
          );
        })
        .catch(() => {
          MessageAlert('Não foi possível atualizado!', 'error');
          setLoading(false);
        });
    },
    [history],
  );

  const handleOtherMachineDelete = useCallback(
    async (id: string) => {
      const { isConfirmed } = await MessageConfirmation(
        'Você tem certeza que deseja remover?',
        'Sim. Remover!',
        'question',
      );

      if (isConfirmed) {
        setLoading(true);

        await firebase
          .firestore()
          .collection('machines')
          .doc(id)
          .delete()
          .then(() => {
            MessageAlert('Removido com sucesso!', 'success').then(() =>
              history.push('/other-machines'),
            );
          })
          .catch(() => {
            MessageAlert('Não foi possível remover!', 'error');
            setLoading(false);
          });
      }
    },
    [history],
  );

  const handleBack = useCallback(() => {
    history.push('/other-machines');
  }, [history]);

  const handleFormSubmitData = useCallback(
    async (data: IFormData) => {
      const { description } = data;

      try {
        if (formAction === 'delete') {
          handleOtherMachineDelete(otherMachineId);
        } else if (departmentsSelected.length === 0) {
          MessageAlert('Selecione um departamento!', 'info');
        } else {
          const schema = Yup.object().shape({
            description: Yup.string().required(
              'Descrição em Português é obrigatório.',
            ),
            description_english: Yup.string().required(
              'Descrição em Inglês é obrigatório.',
            ),
            family: Yup.string().required('Selecione a família.'),
          });

          await schema.validate(data);

          const departmentsId = departmentsSelected.map(item => {
            return item.id;
          });

          if (formAction === 'new') {
            const otherMachineExists = await firebase
              .firestore()
              .collection('machines')
              .where(
                'description_insensitive',
                '==',
                description.toLowerCase().trim(),
              )
              .get()
              .then(async snapshot => !snapshot.empty);

            if (otherMachineExists) {
              setLoading(false);
              MessageAlert(
                'Já existe uma máquina com essa descrição cadastrada!',
                'info',
              );
            } else {
              handleOtherMachineNew(data, departmentsId);
            }
          } else if (formAction === 'edit') {
            const otherMachineExists = await firebase
              .firestore()
              .collection('machines')
              .where(
                'description_insensitive',
                '==',
                description.toLowerCase().trim(),
              )
              .get()
              .then(async snapshot =>
                snapshot.docs.filter(doc => doc.id !== match.params.id),
              );

            if (otherMachineExists.length > 0) {
              setLoading(false);
              MessageAlert(
                'Já existe uma máquina com essa descrição cadastrada!',
                'info',
              );
            } else {
              handleOtherMachineUpdate(otherMachineId, data, departmentsId);
            }
          } else {
            MessageAlert('Operação Inválida!', 'info');
          }
        }
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          MessageAlert(error.errors[0], 'info');
        }
      }
    },
    [
      otherMachineId,
      formAction,
      handleOtherMachineDelete,
      handleOtherMachineNew,
      handleOtherMachineUpdate,
      departmentsSelected,
      match.params.id,
    ],
  );

  const handleFetchOtherMachineData = useCallback(async () => {
    const departmentsId = await firebase
      .firestore()
      .collection('machines')
      .doc(otherMachineId)
      .get()
      .then(snapshot => {
        const {
          description,
          description_english,
          family,
          departments: departmentMachine,
        } = snapshot.data() as IOtherMachineData;

        setInitialDataForm({
          description,
          description_english,
          family,
        });

        return departmentMachine;
      });

    await firebase
      .firestore()
      .collection('departments')
      .get()
      .then(snapshot => {
        const departmentSelectedSaved = snapshot.docs
          .map(doc => {
            return {
              id: doc.id,
              description: String(doc.data().description),
            };
          })
          .filter(doc => departmentsId.includes(doc.id));

        setDepartmentsSelected(departmentSelectedSaved);
      });

    setLoading(false);
  }, [otherMachineId]);

  const handleCloseDepartmentSelectModal = useCallback(() => {
    setDepartmentSelectIsOpen(false);
  }, []);

  const handleOpenDepartmentSelectModal = useCallback(() => {
    setDepartmentSelectIsOpen(true);
  }, []);

  const handleDepartmentSelectedAdd = useCallback(
    (department: IDepartmentData) => {
      const { id, description } = department;

      const alreadyAdded = departmentsSelected.find(item => item.id === id);

      if (alreadyAdded) {
        MessageAlert('Este departamento já está adicionado!', 'info');
      } else {
        setDepartmentsSelected(departmentsSelected.concat({ id, description }));
      }
    },
    [departmentsSelected],
  );

  const handleDepartmentSelectedRemove = useCallback(
    (id: string) => {
      setDepartmentsSelected(
        departmentsSelected.filter(item => item.id !== id),
      );
    },
    [departmentsSelected],
  );

  useEffect(() => {
    firebase
      .firestore()
      .collection('families')
      .orderBy('description_insensitive')
      .get()
      .then(snapshot => {
        const dataFormatted = snapshot.docs.map(doc => {
          return { value: doc.id, label: String(doc.data().description) };
        });

        setFamilies(dataFormatted);
      });
  }, []);

  useEffect(() => {
    if (otherMachineId) {
      handleFetchOtherMachineData();
    } else {
      setLoading(false);
    }
  }, [handleFetchOtherMachineData, otherMachineId, setLoading]);

  return loading ? (
    <Load />
  ) : (
    <Container>
      <Form
        ref={formRef}
        initialData={initialDataForm}
        onSubmit={handleFormSubmitData}
      >
        <FormHeader>
          <Title>Cadastro de outras máquinas</Title>

          <ButtonsContainer>
            <Button
              type="button"
              color={light.colors.primary}
              onClick={handleBack}
            >
              <MdArrowBack />
              Voltar
            </Button>
            {customFormByAction.showButtonSave && (
              <Button type="submit" color={light.colors.success}>
                <MdCheck />
                {customFormByAction.buttonSaveLabel}
              </Button>
            )}
          </ButtonsContainer>
        </FormHeader>

        <FormContent disabled={customFormByAction.disabledFields}>
          <TextInput
            type="text"
            name="description"
            label="Nome em Português"
            required
          />
          <TextInput
            type="text"
            name="description_english"
            label="Nome em Inglês"
            required
          />
          <Select name="family" label="Família" options={families} />
        </FormContent>
      </Form>

      <DepartmentsContainer>
        <DepartmentsHeader>
          <DepartmentLabel>Departamentos</DepartmentLabel>

          <Button
            type="button"
            color={light.colors.success}
            onClick={handleOpenDepartmentSelectModal}
          >
            <MdAdd />
            Adicionar Departamento
          </Button>
        </DepartmentsHeader>

        {departmentsSelected.map(({ id, description }) => (
          <DepartmentCard
            key={id}
            title={description}
            handleRemove={() => handleDepartmentSelectedRemove(id)}
          />
        ))}
      </DepartmentsContainer>

      <Modal isOpen={departmentSelectIsOpen}>
        <DepartmentSelectModal
          handleCloseModal={handleCloseDepartmentSelectModal}
          handleDepartmentSelected={handleDepartmentSelectedAdd}
        />
      </Modal>
    </Container>
  );
};

export default OtherMachineRegister;
