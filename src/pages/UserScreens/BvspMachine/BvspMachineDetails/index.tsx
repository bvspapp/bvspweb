import React, { useEffect, useCallback, useState, useMemo } from 'react';
import { useHistory } from 'react-router-dom';

import { MdArrowBack } from 'react-icons/md';

import firebase from '../../../../config/firebase';
import light from '../../../../styles/themes/light';

import HighlightTitle from '../../../../components/HighlightTitle';
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
  InfoColumn,
  DepartmentTagsContainer,
  DepartmentTags,
  ProductInfoContainer,
  ImageContainer,
} from './styles';

interface IBvspMachineData {
  bvspcode: string;
  description: string;
  description_english: string;
  about: string;
  about_english: string;
  about_formatted: string;
  photos: IImageStoraged[];
  photocover: IImageStoraged;
  family: string;
  departments: string[];
  descriptionFormatted: string;
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

interface IFamilyData {
  id: string;
  description: string;
  description_english: string;
  descriptionFormatted: string;
}

interface IDepartmentData {
  id: string;
  description: string;
  description_english: string;
  descriptionFormatted: string;
}

interface IData {
  machine: IBvspMachineData;
  family: IFamilyData;
  departments: IDepartmentData[];
}

const BvspMachineDetails: React.FC<IRouteParams> = ({ match }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<IData>({} as IData);

  const history = useHistory();
  const { id: bvspMachineId } = match.params;

  const { translation } = useTranslation();

  const translated = useMemo(() => {
    return translation === 'en-us'
      ? translatedContent.en_US
      : translatedContent.pt_BR;
  }, [translation]);

  const handleFetchBvspMachineData = useCallback(async () => {
    const machineResponse = await firebase
      .firestore()
      .collection('machines')
      .doc(bvspMachineId)
      .get()
      .then(snapshot => {
        const machineData = snapshot.data() as IBvspMachineData;

        machineData.descriptionFormatted =
          translation === 'en-us'
            ? machineData.description_english
            : machineData.description;

        machineData.about_formatted =
          translation === 'en-us'
            ? machineData.about_english
            : machineData.about;

        return machineData;
      });

    const departmentResponse = await firebase
      .firestore()
      .collection('departments')
      .get()
      .then(snapshot => {
        const departmentsData = snapshot.docs
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
          .filter(doc => machineResponse.departments.includes(doc.id));

        return departmentsData;
      });

    const familyResponse = await firebase
      .firestore()
      .collection('families')
      .doc(machineResponse.family)
      .get()
      .then(snapshot => {
        const familyData = snapshot.data() as IFamilyData;

        familyData.descriptionFormatted =
          translation === 'en-us'
            ? familyData.description_english
            : familyData.description;

        return familyData;
      });

    setData({
      machine: machineResponse,
      departments: departmentResponse,
      family: familyResponse,
    });

    setLoading(false);
  }, [bvspMachineId, translation]);

  const photosFormatted = useMemo(() => {
    const formatted = !data.machine
      ? {
          photos: [
            {
              original: '',
              thumbnail: '',
            },
          ],
        }
      : {
          photos: data.machine.photos.map(photo => {
            return {
              original: photo.url,
              thumbnail: photo.url,
            };
          }),
        };

    return formatted;
  }, [data]);

  useEffect(() => {
    handleFetchBvspMachineData();
  }, [handleFetchBvspMachineData]);

  return (
    <Container>
      <Header>
        <HighlightTitle title={translated.details_title} lineAlign="left" />
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
              <ProductTitle>{data.machine.descriptionFormatted}</ProductTitle>
            </InfoLine>

            <InfoLine>
              <ProductLabel>{translated.details_about_label}</ProductLabel>
              <ProductDescription>
                {data.machine.about_formatted}
              </ProductDescription>
            </InfoLine>

            <InfoColumn>
              <InfoLine>
                <ProductLabel>{translated.details_bvspcode_label}</ProductLabel>
                <ProductDescription>{data.machine.bvspcode}</ProductDescription>
              </InfoLine>

              <InfoLine>
                <ProductLabel>{translated.details_family_label}</ProductLabel>
                <ProductDescription>
                  {data.family.descriptionFormatted}
                </ProductDescription>
              </InfoLine>
            </InfoColumn>

            <InfoLine>
              <ProductLabel>
                {translated.details_departments_label}
              </ProductLabel>

              <DepartmentTagsContainer>
                {data.departments.map(d => (
                  <DepartmentTags key={d.id}>
                    {d.descriptionFormatted}
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

export default BvspMachineDetails;
