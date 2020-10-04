import React, { useEffect, useCallback, useState, useMemo } from 'react';
import { useHistory } from 'react-router-dom';

import { MdArrowBack } from 'react-icons/md';

import firebase from '../../../../config/firebase';
import light from '../../../../styles/themes/light';

import HighlightTitle from '../../../../components/HighlightTitle';
import MessageAlert from '../../../../utils/MessageAlert';
import Load from '../../../../components/Load';
import ImageSliderPreview from '../../../../components/ImageSliderPreview';

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
  about: string;
  about_english: string;
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
  const { id: specialSolutionId } = match.params;

  const handleFetchSpecialSolutionData = useCallback(async () => {
    await firebase
      .firestore()
      .collection('special-solutions')
      .doc(specialSolutionId)
      .get()
      .then(snapshot => {
        const data = snapshot.data() as ISpecialSolutionData;

        setDetail(data);
      })
      .catch(() => MessageAlert('Não foi possível carregar os dados!', 'error'))
      .finally(() => setLoading(false));
  }, [specialSolutionId]);

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
        <HighlightTitle title="Detalhes" lineAlign="left" />
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
              <ProductLabel>Nome</ProductLabel>
              <ProductTitle>{detail.description}</ProductTitle>
            </InfoLine>

            <InfoLine>
              <ProductLabel>Descrição</ProductLabel>
              <ProductDescription>{detail.about}</ProductDescription>
            </InfoLine>

            <InfoLine>
              <ProductLabel>Código BVSP</ProductLabel>
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
