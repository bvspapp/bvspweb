import React from 'react';

import { IconBaseProps } from 'react-icons';
import { Container } from './styles';

interface IProps {
  title: string;
  icon: React.ComponentType<IconBaseProps>;
  active: boolean;
  handleClick(): void;
}

const AttendanceOptionBox: React.FC<IProps> = ({
  title,
  icon: Icon,
  active,
  handleClick,
}) => {
  return (
    <Container active={active} onClick={handleClick}>
      <Icon />
      <span>{title}</span>
    </Container>
  );
};

export default AttendanceOptionBox;
