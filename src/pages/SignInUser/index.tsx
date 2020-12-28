import React, { useCallback, useState, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import { FaUser } from 'react-icons/fa';

import { MdEmail, MdLock } from 'react-icons/md';
import logoImg from '../../assets/logo.png';
import brazilflagImg from '../../assets/brazilflag.png';
import euaflagImg from '../../assets/euaflag.png';

import MessageAlert from '../../utils/MessageAlert';
import light from '../../styles/themes/light';
import Load from '../../components/Load';

import translatedContent from './translatedcontent';

import { useAuth } from '../../hooks/auth';
import { useTranslation } from '../../hooks/translation';

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
  TranslateContainer,
  TranslateImage,
  TranslateButton,
} from './styles';

interface ISignFormData {
  email: string;
  password: string;
}

const SignInUser: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const { signIn } = useAuth();
  const { translation, changeTranslation } = useTranslation();
  const history = useHistory();

  const translated = useMemo(() => {
    return translation === 'en-us'
      ? translatedContent.en_US
      : translatedContent.pt_BR;
  }, [translation]);

  const handleSubmit = useCallback(
    async (data: ISignFormData) => {
      try {
        setLoading(true);

        const schema = Yup.object().shape({
          email: Yup.string()
            .required(translated.alert_set_email_and_password)
            .email(translated.alert_invalid_email),
          password: Yup.string().required(
            translated.alert_set_email_and_password,
          ),
        });

        await schema.validate(data);

        const { email, password } = data;
        await signIn({ email, password });

        history.push('/');
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          MessageAlert(error.errors[0], 'info');
        } else {
          MessageAlert(translated.user_notfound);
        }
      } finally {
        setLoading(false);
      }
    },
    [history, signIn, translated],
  );

  return (
    <Container>
      <Content>
        <Form onSubmit={handleSubmit}>
          <Logo src={logoImg} alt="Logo" />
          <Title>Entrar</Title>

          <Input
            label={translated.label_email}
            name="email"
            type="email"
            placeholder={translated.input_placeholder_email}
            icon={MdEmail}
            required
          />
          <Input
            label={translated.label_password}
            name="password"
            type="password"
            placeholder={translated.input_placeholder_password}
            icon={MdLock}
            required
          />

          {loading ? (
            <Load />
          ) : (
            <SignInButton color={light.colors.primary} type="submit">
              {translated.button_go}
            </SignInButton>
          )}

          <ForgotPassword to="/forgot-password">
            {translated.label_password_forgot}
          </ForgotPassword>

          <TranslateContainer>
            <TranslateButton
              type="button"
              actived={translation === 'pt-br'}
              onClick={() => changeTranslation('pt-br')}
            >
              <TranslateImage src={brazilflagImg} />
            </TranslateButton>

            <TranslateButton
              type="button"
              actived={translation === 'en-us'}
              onClick={() => changeTranslation('en-us')}
            >
              <TranslateImage src={euaflagImg} />
            </TranslateButton>
          </TranslateContainer>
        </Form>

        <CreateAccountContainer>
          <CreateAccountLink to="/signup">
            <FaUser />
            {translated.button_label_register}
          </CreateAccountLink>
        </CreateAccountContainer>
      </Content>
    </Container>
  );
};

export default SignInUser;
