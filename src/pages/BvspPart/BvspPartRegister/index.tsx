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

import firebase from '../../../config/firebase';

import MessageAlert from '../../../utils/MessageAlert';
import MessageConfirmation from '../../../utils/MessageConfirmation';
import light from '../../../styles/themes/light';

import TextInput from '../../../components/Form/TextInput';
import Select from '../../../components/Form/SelectInput';
import Button from '../../../components/Form/Button';
import Load from '../../../components/Load';
import UploadImages from '../../../components/UploadImages';
import ImageController from '../../../components/ImageController';
import MachineCard from '../../../components/MachineCard';
import DepartmentCard from '../../../components/DepartmentCard';
import Modal from '../../../components/Modal';
import DepartmentSelectModal from '../../Department/DepartmentSelectModal';
import MachineSelectModal from '../../Machine/MachineSelectModal';

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
  DepartmentContainer,
  MachinesContainer,
  AddMachineButton,
} from './styles';

interface IFormData {
  oemcode: string;
  bvspcode: string;
  description: string;
  description_english: string;
  family: string;
}

interface IBvspPartData {
  oemcode: string;
  bvspcode: string;
  description: string;
  description_insensitive: string;
  description_english: string;
  description_insensitive_english: string;
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

interface IMachineData {
  id: string;
  description: string;
  departments: string[];
}

const BvspPartRegister: React.FC<IRouteParams> = ({ match }) => {
  const [loading, setLoading] = useState(true);
  const [initialDataForm, setInitialDataForm] = useState<IFormData>();
  const formRef = useRef<FormHandles>(null);
  const [uploadedImages, setUploadedImages] = useState<IImageFile[]>([]);
  const [storagedImages, setStoragedImages] = useState<IImageStoraged[]>([]);
  const [imagesNameToRemove, setImagesNameToRemove] = useState<string[]>([]);
  const [coverImageName, setCoverImageName] = useState<string>();
  const [families, setFamilies] = useState<IFamilySelect[]>([]);
  const [departmentSelectIsOpen, setDepartmentSelectIsOpen] = useState(false);
  const [machineSelectIsOpen, setMachineSelectIsOpen] = useState(false);
  const [departmentsSelected, setDepartmentsSelected] = useState<
    IDepartmentData[]
  >([]);
  const [machinesSelected, setMachinesSelected] = useState<IMachineData[]>([]);
  const [departmentSelectedMachine, setDepartmentSelectedMachine] = useState<
    string
  >();

  const history = useHistory();
  const { id: bvspPartId, action: formAction } = match.params;

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

  const handleBvspPartNew = useCallback(
    async (data: IFormData, departments: string[]) => {
      setLoading(true);

      const {
        oemcode,
        bvspcode,
        description,
        description_english,
        family,
      }: IFormData = data;

      const imagesURL = await handleGetUrlUploadImages(uploadedImages);

      const imageCoverData = imagesURL.filter(
        image => image.name === coverImageName,
      );

      const part: IBvspPartData = {
        oemcode,
        bvspcode,
        family,
        departments,
        machines: machinesSelected.map(machine => machine.id),
        description: description.trim(),
        description_insensitive: description.toLowerCase().trim(),
        description_english,
        description_insensitive_english: description_english
          .toLowerCase()
          .trim(),
        photos: imagesURL,
        photocover:
          imageCoverData.length > 0 ? imageCoverData[0] : imagesURL[0],
      };

      await firebase
        .firestore()
        .collection('parts')
        .add(part)
        .then(() => {
          MessageAlert('Cadastrado com sucesso!', 'success').then(() =>
            history.push('/bvsp-parts'),
          );
        })
        .catch(() => {
          MessageAlert('Não foi possível cadastrar!', 'error');
          setLoading(false);
        });
    },
    [
      history,
      uploadedImages,
      coverImageName,
      machinesSelected,
      handleGetUrlUploadImages,
    ],
  );

  const handleBvspPartUpdate = useCallback(
    async (id: string, data: IFormData, departments: string[]) => {
      setLoading(true);

      const {
        oemcode,
        bvspcode,
        description,
        description_english,
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

      const machine: IBvspPartData = {
        oemcode,
        bvspcode,
        family,
        departments,
        machines: machinesSelected.map(item => item.id),
        description: description.trim(),
        description_insensitive: description.toLowerCase().trim(),
        description_english,
        description_insensitive_english: description_english
          .toLowerCase()
          .trim(),
        photos: keptAndAddedImages,
        photocover:
          imageCoverData.length > 0 ? imageCoverData[0] : keptAndAddedImages[0],
      };

      await firebase
        .firestore()
        .collection('parts')
        .doc(id)
        .update(machine)
        .then(() => {
          MessageAlert('Atualizado com sucesso!', 'success').then(() =>
            history.push('/bvsp-parts'),
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
      machinesSelected,
      handleGetUrlUploadImages,
      handleRemoveFileImageStoraged,
    ],
  );

  const handleBvspPartDelete = useCallback(
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
          .collection('parts')
          .doc(id)
          .delete()
          .then(() => {
            MessageAlert('Removido com sucesso!', 'success').then(() =>
              history.push('/bvsp-parts'),
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
    history.push('/bvsp-parts');
  }, [history]);

  const handleFormSubmitData = useCallback(
    async (data: IFormData) => {
      const { bvspcode, oemcode } = data;

      try {
        if (formAction === 'delete') {
          handleBvspPartDelete(bvspPartId);
        } else if (departmentsSelected.length === 0) {
          MessageAlert('Selecione um departamento!', 'info');
        } else {
          const schema = Yup.object().shape({
            oemcode: Yup.string().required('Código OEM é obrigatório.'),
            bvspcode: Yup.string().required('Código BVSP é obrigatório.'),
            description: Yup.string().required(
              'O nome em Português é obrigatório.',
            ),
            description_english: Yup.string().required(
              'O nome em Inglês é obrigatório.',
            ),
          });

          await schema.validate(data);

          const departmentWithoutMachine = departmentsSelected.filter(
            department =>
              machinesSelected.filter(machine =>
                machine.departments.includes(department.id),
              ).length === 0,
          );

          const departmentsId = departmentsSelected.map(item => {
            return item.id;
          });

          if (formAction === 'new') {
            const partExistsTheSameBvspCode = await firebase
              .firestore()
              .collection('parts')
              .where('bvspcode', '==', bvspcode)
              .get()
              .then(async snapshot => !snapshot.empty);

            const partExistsTheSameOemCode =
              oemcode === '000000'
                ? false
                : await firebase
                    .firestore()
                    .collection('parts')
                    .where('oemcode', '==', oemcode)
                    .get()
                    .then(async snapshot => !snapshot.empty);

            if (partExistsTheSameBvspCode) {
              setLoading(false);
              MessageAlert(
                'Já existe uma peça com esse código BVSP cadastrado!',
                'info',
              );
            } else if (partExistsTheSameOemCode) {
              setLoading(false);
              MessageAlert(
                'Já existe uma peça com esse código OEM cadastrado!',
                'info',
              );
            } else if (uploadedImages.length === 0) {
              MessageAlert('Selecione ao menos uma imagem.', 'info');
            } else if (departmentWithoutMachine.length > 0) {
              MessageAlert(
                `Não há máquinas selecionadas para o departamento ${departmentWithoutMachine[0].description}.`,
                'info',
              );
            } else {
              handleBvspPartNew(data, departmentsId);
            }
          } else if (formAction === 'edit') {
            const imagesToKeep = storagedImages.filter(
              item => !imagesNameToRemove.includes(item.name),
            );

            const partExistsTheSameBvspCode = await firebase
              .firestore()
              .collection('machines')
              .where('bvspcode', '==', bvspcode)
              .get()
              .then(async snapshot =>
                snapshot.docs.filter(doc => doc.id !== bvspPartId),
              );

            const partExistsTheSameOemCode =
              oemcode === '000000'
                ? []
                : await firebase
                    .firestore()
                    .collection('parts')
                    .where('oemcode', '==', oemcode)
                    .get()
                    .then(async snapshot =>
                      snapshot.docs.filter(doc => doc.id !== bvspPartId),
                    );

            if (partExistsTheSameBvspCode.length > 0) {
              setLoading(false);
              MessageAlert(
                'Já existe uma peça com esse código BVSP cadastrado!',
                'info',
              );
            } else if (partExistsTheSameOemCode.length > 0) {
              setLoading(false);
              MessageAlert(
                'Já existe uma peça com esse código OEM cadastrado!',
                'info',
              );
            } else if (
              uploadedImages.length === 0 &&
              imagesToKeep.length === 0
            ) {
              MessageAlert('Selecione ao menos uma imagem.', 'info');
            } else if (departmentWithoutMachine.length > 0) {
              MessageAlert(
                `Não há máquinas selecionadas para o departamento ${departmentWithoutMachine[0].description}.`,
                'info',
              );
            } else {
              handleBvspPartUpdate(bvspPartId, data, departmentsId);
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
      bvspPartId,
      storagedImages,
      formAction,
      departmentsSelected,
      machinesSelected,
      handleBvspPartNew,
      handleBvspPartUpdate,
      handleBvspPartDelete,
    ],
  );

  const handleFetchBvspPartData = useCallback(async () => {
    const response = await firebase
      .firestore()
      .collection('parts')
      .doc(bvspPartId)
      .get()
      .then(snapshot => {
        const {
          oemcode,
          bvspcode,
          description,
          description_english,
          photos,
          photocover,
          family,
          departments: departmentsId,
          machines: machinesId,
        } = snapshot.data() as IBvspPartData;

        if (photos) {
          setStoragedImages(photos);
        }
        if (photocover) {
          setCoverImageName(photocover.name);
        }

        setInitialDataForm({
          oemcode,
          bvspcode,
          family,
          description,
          description_english,
        });

        return { departmentsId, machinesId };
      });

    const { departmentsId, machinesId } = response;

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

    await firebase
      .firestore()
      .collection('machines')
      .get()
      .then(snapshot => {
        const machineSelectedSaved = snapshot.docs
          .map(doc => {
            return {
              id: doc.id,
              description: String(doc.data().description),
              departments: doc.data().departments,
            };
          })
          .filter(doc => machinesId.includes(doc.id));

        setMachinesSelected(machineSelectedSaved);
      });

    setLoading(false);
  }, [bvspPartId]);

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

  const handleCloseMachineSelectModal = useCallback(() => {
    setMachineSelectIsOpen(false);
  }, []);

  const handleOpenMachineSelectModal = useCallback((departmentId: string) => {
    setDepartmentSelectedMachine(departmentId);
    setMachineSelectIsOpen(true);
  }, []);

  const handleMachineSelectedAdd = useCallback(
    (machine: IMachineData) => {
      const { id, description, departments } = machine;

      const alreadyAdded = machinesSelected.find(item => item.id === id);

      if (alreadyAdded) {
        MessageAlert('Esta máquina já está adicionada!', 'info');
      } else {
        setMachinesSelected(
          machinesSelected.concat({ id, description, departments }),
        );
      }
    },
    [machinesSelected],
  );

  const handleMachineSelectedRemove = useCallback(
    (id: string) => {
      setMachinesSelected(machinesSelected.filter(item => item.id !== id));
    },
    [machinesSelected],
  );

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
      const machineExists = machinesSelected.filter(machine =>
        machine.departments.includes(id),
      );

      if (machineExists.length > 0) {
        MessageAlert(
          'Este departamento possui máquina. Primeiro, remova as máquinas para excluír o departamento.',
          'info',
        );
      } else {
        setDepartmentsSelected(
          departmentsSelected.filter(item => item.id !== id),
        );
      }
    },
    [departmentsSelected, machinesSelected],
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
    if (bvspPartId) {
      handleFetchBvspPartData();
    } else {
      setLoading(false);
    }
  }, [handleFetchBvspPartData, bvspPartId, setLoading]);

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
          <Title>Cadastro de peça</Title>

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
            <TextInput
              type="text"
              name="oemcode"
              label="Código OEM"
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

            {departmentsSelected.map(department => (
              <DepartmentContainer key={department.id}>
                <DepartmentCard
                  title={department.description}
                  handleRemove={() =>
                    handleDepartmentSelectedRemove(department.id)}
                />

                <AddMachineButton
                  type="button"
                  color={light.colors.black}
                  onClick={() => handleOpenMachineSelectModal(department.id)}
                >
                  <MdAdd />
                  Adicionar Máquina
                </AddMachineButton>

                <MachinesContainer>
                  {machinesSelected
                    .filter(machine =>
                      machine.departments.includes(department.id),
                    )
                    .map(departmentMachine => (
                      <MachineCard
                        key={departmentMachine.id}
                        title={departmentMachine.description}
                        handleRemove={() =>
                          handleMachineSelectedRemove(departmentMachine.id)}
                      />
                    ))}
                </MachinesContainer>
              </DepartmentContainer>
            ))}
          </DepartmentsContainer>

          <Modal isOpen={departmentSelectIsOpen}>
            <DepartmentSelectModal
              handleCloseModal={handleCloseDepartmentSelectModal}
              handleDepartmentSelected={handleDepartmentSelectedAdd}
            />
          </Modal>

          <Modal isOpen={machineSelectIsOpen}>
            <MachineSelectModal
              handleCloseModal={handleCloseMachineSelectModal}
              handleMachineSelected={handleMachineSelectedAdd}
              departmentFilter={departmentSelectedMachine}
            />
          </Modal>
        </FormContent>
      </Form>
    </Container>
  );
};

export default BvspPartRegister;
