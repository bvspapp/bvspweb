import React, { useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

import titanImg from '../../../../../assets/titan.png';

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
} from './styles';

import translatedContent from './translatedcontent';
import { useTranslation } from '../../../../../hooks/translation';

const TitanDetails: React.FC = () => {
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
        <LogoImg src={titanImg} />
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

export default TitanDetails;
