import React from 'react';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';

import { Container, ButtonPaginate } from './styles';
import light from '../../styles/themes/light';

interface IPaginationProps {
  showNext: boolean;
  showPrev: boolean;
  handleNext(): void;
  handlePrev(): void;
}

const Pagination: React.FC<IPaginationProps> = ({
  showNext,
  showPrev,
  handleNext,
  handlePrev,
}) => (
  <Container>
    {showPrev && (
      <ButtonPaginate
        type="button"
        color={light.colors.success}
        onClick={handlePrev}
      >
        <FiArrowLeft />
      </ButtonPaginate>
    )}

    {showNext && (
      <ButtonPaginate
        type="button"
        color={light.colors.success}
        onClick={handleNext}
      >
        <FiArrowRight />
      </ButtonPaginate>
    )}
  </Container>
);

export default Pagination;
