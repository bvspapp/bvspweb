import React, { useState, useCallback, useEffect } from 'react';
import { pdf } from '@react-pdf/renderer';
import { useHistory } from 'react-router-dom';

import { MdArrowBack, MdPrint } from 'react-icons/md';

import PdfComponent from './PdfContent';

import firebase from '../../config/firebase';
import MessageConfirmation from '../../utils/MessageConfirmation';
import MessageAlert from '../../utils/MessageAlert';
import Button from '../../components/Form/Button';
import Load from '../../components/Load';

import light from '../../styles/themes/light';

import {
  Container,
  Header,
  Title,
  ButtonsContainer,
  Content,
  FileNotFound,
  PdfContent,
} from './styles';

interface IMachineData {
  description: string;
  description_english: string;
  departments: string[];
}

interface IDepartmentData {
  description: string;
  description_english: string;
}

interface IImageStoraged {
  url: string;
  name: string;
}

interface IBvspPartData {
  oemcode: string;
  bvspcode: string;
  description: string;
  description_insensitive: string;
  description_english: string;
  photos: IImageStoraged[];
  photocover: IImageStoraged;
  machines: string[];
}

interface IPdfData {
  machine: {
    id: string;
    name: string;
    department: string;
  };
  parts: {
    id: string;
    name: string;
    oemcode: string;
    bvspcode: string;
    photo: string;
  }[];
}

const GeneratePortfolioPdf: React.FC = () => {
  const [pdfFileExistsInStorage, setPdfFileExistsInStorage] = useState<
    string
  >();
  const [loading, setLoading] = useState(true);
  const [rendering, setRendering] = useState(false);
  const history = useHistory();

  const handleBack = useCallback(() => {
    history.goBack();
  }, [history]);

  const handleStorageFileUpdate = useCallback(
    async (fileUpload: Blob, language: string) => {
      if (language === 'usa') {
        await firebase
          .storage()
          .ref('files/ptbr/portfoliobvsp.pdf')
          .put(fileUpload);
      } else {
        await firebase
          .storage()
          .ref('files/ptbr/portfoliobvsp.pdf')
          .put(fileUpload);
      }
    },
    [],
  );

  const handlePdfGeneration = useCallback(
    async (language: string) => {
      const { isConfirmed } = await MessageConfirmation(
        'Você tem certeza? Renderizar o PDF pode levar tempo.',
        'Sim. Renderizar!',
        'question',
      );

      if (isConfirmed) {
        setRendering(true);

        try {
          const departments = await firebase
            .firestore()
            .collection('departments')
            .get()
            .then(departmentSnapshot => {
              const departmentFormatted = departmentSnapshot.docs.map(doc => {
                const departmentData = doc.data() as IDepartmentData;

                return {
                  id: doc.id,
                  name:
                    language === 'ptbr'
                      ? departmentData.description
                      : departmentData.description_english,
                };
              });

              return departmentFormatted;
            });

          const machines = await firebase
            .firestore()
            .collection('machines')
            .get()
            .then(machineSnapshot => {
              const machineFormatted = machineSnapshot.docs.map(doc => {
                const machineData = doc.data() as IMachineData;

                return {
                  id: doc.id,
                  name:
                    language === 'ptbr'
                      ? machineData.description
                      : machineData.description_english,
                  departments: machineData.departments,
                };
              });

              return machineFormatted;
            });

          const parts = await firebase
            .firestore()
            .collection('parts')
            .get()
            .then(partSnapshot => {
              const partFormatted = partSnapshot.docs.map(doc => {
                const partData = doc.data() as IBvspPartData;

                return {
                  id: doc.id,
                  name:
                    language === 'ptbr'
                      ? partData.description
                      : partData.description_english,
                  oemcode: partData.oemcode,
                  bvspcode: partData.bvspcode,
                  photo: partData.photos[0].url,
                  machines: partData.machines,
                };
              });

              return partFormatted;
            });

          const pdfDataFormatted = departments.map(department => {
            const machineByDepartment = machines
              .filter(machine => machine.departments.includes(department.id))
              .map(machine => {
                const partsByMachine = parts.filter(part =>
                  part.machines.includes(machine.id),
                );
                return {
                  id: machine.id,
                  name: machine.name,
                  parts: partsByMachine,
                };
              });

            return {
              id: department.id,
              name: department.name,
              machines: machineByDepartment,
            };
          });

          const blob = await pdf(
            <PdfComponent payload={{ departments: pdfDataFormatted }} />,
          ).toBlob();
          await handleStorageFileUpdate(blob, language);
        } catch (error) {
          return MessageAlert('Não foi possível gerar o PDF!', 'error');
        } finally {
          setRendering(false);
        }
      }
    },
    [handleStorageFileUpdate],
  );

  useEffect(() => {
    firebase
      .storage()
      .ref(`files/ptbr/portfoliobvsp.pdf`)
      .getDownloadURL()
      .then(linkFile => {
        setPdfFileExistsInStorage(linkFile);
      })
      .finally(() => setLoading(false));
  }, []);

  return loading ? (
    <Load />
  ) : (
    <Container>
      <Header>
        <Title>Portfólio Completo</Title>

        <ButtonsContainer>
          <Button
            type="button"
            color={light.colors.primary}
            onClick={handleBack}
          >
            <MdArrowBack />
            Voltar
          </Button>
          <Button
            type="button"
            color={light.colors.success}
            onClick={() => handlePdfGeneration('ptbr')}
          >
            <MdPrint />
            Português
          </Button>
          <Button
            type="button"
            color={light.colors.success}
            onClick={() => handlePdfGeneration('enus')}
          >
            <MdPrint />
            Inglês
          </Button>
        </ButtonsContainer>
      </Header>
      <Content>
        {!rendering && pdfFileExistsInStorage ? (
          <PdfContent src={pdfFileExistsInStorage} type="application/pdf" />
        ) : (
          <FileNotFound>
            {rendering
              ? 'Estamos gerando o PDF do Portfólio completo. Essa tarefa irá levar um bom tempo. Não feche o navegador e aguarde.'
              : 'No momento não há um PDF disponível. Renderize o arquivo.'}
          </FileNotFound>
        )}
      </Content>
    </Container>
  );
};

export default GeneratePortfolioPdf;
