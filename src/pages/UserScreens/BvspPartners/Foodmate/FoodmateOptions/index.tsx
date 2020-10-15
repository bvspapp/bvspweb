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
  MenuContainer,
} from './styles';

import translatedContent from './translatedcontent';
import { useTranslation } from '../../../../../hooks/translation';

interface IRouteParams {
  match: {
    params: {
      option: 'cut' | 'leg_breast_disposal' | 'breast_disposal';
    };
  };
}

const FoodmateOptions: React.FC<IRouteParams> = ({ match }) => {
  const { translation } = useTranslation();
  const { option: optionRoute } = match.params;

  const history = useHistory();

  const translated = useMemo(() => {
    return translation === 'en-us'
      ? translatedContent.en_US[optionRoute]
      : translatedContent.pt_BR[optionRoute];
  }, [translation, optionRoute]);

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
          <Description>{translated.description}</Description>
        </LineInfo>

        <LineInfo>
          <Title>{translated.options_title}</Title>
        </LineInfo>

        <MenuContainer>
          {translated.options.map(({ label, option }) => (
            <ArrowMenu
              key={option}
              title={label}
              to={`/foodmatedetails/${option}`}
            />
          ))}
        </MenuContainer>
      </Content>
    </Container>
  );
};

export default FoodmateOptions;
