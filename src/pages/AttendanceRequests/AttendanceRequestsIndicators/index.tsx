import React, { useCallback, useState, useMemo, useEffect } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Cell,
} from 'recharts';
import { useHistory } from 'react-router-dom';

import {
  MdArrowBack,
  MdPeople,
  MdReceipt,
  MdShoppingCart,
  MdDescription,
  MdBuild,
  MdFeedback,
} from 'react-icons/md';
import { FiFilter, FiCheck } from 'react-icons/fi';

import months from '../../../utils/months';
import light from '../../../styles/themes/light';
import api from '../../../services/api';

import Button from '../../../components/Form/Button';
import Select from '../../../components/SelectInput';
import Load from '../../../components/Load';

import {
  Container,
  Header,
  Content,
  Title,
  ButtonsContainer,
  HistoryAttendanceContainer,
  BarChartBox,
  BoxHeader,
  ChartTitle,
  Controllers,
  SearchButton,
  TilesLine,
  Dividir,
} from './styles';

const COLORS = ['#CC1319', '#595959', '#00C49F', '#FF8042'];

const years = [
  {
    value: 2020,
    label: 2020,
  },
  {
    value: 2021,
    label: 2021,
  },
];

const orcamento = [
  { name: 'Aberto', value: 30, percent: 30, color: 'red' },
  { name: 'Andamento', value: 20, percent: 20, color: 'green' },
  { name: 'Concluído', value: 50, percent: 50, color: 'blue' },
];

interface IHistory {
  month: number;
}

const AttendanceRequestsList: React.FC = () => {
  const [loading, setLoading] = useState(true);

  const [filterBy, setFilterBy] = useState('month');
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  const [historyData, setHistoryData] = useState<IHistory[]>([]);

  const history = useHistory();

  const optionsFilter = useMemo(() => {
    return [
      {
        value: 'month',
        label: 'Mês',
      },
      {
        value: 'year',
        label: 'Ano',
      },
    ];
  }, []);

  const handleBack = useCallback(() => {
    history.push('/');
  }, [history]);

  const handleFetchData = useCallback(async () => {
    setLoading(true);

    if (filterBy === 'year') {
      api.get(`requests/indicators/by-year?year=${year}`).then(response => {
        setHistoryData(response.data);
      });
    }

    if (filterBy === 'month') {
      api
        .get(`requests/indicators/by-month?month=${month}&&year=${year}`)
        .then(response => {
          setHistoryData(response.data);
        });
    }

    setLoading(false);
  }, [filterBy, year, month]);

  useEffect(() => {
    handleFetchData();
  }, [handleFetchData]);

  return (
    <Container>
      <Header>
        <Title>Indicadores de Atendimentos</Title>
        <ButtonsContainer>
          <Button
            type="button"
            color={light.colors.primary}
            onClick={handleBack}
          >
            <MdArrowBack />
            Voltar
          </Button>

          <Dividir />

          <Controllers>
            <Select
              name="filterBy"
              icon={FiFilter}
              options={optionsFilter}
              onChange={e => setFilterBy(e.target.value)}
              value={filterBy}
            />

            {filterBy === 'month' && (
              <Select
                name="filterMonth"
                options={months}
                onChange={e => setMonth(Number(e.target.value))}
                value={month}
              />
            )}
            <Select
              name="filterYear"
              options={years}
              onChange={e => setYear(Number(e.target.value))}
              value={year}
            />
            <SearchButton
              type="submit"
              color={light.colors.success}
              onClick={handleFetchData}
            >
              <FiCheck />
            </SearchButton>
          </Controllers>
        </ButtonsContainer>
      </Header>

      {loading ? (
        <Load />
      ) : (
        <Content>
          <TilesLine>
            <HistoryAttendanceContainer>
              <BoxHeader>
                <ChartTitle>Solicitação de Atendimentos</ChartTitle>
                <MdPeople size={20} />
              </BoxHeader>

              <ResponsiveContainer maxHeight="85%">
                <LineChart
                  data={historyData}
                  margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#cecece" />
                  <XAxis dataKey="parameter" stroke="#cecece" />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="value"
                    name="Número Solicitações de Atendimentos"
                    stroke={light.colors.primary}
                    strokeWidth={5}
                    dot={{ r: 5 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </HistoryAttendanceContainer>
          </TilesLine>

          <TilesLine>
            <BarChartBox>
              <BoxHeader>
                <ChartTitle>Orçamentos</ChartTitle>
                <MdReceipt size={20} />
              </BoxHeader>
              <ResponsiveContainer maxHeight="85%">
                <BarChart data={orcamento}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <Bar dataKey="value" name="Valor" label={{ position: 'top' }}>
                    <Cell key={orcamento[0].name} fill={COLORS[0]} />
                    <Cell key={orcamento[1].name} fill={COLORS[1]} />
                    <Cell key={orcamento[2].name} fill={COLORS[2]} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </BarChartBox>

            <BarChartBox>
              <BoxHeader>
                <ChartTitle>Vendas</ChartTitle>
                <MdShoppingCart size={20} />
              </BoxHeader>
              <ResponsiveContainer maxHeight="85%">
                <BarChart data={orcamento}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <Bar dataKey="value" name="Valor" label={{ position: 'top' }}>
                    <Cell key={orcamento[0].name} fill={COLORS[0]} />
                    <Cell key={orcamento[1].name} fill={COLORS[1]} />
                    <Cell key={orcamento[2].name} fill={COLORS[2]} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </BarChartBox>

            <BarChartBox>
              <BoxHeader>
                <ChartTitle>Cobranças</ChartTitle>
                <MdDescription size={20} />
              </BoxHeader>
              <ResponsiveContainer maxHeight="85%">
                <BarChart data={orcamento}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <Bar dataKey="value" name="Valor" label={{ position: 'top' }}>
                    <Cell key={orcamento[0].name} fill={COLORS[0]} />
                    <Cell key={orcamento[1].name} fill={COLORS[1]} />
                    <Cell key={orcamento[2].name} fill={COLORS[2]} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </BarChartBox>

            <BarChartBox>
              <BoxHeader>
                <ChartTitle>Qualidade</ChartTitle>
                <MdFeedback size={20} />
              </BoxHeader>
              <ResponsiveContainer maxHeight="85%">
                <BarChart data={orcamento}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <Bar dataKey="value" name="Valor" label={{ position: 'top' }}>
                    <Cell key={orcamento[0].name} fill={COLORS[0]} />
                    <Cell key={orcamento[1].name} fill={COLORS[1]} />
                    <Cell key={orcamento[2].name} fill={COLORS[2]} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </BarChartBox>

            <BarChartBox>
              <BoxHeader>
                <ChartTitle>Técnicos</ChartTitle>
                <MdBuild size={20} />
              </BoxHeader>
              <ResponsiveContainer maxHeight="85%">
                <BarChart data={orcamento}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <Bar dataKey="value" name="Valor" label={{ position: 'top' }}>
                    <Cell key={orcamento[0].name} fill={COLORS[0]} />
                    <Cell key={orcamento[1].name} fill={COLORS[1]} />
                    <Cell key={orcamento[2].name} fill={COLORS[2]} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </BarChartBox>
          </TilesLine>
        </Content>
      )}
    </Container>
  );
};

export default AttendanceRequestsList;
