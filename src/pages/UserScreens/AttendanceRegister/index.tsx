import React, { useMemo, useCallback, useState, useRef } from 'react';
import 'react-flags-select/css/react-flags-select.css';
import * as Yup from 'yup';
import { useHistory } from 'react-router-dom';
import { FormHandles } from '@unform/core';

import { useAuth } from '../../../hooks/auth';

import light from '../../../styles/themes/light';
import HighlightTitle from '../../../components/HighlightTitle';
import MessageAlert from '../../../utils/MessageAlert';
import TextInput from '../../../components/Form/TextInput';
import TextAreaInput from '../../../components/Form/TextAreaInput';

import clerkmg from '../../../assets/clerk.svg';

import {
  Container,
  Content,
  Form,
  ButtonRegister,
  FormContent,
  InputsColumnContainer,
  LabelText,
  ContactIllustration,
  TextWait,
  CountrySelect,
} from './styles';

import translatedContent from './translatedcontent';
import { useTranslation } from '../../../hooks/translation';

interface IRouteParams {
  match: {
    params: {
      type: 'call' | 'mail';
    };
  };
}

interface IFormData {
  contact: string;
  description: string;
}

const AttendanceRegister: React.FC<IRouteParams> = ({ match }) => {
  const [initialDataForm, setInitialDataForm] = useState<IFormData>();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const { translation } = useTranslation();
  const formRef = useRef<FormHandles>(null);
  const history = useHistory();

  const { type } = match.params;

  const translated = useMemo(() => {
    return translation === 'en-us'
      ? translatedContent.en_US
      : translatedContent.pt_BR;
  }, [translation]);

  const handleSubmit = useCallback(
    async (data: IFormData) => {
      try {
        setLoading(true);

        const schema = Yup.object().shape({
          contact: Yup.string().required(translated.error_notfound_contact),
        });

        await schema.validate(data);

        const dataFormatted = {
          user_name: user.name,
          user_name_insensitive: user.name.toLowerCase(),
          contact: data.contact,
          description: data.description,
          date: new Date(),
          time: new Date(),
        };
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          MessageAlert(error.errors[0], 'info');
        } else {
          MessageAlert(translated.error_register, 'info');
        }
      } finally {
        setLoading(false);
      }
    },
    [translated.error_notfound_contact, translated.error_register, user.name],
  );

  return (
    <Container>
      <Content>
        <HighlightTitle
          title={`${user.name}, ${
            type === 'call' ? translated.title_call : translated.title_mail
          }`}
        />

        {loading ? (
          <TextWait>{translated.text_wait}</TextWait>
        ) : (
          <Form
            ref={formRef}
            initialData={initialDataForm}
            onSubmit={handleSubmit}
          >
            <FormContent disabled={false}>
              <LabelText>{translated.label_contact_info}</LabelText>
              <InputsColumnContainer>
                <CountrySelect defaultCountry="BR" />
                <TextInput
                  type="text"
                  name="ddd"
                  required
                  containerCustomStyle={{ maxWidth: 70, marginRight: 10 }}
                  placeholder="DDD"
                />
                <TextInput
                  type="text"
                  name="phonenumber"
                  required
                  placeholder={translated.phonenumber_placeholder}
                />
              </InputsColumnContainer>

              <LabelText>{translated.label_about}</LabelText>
              <TextAreaInput name="about" rows={5} />

              <ButtonRegister type="submit" color={light.colors.primary}>
                Enviar
              </ButtonRegister>
            </FormContent>
          </Form>
        )}

        <ContactIllustration src={clerkmg} />
      </Content>
    </Container>
  );
};

export default AttendanceRegister;
