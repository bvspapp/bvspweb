import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';

import {
  MdLock,
  MdPerson,
  MdArrowBack,
  MdLocationOn,
  MdLocationCity,
  MdMail,
  MdPhone,
} from 'react-icons/md';
import { FaBuilding } from 'react-icons/fa';
import api from '../../../services/api';

import light from '../../../styles/themes/light';

import { useAuth } from '../../../hooks/auth';

import HighlightTitle from '../../../components/HighlightTitle';
import Load from '../../../components/Load';
import MessageAlert from '../../../utils/MessageAlert';

import translatedContent from './translatedcontent';
import { useTranslation } from '../../../hooks/translation';

import {
  Container,
  Header,
  Content,
  BackButton,
  Form,
  Input,
  SaveButton,
  InputRows,
  PasswordInfo,
} from './styles';

interface IUserFormData {
  name: string;
  company: string;
  city: string;
  city_state: string;
  country: string;
  telephone: string;
  email: string;
  password: string;
  password_confirm: string;
}

interface IUserData {
  name: string;
  company: string;
  city: string;
  country: string;
  email: string;
  accesscode: string;
}

const BvspServicesDetails: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<IUserFormData>({} as IUserFormData);

  const { user, setData } = useAuth();
  const history = useHistory();
  const { translation } = useTranslation();

  const translated = useMemo(() => {
    return translation === 'en-us'
      ? translatedContent.en_US
      : translatedContent.pt_BR;
  }, [translation]);

  const handleSubmit = useCallback(
    async (data: IUserFormData) => {
      try {
        setLoading(true);

        const schema = Yup.object().shape({
          name: Yup.string().required(translated.error_notfound_name),
          company: Yup.string().required(translated.error_notfound_compay),
          city: Yup.string().required(translated.error_notfound_city),
          city_state: Yup.string().required(
            translated.error_notfound_city_state,
          ),
          country: Yup.string().required(translated.error_notfound_country),
          telephone: Yup.string(),

          password_confirm: Yup.string()
            .when('password', {
              is: val => !!val.length,
              then: Yup.string()
                .min(6, translated.error_min_password)
                .required(translated.error_notfound_password),
              otherwise: Yup.string(),
            })
            .oneOf(
              [Yup.ref('password'), 'null'],
              translated.error_password_not_match,
            ),
        });

        await schema.validate(data);

        await api.put(`users/${user.id}`, {
          profile_id: user.profile.id,
          name: data.name,
          city: data.city,
          city_state: data.city_state,
          country: data.country,
          company: data.company,
          telephone: data.telephone,
          password: data.password,
        });

        setData({
          user: {
            id: user.id,
            country: data.country,
            city: data.city,
            city_state: data.city,
            company: data.company,
            name: data.name,
            email: data.email,
            telephone: data.telephone,
            profile: {
              id: user.profile.id,
              name: user.profile.name,
            },
            currentCountryCode: user.currentCountryCode,
            environment: user.environment
          },
        });

        MessageAlert(translated.message_updated, 'success');
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          MessageAlert(error.errors[0], 'info');
        } else {
          MessageAlert(translated.error_updated, 'info');
        }
      } finally {
        setLoading(false);
      }
    },
    [translated, setData, user],
  );

  const handleFetchUserData = useCallback(async () => {
    await api
      .get(`users/${user.id}`)
      .then(response => {
        setUserData(response.data);
      })
      .catch(() => MessageAlert('Não foi possível carregar os dados!', 'error'))
      .finally(() => setLoading(false));
  }, [user.id]);

  useEffect(() => {
    handleFetchUserData();
  }, [handleFetchUserData]);

  return (
    <Container>
      <Header>
        <HighlightTitle
          title={translated.title}
          subtitle={translated.subtitle}
          lineAlign="left"
        />
        <BackButton
          type="button"
          color={light.colors.primary}
          onClick={() => history.goBack()}
        >
          <MdArrowBack />
        </BackButton>
      </Header>

      {loading ? (
        <Load />
      ) : (
        <Form onSubmit={handleSubmit} initialData={userData}>
          <Input
            label={translated.label_name}
            name="name"
            type="text"
            icon={MdPerson}
            required
          />
          <InputRows>
            <Input
              label={translated.label_email}
              name="email"
              type="email"
              icon={MdMail}
              required
              disabled
            />
            &nbsp;
            <Input
              label={translated.label_phone}
              name="telephone"
              type="text"
              icon={MdPhone}
            />
          </InputRows>
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
              label={translated.label_city_state}
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

          <PasswordInfo>{translated.password_info}</PasswordInfo>
          <InputRows>
            <Input
              label={translated.label_password}
              name="password"
              type="password"
              icon={MdLock}
            />
            &nbsp;
            <Input
              label={translated.label_password_confirm}
              name="password_confirm"
              type="password"
              icon={MdLock}
            />
          </InputRows>

          {loading ? (
            <Load />
          ) : (
            <SaveButton color={light.colors.primary} type="submit">
              {translated.button_save}
            </SaveButton>
          )}
        </Form>
      )}

      <Content />
    </Container>
  );
};

export default BvspServicesDetails;
