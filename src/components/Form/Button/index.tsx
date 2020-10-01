import React, { ButtonHTMLAttributes } from 'react';

import { Container } from './styles';

interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  color: string;
}

const Button: React.FC<IButtonProps> = ({ children, color, ...rest }) => (
  <Container color={color} {...rest}>
    {children}
  </Container>
);

export default Button;
