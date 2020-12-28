import styled from 'styled-components';

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
  justify-content: space-between;

  margin-top: 15px;
`;

export const Content = styled.main`
  flex: 1;
  margin-top: 70px;

  display: flex;

  flex-direction: column;
  justify-content: center;
  align-items: center;

  padding: 10px;
`;

export const MenuContainer = styled.nav`
  margin-top: 40px;

  display: flex;
  justify-content: center;
  flex-wrap: wrap;
`;

export const ButtonBack = styled.button`
  height: 45px;
  width: 55px;
  border-radius: 5px;
  margin-right: 20px;

  display: flex;
  justify-content: center;
  align-items: center;

  background-color: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.white};

  transition: opacity 0.3s;

  &:hover {
    opacity: 0.8;
  }
`;

export const Title = styled.h2`
  color: ${props => props.theme.colors.primary};
  margin-left: 20px;

  &:after {
    content: '';
    display: block;
    width: 70px;

    margin-top: 1px;
    border-bottom: 7px solid ${props => props.theme.colors.primary};
  }
`;

export const ContentHeader = styled.header`
  width: 100%;

  display: flex;
  justify-content: space-between;
`;

export const CheckListInfo = styled.div``;

export const CheckListLabel = styled.span`
  font-size: 14px;
  color: ${props => props.theme.colors.tertiary};
`;

export const CheckListTitle = styled.h2`
  text-transform: uppercase;
`;

export const PdfDownloadButton = styled.a`
  height: 45px;
  padding: 0 7px;
  border-radius: 5px;
  margin-right: 10px;

  display: flex;
  justify-content: center;
  align-items: center;

  background-color: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.white};
  text-decoration: none;

  transition: opacity 0.3s;

  &:hover {
    opacity: 0.8;
  }

  > svg {
    margin-right: 5px;
  }
`;

export const StepsContainer = styled.div`
  margin-top: 20px;
  width: 100%;

  display: flex;
  flex-direction: column;
`;

export const Step = styled.div`
  width: 100%;
  margin: 10px 0;
  margin-right: 10px;
  border-radius: 5px;
  padding: 10px;

  display: flex;
  align-items: center;

  background: ${props => props.theme.colors.secondary};
`;

export const StepNumber = styled.span`
  width: 50px;
  height: 50px;
  border-radius: 25px;

  font-size: 18px;
  font-weight: bold;
  background-color: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.white};

  display: flex;
  align-items: center;
  justify-content: center;

  margin-right: 10px;
`;

export const StepDescription = styled.p`
  text-align: justify;
`;
