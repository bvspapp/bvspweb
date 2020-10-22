import React, { useCallback, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { MdArrowBack } from 'react-icons/md';

import light from '../../../../styles/themes/light';

import HighlightTitle from '../../../../components/HighlightTitle';

import austeniticImg from '../../../../assets/austenitic.png';
import ferriteImg from '../../../../assets/ferrite.png';
import martensiticImg from '../../../../assets/martensitic.png';
import duplexImg from '../../../../assets/duplex.png';

import translatedContent from './translatedcontent';
import { useTranslation } from '../../../../hooks/translation';

import {
  Container,
  Header,
  Content,
  BackButton,
  OptionsContainer,
  OptionBox,
  OptionImage,
  OptionTitle,
  Title,
  Description,
  DescriptionContent,
} from './styles';

interface IData {
  [key: string]: {
    title: string;
    description: string;
  };
}

const SteelMicrostructures: React.FC = () => {
  const [infoSelected, setInfoSelected] = useState('austenitic');

  const history = useHistory();
  const { translation } = useTranslation();

  const translated = useMemo(() => {
    return translation === 'en-us'
      ? translatedContent.en_US
      : translatedContent.pt_BR;
  }, [translation]);

  const dataFormatted = useMemo(() => {
    return {
      austenitic: translated.austenitic,
      ferrite: translated.ferrite,
      martensitic: translated.martensitic,
      duplex: translated.duplex,
    } as IData;
  }, [translated]);

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
        <OptionsContainer>
          <OptionBox onClick={() => setInfoSelected('austenitic')}>
            <OptionImage src={austeniticImg} />
            <OptionTitle>{translated.austenitic_button}</OptionTitle>
          </OptionBox>

          <OptionBox onClick={() => setInfoSelected('ferrite')}>
            <OptionImage src={ferriteImg} />
            <OptionTitle>{translated.ferrite_button}</OptionTitle>
          </OptionBox>

          <OptionBox onClick={() => setInfoSelected('martensitic')}>
            <OptionImage src={martensiticImg} />
            <OptionTitle>{translated.martensitic_button}</OptionTitle>
          </OptionBox>

          <OptionBox onClick={() => setInfoSelected('duplex')}>
            <OptionImage src={duplexImg} />
            <OptionTitle>{translated.duplex_button}</OptionTitle>
          </OptionBox>
        </OptionsContainer>

        <DescriptionContent>
          <Title>{dataFormatted[infoSelected].title}</Title>
          <Description>{dataFormatted[infoSelected].description}</Description>
        </DescriptionContent>
      </Content>
    </Container>
  );
};

export default SteelMicrostructures;
