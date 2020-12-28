import React, {
  useCallback,
  useEffect,
  useState,
  useRef,
  useMemo,
} from 'react';
import { useHistory } from 'react-router-dom';
import { FormHandles } from '@unform/core';
import { format, isBefore, addDays } from 'date-fns';
import * as Yup from 'yup';

import {
  MdAlarm,
  MdArrowBack,
  MdBookmarkBorder,
  MdPermIdentity,
  MdStarBorder,
  MdHistory,
  MdReceipt,
  MdShoppingCart,
  MdBuild,
  MdFeedback,
  MdCheck,
  MdClose,
} from 'react-icons/md';

import MessageAlert from '../../../utils/MessageAlert';
import MessageConfirmation from '../../../utils/MessageConfirmation';
import api from '../../../services/api';

import light from '../../../styles/themes/light';

import Button from '../../../components/Form/Button';
import TextInput from '../../../components/Form/TextInput';
import TextAreaInput from '../../../components/Form/TextAreaInput';
import Load from '../../../components/Load';
import HistoryTableData from '../../../components/HistoryTableData';
import Modal from '../../../components/Modal';
import AttendanceOptionBox from '../../../components/AttendanceOptionBox';

import {
  Container,
  Header,
  Content,
  Title,
  ButtonsContainer,
  Form,
  FormContent,
  FormRow,
  AttendanceInfo,
  RememberContainer,
  HistoryButton,
  LabelFlowTypes,
  AttendanceContainer,
  ClientDescription,
  HistoryHeader,
  HistoryTitle,
  HistoryModalClose,
} from './styles';

interface IData {
  id: string;
  status: string;
  when: string;
  client_name: string;
  contact: string;
  client_description: string;
  attendant_description: string;
  alert_date: string;
  alert_hour: string;
}

interface IFormData {
  attendant_description: string;
  alert_date: string;
  alert_hour: string;
}

interface IHistoryResponse {
  created_at: string;
  description: string;
  id: string;
  request_id: string;
  user_id: string;
  user: {
    name: string;
  };
}

interface IHistory {
  created_at: string;
  when: string;
  user_name: string;
}

interface IRouteParams {
  match: {
    params: {
      id: string;
    };
  };
}

const AttendanceRequestClassification: React.FC<IRouteParams> = ({ match }) => {
  const [data, setData] = useState<IData>({} as IData);
  const [loading, setLoading] = useState(true);
  const [requestType, setRequestType] = useState<number>(0);
  const [requestHistory, setRequestHistory] = useState<IHistory[]>([]);
  const [requestHistoryIsOpen, setRequestHistoryIsOpen] = useState(false);

  const [followupExists, setFollowUpExists] = useState(false);

  const { id: requestId } = match.params;

  const formRef = useRef<FormHandles>(null);
  const history = useHistory();

  const historyTableColumns = useMemo(() => {
    return [
      {
        name: 'Descrição',
        selector: 'description',
      },
      {
        name: 'Date e Hora',
        selector: 'when',
      },
      {
        name: 'Responsável',
        selector: 'user_name',
      },
    ];
  }, []);

  const handleBack = useCallback(() => {
    history.goBack();
  }, [history]);

  const handleClassification = useCallback(
    async (type: number, department: string) => {
      const { isConfirmed } = await MessageConfirmation(
        `Você deseja enviar essa solicitação para o setor ${department}?`,
        'Sim. Confirmar!',
        'question',
      );
      if (isConfirmed) {
        setLoading(true);
        await api
          .post('requests/followup', {
            request_id: data.id,
            request_type: type,
          })
          .then(() => {
            MessageAlert(
              `Solicitação enviada para o setor ${department}`,
              'success',
            );
            setFollowUpExists(true);
          })
          .catch(() =>
            MessageAlert(
              `Não foi possível enviar a solicitação para o setor ${department}`,
              'error',
            ),
          )
          .finally(() => setLoading(false));
      }
    },
    [data.id],
  );

  const handleFetchData = useCallback(async () => {
    const alert_date = format(addDays(new Date(), 3), 'yyyy-MM-dd');
    const alert_hour = format(new Date(), 'HH:mm');

    await api.get(`requests/${requestId}`).then(response => {
      const dataFormatted = {
        id: String(response.data.id),
        status: String(response.data.request_status.name).toUpperCase(),
        when: format(new Date(response.data.created_at), 'dd/MM/yyyy - HH:mm'),
        client_name: String(response.data.user.name),
        contact: `${response.data.contact} (${response.data.contact_type.name})`,
        client_description: String(response.data.client_description),
        attendant_description: String(
          response.data.attendant_description || '',
        ),
        alert_date,
        alert_hour,
      };

      setData(dataFormatted);
      setLoading(false);
    });
  }, [requestId]);

  const handleSave = useCallback(
    async (submitData: IFormData) => {
      try {
        const schema = Yup.object().shape({
          attendant_description: Yup.string().default(''),
          alert_date: Yup.string().required('Data para lembrar é obrigatória'),
          alert_hour: Yup.string().required('Hora para lembrar é obrigatória'),
        });

        await schema.validate(submitData);
        const alert = new Date(
          `${submitData.alert_date} ${submitData.alert_hour}`,
        );

        if (isBefore(alert, new Date())) {
          return MessageAlert(
            'Você não pode escolher uma data no passado para definir o lembrete!',
            'info',
          );
        }

        const { isConfirmed } = await MessageConfirmation(
          'Confirmar atualização?',
          'Sim. Confirmar!',
          'question',
        );

        if (isConfirmed) {
          setLoading(true);
          await api
            .put(`requests/${data.id}`, {
              attendant_description: submitData.attendant_description,
            })
            .then(async () => {
              await api.post(`/requests/alert`, {
                request_id: data.id,
                moment: alert,
              });

              MessageAlert('Solicitação Atualizada!', 'success');
              history.goBack();
            });

          setLoading(false);
        }
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          MessageAlert(error.errors[0], 'info');
        }
      }
    },
    [data.id, history],
  );

  useEffect(() => {
    api.get(`/request-status/${requestId}`).then(response => {
      setFollowUpExists(response.data !== 'EM ABERTO');
    });
  });

  useEffect(() => {
    handleFetchData();
  }, [handleFetchData]);

  useEffect(() => {
    async function historiesFetch() {
      await api.get(`requests/history/${requestId}`).then(response => {
        const dataFormatted = response.data.map((item: IHistoryResponse) => {
          return {
            description: String(item.description),
            when: format(new Date(item.created_at), 'dd/MM/yyyy - HH:mm'),
            user_name: item.user.name,
          };
        });

        setRequestHistory(dataFormatted);
      });
    }

    historiesFetch();
  }, [requestId]);

  return (
    <Container>
      {loading ? (
        <Load />
      ) : (
        <Content>
          <Form ref={formRef} initialData={data} onSubmit={handleSave}>
            <Header>
              <Title>Detalhes do Atendimento</Title>
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
                <AttendanceInfo>
                  <MdBookmarkBorder />
                  <strong>Atendimento em:</strong>
                  <span className="isopen">{data.status}</span>
                </AttendanceInfo>

                <AttendanceInfo>
                  <MdAlarm />
                  <strong>Solicitado em:</strong>
                  {data.when}
                </AttendanceInfo>
              </FormRow>

              <FormRow>
                <AttendanceInfo>
                  <MdPermIdentity />
                  <strong>Nome do cliente:</strong>
                  {data.client_name}
                </AttendanceInfo>

                <AttendanceInfo>
                  <MdStarBorder />
                  <strong>Contato para retorno:</strong>
                  {data.contact}
                </AttendanceInfo>
              </FormRow>

              <ClientDescription>
                <strong>Descrição do Cliente:</strong>
                <p>{data.client_description}</p>
              </ClientDescription>

              <TextAreaInput
                name="attendant_description"
                label="Anotações da classificação do atendimento"
                rows={5}
                containerCustomStyle={{ marginTop: 20 }}
              />

              <FormRow>
                <HistoryButton
                  type="button"
                  color={light.colors.success}
                  onClick={() => {
                    setRequestHistoryIsOpen(true);
                  }}
                >
                  <MdHistory />
                  Histórico da Requisição
                </HistoryButton>

                <RememberContainer>
                  <TextInput
                    type="date"
                    name="alert_date"
                    label="Me lembrar em"
                    containerCustomStyle={{ marginRight: 10 }}
                  />
                  <TextInput type="time" name="alert_hour" />
                </RememberContainer>
              </FormRow>
            </FormContent>

            {!followupExists && (
              <>
                <LabelFlowTypes>
                  Escolha o departamento para enviar a solicitação
                </LabelFlowTypes>

                <AttendanceContainer>
                  <AttendanceOptionBox
                    icon={MdReceipt}
                    title="Orçamento"
                    active={requestType === 3}
                    handleClick={() => handleClassification(3, 'Orçamento')}
                  />
                  <AttendanceOptionBox
                    icon={MdShoppingCart}
                    title="Vendas"
                    active={requestType === 1}
                    handleClick={() => handleClassification(1, 'Vendas')}
                  />

                  <AttendanceOptionBox
                    icon={MdBuild}
                    title="Técnico"
                    active={requestType === 4}
                    handleClick={() => handleClassification(4, 'Técnico')}
                  />

                  <AttendanceOptionBox
                    icon={MdFeedback}
                    title="Qualidade"
                    active={requestType === 2}
                    handleClick={() => handleClassification(2, 'Qualidade')}
                  />
                </AttendanceContainer>
              </>
            )}
          </Form>
        </Content>
      )}

      <Modal isOpen={requestHistoryIsOpen}>
        <HistoryHeader>
          <HistoryTitle>Histórico da Solicitação</HistoryTitle>
          <HistoryModalClose onClick={() => setRequestHistoryIsOpen(false)}>
            <MdClose />
          </HistoryModalClose>
        </HistoryHeader>
        <HistoryTableData columns={historyTableColumns} data={requestHistory} />
      </Modal>
    </Container>
  );
};

export default AttendanceRequestClassification;
