import React, {
  useMemo,
  useCallback,
  useEffect,
  useState,
  useRef,
} from 'react';
import { Form } from '@unform/web';
import { useHistory } from 'react-router-dom';
import { format, subHours } from 'date-fns';
import { FormHandles } from '@unform/core';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import { MdRemoveRedEye, MdArrowBack, MdSearch } from 'react-icons/md';
import api from '../../../../services/api';

import light from '../../../../styles/themes/light';

import TableData from '../../../../components/TableData';
import Button from '../../../../components/Form/Button';
import TextInput from '../../../../components/Form/TextInput';
import Load from '../../../../components/Load';

import {
  Container,
  Header,
  Content,
  Title,
  ButtonsContainer,
  PaginationButtons,
  PaginationButton,
  PageNumberLabel,
  NoRemembers,
} from './styles';

interface IData {
  id: string;
  client_name: string;
  date: string;
  hour: string;
}

interface IRequestResponse {
  client_id: string;
  client_name: string;
  created_at: string;
  id: string;
  moment: string;
  request_id: string;
  request_status_id: number;
  request_type_id: number;
  updated_at: string;
  user_name: string;
}

interface IFormData {
  date: string;
}

const NotificationsBudgetRequestList: React.FC = () => {
  const [dataTable, setDataTable] = useState<IData[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const [data, setData] = useState<IFormData>({} as IFormData);
  const [selectDate, setSelectDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  const formRef = useRef<FormHandles>(null);

  const history = useHistory();

  const dataTableColumns = useMemo(() => {
    return [
      {
        name: 'Cliente',
        selector: 'client_name',
      },
      {
        name: 'Data e Hora',
        selector: 'moment',
      },
    ];
  }, []);

  const controllers = useMemo(() => {
    return [{ route: '/budget', action: 'edit', icon: MdRemoveRedEye }];
  }, []);

  const handleBack = useCallback(() => {
    history.push('/');
  }, [history]);

  const handleFetchData = useCallback(async () => {
    setLoading(true);

    await api
      .get(`/requests/alert-byrequest-and-type/3/${selectDate}/${pageNumber}/8`)
      .then(response => {
        const date = new Date();
        const offsetInHours = date.getTimezoneOffset() / 60;


        const dataFormatted = response.data.map((request: IRequestResponse) => {
          return {
            id: String(request.request_id),
            client_id: String(request.client_id),
            client_name: String(request.client_name),
            moment: format(subHours(new Date(request.moment), offsetInHours), "dd/MM/yyyy à's' HH:mm"),
          };
        });

        setDataTable(dataFormatted);
      })
      .finally(() => setLoading(false));
  }, [pageNumber, selectDate]);

  useEffect(() => {
    handleFetchData();

  }, [handleFetchData]);

  return (
    <Container>
      <Header>
        <Title>Lembretes</Title>
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

      {loading ? (
        <Load />
      ) : (
        <Content>
          <Form ref={formRef} onSubmit={handleFetchData} initialData={data}>
            <ButtonsContainer>
              <TextInput
                type="date"
                name="date"
                containerCustomStyle={{ width: 170 }}
                value={selectDate}
                onChange={(e) => setSelectDate(e.target.value)}
              />
            </ButtonsContainer>
          </Form>

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

export default NotificationsBudgetRequestList;
