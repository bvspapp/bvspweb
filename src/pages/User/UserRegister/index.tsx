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
  name: string;
  email: string;
  company: string;
  city: string;
  accesscode: string;
}

interface IUserData {
  name: string;
  name_insensitive: string;
  city: string;
  company: string;
  email: string;
  accesscode: string;
}

interface IRouteParams {
  match: {
    params: {
      id: string;
      action: string;
    };
  };
}

const UserRegister: React.FC<IRouteParams> = ({ match }) => {
  const [loading, setLoading] = useState(true);
  const [initialDataForm, setInitialDataForm] = useState<IFormData>();
  const formRef = useRef<FormHandles>(null);

  const history = useHistory();
  const { id: userId, action: formAction } = match.params;

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

  const handleUserNew = useCallback(
    async (data: IFormData) => {
      setLoading(true);

      const { name, city, company, email, accesscode }: IFormData = data;

      const user: IUserData = {
        name: name.trim(),
        name_insensitive: name.toLowerCase().trim(),
        city: city.toLowerCase().trim(),
        company: company.toLowerCase().trim(),
        email: email.toLowerCase().trim(),
        accesscode: accesscode.toLowerCase().trim(),
      };

      await firebase
        .firestore()
        .collection('users')
        .add(user)
        .then(() => {
          MessageAlert('Cadastrado com sucesso!', 'success').then(() =>
            history.push('/users'),
          );
        })
        .catch(() => {
          MessageAlert('Não foi possível cadastrar!', 'error');
          setLoading(false);
        });
    },
    [history],
  );

  const handleUserUpdate = useCallback(
    async (id: string, data: IFormData) => {
      setLoading(true);

      const { name, city, company, email, accesscode }: IFormData = data;

      const user: IUserData = {
        name: name.trim(),
        name_insensitive: name.toLowerCase().trim(),
        city: city.toLowerCase().trim(),
        company: company.toLowerCase().trim(),
        email: email.toLowerCase().trim(),
        accesscode: accesscode.toLowerCase().trim(),
      };

      await firebase
        .firestore()
        .collection('users')
        .doc(id)
        .update(user)
        .then(() => {
          MessageAlert('Atualizado com sucesso!', 'success').then(() =>
            history.push('/users'),
          );
        })
        .catch(() => {
          MessageAlert('Não foi possível atualizado!', 'error');
          setLoading(false);
        });
    },
    [history],
  );

  const handleUserDelete = useCallback(
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
          .collection('users')
          .doc(id)
          .delete()
          .then(() => {
            MessageAlert('Removido com sucesso!', 'success').then(() =>
              history.push('/users'),
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
    history.push('/users');
  }, [history]);

  const handleFormSubmitData = useCallback(
    async (data: IFormData) => {
      const { email } = data;

      try {
        if (formAction === 'delete') {
          handleUserDelete(userId);
        } else {
          const schema = Yup.object().shape({
            name: Yup.string().required('Nome é obrigatório.'),
            email: Yup.string()
              .required('E-mail é obrigatório.')
              .email('Digite um e-mail válido.'),

            company: Yup.string().required('Empresa é obrigatório.'),
            city: Yup.string().required('Cidade é obrigatório.'),
            accesscode: Yup.string().required('Senha é obrigatório.'),
          });

          await schema.validate(data);

          if (formAction === 'new') {
            const userExists = await firebase
              .firestore()
              .collection('users')
              .where('email', '==', email.toLowerCase().trim())
              .get()
              .then(async snapshot => !snapshot.empty);

            if (userExists) {
              setLoading(false);
              MessageAlert(
                'Esse e-mail já está em uso. Escolha outro!',
                'info',
              );
            } else {
              handleUserNew(data);
            }
          } else if (formAction === 'edit') {
            const userExists = await firebase
              .firestore()
              .collection('users')
              .where('email', '==', email.toLowerCase().trim())
              .get()
              .then(async snapshot =>
                snapshot.docs.filter(doc => doc.id !== match.params.id),
              );

            if (userExists.length > 0) {
              setLoading(false);
              MessageAlert(
                'Esse e-mail já está em uso. Escolha outro!',
                'info',
              );
            } else {
              handleUserUpdate(userId, data);
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
      userId,
      formAction,
      handleUserDelete,
      handleUserNew,
      handleUserUpdate,
      match.params.id,
    ],
  );

  const handleFetchUserData = useCallback(async () => {
    await firebase
      .firestore()
      .collection('users')
      .doc(userId)
      .get()
      .then(snapshot => {
        const {
          name,
          company,
          city,
          email,
          accesscode,
        } = snapshot.data() as IFormData;

        setInitialDataForm({
          name,
          company,
          city,
          email,
          accesscode,
        });
      })
      .catch(() => MessageAlert('Não foi possível carregar os dados!', 'error'))
      .finally(() => setLoading(false));
  }, [userId]);

  useEffect(() => {
    if (userId) {
      handleFetchUserData();
    } else {
      setLoading(false);
    }
  }, [handleFetchUserData, userId]);

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
          <Title>Cadastro de Usuário</Title>

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
          <TextInput type="text" name="name" label="Nome" required />
          <TextInput type="text" name="company" label="Empresa" required />
          <TextInput type="text" name="city" label="Cidade" required />
          <TextInput type="email" name="email" label="E-mail" required />
          <TextInput
            type="text"
            name="accesscode"
            label="Código de Acesso"
            required
          />
        </FormContent>
      </Form>
    </Container>
  );
};

export default UserRegister;
