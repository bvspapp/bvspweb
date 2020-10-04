import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import { FaHome, FaUser, FaPhoneAlt, FaMobile } from 'react-icons/fa';
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
  const history = useHistory();

  const handleSignOut = useCallback(() => {
    signOut();
    history.push('/');
  }, [history, signOut]);

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

        <Menu to="/institutional">
          <TiWorld />
          Institucional
        </Menu>

        <Menu to="/profile">
          <FaUser />
          Perfil
        </Menu>

        <Menu to="/contact">
          <FaPhoneAlt />
          Contato
        </Menu>
      </MenuContainer>

      <Logout type="button" onClick={handleSignOut} title="Sair e Desconectar">
        <GiExitDoor />
        Sair
      </Logout>
    </Container>
  );
};

export default FloatMenuUser;
