import styled from 'styled-components';
import { Link } from 'react-router-dom';

interface IImagePreviewProps {
  imageURL: string;
}

export const Container = styled(Link)`
  width: 170px;
  border-radius: 5px;
  overflow: hidden;

  text-decoration: none;

  border: 2px solid ${props => props.theme.colors.secondary};

  margin: 10px;

  transition: transform 0.3s;

  &:hover {
    transform: scale(1.1);
  }
`;

export const ImagePreview = styled.div<IImagePreviewProps>`
  width: 170px;
  height: 130px;
  overflow: hidden;

  background: url(${props => props.imageURL});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
`;

export const TitleContainer = styled.div`
  width: 170px;
  height: 50px;

  background-color: ${props => props.theme.colors.quartenary};

  border-top-style: solid;
  border-top-width: 5px;
  border-top-color: ${props => props.theme.colors.primary};

  display: flex;
  align-items: center;
  justify-content: center;
`;

export const TitleText = styled.span`
  font-size: 14px;
  text-align: center;
  padding: 0 7px;
  color: ${props => props.theme.colors.white};
`;
