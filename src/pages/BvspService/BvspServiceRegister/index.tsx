import React, {
  useCallback,
  useState,
  useEffect,
  useRef,
  useMemo,
} from 'react';
import { FormHandles } from '@unform/core';
import { useHistory } from 'react-router-dom';
import { MdCheck, MdArrowBack } from 'react-icons/md';
import * as Yup from 'yup';
import { uniqueId } from 'lodash';
import filesize from 'filesize';

import firebase from '../../../config/firebase';

import MessageAlert from '../../../utils/MessageAlert';
import MessageConfirmation from '../../../utils/MessageConfirmation';
import light from '../../../styles/themes/light';

import TextAreaInput from '../../../components/Form/TextAreaInput';
import TextInput from '../../../components/Form/TextInput';
import Button from '../../../components/Form/Button';
import Load from '../../../components/Load';
import UploadImages from '../../../components/UploadImages';
import ImageController from '../../../components/ImageController';

import {
  Container,
  Form,
  FormHeader,
  FormContent,
  Title,
  ButtonsContainer,
  UploadImagesLabel,
  ImagesContainer,
} from './styles';

interface IFormData {
  description: string;
  description_english: string;
  about: string;
  about_english: string;
}

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
      action: string;
    };
  };
}

interface IImageFile {
  file: File;
  id: string;
  name: string;
  readableSize: string;
  preview: string;
  url: string | null;
}

const BvspServiceRegister: React.FC<IRouteParams> = ({ match }) => {
  const [loading, setLoading] = useState(true);
  const [initialDataForm, setInitialDataForm] = useState<IFormData>();
  const formRef = useRef<FormHandles>(null);
  const [uploadedImages, setUploadedImages] = useState<IImageFile[]>([]);
  const [storagedImages, setStoragedImages] = useState<IImageStoraged[]>([]);
  const [imagesNameToRemove, setImagesNameToRemove] = useState<string[]>([]);
  const [coverImageName, setCoverImageName] = useState<string>();

  const history = useHistory();
  const { id: bvspServiceId, action: formAction } = match.params;

  const customFormByAction = useMemo(() => {
    switch (formAction) {
      case 'new':
        return {
          buttonSaveLabel: 'Cadastrar',
          disabledFields: false,
          showButtonSave: true,
        };
      case 'edit':
        return {
          buttonSaveLabel: 'Salvar',
          disabledFields: false,
          showButtonSave: true,
        };
      case 'delete':
        return {
          buttonSaveLabel: 'Remover',
          disabledFields: true,
          showButtonSave: true,
        };
      default:
        return {
          buttonSaveLabel: 'Visualizar',
          disabledFields: true,
          showButtonSave: false,
        };
    }
  }, [formAction]);

  const handleGetUrlUploadImages = useCallback(async (images: IImageFile[]) => {
    if (images.length === 0) return [] as IImageStoraged[];

    const urlList: IImageStoraged[] = [];

    await Promise.all(
      images.map(async photo => {
        await firebase
          .storage()
          .ref(`images/${photo.name}`)
          .put(photo.file)
          .then(async snapshot => {
            await snapshot.ref
              .getDownloadURL()
              .then(downloadURL =>
                urlList.push({ url: downloadURL, name: photo.name }),
              );
          });
      }),
    );

    return urlList;
  }, []);

  const handleRemoveImageUploaded = useCallback(
    (imageId: string) => {
      setUploadedImages(uploadedImages.filter(image => image.id !== imageId));
    },
    [uploadedImages],
  );

  const handleSetImageCover = useCallback((image: string) => {
    setCoverImageName(image);
  }, []);

  const handleMarkOrUnMarkToRemoveImageStoraged = useCallback(
    (imageName: string) => {
      const exists = imagesNameToRemove.includes(imageName);

      if (exists) {
        setImagesNameToRemove(
          imagesNameToRemove.filter(name => name !== imageName),
        );
      } else {
        setImagesNameToRemove(imagesNameToRemove.concat(imageName));
      }
    },
    [imagesNameToRemove],
  );

  const handleRemoveFileImageStoraged = useCallback(
    async (filesName: string[]) => {
      await filesName.forEach(async image => {
        await firebase.storage().ref('images').child(image).delete();
      });
    },
    [],
  );

  const handleBvspServiceNew = useCallback(
    async (data: IFormData) => {
      setLoading(true);

      const {
        description,
        description_english,
        about,
        about_english,
      }: IFormData = data;

      const imagesURL = await handleGetUrlUploadImages(uploadedImages);

      const imageCoverData = imagesURL.filter(
        image => image.name === coverImageName,
      );

      const order = await firebase
        .firestore()
        .collection('services')
        .orderBy('order', 'desc')
        .limit(1)
        .get()
        .then(snapshot => {
          const lastOrderPosition: number = snapshot.docs.map(
            doc => doc.data().order,
          )[0];

          return lastOrderPosition >= 0 ? lastOrderPosition + 1 : 0;
        });

      const service: IBvspServiceData = {
        description: description.trim(),
        description_insensitive: description.toLowerCase().trim(),
        description_english,
        description_insensitive_english: description_english
          .toLowerCase()
          .trim(),
        about,
        about_english,
        photos: imagesURL,
        photocover:
          imageCoverData.length > 0 ? imageCoverData[0] : imagesURL[0],
        order,
      };

      await firebase
        .firestore()
        .collection('services')
        .add(service)
        .then(() => {
          MessageAlert('Cadastrado com sucesso!', 'success').then(() =>
            history.push('/bvsp-services'),
          );
        })
        .catch(() => {
          MessageAlert('Não foi possível cadastrar!', 'error');
          setLoading(false);
        });
    },
    [history, handleGetUrlUploadImages, uploadedImages, coverImageName],
  );

  const handleBvspServicesUpdate = useCallback(
    async (id: string, data: IFormData) => {
      setLoading(true);

      const {
        description,
        description_english,
        about,
        about_english,
      }: IFormData = data;

      if (imagesNameToRemove.length > 0) {
        await handleRemoveFileImageStoraged(imagesNameToRemove);
      }

      const imagesToKeepStoraged = storagedImages.filter(
        image => !imagesNameToRemove.includes(image.name),
      );

      const imagesURL = await handleGetUrlUploadImages(uploadedImages);

      const keptAndAddedImages = [...imagesURL, ...imagesToKeepStoraged];

      const imageCoverData = keptAndAddedImages.filter(
        image => image.name === coverImageName,
      );

      const solution: IBvspServiceData = {
        description: description.trim(),
        description_insensitive: description.toLowerCase().trim(),
        description_english,
        description_insensitive_english: description_english
          .toLowerCase()
          .trim(),
        about,
        about_english,
        photos: keptAndAddedImages,
        photocover:
          imageCoverData.length > 0 ? imageCoverData[0] : keptAndAddedImages[0],
      };

      await firebase
        .firestore()
        .collection('services')
        .doc(id)
        .update(solution)
        .then(() => {
          MessageAlert('Atualizado com sucesso!', 'success').then(() =>
            history.push('/bvsp-services'),
          );
        })
        .catch(() => {
          MessageAlert('Não foi possível atualizado!', 'error');
          setLoading(false);
        });
    },
    [
      history,
      coverImageName,
      uploadedImages,
      storagedImages,
      imagesNameToRemove,
      handleGetUrlUploadImages,
      handleRemoveFileImageStoraged,
    ],
  );

  const handleBvspServicesDelete = useCallback(
    async (id: string) => {
      const { isConfirmed } = await MessageConfirmation(
        'Você tem certeza que deseja remover?',
        'Sim. Remover!',
        'question',
      );

      if (isConfirmed) {
        setLoading(true);

        await storagedImages.map(async image => {
          await firebase
            .storage()
            .ref('images')
            .child(image.name)
            .delete()
            .catch(() =>
              MessageAlert('Não foi possível remover as imagens!', 'error'),
            );
        });

        await firebase
          .firestore()
          .collection('services')
          .doc(id)
          .delete()
          .then(() => {
            MessageAlert('Removido com sucesso!', 'success').then(() =>
              history.push('/bvsp-services'),
            );
          })
          .catch(() => {
            MessageAlert('Não foi possível remover os dados!', 'error');
            setLoading(false);
          });
      }
    },
    [history, storagedImages],
  );

  const handleBack = useCallback(() => {
    history.push('/bvsp-services');
  }, [history]);

  const handleFormSubmitData = useCallback(
    async (data: IFormData) => {
      const { description } = data;

      try {
        if (formAction === 'delete') {
          handleBvspServicesDelete(bvspServiceId);
        } else {
          const schema = Yup.object().shape({
            description: Yup.string().required(
              'O nome em Português é obrigatório.',
            ),
            description_english: Yup.string().required(
              'O nome em Inglês é obrigatório.',
            ),
          });

          await schema.validate(data);

          if (formAction === 'new') {
            const serviceExistsTheSameName = await firebase
              .firestore()
              .collection('services')
              .where(
                'description_insensitive',
                '==',
                description.toLowerCase().trim(),
              )
              .get()
              .then(async snapshot => !snapshot.empty);

            if (serviceExistsTheSameName) {
              setLoading(false);
              MessageAlert(
                'Já existe um serviço cadastrado com esse nome !',
                'info',
              );
            } else if (uploadedImages.length === 0) {
              MessageAlert('Selecione ao menos uma imagem.', 'info');
            } else {
              handleBvspServiceNew(data);
            }
          } else if (formAction === 'edit') {
            const imagesToKeep = storagedImages.filter(
              item => !imagesNameToRemove.includes(item.name),
            );

            const serviceExistsTheSameName = await firebase
              .firestore()
              .collection('services')
              .where(
                'description_insensitive',
                '==',
                description.toLowerCase().trim(),
              )
              .get()
              .then(async snapshot =>
                snapshot.docs.filter(doc => doc.id !== bvspServiceId),
              );

            if (serviceExistsTheSameName.length > 0) {
              setLoading(false);
              MessageAlert(
                'Já existe um serviço cadastrado com esse nome!',
                'info',
              );
            } else if (
              uploadedImages.length === 0 &&
              imagesToKeep.length === 0
            ) {
              MessageAlert('Selecione ao menos uma imagem.', 'info');
            } else {
              handleBvspServicesUpdate(bvspServiceId, data);
            }
          } else {
            MessageAlert('Operação Inválida!', 'info');
          }
        }
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          MessageAlert(error.errors[0], 'info');
        }
      }
    },
    [
      uploadedImages.length,
      imagesNameToRemove,
      bvspServiceId,
      storagedImages,
      formAction,
      handleBvspServiceNew,
      handleBvspServicesUpdate,
      handleBvspServicesDelete,
    ],
  );

  const handleFetchSpecialSolutionData = useCallback(async () => {
    await firebase
      .firestore()
      .collection('services')
      .doc(bvspServiceId)
      .get()
      .then(snapshot => {
        const {
          description,
          description_english,
          about,
          about_english,
          photos,
          photocover,
        } = snapshot.data() as IBvspServiceData;

        if (photos) {
          setStoragedImages(photos);
        }
        if (photocover) {
          setCoverImageName(photocover.name);
        }

        setInitialDataForm({
          description,
          description_english,
          about,
          about_english,
        });
      })
      .catch(() => MessageAlert('Não foi possível carregar os dados!', 'error'))
      .finally(() => setLoading(false));
  }, [bvspServiceId]);

  const handleImagesUpload = useCallback(
    imageFiles => {
      const uploadeds = imageFiles.map((file: File) => ({
        file,
        id: uniqueId(),
        name: `${Date.parse(String(new Date()))}-${file.name}`,
        readableSize: filesize(file.size),
        preview: URL.createObjectURL(file),
        url: null,
      }));

      setUploadedImages(uploadedImages.concat(uploadeds));
    },
    [uploadedImages],
  );

  useEffect(() => {
    if (bvspServiceId) {
      handleFetchSpecialSolutionData();
    } else {
      setLoading(false);
    }
  }, [handleFetchSpecialSolutionData, bvspServiceId, setLoading]);

  return loading ? (
    <Load />
  ) : (
    <Container>
      <Form
        ref={formRef}
        initialData={initialDataForm}
        onSubmit={handleFormSubmitData}
      >
        <FormHeader>
          <Title>Cadastro de serviço</Title>

          <ButtonsContainer>
            <Button
              type="button"
              color={light.colors.primary}
              onClick={handleBack}
            >
              <MdArrowBack />
              Voltar
            </Button>
            {customFormByAction.showButtonSave && (
              <Button type="submit" color={light.colors.success}>
                <MdCheck />
                {customFormByAction.buttonSaveLabel}
              </Button>
            )}
          </ButtonsContainer>
        </FormHeader>

        <FormContent disabled={customFormByAction.disabledFields}>
          <TextInput
            type="text"
            name="description"
            label="Nome em Português"
            required
          />
          <TextInput
            type="text"
            name="description_english"
            label="Nome em Inglês"
            required
          />
          <TextAreaInput
            name="about"
            label="Descrição em Português (opcional)"
          />
          <TextAreaInput
            name="about_english"
            label="Descrição em Inglês (opcional)"
          />

          <UploadImagesLabel>Carregar Imagens</UploadImagesLabel>
          <UploadImages onUpload={handleImagesUpload} />

          <ImagesContainer>
            {uploadedImages.map(image => (
              <ImageController
                key={image.id}
                url={image.preview}
                containerCustomStyle={{ marginRight: 10 }}
                isImageCover={image.name === coverImageName}
                handleRemoveImage={() => handleRemoveImageUploaded(image.id)}
                handleSetImageCover={() => handleSetImageCover(image.name)}
              />
            ))}

            {storagedImages.map(image => (
              <ImageController
                key={image.name}
                url={image.url}
                isImageCover={image.name === coverImageName}
                markedToRemove={imagesNameToRemove.includes(image.name)}
                containerCustomStyle={{ marginRight: 10 }}
                handleRemoveImage={() =>
                  handleMarkOrUnMarkToRemoveImageStoraged(image.name)
                }
                handleSetImageCover={() => handleSetImageCover(image.name)}
              />
            ))}
          </ImagesContainer>
        </FormContent>
      </Form>
    </Container>
  );
};

export default BvspServiceRegister;
