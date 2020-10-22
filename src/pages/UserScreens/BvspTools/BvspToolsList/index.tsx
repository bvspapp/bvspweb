import React, { useMemo } from 'react';

import { useAuth } from '../../../../hooks/auth';

import HighlightTitle from '../../../../components/HighlightTitle';
import HighlightMenuCard from '../../../../components/HighlightMenuCard';

import ImgCalc from '../../../../assets/calc.png';
import ImgTolerance from '../../../../assets/tolerance.png';
import ImgPaper from '../../../../assets/paper.png';

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

const BvspToolsList: React.FC = () => {
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
            link="/hardnessconverter"
            image={ImgCalc}
            title={translated.menu_hardness_converter_label}
          />

          <HighlightMenuCard
            link="/toleranceconverter"
            image={ImgTolerance}
            title={translated.menu_fitting_tolerance_label}
          />

          <HighlightMenuCard
            link="/unitconverter"
            image={ImgPaper}
            title={translated.menu_unitconverter_label}
          />
        </MenuContainer>
      </Content>
    </Container>
  );
};

export default BvspToolsList;