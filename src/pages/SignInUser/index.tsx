import React, { useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import { FaUser } from 'react-icons/fa';

import { MdEmail, MdLock } from 'react-icons/md';
import logoImg from '../../assets/logo.png';

import MessageAlert from '../../utils/MessageAlert';
import light from '../../styles/themes/light';
import Load from '../../components/Load';

import { useAuth } from '../../hooks/auth';

import {
  Container,
  Form,
  Title,
  SignInButton,
  Input,
  Logo,
  CreateAccountContainer,
  CreateAccountLink,
  Content,
  ForgotPassword,
} from './styles';

interface ISignFormData {
  email: string;
  password: string;
}

const SignInUser: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const { signIn } = useAuth();
  const history = useHistory();

  // const handleSubmitUsingAPIServer = useCallback(
  //   async (data: ISignFormData) => {
  //     try {
  //       setLoading(true);

  //       const schema = Yup.object().shape({
  //         email: Yup.string()
  //           .required('E-mail obrigatório.')
  //           .email('Digite um e-mail válido.'),
  //         password: Yup.string().required('A senha é obrigatória.'),
  //       });

  //       await schema.validate(data);

  //       const { email, password } = data;

  //       await api.post('sessions', {
  //         email,
  //         password,
  //       });

  //       localStorage.setItem(
  //         '@bvspparts:user',
  //         JSON.stringify({ email, type: 'user' }),
  //       );
  //       setData({
  //         user: {
  //           email,
  //           type: 'user',
  //         },
  //       });

  //       history.push('/');
  //     } catch (error) {
  //       if (error instanceof Yup.ValidationError) {
  //         MessageAlert(error.errors[0], 'info');
  //       } else {
  //         MessageAlert('Senha ou e-mail inválido.', 'info');
  //       }
  //     } finally {
  //       setLoading(false);
  //     }
  //   },
  //   [history, setData],
  // );

  const handleSubmit = useCallback(
    async (data: ISignFormData) => {
      try {
        setLoading(true);

        const schema = Yup.object().shape({
          email: Yup.string()
            .required('E-mail obrigatório.')
            .email('Digite um e-mail válido.'),
          password: Yup.string().required('A senha é obrigatória.'),
        });

        await schema.validate(data);

        const { email, password } = data;

        await signIn({ email, password, type: 'user' });

        history.push('/');
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          MessageAlert(error.errors[0], 'info');
        } else {
          MessageAlert('Senha ou e-mail inválido.', 'info');
        }
      } finally {
        setLoading(false);
      }
    },
    [history, signIn],
  );

  return (
    <Container>
      <Content>
        <Form onSubmit={handleSubmit}>
          <Logo src={logoImg} alt="Logo" />
          <Title>Entrar</Title>

          <Input
            label="E-mail"
            name="email"
            type="email"
            placeholder="E-mail"
            icon={MdEmail}
            required
          />
          <Input
            label="Senha"
            name="password"
            type="password"
            placeholder="Senha"
            icon={MdLock}
            required
          />

          {loading ? (
            <Load />
          ) : (
            <SignInButton color={light.colors.primary} type="submit">
              Entrar
            </SignInButton>
          )}

          <ForgotPassword to="/forgot-password">
            Esqueci minha senha
          </ForgotPassword>
        </Form>

        <CreateAccountContainer>
          <CreateAccountLink to="/signup">
            <FaUser />
            Criar Conta
          </CreateAccountLink>
        </CreateAccountContainer>
      </Content>
    </Container>
  );
};

export default SignInUser;
