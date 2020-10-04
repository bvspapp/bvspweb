import React from 'react';

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

const HomeUser: React.FC = () => {
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
          title="Menu principal"
          subtitle="Navegue pelo nosso app e descubra as soluções que temos para você"
        />

        <MenuContainer>
          <HighlightMenuCard
            link="/bvspproducts"
            image={ImgManufacturing}
            title="Nossos produtos"
            subtitle="Portfólio de equipamentos, peças de reposição e soluções especiais"
            inative={false}
          />
          <HighlightMenuCard
            link="#"
            image={ImgPartner}
            title="Nossos parceiros"
            subtitle="Tecnologia aplicada e serviços"
            inative
          />
          <HighlightMenuCard
            link="#"
            image={ImgToolbox}
            title="Nossas ferramentas"
            subtitle="Informações, cálculos e tabelas"
            inative
          />
        </MenuContainer>

        <MessageText>
          Em breve, você também poderá acessar
          <strong>Nossos parceiros e ferramentas</strong>
.
</MessageText>
      </Content>
    </Container>
  );
};

export default HomeUser;
