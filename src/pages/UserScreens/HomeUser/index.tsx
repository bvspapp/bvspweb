import React, { useMemo } from 'react';

import { useAuth } from '../../../hooks/auth';

import HighlightTitle from '../../../components/HighlightTitle';
import HighlightMenuCard from '../../../components/HighlightMenuCard';

import ImgManufacturing from '../../../assets/manufacturing.png';
import ImgPartner from '../../../assets/partner.png';
import ImgToolbox from '../../../assets/toolbox.png';

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
  MessageText,
} from './styles';

import translatedContent from './translatedcontent';
import { useTranslation } from '../../../hooks/translation';

const HomeUser: React.FC = () => {
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
            image={ImgManufacturing}
            title={translated.button_our_products_title}
            subtitle={translated.button_our_products_subtitle}
          />
          <HighlightMenuCard
            link="/ourpartners"
            image={ImgPartner}
            title={translated.button_our_patterns_title}
            subtitle={translated.button_our_patterns_subtitle}
          />
          <HighlightMenuCard
            link="/bvsptoolslist"
            image={ImgToolbox}
            title={translated.button_our_tools_title}
            subtitle={translated.button_our_tools_subtitle}
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

export default HomeUser;
