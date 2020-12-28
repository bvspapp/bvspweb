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

import api from '../../../services/api';
import countries from '../../../utils/countries';

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
  Select,
} from './styles';

interface IFormData {
  name: string;
  email: string;
  company: string;
  city: string;
  city_state: string;
  country: string;
  password: string;
  profile_type: number;
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

  const optionsUserTypeProfile = useMemo(() => {
    return [
      {
        value: 1,
        label: 'Venda',
      },
      {
        value: 2,
        label: 'Atendimento',
      },
      {
        value: 6,
        label: 'Cliente',
      },
      {
        value: 3,
        label: 'Orçamento',
      },
      {
        value: 7,
        label: 'Qualidade',
      },
    ];
  }, []);

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

  const handleUserDelete = useCallback(
    async (id: string) => {
      const { isConfirmed } = await MessageConfirmation(
        'Você tem certeza que deseja remover?',
        'Sim. Remover!',
        'question',
      );

      if (isConfirmed) {
        setLoading(true);

        await api
          .delete(`users/${id}`)
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
            city_state: Yup.string().required(
              'Estado da Cidade é obrigatório.',
            ),
            country: Yup.string().required('País é obrigatório.'),
            profile_type: Yup.string().required(
              'Perfil do usuário é obrigatório.',
            ),
          });

          await schema.validate(data);

          if (formAction === 'new') {
            if (!data.password)
              return MessageAlert('Senha é obrigatório', 'error');

            api
              .post('users', {
                name: data.name,
                email: data.email,
                city: data.city,
                city_state: data.city,
                country: data.country,
                company: data.company,
                password: data.password,
                profile_id: data.profile_type,
              })
              .then(() => {
                MessageAlert('Cadastrado com sucesso!', 'success').then(() =>
                  history.push('/users'),
                );
              })
              .catch(error => {
                if (error.response) {
                  const msg = error.response.data.message;
                  if (msg === 'Email address already used')
                    MessageAlert('Este e-mail já está cadastrado.', 'info');
                } else MessageAlert('Não foi possível cadastrar!', 'error');

                setLoading(false);
              });
          } else if (formAction === 'edit') {
            api
              .put(`users/${userId}`, {
                name: data.name,
                city: data.city,
                city_state: data.city,
                country: data.country,
                company: data.company,
                password: data.password,
                profile_id: data.profile_type,
              })
              .then(() => {
                MessageAlert('Cadastrado com sucesso!', 'success').then(() =>
                  history.push('/users'),
                );
              })
              .catch(error => {
                if (error.response) {
                  const msg = error.response.data.message;
                  if (msg === 'Email address already used')
                    MessageAlert('Este e-mail já está cadastrado.', 'info');
                } else MessageAlert('Não foi possível cadastrar!', 'error');

                setLoading(false);
              });
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
    [userId, formAction, handleUserDelete, history],
  );

  const handleFetchUserData = useCallback(async () => {
    await api
      .get(`users/${userId}`)
      .then(response => {
        setInitialDataForm({
          ...response.data,
          profile_type: response.data.profile_id,
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
          <TextInput type="text" name="city_state" label="Estado" required />
          <Select
            label="País"
            name="country"
            options={countries}
            defaultValue="BRA"
          />
          <TextInput
            type="email"
            name="email"
            label="E-mail"
            required
            disabled={formAction === 'edit'}
          />
          <Select
            label="Perfil do Usuário"
            name="profile_type"
            options={optionsUserTypeProfile}
          />
          <TextInput type="text" name="password" label="Senha" />
        </FormContent>
      </Form>
    </Container>
  );
};

export default UserRegister;
