import React from 'react';

import { Container, Title, RemoveButton } from './styles';

interface IMachineCardProps {
  title: string;
  handleRemove(): void;
}

const MachineCard: React.FC<IMachineCardProps> = ({ title, handleRemove }) => (
  <Container>
    <Title>{title}</Title>
    <RemoveButton onClick={handleRemove}>Excluír</RemoveButton>
  </Container>
);

export default MachineCard;
