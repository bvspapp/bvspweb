import styled from 'styled-components';
import Button from '../../../../components/Form/Button';

interface IImagePreviewProps {
  image: string;
}

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
  flex: 1;
  margin-top: 65px;

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

export const ServiceInfo = styled.div`
  border: 3px solid ${props => props.theme.colors.secondary};
  border-radius: 5px;

  padding: 20px;

  width: 57%;

  @media (max-width: 600px) {
    width: 100%;
  }
`;

export const InfoLine = styled.div`
  margin: 20px 0;
`;

export const ServiceLabel = styled.span`
  display: block;
  font-size: 14px;
  color: ${props => props.theme.colors.tertiary};
`;

export const ServiceTitle = styled.h1`
  font-size: 22px;
  text-transform: uppercase;
`;

export const ServiceDescription = styled.p`
  text-align: justify;
`;

export const ServiceInfoContainer = styled.div`
  display: flex;
  justify-content: space-between;

  padding: 20px;
  margin-top: 40px;

  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

export const ImageContainer = styled.div`
  width: 40%;
  min-height: 400px;

  display: flex;
  align-items: center;

  border: 3px solid ${props => props.theme.colors.secondary};
  border-radius: 5px;

  @media (max-width: 600px) {
    width: 100%;
  }
`;
