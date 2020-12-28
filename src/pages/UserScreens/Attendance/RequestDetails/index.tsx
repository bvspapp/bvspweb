import React, {
  useMemo,
  useState,
  useCallback,
  useEffect,
  Fragment,
} from 'react';
import { useHistory } from 'react-router-dom';
import { format, parseISO } from 'date-fns';

import {
  MdArrowBack,
  MdEvent,
  MdAlarm,
  MdInsertEmoticon,
  MdCheck,
} from 'react-icons/md';

import HighlightTitle from '../../../../components/HighlightTitle';
import Load from '../../../../components/Load';

import api from '../../../../services/api';

import light from '../../../../styles/themes/light';
import {
  Container,
  Content,
  Header,
  BackButton,
  SubTitle,
  FormData,
  FormRow,
  Date,
  Hour,
  Contact,
  RequestLabel,
  RequestField,
  RequestStatus,
  Steps,
  StepItem,
  StepLine,
  Info,
} from './styles';

import translatedContent from './translatedcontent';
import { useTranslation } from '../../../../hooks/translation';

interface IData {
  date: string;
  hour: string;
  status: string;
  contact: string;
  contact_description: string;
  description: string;
  steps: {
    name: string;
    done: boolean;
  }[];
}

interface IRouteParams {
  match: {
    params: {
      id: string;
    };
  };
}

const RequestDetails: React.FC<IRouteParams> = ({ match }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<IData>({} as IData);

  const { translation } = useTranslation();
  const history = useHistory();

  const translated = useMemo(() => {
    return translation === 'en-us'
      ? translatedContent.en_US
      : translatedContent.pt_BR;
  }, [translation]);

  const handleFetchData = useCallback(async () => {
    setLoading(true);

    await api
      .get(`requests/${match.params.id}`)
      .then(response => {
        const dateFormatted = parseISO(response.data.created_at);
        const date = format(dateFormatted, 'dd/MM/yyyy');
        const hour = format(dateFormatted, 'HH:mm:ss');

        const currentStatus = String(
          response.data.request_status.name,
        ).toUpperCase();

        const steps = [
          { name: 'Aberto', done: true },
          { name: 'Em Andamento', done: currentStatus !== 'EM ABERTO' },
          { name: 'Concluído', done: currentStatus === 'CONCLUÍDO' },
        ];

        const dataFormatted = {
          date,
          hour,
          status: String(response.data.request_status.name).toUpperCase(),
          contact: String(response.data.contact),
          contact_description: `${response.data.contact_type.name}`,
          description: String(response.data.client_description),
          steps,
        };

        setData(dataFormatted);
      })
      .finally(() => setLoading(false));
  }, [match.params.id]);

  useEffect(() => {
    handleFetchData();
  }, [handleFetchData]);

  return (
    <Container>
      <Header>
        <HighlightTitle title={translated.title} lineAlign="left" />
        <BackButton
          type="button"
          color={light.colors.primary}
          onClick={() => history.goBack()}
        >
          <MdArrowBack />
        </BackButton>
      </Header>
      {loading ? (
        <Load />
      ) : (
        <Content>
          <RequestStatus>
            <SubTitle>{translated.subtitle}</SubTitle>
            <Info>{translated.info}</Info>

            <Steps>
              {data.steps.map((step, index) => (
                <Fragment key={String(index)}>
                  <div>
                    <StepItem done={step.done}>
                      <div>{step.done ? <MdCheck /> : index + 1}</div>
                      <span>{step.name}</span>
                    </StepItem>
                  </div>
                  {data.steps.length !== index + 1 && <StepLine />}
                </Fragment>
              ))}
            </Steps>
          </RequestStatus>

          <FormData>
            <FormRow>
              <Date>
                <MdEvent />
                <strong>Data da solicitação:</strong>
                {data.date}
              </Date>
              <Hour>
                <MdAlarm />
                <strong>Horário da solicitação:</strong>
                {data.hour}
              </Hour>
            </FormRow>
            <Contact>
              <MdInsertEmoticon />
              <strong>Contato informado:</strong>
              {`${data.contact} (${data.contact_description})`}
            </Contact>

            <RequestLabel>Sua solicitação: </RequestLabel>
            <RequestField>{data.description}</RequestField>
          </FormData>
        </Content>
      )}
    </Container>
  );
};

export default RequestDetails;
