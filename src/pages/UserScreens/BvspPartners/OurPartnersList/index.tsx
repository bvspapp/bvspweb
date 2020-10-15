import React, { useMemo } from 'react';

import { FaArrowRight } from 'react-icons/fa';
import { useAuth } from '../../../../hooks/auth';

import HighlightTitle from '../../../../components/HighlightTitle';

import tsubakilogoImg from '../../../../assets/tsubakilogo.png';
import foodmatelogoImg from '../../../../assets/foodmatelogo.png';
import metalogoImg from '../../../../assets/metalogo.png';

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
  PartnerButton,
  PartnerImage,
  PartnerArrowBox,
} from './styles';

import translatedContent from './translatedcontent';
import { useTranslation } from '../../../../hooks/translation';

const OurPartnersList: React.FC = () => {
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
          <PartnerButton to="/metasolutions">
            <PartnerImage src={metalogoImg} />
            <PartnerArrowBox>
              <FaArrowRight />
            </PartnerArrowBox>
          </PartnerButton>

          {user.currentCountryCode === 'BR' && (
            <PartnerButton to="/foodmate">
              <PartnerImage src={foodmatelogoImg} />
              <PartnerArrowBox>
                <FaArrowRight />
              </PartnerArrowBox>
            </PartnerButton>
          )}

          <PartnerButton to="">
            <PartnerImage src={tsubakilogoImg} />
            <PartnerArrowBox>
              <FaArrowRight />
            </PartnerArrowBox>
          </PartnerButton>
        </MenuContainer>
      </Content>
    </Container>
  );
};

export default OurPartnersList;
