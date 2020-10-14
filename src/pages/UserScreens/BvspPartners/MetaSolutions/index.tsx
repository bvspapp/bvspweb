import React, { useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

import metalogoImg from '../../../../assets/metalogo.png';
import jbsImg from '../../../../assets/jbs.png';
import brfImg from '../../../../assets/brf.png';
import vibraImg from '../../../../assets/vibra.png';
import friatoImg from '../../../../assets/friato.png';
import markImg from '../../../../assets/mark.png';
import arascoImg from '../../../../assets/arasco.png';
import pilgrimsImg from '../../../../assets/pilgrims.png';
import taysonImg from '../../../../assets/tayson.png';
import waynefarmsImg from '../../../../assets/waynefarms.png';
import noelmaImg from '../../../../assets/noelma.png';
import coopavelImg from '../../../../assets/coopavel.png';
import cedalImg from '../../../../assets/cedal.png';
import adoroImg from '../../../../assets/adoro.png';
import pifpafImg from '../../../../assets/pifpaf.png';
import frangobelloImg from '../../../../assets/frangobello.png';

import {
  Container,
  Header,
  Content,
  LogoImg,
  ButtonBack,
  Title,
  Description,
  LineInfo,
  PatternsContainer,
  PatternImage,
  PatternsList,
  PatternsInfo,
  ButtonNews,
  ButtonsContainer,
} from './styles';

import translatedContent from './translatedcontent';
import { useTranslation } from '../../../../hooks/translation';

const MetaSolutions: React.FC = () => {
  const { translation } = useTranslation();

  const history = useHistory();

  const translated = useMemo(() => {
    return translation === 'en-us'
      ? translatedContent.en_US
      : translatedContent.pt_BR;
  }, [translation]);

  return (
    <Container>
      <Header>
        <LogoImg src={metalogoImg} />
        <ButtonBack onKeyPress={() => history.goBack()}>
          <FaArrowLeft />
        </ButtonBack>
      </Header>

      <Content>
        <LineInfo>
          <Title>{translated.company_title}</Title>
          <Description>{translated.company_description}</Description>
        </LineInfo>

        <LineInfo>
          <Title>{translated.our_clients_title}</Title>
        </LineInfo>

        <PatternsContainer>
          <PatternsList>
            <PatternImage src={jbsImg} />
            <PatternImage src={brfImg} />
            <PatternImage src={vibraImg} />
            <PatternImage src={friatoImg} />
            <PatternImage src={markImg} />
            <PatternImage src={arascoImg} />
            <PatternImage src={pilgrimsImg} />
            <PatternImage src={taysonImg} />
            <PatternImage src={waynefarmsImg} />
            <PatternImage src={noelmaImg} />
            <PatternImage src={coopavelImg} />
            <PatternImage src={cedalImg} />
            <PatternImage src={adoroImg} />
            <PatternImage src={pifpafImg} />
            <PatternImage src={frangobelloImg} />
          </PatternsList>
          <PatternsInfo>{translated.pattern_list_sublabel}</PatternsInfo>
        </PatternsContainer>

        <ButtonsContainer>
          <ButtonNews to="">
            {translated.tips_and_news_button}
            <FaArrowRight />
          </ButtonNews>
        </ButtonsContainer>
      </Content>
    </Container>
  );
};

export default MetaSolutions;
