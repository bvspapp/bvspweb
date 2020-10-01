import React, { useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import { MdEmail, MdArrowBack } from 'react-icons/md';
import api from '../../services/api';

import logoImg from '../../assets/logo.png';

import MessageAlert from '../../utils/MessageAlert';
import light from '../../styles/themes/light';
import Load from '../../components/Load';

import {
  Container,
  Form,
  Title,
  SignInButton,
  Input,
  Logo,
  Content,
  MessageText,
  AccountContainer,
  AccountLink,
} from './styles';

interface IForgotPasswordData {
  email: string;
}

const ForgotPassword: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const history = useHistory();

  const handleSubmit = useCallback(
    async (data: IForgotPasswordData) => {
      try {
        setLoading(true);

        const schema = Yup.object().shape({
          email: Yup.string()
            .required('E-mail obrigatório.')
            .email('Digite um e-mail válido.'),
        });

        await schema.validate(data);

        await api.post('/password/forgot', {
          email: data.email,
        });

        MessageAlert(
          'Enviamos um e-mail para confirmar a recuperação da sua nova. Verifique sua caixa de entrada.',
          'success',
        ).then(() => history.push('/'));
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          MessageAlert(error.errors[0], 'info');
        } else {
          MessageAlert(
            'Não foi possível recuperar a conta. Verifique se digitou corretamente o e-mail e tente de novo.',
            'info',
          );
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
          <Title>Recuperar</Title>

          <MessageText>
            Digite o e-mail da conta que você deseja recuperar. Vamos enviar no
            seu e-mail um link para você escolher uma nova senha.
          </MessageText>

          <Input
            label="E-mail"
            name="email"
            type="email"
            placeholder="E-mail"
            icon={MdEmail}
            required
          />

          {loading ? (
            <Load />
          ) : (
            <SignInButton color={light.colors.primary} type="submit">
              Recuperar
            </SignInButton>
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

export default ForgotPassword;
