import React from 'react';
import { MdRemoveCircleOutline, MdModeEdit } from 'react-icons/md';

import {
  Container,
  StepNumber,
  StepTitle,
  Controllers,
  ButtonEdit,
  ButtonRemove,
} from './styles';

interface IStepCardProps {
  step: number;
  title: string;
  handleRemoveStep(): void;
  handleEditStep(): void;
}

const StepCard: React.FC<IStepCardProps> = ({
  step,
  title,
  handleEditStep,
  handleRemoveStep,
}) => (
  <Container>
    <StepNumber>{step}</StepNumber>
    <StepTitle>{title}</StepTitle>
    <Controllers>
      <ButtonEdit
        type="button"
        title="Editar essa etapa"
        onClick={handleEditStep}
      >
        <MdModeEdit />
      </ButtonEdit>
      <ButtonRemove
        type="button"
        title="Remover essa etapa"
        onClick={handleRemoveStep}
      >
        <MdRemoveCircleOutline />
      </ButtonRemove>
    </Controllers>
  </Container>
);

export default StepCard;
