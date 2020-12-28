import React, { useMemo } from 'react';
import { useHistory } from 'react-router-dom';

import { MdArrowBack } from 'react-icons/md';
import { FaPhone, FaGlobe, FaEnvelope, FaWhatsapp } from 'react-icons/fa';
import onlineImg from '../../../assets/online.svg';
import light from '../../../styles/themes/light';
import HighlightTitle from '../../../components/HighlightTitle';

import translatedContent from './translatedcontent';
import { useTranslation } from '../../../hooks/translation';

import {
  Container,
  Header,
  Content,
  BackButton,
  ContactContainer,
  ContactBox,
  ContactLabel,
  ContactText,
  ContactDetail,
  ContactIcon,
  ContactIllustration,
} from './styles';

const Contact: React.FC = () => {
  const history = useHistory();
  const { translation } = useTranslation();

  const translated = useMemo(() => {
    return translation === 'en-us'
      ? translatedContent.en_US
      : translatedContent.pt_BR;
  }, [translation]);

  return (
    <Container>
      <Header>
        <HighlightTitle
          title={translated.contact_title}
          subtitle={translated.contact_subtitle}
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

      <Content>
        <ContactContainer>
          <ContactBox>
            <ContactIcon>
              <FaPhone />
            </ContactIcon>
            <ContactDetail>
              <ContactLabel>{translated.contact_call_label}</ContactLabel>
              <ContactText>{translated.contact_call_value}</ContactText>
            </ContactDetail>
          </ContactBox>

          <ContactBox>
            <ContactIcon>
              <FaGlobe />
            </ContactIcon>
            <ContactDetail>
              <ContactLabel>{translated.contact_website_label}</ContactLabel>
              <ContactText>{translated.contact_website_value}</ContactText>
            </ContactDetail>
          </ContactBox>

          <ContactBox>
            <ContactIcon>
              <FaEnvelope />
            </ContactIcon>
            <ContactDetail>
              <ContactLabel>{translated.contact_email_label}</ContactLabel>
              <ContactText>{translated.contact_email_value}</ContactText>
            </ContactDetail>
          </ContactBox>

          <ContactBox>
            <ContactIcon>
              <FaWhatsapp />
            </ContactIcon>
            <ContactDetail>
              <ContactLabel>{translated.contact_whatsapp_label}</ContactLabel>
              <ContactText>{translated.contact_whatsapp_number}</ContactText>
            </ContactDetail>
          </ContactBox>
        </ContactContainer>
        <ContactIllustration src={onlineImg} />
      </Content>
    </Container>
  );
};

export default Contact;
