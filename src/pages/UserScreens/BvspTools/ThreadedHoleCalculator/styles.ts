import styled from 'styled-components';
import Button from '../../../../components/Form/Button';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;

  flex-wrap: wrap;
  flex: 1;
`;

export const Header = styled.header`
  width: 100%;
  display: flex;
  justify-content: flex-end;

  margin: 15px 0 50px;
  padding: 0 25px;
`;

export const UserContainer = styled.div``;

export const Content = styled.main`
  width: 100%;

  display: flex;
  flex-direction: column;
  justify-content: space-around;

  padding: 0 20px;
`;

export const BackButton = styled(Button)`
  font-size: 22px;
  width: 50px;
  height: 40px;
`;

export const OptionSelect = styled.select`
  width: 100%;
  font-size: 20px;
  padding: 12px;

  text-align: center;
  border: 1px solid ${props => props.theme.colors.tertiary};
  border-radius: 5px;

  font-size: 20px;
  font-weight: bold;
`;

export const InputLabel = styled.span`
  margin-bottom: 3px;
  color: ${props => props.theme.colors.tertiary};
`;

export const TableHeaderContainer = styled.div`
  width: 100%;

  margin-top: 30px;
  margin-bottom: 5px;

  display: flex;
  justify-content: space-around;

  align-items: center;
  border-radius: 5px;

  background-color: ${props => props.theme.colors.primary};
`;

export const TableHeaderTitle = styled.span`
  color: ${props => props.theme.colors.white};

  padding: 14px 0;
  font-size: 14px;
  text-align: center;
  justify-content: center;
  align-items: center;
`;

export const TableHeaderLine = styled.div`
  height: 100%;
  width: 1px;
  background-color: ${props => props.theme.colors.white};
`;

export const HeaderColumn = styled.div`
  height: 100%;

  display: flex;
  justify-content: space-around;
  align-items: center;
`;

export const TableContent = styled.div`
  height: 49vh;
  overflow-y: scroll;

  background-color: ${props => props.theme.colors.white};
  border-radius: 7px;

  ::-webkit-scrollbar {
    width: 10px;
  }
  ::-webkit-scrollbar-thumb {
    background-color: #c9c9c9;
    border-radius: 10px;
  }
  ::-webkit-scrollbar-track {
    background-color: ${props => props.theme.colors.secondary};
  }
`;

export const TableLineContainer = styled.div`
  background-color: ${props => props.theme.colors.secondary};
  width: 100%;
  height: 50px;

  margin: 5px 0;
  border-radius: 7px;

  display: flex;
  justify-content: space-around;
  align-items: center;
`;

export const TableLineCell = styled.span`
  text-align: center;
  font-size: 16px;
`;

export const DataLine = styled.div`
  height: 50px;

  display: flex;
  align-items: center;
  justify-content: space-around;
`;
