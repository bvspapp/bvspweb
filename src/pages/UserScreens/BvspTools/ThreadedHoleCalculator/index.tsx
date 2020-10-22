import React, { useMemo, useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { MdArrowBack } from 'react-icons/md';

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
  InputGroupUnits,
  InputLabel,
} from './styles';

const ThreadedHoleCalculator: React.FC = () => {
  const [selected, setSelected] = useState('thick_metric_thread');

  const history = useHistory();
  const { translation } = useTranslation();

  const translated = useMemo(() => {
    return translation === 'en-us'
      ? translatedContent.en_US
      : translatedContent.pt_BR;
  }, [translation]);

  const threadType = useMemo(() => {
    return [
      {
        key: 'thick_metric_thread',
        label: translated.option_thick_metric_thread,
      },
      {
        key: 'thin_metric_thread',
        label: translated.option_thin_metric_thread,
      },
      {
        key: 'thick_unified_thread',
        label: translated.option_thick_unified_thread,
      },
      {
        key: 'thin_unified_thread',
        label: translated.option_thin_unified_thread,
      },
      {
        key: 'thick_whitworth_thread',
        label: translated.option_thick_whitworth_thread,
      },
      {
        key: 'whitworth_thread_for_Pipe',
        label: translated.option_whitworth_thread_for_Pipe,
      },
      {
        key: 'npt_nptf',
        label: translated.option_npt_nptf,
      },
      {
        key: 'nps_npsf',
        label: translated.option_nps_npsf,
      },
    ];
  }, [translated]);

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
            <InputLabel>Unidade</InputLabel>
            <OptionSelect onChange={e => setSelected(e.target.value)}>
              {threadType.map(option => (
                <option key={option.key} value={option.key}>
                  {option.label}
                </option>
              ))}
            </OptionSelect>
          </InputGroupUnits>
        </InputRows>
      </Content>
    </Container>
  );
};

export default ThreadedHoleCalculator;
