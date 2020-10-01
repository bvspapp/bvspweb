import React, { useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';

import { MdEmail, MdLock } from 'react-icons/md';
import logoImg from '../../assets/logo.png';

import MessageAlert from '../../utils/MessageAlert';
import light from '../../styles/themes/light';
import Load from '../../components/Load';

import { useAuth } from '../../hooks/auth';

import { Container, Logo, Form, Title, SignInButton, Input } from './styles';

interface ISignFormData {
  email: string;
  password: string;
}

const SignInAdmin: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const history = useHistory();

  const { signIn } = useAuth();

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

        await signIn({
          email: data.email,
          password: data.password,
          type: 'admin',
        });

        history.push('/');
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          MessageAlert(error.errors[0], 'info');
        }
      } finally {
        setLoading(false);
      }
    },
    [signIn, history],
  );

  return (
    <Container>
      <Logo src={logoImg} alt="Logo" />

      <Form onSubmit={handleSubmit}>
        {loading ? (
          <Load />
        ) : (
          <>
            <Title>Entrar</Title>

            <Input
              name="email"
              type="email"
              placeholder="E-mail"
              icon={MdEmail}
              required
            />
            <Input
              name="password"
              type="password"
              placeholder="Senha"
              icon={MdLock}
              required
            />

            <SignInButton color={light.colors.primary} type="submit">
              Entrar
            </SignInButton>
          </>
        )}
      </Form>
    </Container>
  );
};

export default SignInAdmin;
