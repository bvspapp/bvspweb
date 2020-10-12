import React, { useEffect, useCallback, useState, useMemo } from 'react';
import { useHistory } from 'react-router-dom';

import { MdArrowBack } from 'react-icons/md';

import firebase from '../../../../config/firebase';
import light from '../../../../styles/themes/light';

import HighlightTitle from '../../../../components/HighlightTitle';
import Load from '../../../../components/Load';
import ImageSliderPreview from '../../../../components/ImageSliderPreview';
import MessageAlert from '../../../../utils/MessageAlert';

import translatedContent from './translatedcontent';
import { useTranslation } from '../../../../hooks/translation';

import {
  Container,
  Header,
  Content,
  BackButton,
  ServiceInfo,
  InfoLine,
  ServiceLabel,
  ServiceTitle,
  ServiceDescription,
  ServiceInfoContainer,
  ImageContainer,
} from './styles';

interface IBvspServiceData {
  description: string;
  description_insensitive: string;
  description_english: string;
  description_insensitive_english: string;
  descriptionFormatted: string;
  about: string;
  about_english: string;
  aboutFormatted: string;
  photos: IImageStoraged[];
  photocover: IImageStoraged;
  order?: number;
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

const BvspServicesDetails: React.FC<IRouteParams> = ({ match }) => {
  const [loading, setLoading] = useState(true);
  const [detail, setDatail] = useState<IBvspServiceData>(
    {} as IBvspServiceData,
  );

  const history = useHistory();
  const { translation } = useTranslation();

  const translated = useMemo(() => {
    return translation === 'en-us'
      ? translatedContent.en_US
      : translatedContent.pt_BR;
  }, [translation]);

  const { id: bvspServiceId } = match.params;

  const handleFetchSpecialSolutionData = useCallback(async () => {
    await firebase
      .firestore()
      .collection('services')
      .doc(bvspServiceId)
      .get()
      .then(snapshot => {
        const data = snapshot.data() as IBvspServiceData;

        data.descriptionFormatted =
          translation === 'en-us' ? data.description_english : data.description;

        data.aboutFormatted =
          translation === 'en-us' ? data.about_english : data.about;

        setDatail(data);
      })
      .catch(() => MessageAlert(translated.error_load_data, 'error'))
      .finally(() => setLoading(false));
  }, [bvspServiceId, translated, translation]);

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
        <ServiceInfoContainer>
          <ImageContainer>
            <ImageSliderPreview photos={photosFormatted.photos} />
          </ImageContainer>

          <ServiceInfo>
            <InfoLine>
              <ServiceLabel>
                {translated.details_description_label}
              </ServiceLabel>
              <ServiceTitle>{detail.descriptionFormatted}</ServiceTitle>
            </InfoLine>

            <InfoLine>
              <ServiceLabel>{translated.details_about_label}</ServiceLabel>
              <ServiceDescription>{detail.aboutFormatted}</ServiceDescription>
            </InfoLine>
          </ServiceInfo>
        </ServiceInfoContainer>
      )}
      <Content />
    </Container>
  );
};

export default BvspServicesDetails;
