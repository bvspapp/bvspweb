import React, { useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

import tsubakilogoImg from '../../../../../assets/tsubakilogo.png';

import neptuneImg from '../../../../../assets/neptune.png';
import superstainlessImg from '../../../../../assets/superstainless.png';
import lambdaImg from '../../../../../assets/lambda.png';
import titanImg from '../../../../../assets/titan.png';

import {
  Container,
  Header,
  Content,
  LogoImg,
  ButtonBack,
  Title,
  Description,
  LineInfo,
  OptionsContainer,
  Option,
  OptionImage,
  OptionLabel,
} from './styles';

import translatedContent from './translatedcontent';
import { useTranslation } from '../../../../../hooks/translation';

const TsubakiAbout: React.FC = () => {
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
        <LogoImg src={tsubakilogoImg} />
        <ButtonBack onClick={() => history.goBack()}>
          <FaArrowLeft />
        </ButtonBack>
      </Header>

      <Content>
        <LineInfo>
          <Title>{translated.about_title}</Title>
          <Description>{translated.about_description}</Description>
        </LineInfo>

        <LineInfo>
          <Title>{translated.options_title}</Title>
        </LineInfo>

        <OptionsContainer>
          <Option to="/neptunedetails">
            <OptionImage src={neptuneImg} />
            <OptionLabel>{translated.neptune_menu_label}</OptionLabel>
          </Option>
          <Option to="/superinoxdetails">
            <OptionImage src={superstainlessImg} />
            <OptionLabel>{translated.stainlesstm_menu_label}</OptionLabel>
          </Option>
          <Option to="/lambdadetails">
            <OptionImage src={lambdaImg} />
            <OptionLabel>{translated.lambda_menu_label}</OptionLabel>
          </Option>
          <Option to="">
            <OptionImage src={titanImg} />
            <OptionLabel>{translated.titantm_menu_label}</OptionLabel>
          </Option>
        </OptionsContainer>
      </Content>
    </Container>
  );
};

export default TsubakiAbout;
