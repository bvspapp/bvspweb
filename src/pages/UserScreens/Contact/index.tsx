import React from 'react';
import { useHistory } from 'react-router-dom';

import { MdArrowBack } from 'react-icons/md';
import { FaPhone, FaGlobe, FaEnvelope, FaWhatsapp } from 'react-icons/fa';
import callImg from '../../../assets/call.svg';
import light from '../../../styles/themes/light';
import HighlightTitle from '../../../components/HighlightTitle';

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

  return (
    <Container>
      <Header>
        <HighlightTitle title="Contato" lineAlign="left" />
        <BackButton
          type="button"
          color={light.colors.primary}
          onClick={() => history.goBack()}
        >
          <MdArrowBack />
        </BackButton>
      </Header>

      <Content>
        <HighlightTitle
          title="Atentimento"
          subtitle="Nossos meios de comunicação"
        />

        <ContactContainer>
          <ContactBox>
            <ContactIcon>
              <FaPhone />
            </ContactIcon>
            <ContactDetail>
              <ContactLabel>Ligue agora mesmo</ContactLabel>
              <ContactText>+55 51 3783-0875</ContactText>
            </ContactDetail>
          </ContactBox>

          <ContactBox>
            <ContactIcon>
              <FaGlobe />
            </ContactIcon>
            <ContactDetail>
              <ContactLabel>Acesse nosso site</ContactLabel>
              <ContactText>www.bvsp.ind.br</ContactText>
            </ContactDetail>
          </ContactBox>

          <ContactBox>
            <ContactIcon>
              <FaEnvelope />
            </ContactIcon>
            <ContactDetail>
              <ContactLabel>Para enviar e-mail</ContactLabel>
              <ContactText>sac@bvsp.ind.br</ContactText>
            </ContactDetail>
          </ContactBox>

          <ContactBox>
            <ContactIcon>
              <FaWhatsapp />
            </ContactIcon>
            <ContactDetail>
              <ContactLabel>Nosso Whatsapp</ContactLabel>
              <ContactText>+55 47 9740-2011</ContactText>
            </ContactDetail>
          </ContactBox>
        </ContactContainer>
      </Content>

      <ContactIllustration src={callImg} />
    </Container>
  );
};

export default Contact;
