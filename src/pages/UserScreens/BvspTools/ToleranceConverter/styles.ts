import styled from 'styled-components';
import Button from '../../../../components/Form/Button';

interface ToleranceButtonProps {
  active: boolean;
}

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;

  flex-wrap: wrap;
  flex: 1;
`;

export const SaveButton = styled(Button)`
  width: 100%;

  margin-top: 30px;
  padding: 13px 10px;
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

  padding: 20px;
`;

export const BackButton = styled(Button)`
  font-size: 22px;
  width: 50px;
  height: 40px;
`;

export const ToleranceTitle = styled.span`
  color: ${props => props.theme.colors.black};
  margin-bottom: 5px;
`;

export const ToleranceList = styled.div`
  display: flex;
  flex-wrap: nowrap;
  overflow-x: scroll;

  padding-bottom: 7px;

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

export const ToleranceButton = styled.button<ToleranceButtonProps>`
  background-color: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.white};

  margin: 0 10px;
  padding: 5px 10px;
  border-radius: 3px;
  border: none;

  font-size: 18px;
  transform: opacity 0.3s;

  opacity: ${props => (props.active ? 1 : 0.5)};

  &:hover {
    opacity: 0.8;
  }
`;

export const OptionSelect = styled.select`
  width: 200px;
  font-size: 20px;
  padding: 12px;

  text-align: center;
  border: 1px solid ${props => props.theme.colors.tertiary};
  border-radius: 5px;
`;

export const InputsContainer = styled.form`
  display: flex;
  justify-content: space-between;

  margin: 30px 0 60px;
`;

export const InputGroup = styled.div``;

export const InputLabel = styled.div`
  color: ${props => props.theme.colors.black};
  margin-bottom: 5px;
`;

export const TextInput = styled.input`
  font-size: 20px;
  padding: 12px;
  font-weight: bold;

  text-align: center;
  border: 1px solid ${props => props.theme.colors.tertiary};
  border-radius: 5px;
`;

export const ButtonVerify = styled.button`
  background-color: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.white};
  font-size: 18px;
  padding: 15px 12px;

  width: 200px;
  border-radius: 5px;
  cursor: pointer;

  transition: opacity 0.3s;

  &:hover {
    opacity: 0.8;
  }
`;

export const ResultContainer = styled.div`
  width: 200px;
  margin: 0 auto;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const Line = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${props => props.theme.colors.tertiary};
  opacity: 0.5;
`;

export const ResultLabel = styled.span`
  font-size: 20px;
  font-weight: bold;
  color: ${props => props.theme.colors.black};

  margin-bottom: 10px;
`;

export const CardResult = styled.div`
  width: 200px;
  height: 70px;

  font-size: 34px;
  font-weight: bold;
  background-color: ${props => props.theme.colors.secondary};

  text-align: center;

  padding: 10px 0;

  border-radius: 5px;
`;

export const MillimeterLabel = styled.span`
  font-size: 14px;
  font-weight: bold;
  color: ${props => props.theme.colors.black};

  margin-top: 7px;
`;
