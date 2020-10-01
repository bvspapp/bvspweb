import React from 'react';

import { useAuth } from '../../../hooks/auth';

import HighlightTitle from '../../../components/HighlightTitle';
import HighlightMenuCard from '../../../components/HighlightMenuCard';

import ImgBvspmachines from '../../../assets/bvspmachines.png';
import ImgBvsppartners from '../../../assets/bvsppartners.png';
import ImgConfigs from '../../../assets/configs.png';
import ImgMaintenance from '../../../assets/maintenance.png';

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

  return (
    <Container>
      <Header>
        <UserContainer>
          <UserInfo>
            <User>
              <Welcome>Olá,</Welcome>
              <UserName>{user.name}</UserName>
            </User>
            <Message>Bem-vindo a BVSP. É bom ter você aqui!</Message>
          </UserInfo>
        </UserContainer>
      </Header>

      <Content>
        <HighlightTitle
          title="Nossos Produtos"
          subtitle="Portfólio de equipamentos, peças de reposição e soluções especiais"
        />

        <MenuContainer>
          <HighlightMenuCard
            link="/bvspmachines"
            image={ImgBvspmachines}
            title="Máquinas BVSP"
          />
          <HighlightMenuCard
            link="/departments/equipaments"
            image={ImgBvsppartners}
            title="Peças Linhas ST"
          />
          <HighlightMenuCard
            link="/specialsolutions"
            image={ImgConfigs}
            title="Soluções Especiais"
          />

          <HighlightMenuCard
            link="/bvspservices"
            image={ImgMaintenance}
            title="Serviços"
          />
        </MenuContainer>
      </Content>
    </Container>
  );
};

export default BvspProducts;
