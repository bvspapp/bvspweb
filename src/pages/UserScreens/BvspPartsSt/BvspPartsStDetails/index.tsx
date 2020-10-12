import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { useHistory } from 'react-router-dom';

import { MdArrowBack } from 'react-icons/md';

import translatedContent from './translatedcontent';
import { useTranslation } from '../../../../hooks/translation';

import firebase from '../../../../config/firebase';
import light from '../../../../styles/themes/light';
import Load from '../../../../components/Load';
import HighlightTitle from '../../../../components/HighlightTitle';
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
  InfoColumn,
  DepartmentTagsContainer,
  DepartmentTags,
  ProductInfoContainer,
  ImageContainer,
} from './styles';

interface IBvspPartData {
  oemcode: string;
  bvspcode: string;
  description: string;
  description_english: string;
  descriptionFormatted: string;
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
  description_english: string;
  descriptionFormatted: string;
}

interface IFamilyData {
  id: string;
  description: string;
  description_english: string;
  descriptionFormatted: string;
}

interface IData {
  part: IBvspPartData;
  departments: IDepartmentData[];
  family: IFamilyData;
}

const BvspPartsStDetails: React.FC<IRouteParams> = ({ match }) => {
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState<IData>({} as IData);

  const history = useHistory();
  const { id: bvspPartId } = match.params;

  const { translation } = useTranslation();
  const translated = useMemo(() => {
    return translation === 'en-us'
      ? translatedContent.en_US
      : translatedContent.pt_BR;
  }, [translation]);

  const handleFetchBvspPartData = useCallback(async () => {
    const partResponse = await firebase
      .firestore()
      .collection('parts')
      .doc(bvspPartId)
      .get()
      .then(snapshot => {
        const part = snapshot.data() as IBvspPartData;

        part.descriptionFormatted =
          translation === 'en-us' ? part.description_english : part.description;

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
              description_english: String(doc.data().description_english),
              descriptionFormatted:
                translation === 'en-us'
                  ? String(doc.data().description_english)
                  : String(doc.data().description),
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
        family.descriptionFormatted =
          translation === 'en-us'
            ? family.description_english
            : family.description;

        return family;
      });

    setDetail({
      part: partResponse,
      departments: departmentResponse,
      family: familyResponse,
    });

    setLoading(false);
  }, [bvspPartId, translation]);

  const photosFormatted = useMemo(() => {
    const formatted = !detail.part
      ? {
          photos: [
            {
              original: '',
              thumbnail: '',
            },
          ],
        }
      : {
          photos: detail.part.photos.map(photo => {
            return {
              original: photo.url,
              thumbnail: photo.url,
            };
          }),
        };

    return formatted;
  }, [detail]);

  useEffect(() => {
    handleFetchBvspPartData();
  }, [handleFetchBvspPartData]);

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
              <ProductTitle>{detail.part.descriptionFormatted}</ProductTitle>
            </InfoLine>

            <InfoColumn>
              <InfoLine>
                <ProductLabel>{translated.details_bvspcode_label}</ProductLabel>
                <ProductDescription>{detail.part.bvspcode}</ProductDescription>
              </InfoLine>

              <InfoLine>
                <ProductLabel>{translated.details_oemcode_label}</ProductLabel>
                <ProductDescription>{detail.part.oemcode}</ProductDescription>
              </InfoLine>
            </InfoColumn>

            <InfoLine>
              <ProductLabel>{translated.details_family_label}</ProductLabel>
              <ProductDescription>
                {detail.family.descriptionFormatted}
              </ProductDescription>
            </InfoLine>

            <InfoLine>
              <ProductLabel>Departamentos</ProductLabel>
              <DepartmentTagsContainer>
                {detail.departments.map(department => (
                  <DepartmentTags key={department.id}>
                    {department.descriptionFormatted}
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
