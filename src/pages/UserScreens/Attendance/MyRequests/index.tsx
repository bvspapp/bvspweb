import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { format } from 'date-fns';

import { MdArrowBack, MdRemoveRedEye } from 'react-icons/md';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';

import HighlightTitle from '../../../../components/HighlightTitle';
import TableData from '../../../../components/TableData';
import Load from '../../../../components/Load';

import api from '../../../../services/api';

import light from '../../../../styles/themes/light';
import {
  Container,
  Content,
  Header,
  BackButton,
  PaginationButtons,
  PaginationButton,
  PageNumberLabel,
} from './styles';

import translatedContent from './translatedcontent';
import { useTranslation } from '../../../../hooks/translation';

interface IData {
  id: string;
  date: string;
  hour: string;
  status: string;
}

interface IRequestResponse {
  id: string;
  created_at: string;
  request_status: {
    name: string;
  };
}

const MyRequests: React.FC = () => {
  const [dataTable, setDataTable] = useState<IData[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(true);

  const { translation } = useTranslation();
  const history = useHistory();

  const translated = useMemo(() => {
    return translation === 'en-us'
      ? translatedContent.en_US
      : translatedContent.pt_BR;
  }, [translation]);

  const dataTableColumns = useMemo(() => {
    return [
      {
        name: 'Data',
        selector: 'date',
      },
      {
        name: 'Hora',
        selector: 'hour',
      },
      {
        name: 'Status',
        selector: 'status',
      },
    ];
  }, []);

  const controllers = useMemo(() => {
    return [{ route: 'request', action: 'view', icon: MdRemoveRedEye }];
  }, []);

  const handleFetchData = useCallback(async () => {
    setLoading(true);

    await api
      .get(`requests/byuser?page=${pageNumber}&perpage=8`)
      .then(response => {
        const dataFormatted = response.data.map((request: IRequestResponse) => {
          return {
            id: String(request.id),
            date: format(new Date(request.created_at), 'dd/MM/yyyy'),
            hour: format(new Date(request.created_at), 'HH:mm:ss'),
            status: String(request.request_status.name).toUpperCase(),
          };
        });

        setDataTable(dataFormatted);
      })
      .finally(() => setLoading(false));
  }, [pageNumber]);

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
          <TableData
            data={dataTable}
            columns={dataTableColumns}
            controllers={controllers}
          />

          <PaginationButtons>
            {pageNumber > 1 && (
              <PaginationButton
                type="button"
                color={light.colors.success}
                onClick={() => setPageNumber(prevState => prevState - 1)}
              >
                <FiArrowLeft />
              </PaginationButton>
            )}

            {dataTable.length > 0 && (
              <PageNumberLabel>{`Página ${pageNumber}`}</PageNumberLabel>
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

export default MyRequests;
