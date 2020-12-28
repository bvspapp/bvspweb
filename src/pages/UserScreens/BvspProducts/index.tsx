import React, { useMemo } from 'react';

import { useAuth } from '../../../hooks/auth';

import HighlightTitle from '../../../components/HighlightTitle';
import HighlightMenuCard from '../../../components/HighlightMenuCard';

import ImgBvspmachines from '../../../assets/bvspmachines.png';
import ImgBvsppartners from '../../../assets/bvsppartners.png';
import ImgConfigs from '../../../assets/configs.png';
import ImgMaintenance from '../../../assets/maintenance.png';

import translatedContent from './translatedcontent';
import { useTranslation } from '../../../hooks/translation';

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

const BvspProducts: React.FC = () => {
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
            link="/bvspmachines"
            image={ImgBvspmachines}
            title={translated.menu_bvsp_machines}
          />
          <HighlightMenuCard
            link="/departments/partsbymachine"
            image={ImgBvsppartners}
            title={translated.menu_parts_st_lines}
          />
          <HighlightMenuCard
            link="/specialsolutions"
            image={ImgConfigs}
            title={translated.menu_special_solutions}
          />

          <HighlightMenuCard
            link="/bvspservices"
            image={ImgMaintenance}
            title={translated.menu_services}
          />
        </MenuContainer>
      </Content>
    </Container>
  );
};

export default BvspProducts;
