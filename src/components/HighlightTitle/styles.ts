import styled from 'styled-components';

interface IContainerProps {
  lineAlign?: 'center' | 'left';
}

export const Container = styled.div<IContainerProps>`
  text-align: center;

  &:after {
    content: '';
    display: block;
    width: 70px;

    margin: 3px ${props => (props.lineAlign === 'center' ? 'auto' : 0)};
    border-bottom: 12px solid ${props => props.theme.colors.primary};
  }
`;

export const Title = styled.h1`
  color: ${props => props.theme.colors.primary};
`;

export const SubTitle = styled.span`
  font-size: 14px;
  color: ${props => props.theme.colors.black};
`;
