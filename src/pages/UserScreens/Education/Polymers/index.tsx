import React, { useMemo } from 'react';
import { useHistory } from 'react-router-dom';

import { MdArrowBack } from 'react-icons/md';

import light from '../../../../styles/themes/light';

import HighlightTitle from '../../../../components/HighlightTitle';

import industrialPlasticsImg from '../../../../assets/industrial_plastics.png';
import engineeringPlasticsImg from '../../../../assets/engineering_plastics.png';
import highPerformanceImg from '../../../../assets/high_performance.png';

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

const Polymers: React.FC = () => {
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
        <HighlightTitle title={translated.info_title} lineAlign="left" />
        <BackButton
          type="button"
          color={light.colors.primary}
          onClick={() => history.goBack()}
        >
          <MdArrowBack />
        </BackButton>
      </Header>

      <Content>
        <DescriptionContent>
          <Description>{translated.description_first_line}</Description>
        </DescriptionContent>

        <DescriptionContent>
          <Description>{translated.description_second_line}</Description>
        </DescriptionContent>

        <Title>{translated.type_title}</Title>

        <OptionsContainer>
          <OptionBox
            to={`/polymerdetails/${translated.industrial_plastics_button}`}
          >
            <OptionImage src={industrialPlasticsImg} />
            <OptionTitle>{translated.industrial_plastics_button}</OptionTitle>
          </OptionBox>

          <OptionBox
            to={`/polymerdetails/${translated.engineering_plastics_button}`}
          >
            <OptionImage src={engineeringPlasticsImg} />
            <OptionTitle>{translated.engineering_plastics_button}</OptionTitle>
          </OptionBox>

          <OptionBox
            to={`/polymerdetails/${translated.high_performance_plastics_button}`}
          >
            <OptionImage src={highPerformanceImg} />
            <OptionTitle>
              {translated.high_performance_plastics_button}
            </OptionTitle>
          </OptionBox>
        </OptionsContainer>
      </Content>
    </Container>
  );
};

export default Polymers;
