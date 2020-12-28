import React, {
  useCallback,
  useState,
  useEffect,
  useRef,
  useMemo,
} from 'react';
import { FormHandles } from '@unform/core';
import { useHistory } from 'react-router-dom';
import { MdCheck, MdArrowBack, MdAdd } from 'react-icons/md';
import * as Yup from 'yup';
import { uniqueId } from 'lodash';
import filesize from 'filesize';

import firebase from '../../../../config/firebase';

import MessageAlert from '../../../../utils/MessageAlert';
import MessageConfirmation from '../../../../utils/MessageConfirmation';
import light from '../../../../styles/themes/light';

import TextAreaInput from '../../../../components/Form/TextAreaInput';
import TextInput from '../../../../components/Form/TextInput';
import Select from '../../../../components/Form/SelectInput';
import Button from '../../../../components/Form/Button';
import Load from '../../../../components/Load';
import UploadImages from '../../../../components/UploadImages';
import ImageController from '../../../../components/ImageController';

import Modal from '../../../../components/Modal';
import DepartmentSelectModal from '../../../Department/DepartmentSelectModal';

import {
  Container,
  Form,
  FormHeader,
  FormContent,
  Title,
  ButtonsContainer,
  UploadImagesLabel,
  ImagesContainer,
  InputsColumnContainer,
  DepartmentsContainer,
  DepartmentsHeader,
  DepartmentLabel,
  DepartmentCard,
} from './styles';

interface IFormData {
  bvspcode: string;
  description: string;
  description_english: string;
  about: string;
  about_english: string;
  family: string;
}

interface IBvspMachineData {
  bvspcode: string;
  description: string;
  description_insensitive: string;
  description_english: string;
  description_insensitive_english: string;
  about: string;
  about_english: string;
  photos: IImageStoraged[];
  photocover: IImageStoraged;
  family: string;
  departments: string[];
  type: 'bvsp-machine';
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

interface IFamilySelect {
  value: string;
  label: string;
}

interface IDepartmentData {
  id: string;
  description: string;
}

const BvspMachineRegister: React.FC<IRouteParams> = ({ match }) => {
  const [loading, setLoading] = useState(true);
  const [initialDataForm, setInitialDataForm] = useState<IFormData>();
  const formRef = useRef<FormHandles>(null);
  const [uploadedImages, setUploadedImages] = useState<IImageFile[]>([]);
  const [storagedImages, setStoragedImages] = useState<IImageStoraged[]>([]);
  const [imagesNameToRemove, setImagesNameToRemove] = useState<string[]>([]);
  const [coverImageName, setCoverImageName] = useState<string>();
  const [families, setFamilies] = useState<IFamilySelect[]>([]);
  const [departmentSelectIsOpen, setDepartmentSelectIsOpen] = useState(false);
  const [departmentsSelected, setDepartmentsSelected] = useState<
    IDepartmentData[]
  >([]);

  const history = useHistory();
  const { id: bvspMachineId, action: formAction } = match.params;

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

  const handleBvspMachineNew = useCallback(
    async (data: IFormData, departments: string[]) => {
      setLoading(true);

      const {
        bvspcode,
        description,
        description_english,
        about,
        about_english,
        family,
      }: IFormData = data;

      const imagesURL = await handleGetUrlUploadImages(uploadedImages);

      const imageCoverData = imagesURL.filter(
        image => image.name === coverImageName,
      );

      const machine: IBvspMachineData = {
        type: 'bvsp-machine',
        bvspcode,
        family,
        departments,
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
      };

      await firebase
        .firestore()
        .collection('machines')
        .add(machine)
        .then(() => {
          MessageAlert('Cadastrado com sucesso!', 'success').then(() =>
            history.push('/bvsp-machines'),
          );
        })
        .catch(() => {
          MessageAlert('Não foi possível cadastrar!', 'error');
          setLoading(false);
        });
    },
    [history, handleGetUrlUploadImages, uploadedImages, coverImageName],
  );

  const handleBvspMachineUpdate = useCallback(
    async (id: string, data: IFormData, departments: string[]) => {
      setLoading(true);

      const {
        bvspcode,
        description,
        description_english,
        about,
        about_english,
        family,
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

      const machine: IBvspMachineData = {
        type: 'bvsp-machine',
        bvspcode,
        family,
        departments,
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
        .collection('machines')
        .doc(id)
        .update(machine)
        .then(() => {
          MessageAlert('Atualizado com sucesso!', 'success').then(() =>
            history.push('/bvsp-machines'),
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

  const handleBvspMachineDelete = useCallback(
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
          .collection('machines')
          .doc(id)
          .delete()
          .then(() => {
            MessageAlert('Removido com sucesso!', 'success').then(() =>
              history.push('/bvsp-machines'),
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
    history.push('/bvsp-machines');
  }, [history]);

  const handleFormSubmitData = useCallback(
    async (data: IFormData) => {
      const { bvspcode, description } = data;

      try {
        if (formAction === 'delete') {
          handleBvspMachineDelete(bvspMachineId);
        } else if (departmentsSelected.length === 0) {
          MessageAlert('Selecione um departamento!', 'info');
        } else {
          const schema = Yup.object().shape({
            bvspcode: Yup.string().required('Código BVSP é obrigatório.'),
            description: Yup.string().required(
              'O nome em Português é obrigatório.',
            ),
            description_english: Yup.string().required(
              'O nome em Inglês é obrigatório.',
            ),
          });

          await schema.validate(data);

          const departmentsId = departmentsSelected.map(item => {
            return item.id;
          });

          if (formAction === 'new') {
            const machineExistsTheSameBvspCode = await firebase
              .firestore()
              .collection('machines')
              .where('bvspcode', '==', bvspcode)
              .get()
              .then(async snapshot => !snapshot.empty);

            const machineExistsTheSameName = await firebase
              .firestore()
              .collection('machines')
              .where(
                'description_insensitive',
                '==',
                description.toLowerCase().trim(),
              )
              .get()
              .then(async snapshot => !snapshot.empty);

            if (machineExistsTheSameBvspCode) {
              setLoading(false);
              MessageAlert(
                'Já existe uma máquina da BVSP com esse código BVSP cadastrado!',
                'info',
              );
            } else if (machineExistsTheSameName) {
              setLoading(false);
              MessageAlert(
                'Já existe uma máquina da BVSP com esse nome cadastrado!',
                'info',
              );
            } else if (uploadedImages.length === 0) {
              MessageAlert('Selecione ao menos uma imagem.', 'info');
            } else {
              handleBvspMachineNew(data, departmentsId);
            }
          } else if (formAction === 'edit') {
            const imagesToKeep = storagedImages.filter(
              item => !imagesNameToRemove.includes(item.name),
            );

            const machineExistsTheSameBvspCode = await firebase
              .firestore()
              .collection('machines')
              .where('bvspcode', '==', bvspcode)
              .get()
              .then(async snapshot =>
                snapshot.docs.filter(doc => doc.id !== bvspMachineId),
              );

            const machineExistsTheSameName = await firebase
              .firestore()
              .collection('machines')
              .where(
                'description_insensitive',
                '==',
                description.toLowerCase().trim(),
              )
              .get()
              .then(async snapshot =>
                snapshot.docs.filter(doc => doc.id !== bvspMachineId),
              );

            if (machineExistsTheSameBvspCode.length > 0) {
              setLoading(false);
              MessageAlert(
                'Já existe uma máquina BVSP com esse código BVSP cadastrado!',
                'info',
              );
            } else if (machineExistsTheSameName.length > 0) {
              setLoading(false);
              MessageAlert(
                'Já existe uma máquina BVSP com esse nome cadastrado!',
                'info',
              );
            } else if (
              uploadedImages.length === 0 &&
              imagesToKeep.length === 0
            ) {
              MessageAlert('Selecione ao menos uma imagem.', 'info');
            } else {
              handleBvspMachineUpdate(bvspMachineId, data, departmentsId);
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
      bvspMachineId,
      storagedImages,
      formAction,
      departmentsSelected,
      handleBvspMachineNew,
      handleBvspMachineUpdate,
      handleBvspMachineDelete,
    ],
  );

  const handleFetchBvspMachineData = useCallback(async () => {
    const departmentsId = await firebase
      .firestore()
      .collection('machines')
      .doc(bvspMachineId)
      .get()
      .then(snapshot => {
        const {
          bvspcode,
          description,
          description_english,
          about,
          about_english,
          photos,
          photocover,
          family,
          departments: departmentMachine,
        } = snapshot.data() as IBvspMachineData;

        if (photos) {
          setStoragedImages(photos);
        }
        if (photocover) {
          setCoverImageName(photocover.name);
        }

        setInitialDataForm({
          bvspcode,
          family,
          description,
          description_english,
          about,
          about_english,
        });

        return departmentMachine;
      });

    await firebase
      .firestore()
      .collection('departments')
      .get()
      .then(snapshot => {
        const departmentSelectedSaved = snapshot.docs
          .map(doc => {
            return {
              id: doc.id,
              description: String(doc.data().description),
            };
          })
          .filter(doc => departmentsId.includes(doc.id));

        setDepartmentsSelected(departmentSelectedSaved);
      });

    setLoading(false);
  }, [bvspMachineId]);

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

  const handleCloseDepartmentSelectModal = useCallback(() => {
    setDepartmentSelectIsOpen(false);
  }, []);

  const handleOpenDepartmentSelectModal = useCallback(() => {
    setDepartmentSelectIsOpen(true);
  }, []);

  const handleDepartmentSelectedAdd = useCallback(
    (department: IDepartmentData) => {
      const { id, description } = department;

      const alreadyAdded = departmentsSelected.find(item => item.id === id);

      if (alreadyAdded) {
        MessageAlert('Este departamento já está adicionado!', 'info');
      } else {
        setDepartmentsSelected(departmentsSelected.concat({ id, description }));
      }
    },
    [departmentsSelected],
  );

  const handleDepartmentSelectedRemove = useCallback(
    (id: string) => {
      setDepartmentsSelected(
        departmentsSelected.filter(item => item.id !== id),
      );
    },
    [departmentsSelected],
  );

  useEffect(() => {
    firebase
      .firestore()
      .collection('families')
      .orderBy('description_insensitive')
      .get()
      .then(snapshot => {
        const dataFormatted = snapshot.docs.map(doc => {
          return { value: doc.id, label: String(doc.data().description) };
        });

        setFamilies(dataFormatted);
      });
  }, []);

  useEffect(() => {
    if (bvspMachineId) {
      handleFetchBvspMachineData();
    } else {
      setLoading(false);
    }
  }, [handleFetchBvspMachineData, bvspMachineId, setLoading]);

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
          <Title>Cadastro de máquina BVSP</Title>

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
          <InputsColumnContainer>
            <TextInput
              type="text"
              name="bvspcode"
              label="Código BVSP"
              required
              containerCustomStyle={{ flex: 1 }}
            />
            <Select name="family" label="Família" options={families} />
          </InputsColumnContainer>

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

          <DepartmentsContainer>
            <DepartmentsHeader>
              <DepartmentLabel>Departamentos</DepartmentLabel>

              <Button
                type="button"
                color={light.colors.success}
                onClick={handleOpenDepartmentSelectModal}
              >
                <MdAdd />
                Adicionar Departamento
              </Button>
            </DepartmentsHeader>

            {departmentsSelected.map(({ id, description }) => (
              <DepartmentCard
                key={id}
                title={description}
                handleRemove={() => handleDepartmentSelectedRemove(id)}
              />
            ))}
          </DepartmentsContainer>

          <Modal isOpen={departmentSelectIsOpen}>
            <DepartmentSelectModal
              handleCloseModal={handleCloseDepartmentSelectModal}
              handleDepartmentSelected={handleDepartmentSelectedAdd}
            />
          </Modal>
        </FormContent>
      </Form>
    </Container>
  );
};

export default BvspMachineRegister;
