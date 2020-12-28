import React, { useEffect, useCallback, useState, useMemo } from 'react';
import { useHistory } from 'react-router-dom';

import { MdArrowBack } from 'react-icons/md';

import firebase from '../../../../config/firebase';
import light from '../../../../styles/themes/light';

import HighlightTitle from '../../../../components/HighlightTitle';
import MessageAlert from '../../../../utils/MessageAlert';
import Load from '../../../../components/Load';
import ImageSliderPreview from '../../../../components/ImageSliderPreview';

import translatedContent from './translatedcontent';
import { useTranslation } from '../../../../hooks/translation';

import {
  Container,
  Header,
  Content,
  BackButton,
  ProductInfo,
  InfoLine,
  ProductLabel,
  ProductTitle,
  ProductDescription,
  ProductInfoContainer,
  ImageContainer,
} from './styles';

interface ISpecialSolutionData {
  bvspcode: string;
  description: string;
  description_english: string;
  descriptionFormatted: string;
  about: string;
  about_english: string;
  aboutFormatted: string;
  photos: IImageStoraged[];
  photocover: IImageStoraged;
}

interface IImageStoraged {
  url: string;
  name: string;
}

interface IRouteParams {
  match: {
    params: {
      id: string;
    };
  };
}

const SpecialSolutionDetails: React.FC<IRouteParams> = ({ match }) => {
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState<ISpecialSolutionData>(
    {} as ISpecialSolutionData,
  );

  const history = useHistory();
  const { translation } = useTranslation();

  const translated = useMemo(() => {
    return translation === 'en-us'
      ? translatedContent.en_US
      : translatedContent.pt_BR;
  }, [translation]);

  const { id: specialSolutionId } = match.params;

  const handleFetchSpecialSolutionData = useCallback(async () => {
    await firebase
      .firestore()
      .collection('special-solutions')
      .doc(specialSolutionId)
      .get()
      .then(snapshot => {
        const data = snapshot.data() as ISpecialSolutionData;

        data.descriptionFormatted =
          translation === 'en-us' ? data.description_english : data.description;

        data.aboutFormatted =
          translation === 'en-us' ? data.about_english : data.about;

        setDetail(data);
      })
      .catch(() => MessageAlert(translated.error_load_data, 'error'))
      .finally(() => setLoading(false));
  }, [specialSolutionId, translated, translation]);

  const photosFormatted = useMemo(() => {
    const formatted = !detail.photos
      ? {
          photos: [
            {
              original: '',
              thumbnail: '',
            },
          ],
        }
      : {
          photos: detail.photos.map(photo => {
            return {
              original: photo.url,
              thumbnail: photo.url,
            };
          }),
        };

    return formatted;
  }, [detail]);

  useEffect(() => {
    handleFetchSpecialSolutionData();
  }, [handleFetchSpecialSolutionData]);

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

      {loading ? (
        <Load />
      ) : (
        <ProductInfoContainer>
          <ImageContainer>
            <ImageSliderPreview photos={photosFormatted.photos} />
          </ImageContainer>

          <ProductInfo>
            <InfoLine>
              <ProductLabel>
                {translated.details_description_label}
              </ProductLabel>
              <ProductTitle>{detail.descriptionFormatted}</ProductTitle>
            </InfoLine>

            <InfoLine>
              <ProductLabel>{translated.details_about_label}</ProductLabel>
              <ProductDescription>{detail.aboutFormatted}</ProductDescription>
            </InfoLine>

            <InfoLine>
              <ProductLabel>{translated.details_bvspcode_label}</ProductLabel>
              <ProductDescription>{detail.bvspcode}</ProductDescription>
            </InfoLine>
          </ProductInfo>
        </ProductInfoContainer>
      )}
      <Content />
    </Container>
  );
};

export default SpecialSolutionDetails;
