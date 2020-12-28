import React, { useMemo } from 'react';

import { MdHistory } from 'react-icons/md';
import { useAuth } from '../../../../hooks/auth';

import HighlightTitle from '../../../../components/HighlightTitle';
import HighlightMenuCard from '../../../../components/HighlightMenuCard';

import partsMachineImg from '../../../../assets/parts_machine.png';
import suggestionsImg from '../../../../assets/suggestions.png';
import clientsupportImg from '../../../../assets/clientsupport.png';

import { Container, Content, MenuContainer, MyRequestsButton } from './styles';

import translatedContent from './translatedcontent';
import { useTranslation } from '../../../../hooks/translation';

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
          title={`${user.name.split(' ')[0]}, ${translated.title}`}
          subtitle={translated.subtitle}
        />

        <MenuContainer>
          <HighlightMenuCard
            link="/contacts-options/3"
            image={clientsupportImg}
            title={translated.menu_service_title}
            subtitle={translated.menu_service_subtitle}
          />
          <HighlightMenuCard
            link="/contacts-options/3"
            image={partsMachineImg}
            title={translated.menu_parts_title}
            subtitle={translated.menu_parts_subtitle}
          />
          <HighlightMenuCard
            link="/attendance/mail/2"
            image={suggestionsImg}
            title={translated.menu_complaint_title}
            subtitle={translated.menu_complaint_subtitle}
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

export default AttendanceOptions;
