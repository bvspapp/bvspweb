import styled from 'styled-components';

export const Container = styled.div``;

export const Header = styled.header`
  width: 100%;

  text-align: center;
`;

export const Title = styled.h2``;

export const SubTitle = styled.p`
  font-size: 14px;
`;

export const ButtonsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;

  margin: 30px 0;

  > button {
    margin-left: 7px;
  }
`;

export const DepartmentsCardContainer = styled.div`
  width: 100%;
  margin-top: 15px;

  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const DepartmentCard = styled.div`
  display: flex;
  align-items: center;

  height: 50px;
  width: 350px;

  margin: 10px 0;

  border-radius: 5px;

  background: ${props => props.theme.colors.secondary};

  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.theme.colors.primary};
    opacity: 0.7;
    cursor: grab;
  }
`;

export const DepartmentCardNumber = styled.span`
  display: flex;
  align-items: center;
  height: 50px;
  padding: 0 10px;
  font-weight: bold;
  background: #d92332;
  color: #fff;
  font-size: 18px;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
`;

export const DepartmentCardTitle = styled.span`
  margin-left: 7px;
  font-weight: bold;
`;
