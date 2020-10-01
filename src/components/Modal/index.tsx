import React from 'react';
import { Props } from 'react-modal';

import { Container } from './styles';

const Modal: React.FC<Props> = ({ isOpen, children, ...rest }) => (
  <Container
    style={{
      overlay: {
        background: 'rgba(0,0,0,.8)',
      },
    }}
    isOpen={isOpen}
    ariaHideApp={false}
    {...rest}
  >
    {children}
  </Container>
);

export default Modal;
