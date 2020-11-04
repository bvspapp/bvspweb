import React, { useCallback } from 'react';
import { FaPowerOff, FaHome } from 'react-icons/fa';
import { useHistory } from 'react-router-dom';
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
  const history = useHistory();

  const handleSignOut = useCallback(() => {
    signOut();
    history.push('/');
  }, [history, signOut]);

  return (
    <Container>
      <LogoImg src={logoImg} alt="BVSP Parts" />

      <NavMenu>
        <NavMenuItemLink to="/" title="Voltar ao Início">
          <FaHome />
        </NavMenuItemLink>
        <Divider />
        <NavMenuItemButton onClick={handleSignOut} title="Sair e Desconectar">
          <FaPowerOff />
        </NavMenuItemButton>
      </NavMenu>
    </Container>
  );
};

export default MainHeaderAdmin;
