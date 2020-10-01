import React from 'react';

import { FaHome, FaUser, FaPhoneAlt } from 'react-icons/fa';
import { TiWorld } from 'react-icons/ti';
import { GiExitDoor } from 'react-icons/gi';

import logoImg from '../../assets/logo.png';

import { useAuth } from '../../hooks/auth';

import {
  Container,
  LogoContainer,
  Logo,
  MenuContainer,
  Menu,
  Logout,
} from './styles';

const FloatMenuUser: React.FC = () => {
  const { signOut } = useAuth();

  return (
    <Container>
      <LogoContainer>
        <Logo src={logoImg} alt="Logo" />
      </LogoContainer>

      <MenuContainer>
        <Menu to="/">
          <FaHome />
          Início
        </Menu>

        <Menu to="#">
          <TiWorld />
          Institucional
        </Menu>

        <Menu to="/profile">
          <FaUser />
          Perfil
        </Menu>

        <Menu to="#">
          <FaPhoneAlt />
          Contato
        </Menu>
      </MenuContainer>

      <Logout type="button" onClick={signOut} title="Sair e Desconectar">
        <GiExitDoor />
        Sair
      </Logout>
    </Container>
  );
};

export default FloatMenuUser;
