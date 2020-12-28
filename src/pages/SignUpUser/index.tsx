import React, { useCallback, useState, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';

import {
  MdEmail,
  MdLock,
  MdPerson,
  MdArrowBack,
  MdLocationOn,
  MdLocationCity,
  MdPhone,
} from 'react-icons/md';

import { FaBuilding } from 'react-icons/fa';
import api from '../../services/api';

import logoImg from '../../assets/logo.png';

import MessageAlert from '../../utils/MessageAlert';
import light from '../../styles/themes/light';
import Load from '../../components/Load';

import translatedContent from './translatedcontent';

import { useTranslation } from '../../hooks/translation';

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
  telephone: string;
  city: string;
  city_state: string;
  country: string;
  email: string;
  password: string;
  password_confirm: string;
}

const SignUpUser: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const { translation } = useTranslation();

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
          name: Yup.string().required(translated.error_notfound_name),
          company: Yup.string().required(translated.error_notfound_company),
          city: Yup.string().required(translated.error_notfound_city),
          city_state: Yup.string().required(
            translated.error_notfound_city_state,
          ),
          country: Yup.string().required(translated.error_notfound_country),
          email: Yup.string()
            .required(translated.error_invalid_email)
            .email(translated.error_invalid_email),
          password: Yup.string()
            .min(6, translated.error_min_required_password)
            .required(translated.error_notfound_password),
          password_confirm: Yup.string()
            .min(6, translated.error_min_required_password)
            .oneOf(
              [Yup.ref('password')],
              translated.error_password_confirm_not_match,
            )
            .required(translated.error_password_confirm_required),
        });

        await schema.validate(data);

        await api
          .post('users', {
            profile_id: 6,
            name: data.name,
            email: data.email.toLowerCase().trim(),
            telephone: data.telephone,
            city: data.city,
            city_state: data.city_state,
            country: data.country,
            company: data.company,
            password: data.password,
          })
          .then(() => {
            MessageAlert(translated.success_message, 'success').then(() =>
              history.push('/'),
            );
          })
          .catch(error => {
            const { message } = error.response.data;

            if (message === 'Email address already used')
              MessageAlert(translated.email_exist_message, 'info');
          });
      } finally {
        setLoading(false);
      }
    },
    [history, translated],
  );

  return (
    <Container>
      <Content>
        <Form onSubmit={handleSubmit}>
          <Logo src={logoImg} alt="Logo" />
          <Title>{translated.form_title}</Title>

          <Input
            label={translated.label_name}
            name="name"
            type="text"
            icon={MdPerson}
            required
          />
          <Input
            label={translated.label_company}
            name="company"
            type="text"
            icon={FaBuilding}
            required
          />
          <InputRows>
            <Input
              label={translated.label_city}
              name="city"
              type="text"
              icon={MdLocationOn}
              required
            />
            &nbsp;
            <Input
              label={translated.label_state}
              name="city_state"
              type="text"
              icon={MdLocationOn}
              required
            />
            &nbsp;
            <Input
              label={translated.label_country}
              name="country"
              type="text"
              icon={MdLocationCity}
              required
            />
          </InputRows>
          <InputRows>
            <Input
              label={translated.label_telephone}
              name="telephone"
              type="text"
              icon={MdPhone}
            />
            &nbsp;
            <Input
              label={translated.label_email}
              name="email"
              type="email"
              icon={MdEmail}
            />
          </InputRows>
          <InputRows>
            <Input
              label={translated.label_password}
              name="password"
              type="password"
              icon={MdLock}
              required
            />
            &nbsp;
            <Input
              label={translated.label_password_confirm}
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
              {translated.button_register}
            </SignUpButton>
          )}
        </Form>

        <AccountContainer>
          <AccountLink to="/">
            <MdArrowBack />
            {translated.button_have_account}
          </AccountLink>
        </AccountContainer>
      </Content>
    </Container>
  );
};

export default SignUpUser;
