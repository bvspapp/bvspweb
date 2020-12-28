import styled from 'styled-components';
import Button from '../../../components/Form/Button';

export const Container = styled.div``;

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;

  margin-bottom: 30px;
`;

export const Content = styled.div``;

export const Title = styled.h2``;

export const ButtonsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;

  > button {
    margin-left: 7px;
    height: 42px;
  }
`;

export const HistoryAttendanceContainer = styled.div`
  background-color: ${props => props.theme.colors.secondary};

  flex: 2;
  height: 350px;
  border-radius: 5px;
  padding: 0 15px;
`;

export const BoxHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;

  width: 100%;
  padding: 10px;
`;

export const ChartTitle = styled.h3``;

export const Controllers = styled.header`
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 7px;
`;

export const SearchButton = styled(Button)`
  height: 40px;
`;

export const BarChartBox = styled.div`
  background-color: ${props => props.theme.colors.secondary};

  flex: 1;

  height: 250px;
  border-radius: 5px;

  .recharts-cartesian-axis-tick-value {
    font-size: 10px;
  }

  .recharts-label {
    font-weight: bold;
  }
`;

export const TilesLine = styled.div`
  display: flex;

  width: 100%;
  margin: 10px 0;
  gap: 1rem;
`;

export const Dividir = styled.div`
  width: 1px;
  height: 45px;
  background-color: ${props => props.theme.colors.secondary};

  margin: 0 15px;
`;
