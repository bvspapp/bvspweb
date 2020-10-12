import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';

import {
  MdLock,
  MdPerson,
  MdArrowBack,
  MdLocationOn,
  MdLocationCity,
} from 'react-icons/md';
import { FaBuilding } from 'react-icons/fa';

import firebase from '../../../config/firebase';
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
} from './styles';

interface IUserFormData {
  name: string;
  company: string;
  city: string;
  country: string;
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
          city: Yup.string().required(translated.error_notfound_cidade),
          country: Yup.string().required(translated.error_notfound_country),
          password: Yup.string()
            .min(6, translated.error_min_password)
            .required(translated.error_notfound_password),
          password_confirm: Yup.string()
            .min(6, translated.error_min_password)
            .oneOf([Yup.ref('password')], translated.error_password_not_match)
            .required(translated.error_notfound_password_confirm),
        });

        await schema.validate(data);

        const userFormatted = {
          accesscode: data.password,
          city: data.city,
          company: data.company,
          name: data.name,
          name_insensitive: data.name.toLowerCase().trim(),
        };

        await firebase
          .firestore()
          .collection('users')
          .doc(user.id)
          .update(userFormatted)
          .then(() => {
            setData({
              user: {
                id: user.id,
                city: data.city,
                company: data.company,
                email: user.email,
                name: data.name,
                type: 'user',
              },
            });
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
    [user.id, setData, user.email, translated],
  );

  const handleFetchUserData = useCallback(async () => {
    await firebase
      .firestore()
      .collection('users')
      .doc(user.id)
      .get()
      .then(snapshot => {
        const userResponse = snapshot.data() as IUserData;

        setUserData({
          name: userResponse.name,
          company: userResponse.company,
          city: userResponse.city,
          country: userResponse.country,
          email: userResponse.email,
          password: userResponse.accesscode,
          password_confirm: userResponse.accesscode,
        });
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
              label={translated.label_country}
              name="country"
              type="text"
              icon={MdLocationCity}
              required
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
