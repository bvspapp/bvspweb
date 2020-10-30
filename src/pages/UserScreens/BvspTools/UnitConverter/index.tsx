import React, { useMemo, useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { power, force, pressure, temperature, length } from 'units-converter';
import { MdArrowBack, MdSwapHoriz } from 'react-icons/md';

import powerUnits from './units/powerUnits';
import forceUnits from './units/forceUnits';
import pressureUnits from './units/pressureUnits';
import temperatureUnits from './units/temperatureUnits';
import lengthUnits from './units/lengthUnits';

import light from '../../../../styles/themes/light';
import HighlightTitle from '../../../../components/HighlightTitle';
import translatedContent from './translatedcontent';
import { useTranslation } from '../../../../hooks/translation';

import {
  Container,
  Header,
  Content,
  BackButton,
  OptionSelect,
  InputRows,
  InverterButton,
  InputGroupUnits,
  InputLabel,
  InputConverter,
  CalcButton,
  InputGroupCalc,
  ResultContainer,
  ResultLabel,
  ResultValue,
} from './styles';

const UnitConverter: React.FC = () => {
  const [selectedConverter, setSelectedConverter] = useState('power');
  const [unitAt, setUnitAt] = useState('kW');
  const [unitFrom, setUnitFrom] = useState('W');
  const [valueAt, setValueAt] = useState(0);
  const [convertResult, setConvertResult] = useState('0');

  const history = useHistory();
  const { translation } = useTranslation();

  const translated = useMemo(() => {
    return translation === 'en-us'
      ? translatedContent.en_US
      : translatedContent.pt_BR;
  }, [translation]);

  const converterOptions = useMemo(() => {
    return [
      {
        key: 'power',
        label: translated.converter_option_power,
      },
      {
        key: 'force',
        label: translated.converter_option_force,
      },
      {
        key: 'pressure',
        label: translated.converter_option_pressure,
      },
      {
        key: 'temperature',
        label: translated.converter_option_temperature,
      },
      {
        key: 'length',
        label: translated.converter_option_length,
      },
    ];
  }, [translated]);

  const units = useMemo(() => {
    if (selectedConverter === 'force') {
      setUnitAt('N');
      setUnitFrom('kN');
      return forceUnits;
    }
    if (selectedConverter === 'pressure') {
      setUnitAt('Pa');
      setUnitFrom('kPa');
      return pressureUnits;
    }
    if (selectedConverter === 'temperature') {
      setUnitAt('C');
      setUnitFrom('K');
      return temperatureUnits;
    }
    if (selectedConverter === 'length') {
      setUnitAt('mm');
      setUnitFrom('in');
      return lengthUnits;
    }

    setUnitAt('kW');
    setUnitFrom('W');
    return powerUnits;
  }, [selectedConverter]);

  const handleInverseUnits = useCallback(() => {
    const at = unitAt;
    const from = unitFrom;

    setUnitAt(from);
    setUnitFrom(at);
  }, [unitAt, unitFrom]);

  const handleConverter = useCallback(() => {
    let result = 0;

    if (selectedConverter === 'force') {
      result = force(valueAt).from(unitAt).to(unitFrom).value;
    } else if (selectedConverter === 'power') {
      result = power(valueAt).from(unitAt).to(unitFrom).value;
    } else if (selectedConverter === 'pressure') {
      result = pressure(valueAt).from(unitAt).to(unitFrom).value;
    } else if (selectedConverter === 'temperature') {
      result = temperature(valueAt).from(unitAt).to(unitFrom).value;
    } else if (selectedConverter === 'length') {
      result = length(valueAt).from(unitAt).to(unitFrom).value;
    }

    setConvertResult(result.toFixed(2));
  }, [valueAt, unitAt, unitFrom, selectedConverter]);

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
        <InputRows>
          <InputGroupUnits>
            <InputLabel>{translated.label_unit}</InputLabel>
            <OptionSelect onChange={e => setSelectedConverter(e.target.value)}>
              {converterOptions.map(option => (
                <option key={option.key} value={option.key}>
                  {option.label}
                </option>
              ))}
            </OptionSelect>
          </InputGroupUnits>

          <InputGroupUnits>
            <InputLabel>{translated.label_from}</InputLabel>
            <OptionSelect
              onChange={e => setUnitAt(e.target.value)}
              value={unitAt}
            >
              {units.map(unit => (
                <option key={unit.key} value={unit.key}>
                  {unit.label}
                </option>
              ))}
            </OptionSelect>
          </InputGroupUnits>

          <InputGroupUnits>
            <InputLabel>{translated.label_to}</InputLabel>
            <OptionSelect
              onChange={e => setUnitFrom(e.target.value)}
              value={unitFrom}
            >
              {units.map(unit => (
                <option key={unit.key} value={unit.key}>
                  {unit.label}
                </option>
              ))}
            </OptionSelect>
          </InputGroupUnits>
          <InverterButton type="button" onClick={handleInverseUnits}>
            <MdSwapHoriz />
            {translated.reverse_button_text}
          </InverterButton>
        </InputRows>

        <InputRows>
          <InputGroupCalc>
            <InputLabel>{translated.converter_value_label}</InputLabel>
            <InputConverter
              type="number"
              onChange={e => setValueAt(Number(e.target.value))}
            />
          </InputGroupCalc>
          <CalcButton type="button" onClick={handleConverter}>
            {translated.button_conveter}
          </CalcButton>
        </InputRows>

        <ResultContainer>
          <ResultLabel>{translated.convert_result_label}</ResultLabel>
          <ResultValue>{convertResult}</ResultValue>
        </ResultContainer>
      </Content>
    </Container>
  );
};

export default UnitConverter;
