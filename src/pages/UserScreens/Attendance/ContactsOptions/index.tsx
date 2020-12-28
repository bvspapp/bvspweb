import React, { useMemo } from 'react';

import { MdHistory } from 'react-icons/md';
import { useAuth } from '../../../../hooks/auth';

import HighlightTitle from '../../../../components/HighlightTitle';
import HighlightMenuCard from '../../../../components/HighlightMenuCard';

import phonecallImg from '../../../../assets/phonecall.svg';
import gmailImg from '../../../../assets/gmail.svg';
import whatsappImg from '../../../../assets/whatsapp.svg';

import { Container, Content, MenuContainer, MyRequestsButton } from './styles';

import translatedContent from './translatedcontent';
import { useTranslation } from '../../../../hooks/translation';

interface IRouteParams {
  match: {
    params: {
      type: number;
    };
  };
}

const ContactsOptions: React.FC<IRouteParams> = ({ match }) => {
  const { user } = useAuth();
  const { translation } = useTranslation();
  const { type } = match.params;

  const translated = useMemo(() => {
    return translation === 'en-us'
      ? translatedContent.en_US
      : translatedContent.pt_BR;
  }, [translation]);

  return (
    <Container>
      <Content>
        <HighlightTitle
          title={`${user.name.split(' ')[0]}, ${translated.title}`}
          subtitle={translated.subtitle}
        />

        <MenuContainer>
          <HighlightMenuCard
            link={`/attendance/call/${type}`}
            image={phonecallImg}
            title={translated.button_callme_title}
            subtitle={translated.button_callme_subtitle}
          />
          <HighlightMenuCard
            link={`/attendance/whatsapp/${type}`}
            image={whatsappImg}
            title={translated.button_whatsapp_title}
            subtitle={translated.button_whatsapp_subtitle}
          />
          <HighlightMenuCard
            link={`/attendance/mail/${type}`}
            image={gmailImg}
            title={translated.button_sendmessage_title}
            subtitle={translated.button_sendmessage_subtitle}
          />
        </MenuContainer>

        <MyRequestsButton to="/myrequests">
          <MdHistory />
          {translated.button_myrequests_label}
        </MyRequestsButton>
      </Content>
    </Container>
  );
};

export default ContactsOptions;
