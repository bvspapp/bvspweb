import React, { useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';

import {
  MdEmail,
  MdLock,
  MdPerson,
  MdArrowBack,
  MdLocationOn,
  MdLocationCity,
} from 'react-icons/md';

import { FaBuilding } from 'react-icons/fa';
import firebase from '../../config/firebase';

import logoImg from '../../assets/logo.png';

import MessageAlert from '../../utils/MessageAlert';
import light from '../../styles/themes/light';
import Load from '../../components/Load';

import {
  Container,
  Form,
  Title,
  SignUpButton,
  Input,
  Logo,
  AccountContainer,
  AccountLink,
  Content,
  InputRows,
} from './styles';

interface ISignFormData {
  name: string;
  company: string;
  city: string;
  country: string;
  email: string;
  password: string;
  password_confirm: string;
}

const SignUpUser: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  // const handleSubmitWithAPI = useCallback(
  //   async (data: ISignFormData) => {
  //     try {
  //       setLoading(true);

  //       const schema = Yup.object().shape({
  //         name: Yup.string().required('Nome é obrigatório.'),
  //         company: Yup.string().required('Empresa é obrigatório.'),
  //         city: Yup.string().required('Cidade é obrigatório.'),
  //         country: Yup.string().required('País é obrigatório.'),
  //         email: Yup.string()
  //           .required('E-mail obrigatório.')
  //           .email('Digite um e-mail válido.'),
  //         password: Yup.string()
  //           .min(6, 'A senha deve ter no mínimo 6 dígitos')
  //           .required('A senha é obrigatória.'),
  //         password_confirm: Yup.string()
  //           .min(6, 'A senha deve ter no mínimo 6 dígitos')
  //           .oneOf([Yup.ref('password')], 'A confirmação de senha não confere')
  //           .required('Digite a confirmação de senha'),
  //       });

  //       await schema.validate(data);

  //       await api
  //         .post('users', {
  //           name: data.name,
  //           password: data.password,
  //           email: data.email,
  //           city: data.city,
  //           country: data.country,
  //           company: data.company,
  //         })
  //         .catch(error => {
  //           if (error.request) {
  //             const { message } = JSON.parse(error.request.response);
  //             if (message === 'Email address already used')
  //               throw new Error('Este e-mail já está em uso. Escolha outro!');
  //           }
  //         });

  //       MessageAlert(
  //         'Cadastrado com sucesso. Agora, você pode acessar a plataforma!',
  //         'success',
  //       ).then(() => history.push('/'));
  //     } catch (error) {
  //       if (error instanceof Yup.ValidationError) {
  //         MessageAlert(error.errors[0], 'info');
  //       } else {
  //         MessageAlert(String(error).replace('Error:', ''), 'info');
  //       }
  //     } finally {
  //       setLoading(false);
  //     }
  //   },
  //   [history],
  // );

  const handleSubmit = useCallback(
    async (data: ISignFormData) => {
      try {
        setLoading(true);

        const schema = Yup.object().shape({
          name: Yup.string().required('Nome é obrigatório.'),
          company: Yup.string().required('Empresa é obrigatório.'),
          city: Yup.string().required('Cidade é obrigatório.'),
          country: Yup.string().required('País é obrigatório.'),
          email: Yup.string()
            .required('E-mail obrigatório.')
            .email('Digite um e-mail válido.'),
          password: Yup.string()
            .min(6, 'A senha deve ter no mínimo 6 dígitos')
            .required('A senha é obrigatória.'),
          password_confirm: Yup.string()
            .min(6, 'A senha deve ter no mínimo 6 dígitos')
            .oneOf([Yup.ref('password')], 'A confirmação de senha não confere')
            .required('Digite a confirmação de senha'),
        });

        await schema.validate(data);

        const emailExists = await firebase
          .firestore()
          .collection('users')
          .where('email', '==', data.email.toLowerCase().trim())
          .get()
          .then(async snapshot => {
            return !snapshot.empty;
          });

        if (emailExists) {
          MessageAlert(
            'Este e-mail já está sendo utilizado. Escolha outro!',
            'info',
          );
        } else {
          await firebase
            .firestore()
            .collection('users')
            .add({
              accesscode: data.password,
              city: data.city,
              company: data.company,
              email: data.email.toLowerCase().trim(),
              name: data.name,
              name_insensitive: data.name.toLowerCase().trim(),
            })
            .then(() => {
              MessageAlert(
                'Cadastrado com sucesso. Agora, você pode acessar a plataforma!',
                'success',
              ).then(() => history.push('/'));
            });
        }
      } finally {
        setLoading(false);
      }
    },
    [history],
  );

  return (
    <Container>
      <Content>
        <Form onSubmit={handleSubmit}>
          <Logo src={logoImg} alt="Logo" />
          <Title>Cadastrar</Title>

          <Input
            label="Nome"
            name="name"
            type="text"
            icon={MdPerson}
            required
          />
          <Input
            label="Empresa"
            name="company"
            type="text"
            icon={FaBuilding}
            required
          />
          <InputRows>
            <Input
              label="Cidade"
              name="city"
              type="text"
              icon={MdLocationOn}
              required
            />
            &nbsp;
            <Input
              label="País"
              name="country"
              type="text"
              icon={MdLocationCity}
              required
            />
          </InputRows>
          <Input
            label="E-mail"
            name="email"
            type="email"
            icon={MdEmail}
            required
          />
          <InputRows>
            <Input
              label="Senha"
              name="password"
              type="password"
              icon={MdLock}
              required
            />
            &nbsp;
            <Input
              label="Confirme a Senha"
              name="password_confirm"
              type="password"
              icon={MdLock}
              required
            />
          </InputRows>

          {loading ? (
            <Load />
          ) : (
            <SignUpButton color={light.colors.primary} type="submit">
              Entrar
            </SignUpButton>
          )}
        </Form>

        <AccountContainer>
          <AccountLink to="/">
            <MdArrowBack />
            Eu já tenho uma conta
          </AccountLink>
        </AccountContainer>
      </Content>
    </Container>
  );
};

export default SignUpUser;
