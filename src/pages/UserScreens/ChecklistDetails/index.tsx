import React, { useMemo, useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { FaFile, FaArrowLeft } from 'react-icons/fa';
import Load from '../../../components/Load';
import MessageAlert from '../../../utils/MessageAlert';

import firebase from '../../../config/firebase';

import {
  Container,
  Header,
  Content,
  ButtonBack,
  Title,
  ContentHeader,
  CheckListLabel,
  CheckListTitle,
  CheckListInfo,
  PdfDownloadButton,
  StepsContainer,
  Step,
  StepNumber,
  StepDescription,
} from './styles';

import translatedContent from './translatedcontent';
import { useTranslation } from '../../../hooks/translation';

interface IRouteParams {
  match: {
    params: {
      machine_id: string;
    };
  };
}

interface IData {
  id: string;
  description: string;
  steps: {
    order: number;
    description: string;
  }[];
}

interface IStepsResponse {
  order: number;
  description: string;
  description_english: string;
}

const ChecklistDetails: React.FC<IRouteParams> = ({ match }) => {
  const [loading, setLoading] = useState(true);
  const [linkFilePdf, setLinkFilePdf] = useState();
  const [data, setData] = useState<IData>({} as IData);

  const history = useHistory();
  const { translation } = useTranslation();

  const { machine_id } = match.params;

  const translated = useMemo(() => {
    return translation === 'en-us'
      ? translatedContent.en_US
      : translatedContent.pt_BR;
  }, [translation]);

  const getLink = useCallback(async () => {
    const translatedFolder = translation === 'pt-br' ? 'ptbr' : 'usa';

    const idItem = data ? data.id : machine_id;

    await firebase
      .storage()
      .ref(`files/checklists/${translatedFolder}/${idItem}.pdf`)
      .getDownloadURL()
      .then(linkFile => {
        setLinkFilePdf(linkFile);
      });
  }, [data, machine_id, translation]);

  useEffect(() => {
    async function load() {
      try {
        await firebase
          .firestore()
          .collection('checklists')
          .where('machines', '==', machine_id)
          .get()
          .then(async snapshot => {
            const descriptionFormatted =
              translation === 'en-us'
                ? snapshot.docs[0].data().description_english
                : snapshot.docs[0].data().description;

            setData({
              id: snapshot.docs[0].id,
              description: descriptionFormatted,
              steps: snapshot.docs[0]
                .data()
                .steps.map((step: IStepsResponse) => {
                  return {
                    order: step.order + 1,
                    description:
                      translation === 'en-us'
                        ? step.description_english
                        : step.description,
                  };
                }),
            });
          });

        setLoading(false);
      } catch {
        await MessageAlert(translated.error_load_data, 'error');
        history.goBack();
      }
    }

    load();
    getLink();
  }, [machine_id, translation, getLink, translated, history]);

  return (
    <Container>
      <Header>
        <Title>{translated.title}</Title>
        <ButtonBack onClick={() => history.goBack()}>
          <FaArrowLeft />
        </ButtonBack>
      </Header>

      {loading ? (
        <Load />
      ) : (
        <Content>
          <ContentHeader>
            <CheckListInfo>
              <CheckListLabel>Descrição</CheckListLabel>
              <CheckListTitle>{data.description}</CheckListTitle>
            </CheckListInfo>
            {linkFilePdf && (
              <PdfDownloadButton href={linkFilePdf} target="_blank">
                <FaFile />
                PDF
              </PdfDownloadButton>
            )}
          </ContentHeader>

          <StepsContainer>
            {data.steps.map(step => (
              <Step key={step.order}>
                <StepNumber>{step.order}</StepNumber>
                <StepDescription>{step.description}</StepDescription>
              </Step>
            ))}
          </StepsContainer>
        </Content>
      )}
    </Container>
  );
};

export default ChecklistDetails;
