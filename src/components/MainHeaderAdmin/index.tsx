import React from 'react';
import { FaPowerOff, FaHome } from 'react-icons/fa';

import { useAuth } from '../../hooks/auth';

import logoImg from '../../assets/logo.png';

import {
  Container,
  LogoImg,
  NavMenu,
  NavMenuItemLink,
  NavMenuItemButton,
  Divider,
} from './styles';

const MainHeaderAdmin: React.FC = () => {
  const { signOut } = useAuth();

  return (
    <Container>
      <LogoImg src={logoImg} alt="BVSP Parts" />

      <NavMenu>
        <NavMenuItemLink to="/" title="Voltar ao Início">
          <FaHome />
        </NavMenuItemLink>
        <Divider />
        <NavMenuItemButton onClick={signOut} title="Sair e Desconectar">
          <FaPowerOff />
        </NavMenuItemButton>
      </NavMenu>
    </Container>
  );
};

export default MainHeaderAdmin;
