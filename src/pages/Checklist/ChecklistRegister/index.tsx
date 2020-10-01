import React, {
  useCallback,
  useState,
  useEffect,
  useRef,
  useMemo,
} from 'react';
import { FormHandles } from '@unform/core';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useHistory } from 'react-router-dom';
import {
  MdCheck,
  MdArrowBack,
  MdAdd,
  MdAddCircleOutline,
  MdPrint,
} from 'react-icons/md';
import { FaHandPaper } from 'react-icons/fa';

import * as Yup from 'yup';
import { uniqueId } from 'lodash';
import filesize from 'filesize';

import firebase from '../../../config/firebase';

import MessageAlert from '../../../utils/MessageAlert';
import MessageConfirmation from '../../../utils/MessageConfirmation';
import light from '../../../styles/themes/light';

import TextInput from '../../../components/Form/TextInput';
import Button from '../../../components/Form/Button';
import Load from '../../../components/Load';
import UploadImages from '../../../components/UploadImages';
import StepCard from '../../../components/StepCard';
import MachineCard from '../../../components/MachineCard';
import Modal from '../../../components/Modal';
import MachineSelectModal from '../../Machine/MachineSelectModal';
import ImageControllerBySteps from '../../../components/ImageControllerBySteps';

import {
  Container,
  Form,
  FormHeader,
  FormContent,
  Title,
  ButtonsContainer,
  UploadImagesLabel,
  ImagesContainer,
  MachinesHeader,
  MachineLabel,
  MachinesContainer,
  MachinesContent,
  ChecklistContainer,
  ChecklistHeader,
  ChecklistListTitle,
  ChecklistListSubTitle,
  ChecklistInputGroup,
  ButtonAddNewStep,
  TextInputStep,
  StepsContent,
  ButtonEditStep,
  StepWrapper,
} from './styles';

interface IFormData {
  description: string;
  description_english: string;
}

interface IChecklistData {
  description: string;
  description_insensitive: string;
  description_english: string;
  description_insensitive_english: string;
  photos: {
    name: string;
    step: number;
    url: string;
  }[];
  machines: string;
  steps: IStep[];
}

interface IStep {
  description: string;
  description_english: string;
  order: number;
}

interface IImageStoraged {
  url: string;
  name: string;
  step: number;
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
  step: number;
}

interface IMachineData {
  id: string;
  description: string;
}

const ChecklistRegister: React.FC<IRouteParams> = ({ match }) => {
  const [loading, setLoading] = useState(true);
  const [initialDataForm, setInitialDataForm] = useState<IFormData>();
  const formRef = useRef<FormHandles>(null);
  const [uploadedImages, setUploadedImages] = useState<IImageFile[]>([]);
  const [storagedImages, setStoragedImages] = useState<IImageStoraged[]>([]);
  const [imagesNameToRemove, setImagesNameToRemove] = useState<string[]>([]);
  const [machineSelectIsOpen, setMachineSelectIsOpen] = useState(false);
  const [steps, setSteps] = useState<IStep[]>([]);
  const [actionEdit, setActionEdit] = useState(false);
  const [indexStepForEdit, setIndexStepForEdit] = useState<Number>();

  const [machinesSelected, setMachinesSelected] = useState<IMachineData[]>([]);

  const history = useHistory();
  const { id: checklistId, action: formAction } = match.params;

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
            await snapshot.ref.getDownloadURL().then(downloadURL =>
              urlList.push({
                url: downloadURL,
                name: photo.name,
                step: photo.step,
              }),
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

  const handleChecklistNew = useCallback(
    async (data: IFormData) => {
      setLoading(true);

      const { description, description_english }: IFormData = data;

      const imagesURL = await handleGetUrlUploadImages(uploadedImages);

      const checkList: IChecklistData = {
        description,
        description_insensitive: description.toLowerCase().trim(),
        description_english,
        description_insensitive_english: description_english
          .toLowerCase()
          .trim(),
        photos: imagesURL,
        machines: machinesSelected[0].id,
        steps,
      };

      await firebase
        .firestore()
        .collection('checklists')
        .add(checkList)
        .then(() => {
          MessageAlert('Cadastrado com sucesso!', 'success').then(() =>
            history.push('/checklists'),
          );
        })
        .catch(() => {
          MessageAlert('Não foi possível cadastrar!', 'error');
          setLoading(false);
        });
    },
    [
      handleGetUrlUploadImages,
      history,
      steps,
      machinesSelected,
      uploadedImages,
    ],
  );

  const handleImageFileStorage = useCallback(async (images: string[]) => {
    images.forEach(async image => {
      await firebase.storage().ref('images').child(image).delete().then();
    });
  }, []);

  const handleChecklistUpdate = useCallback(
    async (id: string, data: IFormData) => {
      setLoading(true);

      const { description, description_english }: IFormData = data;

      const keepPhotos = storagedImages.filter(
        item => !imagesNameToRemove.includes(item.name),
      );

      await handleImageFileStorage(imagesNameToRemove);
      const newImages = await handleGetUrlUploadImages(uploadedImages);

      const checklist: IChecklistData = {
        description,
        description_insensitive: description.toLowerCase().trim(),
        description_english,
        description_insensitive_english: description_english
          .toLowerCase()
          .trim(),
        photos: [...newImages, ...keepPhotos],
        machines: machinesSelected[0].id,
        steps,
      };

      await firebase
        .firestore()
        .collection('checklists')
        .doc(id)
        .update(checklist)
        .then(() => {
          MessageAlert('Cadastrado com sucesso!', 'success').then(() =>
            history.push('/checklists'),
          );
        })
        .catch(() => {
          MessageAlert('Não foi possível cadastrar!', 'error');
          setLoading(false);
        });
    },
    [
      handleGetUrlUploadImages,
      handleImageFileStorage,
      imagesNameToRemove,
      storagedImages,
      uploadedImages,
      history,
      steps,
      machinesSelected,
    ],
  );

  const handleChecklistDelete = useCallback(
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
          .collection('checklists')
          .doc(id)
          .delete()
          .then(() => {
            MessageAlert('Removido com sucesso!', 'success').then(() =>
              history.push('/checklists'),
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
    history.push('/checklists');
  }, [history]);

  const handleFormSubmitData = useCallback(
    async (data: IFormData) => {
      const { description } = data;
      const descriptionFormatted = description.trim().toLowerCase();

      try {
        if (formAction === 'delete') {
          handleChecklistDelete(checklistId);
        } else if (machinesSelected.length === 0) {
          MessageAlert('Selecione ao menos uma máquina.', 'info');
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
            const checkListExistsTheSamename = await firebase
              .firestore()
              .collection('checklists')
              .where('description_insensitive', '==', descriptionFormatted)
              .get()
              .then(async snapshot => !snapshot.empty);

            if (checkListExistsTheSamename) {
              setLoading(false);
              MessageAlert(
                'Já existe um Checklist com esse nome cadastrado!',
                'info',
              );
            } else {
              handleChecklistNew(data);
            }
          } else if (formAction === 'edit') {
            const checkListExistsTheSamename = await firebase
              .firestore()
              .collection('checklists')
              .where('description_insensitive', '==', descriptionFormatted)
              .get()
              .then(async snapshot =>
                snapshot.docs.filter(doc => doc.id !== checklistId),
              );

            if (checkListExistsTheSamename.length > 0) {
              setLoading(false);
              MessageAlert(
                'Já existe um Checklist com esse nome cadastrado!',
                'info',
              );
            } else {
              handleChecklistUpdate(checklistId, data);
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
      checklistId,
      formAction,
      handleChecklistNew,
      handleChecklistUpdate,
      handleChecklistDelete,
      machinesSelected.length,
    ],
  );

  const handleFetchChecklistData = useCallback(async () => {
    const machinesId = await firebase
      .firestore()
      .collection('checklists')
      .doc(checklistId)
      .get()
      .then(snapshot => {
        const {
          description,
          description_english,
          photos,
          steps: StepsStoraged,
          machines,
        } = snapshot.data() as IChecklistData;

        setSteps(StepsStoraged);

        if (photos) {
          setStoragedImages(photos);
        }

        setInitialDataForm({
          description,
          description_english,
        });

        return machines;
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
  }, [checklistId]);

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

  const handleCloseMachineSelectModal = useCallback(() => {
    setMachineSelectIsOpen(false);
  }, []);

  const handleOpenMachineSelectModal = useCallback(() => {
    setMachineSelectIsOpen(true);
  }, []);

  const handleRemoveStep = useCallback(
    (stepIndex: Number) => {
      const stepsUpdated = steps.filter(item => item.order !== stepIndex);

      const orderUpdated = stepsUpdated.map((item, index) => ({
        order: index,
        description: item.description,
        description_english: item.description_english,
      }));

      setSteps(orderUpdated);
    },
    [steps],
  );

  const handleLoadStepDataEdit = useCallback((index: Number, step: IStep) => {
    formRef.current?.setFieldValue('stepDescriptionEglish', '');
    formRef.current?.setFieldValue('stepDescriptionPortuguese', '');

    formRef.current?.setFieldValue(
      'stepDescriptionPortuguese',
      step.description,
    );
    formRef.current?.setFieldValue(
      'stepDescriptionEglish',
      step.description_english,
    );

    setActionEdit(true);
    setIndexStepForEdit(index);
  }, []);

  const handleAddStep = useCallback(() => {
    const stepDescriptionPortuguese = formRef.current?.getFieldValue(
      'stepDescriptionPortuguese',
    );
    const stepDescriptionEglish = formRef.current?.getFieldValue(
      'stepDescriptionEglish',
    );

    if (!stepDescriptionPortuguese) {
      MessageAlert(
        'É necessário informar o novo item em Português para adicionar no checklist.',
        'info',
      );
    } else if (!stepDescriptionEglish) {
      MessageAlert(
        'É necessário informar o novo item em Inglês para adicionar no checklist.',
        'info',
      );
    } else {
      const newStep = {
        order: steps.length,
        description: stepDescriptionPortuguese,
        description_english: stepDescriptionEglish,
      };

      setSteps(steps.concat(newStep));

      formRef.current?.setFieldValue('stepDescriptionEglish', '');
      formRef.current?.setFieldValue('stepDescriptionPortuguese', '');
      formRef.current?.getFieldRef('stepDescriptionPortuguese').focus();
    }
  }, [steps]);

  const handleEditStepSave = useCallback(() => {
    const stepDescriptionPortuguese = formRef.current?.getFieldValue(
      'stepDescriptionPortuguese',
    );
    const stepDescriptionEglish = formRef.current?.getFieldValue(
      'stepDescriptionEglish',
    );

    if (!stepDescriptionPortuguese) {
      MessageAlert(
        'É necessário informar o novo item em Português para adicionar no checklist.',
        'info',
      );
    } else if (!stepDescriptionEglish) {
      MessageAlert(
        'É necessário informar o novo item em Inglês para adicionar no checklist.',
        'info',
      );
    } else {
      if (indexStepForEdit && indexStepForEdit >= 0) {
        const stepUpdated = steps.map((step, index) => {
          if (index === indexStepForEdit) {
            return {
              order: Number(indexStepForEdit),
              description: String(stepDescriptionPortuguese),
              description_english: String(stepDescriptionEglish),
            };
          }
          return {
            order: step.order,
            description: step.description,
            description_english: step.description_english,
          };
        });

        setSteps(stepUpdated);
      }

      setActionEdit(false);
      formRef.current?.setFieldValue('stepDescriptionEglish', '');
      formRef.current?.setFieldValue('stepDescriptionPortuguese', '');
      formRef.current?.getFieldRef('stepDescriptionPortuguese').focus();
    }
  }, [steps, indexStepForEdit]);

  const handleChangeUploadedPhotoByStep = useCallback(
    (indexStep: number, numberStep: number) => {
      if (numberStep >= steps.length && numberStep <= steps.length) {
        MessageAlert(`Não há um passo ${numberStep} neste Checklist.`, 'info');
      } else {
        uploadedImages[indexStep].step = numberStep;
      }
    },
    [steps.length, uploadedImages],
  );

  const handleChangeStoragePhotoByStep = useCallback(
    (indexStep: number, numberStep: number) => {
      if (numberStep >= steps.length && numberStep <= steps.length) {
        MessageAlert(`Não há um passo ${numberStep} neste Checklist.`, 'info');
      } else {
        const updated = Array.from(storagedImages);

        updated[indexStep].step = numberStep;
        setStoragedImages(updated);
      }
    },
    [steps.length, storagedImages],
  );

  const handleOrderStepChanged = useCallback(
    payload => {
      const { destination, source } = payload;

      if (!destination) {
        return;
      }

      if (
        destination.draggableId === source.droppableId &&
        destination.index === source.index
      ) {
        return;
      }

      const oldStep = Array.from(steps);
      const [stepMoved] = oldStep.splice(source.index, 1);
      oldStep.splice(destination.index, 0, stepMoved);

      const newStep = oldStep.map(
        ({ order, description, description_english }, index) => {
          return {
            order: index,
            description,
            description_english,
          };
        },
      );

      setSteps(newStep);
    },
    [steps],
  );

  const handleMachineSelectedAdd = useCallback(
    (machine: IMachineData) => {
      const { id, description } = machine;

      const alreadyAdded = machinesSelected.find(item => item.id === id);

      if (alreadyAdded) {
        MessageAlert('Esta máquina já está adicionada!', 'info');
      } else {
        setMachinesSelected([{ id, description }]);
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

  const handleDataPdf = useCallback(() => {
    history.push(`/checklist-pdf/${machinesSelected[0].id}`);
  }, [history, machinesSelected]);

  useEffect(() => {
    if (checklistId) {
      handleFetchChecklistData();
    } else {
      setLoading(false);
    }
  }, [handleFetchChecklistData, checklistId, setLoading]);

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
          <Title>Cadastro de checklist</Title>

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
              onClick={handleDataPdf}
            >
              <MdPrint />
              PDF
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

          <MachinesContainer>
            <MachinesHeader>
              <MachineLabel>Máquina vinculada ao Checklist</MachineLabel>

              <Button
                type="button"
                color={light.colors.success}
                onClick={handleOpenMachineSelectModal}
              >
                <MdAdd />
                Adicionar Máquina
              </Button>
            </MachinesHeader>
            <MachinesContent>
              {machinesSelected.map(machine => (
                <MachineCard
                  key={machine.id}
                  title={machine.description}
                  handleRemove={() => handleMachineSelectedRemove(machine.id)}
                />
              ))}
            </MachinesContent>
          </MachinesContainer>

          <UploadImagesLabel>Carregar Imagens</UploadImagesLabel>
          <UploadImages onUpload={handleImagesUpload} />

          <ImagesContainer>
            {uploadedImages.map((image, index) => (
              <ImageControllerBySteps
                key={image.id}
                min={0}
                max={steps.length}
                url={image.preview}
                value={image.step}
                containerCustomStyle={{ marginRight: 10 }}
                handleRemoveImage={() => handleRemoveImageUploaded(image.id)}
                onChange={e =>
                  handleChangeUploadedPhotoByStep(index, Number(e.target.value))
                }
              />
            ))}

            {storagedImages.map((image, index) => (
              <ImageControllerBySteps
                key={image.name}
                min={0}
                max={10}
                url={image.url}
                value={image.step}
                containerCustomStyle={{ marginRight: 10 }}
                markedToRemove={imagesNameToRemove.includes(image.name)}
                handleRemoveImage={() =>
                  handleMarkOrUnMarkToRemoveImageStoraged(image.name)
                }
                onChange={e =>
                  handleChangeStoragePhotoByStep(index, Number(e.target.value))
                }
              />
            ))}
          </ImagesContainer>

          <ChecklistContainer>
            <TextInputStep
              name="stepDescriptionPortuguese"
              label="Descrição do Item em Português"
            />

            <ChecklistInputGroup>
              <TextInputStep
                name="stepDescriptionEglish"
                label="Descrição do Item em Inglês"
              />
              <ButtonAddNewStep
                type="button"
                title="Adicionar uma nova etapa"
                onClick={handleAddStep}
              >
                <MdAddCircleOutline />
              </ButtonAddNewStep>
              {actionEdit && (
                <ButtonEditStep
                  title="Salvar a etapa editada"
                  type="button"
                  onClick={handleEditStepSave}
                >
                  <MdCheck />
                </ButtonEditStep>
              )}
            </ChecklistInputGroup>

            <ChecklistHeader>
              <ChecklistListTitle>
                Lista de Itens dos Checklist
              </ChecklistListTitle>
              <ChecklistListSubTitle>
                Você pode mudar a ordem arrastando e soltando.
                <FaHandPaper />
              </ChecklistListSubTitle>
            </ChecklistHeader>

            <DragDropContext onDragEnd={handleOrderStepChanged}>
              <Droppable droppableId="droppable">
                {droppableProvided => (
                  <StepsContent
                    ref={droppableProvided.innerRef}
                    {...droppableProvided.droppableProps}
                  >
                    {steps.map((step, index) => (
                      <Draggable
                        key={step.order}
                        draggableId={String(step.order)}
                        index={index}
                      >
                        {draggableProvided => (
                          <StepWrapper
                            {...draggableProvided.draggableProps}
                            {...draggableProvided.dragHandleProps}
                            ref={draggableProvided.innerRef}
                          >
                            <StepCard
                              key={step.order}
                              step={step.order}
                              title={step.description}
                              handleEditStep={() =>
                                handleLoadStepDataEdit(index, step)}
                              handleRemoveStep={() => handleRemoveStep(index)}
                            />
                          </StepWrapper>
                        )}
                      </Draggable>
                    ))}
                    {droppableProvided.placeholder}
                  </StepsContent>
                )}
              </Droppable>
            </DragDropContext>
          </ChecklistContainer>

          <Modal isOpen={machineSelectIsOpen}>
            <MachineSelectModal
              handleCloseModal={handleCloseMachineSelectModal}
              handleMachineSelected={handleMachineSelectedAdd}
            />
          </Modal>
        </FormContent>
      </Form>
    </Container>
  );
};

export default ChecklistRegister;
