import styled from 'styled-components';
import Modal from 'react-modal';

export const Container = styled(Modal)`
  background: ${props => props.theme.colors.white};

  padding: 30px;
  margin: 50px;

  border-radius: 10px;
`;
