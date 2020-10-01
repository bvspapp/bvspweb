import React, { useCallback, useState, useEffect } from 'react';
import { pdf } from '@react-pdf/renderer';
import { useHistory } from 'react-router-dom';

import { MdArrowBack, MdPrint } from 'react-icons/md';

import firebase from '../../../config/firebase';
import light from '../../../styles/themes/light';

import MessageConfirmation from '../../../utils/MessageConfirmation';
import MessageAlert from '../../../utils/MessageAlert';
import Button from '../../../components/Form/Button';
import Load from '../../../components/Load';

import Portfolio from './PdfContent';

import {
  Container,
  Header,
  Title,
  ButtonsContainer,
  PdfContent,
  FileNotFound,
  Content,
} from './styles';

interface IRouteParams {
  match: {
    params: {
      id: string;
    };
  };
}

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

const ExportPdfPartsByMachine: React.FC<IRouteParams> = ({ match }) => {
  const [pdfFileExistsInStorage, setPdfFileExistsInStorage] = useState<
    string
  >();
  const [loading, setLoading] = useState(true);
  const [rendering, setRendering] = useState(false);
  const history = useHistory();

  const { id: machineId } = match.params;

  const handleBack = useCallback(() => {
    history.push('/users');
  }, [history]);

  const handleStorageFileUpdate = useCallback(
    async (fileUpload: Blob, language: string) => {
      if (language === 'usa') {
        await firebase
          .storage()
          .ref(`files/machines/usa/${machineId}.pdf`)
          .put(fileUpload)
          .then(() => {
            window.location.reload();
          });
      } else {
        await firebase
          .storage()
          .ref(`files/machines/ptbr/${machineId}.pdf`)
          .put(fileUpload)
          .then(() => {
            window.location.reload();
          });
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

      if (isConfirmed) {
        setRendering(true);

        try {
          const machine = await firebase
            .firestore()
            .collection('machines')
            .doc(machineId)
            .get()
            .then(async machineSnapshot => {
              const machineData = machineSnapshot.data() as IMachineData;

              return {
                id: machineSnapshot.id,
                name:
                  language === 'ptbr'
                    ? machineData.description
                    : machineData.description_english,
                departments: machineData.departments,
              };
            });

          if (!machine) {
            setLoading(false);
            return MessageAlert('Máquina não encontrada!', 'error');
          }

          const department = await firebase
            .firestore()
            .collection('departments')
            .doc(machine.departments[0])
            .get()
            .then(departmentSnapshot => {
              const departmentData = departmentSnapshot.data() as IDepartmentData;

              return {
                id: departmentSnapshot.id,
                name:
                  language === 'ptbr'
                    ? departmentData.description
                    : departmentData.description_english,
              };
            });

          const parts = await firebase
            .firestore()
            .collection('parts')
            .where('machines', 'array-contains', machineId)
            .orderBy('description_insensitive')
            .get()
            .then(partSnapshot => {
              const partFormatted = partSnapshot.docs.map(doc => {
                const partData = doc.data() as IBvspPartData;

                let photo = partData.photos[0].url;

                if (partData.photocover) {
                  if (partData.photocover.url) {
                    photo = partData.photocover.url;
                  }
                }

                return {
                  id: doc.id,
                  name:
                    language === 'ptbr'
                      ? partData.description
                      : partData.description_english,
                  oemcode: partData.oemcode,
                  bvspcode: partData.bvspcode,
                  photo,
                };
              });

              return partFormatted;
            });

          const dataPdf = {
            machine: {
              id: machine.id,
              name: machine.name,
              department: department.name,
            },
            parts,
          };

          const blob = await pdf(<Portfolio payload={dataPdf} />).toBlob();
          await handleStorageFileUpdate(blob, language);
        } catch {
          return MessageAlert('Não foi possível gerar o PDF!', 'error');
        } finally {
          setRendering(false);
        }
      }
    },
    [machineId, handleStorageFileUpdate],
  );

  useEffect(() => {
    firebase
      .storage()
      .ref(`files/machines/ptbr/${machineId}.pdf`)
      .getDownloadURL()
      .then(linkFile => {
        setPdfFileExistsInStorage(linkFile);
      })
      .finally(() => setLoading(false));
  }, [machineId]);

  return loading ? (
    <Load />
  ) : (
    <Container>
      <Header>
        <Title>Portfólio de Peças por Máquina</Title>

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
        </ButtonsContainer>
      </Header>
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
    </Container>
  );
};

export default ExportPdfPartsByMachine;
