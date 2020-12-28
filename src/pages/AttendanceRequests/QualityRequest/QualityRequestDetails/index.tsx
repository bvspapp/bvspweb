import React, {
  useCallback,
  useEffect,
  useState,
  useRef,
  useMemo,
} from 'react';
import { useHistory } from 'react-router-dom';
import { FormHandles } from '@unform/core';
import { format, isBefore } from 'date-fns';
import * as Yup from 'yup';

import {
  MdAlarm,
  MdArrowBack,
  MdBookmarkBorder,
  MdPermIdentity,
  MdStarBorder,
  MdHistory,
  MdCheck,
  MdClose,
} from 'react-icons/md';

import MessageAlert from '../../../../utils/MessageAlert';
import MessageConfirmation from '../../../../utils/MessageConfirmation';
import api from '../../../../services/api';
import firebase from '../../../../config/firebase';

import light from '../../../../styles/themes/light';
import Toggle from '../../../../components/Toggle';
import Button from '../../../../components/Form/Button';
import TextInput from '../../../../components/Form/TextInput';
import TextAreaInput from '../../../../components/Form/TextAreaInput';
import Load from '../../../../components/Load';
import HistoryTableData from '../../../../components/HistoryTableData';
import Modal from '../../../../components/Modal';
import Select from '../../../../components/Form/SelectInput';

import {
  Container,
  Header,
  Content,
  Title,
  ButtonsContainer,
  Form,
  FormContent,
  AttendanceInfo,
  RememberContainer,
  HistoryButton,
  ClientDescription,
  HistoryHeader,
  HistoryTitle,
  HistoryModalClose,
  StatusRequestLabel,
  StatusRequest,
  FormRow,
  FilesContainer,
  FileLink,
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
  request_status_id: number;
  suggestion: number;
}

interface IFormData {
  quality_description: string;
  alert_date: string;
  alert_hour: string;
  rnc: string;
  proceed: number;
  suggestion: number;
}

interface IHistory {
  created_at: string;
  when: string;
  user_name: string;
}

interface IQualityDetailsType {
  id: string;
  proceed: number;
  description: string;
  rnc: string;
  created_at: Date;
  updated_at: Date;
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

interface IFiles {
  name: string;
  url: string;
}

interface IRouteParams {
  match: {
    params: {
      id: string;
    };
  };
}

const QualityRequestDetails: React.FC<IRouteParams> = ({ match }) => {
  const [data, setData] = useState<IData>({} as IData);
  const [files, setFiles] = useState<IFiles[]>([]);
  const [loading, setLoading] = useState(true);
  const [requestHistory, setRequestHistory] = useState<IHistory[]>([]);
  const [requestHistoryIsOpen, setRequestHistoryIsOpen] = useState(false);

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

  const optionsProceed = useMemo(() => {
    return [
      {
        value: 0,
        label: 'Não',
      },
      {
        value: 1,
        label: 'Sim',
      },
    ];
  }, []);

  const handleBack = useCallback(() => {
    history.goBack();
  }, [history]);

  const handleFetchData = useCallback(async () => {
    const qualityDetails: IQualityDetailsType = await api
      .get(`/requests/quality/${requestId}`)
      .then(response => {
        return response.data;
      });

    const alertExists = await api
      .get(`/requests/alert/${requestId}`)
      .then(response => {
        return response.data.moment;
      });

    const day = alertExists || new Date();

    const alert_date = format(new Date(day), 'yyyy-MM-dd');
    const alert_hour = format(new Date(day), 'HH:mm');

    await api.get(`/requests/followup/${requestId}/2`).then(response => {
      // console.log(response.data);

      const dataFormatted = {
        id: String(response.data.request_id),
        status: String(response.data.request_status.name).toUpperCase(),
        when: format(
          new Date(response.data.request.created_at),
          'dd/MM/yyyy - HH:mm',
        ),
        client_name: String(response.data.request.user.name),
        contact: `${response.data.request.contact} (${response.data.request.contact_type.name})`,
        client_description: String(response.data.request.client_description),
        attendant_description: String(
          response.data.request.attendant_description || '',
        ),
        alert_date,
        alert_hour,
        request_status_id: Number(response.data.request_status_id),
        rnc: qualityDetails.rnc,
        quality_description: qualityDetails.description,
        proceed: qualityDetails.proceed,
        suggestion: qualityDetails.rnc.length > 1 ? 0 : 1,
      };

      setData(dataFormatted);
      setLoading(false);
    });
  }, [requestId]);

  const handleSave = useCallback(
    async (submitData: IFormData) => {
      try {
        const schema = Yup.object().shape({
          sale_description: Yup.string().default(''),
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
          'Confirmar atualização da solicitação?',
          'Sim. Confirmar!',
          'question',
        );

        if (isConfirmed) {
          setLoading(true);

          await api
            .put(`/requests/quality/${requestId}`, {
              description: submitData.quality_description,
              rnc: submitData.rnc,
              proceed: submitData.proceed,
            })
            .then(async () => {
              await api.post(`/requests/alert`, {
                request_id: requestId,
                moment: alert,
              });

              MessageAlert('Solicitação salva com sucesso!', 'success');
              history.goBack();
            })
            .catch(() =>
              MessageAlert('Não foi possível salvar a solicitação', 'error'),
            )
            .finally(() => setLoading(false));
        }
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          MessageAlert(error.errors[0], 'info');
        }
      }
    },
    [requestId, history],
  );

  const handleCloseOrOpenRequest = useCallback(async () => {
    const { isConfirmed } = await MessageConfirmation(
      'Deseja realmente mudar o status da solicitação?',
      'Sim. Confirmar!',
      'question',
    );

    if (isConfirmed) {
      setLoading(true);
      const action = data.request_status_id === 3 ? 'open' : 'close';

      await api
        .post('/requests/close-followup', {
          request_type_id: 2,
          request_id: requestId,
          action,
        })
        .then(() => {
          MessageAlert('Status da solicitação atualizado!', 'success');
          history.goBack();
        })
        .catch(() =>
          MessageAlert(
            'Não foi possível atualizar o status da solicitação',
            'error',
          ),
        )
        .finally(() => setLoading(false));
    }
  }, [data.request_status_id, requestId, history]);

  useEffect(() => {
    handleFetchData();
  }, [handleFetchData]);

  useEffect(() => {
    firebase
      .firestore()
      .collection('attachment')
      .where('request_id', '==', requestId)
      .get()
      .then(snapshot => {
        snapshot.docs.forEach(doc => {
          doc.data().photos.forEach((element: IFiles) => {
            setFiles(prevState => [
              ...prevState,
              {
                name: String(element.name),
                url: String(element.url),
              },
            ]);
          });
        });
      });
  }, [requestId]);

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
              <Title>Detalhes da Solicitação de Qualidade</Title>
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

              {data.attendant_description && (
                <ClientDescription>
                  <strong>Descrição do atendimento:</strong>
                  <p>{data.attendant_description}</p>
                </ClientDescription>
              )}

              <TextAreaInput
                name="quality_description"
                label="Anotações da Qualidade"
                rows={5}
                containerCustomStyle={{ marginTop: 20 }}
              />

              <FormRow>
                <Select
                  name="suggestion"
                  label="É UMA SUGESTÃO?"
                  options={optionsProceed}
                  containerCustomStyle={{ marginRight: 10 }}
                />

                <Select
                  name="proceed"
                  label="Procede?"
                  options={optionsProceed}
                />

                <TextInput
                  name="rnc"
                  label="RNC"
                  containerCustomStyle={{
                    flex: 1,
                    marginLeft: 10,
                  }}
                />
              </FormRow>

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
          </Form>

          <FilesContainer>
            {files.map((item, index) => (
              <FileLink key={String(index)} href={item.url} target="_blank">
                Abrir Arquivo
{' '}
{index}
              </FileLink>
            ))}
          </FilesContainer>

          <StatusRequestLabel>Status da Solicitação</StatusRequestLabel>
          <StatusRequest>
            <Toggle
              labelLeft="Em Andamento"
              labelRight="Concluído"
              checked={data.request_status_id === 3}
              onChange={handleCloseOrOpenRequest}
            />
          </StatusRequest>
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

export default QualityRequestDetails;
