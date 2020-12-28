import React, { useMemo, useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { MdArrowBack } from 'react-icons/md';

import light from '../../../../styles/themes/light';
import HighlightTitle from '../../../../components/HighlightTitle';
import MessageAlert from '../../../../utils/MessageAlert';
import translatedContent from './translatedcontent';
import { useTranslation } from '../../../../hooks/translation';

import axisColumn from './ReferenceTableColumns/axisColumn';
import axisColumnKeys from './ReferenceTableColumns/axisColumnKeys';

import holeColumn from './ReferenceTableColumns/holeColumn';
import holeColumnKeys from './ReferenceTableColumns/holeColumnKeys';
import mmColumn from './ReferenceTableColumns/mmColumn';

import {
  Container,
  Header,
  Content,
  BackButton,
  ToleranceTitle,
  ToleranceList,
  ToleranceButton,
  OptionSelect,
  InputsContainer,
  InputGroup,
  InputLabel,
  TextInput,
  ButtonVerify,
  ResultContainer,
  ResultLabel,
  CardResult,
  MillimeterLabel,
  Line,
} from './styles';

interface IData {
  [key: string]: {
    first: string;
    second: string;
  }[];
}

const ToleranceConverter: React.FC = () => {
  const [filterSelected, setFilterSelected] = useState('axis');
  const [tolerance, setTolerance] = useState<string>();
  const [diameter, setDiameter] = useState(0);

  const [firstValue, setFirstValue] = useState<string>();
  const [secondValue, setSecondValue] = useState<string>();

  const history = useHistory();
  const { translation } = useTranslation();

  const translated = useMemo(() => {
    return translation === 'en-us'
      ? translatedContent.en_US
      : translatedContent.pt_BR;
  }, [translation]);

  const toleranceOptions = useMemo(() => {
    return filterSelected === 'axis' ? axisColumnKeys : holeColumnKeys;
  }, [filterSelected]);

  const handleCalculate = useCallback(() => {
    if (!diameter || !tolerance) {
      MessageAlert(translated.message_fields_required, 'info');
    } else if (diameter > 250) {
      MessageAlert(translated.message_number_out_of_range, 'info');
    } else {
      let valueFound = '';

      mmColumn.forEach(item => {
        const values = item.split('-');

        if (
          diameter >= parseInt(values[0], 10) &&
          diameter <= parseInt(values[1], 10)
        ) {
          valueFound = item;
        }
      });

      const data: IData = filterSelected === 'axis' ? axisColumn : holeColumn;

      const valueIndex = mmColumn.indexOf(valueFound);

      if (valueFound && valueIndex) {
        const { first, second } = data[tolerance][valueIndex];
        setFirstValue(first);
        setSecondValue(second);
      }
    }
  }, [
    diameter,
    filterSelected,
    tolerance,
    translated.message_fields_required,
    translated.message_number_out_of_range,
  ]);

  return (
    <Container>
      <Header>
        <BackButton
          type="button"
          color={light.colors.primary}
          onClick={() => history.goBack()}
        >
          <MdArrowBack />
        </BackButton>
      </Header>

      <HighlightTitle title={translated.title} subtitle={translated.subtitle} />

      <Content>
        <ToleranceTitle>{translated.tolerance_type_label}</ToleranceTitle>
        <ToleranceList>
          {toleranceOptions.map(item => (
            <ToleranceButton
              key={item}
              onClick={() => setTolerance(item)}
              active={tolerance === item}
            >
              {item}
            </ToleranceButton>
          ))}
        </ToleranceList>

        <InputsContainer>
          <InputGroup>
            <InputLabel>{translated.diameter_label}</InputLabel>
            <TextInput
              type="number"
              onChange={e => setDiameter(Number(e.target.value))}
            />
          </InputGroup>

          <InputGroup>
            <InputLabel>{translated.tolerance_type_label}</InputLabel>
            <OptionSelect onChange={e => setFilterSelected(e.target.value)}>
              <option value="axis">{translated.select_label_axis}</option>
              <option value="hole">{translated.select_label_hole}</option>
            </OptionSelect>
          </InputGroup>

          <ButtonVerify type="button" onClick={handleCalculate}>
            {translated.verify_button_label}
          </ButtonVerify>
        </InputsContainer>

        <ResultContainer>
          <ResultLabel>{translated.resul_label}</ResultLabel>
          <CardResult>{firstValue}</CardResult>
          <Line />
          <CardResult>{secondValue}</CardResult>
          <MillimeterLabel>{translated.millimeters_label}</MillimeterLabel>
        </ResultContainer>
      </Content>
    </Container>
  );
};

export default ToleranceConverter;
