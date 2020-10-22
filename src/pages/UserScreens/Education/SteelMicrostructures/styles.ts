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
  justify-content: space-between;

  margin-top: 15px;
  padding: 0 25px;
`;

export const UserContainer = styled.div``;

export const Content = styled.main`
  width: 100%;
  margin-top: 45px;
  padding: 20px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const BackButton = styled(Button)`
  font-size: 22px;
  width: 50px;
  height: 40px;
`;

export const OptionsContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const OptionBox = styled.button`
  width: 250px;
  height: 70px;
  border-radius: 5px;
  background-color: ${props => props.theme.colors.primary};

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 10px;

  cursor: pointer;
  transition: opacity 0.3s;

  &:hover {
    opacity: 0.8;
  }
`;

export const OptionImage = styled.img`
  width: 50px;
`;

export const OptionTitle = styled.span`
  color: ${props => props.theme.colors.white};
  margin-left: 10px;
`;

export const Title = styled.h3`
  color: ${props => props.theme.colors.primary};

  &:after {
    content: '';
    display: block;
    width: 30px;

    margin-top: 1px;
    border-bottom: 7px solid ${props => props.theme.colors.primary};
  }
`;

export const DescriptionContent = styled.div`
  width: 100%;
  margin-top: 50px;
`;

export const Description = styled.p`
  margin-top: 20px;
  text-align: justify;
`;
