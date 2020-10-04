import React, { useEffect, useCallback, useState, useMemo } from 'react';
import { useHistory } from 'react-router-dom';

import { MdArrowBack } from 'react-icons/md';

import firebase from '../../../../config/firebase';
import light from '../../../../styles/themes/light';

import HighlightTitle from '../../../../components/HighlightTitle';
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
  photos: IImageStoraged[];
  photocover: IImageStoraged;
  family: string;
  departments: string[];
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
}

interface IDepartmentData {
  id: string;
  description: string;
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

  const handleFetchBvspMachineData = useCallback(async () => {
    const machineResponse = await firebase
      .firestore()
      .collection('machines')
      .doc(bvspMachineId)
      .get()
      .then(snapshot => {
        const machineData = snapshot.data() as IBvspMachineData;

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

        return familyData;
      });

    setData({
      machine: machineResponse,
      departments: departmentResponse,
      family: familyResponse,
    });

    setLoading(false);
  }, [bvspMachineId]);

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
              <ProductTitle>{data.machine.description}</ProductTitle>
            </InfoLine>

            <InfoLine>
              <ProductLabel>Descrição</ProductLabel>
              <ProductDescription>{data.machine.about}</ProductDescription>
            </InfoLine>

            <InfoColumn>
              <InfoLine>
                <ProductLabel>Código BVSP</ProductLabel>
                <ProductDescription>{data.machine.bvspcode}</ProductDescription>
              </InfoLine>

              <InfoLine>
                <ProductLabel>Família</ProductLabel>
                <ProductDescription>
                  {data.family.description}
                </ProductDescription>
              </InfoLine>
            </InfoColumn>

            <InfoLine>
              <ProductLabel>Departamentos</ProductLabel>

              <DepartmentTagsContainer>
                {data.departments.map(d => (
                  <DepartmentTags key={d.id}>{d.description}</DepartmentTags>
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
