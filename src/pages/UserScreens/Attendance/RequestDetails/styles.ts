import styled from 'styled-components';
import Button from '../../../../components/Form/Button';

interface IStepItemProps {
  done: boolean;
}

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;

  flex-wrap: wrap;
  flex: 1;

  min-width: 850px;
`;

export const Content = styled.main`
  flex: 1;
  margin-top: 70px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const Header = styled.header`
  width: 100%;
  display: flex;
  justify-content: space-between;

  margin-top: 15px;
  padding: 0 25px;
`;

export const BackButton = styled(Button)`
  font-size: 22px;
  width: 50px;
  height: 40px;
`;

export const SubTitle = styled.h2`
  margin-bottom: 20px;
`;

export const Info = styled.span`
  font-size: 14px;
  color: ${props => props.theme.colors.tertiary};

  margin-top: -20px;
  margin-bottom: 20px;
`;

export const FormData = styled.div`
  width: 100%;
  padding: 20px;
`;

export const FormRow = styled.div`
  width: 100%;

  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Date = styled.div`
  display: flex;
  align-items: center;

  > strong {
    margin-right: 3px;
  }

  > svg {
    margin-right: 3px;
    font-size: 20px;
  }
`;

export const Hour = styled.div`
  display: flex;
  align-items: center;

  > strong {
    margin-right: 3px;
  }

  > svg {
    margin-right: 3px;
    font-size: 20px;
  }
`;

export const Contact = styled.div`
  display: flex;
  align-items: center;

  margin-top: 20px;

  > strong {
    margin-right: 3px;
  }

  > svg {
    margin-right: 3px;
    font-size: 20px;
  }
`;

export const RequestLabel = styled.p`
  font-size: 16px;
  margin-top: 70px;
  font-weight: bold;
`;

export const RequestField = styled.p`
  font-size: 16px;
  margin-top: 5px;

  padding: 30px 10px;
  border-radius: 5px;

  background-color: ${props => props.theme.colors.secondary};
`;

export const RequestStatus = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;

  margin-bottom: 30px;
`;

export const Steps = styled.div`
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: space-around;

  padding: 0 150px;
`;

export const StepItem = styled.div<IStepItemProps>`
  display: flex;
  flex-direction: column;
  align-items: center;

  > div {
    background-color: ${props =>
      props.done ? props.theme.colors.primary : props.theme.colors.secondary};
    width: 60px;
    height: 60px;
    border-radius: 30px;

    display: flex;
    align-items: center;
    justify-content: center;
    color: ${props => props.theme.colors.white};
    font-size: 24px;

    > svg {
      font-size: 24px;
    }
  }

  > span {
    min-width: 100px;
    text-align: center;
    font-size: 14px;
    margin-top: 3px;
    font-weight: bold;
    color: ${props =>
      props.done ? props.theme.colors.primary : props.theme.colors.secondary};
  }
`;

export const StepLine = styled.div`
  height: 1px;
  flex: 1;
  background-color: ${props => props.theme.colors.primary};

  margin: 0 5px 15px;
`;
