import React, { useCallback, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import * as Yup from 'yup';
import { MdLock, MdArrowBack } from 'react-icons/md';
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

interface IResetPasswordFormData {
  password: string;
  password_confirmation: string;
}

const ResetPassword: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const history = useHistory();
  const location = useLocation();

  const handleSubmit = useCallback(
    async (data: IResetPasswordFormData) => {
      try {
        setLoading(true);

        const schema = Yup.object().shape({
          password: Yup.string()
            .min(6, 'A senha deve ter no mínimo 6 dígitos')
            .required('A senha é obrigatória.'),
          password_confirmation: Yup.string()
            .min(6, 'A senha deve ter no mínimo 6 dígitos')
            .oneOf(
              [Yup.ref('password'), 'null'],
              'A confirmação de senha não confere',
            )
            .required('Digite a confirmação de senha'),
        });

        await schema.validate(data);

        const { password, password_confirmation } = data;
        const token = location.search.replace('?token=', '');

        if (!token) {
          throw new Error();
        }

        await api.post('password/reset', {
          password,
          password_confirmation,
          token,
        });

        MessageAlert(
          'Sua nova senha foi definada. Agora, acesse sua conta com a sua nova senha',
          'success',
        ).then(() => history.push('/'));
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          MessageAlert(error.errors[0], 'info');
        } else {
          MessageAlert(
            'Não foi possível recuperar a conta. Tente novamente ',
            'info',
          );
        }
      } finally {
        setLoading(false);
      }
    },
    [history, location],
  );

  return (
    <Container>
      <Content>
        <Form onSubmit={handleSubmit}>
          <Logo src={logoImg} alt="Logo" />
          <Title>Nova Senha</Title>

          <MessageText>
            Ao definir e confirmar sua nova senha você será redirecionado para a
            tela de acesso. Utilize seu e-mail e a sua nova senha.
          </MessageText>

          <Input
            label="Senha"
            name="password"
            type="password"
            placeholder="Senha"
            icon={MdLock}
            required
          />

          <Input
            label="Confirmação da Senha"
            name="password_confirmation"
            type="password"
            placeholder="Confirmação da Senha"
            icon={MdLock}
            required
          />

          {loading ? (
            <Load />
          ) : (
            <SignInButton color={light.colors.primary} type="submit">
              Confirmar Nova Senha
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

export default ResetPassword;
