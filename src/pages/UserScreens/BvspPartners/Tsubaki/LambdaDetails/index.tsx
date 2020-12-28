import React, { useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

import lambdaImg from '../../../../../assets/lambda.png';

import HighlightTitle from '../../../../../components/HighlightTitle';

import {
  Container,
  Header,
  Content,
  LogoImg,
  ButtonBack,
  Title,
  Description,
  LineInfo,
  ItemsContainer,
  Item,
  TitleSecondary,
} from './styles';

import translatedContent from './translatedcontent';
import { useTranslation } from '../../../../../hooks/translation';

const LambdaDetails: React.FC = () => {
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
        <LogoImg src={lambdaImg} />
        <ButtonBack onClick={() => history.goBack()}>
          <FaArrowLeft />
        </ButtonBack>
      </Header>

      <Content>
        <LineInfo>
          <HighlightTitle
            title={translated.title}
            subtitle={translated.subtitle}
            lineAlign="left"
          />

          <Description>{translated.description}</Description>
        </LineInfo>

        <LineInfo>
          <TitleSecondary>{translated.xceeder_title}</TitleSecondary>
          <Description>{translated.xceeder_description}</Description>
        </LineInfo>

        <LineInfo>
          <TitleSecondary>{translated.kf_serie_title}</TitleSecondary>
          <Description>{translated.kf_serie_description}</Description>
        </LineInfo>

        <Title>{translated.options_title}</Title>
        <ItemsContainer>
          {translated.options.map((item, index) => (
            <Item key={String(index)}>{item}</Item>
          ))}
        </ItemsContainer>
      </Content>
    </Container>
  );
};

export default LambdaDetails;
