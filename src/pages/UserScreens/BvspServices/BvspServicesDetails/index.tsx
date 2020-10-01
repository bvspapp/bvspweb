import React, { useEffect, useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { MdArrowBack } from 'react-icons/md';

import firebase from '../../../../config/firebase';
import light from '../../../../styles/themes/light';

import HighlightTitle from '../../../../components/HighlightTitle';
import Load from '../../../../components/Load';
import MessageAlert from '../../../../utils/MessageAlert';

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
  ImagePreview,
  ThumnailContainer,
  ThumnailButton,
} from './styles';

interface IBvspServiceData {
  description: string;
  description_insensitive: string;
  description_english: string;
  description_insensitive_english: string;
  about: string;
  about_english: string;
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
  const [photoSelected, setPhotoSelected] = useState('');

  const history = useHistory();
  const { id: bvspServiceId } = match.params;

  const handleFetchSpecialSolutionData = useCallback(async () => {
    await firebase
      .firestore()
      .collection('services')
      .doc(bvspServiceId)
      .get()
      .then(snapshot => {
        const data = snapshot.data() as IBvspServiceData;

        if (data.photocover.url) {
          setPhotoSelected(data.photocover.url);
        } else {
          setPhotoSelected(data.photos[0].url);
        }

        setDatail(data);
      })
      .catch(() => MessageAlert('Não foi possível carregar os dados!', 'error'))
      .finally(() => setLoading(false));
  }, [bvspServiceId]);

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
        <ServiceInfoContainer>
          <ImageContainer>
            <ImagePreview image={photoSelected} />
            <ThumnailContainer>
              {detail.photos.map(photo => (
                <ThumnailButton
                  key={photo.name}
                  image={photo.url}
                  onClick={() => setPhotoSelected(photo.url)}
                />
              ))}
            </ThumnailContainer>
          </ImageContainer>

          <ServiceInfo>
            <InfoLine>
              <ServiceLabel>Nome</ServiceLabel>
              <ServiceTitle>{detail.description}</ServiceTitle>
            </InfoLine>

            <InfoLine>
              <ServiceLabel>Descrição</ServiceLabel>
              <ServiceDescription>{detail.about}</ServiceDescription>
            </InfoLine>
          </ServiceInfo>
        </ServiceInfoContainer>
      )}
      <Content />
    </Container>
  );
};

export default BvspServicesDetails;
