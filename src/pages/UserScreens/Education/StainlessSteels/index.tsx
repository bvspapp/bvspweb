import React, { useMemo } from 'react';
import { useHistory } from 'react-router-dom';

import { MdArrowBack, MdArrowForward } from 'react-icons/md';

import light from '../../../../styles/themes/light';

import steelImg from '../../../../assets/steel.png';
import chartImg from '../../../../assets/chart.png';

import HighlightTitle from '../../../../components/HighlightTitle';

import translatedContent from './translatedcontent';
import { useTranslation } from '../../../../hooks/translation';

import {
  Container,
  Header,
  Content,
  BackButton,
  ContentRow,
  Description,
  Image,
  Title,
  HistoryContainer,
  HistoryCard,
  HistoryYear,
  HistoryDescription,
  NextButton,
} from './styles';

const StainlessSteels: React.FC = () => {
  const history = useHistory();
  const { translation } = useTranslation();

  const translated = useMemo(() => {
    return translation === 'en-us'
      ? translatedContent.en_US
      : translatedContent.pt_BR;
  }, [translation]);

  return (
    <Container>
      <Header>
        <HighlightTitle title={translated.title} lineAlign="left" />
        <BackButton
          type="button"
          color={light.colors.primary}
          onClick={() => history.goBack()}
        >
          <MdArrowBack />
        </BackButton>
      </Header>

      <Content>
        <ContentRow>
          <Image src={steelImg} />
          <Description>{translated.description}</Description>
        </ContentRow>

        <ContentRow>
          <Title>{translated.chrome_element_title}</Title>
          <Image src={chartImg} />
        </ContentRow>

        <HistoryContainer>
          {translated.history.map(item => (
            <HistoryCard key={item.key}>
              <HistoryYear>{item.year}</HistoryYear>
              <HistoryDescription>{item.description}</HistoryDescription>
            </HistoryCard>
          ))}
        </HistoryContainer>

        <NextButton to="/steelmicrostructures">
          <MdArrowForward />
          {translated.steel_microstructures}
        </NextButton>
      </Content>
    </Container>
  );
};

export default StainlessSteels;
