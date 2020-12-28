import React, { useMemo, useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { MdArrowBack } from 'react-icons/md';

import light from '../../../../styles/themes/light';
import HighlightTitle from '../../../../components/HighlightTitle';
import translatedContent from './translatedcontent';
import { useTranslation } from '../../../../hooks/translation';

import npsNpsf from './ReferenceTableColumns/npsNpsf';
import nptNptf from './ReferenceTableColumns/nptNptf';
import thickMetricThread from './ReferenceTableColumns/thickMetricThread';
import thickUnifiedThread from './ReferenceTableColumns/thickUnifiedThread';
import thickWhitworthThread from './ReferenceTableColumns/thickWhitworthThread';
import thinMetricThread from './ReferenceTableColumns/thinMetricThread';
import thinUnifiedThread from './ReferenceTableColumns/thinUnifiedThread';
import whitWorthThreadPipe from './ReferenceTableColumns/whitworthThreadPipe';

import {
  Container,
  Header,
  Content,
  BackButton,
  OptionSelect,
  InputLabel,
  TableHeaderContainer,
  HeaderColumn,
  TableHeaderTitle,
  TableHeaderLine,
  TableContent,
  TableLineContainer,
  DataLine,
  TableLineCell,
} from './styles';

const ThreadedHoleCalculator: React.FC = () => {
  const [dataSelect, setDataSelect] = useState(thickMetricThread);

  const history = useHistory();
  const { translation } = useTranslation();

  const translated = useMemo(() => {
    return translation === 'en-us'
      ? translatedContent.en_US
      : translatedContent.pt_BR;
  }, [translation]);

  const handleSelected = useCallback((picked: string) => {
    if (picked === 'thin_metric_thread') {
      setDataSelect(thinMetricThread);
    } else if (picked === 'thick_unified_thread') {
      setDataSelect(thickUnifiedThread);
    } else if (picked === 'thin_unified_thread') {
      setDataSelect(thinUnifiedThread);
    } else if (picked === 'thick_whitworth_thread') {
      setDataSelect(thickWhitworthThread);
    } else if (picked === 'whitworth_thread_for_Pipe') {
      setDataSelect(whitWorthThreadPipe);
    } else if (picked === 'npt_nptf') {
      setDataSelect(nptNptf);
    } else if (picked === 'nps_npsf') {
      setDataSelect(npsNpsf);
    } else {
      setDataSelect(thickMetricThread);
    }
  }, []);

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
        <InputLabel>{translated.select_title}</InputLabel>
        <OptionSelect onChange={e => handleSelected(e.target.value)}>
          {threadType.map(option => (
            <option key={option.key} value={option.key}>
              {option.label}
            </option>
          ))}
        </OptionSelect>

        <TableHeaderContainer>
          {dataSelect.header.map((item, index) => (
            <HeaderColumn
              key={String(index)}
              style={{ width: `${100 / dataSelect.header.length}%` }}
            >
              <TableHeaderTitle>{item}</TableHeaderTitle>
              {index < dataSelect.header.length - 1 && <TableHeaderLine />}
            </HeaderColumn>
          ))}
        </TableHeaderContainer>

        <TableContent>
          {dataSelect.data.map((item, index) => (
            <TableLineContainer key={String(index)}>
              {item.map((subItem, subIndex) => (
                <DataLine
                  style={{ width: `${100 / dataSelect.header.length}%` }}
                >
                  <TableLineCell>{subItem}</TableLineCell>
                  {subIndex < dataSelect.header.length - 1 && (
                    <TableHeaderLine />
                  )}
                </DataLine>
              ))}
            </TableLineContainer>
          ))}
        </TableContent>
      </Content>
    </Container>
  );
};

export default ThreadedHoleCalculator;
