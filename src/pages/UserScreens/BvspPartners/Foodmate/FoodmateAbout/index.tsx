import React, { useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

import foodmatelogoImgImg from '../../../../../assets/foodmatelogo.png';
import ArrowMenu from '../../../../../components/ArrowMenu';

import {
  Container,
  Header,
  Content,
  LogoImg,
  ButtonBack,
  Title,
  Description,
  LineInfo,
  HistoryList,
  HistoryInfo,
  CardContainer,
  CardYear,
  CardDescription,
  MenuContainer,
} from './styles';

import translatedContent from './translatedcontent';
import { useTranslation } from '../../../../../hooks/translation';

const FoodmateAbout: React.FC = () => {
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
        <LogoImg src={foodmatelogoImgImg} />
        <ButtonBack onClick={() => history.goBack()}>
          <FaArrowLeft />
        </ButtonBack>
      </Header>

      <Content>
        <LineInfo>
          <Title>{translated.title}</Title>
          <Description>{translated.introduction}</Description>
        </LineInfo>

        <LineInfo>
          <Title>{translated.our_story_title}</Title>
        </LineInfo>

        <HistoryList>
          {translated.history.map(item => (
            <CardContainer key={item.key}>
              <CardYear>{item.year}</CardYear>
              <CardDescription>{item.description}</CardDescription>
            </CardContainer>
          ))}
        </HistoryList>

        <HistoryInfo>{translated.scroll_list_label}</HistoryInfo>

        <LineInfo>
          <Title>{translated.complete_solutions_subtitle}</Title>
          <Description>{translated.poultry_industry_description}</Description>
        </LineInfo>

        <LineInfo>
          <Title>{translated.title_options_menu}</Title>
          <MenuContainer>
            <ArrowMenu title={translated.cut_menu} to="" />
            <ArrowMenu title={translated.leg_breast_disposal_menu} to="" />
            <ArrowMenu title={translated.breast_disposal_menu} to="" />
          </MenuContainer>
        </LineInfo>
      </Content>
    </Container>
  );
};

export default FoodmateAbout;
