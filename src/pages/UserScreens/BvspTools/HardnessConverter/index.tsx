import React, { useMemo, useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { MdArrowBack } from 'react-icons/md';
import { MdAssignment } from 'react-icons/md';

import light from '../../../../styles/themes/light';
import HighlightTitle from '../../../../components/HighlightTitle';

import translatedContent from './translatedcontent';
import { useTranslation } from '../../../../hooks/translation';

import hb from './ReferenceTableColumns/hb';
import hrb from './ReferenceTableColumns/hrb';
import hrc from './ReferenceTableColumns/hrc';
import hv from './ReferenceTableColumns/hv';
import mm from './ReferenceTableColumns/mm';

import {
  Container,
  Header,
  Content,
  BackButton,
  Form,
  InputBox,
  InputHeader,
  Input,
  ButtonCalc,
  Footer,
  ReferenceButton,
  Result,
  ReferenceLabel,
} from './styles';

const HardnessConverter: React.FC = () => {
  const history = useHistory();
  const { translation } = useTranslation();

  const translated = useMemo(() => {
    return translation === 'en-us'
      ? translatedContent.en_US
      : translatedContent.pt_BR;
  }, [translation]);

  const [brinell, setBrinell] = useState(0);
  const [rockwellC, setRockwellC] = useState(0);
  const [rockwellB, setRockwellB] = useState(0);
  const [vickers, setVickers] = useState(0);
  const [resultMM, setResultMM] = useState(0);

  const [indiceResult, setIndiceResult] = useState(-1);
  const [lastFieldSearch, setLastFieldSearch] = useState('');

  const ClosestValue = useCallback((array, value) => {
    const result = array.reduce((prev: number, curr: number) =>
      Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev,
    );

    return result;
  }, []);

  const handleCalculate = useCallback(() => {
    if (indiceResult < 0) {
      setBrinell(0);
      setRockwellC(0);
      setRockwellB(0);
      setVickers(0);
      setResultMM(0);
    } else {
      switch (lastFieldSearch) {
        case 'brinell':
          setRockwellC(hrc[indiceResult]);
          setRockwellB(hrb[indiceResult]);
          setVickers(hv[indiceResult]);
          setResultMM(mm[indiceResult]);
          break;
        case 'rockwellC':
          setBrinell(hb[indiceResult]);
          setRockwellB(hrb[indiceResult]);
          setVickers(hv[indiceResult]);
          setResultMM(mm[indiceResult]);
          break;
        case 'rockwellB':
          setBrinell(hb[indiceResult]);
          setRockwellC(hrc[indiceResult]);
          setVickers(hv[indiceResult]);
          setResultMM(mm[indiceResult]);
          break;
        case 'vickers':
          setBrinell(hb[indiceResult]);
          setRockwellC(hrc[indiceResult]);
          setRockwellB(hrb[indiceResult]);
          setResultMM(mm[indiceResult]);
          break;
        default:
          setBrinell(hb[indiceResult]);
          setRockwellC(hrc[indiceResult]);
          setRockwellB(hrb[indiceResult]);
          setVickers(hv[indiceResult]);
          setResultMM(mm[indiceResult]);
          break;
      }
    }
  }, [indiceResult, lastFieldSearch]);

  const handleInputChange = useCallback(
    (value, inputType) => {
      let indexValue = 0;
      let nearestValue;

      switch (inputType) {
        case 'brinell':
          setBrinell(value);
          nearestValue = ClosestValue(hb, value);
          indexValue = hb.indexOf(nearestValue);
          setLastFieldSearch('brinell');
          break;
        case 'rockwellC':
          setRockwellC(value);
          nearestValue = ClosestValue(hrc, value);
          indexValue = hrc.indexOf(nearestValue);
          setLastFieldSearch('rockwellC');
          break;
        case 'rockwellB':
          setRockwellB(value);
          nearestValue = ClosestValue(hrb, value);
          indexValue = hrb.indexOf(nearestValue);
          setLastFieldSearch('rockwellB');
          break;
        case 'vickers':
          setVickers(value);
          nearestValue = ClosestValue(hv, value);
          indexValue = hv.indexOf(nearestValue);
          setLastFieldSearch('vickers');
          break;
        default:
          setBrinell(0);
          setRockwellC(0);
          setRockwellB(0);
          setVickers(0);
          setResultMM(0);
          break;
      }

      setIndiceResult(indexValue);
    },
    [ClosestValue],
  );

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
        <Form>
          <InputBox>
            <InputHeader>Brinell Hardness HB</InputHeader>
            <Input
              name="name"
              type="number"
              onChange={e => handleInputChange(e.target.value, 'brinell')}
              value={brinell}
            />
          </InputBox>

          <InputBox>
            <InputHeader>Rockwell C - HRC</InputHeader>
            <Input
              name="name"
              type="number"
              onChange={e => handleInputChange(e.target.value, 'rockwellC')}
              value={rockwellC}
            />
          </InputBox>

          <InputBox>
            <InputHeader>Rockwell B - HRB</InputHeader>
            <Input
              name="name"
              type="number"
              onChange={e => handleInputChange(e.target.value, 'rockwellB')}
              value={rockwellB}
            />
          </InputBox>

          <InputBox>
            <InputHeader>Vickers - HV</InputHeader>
            <Input
              name="name"
              type="number"
              onChange={e => handleInputChange(e.target.value, 'vickers')}
              value={vickers}
            />
          </InputBox>
        </Form>
        <ButtonCalc onClick={handleCalculate}>
          {translated.button_calc_label}
        </ButtonCalc>

        <Footer>
          <ReferenceButton
            href="https://firebasestorage.googleapis.com/v0/b/bvspapp-ab6d1.appspot.com/o/steel_hardness_conversion_table.pdf?alt=media&token=b35f5adc-a08b-4871-80fa-a5f688fb2b95"
            target="_blank"
          >
            <MdAssignment />
            <ReferenceLabel>{translated.button_table_label}</ReferenceLabel>
          </ReferenceButton>
          <Result>
            <h2>{resultMM}</h2>
            <span>N/mm²</span>
          </Result>
        </Footer>
      </Content>
    </Container>
  );
};

export default HardnessConverter;
