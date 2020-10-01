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

import firebase from '../../../config/firebase';

import MessageAlert from '../../../utils/MessageAlert';
import MessageConfirmation from '../../../utils/MessageConfirmation';
import light from '../../../styles/themes/light';

import TextInput from '../../../components/Form/TextInput';
import Button from '../../../components/Form/Button';
import Load from '../../../components/Load';

import {
  Container,
  Form,
  FormHeader,
  FormContent,
  Title,
  ButtonsContainer,
} from './styles';

interface IFormData {
  description: string;
  description_english: string;
}

interface IFamilyData {
  description: string;
  description_insensitive: string;
  description_english: string;
  description_insensitive_english: string;
}

interface IRouteParams {
  match: {
    params: {
      id: string;
      action: string;
    };
  };
}

const FamilyRegister: React.FC<IRouteParams> = ({ match }) => {
  const [loading, setLoading] = useState(true);
  const [initialDataForm, setInitialDataForm] = useState<IFormData>();
  const formRef = useRef<FormHandles>(null);

  const history = useHistory();
  const { id: familyId, action: formAction } = match.params;

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

  const handleFamilyNew = useCallback(
    async (data: IFormData) => {
      setLoading(true);

      const { description, description_english }: IFormData = data;

      const family: IFamilyData = {
        description: description.trim(),
        description_insensitive: description.toLowerCase().trim(),
        description_english,
        description_insensitive_english: description_english
          .toLowerCase()
          .trim(),
      };

      await firebase
        .firestore()
        .collection('families')
        .add(family)
        .then(() => {
          MessageAlert('Cadastrado com sucesso!', 'success').then(() =>
            history.push('/families'),
          );
        })
        .catch(() => {
          MessageAlert('Não foi possível cadastrar!', 'error');
          setLoading(false);
        });
    },
    [history],
  );

  const handleFamilyUpdate = useCallback(
    async (id: string, data: IFormData) => {
      setLoading(true);

      const { description, description_english }: IFormData = data;

      const family: IFamilyData = {
        description: description.trim(),
        description_insensitive: description.toLowerCase().trim(),
        description_english,
        description_insensitive_english: description_english
          .toLowerCase()
          .trim(),
      };

      await firebase
        .firestore()
        .collection('families')
        .doc(id)
        .update(family)
        .then(() => {
          MessageAlert('Atualizado com sucesso!', 'success').then(() =>
            history.push('/families'),
          );
        })
        .catch(() => {
          MessageAlert('Não foi possível atualizado!', 'error');
          setLoading(false);
        });
    },
    [history],
  );

  const handleFamilyDelete = useCallback(
    async (id: string) => {
      const { isConfirmed } = await MessageConfirmation(
        'Você tem certeza que deseja remover?',
        'Sim. Remover!',
        'question',
      );

      if (isConfirmed) {
        setLoading(true);

        await firebase
          .firestore()
          .collection('families')
          .doc(id)
          .delete()
          .then(() => {
            MessageAlert('Removido com sucesso!', 'success').then(() =>
              history.push('/families'),
            );
          })
          .catch(() => {
            MessageAlert('Não foi possível remover!', 'error');
            setLoading(false);
          });
      }
    },
    [history],
  );

  const handleBack = useCallback(() => {
    history.push('/families');
  }, [history]);

  const handleFormSubmitData = useCallback(
    async (data: IFormData) => {
      const { description } = data;

      try {
        if (formAction === 'delete') {
          handleFamilyDelete(familyId);
        } else {
          const schema = Yup.object().shape({
            description: Yup.string().required(
              'Descrição em Português é obrigatório.',
            ),
            description_english: Yup.string().required(
              'Descrição em Inglês é obrigatório.',
            ),
          });

          await schema.validate(data);

          if (formAction === 'new') {
            const familyExists = await firebase
              .firestore()
              .collection('families')
              .where(
                'description_insensitive',
                '==',
                description.toLowerCase().trim(),
              )
              .get()
              .then(async snapshot => !snapshot.empty);

            if (familyExists) {
              setLoading(false);
              MessageAlert(
                'Já existe uma família com essa descrição cadastrada!',
                'info',
              );
            } else {
              handleFamilyNew(data);
            }
          } else if (formAction === 'edit') {
            const familyExists = await firebase
              .firestore()
              .collection('families')
              .where(
                'description_insensitive',
                '==',
                description.toLowerCase().trim(),
              )
              .get()
              .then(async snapshot =>
                snapshot.docs.filter(doc => doc.id !== match.params.id),
              );

            if (familyExists.length > 0) {
              setLoading(false);
              MessageAlert(
                'Já existe uma família com essa descrição cadastrada!',
                'info',
              );
            } else {
              handleFamilyUpdate(familyId, data);
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
      familyId,
      formAction,
      handleFamilyDelete,
      handleFamilyNew,
      handleFamilyUpdate,
      match.params.id,
    ],
  );

  const handleFetchFamilyData = useCallback(async () => {
    await firebase
      .firestore()
      .collection('families')
      .doc(familyId)
      .get()
      .then(snapshot => {
        const {
          description,
          description_english,
        } = snapshot.data() as IFormData;

        setInitialDataForm({
          description,
          description_english,
        });
      })
      .catch(() => MessageAlert('Não foi possível carregar os dados!', 'error'))
      .finally(() => setLoading(false));
  }, [familyId]);

  useEffect(() => {
    if (familyId) {
      handleFetchFamilyData();
    } else {
      setLoading(false);
    }
  }, [handleFetchFamilyData, familyId, setLoading]);

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
          <Title>Cadastro de Família</Title>

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
        </FormContent>
      </Form>
    </Container>
  );
};

export default FamilyRegister;
