import React, { useEffect, useState, useCallback } from 'react';
import { pdf } from '@react-pdf/renderer';
import { useHistory } from 'react-router-dom';

import { MdArrowBack, MdPrint } from 'react-icons/md';

import light from '../../../styles/themes/light';

import firebase from '../../../config/firebase';

import MessageAlert from '../../../utils/MessageAlert';
import MessageConfirmation from '../../../utils/MessageConfirmation';
import Button from '../../../components/Form/Button';
import Load from '../../../components/Load';
import ChecklistDocPdf from './PdfContent';

import {
  Container,
  PdfContent,
  Header,
  Title,
  ButtonsContainer,
  Content,
  FileNotFound,
} from './styles';

interface IRouteParams {
  match: {
    params: {
      id: string;
    };
  };
}

interface IPhoto {
  name: string;
  step: number;
  url: string;
}

interface IStep {
  description: string;
  description_english: string;
  order: number;
}

interface IChecklistData {
  description: string;
  description_english: string;
  photos: IPhoto[];
  steps: IStep[];
}

const ExportPdfCheckList: React.FC<IRouteParams> = ({ match }) => {
  const [rendering, setRendering] = useState(false);
  const [languageSelected, setLanguageSelected] = useState('ptbr');
  const [pdfFileExistsInStorage, setPdfFileExistsInStorage] = useState<
    string
  >();
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  const { id: machineId } = match.params;

  const handleBack = useCallback(() => {
    history.goBack();
  }, [history]);

  const handleStorageFileUpdate = useCallback(
    async (fileUpload: Blob, language: string) => {
      if (language === 'usa') {
        await firebase
          .storage()
          .ref(`files/checklists/${language}/${machineId}.pdf`)
          .put(fileUpload);
      } else {
        await firebase
          .storage()
          .ref(`files/checklists/${language}/${machineId}.pdf`)
          .put(fileUpload);
      }
    },
    [machineId],
  );

  const handleDataPdf = useCallback(
    async (language: string) => {
      const { isConfirmed } = await MessageConfirmation(
        'Você tem certeza? Renderizar o PDF pode levar tempo.',
        'Sim. Renderizar!',
        'question',
      );

      if (!isConfirmed) return;

      setRendering(true);
      language === 'ptbr'
        ? setLanguageSelected('ptbr')
        : setLanguageSelected('enus');

      try {
        const checklist = await firebase
          .firestore()
          .collection('checklists')
          .where('machines', '==', machineId)
          .get()
          .then(checklistSnapshot => {
            const response = checklistSnapshot.docs.map(doc => {
              const checklistData = doc.data() as IChecklistData;

              const stepsFormatted = checklistData.steps.map(step => {
                return {
                  description:
                    language === 'ptbr'
                      ? step.description
                      : step.description_english,
                  order: step.order,
                };
              });

              return {
                checklistLabel:
                  language === 'ptbr' ? 'Nome do Checklist' : 'Checklist Name',
                id: doc.id,
                name:
                  language === 'ptbr'
                    ? checklistData.description
                    : checklistData.description_english,
                photos: checklistData.photos,
                steps: stepsFormatted,
              };
            });

            return response[0];
          });

        const blob = await pdf(
          <ChecklistDocPdf payload={checklist} />,
        ).toBlob();
        await handleStorageFileUpdate(blob, language);
      } catch {
        MessageAlert('Não foi possível gerar o PDF!', 'error');
      } finally {
        setRendering(false);
      }
    },
    [machineId, handleStorageFileUpdate],
  );

  useEffect(() => {
    firebase
      .storage()
      .ref(`files/checklists/${languageSelected}/${machineId}.pdf`)
      .getDownloadURL()
      .then(linkFile => {
        setPdfFileExistsInStorage(linkFile);
      })
      .finally(() => setLoading(false));
  }, [machineId, languageSelected]);

  return (
    <Container>
      <Header>
        <Title>Checklist</Title>

        <ButtonsContainer>
          <Button
            type="button"
            color={light.colors.success}
            onClick={() => handleDataPdf('ptbr')}
          >
            <MdPrint />
            Português
          </Button>

          <Button
            type="button"
            color={light.colors.success}
            onClick={() => handleDataPdf('enus')}
          >
            <MdPrint />
            Inglês
          </Button>

          <Button
            type="button"
            color={light.colors.primary}
            onClick={handleBack}
          >
            <MdArrowBack />
            Voltar
          </Button>
        </ButtonsContainer>
      </Header>

      {loading ? (
        <Load />
      ) : (
        <Content>
          {!rendering && pdfFileExistsInStorage ? (
            <PdfContent src={pdfFileExistsInStorage} type="application/pdf" />
          ) : (
            <FileNotFound>
              {rendering
                ? 'Estamos gerando o PDF. Aguarde, isso pode levar minutos.'
                : 'No momento não há um PDF disponível. Renderize o arquivo.'}
            </FileNotFound>
          )}
        </Content>
      )}
    </Container>
  );
};

export default ExportPdfCheckList;
