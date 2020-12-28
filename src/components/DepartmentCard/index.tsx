import React from 'react';

import { MdClose } from 'react-icons/md';

import { Container, RemoveButton, Title } from './styles';

interface IDepartmentCardProps {
  title: string;
  handleRemove(): void;
  containerCustomStyle?: React.CSSProperties;
}

const DepartmentCard: React.FC<IDepartmentCardProps> = ({
  title,
  handleRemove,
  containerCustomStyle,
}) => (
  <Container style={containerCustomStyle}>
    <RemoveButton type="button" onClick={handleRemove}>
      <MdClose />
    </RemoveButton>
    <Title>{title}</Title>
  </Container>
);

export default DepartmentCard;
