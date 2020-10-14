import React, { useMemo } from 'react';

import { useAuth } from '../../../../hooks/auth';

import HighlightTitle from '../../../../components/HighlightTitle';
import HighlightMenuCard from '../../../../components/HighlightMenuCard';

import listImg from '../../../../assets/list.png';

import {
  Container,
  Header,
  UserContainer,
  UserInfo,
  User,
  Welcome,
  UserName,
  Message,
  Content,
  MenuContainer,
} from './styles';

import translatedContent from './translatedcontent';
import { useTranslation } from '../../../../hooks/translation';

const TipsAndNews: React.FC = () => {
  const { user } = useAuth();
  const { translation } = useTranslation();

  const translated = useMemo(() => {
    return translation === 'en-us'
      ? translatedContent.en_US
      : translatedContent.pt_BR;
  }, [translation]);

  return (
    <Container>
      <Header>
        <UserContainer>
          <UserInfo>
            <User>
              <Welcome>{translated.greet}</Welcome>
              <UserName>{user.name}</UserName>
            </User>
            <Message>{translated.welcome}</Message>
          </UserInfo>
        </UserContainer>
      </Header>

      <Content>
        <HighlightTitle
          title={translated.title}
          subtitle={translated.subtitle}
        />

        <MenuContainer>
          <HighlightMenuCard
            link="/bvspproducts"
            image={listImg}
            title={translated.menu_checklist_label}
            inative={false}
          />
        </MenuContainer>
      </Content>
    </Container>
  );
};

export default TipsAndNews;
