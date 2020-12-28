import React, {
  useCallback,
  useState,
  useRef,
  useMemo,
  useEffect,
} from 'react';
import * as Yup from 'yup';
import { useHistory } from 'react-router-dom';
import { FormHandles } from '@unform/core';
import { isBefore, format, addDays } from 'date-fns';

import {
  MdArrowBack,
  MdSearch,
  MdCheck,
  MdReceipt,
  MdFeedback,
} from 'react-icons/md';

import Modal from '../../../components/Modal';

import api from '../../../services/api';

import light from '../../../styles/themes/light';
import MessageAlert from '../../../utils/MessageAlert';
import MessageConfirmation from '../../../utils/MessageConfirmation';
import Button from '../../../components/Form/Button';
import TextInput from '../../../components/Form/TextInput';
import SelectInput from '../../../components/Form/SelectInput';
import TextAreaInput from '../../../components/Form/TextAreaInput';
import AttendanceOptionBox from '../../../components/AttendanceOptionBox';
import Load from '../../../components/Load';

import ClientSelect from '../../User/ClientSelect';

import {
  Container,
  Header,
  Content,
  Title,
  ButtonsContainer,
  Form,
  FormContent,
  FormRow,
  UserSelectButton,
  LabelFlowTypes,
  AttendanceContainer,
  RememberContainer,
} from './styles';

interface IClientData {
  id: string;
  name: string;
  email: string;
  telephone: string;
}

interface IFormData {
  user_id: string;
  contact_type_id: number;
  description: string;
  contact: string;
  alert_date: string;
  alert_hour: string;
}

const AttendanceRequestRegister: React.FC = () => {
  const [clientSelectIsOpen, setClientSelectIsOpen] = useState(false);
  const [data, setData] = useState<IClientData>({} as IClientData);
  const [loading, setLoading] = useState(false);
  const [requestTypesClassification, setRequestTypesClassification] = useState(
    3,
  );

  const formRef = useRef<FormHandles>(null);
  const history = useHistory();

  const contactTypesOptions = useMemo(() => {
    return [
      { value: 1, label: 'E-mail' },
      { value: 2, label: 'Ligação' },
      { value: 3, label: 'Whatsapp' },
    ];
  }, []);

  const handleBack = useCallback(() => {
    history.goBack();
  }, [history]);

  const handleCloseClientSelect = useCallback(() => {
    setClientSelectIsOpen(false);
  }, []);

  const handleClientSelectedAdd = useCallback((clientSelected: IClientData) => {
    formRef.current?.setFieldValue('name', clientSelected.name);
    formRef.current?.setFieldValue('contact_type_id', 2);
    formRef.current?.setFieldValue('contact', clientSelected.telephone);
    formRef.current?.getFieldRef('description').focus();

    setData(clientSelected);
    setClientSelectIsOpen(false);
  }, []);

  const handleChangeContactType = useCallback(
    (type: string) => {
      formRef.current?.setFieldValue(
        'contact',
        type === '1' ? data.email : data.telephone,
      );
    },
    [data],
  );

  const handleFormSubmitData = useCallback(
    async (formData: IFormData) => {
      try {
        // console.log(formData);

        const schema = Yup.object().shape({
          contact_type_id: Yup.string().required('Escolha o tipo o contato.'),
          contact: Yup.string().required('Informe o contato.'),
          description: Yup.string().required(
            'Informe o motivo da solicitação.',
          ),
          alert_date: Yup.string().required('Data para lembrar é obrigatória'),
          alert_hour: Yup.string().required('Hora para lembrar é obrigatória'),
        });

        await schema.validate(formData);
        const alert = new Date(`${formData.alert_date} ${formData.alert_hour}`);

        if (isBefore(alert, new Date())) {
          return MessageAlert(
            'Você não pode escolher uma data no passado para definir o lembrete!',
            'info',
          );
        }

        if (!requestTypesClassification)
          return MessageAlert(
            'Escolha uma equipe para enviar a requisição!',
            'info',
          );

        const { isConfirmed } = await MessageConfirmation(
          'Confirmar solicitação?',
          'Sim. Confirmar!',
          'question',
        );

        if (isConfirmed) {
          setLoading(true);
          // criar requisição
          await api
            .post('requests', {
              user_id: data.id,
              contact_type_id: formData.contact_type_id,
              description: formData.description,
              contact: formData.contact,
              request_type: requestTypesClassification,
            })
            .then(() => {
              MessageAlert('Cadastrado com sucesso!', 'success').then(() =>
                history.push('/'),
              );
            })
            .catch(() =>
              MessageAlert('Não foi possível concluír o registro', 'error'),
            )
            .finally(() => setLoading(false));
        }
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          MessageAlert(error.errors[0], 'info');
        }
      }
    },
    [history, data.id, requestTypesClassification],
  );

  useEffect(() => {
    const alert_date = format(addDays(new Date(), 3), 'yyyy-MM-dd');
    const alert_hour = format(new Date(), 'HH:mm');

    formRef.current?.setFieldValue('alert_date', alert_date);
    formRef.current?.setFieldValue('alert_hour', alert_hour);
  }, []);

  return (
    <Container>
      {loading ? (
        <Load />
      ) : (
        <Content>
          {loading ? (
            <Load />
          ) : (
            <Form ref={formRef} onSubmit={handleFormSubmitData}>
              <Header>
                <Title>Nova Demanda</Title>
                <ButtonsContainer>
                  <Button
                    type="button"
                    color={light.colors.primary}
                    onClick={handleBack}
                  >
                    <MdArrowBack />
                    Voltar
                  </Button>
                  <Button type="submit" color={light.colors.success}>
                    <MdCheck />
                    Salvar
                  </Button>
                </ButtonsContainer>
              </Header>

              <FormContent>
                <FormRow>
                  <TextInput
                    type="text"
                    name="name"
                    label="Cliente"
                    containerCustomStyle={{ flex: 1, marginRight: 5 }}
                    readOnly
                  />
                  <UserSelectButton
                    type="button"
                    color={light.colors.success}
                    onClick={() => setClientSelectIsOpen(true)}
                  >
                    <MdSearch />
                  </UserSelectButton>
                  <SelectInput
                    name="contact_type_id"
                    label="Opção de Contato"
                    options={contactTypesOptions}
                    containerCustomStyle={{ marginRight: 10 }}
                    onChange={e => handleChangeContactType(e.target.value)}
                  />
                  <TextInput type="text" name="contact" />
                </FormRow>

                <TextAreaInput
                  name="description"
                  label="Solicitação do Cliente"
                  rows={7}
                />

                <RememberContainer>
                  <TextInput
                    type="date"
                    name="alert_date"
                    label="Me lembrar em"
                    containerCustomStyle={{ marginRight: 10 }}
                  />
                  <TextInput type="time" name="alert_hour" />
                </RememberContainer>

                <LabelFlowTypes>
                  Escolha a classificação da nova demanda
                </LabelFlowTypes>

                <AttendanceContainer>
                  <AttendanceOptionBox
                    icon={MdReceipt}
                    title="Orçamento"
                    active={requestTypesClassification === 3}
                    handleClick={() => setRequestTypesClassification(3)}
                  />

                  <AttendanceOptionBox
                    icon={MdFeedback}
                    title="Qualidade"
                    active={requestTypesClassification === 2}
                    handleClick={() => setRequestTypesClassification(2)}
                  />
                </AttendanceContainer>
              </FormContent>
            </Form>
          )}
          <Modal isOpen={clientSelectIsOpen}>
            <ClientSelect
              handleCloseModal={handleCloseClientSelect}
              handleSelected={handleClientSelectedAdd}
            />
          </Modal>
        </Content>
      )}
    </Container>
  );
};

export default AttendanceRequestRegister;
