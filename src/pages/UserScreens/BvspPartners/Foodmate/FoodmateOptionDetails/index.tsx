import React, { useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

import foodmatelogoImgImg from '../../../../../assets/foodmatelogo.png';
import ImageSliderPreview from '../../../../../components/ImageSliderPreview';

import {
  Container,
  Header,
  Content,
  LogoImg,
  ButtonBack,
  Title,
  Description,
  Detail,
  ImageContainer,
} from './styles';

import translatedContent from './translatedcontent';
import { useTranslation } from '../../../../../hooks/translation';

interface IRouteParams {
  match: {
    params: {
      option:
        | 'compact'
        | 'food_service'
        | 'flexible'
        | 'ultimate'
        | 'opti_ltd'
        | 'fm_650'
        | 'max_600'
        | 'maxima'
        | 'fm_750'
        | 'semi_automatic';
    };
  };
}

const FoodmateOptionDetails: React.FC<IRouteParams> = ({ match }) => {
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
        <ImageContainer>
          <ImageSliderPreview
            photos={[
              {
                original: translated.image,
                thumbnail: translated.image,
              },
            ]}
          />
        </ImageContainer>

        <Detail>
          <Title>{translated.title}</Title>
          <Description>{translated.description}</Description>
        </Detail>
      </Content>
    </Container>
  );
};

export default FoodmateOptionDetails;
