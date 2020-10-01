import React, { useCallback, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { MdArrowBack } from 'react-icons/md';

import firebase from '../../../../config/firebase';
import light from '../../../../styles/themes/light';
import Load from '../../../../components/Load';

import HighlightTitle from '../../../../components/HighlightTitle';

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
  InfoColumn,
  DepartmentTagsContainer,
  DepartmentTags,
  ProductInfoContainer,
  ImageContainer,
  ImagePreview,
  ThumnailContainer,
  ThumnailButton,
} from './styles';

interface IBvspPartData {
  oemcode: string;
  bvspcode: string;
  description: string;
  description_english: string;
  photos: IImageStoraged[];
  photocover: IImageStoraged;
  family: string;
  departments: string[];
  machines: string[];
}

interface IImageStoraged {
  url: string;
  name: string;
}

interface IRouteParams {
  match: {
    params: {
      id: string;
      action: string;
    };
  };
}

interface IDepartmentData {
  id: string;
  description: string;
}

interface IFamilyData {
  id: string;
  description: string;
}

interface IData {
  part: IBvspPartData;
  departments: IDepartmentData[];
  family: IFamilyData;
}

const BvspPartsStDetails: React.FC<IRouteParams> = ({ match }) => {
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState<IData>({} as IData);
  const [photoSelected, setPhotoSelected] = useState('');

  const history = useHistory();
  const { id: bvspPartId } = match.params;

  const handleFetchBvspPartData = useCallback(async () => {
    const partResponse = await firebase
      .firestore()
      .collection('parts')
      .doc(bvspPartId)
      .get()
      .then(snapshot => {
        const part = snapshot.data() as IBvspPartData;

        if (part.photocover.url) {
          setPhotoSelected(part.photocover.url);
        } else {
          setPhotoSelected(part.photos[0].url);
        }

        return part;
      });

    const departmentResponse = await firebase
      .firestore()
      .collection('departments')
      .get()
      .then(snapshot => {
        const department = snapshot.docs
          .map(doc => {
            return {
              id: doc.id,
              description: String(doc.data().description),
            };
          })
          .filter(doc => partResponse.departments.includes(doc.id));

        return department;
      });

    const familyResponse = await firebase
      .firestore()
      .collection('families')
      .doc(partResponse.family)
      .get()
      .then(snapshot => {
        const family = snapshot.data() as IFamilyData;

        return family;
      });

    setDetail({
      part: partResponse,
      departments: departmentResponse,
      family: familyResponse,
    });

    setLoading(false);
  }, [bvspPartId]);

  useEffect(() => {
    handleFetchBvspPartData();
  }, [handleFetchBvspPartData]);

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
            <ImagePreview image={photoSelected} />
            <ThumnailContainer>
              {detail.part.photos.map(photo => (
                <ThumnailButton
                  key={photo.name}
                  image={photo.url}
                  onClick={() => setPhotoSelected(photo.url)}
                />
              ))}
            </ThumnailContainer>
          </ImageContainer>

          <ProductInfo>
            <InfoLine>
              <ProductLabel>Nome</ProductLabel>
              <ProductTitle>{detail.part.description}</ProductTitle>
            </InfoLine>

            <InfoColumn>
              <InfoLine>
                <ProductLabel>Código BVSP</ProductLabel>
                <ProductDescription>{detail.part.bvspcode}</ProductDescription>
              </InfoLine>

              <InfoLine>
                <ProductLabel>Código OEM</ProductLabel>
                <ProductDescription>{detail.part.oemcode}</ProductDescription>
              </InfoLine>
            </InfoColumn>

            <InfoLine>
              <ProductLabel>Família</ProductLabel>
              <ProductDescription>
                {detail.family.description}
              </ProductDescription>
            </InfoLine>

            <InfoLine>
              <ProductLabel>Departamentos</ProductLabel>
              <DepartmentTagsContainer>
                {detail.departments.map(department => (
                  <DepartmentTags key={department.id}>
                    {department.description}
                  </DepartmentTags>
                ))}
              </DepartmentTagsContainer>
            </InfoLine>
          </ProductInfo>
        </ProductInfoContainer>
      )}
      <Content />
    </Container>
  );
};

export default BvspPartsStDetails;
