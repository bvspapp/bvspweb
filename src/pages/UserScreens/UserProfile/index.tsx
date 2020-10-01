import React, { useCallback, useState, useEffect } from 'react';
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

  const handleSubmit = useCallback(
    async (data: IUserFormData) => {
      try {
        setLoading(true);

        const schema = Yup.object().shape({
          name: Yup.string().required('Nome é obrigatório.'),
          company: Yup.string().required('Empresa é obrigatório.'),
          city: Yup.string().required('Cidade é obrigatório.'),
          country: Yup.string().required('País é obrigatório.'),
          password: Yup.string()
            .min(6, 'A senha deve ter no mínimo 6 dígitos')
            .required('A senha é obrigatória.'),
          password_confirm: Yup.string()
            .min(6, 'A senha deve ter no mínimo 6 dígitos')
            .oneOf([Yup.ref('password')], 'A confirmação de senha não confere')
            .required('Digite a confirmação de senha'),
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

        MessageAlert('Seus dados foram atualizados.', 'success');
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          MessageAlert(error.errors[0], 'info');
        } else {
          MessageAlert('Não foi possível atualizar os dados.', 'info');
        }
      } finally {
        setLoading(false);
      }
    },
    [user.id, setData, user.email],
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
        <HighlightTitle title="Perfil" lineAlign="left" />
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
            <SaveButton color={light.colors.primary} type="submit">
              Salvar
            </SaveButton>
          )}
        </Form>
      )}

      <Content />
    </Container>
  );
};

export default BvspServicesDetails;
