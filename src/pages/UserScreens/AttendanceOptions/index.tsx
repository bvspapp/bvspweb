import React, { useMemo } from 'react';

import { useAuth } from '../../../hooks/auth';

import HighlightTitle from '../../../components/HighlightTitle';
import HighlightMenuCard from '../../../components/HighlightMenuCard';

import phonecallImg from '../../../assets/phonecall.svg';
import gmailImg from '../../../assets/gmail.svg';

import { Container, Content, MenuContainer, MessageText } from './styles';

import translatedContent from './translatedcontent';
import { useTranslation } from '../../../hooks/translation';

const AttendanceOptions: React.FC = () => {
  const { user } = useAuth();
  const { translation } = useTranslation();

  const translated = useMemo(() => {
    return translation === 'en-us'
      ? translatedContent.en_US
      : translatedContent.pt_BR;
  }, [translation]);

  return (
    <Container>
      <Content>
        <HighlightTitle
          title={`${user.name}, ${translated.title}`}
          subtitle={translated.subtitle}
        />

        <MenuContainer>
          <HighlightMenuCard
            link="/attendance/call"
            image={phonecallImg}
            title={translated.button_callme_title}
            subtitle={translated.button_callme_subtitle}
          />
          <HighlightMenuCard
            link="/attendance/mail"
            image={gmailImg}
            title={translated.button_sendmessage_title}
            subtitle={translated.button_sendmessage_subtitle}
          />
        </MenuContainer>

        <MessageText>
          &copy;
          {translated.message_title}
        </MessageText>
      </Content>
    </Container>
  );
};

export default AttendanceOptions;
